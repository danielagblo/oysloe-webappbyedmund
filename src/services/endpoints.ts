// canonical routes
// Defines every URL in one place.
// never write “/posts” anywhere else in the app again.

const API_HOST = import.meta.env.REACT_APP_API_URL ?? 'http://localhost:4000';

export const endpoints = {
  posts: {
    list: () => `${API_HOST}/posts`,
    create: () => `${API_HOST}/posts`,
  },
  profile: {
    me: () => `${API_HOST}/profile/me`,
    update: () => `${API_HOST}/profile/me`,
  },
  // manually started from here
  alerts: {
    list: () => `${API_HOST}/api-v1/alerts/`,
    create: () => `${API_HOST}/api-v1/alerts/`,
    retrieve: (id: number) => `${API_HOST}/api-v1/alerts/${id}/`,
    update: (id: number) => `${API_HOST}/api-v1/alerts/${id}/`,
    partialUpdate: (id: number) => `${API_HOST}/api-v1/alerts/${id}/`,
    destroy: (id: number) => `${API_HOST}/api-v1/alerts/${id}/`,
    delete: (id: number) => `${API_HOST}/api-v1/alerts/${id}/delete/`,
    markRead: (id: number) => `${API_HOST}/api-v1/alerts/${id}/mark-read/`,
    markAllRead: () => `${API_HOST}/api-v1/alerts/mark-all-read/`,
  },
};