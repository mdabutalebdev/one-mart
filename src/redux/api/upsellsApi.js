import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const upsellsApi = createApi({
    reducerPath: 'upsellsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Upsell'],
    endpoints: (builder) => ({
        getUpsellsByProduct: builder.query({
            async queryFn(productId) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: { linkedProducts: [] } 
                    } 
                }
            },
            providesTags: (result, error, arg) => [{ type: 'Upsell', id: arg }]
        }),
        updateUpsells: builder.mutation({
            async queryFn({ productId, linkedProductIds }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: (result, error, arg) => [{ type: 'Upsell', id: arg.productId }]
        })
    }),
})

export const { 
    useGetUpsellsByProductQuery, 
    useUpdateUpsellsMutation 
} = upsellsApi
