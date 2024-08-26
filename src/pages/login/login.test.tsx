import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginForm from '.';

// Mock the entire module
vi.mock('@/features/user/hooks/use-user-queries', () => ({
  useSigninMutation: () => ({ mutate: vi.fn(), isLoading: false }),
  useMicrosoftSignIn: () => ({ handleMicrosoftSignIn: vi.fn(), error: null }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('LoginForm', () => {
  it('renders the login form with basic elements', () => {
    render(<LoginForm />);

    // Check for the presence of main elements
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Microsoft logo Sign in with Microsoft/i,
      }),
    ).toBeInTheDocument();

    // Check for additional elements
    expect(
      screen.getByText('Welcome back! Please login to your account.'),
    ).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Or login with')).toBeInTheDocument();
  });
});
