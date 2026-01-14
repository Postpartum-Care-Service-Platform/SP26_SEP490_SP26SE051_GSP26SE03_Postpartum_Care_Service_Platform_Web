import type { FamilyProfile } from '@/types/family-profile';
import type { Account } from '@/types/account';

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

export function mapFamilyProfileToPatient(profile: FamilyProfile, index: number): Patient {
  return {
    id: profile.customerId || String(profile.id),
    name: profile.fullName || 'N/A',
    avatar: profile.avatarUrl || undefined,
    username: 'N/A',
    email: 'N/A',
    dateOfBirth: profile.dateOfBirth || null,
    age: calculateAge(profile.dateOfBirth),
    gender: mapGender(profile.gender),
    contact: profile.phoneNumber || 'N/A',
    address: profile.address || 'N/A',
    status: 'false',
    accountId: profile.customerId || String(profile.id),
  };
}

export function mapAccountToPatient(account: Account, index: number): Patient {
  const profile = account.ownerProfile;

  return {
    id: account.id,
    name: profile?.fullName || account.username || account.email || 'N/A',
    avatar: profile?.avatarUrl || account.avatarUrl || undefined,
    username: account.username,
    email: account.email,
    dateOfBirth: profile?.dateOfBirth || null,
    age: calculateAge(profile?.dateOfBirth),
    gender: mapGender(profile?.gender || null),
    contact: profile?.phoneNumber || account.phone || 'N/A',
    address: profile?.address || 'N/A',
    status: account.isEmailVerified ? 'true' : 'false',
    accountId: account.id,
  };
}

