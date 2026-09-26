import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/ihem-forge-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const isStudentLoggedIn = !!localStorage.getItem("studentToken");

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full text-white shadow-lg z-50"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>

      {/* Main navbar container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo and Animated Name */}
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-md"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            <img
              src={logo}
              alt="IHEM Forge Logo"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h1
            className="text-lg md:text-2xl font-extrabold text-yellow-400 tracking-wide"
            animate={{ x: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            IHEM Forge Tech Academy
          </motion.h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-sm lg:text-base font-medium relative items-center">
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/about" className="hover:text-yellow-400">About</Link>

          {/* Programs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => toggleDropdown("programs")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="hover:text-yellow-400">Academics ▾</button>
            <AnimatePresence>
              {dropdown === "programs" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bg-blue-900 text-white shadow-lg mt-2 rounded-lg py-2 w-44"
                >
                  <Link to="/programs" className="block px-4 py-2 hover:bg-blue-800">Programs</Link>
                  <Link to="/courses" className="block px-4 py-2 hover:bg-blue-800">Courses</Link>
                  <Link to="/events" className="block px-4 py-2 hover:bg-blue-800">Events</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => toggleDropdown("resources")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="hover:text-yellow-400">Resources ▾</button>
            <AnimatePresence>
              {dropdown === "resources" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bg-blue-900 text-white shadow-lg mt-2 rounded-lg py-2 w-52"
                >
                  <Link to="/blog" className="block px-4 py-2 hover:bg-blue-800">Blog</Link>
                  <Link to="/faq" className="block px-4 py-2 hover:bg-blue-800">FAQ</Link>
                  <Link to="/testimonials" className="block px-4 py-2 hover:bg-blue-800">Testimonials</Link>
                  <Link to="/certificate" className="block px-4 py-2 hover:bg-blue-800 text-yellow-300 font-semibold">
                    Certificate
                  </Link>
                  <Link to="/certificate-form" className="block px-4 py-2 hover:bg-blue-800 text-yellow-200">
                    Certificate Form
                  </Link>
                  <Link to="/verify" className="block px-4 py-2 hover:bg-blue-800 text-green-300 font-semibold">
                    Verify Certificate
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Get Involved Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => toggleDropdown("career")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="hover:text-yellow-400">Get Involved ▾</button>
            <AnimatePresence>
              {dropdown === "career" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bg-blue-900 text-white shadow-lg mt-2 rounded-lg py-2 w-44"
                >
                  <Link to="/careers" className="block px-4 py-2 hover:bg-blue-800">Careers</Link>
                  <Link to="/contact" className="block px-4 py-2 hover:bg-blue-800">Contact</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Student Login / Apply */}
          {isStudentLoggedIn ? (
            <Link to="/student-apply" className="hover:text-yellow-400 font-semibold">
              My Application
            </Link>
          ) : (
            <>
              <Link to="/student-login" className="hover:text-yellow-400 font-semibold">
                Login
              </Link>
              <Link
                to="/student-register"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition"
              >
                Apply Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none relative z-20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 md:hidden bg-blue-900 bg-opacity-95 px-4 pb-4 space-y-2 text-base font-medium"
          >
            <Link to="/" className="block hover:text-yellow-400">Home</Link>
            <Link to="/about" className="block hover:text-yellow-400">About</Link>
            <Link to="/programs" className="block hover:text-yellow-400">Programs</Link>
            <Link to="/courses" className="block hover:text-yellow-400">Courses</Link>
            <Link to="/events" className="block hover:text-yellow-400">Events</Link>
            <Link to="/blog" className="block hover:text-yellow-400">Blog</Link>
            <Link to="/faq" className="block hover:text-yellow-400">FAQ</Link>
            <Link to="/testimonials" className="block hover:text-yellow-400">Testimonials</Link>
            <Link to="/certificate" className="block hover:text-yellow-400 font-semibold">Certificate</Link>
            <Link to="/certificate-form" className="block hover:text-yellow-400 font-semibold">Certificate Form</Link>
            <Link to="/verify" className="block hover:text-yellow-400 font-semibold">Verify Certificate</Link>
            <Link to="/careers" className="block hover:text-yellow-400">Careers</Link>
            <Link to="/contact" className="block hover:text-yellow-400">Contact</Link>

            {isStudentLoggedIn ? (
              <Link to="/student-apply" className="block hover:text-yellow-400 font-semibold">
                My Application
              </Link>
            ) : (
              <>
                <Link to="/student-login" className="block hover:text-yellow-400 font-semibold">
                  Login
                </Link>
                <Link to="/student-register" className="block text-yellow-400 font-semibold">
                  Apply Now
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
