-- FULL SQL SCRIPT START

-- Create New Database
CREATE DATABASE GarmentsDB;
USE GarmentsDB;

-- CUSTOMER Table
CREATE TABLE CUSTOMER (
    customer_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_no VARCHAR(15),
    address TEXT,
    total_price DECIMAL(10,2) DEFAULT 0.00,
    password VARCHAR(255)
);

INSERT INTO CUSTOMER VALUES 
(1, 'Ramesh', 'ramesh@gmail.com', '9876543210', 'Hyderabad', 0.00, 'password123'),
(2, 'Suresh', 'suresh@gmail.com', '9876543211', 'Mumbai', 0.00, 'password123');

-- ORDERS Table
CREATE TABLE ORDERS (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    status VARCHAR(50),
    amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id) ON DELETE CASCADE
);

INSERT INTO ORDERS VALUES 
(101, 1, '2025-04-13', 'Active', 1500.00),
(102, 2, '2025-04-12', 'Completed', 2000.00);

-- PAYMENT Table
CREATE TABLE PAYMENT (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    user_id INT,
    payment_method VARCHAR(50),
    payment_date DATE,
    amount DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);

INSERT INTO PAYMENT(order_id, user_id, payment_method, payment_date, amount) VALUES
(101, 1, 'UPI', '2025-04-13', 1500.00),
(102, 2, 'Cash', '2025-04-12', 2000.00);

-- ACCOUNTS Table
CREATE TABLE ACCOUNTS (
    user_id INT PRIMARY KEY,
    remarks TEXT
);

INSERT INTO ACCOUNTS VALUES (1, 'Regular Customer'), (2, 'Bulk Orders');

-- PAYMENTS Table
CREATE TABLE PAYMENTS (
    user_id INT,
    payment_type ENUM('pay', 'receive'),
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES ACCOUNTS(user_id) ON DELETE CASCADE
);

-- EMPLOYEE Table
CREATE TABLE EMPLOYEE (
    employee_id INT PRIMARY KEY,
    name VARCHAR(255),
    job_role VARCHAR(100),
    salary DECIMAL(10,2)
);

INSERT INTO EMPLOYEE VALUES (1, 'Vikram', 'Supervisor', 30000.00), (2, 'Ajay', 'Operator', 18000.00);

CREATE TABLE EMPLOYEE_CERTIFICATE (
    certificate_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    certificate_name VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id) ON DELETE CASCADE
);

INSERT INTO EMPLOYEE_CERTIFICATE(employee_id, certificate_name) VALUES (1, 'Production Safety');

-- MACHINE Table
CREATE TABLE MACHINE (
    machine_id INT PRIMARY KEY,
    machine_name VARCHAR(255),
    machine_type VARCHAR(255),
    description TEXT
);

INSERT INTO MACHINE VALUES (1, 'Laser Cutter');

-- MACHINE_MAINTENANCE Table
CREATE TABLE MACHINE_MAINTENANCE (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    machine_id INT,
    maintenance_date DATE,
    cost DECIMAL(10,2),
    maintenance_company_details TEXT,
    FOREIGN KEY (machine_id) REFERENCES MACHINE(machine_id) ON DELETE CASCADE
);

INSERT INTO MACHINE_MAINTENANCE(machine_id, maintenance_date, cost, maintenance_company_details)
VALUES (1, '2025-04-10', 2500.00, 'Hyderabad Maintenance Co.');

-- SUPPLIER Table
CREATE TABLE SUPPLIER (
    supplier_id INT PRIMARY KEY,
    name VARCHAR(255),
    quality_rating DECIMAL(3,2),
    address TEXT
);

INSERT INTO SUPPLIER VALUES (1, 'ABC Fabrics', 4.5, 'Delhi');

-- INVENTORY Table
CREATE TABLE INVENTORY (
    material_id INT PRIMARY KEY,
    material_name VARCHAR(255),
    storage_location VARCHAR(255),
    quantity INT,
    cost DECIMAL(10,2),
    supplier_id INT,
    FOREIGN KEY (supplier_id) REFERENCES SUPPLIER(supplier_id) ON DELETE SET NULL
);

INSERT INTO INVENTORY VALUES (1, 'Cotton Fabric', 'Store Room A', 100, 5000.00, 1);

-- PRODUCTION_REPORT Table
CREATE TABLE PRODUCTION_REPORT (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    production_date DATE,
    quantity_produced INT,
    generated_by VARCHAR(255),
    reviewed_by VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);

