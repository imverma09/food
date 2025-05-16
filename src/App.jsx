import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [total, setTotal] = useState(0);
  const [message ,setMessage] = useState("")
  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products${category !== 'all' ? `?category=${category}` : ''}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, [category]);

  // Calculate total amount whenever cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item._id === id 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  // Submit order
  const submitOrder = async () => {
    if (!customerName.trim()) {
      setMessage('Please enter customer name');
      return;
    }
    
    if (cart.length === 0) {
      setMessage('Please add at least one item to the order');
      return;
    }
    
    try {
      const orderData = {
        customerName,
        items: cart,
        totalAmount: total,
        orderDate: new Date()
      };
      
      await axios.post('http://localhost:5000/api/orders', orderData);
      alert('Order submitted successfully!');
      setCart([]);
      setCustomerName('');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  // Format date for display
  const formatDate = () => {
    const date = new Date();
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700 flex justify-between p-4">
        <div className="w-1/2 text-3xl ">
         GUPSHUP GRILL
        </div>
          <div><Link to={'todayOrder'} className='border border-gray-500 rounded px-4 py-1'>Today Order</Link></div>
        <div className="w-1/4 text-right">
          <Link to={'/admin'} className="border border-gray-500 rounded px-4 py-1">Admin</Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar - Menu categories */}
        <div className="w-48 border-r border-gray-700">
          <div className="p-4 text-center font-bold border-b border-gray-700"> Our Menu</div>
          <div 
            className={`p-4 text-center border-b border-gray-700 cursor-pointer ${category === 'all' ? 'bg-gray-800' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </div>
          {categories.map(cat => (
            <div 
              key={cat._id}
              className={`p-4 text-center border-b border-gray-700 cursor-pointer ${category === cat.slug ? 'bg-gray-800' : ''}`}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name.toLowerCase()}
            </div>
          ))}
        </div>
        
        {/* Middle section - Products */}
        <div className="flex-1 border-r border-gray-700 p-4">
          <h2 className="text-2xl text-center mb-6">Our Product</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div 
                key={product._id} 
                className="border border-gray-600 rounded-lg p-4 cursor-pointer"
                onClick={() => addToCart(product)}
              >
                {/* <div className="flex justify-between mb-2">
                  <span>name</span>
                  <span>rate</span>
                </div> */}
                <div className="font-bold">{product.name}</div>
                <div className="text-gray-400 text-sm">{product.category.name}</div>
                <div className="font-bold text-right">₹ {product.price}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right panel - Order details */}
        <div className="w-96 p-4">
          <div className="mb-4">
            <div className="text-right mb-2">date:{formatDate()}</div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-black text-white"
              />
              {message && <span className='text-red-600 text-start'>{message}</span>}
            </div>
            <div className="mb-2">list of items : {cart.length}</div>
          </div>
          
          {/* Order items table */}
          <div className="border border-gray-600 mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="p-2 text-left border-r border-gray-600">sr</th>
                  <th className="p-2 text-left border-r border-gray-600">name</th>
                  <th className="p-2 text-center border-r border-gray-600">quantity</th>
                  <th className="p-2 text-right">price</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-600">
                    <td className="p-2 border-r border-gray-600">{index + 1}</td>
                    <td className="p-2 border-r border-gray-600">{item.name}</td>
                    <td className="p-2 border-r border-gray-600 text-center">
                      <div className="flex items-center justify-center">
                        <button 
                          className="px-2 bg-gray-800 rounded-l"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                          className="px-2 bg-gray-800 rounded-r"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-right relative">
                    ₹ {item.price * item.quantity}
                      <button 
                        className="absolute right-0 top-0 bg-red-600 text-xs px-1 rounded"
                        onClick={() => removeFromCart(item._id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Total and submit */}
          <div className="flex justify-between p-2 border border-gray-600 mb-4">
            <div className="font-bold">total amount</div>
            <div className="font-bold">₹ {total}</div>
          </div>
          
          <button 
            className="w-full bg-green-700 p-2 rounded font-bold"
            onClick={submitOrder}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;