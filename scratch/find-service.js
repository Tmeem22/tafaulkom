const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_nJd9tF0iPrgM@ep-fancy-sunset-a2123984.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function findService() {
  const service = await prisma.service.findFirst({
    where: { active: true }
  });
  console.log("Found Service:", JSON.stringify(service));
  process.exit(0);
}

findService().catch(e => {
  console.error(e);
  process.exit(1);
});
