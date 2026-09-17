# نظام إدارة عيادة الأسنان (Dental Clinic Management System)

نظام ويب متكامل لإدارة عيادة أسنان (إدارياً وطبياً)، يدعم تعدد كراسي/وحدات العلاج، مخطط سني تفاعلي، رسائل واتساب تلقائية، وفوترة مبنية على خطط العلاج.

## البنية التقنية

- **Frontend:** React + Vite + react-i18next (عربي/إنجليزي، RTL/LTR)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Integrations:** Twilio WhatsApp Business API

## هيكلة المشروع

```
apps/
├── backend/    # Express API + Prisma
└── frontend/   # React app
```

## البدء السريع

### 1. تثبيت الاعتماديات
```bash
npm install
```

### 2. إعداد قاعدة البيانات
انسخ `apps/backend/.env.example` إلى `apps/backend/.env` وعدّل `DATABASE_URL`.

```bash
npm run prisma:migrate
```

### 3. تشغيل السيرفرات محلياً
```bash
npm run dev:backend    # http://localhost:4000
npm run dev:frontend   # http://localhost:5173
```

## حالة المشروع

- [x] المرحلة 0: التأسيس والتخطيط (النطاق، الأدوار، ERD، البنية التقنية)
- [ ] المرحلة 1: Backend أساسي (Auth + أول موديول)
- [ ] المرحلة 2: Frontend أساسي
- [ ] المرحلة 3: المخطط السني التفاعلي
- [ ] المرحلة 4: تكامل واتساب
