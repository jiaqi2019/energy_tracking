<template>
	<view class="page">
    <uni-section  type="line">
			<view class="uni-padding-wrap uni-common-mt">
				<uni-segmented-control :current="state.tabIndex" :values="['本周', '本月']" style-type="button"
					active-color="#007aff" @clickItem="onClickItem" />
			</view>
		</uni-section>
    <view class="u-flex uni-mt-8">
      <text class="title">情绪回顾</text>
      </view>
      <MoodLineChart :chartData="state.lineChartData"/>
      <view class="u-flex">
        <text class="title">情绪分布</text>
      </view>
      <MoodeRingChart :chartData="state.ringChartData" />
    </view>
</template>

<script setup>
  import {
    reactive, onMounted
  } from 'vue';
  import MoodeRingChart from './components/mood-ring-chart/index.vue';
  import MoodLineChart from './components/mood-line-chart/index.vue';
  const userMoodRecordApi = uniCloud.importObject('user-mood-record');

  const state = reactive({
    tabIndex: 0,
    lineChartData: {},
    ringChartData: {},
    lineWeekData: {},
    ringWeekData: {},
    lineMonthData: {},
    ringMonthData: {},
  });
  onMounted(async () => {
    await getMoodRecord();
  });

  const getMoodRecord = async () => {
    Promise.all([userMoodRecordApi.getMoodByLastWeek(), userMoodRecordApi.getMoodGroupByLastWeek()]).then(res => {
      const [lastWeekMoodRes, lastWeekMoodGroupRes] = res;
      const lineData = formatLineData(lastWeekMoodRes);
      const RingData = formatRingData(lastWeekMoodGroupRes);
      state.lineChartData = lineData;
      state.ringChartData = RingData;
    }).catch(() => {

    });

    Promise.all([userMoodRecordApi.getMoodByLastMonth(), userMoodRecordApi.getMoodGroupByLastMonth()]).then(res => {
      const [lastMonthMoodRes, lastMonthMoodGroupRes] = res;
      const lineData = formatLineData(lastMonthMoodRes);
      const RingData = formatRingData(lastMonthMoodGroupRes);
      state.lineMonthData = lineData;
      state.ringMonthData = RingData;
      state.lineWeekData = lineData;
      state.ringWeekData = RingData;
    }).catch(() => {

    });
  };
  const formatLineData = (res) => {
    if (res.errCode != 0) {
      return;
    }
    const recordList = res.data;

    //模拟从服务器获取数据时的延时
    return {
      categories: recordList.map(item => {
        const date = new Date(item.create_time).toLocaleDateString();
        const [year, month, day] = date.split('/');
        return `${month}-${day}`;
      }),
      series: [
        {
          name: '心情值',
          linearColor: [
            [
              0,
              '#1890FF'
            ],
            [
              0.25,
              '#00B5FF'
            ],
            [
              0.5,
              '#00D1ED'
            ],
            [
              0.75,
              '#00E6BB'
            ],
            [
              1,
              '#90F489'
            ]
          ],
          setShadow: [
            3,
            8,
            10,
            '#1890FF'
          ],
          data: recordList.map(item => item.mood_score)
        },
      ]
    };
  };
  const formatRingData = (res) => {
    if (res.errCode != 0) {
      return;
    }
    const moodCountList = res.data;
    //模拟从服务器获取数据时的延时
    return {
      series: [
        {
          data: ['很不开心', '不开心', '一般', '开心', '很开心'].map((item, index) => {
            const colorList = ['#EE6666', '#FC8452', '#FAC858', '#73C0DE', '#3CA272'];
            const mood = moodCountList.find(mood => mood.mood_score == index);
            return {
              name: item,
              value: mood?.total_mood || 0,
              color: colorList[index]
            };
          })
        }
      ]
    };
  };

  const onClickItem = (e) => {
    state.tabIndex = e.currentIndex;
    if (e.currentIndex == 0) {
      state.lineChartData = state.lineWeekData;
      state.ringChartData = state.ringWeekData;
    }else {
      state.lineChartData = state.lineMonthData;
      state.ringChartData = state.ringMonthData;
    }
  };

</script>

<style>
  .page {
		padding: 16px;
  }
  .page .uni-section{
    background-color: unset !important;
  }

</style>
