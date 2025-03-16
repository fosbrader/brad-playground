import { defaultExtractor as createDefaultExtractor } from 'tailwindcss/lib/defaultExtractor.js'

const defaultExtractor = createDefaultExtractor({ tailwindContext: {} })

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    extract: {
      DEFAULT: (content) => {
        return defaultExtractor(content)
      },
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
} 