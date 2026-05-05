'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X, Trash2, Share2 } from 'lucide-react'
import ImageUpload from '@/components/Common/ImageUpload'
import GalleryImageUpload from '@/components/Common/GalleryImageUpload'
import ShareModal from '@/components/Common/ShareModal'
import toast from 'react-hot-toast'
import { productAPI, categoryAPI } from '@/services/api'
import { getCookie } from 'cookies-next'
import PermissionDenied from '@/components/Common/PermissionDenied'
import { useAppContext } from '@/context/AppContext'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id
    const { hasPermission, loading: contextLoading } = useAppContext()
    
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [checkingPermission, setCheckingPermission] = useState(true)
    const [categories, setCategories] = useState([])
    const [showShareModal, setShowShareModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        category: '',
        brand: '',
        tags: [],
        status: 'draft',
        isActive: true,
        isFeatured: false,
        isBestselling: false,
        isNewArrival: false,
        // Jewelry specific properties
        isBracelet: false,
        isRing: false,
        braceletSizes: [],
        ringSizes: [],
        slug: '',
        featuredImage: '',
        gallery: [],
        specifications: [],
        productVideos: [],
        variants: []
    })

    const [customBraceletSize, setCustomBraceletSize] = useState('');
    const [customRingSize, setCustomRingSize] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [videoInput, setVideoInput] = useState({ platform: 'youtube', url: '' });

    const [variantForm, setVariantForm] = useState({
        image: '',
        size: '',
        color: '',
        colorCode: '#000000',
        sku: '',
        oldPrice: '',
        currentPrice: '',
        stock: 0
    })

    const [hasColorVariants, setHasColorVariants] = useState(true)

    useEffect(() => {
        // Check permission first
        if (!contextLoading) {
            if (!hasPermission('product', 'update')) {
                setCheckingPermission(false)
            } else {
                setCheckingPermission(false)
                fetchCategories()
                fetchProduct()
            }
        }
    }, [contextLoading, hasPermission, productId])

    const fetchCategories = async () => {
        try {
            const data = await categoryAPI.getCategories()
            if (data.success) {
                setCategories(data.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchProduct = async () => {
        try {
            setFetching(true)
            const token = getCookie('token')
            const data = await productAPI.getAdminProductById(productId, token)
            
            if (data.success) {
                const product = data.data
                setFormData({
                    title: product.title || '',
                    shortDescription: product.shortDescription || '',
                    description: product.description || '',
                    category: product.category?._id || product.category || '',
                    brand: product.brand || '',
                    tags: product.tags || [],
                    status: product.status || 'draft',
                    isActive: product.isActive !== undefined ? product.isActive : true,
                    isFeatured: product.isFeatured || false,
                    isBestselling: product.isBestselling || false,
                    isNewArrival: product.isNewArrival || false,
                    // Jewelry specific properties
                    isBracelet: product.isBracelet || false,
                    isRing: product.isRing || false,
                    braceletSizes: product.braceletSizes || [],
                    ringSizes: product.ringSizes || [],
                    slug: product.slug || '',
                    featuredImage: product.featuredImage || '',
                    gallery: product.gallery || [],
                    specifications: product.specifications || [],
                    productVideos: product.productVideos || [],
                    variants: product.variants || []
                })
            } else {
                toast.error('Failed to fetch product: ' + data.message)
                router.push('/admin/dashboard/products')
            }
        } catch (error) {
            console.error('Error fetching product:', error)
            toast.error('Error fetching product')
            router.push('/admin/dashboard/products')
        } finally {
            setFetching(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const addTag = () => {
        const trimmedTag = tagInput.trim()
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }))
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { key: '', value: '', group: '' }]
        }))
    }

    const removeSpecification = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }))
    }

    const updateSpecification = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.map((spec, i) => 
                i === index ? { ...spec, [field]: value } : spec
            )
        }))
    }

    const addProductVideo = () => {
        const trimmedUrl = videoInput.url.trim()
        if (!trimmedUrl) {
            toast.error('Please enter a video URL')
            return
        }

        // Validate URL format based on platform
        const platform = videoInput.platform.toLowerCase()
        let isValid = false
        let processedUrl = trimmedUrl

        switch(platform) {
            case 'youtube':
                // Accept both watch?v= and embed URLs
                if (trimmedUrl.includes('youtube.com/watch?v=') || trimmedUrl.includes('youtu.be/')) {
                    isValid = true
                    // Convert to embed format
                    const videoId = trimmedUrl.includes('youtu.be/') 
                        ? trimmedUrl.split('youtu.be/')[1].split('?')[0]
                        : trimmedUrl.split('watch?v=')[1].split('&')[0]
                    processedUrl = `https://www.youtube.com/embed/${videoId}`
                } else if (trimmedUrl.includes('youtube.com/embed/')) {
                    isValid = true
                    processedUrl = trimmedUrl
                }
                break
            case 'tiktok':
                if (trimmedUrl.includes('tiktok.com/') || trimmedUrl.includes('vm.tiktok.com/')) {
                    isValid = true
                    processedUrl = trimmedUrl
                }
                break
            case 'vimeo':
                if (trimmedUrl.includes('vimeo.com/')) {
                    isValid = true
                    const videoId = trimmedUrl.split('vimeo.com/')[1].split('?')[0]
                    processedUrl = `https://player.vimeo.com/video/${videoId}`
                } else if (trimmedUrl.includes('player.vimeo.com/video/')) {
                    isValid = true
                    processedUrl = trimmedUrl
                }
                break
            case 'facebook':
                if (trimmedUrl.includes('facebook.com/') || trimmedUrl.includes('fb.watch/')) {
                    isValid = true
                    processedUrl = trimmedUrl
                }
                break
            case 'instagram':
                if (trimmedUrl.includes('instagram.com/')) {
                    isValid = true
                    processedUrl = trimmedUrl
                }
                break
            default:
                isValid = true // Allow other platforms
        }

        if (!isValid) {
            toast.error(`Invalid ${videoInput.platform} URL format`)
            return
        }

        if (!formData.productVideos.includes(processedUrl)) {
            setFormData(prev => ({
                ...prev,
                productVideos: [...prev.productVideos, processedUrl]
            }))
            setVideoInput({ platform: 'youtube', url: '' })
            toast.success('Video URL added successfully')
        } else {
            toast.error('This video URL is already added')
        }
    }

    const removeProductVideo = (urlToRemove) => {
        setFormData(prev => ({
            ...prev,
            productVideos: prev.productVideos.filter(url => url !== urlToRemove)
        }))
    }

    const getVideoPlatformName = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
        if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'TikTok'
        if (url.includes('vimeo.com')) return 'Vimeo'
        if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook'
        if (url.includes('instagram.com')) return 'Instagram'
        return 'Other'
    }

    const handleVariantInputChange = (e) => {
        const { name, value } = e.target
        setVariantForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addVariant = () => {
        // Only current price is required now, size is optional
        if (!variantForm.currentPrice) {
            toast.error('Please fill in current price')
            return
        }

        // If color variants are enabled, color is required
        if (hasColorVariants && !variantForm.color) {
            toast.error('Please fill in color')
            return
        }

        // Create attributes array - size is optional now
        const attributes = []
        
        // Add size only if provided
        if (variantForm.size && variantForm.size.trim()) {
            attributes.push({ 
                name: 'Size', 
                value: variantForm.size.trim(), 
                displayValue: variantForm.size.trim() 
            })
        }

        // Add color only if color variants are enabled and color is provided
        if (hasColorVariants && variantForm.color && variantForm.color.trim()) {
            attributes.push({ 
                name: 'Color', 
                value: variantForm.color.trim(), 
                displayValue: variantForm.color.trim(), 
                hexCode: variantForm.colorCode 
            })
        }

        // Generate SKU with timestamp for uniqueness
        const generateUniqueSKU = () => {
            const timestamp = Date.now(); // Unique timestamp
            return `SKU-${timestamp}`;
        }
        const sku = variantForm.sku || generateUniqueSKU()

        const newVariant = {
            sku,
            attributes,
            currentPrice: parseFloat(variantForm.currentPrice),
            originalPrice: variantForm.oldPrice ? parseFloat(variantForm.oldPrice) : null,
            stockQuantity: parseInt(variantForm.stock),
            images: variantForm.image ? [{ url: variantForm.image, isPrimary: true }] : [],
            isActive: true
        }

        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, newVariant]
        }))

        // Reset variant form
        setVariantForm({
            image: '',
            size: '',
            color: '',
            colorCode: '#000000',
            sku: '',
            oldPrice: '',
            currentPrice: '',
            stock: 0
        })
    }

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }))
    }

    const updateVariant = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) => 
                i === index ? { ...variant, [field]: value } : variant
            )
        }))
    }

    const updateVariantAttribute = (variantIndex, attributeIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) => {
                if (i === variantIndex) {
                    const updatedAttributes = [...variant.attributes]
                    updatedAttributes[attributeIndex] = {
                        ...updatedAttributes[attributeIndex],
                        [field]: value,
                        // Also update displayValue when value changes
                        ...(field === 'value' ? { displayValue: value } : {})
                    }
                    return { ...variant, attributes: updatedAttributes }
                }
                return variant
            })
        }))
    }

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
        setFormData(prev => ({ ...prev, slug }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        const token = getCookie('token')

        try {
            const data = await productAPI.updateProduct(productId, formData,token)

            if (data.success) {
                toast.success('Product updated successfully!')
                router.push(`/admin/dashboard/products/${productId}`)
            } else {
                toast.error('Failed to update product: ' + data.message)
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('Error updating product')
        } finally {
            setLoading(false)
        }
    }

    // Show permission denied if no permission
    if (checkingPermission || contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Checking permissions...</span>
                </div>
            </div>
        )
    }

    if (!hasPermission('product', 'update')) {
        return (
            <PermissionDenied
                title="Access Denied"
                message="You don't have permission to update products."
                action="Update Products"
            />
        )
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading product...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/admin/dashboard/products/${productId}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Product
                        </Link>
                        <div className="border-l border-gray-300 pl-4">
                            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Update product information and settings
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </button>
                        <Link
                            href="/admin/dashboard/products"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={generateSlug}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleTagInputKeyPress}
                                        placeholder="Type tag and press Enter"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span 
                                                key={index} 
                                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-gray-500 hover:text-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Description
                        </label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief description of the product"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Detailed description of the product"
                        />
                    </div>
                </div>

                {/* Jewelry Type Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Jewelry Type & Sizes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isBracelet"
                                    checked={formData.isBracelet}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">This is a Bracelet</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isRing"
                                    checked={formData.isRing}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">This is a Ring</span>
                            </label>
                        </div>
                    </div>

                    {/* Bracelet Sizes */}
                    {formData.isBracelet && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium text-gray-900 mb-3">Available Bracelet Sizes</h3>
                            <div className="space-y-3">
                                {/* Predefined Adjustable option */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.braceletSizes.includes('Adjustable')} 
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    braceletSizes: [...prev.braceletSizes, 'Adjustable']
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    braceletSizes: prev.braceletSizes.filter(size => size !== 'Adjustable')
                                                }));
                                            }
                                        }} 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-gray-700">Adjustable</span>
                                </label>
                                
                                {/* Custom sizes input */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Add custom size (e.g., 7.5, 8, 8.5)"
                                            value={customBraceletSize}
                                            onChange={(e) => setCustomBraceletSize(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (customBraceletSize.trim() && !formData.braceletSizes.includes(customBraceletSize.trim())) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            braceletSizes: [...prev.braceletSizes, customBraceletSize.trim()]
                                                        }));
                                                        setCustomBraceletSize('');
                                                    }
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (customBraceletSize.trim() && !formData.braceletSizes.includes(customBraceletSize.trim())) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        braceletSizes: [...prev.braceletSizes, customBraceletSize.trim()]
                                                    }));
                                                    setCustomBraceletSize('');
                                                }
                                            }}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {/* Display added sizes */}
                                    {formData.braceletSizes.filter(size => size !== 'Adjustable').length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.braceletSizes.filter(size => size !== 'Adjustable').map((size, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {size}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                braceletSizes: prev.braceletSizes.filter(s => s !== size)
                                                            }));
                                                        }}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ring Sizes */}
                    {formData.isRing && (
                        <div className="mb-6">
                            <h3 className="text-md font-medium text-gray-900 mb-3">Available Ring Sizes</h3>
                            <div className="space-y-3">
                                {/* Predefined Adjustable option */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.ringSizes.includes('Adjustable')} 
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ringSizes: [...prev.ringSizes, 'Adjustable']
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ringSizes: prev.ringSizes.filter(size => size !== 'Adjustable')
                                                }));
                                            }
                                        }} 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm text-gray-700">Adjustable</span>
                                </label>
                                
                                {/* Custom sizes input */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Add custom size (e.g., 6, 6.5, 7, 7.5)"
                                            value={customRingSize}
                                            onChange={(e) => setCustomRingSize(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (customRingSize.trim() && !formData.ringSizes.includes(customRingSize.trim())) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            ringSizes: [...prev.ringSizes, customRingSize.trim()]
                                                        }));
                                                        setCustomRingSize('');
                                                    }
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (customRingSize.trim() && !formData.ringSizes.includes(customRingSize.trim())) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        ringSizes: [...prev.ringSizes, customRingSize.trim()]
                                                    }));
                                                    setCustomRingSize('');
                                                }
                                            }}
                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {/* Display added sizes */}
                                    {formData.ringSizes.filter(size => size !== 'Adjustable').length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.ringSizes.filter(size => size !== 'Adjustable').map((size, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                                                >
                                                    {size}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                ringSizes: prev.ringSizes.filter(s => s !== size)
                                                            }));
                                                        }}
                                                        className="ml-2 text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Images */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Images</h2>
                    
                    <div className="space-y-6">
                        <ImageUpload
                            onImageUpload={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                            onImageRemove={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                            currentImage={formData.featuredImage}
                            label="Featured Image"
                        />
                        
                        <GalleryImageUpload
                            onImagesChange={(images) => setFormData(prev => ({ ...prev, gallery: images }))}
                            currentImages={formData.gallery}
                            label="Gallery Images"
                            maxImages={10}
                        />
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Spec
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.specifications.map((spec, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    value={spec.key}
                                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                                    placeholder="Key"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    value={spec.value}
                                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    value={spec.group}
                                    onChange={(e) => updateSpecification(index, 'group', e.target.value)}
                                    placeholder="Group (optional)"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpecification(index)}
                                    className="p-2 text-red-600 hover:text-red-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Videos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Product Videos</h2>
                            <p className="text-sm text-gray-500 mt-1">Add video URLs from different platforms</p>
                        </div>
                        <button
                            type="button"
                            onClick={addProductVideo}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Video
                        </button>
                    </div>

                    {/* Add Video Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform
                                </label>
                                <select
                                    value={videoInput.platform}
                                    onChange={(e) => setVideoInput(prev => ({ ...prev, platform: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="vimeo">Vimeo</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video URL
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={videoInput.url}
                                        onChange={(e) => setVideoInput(prev => ({ ...prev, url: e.target.value }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addProductVideo()
                                            }
                                        }}
                                        placeholder={
                                            videoInput.platform === 'youtube' 
                                                ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                                                : videoInput.platform === 'tiktok'
                                                ? 'https://www.tiktok.com/@username/video/...'
                                                : videoInput.platform === 'vimeo'
                                                ? 'https://vimeo.com/...'
                                                : videoInput.platform === 'facebook'
                                                ? 'https://www.facebook.com/watch/?v=...'
                                                : videoInput.platform === 'instagram'
                                                ? 'https://www.instagram.com/p/...'
                                                : 'Enter video URL'
                                        }
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addProductVideo}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {videoInput.platform === 'youtube' && 'Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                                    {videoInput.platform === 'tiktok' && 'Example: https://www.tiktok.com/@username/video/1234567890'}
                                    {videoInput.platform === 'vimeo' && 'Example: https://vimeo.com/123456789'}
                                    {videoInput.platform === 'facebook' && 'Example: https://www.facebook.com/watch/?v=123456789'}
                                    {videoInput.platform === 'instagram' && 'Example: https://www.instagram.com/p/ABC123/'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Existing Videos */}
                    {formData.productVideos.length > 0 ? (
                        <div className="space-y-3">
                            {formData.productVideos.map((videoUrl, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                {getVideoPlatformName(videoUrl)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 truncate" title={videoUrl}>
                                            {videoUrl}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeProductVideo(videoUrl)}
                                        className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No videos added yet. Add your first video URL above.</p>
                        </div>
                    )}
                </div>

                {/* Existing Variants */}
                {formData.variants.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-6">Existing Variants</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-md font-medium text-gray-900">
                                            Variant #{index + 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Variant Image Display */}
                                    {variant.images && variant.images.length > 0 ? (
                                        <div className="mb-4 aspect-square">
                                            <img
                                                src={variant.images[0]?.url || variant.images[0]}
                                                alt={variant.attributes.map(attr => attr.value).join(' - ') || 'Variant image'}
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.png'
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-4 aspect-square bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-gray-400">No image</span>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-4">
                                        {/* First Line: Size and Stock */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Size */}
                                            {variant.attributes.find(attr => attr.name === 'Size') && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Size
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={variant.attributes.find(attr => attr.name === 'Size')?.value || ''}
                                                        onChange={(e) => {
                                                            const sizeAttrIndex = variant.attributes.findIndex(attr => attr.name === 'Size')
                                                            if (sizeAttrIndex !== -1) {
                                                                updateVariantAttribute(index, sizeAttrIndex, 'value', e.target.value)
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                                <input
                                                    type="number"
                                                    value={variant.stockQuantity}
                                                    readOnly
                                                    disabled
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    To update stock, please use the Inventory Management menu
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Second Line: Color (if exists) */}
                                        {variant.attributes.find(attr => attr.name === 'Color') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Color
                                                </label>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <input
                                                        type="text"
                                                        value={variant.attributes.find(attr => attr.name === 'Color')?.value || ''}
                                                        onChange={(e) => {
                                                            const colorAttrIndex = variant.attributes.findIndex(attr => attr.name === 'Color')
                                                            if (colorAttrIndex !== -1) {
                                                                updateVariantAttribute(index, colorAttrIndex, 'value', e.target.value)
                                                            }
                                                        }}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="color"
                                                        value={variant.attributes.find(attr => attr.name === 'Color')?.hexCode || '#000000'}
                                                        onChange={(e) => {
                                                            const colorAttrIndex = variant.attributes.findIndex(attr => attr.name === 'Color')
                                                            if (colorAttrIndex !== -1) {
                                                                updateVariantAttribute(index, colorAttrIndex, 'hexCode', e.target.value)
                                                            }
                                                        }}
                                                        className="w-full sm:w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                                        title="Pick color"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Third Line: Current Price and Old Price */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Price *</label>
                                                <input
                                                    type="text"
                                                    value={variant.currentPrice || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        // Only allow numbers and decimal point
                                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                            updateVariant(index, 'currentPrice', value === '' ? 0 : parseFloat(value) || 0)
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        // Ensure valid number on blur
                                                        const value = parseFloat(e.target.value) || 0
                                                        updateVariant(index, 'currentPrice', value)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                                                <input
                                                    type="text"
                                                    value={variant.originalPrice || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        // Only allow numbers and decimal point
                                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                            updateVariant(index, 'originalPrice', value === '' ? null : (parseFloat(value) || null))
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        // Ensure valid number on blur
                                                        const value = e.target.value === '' ? null : (parseFloat(e.target.value) || null)
                                                        updateVariant(index, 'originalPrice', value)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Variants */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Add Product Variants</h2>
                    <p className="text-sm text-gray-600 mb-4">Add variants one by one. Each variant will be added to the product.</p>
                    
                    {/* Color Variants Toggle */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={hasColorVariants}
                                onChange={(e) => setHasColorVariants(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Enable Color Variants
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            {hasColorVariants 
                                ? "Variants will have both size and color attributes" 
                                : "Variants will have only size attributes (colorless products)"
                            }
                        </p>
                    </div>

                    {/* Variant Image Upload - Moved to top */}
                    <div className="mb-6">
                        <ImageUpload
                            onImageUpload={(url) => setVariantForm(prev => ({ ...prev, image: url }))}
                            onImageRemove={() => setVariantForm(prev => ({ ...prev, image: '' }))}
                            currentImage={variantForm.image}
                            label="Variant Image (Optional)"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Size (Optional)</label>
                            <input
                                type="text"
                                name="size"
                                value={variantForm.size}
                                onChange={handleVariantInputChange}
                                placeholder="S, M, L, XL (Optional)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        {/* Color field - only show if color variants are enabled */}
                        {hasColorVariants && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        name="color"
                                        value={variantForm.color}
                                        onChange={handleVariantInputChange}
                                        placeholder="Red, Blue, Green"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="color"
                                        name="colorCode"
                                        value={variantForm.colorCode}
                                        onChange={handleVariantInputChange}
                                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                        title="Pick color"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Price *</label>
                            <input
                                type="number"
                                name="currentPrice"
                                value={variantForm.currentPrice}
                                onChange={handleVariantInputChange}
                                placeholder="99.99"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={variantForm.oldPrice}
                                onChange={handleVariantInputChange}
                                placeholder="129.99"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={variantForm.sku}
                                onChange={handleVariantInputChange}
                                placeholder="Auto-generated or custom SKU"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={variantForm.stock}
                                readOnly
                                disabled
                                placeholder="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                To update stock, please use the Inventory Management menu
                            </p>
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={addVariant}
                                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Variant
                            </button>
                        </div>
                    </div>

                </div>

                {/* Product Flags */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Product Flags</h2>
                    
                    <div className="space-y-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                        </label>
                        
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isBestselling"
                                checked={formData.isBestselling}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Bestselling Product</span>
                        </label>
                        
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                checked={formData.isNewArrival}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">New Arrival</span>
                        </label>
                    </div>
                                 </div>

                 {/* Submit Section */}
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                         <div className="text-sm text-gray-500">
                             Make sure all required fields are filled before updating the product.
                         </div>
                         <div className="flex items-center space-x-3">
                             <Link
                                 href={`/admin/dashboard/products/${productId}`}
                                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                             >
                                 Cancel
                             </Link>
                             <button
                                 type="submit"
                                 disabled={loading}
                                 className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                             >
                                 <Save className="h-4 w-4 mr-2" />
                                 {loading ? 'Updating...' : 'Update Product'}
                             </button>
                         </div>
                     </div>
                 </div>

             </form>

            {/* Share Modal */}
            {formData.slug && (
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    url={`/product/${formData.slug}`}
                    title="Share Product"
                />
            )}
         </div>
     )
 }
