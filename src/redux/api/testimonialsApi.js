import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const generateMockTestimonials = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        _id: `testi-${i + 1}`,
        name: `Customer ${i + 1}`,
        designation: i % 2 === 0 ? 'CEO' : 'Manager',
        profilePic: `https://i.pravatar.cc/150?u=${i}`,
        rating: 4 + (i % 2),
        reviewText: `This is a great product! Highly recommended. ${i + 1}`,
        isActive: i % 3 !== 0,
        order: i + 1,
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
    }))
}

export const testimonialsApi = createApi({
    reducerPath: 'testimonialsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Testimonial'],
    endpoints: (builder) => ({
        getTestimonials: builder.query({
            async queryFn(params) {
                await new Promise(resolve => setTimeout(resolve, 600))
                const allTestimonials = generateMockTestimonials(15)
                
                let filtered = [...allTestimonials]
                if (params.search) {
                    filtered = filtered.filter(t => t.name.toLowerCase().includes(params.search.toLowerCase()) || 
                                                 t.reviewText.toLowerCase().includes(params.search.toLowerCase()))
                }
                if (params.isActive !== undefined && params.isActive !== '') {
                    const isActive = params.isActive === 'true'
                    filtered = filtered.filter(t => t.isActive === isActive)
                }

                const page = params.page || 1
                const limit = params.limit || 10
                const startIndex = (page - 1) * limit
                const paginated = filtered.slice(startIndex, startIndex + limit)

                return {
                    data: {
                        success: true,
                        data: {
                            testimonials: paginated,
                            pagination: {
                                totalItems: filtered.length,
                                totalPages: Math.ceil(filtered.length / limit),
                                currentPage: page
                            }
                        }
                    }
                }
            },
            providesTags: ['Testimonial']
        }),
        deleteTestimonial: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, message: 'Testimonial deleted successfully' } }
            },
            invalidatesTags: ['Testimonial']
        }),
        toggleTestimonialStatus: builder.mutation({
            async queryFn(id) {
                await new Promise(resolve => setTimeout(resolve, 500))
                return { data: { success: true, message: 'Status updated successfully' } }
            },
            invalidatesTags: ['Testimonial']
        })
    }),
})

export const { 
    useGetTestimonialsQuery, 
    useDeleteTestimonialMutation, 
    useToggleTestimonialStatusMutation 
} = testimonialsApi
