import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//import About from '../views/About.vue'
import Cook from '../views/Cook.vue'
import Login from '../views/Login.vue'
//import Fail from '../views/Fail.vue'
import Community from '../views/Community.vue'
import Administrator from '../views/Administrator.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
      },
    {
        path: '/Cook',
        name: 'Cook',
        component: Cook
    },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/community',
    name: 'community',
    component: Community
  },
  {
    path: '/admin',
    name: 'admin',
    component: Administrator
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
