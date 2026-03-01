import apiClient from './apiClient';

export interface EmailTemplate {
    id: number;
    name: string;
    code: string;
    subject: string;
    body: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateEmailTemplateRequest {
    name: string;
    code: string;
    subject: string;
    body: string;
}

export interface UpdateEmailTemplateRequest {
    name: string;
    subject: string;
    body: string;
}

const emailTemplateService = {
    getAll: (): Promise<EmailTemplate[]> =>
        apiClient.get('/email-templates'),

    getById: (id: number): Promise<EmailTemplate> =>
        apiClient.get(`/email-templates/${id}`),

    getByCode: (code: string): Promise<EmailTemplate> =>
        apiClient.get(`/email-templates/code/${code}`),

    create: (data: CreateEmailTemplateRequest): Promise<EmailTemplate> =>
        apiClient.post('/email-templates', data),

    update: (id: number, data: UpdateEmailTemplateRequest): Promise<EmailTemplate> =>
        apiClient.put(`/email-templates/${id}`, data),

    delete: (id: number): Promise<{ message: string }> =>
        apiClient.delete(`/email-templates/${id}`),
};

export default emailTemplateService;
