<template>
  <div class="main-container">
    <!-- Win Notification -->
    <transition name="fade">
  <div 
    v-if="showWinNotification" 
    class="win-notification"
    :style="notificationStyle"
  >
    <div class="win-amount">Ваш выигрыш: {{ winDetails.amount }} ₽</div>
    <div class="win-multiplier">×{{ winDetails.multiplier.toFixed(2) }}</div>
  </div>
</transition>

    <!-- Balance -->
  <div 
    class="balance-box" 
    ref="balanceBox"
  >
    <div class="balance-content">
      <div class="balance-label">Ваш баланс:</div>
      <div class="balance-value">{{ user.money.toLocaleString('ru-RU') }} ₽</div>
    </div>
  </div>

  <!-- Game Grid -->
  <div class="grid">
      <div 
        v-for="(cell, index) in grid" 
        :key="index"
        class="cell"
        :class="{
          'revealed': revealed.includes(index),
          'mine': (gameOver || isCashOut) && cell,
          'inactive': !isGameActive
        }"
        @click="isGameActive ? revealCell(index) : null"
      >
        <template v-if="revealed.includes(index)">
          💎
        </template>
        <template v-else-if="gameOver && cell">
          🪤
        </template>
        <template v-else-if="isCashOut && cell">
          🪤
        </template>
      </div>
    </div>
    
  <div class="container-two">
    <!-- Info Container -->
    <div class="info-container">
      <div v-if="!isGameActive" class="info-box">
        <div class="info-item">
          <div class="info-label">Макс. выигрыш</div>
          <div class="info-value">{{ maxWin }} ₽</div>
        </div>
        <div class="info-item">
          <div class="mine-select">
            <div class="mine-controls">
              <button 
                class="mine-btn"
                @click="decreaseMines"
                :disabled="mines <= 1"
              ><</button>
              
              <div class="mine-display">
                <div class="mine-value">{{ mines }}</div>
                <div class="mine-label">капканов</div>
              </div>
              
              <button 
                class="mine-btn"
                @click="increaseMines"
                :disabled="mines >= 24"
              >></button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="info-box">
        <div class="info-item">
          <div class="info-label">Следующий шаг</div>
          <div class="info-value">{{ nextStepWin }} ₽</div>
        </div>
        <div class="multiplier-box">
          <div class="current-multiplier">×{{ multiplier.toFixed(2) }}</div>
          <div v-if="nextMultiplier" class="next-multiplier">
            ×{{ nextMultiplier.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bet Container -->
    <div class="bet-container">
      <div class="bet-controls">
        <button 
          class="bet-btn"
          @click="decreaseBet"
          :disabled="bet <= 100 || isGameActive"
        >-</button>
        
        <div class="bet-display">
          <input 
            type="number" 
            v-model.number="bet" 
            :min="1" 
            :max="user.money" 
            :disabled="isGameActive"
            class="bet-input"
            @change="validateBet"
            @blur="restoreScroll"
            @keyup.enter="handleEnterKey"
          />
          <div v-if="isGameActive" class="bet-label">Ваша ставка:</div>
      
        </div>
        
        <button 
          class="bet-btn"
          @click="increaseBet"
          :disabled="isGameActive"
        >+</button>
      </div>
      
      <button 
        class="action-btn"
        :class="{ 'cash-out-btn': isGameActive }"
        @click="isGameActive ? cashOut() : startGame()"
      >
        <div v-if="isGameActive" class="cash-out-content">
          <div class="cash-out-amount">{{ currentWin }} ₽</div>
          <div class="cash-out-text">Забрать</div>
        </div>
        <span v-else>Играть</span>
      </button>
    </div>
  </div>
</div>
</template>

<script>
import { useUserStore  } from '@/stores/score'
import { ref, computed, onMounted, onUpdated } from 'vue';

const formatWin = (value) => {
  // Форматируем с двумя десятичными знаками
  let formatted = value.toFixed(2);
  
  // Удаляем лишние нули и возможную точку
  formatted = formatted.replace(/\.?0+$/, '');
  
  // Добавляем разделитель тысяч при необходимости
  return formatted.replace(/* /\B(?=(\d{3})+(?!\d))/g, ' ' */);
};

export default {
  setup() {
    const user = useUserStore();
    const bet = ref(10);
    const mines = ref(5);
    const grid = ref(Array(25).fill(false));
    const isGameStarted = ref(false);
    const revealed = ref([]);
    const multiplier = ref(1);
    const gameOver = ref(false);
    const isCashOut = ref(false);
    const showWinNotification = ref(false);
    const winDetails = ref({ amount: 0, multiplier: 1 });
    const balanceBox = ref(null);
    const notificationStyle = ref({
      width: '0px',
      height: '0px',
      top: '0px',
      left: '0px'
    });

    const updateNotificationPosition = () => {
      if (balanceBox.value) {
        const rect = balanceBox.value.getBoundingClientRect();
        notificationStyle.value = {
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          top: `${rect.top}px`,
          left: `${rect.left}px`
        };
      }
    };

    onMounted(() => {
      updateNotificationPosition();
      window.addEventListener('resize', updateNotificationPosition);
    });

    onUpdated(() => {
      updateNotificationPosition();
    });


    const isGameActive = computed(() => 
      isGameStarted.value && !gameOver.value && !isCashOut.value
    );

    const multipliers = {
      1: [1.03, 1.07, 1.12, 1.17, 1.23, 1.3, 1.38, 1.47, 1.57, 1.68, 1.77, 1.87, 1.97, 2.08, 2.2, 2.32, 2.45, 2.59, 2.73, 2.88, 3.04, 3.21, 3.39, 3.58],
        2: [1.06, 1.13, 1.21, 1.3, 1.4, 1.52, 1.65, 1.8, 1.97, 2.17, 2.35, 2.54, 2.75, 2.98, 3.23, 3.5, 3.79, 4.1, 4.44, 4.81, 5.21, 5.64, 6.11],
        3: [1.09, 1.24, 1.43, 1.65, 1.93, 2.27, 2.69, 3.23, 3.92, 4.83, 5.7, 6.73, 7.94, 9.37, 11.06, 13.05, 15.4, 18.18, 21.46, 25.33, 29.9, 35.29],
        4: [1.12, 1.29, 1.5, 1.76, 2.08, 2.48, 2.98, 3.62, 4.44, 5.52, 6.59, 7.87, 9.4, 11.23, 13.41, 16.01, 19.12, 22.83, 27.26, 32.56, 38.88],
        5: [1.19, 1.51, 1.93, 2.49, 3.27, 4.36, 5.92, 8.2, 11.62, 16.9, 25.34, 39.42, 64.06, 89.57, 125.24, 175.11, 244.84, 342.33, 478.64, 669.23],
        6: [1.25, 1.65, 2.2, 2.95, 3.99, 5.45, 7.52, 10.5, 14.88, 21.45, 29.43, 40.38, 55.4, 76.01, 104.28, 143.07, 196.28, 269.28, 369.44],
        7: [1.32, 1.86, 2.68, 3.93, 5.89, 9.11, 14.43, 23.6, 40.13, 71.34, 133.76, 213.14, 339.62, 541.16, 862.3, 1374.02, 2189.41, 3488.68],
        8: [1.4, 2.05, 3.05, 4.6, 7.03, 10.89, 17.15, 27.6, 45.4, 76.5, 119.44, 186.48, 291.15, 454.57, 709.72, 1108.09, 1730.07],
        9: [1.48, 2.25, 3.47, 5.42, 8.6, 13.85, 22.7, 38.0, 65.2, 114.5, 185.83, 301.59, 489.47, 794.39, 1289.26, 2092.41],
        10: [1.55, 2.45, 3.95, 6.45, 10.65, 17.9, 30.7, 53.8, 96.5, 176.0, 298.08, 504.84, 855.02, 1448.1, 2452.56],
        11: [1.71, 2.7, 4.35, 7.1, 11.72, 19.69, 33.77, 59.18, 106.15, 193.6, 327.89, 555.32, 940.52, 1592.91],
        12: [1.88, 2.97, 4.79, 7.81, 12.89, 21.66, 37.15, 65.1, 116.77, 212.96, 360.68, 610.85, 1034.57],
        13: [2.07, 3.27, 5.27, 8.59, 14.18, 23.83, 40.87, 71.61, 128.45, 234.26, 396.75, 671.94],
        14: [2.28, 3.6, 5.8, 9.45, 15.6, 26.21, 44.96, 78.77, 141.29, 257.69, 436.42],
        15: [2.51, 3.96, 6.38, 10.39, 17.16, 28.83, 49.46, 86.65, 155.42, 283.46],
        16: [2.76, 4.36, 7.02, 11.43, 18.88, 31.71, 54.41, 95.32, 170.96],
        17: [3.04, 4.8, 7.72, 12.57, 20.77, 34.88, 59.85, 104.85],
        18: [3.34, 5.28, 8.49, 13.83, 22.85, 38.37, 65.84],
        19: [3.67, 5.81, 9.34, 15.21, 25.14, 42.21],
        20: [4.04, 6.39, 10.27, 16.73, 27.65],
        21: [4.44, 7.03, 11.3, 18.4],
        22: [4.88, 7.73, 12.43],
        23: [5.37, 8.5, 15.0],
        24: [25.0]
    };

    const handleEnterKey = (event) => {
      validateBet();
      event.target.blur();
      // Принудительно скрываем клавиатуру
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    };

    const restoreScroll = () => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        document.activeElement.blur();
      }, 100);
    };

    const startGame = () => {
      if (bet.value > user.money) return;
      isGameStarted.value = true;
      user.minusMoney(bet.value);
      revealed.value = [];
      grid.value = Array(25).fill(false);
      const mineIndexes = new Set();
      while (mineIndexes.size < mines.value) {
        mineIndexes.add(Math.floor(Math.random() * 25));
      }
      mineIndexes.forEach(index => grid.value[index] = true);
      multiplier.value = 1;
      gameOver.value = false;
      isCashOut.value = false;
    };

    const revealCell = (index) => {
      if (gameOver.value || isCashOut.value || revealed.value.includes(index)) return;
      
      if (grid.value[index]) {
        gameOver.value = true;
        isCashOut.value = false;
        return;
      }
      
      revealed.value.push(index);
      multiplier.value = multipliers[mines.value][revealed.value.length - 1] || 1;

      // Автоматический кэшаут при победе
      if (revealed.value.length === 25 - mines.value) {
        cashOut();
      }
    };

    const cashOut = () => {
      const winAmount = bet.value * multiplier.value;
      user.addMoney(winAmount);
      isCashOut.value = true;
      gameOver.value = false;
      updateNotificationPosition();
      // Показываем уведомление
      winDetails.value = {
        amount: winAmount.toLocaleString('ru-RU'),
        multiplier: multiplier.value
      };
      showWinNotification.value = true;
      
      // Автоматическое скрытие через 3 секунды
      setTimeout(() => {
        showWinNotification.value = false;
      }, 4000);

    };
    
    const maxWin = computed(() => {
      const maxMultiplier = multipliers[mines.value]?.[24 - mines.value] || 1;
      return Math.floor(bet.value * maxMultiplier).toLocaleString('ru-RU');
    });

    const nextStepWin = computed(() => {
      return formatWin(bet.value * nextMultiplier.value);
    });

    const currentWin = computed(() => {
      return formatWin(bet.value * multiplier.value);
    });

    const nextMultiplier = computed(() => {
      const currentLevel = revealed.value.length;
      return multipliers[mines.value]?.[currentLevel] || null;
    });

    const increaseBet = () => {
      const newValue = bet.value + 100;
      bet.value = Math.min(newValue, user.money);
    };

    const decreaseBet = () => {
      const newValue = bet.value - 100;
      bet.value = Math.max(newValue, 1);
    };

    const validateBet = () => {
      if (bet.value > user.money) {
        bet.value = user.money;
      }
      if (bet.value < 1) {
        bet.value = 1;
      }
    };

    const increaseMines = () => {
      if (mines.value < 24) mines.value++;
    };

    const decreaseMines = () => {
      if (mines.value > 1) mines.value--;
    };

    return { 
      user, bet, mines, grid, revealed, multiplier, 
      gameOver, isCashOut, isGameActive, startGame, 
      revealCell, cashOut, isGameStarted, nextMultiplier,
      currentWin, nextStepWin, maxWin, increaseMines,
      decreaseMines, increaseBet, decreaseBet, validateBet,
      handleEnterKey, restoreScroll, showWinNotification, 
      winDetails, balanceBox, notificationStyle
    };
  },
};

