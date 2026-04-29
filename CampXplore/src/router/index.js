import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/campsites',
      name: 'campsites',
      component: () => import('@/views/CampsitesView.vue'),
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('@/views/ReservationsView.vue')
    },
    {
      path: '/campsites/:id',
      name: 'CampsiteDetailsView',
      component: () => import('@/views/CampsiteDetailsView.vue'),
      props: true,
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

export default router