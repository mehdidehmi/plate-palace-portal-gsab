
-- Create profiles table for restaurant owners
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  restaurant_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurants table for restaurant details
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  theme_color TEXT DEFAULT '#ef4444',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for restaurants
CREATE POLICY "Users can view their own restaurants" 
  ON public.restaurants 
  FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own restaurants" 
  ON public.restaurants 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own restaurants" 
  ON public.restaurants 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own restaurants" 
  ON public.restaurants 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Create RLS policies for menu_items
CREATE POLICY "Users can view menu items of their restaurants" 
  ON public.menu_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create menu items for their restaurants" 
  ON public.menu_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update menu items of their restaurants" 
  ON public.menu_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete menu items of their restaurants" 
  ON public.menu_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
