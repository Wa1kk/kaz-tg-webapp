<template>
    <div class="coin-flip-game">
      <!-- Bet controls вверху по центру -->
      <div class="bet-controls">
        <input 
          ref="betInput"
          type="number" 
          v-model.number="betAmount" 
          min="1" 
          :max="user.money" 
          placeholder="Сумма ставки"
          class="bet-input"
          @blur="resetFormPosition"
          @keyup.enter="handleBetInput"
        >
        <button 
          @click="setBetAmount(user.money)" 
          class="max-bet-btn"
        >МАКС</button>
      </div>
      
      <!-- Coin container по центру -->
      <div class="game-area">
        <div class="coin-container" :class="{ flipping: isFlipping }">
          <div class="coin" :class="coinClass">
            <div class="front">
              <img src="@/assets/coin.png" alt="Дрип">
              <span>ДРИП</span>
            </div>
            <div class="back">
              <img src="@/assets/coin.png" alt="Соус">
              <span>СОУС</span>
            </div>
          </div>
        </div>
        
        <div v-if="result" class="result" :class="resultClass">
          {{ result }}
        </div>
      </div>
      
      <!-- Choice buttons внизу -->
      <div class="choice-buttons">
        <button 
          @click="flipCoin('drip')" 
          :disabled="isFlipping || betAmount <= 0 || betAmount > user.money"
          class="choice-btn drip-btn"
        >ДРИП</button>
        <button 
          @click="flipCoin('sauce')" 
          :disabled="isFlipping || betAmount <= 0 || betAmount > user.money"
          class="choice-btn sauce-btn"
        >СОУС</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '@/stores/score';
  
  export default {
    setup() {
      const user = useUserStore();
      return { user };
    },
    data() {
      return {
        betAmount: 100,
        isFlipping: false,
        result: '',
        resultClass: '',
        currentSide: null
      };
    },
    computed: {
      coinClass() {
        return {
          flipping: this.isFlipping,
          heads: this.currentSide === 'drip',
          tails: this.currentSide === 'sauce'
        };
      }
    },
    methods: {
      handleBetInput() {
        this.$refs.betInput.blur();
      },
      
      resetFormPosition() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      setBetAmount(amount) {
        this.betAmount = Math.min(amount, this.user.money);
      },

      flipCoin(choice) {
        if (this.isFlipping || this.betAmount <= 0 || this.betAmount > this.user.money) return;
        this.user.minusMoney(this.betAmount);
        this.isFlipping = true;
        this.result = '';
        this.resultClass = '';
        this.currentSide = null;
        
        setTimeout(() => {
          const isWin = Math.random() < 0.5;
          this.currentSide = isWin ? choice : (choice === 'drip' ? 'sauce' : 'drip');
          setTimeout(() => {
            this.isFlipping = false;
            if (this.currentSide === choice) {
              this.result = `Победа! +${this.betAmount * 2}₽`;
              this.resultClass = 'win';
              this.user.addMoney(this.betAmount * 2);
            } else {
              this.result = `Проигрыш! -${this.betAmount}₽`;
              this.resultClass = 'loss';
            }
          }, 2000);
        }, 2000);
      }
    }
  };
  </script>
  
  <style scoped>
  .coin-flip-game {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    text-align: center;
    font-family: 'Arial', sans-serif;
    background: #1f1f1f50;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5em;
  }
  
  .balance {
    font-size: 1.5em;
    margin-bottom: 20px;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .bet-controls {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    gap: 10px;
  }
  
  .bet-input {
    padding: 10px 15px;
    font-size: 1.2em;
    width: 200px;
    border: 2px solid #27ae60;
    border-radius: 5px;
    text-align: center;
  }
  
  .max-bet-btn {
    padding: 10px 20px;
    font-size: 1.2em;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .coin-container {
    perspective: 1000px;
    margin: 0 auto 30px;
    width: 200px;
    height: 200px;
  }
  
  .coin {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  }
  
  .coin.flipping {
    animation: flip-rotate 4s ease-in-out;
  }

  @keyframes flip-rotate {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(5760deg); }
  }
  
  .coin.heads {
    transform: rotateY(0deg);
  }
  
  .coin.tails {
    transform: rotateY(180deg);
  }
  
  .coin div {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  
  .coin .front {
    background-color: #f1c40f;
    transform: rotateY(0deg);
  }
  
  .coin .back {
    background-color: #e74c3c;
    transform: rotateY(180deg);
  }
  
  .coin img {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }
  
  .coin span {
    font-size: 1.5em;
    font-weight: bold;
    color: white;
  }
  
  .choice-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .choice-btn {
    padding: 15px 30px;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .drip-btn {
    background-color: #f1c40f;
    color: white;
  }
  
  .sauce-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .choice-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .result {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 5px;
  }
  
  .win {
    color: #27ae60;
    background-color: rgba(39, 174, 96, 0.1);
  }
  
  .loss {
    color: #e74c3c;
    background-color: rgba(231, 76, 60, 0.1);
  }
  
</style>