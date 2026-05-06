'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, MessageSquare, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetEmailSMSSettingsQuery, useUpdateEmailSMSSettingsMutation } from '@/redux/api/notificationSettingsApi';

export default function EmailSMSSettingsPage() {
    const router = useRouter();
    const { data: settingsData, isLoading } = useGetEmailSMSSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateEmailSMSSettingsMutation();

    const [settings, setSettings] = useState({
        isSendOrderConfirmationEmail: true,
        isSendGuestOrderConfirmationSMS: true
    });

    useEffect(() => {
        if (settingsData?.data) {
            setSettings(settingsData.data);
        }
    }, [settingsData]);

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
                <div className="mb-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"><ArrowLeft className="h-5 w-5" /> Back</button>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Mail className="h-8 w-8 text-green-600" /> Email & SMS Settings</h1>
                    <p className="text-gray-600">Manage order notification settings</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Mail className="h-5 w-5 text-blue-600" /> Order Confirmation Email</h3>
                            <p className="text-sm text-gray-500 ml-7">Send email to registered users on order creation</p>
                        </div>
                        <button 
                            onClick={() => setSettings({...settings, isSendOrderConfirmationEmail: !settings.isSendOrderConfirmationEmail})}
                            className={`w-11 h-6 rounded-full transition-colors ${settings.isSendOrderConfirmationEmail ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${settings.isSendOrderConfirmationEmail ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-600" /> Guest Order Confirmation SMS</h3>
                            <p className="text-sm text-gray-500 ml-7">Send SMS to guest users on order creation</p>
                        </div>
                        <button 
                            onClick={() => setSettings({...settings, isSendGuestOrderConfirmationSMS: !settings.isSendGuestOrderConfirmationSMS})}
                            className={`w-11 h-6 rounded-full transition-colors ${settings.isSendGuestOrderConfirmationSMS ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform transform ${settings.isSendGuestOrderConfirmationSMS ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} disabled={isSaving} className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                        <Save className="h-5 w-5" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
