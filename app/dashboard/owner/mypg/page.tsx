import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PgManagerClient from "./PgManagerClient";
import { PublicPg } from "@/global";

export default async function MyPgPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all PGs owned by this user
  const dbPgs = await prisma.pG.findMany({
    where: {
      userId: user.userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map to PublicPg type
  const pgs: PublicPg[] = dbPgs.map((pg) => ({
    pgId: pg.pgId,
    title: pg.title,
    description: pg.description,
    address: pg.address,
    city: pg.city,
    state: pg.state,
    pincode: pg.pincode,
    roomsCount: pg.roomsCount,
    availableBeds: pg.availableBeds,
    genderType: pg.genderType as "MALE" | "FEMALE" | "UNISEX",
    roomType: pg.roomType as "SINGLE" | "DOUBLE" | "TRIPLE" | "DORMITORY",
    rent: pg.rent,
    securityFee: pg.securityFee,
    maintenanceFee: pg.maintenanceFee,
    foodAvailable: pg.foodAvailable,
    wifiAvailable: pg.wifiAvailable,
    parkingAvailable: pg.parkingAvailable,
    laundryAvailable: pg.laundryAvailable,
    acAvailable: pg.acAvailable,
    ownerName: pg.ownerName,
    ownerPhone: pg.ownerPhone,
    ownerEmail: pg.ownerEmail,
    images: pg.images,
    isAvailable: pg.isAvailable,
    isVerified: pg.isVerified,
    createdAt: pg.createdAt,
    updatedAt: pg.updatedAt,
  }));

  return (
    <PgManagerClient
      initialPgs={pgs}
      userId={user.userId}
      ownerName={user.name}
      ownerPhone={"+1 (555) 890-4321"}
      ownerEmail={user.email}
    />
  );
}
