import { defineConfig,loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader';
import path from "path";

export default defineConfig({
  plugins: [vue(),svgLoader() ],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  server:{
    proxy:{
      '/api':{
        target: loadEnv('', process.cwd()).VITE_APP_URL,
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\api/,'')
      }
    }
  },
  
});
