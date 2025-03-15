<template>
  <view class="status_bar" />
  <view v-if="loadMoreStatus === 'noMore' && !state.moodList.length">
    <text class="h1 font-yozai flex justify-center">你现在感觉怎么样</text>
    <text class="h3 font-yozai flex justify-center"
      >记录当下，帮你更好觉察情绪</text
    >
    <view
      class="flex justify-center w-full items-center"
      style="margin-top: 50px"
      @click="onClickAdd"
    >
      <view class="circle flex items-center justify-center">
        <text class="icon-font" style="font-size: 100px">&#xe603;</text>
      </view>
    </view>
  </view>
  <!-- list渲染 -->
  <view v-else class="px-16">
    <text
      class="h1 font-yozai flex justify-center"
      style="margin-bottom: 30px"
      >{{ state.currentMoodEmoji.text }}</text
    >
    <vew class="flex justify-center w-full">
      <image :src="state.currentMoodEmoji.icon" class="mood-emoji" />
    </vew>
    <MoodRecordItem
      v-for="(item, index) in state.moodList"
      :time="item.create_time"
      :mood-score="item.mood_score"
      :eventDesc="item.event_desc"
    ></MoodRecordItem>
    <uni-load-more :status="state.loadMoreStatus" />
  </view>

  <view class="fixed-bottom" @click="onClickAdd">
    <view class="add-button flex items-center justify-center icon-font">
        &#xf0175;
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { moodEmojis } from "@/common/emoji";
import MoodRecordItem from "./components/mood-record-item/index.vue";
import { store as userStrore } from "@/uni_modules/uni-id-pages/common/store.js";
if (!userStrore.hasLogin) {
  uni.showToast({
    icon: "none",
    title: "请先登录",
  });
  uni.navigateTo({
    url: "/uni_modules/uni-id-pages/pages/login/login-withpwd",
  });
}
const userMoodRecordApi = uniCloud.importObject("user-mood-record");

const state = reactive({
  moodList: [],
  moodEmojis,
  currentMoodEmoji: {},
  currentMoodIndex: 0, // 默认选中中间的表情、
  loadMoreStatus: "more", // 新增加载更多状态
  page: 1, // 新增页码
  pageSize: 10, // 新增每页数量
});

// 修改获取数据方法
const loadData = async (reset = false) => {
  if (reset) {
    state.page = 1;
    state.moodList = [];
  }
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

onMounted(() => {
  uni.$on("addMood", (data) => {
    const { moodEmojis } = state;
    state.moodList.unshift(data);
    state.currentMoodEmoji = moodEmojis.find(
      (item) => item.value === data.mood_score
    );
  });
  loadData();
});
const onClickAdd = () => {
  uni.navigateTo({
    url: "/pages/mood-form/index",
    openType: "navigate",
  });
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

.add-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 13px;
  background: rgba(137,212,289, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
  font-size: 20px;
}

.add-button .icon-font {
  color: #fff;
}


</style>
