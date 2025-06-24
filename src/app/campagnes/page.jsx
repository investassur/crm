"use client";
import React from "react";

function MainComponent() {
  const [campaigns, setCampaigns] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: "",
    type: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    completed: 0,
    draft: 0,
  });

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    campaign_type: "email",
    status: "brouillon",
    start_date: "",
    end_date: "",
    target_audience: "",
    budget: "",
    objective: "",
  });

  const campaignTypes = [
    { value: "email", label: "Email", icon: "fas fa-envelope" },
    { value: "sms", label: "SMS", icon: "fas fa-sms" },
    { value: "telephone", label: "Téléphone", icon: "fas fa-phone" },
    { value: "social", label: "Réseaux Sociaux", icon: "fab fa-facebook" },
    { value: "display", label: "Display", icon: "fas fa-ad" },
  ];

  const statusOptions = [
    { value: "brouillon", label: "Brouillon", color: "gray" },
    { value: "active", label: "Active", color: "green" },
    { value: "terminee", label: "Terminée", color: "blue" },
    { value: "suspendue", label: "Suspendue", color: "red" },
  ];

  React.useEffect(() => {
    loadCampaigns();
  }, [filters, currentPage]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const mockCampaigns = [
        {
          id: "1",
          name: "Campagne Assurance Auto Q1",
          description:
            "Promotion spéciale assurance automobile pour le premier trimestre",
          campaign_type: "email",
          status: "active",
          start_date: "2025-01-01",
          end_date: "2025-03-31",
          target_audience: "Prospects 25-45 ans",
          budget: 15000,
          created_at: "2025-01-01T10:00:00Z",
          performance: {
            sent: 2500,
            opened: 875,
            clicked: 156,
            converted: 23,
          },
        },
        {
          id: "2",
          name: "SMS Rappel Renouvellement",
          description:
            "Rappels automatiques pour les renouvellements de contrats",
          campaign_type: "sms",
          status: "active",
          start_date: "2025-01-15",
          end_date: "2025-12-31",
          target_audience: "Clients existants",
          budget: 5000,
          created_at: "2025-01-15T09:00:00Z",
          performance: {
            sent: 1200,
            opened: 1080,
            clicked: 240,
            converted: 45,
          },
        },
        {
          id: "3",
          name: "Campagne Assurance Vie",
          description: "Nouvelle gamme de produits assurance vie",
          campaign_type: "telephone",
          status: "brouillon",
          start_date: "2025-02-01",
          end_date: "2025-04-30",
          target_audience: "Prospects 35-55 ans",
          budget: 25000,
          created_at: "2025-01-20T14:00:00Z",
          performance: {
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
          },
        },
      ];

      const filteredCampaigns = mockCampaigns.filter((campaign) => {
        const matchesStatus =
          !filters.status || campaign.status === filters.status;
        const matchesType =
          !filters.type || campaign.campaign_type === filters.type;
        const matchesSearch =
          !filters.search ||
          campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          campaign.description
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        return matchesStatus && matchesType && matchesSearch;
      });

      setCampaigns(filteredCampaigns);

      setStats({
        total: mockCampaigns.length,
        active: mockCampaigns.filter((c) => c.status === "active").length,
        completed: mockCampaigns.filter((c) => c.status === "terminee").length,
        draft: mockCampaigns.filter((c) => c.status === "brouillon").length,
      });
    } catch (error) {
      console.error("Error loading campaigns:", error);
      setError("Erreur lors du chargement des campagnes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        setCampaigns(
          campaigns.map((c) =>
            c.id === editingCampaign.id
              ? { ...c, ...formData, updated_at: new Date().toISOString() }
              : c
          )
        );
      } else {
        const newCampaign = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          performance: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        };
        setCampaigns([newCampaign, ...campaigns]);
      }

      setShowModal(false);
      setEditingCampaign(null);
      setFormData({
        name: "",
        description: "",
        campaign_type: "email",
        status: "brouillon",
        start_date: "",
        end_date: "",
        target_audience: "",
        budget: "",
        objective: "",
      });
    } catch (error) {
      console.error("Error saving campaign:", error);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      campaign_type: campaign.campaign_type,
      status: campaign.status,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      target_audience: campaign.target_audience,
      budget: campaign.budget?.toString() || "",
      objective: campaign.objective || "",
    });
    setShowModal(true);
  };

  const handleDelete = (campaignId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette campagne ?")) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignId));
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    return statusConfig?.color || "gray";
  };

  const getTypeIcon = (type) => {
    const typeConfig = campaignTypes.find((t) => t.value === type);
    return typeConfig?.icon || "fas fa-bullhorn";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const calculateROI = (performance, budget) => {
    if (!budget || budget === 0) return 0;
    const revenue = performance.converted * 500;
    return (((revenue - budget) / budget) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                <i className="fas fa-bullhorn mr-3"></i>
                Gestion des Campagnes
              </h1>
              <p className="text-gray-600">
                Créez et gérez vos campagnes marketing multi-canaux
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle Campagne
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-xl">
                <i className="fas fa-chart-bar text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <i className="fas fa-play-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Terminées</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <i className="fas fa-check-circle text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Brouillons</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl">
                <i className="fas fa-edit text-gray-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Rechercher une campagne..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  {campaignTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Chargement...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                <p className="text-red-600">{error}</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-bullhorn text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500 text-lg mb-2">
                  Aucune campagne trouvée
                </p>
                <p className="text-gray-400">
                  Créez votre première campagne pour commencer
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campagne
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {campaign.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {campaign.start_date} - {campaign.end_date}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <i
                            className={`${getTypeIcon(
                              campaign.campaign_type
                            )} text-purple-600 mr-2`}
                          ></i>
                          <span className="text-sm text-gray-900 capitalize">
                            {
                              campaignTypes.find(
                                (t) => t.value === campaign.campaign_type
                              )?.label
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
                            campaign.status
                          )}-100 text-${getStatusColor(campaign.status)}-800`}
                        >
                          {
                            statusOptions.find(
                              (s) => s.value === campaign.status
                            )?.label
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {campaign.budget
                          ? formatCurrency(campaign.budget)
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          <div>
                            Envoyés:{" "}
                            <span className="font-medium">
                              {campaign.performance.sent}
                            </span>
                          </div>
                          <div>
                            Ouverts:{" "}
                            <span className="font-medium">
                              {campaign.performance.opened}
                            </span>
                          </div>
                          <div>
                            Clics:{" "}
                            <span className="font-medium">
                              {campaign.performance.clicked}
                            </span>
                          </div>
                          <div>
                            Conversions:{" "}
                            <span className="font-medium text-green-600">
                              {campaign.performance.converted}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            parseFloat(
                              calculateROI(
                                campaign.performance,
                                campaign.budget
                              )
                            ) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {calculateROI(campaign.performance, campaign.budget)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(campaign)}
                            className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                            title="Modifier"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCampaign
                      ? "Modifier la campagne"
                      : "Nouvelle campagne"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCampaign(null);
                      setFormData({
                        name: "",
                        description: "",
                        campaign_type: "email",
                        status: "brouillon",
                        start_date: "",
                        end_date: "",
                        target_audience: "",
                        budget: "",
                        objective: "",
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la campagne *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Campagne Assurance Auto Q1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de campagne
                    </label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          campaign_type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {campaignTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Décrivez votre campagne..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience cible
                  </label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_audience: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Prospects 25-45 ans, région Île-de-France"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCampaign(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {editingCampaign ? "Mettre à jour" : "Créer la campagne"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;