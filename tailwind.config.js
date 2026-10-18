/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pop_culture_makhana_full_animation_launch_experience (3).tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        lilita: ['Lilita One', 'cursive'],
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
