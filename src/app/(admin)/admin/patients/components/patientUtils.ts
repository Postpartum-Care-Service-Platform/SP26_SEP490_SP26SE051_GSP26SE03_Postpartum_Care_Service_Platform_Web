import type { FamilyProfile } from '@/types/family-profile';

import type { Patient, PatientStatus } from './patientTypes';

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function mapGender(gender: string | null | undefined): 'Male' | 'Female' {
  if (!gender) {
    return 'Male';
  }
  const normalized = gender.toLowerCase().trim();
  if (normalized === 'male' || normalized === 'nam') {
    return 'Male';
  }
  return 'Female';
}

export function mapStatus(index: number): PatientStatus {
  const statuses: PatientStatus[] = ['Stable', 'Under Observation', 'Recovering', 'Critical'];
  return statuses[index % statuses.length];
}

export function mapFamilyProfileToPatient(profile: FamilyProfile, index: number): Patient {
  return {
    id: profile.customerId || String(profile.id),
    name: profile.fullName || 'N/A',
    avatar: profile.avatarUrl || undefined,
    age: profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : 0,
    gender: mapGender(profile.gender),
    contact: profile.phoneNumber || 'N/A',
    address: profile.address || 'N/A',
    status: mapStatus(index),
  };
}

