/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Indian & Haryanvi Boutique Luxury Palette
        burgundy: {
          50: '#FDF2F4',
          100: '#FBE6E9',
          200: '#F7C2C9',
          300: '#F193A0',
          400: '#E5586E',
          500: '#D22845',
          600: '#B51B35',
          700: '#94142B',
          800: '#751122',
          900: '#58111A', // Royal Sindoor Maroon
          950: '#34060D', // Deep Rajasthani/Haryanvi Maroon
        },
        gold: {
          50: '#FDFCF6',
          100: '#FAF6E6',
          200: '#F4ECC7',
          300: '#EADCA1',
          400: '#DFC876',
          500: '#D4AF37', // Gota Patti Gold
          600: '#BA9422',
          700: '#947215',
          800: '#755813',
          900: '#5F4713',
          950: '#382806',
        },
        haldi: {
          50: '#FFFDF0',
          100: '#FFFAC2',
          400: '#F5C518', // Haldi Peela
          500: '#E5A50A',
          700: '#B87A00',
        },
        mehendi: {
          50: '#F3F8F2',
          100: '#E2F0E0',
          500: '#2E7D32', // Pure Mehendi Green
          800: '#1B5E20',
          900: '#144217',
        },
        rani: {
          500: '#D81B60', // Rani Pink
          600: '#C2185B',
        },
        boutique: {
          50: '#FCFBF9',
          100: '#F7F4EE',
          200: '#EEE7DC',
          300: '#DFD4C4',
          400: '#C5B59E',
          500: '#A9957B',
          600: '#8E7B62',
          700: '#72614D',
          800: '#5B4E3E',
          900: '#4A3F33',
        },
        cream: '#FAF8F5',
        charcoal: {
          DEFAULT: '#1E1E1E',
          soft: '#2D2D2D',
          muted: '#5A5A5A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4ECC7 0%, #D4AF37 50%, #AA820A 100%)',
        'royal-gradient': 'linear-gradient(135deg, #420810 0%, #6E121E 50%, #34060D 100%)',
        'haldi-gradient': 'linear-gradient(135deg, #FFF6D1 0%, #F5C518 50%, #D49B00 100%)',
        'mehendi-gradient': 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #0F3813 100%)',
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(88, 17, 26, 0.12)',
        'gold': '0 6px 20px -4px rgba(212, 175, 55, 0.35)',
        'gota': '0 0 15px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
