const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/employee', employeeRoutes);
app.use('/owner', ownerRoutes);
app.use('/reports', reportRoutes);

// Home route
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 