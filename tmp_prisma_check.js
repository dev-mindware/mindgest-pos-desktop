const { PrismaClient } = require('@prisma/client');
process.env.DATABASE_URL = 'file:dev.db';
const prisma = new PrismaClient();
(async () => {
  try {
    const rows = await prisma.$queryRawUnsafe('PRAGMA table_info("SyncOutbox")');
    console.log('rows type', Array.isArray(rows), rows.length);
    console.log(require('util').inspect(rows[0], { depth: 3 }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
