<template>
  <div class="profile-content">
    <div class="mini-profile-container">
      <div class="mini-profile">
        <img src="@/assets/kaz.png" class="profile-img">
           <div class="profile-name">
              <h2> {{ user.first_name }} </h2>
           </div>
      </div>
      <div class="mini-profile-button-container">
        <div class="mini-profile-button">
          <button> <h3> Вывод </h3></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/stores/score'

  const user = useUserStore();


</script>

<style scoped>

.profile-content {
  background: none;
  width: 100vw;
  padding: 30px 16px 0px 16px; /* верх право низ лево */
}

.mini-profile-container {
  background: #000000;
  width: 100%;
  display: grid;
  gap: 15px;
}

.mini-profile {
  background: #ffffff;
  width: 100%;
  height: 64px;
  display: flex;
  gap: 15px;
}

.profile-img {
  width: 64px;
  height: 64px;
}

.profile-name {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.mini-profile-button-container {
  background: #ffffff;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: right;
  align-items: center;
}

.mini-profile-button {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: right;
  margin-right: 15px;
}

</style>