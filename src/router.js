import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter(){
  return new Router({
    mode: 'history', //一定要是history模式
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('./views/Home.vue')
      },
      {
        path: '/home',
        name: 'home2',
        component: () => import('./views/Home.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('./views/About.vue')
      },
      {
        path: '/item',
        name: 'item',
        component: () => import('./views/Item.vue')
      }
    ]
  })
}
