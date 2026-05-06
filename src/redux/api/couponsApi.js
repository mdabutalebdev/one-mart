import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const couponsApi = createApi({
    reducerPath: 'couponsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Coupon'],
    endpoints: (builder) => ({
        getAdminCoupons: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock coupons
                const mockCoupons = Array.from({ length: 5 }, (_, i) => ({
                    _id: `coupon-${i + 1}`,
                    code: `SAVE${(i + 1) * 10}`,
                    discountType: i % 2 === 0 ? 'percentage' : 'fixed',
                    discountValue: (i + 1) * 10,
                    maxUsage: 100,
                    usedCount: i * 5,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 864000000).toISOString(),
                    minOrderAmount: 500,
                    description: `Save ${(i + 1) * 10} on your order`,
                    isActive: true,
                    isShowOnPublicly: true,
                    createdAt: new Date().toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: {
                            coupons: mockCoupons,
                            pagination: {
                                totalPages: 1,
                                totalCoupons: 5,
                                hasPrev: false,
                                hasNext: false
                            }
                        }
                    }
                }
            },
            providesTags: ['Coupon']
        }),
        deleteCoupon: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Coupon']
        }),
        createCoupon: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `coupon-${Date.now()}` } } }
            },
            invalidatesTags: ['Coupon']
        }),
        updateCoupon: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Coupon']
        }),
        toggleCouponStatus: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 300))
                return { data: { success: true } }
            },
            invalidatesTags: ['Coupon']
        })
    }),
})

export const { 
    useGetAdminCouponsQuery, 
    useDeleteCouponMutation,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useToggleCouponStatusMutation
} = couponsApi
