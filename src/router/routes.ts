const routes  = [
  {
    path: "/",
    redirect: "/login",  // 添加這行來重定向
  },
  {
    path: "/login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path:"/",
    component: ()=> import("@/layouts/MainLayout.vue"),
    children:[
      {
        path: "scene",
        component: () => import("@/pages/Scene.vue"),
      }, 
      {
        path: "project",
        component: () => import("@/pages/Project.vue"), 
      },
      {
        path: "task/:sceneType/:projectId",
        component: () => import("@/pages/IndexPage.vue"),
      },
    ]
  }
];

export default routes;
