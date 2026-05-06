import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const steadfastApi = createApi({
    reducerPath: 'steadfastApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Steadfast'],
    endpoints: (builder) => ({
        getSteadfastSettings: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            apiKey: 'STEADFAST_MOCK_API_KEY',
                            apiSecret: 'STEADFAST_MOCK_API_SECRET'
                        } 
                    } 
                }
            },
            providesTags: ['Steadfast']
        }),
        updateSteadfastSettings: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data } }
            },
            invalidatesTags: ['Steadfast']
        })
    }),
})

export const { 
    useGetSteadfastSettingsQuery, 
    useUpdateSteadfastSettingsMutation 
} = steadfastApi
