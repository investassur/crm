"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const initializeDatabase = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/init-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-database mr-3 text-blue-600"></i>
            Initialisation Base de Données PREMUNIA
          </h1>
          <p className="text-gray-600">
            Configuration initiale de la base de données Neon PostgreSQL
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-server text-white text-2xl"></i>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Prêt à initialiser la base de données
            </h2>
            
            <p className="text-gray-600 mb-6">
              Cette opération va créer toutes les tables nécessaires et insérer les données de base.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="text-blue-800 font-medium mb-2">
                <i className="fas fa-info-circle mr-2"></i>
                Ce qui sera créé :
              </h3>
              <ul className="text-blue-700 text-sm space-y-1 text-left">
                <li>• Tables: users, prospects, contracts, tasks, campaigns</li>
                <li>• Tables: email_templates, workflows, role_permissions</li>
                <li>• Permissions par défaut pour tous les rôles</li>
                <li>• Utilisateur admin: admin@premunia.fr</li>
                <li>• Mot de passe par défaut: PREMUNIA2024!</li>
              </ul>
            </div>

            <button
              onClick={initializeDatabase}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Initialisation en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <i className="fas fa-rocket mr-3"></i>
                  Initialiser la Base de Données
                </div>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <i className="fas fa-exclamation-circle text-red-600 mt-1 mr-3"></i>
              <div>
                <h3 className="text-red-800 font-medium mb-2">
                  Erreur lors de l'initialisation
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-white text-2xl"></i>
              </div>
              <h3 className="text-green-800 font-bold text-xl mb-2">
                Base de données initialisée avec succès !
              </h3>
              <p className="text-green-700 mb-4">{result.message}</p>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="text-green-800 font-medium mb-2">
                  Informations de connexion admin :
                </h4>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> admin@premunia.fr</p>
                  <p><strong>Mot de passe:</strong> PREMUNIA2024!</p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  <i className="fas fa-home mr-2"></i>
                  Aller au Dashboard
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            <i className="fas fa-shield-alt mr-1"></i>
            Connexion sécurisée à Neon PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;