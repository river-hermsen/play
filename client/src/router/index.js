import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Browse'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },

  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "browse" */ '../views/Home.vue')
  },
  {
    path: '/browse',
    name: 'Browse',
    component: () => import(/* webpackChunkName: "browse" */ '../views/Browse.vue')
  },
  {
    path: '/podcast/:id',
    name: 'Podcast',
    component: () => import(/* webpackChunkName: "podcast" */ '../views/Podcast.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (store.getters.getGenres.length === 0) {
    axios
      .get('https://listen-api.listennotes.com/api/v2/genres', {
        headers: { 'X-ListenAPI-Key': '2e2c4f39b7b44659b73cb3b31f95236e' }
      })
      .then(response => {
        store.commit('setGenres', response.data.genres)
        next()
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    next()
  }
})

export default router
