import API from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await API.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await API.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await API.put('/notifications/read-all');
    return response.data;
  },
};
