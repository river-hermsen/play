import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./views/auth/Login.vue";
import SignUp from "./views/auth/SignUp.vue";
import ForgotPassword from "./views/auth/ForgotPassword.vue";
import ConfirmEmail from "./views/auth/ConfirmEmail.vue";

import store from "./store";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: {
        name: "browse"
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
        isLoginSignUp: true
      }
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignUp,
      meta: {
        requiresAuth: false,
        isLoginSignUp: true
      }
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: ForgotPassword,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/confirmemail",
      name: "ConfirmEmail",
      component: ConfirmEmail,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/browse",
      name: "browse",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Browse.vue"),
      meta: {
        requiresAuth: true
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoginSignUp = to.matched.some(record => record.meta.isLoginSignUp);
  const isLoggedIn = store.state.isLoggedIn;

  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (isLoginSignUp && isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
