// Mock API service to satisfy legacy imports during Redux migration
export const productAPI = {
    getAdminProducts: async (params, token) => {
        console.log('Mock getAdminProducts called', params);
        return { success: true, data: [], pagination: { total: 0, totalPages: 1 } };
    },
    getProducts: async (params, token) => {
        console.log('Mock getProducts called', params);
        return { success: true, data: [], pagination: { total: 0, totalPages: 1, page: 1, limit: 10 } };
    },
    deleteProduct: async (id, token) => ({ success: true }),
    createProduct: async (data, token) => ({ success: true }),
    updateProduct: async (id, data, token) => ({ success: true }),
    getAdminProductById: async (id, token) => ({ success: true, data: {} }),
};

export const userAPI = {
    getUsers: async () => ({ success: true, data: [] }),
    getUserById: async (id) => ({ success: true, data: {} }),
    updateUser: async (id, data) => ({ success: true }),
    deleteUser: async (id) => ({ success: true }),
};

export const roleAPI = {
    getRoles: async () => ({ success: true, data: [] }),
    getPermissions: async () => ({ success: true, data: [] }),
};

export const settingsAPI = {
    getSettings: async () => ({ success: true, data: {} }),
    updateSettings: async (data) => ({ success: true }),
};

export const menuAPI = {
    getMenus: async () => ({ success: true, data: [] }),
    updateMenu: async (data) => ({ success: true }),
};

export const addressAPI = {
    getAddresses: async () => ({ success: true, data: [] }),
};

export const adsAPI = {
    getAds: async () => ({ success: true, data: [] }),
};

export const inventoryAPI = {
    getInventory: async () => ({ success: true, data: [] }),
    getAdjustmentHistory: async () => ({ success: true, data: [] }),
};

export const offerBannerAPI = {
    getBanners: async () => ({ success: true, data: [] }),
};

export const notificationAPI = {
    getNotifications: async () => ({ success: true, data: [] }),
};

export const heroProductAPI = {
    getHeroProducts: async () => ({ success: true, data: [] }),
};

export const heroBannerAPI = {
    getHeroBanners: async () => ({ success: true, data: [] }),
};

export const couponAPI = {
    getCoupons: async () => ({ success: true, data: [] }),
};

export const androidBannerAPI = {
    getBanners: async () => ({ success: true, data: [] }),
};

export const upsellAPI = {
    getUpsellsByMainProduct: async (id, token) => ({ success: true, data: { linkedProducts: [] } }),
    updateUpsells: async (data, token) => ({ success: true }),
};

export const testimonialAPI = {
    getTestimonials: async (params, token) => {
        console.log('Mock getTestimonials called', params);
        return { success: true, data: { testimonials: [], pagination: { totalItems: 0, totalPages: 1 } } };
    },
    deleteTestimonial: async (id, token) => ({ success: true }),
    createTestimonial: async (data, token) => ({ success: true }),
    updateTestimonial: async (id, data, token) => ({ success: true }),
    getTestimonialById: async (id, token) => ({ success: true, data: { testimonial: {} } }),
    toggleTestimonialStatus: async (id) => ({ success: true }),
};

export const categoryAPI = {
    getCategories: async () => ({ success: true, data: [] }),
};

export const uploadAPI = {
    uploadSingle: async (formData) => ({ success: true, data: { url: '' } }),
};

export const orderAPI = {
    getAdminOrders: async () => ({ success: true, data: [], pagination: { totalItems: 0, totalPages: 1 } }),
    getAdminOrderDetails: async () => ({ success: true, data: {} }),
    updateOrderStatus: async () => ({ success: true }),
    deleteOrder: async () => ({ success: true }),
    addOrderToSteadfast: async () => ({ success: true }),
    updateOrderComprehensive: async () => ({ success: true }),
    getCustomerInfoByPhone: async () => ({ success: true, data: {} }),
    createManualOrder: async () => ({ success: true }),
    getOrders: async () => ({ success: true, data: [] }),
};
