<template>
  <view class="header-bar mb-16 relative" >
    <view class="absolute icon-font close-btn" @click="handleClose">
      &#xe633;
    </view>
  </view>
  <!-- 心情表情和滑动条部分 -->
  <view class="mood-container">
    <image :src="moodEmojis[currentMoodIndex].icon" class="mood-emoji"/>
    <text class="mood-text">{{ moodEmojis[currentMoodIndex].text }}</text>
      <slider
        :value="currentMoodIndex"
        :min="0"
        :max="4"
        :step="1"
        @change="handleMoodChange"
        class="mood-slider"
      />

  </view>

  <!-- 事件内容输入框 -->
  <view class="content-container">
    <textarea
      v-model="content"
      placeholder="是什么事情让你产生这样的感受？"
      class="content-input"
    />
  </view>

  <!-- 保存按钮 -->
  <button class="save-btn" @tap="handleSave">存档！</button>
</template>

<script>
import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';
import { moodEmojis } from '@/common/emoji';
const userMoodRecordApi = uniCloud.importObject('user-mood-record');

export default {
  data () {
    return {
      moodEmojis,
      currentMoodIndex: 2, // 默认选中中间的表情
      content: '' // 事件内容
    };
  },
  methods: {
    handleMoodChange (e) {
      this.currentMoodIndex = e.detail.value;
    },
    async handleSave () {
      const moodData = {
        mood_score: this.moodEmojis[this.currentMoodIndex].value,
        event_desc: this.content,
      };
      if(userStrore.hasLogin) {
        const addRes = await userMoodRecordApi.add(moodData);
        if (addRes.errCode != 0) {
          uni.showToast({
            title: '添加失败,请重试!',
            icon: 'error'
          });
          return;
        }
      }
      uni.$emit('addMood', {
        ...moodData,
        create_time: Date.now()
      });
      // TODO: 这里添加实际的保存逻辑
      uni.showToast({
        title: '保存成功！',
        icon: 'success',
      });
      uni.navigateBack({ delta: 1 });
    },
    handleClose () {
      uni.navigateBack({ delta: 1 });
    }
  }
};

</script>

<style>
.close-btn {
  font-size: 30px;
  color: #7bcdbf;
  left: 16px;
  bottom: -25px;
}
.mood-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  margin-top: 10px;
}

.mood-emoji {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.mood-text {
  font-size: 32rpx;
  margin-bottom: 30rpx;
}

.mood-slider {
  width: 100%;
  margin: 20rpx 0;
}

.content-container {
  padding: 30rpx;
}

.content-input {
  width: 100%;
  height: 200rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.save-btn {
  width: 90%;
  margin: 40rpx auto;
  background: #007AFF;
  color: white;
  border-radius: 12px;
}
</style>