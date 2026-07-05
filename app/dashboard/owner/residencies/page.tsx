import React from "react";
import { getCurrentUser } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OwnerResidenciesPage() {
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
  });

  const pgIds = pgs.map((p) => p.pgId);

  // Fetch all tenants staying in these PGs
  const residents = pgIds.length
    ? await prisma.user.findMany({
        where: {
          stayingInPgId: {
            in: pgIds,
          },
          isDeleted: false,
        },
        select: {
          userId: true,
          name: true,
          email: true,
          roomNo: true,
          bedNo: true,
          stayingInPgId: true,
          createdAt: true,
        },
      })
    : [];

  // Group residents by PG
  const pgMap = new Map(pgs.map((p) => [p.pgId, p]));

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          Stay Directory
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Active Residents</h1>
        <p className="text-slate-500 mt-1">Review active lease profiles, occupied rooms, and tenant contact cards.</p>
      </div>

      {residents.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Active Tenants</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            You don't have any residents associated with your properties yet. Residents will appear here once they are registered to stay in one of your listed properties.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {residents.map((res) => {
            const pg = pgMap.get(res.stayingInPgId || "");

            return (
              <article
                key={res.userId}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar badge */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-extrabold text-indigo-700 text-sm">
                      {res.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 leading-snug">{res.name}</h3>
                      <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded tracking-wide uppercase">
                        Tenant Stay
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-semibold mt-4.5 truncate">
                    Email: <span className="text-slate-600">{res.email}</span>
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-2 text-xs font-semibold text-slate-500">
                    <div className="flex justify-between">
                      <span>Property Location</span>
                      <span className="text-slate-700 font-extrabold truncate max-w-[150px]">
                        {pg?.title || "Unknown PG"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Assigned</span>
                      <span className="text-slate-800 font-extrabold">Room {res.roomNo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bed Details</span>
                      <span className="text-slate-800 font-extrabold">Bed {res.bedNo || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Joined Stay</span>
                  <span className="text-slate-600">{new Date(res.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}