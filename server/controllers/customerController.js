const db = require('../config/database');

const customerController = {
    getDashboard: async (req, res) => {
        try {
            const customerId = req.user.id;
            
            // Get customer details
            const [customer] = await db.query(
                'SELECT * FROM CUSTOMER WHERE customer_id = ?',
                [customerId]
            );

            // Get recent orders
            const [orders] = await db.query(
                `SELECT o.*, d.design_name 
                FROM ORDERS o 
                JOIN DESIGN d ON o.design_id = d.design_id
                WHERE o.customer_id = ? 
                ORDER BY o.order_date DESC LIMIT 5`,
                [customerId]
            );

            // Get total payments
            const [payments] = await db.query(
                'SELECT SUM(amount) as total_payments FROM PAYMENT WHERE order_id IN (SELECT order_id FROM ORDERS WHERE customer_id = ?)',
                [customerId]
            );

            res.render('customer/dashboard', {
                customer: customer[0],
                orders,
                totalPayments: payments[0].total_payments || 0
            });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error loading dashboard' });
        }
    },

    getOrders: async (req, res) => {
        try {
            const customerId = req.user.id;
            
            // Get all orders
            const [orders] = await db.query(
                `SELECT o.*, d.design_name 
                FROM ORDERS o 
                JOIN DESIGN d ON o.design_id = d.design_id
                WHERE o.customer_id = ? 
                ORDER BY o.order_date DESC`,
                [customerId]
            );

            // Get available designs
            const [designs] = await db.query(
                'SELECT * FROM DESIGN'
            );

            res.render('customer/orders', { 
                orders,
                designs
            });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching orders' });
        }
    },

    createOrder: async (req, res) => {
        try {
            const { design_id, quantity } = req.body;
            const customerId = req.user.id;

            // Get design price
            const [design] = await db.query(
                'SELECT price FROM DESIGN WHERE design_id = ?',
                [design_id]
            );

            if (!design.length) {
                return res.render('error', { message: 'Design not found' });
            }

            const amount = design[0].price * quantity;

            // Create order
            const [result] = await db.query(
                'INSERT INTO ORDERS (customer_id, design_id, quantity, amount, status) VALUES (?, ?, ?, ?, "pending")',
                [customerId, design_id, quantity, amount]
            );

            res.redirect('/customer/orders');
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error creating order' });
        }
    },

    getOrderDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const customerId = req.user.id;

            const [order] = await db.query(
                `SELECT o.*, d.design_name, d.description, d.price 
                FROM ORDERS o 
                JOIN DESIGN d ON o.design_id = d.design_id
                WHERE o.order_id = ? AND o.customer_id = ?`,
                [id, customerId]
            );

            if (!order.length) {
                return res.render('error', { message: 'Order not found' });
            }

            const [payments] = await db.query(
                'SELECT * FROM PAYMENT WHERE order_id = ? ORDER BY payment_date DESC',
                [id]
            );

            res.render('customer/orderDetails', {
                order: order[0],
                payments
            });
        } catch (error) {
            console.error(error);
            res.render('error', { message: 'Error fetching order details' });
        }
    },

    getPayments: async (req, res) => {
        try {
            const customerId = req.user.id;
            const [payments] = await db.query(`
                SELECT p.*, o.order_date, d.design_name
                FROM PAYMENT p
                JOIN ORDERS o ON p.order_id = o.order_id
                JOIN DESIGN d ON o.design_id = d.design_id
                WHERE o.customer_id = ?
                ORDER BY p.payment_date DESC
            `, [customerId]);
            
            res.render('customer/payments', { payments });
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.render('error', { message: 'Error loading payments' });
        }
    },

    makePayment: async (req, res) => {
        try {
            const { order_id, amount } = req.body;
            const customerId = req.user.id;
            
            // Verify order belongs to customer
            const [order] = await db.query(
                'SELECT * FROM ORDERS WHERE order_id = ? AND customer_id = ?',
                [order_id, customerId]
            );
            
            if (order.length === 0) {
                return res.render('error', { message: 'Order not found' });
            }
            
            // Create payment
            await db.query(
                'INSERT INTO PAYMENT (order_id, amount, payment_date) VALUES (?, ?, NOW())',
                [order_id, amount]
            );
            
            res.redirect('/customer/payments');
        } catch (error) {
            console.error('Error making payment:', error);
            res.render('error', { message: 'Error processing payment' });
        }
    },

    getDesigns: async (req, res) => {
        try {
            const [designs] = await db.query('SELECT * FROM DESIGN');
            res.render('customer/designs', { designs });
        } catch (error) {
            console.error('Error fetching designs:', error);
            res.render('error', { message: 'Error fetching designs' });
        }
    },

    placeOrder: async (req, res) => {
        try {
            const { design_id, quantity } = req.body;
            const customerId = req.user.id;
            
            // Get design price
            const [design] = await db.query(
                'SELECT price FROM DESIGN WHERE design_id = ?',
                [design_id]
            );
            
            if (design.length === 0) {
                return res.render('error', { message: 'Design not found' });
            }
            
            const amount = design[0].price * quantity;
            
            // Create order
            const [result] = await db.query(`
                INSERT INTO ORDERS (customer_id, design_id, quantity, amount, status)
                VALUES (?, ?, ?, ?, 'pending')
            `, [customerId, design_id, quantity, amount]);
            
            res.redirect('/customer/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            res.render('error', { message: 'Error placing order' });
        }
    }
};

module.exports = customerController; 