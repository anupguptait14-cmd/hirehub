import API from './api';

export const candidateService = {
  getProfile: async () => {
    const response = await API.get('/candidates/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put('/candidates/profile', data);
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await API.post('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getSavedJobs: async () => {
    const response = await API.get('/saved-jobs');
    return response.data;
  },

  saveJob: async (jobId) => {
    const response = await API.post(`/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId) => {
    const response = await API.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },
};
