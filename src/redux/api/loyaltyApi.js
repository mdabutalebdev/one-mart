import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const loyaltyApi = createApi({
    reducerPath: 'loyaltyApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Loyalty'],
    endpoints: (builder) => ({
        getLoyaltySettings: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            coinPerItem: 1,
                            coinValue: 1,
                            isLoyaltyEnabled: true,
                            earnOnDelivery: true,
                            earnOnPaymentSuccess: true,
                            minRedeemAmount: 10,
                            isActive: true
                        } 
                    } 
                }
            },
            providesTags: ['Loyalty']
        }),
        updateLoyaltySettings: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data } }
            },
            invalidatesTags: ['Loyalty']
        })
    }),
})

export const { 
    useGetLoyaltySettingsQuery, 
    useUpdateLoyaltySettingsMutation 
} = loyaltyApi
