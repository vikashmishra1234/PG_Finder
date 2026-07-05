import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { getCurrentUser } from "@/lib/helpers";
import { ownerMenus, residency } from "@/navigations/nav.config";
import { redirect } from "next/navigation";
import { logoutUserAction } from "@/server/actions/auth.action";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const role = user?.roles?.[0]?.name || "User";
  let baseUrl = '/';
  const menus = role === "Owner" ? ownerMenus : residency;

  if (role === "Owner") {
    baseUrl = '/dashboard/owner';
  } else {
    baseUrl = '/dashboard/residency';
  }

  // Handle logout on the server
  const handleLogout = async () => {
    "use server";
    await logoutUserAction();
    redirect("/sign-in");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shadow-sm z-20 shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              PG
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">StayEase</h2>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Finder Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-4 overflow-y-auto">
            <Sidebar baseUrl={baseUrl} menus={menus} />
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-snug">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Action Button */}
          <form action={handleLogout}>
            <button
              type="submit"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition duration-200 cursor-pointer"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="max-w-6xl w-full mx-auto p-8 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}