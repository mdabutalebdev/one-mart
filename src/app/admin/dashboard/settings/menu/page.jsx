'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    useGetHeaderMenusQuery, 
    useGetFooterMenusQuery,
    useCreateHeaderMenuMutation,
    useUpdateHeaderMenuMutation,
    useDeleteHeaderMenuMutation,
    useCreateFooterMenuMutation,
    useUpdateFooterMenuMutation,
    useDeleteFooterMenuMutation
} from '@/redux/api/menuApi';

export default function MenuSettings() {
    const [activeTab, setActiveTab] = useState('header');
    const { data: headerData, isLoading: loadingHeader } = useGetHeaderMenusQuery();
    const { data: footerData, isLoading: loadingFooter } = useGetFooterMenusQuery();

    const [createHeader] = useCreateHeaderMenuMutation();
    const [updateHeader] = useUpdateHeaderMenuMutation();
    const [deleteHeader] = useDeleteHeaderMenuMutation();
    
    const [createFooter] = useCreateFooterMenuMutation();
    const [updateFooter] = useUpdateFooterMenuMutation();
    const [deleteFooter] = useDeleteFooterMenuMutation();

    const [showForm, setShowForm] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [formData, setFormData] = useState({
        name: '', href: '', order: 0, section: 'quickLinks'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'header') {
                if (editingMenu) await updateHeader({ id: editingMenu._id, ...formData }).unwrap();
                else await createHeader(formData).unwrap();
            } else {
                if (editingMenu) await updateFooter({ id: editingMenu._id, ...formData }).unwrap();
                else await createFooter(formData).unwrap();
            }
            toast.success('Menu saved successfully');
            setShowForm(false);
        } catch (error) {
            toast.error('Failed to save menu');
        }
    };

    if (loadingHeader || loadingFooter) return <div className="p-6">Loading...</div>;

    const menus = activeTab === 'header' ? headerData?.data || [] : (footerData?.data?.quickLinks || []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Menu Management</h1>
            <div className="flex gap-4 border-b mb-6">
                <button onClick={() => setActiveTab('header')} className={`pb-2 ${activeTab === 'header' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Header</button>
                <button onClick={() => setActiveTab('footer')} className={`pb-2 ${activeTab === 'footer' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Footer</button>
            </div>

            <button onClick={() => { setEditingMenu(null); setFormData({name:'', href:'', order:0, section:'quickLinks'}); setShowForm(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg mb-6 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Menu Item
            </button>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">URL</th>
                            <th className="px-6 py-3">Order</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {menus.map(menu => (
                            <tr key={menu._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{menu.name}</td>
                                <td className="px-6 py-4 text-gray-500">{menu.href}</td>
                                <td className="px-6 py-4">{menu.order}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => { setEditingMenu(menu); setFormData(menu); setShowForm(true); }} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Edit className="h-4 w-4" /></button>
                                    <button onClick={async () => { if(confirm('Delete?')) activeTab === 'header' ? await deleteHeader(menu._id) : await deleteFooter(menu._id); }} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingMenu ? 'Edit' : 'Add'} Menu Item</h2>
                            <button onClick={() => setShowForm(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <input required value={formData.href} onChange={e => setFormData({...formData, href: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium">Save Menu</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
