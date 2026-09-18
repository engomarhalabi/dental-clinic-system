const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/auth/login
 * تسجيل دخول بالإيميل وكلمة المرور
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return error(res, 'الإيميل أو كلمة المرور غير صحيحة', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'الإيميل أو كلمة المرور غير صحيحة', 401);
    }

    const token = generateToken(user);

    return success(res, {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    }, 'تم تسجيل الدخول بنجاح');
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء تسجيل الدخول', 500);
  }
}

/**
 * POST /api/auth/users
 * إنشاء مستخدم جديد (طبيب/استقبال/محاسب/مدير) - يُسمح فقط للأدمن
 */
async function createUser(req, res) {
  try {
    const { fullName, email, password, role, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error(res, 'يوجد مستخدم بنفس الإيميل مسبقاً', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName, email, password: hashedPassword, role, phone },
      select: { id: true, fullName: true, email: true, role: true, phone: true, isActive: true, createdAt: true },
    });

    return success(res, user, 'تم إنشاء المستخدم بنجاح', 201);
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء إنشاء المستخدم', 500);
  }
}

/**
 * GET /api/auth/me
 * بيانات المستخدم المسجّل دخوله حالياً
 */
async function getMe(req, res) {
  return success(res, req.user, 'بيانات المستخدم الحالي');
}

module.exports = { login, createUser, getMe };
