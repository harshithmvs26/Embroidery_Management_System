const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

const authController = {
    getLogin: (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        try {
            const { email, password, role } = req.body;
            
            // Determine which table to query based on role
            let table, idField;
            switch(role) {
                case 'customer':
                    table = 'CUSTOMER';
                    idField = 'customer_id';
                    break;
                case 'employee':
                    table = 'EMPLOYEE';
                    idField = 'employee_id';
                    break;
                case 'owner':
                    // For demo purposes, using a hardcoded owner
                    if (email === 'owner@garments.com' && password === 'owner123') {
                        const token = jwt.sign(
                            { id: 1, role: 'owner', name: 'Demo Owner' },
                            process.env.JWT_SECRET,
                            { expiresIn: '1h' }
                        );
                        res.cookie('token', token, { httpOnly: true });
                        return res.redirect('/owner/dashboard');
                    }
                    return res.render('login', { message: 'Invalid credentials' });
                default:
                    return res.render('login', { message: 'Invalid role' });
            }

            // Query the appropriate table
            const [rows] = await db.query(
                `SELECT * FROM ${table} WHERE email = ?`,
                [email]
            );

            if (rows.length === 0) {
                return res.render('login', { message: 'User not found' });
            }

            const user = rows[0];
            
            // For demo purposes, we're not checking password
            // In production, you should hash passwords and verify them
            const token = jwt.sign(
                { id: user[idField], role: role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            res.cookie('token', token, { httpOnly: true });
            
            // Redirect based on role
            switch(role) {
                case 'customer':
                    res.redirect('/customer/dashboard');
                    break;
                case 'employee':
                    res.redirect('/employee/dashboard');
                    break;
                default:
                    res.redirect('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            res.render('login', { message: 'An error occurred' });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};

module.exports = authController; 