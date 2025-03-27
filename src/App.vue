<template>
  <main class="game">
    <div v-if="isMobileApp" class="island">
    <div class="line"> 
      <h6 style="color: #ffffff;">0 / 1000</h6>
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

</script>

<style scoped>

.button {
  background: #c57f77;
  color: white;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  font-size: 14px;
  height: 24px;
  width: 24px;
}

</style>