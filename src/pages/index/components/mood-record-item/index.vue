<template>
	<uni-swipe-action>
		<uni-swipe-action-item>
			<template v-slot:right>
				<view class="delete-btn" @click="handleSwipeClick">
					<text class="delete-text">删除</text>
				</view>
			</template>
			<view :class="{'mood-card':true,'mood-pos': props.moodScore > 0, 'mood-nag': props.moodScore < 0 } ">
				<!-- 卡片头部 -->
				<view class="flex items-center">
					<view class="flex-1">
						<view class="time">{{ date }}</view>
						<!-- 卡片内容 -->
						<view class="card-content text-TextPrimary mt-8">
							{{ eventDesc || "什么也没写"}}
						</view>
					</view>
					<image :src="moodEmojiMap[props.moodScore]?.icon" class="mood-emoji ml-16"/>
				</view>
			</view>
		</uni-swipe-action-item>
	</uni-swipe-action>
</template>

<script setup lang="ts">
  import {
    defineProps, ref, computed, defineEmits
  } from 'vue';
  import { moodEmojiMap } from '@/common/emoji'
  
  // 定义组件接收的参数
  const props = defineProps<{
    id: string;
    time : number;
    moodScore : number;
    eventDesc : string;
  }>();

  const emit = defineEmits(['delete']);

  // 处理滑动按钮点击
  const handleSwipeClick = async () => {
    emit('delete', {id: props.id, create_time: props.time});
    // uni.showModal({
    //   title: '提示',
    //   content: '确定要删除这条记录吗？',
    //   success: async function (res) {
    //     if (res.confirm) {
    //       try {
    //         const result = await uniCloud.callObject('user-mood-record', {
    //           method: 'deleteById',
    //           params: props.id
    //         });
            
    //         if (result) {
    //           uni.showToast({
    //             title: '删除成功',
    //             icon: 'success'
    //           });
    //           // 通知父组件更新列表
    //           emit('delete', props.id);
    //         }
    //       } catch (error) {
    //         uni.showToast({
    //           title: '删除失败',
    //           icon: 'error'
    //         });
    //       }
    //     }
    //   }
    // });
  };

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

</script>

<style scoped>
	.mood-card {
		background-color: #fffbf8;
		border-radius: 18px;
		padding: 18px;
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
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
	}
  .mood-emoji {
    width: 40px;
    height: 40px;
  }

  .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dd524d;
    height: 100%;
    padding: 0 32rpx;
    margin-left: 8rpx;
    border-radius: 18px;
  }

  .delete-text {
    color: #ffffff;
    font-size: 32rpx;
  }

  /* 移除所有margin-bottom相关样式 */
</style>