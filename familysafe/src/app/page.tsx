"use client";

import Link from "next/link";
import { ShieldAlert, CheckCircle, PieChart, TrendingUp, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-primary" size={32} />
          <span className="font-bold text-2xl text-primary">FamilySafe</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium hover:text-primary transition-colors">Login</Link>
          <Link href="/dashboard" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Plan Today. <br/><span className="text-primary">Be Ready for Tomorrow.</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
          Manage your family's income, expenses, savings and unexpected financial situations in one intelligent place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="btn btn-primary text-lg px-8 py-3">Get Started Now</Link>
          <Link href="/login" className="btn btn-outline text-lg px-8 py-3">Login</Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="card">
            <PieChart className="text-primary mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Smart Budgeting</h3>
            <p className="text-muted">Track all family income sources and organize monthly spending limits with ease.</p>
          </div>
          <div className="card">
            <Shield className="text-green mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Emergency Planning</h3>
            <p className="text-muted">Build your safety net and simulate unexpected scenarios like job loss or medical emergencies.</p>
          </div>
          <div className="card">
            <TrendingUp className="text-yellow mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">What-If Simulator</h3>
            <p className="text-muted">Test how changes in income or major expenses affect your family's financial health.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
