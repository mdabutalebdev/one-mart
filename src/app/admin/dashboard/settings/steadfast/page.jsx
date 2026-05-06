'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, Save, Key, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetSteadfastSettingsQuery, useUpdateSteadfastSettingsMutation } from '@/redux/api/steadfastApi';

export default function SteadfastSettingsPage() {
    const router = useRouter();
    const { data: steadfastData, isLoading } = useGetSteadfastSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateSteadfastSettingsMutation();

    const [settings, setSettings] = useState({ apiKey: '', apiSecret: '' });
    const [showSecret, setShowSecret] = useState(false);

    useEffect(() => {
        if (steadfastData?.data) setSettings(steadfastData.data);
    }, [steadfastData]);

    const handleSave = async () => {
        try {
            await updateSettings(settings).unwrap();
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (isLoading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"><ArrowLeft className="h-5 w-5" /> Back</button>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Truck className="h-8 w-8 text-orange-600" /> Steadfast Configuration</h1>
                    <p className="text-gray-600">Configure courier API credentials</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Key className="h-4 w-4" /> API Key</label>
                        <input value={settings.apiKey} onChange={e => setSettings({...settings, apiKey: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Enter API Key" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Lock className="h-4 w-4" /> API Secret</label>
                        <div className="relative">
                            <input type={showSecret ? 'text' : 'password'} value={settings.apiSecret} onChange={e => setSettings({...settings, apiSecret: e.target.value})} className="w-full p-2 border rounded-lg pr-10" placeholder="Enter API Secret" />
                            <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-2.5 text-gray-400">{showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                        <Save className="h-5 w-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
