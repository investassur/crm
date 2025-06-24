"use client";
import React from "react";

function MainComponent() {
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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
        setError("Impossible de charger les prospects");
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  const recentProspects = prospects.slice(0, 5);
  const totalProspects = prospects.length;
  const newProspects = prospects.filter((p) => p.status === "nouveau").length;
  const qualifiedProspects = prospects.filter(
    (p) => p.status === "qualifié"
  ).length;
  const convertedProspects = prospects.filter(
    (p) => p.status === "converti"
  ).length;

  const conversionRate =
    totalProspects > 0
      ? ((convertedProspects / totalProspects) * 100).toFixed(1)
      : 0;

  const tasks = [
    {
      id: 1,
      title: "Appeler M. Dupont",
      priority: "high",
      dueDate: "Aujourd'hui",
    },
    {
      id: 2,
      title: "Envoyer devis Mme Martin",
      priority: "medium",
      dueDate: "Demain",
    },
    {
      id: 3,
      title: "Relance prospect senior",
      priority: "low",
      dueDate: "Cette semaine",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "call",
      description: "Appel avec Jean Durand",
      time: "Il y a 2h",
    },
    {
      id: 2,
      type: "email",
      description: "Email envoyé à Marie Leblanc",
      time: "Il y a 4h",
    },
    {
      id: 3,
      type: "meeting",
      description: "Rendez-vous avec Paul Moreau",
      time: "Hier",
    },
  ];

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
                className="flex items-center p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm"
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
                Dashboard
              </h2>
              <p className="text-gray-600 mt-1">
                Vue d'ensemble de votre activité
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
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

        {/* Main Dashboard Content */}
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
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  +12%
                </span>
                <span className="text-gray-500 text-sm ml-2">ce mois</span>
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
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  +8%
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  cette semaine
                </span>
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
              <div className="flex items-center mt-4">
                <span className="text-yellow-500 text-sm font-medium flex items-center">
                  <i className="fas fa-minus mr-1"></i>
                  Stable
                </span>
                <span className="text-gray-500 text-sm ml-2">ce mois</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Taux Conversion
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {conversionRate}%
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-xl">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  +2.3%
                </span>
                <span className="text-gray-500 text-sm ml-2">ce mois</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Performance Mensuelle
              </h3>
              <div className="h-64 flex items-end justify-between space-x-3">
                {[
                  { month: "Jan", height: 32, value: 45 },
                  { month: "Fév", height: 40, value: 52 },
                  { month: "Mar", height: 48, value: 61 },
                  { month: "Avr", height: 36, value: 48 },
                  { month: "Mai", height: 52, value: 67 },
                  { month: "Jun", height: 44, value: 58 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="bg-gradient-to-t from-[#667eea] to-[#764ba2] w-full rounded-t-lg relative group cursor-pointer"
                      style={{ height: `${item.height * 4}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.value}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-3 font-medium">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Répartition par Source
              </h3>
              <div className="space-y-4">
                {[
                  {
                    source: "Site Web",
                    percentage: 45,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    source: "Référencement",
                    percentage: 30,
                    color: "from-green-400 to-green-600",
                  },
                  {
                    source: "Publicité",
                    percentage: 15,
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    source: "Autres",
                    percentage: 10,
                    color: "from-purple-400 to-purple-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} mr-3`}
                      ></div>
                      <span className="text-sm text-gray-700 font-medium">
                        {item.source}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 ml-4">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Prospects */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Prospects Récents
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea]"></div>
                </div>
              ) : error ? (
                <p className="text-red-500 text-center py-8">{error}</p>
              ) : recentProspects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun prospect trouvé
                </p>
              ) : (
                <div className="space-y-4">
                  {recentProspects.map((prospect) => (
                    <div
                      key={prospect.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {prospect.first_name?.[0]}
                            {prospect.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {prospect.first_name} {prospect.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {prospect.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          prospect.status === "nouveau"
                            ? "bg-blue-100 text-blue-800"
                            : prospect.status === "qualifié"
                            ? "bg-yellow-100 text-yellow-800"
                            : prospect.status === "converti"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {prospect.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Tâches à Faire
              </h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 w-4 h-4 text-[#667eea] bg-gray-100 border-gray-300 rounded focus:ring-[#667eea] focus:ring-2"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-600">{task.dueDate}</p>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Activités Récentes
              </h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div
                      className={`p-3 rounded-xl ${
                        activity.type === "call"
                          ? "bg-blue-100"
                          : activity.type === "email"
                          ? "bg-green-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <i
                        className={`fas ${
                          activity.type === "call"
                            ? "fa-phone text-blue-600"
                            : activity.type === "email"
                            ? "fa-envelope text-green-600"
                            : "fa-calendar text-purple-600"
                        }`}
                      ></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainComponent;