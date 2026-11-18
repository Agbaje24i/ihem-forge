import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";

const dropdowns = [
  {
    key: "academics",
    label: "Academics",
    items: [
      { to: "/tracks", label: "All Tracks" },
      { to: "/scholarship", label: "Scholarships" },
      { to: "/events", label: "Events" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    items: [
      { to: "/blog", label: "Blog" },
      { to: "/faq", label: "FAQ" },
      { to: "/testimonials", label: "Testimonials" },
      { to: "/verify", label: "Verify Certificate" },
    ],
  },
  {
    key: "involved",
    label: "Get Involved",
    items: [
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

const linkBase =
  "rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-forge-50 hover:text-forge-700";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isStudentLoggedIn = !!localStorage.getItem("studentToken");

  // Add a shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b bg-white/90 backdrop-blur transition-shadow ${
        scrolled ? "border-forge-100 shadow-card" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="IHEM Forge Tech Academy - home">
          <Logo size={42} />
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-forge-50 text-forge-700" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-forge-50 text-forge-700" : ""}`
            }
          >
            About
          </NavLink>

          {dropdowns.map((menu) => (
            <div
              key={menu.key}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu.key)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                type="button"
                className={`${linkBase} inline-flex items-center gap-1`}
                aria-expanded={openMenu === menu.key}
                onClick={() =>
                  setOpenMenu(openMenu === menu.key ? null : menu.key)
                }
              >
                {menu.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === menu.key ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openMenu === menu.key && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full w-56 pt-2"
                  >
                    <div className="overflow-hidden rounded-xl border border-forge-100 bg-white p-2 shadow-card">
                      {menu.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-forge-50 hover:text-forge-700"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isStudentLoggedIn ? (
            <Link to="/student-portal" className="btn-primary !px-5 !py-2.5 text-sm">
              My Portal
            </Link>
          ) : (
            <>
              <Link
                to="/student-login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-forge-800 transition hover:bg-forge-50"
              >
                Login
              </Link>
              <Link
                to="/student-register"
                className="btn-primary !px-5 !py-2.5 text-sm"
              >
                Apply Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-forge-900 transition hover:bg-forge-50 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-forge-100 bg-white px-4 pb-6 pt-3 lg:hidden"
          >
            <div className="space-y-1">
              <Link to="/" className="block rounded-lg px-3 py-2.5 font-semibold text-slate-700 hover:bg-forge-50">
                Home
              </Link>
              <Link to="/about" className="block rounded-lg px-3 py-2.5 font-semibold text-slate-700 hover:bg-forge-50">
                About
              </Link>
            </div>

            {dropdowns.map((menu) => (
              <div key={menu.key} className="mt-4">
                <p className="px-3 text-xs font-bold uppercase tracking-widest text-forge-500">
                  {menu.label}
                </p>
                <div className="mt-1 space-y-1">
                  {menu.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-forge-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6 flex flex-col gap-3">
              {isStudentLoggedIn ? (
                <Link to="/student-portal" className="btn-primary">
                  My Portal
                </Link>
              ) : (
                <>
                  <Link to="/student-login" className="btn-outline">
                    Login
                  </Link>
                  <Link to="/student-register" className="btn-primary">
                    Apply Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
