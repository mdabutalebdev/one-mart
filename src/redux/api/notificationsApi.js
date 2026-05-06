import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getAdminNotifications: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock notifications
                const mockNotifications = Array.from({ length: 5 }, (_, i) => ({
                    _id: `notif-${i + 1}`,
                    title: `Notification ${i + 1}`,
                    message: `This is a test notification message ${i + 1}`,
                    type: i % 5 === 0 ? 'info' : i % 5 === 1 ? 'success' : i % 5 === 2 ? 'warning' : i % 5 === 3 ? 'promotion' : 'alert',
                    link: '',
                    expiresAt: new Date(Date.now() + 864000000).toISOString(),
                    isActive: true,
                    createdAt: new Date().toISOString()
                }))

                return {
                    data: {
                        success: true,
                        data: mockNotifications,
                        pagination: {
                            totalPages: 1,
                            total: 5
                        }
                    }
                }
            },
            providesTags: ['Notification']
        }),
        deleteNotification: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['Notification']
        }),
        createNotification: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `notif-${Date.now()}` } } }
            },
            invalidatesTags: ['Notification']
        }),
        updateNotification: builder.mutation({
            async queryFn({ id, data }) {
                await new Promise(resolve => setTimeout(resolve, 600))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Notification']
        })
    }),
})

export const { 
    useGetAdminNotificationsQuery, 
    useDeleteNotificationMutation,
    useCreateNotificationMutation,
    useUpdateNotificationMutation 
} = notificationsApi
