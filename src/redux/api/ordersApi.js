import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const generateMockOrders = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        _id: `order-${i + 1}`,
        orderId: `ORD-${1000 + i}`,
        createdAt: new Date(Date.now() - (i * 3600000 * 5)).toISOString(),
        user: { name: `Customer ${i + 1}`, email: `cust${i}@example.com`, phone: '01711223344' },
        shippingAddress: { name: `Customer ${i + 1}`, phone: '01711223344', address: '123 Street', area: 'Dhaka', district: 'Dhaka', city: 'Dhaka' },
        total: 2500 + (i * 100),
        subtotal: 2400 + (i * 100),
        shippingCost: 100,
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'confirmed' : i % 4 === 2 ? 'shipped' : 'delivered',
        paymentStatus: i % 2 === 0 ? 'paid' : 'pending',
        paymentMethod: i % 2 === 0 ? 'bkash' : 'cod',
        orderSource: 'website',
        items: [
            { product: { title: 'Product A' }, quantity: 1, price: 1000 },
            { product: { title: 'Product B' }, quantity: 2, price: 750 }
        ]
    }))
}

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getAdminOrders: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 800))
                const allOrders = generateMockOrders(20)
                
                // Simplified filtering for mock
                return {
                    data: {
                        success: true,
                        data: allOrders,
                        pagination: {
                            totalItems: allOrders.length,
                            totalPages: 2,
                            currentPage: 1,
                            hasNextPage: true
                        }
                    }
                }
            },
            providesTags: ['Order']
        }),
        deleteOrder: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Order']
        }),
        getAdminOrderDetails: builder.query({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 800))
                const allOrders = generateMockOrders(20)
                const order = allOrders.find(o => o._id === id) || {
                    ...generateMockOrders(1)[0],
                    _id: id,
                    orderId: `ORD-DET-${id.slice(-4)}`,
                    status: 'pending',
                    items: [
                        { name: 'Mock Product 1', quantity: 2, price: 1500, image: 'https://picsum.photos/200/200?random=1' },
                        { name: 'Mock Product 2', quantity: 1, price: 2000, image: 'https://picsum.photos/200/200?random=2' }
                    ]
                }
                return { data: { success: true, data: order } }
            },
            providesTags: (result, error, id) => [{ type: 'Order', id }]
        }),
        getOrderTimeline: builder.query({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                const mockTimeline = [
                    { status: 'pending', message: 'Order placed', createdAt: new Date().toISOString() },
                    { status: 'confirmed', message: 'Order confirmed', createdAt: new Date().toISOString() }
                ]
                return { data: { success: true, data: mockTimeline } }
            }
        }),
        updateOrderStatus: builder.mutation({
            async queryFn({ id, status }) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, data: { status } } }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order']
        }),
        createManualOrder: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                return { data: { success: true, data: { ...data, _id: `order-${Date.now()}` } } }
            },
            invalidatesTags: ['Order']
        }),
        updateOrderComprehensive: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order']
        })
    }),
})

export const { 
    useGetAdminOrdersQuery, 
    useGetAdminOrderDetailsQuery,
    useGetOrderTimelineQuery,
    useDeleteOrderMutation, 
    useUpdateOrderStatusMutation,
    useCreateManualOrderMutation,
    useUpdateOrderComprehensiveMutation
} = ordersApi
