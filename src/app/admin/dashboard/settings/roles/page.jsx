'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, KeyRound, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    useGetRolesQuery, 
    useGetPermissionsQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation 
} from '@/redux/api/roleApi';

export default function RoleManagementPage() {
    const { data: rolesData, isLoading: loadingRoles } = useGetRolesQuery();
    const { data: permsData, isLoading: loadingPerms } = useGetPermissionsQuery();
    const [createRole] = useCreateRoleMutation();
    const [updateRole] = useUpdateRoleMutation();
    const [deleteRole] = useDeleteRoleMutation();

    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRole) await updateRole({ id: editingRole._id, ...formData }).unwrap();
            else await createRole(formData).unwrap();
            toast.success('Role saved successfully');
            setShowForm(false);
        } catch (error) {
            toast.error('Failed to save role');
        }
    };

    if (loadingRoles || loadingPerms) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><KeyRound className="h-6 w-6" /> Role Management</h1>
                    <p className="text-gray-600">Manage user roles and permissions</p>
                </div>
                <button onClick={() => { setEditingRole(null); setFormData({name:'', description:'', permissions:[]}); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create Role
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rolesData?.data?.map(role => (
                            <tr key={role._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                    {role.isSuperAdmin && <Shield className="h-4 w-4 text-yellow-500" />} {role.name}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{role.description}</td>
                                <td className="px-6 py-4 text-right">
                                    {!role.isSuperAdmin && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setEditingRole(role); setFormData(role); setShowForm(true); }} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Edit className="h-4 w-4" /></button>
                                            <button onClick={async () => { if(confirm('Delete?')) await deleteRole(role._id); }} className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingRole ? 'Edit' : 'Create'} Role</h2>
                            <button onClick={() => setShowForm(false)}><X className="h-6 w-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">Save Role</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
