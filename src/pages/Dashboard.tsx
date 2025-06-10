import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RestaurantConfig from '@/components/RestaurantConfig';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch restaurant data to get the ID
  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const copyMenuLink = () => {
    if (restaurant) {
      const menuUrl = `${window.location.origin}/menu/${restaurant.id}`;
      navigator.clipboard.writeText(menuUrl);
      toast({
        title: "Lien copié!",
        description: "Le lien de votre menu a été copié dans le presse-papiers",
      });
    }
  };

  const openPublicMenu = () => {
    if (restaurant) {
      window.open(`/menu/${restaurant.id}`, '_blank');
    } else {
      toast({
        title: "Restaurant non configuré",
        description: "Veuillez d'abord configurer votre restaurant",
        variant: "destructive",
      });
    }
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
            
            {/* Menu Link Section */}
            {restaurant && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Lien de votre menu public</h3>
                <p className="text-gray-600 mb-4">Partagez ce lien sur Instagram et autres réseaux sociaux:</p>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={`${window.location.origin}/menu/${restaurant.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                  />
                  <Button onClick={copyMenuLink} size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                </div>
              </div>
            )}
            
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
                  onClick={openPublicMenu}
                  disabled={!restaurant}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
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
