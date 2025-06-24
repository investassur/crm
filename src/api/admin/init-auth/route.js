async function handler() {
  // Pas besoin de session pour l'initialisation initiale
  // const session = getSession();

  try {
    // Récupérer tous les utilisateurs du CRM
    const users = await sql`
      SELECT id, email, first_name, last_name, role, department
      FROM users 
      WHERE is_active = true
      ORDER BY role, last_name, first_name
    `;

    if (!users.length) {
      return { error: "Aucun utilisateur trouvé dans la table users" };
    }

    const results = [];
    const defaultPassword = "PREMUNIA2024!";

    for (const user of users) {
      try {
        // Vérifier si l'utilisateur existe déjà dans auth_users
        const existingAuthUser = await sql`
          SELECT id FROM auth_users WHERE email = ${user.email}
        `;

        let authUserId;

        if (existingAuthUser.length > 0) {
          authUserId = existingAuthUser[0].id;

          // Vérifier si le compte credentials existe déjà
          const existingAccount = await sql`
            SELECT id FROM auth_accounts 
            WHERE "userId" = ${authUserId} AND provider = 'credentials'
          `;

          if (existingAccount.length > 0) {
            results.push({
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              department: user.department,
              status: "existe_deja",
              password: "Déjà configuré",
              message: "Compte NextAuth déjà existant",
            });
            continue;
          }
        } else {
          // Créer l'utilisateur dans auth_users
          const newAuthUser = await sql`
            INSERT INTO auth_users (name, email, "emailVerified")
            VALUES (${user.first_name + " " + user.last_name}, ${
            user.email
          }, NOW())
            RETURNING id
          `;
          authUserId = newAuthUser[0].id;
        }

        // Créer le compte credentials
        await sql`
          INSERT INTO auth_accounts ("userId", type, provider, "providerAccountId", password)
          VALUES (${authUserId}, 'credentials', 'credentials', ${user.email}, ${defaultPassword})
        `;

        results.push({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          department: user.department,
          status: "cree",
          password: defaultPassword,
          message: "Compte NextAuth créé avec succès",
        });
      } catch (userError) {
        console.error(`Erreur pour l'utilisateur ${user.email}:`, userError);
        results.push({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          department: user.department,
          status: "erreur",
          password: "N/A",
          message: `Erreur: ${userError.message}`,
        });
      }
    }

    // Statistiques
    const summary = {
      total_users: users.length,
      accounts_created: results.filter((r) => r.status === "cree").length,
      accounts_existing: results.filter((r) => r.status === "existe_deja")
        .length,
      errors: results.filter((r) => r.status === "erreur").length,
    };

    return {
      success: true,
      message: `Initialisation terminée pour ${users.length} utilisateurs`,
      accounts: results,
      summary: summary,
      default_password: defaultPassword,
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
    return {
      error: "Erreur lors de l'initialisation des comptes NextAuth",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}