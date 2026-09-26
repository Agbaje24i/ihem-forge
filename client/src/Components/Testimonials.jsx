import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Sample testimonial data
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
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 text-white"
      style={{
        backgroundImage:
          "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      }}
    >
      {/* Section Header */}
      <h2 className="text-4xl font-bold mb-8 text-center drop-shadow-lg">
        What Our Students Say
      </h2>
      <p className="mb-12 text-center text-gray-200 max-w-2xl">
        Real experiences from our students who went through IHEM Forge programs. 
        Learn, grow, and be part of our thriving tech community!
      </p>

      {/* Carousel */}
      <div className="w-full max-w-3xl">
        <Slider {...settings}>
          {testimonials.map((testi, index) => (
            <div key={index} className="px-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-20 h-20 rounded-full mb-4 border-2 border-white"
                />
                <p className="mb-4 text-lg font-medium">"{testi.message}"</p>
                <h3 className="font-bold text-xl">{testi.name}</h3>
                <span className="text-gray-300">{testi.program}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Call-to-Action */}
      <button className="mt-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition">
        Apply Now to Join IHEM Forge
      </button>
    </section>
  );
}

export default Testimonials;
