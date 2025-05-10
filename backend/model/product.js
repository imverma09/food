const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  items: [{
    _id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
});

// Create models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Category,
  Product,
  Order
};
