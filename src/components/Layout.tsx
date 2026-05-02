import { Link, useLocation } from "react-router-dom";
import { Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Skin Analysis", href: "/analysis" },
  { name: "Our Story", href: "/story" },
  { name: "Journal", href: "/journal" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <header className="bg-surface-bright/95 backdrop-blur-md border-b border-surface-container-high sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 h-16 md:h-24 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-serif italic text-primary tracking-tight">
            lumina.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300 hover:opacity-70 ${
                    isActive ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "border border-on-surface-variant"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4 md:gap-6 text-primary">
            <button className="hover:opacity-70 transition-opacity hidden sm:block">
              <Heart size={20} />
            </button>
            <button className="hover:opacity-70 transition-opacity hidden sm:block">
              <User size={20} />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <ShoppingBag size={20} />
            </button>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden hover:opacity-70 transition-opacity p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-outline/30 bg-surface-bright"
            >
              <nav className="flex flex-col px-4 py-4 gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface-variant hover:bg-surface"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-primary" : "border border-on-surface-variant"}`} />
                      {link.name}
                    </Link>
                  );
                })}
                <div className="flex gap-6 px-4 pt-4 pb-2 border-t border-outline/30 mt-2">
                  <button className="hover:opacity-70 transition-opacity text-primary"><Heart size={20} /></button>
                  <button className="hover:opacity-70 transition-opacity text-primary"><User size={20} /></button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline py-12 md:py-20 px-4 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div>
              <div className="font-serif italic text-2xl text-primary mb-6 tracking-tight">lumina.</div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
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
              <div className="flex border-b border-outline-variant pb-2 mb-6 max-w-sm md:ml-auto">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent border-none focus:ring-0 w-full text-[12px] font-sans placeholder:text-on-surface-variant/40"
                />
                <button className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="font-sans font-bold text-[9px] text-[#8C8A76]/60 uppercase tracking-[0.3em]">
                © 2024 LUMINA BEAUTY. ETHICALLY SOURCED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
