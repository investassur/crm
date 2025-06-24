"use client";
import React from "react";

function MainComponent() {
  const [dateRange, setDateRange] = React.useState({
    start: "2025-01-01",
    end: "2025-01-31",
  });
  const [selectedMetrics, setSelectedMetrics] = React.useState([
    "prospects",
    "contracts",
    "campaigns",
  ]);
  const [loading, setLoading] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState("pdf");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [comparisonPeriod, setComparisonPeriod] = React.useState("previous");

  const [dashboardData, setDashboardData] = React.useState({
    kpis: {
      totalProspects: 1247,
      conversionRate: 12.5,
      totalContracts: 156,
      revenue: 2450000,
      avgDealSize: 15705,
      activeCampaigns: 8,
    },
    trends: {
      prospects: [120, 135, 148, 162, 175, 189, 201, 218, 235, 247, 261, 275],
      contracts: [12, 15, 18, 22, 25, 28, 31, 35, 38, 42, 45, 48],
      revenue: [
        180000, 195000, 210000, 225000, 240000, 255000, 270000, 285000, 300000,
        315000, 330000, 345000,
      ],
    },
    conversionFunnel: [
      { stage: "Visiteurs", count: 5420, percentage: 100 },
      { stage: "Prospects", count: 1247, percentage: 23 },
      { stage: "Qualifiés", count: 623, percentage: 50 },
      { stage: "Négociation", count: 234, percentage: 38 },
      { stage: "Contrats", count: 156, percentage: 67 },
    ],
    topSources: [
      { source: "Site Web", prospects: 456, percentage: 36.6 },
      { source: "Référencement", prospects: 312, percentage: 25.0 },
      { source: "Réseaux Sociaux", prospects: 234, percentage: 18.8 },
      { source: "Email Marketing", prospects: 156, percentage: 12.5 },
      { source: "Téléphone", prospects: 89, percentage: 7.1 },
    ],
  });

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "fas fa-chart-line" },
    { id: "prospects", label: "Prospects", icon: "fas fa-users" },
    { id: "contracts", label: "Contrats", icon: "fas fa-file-contract" },
    { id: "campaigns", label: "Campagnes", icon: "fas fa-bullhorn" },
    { id: "performance", label: "Performance", icon: "fas fa-trophy" },
  ];

  const kpiCards = [
    {
      title: "Total Prospects",
      value: dashboardData.kpis.totalProspects.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: "fas fa-users",
      color: "purple",
    },
    {
      title: "Taux de Conversion",
      value: `${dashboardData.kpis.conversionRate}%`,
      change: "+2.3%",
      trend: "up",
      icon: "fas fa-percentage",
      color: "blue",
    },
    {
      title: "Contrats Signés",
      value: dashboardData.kpis.totalContracts.toLocaleString(),
      change: "+8.7%",
      trend: "up",
      icon: "fas fa-file-contract",
      color: "green",
    },
    {
      title: "Chiffre d'Affaires",
      value: `${(dashboardData.kpis.revenue / 1000000).toFixed(1)}M€`,
      change: "+15.2%",
      trend: "up",
      icon: "fas fa-euro-sign",
      color: "indigo",
    },
    {
      title: "Panier Moyen",
      value: `${dashboardData.kpis.avgDealSize.toLocaleString()}€`,
      change: "+5.8%",
      trend: "up",
      icon: "fas fa-calculator",
      color: "pink",
    },
    {
      title: "Campagnes Actives",
      value: dashboardData.kpis.activeCampaigns.toString(),
      change: "+2",
      trend: "up",
      icon: "fas fa-bullhorn",
      color: "cyan",
    },
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const filename = `rapport-analytics-${dateRange.start}-${dateRange.end}.${exportFormat}`;
      console.log(`Exporting ${filename}`);
      setShowExportModal(false);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: "from-purple-500 to-purple-600 bg-purple-100 text-purple-600",
      blue: "from-blue-500 to-blue-600 bg-blue-100 text-blue-600",
      green: "from-green-500 to-green-600 bg-green-100 text-green-600",
      indigo: "from-indigo-500 to-indigo-600 bg-indigo-100 text-indigo-600",
      pink: "from-pink-500 to-pink-600 bg-pink-100 text-pink-600",
      cyan: "from-cyan-500 to-cyan-600 bg-cyan-100 text-cyan-600",
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="flex">
        <div className="w-64 bg-gradient-to-b from-purple-600 to-blue-700 min-h-screen shadow-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                <i className="fas fa-chart-bar text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Analytics</h2>
                <p className="text-purple-200 text-sm">Tableau de bord</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white bg-opacity-20 text-white shadow-lg"
                      : "text-purple-200 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-xl">
              <h3 className="text-white font-medium mb-2">Période d'analyse</h3>
              <div className="space-y-3">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-lg border border-white border-opacity-30 focus:border-opacity-50 focus:outline-none"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-lg border border-white border-opacity-30 focus:border-opacity-50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  <i className="fas fa-chart-line mr-3"></i>
                  Rapports et Analytics
                </h1>
                <p className="text-gray-600">
                  Analysez vos performances et générez des rapports détaillés
                </p>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <select
                  value={comparisonPeriod}
                  onChange={(e) => setComparisonPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="previous">Période précédente</option>
                  <option value="year">Année précédente</option>
                  <option value="quarter">Trimestre précédent</option>
                </select>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-download mr-2"></i>
                  Exporter
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kpiCards.map((kpi, index) => {
              const colorClasses = getColorClasses(kpi.color);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        colorClasses.split(" ")[2]
                      } ${colorClasses.split(" ")[3]}`}
                    >
                      <i className={`${kpi.icon} text-xl`}></i>
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-sm font-medium ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <i
                        className={`fas fa-arrow-${
                          kpi.trend === "up" ? "up" : "down"
                        }`}
                      ></i>
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">
                      {kpi.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Évolution des Prospects
                    </h3>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200">
                        <i className="fas fa-expand-arrows-alt"></i>
                      </button>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {dashboardData.trends.prospects.map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-purple-400"
                          style={{
                            height: `${
                              (value /
                                Math.max(...dashboardData.trends.prospects)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Entonnoir de Conversion
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.conversionFunnel.map((stage, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {stage.stage}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-900">
                              {stage.count.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({stage.percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Évolution du Chiffre d'Affaires
                    </h3>
                    <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                      <option>12 derniers mois</option>
                      <option>6 derniers mois</option>
                      <option>3 derniers mois</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between space-x-1">
                    {dashboardData.trends.revenue.map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-400"
                          style={{
                            height: `${
                              (value /
                                Math.max(...dashboardData.trends.revenue)) *
                              100
                            }%`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Sources de Prospects
                  </h3>
                  <div className="space-y-4">
                    {dashboardData.topSources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColorClasses(
                              ["purple", "blue", "green", "indigo", "pink"][
                                index
                              ]
                            )
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")}`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {source.source}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {source.prospects}
                          </div>
                          <div className="text-xs text-gray-500">
                            {source.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "prospects" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Analyse des Prospects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    1,247
                  </div>
                  <div className="text-sm text-gray-600">Total Prospects</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">623</div>
                  <div className="text-sm text-gray-600">Qualifiés</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">234</div>
                  <div className="text-sm text-gray-600">En négociation</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">390</div>
                  <div className="text-sm text-gray-600">Perdus</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Analyse des Contrats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <i className="fas fa-file-contract text-3xl text-green-600 mb-3"></i>
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Contrats signés</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <i className="fas fa-euro-sign text-3xl text-blue-600 mb-3"></i>
                  <div className="text-2xl font-bold text-blue-600">2.45M€</div>
                  <div className="text-sm text-gray-600">Valeur totale</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <i className="fas fa-calculator text-3xl text-purple-600 mb-3"></i>
                  <div className="text-2xl font-bold text-purple-600">
                    15,705€
                  </div>
                  <div className="text-sm text-gray-600">Panier moyen</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Performance des Campagnes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Campagnes Email
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Taux d'ouverture
                      </span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Taux de clic
                      </span>
                      <span className="text-sm font-medium">6.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conversions</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Campagnes SMS
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Taux de lecture
                      </span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Taux de clic
                      </span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conversions</span>
                      <span className="text-sm font-medium">45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Indicateurs de Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                    <i className="fas fa-trophy text-3xl text-yellow-600 mb-3"></i>
                    <div className="text-2xl font-bold text-yellow-600">
                      92%
                    </div>
                    <div className="text-sm text-gray-600">
                      Satisfaction client
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                    <i className="fas fa-clock text-3xl text-indigo-600 mb-3"></i>
                    <div className="text-2xl font-bold text-indigo-600">
                      2.3j
                    </div>
                    <div className="text-sm text-gray-600">
                      Temps de réponse
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                    <i className="fas fa-handshake text-3xl text-pink-600 mb-3"></i>
                    <div className="text-2xl font-bold text-pink-600">78%</div>
                    <div className="text-sm text-gray-600">Taux de closing</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
                    <i className="fas fa-chart-line text-3xl text-cyan-600 mb-3"></i>
                    <div className="text-2xl font-bold text-cyan-600">+15%</div>
                    <div className="text-sm text-gray-600">Croissance MoM</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Exporter le Rapport
                </h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Format d'export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={exportFormat === "pdf"}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="mr-3"
                    />
                    <i className="fas fa-file-pdf text-red-500 mr-2"></i>
                    <span>PDF</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportFormat === "excel"}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="mr-3"
                    />
                    <i className="fas fa-file-excel text-green-500 mr-2"></i>
                    <span>Excel</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="mr-3"
                    />
                    <i className="fas fa-file-csv text-blue-500 mr-2"></i>
                    <span>CSV</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Données à inclure
                </label>
                <div className="space-y-2">
                  {["prospects", "contracts", "campaigns", "performance"].map(
                    (metric) => (
                      <label key={metric} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, metric]);
                            } else {
                              setSelectedMetrics(
                                selectedMetrics.filter((m) => m !== metric)
                              );
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="capitalize">{metric}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download mr-2"></i>
                      Exporter
                    </>
                  )}
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