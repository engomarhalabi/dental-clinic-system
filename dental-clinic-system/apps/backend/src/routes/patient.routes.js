const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  deletePatientPermanently,
} = require('../controllers/patient.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

// كل مسارات المرضى تتطلب تسجيل دخول
router.use(authenticate);

const patientValidationRules = [
  body('fullName').notEmpty().withMessage('اسم المريض مطلوب'),
  body('phone').notEmpty().withMessage('رقم الهاتف مطلوب'),
  body('gender').optional().isIn(['MALE', 'FEMALE']).withMessage('الجنس غير صحيح'),
  body('dateOfBirth').optional().isISO8601().withMessage('تاريخ الميلاد غير صحيح'),
];

// إضافة مريض - كل الأدوار ما عدا المحاسب (استقبال/طبيب/مدير)
router.post(
  '/',
  authorize('ADMIN', 'DENTIST', 'RECEPTIONIST'),
  patientValidationRules,
  validate,
  createPatient
);

// قائمة المرضى + بحث - كل الأدوار
router.get('/', getPatients);

// تفاصيل مريض - كل الأدوار
router.get('/:id', getPatientById);

// تعديل مريض - كل الأدوار ما عدا المحاسب
router.put(
  '/:id',
  authorize('ADMIN', 'DENTIST', 'RECEPTIONIST'),
  patientValidationRules.map((rule) => rule.optional()),
  validate,
  updatePatient
);

// حذف (تعطيل) مريض - أدمن واستقبال فقط
router.delete('/:id', authorize('ADMIN', 'RECEPTIONIST'), deletePatient);

// حذف نهائي - أدمن فقط
router.delete('/:id/permanent', authorize('ADMIN'), deletePatientPermanently);

module.exports = router;
