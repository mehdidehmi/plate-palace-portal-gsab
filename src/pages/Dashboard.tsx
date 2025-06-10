
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RestaurantConfig from '@/components/RestaurantConfig';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">RestoPlatform</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bonjour, {user?.email}</span>
              <Button onClick={handleSignOut} variant="outline">
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tableau de bord Restaurant
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Gérez votre restaurant et créez votre menu
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Restaurant Configuration */}
            <RestaurantConfig />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Mon Menu</h3>
                <p className="text-gray-600 mb-4">Créez et personnalisez votre menu</p>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => navigate('/menu')}
                >
                  Gérer le menu
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Menu Public</h3>
                <p className="text-gray-600 mb-4">Voir votre menu comme vos clients</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('/menu/public', '_blank')}
                >
                  Voir le menu public
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
