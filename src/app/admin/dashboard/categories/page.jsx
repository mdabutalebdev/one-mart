'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import DeleteConfirmationModal from '@/components/Common/DeleteConfirmationModal'
import { 
    useGetAdminCategoriesQuery, 
    useDeleteCategoryMutation 
} from '@/redux/api/categoriesApi'

export default function AdminCategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' })

    // RTK Query hooks
    const { data: categoriesData, isLoading } = useGetAdminCategoriesQuery()
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

    const categories = categoriesData?.data || []

    const handleDeleteCategory = async () => {
        try {
            const result = await deleteCategory(deleteModal.categoryId).unwrap()
            if (result.success) {
                toast.success('Category deleted successfully!')
                setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })
            }
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error('Error deleting category')
        }
    }

    const filteredCategories = categories.filter(category => {
        return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your product categories</p>
                    </div>
                    <Link
                        href="/admin/dashboard/categories/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Category
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No categories found.</td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {category.image ? (
                                                        <img className="h-10 w-10 rounded-lg object-cover" src={category.image} alt={category.name} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <FolderOpen className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4 font-medium text-gray-900">{category.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.isFeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {category.isFeatured ? 'Featured' : 'Regular'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/admin/dashboard/categories/${category._id}`} className="text-blue-600 p-1"><Eye className="h-4 w-4" /></Link>
                                                <Link href={`/admin/dashboard/categories/${category._id}/edit`} className="text-indigo-600 p-1"><Edit className="h-4 w-4" /></Link>
                                                <button onClick={() => setDeleteModal({ isOpen: true, categoryId: category._id, categoryName: category.name })} className="text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                message="Are you sure you want to delete this category?"
                itemName={deleteModal.categoryName}
                itemType="category"
                isLoading={isDeleting}
            />
        </div>
    )
}
