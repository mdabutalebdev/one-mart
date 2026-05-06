import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getAdminUsers: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Mock users
                const mockUsers = Array.from({ length: 20 }, (_, i) => ({
                    _id: `user-${i + 1}`,
                    name: `Customer ${i + 1}`,
                    email: `customer${i + 1}@example.com`,
                    phone: `017000000${i.toString().padStart(2, '0')}`,
                    role: 'customer',
                    status: i % 5 === 0 ? 'inactive' : 'active',
                    loyaltyPoints: i * 50,
                    avatar: null,
                    createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
                }))

                let filtered = [...mockUsers]
                if (params.search) {
                    filtered = filtered.filter(u => 
                        u.name.toLowerCase().includes(params.search.toLowerCase()) ||
                        u.email.toLowerCase().includes(params.search.toLowerCase())
                    )
                }
                if (params.status) {
                    filtered = filtered.filter(u => u.status === params.status)
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
                            totalItems: filtered.length,
                            totalPages: Math.ceil(filtered.length / limit),
                            currentPage: page
                        }
                    }
                }
            },
            providesTags: ['User']
        }),
        deleteUser: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true } }
            },
            invalidatesTags: ['User']
        }),
        getRoles: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 300))
                const mockRoles = [
                    { _id: 'role-1', name: 'Super Admin', isSuperAdmin: true },
                    { _id: 'role-2', name: 'Manager', isSuperAdmin: false },
                    { _id: 'role-3', name: 'Editor', isSuperAdmin: false },
                ]
                return { data: { success: true, data: mockRoles } }
            }
        }),
        createStaff: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: `staff-${Date.now()}` } } }
            },
            invalidatesTags: ['User']
        }),
        searchUsers: builder.query({
            async queryFn(searchTerm) {
                await new Promise(resolve => setTimeout(resolve, 400))
                const mockUsers = Array.from({ length: 15 }, (_, i) => ({
                    _id: `user-${i + 1}`,
                    name: `Customer ${i + 1}`,
                    email: `customer${i + 1}@example.com`,
                    phone: `017000000${i.toString().padStart(2, '0')}`,
                }))
                const filtered = mockUsers.filter(u => 
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.phone.includes(searchTerm)
                )
                return { data: { success: true, data: filtered } }
            }
        })
    }),
})

export const { 
    useGetAdminUsersQuery, 
    useDeleteUserMutation,
    useGetRolesQuery,
    useCreateStaffMutation,
    useSearchUsersQuery
} = usersApi
