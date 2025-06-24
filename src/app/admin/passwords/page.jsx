"use client";
import React from "react";

function MainComponent() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [showPasswords, setShowPasswords] = React.useState({});
  const [showSecurityWarning, setShowSecurityWarning] = React.useState(true);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des utilisateurs: ${response.status}`
        );
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const generatePasswords = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate-passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users || []);
      setSuccess(
        `${data.users?.length || 0} mots de passe générés avec succès`
      );
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const copyToClipboard = async (text, type = "mot de passe") => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${type} copié dans le presse-papiers`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError("Erreur lors de la copie");
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Email", "Prénom", "Nom", "Rôle", "Mot de passe"],
      ...users.map((user) => [
        user.email,
        user.first_name || "",
        user.last_name || "",
        user.role || "",
        user.new_password || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mots_de_passe_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const printPasswords = () => {
    const printContent = `
      <html>
        <head>
          <title>Mots de passe utilisateurs - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Mots de passe utilisateurs</h1>
            <p>Généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>
          </div>
          <div class="warning">
            <strong>⚠️ CONFIDENTIEL:</strong> Ce document contient des mots de passe en clair. À manipuler avec précaution.
          </div>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom complet</th>
                <th>Rôle</th>
                <th>Mot de passe</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (user) => `
                <tr>
                  <td>${user.email}</td>
                  <td>${user.first_name || ""} ${user.last_name || ""}</td>
                  <td>${user.role || ""}</td>
                  <td><strong>${user.new_password || "Non généré"}</strong></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return <></>;
}

export default MainComponent;