# 🧵 Embroidery Industry Management System
## 📌 Overview
The Embroidery Industry Management System is a database-driven web application developed as a part of the B.Tech curriculum at SRM Institute of Science and Technology. This system is specifically designed to streamline and automate the business operations of a garments embroidery unit like SVD Garments.

Traditional embroidery businesses face multiple challenges—manual order tracking, inventory mismatches, lack of machine maintenance records, and inefficient communication. This project solves these problems by creating a centralized digital solution for order management, design tracking, inventory control, employee management, and customer transparency.

## 🎯 Project Objectives
Eliminate manual record-keeping.

Enable real-time tracking of orders, inventory, and machine usage.

Improve internal coordination and customer communication.

Provide role-based access for business owners, employees, and customers.

Deliver an efficient and scalable DBMS-backed web platform.

## 💡 Key Features
### 🧾 Order Management
Track orders with associated customer, employee, and design details.

Monitor status (In Progress, Completed) and update in real-time.

Link orders to payment records and design specifics.

### 🎨 Design Handling
Store design complexity, frames required, and color details.

View image references for better employee understanding.

Normalize and manage multi-color designs efficiently.

### 👨‍🏭 Employee Dashboard
Role-based access control to view and update assigned tasks.

Track production contribution and generate performance reports.

### 🛠️ Machine Maintenance Log
Maintain history of usage hours and service dates.

Prevent unplanned downtime through scheduled maintenance alerts.

### 📦 Inventory & Supplier Management
Live inventory tracking for threads, cloth, and other materials.

Link inventory to supplier information for better procurement.

### 💰 Payments & Financial Records
Record and manage partial or full payments linked to orders.

Generate receipts and track outstanding dues.

### 📊 Reporting and Insights
Generate reports on production output, payments, and machine usage.

Use charting libraries for dashboard visualizations.

## 👥 Target Users
This system is designed to serve the following user types:

Business Owners – Full administrative control with access to all modules.

Employees – Access limited to assigned tasks and production modules.

Customers – Track orders via Order ID without logging in.

Other Garment Businesses – Easily customizable for other embroidery units.

## 🧱 Technologies Used
### 🗃️ Database
MySQL: Manages structured records of orders, employees, inventory, etc.

Includes stored procedures, triggers, functions, and normalization up to BCNF.

### 🧠 Backend
Node.js: JavaScript runtime for server-side logic.

Express.js: Simplifies RESTful API creation and routing.

### 🌐 Frontend
HTML/CSS/JavaScript: Core web technologies for UI/UX.

Bootstrap: Responsive layout and component styling.

Chart.js: Interactive dashboard charts.

### 🔐 Authentication
JWT (JSON Web Tokens): Secure login and role validation.

## 🗃️ Database Design
The database includes the following normalized tables:

Customer

Orders

Design

Employee

Machine

Maintenance

Inventory

Supplier

Payment

Production_Report

ER Diagram and Relational Schema were implemented to identify key entities and their relationships. Functional dependencies were minimized using 1NF, 2NF, 3NF, and BCNF.

## 🧩 Role-Based UI
### 👑 Owner Dashboard
Track orders, employees, payments, and inventory.

Access analytical dashboards and reports.

### 👨‍🔧 Employee Dashboard
View assigned tasks and update order progress.

Submit production reports.

### 👤 Customer View
Input Order ID and view live status without login.

## 🔄 Concurrency & Recovery
### 🔄 Concurrency Control
Follows ACID properties.

Implements transaction isolation and serializability using:

Two-Phase Locking

Savepoints

Multiversion Concurrency Control (MVCC)

### 💾 Recovery Mechanisms
Write-Ahead Logging (WAL) ensures durability.

Recovery via checkpointing and log replay on crash.

## 🔍 Sample Use Case
Imagine a customer places a new order with a floral design. The owner assigns it to an employee and selects the necessary threads from inventory. As the employee works, they log progress and machine hours. Once done, the order is marked complete, the customer receives an automated update, and payment is recorded—all without using paper!

## 📈 Future Enhancements
Integration with barcode scanning for order and inventory.

SMS/email updates for customer communication.

Mobile-friendly UI with React or Flutter.

Multi-language support for wider regional use.

Real-time analytics using MongoDB + Node.js.

## 📚 How to Run
Clone this repository.

bash
Copy
Edit
git clone https://github.com/<your-username>/embroidery-management-system.git
Setup MySQL and import schema.sql.

Install dependencies:

bash
Copy
Edit
cd backend
npm install
Start server:

bash
Copy
Edit
node app.js
Open the frontend HTML pages in browser or use a Node.js frontend framework.

## 🤝 Contributors
Narra Digvijay [RA2311003011175]

M.V.S. Harshith [RA2311003011196]

Project under the guidance of Dr. B. Baranidharan, Professor, Department of Computing Technologies, SRMIST.

## 📜 License
This project is part of an academic submission and is currently not licensed for commercial reuse. Feel free to fork and contribute for learning purposes!
