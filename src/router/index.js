import { createRouter, createWebHistory } from "vue-router";
import RouteRenderer from "../layouts/system/RouteRenderer.vue";
import store from "@/store/index.js";

const routes = [
	{
		path: "/",
		redirect: "/boxes",
		meta: { requiresAuth: true },
	},
	{
		path: "/boxes",
		name: "boxes",
		component: RouteRenderer,
		meta: { requiresAuth: true },
		children: [
			{
				path: "",
				name: "boxes-overview",
				meta: { requiresAuth: true },
				component: () => import("../layouts/boxes/BoxesOverview.vue"),
			},
			{
				path: "create",
				name: "boxes-create",
				meta: { requiresAuth: true },
				component: () => import("../layouts/boxes/create/CreateBoxes.vue"),
			},
			{
				path: "list",
				name: "boxes-list",
				meta: { requiresAuth: true },
				component: () => import("../layouts/boxes/list/BoxesList.vue"),
			},
			{
				path: "batch-scan",
				name: "boxes-batch-scan",
				meta: { requiresAuth: true },
				component: () => import("../layouts/boxes/runner/RunnerSelectState.vue"),
			},
			{
				path: "scan",
				name: "boxes-scanner",
				meta: { requiresAuth: true },
				component: () => import("../layouts/scanner/Scanner.vue"),
			},
			{
				path: "detail/:id",
				name: "boxes-detail",
				meta: { requiresAuth: true },
				component: () => import("../layouts/boxes/detail/BoxDetail.vue"),
			},
		],
	},
	{
		path: "/flowers",
		name: "flowers",
		component: RouteRenderer,
		meta: { requiresAuth: true },
		children: [
			{
				path: "create",
				name: "flowers-create",
				meta: { requiresAuth: true },
				component: () => import("../layouts/flowers/create/CreateFlowers.vue"),
			},
			{
				path: "edit/:id",
				name: "flowers-edit",
				meta: { requiresAuth: true },
				component: () => import("../layouts/flowers/create/CreateFlowers.vue"),
			},
			{
				path: "list",
				name: "flowers-list",
				meta: { requiresAuth: true },
				component: () => import("../layouts/flowers/list/FlowersList.vue"),
			},
		],
	},
	{
		path: "/parts",
		name: "construction-parts",
		component: RouteRenderer,
		meta: { requiresAuth: true },
		children: [
			{
				path: "detail/:id",
				name: "parts-detail",
				meta: { requiresAuth: true },
				component: () => import("../layouts/construction-parts/PartsDetail.vue"),
			},
			{
				path: "create",
				name: "parts-create",
				meta: { requiresAuth: true },
				component: () => import("../layouts/construction-parts/PartsCreate.vue"),
			},
			{
				path: "edit/:id",
				name: "parts-edit",
				meta: { requiresAuth: true },
				component: () => import("../layouts/construction-parts/PartsCreate.vue"),
			},
			{
				path: "list",
				name: "parts-list",
				meta: { requiresAuth: true },
				component: () => import("../layouts/construction-parts/PartsList.vue"),
			},
		],
	},
	{
		path: "/insight",
		name: "insight",
		meta: { requiresAuth: true },
		component: () => import("../layouts/insights/InsightsOverview.vue"),
	},
	{
		path: "/settings",
		name: "settings",
		meta: { requiresAuth: true },
		component: () => import("../layouts/settings/SettingsOverview.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("../layouts/login/Login.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

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

export default router;
