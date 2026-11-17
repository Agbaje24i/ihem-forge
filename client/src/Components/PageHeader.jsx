import React from "react";

// Shared banner used at the top of inner pages. The navbar is fixed and 5rem
// tall, so this adds top padding to sit below it.
const PageHeader = ({ eyebrow, title, subtitle, children }) => (
  <section className="relative overflow-hidden bg-gradient-to-b from-forge-50 to-white pt-32 pb-16">
    <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-forge-200/50 blur-3xl" />
    <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-ember-300/40 blur-3xl" />
    <div className="relative mx-auto max-w-4xl px-6 text-center">
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{title}</h1>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </section>
);

export default PageHeader;
