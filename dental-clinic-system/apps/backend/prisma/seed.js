require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@clinic.com';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('⚠️  يوجد حساب أدمن مسبقاً:', adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: {
      fullName: 'مدير النظام',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // إنشاء كرسي أساسي واحد ليبدأ به العمل
  await prisma.chair.create({
    data: { name: 'كرسي 1' },
  });

  console.log('✅ تم إنشاء حساب الأدمن الأول:');
  console.log('   الإيميل:', admin.email);
  console.log('   كلمة المرور: Admin@123');
  console.log('   ⚠️  يرجى تغييرها فوراً بعد أول تسجيل دخول');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
