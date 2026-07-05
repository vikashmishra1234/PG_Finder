import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ComplaintsClient from "./ComplaintsClient";

export default async function TenantComplaintsPage() {
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

  // Fetch all complaints raised by this tenant user
  const dbComplaints = await prisma.complaint.findMany({
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

  const complaints = dbComplaints.map((c) => ({
    complaintId: c.complaintId,
    userId: c.userId,
    pgId: c.pgId,
    title: c.title,
    description: c.description,
    category: c.category,
    priority: c.priority,
    status: c.status,
    createdAt: c.createdAt,
    pg: {
      title: c.pg.title,
    },
  }));

  return (
    <ComplaintsClient
      initialComplaints={complaints}
      userId={user.userId}
      pgId={stayingInPgId}
    />
  );
}
