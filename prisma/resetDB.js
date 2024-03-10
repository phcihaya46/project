const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database project')
  await prisma.$executeRawUnsafe('CREATE Database project')
}
console.log('Reset DB')
run()