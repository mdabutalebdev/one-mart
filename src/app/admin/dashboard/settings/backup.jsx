'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Store, Package, ShoppingCart, CreditCard, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/redux/api/generalSettingsApi';

export default function SettingsPage() {
    const { data: settingsData, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
    
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
    });

    useEffect(() => {
        if (settingsData?.data) setSettings(settingsData.data);
    }, [settingsData]);

    const handleSave = async () => {
        try {
            await updateSettings(settings).unwrap();
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    const tabs = [
        { id: 'general', label: 'General', icon: Store },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="h-6 w-6 text-pink-600" /> System Settings</h1>
                <p className="text-gray-600">Configure your store preferences</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="border-b overflow-x-auto">
                    <div className="flex px-4">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors font-medium text-sm ${activeTab === tab.id ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <tab.icon className="h-4 w-4" /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Site Name</label>
                                <input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Email</label>
                                <input value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Site Description</label>
                                <textarea value={settings.siteDescription} onChange={e => setSettings({...settings, siteDescription: e.target.value})} className="w-full p-2 border rounded-lg" rows={3} />
                            </div>
                        </div>
                    )}
                    {activeTab !== 'general' && (
                        <div className="py-12 text-center text-gray-400">
                            Settings for {activeTab} will be available soon.
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button onClick={handleSave} disabled={isSaving} className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
