/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    colors: {
      "white": "#FFFFFF",
      "blue": "#176DEE",
      "blue1" : "#ECF3FC",
      "blue2" : "#D4E5FA",
      "red": "#F1414F",
      "black": "##020F21",
      "grey1": "#F9FAFB",
      "grey2": "#D5D8DD",
      "grey3": "#B9BEC6",
      "grey4": "#9DA4AF",
      "grey5": "#818A98",
      "grey6": "#67707E",
      "grey7": "#505762",
      "nero":"#1A1A1A"
    },
    extend: {
      fontFamily: {
        pretendard: "Pretendard-Regular",
        SUIT: "SUIT-Regular",
        sans: "Product Sans",
      },
    },
  },
  plugins: [],
};
