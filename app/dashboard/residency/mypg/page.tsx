import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function TenantMyPgPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const stayingInPgId = user.stayingInPgId;
  const roomNo = user.roomNo;
  const bedNo = user.bedNo;

  if (!stayingInPgId) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Stay Connected</h3>
        <p className="text-slate-400 mt-2">
          Your resident account is not connected to a PG stay yet. Please contact management to register your stay.
        </p>
      </div>
    );
  }

  // Fetch PG stay details
  const pg = await prisma.pG.findUnique({
    where: { pgId: stayingInPgId },
  });

  if (!pg) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">PG Not Found</h3>
        <p className="text-slate-400 mt-2">The PG stay associated with your account was not found.</p>
      </div>
    );
  }

  // Fetch roommates (other users staying in the same PG, limit 5)
  const roommates = await prisma.user.findMany({
    where: {
      stayingInPgId: stayingInPgId,
      NOT: {
        userId: user.userId,
      },
    },
    select: {
      userId: true,
      name: true,
      roomNo: true,
      email: true,
    },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          My Residence
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{pg.title}</h1>
        <p className="text-slate-500 mt-1">{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (Stay specs and Amenities) */}
        <section className="lg:col-span-2 space-y-8">
          {/* Room details specs */}
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-4">Stay Specifications</h2>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Room</span>
                <span className="text-base font-extrabold text-slate-800 block mt-1">Room {roomNo}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bed Details</span>
                <span className="text-base font-extrabold text-slate-800 block mt-1">{bedNo}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Room Layout</span>
                <span className="text-base font-extrabold text-slate-800 block mt-1">
                  {pg.roomType.replace("_", " ")} Sharing
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
                <span className="text-base font-extrabold text-indigo-600 block mt-1">${pg.rent}/mo</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Fee</span>
                <span className="text-base font-extrabold text-slate-850 block mt-1">
                  ${pg.securityFee ? pg.securityFee.toLocaleString() : "0"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Maintenance</span>
                <span className="text-base font-extrabold text-slate-850 block mt-1">
                  ${pg.maintenanceFee ? pg.maintenanceFee.toLocaleString() : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Wi-Fi & Credentials card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-md flex items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">Residence Network</span>
              <h3 className="text-lg font-bold">Secure PG Wi-Fi Access</h3>
              <p className="text-slate-350 text-xs max-w-sm">
                Connect to the building high-speed network. Keep credentials secure.
              </p>
              <div className="flex gap-4 pt-3 text-xs font-semibold">
                <div>
                  <span className="opacity-70 text-[9px] uppercase tracking-wider block">SSID Name</span>
                  <span className="font-extrabold text-slate-100">{pg.title.replace(/\s+/g, "_")}_WiFi</span>
                </div>
                <div>
                  <span className="opacity-70 text-[9px] uppercase tracking-wider block">Wi-Fi Password</span>
                  <span className="font-extrabold text-slate-100">stay_ease_2026</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl text-white shrink-0 hidden sm:block">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.9 9.9 0 0114.14 0M1.34 8.536a15 15 0 0121.32 0" />
              </svg>
            </div>
          </div>

          {/* Amenities details */}
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-4">Included Amenities</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                <span className={`h-3 w-3 rounded-full shrink-0 ${pg.wifiAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                <div className="text-sm font-semibold text-slate-700">Wi-Fi Network Connection</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                <span className={`h-3 w-3 rounded-full shrink-0 ${pg.acAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                <div className="text-sm font-semibold text-slate-700">Air Conditioner Control</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                <span className={`h-3 w-3 rounded-full shrink-0 ${pg.foodAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                <div className="text-sm font-semibold text-slate-700">Food / Catering Board</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                <span className={`h-3 w-3 rounded-full shrink-0 ${pg.parkingAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                <div className="text-sm font-semibold text-slate-700">Reserved Parking Area</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl">
                <span className={`h-3 w-3 rounded-full shrink-0 ${pg.laundryAvailable ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                <div className="text-sm font-semibold text-slate-700">Laundry Service access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column (Owner details and Roommates) */}
        <section className="space-y-8">
          {/* Owner contact card */}
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Property Owner Contact</h3>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0">
                {pg.ownerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 leading-snug truncate">{pg.ownerName}</h4>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Landlord
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 space-y-2.5 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{pg.ownerPhone}</span>
              </div>
              {pg.ownerEmail && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{pg.ownerEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Roommates card */}
          <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">My Roommates ({roommates.length})</h3>

            {roommates.length === 0 ? (
              <p className="text-xs text-slate-400">No other residents in this room layout yet.</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {roommates.map((rm) => (
                  <div key={rm.userId} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {rm.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 leading-snug block truncate">{rm.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 block mt-0.5 truncate">{rm.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-55 bg-slate-50 px-2 py-0.5 rounded text-slate-600 border border-slate-100 shrink-0">
                      Room {rm.roomNo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
