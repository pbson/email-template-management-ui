import { useEffect, useCallback, useState, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

import userApi from '../services/user.api';

// Signup Mutation
export const useSignupMutation = () => {
  return useMutation({
    mutationFn: userApi.signup,
    onSuccess: () => {
      toast.success('Signup successful');
    },
    onError: () => {
      toast.error('Signup failed. Please try again.');
    },
  });
};

// Signin Mutation
export const useSigninMutation = () => {
  return useMutation({
    mutationFn: userApi.signin,
    onSuccess: () => {
      toast.success('Signin successful');
    },
    onError: () => {
      toast.error('Signin failed. Please try again.');
    },
  });
};

// Reset Password Mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: userApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
    onError: () => {
      toast.error('Password reset failed. Please try again.');
    },
  });
};

// Microsoft Sign-In Hook
const CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;
const AUTH_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=id_token&redirect_uri=${REDIRECT_URI}&scope=openid profile email&response_mode=fragment&state=12345&nonce=${Date.now()}`;

export const useMicrosoftSignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const callbackExecutedRef = useRef(false);

  const { mutateAsync: microsoftSignin } = useMutation({
    mutationFn: userApi.signinMicrosoft,
  });

  const handleMicrosoftSignIn = () => {
    window.location.href = AUTH_URL;
  };

  const handleAuthCallback = useCallback(
    async (hash: string) => {
      if (callbackExecutedRef.current || !hash) return;

      callbackExecutedRef.current = true;
      setIsLoading(true);

      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');

      if (idToken) {
        try {
          const response = await microsoftSignin({ id_token: idToken });
          if (response.data) {
            localStorage.setItem('jwt', response.data);
            toast.success('Signin with Microsoft successful');
            navigate('/case-management');
          } else {
            throw new Error('No data received from sign-in');
          }
        } catch (error) {
          setError('Microsoft sign-in failed. Please try again.');
          toast.error('Signin with Microsoft failed. Please try again.');
        }
      } else {
        setError('Microsoft sign-in failed. No ID token received.');
        toast.error('Signin with Microsoft failed. No ID token received.');
      }

      setIsLoading(false);
    },
    [microsoftSignin, navigate],
  );

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      handleAuthCallback(hash);
    }
  }, [location, handleAuthCallback]);

  return { handleMicrosoftSignIn, error, isLoading };
};

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    setIsAuthenticated(!!jwt);
  }, []);

  return isAuthenticated;
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  return logout;
};
