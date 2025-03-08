<template>
  <view class="charts-box">
    <qiun-data-charts
      type="line"
      :opts="chartOpts"
      :chartData="props.chartData"
      :ontouch="true"
      background="rgb(248, 241, 234)"
    />
  </view>
</template>

<script setup lang="ts">
  import {
    reactive, onMounted, defineProps, ref
  } from 'vue';
  import { opts } from './opt';
  const chartOpts = ref(opts);
  const props = defineProps<{
    chartData: any;
  }>();
</script>

<style>
  .page {
		padding: 16px;
  }
	.title {
		font-size: 24px;
		font-weight: 700;
		color: #3d405b;
	}
  .charts-box {
    width: 100%;
    height: 300px;
  }
</style>
