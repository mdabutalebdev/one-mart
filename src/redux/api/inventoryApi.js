import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const inventoryApi = createApi({
    reducerPath: 'inventoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Purchase', 'StockAdjustment'],
    endpoints: (builder) => ({
        getPurchases: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock purchases
                const mockPurchases = Array.from({ length: 5 }, (_, i) => ({
                    _id: `purchase-${i + 1}`,
                    items: [
                        {
                            productId: 'prod-1',
                            variantSku: 'SKU-123',
                            quantity: 10,
                            unitCost: 1000,
                            product: { title: 'Gold Ring' }
                        }
                    ],
                    totalAmount: 10000,
                    notes: 'Regular restock',
                    createdBy: { name: 'Admin User' },
                    createdAt: new Date().toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: mockPurchases,
                        pagination: {
                            totalPages: 1,
                            currentPage: params?.page || 1
                        }
                    }
                }
            },
            providesTags: ['Purchase']
        }),
        createPurchase: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                return { data: { success: true } }
            },
            invalidatesTags: ['Purchase']
        }),
        getStockAdjustments: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                const mockAdjustments = Array.from({ length: 5 }, (_, i) => ({
                    _id: `adj-${i + 1}`,
                    adjustmentType: i % 2 === 0 ? 'addition' : 'subtraction',
                    reason: 'Damage/Manual Update',
                    notes: 'Periodic audit',
                    items: [{
                        productId: 'prod-1',
                        variantSku: 'SKU-123',
                        quantity: 2,
                        product: { title: 'Sample Product' }
                    }],
                    createdAt: new Date().toISOString()
                }))
                return {
                    data: {
                        success: true,
                        data: mockAdjustments,
                        pagination: {
                            totalPages: 1,
                            currentPage: params?.page || 1
                        }
                    }
                }
            },
            providesTags: ['StockAdjustment']
        }),
        createStockAdjustment: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: ['StockAdjustment']
        }),
        getStockAdjustmentById: builder.query({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const mockAdjustment = {
                    _id: id,
                    adjustmentNumber: `ADJ-${id.slice(-4)}`,
                    adjustmentType: 'subtraction',
                    reason: 'damaged',
                    notes: 'Sample adjustment note',
                    items: [
                        {
                            product: { title: 'Premium Gold Ring' },
                            variant: { sku: 'SKU-R-01', attributes: [{ value: 'Size 7' }] },
                            quantity: 2,
                            previousStock: 10,
                            newStock: 8,
                            reason: 'damaged'
                        }
                    ],
                    totalQuantity: 2,
                    performedBy: { name: 'Admin User' },
                    createdAt: new Date().toISOString()
                }
                return { data: { success: true, data: mockAdjustment } }
            },
            providesTags: (result, error, id) => [{ type: 'StockAdjustment', id }]
        })
    }),
})

export const { 
    useGetPurchasesQuery, 
    useCreatePurchaseMutation,
    useGetStockAdjustmentsQuery,
    useCreateStockAdjustmentMutation,
    useGetStockAdjustmentByIdQuery,
    useLazyGetStockAdjustmentByIdQuery
} = inventoryApi
