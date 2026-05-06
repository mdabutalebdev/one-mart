import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Address'],
    endpoints: (builder) => ({
        getDivisions: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 300))
                const mockDivisions = [
                    { _id: 'div-1', id: '1', name: 'Dhaka', bn_name: 'ঢাকা', isActive: true },
                    { _id: 'div-2', id: '2', name: 'Chittagong', bn_name: 'চট্টগ্রাম', isActive: true }
                ]
                return { data: { success: true, data: { data: mockDivisions, pagination: { total: 2, pages: 1 } } } }
            },
            providesTags: ['Address']
        }),
        getDistricts: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 400))
                return { data: { success: true, data: { data: [], pagination: { total: 0, pages: 0 } } } }
            },
            providesTags: ['Address']
        }),
        getUpazilas: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, data: { data: [], pagination: { total: 0, pages: 0 } } } }
            },
            providesTags: ['Address']
        }),
        getDhakaCityAreas: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, data: { data: [], pagination: { total: 0, pages: 0 } } } }
            },
            providesTags: ['Address']
        }),
        updateAddressItem: builder.mutation({
            async queryFn({ type, id, data }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: ['Address']
        }),
        deleteAddressItem: builder.mutation({
            async queryFn({ type, id }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true } }
            },
            invalidatesTags: ['Address']
        })
    }),
})

export const { 
    useGetDivisionsQuery, 
    useGetDistrictsQuery,
    useGetUpazilasQuery,
    useGetDhakaCityAreasQuery,
    useUpdateAddressItemMutation,
    useDeleteAddressItemMutation 
} = addressApi
