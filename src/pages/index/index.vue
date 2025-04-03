<template>
  <view class="header-bar header-margin"/>
  <view v-if="state.loadMoreStatus === 'noMore' && !state.moodList.length">
    <text class="h1 font-yozai flex justify-center">你现在感觉怎么样</text>
    <text class="h3 font-yozai flex justify-center"
      >记录当下，帮你更好觉察情绪</text
    >
    <view class="btn-large">
      <AddButton  :size="240" :fontSize="100" :borderRadius="80"/>
    </view>
  </view>
  <!-- list渲染 -->
  <view v-else class="px-16">
    <text
      class="h1 font-yozai flex justify-center"
      style="margin-bottom: 30px"
      >{{ currentMoodEmoji.text }}</text
    >
    <vew class="flex justify-center w-full">
      <image :src="currentMoodEmoji.icon" class="mood-emoji" />
    </vew>
    <view class="mood-item"  :key="item.create_time"
       v-for="(item) in state.moodList">
      <MoodRecordItem
        :data="item"
        :id="item._id"
        :time="item.create_time"
        :mood-score="item.mood_score"
        :eventDesc="item.event_desc"
        @delete="handleDelete"
        @clickMoodItem="handleClickMoodItem"
        class="mood-item"
      />
    </view>

    <uni-load-more :status="state.loadMoreStatus" :contentText="{contentrefresh: '正在加载...',contentnomore: '记录本身就是一种宣泄'}" />
    <view class="fixed-bottom">
      <AddButton />
    </view>
  </view>

</template>

<script setup>
import {
 reactive, computed, onMounted
} from 'vue';
import { moodEmojiMap } from '@/common/emoji';
import MoodRecordItem from './components/mood-record-item/index.vue';
import AddButton from './components/add-button/index.vue';
import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';
import {
 getMoodListFromLocal, getMoodList
} from '@/api/moodList/index';
import { onReachBottom, } from '@dcloudio/uni-app';
import {
 delMoodListFromLocal, delMoodListFromApi
} from '@/api/moodList/del';
import { syncMoodList } from '@/api/moodList/syncMoodList';

const userMoodRecordApi = uniCloud.importObject('user-mood-record', { customUI: true });
const state = reactive({
  moodList: !userStrore.hasLogin ? getMoodListFromLocal(true) : [],
  loadMoreStatus: userStrore.hasLogin ? 'more' : 'noMore', // 新增加载更多状态
});


// 1. 获取最新一条记录的表情
const currentMoodEmoji = computed(() => {
  if (!state.moodList.length) return {};
  const latestMood = state.moodList[0];
  return moodEmojiMap[latestMood.mood_score] || moodEmojiMap[0];
});

uni.$on('uni-id-pages-login-success', () => {
  syncMoodList();
  uni.reLaunch({ url: '/pages/index/index' });
});

uni.$on('addMood', (data) => {
  const { moodEmojis } = state;
  if(!userStrore.hasLogin) {
    uni.setStorageSync('moodList', [...state.moodList, data]);
  }
  state.moodList.unshift(data);
});

uni.$on('updateMood', async (data) => {
  let index = -1;

  if(!userStrore.hasLogin) {
     index = state.moodList.findIndex(item => item.create_time === data.create_time);
  }else {
    index = state.moodList.findIndex(item => item._id === data._id);
  }
  if(index !== -1) {
    state.moodList[index] = data;
  }
});

uni.$on('uni-id-pages-logout', () => {
  state.moodList = [];
  state.loadMoreStatus = 'noMore';
});

onMounted(() => {
  if(!userStrore.hasLogin) {
    return;
  }
  loadDataFromApi();
});

const loadDataFromApi = async () => {
  try {
    state.loadMoreStatus = 'loading';
    const {
      errCode, data,
    } = await userMoodRecordApi.getMoodList(state.moodList.length);
    if (errCode == 0) {
      const {
        mood_list, has_more
      } = data;
      console.log('loadDataFromApi mood_list', mood_list);
      const moodList = mood_list;
      state.moodList = [...state.moodList, ...moodList];
      const latestMood = state.moodList[state.moodList.length - 1];
      state.loadMoreStatus = has_more ? 'more' : 'noMore';
    } else {
      // 自定义错误处理
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      });
      state.loadMoreStatus = 'more';
    }
  } catch (e) {
    // 自定义错误处理
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
    state.loadMoreStatus = 'more';
  }
};

// 处理删除事件
const handleDelete = async ({
id, create_time
}) => {
  console.log('handleDelete');
  if(!userStrore.hasLogin) {
    delMoodListFromLocal(create_time);
    const index = state.moodList.findIndex(item => item._id === id);
    console.log('handleDelete index', index);
    if (index !== -1) {
      state.moodList.splice(index, 1);
    }
    return;
  }
  const res = await delMoodListFromApi(id);
  console.log('handleDelete res', res);
  if(res.errCode === 0) {
    state.moodList = state.moodList.filter(item => item._id !== id);
  } else {
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    });
  }
};

const handleClickMoodItem = (moodItem) => {
  uni.navigateTo({
    url: `/pages/mood-form/index?moodRecord=${JSON.stringify(moodItem)}`,
    openType: 'navigate',
    animationType: 'pop-in',
    animationDuration: 200
  });
};

onReachBottom(() => {
  if (state.loadMoreStatus === 'more') {
    loadDataFromApi();
  }
});
</script>

<style scoped>

.header-margin {
  margin-bottom: 16px;
  /*  #ifdef   MP-WEIXIN  */
  margin-bottom: 50px;
  /*  #endif  */
}

.circle {
  width: 250px;
  height: 250px;
  border-radius: 100%;
  border: var(--text-primary) solid 10px;
}
.tabar-mask {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #ffffff;
}
.mood-text {
  font-size: 32rpx;
  margin-bottom: 30rpx;
}
.mood-emoji {
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
}
.fixed-bottom {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999;
}

.btn-large {
  margin-top: 100px;
}

.mood-item {
  margin-bottom: 15px;
}

.mood-item:last-child {
  margin-bottom: 0;
}

</style>
