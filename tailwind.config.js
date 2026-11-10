/** @type {import('tailwindcss').Config} */
// Custom design tokens (colors like bg-surface, spacing like px-margin-mobile,
// and the heading classes text-headline-lg / text-headline-md) are defined in
// css/styles.css, not here. Other font-*/text-* tokens in the HTML are unstyled placeholders.
// This config only controls which files are scanned for real Tailwind classes.
// Rebuild after adding new Tailwind classes: npm run build:css
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
