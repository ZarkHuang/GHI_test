import { createApp } from "vue";
import App from "@/App.vue";
import '@/style.css'
import "../src/assets/public.css"
import {router} from "@/router/index";
import {createPinia} from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
 
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "@/plugins/fontawsome";

import naive from 'naive-ui'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'


const pinia = createPinia()

createApp(App).use(router).use(pinia).use(naive).use(vue3GoogleLogin, {
    clientId: '751211245741-h2jf86cjlr8fc77hk51pqul99mjv1ceb.apps.googleusercontent.com'
  }).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
