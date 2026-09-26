import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="bg-gray-900 text-white py-10 relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')", // Tech background image
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto text-center px-5">
        <h2 className="text-2xl font-semibold mb-3">Follow Us</h2>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-5">
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://instagram.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white text-pink-600 hover:bg-pink-500 hover:text-white transition-all"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com/in/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://twitter.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://youtube.com/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white text-red-600 hover:bg-red-500 hover:text-white transition-all"
          >
            <FaYoutube size={20} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} All Rights Reserved | Designed by{" "}
          <span className="font-semibold text-blue-400">IHEM Forge</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
