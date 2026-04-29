export interface FamilyProfileMini {
  id: number;
  fullName: string | null;
  memberType: string | null;
}

export interface PackageRequest {
  id: number;
  customerId: string;
  customerName: string | null;
  customerAvatar: string | null;
  basePackageId: number | null;
  basePackageName: string | null;
  packageId: number | null;
  packageName: string | null;
  title: string;
  description: string | null;
  requestedStartDate: string;
  totalDays: number;
  status: number;
  statusName: string;
  rejectReason: string | null;
  customerFeedback: string | null;
  draftedBy: string | null;
  draftedByName: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  familyProfiles: FamilyProfileMini[];
}
