'use client';

import React, { useState } from 'react';
import { Plus, Minus, Search, ShoppingCart, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSearchUsersQuery } from '@/redux/api/usersApi';
import { useSearchProductsQuery } from '@/redux/api/productsApi';
import { useCreateManualOrderMutation } from '@/redux/api/ordersApi';

export default function ManualOrderCreation() {
    const router = useRouter();
    const [orderType, setOrderType] = useState('guest');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', address: '' });
    const [deliveryCharge, setDeliveryCharge] = useState(120);

    // RTK Query hooks
    const { data: usersData, isFetching: searchingUsers } = useSearchUsersQuery(userSearchTerm, {
        skip: userSearchTerm.length < 3
    });
    const { data: productsData, isFetching: searchingProducts } = useSearchProductsQuery(productSearchTerm, {
        skip: productSearchTerm.length < 2
    });
    const [createManualOrder, { isLoading: saving }] = useCreateManualOrderMutation();

    const users = usersData?.data || [];
    const products = productsData?.data || [];

    const handleAddProduct = (product) => {
        if (orderItems.find(item => item.productId === product._id)) {
            toast.error('Product already in order');
            return;
        }
        const newItem = {
            productId: product._id,
            title: product.title,
            price: product.basePrice || 0,
            quantity: 1,
            total: product.basePrice || 0
        };
        setOrderItems([...orderItems, newItem]);
        setProductSearchTerm('');
    };

    const handleUpdateQuantity = (id, delta) => {
        setOrderItems(orderItems.map(item => 
            item.productId === id ? { 
                ...item, 
                quantity: Math.max(1, item.quantity + delta),
                total: Math.max(1, item.quantity + delta) * item.price
            } : item
        ));
    };

    const handleRemoveItem = (id) => {
        setOrderItems(orderItems.filter(item => item.productId !== id));
    };

    const calculateSubtotal = () => orderItems.reduce((acc, item) => acc + item.total, 0);
    const calculateTotal = () => calculateSubtotal() + deliveryCharge;

    const handleSubmit = async () => {
        if (orderItems.length === 0) {
            toast.error('Add at least one product');
            return;
        }
        if (orderType === 'guest' && (!guestInfo.name || !guestInfo.phone || !guestInfo.address)) {
            toast.error('Complete guest information');
            return;
        }
        if (orderType === 'existing' && !selectedUser) {
            toast.error('Select a user');
            return;
        }

        try {
            const orderData = {
                orderType,
                items: orderItems,
                subtotal: calculateSubtotal(),
                shippingCost: deliveryCharge,
                totalAmount: calculateTotal(),
                ...(orderType === 'existing' ? { userId: selectedUser._id } : { guestInfo })
            };
            const result = await createManualOrder(orderData).unwrap();
            if (result.success) {
                toast.success('Order created successfully');
                router.push('/admin/dashboard/orders');
            }
        } catch (error) {
            toast.error('Failed to create order');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Create Manual Order</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setOrderType('guest')} 
                        className={`flex-1 py-2 rounded-lg border ${orderType === 'guest' ? 'bg-blue-50 border-blue-600 text-blue-600' : ''}`}
                    >Guest Order</button>
                    <button 
                        onClick={() => setOrderType('existing')} 
                        className={`flex-1 py-2 rounded-lg border ${orderType === 'existing' ? 'bg-blue-50 border-blue-600 text-blue-600' : ''}`}
                    >Existing User</button>
                </div>

                {orderType === 'existing' ? (
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">Search User</label>
                        <input 
                            type="text" 
                            placeholder="Search by name, email or phone..." 
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        {users.length > 0 && userSearchTerm.length >= 3 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                                {users.map(u => (
                                    <div key={u._id} onClick={() => { setSelectedUser(u); setUserSearchTerm(u.name); }} className="p-2 hover:bg-gray-100 cursor-pointer">
                                        {u.name} ({u.email})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Name" value={guestInfo.name} onChange={e => setGuestInfo({...guestInfo, name: e.target.value})} className="p-2 border rounded" />
                        <input placeholder="Phone" value={guestInfo.phone} onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})} className="p-2 border rounded" />
                        <textarea placeholder="Address" value={guestInfo.address} onChange={e => setGuestInfo({...guestInfo, address: e.target.value})} className="col-span-2 p-2 border rounded" />
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <h2 className="text-lg font-semibold">Add Products</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search product..." 
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                    {products.length > 0 && productSearchTerm.length >= 2 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                            {products.map(p => (
                                <div key={p._id} onClick={() => handleAddProduct(p)} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                    <img src={p.featuredImage} className="w-8 h-8 rounded" alt="" />
                                    <span>{p.title} - ৳{p.basePrice}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {orderItems.map(item => (
                        <div key={item.productId} className="flex items-center gap-4 p-3 border rounded-lg">
                            <span className="flex-1 font-medium">{item.title}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleUpdateQuantity(item.productId, -1)} className="p-1 border rounded"><Minus className="w-4 h-4" /></button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(item.productId, 1)} className="p-1 border rounded"><Plus className="w-4 h-4" /></button>
                            </div>
                            <span className="w-20 text-right font-semibold">৳{item.total}</span>
                            <button onClick={() => handleRemoveItem(item.productId)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>৳{calculateSubtotal()}</span></div>
                <div className="flex justify-between items-center">
                    <span>Delivery Charge:</span>
                    <input type="number" value={deliveryCharge} onChange={e => setDeliveryCharge(parseInt(e.target.value) || 0)} className="w-20 p-1 border rounded text-right" />
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2"><span>Total:</span><span>৳{calculateTotal()}</span></div>
                <button 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                >{saving ? 'Creating Order...' : 'Confirm Order'}</button>
            </div>
        </div>
    );
}