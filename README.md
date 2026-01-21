# 📸 Gallery Platform – React + Vite

A full-featured, modern **Gallery & Image Marketplace Platform** built with **React, Vite, Tailwind CSS, Firebase, and Stripe**.  
This application supports **role-based access**, **image purchasing**, **subscription plans**, **secure authentication**, and a **personalized user dashboard** experience.

---

## 🚀 Project Overview

This gallery platform allows users to explore, upload, favorite, like, and purchase images, as well as subscribe to different plans (**Explorer, Artist, Creator**) with varying feature access.

The project is fully **responsive**, **secure**, and designed with a **real-world SaaS-style architecture**.

---

## 🧩 Core Features

### 🔐 Authentication & Security
- Email & Password authentication
- Google OAuth login/register
- Firebase Authentication
- Protected & verified routes
- Secure API calls with token-based authorization
- Toast notifications for all auth actions

---

### 👤 User Roles & Subscription Plans

| Plan        | Features |
|-------------|----------|
| **Explorer** | View image details, browse gallery |
| **Artist** | Upload images, manage own gallery, favorite images |
| **Creator** | Full access, premium images, advanced controls |

- Users can upgrade plans via **Stripe payment**
- Plan status updates instantly after payment

---

### 🖼️ Gallery System
- Public gallery with all approved images
- Image filtering by:
  - Category
  - Role
  - Status
- Search functionality
- Responsive grid (mobile, tablet, desktop)
- Infinite scroll for smooth browsing
- Category-based image count display

---

### ❤️ Interaction System
- Like system for images
- Favorite system (saved to user collection)
- Premium image indicator
- Watermarked image previews

---

### 🧾 Image Details Module
- Detailed image modal
- Image creator profile preview
- Clickable creator name → profile page
- Purchase option for paid images
- Role-based access restriction

---

### 💳 Payment System (Stripe)
- Subscription payments
- Image purchase payments
- Secure Stripe checkout
- Automatic transaction recording
- Email confirmation after payment
- Payment history tracking

---

### 📊 User Dashboard
Each logged-in user has a personalized dashboard showing:
- Total uploaded images
- Purchased images
- Favorite images
- Total earnings (for sellers)
- Payment & sales reports
- Recent activity overview

---

### 🖼️ My Gallery (User Panel)
From the **My Gallery** section, users can:
- View uploaded images
- Manage favorite images
- See purchased images
- Add new images
- Update or delete own images

---

### ⚙️ Profile & Account Settings
- View and edit profile information
- Update profile image
- View account details
- Delete account securely

---

### 📱 Fully Responsive Design
- Optimized for:
  - Mobile
  - Tablet
  - Desktop
- Mobile-first layout
- Card-based UI on small screens
- Table-based UI on larger screens

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS**
- **DaisyUI**
- **Framer Motion**
- **React Router**
- **Lucide Icons / React Icons**

### State & Data
- **Axios**
- **TanStack React Query**
- **Context API**

### Authentication & Payments
- **Firebase Authentication**
- **Stripe (Subscriptions & Payments)**

### UI & UX Enhancements
- **SweetAlert2**
- **React Hot Toast**
- **React Toastify**
- **React Modal**

---

## 📦 Dependencies

```json
"react": "^19.2.0",
"react-router": "^7.12.0",
"firebase": "^12.8.0",
"axios": "^1.13.2",
"@stripe/react-stripe-js": "^5.4.1",
"@stripe/stripe-js": "^8.6.1",
"tailwindcss": "^4.1.18",
"daisyui": "^5.5.14",
"framer-motion": "^12.26.2",
"@tanstack/react-query": "^5.90.18",
"sweetalert2": "^11.26.17"
