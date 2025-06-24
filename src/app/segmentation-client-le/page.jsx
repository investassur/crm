"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("segmentation");
  const [prospects, setProspects] = React.useState([]);
  const [filteredProspects, setFilteredProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // États pour les filtres
  const [filters, setFilters] = React.useState({
    contractType: "",
    status: "",
    ageRange: "",
    currentGuarantees: "",
    contractAnniversary: "",
    search: "",
  });

  // États pour la segmentation
  const [segments, setSegments] = React.useState([]);
  const [showSegmentForm, setShowSegmentForm] = React.useState(false);
  const [segmentForm, setSegmentForm] = React.useState({
    name: "",
    description: "",
    criteria: {},
  });

  // États pour les opportunités
  const [selectedProspects, setSelectedProspects] = React.useState([]);
  const [showOpportunities, setShowOpportunities] = React.useState(false);

  // Produits suggérés pour cross-selling
  const crossSellProducts = [
    {
      id: 1,
      name: "Assurance Obsèques",
      description: "Protection financière pour les frais d'obsèques",
      targetAge: "65+",
      icon: "fas fa-heart",
      color: "purple",
    },
    {
      id: 2,
      name: "Garanties Assistance",
      description: "Assistance à domicile et services d'urgence",
      targetAge: "60+",
      icon: "fas fa-hands-helping",
      color: "blue",
    },
    {
      id: 3,
      name: "Surcomplémentaire Optique",
      description: "Remboursements renforcés pour l'optique",
      targetAge: "50+",
      icon: "fas fa-eye",
      color: "indigo",
    },
    {
      id: 4,
      name: "Surcomplémentaire Dentaire",
      description: "Couverture étendue pour les soins dentaires",
      targetAge: "55+",
      icon: "fas fa-tooth",
      color: "purple",
    },
    {
      id: 5,
      name: "Surcomplémentaire Audition",
      description: "Prise en charge des appareils auditifs",
      targetAge: "60+",
      icon: "fas fa-deaf",
      color: "blue",
    },
    {
      id: 6,
      name: "Assurance Dépendance",
      description: "Protection en cas de perte d'autonomie",
      targetAge: "55+",
      icon: "fas fa-wheelchair",
      color: "indigo",
    },
    {
      id: 7,
      name: "Protection Juridique",
      description: "Assistance et défense juridique",
      targetAge: "50+",
      icon: "fas fa-gavel",
      color: "purple",
    },
  ];

  // Charger les prospects au démarrage
  React.useEffect(() => {
    loadProspects();
  }, []);

  // Filtrer les prospects quand les filtres changent
  React.useEffect(() => {
    filterProspects();
  }, [prospects, filters]);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProspects(data.prospects || []);
    } catch (error) {
      console.error("Erreur lors du chargement des prospects:", error);
      setError("Impossible de charger les prospects");
    } finally {
      setLoading(false);
    }
  };

  const filterProspects = () => {
    let filtered = [...prospects];

    // Filtre par statut (clients gagnés)
    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Filtre par tranche d'âge
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        const age = parseInt(p.age);
        if (maxAge) {
          return age >= minAge && age <= maxAge;
        } else {
          return age >= minAge;
        }
      });
    }

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.first_name?.toLowerCase().includes(searchLower) ||
          p.last_name?.toLowerCase().includes(searchLower) ||
          p.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProspects(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      contractType: "",
      status: "",
      ageRange: "",
      currentGuarantees: "",
      contractAnniversary: "",
      search: "",
    });
  };

  const createSegment = () => {
    const newSegment = {
      id: Date.now(),
      name: segmentForm.name,
      description: segmentForm.description,
      criteria: { ...filters },
      prospects: filteredProspects.length,
      createdAt: new Date().toISOString(),
    };

    setSegments((prev) => [...prev, newSegment]);
    setSegmentForm({ name: "", description: "", criteria: {} });
    setShowSegmentForm(false);
  };

  const getOpportunitiesForProspect = (prospect) => {
    const age = parseInt(prospect.age);
    return crossSellProducts.filter((product) => {
      const targetAge = parseInt(product.targetAge);
      return age >= targetAge;
    });
  };

  const getColorClass = (color) => {
    const colors = {
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      indigo: "from-indigo-500 to-indigo-600",
    };
    return colors[color] || colors.purple;
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
                Segmentation Clientèle
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-bell"></i>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium font-inter">
                  A
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("segmentation")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors font-inter ${
                  activeTab === "segmentation"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-users-cog mr-3"></i>
                Segmentation
              </button>

              <button
                onClick={() => setActiveTab("opportunities")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors font-inter ${
                  activeTab === "opportunities"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-chart-line mr-3"></i>
                Opportunités
              </button>

              <button
                onClick={() => setActiveTab("segments")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors font-inter ${
                  activeTab === "segments"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-layer-group mr-3"></i>
                Mes Segments
              </button>

              <button
                onClick={() => setActiveTab("campaigns")}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors font-inter ${
                  activeTab === "campaigns"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className="fas fa-bullhorn mr-3"></i>
                Campagnes
              </button>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="flex-1 p-8">
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

          {/* Onglet Segmentation */}
          {activeTab === "segmentation" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-inter">
                  Segmentation Avancée
                </h2>
                <button
                  onClick={() => setShowSegmentForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-inter"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Créer un segment
                </button>
              </div>

              {/* Filtres */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-inter">
                  Filtres de segmentation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                      Type de contrat
                    </label>
                    <select
                      value={filters.contractType}
                      onChange={(e) =>
                        handleFilterChange("contractType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                    >
                      <option value="">Tous les types</option>
                      <option value="sante">Santé</option>
                      <option value="auto">Auto</option>
                      <option value="habitation">Habitation</option>
                      <option value="vie">Vie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                      Statut
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="converti">Gagné</option>
                      <option value="en_negociation">En négociation</option>
                      <option value="qualifie">Qualifié</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                      Tranche d'âge
                    </label>
                    <select
                      value={filters.ageRange}
                      onChange={(e) =>
                        handleFilterChange("ageRange", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                    >
                      <option value="">Tous les âges</option>
                      <option value="50-59">50-59 ans</option>
                      <option value="60-69">60-69 ans</option>
                      <option value="70-79">70-79 ans</option>
                      <option value="80-">80+ ans</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                      Recherche
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      placeholder="Nom, email..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 font-inter">
                    <span className="font-semibold text-purple-600">
                      {filteredProspects.length}
                    </span>{" "}
                    clients correspondent aux critères
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm font-inter"
                  >
                    <i className="fas fa-times mr-1"></i>
                    Effacer les filtres
                  </button>
                </div>
              </div>

              {/* Liste des prospects filtrés */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="text-lg font-semibold text-gray-900 font-inter">
                    Clients segmentés
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                          Âge
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                          Opportunités
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-inter">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProspects.map((prospect) => {
                        const opportunities =
                          getOpportunitiesForProspect(prospect);
                        return (
                          <tr key={prospect.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-sm font-inter">
                                    {prospect.first_name?.[0]}
                                    {prospect.last_name?.[0]}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 font-inter">
                                    {prospect.first_name} {prospect.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 font-inter">
                                    {prospect.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-inter">
                              {prospect.age} ans
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full font-inter ${
                                  prospect.status === "converti"
                                    ? "bg-green-100 text-green-800"
                                    : prospect.status === "en_negociation"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {prospect.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-purple-600 font-inter">
                                  {opportunities.length} produits
                                </span>
                                <div className="ml-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold font-inter">
                                    {opportunities.length}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedProspects([prospect]);
                                  setShowOpportunities(true);
                                }}
                                className="text-purple-600 hover:text-purple-900 font-inter"
                              >
                                Voir opportunités
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredProspects.length === 0 && (
                    <div className="text-center py-8">
                      <i className="fas fa-search text-gray-400 text-3xl mb-4"></i>
                      <p className="text-gray-500 font-inter">
                        Aucun client ne correspond aux critères sélectionnés
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Onglet Opportunités */}
          {activeTab === "opportunities" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 font-inter">
                Opportunités de Vente Additionnelle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crossSellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${getColorClass(
                        product.color
                      )}`}
                    ></div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${getColorClass(
                            product.color
                          )} rounded-lg flex items-center justify-center`}
                        >
                          <i
                            className={`${product.icon} text-white text-lg`}
                          ></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 font-inter">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-inter">
                            Cible: {product.targetAge}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 font-inter">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-600 font-inter">
                          {
                            filteredProspects.filter((p) => {
                              const age = parseInt(p.age);
                              const targetAge = parseInt(product.targetAge);
                              return age >= targetAge;
                            }).length
                          }{" "}
                          prospects éligibles
                        </span>
                        <button
                          className={`px-4 py-2 bg-gradient-to-r ${getColorClass(
                            product.color
                          )} text-white rounded-lg text-sm hover:opacity-90 transition-opacity font-inter`}
                        >
                          Voir prospects
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Mes Segments */}
          {activeTab === "segments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-inter">
                  Mes Segments
                </h2>
                <button
                  onClick={() => setShowSegmentForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all font-inter"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Nouveau segment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 font-inter">
                        {segment.name}
                      </h3>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold font-inter">
                          {segment.prospects}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 font-inter">
                      {segment.description}
                    </p>

                    <div className="text-xs text-gray-500 mb-4 font-inter">
                      Créé le{" "}
                      {new Date(segment.createdAt).toLocaleDateString("fr-FR")}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-blue-600 transition-all font-inter">
                        Utiliser pour campagne
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-inter">
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {segments.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <i className="fas fa-layer-group text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-500 font-inter">
                      Aucun segment créé pour le moment
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Campagnes */}
          {activeTab === "campaigns" && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 font-inter">
                Campagnes Marketing
              </h2>

              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <i className="fas fa-bullhorn text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                  Fonctionnalité en développement
                </h3>
                <p className="text-gray-600 font-inter">
                  La gestion des campagnes marketing sera bientôt disponible
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal formulaire segment */}
      {showSegmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 font-inter">
                Créer un nouveau segment
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Nom du segment *
                </label>
                <input
                  type="text"
                  value={segmentForm.name}
                  onChange={(e) =>
                    setSegmentForm({ ...segmentForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                  placeholder="Ex: Seniors 65+ avec contrat santé"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Description
                </label>
                <textarea
                  value={segmentForm.description}
                  onChange={(e) =>
                    setSegmentForm({
                      ...segmentForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter"
                  placeholder="Description du segment et de son utilisation..."
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800 font-inter">
                  <i className="fas fa-info-circle mr-2"></i>
                  Ce segment sera créé avec les filtres actuellement appliqués (
                  {filteredProspects.length} prospects)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowSegmentForm(false);
                    setSegmentForm({ name: "", description: "", criteria: {} });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-inter"
                >
                  Annuler
                </button>
                <button
                  onClick={createSegment}
                  disabled={!segmentForm.name}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 font-inter"
                >
                  Créer le segment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal opportunités */}
      {showOpportunities && selectedProspects.length > 0 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-lg font-semibold text-gray-900 font-inter">
                Opportunités pour {selectedProspects[0].first_name}{" "}
                {selectedProspects[0].last_name}
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getOpportunitiesForProspect(selectedProspects[0]).map(
                  (product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${getColorClass(
                            product.color
                          )} rounded-lg flex items-center justify-center`}
                        >
                          <i className={`${product.icon} text-white`}></i>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900 font-inter">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-inter">
                            {product.targetAge}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-inter">
                        {product.description}
                      </p>
                      <button
                        className={`w-full px-3 py-2 bg-gradient-to-r ${getColorClass(
                          product.color
                        )} text-white rounded-lg text-sm hover:opacity-90 transition-opacity font-inter`}
                      >
                        Proposer ce produit
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowOpportunities(false);
                    setSelectedProspects([]);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-inter"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;