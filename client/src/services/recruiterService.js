import API from './api';

export const recruiterService = {
  getProfile: async () => {
    const response = await API.get('/recruiters/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put('/recruiters/profile', data);
    return response.data;
  },
};
