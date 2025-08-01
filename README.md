
# 🍱 Food Store Inventory System

This is a full-stack web application that allows users to browse food items and place orders, while admins can manage the inventory and track orders. It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

You can try the live version here: [Live Demo](https://food-store-kmh6.onrender.com/)

---

## 📌 What This App Can Do

### 👤 For Customers (Users)
- View available food items
- Like and add items to cart
- Place orders
- Make payments securely

### 🔐 For Admins
- Add, edit, or delete food items
- View and manage orders placed by users
- Monitor stock/inventory

---

## 🧰 Technologies Used

### Frontend
- React.js (for building the UI)
- Chakra UI (for beautiful components)

### Backend
- Node.js + Express.js (for server-side logic and APIs)
- MongoDB (for storing user, food, and order data)

### Other Tools
- JWT (for login and secure access)
- Razorpay (for handling payments)
- Multer (for uploading images)
- Nodemailer (for sending emails)
- WebSockets (for real-time communication)

---

## 📁 Project Structure

```

food-store-inventory/
├── client/                  # Frontend (React)
│   ├── components/          # Reusable UI parts
│   ├── pages/               # Main pages like Home, Admin Panel
│   └── ...
├── server/                  # Backend (Express.js)
│   ├── routes/              # API routes for users, orders, items
│   ├── controllers/         # Functions for each route
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # JWT auth and error handling
│   └── ...

````

---

## 🛠️ How to Run This Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/ShivanSaroj/food-store-inventory.git
cd food-store-inventory
````

### 2. Install dependencies

```bash
# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 3. Add environment variables

Go to the `server` folder and create a file named `.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> Replace the placeholders with your actual values.

---

### 4. Start the application

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```

Now visit `http://localhost:3000` to use the app!

---



## ✨ Features in Detail

| Feature               | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| Authentication        | Users and admins login securely using JWT                                  |
| Role-based Access     | Only admins can access certain parts like managing items or viewing orders |
| Inventory Management  | Admins can add/edit/delete food items with images                          |
| Order System          | Users can place orders and admins can view/manage them                     |
| Payment Integration   | Payments handled using Razorpay                                            |
| Real-time Interaction | WebSocket integration for order notifications (optional)                   |
| Email Services        | Sends confirmation and notification emails using Nodemailer                |

---

## 🔐 Security Features

* Passwords are hashed securely
* JWT is used to protect private routes
* Role-based access for user/admin separation
* Input validations and error handling

---

