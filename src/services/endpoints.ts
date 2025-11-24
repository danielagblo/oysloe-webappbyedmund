export const endpoints = {
  alerts: {
    list: () => '/api-v1/alerts/',
    retrieve: (id: number) => `/api-v1/alerts/${id}/`,
    create: () => '/api-v1/alerts/',
    update: (id: number) => `/api-v1/alerts/${id}/`,
    partialUpdate: (id: number) => `/api-v1/alerts/${id}/`,
    delete: (id: number) => `/api-v1/alerts/${id}/delete/`,
    markRead: (id: number) => `/api-v1/alerts/${id}/mark-read/`,
    markAllRead: () => '/api-v1/alerts/mark-all-read/',
  },
};
