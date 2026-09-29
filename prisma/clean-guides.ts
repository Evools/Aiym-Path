import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanGuides() {
  console.log("Removing deleted guides from Neon DB...");
  const deleted = await prisma.guide.deleteMany({
    where: {
      OR: [
        { id: "guide-urmat" },
        { id: "guide-bektur" },
        { id: "guide-ruslan" },
        { name: { contains: "Урмат" } },
        { name: { contains: "Бектур" } },
        { name: { contains: "Руслан" } },
        { image: { contains: "guide-1" } },
      ],
    },
  });
  console.log(`Deleted ${deleted.count} guides from database.`);

  const remaining = await prisma.guide.findMany({
    select: { id: true, name: true, image: true },
  });
  console.log("Remaining guides in DB:", remaining);
}

cleanGuides()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
