import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/earlier',
    name: 'Earlier',
    component: () =>
      import(/* webpackChunkName: "earlier" */ '../views/Earlier.vue'),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () =>
      import(/* webpackChunkName: "manage" */ '../views/Manage.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
