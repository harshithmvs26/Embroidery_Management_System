const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all report routes
router.use(authMiddleware);

// Production Reports
router.get('/production', reportController.getProductionReports);
router.get('/production/:id', reportController.getProductionReportDetails);

// Maintenance Reports
router.get('/maintenance', reportController.getMaintenanceReports);
router.get('/maintenance/:id', reportController.getMaintenanceReportDetails);

// Payment Reports
router.get('/payments', reportController.getPaymentReports);
router.get('/payments/:id', reportController.getPaymentReportDetails);

module.exports = router; 