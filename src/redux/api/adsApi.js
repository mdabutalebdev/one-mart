import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adsApi = createApi({
    reducerPath: 'adsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Ad'],
    endpoints: (builder) => ({
        getAdminAds: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock ads
                const mockAds = Array.from({ length: 5 }, (_, i) => ({
                    _id: `ad-${i + 1}`,
                    title: `Ad ${i + 1}`,
                    description: `This is a test ad description ${i + 1}`,
                    image: `https://picsum.photos/seed/ad${i}/400/200`,
                    position: i % 2 === 0 ? 'homepage-banner' : 'product-page',
                    isActive: true,
                    expireDate: new Date(Date.now() + 864000000).toISOString(),
                    viewCount: 100 * (i + 1),
                    clickCount: 10 * (i + 1),
                    product: { title: 'Test Product', slug: 'test-product' },
                    createdAt: new Date().toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: {
                            ads: mockAds,
                            pagination: {
                                totalPages: 1,
                                totalAds: 5,
                                currentPage: params?.page || 1,
                                hasNext: false,
                                hasPrev: false
                            }
                        }
                    }
                }
            },
            providesTags: ['Ad']
        }),
        deleteAd: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Ad']
        }),
        toggleAdStatus: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 300))
                return { data: { success: true } }
            },
            invalidatesTags: ['Ad']
        })
    }),
})

export const { 
    useGetAdminAdsQuery, 
    useDeleteAdMutation,
    useToggleAdStatusMutation 
} = adsApi