</script>

<style scoped>

/* Главная форма */
.container {
  background: linear-gradient(#EA9D9D, #EABA9D, #EABA9D, #EABA9D, #EA9D9D);
  padding: 16px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  justify-content: space-between;
}

.win-notification {
  position: fixed;
  background: #10b981;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  animation: slideIn 0.3s ease-out;
  pointer-events: none;
}

.win-notification-hide {
  animation: slideOut 0.3s ease-in forwards;
}

.win-amount {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
}

.win-multiplier {
  background: #059669;
  padding: 6px 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  justify-content: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* Баланс */
.balance-box {
  background: #2d3a4f;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  padding: 10px 14px;
  border-radius: 12px;
}

.balance-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.balance-label {
  color: #7dd3fc;
  font-size: 14px;
}

.balance-value {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

/* Контейнер поля и управления */

.container-two {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 0 auto;
  width: 85%;
  max-width: 600px;
  height: auto;
}

.cell {
  aspect-ratio: 1;
  background: #2d3a4f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: 0.2s;
}

.revealed {
  background: linear-gradient(145deg, #10b981, #059669);
  cursor: default;
}

.mine {
  background: linear-gradient(145deg, #ef4444, #dc2626);
  cursor: default;
}



/* Взаимодействие мышкой с полем*/
.cell:active:not(.revealed):not(.mine) {
  transform: scale(0.95);
  opacity: 0.5;
  background: #334155;
}

.cell:hover:not(.revealed):not(.mine) {
  transform: scale(1.05);
  opacity: 0.5;
  background: #334155;
}

.cell.inactive:not(.revealed):not(.mine) {
  opacity: 0.6;
  pointer-events: none; 
}

.cell.inactive:hover {
  transform: none !important;
  cursor: default;
}



/* Информация */
.info-container {
  background: #2d3a4f;
  border-radius: 12px;
  padding: 10px 14px;
  /* justify-content: space-between; */
  height: 55px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.info-box {
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.info-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.info-label {
  color: #94a3b8;
  font-size: 12px;
}

.info-value {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.mine-select {
  background: #1a2332;
  border-radius: 10px;
  padding: 6px;
}

.mine-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mine-btn {
  background: none;
  border: none;
  color: #7dd3fc;
  font-size: 22px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mine-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.mine-btn:not(:disabled):hover {
  background: rgba(125, 211, 252, 0.1);
}

.mine-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.mine-value {
  color: #fff;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
}

.mine-label {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 2px;
}

.multiplier-box {
  background: rgba(125, 211, 252, 0.1);
  border-radius: 10px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.current-multiplier {
  color: #7dd3fc;
  font-size: 18px;
  font-weight: 700;
}

.next-multiplier {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); opacity: 0.8; }
}



/* Ставка / Игра */
.bet-container {
  display: flex;
  background: #2d3a4f;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  padding: 10px 14px;
  border-radius: 12px;
  justify-content: space-between;
  height: 70px;
  gap: 8px;
}

.bet-controls {
  display: flex;
  background: #1a2332;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 10px;
  padding: 8px;
  height: 100%;
  width: 100%;
}

.bet-btn {
  background: rgba(125, 211, 252, 0.1);
  border: none;
  color: #7dd3fc;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.bet-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.bet-btn:not(:disabled):hover {
  background: rgba(125, 211, 252, 0.2);
}

.bet-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.bet-input {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  text-align: center;
  font-weight: 600;
  width: 100%;
  outline: none;
}

.bet-input:disabled {
  opacity: 0.7;
}

.bet-label {
  color: #94a3b8;
  font-size: 10px;
  text-align: center;
}

.action-btn {
  background: linear-gradient(#fa9b0d, #e29e0c);
  color: #fff;
  border: none;
  border-radius: 10px;
  min-width: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cash-out-btn {
  background: #10b981;
}

.cash-out-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cash-out-amount {
  font-size: 16px;
  font-weight: 700;
}

.cash-out-text {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}

.action-btn:active {
  transform: scale(0.98);
}

.bet-input::-webkit-outer-spin-button,
.bet-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>