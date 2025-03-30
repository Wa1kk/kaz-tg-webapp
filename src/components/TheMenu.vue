<template>
  <div class="menu">
    <RouterLink to="/" custom v-slot="{ navigate }">
      <i
        class="menu-button fa fa-home"
        :class="{ active: isHomeActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/tasks" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-tasks"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/game" custom v-slot="{ navigate }">
      <i
        class="menu-button fa fa-play"
        :class="{ active: isGameActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/friends" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-users"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/profile" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-wallet"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isHomeActive = computed(() => {
  return route.path === '/' || route.path.startsWith('/home')
})

const isGameActive = computed(() => {
  return route.path.startsWith('/game')
})
</script>
