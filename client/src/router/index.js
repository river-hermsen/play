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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/browse',
    name: 'Browse',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Browse.vue')
  },
  {
    path: '/search',
    name: 'Search',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue')
  },
  {
    path: '/podcast/:id',
    name: 'Podcast',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Podcast.vue')
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
