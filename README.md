# 🌾 FarmsToMarket – MVP

**FarmsToMarket** is a role-based online marketplace for farmers to list their products online and for buyers to discover and contact farmers directly.  
The platform promotes transparency, direct communication, and a secure marketplace experience.

---

## 🚀 Project Overview

- Farmers can **add and manage products**
- Buyers can **browse products and add to cart**
- Admin can monitor feedback and platform usage
- **JWT-based authentication** and **RBAC** implemented
- Fully **Dockerized** for easy deployment

---

## 🧑‍🌾 User Roles

- **Farmer** – Add/manage products  
- **Buyer** – Browse products, add to cart, contact farmers  
- **Admin** – View feedback and monitor platform

---

## 🛠 Tech Stack

### Backend
- Node.js, Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- Multer for file uploads
- Cloudinary for optional image storage
- CORS support

### Frontend
- React, Redux
- Tailwind CSS

### DevOps
- Docker, Docker Compose

---

## 🔐 Authentication & Authorization

- JWT-based authentication for secure access
- Encrypted passwords using bcrypt
- Role-Based Access Control (RBAC)
- Protected routes for all roles

---

## ✨ Features

### 🔹 Common Features (All Users)

- **User Registration (Farmer / Buyer)**  
  ![Registration](screenshots/registration.png)

- **Login (Email & Password)**  
  ![Login](screenshots/login.png)

- **Profile Management**
  - View & update profile
  - Logout
  - Role-based action buttons  
  ![Profile](screenshots/profile.png)

- **Market Price Viewer**  
  ![Market Price](screenshots/Home.png)

- **Search Market Prices**  
  ![Search](screenshots/search.png)

- **Contact Admin (Feedback Form)**  
  ![Contact Admin](screenshots/contact.png)

---

### 🌱 Farmer Features

- **Add New Product**  
  ![Add Product](screenshots/addnewproduct.png)

- **My Products Page**
- - **Delete Product (Confirmation Modal)**  
  - View all listed products
  - Search products  
  ![My Products](screenshots/Myproducts.png)

- **Delete Product (Confirmation Modal)**  

---

### 🛒 Buyer Features

- **Products Page (View Farmers' Products)**
 - **Add to Cart**  
  ![Products Page](screenshots/products.png)




- **Cart Page**  
  ![Cart Page](screenshots/cart.png)

---

## env Var
```bash 
 MONGO_CONNECTION_STRING
PORT
CORS_ORIGIN
JWT_SECRET
CLOUD_NAME=
CLOUD_API_KEY
CLOUD_API_SECRET
STORAGE_URL

## 📦 Docker Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/HarichndR/1-one farmstomarket
cd farmstomarket
docker-compose build
docker-compose up -d
