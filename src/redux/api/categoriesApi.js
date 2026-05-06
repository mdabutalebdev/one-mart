import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getAdminCategories: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock categories
                const mockCategories = [
                    { 
                        _id: 'cat-1', 
                        name: 'Necklaces', 
                        slug: 'necklaces', 
                        image: 'https://picsum.photos/seed/cat1/100/100',
                        parent: null,
                        children: [],
                        isFeatured: true,
                        createdAt: new Date().toISOString()
                    },
                    { 
                        _id: 'cat-2', 
                        name: 'Rings', 
                        slug: 'rings', 
                        image: 'https://picsum.photos/seed/cat2/100/100',
                        parent: null,
                        children: [],
                        isFeatured: false,
                        createdAt: new Date().toISOString()
                    }
                ]

                return {
                    data: {
                        success: true,
                        data: mockCategories
                    }
                }
            },
            providesTags: ['Category']
        }),
        deleteCategory: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Category']
        }),
        createCategory: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `cat-${Date.now()}` } } }
            },
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Category']
        })
    }),
})

export const { 
    useGetAdminCategoriesQuery, 
    useDeleteCategoryMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation
} = categoriesApi
