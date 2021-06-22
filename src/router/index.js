import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/kratten',
  },
  {
    path: '/kratten',
    name: 'Kratten',
    component: () => import('../layouts/boxes/BoxesOverview.vue')
  },
  {
    path: '/inzicht',
    name: 'Inzicht',
    component: () => import('../layouts/insights/InsightsOverview.vue')
  },
  {
    path: '/instellingen',
    name: 'Instellingen',
    component: () => import('../layouts/settings/SettingsOverview.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
