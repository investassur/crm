"use client";
import React from "react";

function MainComponent() {
  const [activeTable, setActiveTable] = React.useState(null);

  const tables = [
    {
      name: "campaigns",
      description: "Gestion des campagnes marketing",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        {
          name: "name",
          type: "varchar(200)",
          description: "Nom de la campagne",
        },
        {
          name: "description",
          type: "text",
          description: "Description détaillée",
        },
        {
          name: "campaign_type",
          type: "varchar(50)",
          description: "Type de campagne",
        },
        {
          name: "status",
          type: "varchar(50)",
          description: "Statut (brouillon, active, terminée)",
        },
        { name: "start_date", type: "timestamp", description: "Date de début" },
        { name: "end_date", type: "timestamp", description: "Date de fin" },
        {
          name: "target_audience",
          type: "text",
          description: "Audience cible",
        },
        {
          name: "created_by",
          type: "uuid",
          description: "Créé par (référence users)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "contacts",
      description: "Base de données des contacts",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        { name: "first_name", type: "varchar(100)", description: "Prénom" },
        {
          name: "last_name",
          type: "varchar(100)",
          description: "Nom de famille",
        },
        { name: "email", type: "varchar(255)", description: "Adresse email" },
        {
          name: "phone",
          type: "varchar(20)",
          description: "Numéro de téléphone",
        },
        { name: "company", type: "varchar(200)", description: "Entreprise" },
        { name: "position", type: "varchar(100)", description: "Poste occupé" },
        { name: "notes", type: "text", description: "Notes additionnelles" },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "contracts",
      description: "Gestion des contrats",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        {
          name: "prospect_id",
          type: "uuid",
          description: "Référence prospect",
        },
        {
          name: "contract_number",
          type: "varchar(100)",
          description: "Numéro de contrat",
        },
        {
          name: "product_type",
          type: "varchar(100)",
          description: "Type de produit",
        },
        {
          name: "premium_amount",
          type: "numeric(10,2)",
          description: "Montant de la prime",
        },
        {
          name: "commission_rate",
          type: "numeric(5,2)",
          description: "Taux de commission",
        },
        {
          name: "commission_amount",
          type: "numeric(10,2)",
          description: "Montant de commission",
        },
        {
          name: "status",
          type: "varchar(50)",
          description: "Statut du contrat",
        },
        { name: "start_date", type: "date", description: "Date de début" },
        { name: "end_date", type: "date", description: "Date de fin" },
        { name: "notes", type: "text", description: "Notes" },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "prospects",
      description: "Gestion des prospects",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        { name: "first_name", type: "varchar(100)", description: "Prénom" },
        {
          name: "last_name",
          type: "varchar(100)",
          description: "Nom de famille",
        },
        { name: "email", type: "varchar(255)", description: "Adresse email" },
        {
          name: "phone",
          type: "varchar(20)",
          description: "Numéro de téléphone",
        },
        { name: "age", type: "integer", description: "Âge" },
        {
          name: "status",
          type: "varchar(50)",
          description: "Statut (nouveau, contacté, qualifié)",
        },
        {
          name: "source",
          type: "varchar(100)",
          description: "Source du prospect",
        },
        { name: "notes", type: "text", description: "Notes" },
        {
          name: "assigned_to",
          type: "uuid",
          description: "Assigné à (référence users)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "tasks",
      description: "Gestion des tâches",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        {
          name: "title",
          type: "varchar(200)",
          description: "Titre de la tâche",
        },
        {
          name: "description",
          type: "text",
          description: "Description détaillée",
        },
        { name: "due_date", type: "timestamp", description: "Date d'échéance" },
        {
          name: "priority",
          type: "varchar(20)",
          description: "Priorité (basse, moyenne, haute)",
        },
        {
          name: "status",
          type: "varchar(50)",
          description: "Statut (à faire, en cours, terminé)",
        },
        {
          name: "assigned_to",
          type: "uuid",
          description: "Assigné à (référence users)",
        },
        { name: "prospect_id", type: "uuid", description: "Lié au prospect" },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "users",
      description: "Utilisateurs du système",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        {
          name: "email",
          type: "varchar(255)",
          description: "Adresse email (unique)",
        },
        {
          name: "password_hash",
          type: "varchar(255)",
          description: "Mot de passe hashé",
        },
        { name: "first_name", type: "varchar(100)", description: "Prénom" },
        {
          name: "last_name",
          type: "varchar(100)",
          description: "Nom de famille",
        },
        {
          name: "role",
          type: "varchar(50)",
          description: "Rôle (agent, manager, admin)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "email_templates",
      description: "Modèles d'emails",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        { name: "name", type: "varchar(200)", description: "Nom du modèle" },
        {
          name: "subject",
          type: "varchar(500)",
          description: "Sujet de l'email",
        },
        { name: "body", type: "text", description: "Corps de l'email" },
        {
          name: "template_type",
          type: "varchar(100)",
          description: "Type de modèle",
        },
        {
          name: "created_by",
          type: "uuid",
          description: "Créé par (référence users)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "workflows",
      description: "Workflows automatisés",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        { name: "name", type: "varchar(200)", description: "Nom du workflow" },
        { name: "description", type: "text", description: "Description" },
        {
          name: "trigger_event",
          type: "varchar(100)",
          description: "Événement déclencheur",
        },
        { name: "conditions", type: "jsonb", description: "Conditions (JSON)" },
        { name: "actions", type: "jsonb", description: "Actions (JSON)" },
        { name: "is_active", type: "boolean", description: "Actif ou non" },
        {
          name: "created_by",
          type: "uuid",
          description: "Créé par (référence users)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
    {
      name: "feature_proposals",
      description: "Propositions de fonctionnalités",
      columns: [
        { name: "id", type: "uuid", description: "Identifiant unique" },
        {
          name: "title",
          type: "varchar(200)",
          description: "Titre de la proposition",
        },
        {
          name: "description",
          type: "text",
          description: "Description détaillée",
        },
        {
          name: "ai_analysis",
          type: "jsonb",
          description: "Analyse IA (JSON)",
        },
        {
          name: "priority_score",
          type: "integer",
          description: "Score de priorité",
        },
        {
          name: "status",
          type: "varchar(50)",
          description: "Statut (nouveau, en cours, terminé)",
        },
        {
          name: "submitted_by",
          type: "uuid",
          description: "Soumis par (référence users)",
        },
        {
          name: "created_at",
          type: "timestamp",
          description: "Date de création",
        },
        {
          name: "updated_at",
          type: "timestamp",
          description: "Date de modification",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <i className="fas fa-database mr-3 text-blue-600"></i>
            Schéma de Base de Données
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de la structure de la base de données du système CRM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
              </div>
              <div className="p-2">
                {tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setActiveTable(table)}
                    className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                      activeTable?.name === table.name
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="font-medium">{table.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {table.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTable ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Table: {activeTable.name}
                  </h2>
                  <p className="text-gray-600">{activeTable.description}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Colonne
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTable.columns.map((column, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {column.name}
                              </code>
                              {column.name === "id" && (
                                <i
                                  className="fas fa-key text-yellow-500 ml-2"
                                  title="Clé primaire"
                                ></i>
                              )}
                              {column.name.endsWith("_id") &&
                                column.name !== "id" && (
                                  <i
                                    className="fas fa-link text-green-500 ml-2"
                                    title="Clé étrangère"
                                  ></i>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                              {column.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {column.description}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <i className="fas fa-table text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une table
                </h3>
                <p className="text-gray-500">
                  Cliquez sur une table dans la liste de gauche pour voir sa
                  structure
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Informations sur la base de données
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Base de données PostgreSQL avec extension UUID</li>
                <li>
                  • {tables.length} tables principales pour le système CRM
                </li>
                <li>• Relations établies avec des clés étrangères</li>
                <li>• Timestamps automatiques pour l'audit des données</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;