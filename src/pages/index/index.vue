<template>
  <view class="status_bar" />
  <view v-if="state.loadMoreStatus === 'noMore' && !state.moodList.length">
    <text class="h1 font-yozai flex justify-center">你现在感觉怎么样</text>
    <text class="h3 font-yozai flex justify-center"
      >记录当下，帮你更好觉察情绪</text
    >
   <AddButton  :size="240" :fontSize="100" :borderRadius="80" custom-class="btn-large"/>
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
    <MoodRecordItem
      v-for="(item, index) in state.moodList"
      :time="item.create_time"
      :mood-score="item.mood_score"
      :eventDesc="item.event_desc"
    ></MoodRecordItem>
    <uni-load-more :status="state.loadMoreStatus" />
    <AddButton custom-class="fixed-bottom"/>
  </view>
  
</template>

<script setup>
import { reactive, computed } from "vue";
import { moodEmojiMap } from "@/common/emoji";
import MoodRecordItem from "./components/mood-record-item/index.vue";
import AddButton from "./components/add-button/index.vue";
import { store as userStrore } from "@/uni_modules/uni-id-pages/common/store.js";
import { getMoodListFromLocal } from "@/api/moodList";

const userMoodRecordApi = uniCloud.importObject("user-mood-record");
const state = reactive({
  moodList: !userStrore.hasLogin ? getMoodListFromLocal(true) : [],
  loadMoreStatus: userStrore.hasLogin ? 'more' :'noMore', // 新增加载更多状态
  page: 1, // 新增页码
  pageSize: 10, // 新增每页数量
});

// 1. 获取最新一条记录的表情
const currentMoodEmoji = computed(() => {
  if (!state.moodList.length) return {}
  const latestMood = state.moodList[state.moodList.length-1];
  return state.currentMoodEmoji = moodEmojiMap[latestMood.mood_score];;
})

uni.$on("addMood", (data) => {
  const { moodEmojis } = state;
  if(!userStrore.hasLogin){
    uni.setStorageSync('moodList', [...state.moodList, data]);
  }
  console.log(uni.getStorageSync('moodList'))
  state.moodList.unshift(data);
  state.currentMoodEmoji = moodEmojiMap[data.mood_score];
});


const loadData = async (reset = false) => {
  if(!userStrore.hasLogin){
    return;
  }
  
  const res = await getMoodList();
  state.loadMoreStatus = "loading";
  try {
    const recordListRes = await userMoodRecordApi.getAll({
      page: state.page,
      pageSize: state.pageSize,
    });
    if (recordListRes.errCode == 0) {
      const { moodEmojis } = state;
      const moodList = recordListRes.data;
      state.moodList = [...state.moodList, ...moodList];
      const item = moodEmojis.find(
        (item) =>
          item.value === state.moodList[state.moodList.length - 1].mood_score
      );
      state.currentMoodEmoji = item;
      state.loadMoreStatus =
        moodList.length < state.pageSize ? "noMore" : "more";
      state.page++;
    }
  } catch (e) {
    state.loadMoreStatus = "more";
    uni.showToast({
      title: "加载失败",
      icon: "none",
    });
  }
};

const onReachBottom = () => {
  if (state.loadMoreStatus === "more") {
    loadData();
  }
};
</script>

<style scoped>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  margin-bottom: 30px;
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

</style>
