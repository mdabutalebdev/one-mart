'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import { 
    useGetAdminOfferBannersQuery, 
    useDeleteOfferBannerMutation,
    useCreateOfferBannerMutation,
    useUpdateOfferBannerMutation
} from '@/redux/api/offerBannersApi';

export default function OfferBannerPage() {
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        type: 'offer',
        buttonText: '',
        buttonLink: '',
        discountPercentage: '',
        discountText: '',
        isActive: false
    });

    // RTK Query hooks
    const { data: bannersData, isLoading } = useGetAdminOfferBannersQuery();
    const [deleteOfferBanner, { isLoading: deleting }] = useDeleteOfferBannerMutation();
    const [createOfferBanner] = useCreateOfferBannerMutation();
    const [updateOfferBanner] = useUpdateOfferBannerMutation();

    const banners = bannersData?.data || [];

    const handleAddNew = () => {
        setEditingBanner(null);
        setFormData({
            title: '', subtitle: '', image: '', type: 'offer',
            buttonText: '', buttonLink: '', discountPercentage: '',
            discountText: '', isActive: false
        });
        setShowModal(true);
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            image: banner.image || '',
            type: banner.type || 'offer',
            buttonText: banner.buttonText || '',
            buttonLink: banner.buttonLink || '',
            discountPercentage: banner.discountPercentage || '',
            discountText: banner.discountText || '',
            isActive: banner.isActive || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error('Please provide an image for the banner');
            return;
        }

        try {
            let result;
            if (editingBanner) {
                result = await updateOfferBanner({ id: editingBanner._id, data: formData }).unwrap();
            } else {
                result = await createOfferBanner(formData).unwrap();
            }

            if (result.success) {
                toast.success(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error('Failed to save banner');
        }
    };

    const confirmDelete = async () => {
        try {
            const result = await deleteOfferBanner(bannerToDelete._id).unwrap();
            if (result.success) {
                toast.success('Banner deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Failed to delete banner');
        } finally {
            setShowDeleteModal(false);
            setBannerToDelete(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Offer Banners</h1>
                <button
                    onClick={handleAddNew}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Banner
                </button>
            </div>

            {banners.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
                    <button onClick={handleAddNew} className="bg-pink-500 text-white px-6 py-3 rounded-lg">Create Banner</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="relative">
                                <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
                                        {banner.type}
                                    </div>
                                    <div className={`p-1.5 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                                        {banner.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{banner.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{banner.subtitle}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(banner)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded text-sm">Edit</button>
                                    <button onClick={() => { setBannerToDelete(banner); setShowDeleteModal(true); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingBanner ? 'Edit' : 'Create'} Offer Banner</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Subtitle *</label>
                                    <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image URL *</label>
                                    <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded">
                                        <option value="offer">Offer</option>
                                        <option value="promo">Promo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Discount %</label>
                                    <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-4 h-4 text-pink-600" />
                                <label htmlFor="isActive" className="ml-2 text-sm">Active</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-pink-500 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Offer Banner"
                message="Are you sure you want to delete this offer banner?"
                isLoading={deleting}
            />
        </div>
    );
}
