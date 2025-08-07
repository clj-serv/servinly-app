import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignUpPage } from '../SignUpPage';
import { AuthContext } from '@/components/context/AuthContext';

describe('SignUpPage', () => {
  it('submits the sign-up form with correct values', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ data: {}, error: null });

    const mockContext = {
      user: null,
      profile: null,
      loading: false,
      error: null,
      signUp: mockSignUp,
      signIn: jest.fn(),
      signOut: jest.fn(),
      updateProfile: jest.fn(),
      retryConnection: jest.fn(),
      sessionTimeRemaining: null,
      resendConfirmation: jest.fn(),
      confirmEmail: jest.fn(),
      pendingConfirmationEmail: null,
    };

    render(
      <AuthContext.Provider value={mockContext}>
        <SignUpPage setCurrentPage={() => {}} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'securePassword123' },
    });

    // Select "Employer" radio button if you want to test a different userType
    fireEvent.click(screen.getByDisplayValue('employer'));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(mockSignUp).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'securePassword123',
        userType: 'employer',
      })
    );
  });
});
