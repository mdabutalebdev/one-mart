'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Edit2, Save, X, ChevronLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    useGetDivisionsQuery, 
    useGetDistrictsQuery,
    useGetUpazilasQuery,
    useGetDhakaCityAreasQuery,
    useUpdateAddressItemMutation,
    useDeleteAddressItemMutation 
} from '@/redux/api/addressApi';

const TABS = [
    { id: 'divisions', label: 'Divisions' },
    { id: 'districts', label: 'Districts' },
    { id: 'upazilas', label: 'Upazilas' },
    { id: 'dhaka-city', label: 'Dhaka City' }
];

export default function AddressSettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('divisions');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', bn_name: '', isActive: true });

    // RTK Query hooks
    const divisionsQuery = useGetDivisionsQuery({ page, search: searchTerm }, { skip: activeTab !== 'divisions' });
    const districtsQuery = useGetDistrictsQuery({ page, search: searchTerm }, { skip: activeTab !== 'districts' });
    const upazilasQuery = useGetUpazilasQuery({ page, search: searchTerm }, { skip: activeTab !== 'upazilas' });
    const dhakaCityQuery = useGetDhakaCityAreasQuery({ page, search: searchTerm }, { skip: activeTab !== 'dhaka-city' });

    const [updateItem, { isLoading: isUpdating }] = useUpdateAddressItemMutation();
    const [deleteItem] = useDeleteAddressItemMutation();

    const currentQuery = activeTab === 'divisions' ? divisionsQuery : 
                        activeTab === 'districts' ? districtsQuery : 
                        activeTab === 'upazilas' ? upazilasQuery : dhakaCityQuery;

    const data = currentQuery.data?.data?.data || [];
    const pagination = currentQuery.data?.data?.pagination || { pages: 1 };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, bn_name: item.bn_name, isActive: item.isActive });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateItem({ type: activeTab, id: editingItem._id, data: formData }).unwrap();
            if (result.success) {
                toast.success('Updated successfully');
                setShowModal(false);
            }
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <button onClick={() => router.push('/admin/dashboard/settings')} className="flex items-center text-gray-600 mb-4"><ChevronLeft className="h-4 w-4" /> Back</button>
                <div className="flex items-center gap-3">
                    <MapPin className="h-8 w-8 text-blue-500" />
                    <h1 className="text-3xl font-bold">Address Settings</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="flex border-b">
                    {TABS.map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => { setActiveTab(tab.id); setPage(1); }} 
                            className={`px-6 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}`}
                        >{tab.label}</button>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Name (EN)</th>
                            <th className="px-6 py-3 text-left">Name (BN)</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentQuery.isLoading ? (
                            <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">No data found</td></tr>
                        ) : (
                            data.map(item => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono">{item.id}</td>
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{item.bn_name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto">
                                            <Edit2 className="h-4 w-4" /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit {activeTab}</h2>
                            <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name (EN)</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name (BN)</label>
                                <input type="text" value={formData.bn_name} onChange={e => setFormData({...formData, bn_name: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
                                <label htmlFor="isActive">Active</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded" disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
