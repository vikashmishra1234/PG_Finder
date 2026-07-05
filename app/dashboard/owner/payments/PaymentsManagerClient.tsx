"use client";

import React, { useState } from "react";
import { updatePaymentStatusAction } from "@/server/actions/payment.action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface PaymentItem {
  paymentId: string;
  userId: string;
  pgId: string;
  amount: number;
  month: string;
  status: string;
  transactionId: string | null;
  paymentMethod: string | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  pg: {
    title: string;
  };
}

export default function PaymentsManagerClient({
  initialPayments,
}: {
  initialPayments: PaymentItem[];
}) {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [filterMonth, setFilterMonth] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleMarkPaid = async (paymentId: string) => {
    setUpdatingId(paymentId);
    const mockTxId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    const res = await updatePaymentStatusAction(paymentId, "PAID", mockTxId, "CASH_OR_DIRECT");
    setUpdatingId(null);

    if (res.success && res.data) {
      toast.success("Rent payment cleared successfully!");
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === paymentId
            ? { ...p, status: "PAID", transactionId: mockTxId, paymentMethod: "CASH_OR_DIRECT" }
            : p
        )
      );
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update payment status");
    }
  };

  // Get unique months list for filtering
  const months = ["ALL", ...Array.from(new Set(payments.map((p) => p.month)))];

  const filteredPayments = payments.filter((p) => {
    if (filterMonth === "ALL") return true;
    return p.month === filterMonth;
  });

  // Calculate earnings stats
  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter((p) => p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          Finance Manager
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Rent Transactions</h1>
        <p className="text-slate-500 mt-1">Monitor tenant payments, review income, and record incoming rent collections.</p>
      </div>

      {/* Analytics Summary */}
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Received</span>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">${totalPaid.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">Cleared rent deposits</p>
        </div>
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pending</span>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-2">${totalPending.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">Awaiting tenant transfers</p>
        </div>
        <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Overdue</span>
          <h3 className="text-3xl font-extrabold text-rose-600 mt-2">${totalOverdue.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">Unpaid past-due bills</p>
        </div>
      </section>

      {/* Month Filter selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Month:</label>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table Ledger */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="py-4.5 px-6">Resident Details</th>
                <th className="py-4.5 px-6">PG Property</th>
                <th className="py-4.5 px-6">Billing Month</th>
                <th className="py-4.5 px-6">Amount</th>
                <th className="py-4.5 px-6">Method / Txn ID</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions recorded for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50/50 transition">
                    <td className="py-4.5 px-6">
                      <div className="font-bold text-slate-800">{p.user.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.user.email}</div>
                    </td>
                    <td className="py-4.5 px-6 text-slate-600">{p.pg.title}</td>
                    <td className="py-4.5 px-6 text-slate-500 font-bold">{p.month}</td>
                    <td className="py-4.5 px-6 font-bold text-slate-900">${p.amount.toLocaleString()}</td>
                    <td className="py-4.5 px-6">
                      {p.status === "PAID" ? (
                        <>
                          <span className="text-xs font-bold text-slate-600 block">
                            {p.paymentMethod?.replace("_", " ") || "Direct Transfer"}
                          </span>
                          <code className="text-[10px] font-bold text-indigo-600 mt-0.5 block tracking-wide">
                            {p.transactionId}
                          </code>
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      {p.status !== "PAID" ? (
                        <button
                          disabled={updatingId === p.paymentId}
                          onClick={() => handleMarkPaid(p.paymentId)}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Clear Payment
                        </button>
                      ) : (
                        <div className="text-emerald-600 inline-flex items-center gap-1 text-xs font-bold py-2 px-3">
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Paid
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
