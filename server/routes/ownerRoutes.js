const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all owner routes
router.use(authMiddleware.verifyToken, authMiddleware.verifyOwner);

// Owner dashboard
router.get('/dashboard', ownerController.getDashboard);

// Customer management
router.get('/customers', ownerController.getCustomers);
router.post('/customers', ownerController.createCustomer);
router.put('/customers/:id', ownerController.updateCustomer);
router.delete('/customers/:id', ownerController.deleteCustomer);

// Employee management
router.get('/employees', ownerController.getEmployees);
router.get('/employees/:id/attendance', ownerController.getEmployeeAttendance);
router.post('/employees', ownerController.createEmployee);
router.put('/employees/:id', ownerController.updateEmployee);
router.delete('/employees/:id', ownerController.deleteEmployee);

// Leave management
router.get('/leaves', ownerController.getLeaveRequests);
router.put('/leaves/:id', ownerController.updateLeaveStatus);

// Machine management
router.get('/machines', ownerController.getMachines);
router.post('/machines', ownerController.createMachine);
router.put('/machines/:id', ownerController.updateMachine);
router.delete('/machines/:id', ownerController.deleteMachine);

// Order management
router.get('/orders', ownerController.getOrders);
router.get('/orders/:id', ownerController.getOrderDetails);

// Inventory management
router.get('/inventory', ownerController.getInventory);
router.post('/inventory', ownerController.addInventory);
router.put('/inventory/:id', ownerController.updateInventory);

// Reports
router.get('/reports/production', ownerController.getProductionReports);
router.get('/reports/maintenance', ownerController.getMaintenanceReports);
router.get('/reports/payments', ownerController.getPaymentReports);

module.exports = router; 