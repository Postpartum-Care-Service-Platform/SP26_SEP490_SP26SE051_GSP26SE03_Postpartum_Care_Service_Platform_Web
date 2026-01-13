import type { Role } from '@/types/role';

export function getRoleNameById(roles: Role[], id: number): string | undefined {
  return roles.find((role) => role.id === id)?.roleName;
}

export function getRoleById(roles: Role[], id: number): Role | undefined {
  return roles.find((role) => role.id === id);
}

export function getRoleByName(roles: Role[], name: string): Role | undefined {
  return roles.find((role) => role.roleName === name);
}

export function getRoleDescription(roles: Role[], name: string): string | undefined {
  return roles.find((role) => role.roleName === name)?.description;
}

