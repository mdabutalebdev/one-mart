'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Package, Search, Plus, X, Calendar, User, Eye, ShoppingCart, DollarSign } from 'lucide-react';
import { 
    useGetPurchasesQuery, 
    useCreatePurchaseMutation 
} from '@/redux/api/inventoryApi';
import { useSearchProductsQuery } from '@/redux/api/productsApi';

export default function InventoryPage() {
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [notes, setNotes] = useState('');

    // RTK Query hooks
    const { data: purchasesData, isLoading: loadingPurchases } = useGetPurchasesQuery({ page });
    const [createPurchase, { isLoading: submitting }] = useCreatePurchaseMutation();
    
    // Product search
    const { data: searchData, isFetching: searching } = useSearchProductsQuery(searchTerm, {
        skip: searchTerm.length < 2
    });

    const purchases = purchasesData?.data || [];
    const products = searchData?.data || [];

    const handleAddProduct = (product) => {
        if (selectedProducts.find(p => p._id === product._id)) {
            toast.error('Product already added');
            return;
        }
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1, costPrice: product.basePrice || 0 }]);
        setSearchTerm('');
    };

    const handleRemoveProduct = (id) => {
        setSelectedProducts(selectedProducts.filter(p => p._id !== id));
    };

    const handleUpdateItem = (id, field, value) => {
        setSelectedProducts(selectedProducts.map(p => 
            p._id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleSubmitPurchase = async () => {
        if (selectedProducts.length === 0) {
            toast.error('Please add products');
            return;
        }
        try {
            const result = await createPurchase({
                items: selectedProducts.map(p => ({ productId: p._id, quantity: p.quantity, unitCost: p.costPrice })),
                notes
            }).unwrap();
            if (result.success) {
                toast.success('Purchase recorded successfully');
                setShowPurchaseForm(false);
                setSelectedProducts([]);
                setNotes('');
            }
        } catch (error) {
            toast.error('Failed to record purchase');
        }
    };

    if (loadingPurchases && page === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600">Manage stock purchases and track inventory</p>
                </div>
                <button
                    onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {showPurchaseForm ? 'Cancel' : 'Add Purchase'}
                </button>
            </div>

            {showPurchaseForm && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">New Stock Purchase</h2>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search product to add..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                        {products.length > 0 && searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                                {products.map(p => (
                                    <div key={p._id} onClick={() => handleAddProduct(p)} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                        <img src={p.featuredImage} className="w-8 h-8 rounded" alt="" />
                                        <span>{p.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 mb-4">
                        {selectedProducts.map(p => (
                            <div key={p._id} className="flex items-center gap-4 p-3 border rounded">
                                <span className="flex-1 font-medium">{p.title}</span>
                                <input
                                    type="number"
                                    value={p.quantity}
                                    onChange={(e) => handleUpdateItem(p._id, 'quantity', parseInt(e.target.value))}
                                    className="w-20 p-1 border rounded"
                                    placeholder="Qty"
                                />
                                <input
                                    type="number"
                                    value={p.costPrice}
                                    onChange={(e) => handleUpdateItem(p._id, 'costPrice', parseFloat(e.target.value))}
                                    className="w-24 p-1 border rounded"
                                    placeholder="Cost"
                                />
                                <button onClick={() => handleRemoveProduct(p._id)} className="text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Purchase notes..."
                        className="w-full p-2 border rounded mb-4"
                    />

                    <button
                        onClick={handleSubmitPurchase}
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Record Purchase'}
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {purchases.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{p._id}</td>
                                <td className="px-6 py-4">৳{p.totalAmount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{p.items.length} products</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
