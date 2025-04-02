import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
    },
    {
      path: '/game/mine',
      name: 'mine',
      component: () => import('../views/game/paid/MineView.vue'),
    },
    {
      path: '/game/rocket',
      name: 'rocket',
      component: () => import('../views/game/paid/RocketView.vue'),
    },
    {
      path: '/game/coinflip',
      name: 'coinflip',
      component: () => import('../views/game/paid/CoinFlipView.vue'),
    },
    {
      path: '/home/flappy',
      name: 'flappy',
      component: () => import('../views/game/free/1.vue'),
    },
    {
      path: '/home/2',
      name: '2',
      component: () => import('../views/game/free/2.vue'),
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
