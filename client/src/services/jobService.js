import API from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await API.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await API.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await API.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await API.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await API.delete(`/jobs/${id}`);
    return response.data;
  },

  getRecruiterJobs: async () => {
    const response = await API.get('/jobs/my-jobs');
    return response.data;
  },
};
