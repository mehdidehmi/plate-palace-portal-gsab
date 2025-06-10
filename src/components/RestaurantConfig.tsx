
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  theme_color: string;
}

const RestaurantConfig = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch restaurant data
  const { data: restaurant, isLoading } = useQuery({
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

  const form = useForm<RestaurantFormData>({
    defaultValues: {
      name: restaurant?.name || '',
      description: restaurant?.description || '',
      address: restaurant?.address || '',
      phone: restaurant?.phone || '',
      theme_color: restaurant?.theme_color || '#ef4444',
    },
  });

  // Update form when restaurant data loads
  React.useEffect(() => {
    if (restaurant) {
      form.reset({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        theme_color: restaurant.theme_color || '#ef4444',
      });
    }
  }, [restaurant, form]);

  const mutation = useMutation({
    mutationFn: async (data: RestaurantFormData) => {
      if (!user) throw new Error('User not authenticated');

      if (restaurant) {
        const { error } = await supabase
          .from('restaurants')
          .update(data)
          .eq('id', restaurant.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('restaurants')
          .insert([{ ...data, owner_id: user.id }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] });
      toast({
        title: "Succès",
        description: "Restaurant configuré avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RestaurantFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration du Restaurant</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Le nom du restaurant est obligatoire" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du restaurant</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon Restaurant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de la Paix, Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur du thème</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input type="color" {...field} className="w-16 h-10" />
                        <Input {...field} placeholder="#ef4444" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Décrivez votre restaurant..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RestaurantConfig;
