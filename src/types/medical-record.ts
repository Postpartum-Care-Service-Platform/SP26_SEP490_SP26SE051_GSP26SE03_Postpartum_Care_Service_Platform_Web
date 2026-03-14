export interface MedicalRecord {
  id: number;
  customerId: string;
  customerName: string | null;
  customerEmail: string | null;
  allergies: string;
  bloodType: string;
  medicalHistory: string;
  currentMedication: string;
  createdAt: string;
}

export interface CreateMedicalRecordRequest {
  allergies: string;
  bloodType: string;
  medicalHistory: string;
  currentMedication: string;
}

export interface UpdateMedicalRecordRequest {
  allergies?: string;
  bloodType?: string;
  medicalHistory?: string;
  currentMedication?: string;
}
