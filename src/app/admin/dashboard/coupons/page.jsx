'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Percent, DollarSign, Ticket, ChevronLeft, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import { 
    useGetAdminCouponsQuery, 
    useDeleteCouponMutation,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useToggleCouponStatusMutation 
} from '@/redux/api/couponsApi';

export default function CouponsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        maxUsage: '',
        startDate: '',
        endDate: '',
        minOrderAmount: '',
        description: '',
        isActive: true,
        isShowOnPublicly: false
    });

    // RTK Query hooks
    const { data: couponsData, isLoading } = useGetAdminCouponsQuery({ 
        page: currentPage, 
        search: searchTerm, 
        status: statusFilter 
    });
    const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [toggleStatus] = useToggleCouponStatusMutation();

    const coupons = couponsData?.data?.coupons || [];
    const pagination = couponsData?.data?.pagination || { totalPages: 1, totalCoupons: 0 };

    const handleAddNew = () => {
        setEditingCoupon(null);
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxUsage: coupon.maxUsage || '',
            startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
            endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
            minOrderAmount: coupon.minOrderAmount || '',
            description: coupon.description || '',
            isActive: coupon.isActive,
            isShowOnPublicly: coupon.isShowOnPublicly || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (editingCoupon) {
                result = await updateCoupon({ id: editingCoupon._id, data: formData }).unwrap();
            } else {
                result = await createCoupon(formData).unwrap();
            }

            if (result.success) {
                toast.success(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving coupon:', error);
            toast.error('Failed to save coupon');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deleteCoupon(couponToDelete._id).unwrap();
            if (result.success) {
                toast.success('Coupon deleted successfully!');
                setShowDeleteModal(false);
                setCouponToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const result = await toggleStatus(id).unwrap();
            if (result.success) {
                toast.success('Status updated successfully!');
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Failed to update status');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '', discountType: 'percentage', discountValue: '',
            maxUsage: '', startDate: '', endDate: '', minOrderAmount: '',
            description: '', isActive: true, isShowOnPublicly: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'code' ? value.toUpperCase() : value)
        }));
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
                    <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
                    <p className="text-gray-600">Manage discount coupons and promotional codes</p>
                </div>
                <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <Plus className="h-4 w-4 mr-2" /> Create Coupon
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {coupons.length === 0 ? (
                    <div className="p-12 text-center">
                        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No coupons found</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{coupon.code}</div>
                                            <div className="text-xs text-gray-500">{coupon.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '৳'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {coupon.usedCount} / {coupon.maxUsage || '∞'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                            <button onClick={() => handleToggleStatus(coupon._id)} className="text-gray-400">
                                                {coupon.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                            </button>
                                            <button onClick={() => handleEdit(coupon)} className="text-blue-600"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => { setCouponToDelete(coupon); setShowDeleteModal(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t flex justify-between items-center">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                        <span>Page {currentPage} of {pagination.totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))} disabled={currentPage === pagination.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingCoupon ? 'Edit' : 'Create'} Coupon</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Coupon Code *</label>
                                <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full p-2 border rounded">
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Value *</label>
                                    <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Usage</label>
                                    <input type="number" name="maxUsage" value={formData.maxUsage} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Min Order Amount</label>
                                    <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date *</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">
                                    {(isCreating || isUpdating) ? 'Saving...' : 'Save Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon?"
                isLoading={isDeleting}
            />
        </div>
    );
}
