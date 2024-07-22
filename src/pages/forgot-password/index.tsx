import React from 'react';

import { ArrowLeft } from 'lucide-react';

const ForgotPasswordForm: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-xl w-full mx-auto">
          <a
            href="/login"
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to login
          </a>

          <h2 className="text-3xl font-bold mb-2">Forgot your password?</h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia
          </p>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@gmail.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 p-3 flex items-center justify-center">
        <div className="rounded-lg overflow-hidden">
          <img
            src="public/assets/imgs/forgot-password.svg"
            alt="Forgot Password illustration"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
