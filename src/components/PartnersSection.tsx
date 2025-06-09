import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const PartnersSection = () => {
  const sectionRef = useRef(null);
  const logoRowRef = useRef(null);

  const partnerLogos = [
    { name: "Allo Yassir", color: "bg-orange-500" },
    { name: "AFROTAB", color: "bg-gray-900" },
    { name: "Susulmo", color: "bg-red-500" },
    { name: "RIO", color: "bg-blue-900" },
    { name: "Chicken", color: "bg-yellow-600" },
    { name: "Big Bunn", color: "bg-red-700" },
    { name: "Burger", color: "bg-orange-600" },
    { name: "Mealy", color: "bg-yellow-500" },
    { name: "Food Mood", color: "bg-red-600" },
    { name: "Meal Prep", color: "bg-green-700" },
    { name: "La Bella", color: "bg-gray-900" },
    { name: "Sushi", color: "bg-green-600" },
    { name: "Naamos", color: "bg-gray-900" },
    { name: "Mealy", color: "bg-yellow-500" },
  ];

  useEffect(() => {
    // Infinite scroll animation for partner logos
    gsap.to(logoRowRef.current, {
      x: "-50%",
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    // Fade in animation when section comes into view
    gsap.fromTo(sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos restaurants partenaires
          </h2>
          <p className="text-xl text-gray-600">
            Plus de 150 restaurants nous font confiance
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex space-x-8" ref={logoRowRef} style={{ width: '200%' }}>
          {/* First set of logos */}
          {partnerLogos.map((partner, index) => (
            <div
              key={`first-${index}`}
              className={`flex-shrink-0 w-24 h-24 ${partner.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-xs text-center px-2">
                {partner.name}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partnerLogos.map((partner, index) => (
            <div
              key={`second-${index}`}
              className={`flex-shrink-0 w-24 h-24 ${partner.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-xs text-center px-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105">
          Savoir plus sur RestoPlatform
        </Button>
      </div>
    </section>
  );
};

export default PartnersSection;
