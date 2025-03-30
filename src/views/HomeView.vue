<template>
  <div class="home-content">

    <div class="home-container">

      <div class="home-container-header">
        <div class="home-header-text">
          <div class="text1">1-ый день чек-ина</div>
          <div class="text2">23:00</div>
        </div>

        <div class="home-tracker">
          <div class="progress-bar" :style="progressStyle"></div>
        </div> 

        <div class="home-tarcker-text">
          <div class="text3">Игр сыграно</div>
          <div class="text3"> {{ plays }} / 5 </div>
        </div>
      </div>

      <div class="home-container-lower">
        <div class="home-info-container">
          
          <div class="home-info-earned-container">
            <img 
              src="@/assets/star.png" 
              class="icon-star"
              alt="Иконка"
             />
            <div class="home-info-left-element"> {{ earnedStars }} </div>
          </div>

          <div class="home-info-coefficient">x{{ coefficient.toFixed(2) }}</div>
          <button class="home-take-button">
            Забрать
          </button>

        </div>
      </div>
    </div>

    <div class="home-balance-container">
      <div class="home-info-earned-container">
            <img 
              src="@/assets/star.png" 
              class="icon-star"
              alt="Иконка"
             />
            <div class="home-info-left-element"> Star points </div>
      </div>
      <div class="home-info-left-element"> {{ stars.toFixed(2) }} SP </div>
    </div>

    <div class="home-panel"> 

    </div>

    <div class="home-game-container"> 
      <button class="home-game-button" @click="goToGame('rocket')">
        Игра 1
      </button>
      <button @click="plays = Math.min(plays + 1, 5)">+</button>

      <button class="home-game-button" @click="goToGame('2')">
        Игра 2
      </button>

      <button class="home-game-button">
        Игра 3
      </button>

      <button class="home-game-button">
        Игра 4
      </button>
    </div>

  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const stars = 1488;
  const earnedStars = 50
  const coefficient = ref(1.00)
  const plays = ref(0) // Реактивная переменная

  // Вычисляемое свойство для стилей прогресс-бара
  const progressStyle = computed(() => {
    const maxPlays = 5
    const width = (plays.value / maxPlays) * 100
    return { width: `${width}%` }
  })

  // Функция для перехода в игру с указанным названием
  const goToGame = (gameName) => {
  if (window.Telegram?.WebApp?.BackButton) {
    const backButton = window.Telegram.WebApp.BackButton;
    backButton.show();
    backButton.onClick(() => {
      router.push('/');
      backButton.hide();
      backButton.offClick();
    });
  }
    
    router.push(`/home/${gameName}`);
  };

  onMounted(() => {
  if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.BackButton.offClick();
    }
  });

</script>

<style scoped>

.home-content {
  background: none;
  flex: 1 1 auto;
  width: 100vw;
  box-sizing: border-box; /* Важно для корректного расчета размеров */
  padding: 30px 16px 0px 16px; /* верх право низ лево */
}

.home-container {
  position: relative;
  border-radius: 16px;
}

.home-container-header {
  background: linear-gradient(#FF7A7A, #F6DEC1);
  width: 100%;
  height: 95px;
  padding: 10px 15px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 9px 8px #00000025,
    inset 0 0 68px 0 #ffffff05, /* Первый inner shadow */
    inset 0 4px 4px 0 #ffffff25; /* Второй inner shadow */
}

.home-container-lower {
  background: #C8B6A1;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 9px 5px #00000025,
    inset 0 0 68px 0 #ffffff05, /* Первый inner shadow */
    inset 0 4px 4px 0 #ffffff15; /* Второй inner shadow */
}

.home-balance-container {
  background: #666666;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  margin-top: 15px;
  padding-left: 13px;
  padding-right: 15px;
  box-shadow: 0 0 9px 5px #00000025,
    inset 0 0 68px 0 #ffffff05, /* Первый inner shadow */
    inset 0 4px 4px 0 #ffffff10; /* Второй inner shadow */
}

.home-panel {
  background: #413f40;
  width: 100%;
  height: 30px;
  margin-top: 20px;
}

.home-game-container {
  background: none;
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.home-game-button {
  background: #413f4081;
  color: #ffffff;
  width: 100%;
  height: 100px;
  border: none;
  border-radius: 16px;
}

.home-info-container {
  background: #1f1f1f50;
  width: 100%;
  height: 30px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-right: 0px;
  padding-left: 8px;
  border-radius: 16px;
  box-shadow: 0 0 9px 3px #00000040;
}
.home-info-earned-container {
  display: flex;
  align-items: center;
  gap: 3px;
}

.home-info-left-element { 
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding-top: 1px;
}

.home-info-coefficient { 
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding-top: 1px;
}

.home-take-button {
  background: #2e2e2e;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  width: 75px;
  height: 30px;
  border: none;
  border-radius: 32px;
  justify-self: end;
  margin-left: auto;
}

.home-header-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.text1 {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
}

.text2 {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.home-tracker {
  height: 20px;
  background: #413f405b;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 9px 3px #00000040,
    inset 0 4px 4px 0 #413F4015,
    inset 0 4px 4px 0 #413F4010; 
}

.progress-bar {
  background: #413F40;
  height: 20px;
  width: 0;
  border-radius: 32px;
  transition: width 0.3s ease;
}

.home-tarcker-text {
  display: flex;
  justify-content: space-between;
}

.text3 {
  color: #413f40da;
  font-size: 12px;
  font-weight: medium;
}

.home-info-right-element {
  color: #413f40da;
  font-size: 12px;
  font-weight: medium;
}

</style>