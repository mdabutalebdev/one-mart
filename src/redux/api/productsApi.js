import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const generateMockProducts = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        _id: `prod-${i + 1}`,
        title: `Premium Product ${i + 1}`,
        slug: `premium-product-${i + 1}`,
        featuredImage: `https://picsum.photos/seed/${i + 100}/200/200`,
        basePrice: 1500 + (i * 100),
        totalStock: 50 + i,
        calculatedTotalStock: 50 + i,
        status: i % 3 === 0 ? 'published' : i % 3 === 1 ? 'draft' : 'out_of_stock',
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
        isBracelet: i % 4 === 0,
        isRing: i % 4 === 1,
        variants: [
            { currentPrice: 1500 + (i * 100), stockQuantity: 25 },
            { currentPrice: 1600 + (i * 100), stockQuantity: 25 }
        ]
    }))
}

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getAdminProducts: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 600))
                const allProducts = generateMockProducts(20)
                
                let filtered = [...allProducts]
                if (params.search) {
                    filtered = filtered.filter(p => p.title.toLowerCase().includes(params.search.toLowerCase()))
                }
                if (params.status && params.status !== 'all') {
                    filtered = filtered.filter(p => p.status === params.status)
                }

                const page = params.page || 1
                const limit = params.limit || 10
                const startIndex = (page - 1) * limit
                const paginated = filtered.slice(startIndex, startIndex + limit)

                return {
                    data: {
                        success: true,
                        data: paginated,
                        pagination: {
                            total: filtered.length,
                            totalPages: Math.ceil(filtered.length / limit),
                            currentPage: page
                        }
                    }
                }
            },
            providesTags: ['Product']
        }),
        deleteProduct: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, message: 'Product deleted successfully' } }
            },
            invalidatesTags: ['Product']
        }),
        getCategories: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 300))
                const mockCategories = [
                    { _id: 'cat-1', name: 'Necklaces' },
                    { _id: 'cat-2', name: 'Rings' },
                    { _id: 'cat-3', name: 'Bracelets' },
                    { _id: 'cat-4', name: 'Earrings' },
                ]
                return { data: { success: true, data: mockCategories } }
            }
        }),
        createProduct: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: 'new-prod' } } }
            },
            invalidatesTags: ['Product']
        }),
        searchProducts: builder.query({
            async queryFn(searchTerm) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const allProducts = generateMockProducts(20)
                const filtered = allProducts.filter(p => 
                    p.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                return { data: { success: true, data: filtered } }
            }
        })
    }),
})

export const { 
    useGetAdminProductsQuery, 
    useDeleteProductMutation, 
    useGetCategoriesQuery, 
    useCreateProductMutation,
    useSearchProductsQuery
} = productsApi
