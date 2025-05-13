/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          light: '#FF9B9B',
          dark: '#D14545'
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#A0E7E2',
          dark: '#3AA99F'
        },
        accent: '#FFD166',
        surface: {
          50: '#f8fafc',   // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',  // Added
          500: '#64748b',  // Added
          600: '#475569',  // Added
          700: '#334155',  // Added
          800: '#1e293b',  // Added
          900: '#0f172a'   // Darkest
        }      
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui'],
        game: ['"Press Start 2P"', 'cursive']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      backgroundImage: {
        'pixel-sky': "url('https://pixabay.com/get/ge6b14d2d85613b10a5cf04e5ca5ac32e05eeec88df6c2be1c64c91e0c57d62f1a0c2ae037ff1e5b0d1b6e6f0c89f1c3c_1280.jpg')",
        'pixel-ground': "url('https://pixabay.com/get/g6e0c9f8fea5f49c54cdfd8a6d03b0a61a0d4b2cf89b96d21c4d84b4d97c6e36a0ad08ff81da1bd3bc5c00e26f2c8dd7e_1280.jpg')"
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}