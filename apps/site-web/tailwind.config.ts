import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#eef4ff",
        line: "#d6e0f0",
        accent: "#0f766e",
        sunrise: "#f97316",
      },
      boxShadow: {
        float: "0 24px 80px rgba(16, 32, 51, 0.12)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
