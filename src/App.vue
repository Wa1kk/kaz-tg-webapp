<template>
  <main class="game" v-if="loaded">
    <div v-if="isMobileApp" class="island">
      <div class="line"> 
        <img 
          src="./assets/money.png" 
          class="icon"
          alt="Иконка"
        />
        <h6 style="color: #ffffff;"> {{ user.money.toLocaleString('ru-RU').replace(/\s/g, '.') }}</h6>
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
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useUserStore  } from '@/stores/score'
const user = useUserStore ()

const { platform } = useTelegram()
const isMobileApp = ['ios', 'android'].includes(platform)

const loaded = ref(false)
const app = useAppStore()

const { tg } = useTelegram()

const urlParams = new URLSearchParams(window.location.search)

app.init(urlParams.get('ref')).then(() => {
  loaded.value = true
})

onMounted(() => {
  tg.ready()
})
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