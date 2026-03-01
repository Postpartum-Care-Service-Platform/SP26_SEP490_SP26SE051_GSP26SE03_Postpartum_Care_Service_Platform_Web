import type { Account } from '@/types/account';
import type { FamilyProfile } from '@/types/family-profile';

import type { Patient } from './patientTypes';

export function calculateAge(dateOfBirth: string | null | undefined): number {
  if (!dateOfBirth) return 0;

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(age, 0);
}

export function mapGender(gender: string | null | undefined): 'Male' | 'Female' | 'N/A' {
  if (!gender) {
    return 'N/A';
  }
  const normalized = gender.toLowerCase().trim();
  if (normalized === 'male' || normalized === 'nam') {
    return 'Male';
  }
  if (normalized === 'female' || normalized === 'nu' || normalized === 'nữ') {
    return 'Female';
  }
  return 'N/A';
}

export function mapFamilyProfileToPatient(profile: FamilyProfile, _index: number): Patient {
  return {
    id: profile.customerId || String(profile.id),
    name: profile.fullName || 'Chưa cập nhật',
    avatar: profile.avatarUrl || undefined,
    username: 'Chưa cập nhật',
    email: 'Chưa cập nhật',
    dateOfBirth: profile.dateOfBirth || null,
    age: calculateAge(profile.dateOfBirth),
    gender: mapGender(profile.gender),
    contact: profile.phoneNumber || 'Chưa cập nhật',
    address: profile.address || 'Chưa cập nhật',
    isActive: true,
    status: 'Stable',
    accountId: profile.customerId || String(profile.id),
  };
}

export function mapAccountToPatient(account: Account, _index: number): Patient {
  const profile = account.ownerProfile;

  return {
    id: account.id,
    name: profile?.fullName || account.username || account.email || 'Chưa cập nhật',
    avatar: profile?.avatarUrl || account.avatarUrl || undefined,
    username: account.username,
    email: account.email,
    dateOfBirth: profile?.dateOfBirth || null,
    age: calculateAge(profile?.dateOfBirth),
    gender: mapGender(profile?.gender || null),
    contact: profile?.phoneNumber || account.phone || 'Chưa cập nhật',
    address: profile?.address || 'Chưa cập nhật',
    role: account.roleName || 'Chưa cập nhật',
    roleId: account.roleId,
    isActive: account.isActive,
    isEmailVerified: account.isEmailVerified,
    status: account.isEmailVerified ? 'Stable' : 'Under Observation',
    createdAt: account.createdAt,
    accountId: account.id,
  };
}

