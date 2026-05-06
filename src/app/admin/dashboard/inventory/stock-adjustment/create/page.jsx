'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
    Search, 
    X,
    RefreshCw,
    TrendingDown,
    ArrowLeft
} from 'lucide-react';
import { useSearchProductsQuery } from '@/redux/api/productsApi';
import { useCreateStockAdjustmentMutation } from '@/redux/api/inventoryApi';

const REASONS = [
    { value: 'damaged', label: 'Damaged' },
    { value: 'expired', label: 'Expired' },
    { value: 'lost', label: 'Lost' },
    { value: 'theft', label: 'Theft' },
    { value: 'returned', label: 'Returned' },
    { value: 'defective', label: 'Defective' },
    { value: 'waste', label: 'Waste' },
    { value: 'other', label: 'Other' }
];

const CreateStockAdjustmentPage = () => {
    const router = useRouter();
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const { data: searchResults, isFetching: searchingProducts } = useSearchProductsQuery(productSearchTerm, { skip: productSearchTerm.length < 2 });
    const [createAdjustment, { isLoading: submitting }] = useCreateStockAdjustmentMutation();

    const [selectedItems, setSelectedItems] = useState([]);
    const [adjustmentNotes, setAdjustmentNotes] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const products = searchResults?.data || [];

    const handleAddProduct = (product) => {
        if (product.variants && product.variants.length > 0) {
            setCurrentProduct(product);
        } else {
            const newItem = {
                productId: product._id,
                title: product.title,
                variantSku: null,
                currentStock: product.totalStock || 0,
                quantity: 1,
                reason: 'damaged'
            };
            if (selectedItems.find(i => i.productId === product._id)) return toast.error('Already added');
            setSelectedItems([...selectedItems, newItem]);
            setProductSearchTerm('');
        }
    };

    const handleAddVariant = () => {
        if (!selectedVariant) return;
        const newItem = {
            productId: currentProduct._id,
            title: `${currentProduct.title} (${selectedVariant.sku})`,
            variantSku: selectedVariant.sku,
            currentStock: selectedVariant.stockQuantity || 0,
            quantity: 1,
            reason: 'damaged'
        };
        if (selectedItems.find(i => i.variantSku === selectedVariant.sku)) return toast.error('Already added');
        setSelectedItems([...selectedItems, newItem]);
        setCurrentProduct(null);
        setSelectedVariant(null);
        setProductSearchTerm('');
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) return toast.error('Add items');
        try {
            await createAdjustment({ items: selectedItems, notes: adjustmentNotes }).unwrap();
            toast.success('Adjustment created');
            router.push('/admin/dashboard/inventory/stock-adjustment');
        } catch (error) {
            toast.error('Failed to create adjustment');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()}><ArrowLeft className="w-6 h-6" /></button>
                <h1 className="text-2xl font-bold">New Stock Adjustment</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        placeholder="Search product..." 
                        value={productSearchTerm}
                        onChange={e => setProductSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 border rounded-lg"
                    />
                    {products.length > 0 && productSearchTerm.length >= 2 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {products.map(p => (
                                <div key={p._id} onClick={() => handleAddProduct(p)} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                                    <img src={p.featuredImage} className="w-10 h-10 rounded" alt="" />
                                    <span>{p.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {currentProduct && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                        <p className="font-semibold">Select Variant for {currentProduct.title}</p>
                        <select onChange={e => setSelectedVariant(currentProduct.variants.find(v => v.sku === e.target.value))} className="w-full p-2 border rounded">
                            <option value="">Select Variant</option>
                            {currentProduct.variants.map(v => (
                                <option key={v.sku} value={v.sku}>{v.sku} (Stock: {v.stockQuantity})</option>
                            ))}
                        </select>
                        <button onClick={handleAddVariant} className="bg-blue-600 text-white px-4 py-2 rounded">Add Variant</button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <h2 className="text-lg font-semibold">Adjustment Items</h2>
                <div className="space-y-3">
                    {selectedItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">Stock: {item.currentStock}</p>
                            </div>
                            <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={e => {
                                    const updated = [...selectedItems];
                                    updated[index].quantity = parseInt(e.target.value);
                                    setSelectedItems(updated);
                                }}
                                className="w-20 p-1 border rounded text-center" 
                            />
                            <select 
                                value={item.reason}
                                onChange={e => {
                                    const updated = [...selectedItems];
                                    updated[index].reason = e.target.value;
                                    setSelectedItems(updated);
                                }}
                                className="p-1 border rounded"
                            >
                                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            <button onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== index))} className="text-red-500"><X className="w-5 h-5" /></button>
                        </div>
                    ))}
                </div>
                <textarea 
                    placeholder="Adjustment notes..." 
                    value={adjustmentNotes}
                    onChange={e => setAdjustmentNotes(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                />
                <button 
                    onClick={handleSubmit} 
                    disabled={submitting}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                    {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <TrendingDown className="w-5 h-5" />} Confirm Adjustment
                </button>
            </div>
        </div>
    );
};

export default CreateStockAdjustmentPage;
