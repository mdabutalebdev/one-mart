'use client';

import React, { useState } from 'react';
import { Search, Link2, Package, ExternalLink } from 'lucide-react';
import { useGetAdminProductsQuery } from '@/redux/api/productsApi';
import UpsellDetailsModal from '@/components/Admin/UpsellDetailsModal';

export default function UpsellsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // RTK Query hooks
    const { data: productsData, isLoading } = useGetAdminProductsQuery({ 
        page: currentPage, 
        search: searchTerm,
        limit: 10
    });

    const products = productsData?.data || [];
    const pagination = productsData?.pagination || { totalPages: 1 };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    if (isLoading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Upsells</h1>
                <p className="text-gray-600">Manage upsell relationships for your products</p>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upsell Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No products found</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.featuredImage} className="h-10 w-10 rounded object-cover" alt="" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                <div className="text-xs text-gray-500">{product.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Link2 className="w-4 h-4 text-gray-400 mr-2" />
                                            {product.upsellCount || 0} linked products
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">৳{product.basePrice}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleViewDetails(product)} className="text-pink-600 hover:text-pink-900">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center text-sm">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                    <span>Page {currentPage} of {pagination.totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            )}

            {showDetailsModal && selectedProduct && (
                <UpsellDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}
