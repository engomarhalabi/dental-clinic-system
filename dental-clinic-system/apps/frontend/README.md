# واجهة نظام إدارة عيادة الأسنان — المرحلة 2

واجهة React (Vite) تغطي: تسجيل الدخول، لوحة تحكم بسيطة، قائمة المرضى مع بحث
وترقيم صفحات، وصفحة إضافة/تعديل مريض. تدعم العربية (RTL) والإنجليزية (LTR)
من زر تبديل في الأعلى.

## التشغيل محلياً

```bash
npm install
cp .env.example .env     # ثم عدّل VITE_API_URL إذا لزم
npm run dev
```

الواجهة تعمل افتراضياً على `http://localhost:5173`، وتتوقع أن الـ backend
(من المرحلة 1) يعمل على `http://localhost:4000` — يوجد أيضاً proxy جاهز في
`vite.config.js` لمسار `/api`.

## نقاط الـ API المتوقعة من الـ backend

الواجهة مبنية على العقود التالية استناداً إلى ما تم بناؤه في المرحلة 1
(JWT auth + أدوار admin/dentist/receptionist/accountant). عدّل `src/services/api.js`
إذا كانت أسماء المسارات الفعلية مختلفة:

| الفعل | المسار | الوصف |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | يرجع المستخدم الحالي بناءً على التوكن |
| GET | `/patients?search=&page=&pageSize=&sort=` | `{ items: [...], total }` |
| GET | `/patients/:id` | بيانات مريض واحد |
| POST | `/patients` | إنشاء مريض |
| PUT | `/patients/:id` | تعديل مريض |
| DELETE | `/patients/:id` | حذف مريض |
| GET | `/dashboard/stats` | `{ totalPatients, todayAppointments, openInvoices, activeChairs }` |

حقول المريض المتوقعة: `fullName, phone, dob, gender, address, medicalNotes,
lastVisit, createdAt`.

## البنية

```
src/
  contexts/AuthContext.jsx       # حالة تسجيل الدخول + تخزين التوكن
  contexts/LanguageContext.jsx   # التبديل بين عربي/إنجليزي + اتجاه الصفحة
  services/api.js                # عميل axios + اعتراض 401
  components/Layout.jsx          # الشريط الجانبي + الشريط العلوي
  components/ProtectedRoute.jsx  # حماية المسارات من غير المسجلين
  pages/Login.jsx
  pages/Dashboard.jsx
  pages/PatientsList.jsx
  pages/PatientForm.jsx
  i18n/translations.js
  styles/index.css               # كل التصميم (متغيرات CSS بدل مكتبة خارجية)
```

## ملاحظات

- التوكن يُحفظ في `localStorage` تحت المفتاح `clinic_token`.
- عند أي رد `401` من الـ API يتم تسجيل الخروج تلقائياً وإعادة التوجيه لصفحة الدخول.
- التصميم لا يعتمد على Tailwind أو أي مكتبة UI خارجية — كل شيء في `index.css`
  عبر متغيرات CSS، حتى لا يحتاج المشروع أي إعداد بناء إضافي.
- الخطوة التالية المقترحة (المرحلة 3): صفحة المواعيد وصفحة ملف المريض التفصيلية
  (المخطط السني التفاعلي + الفواتير).
