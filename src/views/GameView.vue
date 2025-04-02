<template>
    <div class="home-button-container">    
      
      <button class="home-button" @click="goToGame('mine')">
        Капканчики
      </button>

      <button class="home-button" @click="goToGame('rocket')">
        ВЗОРВАННАЯ ракетка
      </button>

      <button class="home-button" @click="goToGame('coinflip')">
        Дрип или Соус
      </button>

    </div>
  </template>
  
  <script setup>
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    // Функция для перехода в игру с указанным названием
    const goToGame = (gameName) => {
    if (window.Telegram?.WebApp?.BackButton) {
      const backButton = window.Telegram.WebApp.BackButton;
      backButton.show();
      backButton.onClick(() => {
        router.push('/game');
        backButton.hide();
        backButton.offClick();
      });
    }
      
      router.push(`/game/${gameName}`);
    };

    onMounted(() => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick();
      }
    });
  
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