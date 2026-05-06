'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetAffiliateSettingsQuery, useUpdateAffiliateSettingsMutation } from '@/redux/api/affiliateApi';

export default function AffiliateSettingsPage() {
    const router = useRouter();
    const { data: affiliateData, isLoading } = useGetAffiliateSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateAffiliateSettingsMutation();

    const [settings, setSettings] = useState({
        isAffiliateEnabled: true,
        purchaserDiscountType: 'percentage',
        purchaserDiscountValue: 5,
        referrerLoyaltyPointsPerPurchase: 10,
        purchaserLoyaltyPointsPerPurchase: 5
    });

    useEffect(() => {
        if (affiliateData?.data) setSettings(affiliateData.data);
    }, [affiliateData]);

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
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="h-8 w-8 text-purple-600" /> Affiliate Settings</h1>
                    <p className="text-gray-600">Configure affiliate program rewards</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Enable Affiliate System</h3>
                            <p className="text-sm text-gray-500">Turn program on or off</p>
                        </div>
                        <button onClick={() => setSettings({...settings, isAffiliateEnabled: !settings.isAffiliateEnabled})} className={`w-11 h-6 rounded-full transition-colors ${settings.isAffiliateEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${settings.isAffiliateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold mb-4">Rewards Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Referrer Points</label>
                                <input type="number" value={settings.referrerLoyaltyPointsPerPurchase} onChange={e => setSettings({...settings, referrerLoyaltyPointsPerPurchase: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Purchaser Discount (%)</label>
                                <input type="number" value={settings.purchaserDiscountValue} onChange={e => setSettings({...settings, purchaserDiscountValue: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                        <Save className="h-5 w-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
