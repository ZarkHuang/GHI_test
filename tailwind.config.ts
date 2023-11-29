import type { Config } from "tailwindcss"

const config:Config =  {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      fontWeight: {
        'custom-regular-weight': '400', // 中粗體
        'custom-bold-weight': '700', // 粗體
      },

      fontSize: {
        'custom-sm-size': '12px', 
        'custom-md-size': '16px', 
        'custom-lg-size': '20px', 
        'custom-xl-size': '24px', 
      },

      colors: {
       'text-color': '#333', // 自定義文字顏色
       'text-secondary': '#606060', // 自定義文字顏色
       'text-disabled': '#c2c2c2', // 自定義文字顏色
       'text-white': '#fff', // 自定義文字顏色

       'primary': '#2c8eee',
       'primary-hover': '#90c6fb',
       'primary-hover2': '#e4f2ff',
      },

      backgroundColor: {
        'background-white': '#fff',
        'background-grey': '#e3e3e3',
        'background-disabled': '#f6f6f6',
        'background-error': '#ef3e3e',
      },

      borderColor: {
        'border-color': '#d9d9d9',
        'border-color2': '#90c6fb',
        'border-disabled': '#c2c2c2',

      },


      letterSpacing: {
        'custom-spacing': '0.1em',
      },


    },
  },
  plugins: [],
}


export default config