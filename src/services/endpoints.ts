export const endpoints = {
  alerts: {
    list: () => "/alerts/",
    retrieve: (id: number) => `/alerts/${id}/`,
    create: () => "/alerts/",
    update: (id: number) => `/alerts/${id}/`,
    partialUpdate: (id: number) => `/alerts/${id}/`,
    delete: (id: number) => `/alerts/${id}/delete/`,
    markRead: (id: number) => `/alerts/${id}/mark-read/`,
    markAllRead: () => "/alerts/mark-all-read/",
  },

  verifyOTP: {
    send: (phone: string) => `/verifyotp/?phone=${encodeURIComponent(phone)}`,
    verify: () => `/verifyotp/`,
  },

  auth: {
    login: () => "/login/",
    otpLogin: () => "/otplogin/",
    register: () => "/register/",
    resetPassword: () => "/resetpassword/",
    logout: () => "/logout/",
  },

  userProfile: {
    userPreferences: "/userpreferences/",
    userProfile: "/userprofile/",
    sendOTP: (phone: string) =>
      `/verifyotp/?phone=${encodeURIComponent(phone)}`,
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

  categories: {
    list: "/categories/",
    detail: (id: number) => `/categories/${id}/`,
    create: "/categories/",
    update: (id: number) => `/categories/${id}/`,
    patch: (id: number) => `/categories/${id}/`,
    delete: (id: number) => `/categories/${id}/`,
  },

  products: {
    list: "/products/",
    create: "/products/",
    detail: (id: number | string) => `/products/${id}/`,
    update: (id: number | string) => `/products/${id}/`,
    patch: (id: number | string) => `/products/${id}/`,
    delete: (id: number | string) => `/products/${id}/`,
    markAsTaken: (id: number | string) => `/products/${id}/mark-as-taken/`,
    setStatus: (id: number | string) => `/products/${id}/set-status/`,
    related: "/products/related/",

    features: {
      list: "/product-features/",
      detail: (id: number) => `/product-features/${id}/`,
      create: "/product-features/",
      update: (id: number) => `/product-features/${id}/`,
      patch: (id: number) => `/product-features/${id}/`,
      delete: (id: number) => `/product-features/${id}/`,
    },
  },
  accountDeleteRequests: {
    list: () => "/account-delete-requests/",
    create: () => "/account-delete-requests/",
    detail: (id: number) => `/account-delete-requests/${id}/`,
    delete: (id: number) => `/account-delete-requests/${id}/`,
  },
  features: {
    list: () => "/features/",
    detail: (id: number) => `/features/${id}/`,
    create: () => "/features/",
    update: (id: number) => `/features/${id}/`,
    patch: (id: number) => `/features/${id}/`,
    delete: (id: number) => `/features/${id}/`,
  },
  locations: {
    list: () => "/locations/",
    detail: (id: number) => `/locations/${id}/`,
    create: () => "/locations/",
    update: (id: number) => `/locations/${id}/`,
    patch: (id: number) => `/locations/${id}/`,
    delete: (id: number) => `/locations/${id}/`,
  },
  payments: {
    list: () => "/payments/",
    detail: (id: number) => `/payments/${id}/`,
  },
  paystack: {
    initiate: () => "/paystack/initiate/",
    webhook: () => "/paystack/webhook/",
  },
  productFeatures: {
    list: () => "/product-features/",
    detail: (id: number) => `/product-features/${id}/`,
    create: () => "/product-features/",
    update: (id: number) => `/product-features/${id}/`,
    patch: (id: number) => `/product-features/${id}/`,
    delete: (id: number) => `/product-features/${id}/`,
  },
  productImages: {
    list: () => "/product-images/",
    detail: (id: number) => `/product-images/${id}/`,
    create: () => "/product-images/",
    update: (id: number) => `/product-images/${id}/`,
    patch: (id: number) => `/product-images/${id}/`,
    delete: (id: number) => `/product-images/${id}/`,
  },
  subcategories: {
    list: () => "/subcategories/",
    detail: (id: number) => `/subcategories/${id}/`,
    create: () => "/subcategories/",
    update: (id: number) => `/subcategories/${id}/`,
    patch: (id: number) => `/subcategories/${id}/`,
    delete: (id: number) => `/subcategories/${id}/`,
  },
  subscriptions: {
    list: () => "/subscriptions/",
    detail: (id: number) => `/subscriptions/${id}/`,
  },
  userSubscriptions: {
    list: () => "/user-subscriptions/",
    detail: (id: number) => `/user-subscriptions/${id}/`,
    create: () => "/user-subscriptions/",
    update: (id: number) => `/user-subscriptions/${id}/`,
    patch: (id: number) => `/user-subscriptions/${id}/`,
    delete: (id: number) => `/user-subscriptions/${id}/`,
  },
  feedback: {
    list: () => "/feedback/",
    listWithQuery: (qs: string) => `/feedback/${qs}`,
    retrieve: (id: number) => `/feedback/${id}/`,
    create: () => `/feedback/`,
    update: (id: number) => `/feedback/${id}/`,
    partial: (id: number) => `/feedback/${id}/`,
    delete: (id: number) => `/feedback/${id}/`,
  },
  policies: {
    privacyLatest: () => "/privacy-policies/latest/",
    termsLatest: () => "/terms-and-conditions/latest/",
  },
  redeem: {
    redeemPoints: () => "/redeem-points/",
  },
  coupons: {
    list: (qs = "") => `/coupons/${qs}`,
    detail: (id: number) => `/coupons/${id}/`,
    redeem: (id: number) => `/coupons/${id}/redeem/`,
  },
};

export default endpoints;
