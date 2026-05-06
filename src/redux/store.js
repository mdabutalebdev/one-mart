import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { dashboardApi } from './api/dashboardApi'
import { productsApi } from './api/productsApi'
import { testimonialsApi } from './api/testimonialsApi'
import { ordersApi } from './api/ordersApi'
import { usersApi } from './api/usersApi'
import { bannersApi } from './api/bannersApi'
import { heroProductsApi } from './api/heroProductsApi'
import { androidBannersApi } from './api/androidBannersApi'
import { offerBannersApi } from './api/offerBannersApi'
import { categoriesApi } from './api/categoriesApi'
import { couponsApi } from './api/couponsApi'
import { inventoryApi } from './api/inventoryApi'
import { notificationsApi } from './api/notificationsApi'
import { adsApi } from './api/adsApi'
import { upsellsApi } from './api/upsellsApi'
import { addressApi } from './api/addressApi'
import { loyaltyApi } from './api/loyaltyApi'
import { menuApi } from './api/menuApi'
import { notificationSettingsApi } from './api/notificationSettingsApi'
import { affiliateApi } from './api/affiliateApi'
import { steadfastApi } from './api/steadfastApi'
import { roleApi } from './api/roleApi'
import { generalSettingsApi } from './api/generalSettingsApi'
import authReducer from './api/authSlice'

export const store = configureStore({
  reducer: {
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [bannersApi.reducerPath]: bannersApi.reducer,
    [heroProductsApi.reducerPath]: heroProductsApi.reducer,
    [androidBannersApi.reducerPath]: androidBannersApi.reducer,
    [offerBannersApi.reducerPath]: offerBannersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [adsApi.reducerPath]: adsApi.reducer,
    [upsellsApi.reducerPath]: upsellsApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [loyaltyApi.reducerPath]: loyaltyApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [notificationSettingsApi.reducerPath]: notificationSettingsApi.reducer,
    [affiliateApi.reducerPath]: affiliateApi.reducer,
    [steadfastApi.reducerPath]: steadfastApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [generalSettingsApi.reducerPath]: generalSettingsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dashboardApi.middleware,
      productsApi.middleware,
      testimonialsApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      bannersApi.middleware,
      heroProductsApi.middleware,
      androidBannersApi.middleware,
      offerBannersApi.middleware,
      categoriesApi.middleware,
      couponsApi.middleware,
      inventoryApi.middleware,
      notificationsApi.middleware,
      adsApi.middleware,
      upsellsApi.middleware,
      addressApi.middleware,
      loyaltyApi.middleware,
      menuApi.middleware,
      notificationSettingsApi.middleware,
      affiliateApi.middleware,
      steadfastApi.middleware,
      roleApi.middleware,
      generalSettingsApi.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
