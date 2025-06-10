
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Minus, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  theme_color: string | null;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const PublicMenu = () => {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // For testing, let's use default data if database fails
  const defaultRestaurant: Restaurant = {
    id: restaurantId || 'test',
    name: 'Mon Restaurant',
    description: 'Restaurant de test',
    phone: '0619684987',
    theme_color: '#ef4444'
  };

  const defaultMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella, basilic',
      price: 12.50,
      category: 'Pizzas',
      image_url: null,
      is_available: true
    },
    {
      id: '2',
      name: 'Hamburger Classic',
      description: 'Steak, salade, tomate, oignon',
      price: 14.00,
      category: 'Burgers',
      image_url: null,
      is_available: true
    },
    {
      id: '3',
      name: 'Salade César',
      description: 'Salade, poulet, parmesan, croûtons',
      price: 11.00,
      category: 'Salades',
      image_url: null,
      is_available: true
    }
  ];

  // Try to fetch restaurant, fallback to default
  const { data: restaurant } = useQuery({
    queryKey: ['public-restaurant', restaurantId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .maybeSingle();
        
        if (error || !data) {
          console.log('Using default restaurant data');
          return defaultRestaurant;
        }
        return data;
      } catch (error) {
        console.log('Database error, using default restaurant');
        return defaultRestaurant;
      }
    },
    enabled: !!restaurantId,
  });

  // Try to fetch menu items, fallback to default
  const { data: menuItems } = useQuery({
    queryKey: ['public-menu', restaurantId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true)
          .order('category', { ascending: true });
        
        if (error || !data || data.length === 0) {
          console.log('Using default menu items');
          return defaultMenuItems;
        }
        return data;
      } catch (error) {
        console.log('Database error, using default menu');
        return defaultMenuItems;
      }
    },
    enabled: !!restaurantId,
  });

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de commander",
        variant: "destructive",
      });
      return;
    }

    const orderText = cart.map(item => 
      `${item.quantity} ${item.name}`
    ).join(', ');

    const totalPrice = getTotalPrice().toFixed(2);
    const message = `Nouvelle commande:\n${orderText}\nTotal: ${totalPrice}€`;
    
    // Use restaurant phone if available, otherwise default
    const phoneNumber = restaurant?.phone || "0619684987";
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    
    // Format for Moroccan numbers (+212)
    let formattedPhone;
    if (cleanPhone.startsWith('0')) {
      // Remove leading 0 and add 212
      formattedPhone = `212${cleanPhone.substring(1)}`;
    } else if (cleanPhone.startsWith('212')) {
      // Already has country code
      formattedPhone = cleanPhone;
    } else {
      // Add 212 prefix
      formattedPhone = `212${cleanPhone}`;
    }
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const currentRestaurant = restaurant || defaultRestaurant;
  const currentMenuItems = menuItems || defaultMenuItems;

  const filteredItems = currentMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const themeColor = currentRestaurant.theme_color || '#ef4444';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div 
        className="text-white py-8"
        style={{ backgroundColor: themeColor }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{currentRestaurant.name}</h1>
          {currentRestaurant.description && (
            <p className="text-lg opacity-90">{currentRestaurant.description}</p>
          )}
          <div className="flex items-center mt-4 space-x-4 text-sm">
            <div className="flex items-center">
              <span>🚚</span>
              <span className="ml-1">35-45 min</span>
            </div>
            <div className="flex items-center">
              <span>🕒</span>
              <span className="ml-1">Ouvert</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        {/* Categories */}
        {Object.keys(groupedItems).length > 0 && (
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {Object.keys(groupedItems).map((category) => (
              <Button
                key={category}
                variant="outline"
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          )}
                          <p className="font-bold text-lg mt-2" style={{ color: themeColor }}>
                            {item.price.toFixed(2)}€
                          </p>
                        </div>
                        
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                            disabled={getItemQuantity(item.id) === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">{getItemQuantity(item.id)}</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            style={{ backgroundColor: themeColor, color: 'white' }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {cart.reduce((total, item) => total + item.quantity, 0)} articles
                    </p>
                    <p className="text-lg font-bold" style={{ color: themeColor }}>
                      {getTotalPrice().toFixed(2)}€
                    </p>
                  </div>
                  <Button
                    onClick={sendWhatsAppOrder}
                    style={{ backgroundColor: '#25D366', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Commander via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicMenu;
