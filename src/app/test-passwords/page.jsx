"use client";
import React from "react";

function MainComponent() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const generatePasswords = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/generate-passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users || []);
      setSuccess(
        `${data.users?.length || 0} mots de passe générés avec succès`
      );
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text, type = "mot de passe") => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${type} copié dans le presse-papiers`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError("Erreur lors de la copie");
    }
  };

  const exportAllCredentials = () => {
    const credentials = users
      .map((user) => `${user.email}:${user.password}`)
      .join("\n");
    const blob = new Blob([credentials], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `identifiants_premunia_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <i className="fas fa-key mr-3 text-blue-600"></i>
            Test Génération Mots de Passe - PREMUNIA
          </h1>
          <p className="text-gray-600">
            Interface de test pour générer et récupérer les mots de passe des
            utilisateurs
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
            <div>
              <h3 className="text-yellow-800 font-medium mb-1">
                ⚠️ Page de Test - Configuration Initiale PREMUNIA
              </h3>
              <p className="text-yellow-700 text-sm">
                Cette page affiche les mots de passe en clair. À utiliser
                uniquement pour la configuration initiale du système.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Génération des Mots de Passe pour l'Équipe PREMUNIA
                </h2>
                <p className="text-gray-600 text-sm">
                  Cliquez pour générer de nouveaux mots de passe pour tous les
                  utilisateurs actifs
                </p>
              </div>
              <div className="flex gap-3">
                {users.length > 0 && (
                  <button
                    onClick={exportAllCredentials}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Exporter Tout
                  </button>
                )}
                <button
                  onClick={generatePasswords}
                  disabled={generating}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generating ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key mr-2"></i>
                      Générer les Mots de Passe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <i className="fas fa-exclamation-circle text-red-600 mt-1 mr-3"></i>
              <div>
                <h3 className="text-red-800 font-medium mb-1">Erreur</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
              <div>
                <h3 className="text-green-800 font-medium mb-1">Succès</h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {users.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                🔐 Identifiants PREMUNIA - Équipe Complète ({users.length}{" "}
                utilisateurs)
              </h2>
              <p className="text-gray-600 text-sm">
                Informations de connexion pour tous les utilisateurs actifs - À
                distribuer de manière sécurisée
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      👤 Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📝 Nom Complet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🏷️ Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🏢 Département
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🔑 Mot de Passe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ⚡ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className="fas fa-envelope text-gray-400 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === "super_admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "commerciale"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "gestionnaire"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role === "super_admin"
                            ? "👑 Super Admin"
                            : user.role === "admin"
                            ? "🛡️ Admin"
                            : user.role === "commerciale"
                            ? "💼 Commercial"
                            : user.role === "gestionnaire"
                            ? "📊 Gestionnaire"
                            : user.role === "agent_qualite"
                            ? "✅ Qualité"
                            : user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.department || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded border text-gray-900 font-bold">
                            {user.password}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(user.email, "email")}
                            className="text-blue-600 hover:text-blue-800 text-sm p-1 rounded hover:bg-blue-50"
                            title="Copier l'email"
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(user.password, "mot de passe")
                            }
                            className="text-green-600 hover:text-green-800 text-sm p-1 rounded hover:bg-green-50"
                            title="Copier le mot de passe"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                `${user.email}:${user.password}`,
                                "identifiants"
                              )
                            }
                            className="text-purple-600 hover:text-purple-800 text-sm p-1 rounded hover:bg-purple-50"
                            title="Copier email:password"
                          >
                            <i className="fas fa-user-lock"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <i className="fas fa-info-circle mr-2"></i>
                  Total: {users.length} comptes utilisateurs configurés pour
                  PREMUNIA
                </div>
                <div className="text-sm text-gray-500">
                  Généré le {new Date().toLocaleDateString("fr-FR")} à{" "}
                  {new Date().toLocaleTimeString("fr-FR")}
                </div>
              </div>
            </div>
          </div>
        )}

        {users.length === 0 && !generating && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <i className="fas fa-key text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun mot de passe généré
            </h3>
            <p className="text-gray-500">
              Cliquez sur le bouton "Générer les Mots de Passe" pour commencer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;