import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const TeacherAuthSuccessView: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const extensionId = 'aohajaelhipbamnilfnehkcpecpeacmd';

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      chrome.runtime.sendMessage(extensionId, { type: 'SET_JWT', token: jwt }, response => {
        console.log('Response from background:', response);
      });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jwt'); // Clear the JWT
    navigate('/email-template-management-ui/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-2xl rounded-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
        >
          <CheckCircle className="mx-auto h-20 w-20 text-emerald-400 mb-6" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          Authentication Successful!
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          Your account is ready to use.
        </p>
        <p className="text-md text-gray-400 mb-8">
          You can now close this tab and return to the extension.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="mt-4 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center mx-auto"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
};

export default TeacherAuthSuccessView;
