import { createRouter, createWebHashHistory } from "vue-router";
import { getToken, clearToken } from "@/scripts/methods";

const routes = [
  {
    path: "/",
    component: () => import("../views/LayoutView.vue"),
    children: [
      {
        path: "",
        name: "DynamicWallView",
        component: () => import("../views/front/DynamicWallView.vue"),
      },
      {
        path: "profile",
        name: "ProfileView",
        component: () => import("../views/front/ProfileView.vue"),
      },
      {
        path: "createpost",
        name: "CreatePostView",
        component: () => import("../views/front/CreatePostView.vue"),
      },
      {
        path: "singlepost/:id",
        name: "SinglePostView",
        component: () => import("../views/front/SinglePostView.vue"),
      },
    ],
  },
  {
    path: "/signin",
    name: "SignInView",
    component: () => import("../views/SignInView.vue"),
  },
  {
    path: "/signup",
    name: "SignUpView",
    component: () => import("../views/SignUpView.vue"),
  },
  {
    path: "/:pathMath(.*)*",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkExactActiveClass: "active",
  routes,
});

router.beforeEach((to) => {
  // 判斷 token 及前往頁面來決定是否導向登入頁、註冊頁、忘記密碼頁、重設密碼頁

  const token = getToken();

  if (token == "" && to.name !== "SignInView" && to.name !== "SignUpView") {
    clearToken();
    return { name: "SignInView" };
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
