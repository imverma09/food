const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const Order = require('./model/order')
const { Category, Product, Order } = require("./model/product");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


// Middleware
app.use(cors(
      {
        origin : 'https://food-two-lilac.vercel.app/'
      }
));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb+srv://imverma45:tz8d0uX7H9SLVId8@food.ammcdmj.mongodb.net/?retryWrites=true&w=majority&appName=food",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new category
app.post("/api/categories", async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }

    const newCategory = new Category({ name, slug });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(400).json({ message: error.message });
  }
});

// Product Routes
// Get all products (with optional category filter)
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== "all") {
      // Find the category object by slug first
      const categoryObj = await Category.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    const products = await Product.find(query).populate(
      "category",
      "name slug"
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    // Ensure the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const newProduct = new Product({
      name,
      price,
      category: categoryId,
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await Product.findById(savedProduct._id).populate(
      "category",
      "name slug"
    );
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete Product API
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Order Routes
// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete a specific order
app.delete("/api/order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Order.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "order not found" });
    }
    res.status(200).json({ message: " Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/category/:id", async (req, res) => {
  const { id } = req.params;
  try {
      await Product.deleteMany({ category: id });
      const product = await Category.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: " Category and related products deleted successfully" });
  } catch (error) {
    console.error("Error deleting Category:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/todayOrders", async (req, res) => {
  try {
    // Get today's date at the start of the day (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date (midnight)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find orders where orderDate is between today and tomorrow
    const orders = await Order.find({
      orderDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific order
// app.get("/api/orders/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
