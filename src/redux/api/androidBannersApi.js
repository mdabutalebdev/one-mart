import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const androidBannersApi = createApi({
    reducerPath: 'androidBannersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['AndroidBanner'],
    endpoints: (builder) => ({
        getAdminAndroidBanners: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock android banners
                const mockBanners = Array.from({ length: 5 }, (_, i) => ({
                    _id: `android-banner-${i + 1}`,
                    image: `https://picsum.photos/seed/android${i}/1080/1920`,
                    link: '/android-offer',
                    isActive: i !== 4,
                    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: {
                            banners: mockBanners,
                            pagination: {
                                totalPages: 1,
                                totalItems: 5,
                                currentPage: params?.page || 1,
                                limit: params?.limit || 10
                            }
                        }
                    }
                }
            },
            providesTags: ['AndroidBanner']
        }),
        deleteAndroidBanner: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['AndroidBanner']
        }),
        createAndroidBanner: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `android-banner-${Date.now()}` } } }
            },
            invalidatesTags: ['AndroidBanner']
        }),
        updateAndroidBanner: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['AndroidBanner']
        }),
        toggleAndroidBannerStatus: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 300))
                return { data: { success: true } }
            },
            invalidatesTags: ['AndroidBanner']
        })
    }),
})

export const { 
    useGetAdminAndroidBannersQuery, 
    useDeleteAndroidBannerMutation,
    useCreateAndroidBannerMutation,
    useUpdateAndroidBannerMutation,
    useToggleAndroidBannerStatusMutation
} = androidBannersApi
