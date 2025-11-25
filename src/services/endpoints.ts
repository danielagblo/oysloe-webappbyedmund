export const endpoints = {
  alerts: {
    list: () => "/api-v1/alerts/",
    retrieve: (id: number) => `/api-v1/alerts/${id}/`,
    create: () => "/api-v1/alerts/",
    update: (id: number) => `/api-v1/alerts/${id}/`,
    partialUpdate: (id: number) => `/api-v1/alerts/${id}/`,
    delete: (id: number) => `/api-v1/alerts/${id}/delete/`,
    markRead: (id: number) => `/api-v1/alerts/${id}/mark-read/`,
    markAllRead: () => "/api-v1/alerts/mark-all-read/",
  },

  verifyOTP: {
    send: (phone: string) =>
      `/verifyotp/?phone=${encodeURIComponent(phone)}`,
    verify: () => `/verifyotp/`,
  },

  userProfile: {
    userPreferences: "/userpreferences/",
    userProfile: "/userprofile/",
    sendOTP: (phone: string) => `/verifyotp/?phone=${encodeURIComponent(phone)}`,
    verifyOTP: "/verifyotp/",
  },
  reviews: {
    list: () => "/reviews/",
    listWithQuery: (qs: string) => `/reviews/${qs}`,
    retrieve: (id: number) => `/reviews/${id}/`,
    create: () => `/reviews/`,
    update: (id: number) => `/reviews/${id}/`,
    partial: (id: number) => `/reviews/${id}/`,
    delete: (id: number) => `/reviews/${id}/`,
  },

  
};
