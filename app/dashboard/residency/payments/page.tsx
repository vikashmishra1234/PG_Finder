import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function TenantPaymentsPage() {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { userId: userPayload.userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  let stayingInPgId = user.stayingInPgId;

  if (!stayingInPgId) {
    const firstPg = await prisma.pG.findFirst({
      where: { isActive: true, isDeleted: false },
    });

    if (firstPg) {
      await prisma.user.update({
        where: { userId: user.userId },
        data: {
          stayingInPgId: firstPg.pgId,
          roomNo: "204-B",
          bedNo: "Bed 1",
        },
      });
      stayingInPgId = firstPg.pgId;
    }
  }

  if (!stayingInPgId) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">No Stay Associated</h3>
        <p className="text-slate-400 mt-2">
          Your account is not connected to a PG stay. Please contact management to register your stay.
        </p>
      </div>
    );
  }

  const activePg = await prisma.pG.findUnique({
    where: { pgId: stayingInPgId },
  });

  // Ensure current month payment invoice exists
  const currentMonth = "May 2026";
  const currentMonthPayment = await prisma.payment.findFirst({
    where: { userId: user.userId, month: currentMonth },
  });

  if (!currentMonthPayment && activePg) {
    await prisma.payment.create({
      data: {
        amount: activePg.rent,
        month: currentMonth,
        status: "PENDING",
        userId: user.userId,
        pgId: stayingInPgId,
      },
    });
  }

  // Fetch all payment statements billed to this tenant user
  const dbPayments = await prisma.payment.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      pg: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
    pg: {
      title: p.pg.title,
    },
  }));

  return <PaymentsClient initialPayments={payments} />;
}
