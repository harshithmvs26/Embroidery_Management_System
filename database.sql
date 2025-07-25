-- Create database
CREATE DATABASE IF NOT EXISTS EmbroideryDB;
USE EmbroideryDB;

-- Create ROLES table
CREATE TABLE IF NOT EXISTS ROLES (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Create USERS table (combining customer and employee)
CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES ROLES(role_id)
);

-- Create CUSTOMERS table
CREATE TABLE IF NOT EXISTS CUSTOMERS (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(100),
    gst_number VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- Create EMPLOYEES table
CREATE TABLE IF NOT EXISTS EMPLOYEES (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    salary DECIMAL(10,2),
    hire_date DATE,
    position VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- Create DESIGNS table
CREATE TABLE IF NOT EXISTS DESIGNS (
    design_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(50),
    image_path VARCHAR(255),
    complexity VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES USERS(user_id)
);

-- Create MACHINES table
CREATE TABLE IF NOT EXISTS MACHINES (
    machine_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    model_number VARCHAR(100),
    vendor VARCHAR(100),
    purchase_date DATE,
    machine_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create DESIGN table
CREATE TABLE IF NOT EXISTS DESIGN (
    design_id INT AUTO_INCREMENT PRIMARY KEY,
    design_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ORDERS table (changed from ORDER to ORDERS)
CREATE TABLE IF NOT EXISTS ORDERS (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    design_id INT NOT NULL,
    quantity INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATE,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id),
    FOREIGN KEY (design_id) REFERENCES DESIGN(design_id)
);

-- Create EMPLOYEE_ORDER table
CREATE TABLE IF NOT EXISTS EMPLOYEE_ORDER (
    employee_id INT NOT NULL,
    order_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, order_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
);

-- Create PAYMENT table
CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
);

-- Create PRODUCTION_REPORT table
CREATE TABLE IF NOT EXISTS PRODUCTION_REPORT (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    employee_id INT NOT NULL,
    machine_id INT NOT NULL,
    quantity_produced INT NOT NULL,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    FOREIGN KEY (machine_id) REFERENCES MACHINE(machine_id)
);

-- Create MAINTENANCE_REPORT table
CREATE TABLE IF NOT EXISTS MAINTENANCE_REPORT (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id INT NOT NULL,
    employee_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'completed',
    FOREIGN KEY (machine_id) REFERENCES MACHINE(machine_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
);

-- Create INVENTORY table
CREATE TABLE IF NOT EXISTS INVENTORY (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert demo data
INSERT INTO CUSTOMER (name, email, password, phone, address) VALUES
('Demo Customer', 'customer@example.com', 'password123', '1234567890', '123 Demo St');

INSERT INTO EMPLOYEE (name, email, password, role, salary, phone, address) VALUES
('Demo Employee', 'employee@example.com', 'password123', 'worker', 50000.00, '1234567890', '456 Demo St'),
('John Smith', 'john@example.com', 'password123', 'worker', 45000.00, '2345678901', '789 Worker St'),
('Sarah Johnson', 'sarah@example.com', 'password123', 'supervisor', 60000.00, '3456789012', '321 Manager Ave'),
('Mike Brown', 'mike@example.com', 'password123', 'worker', 48000.00, '4567890123', '654 Employee Rd');

INSERT INTO MACHINE (machine_name, machine_type, status) VALUES
('Sewing Machine 1', 'sewing', 'active'),
('Cutting Machine 1', 'cutting', 'active');

INSERT INTO DESIGN (design_name, description, price) VALUES
('Basic T-Shirt', 'Simple cotton t-shirt', 29.99),
('Jeans', 'Classic blue jeans', 49.99);

-- Insert a sample order and assign it to the employee
INSERT INTO ORDERS (customer_id, design_id, quantity, amount, status) VALUES
(1, 1, 10, 299.90, 'pending');

INSERT INTO EMPLOYEE_ORDER (employee_id, order_id) VALUES
(1, 1);

-- Insert sample attendance records
INSERT INTO ATTENDANCE (employee_id, date, check_in, check_out, status) VALUES
(1, CURDATE(), '09:00:00', '17:00:00', 'present'),
(2, CURDATE(), '09:15:00', '17:00:00', 'late'),
(3, CURDATE(), '09:00:00', '17:00:00', 'present'),
(4, CURDATE(), NULL, NULL, 'absent');

-- Insert sample leave requests
INSERT INTO LEAVE_REQUEST (employee_id, start_date, end_date, reason, status) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Family vacation', 'pending'),
(2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Medical checkup', 'approved'); 