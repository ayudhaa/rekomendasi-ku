import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from './firebase';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    const adminConfigRef = ref(db, 'admin/config');
    const unsubscribeAdminConfig = onValue(adminConfigRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.password) {
        setAdminPassword(data.password);
      } else {
        setAdminPassword('admin123');
      }
    });

    if (adminParam === 'true') {
      setShowAdminLogin(true);
    }

    return () => unsubscribeAdminConfig();
  }, []);

  const verifyAdminPassword = (inputPassword) => {
    return inputPassword === adminPassword;
  };

  const handleAdminLogin = (password) => {
    if (verifyAdminPassword(password)) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      
      const newUrl = `${window.location.pathname}?admin=true`;
      window.history.pushState({}, '', newUrl);      
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  useEffect(() => {
    setLoading(true);
    const categoriesRef = ref(db, 'categories');
    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setCategories(categoriesArray);        
        if (categoriesArray.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesArray[0].id);
        }
      } else {
        setCategories([]);
      }
    });

    const productsRef = ref(db, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productsData = {};      
      if (data) {
        Object.keys(data).forEach(key => {
          const product = data[key];
          if (!productsData[product.categoryId]) {
            productsData[product.categoryId] = [];
          }
          productsData[product.categoryId].push({
            id: key,
            ...product
          });
        });
      }
      
      setProducts(productsData);
      setLoading(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, [selectedCategory]);

  const addCategory = async (categoryData) => {
    try {
      const categoriesRef = ref(db, 'categories');
      const newCategoryRef = push(categoriesRef);
      await set(newCategoryRef, {
        name: categoryData.name,
        icon: categoryData.icon,
        order: categories.length
      });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, {
        title: productData.title,
        link: productData.link,
        categoryId: productData.categoryId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      await remove(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateCategory = async (categoryData) => {
    try {
      const categoryRef = ref(db, `categories/${categoryData.id}`);
      await set(categoryRef, {
        name: categoryData.name,
        icon: categoryData.icon,
        order: categoryData.order || 0
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const updateProduct = async (productData) => {
    try {
      const productRef = ref(db, `products/${productData.id}`);
      await set(productRef, {
        title: productData.title,
        link: productData.link,
        categoryId: productData.categoryId,
        createdAt: productData.createdAt || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const updateAdminPassword = async (newPassword) => {
    try {
      const adminConfigRef = ref(db, 'admin/config');
      await set(adminConfigRef, {
        password: newPassword,
        updatedAt: new Date().toISOString()
      });
      setAdminPassword(newPassword);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const currentProducts = products[selectedCategory] || [];
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onCancel={() => {
            setShowAdminLogin(false);
            window.history.pushState({}, '', window.location.pathname);
          }}
        />
      )}

      {isAdmin ? (
        <AdminPanel
          categories={categories}
          products={products}
          onAddCategory={addCategory}
          onAddProduct={addProduct}
          onDeleteProduct={deleteProduct}
          onUpdateCategory={updateCategory}
          onUpdateProduct={updateProduct}
          onExitAdmin={handleAdminLogout}
          onUpdatePassword={updateAdminPassword}
          currentPassword={adminPassword}
        />
      ) : (
        <>
          <div className="px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-gray-500">Bisa kamu liat dulu, mau pilih produk yang mana..</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 max-w-2xl mx-auto">
                  <i className="text-gray-800">i</i>
                  <p className="italic">Produk di list ini rata-rata yang udah aku beli dan aku gunakan yaa</p>
                </div>
              </div>
              
              {categories.length > 0 ? (
                <>
                  <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          flex items-center px-6 py-4 rounded-xl transition-all duration-200 border-2
                          ${selectedCategory === category.id 
                            ? 'bg-white border-gray-800 shadow-lg text-gray-950' 
                            : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:shadow-lg hover:border-gray-300'
                          }
                        `}
                      >
                        <span className="text-xl mr-3">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {currentProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        title={product.title} 
                        link={product.link} 
                      />
                    ))}
                    {currentProducts.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        Belum ada produk untuk kategori ini.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada kategori. Silakan buka mode admin untuk menambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 mt-12">
        made with❤️
      </footer>
    </div>
  );
}