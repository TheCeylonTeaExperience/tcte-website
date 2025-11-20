/* Seed script to insert initial users */
// Uses CommonJS to avoid ESM issues since package.json has no "type": "module"
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: "admin@example.com", name: "Admin User", role: "admin", password: "Password123!" },
    { email: "leader@example.com", name: "Leader User", role: "user", password: "Password123!" },
    { email: "user@example.com", name: "Regular User", role: "user", password: "Password123!" },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, password: hashed },
      create: { email: u.email, name: u.name, role: u.role, password: hashed },
    });
  }
}

main()
  .then(async () => {
    console.log("Seeded users successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
