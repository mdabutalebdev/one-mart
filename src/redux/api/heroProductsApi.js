import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const heroProductsApi = createApi({
    reducerPath: 'heroProductsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['HeroProduct'],
    endpoints: (builder) => ({
        getAdminHeroProducts: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock hero products
                const mockHeroProducts = Array.from({ length: 4 }, (_, i) => ({
                    _id: `hero-prod-${i + 1}`,
                    title: `Premium Watch ${i + 1}`,
                    description: 'The ultimate luxury timepiece for modern professionals.',
                    image: `https://picsum.photos/seed/heroprod${i}/600/600`,
                    link: `/products/watch-${i + 1}`,
                    order: i + 1,
                    isActive: true,
                    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: mockHeroProducts
                    }
                }
            },
            providesTags: ['HeroProduct']
        }),
        deleteHeroProduct: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['HeroProduct']
        }),
        createHeroProduct: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `hero-prod-${Date.now()}` } } }
            },
            invalidatesTags: ['HeroProduct']
        }),
        updateHeroProduct: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['HeroProduct']
        })
    }),
})

export const { 
    useGetAdminHeroProductsQuery, 
    useDeleteHeroProductMutation,
    useCreateHeroProductMutation,
    useUpdateHeroProductMutation
} = heroProductsApi
