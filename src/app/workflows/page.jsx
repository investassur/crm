"use client";
import React from "react";

function MainComponent() {
  const [workflows, setWorkflows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editingWorkflow, setEditingWorkflow] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("workflows");
  const [showWorkflowBuilder, setShowWorkflowBuilder] = React.useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: "",
    trigger: "",
    search: "",
  });

  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    inactive: 0,
    executions: 0,
  });

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    trigger_type: "nouveau_prospect",
    trigger_conditions: {},
    actions: [],
    conditions: [],
    status: "actif",
  });

  const [workflowBuilder, setWorkflowBuilder] = React.useState({
    trigger: null,
    conditions: [],
    actions: [],
  });

  const triggerTypes = [
    {
      value: "nouveau_prospect",
      label: "Nouveau prospect",
      icon: "fas fa-user-plus",
    },
    {
      value: "date_echeance",
      label: "Date d'échéance",
      icon: "fas fa-calendar-alt",
    },
    {
      value: "statut_change",
      label: "Changement de statut",
      icon: "fas fa-exchange-alt",
    },
    {
      value: "email_ouvert",
      label: "Email ouvert",
      icon: "fas fa-envelope-open",
    },
    {
      value: "formulaire_soumis",
      label: "Formulaire soumis",
      icon: "fas fa-file-alt",
    },
  ];

  const actionTypes = [
    { value: "envoyer_email", label: "Envoyer email", icon: "fas fa-envelope" },
    { value: "creer_tache", label: "Créer tâche", icon: "fas fa-tasks" },
    {
      value: "assigner_agent",
      label: "Assigner agent",
      icon: "fas fa-user-tie",
    },
    { value: "changer_statut", label: "Changer statut", icon: "fas fa-flag" },
    {
      value: "ajouter_note",
      label: "Ajouter note",
      icon: "fas fa-sticky-note",
    },
    { value: "envoyer_sms", label: "Envoyer SMS", icon: "fas fa-sms" },
  ];

  const conditionTypes = [
    { value: "age", label: "Âge", operator: ["=", ">", "<", ">=", "<="] },
    { value: "source", label: "Source", operator: ["=", "!="] },
    { value: "statut", label: "Statut", operator: ["=", "!="] },
    {
      value: "email_domaine",
      label: "Domaine email",
      operator: ["contient", "ne_contient_pas"],
    },
  ];

  React.useEffect(() => {
    loadWorkflows();
  }, [filters]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const mockWorkflows = [
        {
          id: "1",
          name: "Accueil Nouveaux Prospects",
          description:
            "Workflow automatique pour accueillir les nouveaux prospects",
          trigger_type: "nouveau_prospect",
          status: "actif",
          created_at: "2025-01-01T10:00:00Z",
          last_execution: "2025-01-20T15:30:00Z",
          executions_count: 156,
          success_rate: 94.2,
          actions: [
            {
              type: "envoyer_email",
              config: { template: "welcome", delay: 0 },
            },
            {
              type: "creer_tache",
              config: { title: "Contacter nouveau prospect", delay: 24 },
            },
          ],
          conditions: [{ field: "source", operator: "!=", value: "spam" }],
        },
        {
          id: "2",
          name: "Rappel Échéances Contrats",
          description: "Rappels automatiques avant échéance des contrats",
          trigger_type: "date_echeance",
          status: "actif",
          created_at: "2025-01-05T09:00:00Z",
          last_execution: "2025-01-20T08:00:00Z",
          executions_count: 89,
          success_rate: 98.9,
          actions: [
            {
              type: "envoyer_email",
              config: { template: "reminder", delay: 0 },
            },
            {
              type: "envoyer_sms",
              config: { message: "Rappel échéance", delay: 7 },
            },
          ],
          conditions: [],
        },
        {
          id: "3",
          name: "Suivi Prospects Inactifs",
          description: "Relance automatique des prospects inactifs",
          trigger_type: "statut_change",
          status: "inactif",
          created_at: "2025-01-10T14:00:00Z",
          last_execution: "2025-01-18T10:00:00Z",
          executions_count: 23,
          success_rate: 87.0,
          actions: [
            {
              type: "assigner_agent",
              config: { agent_id: "senior", delay: 0 },
            },
            {
              type: "creer_tache",
              config: { title: "Relancer prospect", delay: 1 },
            },
          ],
          conditions: [{ field: "age", operator: ">", value: 25 }],
        },
      ];

      const filteredWorkflows = mockWorkflows.filter((workflow) => {
        const matchesStatus =
          !filters.status || workflow.status === filters.status;
        const matchesTrigger =
          !filters.trigger || workflow.trigger_type === filters.trigger;
        const matchesSearch =
          !filters.search ||
          workflow.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          workflow.description
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        return matchesStatus && matchesTrigger && matchesSearch;
      });

      setWorkflows(filteredWorkflows);

      const totalExecutions = mockWorkflows.reduce(
        (sum, w) => sum + w.executions_count,
        0
      );
      setStats({
        total: mockWorkflows.length,
        active: mockWorkflows.filter((w) => w.status === "actif").length,
        inactive: mockWorkflows.filter((w) => w.status === "inactif").length,
        executions: totalExecutions,
      });
    } catch (error) {
      console.error("Error loading workflows:", error);
      setError("Erreur lors du chargement des workflows");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkflow) {
        setWorkflows(
          workflows.map((w) =>
            w.id === editingWorkflow.id
              ? { ...w, ...formData, updated_at: new Date().toISOString() }
              : w
          )
        );
      } else {
        const newWorkflow = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          executions_count: 0,
          success_rate: 0,
          last_execution: null,
        };
        setWorkflows([newWorkflow, ...workflows]);
      }

      setShowModal(false);
      setEditingWorkflow(null);
      resetForm();
    } catch (error) {
      console.error("Error saving workflow:", error);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      trigger_type: "nouveau_prospect",
      trigger_conditions: {},
      actions: [],
      conditions: [],
      status: "actif",
    });
  };

  const handleEdit = (workflow) => {
    setEditingWorkflow(workflow);
    setFormData({
      name: workflow.name,
      description: workflow.description,
      trigger_type: workflow.trigger_type,
      trigger_conditions: workflow.trigger_conditions || {},
      actions: workflow.actions || [],
      conditions: workflow.conditions || [],
      status: workflow.status,
    });
    setShowModal(true);
  };

  const handleDelete = (workflowId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce workflow ?")) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId));
    }
  };

  const toggleWorkflowStatus = (workflowId) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === workflowId
          ? { ...w, status: w.status === "actif" ? "inactif" : "actif" }
          : w
      )
    );
  };

  const openWorkflowBuilder = (workflow = null) => {
    setSelectedWorkflow(workflow);
    if (workflow) {
      setWorkflowBuilder({
        trigger: {
          type: workflow.trigger_type,
          conditions: workflow.trigger_conditions,
        },
        conditions: workflow.conditions || [],
        actions: workflow.actions || [],
      });
    } else {
      setWorkflowBuilder({
        trigger: null,
        conditions: [],
        actions: [],
      });
    }
    setShowWorkflowBuilder(true);
  };

  const addCondition = () => {
    setWorkflowBuilder({
      ...workflowBuilder,
      conditions: [
        ...workflowBuilder.conditions,
        { field: "age", operator: "=", value: "" },
      ],
    });
  };

  const addAction = () => {
    setWorkflowBuilder({
      ...workflowBuilder,
      actions: [
        ...workflowBuilder.actions,
        { type: "envoyer_email", config: {}, delay: 0 },
      ],
    });
  };

  const removeCondition = (index) => {
    setWorkflowBuilder({
      ...workflowBuilder,
      conditions: workflowBuilder.conditions.filter((_, i) => i !== index),
    });
  };

  const removeAction = (index) => {
    setWorkflowBuilder({
      ...workflowBuilder,
      actions: workflowBuilder.actions.filter((_, i) => i !== index),
    });
  };

  const getTriggerIcon = (type) => {
    const trigger = triggerTypes.find((t) => t.value === type);
    return trigger?.icon || "fas fa-bolt";
  };

  const getActionIcon = (type) => {
    const action = actionTypes.find((a) => a.value === type);
    return action?.icon || "fas fa-cog";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                <i className="fas fa-project-diagram mr-3"></i>
                Workflows & Automatisation
              </h1>
              <p className="text-gray-600">
                Créez et gérez vos workflows automatisés pour optimiser vos
                processus
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => openWorkflowBuilder()}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-sitemap mr-2"></i>
                Éditeur Visuel
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-plus mr-2"></i>
                Nouveau Workflow
              </button>
            </div>
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
                <i className="fas fa-project-diagram text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Actifs</p>
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
                <p className="text-gray-500 text-sm font-medium">Inactifs</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <i className="fas fa-pause-circle text-red-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Exécutions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.executions}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
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
                    placeholder="Rechercher un workflow..."
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
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>

                <select
                  value={filters.trigger}
                  onChange={(e) =>
                    setFilters({ ...filters, trigger: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tous les déclencheurs</option>
                  {triggerTypes.map((trigger) => (
                    <option key={trigger.value} value={trigger.value}>
                      {trigger.label}
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
            ) : workflows.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-project-diagram text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500 text-lg mb-2">
                  Aucun workflow trouvé
                </p>
                <p className="text-gray-400">
                  Créez votre premier workflow pour automatiser vos processus
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            {workflow.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              workflow.status === "actif"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {workflow.status === "actif" ? "Actif" : "Inactif"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {workflow.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <i
                              className={`${getTriggerIcon(
                                workflow.trigger_type
                              )} mr-1`}
                            ></i>
                            <span>
                              {
                                triggerTypes.find(
                                  (t) => t.value === workflow.trigger_type
                                )?.label
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-play mr-1"></i>
                            <span>{workflow.executions_count} exécutions</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-chart-line mr-1"></i>
                            <span>{workflow.success_rate}% succès</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">
                            Actions configurées:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {workflow.actions.map((action, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg"
                              >
                                <i
                                  className={`${getActionIcon(
                                    action.type
                                  )} mr-1`}
                                ></i>
                                {
                                  actionTypes.find(
                                    (a) => a.value === action.type
                                  )?.label
                                }
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          Dernière exécution:{" "}
                          {formatDate(workflow.last_execution)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openWorkflowBuilder(workflow)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          title="Éditeur visuel"
                        >
                          <i className="fas fa-sitemap"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(workflow)}
                          className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => toggleWorkflowStatus(workflow.id)}
                          className={`${
                            workflow.status === "actif"
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          } transition-colors duration-200`}
                          title={
                            workflow.status === "actif"
                              ? "Désactiver"
                              : "Activer"
                          }
                        >
                          <i
                            className={`fas ${
                              workflow.status === "actif"
                                ? "fa-pause"
                                : "fa-play"
                            }`}
                          ></i>
                        </button>
                        <button
                          onClick={() => handleDelete(workflow.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Supprimer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">
                        Créé le {formatDate(workflow.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingWorkflow
                      ? "Modifier le workflow"
                      : "Nouveau workflow"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingWorkflow(null);
                      resetForm();
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
                      Nom du workflow *
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
                      placeholder="Ex: Accueil Nouveaux Prospects"
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
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
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
                    placeholder="Décrivez votre workflow..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Déclencheur
                  </label>
                  <select
                    name="trigger_type"
                    value={formData.trigger_type}
                    onChange={(e) =>
                      setFormData({ ...formData, trigger_type: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {triggerTypes.map((trigger) => (
                      <option key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Configuration avancée
                  </h3>
                  <p className="text-sm text-gray-500">
                    Utilisez l'éditeur visuel pour configurer les conditions et
                    actions de manière détaillée.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      openWorkflowBuilder();
                    }}
                    className="mt-3 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                  >
                    <i className="fas fa-sitemap mr-2"></i>
                    Ouvrir l'éditeur visuel
                  </button>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingWorkflow(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {editingWorkflow ? "Mettre à jour" : "Créer le workflow"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showWorkflowBuilder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    <i className="fas fa-sitemap mr-2"></i>
                    Éditeur Visuel de Workflow
                  </h2>
                  <button
                    onClick={() => setShowWorkflowBuilder(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-xl p-6 min-h-[500px]">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Canvas du Workflow
                      </h3>

                      <div className="space-y-6">
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                          <div className="flex items-center mb-2">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                              <i className="fas fa-bolt text-purple-600"></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Déclencheur
                              </h4>
                              <p className="text-sm text-gray-500">
                                {workflowBuilder.trigger
                                  ? triggerTypes.find(
                                      (t) =>
                                        t.value === workflowBuilder.trigger.type
                                    )?.label
                                  : "Sélectionnez un déclencheur"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {workflowBuilder.conditions.length > 0 && (
                          <div className="flex justify-center">
                            <div className="w-px h-8 bg-gray-300"></div>
                          </div>
                        )}

                        {workflowBuilder.conditions.map((condition, index) => (
                          <div key={index}>
                            <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                                    <i className="fas fa-question-circle text-yellow-600"></i>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      Condition
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {condition.field} {condition.operator}{" "}
                                      {condition.value}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeCondition(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                            {index < workflowBuilder.conditions.length - 1 && (
                              <div className="flex justify-center">
                                <div className="w-px h-8 bg-gray-300"></div>
                              </div>
                            )}
                          </div>
                        ))}

                        {(workflowBuilder.conditions.length > 0 ||
                          workflowBuilder.actions.length > 0) && (
                          <div className="flex justify-center">
                            <div className="w-px h-8 bg-gray-300"></div>
                          </div>
                        )}

                        {workflowBuilder.actions.map((action, index) => (
                          <div key={index}>
                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <i
                                      className={`${getActionIcon(
                                        action.type
                                      )} text-green-600`}
                                    ></i>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      Action
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {
                                        actionTypes.find(
                                          (a) => a.value === action.type
                                        )?.label
                                      }
                                      {action.delay > 0 &&
                                        ` (délai: ${action.delay}h)`}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeAction(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                            {index < workflowBuilder.actions.length - 1 && (
                              <div className="flex justify-center">
                                <div className="w-px h-8 bg-gray-300"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Ajouter une Condition
                      </h3>
                      <button
                        onClick={addCondition}
                        className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Condition IF/THEN
                      </button>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Ajouter une Action
                      </h3>
                      <div className="space-y-2">
                        {actionTypes.map((action) => (
                          <button
                            key={action.value}
                            onClick={addAction}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                          >
                            <i
                              className={`${action.icon} text-gray-600 mr-3`}
                            ></i>
                            <span className="text-sm">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Historique d'Exécution
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aujourd'hui</span>
                          <span className="text-green-600">12 succès</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hier</span>
                          <span className="text-green-600">8 succès</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cette semaine</span>
                          <span className="text-red-600">2 échecs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                  <button
                    onClick={() => setShowWorkflowBuilder(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i className="fas fa-save mr-2"></i>
                    Sauvegarder le Workflow
                  </button>
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