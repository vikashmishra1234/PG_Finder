import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PaymentsManagerClient from "./PaymentsManagerClient";

export default async function OwnerPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all PGs owned by this user
  const pgs = await prisma.pG.findMany({
    where: {
      userId: user.userId,
      isDeleted: false,
    },
    select: {
      pgId: true,
    },
  });

  const pgIds = pgs.map((p) => p.pgId);

  // Fetch all payments associated with these PGs
  const dbPayments = pgIds.length
    ? await prisma.payment.findMany({
        where: {
          pgId: {
            in: pgIds,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          pg: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  // Map to matching schema types
  const payments = dbPayments.map((p) => ({
    paymentId: p.paymentId,
    userId: p.userId,
    pgId: p.pgId,
    amount: p.amount,
    month: p.month,
    status: p.status,
    transactionId: p.transactionId,
    paymentMethod: p.paymentMethod,
    createdAt: p.createdAt,
    user: {
      name: p.user.name,
      email: p.user.email,
    },
    pg: {
      title: p.pg.title,
    },
  }));

  return <PaymentsManagerClient initialPayments={payments} />;
}