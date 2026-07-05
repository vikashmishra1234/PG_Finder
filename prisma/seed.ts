import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  const ownerPass = await bcrypt.hash("Owner@123", 10);
  const residentPass = await bcrypt.hash("Resident@123", 10);

  // 1. Create Roles
  const ownerRole = await prisma.role.upsert({
    where: { name: "Owner" },
    update: {},
    create: {
      name: "Owner",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: {
      name: "User",
    },
  });

  // Also seed uppercase USER for safety/compatibility
  await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
    },
  });

  // 2. Create Owner User
  const owner = await prisma.user.upsert({
    where: { email: "owner@gmail.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "owner@gmail.com",
      password: ownerPass,
      roles: {
        connect: [{ roleId: ownerRole.roleId }],
      },
    },
  });

  // 3. Create Resident User
  const resident = await prisma.user.upsert({
    where: { email: "resident@gmail.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "resident@gmail.com",
      password: residentPass,
      roles: {
        connect: [{ roleId: userRole.roleId }],
      },
    },
  });

  // 4. Create Sample PGs
  const pg1 = await prisma.pG.create({
    data: {
      title: "StayEase Premium Unisex PG",
      description: "A luxury PG with modern amenities, single and sharing options, and home-cooked meals.",
      address: "102, Sector 5, HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
      roomsCount: 15,
      availableBeds: 8,
      genderType: "UNISEX",
      roomType: "DOUBLE",
      rent: 12000,
      securityFee: 15000,
      maintenanceFee: 1500,
      foodAvailable: true,
      wifiAvailable: true,
      parkingAvailable: true,
      laundryAvailable: true,
      acAvailable: true,
      ownerName: "John Doe",
      ownerPhone: "+91 9876543210",
      ownerEmail: "owner@gmail.com",
      userId: owner.userId,
      images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    },
  });

  const pg2 = await prisma.pG.create({
    data: {
      title: "Elite Boys PG & Hostel",
      description: "Excellent location, safe environment for students and professionals. Walkable distance from main road.",
      address: "45, Phase 2, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      roomsCount: 10,
      availableBeds: 5,
      genderType: "MALE",
      roomType: "SINGLE",
      rent: 15000,
      securityFee: 20000,
      maintenanceFee: 1000,
      foodAvailable: true,
      wifiAvailable: true,
      parkingAvailable: true,
      laundryAvailable: false,
      acAvailable: true,
      ownerName: "John Doe",
      ownerPhone: "+91 9876543210",
      ownerEmail: "owner@gmail.com",
      userId: owner.userId,
      images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"],
    },
  });

  // 5. Connect Resident to PG 1
  await prisma.user.update({
    where: { userId: resident.userId },
    data: {
      stayingInPgId: pg1.pgId,
      roomNo: "104-B",
      bedNo: "Bed 2",
    },
  });

  // 6. Create a Sample Complaint
  await prisma.complaint.create({
    data: {
      title: "WiFi speed is extremely slow",
      description: "The wifi connection keeps dropping in room 104-B, and speed is less than 5 Mbps since yesterday.",
      category: "WiFi",
      priority: "MEDIUM",
      status: "PENDING",
      userId: resident.userId,
      pgId: pg1.pgId,
    },
  });

  // 7. Create a Sample Payment
  await prisma.payment.create({
    data: {
      amount: pg1.rent,
      month: "April 2026",
      status: "PAID",
      transactionId: "TXN882736",
      paymentMethod: "UPI",
      userId: resident.userId,
      pgId: pg1.pgId,
    },
  });

  // Pending payment for May 2026
  await prisma.payment.create({
    data: {
      amount: pg1.rent,
      month: "May 2026",
      status: "PENDING",
      userId: resident.userId,
      pgId: pg1.pgId,
    },
  });

  console.log("✅ Seed completed with default Owner, Resident, PGs, Complaints, and Payments!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });