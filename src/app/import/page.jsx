"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("prospects");
  const [dragActive, setDragActive] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [previewData, setPreviewData] = React.useState([]);
  const [importResult, setImportResult] = React.useState(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const importTypes = [
    {
      id: "prospects",
      label: "Prospects/Contacts",
      icon: "fas fa-user-plus",
      color: "purple",
      description:
        "Contact, Ville, Création, Signature, Origine, Statut, Attribution",
    },
    {
      id: "contrats",
      label: "Contrats",
      icon: "fas fa-file-contract",
      color: "green",
      description:
        "Nom et Prénom, Ville, Signature, Date d'effet, Fin de contrat, N° de contrat, Compagnie, cotisations, commissions, etc.",
    },
  ];

  const sourceOptions = [
    "Back-office",
    "client CKS",
    "FB AZ",
    "fb_sync",
    "PREMUNIA",
    "FB",
    "Prescription",
    "Repêchage",
    "Site web",
    "TikTok",
    "TNS FB",
  ];

  React.useEffect(() => {
    loadImportHistory();
  }, []);

  const loadImportHistory = () => {
    const mockHistory = [
      {
        id: 1,
        type: "prospects",
        filename: "prospects_janvier_2025.csv",
        date: "2025-01-20T10:30:00Z",
        status: "success",
        imported: 150,
        errors: 5,
        total: 155,
      },
      {
        id: 2,
        type: "contrats",
        filename: "contrats_q4_2024.xlsx",
        date: "2025-01-18T14:15:00Z",
        status: "success",
        imported: 89,
        errors: 2,
        total: 91,
      },
      {
        id: 3,
        type: "contacts",
        filename: "contacts_export.csv",
        date: "2025-01-15T09:45:00Z",
        status: "error",
        imported: 0,
        errors: 45,
        total: 45,
      },
    ];
    setImportHistory(mockHistory);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
      setError("Veuillez sélectionner un fichier CSV ou Excel");
      return;
    }

    setUploadedFile(file);
    setError(null);
    setSuccess(null);
    setImportResult(null);

    // Convertir le fichier en base64 pour l'envoi
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;

      // Prévisualiser les données
      try {
        const text =
          typeof base64Data === "string" ? atob(base64Data.split(",")[1]) : "";
        const lines = text.split("\n").slice(0, 6); // Première ligne + 5 exemples
        if (lines.length > 1) {
          const headers = lines[0]
            .split(/[,;\t]/)
            .map((h) => h.trim().replace(/"/g, ""));
          const data = lines
            .slice(1)
            .map((line, index) => {
              const values = line
                .split(/[,;\t]/)
                .map((v) => v.trim().replace(/"/g, ""));
              const row = { _index: index };
              headers.forEach((header, i) => {
                row[header] = values[i] || "";
              });
              return row;
            })
            .filter((row) => Object.values(row).some((val) => val !== ""));

          setPreviewData(data);
        }
      } catch (err) {
        console.log("Erreur de prévisualisation:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const startImport = async () => {
    if (!uploadedFile) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;

        const response = await fetch("/api/import/excel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Data: base64Data,
            type: activeTab,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de l'import: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setImportResult(result);
        setSuccess(
          `Import réussi ! ${result.success} enregistrements importés.`
        );

        // Reset après succès
        setTimeout(() => {
          setUploadedFile(null);
          setPreviewData([]);
          setImportResult(null);
        }, 5000);
      };
      reader.readAsDataURL(uploadedFile);
    } catch (err) {
      console.error("Erreur d'import:", err);
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = (type) => {
    let headers, sampleData;

    if (type === "prospects") {
      headers = "Contact,Ville,Création,Signature,Origine,Statut,Attribution";
      sampleData =
        "Jean Dupont,Paris,2025-01-01,2025-01-15,Site web,nouveau,Commercial A";
    } else {
      headers =
        "Nom et Prénom,Ville,Signature,Date d'effet,Fin de contrat,N° de contrat,Compagnie,cotisation mensuelle,Cotisation annuelle,commission mensuelle,commission annuelle,Commission annuel 1ére année,Année récurrente,Année recu,Statut,Attribution,pays,Charge,Dépenses";
      sampleData =
        "Jean Dupont,Paris,2025-01-01,2025-01-01,2025-12-31,CTR-2025-001,Assurance ABC,100,1200,15,180,200,150,180,actif,Commercial A,France,Agent,50";
    }

    const csvContent = `${headers}\n${sampleData}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template_${type}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                <i className="fas fa-upload mr-3"></i>
                Import de Données Excel
              </h1>
              <p className="text-gray-600">
                Importez vos prospects/contacts et contrats depuis des fichiers
                Excel avec mapping automatique
              </p>
            </div>
          </div>
        </div>

        {/* Sources disponibles */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-medium mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            Sources disponibles pour les prospects
          </h3>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map((source) => (
              <span
                key={source}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Type d'import
              </h3>
              <div className="space-y-3">
                {importTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                      activeTab === type.id
                        ? `bg-gradient-to-r from-${type.color}-100 to-${type.color}-50 text-${type.color}-700 border-${type.color}-200`
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <i className={`${type.icon} mr-3`}></i>
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Templates Excel
                </h4>
                <div className="space-y-2">
                  {importTypes.map((type) => (
                    <button
                      key={`template-${type.id}`}
                      onClick={() => downloadTemplate(type.id)}
                      className="w-full flex items-center justify-between p-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    >
                      <span>
                        <i className="fas fa-download mr-2"></i>
                        {type.label}
                      </span>
                      <i className="fas fa-external-link-alt text-xs"></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Import de {importTypes.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  Glissez-déposez votre fichier Excel ou cliquez pour
                  sélectionner
                </p>
              </div>

              <div className="p-6">
                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="mb-4">
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Glissez-déposez votre fichier Excel ici
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Formats supportés: CSV, Excel (.xlsx, .xls)
                    </p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
                    >
                      <i className="fas fa-folder-open mr-2"></i>
                      Sélectionner un fichier Excel
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center">
                        <i className="fas fa-file-excel text-green-600 text-xl mr-3"></i>
                        <div>
                          <p className="font-medium text-green-800">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-green-600">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setPreviewData([]);
                          setImportResult(null);
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors duration-200"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    {previewData.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Aperçu des données (5 premières lignes)
                        </h3>
                        <div className="overflow-x-auto border border-gray-200 rounded-xl">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(previewData[0])
                                  .filter((key) => key !== "_index")
                                  .map((header) => (
                                    <th
                                      key={header}
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      {header}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {previewData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  {Object.keys(row)
                                    .filter((key) => key !== "_index")
                                    .map((key) => (
                                      <td
                                        key={key}
                                        className="px-4 py-3 text-sm text-gray-900"
                                      >
                                        {row[key]}
                                      </td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <button
                        onClick={startImport}
                        disabled={isImporting}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {isImporting ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Import en cours...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload mr-2"></i>
                            Démarrer l'import
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                    <div className="flex items-start">
                      <i className="fas fa-exclamation-circle text-red-600 mt-1 mr-3"></i>
                      <div>
                        <h3 className="text-red-800 font-medium mb-1">
                          Erreur
                        </h3>
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
                    <div className="flex items-start">
                      <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                      <div>
                        <h3 className="text-green-800 font-medium mb-1">
                          Succès
                        </h3>
                        <p className="text-green-700 text-sm">{success}</p>
                      </div>
                    </div>
                  </div>
                )}

                {importResult && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <h3 className="text-blue-800 font-medium mb-3">
                      <i className="fas fa-chart-bar mr-2"></i>
                      Résultat de l'import
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {importResult.success || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Importés avec succès
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {importResult.errors?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Erreurs</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {importResult.type || activeTab}
                        </div>
                        <div className="text-sm text-gray-600">
                          Type de données
                        </div>
                      </div>
                    </div>

                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-red-800 font-medium mb-2">
                          Erreurs détaillées:
                        </h4>
                        <ul className="space-y-1 max-h-32 overflow-y-auto">
                          {importResult.errors
                            .slice(0, 10)
                            .map((error, index) => (
                              <li key={index} className="text-sm text-red-700">
                                • {error}
                              </li>
                            ))}
                          {importResult.errors.length > 10 && (
                            <li className="text-sm text-red-600 italic">
                              ... et {importResult.errors.length - 10} autres
                              erreurs
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;