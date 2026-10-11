import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/scene-flow-chart',
    name: 'flowChart',
    component: () => import('../views/flowChart.vue'),
    meta: { title: '流程图' },
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
