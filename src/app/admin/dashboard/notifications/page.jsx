'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Info, CheckCircle, AlertTriangle, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal';
import { 
    useGetAdminNotificationsQuery, 
    useDeleteNotificationMutation,
    useCreateNotificationMutation,
    useUpdateNotificationMutation 
} from '@/redux/api/notificationsApi';

const TYPE_CONFIG = {
    info: { label: 'Info', color: 'bg-blue-100 text-blue-800', icon: Info, iconColor: 'text-blue-500' },
    success: { label: 'Success', color: 'bg-green-100 text-green-800', icon: CheckCircle, iconColor: 'text-green-500' },
    warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, iconColor: 'text-yellow-500' },
    promotion: { label: 'Promotion', color: 'bg-purple-100 text-purple-800', icon: Tag, iconColor: 'text-purple-500' },
    alert: { label: 'Alert', color: 'bg-red-100 text-red-800', icon: AlertCircle, iconColor: 'text-red-500' },
};

export default function AdminNotificationsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotif, setEditingNotif] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notifToDelete, setNotifToDelete] = useState(null);

    const [formData, setFormData] = useState({
        title: '', message: '', type: 'info', link: '', expiresAt: '', isActive: true
    });

    // RTK Query hooks
    const { data: notificationsData, isLoading } = useGetAdminNotificationsQuery({ page: currentPage, search: searchTerm });
    const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
    const [createNotification, { isLoading: isCreating }] = useCreateNotificationMutation();
    const [updateNotification, { isLoading: isUpdating }] = useUpdateNotificationMutation();

    const notifications = notificationsData?.data || [];

    const handleAddNew = () => {
        setEditingNotif(null);
        setFormData({ title: '', message: '', type: 'info', link: '', expiresAt: '', isActive: true });
        setIsModalOpen(true);
    };

    const handleEdit = (notif) => {
        setEditingNotif(notif);
        setFormData({
            title: notif.title,
            message: notif.message,
            type: notif.type,
            link: notif.link || '',
            expiresAt: notif.expiresAt ? new Date(notif.expiresAt).toISOString().split('T')[0] : '',
            isActive: notif.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result;
            if (editingNotif) {
                result = await updateNotification({ id: editingNotif._id, data: formData }).unwrap();
            } else {
                result = await createNotification(formData).unwrap();
            }

            if (result.success) {
                toast.success(editingNotif ? 'Notification updated!' : 'Notification created!');
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error('Failed to save notification');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deleteNotification(notifToDelete._id).unwrap();
            if (result.success) {
                toast.success('Notification deleted!');
                setShowDeleteModal(false);
            }
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    if (isLoading && currentPage === 1) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500">Manage customer-facing notifications</p>
                </div>
                <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create Notification
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notification</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {notifications.map((notif) => {
                            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
                            const TypeIcon = cfg.icon;
                            return (
                                <tr key={notif._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-lg bg-gray-100 mr-3">
                                                <TypeIcon className={`h-5 w-5 ${cfg.iconColor}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{notif.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{notif.message}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${notif.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {notif.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(notif)} className="text-indigo-600"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => { setNotifToDelete(notif); setShowDeleteModal(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingNotif ? 'Edit' : 'Create'} Notification</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Message *</label>
                                <textarea required rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-2 border rounded resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded">
                                        <option value="info">Info</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="promotion">Promotion</option>
                                        <option value="alert">Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expires At</label>
                                    <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
                                <label htmlFor="isActive" className="text-sm">Active (visible to users)</label>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded">
                                    {(isCreating || isUpdating) ? 'Saving...' : 'Save Notification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Notification"
                message="Are you sure you want to delete this notification?"
                isLoading={isDeleting}
            />
        </div>
    );
}
