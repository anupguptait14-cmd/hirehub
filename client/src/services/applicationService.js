import API from './api';

export const applicationService = {
  applyToJob: async (formData) => {
    const response = await API.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCandidateApplications: async (params = {}) => {
    const response = await API.get('/applications/my-applications', { params });
    return response.data;
  },

  getJobApplications: async (jobId, params = {}) => {
    const response = await API.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  updateStatus: async (applicationId, data) => {
    const response = await API.put(`/applications/${applicationId}/status`, data);
    return response.data;
  },
};
