/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        light: "0 0 10px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
};

module.exports = config;
