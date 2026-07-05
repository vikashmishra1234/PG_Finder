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
  pg: {
    title: string;
  };
}

export default function PaymentsClient({
  initialPayments,
}: {
  initialPayments: PaymentItem[];
}) {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<PaymentItem | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [details, setDetails] = useState("");

  const handlePayClick = (payment: PaymentItem) => {
    setActivePayment(payment);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayment) return;

    setIsPaying(true);
    const mockTxId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;

    const res = await updatePaymentStatusAction(
      activePayment.paymentId,
      "PAID",
      mockTxId,
      paymentMethod
    );
    setIsPaying(false);

    if (res.success && res.data) {
      toast.success("Rent payment processed successfully!");
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === activePayment.paymentId
            ? { ...p, status: "PAID", transactionId: mockTxId, paymentMethod: paymentMethod }
            : p
        )
      );
      setIsModalOpen(false);
      setActivePayment(null);
      setDetails("");
      router.refresh();
    } else {
      toast.error(res.message || "Failed to process payment");
    }
  };

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

  const pendingPayments = payments.filter((p) => p.status !== "PAID");

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          Billing Center
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Rent Ledger</h1>
        <p className="text-slate-500 mt-1">Review invoices, verify receipts, and pay your monthly PG rent safely.</p>
      </div>

      {/* Outstanding Dues Panel */}
      {pendingPayments.length > 0 && (
        <section className="bg-indigo-55 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 md:p-8 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-85">Payment Outstanding</span>
            <h2 className="text-2xl font-extrabold">Outstanding Rent Billing</h2>
            <p className="text-xs opacity-85 max-w-md">
              You have outstanding rent bills awaiting payment. Pay directly to avoid late fees.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/10 p-5 rounded-2xl">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-85">Total Dues</span>
              <h3 className="text-3xl font-extrabold mt-1">
                ${pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </h3>
            </div>
            <button
              onClick={() => handlePayClick(pendingPayments[0])}
              className="bg-white hover:bg-slate-50 text-indigo-600 font-extrabold text-sm py-3 px-6 rounded-xl transition cursor-pointer"
            >
              Pay Now
            </button>
          </div>
        </section>
      )}

      {/* Transactions Table Ledger */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Billing History</h2>
          <span className="text-xs font-bold text-slate-400">{payments.length} Statements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="py-4.5 px-6">Billing Month</th>
                <th className="py-4.5 px-6">PG Property</th>
                <th className="py-4.5 px-6">Amount</th>
                <th className="py-4.5 px-6">Receipt / Txn ID</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No statements or bills logged for this account.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50/50 transition">
                    <td className="py-4.5 px-6 text-slate-850 font-bold">{p.month}</td>
                    <td className="py-4.5 px-6 text-slate-500">{p.pg.title}</td>
                    <td className="py-4.5 px-6 font-bold text-slate-900">${p.amount.toLocaleString()}</td>
                    <td className="py-4.5 px-6">
                      {p.status === "PAID" ? (
                        <>
                          <span className="text-xs font-bold text-slate-600 block">
                            Paid via {p.paymentMethod?.replace("_", " ") || "UPI"}
                          </span>
                          <code className="text-[10px] font-bold text-indigo-600 mt-0.5 block tracking-wide">
                            {p.transactionId}
                          </code>
                        </>
                      ) : (
                        <span className="text-slate-350">—</span>
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
                          onClick={() => handlePayClick(p)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition cursor-pointer"
                        >
                          Process Bill
                        </button>
                      ) : (
                        <div className="text-emerald-600 inline-flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 select-none">
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Receipt Confirmed
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

      {/* Checkout Mockup Modal */}
      {isModalOpen && activePayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Secure Rent Checkout</h3>
                <p className="text-xs text-slate-500 mt-1">Payment statement for {activePayment.month}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
              {/* Receipt Summary */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>PG Staying location</span>
                  <span className="text-slate-800 font-extrabold">{activePayment.pg.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Statement Month</span>
                  <span className="text-slate-850 font-extrabold">{activePayment.month}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold">
                  <span className="text-slate-850">Total Rent Due</span>
                  <span className="text-indigo-600 text-base font-extrabold">${activePayment.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Method choice */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-600 uppercase">Payment Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === "UPI" ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="method"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-700">UPI / QR Code</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3.5 border rounded-xl cursor-pointer transition ${
                    paymentMethod === "CARD" ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200"
                  }`}>
                    <input
                      type="radio"
                      name="method"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Credit / Debit Card</span>
                  </label>
                </div>
              </div>

              {/* Input details */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  {paymentMethod === "UPI" ? "Enter UPI Address ID" : "Card Credentials"}
                </label>
                <input
                  required
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={paymentMethod === "UPI" ? "e.g. resident@ybl" : "XXXX XXXX XXXX XXXX"}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isPaying}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-sm py-4 rounded-xl shadow-md shadow-indigo-150 transition cursor-pointer text-center"
              >
                {isPaying ? "Authorizing transaction..." : `Authorize Payment of $${activePayment.amount.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
