import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="w-full py-5 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
            P
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">PG Finder</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <Link href="#features" className="hover:text-indigo-600 transition">Features</Link>
          <Link href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</Link>
          <Link href="#testimonials" className="hover:text-indigo-600 transition">Testimonials</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/sign-in" className="text-sm font-bold text-slate-700 hover:text-indigo-600 py-2.5 px-4 transition">
            Log in
          </Link>
          <Link href="/sign-up" className="text-sm font-bold bg-indigo-600 text-white py-2.5 px-5 rounded-xl hover:bg-indigo-700 transition shadow-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 text-center bg-gradient-to-b from-white to-slate-50">
        <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-4 py-2 rounded-full mb-8">
          #1 Platform for PG Seekers & Owners
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          Find your perfect PG with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Zero Hassle.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl">
          Whether you are looking for a cozy room to stay in or a platform to manage your PG properties, we have got you covered. Smart, simple, and secure.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/sign-up?role=residency" className="text-base font-bold bg-indigo-600 text-white py-4 px-8 rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all">
            Find a PG
          </Link>
          <Link href="/sign-up?role=owner" className="text-base font-bold bg-white text-slate-700 border-2 border-slate-200 py-4 px-8 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all">
            List your PG
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Why choose PG Finder?</h2>
            <p className="mt-4 text-slate-500 text-lg">Everything you need in one place.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Verified Properties</h3>
              <p className="text-slate-500 leading-relaxed">
                Browse through hundreds of verified PGs. No brokers, no fake listings. Just genuine homes.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Management</h3>
              <p className="text-slate-500 leading-relaxed">
                Owners can manage beds, track rent, and resolve complaints via our intuitive dashboard.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c-2.333 0-3.857 1.834-3.857 3.5 0 2 1.857 3.5 3.857 3.5M12 8V7m0 1v8M12 17v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Seamless Payments</h3>
              <p className="text-slate-500 leading-relaxed">
                Pay rent online securely and keep track of all your past transactions effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Ready to move in?</h2>
        <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join thousands of users who have found their second home through PG Finder.
        </p>
        <Link href="/sign-up" className="inline-block bg-white text-indigo-600 font-bold text-lg py-4 px-10 rounded-2xl shadow-lg hover:bg-indigo-50 hover:-translate-y-1 transition-all">
          Create an Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-8 text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold text-white">PG Finder</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Contact Us</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} PG Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
