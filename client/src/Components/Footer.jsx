import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo";

// TODO: replace these placeholder URLs with your real social pages
const socials = [
  { icon: FaFacebookF, href: "https://facebook.com/yourpage", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com/yourpage", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com/in/yourpage", label: "LinkedIn" },
  { icon: FaTwitter, href: "https://twitter.com/yourpage", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com/yourchannel", label: "YouTube" },
];

const columns = [
  {
    title: "Academy",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/programs", label: "Programs" },
      { to: "/courses", label: "Courses" },
      { to: "/events", label: "Events" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/blog", label: "Blog" },
      { to: "/faq", label: "FAQ" },
      { to: "/testimonials", label: "Testimonials" },
      { to: "/verify", label: "Verify Certificate" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { to: "/student-register", label: "Apply Now" },
      { to: "/student-login", label: "Student Login" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-forge-950 text-forge-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo light size={44} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-forge-200">
              Hands-on Cloud and DevOps training that turns curious beginners
              into job-ready engineers, one real project at a time.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-ember-500 hover:text-forge-950"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-bold uppercase tracking-widest !text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-forge-200 transition hover:text-ember-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-forge-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} IHEM Forge Tech Academy. All rights
            reserved.
          </p>
          <p>Forging the next generation of tech talent.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
