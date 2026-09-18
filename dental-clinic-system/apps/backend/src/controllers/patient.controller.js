const prisma = require('../config/prisma');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/patients
 * إضافة مريض جديد
 */
async function createPatient(req, res) {
  try {
    const { fullName, phone, whatsapp, dateOfBirth, gender, address, medicalNotes, fileNumber } = req.body;

    const patient = await prisma.patient.create({
      data: {
        fullName,
        phone,
        whatsapp: whatsapp || phone, // إذا لم يُحدد رقم واتساب منفصل، نستخدم نفس رقم الهاتف
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        medicalNotes,
        fileNumber,
      },
    });

    return success(res, patient, 'تمت إضافة المريض بنجاح', 201);
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'رقم الملف مستخدم مسبقاً', 409);
    }
    console.error(err);
    return error(res, 'حدث خطأ أثناء إضافة المريض', 500);
  }
}

/**
 * GET /api/patients
 * قائمة المرضى مع بحث وترقيم صفحات
 * Query params: search, page, limit, isActive
 */
async function getPatients(req, res) {
  try {
    const { search = '', page = 1, limit = 20, isActive } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 20, 100);

    const where = {
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
              { fileNumber: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(isActive !== undefined ? { isActive: isActive === 'true' } : {}),
    };

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.patient.count({ where }),
    ]);

    return success(res, {
      patients,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    }, 'قائمة المرضى');
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء جلب المرضى', 500);
  }
}

/**
 * GET /api/patients/:id
 * تفاصيل مريض واحد (مع آخر الزيارات والمواعيد بشكل مختصر)
 */
async function getPatientById(req, res) {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
        visits: {
          orderBy: { visitDate: 'desc' },
          take: 5,
        },
        toothRecords: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      return error(res, 'المريض غير موجود', 404);
    }

    return success(res, patient, 'تفاصيل المريض');
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء جلب بيانات المريض', 500);
  }
}

/**
 * PUT /api/patients/:id
 * تعديل بيانات مريض
 */
async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const { fullName, phone, whatsapp, dateOfBirth, gender, address, medicalNotes, fileNumber, isActive } = req.body;

    const exists = await prisma.patient.findUnique({ where: { id } });
    if (!exists) {
      return error(res, 'المريض غير موجود', 404);
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
        ...(gender !== undefined && { gender }),
        ...(address !== undefined && { address }),
        ...(medicalNotes !== undefined && { medicalNotes }),
        ...(fileNumber !== undefined && { fileNumber }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return success(res, patient, 'تم تعديل بيانات المريض بنجاح');
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'رقم الملف مستخدم مسبقاً', 409);
    }
    console.error(err);
    return error(res, 'حدث خطأ أثناء تعديل بيانات المريض', 500);
  }
}

/**
 * DELETE /api/patients/:id
 * حذف مريض (حذف ناعم - يعطّل الحساب بدلاً من حذفه فعلياً حفاظاً على السجلات الطبية)
 */
async function deletePatient(req, res) {
  try {
    const { id } = req.params;

    const exists = await prisma.patient.findUnique({ where: { id } });
    if (!exists) {
      return error(res, 'المريض غير موجود', 404);
    }

    await prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });

    return success(res, null, 'تم حذف المريض (تعطيل) بنجاح');
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء حذف المريض', 500);
  }
}

/**
 * DELETE /api/patients/:id/permanent
 * حذف نهائي فعلي - للأدمن فقط، يُستخدم بحذر شديد
 */
async function deletePatientPermanently(req, res) {
  try {
    const { id } = req.params;

    const exists = await prisma.patient.findUnique({ where: { id } });
    if (!exists) {
      return error(res, 'المريض غير موجود', 404);
    }

    await prisma.patient.delete({ where: { id } });

    return success(res, null, 'تم حذف المريض نهائياً');
  } catch (err) {
    console.error(err);
    return error(res, 'حدث خطأ أثناء الحذف النهائي', 500);
  }
}

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  deletePatientPermanently,
};
