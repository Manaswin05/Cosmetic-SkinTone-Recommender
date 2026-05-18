import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, User, ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Skin Analysis", href: "/analysis" },
  { name: "Our Story", href: "/story" },
  { name: "Journal", href: "/journal" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <header className="bg-surface-bright/95 backdrop-blur-md border-b border-surface-container-high sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 h-24 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-start">
            <div className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/70">Beauty Intelligence</div>
            <div className="text-3xl font-serif italic text-primary tracking-tight">lumina.</div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300 hover:opacity-70 ${isActive ? "text-primary" : "text-on-surface-variant"
                    }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "border border-on-surface-variant"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6 text-primary">
            <button className="hover:opacity-70 transition-opacity">
              <Heart size={20} />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <User size={20} />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline py-20 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <div>
              <div className="font-serif italic text-2xl text-primary mb-2 tracking-tight">lumina.</div>
              <div className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/70 mb-6">AI-Powered Skin Analysis</div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {["Privacy Policy", "Terms of Service", "Shipping & Returns", "Accessibility", "Contact Us"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="font-sans font-bold text-[10px] uppercase tracking-widest text-[#8C8A76] hover:text-primary transition-all"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:text-right">
              <p className="font-sans font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.3em] mb-4">
                Join the Origin Circle
              </p>
              <div className="flex border-b border-outline-variant pb-2 mb-8 max-w-sm md:ml-auto">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent border-none focus:ring-0 w-full text-[12px] font-sans placeholder:text-on-surface-variant/40"
                />
                <button className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity">
                  Subscribe
                </button>
              </div>
              <p className="font-sans font-bold text-[9px] text-[#8C8A76]/60 uppercase tracking-[0.3em]">
                © 2026 LUMINA BEAUTY. ETHICALLY SOURCED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
