<template>
  <view :class="['flex justify-center items-center', customClass]" @click="onClickAdd">
    <!-- 添加动画光环 -->
    <view class="pulse-ring" :style="buttonSizeStyle" :animation="ringAnimationData"></view>
    <!-- 主按钮 -->
    <view class="circle flex items-center justify-center icon-font" :style="buttonSizeStyle" :animation="animationData">
     &#xf0175;
    </view>
  </view>
</template>

<script setup>
import {
 ref, onMounted, onUnmounted, computed
} from 'vue';

// 定义props
const props = defineProps({
  size: {
    type: Number,
    default: 60
  },
  fontSize: {
    type: Number,
    default: 25
  },
  borderRadius: {
    type: Number,
    default: 20
  },
  customClass: {
    type: String,
    default: ''
  }
});

const animationData = ref({});
const ringAnimationData = ref({});
let buttonAnimation = null;
let ringAnimation = null;

const onClickAdd = () => {
  uni.navigateTo({
    url: '/pages/mood-form/index',
    openType: 'navigate',
  });
};

// 计算按钮尺寸样式
const buttonSizeStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${props.fontSize}px`,
  borderRadius: `${props.borderRadius}px`
}));

// 初始化动画实例
const initAnimations = () => {
  // 按钮动画
  buttonAnimation = uni.createAnimation({
    duration: 1000,
    timingFunction: 'ease-in-out',
    delay: 0
  });

  // 光环动画
  ringAnimation = uni.createAnimation({
    duration: 1500,
    timingFunction: 'ease-out',
    delay: 0
  });
};

// 执行按钮动画
const runButtonAnimation = () => {
  buttonAnimation.scale(1.1).step();
  buttonAnimation.scale(1).step();
  animationData.value = buttonAnimation.export();
};

// 执行光环动画
const runRingAnimation = () => {
  ringAnimation
    .opacity(1)
    .scale(1)
    .step();
  ringAnimation
    .opacity(0)
    .scale(1.5)
    .step();
  ringAnimationData.value = ringAnimation.export();
};

let animationTimer = null;

onMounted(() => {
  initAnimations();

  // 设置定时器执行动画
  animationTimer = setInterval(() => {
    runButtonAnimation();
    runRingAnimation();
  }, 2000);
});

onUnmounted(() => {
  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
  }
});
</script>

<style scoped>
.circle {
  position: relative;
  z-index: 2;
  background: #7bcdbf;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
}

.pulse-ring {
  position: absolute;
  background: #7bcdbf;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
}
</style>