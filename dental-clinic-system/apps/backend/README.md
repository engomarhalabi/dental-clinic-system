# Backend - نظام إدارة عيادة الأسنان

## المرحلة 1: البنية التحتية الأساسية ✅

### ما تم إنجازه في هذه المرحلة
- إعداد مشروع Node.js/Express
- سكيمة PostgreSQL كاملة عبر Prisma: `users`, `chairs`, `patients`, `appointments`, `visits`, `tooth_records`, `tooth_history`, `invoices`
- نظام مصادقة JWT بأدوار: `ADMIN` (مدير) / `DENTIST` (طبيب) / `RECEPTIONIST` (استقبال) / `ACCOUNTANT` (محاسب)
- API كامل لإدارة المرضى: إضافة، عرض (مع بحث وترقيم صفحات)، تفاصيل، تعديل، حذف (ناعم ونهائي)

## خطوات التشغيل

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد متغيرات البيئة
انسخ `.env.example` إلى `.env` وضع رابط قاعدة بيانات Neon (أو أي PostgreSQL):
```bash
cp .env.example .env
```
عدّل `DATABASE_URL` و `JWT_SECRET` بقيمك الفعلية.

### 3. تشغيل الهجرة (Migration) لإنشاء الجداول في قاعدة البيانات
```bash
npx prisma migrate dev --name init
```
هذا الأمر ينشئ كل الجداول فعلياً في قاعدة البيانات، ويولّد Prisma Client تلقائياً.

### 4. إنشاء أول حساب أدمن (Seed)
```bash
npm run seed
```
سينشئ حساب:
- الإيميل: `admin@clinic.com`
- كلمة المرور: `Admin@123`
⚠️ غيّرها فوراً في بيئة الإنتاج.

### 5. تشغيل السيرفر
```bash
npm run dev
```
السيرفر سيعمل على: `http://localhost:5000`

## اختبار سريع (Health Check)
```bash
curl http://localhost:5000/api/health
```

## نقاط الوصول (API Endpoints)

### المصادقة `/api/auth`
| Method | Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| POST | `/api/auth/login` | تسجيل الدخول | عام |
| POST | `/api/auth/users` | إنشاء مستخدم جديد | ADMIN فقط |
| GET | `/api/auth/me` | بيانات المستخدم الحالي | مسجل دخول |

### المرضى `/api/patients` (يتطلب توكن في الهيدر: `Authorization: Bearer <token>`)
| Method | Endpoint | الوصف | الصلاحية |
|---|---|---|---|
| POST | `/api/patients` | إضافة مريض | ADMIN, DENTIST, RECEPTIONIST |
| GET | `/api/patients?search=&page=&limit=` | قائمة المرضى + بحث | الجميع |
| GET | `/api/patients/:id` | تفاصيل مريض | الجميع |
| PUT | `/api/patients/:id` | تعديل مريض | ADMIN, DENTIST, RECEPTIONIST |
| DELETE | `/api/patients/:id` | حذف ناعم (تعطيل) | ADMIN, RECEPTIONIST |
| DELETE | `/api/patients/:id/permanent` | حذف نهائي | ADMIN فقط |

## مثال: تسجيل دخول ثم إضافة مريض
```bash
# 1. تسجيل الدخول والحصول على التوكن
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"Admin@123"}'

# 2. استخدام التوكن لإضافة مريض
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <التوكن_هنا>" \
  -d '{"fullName":"أحمد محمد","phone":"0599123456"}'
```

## ملاحظات مهمة
- الحذف الافتراضي للمريض **ناعم** (isActive = false) للحفاظ على السجل الطبي والفواتير المرتبطة به.
- حقل `whatsapp` في المريض منفصل عن `phone` تحضيراً لميزة رسائل واتساب التلقائية القادمة.
- ترقيم الأسنان يعتمد نظام FDI كما طُلب (سيُستخدم في مرحلة قادمة عند بناء API المخطط السني).
- الفوترة مرتبطة بنوع العلاج (`treatmentType`) وليس بعدد الزيارات، كما تم الاتفاق.

## المرحلة القادمة
API المواعيد (Appointments) والزيارات (Visits) والمخطط السني التفاعلي.
