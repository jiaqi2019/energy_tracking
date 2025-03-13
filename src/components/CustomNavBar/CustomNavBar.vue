<template>
	<up-tabbar
		:value="props.tabIndex"
		@change="onChangeTab"
		:fixed="true"
		:placeholder="false"
		:safeAreaInsetBottom="true"
	>
		<up-tabbar-item  v-for="(item,index) in state.tabConf" :text="item.text" :icon="item.icon" activeColor='#ff00000'></up-tabbar-item>
	</up-tabbar>
</template>

<script setup lang="ts">
  import {
    reactive, ref, onMounted,defineProps
  } from 'vue';

  const state = reactive({
    tabConf: [
      {
        text: '记录',
        path: '/pages/index/index',
        icon: 'home'
      },
      {
        text: '回顾',
        path: '/pages/statistic/index',
        icon: 'play-right'
      },
    ],
  });
  const props = defineProps<{
    tabIndex: number,
  }>()

  const initIndex = () => {
    const pages = getCurrentPages();
    const currentPath = pages[pages.length - 1].route;
    const index = state.tabConf.findIndex(t => t.path === `/${currentPath}`);
    return index < 0 ? 0 : index;
  };
  // const tabIndex = ref(initIndex());

  const onChangeTab = (index:number) => {
    console.log('switch')
    // tabIndex.value = index;
    uni.switchTab({ url: state.tabConf[index].path, });
    // uni.navigateTo({ url: state.tabConf[index].path, });
  };

</script>

<style scoped>

</style>