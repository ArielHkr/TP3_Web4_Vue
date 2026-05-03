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
    }
  ],
})

router.beforeEach((to) =>{
      const token = localStorage.getItem('token');
      if(!token && to.meta.requiresAuth){
        return {
          name: 'Login',
          query: { redirect: to.fullPath },
       }
      }
}
)
export default router