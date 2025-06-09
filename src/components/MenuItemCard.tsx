
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    image_url: string | null;
    is_available: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const MenuItemCard = ({ item, onEdit, onDelete }: MenuItemCardProps) => {
  return (
    <Card className={`${!item.is_available ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-32 object-cover rounded-md mb-3"
          />
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <span className="text-lg font-bold text-red-600">{item.price.toFixed(2)}€</span>
          </div>
          
          {item.description && (
            <p className="text-gray-600 text-sm">{item.description}</p>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              item.is_available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.is_available ? 'Disponible' : 'Indisponible'}
            </span>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onDelete}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
