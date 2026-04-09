import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
