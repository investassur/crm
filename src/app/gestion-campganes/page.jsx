"use client";
import React from "react";

function MainComponent() {
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [filters, setFilters] = React.useState({
    type: "",
    status: "",
    search: "",
  });

  // États pour le formulaire modal
  const [showCampaignForm, setShowCampaignForm] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState(null);
  const [campaignForm, setCampaignForm] = React.useState({
    name: "",
    type: "email",
    status: "draft",
    target_audience: "",
    start_date: "",
    end_date: "",
    budget: "",
    description: "",
    content: "",
  });

  // Statistiques
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    completed: 0,
    conversion_rate: 0,
  });

  const itemsPerPage = 10;

  // Charger les campagnes
  React.useEffect(() => {
    loadCampaigns();
  }, [currentPage, filters]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      // Simulation d'appel API - à remplacer par un vrai appel
      const mockCampaigns = [
        {
          id: 1,
          name: "Campagne Assurance Auto Q1",
          type: "email",
          status: "active",
          target_audience: "Prospects 25-45 ans",
          start_date: "2025-01-01",
          end_date: "2025-03-31",
          budget: 5000,
          sent: 1250,
          opened: 875,
          clicked: 156,
          converted: 23,
          created_at: "2024-12-15T10:00:00Z",
        },
        {
          id: 2,
          name: "SMS Rappel Renouvellement",
          type: "sms",
          status: "completed",
          target_audience: "Clients existants",
          start_date: "2024-12-01",
          end_date: "2024-12-31",
          budget: 800,
          sent: 2100,
          opened: 1890,
          clicked: 420,
          converted: 67,
          created_at: "2024-11-25T14:30:00Z",
        },
        {
          id: 3,
          name: "Courrier Assurance Habitation",
          type: "courrier",
          status: "draft",
          target_audience: "Propriétaires 35-65 ans",
          start_date: "2025-02-01",
          end_date: "2025-04-30",
          budget: 3200,
          sent: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          created_at: "2024-12-20T09:15:00Z",
        },
      ];

      // Filtrer les campagnes
      let filteredCampaigns = mockCampaigns;

      if (filters.type) {
        filteredCampaigns = filteredCampaigns.filter(
          (c) => c.type === filters.type
        );
      }

      if (filters.status) {
        filteredCampaigns = filteredCampaigns.filter(
          (c) => c.status === filters.status
        );
      }

      if (filters.search) {
        filteredCampaigns = filteredCampaigns.filter(
          (c) =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.target_audience
              .toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

      setCampaigns(paginatedCampaigns);
      setTotalPages(Math.ceil(filteredCampaigns.length / itemsPerPage));

      // Calculer les statistiques
      const totalCampaigns = mockCampaigns.length;
      const activeCampaigns = mockCampaigns.filter(
        (c) => c.status === "active"
      ).length;
      const completedCampaigns = mockCampaigns.filter(
        (c) => c.status === "completed"
      ).length;
      const totalConverted = mockCampaigns.reduce(
        (sum, c) => sum + c.converted,
        0
      );
      const totalSent = mockCampaigns.reduce((sum, c) => sum + c.sent, 0);
      const conversionRate =
        totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

      setStats({
        total: totalCampaigns,
        active: activeCampaigns,
        completed: completedCampaigns,
        conversion_rate: conversionRate,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des campagnes:", error);
      setError("Impossible de charger les campagnes");
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulation de sauvegarde - à remplacer par un vrai appel API
      console.log("Sauvegarde campagne:", campaignForm);

      // Recharger les campagnes
      await loadCampaigns();

      // Réinitialiser le formulaire
      setCampaignForm({
        name: "",
        type: "email",
        status: "draft",
        target_audience: "",
        start_date: "",
        end_date: "",
        budget: "",
        description: "",
        content: "",
      });
      setShowCampaignForm(false);
      setEditingCampaign(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name || "",
      type: campaign.type || "email",
      status: campaign.status || "draft",
      target_audience: campaign.target_audience || "",
      start_date: campaign.start_date || "",
      end_date: campaign.end_date || "",
      budget: campaign.budget || "",
      description: campaign.description || "",
      content: campaign.content || "",
    });
    setShowCampaignForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const icons = {
      email: "fas fa-envelope",
      sms: "fas fa-sms",
      courrier: "fas fa-mail-bulk",
    };
    return icons[type] || "fas fa-bullhorn";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 font-inter">
                AssurCRM
              </h1>
              <span className="ml-2 text-sm text-gray-500 font-inter">
                CRM pour courtiers en assurance
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-bell"></i>
              </button>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium font-inter">
                  A
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/"
              className="flex items-center px-3 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-inter"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Tableau de bord
            </a>
            <a
              href="/"
              className="flex items-center px-3 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-inter"
            >
              <i className="fas fa-users mr-2"></i>
              Prospects
            </a>
            <button className="flex items-center px-3 py-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600 font-inter">
              <i className="fas fa-bullhorn mr-2"></i>
              Campagnes
            </button>
            <a
              href="/"
              className="flex items-center px-3 py-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-inter"
            >
              <i className="fas fa-tasks mr-2"></i>
              Tâches
            </a>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-inter">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-inter">
            Gestion des campagnes
          </h2>
          <button
            onClick={() => setShowCampaignForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-inter"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvelle campagne
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-bullhorn text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-inter">
                  Total Campagnes
                </p>
                <p className="text-2xl font-bold text-gray-900 font-inter">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-play-circle text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-inter">
                  Actives
                </p>
                <p className="text-2xl font-bold text-gray-900 font-inter">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-check-circle text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-inter">
                  Terminées
                </p>
                <p className="text-2xl font-bold text-gray-900 font-inter">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-percentage text-yellow-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-inter">
                  Taux conversion
                </p>
                <p className="text-2xl font-bold text-gray-900 font-inter">
                  {stats.conversion_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Nom de campagne, audience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              >
                <option value="">Tous les types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="courrier">Courrier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              >
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="active">Active</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ type: "", status: "", search: "" });
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-inter"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des campagnes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Campagne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-inter">
                      {campaign.name}
                    </div>
                    <div className="text-sm text-gray-500 font-inter">
                      Créée le {formatDate(campaign.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i
                        className={`${getTypeIcon(
                          campaign.type
                        )} text-gray-400 mr-2`}
                      ></i>
                      <span className="text-sm text-gray-900 font-inter capitalize">
                        {campaign.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full font-inter ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                    {campaign.target_audience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                    <div>{formatDate(campaign.start_date)}</div>
                    <div className="text-gray-500">
                      au {formatDate(campaign.end_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-inter">
                      {campaign.sent > 0 && (
                        <>
                          <div>Envoyés: {campaign.sent.toLocaleString()}</div>
                          <div>Convertis: {campaign.converted}</div>
                          <div className="text-green-600">
                            {campaign.sent > 0
                              ? (
                                  (campaign.converted / campaign.sent) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </div>
                        </>
                      )}
                      {campaign.sent === 0 && (
                        <span className="text-gray-500">Pas encore lancée</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditCampaign(campaign)}
                      className="text-blue-600 hover:text-blue-900 mr-3 font-inter"
                    >
                      Modifier
                    </button>
                    <button className="text-green-600 hover:text-green-900 font-inter">
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {campaigns.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-inter">
                Aucune campagne trouvée
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 font-inter">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                Précédent
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal formulaire campagne */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 font-inter">
                {editingCampaign ? "Modifier la campagne" : "Nouvelle campagne"}
              </h3>
            </div>

            <form onSubmit={handleCampaignSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Nom de la campagne *
                  </label>
                  <input
                    type="text"
                    value={campaignForm.name}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Type de campagne *
                  </label>
                  <select
                    value={campaignForm.type}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    required
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="courrier">Courrier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Statut
                  </label>
                  <select
                    value={campaignForm.status}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Active</option>
                    <option value="paused">En pause</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Budget (€)
                  </label>
                  <input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        budget: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Audience cible *
                </label>
                <input
                  type="text"
                  value={campaignForm.target_audience}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      target_audience: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                  placeholder="Ex: Prospects 25-45 ans, Clients existants..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={campaignForm.start_date}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    value={campaignForm.end_date}
                    onChange={(e) =>
                      setCampaignForm({
                        ...campaignForm,
                        end_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Description
                </label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                  placeholder="Description de la campagne..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Contenu de la campagne
                </label>
                <textarea
                  value={campaignForm.content}
                  onChange={(e) =>
                    setCampaignForm({
                      ...campaignForm,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
                  placeholder="Contenu du message, email, SMS ou courrier..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCampaignForm(false);
                    setEditingCampaign(null);
                    setCampaignForm({
                      name: "",
                      type: "email",
                      status: "draft",
                      target_audience: "",
                      start_date: "",
                      end_date: "",
                      budget: "",
                      description: "",
                      content: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-inter"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-inter"
                >
                  {loading
                    ? "Sauvegarde..."
                    : editingCampaign
                    ? "Modifier"
                    : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;