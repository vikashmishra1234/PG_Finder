"use client";

import { IMenu } from "@/navigations/nav.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  menus,
  baseUrl,
}: {
  menus: IMenu[];
  baseUrl: string;
}) {
  const pathname = usePathname();

  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "mypg":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "complaints":
      case "compliants":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "payments":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  return (
    <nav className="space-y-1.5">
      {menus.map((m) => {
        const fullPath = `${baseUrl}${m.path}`;
        // Match exact path or subpaths to keep active state highlighted
        const isActive = pathname === fullPath || pathname.startsWith(fullPath + "/");

        return (
          <Link
            key={m.key}
            href={fullPath}
            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "opacity-70"}`}>
              {getIcon(m.key)}
            </span>
            <span className="flex-1 truncate">{m.title}</span>
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}