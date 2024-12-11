const { join } = require('path')

/** @return {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, './src/**/!(*.stories|*.spec).{ts,html}')],
  important: true,
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
