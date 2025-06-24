"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [showResults, setShowResults] = React.useState(false);

  const initializeAuth = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setShowResults(false);

    try {
      const response = await fetch("/api/init-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'initialisation: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copié dans le presse-papiers");
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  const exportResults = () => {
    if (!results || !results.accounts) return;

    const csvContent = [
      ["Email", "Nom", "Prénom", "Rôle", "Mot de passe"],
      ...results.accounts.map((account) => [
        account.email,
        account.lastName || "",
        account.firstName || "",
        account.role || "",
        account.password || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comptes_premunia_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PREMUNIA
              </h1>
              <p className="text-gray-600 mt-1">
                Initialisation du système d'authentification
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-users-cog text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Initialisation des Comptes Utilisateurs
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Cette opération va créer tous les comptes utilisateurs nécessaires
              pour PREMUNIA avec des mots de passe par défaut. Assurez-vous que
              cette action n'a pas déjà été effectuée.
            </p>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-amber-500 text-xl"></i>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">
                    Attention - Action Sensible
                  </h3>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>
                      • Cette opération va créer des comptes avec des mots de
                      passe par défaut
                    </p>
                    <p>
                      • Les utilisateurs devront changer leur mot de passe lors
                      de leur première connexion
                    </p>
                    <p>• Conservez précieusement les informations générées</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={initializeAuth}
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
                  Lancer l'Initialisation
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Erreur lors de l'initialisation
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {showResults && results && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Initialisation Réussie !
              </h3>
              <p className="text-gray-600">
                {results.accounts?.length || 0} comptes utilisateurs ont été
                créés avec succès
              </p>
            </div>

            {/* Export Actions */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={exportResults}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <i className="fas fa-download mr-2"></i>
                Exporter CSV
              </button>
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(results.accounts, null, 2))
                }
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <i className="fas fa-copy mr-2"></i>
                Copier JSON
              </button>
            </div>

            {/* Accounts List */}
            {results.accounts && results.accounts.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Comptes Créés ({results.accounts.length})
                </h4>
                <div className="grid gap-4">
                  {results.accounts.map((account, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Email
                          </label>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {account.email}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Nom Complet
                          </label>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {account.firstName} {account.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Rôle
                          </label>
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mt-1 ${
                              account.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : account.role === "manager"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {account.role}
                          </span>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Mot de passe
                          </label>
                          <div className="flex items-center mt-1">
                            <code className="text-sm font-mono bg-white px-3 py-1 rounded border text-gray-900 mr-2">
                              {account.password}
                            </code>
                            <button
                              onClick={() => copyToClipboard(account.password)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copier le mot de passe"
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-blue-500 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Prochaines Étapes
                  </h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      • Communiquez les identifiants aux utilisateurs de manière
                      sécurisée
                    </p>
                    <p>
                      • Demandez-leur de changer leur mot de passe lors de leur
                      première connexion
                    </p>
                    <p>• Conservez une copie sécurisée de ces informations</p>
                    <p>• Supprimez ce fichier après distribution des comptes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;