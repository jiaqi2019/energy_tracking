<template>
  <view class="login-container">
    <!-- 顶部标题区域 -->
    <view class="header">
      <text class="title font-yozai">账号登录</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 登录按钮区域 -->
      <view class="action-buttons">
        <button class="action-btn primary-btn font-yozai" @click="handleLogin">
          登录
        </button>
        <button class="action-btn secondary-btn font-yozai" @click="handleJoinUs">
          加我一起改变！
        </button>
        <button class="action-btn outline-btn font-yozai" @click="handleContact">
          我们反馈的联系方式
        </button>
      </view>

      <!-- 附加信息区域 -->
      <view class="info-section">
        <text class="info-text font-yozai">一些关于这个产品的承诺</text>
        <text class="info-text font-yozai">一些合规要求我们必须放的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleLogin = () => {
  // 处理登录逻辑
}

const handleJoinUs = () => {
  // 处理加入逻辑
}

const handleContact = () => {
  // 处理联系方式逻辑
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  padding: 20px;
  padding-top: calc(20px + var(--status-bar-height));
}

.header {
  margin-bottom: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #4A90E2;
  color: white;
  border: none;
}

.secondary-btn {
  background-color: #43AA8B;  
  color: white;
  border: none;
}

.outline-btn {
  background-color: transparent;
  color: #666666;
  border: 1px solid #DDDDDD;
}

.action-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.info-section {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-text {
  font-size: 14px;
  color: #999999;
  text-align: center;
}
</style>