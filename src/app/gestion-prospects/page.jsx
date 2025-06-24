"use client";
import React from "react";

function MainComponent() {
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("create");
  const [selectedProspect, setSelectedProspect] = React.useState(null);
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    age: "",
    status: "nouveau",
    source: "",
    notes: "",
    assigned_to: "",
  });

  const itemsPerPage = 10;

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusFilter || undefined,
          source: sourceFilter || undefined,
          search: searchTerm || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProspects(data.prospects || []);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les prospects");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProspects();
  }, [statusFilter, sourceFilter, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSourceFilter = (e) => {
    setSourceFilter(e.target.value);
    setCurrentPage(1);
  };

  const openModal = (mode, prospect = null) => {
    setModalMode(mode);
    setSelectedProspect(prospect);
    if (mode === "create") {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        age: "",
        status: "nouveau",
        source: "",
        notes: "",
        assigned_to: "",
      });
    } else if (mode === "edit" && prospect) {
      setFormData({
        first_name: prospect.first_name || "",
        last_name: prospect.last_name || "",
        email: prospect.email || "",
        phone: prospect.phone || "",
        age: prospect.age || "",
        status: prospect.status || "nouveau",
        source: prospect.source || "",
        notes: prospect.notes || "",
        assigned_to: prospect.assigned_to || "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProspect(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      age: "",
      status: "nouveau",
      source: "",
      notes: "",
      assigned_to: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/prospects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        closeModal();
        fetchProspects();
      }
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la sauvegarde du prospect");
    }
  };

  const totalProspects = prospects.length;
  const newProspects = prospects.filter((p) => p.status === "nouveau").length;
  const qualifiedProspects = prospects.filter(
    (p) => p.status === "qualifié"
  ).length;
  const convertedProspects = prospects.filter(
    (p) => p.status === "converti"
  ).length;

  const totalPages = Math.ceil(totalProspects / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProspects = prospects.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case "nouveau":
        return "bg-blue-100 text-blue-800";
      case "qualifié":
        return "bg-yellow-100 text-yellow-800";
      case "converti":
        return "bg-green-100 text-green-800";
      case "perdu":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-inter">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-[#667eea] to-[#764ba2] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold text-white">AssurCRM</h1>
          <p className="text-sm text-white/80 mt-1">Courtage Senior</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-tachometer-alt w-5 mr-3"></i>
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/prospects"
                className="flex items-center p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm"
              >
                <i className="fas fa-users w-5 mr-3"></i>
                Prospects
              </a>
            </li>
            <li>
              <a
                href="/contrats"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-file-contract w-5 mr-3"></i>
                Contrats
              </a>
            </li>
            <li>
              <a
                href="/taches"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-tasks w-5 mr-3"></i>
                Tâches
              </a>
            </li>
            <li>
              <a
                href="/campagnes"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-bullhorn w-5 mr-3"></i>
                Campagnes
              </a>
            </li>
            <li>
              <a
                href="/rapports"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-chart-bar w-5 mr-3"></i>
                Rapports
              </a>
            </li>
            <li>
              <a
                href="/segmentation"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-layer-group w-5 mr-3"></i>
                Segmentation
              </a>
            </li>
            <li>
              <a
                href="/workflows"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-project-diagram w-5 mr-3"></i>
                Automatisation
              </a>
            </li>
            <li>
              <a
                href="/templates"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-envelope-open-text w-5 mr-3"></i>
                Templates Email
              </a>
            </li>
            <li>
              <a
                href="/import"
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-file-import w-5 mr-3"></i>
                Import Données
              </a>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center p-3 rounded-xl bg-white/10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-white/70">admin@assurcrm.fr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Gestion des Prospects
              </h2>
              <p className="text-gray-600 mt-1">
                Gérez vos prospects et suivez leur progression
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openModal("create")}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <i className="fas fa-plus mr-2"></i>
                Nouveau Prospect
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 relative">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Prospects
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalProspects}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-xl">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Nouveaux
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {newProspects}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-xl">
                  <i className="fas fa-user-plus text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Qualifiés
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {qualifiedProspects}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl">
                  <i className="fas fa-star text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Convertis
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {convertedProspects}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-xl">
                  <i className="fas fa-check-circle text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un prospect..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent w-64"
                    />
                    <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="nouveau">Nouveau</option>
                    <option value="qualifié">Qualifié</option>
                    <option value="converti">Converti</option>
                    <option value="perdu">Perdu</option>
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={handleSourceFilter}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="">Toutes les sources</option>
                    <option value="site_web">Site Web</option>
                    <option value="referencement">Référencement</option>
                    <option value="publicite">Publicité</option>
                    <option value="autres">Autres</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des prospects...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                  <p className="text-red-500">{error}</p>
                </div>
              ) : currentProspects.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">Aucun prospect trouvé</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prospect
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Âge
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date création
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProspects.map((prospect) => (
                      <tr
                        key={prospect.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {prospect.first_name?.charAt(0)}
                                  {prospect.last_name?.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {prospect.first_name} {prospect.last_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {prospect.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prospect.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prospect.age || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              prospect.status
                            )}`}
                          >
                            {prospect.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prospect.source || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(prospect.created_at).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => openModal("edit", prospect)}
                              className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors">
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

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de {startIndex + 1} à{" "}
                    {Math.min(endIndex, totalProspects)} sur {totalProspects}{" "}
                    prospects
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    <span className="text-sm text-gray-700 px-4 py-2 bg-white rounded-lg border">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalMode === "create"
                    ? "Nouveau Prospect"
                    : "Modifier le Prospect"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleFormChange}
                    min="0"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="qualifié">Qualifié</option>
                    <option value="converti">Converti</option>
                    <option value="perdu">Perdu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionner une source</option>
                    <option value="site_web">Site Web</option>
                    <option value="referencement">Référencement</option>
                    <option value="publicite">Publicité</option>
                    <option value="autres">Autres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigné à
                  </label>
                  <input
                    type="text"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  placeholder="Notes sur le prospect..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {modalMode === "create" ? "Créer" : "Modifier"}
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