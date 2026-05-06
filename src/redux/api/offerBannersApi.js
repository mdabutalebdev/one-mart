import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const offerBannersApi = createApi({
    reducerPath: 'offerBannersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['OfferBanner'],
    endpoints: (builder) => ({
        getAdminOfferBanners: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock offer banners
                const mockBanners = Array.from({ length: 3 }, (_, i) => ({
                    _id: `offer-banner-${i + 1}`,
                    image: `https://picsum.photos/seed/offer${i}/1200/400`,
                    link: '/offers',
                    title: `Mega Deal ${i + 1}`,
                    isActive: true,
                    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: mockBanners
                    }
                }
            },
            providesTags: ['OfferBanner']
        }),
        deleteOfferBanner: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['OfferBanner']
        }),
        createOfferBanner: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `offer-banner-${Date.now()}` } } }
            },
            invalidatesTags: ['OfferBanner']
        }),
        updateOfferBanner: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['OfferBanner']
        })
    }),
})

export const { 
    useGetAdminOfferBannersQuery, 
    useDeleteOfferBannerMutation,
    useCreateOfferBannerMutation,
    useUpdateOfferBannerMutation
} = offerBannersApi
