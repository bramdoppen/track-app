import { createRouter, createWebHistory } from 'vue-router'
import RouteRenderer from "../layouts/system/RouteRenderer.vue";

const routes = [
  {
    path: '/',
    redirect: '/kratten',
    meta: { requiresAuth: true },
  },
  {
    path: '/kratten',
    name: 'Kratten',
    component: RouteRenderer,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'boxes-overview',
        meta: { requiresAuth: true },
        component: () => import('../layouts/boxes/BoxesOverview.vue'),
      },
      {
        path: 'nieuw',
        name: 'boxes-create',
        meta: { requiresAuth: true },
        component: () => import('../layouts/boxes/create/CreateBoxes.vue'),
      },
      {
        path: 'list',
        name: 'boxes-list',
        meta: { requiresAuth: true },
        component: () => import('../layouts/boxes/list/BoxesList.vue'),
      },
    ]
  },
  {
    path: '/inzicht',
    name: 'Inzicht',
    meta: { requiresAuth: true },
    component: () => import('../layouts/insights/InsightsOverview.vue')
  },
  {
    path: '/instellingen',
    name: 'Instellingen',
    meta: { requiresAuth: true },
    component: () => import('../layouts/settings/SettingsOverview.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
