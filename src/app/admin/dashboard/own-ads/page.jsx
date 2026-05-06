'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Presentation, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import Link from 'next/link';
import { 
    useGetAdminAdsQuery, 
    useDeleteAdMutation, 
    useToggleAdStatusMutation 
} from '@/redux/api/adsApi';

export default function OwnAdsPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);

    // RTK Query hooks
    const { data: adsData, isLoading } = useGetAdminAdsQuery({ 
        page: currentPage, 
        search: searchTerm, 
        position: positionFilter 
    });
    const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();
    const [toggleStatus] = useToggleAdStatusMutation();

    const ads = adsData?.data?.ads || [];
    const pagination = adsData?.data?.pagination || { totalPages: 1 };

    const handleToggleStatus = async (id) => {
        try {
            const result = await toggleStatus(id).unwrap();
            if (result.success) toast.success('Ad status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deleteAd(adToDelete._id).unwrap();
            if (result.success) {
                toast.success('Ad deleted successfully');
                setShowDeleteModal(false);
            }
        } catch (error) {
            toast.error('Failed to delete ad');
        }
    };

    if (isLoading && currentPage === 1) {
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
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Presentation className="w-7 h-7 text-blue-600" /> Own Products Ads
                    </h1>
                    <p className="text-gray-500">Manage your product advertisements</p>
                </div>
                <Link href="/admin/dashboard/own-ads/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Create Ad
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
                <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
                    <option value="all">All Positions</option>
                    <option value="homepage-banner">Homepage Banner</option>
                    <option value="product-page">Product Page</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {ads.map((ad) => (
                            <tr key={ad._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={ad.image} alt="" className="h-12 w-12 object-cover rounded" />
                                        <div>
                                            <div className="font-medium text-gray-900">{ad.title}</div>
                                            <div className="text-xs text-gray-500">{ad.product?.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{ad.position}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {ad.isActive ? (
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs font-medium">Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleToggleStatus(ad._id)} className="text-gray-400">
                                            {ad.isActive ? <ToggleRight className="w-5 h-5 text-blue-600" /> : <ToggleLeft className="w-5 h-5" />}
                                        </button>
                                        <Link href={`/admin/dashboard/own-ads/${ad._id}/edit`} className="text-blue-600"><Edit className="w-5 h-5" /></Link>
                                        <button onClick={() => { setAdToDelete(ad); setShowDeleteModal(true); }} className="text-red-600"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={!adsData?.data?.pagination?.hasPrev} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
                    <span>Page {currentPage} of {pagination.totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={!adsData?.data?.pagination?.hasNext} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Ad"
                message={`Are you sure you want to delete "${adToDelete?.title}"?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
