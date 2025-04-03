<template>
    <div class="game-container">
      <div class="circle" ref="circle">
        <div class="ball" :style="ballStyle"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const ballX = ref(50);
  const ballY = ref(50);
  const velocityX = ref(4);
  const velocityY = ref(2);
  const circleSize = 200;
  const ballSize = 20;
  const GRAVITY = 0.05;
  
  const ballStyle = computed(() => ({
    left: `${ballX.value}px`,
    top: `${ballY.value}px`
  }));
  
  const EXIT_ANGLE_START = Math.PI * 1.3;
  const EXIT_ANGLE_END = Math.PI * 1.7;
  
  const updateBallPosition = () => {
    velocityY.value += GRAVITY;
    
    ballX.value += velocityX.value;
    ballY.value += velocityY.value;
  
    const radius = circleSize / 2;
    const ballRadius = ballSize / 2;
    const centerX = radius;
    const centerY = radius;
  
    const dx = ballX.value + ballRadius - centerX;
    const dy = ballY.value + ballRadius - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    if (distance + ballRadius > radius) {
      const angle = Math.atan2(dy, dx);
      
      if (angle < EXIT_ANGLE_START || angle > EXIT_ANGLE_END) {
        const normalX = Math.cos(angle);
        const normalY = Math.sin(angle);
        
        const penetration = distance + ballRadius - radius;
        ballX.value -= penetration * normalX;
        ballY.value -= penetration * normalY;
        
        const dotProduct = velocityX.value * normalX + velocityY.value * normalY;
        velocityX.value -= 2 * dotProduct * normalX;
        velocityY.value -= 2 * dotProduct * normalY;
      }
    }
    requestAnimationFrame(updateBallPosition);
  };
  
  onMounted(() => {
    requestAnimationFrame(updateBallPosition);
  });
  </script>
  
  <style scoped>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: #222;
    position: fixed;
    top: 0;
    left: 0;
  }
  
  .circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 4px solid white;
    position: relative;
  }
  
  .ball {
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  </style>