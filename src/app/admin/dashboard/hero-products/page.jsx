'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Check, Upload, Link } from 'lucide-react';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import ImageUpload from '@/components/Common/ImageUpload';
import { toast } from 'react-hot-toast';
import { 
    useGetAdminHeroProductsQuery, 
    useDeleteHeroProductMutation,
    useCreateHeroProductMutation,
    useUpdateHeroProductMutation 
} from '@/redux/api/heroProductsApi';
import { useSearchProductsQuery } from '@/redux/api/productsApi';

export default function HeroProductsManagement() {
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [errors, setErrors] = useState({});
    const [imageUploadMode, setImageUploadMode] = useState('upload');

    // Form data
    const [formData, setFormData] = useState({
        productId: '',
        customImage: '',
        size: 'large',
        badge: {
            text: '',
            color: 'bg-pink-500'
        },
        order: 0
    });

    // RTK Query hooks
    const { data: heroProductsData, isLoading } = useGetAdminHeroProductsQuery();
    const [deleteHeroProduct, { isLoading: deleting }] = useDeleteHeroProductMutation();
    const [createHeroProduct] = useCreateHeroProductMutation();
    const [updateHeroProduct] = useUpdateHeroProductMutation();
    
    // Product search hook
    const { data: searchData, isFetching: searching } = useSearchProductsQuery(searchTerm, {
        skip: searchTerm.length < 2
    });

    const heroProducts = heroProductsData?.data || [];
    const allProducts = searchData?.data || [];

    // Badge color options
    const badgeColors = [
        { value: 'bg-pink-500', label: 'Pink' },
        { value: 'bg-red-500', label: 'Red' },
        { value: 'bg-blue-500', label: 'Blue' },
        { value: 'bg-green-500', label: 'Green' },
        { value: 'bg-yellow-500', label: 'Yellow' },
        { value: 'bg-purple-500', label: 'Purple' },
        { value: 'bg-orange-500', label: 'Orange' },
        { value: 'bg-indigo-500', label: 'Indigo' }
    ];

    // Size options
    const sizeOptions = [
        { value: 'large', label: 'Large (Top)' },
        { value: 'small', label: 'Small (Bottom)' }
    ];

    const handleAddNew = () => {
        if (heroProducts.length >= 3) {
            toast.error('Maximum 3 hero products allowed (1 large + 2 small)');
            return;
        }
        
        const existingLarge = heroProducts.filter(p => p.size === 'large').length;
        let defaultSize = existingLarge === 0 ? 'large' : 'small';
        
        setEditingProduct(null);
        setFormData({
            productId: '',
            customImage: '',
            size: defaultSize,
            badge: { text: '', color: 'bg-pink-500' },
            order: heroProducts.length
        });
        setSearchTerm('');
        setSelectedProduct(null);
        setErrors({});
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        const productInfo = typeof product.productId === 'object' ? product.productId : null;
        setSelectedProduct(productInfo);
        
        setFormData({
            productId: productInfo?._id || product.productId || '',
            customImage: product.customImage || '',
            size: product.size || 'large',
            badge: product.badge || { text: '', color: 'bg-pink-500' },
            order: product.order || 0
        });
        
        setSearchTerm(productInfo?.title || '');
        setErrors({});
        setShowModal(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        try {
            const result = await deleteHeroProduct(productToDelete._id).unwrap();
            if (result.success) {
                toast.success('Product removed from hero section');
            }
        } catch (error) {
            console.error('Error removing product:', error);
            toast.error('Error removing product');
        } finally {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            let result;
            if (editingProduct) {
                result = await updateHeroProduct({ id: editingProduct._id, data: formData }).unwrap();
            } else {
                result = await createHeroProduct(formData).unwrap();
            }

            if (result.success) {
                toast.success(editingProduct ? 'Hero product updated successfully' : 'Hero product added successfully');
                setShowModal(false);
                setShowProductDropdown(false);
            }
        } catch (error) {
            console.error('Error saving hero product:', error);
            toast.error('Error saving hero product');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('badge.')) {
            const badgeField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                badge: { ...prev.badge, [badgeField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.size) newErrors.size = 'Size is required';
        if (!selectedProduct) newErrors.product = 'Please select a product';
        if (!formData.badge.text) newErrors.badgeText = 'Badge text is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setFormData(prev => ({ ...prev, productId: product._id }));
        setSearchTerm(product.title);
        setShowProductDropdown(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hero Products Management</h1>
                    <p className="text-gray-600">Manage products displayed in hero section</p>
                </div>
                <button
                    onClick={handleAddNew}
                    disabled={heroProducts.length >= 3}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                        heroProducts.length >= 3 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    {heroProducts.length >= 3 ? 'Max Products (3)' : 'Add Product'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {heroProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                            <Plus className="w-10 h-10 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Hero Products Yet</h3>
                        <button onClick={handleAddNew} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600">
                            Add First Product
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {heroProducts.map((heroProduct) => {
                                    const product = typeof heroProduct.productId === 'object' ? heroProduct.productId : null;
                                    return (
                                        <tr key={heroProduct._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-16 h-10 rounded bg-gray-100 flex items-center justify-center text-xs">
                                                    {heroProduct.size}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{product?.title || 'Unknown Product'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${heroProduct.size === 'large' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                                                    {heroProduct.size}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs text-white ${heroProduct.badge?.color}`}>
                                                    {heroProduct.badge?.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{heroProduct.order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleEdit(heroProduct)} className="p-1 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteClick(heroProduct)} className="p-1 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">{editingProduct ? 'Edit' : 'Add'} Hero Product</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Search Product</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setShowProductDropdown(true); }}
                                        className="w-full pl-10 pr-3 py-2 border rounded"
                                        placeholder="Type to search..."
                                    />
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    {showProductDropdown && allProducts.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                                            {allProducts.map(p => (
                                                <div key={p._id} onClick={() => handleProductSelect(p)} className="p-2 hover:bg-gray-100 cursor-pointer">
                                                    {p.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size</label>
                                    <select name="size" value={formData.size} onChange={handleInputChange} className="w-full p-2 border rounded">
                                        <option value="large">Large</option>
                                        <option value="small">Small</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Order</label>
                                    <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Badge Text</label>
                                    <input type="text" name="badge.text" value={formData.badge.text} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Badge Color</label>
                                    <select name="badge.color" value={formData.badge.color} onChange={handleInputChange} className="w-full p-2 border rounded">
                                        {badgeColors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Remove Hero Product"
                message="Are you sure you want to remove this product from the hero section?"
                isLoading={deleting}
            />
        </div>
    );
}
