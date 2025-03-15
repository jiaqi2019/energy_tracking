<template>
  <view class="mood-card">
      <view class="card-header">
        <text class="title font-yozai">情绪记录</text>
        <text class="subtitle font-yozai">{{ new Date().getFullYear() }}年的心情变化</text>
      </view>
      <view class="heatmap-card">
      <!-- 固定的纵轴标签 -->
      <view class="weekday-column">
        <text v-for="day in weekdays" :key="day" class="weekday-label">{{ day }}</text>
      </view>

      <view class="heatmap-main">
        <scroll-view 
          scroll-x 
          class="scroll-container" 
          :show-scrollbar="false"
          :scroll-into-view="currentMonthId"
        >
          <view class="heatmap-content">
            <!-- 月份标签行 -->
            <view class="month-row">
              <text 
                v-for="month in displayMonths" 
                :key="month.id"
                :id="month.id"
                class="month-label"
              >{{ month.name }}</text>
            </view>
            
            <!-- 网格区域 -->
            <view class="grid-container">
              <view 
                v-for="(week, weekIndex) in contributionWeeks" 
                :key="weekIndex" 
                class="week-column"
              >
                <view 
                  v-for="(day, dayIndex) in week" 
                  :key="`${weekIndex}-${dayIndex}`"
                  :class="['grid-cell', `level-${day.level}`]"
                  @tap="showContribution(day)"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 图例 -->
      <view class="legend">
        <text class="legend-text font-yozai">较少</text>
        <view class="legend-cells">
          <view v-for="i in 5" :key="i" :class="['legend-cell', `level-${i-1}`]" />
        </view>
        <text class="legend-text font-yozai">较多</text>
      </view>
    </view>
  </view>
 
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ContributionDay {
  date: string;
  level: number;
  count: number;
}

interface MonthInfo {
  id: string;
  name: string;
  date: Date;
}

const weekdays = ['周一', '周三', '周日'];

// 当前月份的ID，用于滚动定位
const currentMonthId = computed(() => {
  const current = displayMonths.value[displayMonths.value.length - 1];
  return current.id;
});

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 生成月份信息
const displayMonths = computed(() => {
  const months: MonthInfo[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // 生成1月到12月的数据
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, i, 1);
    months.push({
      id: `month-${currentYear}-${i}`,
      name: monthNames[i],
      date: date,
      // 只有当前月份和前两个月是活跃的
      isActive: i <= currentMonth && i >= currentMonth - 2
    });
  }
  
  return months;
});

function generateData(): ContributionDay[] {
  const data: ContributionDay[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // 从1月1日开始
  const startDate = new Date(currentYear, 0, 1);
  // 调整到第一周的周一
  const firstDayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1));
  
  // 到12月31日结束
  const endDate = new Date(currentYear, 11, 31);
  // 调整到最后一周的周日
  const lastDayOfWeek = endDate.getDay();
  endDate.setDate(endDate.getDate() + (lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek));

  const iterDate = new Date(startDate);
  
  while (iterDate <= endDate) {
    const month = iterDate.getMonth();
    const isActive = month <= currentMonth && month >= currentMonth - 2;
    
    data.push({
      date: iterDate.toISOString().split('T')[0],
      level: isActive ? Math.floor(Math.random() * 5) : 0,
      count: isActive ? Math.floor(Math.random() * 10) : 0,
      isActive: isActive
    });
    iterDate.setDate(iterDate.getDate() + 1);
  }
  
  return data;
}

// 将数据按周分组
const contributionWeeks = computed(() => {
  const data = generateData();
  const weeks: ContributionDay[][] = [];
  
  for (let i = 0; i < data.length; i += 7) {
    const week = data.slice(i, i + 7);
    weeks.push(week);
  }
  
  return weeks;
});

const showContribution = (day: ContributionDay) => {
  uni.showToast({
    title: `${day.date}: ${day.count} contributions`,
    icon: 'none'
  });
};
</script>

<style scoped>

.mood-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: block;
}


.subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.heatmap-card {
  background: #ffffff;
  border-radius: 12px;
  position: relative;
}
.year-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}


.weekday-column {
  position: absolute;
  left: 0px;
  top: 30px; /* 调整以对齐网格 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px; /* 调整高度以匹配网格 */
  z-index: 1;
}

.weekday-label {
  font-size: 12px;
  color: #666;
  height: 10px;
  line-height: 10px;
}

.heatmap-main {
  margin-left: 40px; /* 为固定的纵轴留出空间 */
}

.scroll-container {
  width: 100%;
  overflow: hidden;
}

.heatmap-content {
  width: fit-content;
  min-width: 100%;
}

.month-row {
  display: flex;
  margin-bottom: 10px;
}

.month-label {
  width: 60px; /* 调整月份标签宽度 */
  font-size: 12px;
  color: #666;
  text-align: start;
  flex-shrink: 0;
}

.grid-container {
  display: flex;
  gap: 3px;
}

.week-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.grid-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* 贡献等级颜色 */
.level-0 { background-color: #ebedf0; }
.level-1 { background-color: #9be9a8; }
.level-2 { background-color: #40c463; }
.level-3 { background-color: #30a14e; }
.level-4 { background-color: #216e39; }

.legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 8px;
}

.legend-text {
  font-size: 12px;
  color: #666;
}

.legend-cells {
  display: flex;
  gap: 3px;
}

.legend-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>