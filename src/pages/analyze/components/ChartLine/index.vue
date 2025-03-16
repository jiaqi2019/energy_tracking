<template>
  <view class="chart-card mt-16">
    <view class="chart-header">
      <text class="chart-title font-yozai">情绪波动</text>
      <!-- <view class="date-selector">
        <text class="arrow">〈</text>
        <text class="date">2025/03/15</text>
        <text class="arrow">〉</text>
      </view> -->
    </view>

    <view class="chart-body">
      <!-- 左侧表情图标 -->
      <view class="mood-icons">
        <view v-for="(mood, index) in moodEmojis" :key="index" class="mood-icon">
          <image :src="mood.icon" mode="aspectFit" />
        </view>
      </view>

      <!-- 可滚动的图表区域 -->
      <view class="chart-main">
        <scroll-view
          ref="scrollViewRef"
          scroll-x
          class="chart-scroll-view"
          id="chart-scroll-view"
          :show-scrollbar="false"
          :scroll-left="scrollLeft"
          @scroll="handleScroll"
        >
          <view class="chart-container">
            <qiun-data-charts
              type="line"
              :opts="chartOpts"
              :chartData="chartData"
              @getIndex="onPointClick"
            />
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// Add props definition
interface Props {
  moodList: Mood[]; // You'll need to import this type from src/api/moodList.ts
  type?: 'today' | 'week' | 'month' // 添加type属性
}
import { ref, onMounted, defineProps, computed, watch, nextTick } from "vue";
import { moodEmojis } from "@/common/emoji";

const props = defineProps<Props>()
const scrollViewRef = ref(null);  // 添加 ref

const showTooltip = ref(false);
const scrollLeft = ref(0);

// 生成测试数据
const chartData = computed(() => ({
  categories: props.moodList.map(mood => {
    const date = new Date(mood.create_time)
    // 根据type类型返回不同的日期格式
    return props.type === 'today' 
      ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      : `${date.getMonth() + 1}/${date.getDate()}`
  }),
  series: [{
    name: "心情",
    data: props.moodList.map(mood => mood.mood_score),
    color: "#FF9F7E",
  }],
}))

const chartOpts = {
  padding: [15, 30, 10, 15],
  enableScroll: false,
  legend: { show: false },
  xAxis: {
    disableGrid: true,
    itemCount: 5,
    fontSize: 12,
    color: "#999999",
  },
  yAxis: {
    disabled: true,
    splitNumber: 4,
    data: [
      {
        min: -2,
        max: 2,
        formatter: (val) => "",
      },
    ],
  },
  extra: {
    line: {
      type: "curve",
      width: 2,
      activeType: "none",
      linearType: "custom",
    },
    point: {
      size: 8,
      borderWidth: 2,
      borderColor: "#FF9F7E",
      fillColor: "#ffffff",
    },
    tooltip: {
      showBox: false,
      labelFormatter: () => ""
    },
  },
  dataLabel: false
};

const handleScroll = (e) => {
  // 处理滚动事件，如果需要
};
watch(() => props.type, () => {
  // // 重置滚动位置
  // const query = uni.createSelectorQuery().in(this);
  // query.select('.chart-scroll-view')
  //   .boundingClientRect(data => {
  //     if (data) {
  //       uni.createSelectorQuery().in(this)
  //         .select('#chart-scroll-view')
  //         .node()
  //         .exec((res) => {
  //           console.log("res", res);
  //           const scrollView = res[0];
  //           if (scrollView && scrollView.scrollLeft) {
  //             scrollView.scrollLeft = 0;
  //           }
  //         });
  //     }
  //   })
  //   .exec();
});

</script>

<style scoped>
.chart-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
}

.chart-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.chart-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.arrow {
  color: #999;
  font-size: 16px;
}

.date {
  color: #999;
  font-size: 14px;
}

.chart-body {
  display: flex;
  height: 300px;
  position: relative;
}

.mood-icons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  padding: 5px 0 20px;
  /* margin-right: 15px; */
  flex-shrink: 0;
}

.mood-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mood-icon image {
  width: 100%;
  height: 100%;
}

.chart-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  top: 35px;
  left: 0;
  right: 0;
  bottom: 35px;
  pointer-events: none;
  z-index: 1;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #e8e8e8 0px,
    #e8e8e8 4px,
    transparent 4px,
    transparent 8px
  );
}

.grid-line:nth-child(1) {
  top: 0%;
}
.grid-line:nth-child(2) {
  top: 25%;
}
.grid-line:nth-child(3) {
  top: 50%;
}
.grid-line:nth-child(4) {
  top: 75%;
}
.grid-line:nth-child(5) {
  top: 100%;
}

.chart-scroll-view {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 200%;
  height: 100%;
  position: relative;
}

.tooltip {
  position: absolute;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f7fa;
  z-index: 100;
  bottom: 20px;
  right: 20px;
}

.tooltip text {
  display: block;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  text-align: center;
}
</style>
