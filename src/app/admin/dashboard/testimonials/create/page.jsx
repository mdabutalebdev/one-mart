'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { testimonialAPI, uploadAPI } from '@/services/api'
import { getCookie } from 'cookies-next'
import { useAppContext } from '@/context/AppContext'
import PermissionDenied from '@/components/Common/PermissionDenied'

export default function CreateTestimonialPage() {
    const router = useRouter()
    const { hasPermission, contextLoading } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        profilePic: '',
        name: '',
        designation: '',
        rating: 5,
        reviewText: '',
        isActive: true,
        order: 0
    })
    const [previewImage, setPreviewImage] = useState('')
    const [checkingPermission, setCheckingPermission] = useState(true)
    const [hasCreatePermission, setHasCreatePermission] = useState(false)
    const [permissionError, setPermissionError] = useState(null)

    useEffect(() => {
        if (contextLoading) return
        const canCreate = hasPermission('testimonial', 'create')
        setHasCreatePermission(!!canCreate)
        setCheckingPermission(false)
        if (canCreate) {
            fetchHighestOrder()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextLoading])

    const fetchHighestOrder = async () => {
        try {
            const token = getCookie('token')
            const response = await testimonialAPI.getTestimonials({ limit: 1, sort: 'order' }, token)
            
            if (response.success && response.data.testimonials.length > 0) {
                const highestOrder = response.data.testimonials[0].order
                setFormData(prev => ({
                    ...prev,
                    order: highestOrder + 1
                }))
            } else {
                // If no testimonials exist, set order to 1
                setFormData(prev => ({
                    ...prev,
                    order: 1
                }))
            }
        } catch (error) {
            console.error('Error fetching highest order:', error)
            // Fallback to order 1
            setFormData(prev => ({
                ...prev,
                order: 1
            }))
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('image', file)

            const response = await uploadAPI.uploadSingle(formData)
            
            if (response.success) {
                const imageUrl = response.data.url || response.data.imageUrl
                setFormData(prev => ({
                    ...prev,
                    profilePic: imageUrl
                }))
                setPreviewImage(imageUrl)
                toast.success('Image uploaded successfully!')
            } else {
                toast.error('Failed to upload image: ' + response.message)
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            profilePic: ''
        }))
        setPreviewImage('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validation
        if (!formData.profilePic) {
            toast.error('Please upload a profile picture')
            return
        }
        
        if (!formData.name) {
            toast.error('Please enter customer name')
            return
        }
        
        if (!formData.reviewText) {
            toast.error('Please enter review text')
            return
        }

        if (formData.rating < 1 || formData.rating > 5) {
            toast.error('Rating must be between 1 and 5')
            return
        }

        if (!hasCreatePermission) {
            toast.error("You don't have permission to create testimonials")
            return
        }
        try {
            setLoading(true)
            const token = getCookie('token')
            
            const response = await testimonialAPI.createTestimonial(formData,token)
            
            if (response.success) {
                toast.success('Testimonial created successfully!')
                router.push('/admin/dashboard/testimonials')
            } else {
                toast.error('Failed to create testimonial: ' + response.message)
            }
        } catch (error) {
            console.error('Error creating testimonial:', error)
            toast.error('Error creating testimonial')
        } finally {
            setLoading(false)
        }
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
                className={`p-1 ${
                    index < rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
            >
                <Star className={`w-6 h-6 ${index < rating ? 'fill-current' : ''}`} />
            </button>
        ))
    }

    if (checkingPermission || contextLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!hasCreatePermission || permissionError) {
        return (
            <PermissionDenied
                title="Access Denied"
                message={permissionError || "You don't have permission to create testimonials"}
                action="Contact your administrator for access"
                showBackButton={true}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/dashboard/testimonials"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Testimonial</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Add a new customer testimonial
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Profile Picture */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture *
                            </label>
                            <div className="flex items-center space-x-4">
                                {previewImage ? (
                                    <div className="relative">
                                        <img
                                            src={previewImage}
                                            alt="Profile preview"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Star className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                                
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                    />
                                    {uploading && (
                                        <p className="mt-1 text-sm text-blue-600">Uploading...</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter customer name"
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Designation
                            </label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., CEO, Manager, etc."
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating *
                            </label>
                            <div className="flex items-center space-x-1">
                                {renderStars(formData.rating)}
                                <span className="ml-2 text-sm text-gray-600">
                                    {formData.rating}/5
                                </span>
                            </div>
                        </div>

                        {/* Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Auto-assigned based on existing testimonials"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Automatically set to next available order. Lower numbers appear first.
                            </p>
                        </div>

                        {/* Review Text */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Text *
                            </label>
                            <textarea
                                name="reviewText"
                                value={formData.reviewText}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter the customer's review or testimonial..."
                            />
                        </div>

                        {/* Status */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Active (visible on website)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Link
                            href="/admin/dashboard/testimonials"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Testimonial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
