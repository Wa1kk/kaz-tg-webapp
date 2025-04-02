<template>
    <div class="container">
      
      <div class="game-area">
        <div class="multiplier-display">
          <div class="current-multiplier">{{ currentMultiplier.toFixed(2) }}x</div>
          <div class="scale-markers">
            <span v-for="n in 5" :key="n">{{ n }}x</span>
          </div>
        </div>
        
        <div class="flight-area">
          <div 
            class="rocket"
            :style="rocketPosition"
            :class="{ crashed: !isPlaying && result === 'crash' }"
          >
            <div class="flame"></div>
            🚀
          </div>
          <div class="dotted-line"></div>
        </div>

        </div>

  
      <div v-if="!isPlaying" class="controls">
        <input
          ref="betInput"
          v-model.number="bet"
          type="number"
          min="1"
          :max="user.money"
          placeholder="Сумма ставки"
          @blur="resetFormPosition"
          @keyup.enter="handleBetInput"
        >
        <button @click="startGame" :disabled="!bet">Старт</button>
      </div>
      <div v-else class="controls">
        <button @click="cashOut" class="cash-out">ЗАБРАТЬ {{ (bet * currentMultiplier).toFixed(2) }}</button>
      </div>
  
      <div v-if="result" class="result" :class="result">
        {{ resultMessage }}
      </div>
    </div>
    
  </template>
  
  <script>
  import { useUserStore  } from '@/stores/score'

  export default {
    setup() {
        const user = useUserStore();
        return {
            user,
        }
    },
    data() {
      return {
        bet: null,
        isPlaying: false,
        currentMultiplier: 1,
        crashMultiplier: 1,
        result: null,
        intervalId: null,
      }
    },
    computed: {
      rocketPosition() {
        const progress = Math.min(this.currentMultiplier / 20 * 100, 100)
        return { bottom: `${progress}%` }
      },
      resultMessage() {
        if(this.result === 'cashout') {
           const winAmount = (this.bet * this.currentMultiplier).toFixed(2);
          return `💰 Успешно! Вы забрали ${winAmount}₽ - ${this.currentMultiplier.toFixed(2)}x`
        }
        if(this.result === 'crash') {
          return `💥 Краш! Ракета рухнула на ${this.currentMultiplier.toFixed(2)}x`
        }
        return ''
      }
    },
    methods: {
      handleBetInput() {
        // Скрываем клавиатуру
        this.$refs.betInput.blur();
      },
      
      resetFormPosition() {
        // Прокручиваем страницу вверх, если нужно
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      
      startGame() {
        const user = useUserStore();
        if(this.bet > user.money || this.bet <= 0) return
        
        user.minusMoney(this.bet);
        this.isPlaying = true
        this.result = null
        this.currentMultiplier = 1
        this.crashMultiplier = this.generateCrashPoint()
        
        this.intervalId = setInterval(() => {
          this.currentMultiplier += 0.01
          
          if(this.currentMultiplier >= this.crashMultiplier) {
            this.gameCrash()
          }
        }, 90)
      },
      
      generateCrashPoint() {
        const rand = Math.random();
        
            // 70% игр до 1.5x
            if(rand < 0.7) {
                return 1 + (Math.pow(rand/0.55, 1.5) * 0.5); // 1.0-1.5x
            }
            // 25% игр до 2x
            else if(rand < 0.95) {
                return 1.5 + (Math.pow((rand-0.7)/0.45, 2) * 0.5); // 1.5-2.0x
            }
            // 5% игр выше 2x
            else {
                return 2 + (Math.pow((rand-0.95)/0.10, 1.5) * 998); // 2.0-1000x
            }
        },
      
      cashOut() {
        const user = useUserStore();
        if(!this.isPlaying) return
        this.result = 'cashout'
        this.isPlaying = false
        const winAmount = this.bet * this.currentMultiplier
        user.addMoney(winAmount);
        clearInterval(this.intervalId)
      },
      
      gameCrash() {
        this.result = 'crash'
        this.isPlaying = false
        clearInterval(this.intervalId)
      }
    }
  }
  </script>
  
  <style scoped>
    /* Новые стили для ракеты */
    .flight-area {
    position: relative;
    height: 300px;
    margin: 20px 0;
    background: linear-gradient(to bottom, #000428, #004e92);
    }

    .rocket {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 48px;
    transition: bottom 0.05s linear;
    z-index: 2;
    }

    .dotted-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: repeating-linear-gradient(
        to bottom,
        rgba(255,255,255,0.3),
        rgba(255,255,255,0.3) 5px,
        transparent 5px,
        transparent 10px
    );
    }

    .multiplier-display {
    position: relative;
    background: #1a1a1a;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    }

    .current-multiplier {
    font-size: 32px;
    font-weight: bold;
    color: #2ecc71;
    }

    .scale-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    color: rgba(255,255,255,0.7);
    }

    .rocket.crashed {
    animation: crash 1.5s ease-out forwards;
    }

    @keyframes crash {
    0% { transform: translateX(-50%) rotate(0deg); }
    30% { transform: translateX(-50%) rotate(45deg); }
    100% { 
        transform: translateX(-50%) rotate(180deg) translateY(100vh);
        opacity: 0;
    }
    }
  
  .multiplier {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }
  
  .controls {
    margin: 20px 0;
  }
  
  input {
    padding: 10px;
    margin-right: 10px;
    width: 150px;
    border: 2px solid #3498db;
    border-radius: 5px;
  }
  
  button {
    padding: 10px 20px;
    background: #3498db;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
  
  button.cash-out {
    background: #2ecc71;
    font-weight: bold;
  }
  
  .result {
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
  }
  
  .result.cashout {
    background: #2ecc71;
    color: white;
  }
  
  .result.crash {
    background: #e74c3c;
    color: white;
  }
  </style>