'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import { 
    useGetAdminAndroidBannersQuery, 
    useDeleteAndroidBannerMutation,
    useCreateAndroidBannerMutation,
    useUpdateAndroidBannerMutation,
    useToggleAndroidBannerStatusMutation
} from '@/redux/api/androidBannersApi';

export default function AndroidBannerPage() {
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    const [formData, setFormData] = useState({
        image: '',
        link: '',
        isActive: true
    });

    // RTK Query hooks
    const { data: bannersData, isLoading } = useGetAdminAndroidBannersQuery({ page, limit: 10 });
    const [deleteAndroidBanner, { isLoading: deleting }] = useDeleteAndroidBannerMutation();
    const [createAndroidBanner] = useCreateAndroidBannerMutation();
    const [updateAndroidBanner] = useUpdateAndroidBannerMutation();
    const [toggleStatus] = useToggleAndroidBannerStatusMutation();

    const banners = bannersData?.data?.banners || [];
    const pagination = bannersData?.data?.pagination || { totalPages: 1, totalItems: 0, currentPage: 1, limit: 10 };

    const handleAddNew = () => {
        setEditingBanner(null);
        setFormData({ image: '', link: '', isActive: true });
        setShowModal(true);
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            image: banner.image || '',
            link: banner.link || '',
            isActive: banner.isActive !== undefined ? banner.isActive : true
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
                result = await updateAndroidBanner({ id: editingBanner._id, data: formData }).unwrap();
            } else {
                result = await createAndroidBanner(formData).unwrap();
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
            const result = await deleteAndroidBanner(bannerToDelete._id).unwrap();
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

    const handleToggleStatus = async (banner) => {
        try {
            const result = await toggleStatus(banner._id).unwrap();
            if (result.success) {
                toast.success(`Banner status updated successfully`);
            }
        } catch (error) {
            console.error('Error toggling banner status:', error);
            toast.error('Failed to toggle banner status');
        }
    };

    if (isLoading && page === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Android Banners</h1>
                    <p className="text-sm text-gray-500">Manage banners displayed in the Android app</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add New Banner
                </button>
            </div>

            {banners.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No android banners found</h3>
                    <button onClick={handleAddNew} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Create Banner</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {banners.map((banner) => (
                            <div key={banner._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="relative h-48">
                                    <img src={banner.image} alt="Android Banner" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => handleToggleStatus(banner)}
                                            className={`p-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                                        >
                                            {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600 truncate mb-2">{banner.link || 'No link'}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(banner.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(banner)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded text-sm">Edit</button>
                                        <button onClick={() => { setBannerToDelete(banner); setShowDeleteModal(true); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border rounded disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="flex items-center px-4">Page {page} of {pagination.totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-2 border rounded disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingBanner ? 'Edit' : 'Create'} Android Banner</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL *</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                    className="w-full p-2 border rounded"
                                    placeholder="/offer/..."
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm">Active</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Android Banner"
                message="Are you sure you want to delete this banner?"
                isLoading={deleting}
            />
        </div>
    );
}
