import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LayoutDashboard, Users, Zap } from "lucide-react";
import { CollapsibleSidebar } from "./components/CollapsibleSidebar";

export const metadata: Metadata = {
  title: "Kampeyn War Room",
  description: "Internal dashboards for Kampeyn + Organize SD.",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kampeyn", label: "Kampeyn", icon: Zap },
  { href: "/organizesd", label: "Organize SD", icon: Users },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          {/* Collapsible Sidebar */}
          <CollapsibleSidebar />

          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-primary)] border-b border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-heading text-lg text-cta">War Room</h1>
              <nav className="flex gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="p-2 rounded-md hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                      title={item.label}
                    >
                      <Icon className="w-5 h-5 text-muted" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content - fixed margin for collapsed sidebar */}
          <main className="flex-1 lg:ml-20 p-6 pt-20 lg:pt-6 transition-all duration-300" id="main-content">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
