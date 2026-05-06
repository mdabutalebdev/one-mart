import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bannersApi = createApi({
    reducerPath: 'bannersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Banner'],
    endpoints: (builder) => ({
        getAdminBanners: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock banners
                const mockBanners = Array.from({ length: 5 }, (_, i) => ({
                    _id: `banner-${i + 1}`,
                    title: `Exclusive Summer Collection ${i + 1}`,
                    subtitle: 'Up to 50% OFF on all premium jewelry',
                    image: `https://picsum.photos/seed/banner${i}/1200/400`,
                    link: '/shop',
                    order: i + 1,
                    isActive: i !== 3,
                    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: mockBanners
                    }
                }
            },
            providesTags: ['Banner']
        }),
        deleteBanner: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Banner']
        }),
        updateBannerStatus: builder.mutation({
            async queryFn({ id, isActive }) {
                await new Promise(resolve => setTimeout(resolve, 300))
                return { data: { success: true } }
            },
            invalidatesTags: ['Banner']
        }),
        createBanner: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `banner-${Date.now()}` } } }
            },
            invalidatesTags: ['Banner']
        }),
        updateBanner: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Banner']
        })
    }),
})

export const { 
    useGetAdminBannersQuery, 
    useDeleteBannerMutation,
    useUpdateBannerStatusMutation,
    useCreateBannerMutation,
    useUpdateBannerMutation
} = bannersApi
