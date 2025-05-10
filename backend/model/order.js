const mongoose = require('mongoose');
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
  module.exports = mongoose.model('Order', orderSchema);
