async function handler() {
  const session = getSession();

  if (!session || !session.user) {
    return { error: "Non authentifié" };
  }

  // Vérifier que l'utilisateur est super_admin
  const currentUserResult = await sql`
    SELECT role FROM users WHERE id = ${session.user.id}
  `;

  if (
    !currentUserResult.length ||
    currentUserResult[0].role !== "super_admin"
  ) {
    return {
      error:
        "Accès refusé. Seuls les super_admin peuvent générer des mots de passe.",
    };
  }

  // Récupérer tous les utilisateurs actifs
  const users = await sql`
    SELECT id, email, first_name, last_name, role, department 
    FROM users 
    WHERE is_active = true
    ORDER BY role, last_name, first_name
  `;

  if (!users.length) {
    return { error: "Aucun utilisateur actif trouvé" };
  }

  // Fonction pour générer un mot de passe sécurisé
  function generateSecurePassword(length = 12) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    // S'assurer qu'on a au moins un caractère de chaque type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Compléter avec des caractères aléatoires
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Mélanger le mot de passe
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  // Fonction pour hasher un mot de passe (simple SHA-256 pour cet exemple)
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const userPasswords = [];
  const updateQueries = [];

  // Générer les mots de passe pour chaque utilisateur
  for (const user of users) {
    const plainPassword = generateSecurePassword();
    const hashedPassword = await hashPassword(plainPassword);

    userPasswords.push({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      password: plainPassword,
    });

    updateQueries.push(
      sql`UPDATE users SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP WHERE id = ${user.id}`
    );
  }

  try {
    // Exécuter toutes les mises à jour en transaction
    await sql.transaction(updateQueries);

    // Enregistrer l'action dans l'audit log
    await sql`
      INSERT INTO audit_log (user_id, action, module, resource_type, details) 
      VALUES (${
        session.user.id
      }, 'bulk_password_generation', 'user_management', 'users', 
              ${JSON.stringify({
                users_count: users.length,
                generated_at: new Date().toISOString(),
              })})
    `;

    return {
      success: true,
      message: `Mots de passe générés pour ${users.length} utilisateurs`,
      users: userPasswords,
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erreur lors de la génération des mots de passe:", error);
    return {
      error: "Erreur lors de la génération des mots de passe: " + error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}