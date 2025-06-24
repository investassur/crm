async function handler() {
  const session = getSession();

  if (!session || !session.user?.email) {
    return { error: "Non authentifié", authenticated: false };
  }

  try {
    const userResult = await sql`
      SELECT id, email, first_name, last_name, role, permissions, is_active
      FROM users 
      WHERE email = ${session.user.email} AND is_active = true
    `;

    if (userResult.length === 0) {
      return { error: "Utilisateur non trouvé", authenticated: false };
    }

    const user = userResult[0];

    const rolePermissionsResult = await sql`
      SELECT module, permissions
      FROM role_permissions 
      WHERE role = ${user.role}
    `;

    const modulePermissions = {};
    rolePermissionsResult.forEach((rp) => {
      modulePermissions[rp.module] = rp.permissions;
    });

    const userPermissions = user.permissions || {};

    const finalPermissions = {
      ...modulePermissions,
      ...userPermissions,
    };

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      permissions: finalPermissions,
    };
  } catch (error) {
    console.error("Permission check error:", error);
    return {
      error: "Erreur lors de la vérification des permissions",
      authenticated: false,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}