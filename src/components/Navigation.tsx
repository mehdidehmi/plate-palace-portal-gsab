
import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">RestoPlatform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#accueil" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                Accueil
              </a>
              <a href="#fonctionnalites" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                Tarifs
              </a>
              <a href="#multi-store" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                Multi-store
              </a>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">FR</span>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Accéder à l'application
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#accueil" className="text-gray-900 block px-3 py-2 text-base font-medium">
              Accueil
            </a>
            <a href="#fonctionnalites" className="text-gray-600 block px-3 py-2 text-base font-medium">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-600 block px-3 py-2 text-base font-medium">
              Tarifs
            </a>
            <a href="#multi-store" className="text-gray-600 block px-3 py-2 text-base font-medium">
              Multi-store
            </a>
            <div className="px-3 py-2">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Accéder à l'application
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
