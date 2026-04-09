const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_nJd9tF0iPrgM@ep-fancy-sunset-a2123984.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function main() {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      apiKey: true,
      role: true
    }
  })
  console.log("Users and their API Keys:")
  console.table(users)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
