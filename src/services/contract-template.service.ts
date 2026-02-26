import apiClient from './apiClient';

export interface ContractTemplate {
    id: number;
    name: string;
    content: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateContractTemplateRequest {
    name: string;
    content: string;
}

export interface UpdateContractTemplateRequest {
    name: string;
    content: string;
}

const contractTemplateService = {
    getAll: (): Promise<ContractTemplate[]> =>
        apiClient.get('/contract-templates'),

    getById: (id: number): Promise<ContractTemplate> =>
        apiClient.get(`/contract-templates/${id}`),

    create: (data: CreateContractTemplateRequest): Promise<ContractTemplate> =>
        apiClient.post('/contract-templates', data),

    update: (id: number, data: UpdateContractTemplateRequest): Promise<ContractTemplate> =>
        apiClient.put(`/contract-templates/${id}`, data),

    delete: (id: number): Promise<{ message: string }> =>
        apiClient.delete(`/contract-templates/${id}`),
};

export default contractTemplateService;
