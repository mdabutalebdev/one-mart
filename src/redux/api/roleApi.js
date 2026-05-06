import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const roleApi = createApi({
    reducerPath: 'roleApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Role', 'Permission'],
    endpoints: (builder) => ({
        getRoles: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: [
                            { _id: '1', name: 'Admin', description: 'Full access', isActive: true, isSuperAdmin: true },
                            { _id: '2', name: 'Manager', description: 'Limited access', isActive: true, isDefault: true }
                        ] 
                    } 
                }
            },
            providesTags: ['Role']
        }),
        getPermissions: builder.query({
            async queryFn() {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { 
                    data: { 
                        success: true, 
                        data: {
                            all: [
                                { _id: 'p1', action: 'read', module: 'product', category: 'product', description: 'Read products' },
                                { _id: 'p2', action: 'create', module: 'product', category: 'product', description: 'Create products' }
                            ],
                            grouped: {
                                product: [{ _id: 'p1', action: 'read' }, { _id: 'p2', action: 'create' }]
                            }
                        } 
                    } 
                }
            },
            providesTags: ['Permission']
        }),
        createRole: builder.mutation({
            async queryFn(data) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: Math.random().toString() } } }
            },
            invalidatesTags: ['Role']
        }),
        updateRole: builder.mutation({
            async queryFn({ id, ...data }) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true, data: { ...data, _id: id } } }
            },
            invalidatesTags: ['Role']
        }),
        deleteRole: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 800))
                return { data: { success: true } }
            },
            invalidatesTags: ['Role']
        })
    }),
})

export const { 
    useGetRolesQuery, 
    useGetPermissionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation 
} = roleApi
