import API from './api';

export const companyService = {
  getCompanies: async (params = {}) => {
    const response = await API.get('/companies', { params });
    return response.data;
  },

  getCompanyById: async (id) => {
    const response = await API.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (formData) => {
    const response = await API.post('/companies', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCompany: async (id, formData) => {
    const response = await API.put(`/companies/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
