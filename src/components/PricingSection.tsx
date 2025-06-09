
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current;
    
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} id="tarifs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des solutions adaptées à tous les types de restaurants
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Essai gratuit */}
          <div ref={addToRefs} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Essai gratuit</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">0 DH</span>
              <span className="text-gray-600"> / mois</span>
            </div>
            <p className="text-gray-600 mb-6">
              Essayez notre plateforme sans risque pendant 14 jours avec toutes les fonctionnalités incluses.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Toutes les fonctionnalités incluses pendant 14 jours</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              Démarrer l'essai gratuit
            </Button>
          </div>

          {/* Restaurant Unique - Popular */}
          <div ref={addToRefs} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative border-2 border-red-600">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Plus populaire
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Unique</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-red-600">200 DH</span>
              <span className="text-gray-600"> / mois</span>
            </div>
            <p className="text-gray-600 mb-6">
              Parfait pour les restaurants indépendants souhaitant développer leur présence en ligne.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Commandes illimitées</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Gestion de menu en ligne</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Intégration WhatsApp</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Analyses et rapports de base</span>
              </li>
            </ul>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Commencer
            </Button>
          </div>

          {/* Multi-Restaurants */}
          <div ref={addToRefs} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Restaurants</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">150 DH</span>
              <span className="text-gray-600"> / restaurant / mois</span>
            </div>
            <p className="text-gray-600 mb-6">
              Idéal pour les chaînes de restaurants avec plusieurs emplacements.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Toutes les fonctionnalités Restaurant Unique</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Gestion centralisée</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Rapports inter-restaurants</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Support entreprise</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full border-gray-800 bg-gray-800 text-white hover:bg-gray-700">
              Contacter les ventes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
