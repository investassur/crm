"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  currentPath = '/',
  isCollapsed = false,
  onToggleCollapse = () => {},
  className = ''
}) {
  const { data: user, loading: userLoading } = useUser();
  const { signOut } = useAuth();
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

  const hasPermission = (module, permission = 'read') => {
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

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/dashboard',
      module: 'dashboard',
      permission: 'read'
    },
    {
      label: 'Prospects',
      icon: 'fas fa-users',
      path: '/prospects',
      module: 'prospects',
      permission: 'read'
    },
    {
      label: 'Campagnes',
      icon: 'fas fa-bullhorn',
      path: '/campaigns',
      module: 'campaigns',
      permission: 'read'
    },
    {
      label: 'Tâches',
      icon: 'fas fa-tasks',
      path: '/tasks',
      module: 'tasks',
      permission: 'read'
    },
    {
      label: 'Contrats',
      icon: 'fas fa-file-contract',
      path: '/contracts',
      module: 'contracts',
      permission: 'read'
    },
    {
      label: 'Rapports',
      icon: 'fas fa-chart-bar',
      path: '/reports',
      module: 'reports',
      permission: 'read'
    },
    {
      label: 'Templates',
      icon: 'fas fa-envelope-open-text',
      path: '/templates',
      module: 'templates',
      permission: 'read'
    },
    {
      label: 'Workflows',
      icon: 'fas fa-project-diagram',
      path: '/workflows',
      module: 'workflows',
      permission: 'read'
    },
    {
      label: 'Segmentation',
      icon: 'fas fa-layer-group',
      path: '/segmentation',
      module: 'segmentation',
      permission: 'read'
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    hasPermission(item.module, item.permission)
  );

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: '/account/signin',
        redirect: true
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (userLoading || permissionsLoading) {
    return (
      <div className={`bg-gradient-to-br from-purple-600 to-blue-600 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col ${className}`}>
        <div className="p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-purple-600 to-blue-600 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col font-inter ${className}`}>
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold">CRM Pro</h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <li key={index}>
                <a
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                    isActive ? 'bg-white/20 shadow-lg' : ''
                  }`}
                >
                  <i className={`${item.icon} ${isCollapsed ? 'text-center w-full' : 'mr-3'}`}></i>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {error && !isCollapsed && (
        <div className="p-4 mx-4 mb-4 bg-red-500/20 border border-red-400/30 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span className="text-sm">Erreur permissions</span>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-user"></i>
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1">
              <div className="font-medium text-sm truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-white/70 truncate">
                {user.email}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className={`w-full flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && (
            <span className="ml-3 text-sm">Déconnexion</span>
          )}
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState('/dashboard');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sidebar Navigation - État normal</h3>
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
          <MainComponent 
            currentPath="/prospects"
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
          <div className="flex-1 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contenu principal</h2>
            <p className="text-gray-600">
              Cette zone représente le contenu principal de l'application.
              La sidebar affiche uniquement les éléments de navigation auxquels l'utilisateur a accès.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sidebar Navigation - État réduit</h3>
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
          <MainComponent 
            currentPath="/campaigns"
            isCollapsed={true}
            onToggleCollapse={() => {}}
          />
          <div className="flex-1 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mode réduit</h2>
            <p className="text-gray-600">
              En mode réduit, seules les icônes sont visibles pour économiser l'espace.
              Le gradient purple/blue reste cohérent avec le design global.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sidebar Navigation - Interactive</h3>
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
          <MainComponent 
            currentPath={currentPath}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
          <div className="flex-1 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Version interactive</h2>
            <p className="text-gray-600 mb-4">
              Cliquez sur le bouton de réduction dans la sidebar pour tester l'interaction.
              Les animations de hover et les transitions sont visibles lors de l'utilisation.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => setCurrentPath('/dashboard')}
                className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Aller au Dashboard
              </button>
              <button 
                onClick={() => setCurrentPath('/prospects')}
                className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Aller aux Prospects
              </button>
              <button 
                onClick={() => setCurrentPath('/campaigns')}
                className="block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Aller aux Campagnes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
}