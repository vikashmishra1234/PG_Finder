import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function TenantPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const stayingInPgId = user.stayingInPgId;

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
