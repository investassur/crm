"use client";
import React from "react";

function MainComponent() {
  const [contracts, setContracts] = React.useState([]);
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [productFilter, setProductFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [editingContract, setEditingContract] = React.useState(null);
  const [formData, setFormData] = React.useState({
    prospect_id: "",
    contract_number: "",
    product_type: "",
    premium_amount: "",
    commission_rate: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  const contractsPerPage = 10;

  React.useEffect(() => {
    fetchContracts();
    fetchProspects();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setContracts(data.contracts || []);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les contrats");
    } finally {
      setLoading(false);
    }
  };

  const fetchProspects = async () => {
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProspects(data.prospects || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contract_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.prospect_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    const matchesProduct =
      !productFilter || contract.product_type === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
  const startIndex = (currentPage - 1) * contractsPerPage;
  const paginatedContracts = filteredContracts.slice(
    startIndex,
    startIndex + contractsPerPage
  );

  const totalContracts = contracts.length;
  const totalPremiums = contracts.reduce(
    (sum, contract) => sum + (parseFloat(contract.premium_amount) || 0),
    0
  );
  const totalCommissions = contracts.reduce(
    (sum, contract) => sum + (parseFloat(contract.commission_amount) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingContract
        ? "/api/contracts/update"
        : "/api/contracts/create";
      const body = editingContract
        ? { id: editingContract.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await fetchContracts();
      setShowModal(false);
      setEditingContract(null);
      setFormData({
        prospect_id: "",
        contract_number: "",
        product_type: "",
        premium_amount: "",
        commission_rate: "",
        start_date: "",
        end_date: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la sauvegarde du contrat");
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData({
      prospect_id: contract.prospect_id || "",
      contract_number: contract.contract_number || "",
      product_type: contract.product_type || "",
      premium_amount: contract.premium_amount || "",
      commission_rate: contract.commission_rate || "",
      start_date: contract.start_date || "",
      end_date: contract.end_date || "",
      notes: contract.notes || "",
    });
    setShowModal(true);
  };

  const handleNewContract = () => {
    setEditingContract(null);
    setFormData({
      prospect_id: "",
      contract_number: "",
      product_type: "",
      premium_amount: "",
      commission_rate: "",
      start_date: "",
      end_date: "",
      notes: "",
    });
    setShowModal(true);
  };

  const calculateCommission = () => {
    const premium = parseFloat(formData.premium_amount) || 0;
    const rate = parseFloat(formData.commission_rate) || 0;
    return ((premium * rate) / 100).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "expire":
        return "bg-red-100 text-red-800";
      case "annule":
        return "bg-gray-100 text-gray-800";
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
                className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
              >
                <i className="fas fa-users w-5 mr-3"></i>
                Prospects
              </a>
            </li>
            <li>
              <a
                href="/contrats"
                className="flex items-center p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm"
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
                Gestion des Contrats
              </h2>
              <p className="text-gray-600 mt-1">
                Gérez vos contrats d'assurance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewContract}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <i className="fas fa-plus mr-2"></i>
                Nouveau Contrat
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Contrats
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalContracts}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-xl">
                  <i className="fas fa-file-contract text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Montant Primes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalPremiums.toLocaleString("fr-FR")}€
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-xl">
                  <i className="fas fa-euro-sign text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Commissions
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalCommissions.toLocaleString("fr-FR")}€
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-xl">
                  <i className="fas fa-percentage text-white text-xl"></i>
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
                      placeholder="Rechercher un contrat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent w-64"
                    />
                    <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="en_attente">En attente</option>
                    <option value="expire">Expiré</option>
                    <option value="annule">Annulé</option>
                  </select>

                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="">Tous les produits</option>
                    <option value="sante_senior">Santé Senior</option>
                    <option value="complementaire_sante">
                      Complémentaire Santé
                    </option>
                    <option value="dependance">Dépendance</option>
                    <option value="obsèques">Obsèques</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des contrats...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                  <p className="text-red-500">{error}</p>
                </div>
              ) : paginatedContracts.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="fas fa-file-contract text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 text-lg">Aucun contrat trouvé</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° Contrat
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prospect
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prime
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Début
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedContracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {contract.contract_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center mr-3">
                              <i className="fas fa-user text-white text-sm"></i>
                            </div>
                            <div className="text-sm text-gray-900">
                              {contract.prospect_name || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contract.product_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {parseFloat(
                            contract.premium_amount || 0
                          ).toLocaleString("fr-FR")}
                          €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {parseFloat(
                              contract.commission_amount || 0
                            ).toLocaleString("fr-FR")}
                            €
                          </div>
                          <div className="text-xs text-gray-500">
                            ({contract.commission_rate}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              contract.status
                            )}`}
                          >
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.start_date
                            ? new Date(contract.start_date).toLocaleDateString(
                                "fr-FR"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(contract)}
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
                    {Math.min(
                      startIndex + contractsPerPage,
                      filteredContracts.length
                    )}{" "}
                    sur {filteredContracts.length} contrats
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
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
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingContract ? "Modifier le Contrat" : "Nouveau Contrat"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                    Prospect *
                  </label>
                  <select
                    name="prospect_id"
                    value={formData.prospect_id}
                    onChange={(e) =>
                      setFormData({ ...formData, prospect_id: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionner un prospect</option>
                    {prospects.map((prospect) => (
                      <option key={prospect.id} value={prospect.id}>
                        {prospect.first_name} {prospect.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    N° de Contrat *
                  </label>
                  <input
                    type="text"
                    name="contract_number"
                    value={formData.contract_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_number: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Produit *
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={(e) =>
                      setFormData({ ...formData, product_type: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  >
                    <option value="">Sélectionner un produit</option>
                    <option value="sante_senior">Santé Senior</option>
                    <option value="complementaire_sante">
                      Complémentaire Santé
                    </option>
                    <option value="dependance">Dépendance</option>
                    <option value="obsèques">Obsèques</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant Prime (€) *
                  </label>
                  <input
                    type="number"
                    name="premium_amount"
                    value={formData.premium_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        premium_amount: e.target.value,
                      })
                    }
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux Commission (%) *
                  </label>
                  <input
                    type="number"
                    name="commission_rate"
                    value={formData.commission_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commission_rate: e.target.value,
                      })
                    }
                    required
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Calculée
                  </label>
                  <div className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 border border-gray-300 rounded-xl text-gray-700 font-medium">
                    {calculateCommission()}€
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Début
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Fin
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                  placeholder="Notes sur le contrat..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  {editingContract ? "Modifier" : "Créer"}
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