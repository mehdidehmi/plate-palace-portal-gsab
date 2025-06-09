
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-red-50 to-orange-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Boostez votre{' '}
            <span className="text-red-600">présence en ligne</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Une solution complète de gestion de livraison{' '}
            <span className="font-semibold text-red-600">sans commission</span>{' '}
            pour restaurants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Voir une démo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Gratuit pendant 30 jours • Aucune commission • Configuration en 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
