"use client";

import React, { useState } from "react";
import { PublicPg } from "@/global";
import { createPgAction, deletePgAction } from "@/server/actions/pg.action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PgManagerClient({
  initialPgs,
  userId,
  ownerName,
  ownerPhone,
  ownerEmail,
}: {
  initialPgs: PublicPg[];
  userId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string | null;
}) {
  const router = useRouter();
  const [pgs, setPgs] = useState<PublicPg[]>(initialPgs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    roomsCount: 1,
    availableBeds: 2,
    genderType: "UNISEX" as "MALE" | "FEMALE" | "UNISEX",
    roomType: "SINGLE" as "SINGLE" | "DOUBLE" | "TRIPLE" | "DORMITORY",
    rent: 500,
    securityFee: 200,
    maintenanceFee: 50,
    foodAvailable: false,
    wifiAvailable: true,
    parkingAvailable: false,
    laundryAvailable: false,
    acAvailable: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: PublicPg = {
      ...formData,
      ownerName,
      ownerPhone,
      ownerEmail,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      ],
      isAvailable: true,
      isVerified: true,
    };

    const res = await createPgAction(payload, userId);
    setIsSubmitting(false);

    if (res.success && res.data) {
      toast.success("New PG listed successfully!");
      setPgs((prev) => [res.data!, ...prev]);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        title: "",
        description: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        roomsCount: 1,
        availableBeds: 2,
        genderType: "UNISEX",
        roomType: "SINGLE",
        rent: 500,
        securityFee: 200,
        maintenanceFee: 50,
        foodAvailable: false,
        wifiAvailable: true,
        parkingAvailable: false,
        laundryAvailable: false,
        acAvailable: false,
      });
      router.refresh();
    } else {
      toast.error(res.message || "Failed to create PG");
    }
  };

  const handleDelete = async (pgId: string) => {
    if (!confirm("Are you sure you want to delete this PG listing?")) return;

    const res = await deletePgAction(pgId);
    if (res.success) {
      toast.success("PG Listing deleted!");
      setPgs((prev) => prev.filter((p) => p.pgId !== pgId));
      router.refresh();
    } else {
      toast.error(res.message || "Failed to delete PG");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            Property Portfolio
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">My PG Listings</h1>
          <p className="text-slate-500 mt-1">Manage and track your active paying guest properties.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-md shadow-indigo-150 transition cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          List New PG
        </button>
      </div>

      {/* Grid of Listings */}
      {pgs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No PG Listed Yet</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Get started by adding your first paying guest listing. Click the button above to launch the list form!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pgs.map((pg) => (
            <article
              key={pg.pgId}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              {/* Card Image banner */}
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={pg.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                  alt={pg.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    {pg.genderType}
                  </span>
                  <span className="bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    {pg.roomType}
                  </span>
                </div>
              </div>

              {/* Card Info details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{pg.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {pg.city}, {pg.state}
                  </p>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">{pg.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  {/* Stats list */}
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-600">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Rooms</span>
                      <span className="text-slate-700 font-extrabold">{pg.roomsCount} Total</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Available</span>
                      <span className="text-emerald-600 font-extrabold">{pg.availableBeds} Beds</span>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Monthly Rent</span>
                      <span className="text-indigo-600 font-extrabold text-lg">${pg.rent}/mo</span>
                    </div>

                    <button
                      onClick={() => pg.pgId && handleDelete(pg.pgId)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer"
                      title="Delete Property"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Creation Modal form popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">List New PG Property</h3>
                <p className="text-xs text-slate-500 mt-1">Provide stay specifications and pricing details below.</p>
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

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic spec Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-2">
                  Basic Info & Location
                </h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">PG Title Name</label>
                    <input
                      required
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Royal Elite Premium Boys PG"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Description</label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="e.g. High-class residence with all active staying features."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Street Address</label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street name & area"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:col-span-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">State</label>
                      <input
                        required
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Pincode</label>
                      <input
                        required
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pin"
                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PG Spec Details Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-2">
                  Stay Specifications
                </h4>

                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Rooms Count</label>
                    <input
                      required
                      type="number"
                      name="roomsCount"
                      value={formData.roomsCount}
                      onChange={handleChange}
                      min={1}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Beds Available</label>
                    <input
                      required
                      type="number"
                      name="availableBeds"
                      value={formData.availableBeds}
                      onChange={handleChange}
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Allowed Gender</label>
                    <select
                      name="genderType"
                      value={formData.genderType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="UNISEX">Unisex</option>
                      <option value="MALE">Male Only</option>
                      <option value="FEMALE">Female Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Room Layout</label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="SINGLE">Single Bed</option>
                      <option value="DOUBLE">Double Sharing</option>
                      <option value="TRIPLE">Triple Sharing</option>
                      <option value="DORMITORY">Dormitory</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-2">
                  Pricing Models
                </h4>

                <div className="grid gap-4 grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Monthly Rent ($)</label>
                    <input
                      required
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleChange}
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Security Deposit ($)</label>
                    <input
                      type="number"
                      name="securityFee"
                      value={formData.securityFee}
                      onChange={handleChange}
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Maintenance ($)</label>
                    <input
                      type="number"
                      name="maintenanceFee"
                      value={formData.maintenanceFee}
                      onChange={handleChange}
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities checklists */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 border-b border-indigo-50 pb-2">
                  Facilities Available
                </h4>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name="wifiAvailable"
                      checked={formData.wifiAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-sm text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Wi-Fi</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name="acAvailable"
                      checked={formData.acAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-sm text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Air Conditioner</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name="foodAvailable"
                      checked={formData.foodAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-sm text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Food/Mess</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name="parkingAvailable"
                      checked={formData.parkingAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-sm text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Parking Space</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      name="laundryAvailable"
                      checked={formData.laundryAvailable}
                      onChange={handleChange}
                      className="h-4 w-4 rounded-sm text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Laundry Service</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-3.5 rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-4 py-3.5 rounded-xl shadow-md shadow-indigo-150 transition cursor-pointer text-center"
                >
                  {isSubmitting ? "Listing stay..." : "Submit Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
