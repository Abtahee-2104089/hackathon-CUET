#  🏫 Smart Campus Ordering System – MERN Stack
A pickup-only web app designed for CUET students to view vendor menus, place food orders, and pay online via SSLCommerz. Built using the MERN stack, this project simplifies food ordering within the CUET campus — where major food delivery services aren't available.

🚀 Features
👨‍🎓 Student Portal
✅ Register/Login with CUET email validation

🛍️ Browse Vendors & View Menus

🛒 Add to Cart & Place Orders

💳 SSLCommerz (Sandbox) Payment Integration

📦 Track Order Status in Real-Time

🕓 View Order History

🧑‍🍳 Vendor Dashboard
🔐 Secure Vendor Login

🍔 Manage Menu Items (Add/Edit/Delete)

📑 View Incoming Orders

🔄 Update Order Status (Pending → Preparing → Ready → Shipped)

🟢 Toggle Shop Availability (Open/Closed)

📆 Set Fixed Operating Hours

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Axios, React Router
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Auth	JWT-based authentication
Payment	SSLCommerz Sandbox
Styling	Bootstrap / Tailwind CSS

📋 Milestones
Authentication

CUET email format enforced for student registration

JWT-based secure login for students and vendors

Vendor Panel

Dynamic menu item CRUD functionality

Menu Browsing & Cart

Add-to-cart logic with quantity and price calculation

Order Placement

Order stored in MongoDB, linked to user and vendor documents

SSLCommerz Integration

Sandbox payment with callback/validation

Order Status Management

Real-time status updates viewable by students

Responsive UI

Mobile-friendly design with clean UX

✨ Bonus Features (If Implemented)

Promo codes / Discounts

Notifications (e.g., using Toast or Push)

Google Sign-In

🧪 Getting Started Locally
📁 Backend Setup
bash
Copy
Edit
# 1. Clone the repository
git clone https://github.com/your-username/smart-campus-ordering.git
cd smart-campus-ordering/backend

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Add MongoDB URI, JWT secret, SSLCommerz keys

# 4. Start backend server
npm run dev
🖥️ Frontend Setup
bash
Copy
Edit
cd ../frontend

# Install dependencies
npm install

# Start the React app
npm start

#   Demographic Drawing
![Untitled-2025-05-24-1827](https://github.com/user-attachments/assets/f4e6e359-3164-4615-9b14-a877665a0c24)
