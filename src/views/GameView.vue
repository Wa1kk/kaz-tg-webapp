<template>
    <div class="home-button-container">    
      <RouterLink 
        v-if="!isMineRoute"
        to="/game/mine"
        custom
        v-slot="{ navigate }"
      >
        <button 
          @click="navigate"
          class="home-button"
        >
          Капканчики
        </button>
      </RouterLink>
  
      <!-- Контейнер для дочерних компонентов -->
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import { useRoute, useRouter } from 'vue-router'
  import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
  import GameMenu from '@/components/GameMenu.vue'
  
  export default {
    components: { GameMenu },
    setup() {
      const route = useRoute()
      const router = useRouter()
      const isMineRoute = computed(() => route.path === '/game/mine')
  
      // Функции для управления кнопкой "Назад"
      const setupBackButton = () => {
        if (!window.Telegram?.WebApp?.BackButton) return
        
        const backButton = window.Telegram.WebApp.BackButton
        
        const handleBack = () => {
          router.go(-1)
        }
  
        // Показать/скрыть кнопку при изменении маршрута
        watch(isMineRoute, (isMine) => {
          if (isMine) {
            backButton.show()
            backButton.onClick(handleBack)
          } else {
            backButton.offClick(handleBack)
            backButton.hide()
          }
        })
  
        // Первоначальная настройка
        if (isMineRoute.value) {
          backButton.show()
          backButton.onClick(handleBack)
        }
      }
  
      // Инициализация при монтировании компонента
      onMounted(() => {
        if (window.Telegram?.WebApp) {
          setupBackButton()
        }
      })
  
      // Очистка при демонтировании
      onBeforeUnmount(() => {
        if (window.Telegram?.WebApp?.BackButton) {
          window.Telegram.WebApp.BackButton.hide()
          window.Telegram.WebApp.BackButton.offClick()
        }
      })
  
      return { isMineRoute }
    }
  }
  </script>
  
  <style scoped>
  .container {
    height: 100%;
    width: 100%;
  }
  
  .game-container {
    /* Основные размеры */
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .content {
    margin-top: 60px; /* Высота верхней панели */
    overflow: auto;
  }
  
  .mine-button {
    padding: 12px 24px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .mine-button:hover {
    background: #45a049;
  }
  </style>