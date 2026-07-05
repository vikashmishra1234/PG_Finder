"use client";

import React, { useState } from "react";
import { createComplaintAction } from "@/server/actions/complaint.action";
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
  pg: {
    title: string;
  };
}

export default function ComplaintsClient({
  initialComplaints,
  userId,
  pgId,
}: {
  initialComplaints: ComplaintItem[];
  userId: string;
  pgId: string;
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<ComplaintItem[]>(initialComplaints);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WiFi",
    priority: "MEDIUM",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await createComplaintAction({
      ...formData,
      userId,
      pgId,
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      toast.success("Support ticket registered successfully!");
      setComplaints((prev) => [res.data!, ...prev]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "WiFi",
        priority: "MEDIUM",
      });
      router.refresh();
    } else {
      toast.error(res.message || "Failed to submit ticket");
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            Resident Helpdesk
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Submit maintenance complaints and track resolution progress.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-md shadow-indigo-150 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          File New Complaint
        </button>
      </div>

      {/* Tickets List */}
      {complaints.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">All Clear! No Tickets Raised</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Need a repair or have issues with Wi-Fi? Raise your first support ticket to alert management!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {complaints.map((c) => (
            <article
              key={c.complaintId}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:shadow-md transition duration-200"
            >
              <div className="space-y-4">
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
                  <h3 className="text-base font-bold text-slate-800 leading-snug">{c.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{c.description}</p>
                </div>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3 pt-2">
                  <span>Reported: {new Date(c.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Stay: {c.pg.title}</span>
                </div>
              </div>

              {/* Status Graphic indicator */}
              <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-400 select-none">
                {c.status === "PENDING" && (
                  <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    Awaiting Review
                  </span>
                )}
                {c.status === "IN_PROGRESS" && (
                  <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    In Progress
                  </span>
                )}
                {c.status === "RESOLVED" && (
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Ticket Resolved
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Slide-out modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">File Support Ticket</h3>
                <p className="text-xs text-slate-500 mt-1">Alert stay management about repairs or maintenance.</p>
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

            {/* Modal Form Scroll */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Issue Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Wi-Fi speed dropping or Geyser not heating"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="WiFi">Wi-Fi & Internet</option>
                  <option value="Plumbing">Plumbing & Water</option>
                  <option value="Electrical">Electrical & Power</option>
                  <option value="Cleaning">Cleaning & Hygiene</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low - General Inquiries</option>
                  <option value="MEDIUM">Medium - Performance/Convenience</option>
                  <option value="HIGH">High - Urgent Breakage/Hygiene</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your issue with room number details if helpful..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-3.5 rounded-xl transition cursor-pointer text-center text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-4 py-3.5 rounded-xl shadow-md shadow-indigo-150 transition cursor-pointer text-center text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
