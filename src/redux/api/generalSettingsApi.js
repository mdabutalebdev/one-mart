import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const generalSettingsApi = createApi({
    reducerPath: 'generalSettingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['GeneralSettings'],
    endpoints: (builder) => ({
        getSettings: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            siteName: 'Gold Ecommerce',
                            siteDescription: 'Premium Gold Jewelry Store',
                            contactEmail: 'info@goldecommerce.com',
                            contactPhone: '+8801234567890',
                            address: 'Dhaka, Bangladesh'
                        } 
                    } 
                }
            },
            providesTags: ['GeneralSettings']
        }),
        updateSettings: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data } }
            },
            invalidatesTags: ['GeneralSettings']
        })
    }),
})

export const { 
    useGetSettingsQuery, 
    useUpdateSettingsMutation 
} = generalSettingsApi
