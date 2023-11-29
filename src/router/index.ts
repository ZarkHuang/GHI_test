import * as VueRouter from "vue-router";
import { useUserStore } from "@/store/user"; 
import routes from "./routes";


export const router = VueRouter.createRouter({
  // history: VueRouter.createWebHistory(),
  history: VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (to.path !== '/login' && !userStore.checkIsLogin) {
    // 如果用戶未登入且不是前往登入頁面，則重定向到登入頁面
    next('/login');
  } else {
    // 否則正常導航
    next();
  }
});
