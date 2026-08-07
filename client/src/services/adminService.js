import API from './api';

export const adminService = {
  getStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await API.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await API.put(`/admin/users/${id}`, data);
    return response.data;
  },

  getJobs: async (params = {}) => {
    const response = await API.get('/admin/jobs', { params });
    return response.data;
  },

  updateJobStatus: async (id, status) => {
    const response = await API.put(`/admin/jobs/${id}/status`, { status });
    return response.data;
  },

  getCompanies: async () => {
    const response = await API.get('/admin/companies');
    return response.data;
  },

  updateCompanyStatus: async (id, status) => {
    const response = await API.put(`/admin/companies/${id}/status`, { status });
    return response.data;
  },
};
