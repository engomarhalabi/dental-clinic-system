require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // التأكد من الاتصال بقاعدة البيانات قبل تشغيل السيرفر
    await prisma.$connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    app.listen(PORT, () => {
      console.log(`🚀 السيرفر يعمل على المنفذ ${PORT}`);
      console.log(`   http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', err);
    process.exit(1);
  }
}

startServer();

// إغلاق نظيف عند إيقاف السيرفر
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
