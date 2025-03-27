import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        { path: '', name: '1', component: () => import('../views/home/1.vue') }
      ]
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
      children: [
        { path: 'mine', name: 'mine', component: () => import('../views/game/MineView.vue') }
      ]
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
  ],
})

export default router
