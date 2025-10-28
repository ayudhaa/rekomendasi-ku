import React, { useState } from 'react';
import PasswordManager from './PasswordManager';

export default function AdminPanel({ 
  categories, 
  products, 
  onAddCategory, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateCategory,
  onUpdateProduct,
  onExitAdmin,
  onUpdatePassword,
  currentPassword
}) {
  const [activeTab, setActiveTab] = useState('categories');
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    link: '', 
    categoryId: categories[0]?.id || '' 
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.name && newCategory.icon) {
      await onAddCategory(newCategory);
      setNewCategory({ name: '', icon: '' });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.title && newProduct.link && newProduct.categoryId) {
      await onAddProduct(newProduct);
      setNewProduct({ 
        title: '', 
        link: '', 
        categoryId: categories[0]?.id || '' 
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      await onDeleteProduct(productId);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (editingCategory.name && editingCategory.icon) {
      await onUpdateCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (editingProduct.title && editingProduct.link && editingProduct.categoryId) {
      await onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={onExitAdmin}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm w-full sm:w-auto"
        >
          Keluar Admin
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Mode Administrator
            </h3>
            <div className="mt-1 text-xs sm:text-sm text-gray-700">
              <p>Kamu udah berhasil masuk ke panel administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-none text-center ${
            activeTab === 'categories' 
              ? 'border-b-2 border-gray-500 text-gray-600' 
              : 'text-gray-500'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-none text-center ${
            activeTab === 'products' 
              ? 'border-b-2 border-gray-500 text-gray-600' 
              : 'text-gray-500'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-none text-center ${
            activeTab === 'security' 
              ? 'border-b-2 border-gray-500 text-gray-600' 
              : 'text-gray-500'
          }`}
        >
          Security
        </button>
      </div>

      {activeTab === 'categories' && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Manage Categories</h2>
          <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Category Name"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) => editingCategory 
                  ? setEditingCategory({...editingCategory, name: e.target.value})
                  : setNewCategory({...newCategory, name: e.target.value})
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Emoji Icon"
                value={editingCategory ? editingCategory.icon : newCategory.icon}
                onChange={(e) => editingCategory
                  ? setEditingCategory({...editingCategory, icon: e.target.value})
                  : setNewCategory({...newCategory, icon: e.target.value})
                }
                className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md">
            <h3 className="font-medium p-4 border-b text-sm sm:text-base">
              Existing Categories ({categories.length})
            </h3>
            <div className="p-3 sm:p-4">
              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between py-3 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="text-lg sm:text-xl mr-3 flex-shrink-0">{category.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium block text-sm sm:text-base truncate">{category.name}</span>
                          <span className="text-xs sm:text-sm text-gray-500 truncate">ID: {category.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {products[category.id]?.length || 0}
                        </span>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm sm:text-base">Belum ada kategori</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Manage Products</h2>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Product Title"
                value={editingProduct ? editingProduct.title : newProduct.title}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, title: e.target.value})
                  : setNewProduct({...newProduct, title: e.target.value})
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <input
                type="text"
                placeholder="WhatsApp Link"
                value={editingProduct ? editingProduct.link : newProduct.link}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, link: e.target.value})
                  : setNewProduct({...newProduct, link: e.target.value})
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <select
                value={editingProduct ? editingProduct.categoryId : newProduct.categoryId}
                onChange={(e) => editingProduct
                  ? setEditingProduct({...editingProduct, categoryId: e.target.value})
                  : setNewProduct({...newProduct, categoryId: e.target.value})
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md">
            <h3 className="font-medium p-4 border-b text-sm sm:text-base">Existing Products</h3>
            <div className="p-3 sm:p-4">
              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                        <span className="text-xs sm:text-sm text-gray-500 ml-2">
                          ({products[category.id]?.length || 0})
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {products[category.id]?.map((product) => (
                          <div key={product.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium block text-sm sm:text-base truncate">{product.title}</span>
                              <span className="text-xs sm:text-sm text-gray-500 truncate block">
                                {product.link}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!products[category.id] || products[category.id].length === 0) && (
                          <p className="text-gray-500 text-xs sm:text-sm py-2 text-center">
                            Tidak ada produk untuk kategori ini
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
                  Tambahkan kategori terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <PasswordManager 
          onUpdatePassword={onUpdatePassword}
          currentPassword={currentPassword}
        />
      )}
    </div>
  );
}