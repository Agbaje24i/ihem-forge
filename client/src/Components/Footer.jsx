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
import { contactInfo, socialLinks } from "../data/site";

const socials = [
  { icon: FaFacebookF, href: socialLinks.facebook, label: "Facebook" },
  { icon: FaInstagram, href: socialLinks.instagram, label: "Instagram" },
  { icon: FaLinkedinIn, href: socialLinks.linkedin, label: "LinkedIn" },
  { icon: FaTwitter, href: socialLinks.twitter, label: "Twitter" },
  { icon: FaYoutube, href: socialLinks.youtube, label: "YouTube" },
].filter((item) => item.href);

const columns = [
  {
    title: "Academy",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/tracks", label: "All Tracks" },
      { to: "/scholarship", label: "Scholarships" },
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
      { to: "/student-portal", label: "Student Portal" },
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
              Hands-on training across every major tech track, from software and
              data to cloud, security and design, turning curious beginners into
              job-ready professionals.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-forge-200">
              {contactInfo.people.map((p) => (
                <li key={p.role}>
                  <span className="font-semibold text-white">{p.role}:</span> {p.name}
                  <br />
                  <a href={`tel:${p.phone}`} className="hover:text-ember-400">{p.phone}</a>
                  {" · "}
                  <a href={`mailto:${p.email}`} className="hover:text-ember-400">{p.email}</a>
                </li>
              ))}
              <li>{contactInfo.hours}</li>
            </ul>

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
            © {new Date().getFullYear()} IHEMFORGE Academy. All rights
            reserved.
          </p>
          <p>
            Learn. Build. Grow. ·{" "}
            <Link to="/admin-login" className="hover:text-ember-400">Staff login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
