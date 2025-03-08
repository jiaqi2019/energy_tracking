<template>
  <view class="charts-box">
    <qiun-data-charts
       type="pie"
      :opts="state.opts"
      :chartData="props.chartData"
    />
  </view>
</template>


<script setup lang="ts">
  import {
    reactive, onMounted, defineProps,
  } from 'vue';
  const props = defineProps < { chartData: any }>();
  const userMoodRecordApi = uniCloud.importObject('user-mood-record');

  const state = reactive({
    opts: {
      // color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
      padding: [5, 5, 5, 5],
      enableScroll: false,
      extra: {
        pie: {
          activeOpacity: 0.5,
          activeRadius: 10,
          offsetAngle: 0,
          labelWidth: 15,
          border: false,
          borderWidth: 3,
          borderColor: '#FFFFFF'
        }
      }
    },
  });

</script>

<style>
	.title {
		font-size: 24px;
		font-weight: 700;
		color: #3d405b;
    /*  '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc' */
    color: #91CB74;
    color: #FAC858;
    color: #EE6666;
    color: #73C0DE;
    color: #3CA272;
    color: #FC8452;
    color: #9A60B4;
    color: #ea7ccc;
	}
.charts-box {
    width: 100%;
    height: 300px;
  }

</style>