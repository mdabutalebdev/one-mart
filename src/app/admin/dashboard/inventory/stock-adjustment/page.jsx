'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
    Plus, 
    RefreshCw,
    TrendingUp,
    Eye,
    X
} from 'lucide-react';
import { 
    useGetStockAdjustmentsQuery, 
    useLazyGetStockAdjustmentByIdQuery 
} from '@/redux/api/inventoryApi';

const StockAdjustmentPage = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data: adjustmentsData, isLoading: loading, isFetching } = useGetStockAdjustmentsQuery({ page, limit: 20 });
    const [fetchDetails, { isFetching: loadingDetails }] = useLazyGetStockAdjustmentByIdQuery();
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState(null);

    const adjustments = adjustmentsData?.data || [];
    const totalPages = adjustmentsData?.pagination?.totalPages || 1;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getReasonLabel = (reason) => {
        const reasonMap = {
            'damaged': 'Damaged',
            'expired': 'Expired',
            'lost': 'Lost',
            'theft': 'Theft',
            'returned': 'Returned',
            'defective': 'Defective',
            'waste': 'Waste',
            'other': 'Other'
        };
        return reasonMap[reason] || reason;
    };

    const handleViewDetails = async (adjustmentId) => {
        try {
            const response = await fetchDetails(adjustmentId).unwrap();
            if (response.success) {
                setSelectedAdjustment(response.data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            toast.error('Failed to fetch adjustment details');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage stock adjustments and track inventory reductions</p>
                </div>
                <button
                    onClick={() => router.push('/admin/dashboard/inventory/stock-adjustment/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Stock Adjustment</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isFetching && <div className="h-1 bg-blue-600 animate-pulse" />}
                
                {adjustments.length === 0 ? (
                    <div className="p-12 text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No stock adjustments found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustment #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {adjustments.map((adjustment) => (
                                    <tr key={adjustment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adjustment._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(adjustment.createdAt)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{adjustment.items?.length || 0} items</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">-{adjustment.totalQuantity || adjustment.items?.reduce((acc, i) => acc + i.quantity, 0) || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleViewDetails(adjustment._id)}
                                                disabled={loadingDetails}
                                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 disabled:opacity-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showDetailsModal && selectedAdjustment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-bold">Adjustment Details</h3>
                            <button onClick={() => setShowDetailsModal(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{formatDate(selectedAdjustment.createdAt)}</p></div>
                                <div><p className="text-xs text-gray-500">Performed By</p><p className="font-medium">{selectedAdjustment.performedBy?.name}</p></div>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Product</th>
                                            <th className="px-4 py-2 text-right">Qty</th>
                                            <th className="px-4 py-2">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedAdjustment.items?.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2">{item.product?.title}</td>
                                                <td className="px-4 py-2 text-right text-red-600">-{item.quantity}</td>
                                                <td className="px-4 py-2 text-center"><span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">{getReasonLabel(item.reason)}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockAdjustmentPage;
