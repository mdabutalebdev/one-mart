import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const affiliateApi = createApi({
    reducerPath: 'affiliateApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Affiliate'],
    endpoints: (builder) => ({
        getAffiliateSettings: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            isAffiliateEnabled: true,
                            purchaserDiscountType: 'percentage',
                            purchaserDiscountValue: 5,
                            referrerLoyaltyPointsPerPurchase: 10,
                            purchaserLoyaltyPointsPerPurchase: 5,
                            isConfirmationModalShowWhenUseAffiliateLink: true
                        } 
                    } 
                }
            },
            providesTags: ['Affiliate']
        }),
        updateAffiliateSettings: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data } }
            },
            invalidatesTags: ['Affiliate']
        })
    }),
})

export const { 
    useGetAffiliateSettingsQuery, 
    useUpdateAffiliateSettingsMutation 
} = affiliateApi
