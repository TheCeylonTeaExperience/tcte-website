/* Seed script to insert initial users, locations, programs, sessions, and session types */
// Uses CommonJS to avoid ESM issues since package.json has no "type": "module"
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Static list of routes based on your application needs
const SYSTEM_ROUTES = [
  { route: "/dashboard", sectionName: "Dashboard" },
  { route: "/profile", sectionName: "Profile" },
  { route: "/location", sectionName: "Location" },
  { route: "/sessions", sectionName: "Sessions" },
  { route: "/programs", sectionName: "Programs" },
  { route: "/program-types", sectionName: "Program Types" },
  { route: "/discount-rules", sectionName: "Discount Rules" },
  { route: "/bookings", sectionName: "Bookings" },
  { route: "/customers", sectionName: "Customers" },
  { route: "/agents", sectionName: "Agents" },
  { route: "/commission-rules", sectionName: "Commission Rules" },
  { route: "/affiliate-earnings", sectionName: "Affiliate Earnings" }
];

async function main() {
  console.log("Starting seed process...");

  // 1. Seed Base Permissions (Routes)
  console.log("Seeding system permissions...");
  const dbPermissions = [];
  for (const r of SYSTEM_ROUTES) {
    const perm = await prisma.permission.upsert({
      where: { route: r.route },
      update: { sectionName: r.sectionName },
      create: { route: r.route, sectionName: r.sectionName },
    });
    dbPermissions.push(perm);
  }

  // 2. Seed Users and establish access control list
  const usersToSeed = [
    { email: "admin@example.com", name: "Admin User", password: "Password123!", isAdmin: true },
    { email: "leader@example.com", name: "Leader User", password: "Password123!", isAdmin: false },
    { email: "user@example.com", name: "Regular User", password: "Password123!", isAdmin: false },
  ];

  console.log("Seeding users and explicit direct permission items...");
  for (const u of usersToSeed) {
    const hashed = await bcrypt.hash(u.password, 10);

    // Create or update the core user info (using "password" key to match your schema precisely)
    const dbUser = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, password: hashed },
      create: { email: u.email, name: u.name, password: hashed },
    });

    // Clear existing permission connections for this user to prevent constraint clashes on sequential seed runs
    await prisma.userPermission.deleteMany({
      where: { userId: dbUser.id }
    });

    // Build unique permissions allocations
    const userPermissionsData = [];

    if (u.isAdmin) {
      // Admin gets total coverage across all system routes with full editing capability
      for (const perm of dbPermissions) {
        userPermissionsData.push({
          permissionId: perm.id,
          accessType: "READ_WRITE"
        });
      }
    } else {
      // Randomize permission selections for sample non-admin users
      for (const perm of dbPermissions) {
        if (Math.random() > 0.4) { // ~60% probability of getting route access
          userPermissionsData.push({
            permissionId: perm.id,
            accessType: Math.random() > 0.5 ? "READ_WRITE" : "READ_ONLY"
          });
        }
      }
    }

    // Connect permission sets using a nested update write
    if (userPermissionsData.length > 0) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          userPermissions: {
            create: userPermissionsData
          }
        }
      });
    }
  }

  // 3. Seed locations
  const locations = [
    { id: 1, name: "Kandy", address: null, createdAt: new Date("2025-12-03T06:16:21.956Z"), updatedAt: new Date("2025-12-03T06:16:21.956Z"), deletedAt: null },
    { id: 2, name: "Colombo", address: null, createdAt: new Date("2025-12-03T06:16:28.160Z"), updatedAt: new Date("2025-12-03T06:16:28.160Z"), deletedAt: null },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: loc,
      create: loc,
    });
  }

  // 4. Seed programs
  const programs = [
    { id: 1, title: "N1", description: null, startTime: new Date("1970-01-01T08:30:00.000Z"), endTime: new Date("1970-01-01T10:30:00.000Z"), locationId: 1, seats: 20, isActive: true, createdAt: new Date("2025-12-03T06:17:22.311Z"), updatedAt: new Date("2025-12-03T06:17:22.311Z"), deletedAt: null },
    { id: 2, title: "N2", description: null, startTime: new Date("1970-01-01T10:30:00.000Z"), endTime: new Date("1970-01-01T00:30:00.000Z"), locationId: 1, seats: 20, isActive: true, createdAt: new Date("2025-12-03T06:18:17.181Z"), updatedAt: new Date("2025-12-03T06:18:17.181Z"), deletedAt: null },
  ];

  for (const prog of programs) {
    await prisma.program.upsert({
      where: { id: prog.id },
      update: prog,
      create: prog,
    });
  }

  // 5. Seed sessions
  const sessions = [
    { id: 1, programId: 1, name: "Plucking", startTime: new Date("1970-01-01T08:30:00.000Z"), endTime: new Date("1970-01-01T09:30:00.000Z"), price: 100, createdAt: new Date("2025-12-03T06:23:04.167Z"), updatedAt: new Date("2025-12-03T06:23:04.167Z"), deletedAt: null },
    { id: 2, programId: 1, name: "Making", startTime: new Date("1970-01-01T09:30:00.000Z"), endTime: new Date("1970-01-01T10:00:00.000Z"), price: null, createdAt: new Date("2025-12-03T06:23:43.761Z"), updatedAt: new Date("2025-12-03T06:23:43.761Z"), deletedAt: null },
    { id: 3, programId: 1, name: "Tasting", startTime: new Date("1970-01-01T10:00:00.000Z"), endTime: new Date("1970-01-01T10:30:00.000Z"), price: null, createdAt: new Date("2025-12-03T06:25:35.809Z"), updatedAt: new Date("2025-12-03T06:25:35.809Z"), deletedAt: null },
    { id: 4, programId: 2, name: "Plucking", startTime: new Date("1970-01-01T08:30:00.000Z"), endTime: new Date("1970-01-01T09:30:00.000Z"), price: 100, createdAt: new Date("2025-12-03T06:23:04.167Z"), updatedAt: new Date("2025-12-03T06:23:04.167Z"), deletedAt: null },
    { id: 5, programId: 2, name: "Making", startTime: new Date("1970-01-01T09:30:00.000Z"), endTime: new Date("1970-01-01T10:00:00.000Z"), price: null, createdAt: new Date("2025-12-03T06:23:43.761Z"), updatedAt: new Date("2025-12-03T06:23:43.761Z"), deletedAt: null },
    { id: 6, programId: 2, name: "Tasting", startTime: new Date("1970-01-01T10:00:00.000Z"), endTime: new Date("1970-01-01T10:30:00.000Z"), price: null, createdAt: new Date("2025-12-03T06:25:35.809Z"), updatedAt: new Date("2025-12-03T06:25:35.809Z"), deletedAt: null },
  ];

  for (const sess of sessions) {
    await prisma.session.upsert({
      where: { id: sess.id },
      update: sess,
      create: sess,
    });
  }

  // 6. Seed session types
  const sessionTypes = [
    { id: 1, sessionId: 2, name: "Black tea", price: 50, createdAt: new Date("2025-12-03T06:31:03.497Z"), updatedAt: new Date("2025-12-03T06:31:03.497Z"), deletedAt: null },
    { id: 2, sessionId: 2, name: "Normal tea", price: 50, createdAt: new Date("2025-12-03T06:31:27.298Z"), updatedAt: new Date("2025-12-03T06:31:27.298Z"), deletedAt: null },
    { id: 3, sessionId: 3, name: "Low", price: 10, createdAt: new Date("2025-12-03T06:31:46.071Z"), updatedAt: new Date("2025-12-03T06:31:46.071Z"), deletedAt: null },
    { id: 4, sessionId: 3, name: "Medeum", price: 20, createdAt: new Date("2025-12-03T06:32:03.278Z"), updatedAt: new Date("2025-12-03T06:32:03.278Z"), deletedAt: null },
    { id: 5, sessionId: 3, name: "High", price: 50, createdAt: new Date("2025-12-03T06:32:14.615Z"), updatedAt: new Date("2025-12-03T06:32:14.615Z"), deletedAt: null },
  ];

  for (const st of sessionTypes) {
    await prisma.sessionType.upsert({
      where: { id: st.id },
      update: st,
      create: st,
    });
  }

  console.log("Seeded all schema entities successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding operational exception encountered:", e);
    await prisma.$disconnect();
    process.exit(1);
  });