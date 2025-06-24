"use client";
import React from "react";

function MainComponent() {
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewTemplate, setPreviewTemplate] = React.useState(null);
  const [filters, setFilters] = React.useState({
    category: "",
    search: "",
  });
  const [stats, setStats] = React.useState({
    total: 0,
    bienvenue: 0,
    relance: 0,
    devis: 0,
  });

  const [formData, setFormData] = React.useState({
    name: "",
    subject: "",
    category: "bienvenue",
    content: "",
    variables: [],
    is_active: true,
  });

  const [previewData, setPreviewData] = React.useState({
    nom: "Jean Dupont",
    produit: "Assurance Auto Premium",
    entreprise: "AssuranceXYZ",
    montant: "1 250€",
    date: "15 janvier 2025",
  });

  const categories = [
    {
      value: "bienvenue",
      label: "Bienvenue",
      icon: "fas fa-hand-wave",
      color: "green",
    },
    {
      value: "relance",
      label: "Relance",
      icon: "fas fa-bell",
      color: "orange",
    },
    {
      value: "devis",
      label: "Devis",
      icon: "fas fa-file-invoice",
      color: "blue",
    },
    {
      value: "renouvellement",
      label: "Renouvellement",
      icon: "fas fa-sync",
      color: "purple",
    },
    {
      value: "promotion",
      label: "Promotion",
      icon: "fas fa-tag",
      color: "red",
    },
  ];

  const commonVariables = [
    { key: "{{nom}}", description: "Nom du prospect/client" },
    { key: "{{prenom}}", description: "Prénom du prospect/client" },
    { key: "{{email}}", description: "Email du prospect/client" },
    { key: "{{produit}}", description: "Nom du produit" },
    { key: "{{entreprise}}", description: "Nom de l'entreprise" },
    { key: "{{montant}}", description: "Montant du devis/contrat" },
    { key: "{{date}}", description: "Date actuelle" },
    { key: "{{agent}}", description: "Nom de l'agent assigné" },
  ];

  React.useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const mockTemplates = [
        {
          id: "1",
          name: "Email de Bienvenue Standard",
          subject: "Bienvenue chez {{entreprise}}, {{nom}} !",
          category: "bienvenue",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Bienvenue {{nom}} !</h1>
            <p>Nous sommes ravis de vous accueillir chez {{entreprise}}.</p>
            <p>Votre conseiller {{agent}} vous contactera prochainement pour finaliser votre dossier {{produit}}.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Vos avantages :</h3>
              <ul>
                <li>Conseiller dédié</li>
                <li>Tarifs préférentiels</li>
                <li>Service client 24/7</li>
              </ul>
            </div>
            <p>Cordialement,<br>L'équipe {{entreprise}}</p>
          </div>`,
          variables: ["{{nom}}", "{{entreprise}}", "{{agent}}", "{{produit}}"],
          is_active: true,
          created_at: "2025-01-01T10:00:00Z",
          usage_count: 45,
        },
        {
          id: "2",
          name: "Relance Devis en Attente",
          subject: "Votre devis {{produit}} vous attend - {{nom}}",
          category: "relance",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f59e0b;">N'oubliez pas votre devis !</h1>
            <p>Bonjour {{nom}},</p>
            <p>Votre devis pour {{produit}} d'un montant de {{montant}} est toujours disponible.</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3>⏰ Offre limitée dans le temps</h3>
              <p>Ce tarif préférentiel expire le {{date}}.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accepter le devis</a>
            </div>
            <p>Besoin d'aide ? Contactez {{agent}} directement.</p>
          </div>`,
          variables: [
            "{{nom}}",
            "{{produit}}",
            "{{montant}}",
            "{{date}}",
            "{{agent}}",
          ],
          is_active: true,
          created_at: "2025-01-02T14:00:00Z",
          usage_count: 32,
        },
        {
          id: "3",
          name: "Confirmation de Devis",
          subject: "Votre devis {{produit}} - Référence #{{reference}}",
          category: "devis",
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3b82f6;">Votre devis personnalisé</h1>
            <p>Bonjour {{nom}},</p>
            <p>Voici votre devis personnalisé pour {{produit}}.</p>
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>📋 Détails du devis</h3>
              <p><strong>Produit :</strong> {{produit}}</p>
              <p><strong>Montant :</strong> {{montant}}</p>
              <p><strong>Validité :</strong> Jusqu'au {{date}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">Télécharger le PDF</a>
              <a href="#" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Souscrire maintenant</a>
            </div>
          </div>`,
          variables: [
            "{{nom}}",
            "{{produit}}",
            "{{montant}}",
            "{{date}}",
            "{{reference}}",
          ],
          is_active: true,
          created_at: "2025-01-03T09:00:00Z",
          usage_count: 28,
        },
      ];

      const filteredTemplates = mockTemplates.filter((template) => {
        const matchesCategory =
          !filters.category || template.category === filters.category;
        const matchesSearch =
          !filters.search ||
          template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          template.subject.toLowerCase().includes(filters.search.toLowerCase());

        return matchesCategory && matchesSearch;
      });

      setTemplates(filteredTemplates);

      setStats({
        total: mockTemplates.length,
        bienvenue: mockTemplates.filter((t) => t.category === "bienvenue")
          .length,
        relance: mockTemplates.filter((t) => t.category === "relance").length,
        devis: mockTemplates.filter((t) => t.category === "devis").length,
      });
    } catch (error) {
      console.error("Error loading templates:", error);
      setError("Erreur lors du chargement des templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const variables = extractVariables(
        formData.content + " " + formData.subject
      );

      if (editingTemplate) {
        setTemplates(
          templates.map((t) =>
            t.id === editingTemplate.id
              ? {
                  ...t,
                  ...formData,
                  variables,
                  updated_at: new Date().toISOString(),
                }
              : t
          )
        );
      } else {
        const newTemplate = {
          id: Date.now().toString(),
          ...formData,
          variables,
          created_at: new Date().toISOString(),
          usage_count: 0,
        };
        setTemplates([newTemplate, ...templates]);
      }

      setShowModal(false);
      setEditingTemplate(null);
      resetForm();
    } catch (error) {
      console.error("Error saving template:", error);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const extractVariables = (text) => {
    const matches = text.match(/\{\{[^}]+\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      category: "bienvenue",
      content: "",
      variables: [],
      is_active: true,
    });
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      category: template.category,
      content: template.content,
      variables: template.variables,
      is_active: template.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = (templateId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
    }
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const renderPreview = (template) => {
    let content = template.content;
    let subject = template.subject;

    Object.entries(previewData).forEach(([key, value]) => {
      const variable = `{{${key}}}`;
      content = content.replace(new RegExp(variable, "g"), value);
      subject = subject.replace(new RegExp(variable, "g"), value);
    });

    return { content, subject };
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('textarea[name="content"]');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + variable + after;

      setFormData({ ...formData, content: newText });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + variable.length,
          start + variable.length
        );
      }, 0);
    }
  };

  const getCategoryColor = (category) => {
    const categoryConfig = categories.find((c) => c.value === category);
    return categoryConfig?.color || "gray";
  };

  const getCategoryIcon = (category) => {
    const categoryConfig = categories.find((c) => c.value === category);
    return categoryConfig?.icon || "fas fa-envelope";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                <i className="fas fa-envelope-open-text mr-3"></i>
                Templates Email
              </h1>
              <p className="text-gray-600">
                Créez et gérez vos modèles d'emails personnalisés
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouveau Template
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
                <i className="fas fa-envelope text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Bienvenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.bienvenue}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <i className="fas fa-hand-wave text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Relance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.relance}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <i className="fas fa-bell text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Devis</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.devis}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <i className="fas fa-file-invoice text-blue-600 text-xl"></i>
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
                    placeholder="Rechercher un template..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                  />
                </div>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
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
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-envelope-open-text text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500 text-lg mb-2">
                  Aucun template trouvé
                </p>
                <p className="text-gray-400">
                  Créez votre premier template pour commencer
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className={`bg-${getCategoryColor(
                            template.category
                          )}-100 p-2 rounded-lg mr-3`}
                        >
                          <i
                            className={`${getCategoryIcon(
                              template.category
                            )} text-${getCategoryColor(template.category)}-600`}
                          ></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {template.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(
                              template.category
                            )}-100 text-${getCategoryColor(
                              template.category
                            )}-800 mt-1`}
                          >
                            {
                              categories.find(
                                (c) => c.value === template.category
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePreview(template)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1"
                          title="Prévisualiser"
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="text-purple-600 hover:text-purple-800 transition-colors duration-200 p-1"
                          title="Modifier"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                          title="Supprimer"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Sujet :</p>
                      <p className="text-sm text-gray-700 truncate">
                        {template.subject}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Variables utilisées :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables
                          .slice(0, 3)
                          .map((variable, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                            >
                              {variable}
                            </span>
                          ))}
                        {template.variables.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{template.variables.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Utilisé {template.usage_count} fois</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          template.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTemplate
                      ? "Modifier le template"
                      : "Nouveau template"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingTemplate(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du template *
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
                          placeholder="Ex: Email de bienvenue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet de l'email *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Bienvenue chez {{entreprise}}, {{nom}} !"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu de l'email *
                      </label>
                      <textarea
                        name="content"
                        required
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={12}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                        placeholder="Contenu HTML de votre email..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_active"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Template actif
                      </label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingTemplate(null);
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
                        {editingTemplate
                          ? "Mettre à jour"
                          : "Créer le template"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="lg:w-1/3 bg-gray-50 p-6 border-l border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-code mr-2"></i>
                    Variables disponibles
                  </h3>

                  <div className="space-y-3 mb-6">
                    {commonVariables.map((variable, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-purple-600">
                            {variable.key}
                          </code>
                          <button
                            type="button"
                            onClick={() => insertVariable(variable.key)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Insérer"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      <i className="fas fa-lightbulb mr-1"></i>
                      Conseils
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Utilisez du HTML pour le formatage</li>
                      <li>• Les variables sont remplacées automatiquement</li>
                      <li>• Testez toujours avec la prévisualisation</li>
                      <li>• Gardez vos emails courts et clairs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPreview && previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    <i className="fas fa-eye mr-2"></i>
                    Prévisualisation - {previewTemplate.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setPreviewTemplate(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Données de test
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(previewData).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setPreviewData({
                              ...previewData,
                              [key]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-2/3 p-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Sujet :
                    </h3>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm">
                        {renderPreview(previewTemplate).subject}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Contenu :
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderPreview(previewTemplate).content,
                        }}
                      />
                    </div>
                  </div>
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