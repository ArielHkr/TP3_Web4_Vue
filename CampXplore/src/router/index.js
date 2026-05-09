import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

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
      component: () => import('@/views/ReservationsView.vue'),
      meta: {requiresAuth: true}

    },
    {
      path: '/campsites/:id',
      name: 'CampsiteDetailsView',
      component: () => import('@/views/CampsiteDetailsView.vue'),
      props: true,
      meta: {requiresAuth: true}
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
       path: '/reservations/:id',
       name: 'ReservationDetails',
       component: () => import('@/views/ReservationDetails.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/profil',
      name: 'profil',
      component:() => import('@/views/Profil.vue'),
      meta: {requiresAuth: true}
    },
    {
      path:'/resetPassword',
      name:'resetPassword',
      component: () => import('@/views/ResetPassword.vue'),
      meta: {requiresAuth: true}
    },
    {
      path:'/AdminReservations',
      name:'AdminReservations',
      component: () => import('@/views/GestionReservations.vue'),
      meta: {requiresAuth: true, role: 'admin'}

    },
    {
      path:'/forbidden',
      name:'Forbidden',
      component: () => import('@/views/Forbidden.vue'),
    },
  ],
})
router.beforeEach((to) => {
  const token = localStorage.getItem('token');

  if (!token) {
    if (to.meta.requiresAuth) {
      return {
        name: 'Login',
        query: { redirect: to.fullPath },
      };
    }

    return true;
  }

  const decoded = jwtDecode(token);
  const role = decoded.role;

  if (to.meta.role && role !== to.meta.role) {
    return {
      name: 'Forbidden',
    };
  }

  return true;
});

export default router