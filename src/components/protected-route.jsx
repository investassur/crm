"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  children, 
  requiredModule, 
  requiredPermission = 'read',
  fallbackComponent = null 
}) {
  const { data: user, loading: userLoading } = useUser();
  const [permissions, setPermissions] = React.useState(null);
  const [permissionsLoading, setPermissionsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        setPermissionsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Permission check failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setPermissions(data.permissions || {});
      } catch (err) {
        console.error('Error checking permissions:', err);
        setError(err.message);
      } finally {
        setPermissionsLoading(false);
      }
    };

    checkPermissions();
  }, [user]);

  const hasPermission = (module, permission) => {
    if (!permissions || !module) return false;
    
    const modulePermissions = permissions[module];
    if (!modulePermissions) return false;

    if (Array.isArray(modulePermissions)) {
      return modulePermissions.includes(permission);
    }

    if (typeof modulePermissions === 'object') {
      return modulePermissions[permission] === true;
    }

    return false;
  };

  if (userLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = `/account/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <i className="fas fa-sign-in-alt text-4xl text-gray-400 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentification requise</h2>
          <p className="text-gray-600 mb-4">Vous devez vous connecter pour accéder à cette page.</p>
          <a 
            href={`/account/signin?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de vérification</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (requiredModule && !hasPermission(requiredModule, requiredPermission)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center max-w-md">
          <i className="fas fa-lock text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-2">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <div className="bg-gray-100 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Module requis:</strong> {requiredModule}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Permission requise:</strong> {requiredPermission}
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function StoryComponent() {
  const mockUser = {
    id: '123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  return (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">État de chargement</h3>
        <div className="border rounded-lg p-4">
          <MainComponent requiredModule="prospects" requiredPermission="read">
            <div className="p-4 bg-green-100 text-green-800 rounded">
              Contenu protégé accessible
            </div>
          </MainComponent>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Utilisateur non authentifié</h3>
        <div className="border rounded-lg p-4">
          <MainComponent requiredModule="campaigns" requiredPermission="write">
            <div className="p-4 bg-green-100 text-green-800 rounded">
              Contenu protégé pour les campagnes
            </div>
          </MainComponent>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Permissions insuffisantes</h3>
        <div className="border rounded-lg p-4">
          <MainComponent requiredModule="admin" requiredPermission="delete">
            <div className="p-4 bg-green-100 text-green-800 rounded">
              Contenu admin sensible
            </div>
          </MainComponent>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Avec composant de fallback personnalisé</h3>
        <div className="border rounded-lg p-4">
          <MainComponent 
            requiredModule="reports" 
            requiredPermission="admin"
            fallbackComponent={
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                <i className="fas fa-info-circle mr-2"></i>
                Accès limité - Contactez votre administrateur pour obtenir les permissions nécessaires.
              </div>
            }
          >
            <div className="p-4 bg-green-100 text-green-800 rounded">
              Rapports administrateur
            </div>
          </MainComponent>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sans restriction de module</h3>
        <div className="border rounded-lg p-4">
          <MainComponent>
            <div className="p-4 bg-blue-100 text-blue-800 rounded">
              <i className="fas fa-check-circle mr-2"></i>
              Contenu accessible à tous les utilisateurs authentifiés
            </div>
          </MainComponent>
        </div>
      </div>
    </div>
  );
});
}