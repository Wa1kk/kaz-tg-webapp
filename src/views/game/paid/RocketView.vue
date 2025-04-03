<template>
  <div class="container">
    <div class="game-area">
      <div v-if="result" class="result-display glow">
        {{ resultMessage }}
      </div>
      <div v-else class="multiplier-display glow">
        <div class="current-multiplier">{{ currentMultiplier.toFixed(2) }}x</div>
        <div class="target-cashout" v-if="autoCashout">Цель: {{ autoCashout }}x</div>
      </div>

      <div class="flight-area">
        <div class="stars"></div>
        <div 
          class="rocket"
          :style="rocketPosition"
          :class="{ crashed: !isPlaying && result === 'crash' }"
        >
          <div class="flame"></div>
          🚀
        </div>
      </div>

      <div class="controls">
        <div class="input-group">
          <input v-model.number="bet" type="number" min="1" :max="user.money" placeholder="Сумма ставки" 
          ref="betInput"
          @blur="resetFormPosition"
          @keyup.enter="handleBetInput">
          <span class="input-icon">₽</span>
        </div>
        <div class="input-group">
          <input v-model.number="autoCashout" type="number" min="1" step="0.1" placeholder="Автовывод"
          ref="autoCashoutInput"
          @blur="resetFormPosition"
          @keyup.enter="handleAutoCashoutInput">
          <span class="input-icon">×</span>
        </div>
        <button v-if="!isPlaying" @click="startGame" :disabled="!bet" class="neon-button">
          <span class="neon-text">СТАРТ</span>
        </button>
        <button v-if="isPlaying && result === null" @click="cashOut" class="cashout-neon-button">
          ЗАБРАТЬ {{ (bet * currentMultiplier).toFixed(2) }}₽
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/score'

export default {
  setup() {
    const user = useUserStore();
    return { user };
  },
  data() {
    return {
      bet: null,
      autoCashout: null,
      isPlaying: false,
      currentMultiplier: 1,
      crashMultiplier: 1,
      result: null,
      intervalId: null,
    };
  },
  computed: {
    rocketPosition() {
      return { bottom: `${Math.min(this.currentMultiplier / 20 * 100, 100)}%` };
    },
    resultMessage() {
      if (this.result === 'cashout') {
        return `💰 Вы забрали ${(this.bet * this.currentMultiplier).toFixed(2)}₽!`;
      }
      if (this.result === 'crash') {
        return `💥 Краш! Ракета упала на ${this.currentMultiplier.toFixed(2)}x`;
      }
      return '';
    }
  },
  methods: {
    handleBetInput() {
        this.$refs.betInput.blur();
    },

    handleAutoCashoutInput() {
        this.$refs.autoCashoutInput.blur();
    },
      
    resetFormPosition() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    startGame() {
        if (this.isPlaying || this.bet > this.user.money || this.bet <= 0) return;
        this.user.minusMoney(this.bet);
        this.isPlaying = true;
        this.result = null;
        this.currentMultiplier = 1;
        this.crashMultiplier = this.generateCrashPoint();

        this.intervalId = setInterval(() => {
          this.currentMultiplier += 0.01;
          if (this.autoCashout && this.currentMultiplier >= this.autoCashout) {
            this.cashOut();
          }
          if (this.currentMultiplier >= this.crashMultiplier) {
            this.gameCrash();
          }
        }, 90);
      },
    cashOut() {
      if (!this.isPlaying) return;
      this.result = 'cashout';
      this.isPlaying = false;
      this.user.addMoney(this.bet * this.currentMultiplier);
      clearInterval(this.intervalId);
    },
    gameCrash() {
      this.result = 'crash';
      this.isPlaying = false;
      clearInterval(this.intervalId);
    },
    generateCrashPoint() {
  const random = Math.random(); // Генерируем число от 0 до 1

  if (random < 0.5) {
    return 1 + Math.random(); // 50% шанс: 1x - 2x
    } else if (random < 0.9) {
      return 2 + Math.random() * 2; // 40% шанс: 2x - 4x
    } else {
      return 4 + Math.random() * 96; // 10% шанс: 4x - 100x
    }
  }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at center, #0f172a, #020617);
  height: 100%;
  width: 100%;
}

.game-area {
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(71, 85, 105, 0.3);
  box-shadow: 0 0 40px rgba(14, 165, 233, 0.1);
}

.multiplier-display {
  position: relative;
  font-size: 1.5rem;
  font-weight: 800;
  color: #38bdf8;
  text-align: center;
  padding: 0.5rem;
  background: rgba(2, 6, 23, 0.6);
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.result-display {
  display: flex;
  justify-content: center;
  height: 45px;
  position: relative;
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  align-items: center;
  padding: 0.5rem;
  background: linear-gradient(45deg, #059669, #34d399);
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.multiplier-display.glow {
  animation: glow 1.5s ease-in-out infinite alternate;
}

.target-cashout {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 0.2rem;
}

@keyframes glow {
  from { text-shadow: 0 0 10px #38bdf8; }
  to { text-shadow: 0 0 20px #38bdf8, 0 0 30px #2563eb; }
}

.win-message {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: 800;
  color: #34d399;
  text-shadow: 0 0 10px #34d399;
}

.flight-area {
  position: relative;
  height: 40vh;
  background: linear-gradient(to bottom, #0f172a 60%, #1e293b);
  border-radius: 1rem;
  overflow: hidden;
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 800 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='299' cy='54' r='1'/%3E%3Ccircle cx='532' cy='142' r='1'/%3E%3Ccircle cx='101' cy='256' r='1'/%3E%3Ccircle cx='755' cy='198' r='1'/%3E%3Ccircle cx='674' cy='346' r='1'/%3E%3C/g%3E%3C/svg%3E");
}

.rocket {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  transition: bottom 0.05s linear;
  z-index: 2;
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
}

.flame {
  position: absolute;
  bottom: -15px;
  left: 50%;
  width: 20px;
  height: 30px;
  background: linear-gradient(to top, #f59e0b 20%, #ef4444 80%);
  transform: translateX(-50%);
  border-radius: 50%;
  opacity: 0.8;
  animation: flame 0.2s infinite alternate;
}

@keyframes flame {
  from { transform: translateX(-50%) scaleY(0.8); }
  to { transform: translateX(-50%) scaleY(1.2); }
}

.controls {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}

.input-group {
  position: relative;
}

input {
  width: 100%;
  padding: 0.6rem 1.8rem 0.6rem 0.8rem;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 0.5rem;
  color: #f8fafc;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.neon-button {
  background: linear-gradient(45deg, #2563eb, #38bdf8);
  border: none;
  padding: 0.8rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.cashout-neon-button {
  background: linear-gradient(45deg, #059669, #34d399);
  border: none;
  padding: 0.8rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.neon-button:disabled {
  opacity: 0.6;
  background: #475569;
}

.neon-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.rocket.crashed {
  animation: crash 1.2s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes crash {
  0% { transform: translateX(-50%) rotate(0); }
  30% { transform: translateX(-50%) rotate(45deg); }
  100% { transform: translateX(-50%) rotate(135deg) translateY(100vh); opacity: 0; }
}
</style>