-- DESIGN Table
CREATE TABLE DESIGN (
    design_id INT PRIMARY KEY,
    order_id INT,
    design_name VARCHAR(255),
    colors_used TEXT,
    remarks TEXT,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE
);

INSERT INTO DESIGN VALUES (1, 101, 'Floral Print', 'Red, Yellow', 'Special Order');

-- EMPLOYEE_ORDER Mapping Table
CREATE TABLE EMPLOYEE_ORDER (
    employee_id INT,
    order_id INT,
    PRIMARY KEY (employee_id, order_id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
);

-- (Continue with your VIEWS, FUNCTIONS, PROCEDURES, TRIGGERS, and COMPLEX QUERIES as before)
-- FULL SQL SCRIPT END
-- (Existing tables and complex queries above)

-- VIEWS
CREATE VIEW ActiveOrderPayments AS
SELECT C.name AS customer_name, O.order_id, O.status, P.payment_method, P.amount, P.payment_date
FROM CUSTOMER C
JOIN ORDERS O ON C.customer_id = O.customer_id
JOIN PAYMENT P ON O.order_id = P.order_id
WHERE O.status = 'Active';
-- To view: SELECT * FROM ActiveOrderPayments;

CREATE VIEW DesignOrders AS
SELECT D.design_name, COUNT(O.order_id) AS total_orders, SUM(O.amount) AS total_amount
FROM DESIGN D
JOIN ORDERS O ON D.order_id = O.order_id
GROUP BY D.design_name;
-- To view: SELECT * FROM DesignOrders;

-- FUNCTIONS
DELIMITER //
CREATE FUNCTION TotalPaymentsByCustomer(cust_id INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_payment DECIMAL(10,2);
    SELECT SUM(P.amount) INTO total_payment
    FROM ORDERS O
    JOIN PAYMENT P ON O.order_id = P.order_id
    WHERE O.customer_id = cust_id;
    RETURN IFNULL(total_payment, 0);
END //
DELIMITER ;
-- To call: SELECT TotalPaymentsByCustomer(1);

DELIMITER //
CREATE FUNCTION TotalMaintenanceCost(machine INT) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_cost DECIMAL(10,2);
    SELECT SUM(cost) INTO total_cost 
    FROM MACHINE_MAINTENANCE 
    WHERE machine_id = machine;
    RETURN IFNULL(total_cost, 0);
END //
DELIMITER ;
-- To call: SELECT TotalMaintenanceCost(1);

-- STORED PROCEDURES
DELIMITER //
CREATE PROCEDURE GenerateProductionReport(
    IN p_order_id INT, 
    IN p_generated_by VARCHAR(255), 
    IN p_reviewed_by VARCHAR(255)
)
BEGIN
    INSERT INTO PRODUCTION_REPORT (order_id, production_date, generated_by, reviewed_by)
    VALUES (p_order_id, CURDATE(), p_generated_by, p_reviewed_by);
END //
-- To call: CALL GenerateProductionReport(101, 'Vikram', 'Ajay');

DELIMITER //
CREATE PROCEDURE AddPaymentAndCloseOrder(
    IN p_order_id INT, 
    IN p_user_id INT, 
    IN p_payment_method VARCHAR(50), 
    IN p_amount DECIMAL(10,2)
)
BEGIN
    INSERT INTO PAYMENT (order_id, user_id, payment_method, payment_date, amount)
    VALUES (p_order_id, p_user_id, p_payment_method, CURDATE(), p_amount);
    UPDATE ORDERS SET status = 'Completed' WHERE order_id = p_order_id;
END //
-- To call: CALL AddPaymentAndCloseOrder(101, 1, 'UPI', 1500.00);

-- TRIGGERS
DELIMITER //
CREATE TRIGGER update_total_price_after_order
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    UPDATE CUSTOMER 
    SET total_price = total_price + NEW.amount
    WHERE customer_id = NEW.customer_id;
END //
DELIMITER ;

-- CURSOR PROCEDURE
DELIMITER //
CREATE PROCEDURE SupplierInventorySummary()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE s_name VARCHAR(255);
    DECLARE m_count INT;
    DECLARE supplier_cursor CURSOR FOR 
        SELECT S.name, COUNT(I.material_id)
        FROM SUPPLIER S
        JOIN INVENTORY I ON S.supplier_id = I.supplier_id
        GROUP BY S.supplier_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN supplier_cursor;
    read_loop: LOOP
        FETCH supplier_cursor INTO s_name, m_count;
        IF done THEN LEAVE read_loop; END IF;
        SELECT CONCAT('Supplier: ', s_name, ' has ', m_count, ' materials') AS summary;
    END LOOP;
    CLOSE supplier_cursor;
END //
DELIMITER ;
-- To call: CALL SupplierInventorySummary();

-- COMPLEX QUERIES SECTION

-- 1. Top 3 Customers by Total Payments
SELECT C.name, SUM(P.amount) AS total_paid
FROM CUSTOMER C
JOIN ORDERS O ON C.customer_id = O.customer_id
JOIN PAYMENT P ON O.order_id = P.order_id
GROUP BY C.name
ORDER BY total_paid DESC
LIMIT 3;

-- 2. Orders with No Payment Made Yet
SELECT O.order_id, C.name, O.amount
FROM ORDERS O
JOIN CUSTOMER C ON C.customer_id = O.customer_id
LEFT JOIN PAYMENT P ON O.order_id = P.order_id
WHERE P.payment_id IS NULL;

-- 3. Average Maintenance Cost Per Machine
SELECT M.machine_name, AVG(MM.cost) AS average_cost
FROM MACHINE M
JOIN MACHINE_MAINTENANCE MM ON M.machine_id = MM.machine_id
GROUP BY M.machine_id;

-- 4. Total Inventory Cost Per Supplier
SELECT S.name AS supplier_name, SUM(I.cost) AS total_inventory_value
FROM SUPPLIER S
JOIN INVENTORY I ON S.supplier_id = I.supplier_id
GROUP BY S.supplier_id;

-- 5. Employees with More Than One Certificate
SELECT E.name, COUNT(EC.certificate_id) AS certificate_count
FROM EMPLOYEE E
JOIN EMPLOYEE_CERTIFICATE EC ON E.employee_id = EC.employee_id
GROUP BY E.employee_id
HAVING certificate_count > 1;

-- 6. Production Report Count Per Employee (Generated By)
SELECT generated_by, COUNT(report_id) AS total_reports
FROM PRODUCTION_REPORT
GROUP BY generated_by;

-- 7. Total Payments Collected Per Payment Method
SELECT payment_method, SUM(amount) AS total_collected
FROM PAYMENT
GROUP BY payment_method;

-- 8. Customers Whose Total Price Exceeds 2000
SELECT name, total_price
FROM CUSTOMER
WHERE total_price > 2000;

-- 9. Pending Orders Count Per Customer
SELECT C.name, COUNT(O.order_id) AS pending_orders
FROM CUSTOMER C
JOIN ORDERS O ON C.customer_id = O.customer_id
WHERE O.status = 'Active'
GROUP BY C.name;

-- 10. Recent 5 Orders with Payment Details
SELECT O.order_id, C.name AS customer_name, O.order_date, O.amount, P.amount AS payment_amount
FROM ORDERS O
JOIN CUSTOMER C ON C.customer_id = O.customer_id
LEFT JOIN PAYMENT P ON O.order_id = P.order_id
ORDER BY O.order_date DESC
LIMIT 5;

-- END OF COMPLEX QUERIES
-- if doesnot eist
-- Create database
CREATE DATABASE IF NOT EXISTS GarmentsDB;
USE GarmentsDB;

-- Create CUSTOMER table
CREATE TABLE IF NOT EXISTS CUSTOMER (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create EMPLOYEE table
CREATE TABLE IF NOT EXISTS EMPLOYEE (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MACHINE table
CREATE TABLE IF NOT EXISTS MACHINE (
    machine_id INT AUTO_INCREMENT PRIMARY KEY,
    machine_name VARCHAR(100) NOT NULL,
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

-- Create ORDER table
CREATE TABLE IF NOT EXISTS `ORDER` (
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

-- Create PAYMENT table
CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (order_id) REFERENCES `ORDER`(order_id)
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
    FOREIGN KEY (order_id) REFERENCES `ORDER`(order_id),
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
('Demo Employee', 'employee@example.com', 'password123', 'worker', 50000.00, '1234567890', '456 Demo St');

INSERT INTO MACHINE (machine_name, machine_type, status) VALUES
('Sewing Machine 1', 'sewing', 'active'),
('Cutting Machine 1', 'cutting', 'active');

INSERT INTO DESIGN (design_name, description, price) VALUES
('Basic T-Shirt', 'Simple cotton t-shirt', 29.99),
('Jeans', 'Classic blue jeans', 49.99);