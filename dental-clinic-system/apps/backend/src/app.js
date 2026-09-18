const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const { error } = require('./utils/apiResponse');

const app = express();

// ==================== Middleware عام ====================
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== فحص صحة السيرفر ====================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'السيرفر شغال', timestamp: new Date().toISOString() });
});

// ==================== المسارات (Routes) ====================
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// المزيد من المسارات ستُضاف في المراحل القادمة:
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/visits', visitRoutes);
// app.use('/api/teeth', teethRoutes);
// app.use('/api/invoices', invoiceRoutes);

// ==================== معالجة 404 ====================
app.use((req, res) => {
  return error(res, 'المسار غير موجود', 404);
});

// ==================== معالج الأخطاء العام ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  return error(res, 'حدث خطأ في الخادم', 500);
});

module.exports = app;
