import { createRouter, createWebHistory } from 'vue-router'
import RouteRenderer from "../layouts/system/RouteRenderer.vue";
import store from "@/store/index.js"

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
  {
    path: '/login',
    name: 'Login',
    component: () => import('../layouts/login/Login.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Redirect to login page when not authenticated
router.beforeEach((to, from, next) => {
	let isLoggedIn = store.state.user !== null;

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (!isLoggedIn) {
			next({
				path: "/login",
				query: { redirect: to.fullPath },
			});
		} else {
			next();
		}
	} else {
		next(); 
	}

});


export default router
