import React from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PageHeader from "./PageHeader";

// Sample testimonial data - replace with real student stories
const testimonials = [
  {
    name: "Aisha Bello",
    program: "DevOps & CI/CD",
    message:
      "IHEM Forge transformed my career! The DevOps training was practical and real-world focused.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Emeka Okafor",
    program: "Mobile App Development",
    message:
      "The mobile app development program was intense but rewarding. I now build apps confidently.",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Chidinma Uche",
    program: "UI/UX Design",
    message:
      "Design thinking sessions and hands-on projects at IHEM Forge made learning UI/UX exciting.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Tunde Adesanya",
    program: "Networking & Infrastructure",
    message:
      "The networking training was detailed and highly practical. I now manage cloud infrastructure professionally.",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
];

function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <>
      <PageHeader
        eyebrow="Student stories"
        title="What our students say"
        subtitle="Real experiences from people who learned with IHEM Forge."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <Slider {...settings}>
            {testimonials.map((t) => (
              <div key={t.name} className="px-2 pb-10">
                <figure className="flex flex-col items-center rounded-3xl border border-forge-100 bg-white p-10 text-center shadow-card">
                  <Quote className="text-ember-500" size={32} />
                  <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700">
                    {t.message}
                  </blockquote>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="mt-6 h-16 w-16 rounded-full object-cover ring-4 ring-forge-100"
                  />
                  <figcaption className="mt-3">
                    <span className="block font-display font-bold text-forge-950">
                      {t.name}
                    </span>
                    <span className="block text-sm text-slate-500">{t.program}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </Slider>

          <div className="mt-6 text-center">
            <Link to="/student-register" className="btn-primary">
              Apply now to join IHEM Forge
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonials;
