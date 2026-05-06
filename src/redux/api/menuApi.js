import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const menuApi = createApi({
    reducerPath: 'menuApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Menu'],
    endpoints: (builder) => ({
        getHeaderMenus: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: [
                            { _id: '1', name: 'Home', href: '/', order: 1, isVisible: true, isActive: true },
                            { _id: '2', name: 'Shop', href: '/shop', order: 2, isVisible: true, isActive: true }
                        ] 
                    } 
                }
            },
            providesTags: ['Menu']
        }),
        getFooterMenus: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            quickLinks: [{ _id: '3', name: 'Privacy Policy', href: '/privacy', order: 1, isVisible: true, isActive: true }],
                            utilities: [{ _id: '4', name: 'Returns', href: '/returns', order: 1, isVisible: true, isActive: true }],
                            about: [{ _id: '5', name: 'About Us', href: '/about', order: 1, isVisible: true, isActive: true }],
                            contact: [],
                            socialMedia: []
                        } 
                    } 
                }
            },
            providesTags: ['Menu']
        }),
        createHeaderMenu: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: Math.random().toString() } } }
            },
            invalidatesTags: ['Menu']
        }),
        updateHeaderMenu: builder.mutation({
            async queryFn({ id, ...data }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Menu']
        }),
        deleteHeaderMenu: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: ['Menu']
        }),
        createFooterMenu: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: Math.random().toString() } } }
            },
            invalidatesTags: ['Menu']
        }),
        updateFooterMenu: builder.mutation({
            async queryFn({ id, ...data }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Menu']
        }),
        deleteFooterMenu: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: ['Menu']
        })
    }),
})

export const { 
    useGetHeaderMenusQuery, 
    useGetFooterMenusQuery,
    useCreateHeaderMenuMutation,
    useUpdateHeaderMenuMutation,
    useDeleteHeaderMenuMutation,
    useCreateFooterMenuMutation,
    useUpdateFooterMenuMutation,
    useDeleteFooterMenuMutation
} = menuApi
