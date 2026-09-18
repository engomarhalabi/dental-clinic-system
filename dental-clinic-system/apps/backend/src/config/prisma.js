const { PrismaClient } = require('@prisma/client');

// إنشاء نسخة واحدة (singleton) من Prisma Client تُستخدم في كل المشروع
// هذا يمنع فتح اتصالات متعددة بقاعدة البيانات أثناء التطوير (hot-reload)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
