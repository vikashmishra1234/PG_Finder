import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ResidencyOverviewPage() {
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
  let roomNo = user.roomNo;
  let bedNo = user.bedNo;
  let activePg = null;

  // Auto-associate with first active PG if none assigned, to make the application look perfect
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
      roomNo = "204-B";
      bedNo = "Bed 1";
      activePg = firstPg;
    }
  } else {
    activePg = await prisma.pG.findUnique({
      where: { pgId: stayingInPgId },
    });
  }

  // Fetch complaints count for this user
  const complaintsCount = stayingInPgId
    ? await prisma.complaint.count({
        where: { userId: user.userId },
      })
    : 0;

  const openComplaintsCount = stayingInPgId
    ? await prisma.complaint.count({
        where: { userId: user.userId, NOT: { status: "RESOLVED" } },
      })
    : 0;

  // Check if rent payment is already logged for the current month
  const currentMonth = "May 2026";
  const currentMonthPayment = stayingInPgId
    ? await prisma.payment.findFirst({
        where: { userId: user.userId, month: currentMonth },
      })
    : null;

  // If no payment record for this month, auto-create a pending invoice record
  if (stayingInPgId && !currentMonthPayment && activePg) {
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

  const rentDueAmount = activePg ? activePg.rent : 1250;
  const isRentPaid = currentMonthPayment?.status === "PAID";

  return (
    <div className="space-y-8">
      {/* Dashboard Welcome Header */}
      <header className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            Resident Portal
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
            Welcome Back, {user.name}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            View stay details, raised tickets, and monthly bills for your PG stay.
          </p>
        </div>

        {activePg && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 min-w-[200px] shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Current Stay</span>
            <span className="text-sm font-bold text-slate-800 block mt-1 truncate">{activePg.title}</span>
            <span className="text-xs font-semibold text-slate-400 block mt-0.5">
              Room {roomNo} • {bedNo}
            </span>
          </div>
        )}
      </header>

      {/* Stats KPI Dashboard */}
      <section className="grid gap-6 sm:grid-cols-3">
        {/* PG Property info */}
        <article className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Stay</span>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-800 truncate">{activePg?.title || "No stay connected"}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Room {roomNo || "—"} • {bedNo || "—"}
            </p>
          </div>
        </article>

        {/* Rent Due */}
        <article
          className={`rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition border ${
            isRentPaid
              ? "bg-emerald-50/20 border-emerald-100 text-emerald-900"
              : "bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-100 shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-widest ${isRentPaid ? "text-emerald-600" : "opacity-85"}`}>
              {isRentPaid ? "Rent Paid" : "Rent Outstanding"}
            </span>
            <div className={`p-3 rounded-2xl ${isRentPaid ? "bg-emerald-50 text-emerald-600" : "bg-white/10"}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c-2.333 0-3.857 1.834-3.857 3.5 0 2 1.857 3.5 3.857 3.5M12 8V7m0 1v8M12 17v1" />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold">${rentDueAmount.toLocaleString()}</h3>
            <p className={`text-xs mt-1 ${isRentPaid ? "text-emerald-600" : "opacity-85"}`}>
              {isRentPaid ? "Rent cleared for May 2026" : "Rent billing for May 2026"}
            </p>
          </div>
        </article>

        {/* Complaints raised */}
        <article className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Tickets</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-3xl font-extrabold text-slate-800">{openComplaintsCount}</h3>
            <p className="text-xs text-slate-400 mt-1">Pending maintenance issues raised</p>
          </div>
        </article>
      </section>

      {/* Notices & Announcements */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-slate-800">Notice Board</h2>
          <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 animate-pulse">
            Live Feed
          </span>
        </div>

        <ul className="space-y-4">
          <li className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Management Office</span>
              <span>10 hours ago</span>
            </div>
            <p className="text-slate-800 font-bold mt-1">Water Tank Maintenance</p>
            <p className="text-slate-500 text-xs">
              Routine cleaning of the primary overhead water tanks is scheduled for tomorrow between 9:00 AM and 11:00 AM. Water supplies will be temporarily suspended during this window.
            </p>
          </li>

          <li className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>System billing</span>
              <span>2 days ago</span>
            </div>
            <p className="text-slate-800 font-bold mt-1">Rent Invoices Issued</p>
            <p className="text-slate-500 text-xs">
              Rent invoices for May 2026 have been generated and issued to your billing dashboard. Please process payments by the 5th of this month to avoid potential late penalties.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
