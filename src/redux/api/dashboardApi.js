import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Mock data generator for dashboard
const generateMockData = (period) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - 5 + i + 12) % 12
        return {
            _id: { year: 2024, month: monthIndex + 1 },
            total: 35000 + (i * 2000),
            count: 50 + (i * 5)
        }
    })

    const topSelling = [
        { _id: '1', title: 'Premium Leather Watch', totalSold: 145, category: { name: 'Watches' } },
        { _id: '2', title: 'Minimalist Silver Bracelet', totalSold: 89, category: { name: 'Accessories' } },
        { _id: '3', title: 'Automatic Skeleton Watch', totalSold: 67, category: { name: 'Watches' } },
        { _id: '4', title: 'Classic Brown Wallet', totalSold: 54, category: { name: 'Leather Goods' } },
        { _id: '5', title: 'Smart Fitness Tracker', totalSold: 42, category: { name: 'Electronics' } }
    ]

    const recentOrders = [
        {
            _id: 'ORD001',
            orderId: 'MVMT-1029',
            user: { email: 'john@example.com', phone: '01711223344' },
            createdAt: new Date().toISOString(),
            total: 4500,
            discount: 500,
            couponDiscount: 0,
            loyaltyDiscount: 0,
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'bkash',
            orderSource: 'website',
            orderType: 'online'
        },
        {
            _id: 'ORD002',
            orderId: 'MVMT-1030',
            user: { email: 'sarah@example.com', phone: '01822334455' },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            total: 2800,
            discount: 0,
            couponDiscount: 200,
            loyaltyDiscount: 0,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            orderSource: 'facebook',
            orderType: 'online'
        },
        {
            _id: 'ORD003',
            orderId: 'MVMT-1031',
            user: { email: 'rahim@example.com', phone: '01933445566' },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            total: 12000,
            discount: 1000,
            couponDiscount: 0,
            loyaltyDiscount: 500,
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'cod',
            orderSource: 'website',
            orderType: 'online'
        },
        {
            _id: 'ORD004',
            orderId: 'MVMT-1032',
            manualOrderInfo: { phone: '01611223344' },
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            total: 3200,
            discount: 0,
            couponDiscount: 0,
            loyaltyDiscount: 0,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'cod',
            orderSource: 'phone',
            orderType: 'manual'
        }
    ]

    return {
        overview: {
            salesGrowth: 12.5,
            totalUsers: 1240,
            totalProducts: 450,
            totalCategories: 12,
            avgOrderValue: 3200
        },
        orders: {
            periodTotal: period === 'today' ? 12 : period === '7d' ? 84 : 320,
            statusDistribution: {
                delivered: 150,
                confirmed: 45,
                shipped: 30,
                pending: 20,
                cancelled: 10,
                returned: 5
            }
        },
        products: {
            topSelling,
            lowStock: [
                { _id: 'p1', title: 'Vintage Gold Watch', variants: [{ stockQuantity: 2 }] },
                { _id: 'p2', title: 'Leather Strap Black', variants: [{ stockQuantity: 1 }] }
            ]
        },
        sales: {
            period: period === 'today' ? 15000 : period === '7d' ? 120000 : 540000,
            monthlyData,
            paymentMethods: [
                { _id: 'bkash', count: 45, total: 200000 },
                { _id: 'Nagad', count: 30, total: 150000 },
                { _id: 'COD', count: 60, total: 180000 }
            ]
        },
        recentOrders
    }
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // This is a placeholder as we use mock data
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            // Since we don't have a real backend, we can use queryFn to return mock data directly
            async queryFn(period) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800))
                
                return {
                    data: {
                        success: true,
                        data: generateMockData(period)
                    }
                }
            }
        }),
    }),
})

export const { useGetDashboardStatsQuery } = dashboardApi
