import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/travel-spots',
      name: 'travel-spots',
      component: () => import('@/views/TravelJournal.vue')
    },
    {
      path: '/guestbook',
      name: 'guestbook',
      component: () => import('@/views/GuestbookView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ]
})

export default router
