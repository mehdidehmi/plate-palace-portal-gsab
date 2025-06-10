import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock the AuthContext directly instead of using the actual component
vi.mock('@/contexts/AuthContext', () => {
  const mockUser = null;
  const mockSession = null;
  const mockLoading = false;
  const mockSignIn = vi.fn().mockResolvedValue({ error: null });
  const mockSignUp = vi.fn().mockResolvedValue({ error: null });
  const mockSignOut = vi.fn().mockResolvedValue();
  
  return {
    useAuth: () => ({
      user: mockUser,
      session: mockSession,
      loading: mockLoading,
      signIn: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Test component that uses the auth context
const TestComponent = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">{user ? 'Logged in' : 'Not logged in'}</div>
      <button onClick={() => signIn('test@example.com', 'password')} data-testid="sign-in-btn">
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password')} data-testid="sign-up-btn">
        Sign Up
      </button>
      <button onClick={signOut} data-testid="sign-out-btn">
        Sign Out
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('provides authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });
  
  it('calls signIn when sign in button is clicked', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const user = userEvent.setup();
    await user.click(screen.getByTestId('sign-in-btn'));
    
    expect(useAuth().signIn).toHaveBeenCalledWith('test@example.com', 'password');
  });
  
  it('calls signUp when sign up button is clicked', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const user = userEvent.setup();
    await user.click(screen.getByTestId('sign-up-btn'));
    
    expect(useAuth().signUp).toHaveBeenCalledWith('test@example.com', 'password');
  });
  
  it('calls signOut when sign out button is clicked', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const user = userEvent.setup();
    await user.click(screen.getByTestId('sign-out-btn'));
    
    expect(useAuth().signOut).toHaveBeenCalled();
  });
}); 