import React from 'react';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const VolumeIcon = getIcon('Volume2');
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const GithubIcon = getIcon('Github');

function Home() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 md:py-4 bg-primary dark:bg-surface-800 shadow-md relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-game text-white dark:text-primary-light tracking-wide">
            Flappy Feline
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" 
              aria-label="Toggle sound"
            >
              <VolumeIcon className="w-5 h-5 text-white" />
            </button>
            <button 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" 
              aria-label="Toggle theme"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? 
                <SunIcon className="w-5 h-5 text-white" /> : 
                <MoonIcon className="w-5 h-5 text-white" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <MainFeature />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-200 dark:bg-surface-800 py-4 md:py-6 shadow-inner">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="mb-2 text-surface-600 dark:text-surface-400">
            Made with 😺 for cat lovers everywhere
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-primary transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;