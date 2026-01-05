import { createRouter, createWebHistory } from 'vue-router'
import SimpleHome from '../components/SimpleHome.vue'
import DaftarDiskon from '../views/DaftarDiskon.vue'

const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: SimpleHome,
//   },
  {
    path: '/',
    name: 'DaftarDiskon',
    component: DaftarDiskon,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router