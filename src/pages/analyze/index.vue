<template>
  <view class="analyze-container">
    <!-- Tab 切换 -->
    <view class="tab-container">
      <view
        :class="{
          'tab-item font-yozai': true,
          active: activeTab === 'chart',
        }"
        @click="activeTab = 'chart'"
      >
        图表
      </view>
      <!-- 添加分割线元素 -->
      <view class="tab-divider"></view>
      <view
        :class="{
          'tab-item font-yozai': true,
          active: activeTab === 'statistics',
        }"
        @click="activeTab = 'statistics'"
      >
        统计
      </view>
    </view>

    <!-- 图表 Tab 内容 -->
    <view v-if="activeTab === 'chart'" class="chart-content">
      <!-- 时间选择 -->
      <view class="time-selector">
        <view
          :class="{
            'time-item font-yozai': true,
            active: selectedTime === 'today',
          }"
          @click="selectedTime = 'today'"
        >
          今日
        </view>
        <view
          :class="{
            'time-item font-yozai': true,
            active: selectedTime === 'week',
          }"
          @click="selectedTime = 'week'"
        >
          最近一周
        </view>
        <view
          :class="{
            'time-item font-yozai': true,
            active: selectedTime === 'month',
          }"
          @click="selectedTime = 'month'"
        >
          最近一月
        </view>
      </view>
      <!-- 图表组件 -->
      <ChartLine :selectedTime="selectedTime" />
    </view>

    <!-- 统计 Tab 内容 --> 
    <view v-if="activeTab === 'statistics'" class="statistics-content">
      <MoodHeatmap />
       <view class="login-cta">
        <view class="cta-text">
          <text class="title font-yozai">解锁您的专属情绪分析报告</text>
          <text class="subtitle font-yozai">发现更多关于自己的有趣发现</text>
        </view>
        <button class="login-btn font-yozai" @click="handleLogin">立即查看</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import MoodHeatmap from "./components/MoodHeatMap/index.vue";
import ChartLine from "./components/ChartLine/index.vue";

// 初始化 Tab 状态
const activeTab = ref("chart");
// 初始化时间选择状态
const selectedTime = ref("today");
// 初始化登陆状态
const isLoggedIn = ref(false);

const login = () => {
  // 这里可以实现登陆逻辑
  isLoggedIn.value = true;
};
</script>

<style scoped>
.analyze-container {
  padding: 16px;
  padding-top: calc(16px + var(--status-bar-height));
  min-height: 100vh;
}

.tab-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: none; /* 去掉默认的下划线 */
  color: rgb(170, 174, 185); /* 非激活状态颜色 */
  font-size: 16px; /* 默认字体大小 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.tab-item.active {
  color: rgb(108, 109, 128); /* 激活状态颜色 */
  font-size: 18px; /* 激活状态字体放大 */
}

/* 分割线样式 */
.tab-divider {
  width: 1px;
  background-color: #ccc;
  height: 20px;
  align-self: center;
}

.time-selector {
  display: flex;
  background-color: rgb(213, 218, 224); /* 容器背景色 */
  border-radius: 20px; /* 容器圆角 */
  padding: 2px; /* 添加内边距 */
  height: 30px;
}

.time-item {
  display: flex;
  flex: 1; /* 均分容器宽度 */
  justify-content: center;
  align-items: center;
  border-radius: 20px; /* 按钮圆角 */
  background-color: transparent; /* 默认透明背景 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  border: none; /* 移除原有边框 */
}

.time-item.active {
  background-color: white; /* 激活状态背景 */
  color: rgb(40, 44, 53) !important; /* 激活文字颜色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 可选阴影效果 */
}
.login-cta {
  margin-top: 16px;
  text-align: center;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
}

.cta-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.login-btn {
  background: #43aa8b;
  color: white;
  padding: 0px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(67, 170, 139, 0.2);
}

.login-btn:active {
  transform: translateY(1px);
}
</style>
