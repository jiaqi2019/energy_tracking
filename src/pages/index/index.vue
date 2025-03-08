<template>
	<view class="page">
		<view class="u-flex u-flex-items-center">
			<view class="u-flex u-flex-column u-flex-grow">
				<text class="title">嗨，{{userStrore.userInfo.nickname}}</text>
				<text class="subtitle">今天感觉如何</text>
			</view>
			<view class="u-flex u-flex-items-center u-flex-center header-action-btn">
				<u-icon name="bell-fill" color="#e07a5f" size=20></u-icon>
			</view>
			<view class="u-flex u-flex-items-center u-flex-center header-action-btn" style="margin-left: 15px;">
				<u-icon name="setting-fill" color="#e07a5f" size=20></u-icon>
			</view>
		</view>
		<view class="summary-card">
			<view class="summary-header">
				<text>本周情绪概览</text>
				<text>查看详情</text>
			</view>
			<view class="stats-row">
				<view class="stat-box">
					<view class="stat-value">{{state.recordList.length || 0}}</view>
					<view class="stat-label">记录总数</view>
				</view>
				<view class="stat-box">
					<view class="stat-value" style="color: #43aa8b;">{{state.positiveCnt}}</view>
					<view class="stat-label">积极情绪</view>
				</view>
				<view class="stat-box">
					<view class="stat-value" style="color: #f94144;">{{state.negativeCnt}}</view>
					<view class="stat-label">消极情绪</view>
				</view>
			</view>
		</view>
		<view class="u-flex u-flex-between u-flex-items-center" style="margin-bottom: 16px;">
			<view class="section-title">最近记录</view>
			<view class="section-action">查看全部</view>
		</view>
		<view class="u-page">
			<view v-for="(item, index) in state.recordList" :key="index">
				<MoodRecordItem :time="item.create_time" :mood-score="item.mood_score" :eventDesc="item.event_desc"></MoodRecordItem>
			</view>
		</view>


	</view>
	<view class="create-btn" @click="onClickPlus">
		<u-icon name="plus" color="#ffffff" size=28></u-icon>
	</view>
	<RecordPopup :show="state.showPopup" :onClose="onClosePopup" :onConfirm="onConfirm"></RecordPopup>
	<up-toast ref="uToastRef"></up-toast>
	<CustomNavBar></CustomNavBar>

</template>

<script setup>
  import {
    onMounted,
    reactive,
    ref,
  } from 'vue';
  import MoodRecordItem from './components/mood-record-item/index.vue';
  import RecordPopup from './components/record-popup/index.vue';
  import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';

  if(!userStrore.hasLogin) {
    uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' });
  }
  const uToastRef = ref(null);

  const userMoodRecordApi = uniCloud.importObject('user-mood-record');
  const userIdApi = uniCloud.importObject('uni-id-co');
  const state = reactive({
    recordList: [],
    showPopup: false,
    positiveCnt: 0,
    negativeCnt: 0
  });
  onMounted(async () => {
    const recordListRes = await userMoodRecordApi.getAll();
    console.log(recordListRes);
    if (recordListRes.errCode == 0) {
      const recordList = recordListRes.data;
      state.recordList = recordList;
      state.positiveCnt = recordList.filter(item => item.mood_score > 2).length;
      state.negativeCnt = recordList.filter(item => item.mood_score < 2).length;
    }
    const userInfo = await userIdApi.getRealNameInfo();
    console.log(userInfo);
  });
  const onClickPlus = () => {
    state.showPopup = true;
  };
  const onClosePopup = () => {
    state.showPopup = false;
  };
  const onConfirm = async (data) => {
    const addRes = await userMoodRecordApi.add(data);
    if (addRes.errCode != 0) {
      uToastRef.value.show({ message: addRes.errMsg || '添加失败,请重试!' });
    } else {
      console.log(data);
      uToastRef.value.show({ message: '添加成功' });
      state.showPopup = false;
      setTimeout(() => {
        state.recordList.unshift({
          ...data,
          create_time: Date.now()
        });
      });

    }
  };
</script>

<style scoped>
	.page {
		padding: 16px;
		height: 100%;
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: #3d405b;
	}

	.subtitle {
		font-size: 14px;
		color: #81818e;
		margin-top: 5px;
	}

	.header-action-btn {
		width: 40px;
		height: 40px;
		border-radius: 15px;
		background-color: #fce8dd;
		font-size: 12px;
		transition: all 0.3s ease;
	}

	.summary-card {
		margin: 15px 0;
		background-color: #fffbf8;
		border-radius: 22px;
		padding: 22px;
		box-shadow: 0 8px 20px rgba(224, 122, 95, 0.08);
		border: 1px solid rgba(224, 122, 95, 0.15);
	}

	.summary-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.summary-title {
		font-size: 16px;
		font-weight: 600;
		color: #3d405b;
	}

	.summary-more {
		font-size: 14px;
		color: #e07a5f;
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
	}

	.stat-box {
		flex: 1;
		text-align: center;
		padding: 10px;
	}

	.stat-value {
		font-size: 24px;
		font-weight: 700;
		color: #e07a5f;
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 12px;
		color: #81818e;
	}

	.section-header {
		padding: 0 20px;
		margin: 25px 0 15px;
	}

	.section-title {
		font-size: 18px;
		font-weight: 600;
		color: #3d405b;
	}

	.section-action {
		font-size: 14px;
		color: #e07a5f;
	}

	.create-btn {
		position: fixed;
		bottom: 100px;
		right: 20px;
		width: 65px;
		height: 65px;
		border-radius: 50%;
		background: linear-gradient(135deg, #e07a5f, #e8927a);
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 24px;
		box-shadow: 0 8px 20px rgba(224, 122, 95, 0.4);
		z-index: 10;
		transition: all 0.3s ease;
	}
</style>