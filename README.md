# 🍴 Gupshup Grill — Food Restaurant Billing System

A web app for managing a restaurant’s ordering & billing system.  
Customers can browse categories & products, add to cart, and submit orders.  
Admins can manage categories, products, and view orders.  

---

## 📁 Project Structure

```
food/
├── backend/  
│   ├── controllers/  
│   ├── models/  
│   ├── routes/  
│   ├── server.js  
│   └── (other backend-related files)  
├── public/  
│   └── (static assets)  
├── src/  
│   ├── components/  
│   ├── pages/  
│   ├── App.jsx  
│   └── main.jsx  
├── .eslintrc.cjs  
├── .gitignore  
├── index.html  
├── package.json  
├── package-lock.json  
├── README.md  
├── vercel.json  
└── vite.config.js  
```

- **backend/** — server-side logic (routes, controllers, models, DB connection).  
- **src/** — frontend React / Vite code (components, pages).  
- **public/** — static assets.  
- Root-level config files: linting, Vite config, package.json, etc.

---

## 🚀 Features

### Admin Panel  
- Add / delete **categories**  
- Add / delete **products**  
- View **all orders**  
- Dashboard highlights **today’s orders**  

### Frontend (User / Customer)  
- Display **categories** & **products**  
- **Filter** products by category  
- **Add to cart**  
- **Submit orders**  

---

## 🧰 Tech Stack

- **Frontend:** React, Vite  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (via Mongoose models)  
- **Deployment:** Vercel  

---

## 🛠 Setup & Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/imverma09/food.git
   cd food
   ```

2. Backend setup  
   ```bash
   cd backend
   npm install
   # create a .env with:
   # PORT=5000
   # DB_URI=<your-db-connection-string>
   npm start
   ```

3. Frontend setup  
   ```bash
   cd ..
   npm install
   npm run dev
   ```

4. Access the app  
   - Frontend (React): `http://localhost:3000`  
   - Backend API: `http://localhost:5000/api/...`  

---

## 📌 Usage

1. **Admin**  
   - Use panel to manage **categories** & **products**  
   - View all submitted **orders**

2. **Customer**  
   - Browse homepage to see categories & products  
   - Filter products by category  
   - Add items to **cart**  
   - Submit order  
   - Main page shows **today’s orders** to admin  

---

## 🚀 Future Enhancements

- Add **authentication** for admin & users  
- Integrate **payment gateway**  
- Generate **PDF bills**  
- Add **order status tracking**  
- Analytics dashboard  

---

## 👤 Author

Developed by **Harshdeep Verma (imverma09)**  

---

## 📄 License

MIT License

