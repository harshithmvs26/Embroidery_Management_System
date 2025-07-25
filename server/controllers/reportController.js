const db = require('../config/database');

const reportController = {
    // Get all production reports
    getProductionReports: async (req, res) => {
        try {
            const [reports] = await db.query(`
                SELECT pr.*, e.name as employee_name, o.order_id, c.name as customer_name
                FROM production_reports pr
                JOIN employees e ON pr.employee_id = e.employee_id
                JOIN orders o ON pr.order_id = o.order_id
                JOIN customers c ON o.customer_id = c.customer_id
                ORDER BY pr.report_date DESC
            `);
            res.render('owner/reports/production', { reports });
        } catch (error) {
            console.error('Error fetching production reports:', error);
            res.render('error', { message: 'Error fetching production reports' });
        }
    },

    // Get production report details
    getProductionReportDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const [report] = await db.query(`
                SELECT pr.*, e.name as employee_name, o.order_id, c.name as customer_name
                FROM production_reports pr
                JOIN employees e ON pr.employee_id = e.employee_id
                JOIN orders o ON pr.order_id = o.order_id
                JOIN customers c ON o.customer_id = c.customer_id
                WHERE pr.report_id = ?
            `, [id]);
            
            if (report.length === 0) {
                return res.render('error', { message: 'Report not found' });
            }
            
            res.render('owner/reports/production-details', { report: report[0] });
        } catch (error) {
            console.error('Error fetching production report details:', error);
            res.render('error', { message: 'Error fetching production report details' });
        }
    },

    // Get all maintenance reports
    getMaintenanceReports: async (req, res) => {
        try {
            const [reports] = await db.query(`
                SELECT mr.*, m.machine_name, e.name as employee_name
                FROM maintenance_reports mr
                JOIN machines m ON mr.machine_id = m.machine_id
                JOIN employees e ON mr.employee_id = e.employee_id
                ORDER BY mr.maintenance_date DESC
            `);
            res.render('owner/reports/maintenance', { reports });
        } catch (error) {
            console.error('Error fetching maintenance reports:', error);
            res.render('error', { message: 'Error fetching maintenance reports' });
        }
    },

    // Get maintenance report details
    getMaintenanceReportDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const [report] = await db.query(`
                SELECT mr.*, m.machine_name, e.name as employee_name
                FROM maintenance_reports mr
                JOIN machines m ON mr.machine_id = m.machine_id
                JOIN employees e ON mr.employee_id = e.employee_id
                WHERE mr.maintenance_id = ?
            `, [id]);
            
            if (report.length === 0) {
                return res.render('error', { message: 'Report not found' });
            }
            
            res.render('owner/reports/maintenance-details', { report: report[0] });
        } catch (error) {
            console.error('Error fetching maintenance report details:', error);
            res.render('error', { message: 'Error fetching maintenance report details' });
        }
    },

    // Get all payment reports
    getPaymentReports: async (req, res) => {
        try {
            const [reports] = await db.query(`
                SELECT p.*, o.order_id, c.name as customer_name
                FROM payments p
                JOIN orders o ON p.order_id = o.order_id
                JOIN customers c ON o.customer_id = c.customer_id
                ORDER BY p.payment_date DESC
            `);
            res.render('owner/reports/payments', { reports });
        } catch (error) {
            console.error('Error fetching payment reports:', error);
            res.render('error', { message: 'Error fetching payment reports' });
        }
    },

    // Get payment report details
    getPaymentReportDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const [report] = await db.query(`
                SELECT p.*, o.order_id, c.name as customer_name
                FROM payments p
                JOIN orders o ON p.order_id = o.order_id
                JOIN customers c ON o.customer_id = c.customer_id
                WHERE p.payment_id = ?
            `, [id]);
            
            if (report.length === 0) {
                return res.render('error', { message: 'Report not found' });
            }
            
            res.render('owner/reports/payment-details', { report: report[0] });
        } catch (error) {
            console.error('Error fetching payment report details:', error);
            res.render('error', { message: 'Error fetching payment report details' });
        }
    }
};

module.exports = reportController; 