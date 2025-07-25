const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all customer routes
router.use(authMiddleware.verifyToken, authMiddleware.verifyCustomer);

// Customer dashboard
router.get('/dashboard', customerController.getDashboard);

// Order management
router.get('/orders', customerController.getOrders);
router.post('/orders', customerController.createOrder);
router.get('/orders/:id', customerController.getOrderDetails);

// Payment management
router.get('/payments', customerController.getPayments);
router.post('/payments', customerController.makePayment);

module.exports = router; 