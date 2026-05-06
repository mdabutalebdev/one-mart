'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Coins, Percent, DollarSign, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetLoyaltySettingsQuery, useUpdateLoyaltySettingsMutation } from '@/redux/api/loyaltyApi';

export default function LoyaltySettingsPage() {
    const router = useRouter();
    const { data: loyaltyData, isLoading } = useGetLoyaltySettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateLoyaltySettingsMutation();

    const [settings, setSettings] = useState({
        coinPerItem: 1,
        coinValue: 1,
        isLoyaltyEnabled: true,
        minRedeemAmount: 10
    });

    useEffect(() => {
        if (loyaltyData?.data) {
            setSettings(loyaltyData.data);
        }
    }, [loyaltyData]);

    const handleSave = async () => {
        try {
            const result = await updateSettings(settings).unwrap();
            if (result.success) toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900"><ArrowLeft className="h-5 w-5" /></button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Coins className="h-8 w-8 text-pink-500" /> Loyalty Settings
                            </h1>
                            <p className="text-gray-600">Configure coins and rewards system</p>
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={isSaving} className="bg-pink-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                        <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Coins className="h-5 w-5 text-pink-500" /> Loyalty System</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coins per Item</label>
                                <input type="number" value={settings.coinPerItem} onChange={e => setSettings({...settings, coinPerItem: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coin Value (৳)</label>
                                <input type="number" value={settings.coinValue} onChange={e => setSettings({...settings, coinValue: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Percent className="h-5 w-5 text-pink-500" /> Redemption</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Redeem Amount (৳)</label>
                            <input type="number" value={settings.minRedeemAmount} onChange={e => setSettings({...settings, minRedeemAmount: e.target.value})} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
