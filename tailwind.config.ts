import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#F8FBFF',
          soft: '#EDF7F8',
        },
      },
    }
  },
  plugins: [require("flowbite/plugin")]
};

export default config;
