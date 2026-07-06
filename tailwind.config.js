/** @type {import('tailwindcss').Config} */
// Custom design tokens (colors like bg-surface, spacing like px-margin-mobile,
// and the typography utility classes) are defined in css/styles.css, not here.
// This config only controls which files are scanned for real Tailwind classes.
// Rebuild after adding new Tailwind classes: npm run build:css
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
