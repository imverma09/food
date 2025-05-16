import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
function Admin() {
  const [view, setView] = useState('categories'); // 'categories', 'products', or 'orders'
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate =  useNavigate()
  
  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
  
  // Fetch data
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', newCategory);
      setNewCategory({ name: '', slug: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert(error.response?.data?.message || 'Error adding category');
    }
  };
  
  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setNewProduct({ name: '', price: '', categoryId: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'Error adding product');
    }
  };
  
  // Generate slug from category name
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  // Handle category name change and auto-generate slug
  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    setNewCategory({
      name,
      slug: generateSlug(name)
    });
  };

  // Delete product 
  const  deleteProduct = async (_id)=>{
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${_id}`);
       alert(response.data.message)
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setProducts(products.filter( val => val._id !==_id ))

  }
  const  deleteCategory = async (_id)=>{
    try {
      const response = await axios.delete(`http://localhost:5000/api/category/${_id}`);
       alert(response.data.message)
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setCategories(categories.filter( val => val._id !==_id ))
    fetchProducts();
  }

  const  deleteOrder = async (_id)=>{
    try {
      const response = await axios.delete(`http://localhost:5000/api/order/${_id}`);
       alert(response.data.message)
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setOrders(orders.filter( val => val._id !==_id ))

  }
const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Static credentials for simple authentication
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'admin';

  useEffect(() => {
    // Check if user is already logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    // Check credentials
    if (formData.username === VALID_USERNAME && formData.password === VALID_PASSWORD) {
      // Save to localStorage
      localStorage.setItem('username', formData.username);
      setIsLoggedIn(true);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setFormData({
      username: '',
      password: ''
    });
    navigate('/')
  };
  return (
    <>
    {
      isLoggedIn ==false ?  <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black text-white border p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block  text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block  text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-green-500 hover:bg-green-700 cursor-pointer  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div> : ""
    }
  {
  isLoggedIn && (<div className="bg-black text-white min-h-screen p-4">
      <div className="text-center flex justify-between items-center">
            {/* <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1> */}
            <p className="mb-6 text-4xl">Welcome, {localStorage.getItem('username')}!</p>
           
            <button 
              onClick={handleLogout}
              className=" bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          </div>
      
      {/* Navigation */}
      <div className="flex mb-6 border-b border-gray-700 pb-2">
        <button 
          className={`mr-4 px-4 py-2 ${view === 'categories' ? 'bg-gray-800' : ''}`}
          onClick={() => setView('categories')}
        >
          Categories
        </button>
        <button 
          className={`mr-4 px-4 py-2 ${view === 'products' ? 'bg-gray-800' : ''}`}
          onClick={() => setView('products')}
        >
          Products
        </button>
        <button 
          className={`px-4 py-2 ${view === 'orders' ? 'bg-gray-800' : ''}`}
          onClick={() => setView('orders')}
        >
          Orders
        </button>
      </div>
      
      {/* Categories View */}
      {view === 'categories' && (
        <div>
          <h2 className="text-xl mb-4">Manage Categories</h2>
          
          <form onSubmit={handleAddCategory} className="mb-6 bg-gray-900 p-4 rounded">
            <h3 className="text-lg mb-2">Add New Category</h3>
            <div className="flex flex-col mb-2">
              <label className="mb-1">Name:</label>
              <input 
                type="text" 
                value={newCategory.name} 
                onChange={handleCategoryNameChange}
                className="p-2 bg-black border border-gray-600 rounded"
                required
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-1">Slug:</label>
              <input 
                type="text" 
                value={newCategory.slug} 
                onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                className="p-2 bg-black border border-gray-600 rounded"
                required
              />
              <small className="text-gray-400">Slug is used for URL (e.g. "pizzas")</small>
            </div>
            <button type="submit" className="bg-blue-700 px-4 py-2 rounded">Add Category</button>
          </form>
          
          <h3 className="text-lg mb-2">Existing Categories</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="border border-gray-700 p-2 text-left">Name</th>
                  <th className="border border-gray-700 p-2 text-left">Slug</th>
                  <th className="border border-gray-700 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id} className="border-b border-gray-700">
                    <td className="border border-gray-700 p-2">{cat.name}</td>
                    <td className="border border-gray-700 p-2">{cat.slug}</td>
                   <td className="border border-gray-700 p-2 text-center"> <button className='bg-red-600 px-3 py-2 rounded' onClick={()=>{ deleteCategory(cat._id)}} ><Trash2 /></button> </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="2" className="p-4 text-center">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Products View */}
      {view === 'products' && (
        <div>
          <h2 className="text-xl mb-4">Manage Products</h2>
          
          <form onSubmit={handleAddProduct} className="mb-6 bg-gray-900 p-4 rounded">
            <h3 className="text-lg mb-2">Add New Product</h3>
            <div className="flex flex-col mb-2">
              <label className="mb-1">Name:</label>
              <input 
                type="text" 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="p-2 bg-black border border-gray-600 rounded"
                required
              />
            </div>
            <div className="flex flex-col mb-2">
              <label className="mb-1">Price:</label>
              <input 
                type="number" 
                value={newProduct.price} 
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="p-2 bg-black border border-gray-600 rounded"
                required
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-1">Category:</label>
              <select 
                value={newProduct.categoryId} 
                onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                className="p-2 bg-black border border-gray-600 rounded"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-blue-700 px-4 py-2 rounded">Add Product</button>
          </form>
          
          <h3 className="text-lg mb-2">Existing Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="border border-gray-700 p-2 text-left">Name</th>
                  <th className="border border-gray-700 p-2 text-left">Price</th>
                  <th className="border border-gray-700 p-2 text-left">Category</th>
                  <th className="border border-gray-700 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-gray-700">
                    <td className="border border-gray-700 p-2">{product.name}</td>
                    <td className="border border-gray-700 p-2">₹ {product.price}</td>
                    <td className="border border-gray-700 p-2">{product.category.name}</td>
                    <td className="border border-gray-700 p-2 text-center"> <button className='bg-red-600 px-3 py-2 rounded' onClick={()=>{ deleteProduct(product._id)}} ><Trash2 /></button> </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-center">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Orders View */}
      {view === 'orders' && (
        <div>
          <h2 className="text-xl mb-4">View Orders</h2>
          
          {orders.map(order => (
            <div key={order._id} className="mb-4 bg-gray-900 p-4 rounded ">
              <div className='text-right'><button className='text-red-400 text-3xl cursor-pointer' onClick={()=>{deleteOrder(order._id
              )}}><Trash2></Trash2></button></div>
              <div className="flex justify-between mb-2">
                <h3 className="text-lg">Order ID : #{order._id.substr(-6)}</h3>
               <span className="text-gray-400">
                  {new Date(order.orderDate).toLocaleString()}
                </span>
              </div>
              <p className="mb-2 text-yellow-500">Customer : {order.customerName}</p>
              <table className="w-full mb-2">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">₹{item.price}</td>
                      <td className="p-2 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="p-2" colSpan="3">Total Amount:</td>
                    <td className="p-2 text-right">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
          
          {orders.length === 0 && (
            <p className="text-center p-4 bg-gray-900 rounded">No orders found.</p>
          )}
        </div>
      )}
    </div>
  )}
    </>

  );
}

export default Admin;
