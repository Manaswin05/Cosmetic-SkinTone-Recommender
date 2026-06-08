import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Skin Analysis", href: "/analysis" },
  { name: "Our Story", href: "/story" },
  { name: "Journal", href: "/journal" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <header className="bg-surface-bright/95 backdrop-blur-md border-b border-surface-container-high sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-20 md:h-24 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-start">
            <div className="text-[9px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/70">Beauty Intelligence</div>
            <div className="text-2xl sm:text-3xl font-serif italic text-primary tracking-tight">lumina.</div>
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

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-primary">
            <Link to="/analysis" className="hover:opacity-70 transition-opacity" title="Skin Analysis">
              <Heart size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link to="/story" className="hover:opacity-70 transition-opacity" title="Our Story">
              <User size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link to="/shop" className="hover:opacity-70 transition-opacity" title="Shop">
              <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden ml-1 p-1.5 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-surface-bright z-50 md:hidden shadow-2xl border-l border-outline/30"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-5 border-b border-outline/30">
                  <span className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-primary">
                    Navigate
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-surface transition-colors text-on-surface-variant"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-4 px-5">
                  <div className="space-y-1">
                    {NAV_LINKS.map((link, i) => {
                      const isActive = location.pathname === link.href;
                      return (
                        <motion.div
                          key={link.name}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 + 0.1 }}
                        >
                          <Link
                            to={link.href}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-on-surface-variant hover:bg-surface hover:text-on-surface"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "border border-on-surface-variant/50"}`} />
                            <span className="font-sans font-bold text-[12px] uppercase tracking-[0.2em]">
                              {link.name}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* Menu Footer */}
                <div className="p-5 border-t border-outline/30">
                  <Link
                    to="/analysis"
                    className="block w-full bg-primary text-on-primary px-6 py-3.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-center hover:opacity-90 transition-all shadow-lg"
                  >
                    Start AI Analysis
                  </Link>
                  <p className="mt-4 text-center font-sans text-[9px] text-on-surface-variant/60 uppercase tracking-[0.2em]">
                    © 2026 Lumina Beauty
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-end">
            <div>
              <div className="font-serif italic text-2xl text-primary mb-2 tracking-tight">lumina.</div>
              <div className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-primary/70 mb-6">AI-Powered Skin Analysis</div>
              <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
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
