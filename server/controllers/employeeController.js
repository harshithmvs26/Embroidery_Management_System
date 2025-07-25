const db = require('../models/db');

const employeeController = {
    getDashboard: async (req, res) => {
        try {
            const employeeId = req.user.id;
            
            // Get employee details
            const [employee] = await db.query(
                'SELECT * FROM EMPLOYEE WHERE employee_id = ?',
                [employeeId]
            );

            // DEBUG: Test EMPLOYEE_ORDER table
            try {
                const [testEmployeeOrder] = await db.query('SELECT * FROM EMPLOYEE_ORDER LIMIT 5');
                console.log('DEBUG EMPLOYEE_ORDER rows:', testEmployeeOrder);
            } catch (testErr) {
                console.error('DEBUG EMPLOYEE_ORDER ERROR:', testErr.message);
            }

            // Get assigned orders
            const assignedOrdersQuery = `SELECT o.*, c.name as customer_name 
                FROM ORDERS o 
                JOIN EMPLOYEE_ORDER eo ON o.order_id = eo.order_id 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id
                WHERE eo.employee_id = ? 
                ORDER BY o.order_date DESC LIMIT 5`;
            console.log('Running assignedOrdersQuery:', assignedOrdersQuery, 'with param:', employeeId);
            const [orders] = await db.query(
                assignedOrdersQuery,
                [employeeId]
            );

            // Get pending orders count
            const [pendingOrdersArr] = await db.query(
                `SELECT o.order_id 
                FROM ORDERS o 
                JOIN EMPLOYEE_ORDER eo ON o.order_id = eo.order_id 
                WHERE eo.employee_id = ? AND o.status = 'Pending'`,
                [employeeId]
            );
            const pendingOrders = pendingOrdersArr.length;

            // Get completed orders count
            const [completedOrdersArr] = await db.query(
                `SELECT o.order_id 
                FROM ORDERS o 
                JOIN EMPLOYEE_ORDER eo ON o.order_id = eo.order_id 
                WHERE eo.employee_id = ? AND o.status = 'Completed'`,
                [employeeId]
            );
            const completedOrders = completedOrdersArr.length;

            // Get available machines count (no status column, so count all machines)
            const [availableMachinesArr] = await db.query(
                `SELECT machine_id FROM MACHINE`
            );
            const availableMachines = availableMachinesArr.length;

            // Get low stock items count (threshold: quantity < 10)
            const [lowStockItemsArr] = await db.query(
                `SELECT material_id FROM INVENTORY WHERE quantity < 10`
            );
            const lowStockItems = lowStockItemsArr.length;

            // Get recent production reports
            const [reports] = await db.query(
                'SELECT * FROM PRODUCTION_REPORT WHERE employee_id = ? ORDER BY report_date DESC LIMIT 5',
                [employeeId]
            );

            res.render('employee/dashboard', {
                employee: employee[0],
                orders,
                reports,
                pendingOrders,
                completedOrders,
                availableMachines,
                lowStockItems
            });
        } catch (error) {
            // Improved error logging
            console.error('Dashboard Error:', error.message, error.stack);
            res.render('error', { message: `Error loading dashboard: ${error.message}` });
        }
    },

    getAssignedOrders: async (req, res) => {
        try {
            const employeeId = req.user.id;
            const [orders] = await db.query(
                `SELECT o.*, c.name as customer_name 
                FROM ORDERS o 
                JOIN EMPLOYEE_ORDER eo ON o.order_id = eo.order_id 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id
                WHERE eo.employee_id = ? 
                ORDER BY o.order_date DESC`,
                [employeeId]
            );

            if (!orders || !orders.length) {
                return res.render('error', { message: 'No orders found' });
            }

            res.render('employee/orders', { orders });
        } catch (error) {
            console.error('Assigned Orders Error:', error.message, error.stack);
            res.render('error', { message: `Error fetching orders: ${error.message}` });
        }
    },

    getOrderDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const employeeId = req.user.id;

            const [order] = await db.query(
                `SELECT o.*, c.name as customer_name, c.email, c.phone 
                FROM ORDERS o 
                JOIN CUSTOMER c ON o.customer_id = c.customer_id
                JOIN EMPLOYEE_ORDER eo ON o.order_id = eo.order_id
                WHERE o.order_id = ? AND eo.employee_id = ?`,
                [id, employeeId]
            );

            if (!order || !order.length) {
                return res.render('error', { message: 'Order not found' });
            }

            const [design] = await db.query(
                'SELECT * FROM DESIGN WHERE design_id = ?',
                [order[0].design_id]
            );

            if (!design || !design.length) {
                return res.render('error', { message: 'Design not found' });
            }

            const [machines] = await db.query(
                'SELECT * FROM MACHINE WHERE status = "active"'
            );

            res.render('employee/orderDetails', {
                order: order[0],
                design: design[0],
                machines
            });
        } catch (error) {
            console.error('Order Details Error:', error.message, error.stack);
            res.render('error', { message: `Error fetching order details: ${error.message}` });
        }
    },

    getReports: async (req, res) => {
        try {
            const employeeId = req.user.id;
            const [reports] = await db.query(
                `SELECT pr.*, m.name as machine_name 
                FROM PRODUCTION_REPORT pr 
                JOIN MACHINE m ON pr.machine_id = m.machine_id 
                WHERE pr.employee_id = ? 
                ORDER BY pr.report_date DESC`,
                [employeeId]
            );
            res.render('employee/reports', { reports });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching reports' });
        }
    },

    generateReport: async (req, res) => {
        try {
            const { order_id, machine_id, quantity_produced, notes } = req.body;
            const employeeId = req.user.id;

            await db.query(
                'INSERT INTO PRODUCTION_REPORT (order_id, employee_id, machine_id, quantity_produced, notes) VALUES (?, ?, ?, ?, ?)',
                [order_id, employeeId, machine_id, quantity_produced, notes]
            );

            res.redirect('/employee/reports');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error generating report' });
        }
    },

    getMachines: async (req, res) => {
        try {
            const [machines] = await db.query('SELECT * FROM MACHINE');
            res.render('employee/machines', { machines });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching machines' });
        }
    },

    getMachineMaintenance: async (req, res) => {
        try {
            const { id } = req.params;
            const [maintenance] = await db.query(
                'SELECT * FROM MAINTENANCE_REPORT WHERE machine_id = ? ORDER BY maintenance_date DESC',
                [id]
            );
            res.render('employee/maintenance', { maintenance });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching maintenance records' });
        }
    },

    getInventory: async (req, res) => {
        try {
            const [inventory] = await db.query(
                `SELECT i.*, s.name as supplier_name 
                FROM INVENTORY i 
                LEFT JOIN SUPPLIER s ON i.supplier_id = s.supplier_id`
            );
            res.render('employee/inventory', { inventory });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching inventory' });
        }
    }
};

module.exports = employeeController; 