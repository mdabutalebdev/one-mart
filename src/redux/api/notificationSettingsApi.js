import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const notificationSettingsApi = createApi({
    reducerPath: 'notificationSettingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['NotificationSettings'],
    endpoints: (builder) => ({
        getEmailSMSSettings: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            isSendOrderConfirmationEmail: true,
                            isSendGuestOrderConfirmationSMS: true
                        } 
                    } 
                }
            },
            providesTags: ['NotificationSettings']
        }),
        updateEmailSMSSettings: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data } }
            },
            invalidatesTags: ['NotificationSettings']
        })
    }),
})

export const { 
    useGetEmailSMSSettingsQuery, 
    useUpdateEmailSMSSettingsMutation 
} = notificationSettingsApi
