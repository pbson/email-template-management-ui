import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherAuthSuccessView: React.FC = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const extensionId = 'aohajaelhipbamnilfnehkcpecpeacmd';

  //   const jwt = localStorage.getItem('jwt');
  //   if (jwt) {
  //     chrome.runtime.sendMessage(
  //       extensionId,
  //       { type: 'SET_JWT', token: jwt },
  //       (response) => {
  //         console.log('Response from background:', response);
  //       },
  //     );
  //   } else {
  //     window.location.reload();
  //     chrome.runtime.sendMessage(
  //       extensionId,
  //       { type: 'SET_JWT', token: jwt },
  //       (response) => {
  //         console.log('Response from background:', response);
  //       },
  //     );
  //   }
  // }, []);

  // send a message to the background script to set the JWT when the component unmounts

  const handleSignOut = () => {
    localStorage.removeItem('jwt'); // Clear the JWT
    navigate('/login'); // Redirect to the login page
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
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
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 10,
          }}
        >
          <CheckCircle className="mx-auto h-20 w-20 text-emerald-400 mb-6" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-white mb-4">
          <b>Authentication Successful!</b>
        </h2>

        <p className="text-lg text-gray-200 mb-4">
          You can try refresh this page if the extension is not activated and the schedule dashboard not showing up.
        </p>

        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="mt-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center mx-auto"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="mt-4 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center mx-auto"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherAuthSuccessView;
