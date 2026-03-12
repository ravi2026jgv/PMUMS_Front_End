export const Roles = {
  SUPERADMIN: 'ROLE_SUPERADMIN',
  ADMIN: 'ROLE_ADMIN',
  SAMBHAG_MANAGER: 'ROLE_SAMBHAG_MANAGER',
  DISTRICT_MANAGER: 'ROLE_DISTRICT_MANAGER',
  BLOCK_MANAGER: 'ROLE_BLOCK_MANAGER',
  USER: 'ROLE_USER',
};

export const normalizeRole = (role) => {
  if (!role) return '';
  return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
};

export const hasRole = (user, role) => {
  return normalizeRole(user?.role) === normalizeRole(role);
};

export const hasAnyRole = (user, roles = []) => {
  const currentRole = normalizeRole(user?.role);
  return roles.map(normalizeRole).includes(currentRole);
};

export const isSuperAdmin = (user) => hasRole(user, Roles.SUPERADMIN);
export const isAdmin = (user) => hasRole(user, Roles.ADMIN);
export const isAdminOrSuperAdmin = (user) =>
  hasAnyRole(user, [Roles.SUPERADMIN, Roles.ADMIN]);