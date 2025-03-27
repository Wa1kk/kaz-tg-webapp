<template>
  <div class="menu">
    <RouterLink to="/" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-home"
        :class="{ active: isActive }"
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

    <RouterLink to="/game" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-play"
        :class="{ active: isActive }"
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

<script>
import { RouterLink } from 'vue-router'
</script>
