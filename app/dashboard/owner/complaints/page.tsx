import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ComplaintsManagerClient from "./ComplaintsManagerClient";

export default async function OwnerComplaintsPage() {
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

  // Fetch all complaints associated with these PGs
  const dbComplaints = pgIds.length
    ? await prisma.complaint.findMany({
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
    user: {
      name: c.user.name,
      email: c.user.email,
    },
    pg: {
      title: c.pg.title,
    },
  }));

  return <ComplaintsManagerClient initialComplaints={complaints} />;
}