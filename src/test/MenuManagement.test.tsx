import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuManagement from '@/components/MenuManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MenuManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock successful restaurant fetch
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'restaurants') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { id: 'test-restaurant-id', name: 'Test Restaurant', owner_id: 'test-user-id' },
            error: null,
          }),
        } as any;
      }
      if (table === 'menu_items') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'item1',
                name: 'Test Item 1',
                description: 'Description 1',
                price: 10.99,
                category: 'Appetizers',
                image_url: null,
                is_available: true,
                restaurant_id: 'test-restaurant-id',
              },
              {
                id: 'item2',
                name: 'Test Item 2',
                description: 'Description 2',
                price: 15.99,
                category: 'Main Course',
                image_url: null,
                is_available: true,
                restaurant_id: 'test-restaurant-id',
              },
            ],
            error: null,
          }),
        } as any;
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      } as any;
    });
  });

  it('displays restaurant name when data is loaded', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MenuManagement />
      </QueryClientProvider>
    );

    // Wait for the restaurant name to appear
    await waitFor(() => {
      expect(screen.getByText(/Restaurant: Test Restaurant/i)).toBeInTheDocument();
    });
  });

  it('displays menu items grouped by category', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MenuManagement />
      </QueryClientProvider>
    );

    // Wait for menu items to appear
    await waitFor(() => {
      expect(screen.getByText('Appetizers')).toBeInTheDocument();
      expect(screen.getByText('Main Course')).toBeInTheDocument();
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  it('shows add item form when add button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MenuManagement />
      </QueryClientProvider>
    );

    // Wait for the add button to appear and click it
    await waitFor(() => {
      const addButton = screen.getByText(/Ajouter un article/i);
      expect(addButton).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText(/Ajouter un article/i));

    // Check if the form appears
    await waitFor(() => {
      expect(screen.getByText(/Nouvel article/i)).toBeInTheDocument();
    });
  });
}); 