import apiClient from './apiClient';
import type { Contract } from '@/types/contract';

export interface UpdateContractRequest {
  contractCode?: string;
  contractDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  signedDate?: string | null;
  checkinDate?: string;
  checkoutDate?: string;
  status?: string;
  fileUrl?: string | null;
}

const contractService = {
  getAllContracts: (): Promise<Contract[]> => {
    return apiClient.get('/Contract/all');
  },
  updateContract: (id: number, data: UpdateContractRequest): Promise<Contract> => {
    return apiClient.put(`/Contract/${id}`, data);
  },
};

export default contractService;

