const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all employee routes
router.use(authMiddleware.verifyToken, authMiddleware.verifyEmployee);

// Employee dashboard
router.get('/dashboard', employeeController.getDashboard);

// Order management
router.get('/orders', employeeController.getAssignedOrders);
router.get('/orders/:id', employeeController.getOrderDetails);

// Production reports
router.get('/reports', employeeController.getReports);
router.post('/reports', employeeController.generateReport);

// Machine management
router.get('/machines', employeeController.getMachines);
router.get('/machines/:id/maintenance', employeeController.getMachineMaintenance);

// Inventory
router.get('/inventory', employeeController.getInventory);

module.exports = router; 