-- Complete Database Schema for Embroidery Management

-- Drop and create database
DROP DATABASE IF EXISTS EmbroideryDB;
CREATE DATABASE EmbroideryDB;
USE EmbroideryDB;

-- ROLES table
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- USERS table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- CUSTOMERS table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DESIGNS table
CREATE TABLE designs (
    design_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    complexity ENUM('low', 'medium', 'high') NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- MACHINES table
CREATE TABLE machines (
    machine_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    last_maintenance DATE,
    next_maintenance DATE
);

-- INVENTORY_ITEMS table
CREATE TABLE inventory_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('cloth', 'thread', 'paper', 'other') NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    min_quantity DECIMAL(10,2) DEFAULT 0
);

-- ORDERS table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- ORDER_ITEMS table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    design_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    frames_required INT NOT NULL,
    frames_completed INT DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (design_id) REFERENCES designs(design_id)
);

-- PRODUCTION_LOGS table
CREATE TABLE production_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    employee_id INT NOT NULL,
    log_date DATE NOT NULL,
    frames_completed INT NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id)
);

-- PAYMENTS table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'card', 'bank_transfer', 'upi') NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Insert default roles
INSERT INTO roles (role_name) VALUES ('admin'), ('manager'), ('employee');

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role_id, full_name) 
VALUES ('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'Admin User');

-- Insert sample customer
INSERT INTO customers (name, email, phone) 
VALUES ('Sample Customer', 'customer@example.com', '1234567890');

-- Insert sample design
INSERT INTO designs (name, complexity, created_by) 
VALUES ('Floral Pattern', 'medium', 1);

-- Insert sample machine
INSERT INTO machines (name, type, status) 
VALUES ('Embroidery Machine 1', 'Multi-head', 'active');

-- Insert sample inventory item
INSERT INTO inventory_items (name, type, quantity, unit, min_quantity)
VALUES ('Cotton Cloth', 'cloth', 100, 'meters', 20);
