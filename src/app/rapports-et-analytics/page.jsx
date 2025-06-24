"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // États pour les filtres
  const [dateRange, setDateRange] = React.useState("30");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [selectedSource, setSelectedSource] = React.useState("");

  // États pour l'analyse IA
  const [aiInsights, setAiInsights] = React.useState(null);
  const [loadingAI, setLoadingAI] = React.useState(false);

  // Données simulées pour les graphiques
  const [chartData, setChartData] = React.useState({
    prospects: [],
    conversions: [],
    revenue: [],
    sources: [],
  });

  React.useEffect(() => {
    loadData();
  }, [dateRange, selectedStatus, selectedSource]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          source: selectedSource,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProspects(data.prospects || []);
      generateChartData(data.prospects || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (prospectsData) => {
    const now = new Date();
    const daysBack = parseInt(dateRange);
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Filtrer les prospects par période
    const filteredProspects = prospectsData.filter(
      (p) => new Date(p.created_at) >= startDate
    );

    // Générer données pour graphique prospects par jour
    const prospectsByDay = {};
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      prospectsByDay[dateStr] = 0;
    }

    filteredProspects.forEach((p) => {
      const dateStr = new Date(p.created_at).toISOString().split("T")[0];
      if (prospectsByDay[dateStr] !== undefined) {
        prospectsByDay[dateStr]++;
      }
    });

    // Données par statut
    const statusCounts = {};
    filteredProspects.forEach((p) => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });

    // Données par source
    const sourceCounts = {};
    filteredProspects.forEach((p) => {
      if (p.source) {
        sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1;
      }
    });

    setChartData({
      prospects: Object.entries(prospectsByDay)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .reverse(),
      conversions: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / filteredProspects.length) * 100),
      })),
      revenue: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleDateString("fr-FR", {
          month: "short",
        }),
        amount: Math.floor(Math.random() * 50000) + 10000,
      })),
      sources: Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
      })),
    });
  };

  const generateAIInsights = async () => {
    setLoadingAI(true);
    try {
      const analysisData = {
        totalProspects: prospects.length,
        conversionRate:
          prospects.length > 0
            ? (
                (prospects.filter((p) => p.status === "converti").length /
                  prospects.length) *
                100
              ).toFixed(1)
            : 0,
        topSources: chartData.sources.slice(0, 3),
        recentTrends: chartData.prospects.slice(-7),
        statusDistribution: chartData.conversions,
      };

      const response = await fetch("/api/ai/analyze-feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Analyse des performances CRM",
          description: `Analyse des données CRM: ${
            analysisData.totalProspects
          } prospects, taux de conversion ${
            analysisData.conversionRate
          }%, principales sources: ${analysisData.topSources
            .map((s) => s.source)
            .join(
              ", "
            )}. Générer des insights sur les performances, recommandations d'amélioration et prédictions.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAiInsights({
        ...data,
        insights: [
          "Votre taux de conversion actuel est de " +
            analysisData.conversionRate +
            "%",
          "Les 3 principales sources de prospects représentent " +
            Math.round(
              (analysisData.topSources.reduce((sum, s) => sum + s.count, 0) /
                analysisData.totalProspects) *
                100
            ) +
            "% du total",
          "Tendance des 7 derniers jours: " +
            (analysisData.recentTrends.slice(-1)[0]?.count >
            analysisData.recentTrends[0]?.count
              ? "croissante"
              : "décroissante"),
        ],
        recommendations: [
          "Concentrez vos efforts sur les sources les plus performantes",
          "Optimisez le processus de qualification pour améliorer le taux de conversion",
          "Mettez en place un suivi automatisé pour les prospects en négociation",
        ],
        predictions: [
          "Prévision de " +
            Math.round(analysisData.totalProspects * 1.15) +
            " prospects le mois prochain",
          "Taux de conversion estimé: " +
            (parseFloat(analysisData.conversionRate) + 2).toFixed(1) +
            "%",
          "Revenus prévisionnels: " +
            (Math.round(Math.random() * 20000) + 30000).toLocaleString() +
            "€",
        ],
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse IA:", error);
      setError("Impossible de générer l'analyse IA");
    } finally {
      setLoadingAI(false);
    }
  };

  const exportToPDF = () => {
    const printContent = document.getElementById("reports-content");
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const exportToExcel = () => {
    const csvContent = [
      ["Nom", "Email", "Statut", "Source", "Date création"],
      ...prospects.map((p) => [
        `${p.first_name} ${p.last_name}`,
        p.email,
        p.status,
        p.source,
        new Date(p.created_at).toLocaleDateString("fr-FR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospects-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      nouveau: "bg-blue-500",
      qualifie: "bg-yellow-500",
      en_negociation: "bg-orange-500",
      converti: "bg-green-500",
      perdu: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
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
                Rapports et Analytics
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
            {[
              {
                id: "dashboard",
                label: "Vue d'ensemble",
                icon: "fas fa-chart-line",
              },
              {
                id: "performance",
                label: "Performance",
                icon: "fas fa-chart-bar",
              },
              { id: "trends", label: "Tendances", icon: "fas fa-trending-up" },
              { id: "ai-insights", label: "Insights IA", icon: "fas fa-robot" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 font-inter ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
              Filtres
            </h3>

            {/* Période */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Période
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              >
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
                <option value="90">3 derniers mois</option>
                <option value="365">12 derniers mois</option>
              </select>
            </div>

            {/* Statut */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              >
                <option value="">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="qualifie">Qualifié</option>
                <option value="en_negociation">En négociation</option>
                <option value="converti">Converti</option>
                <option value="perdu">Perdu</option>
              </select>
            </div>

            {/* Source */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              >
                <option value="">Toutes les sources</option>
                <option value="Site web">Site web</option>
                <option value="Recommandation">Recommandation</option>
                <option value="Publicité">Publicité</option>
                <option value="Réseaux sociaux">Réseaux sociaux</option>
              </select>
            </div>

            {/* Actions d'export */}
            <div className="space-y-3">
              <button
                onClick={exportToPDF}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-inter"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                Export PDF
              </button>
              <button
                onClick={exportToExcel}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-inter"
              >
                <i className="fas fa-file-excel mr-2"></i>
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-6" id="reports-content">
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

          {/* Vue d'ensemble */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-inter">
                  Vue d'ensemble
                </h2>
                <div className="text-sm text-gray-500 font-inter">
                  Dernière mise à jour: {new Date().toLocaleString("fr-FR")}
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="fas fa-users text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 font-inter">
                        Total Prospects
                      </p>
                      <p className="text-3xl font-bold text-gray-900 font-inter">
                        {prospects.length}
                      </p>
                      <p className="text-sm text-green-600 font-inter">
                        +12% ce mois
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 font-inter">
                        Taux Conversion
                      </p>
                      <p className="text-3xl font-bold text-gray-900 font-inter">
                        {prospects.length > 0
                          ? Math.round(
                              (prospects.filter((p) => p.status === "converti")
                                .length /
                                prospects.length) *
                                100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-green-600 font-inter">
                        +3% ce mois
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <i className="fas fa-euro-sign text-yellow-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 font-inter">
                        Revenus Mois
                      </p>
                      <p className="text-3xl font-bold text-gray-900 font-inter">
                        {(Math.random() * 50000 + 20000).toLocaleString(
                          "fr-FR",
                          { maximumFractionDigits: 0 }
                        )}
                        €
                      </p>
                      <p className="text-sm text-green-600 font-inter">
                        +8% ce mois
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="fas fa-handshake text-purple-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 font-inter">
                        En Négociation
                      </p>
                      <p className="text-3xl font-bold text-gray-900 font-inter">
                        {
                          prospects.filter((p) => p.status === "en_negociation")
                            .length
                        }
                      </p>
                      <p className="text-sm text-blue-600 font-inter">Actifs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Évolution des prospects */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Évolution des prospects
                  </h3>
                  <div className="h-64 flex items-end space-x-2">
                    {chartData.prospects.slice(-10).map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${Math.max(
                              (item.count /
                                Math.max(
                                  ...chartData.prospects.map((p) => p.count)
                                )) *
                                200,
                              10
                            )}px`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2 font-inter">
                          {new Date(item.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Répartition par statut */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Répartition par statut
                  </h3>
                  <div className="space-y-3">
                    {chartData.conversions.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3"
                          style={{
                            backgroundColor: getStatusColor(
                              item.status
                            ).replace("bg-", "#"),
                          }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 font-inter capitalize">
                              {item.status.replace("_", " ")}
                            </span>
                            <span className="text-sm text-gray-500 font-inter">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getStatusColor(
                                item.status
                              )}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sources de prospects */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                  Principales sources de prospects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {chartData.sources.slice(0, 6).map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <i className="fas fa-chart-pie text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-inter">
                          {source.source || "Non spécifié"}
                        </p>
                        <p className="text-sm text-gray-500 font-inter">
                          {source.count} prospects
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Performance */}
          {activeTab === "performance" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">
                Analyse de performance
              </h2>

              {/* Revenus mensuels */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                  Évolution des revenus (12 derniers mois)
                </h3>
                <div className="h-80 flex items-end space-x-3">
                  {chartData.revenue.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                        style={{
                          height: `${
                            (item.amount /
                              Math.max(
                                ...chartData.revenue.map((r) => r.amount)
                              )) *
                            250
                          }px`,
                        }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2 font-inter">
                        {item.month}
                      </span>
                      <span className="text-xs text-gray-400 font-inter">
                        {(item.amount / 1000).toFixed(0)}k€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métriques de performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Temps de conversion moyen
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2 font-inter">
                      {Math.floor(Math.random() * 20) + 15}
                    </div>
                    <div className="text-gray-500 font-inter">jours</div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-inter">
                        Amélioration de 3 jours par rapport au mois dernier
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Valeur moyenne par client
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2 font-inter">
                      {(Math.random() * 3000 + 2000).toLocaleString("fr-FR", {
                        maximumFractionDigits: 0,
                      })}
                      €
                    </div>
                    <div className="text-gray-500 font-inter">par contrat</div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 font-inter">
                        +15% par rapport à l'année dernière
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tendances */}
          {activeTab === "trends" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">
                Analyse des tendances
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tendances par âge */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Répartition par tranche d'âge
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        range: "18-30 ans",
                        count: Math.floor(Math.random() * 50) + 20,
                        color: "bg-blue-500",
                      },
                      {
                        range: "31-45 ans",
                        count: Math.floor(Math.random() * 80) + 40,
                        color: "bg-green-500",
                      },
                      {
                        range: "46-60 ans",
                        count: Math.floor(Math.random() * 60) + 30,
                        color: "bg-yellow-500",
                      },
                      {
                        range: "60+ ans",
                        count: Math.floor(Math.random() * 40) + 15,
                        color: "bg-purple-500",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-20 text-sm font-medium text-gray-700 font-inter">
                          {item.range}
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${item.color}`}
                              style={{ width: `${(item.count / 120) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-gray-500 font-inter">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saisonnalité */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                    Saisonnalité des conversions
                  </h3>
                  <div className="h-48 flex items-end space-x-2">
                    {[
                      "Jan",
                      "Fév",
                      "Mar",
                      "Avr",
                      "Mai",
                      "Jun",
                      "Jul",
                      "Aoû",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Déc",
                    ].map((month, index) => {
                      const height = Math.random() * 150 + 30;
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t"
                            style={{ height: `${height}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2 font-inter">
                            {month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Prédictions */}
              <div className="mt-6 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                  Prédictions pour les 3 prochains mois
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <i className="fas fa-users text-blue-600 text-2xl mb-2"></i>
                    <div className="text-2xl font-bold text-blue-600 font-inter">
                      +{Math.floor(Math.random() * 50) + 30}%
                    </div>
                    <div className="text-sm text-gray-600 font-inter">
                      Nouveaux prospects
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <i className="fas fa-chart-line text-green-600 text-2xl mb-2"></i>
                    <div className="text-2xl font-bold text-green-600 font-inter">
                      +{Math.floor(Math.random() * 10) + 5}%
                    </div>
                    <div className="text-sm text-gray-600 font-inter">
                      Taux de conversion
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <i className="fas fa-euro-sign text-yellow-600 text-2xl mb-2"></i>
                    <div className="text-2xl font-bold text-yellow-600 font-inter">
                      +{Math.floor(Math.random() * 25) + 15}%
                    </div>
                    <div className="text-sm text-gray-600 font-inter">
                      Revenus estimés
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights IA */}
          {activeTab === "ai-insights" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 font-inter">
                  Insights IA avec Google Gemini
                </h2>
                <button
                  onClick={generateAIInsights}
                  disabled={loadingAI}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-inter"
                >
                  {loadingAI ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-robot mr-2"></i>
                      Générer l'analyse IA
                    </>
                  )}
                </button>
              </div>

              {aiInsights ? (
                <div className="space-y-6">
                  {/* Insights principaux */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                      <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                      Insights automatiques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {aiInsights.insights?.map((insight, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 font-inter">
                            {insight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommandations */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                      <i className="fas fa-thumbs-up text-green-500 mr-2"></i>
                      Recommandations d'amélioration
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.recommendations?.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 bg-green-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 font-inter">
                            {index + 1}
                          </div>
                          <p className="text-sm text-green-800 font-inter">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prédictions IA */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                      <i className="fas fa-crystal-ball text-purple-500 mr-2"></i>
                      Prédictions intelligentes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {aiInsights.predictions?.map((prediction, index) => (
                        <div
                          key={index}
                          className="p-4 bg-purple-50 rounded-lg text-center"
                        >
                          <i className="fas fa-chart-line text-purple-600 text-xl mb-2"></i>
                          <p className="text-sm text-purple-800 font-inter">
                            {prediction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score de performance IA */}
                  {aiInsights.analysis && (
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 font-inter">
                        <i className="fas fa-medal text-orange-500 mr-2"></i>
                        Score de performance global
                      </h3>
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <div className="w-full h-full bg-gray-200 rounded-full"></div>
                          <div
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                            style={{
                              background: `conic-gradient(from 0deg, #f97316 ${
                                (aiInsights.analysis.priority_score || 7) * 36
                              }deg, #e5e7eb 0deg)`,
                            }}
                          ></div>
                          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900 font-inter">
                              {aiInsights.analysis.priority_score || 7}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-gray-600 mt-4 font-inter">
                        Votre CRM performe bien avec des opportunités
                        d'amélioration identifiées
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow text-center">
                  <i className="fas fa-robot text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-medium text-gray-900 mb-2 font-inter">
                    Analyse IA non générée
                  </h3>
                  <p className="text-gray-500 mb-6 font-inter">
                    Cliquez sur "Générer l'analyse IA" pour obtenir des insights
                    automatiques sur vos performances
                  </p>
                  <button
                    onClick={generateAIInsights}
                    disabled={loadingAI}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-inter"
                  >
                    <i className="fas fa-robot mr-2"></i>
                    Commencer l'analyse
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;