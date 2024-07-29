import React, { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  useSignupMutation,
  useMicrosoftSignIn,
} from '@/features/user/hooks/use-user-queries';

type SignupFormInputs = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();
  const { mutate: signup, isLoading: loadingSignup } = useSignupMutation();
  const { handleMicrosoftSignIn, error: microsoftError } = useMicrosoftSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (data: SignupFormInputs) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    signup(
      {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem('jwt', response.data);
          navigate('/case-management');
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen">
      <div className="bg-white w-1/2 p-3 flex items-center justify-center">
        <div className="rounded-lg items-center justify-center">
          <img
            src="public/assets/imgs/signup.svg"
            alt="Email illustration"
            className="object-cover"
          />
        </div>
      </div>
      <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
        <div className="max-w-xl w-full mx-auto text-black">
          <h2 className="text-3xl font-bold mb-2">Sign up</h2>
          <p className="text-gray-600 mb-8">
            Welcome! Please fill in the form to create an account.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {microsoftError && (
              <div className="text-red-500 text-sm mb-4">{microsoftError}</div>
            )}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <Controller
                name="full_name"
                control={control}
                defaultValue=""
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="fullname"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@gmail.com"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Confirm Password is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loadingSignup}
            >
              {loadingSignup ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </a>
          </p>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleMicrosoftSignIn}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="public/assets/imgs/microsoft.svg"
                  alt="Microsoft logo"
                />
                Sign in with Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
