"use client";
import React from "react";

function MainComponent() {
  const [tasks, setTasks] = React.useState([]);
  const [prospects, setProspects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [tasksPerPage] = React.useState(10);

  // États pour le formulaire de tâche
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  const [taskForm, setTaskForm] = React.useState({
    title: "",
    description: "",
    prospect_id: "",
    assigned_user: "",
    priority: "medium",
    status: "todo",
    due_date: "",
    notes: "",
  });

  // États pour le calendrier
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Charger les données au démarrage
  React.useEffect(() => {
    loadTasks();
    loadProspects();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
      setError("Impossible de charger les tâches");
    } finally {
      setLoading(false);
    }
  };

  const loadProspects = async () => {
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
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingTask ? "/api/tasks/update" : "/api/tasks/create";
      const body = editingTask ? { ...taskForm, id: editingTask.id } : taskForm;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      await loadTasks();
      resetTaskForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      prospect_id: "",
      assigned_user: "",
      priority: "medium",
      status: "todo",
      due_date: "",
      notes: "",
    });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      prospect_id: task.prospect_id || "",
      assigned_user: task.assigned_user || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      notes: task.notes || "",
    });
    setShowTaskForm(true);
  };

  // Filtrage et recherche des tâches
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigned_user?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Statistiques
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  // Fonctions utilitaires
  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: "bg-blue-100 text-blue-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getProspectName = (prospectId) => {
    const prospect = prospects.find((p) => p.id === prospectId);
    return prospect ? `${prospect.first_name} ${prospect.last_name}` : "-";
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      dueDate !== new Date().toISOString().split("T")[0]
    );
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      if (!task.due_date || task.status === "completed") return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gradient-to-b from-purple-600 to-blue-700 text-white flex flex-col shadow-xl min-h-screen">
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
                  className="flex items-center p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200"
                >
                  <i className="fas fa-file-contract w-5 mr-3"></i>
                  Contrats
                </a>
              </li>
              <li>
                <a
                  href="/taches"
                  className="flex items-center p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm"
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

          {/* Échéances à venir */}
          <div className="p-4 border-t border-white/20">
            <h3 className="text-sm font-medium text-white mb-3">
              Échéances à venir
            </h3>
            <div className="space-y-2">
              {getUpcomingTasks()
                .slice(0, 3)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-2 rounded-lg text-xs ${
                      isOverdue(task.due_date)
                        ? "bg-red-500/20 border border-red-400/30"
                        : "bg-yellow-500/20 border border-yellow-400/30"
                    }`}
                  >
                    <div className="font-medium text-white truncate">
                      {task.title}
                    </div>
                    <div className="text-white/70 mt-1">
                      {formatDate(task.due_date)}
                    </div>
                  </div>
                ))}
              {getUpcomingTasks().length === 0 && (
                <p className="text-xs text-white/70">
                  Aucune échéance prochaine
                </p>
              )}
            </div>
          </div>

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
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Gestion des Tâches
                </h2>
                <p className="text-gray-600 mt-1">
                  Organisez et suivez vos tâches
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-calendar mr-2"></i>
                  Calendrier
                </button>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Nouvelle tâche
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
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-right text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total tâches
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-xl">
                    <i className="fas fa-tasks text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      À faire
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.todo}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl">
                    <i className="fas fa-clock text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      En cours
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.in_progress}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-xl">
                    <i className="fas fa-spinner text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Terminées
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.completed}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-xl">
                    <i className="fas fa-check-circle text-white text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une tâche..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                    />
                    <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="todo">À faire</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent"
                  >
                    <option value="all">Toutes les priorités</option>
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tableau des tâches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement des tâches...</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tâche
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prospect
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigné à
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priorité
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Échéance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTasks.map((task) => (
                        <tr
                          key={task.id}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            isOverdue(task.due_date) ? "bg-red-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center mr-2">
                                <i className="fas fa-user text-white text-xs"></i>
                              </div>
                              <span className="text-sm text-gray-900">
                                {getProspectName(task.prospect_id)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.assigned_user || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority === "low"
                                ? "Faible"
                                : task.priority === "medium"
                                ? "Moyenne"
                                : "Élevée"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status === "todo"
                                ? "À faire"
                                : task.status === "in_progress"
                                ? "En cours"
                                : "Terminé"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={
                                isOverdue(task.due_date)
                                  ? "text-red-600 font-medium"
                                  : "text-gray-900"
                              }
                            >
                              {formatDate(task.due_date)}
                              {isOverdue(task.due_date) && (
                                <i className="fas fa-exclamation-triangle ml-1 text-red-500"></i>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                onClick={() => handleEditTask(task)}
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

                {currentTasks.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <i className="fas fa-tasks text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">
                      {filteredTasks.length === 0
                        ? "Aucune tâche trouvée"
                        : "Aucune tâche sur cette page"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de {indexOfFirstTask + 1} à{" "}
                      {Math.min(indexOfLastTask, filteredTasks.length)} sur{" "}
                      {filteredTasks.length} tâches
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Précédent
                      </button>

                      <span className="text-sm text-gray-700 px-4 py-2 bg-white rounded-lg border">
                        Page {currentPage} sur {totalPages}
                      </span>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
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

        {/* Modal formulaire tâche */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
                  </h3>
                  <button
                    onClick={resetTaskForm}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <form onSubmit={handleTaskSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prospect
                    </label>
                    <select
                      value={taskForm.prospect_id}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          prospect_id: e.target.value,
                        })
                      }
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
                      Assigné à
                    </label>
                    <input
                      type="text"
                      value={taskForm.assigned_user}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          assigned_user: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                      placeholder="Nom de l'utilisateur"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                    >
                      <option value="todo">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'échéance
                    </label>
                    <input
                      type="date"
                      value={taskForm.due_date}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, due_date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={taskForm.notes}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetTaskForm}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                  >
                    {loading
                      ? "Sauvegarde..."
                      : editingTask
                      ? "Modifier"
                      : "Créer"}
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