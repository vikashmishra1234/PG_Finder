import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OwnerOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch all PGs owned by this user
  const pgs = await prisma.pG.findMany({
    where: { userId: user.userId, isDeleted: false },
  });

  const pgIds = pgs.map((p) => p.pgId);

  // Fetch count of pending/in-progress complaints
  const activeComplaintsCount = pgIds.length
    ? await prisma.complaint.count({
        where: { pgId: { in: pgIds }, NOT: { status: "RESOLVED" } },
      })
    : 0;

  // Fetch sum of all paid transactions
  const totalRevenueData = pgIds.length
    ? await prisma.payment.aggregate({
        where: { pgId: { in: pgIds }, status: "PAID" },
        _sum: { amount: true },
      })
    : { _sum: { amount: null } };
  const totalRevenue = totalRevenueData._sum.amount || 0;

  // Fetch recent complaints (limit 5)
  const recentComplaints = pgIds.length
    ? await prisma.complaint.findMany({
        where: { pgId: { in: pgIds } },
        include: {
          user: { select: { name: true } },
          pg: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  // Fetch recent payments (limit 5)
  const recentPayments = pgIds.length
    ? await prisma.payment.findMany({
        where: { pgId: { in: pgIds } },
        include: {
          user: { select: { name: true } },
          pg: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  const totalBedsCount = pgs.reduce((acc, p) => acc + p.roomsCount * 2, 0); // Assuming 2 beds per room average
  const availableBedsCount = pgs.reduce((acc, p) => acc + p.availableBeds, 0);
  const occupancyPercentage = totalBedsCount
    ? Math.round(((totalBedsCount - availableBedsCount) / totalBedsCount) * 100)
    : 0;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            Real-Time Analytics
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-3 md:text-4xl">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Here is a summary of your properties, occupancy rates, and pending actions.
          </p>
        </div>

        <Link
          href="/dashboard/owner/mypg"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-md shadow-indigo-150 transition duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          List New PG
        </Link>
      </header>

      {/* KPI Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <article className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total PGs</span>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">{pgs.length}</h3>
            <p className="text-sm text-slate-400 mt-1">Active properties listed</p>
          </div>
        </article>

        {/* KPI 2 */}
        <article className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">{occupancyPercentage}%</h3>
            <p className="text-sm text-slate-400 mt-1">{availableBedsCount} beds available</p>
          </div>
        </article>

        {/* KPI 3 */}
        <article className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Complaints</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold text-slate-800">{activeComplaintsCount}</h3>
            <p className="text-sm text-slate-400 mt-1">Pending maintenance issues</p>
          </div>
        </article>

        {/* KPI 4 */}
        <article className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-150 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider opacity-85">Total Earnings</span>
            <div className="p-3 bg-white/10 rounded-2xl text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c-2.333 0-3.857 1.834-3.857 3.5 0 2 1.857 3.5 3.857 3.5M12 8V7m0 1v8M12 17v1" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-extrabold">${totalRevenue.toLocaleString()}</h3>
            <p className="text-sm opacity-85 mt-1">Received rent all-time</p>
          </div>
        </article>
      </section>

      {/* Main Grid: Activity Tables */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Recent Complaints */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Complaints</h2>
            <Link
              href="/dashboard/owner/complaints"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase hover:underline"
            >
              View All
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
              <svg className="w-12 h-12 stroke-current mb-3 opacity-60" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">All clear! No complaints reported.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((c) => (
                <div
                  key={c.complaintId}
                  className="flex items-start justify-between p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl transition duration-150"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{c.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      By {c.user.name} • {c.pg.title}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      c.status === "PENDING"
                        ? "bg-rose-50 text-rose-600"
                        : c.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Rent Payments */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <Link
              href="/dashboard/owner/payments"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase hover:underline"
            >
              View All
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
              <svg className="w-12 h-12 stroke-current mb-3 opacity-60" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c-2.333 0-3.857 1.834-3.857 3.5 0 2 1.857 3.5 3.857 3.5M12 8V7m0 1v8M12 17v1" />
              </svg>
              <p className="text-sm font-medium">No rent transactions logged yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPayments.map((p) => (
                <div
                  key={p.paymentId}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl transition duration-150"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">${p.amount.toLocaleString()}</h4>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      Rent for {p.month} • {p.user.name}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      p.status === "PAID"
                        ? "bg-emerald-50 text-emerald-600"
                        : p.status === "PENDING"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}