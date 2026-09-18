const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { login, createUser, getMe } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

// تسجيل الدخول - متاح للجميع
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('يرجى إدخال إيميل صحيح'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
  ],
  validate,
  login
);

// إنشاء مستخدم جديد - للأدمن فقط
router.post(
  '/users',
  authenticate,
  authorize('ADMIN'),
  [
    body('fullName').notEmpty().withMessage('الاسم الكامل مطلوب'),
    body('email').isEmail().withMessage('يرجى إدخال إيميل صحيح'),
    body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    body('role').isIn(['ADMIN', 'DENTIST', 'RECEPTIONIST', 'ACCOUNTANT']).withMessage('دور غير صحيح'),
  ],
  validate,
  createUser
);

// بيانات المستخدم الحالي
router.get('/me', authenticate, getMe);

module.exports = router;
