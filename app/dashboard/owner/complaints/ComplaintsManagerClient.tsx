"use client";

import React, { useState } from "react";
import { updateComplaintStatusAction } from "@/server/actions/complaint.action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ComplaintItem {
  complaintId: string;
  userId: string;
  pgId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  pg: {
    title: string;
  };
}

export default function ComplaintsManagerClient({
  initialComplaints,
}: {
  initialComplaints: ComplaintItem[];
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<ComplaintItem[]>(initialComplaints);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    setUpdatingId(complaintId);
    const res = await updateComplaintStatusAction(complaintId, newStatus);
    setUpdatingId(null);

    if (res.success && res.data) {
      toast.success(`Complaint status updated to ${newStatus.replace("_", " ")}`);
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === complaintId ? { ...c, status: newStatus } : c
        )
      );
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update complaint status");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === "ALL") return true;
    return c.status === filterStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      default:
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          Support Desk
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Tenant Complaints</h1>
        <p className="text-slate-500 mt-1">Review, track, and resolve maintenance or amenity complaints from staying residents.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
              filterStatus === status
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Complaints Found</h3>
          <p className="text-slate-400 mt-2">
            Excellent! All reported issues under this status have been resolved or are clear.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredComplaints.map((c) => (
            <article
              key={c.complaintId}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 hover:shadow-md transition duration-200"
            >
              {/* Left Column details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getStatusColor(c.status)}`}>
                    {c.status.replace("_", " ")}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${getPriorityColor(c.priority)}`}>
                    {c.priority} Priority
                  </span>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{c.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{c.description}</p>
                </div>

                <div className="text-xs text-slate-400 font-semibold flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-slate-50">
                  <span>Resident: <strong className="text-slate-600">{c.user.name}</strong></span>
                  <span>Property: <strong className="text-slate-600">{c.pg.title}</strong></span>
                  <span>Reported: <strong className="text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Right Column Action Controls */}
              <div className="flex flex-row md:flex-col items-center justify-end gap-3 self-stretch border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0 min-w-[200px]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block md:mb-1 w-full text-center">
                  Update Progress
                </span>

                {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                  <button
                    disabled={updatingId === c.complaintId}
                    onClick={() => handleStatusChange(c.complaintId, "IN_PROGRESS")}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition cursor-pointer text-center"
                  >
                    Start Resolving
                  </button>
                )}

                {c.status !== "RESOLVED" && (
                  <button
                    disabled={updatingId === c.complaintId}
                    onClick={() => handleStatusChange(c.complaintId, "RESOLVED")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition cursor-pointer text-center"
                  >
                    Mark Resolved
                  </button>
                )}

                {c.status === "RESOLVED" && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm py-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Resolved!
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
