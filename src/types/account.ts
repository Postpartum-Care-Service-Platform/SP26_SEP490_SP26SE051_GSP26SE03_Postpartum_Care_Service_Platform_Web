import type { FamilyProfile } from './family-profile';

export interface Account {
  id: string;
  roleId: number;
  roleName: string;
  email: string;
  phone: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  avatarUrl: string | null;
  ownerProfile: FamilyProfile | null;
  nowPackage?: unknown;
}

export interface AssignedStaff {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  email: string;
}

export interface ActiveBooking {
  id: number;
  bookingStatus: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  packageId: number;
  packageName: string;
  packageTypeName: string;
  durationDays: number;
  roomId: number;
  roomName: string;
  roomTypeName: string;
  assignedStaff: AssignedStaff[];
}

export interface CustomerDetail {
  id: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  fullName: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  totalFeedbacks: number;
  averageRating: number;
  activeBookings: ActiveBooking[];
}

