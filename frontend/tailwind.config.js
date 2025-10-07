/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-emerald-400','text-cyan-400','text-amber-300','text-yellow-300',
    'text-rose-400','text-red-500','font-semibold','text-emerald-300','text-sky-400'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
