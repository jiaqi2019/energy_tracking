<template>
	<view :class="{'mood-card':true,'mood-pos': props.moodScore > 2, 'mood-nag': props.moodScore < 2 } ">
		<!-- 卡片头部 -->
		<view class="card-header">
			<view class="time">{{ date }}</view>
			<view :class="{'mood-score': true, 'mood-score-pos': props.moodScore > 2,'mood-score-nag':props.moodScore < 2 }">
				{{ moodTextMap[moodScore] }}
			</view>
		</view>
		<!-- 卡片内容 -->
		<view class="card-content">
			{{ eventDesc || "什么也没写"}}
		</view>
	</view>
</template>

<script setup lang="ts">
  import {
    defineProps, ref, computed
  } from 'vue';

  const moodTextMap = ref({
    0: '不开心',
    1: '一般',
    2: '开心',
    3: '很开心',
    4: '超级开心'
  });
  // 定义组件接收的参数
  const props = defineProps<{
    time : number;
    moodScore : number;
    eventDesc : string;
  }>();
  const date = computed(() => {
    // 获取当前时间
    const now = Date.now();
    // 计算时间差（毫秒）
    const diff = now - new Date(props.time).getTime();

    // 定义不同时间单位对应的毫秒数
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    // 根据时间差判断并返回不同的相对时间描述
    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
      return Math.floor(diff / hour) + '小时前';
    } else if (diff < month) {
      return Math.floor(diff / day) + '天前';
    } else {
      return Math.floor(diff / month) + '月前';
    }
  });

  // 根据心情分映射文字描述
  const getMoodText = (score : number) => {
    switch (score) {
    case 0:
      return '很不开心';
    case 1:
      return '不开心';
    case 2:
      return '一般';
    case 3:
      return '开心';
    case 4:
      return '很开心';
    case 5:
      return '超级开心';
    default:
      return '未知心情';
    }
  };
</script>

<style scoped>
	.mood-card {
		background-color: #fffbf8;
		border-radius: 18px;
		padding: 18px;
		margin-bottom: 15px;
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
		transition: transform 0.3s ease;
		border-left: 5px solid #e07a5f;
	}
	.mood-pos {
		border-left: 5px solid #43aa8b;
	}
	.mood-nag {
		border-left: 5px solid #f3722c;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.time {
		font-size: 12px;
		color: #81818e;
	}

	.mood-score {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #f8961e;
	}

	.mood-score-pos {
		color: #43aa8b;
	}
	.mood-score-nag {
		color: #f3722c;
	}

	.card-content {
		font-size: 15px;
		line-height: 1.5;
		color: #3d405b;
	}
</style>