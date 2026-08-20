const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const partnerRoutes = require('./routes/partners');
const employeeRoutes = require('./routes/employees');
const assignmentRoutes = require('./routes/assignments');
const salaryRoutes = require('./routes/salary');
const commissionRoutes = require('./routes/commissions');
const activityLogRoutes = require('./routes/activityLogs');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
const uploadsRoot = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsRoot));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AIRB Employee Management API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
