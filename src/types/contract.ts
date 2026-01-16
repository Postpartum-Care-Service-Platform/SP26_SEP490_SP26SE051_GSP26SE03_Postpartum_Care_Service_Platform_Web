export interface ContractCustomer {
  id: string;
  email: string;
  username: string;
  phone: string;
}

export type ContractStatus = 'Sent' | 'Signed' | 'Cancelled' | 'Expired' | string;

export interface Contract {
  id: number;
  bookingId: number;
  contractCode: string;
  contractDate: string;
  effectiveFrom: string;
  effectiveTo: string;
  signedDate: string | null;
  fileUrl: string | null;
  checkinDate: string;
  checkoutDate: string;
  status: ContractStatus;
  createdAt: string;
  customer: ContractCustomer;
}

