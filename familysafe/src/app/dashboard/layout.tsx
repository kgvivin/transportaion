"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  CreditCard, 
  ShieldAlert, 
  Activity, 
  HelpCircle, 
  FileText,
  User,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Family Income", href: "/dashboard/income", icon: Wallet },
    { name: "Monthly Budget", href: "/dashboard/budget", icon: PieChart },
    { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
    { name: "Emergency Fund", href: "/dashboard/emergency-fund", icon: ShieldAlert },
    { name: "Emergency Simulator", href: "/dashboard/simulator", icon: Activity },
    { name: "What-If Planner", href: "/dashboard/what-if", icon: HelpCircle },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ];

  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}
        style={{ width: "250px", position: "fixed", top: 0, bottom: 0, zIndex: 50 }}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <ShieldAlert className="text-primary mr-2" />
          <span className="font-bold text-xl text-primary">FamilySafe</span>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-blue-light text-blue font-medium' : 'text-muted hover:bg-neutral-light hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-muted hover:text-foreground">
            <User size={20} /> Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-muted hover:text-foreground">
            <Settings size={20} /> Settings
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-red hover:bg-red-light rounded-md mt-2">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1" style={{ marginLeft: "250px" }}>
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
          <div className="flex items-center">
            <ShieldAlert className="text-primary mr-2" />
            <span className="font-bold text-xl text-primary">FamilySafe</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </header>

        <div className="page-container">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
}
