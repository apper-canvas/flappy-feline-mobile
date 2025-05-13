import React from 'react';
import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const AlertTriangleIcon = getIcon('AlertTriangle');

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-100 dark:bg-surface-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <AlertTriangleIcon className="w-24 h-24 text-primary animate-pulse" />
        </div>
        
        <h1 className="font-game text-3xl md:text-4xl mb-4 text-surface-800 dark:text-surface-200">
          404
        </h1>
        
        <div className="bg-white dark:bg-surface-800 p-6 md:p-8 rounded-2xl shadow-neu-light dark:shadow-neu-dark mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-surface-800 dark:text-surface-200">
            Page Not Found
          </h2>
          
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Oops! It seems our cat flew too far and got lost. The page you are looking for doesn't exist.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Return to game
          </Link>
        </div>

        <div className="w-64 h-64 mx-auto relative">
          <div className="absolute w-20 h-20 bottom-0 left-1/2 transform -translate-x-1/2">
            <img 
              src="https://pixabay.com/get/g35ca6e8a1caaba82142ad45a3b823d97c85f22edfe75e5b7e1f16cd118c8a9ab0de59ddbd4a60f9ba94ff5264ce27dd5_640.png" 
              alt="Lost cat" 
              className="w-full h-full object-contain transform rotate-45 animate-bounce"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;