import bcrypt from "bcryptjs";
import {prisma} from '@/lib/prisma'


async function main() {

  const adminPass = await bcrypt.hash("Admin@123", 10);
  const userPass = await bcrypt.hash("User@123", 10);

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "Owner" },
    update: {},
    create: {
      name: "Owner",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
    },
  });

  // // Admin user
  // await prisma.user.upsert({
  //   where: {
  //     email: "admin@gmail.com",
  //   },
  //   update: {},
  //   create: {
  //     name: "Admin",
  //     email: "admin@gmail.com",
  //     password: adminPass,

  //     roles: {
  //       connect: [
  //         { roleId: adminRole.roleId },
  //         { roleId: userRole.roleId },
  //       ],
  //     },
  //   },
  // });

  // // Normal user
  // await prisma.user.upsert({
  //   where: {
  //     email: "user@gmail.com",
  //   },
  //   update: {},
  //   create: {
  //     name: "User",
  //     email: "user@gmail.com",
  //     password: userPass,

  //     roles: {
  //       connect: [
  //         { roleId: userRole.roleId },
  //       ],
  //     },
  //   },
  // });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });