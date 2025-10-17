/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-emerald-400',
    'text-cyan-400',
    'text-amber-300',
    'bg-[var(--accent-green)]',
    'text-yellow-300',
    'text-rose-400',
    'text-red-500',
    'font-semibold',
    'text-emerald-300',
    'text-sky-400',
  ],
  theme: {
    // extend: {
    //   colors: {
    //     "red": {
    //       DEFAULT: '#e7000b',
    //       light: "#e7000b"
    //     }
    //   }
    // },
  },
  plugins: [],
};
