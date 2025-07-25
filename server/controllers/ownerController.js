const db = require('../models/db');

const ownerController = {
    getDashboard: async (req, res) => {
        try {
            // Get total counts
            const [customerCount] = await db.query('SELECT COUNT(*) as count FROM CUSTOMER');
            const [employeeCount] = await db.query('SELECT COUNT(*) as count FROM EMPLOYEE');
            const [orderCount] = await db.query('SELECT COUNT(*) as count FROM ORDERS');
            const [machineCount] = await db.query('SELECT COUNT(*) as count FROM MACHINE');

            // Get recent orders
            const [recentOrders] = await db.query(
                `SELECT o.*, c.name as customer_name 
                FROM ORDERS o 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id 
                ORDER BY o.order_date DESC LIMIT 5`
            );

            // Get total payments
            const [totalPayments] = await db.query('SELECT SUM(amount) as total FROM PAYMENT');

            res.render('owner/dashboard', {
                counts: {
                    customers: customerCount[0].count,
                    employees: employeeCount[0].count,
                    orders: orderCount[0].count,
                    machines: machineCount[0].count
                },
                recentOrders,
                totalPayments: totalPayments[0].total || 0
            });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error loading dashboard' });
        }
    },

    getCustomers: async (req, res) => {
        try {
            const [customers] = await db.query('SELECT * FROM CUSTOMER');
            res.render('owner/customers', { customers });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching customers' });
        }
    },

    createCustomer: async (req, res) => {
        try {
            const { name, email, phone_no, address } = req.body;
            await db.query(
                'INSERT INTO CUSTOMER (name, email, phone_no, address) VALUES (?, ?, ?, ?)',
                [name, email, phone_no, address]
            );
            res.redirect('/owner/customers');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error creating customer' });
        }
    },

    updateCustomer: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, phone_no, address } = req.body;
            await db.query(
                'UPDATE CUSTOMER SET name = ?, email = ?, phone_no = ?, address = ? WHERE customer_id = ?',
                [name, email, phone_no, address, id]
            );
            res.redirect('/owner/customers');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error updating customer' });
        }
    },

    deleteCustomer: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM CUSTOMER WHERE customer_id = ?', [id]);
            res.redirect('/owner/customers');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error deleting customer' });
        }
    },

    getEmployees: async (req, res) => {
        try {
            const [employees] = await db.query('SELECT * FROM EMPLOYEE');
            res.render('owner/employees', { employees });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching employees' });
        }
    },

    getEmployeeAttendance: async (req, res) => {
        try {
            const { id } = req.params;
            const [attendance] = await db.query(
                `SELECT a.*, e.name as employee_name 
                FROM ATTENDANCE a 
                JOIN EMPLOYEE e ON a.employee_id = e.employee_id 
                WHERE a.employee_id = ? 
                ORDER BY a.date DESC`,
                [id]
            );
            res.render('owner/attendance', { attendance });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching attendance' });
        }
    },

    getLeaveRequests: async (req, res) => {
        try {
            const [leaves] = await db.query(
                `SELECT l.*, e.name as employee_name 
                FROM LEAVE_REQUEST l 
                JOIN EMPLOYEE e ON l.employee_id = e.employee_id 
                ORDER BY l.created_at DESC`
            );
            res.render('owner/leaves', { leaves });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching leave requests' });
        }
    },

    updateLeaveStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await db.query(
                'UPDATE LEAVE_REQUEST SET status = ? WHERE leave_id = ?',
                [status, id]
            );
            res.redirect('/owner/leaves');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error updating leave status' });
        }
    },

    createEmployee: async (req, res) => {
        try {
            const { name, job_role, salary } = req.body;
            await db.query(
                'INSERT INTO EMPLOYEE (name, job_role, salary) VALUES (?, ?, ?)',
                [name, job_role, salary]
            );
            res.redirect('/owner/employees');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error creating employee' });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, job_role, salary } = req.body;
            await db.query(
                'UPDATE EMPLOYEE SET name = ?, job_role = ?, salary = ? WHERE employee_id = ?',
                [name, job_role, salary, id]
            );
            res.redirect('/owner/employees');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error updating employee' });
        }
    },

    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM EMPLOYEE WHERE employee_id = ?', [id]);
            res.redirect('/owner/employees');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error deleting employee' });
        }
    },

    getMachines: async (req, res) => {
        try {
            const [machines] = await db.query('SELECT * FROM MACHINE');
            res.render('owner/machines', { machines });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching machines' });
        }
    },

    createMachine: async (req, res) => {
        try {
            const { machine_name } = req.body;
            await db.query('INSERT INTO MACHINE (machine_name) VALUES (?)', [machine_name]);
            res.redirect('/owner/machines');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error creating machine' });
        }
    },

    updateMachine: async (req, res) => {
        try {
            const { id } = req.params;
            const { machine_name } = req.body;
            await db.query('UPDATE MACHINE SET machine_name = ? WHERE machine_id = ?', [machine_name, id]);
            res.redirect('/owner/machines');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error updating machine' });
        }
    },

    deleteMachine: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM MACHINE WHERE machine_id = ?', [id]);
            res.redirect('/owner/machines');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error deleting machine' });
        }
    },

    getOrders: async (req, res) => {
        try {
            const [orders] = await db.query(
                `SELECT o.*, c.name as customer_name 
                FROM ORDERS o 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id 
                ORDER BY o.order_date DESC`
            );
            res.render('owner/orders', { orders });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching orders' });
        }
    },

    getOrderDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const [order] = await db.query(
                `SELECT o.*, c.name as customer_name, c.email, c.phone_no 
                FROM ORDERS o 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id 
                WHERE o.order_id = ?`,
                [id]
            );

            if (!order.length) {
                return res.render('error', { message: 'Order not found' });
            }

            const [payments] = await db.query(
                'SELECT * FROM PAYMENT WHERE order_id = ?',
                [id]
            );

            const [design] = await db.query(
                'SELECT * FROM DESIGN WHERE order_id = ?',
                [id]
            );

            res.render('owner/orderDetails', {
                order: order[0],
                payments,
                design: design[0]
            });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching order details' });
        }
    },

    getInventory: async (req, res) => {
        try {
            const [inventory] = await db.query(
                `SELECT i.*, s.name as supplier_name 
                FROM INVENTORY i 
                LEFT JOIN SUPPLIER s ON i.supplier_id = s.supplier_id`
            );
            res.render('owner/inventory', { inventory });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching inventory' });
        }
    },

    addInventory: async (req, res) => {
        try {
            const { material_name, storage_location, quantity, cost, supplier_id } = req.body;
            await db.query(
                'INSERT INTO INVENTORY (material_name, storage_location, quantity, cost, supplier_id) VALUES (?, ?, ?, ?, ?)',
                [material_name, storage_location, quantity, cost, supplier_id]
            );
            res.redirect('/owner/inventory');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error adding inventory' });
        }
    },

    updateInventory: async (req, res) => {
        try {
            const { id } = req.params;
            const { material_name, storage_location, quantity, cost, supplier_id } = req.body;
            await db.query(
                'UPDATE INVENTORY SET material_name = ?, storage_location = ?, quantity = ?, cost = ?, supplier_id = ? WHERE material_id = ?',
                [material_name, storage_location, quantity, cost, supplier_id, id]
            );
            res.redirect('/owner/inventory');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error updating inventory' });
        }
    },

    getProductionReports: async (req, res) => {
        try {
            const [reports] = await db.query(
                `SELECT pr.*, o.order_id, c.name as customer_name 
                FROM PRODUCTION_REPORT pr 
                JOIN ORDERS o ON pr.order_id = o.order_id 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id 
                ORDER BY pr.production_date DESC`
            );
            res.render('owner/productionReports', { reports });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching production reports' });
        }
    },

    getMaintenanceReports: async (req, res) => {
        try {
            const [maintenance] = await db.query(
                `SELECT mm.*, m.machine_name 
                FROM MACHINE_MAINTENANCE mm 
                JOIN MACHINE m ON mm.machine_id = m.machine_id 
                ORDER BY mm.maintenance_date DESC`
            );
            res.render('owner/maintenanceReports', { maintenance });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching maintenance reports' });
        }
    },

    getPaymentReports: async (req, res) => {
        try {
            const [payments] = await db.query(
                `SELECT p.*, c.name as customer_name, o.order_date 
                FROM PAYMENT p 
                JOIN ORDERS o ON p.order_id = o.order_id 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id 
                ORDER BY p.payment_date DESC`
            );
            res.render('owner/paymentReports', { payments });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching payment reports' });
        }
    }
};

module.exports = ownerController; 