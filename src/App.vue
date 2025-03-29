<template>
  <main class="game">
    <div v-if="isMobileApp" class="island">
      <div class="line"> 
        <img 
          src="./assets/money.png" 
          class="icon"
          alt="Иконка"
        />
        <h6 style="color: #ffffff;"> {{ balance.toLocaleString('ru-RU').replace(/\s/g, '.') }}</h6>
        <button 
          @click="navigate"
          class="button"
        >
          +
        </button>
      </div>
    </div> 
    <div class="page">
      <RouterView />
    </div>
    <TheMenu />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheMenu from './components/TheMenu.vue'
import { useTelegram } from './services/telegram'

const { platform } = useTelegram()
const isMobileApp = ['ios', 'android'].includes(platform)

const balance = 1000000;

</script> 

<style scoped>

.icon {
  justify-self: end; /* Иконка прижимается к правому краю первой колонки */
}

h6 {
  text-align: center;
  margin: 0;
}

.button {
  background: #ffffff20;
  color: #00CC66;
  font-size: 24px;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  font-size: 14px;
  height: 100%;
  width: 20px;
  justify-self: start; /* Кнопка прижимается к левому краю третьей колонки */
  margin-left: 10px; /* Отступ от баланса */
}

</style>