<template>
	<up-tabbar
		:value="tabIndex"
		@change="onChangeTab"
		:fixed="true"
		:placeholder="true"
		:safeAreaInsetBottom="true"
	>
		<up-tabbar-item  v-for="(item,index) in state.tabConf" :text="item.text" :icon="item.icon" activeColor='#ff00000'></up-tabbar-item>
	</up-tabbar>
</template>

<script setup>
  import {
    reactive, ref, onMounted
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

  const initIndex = () => {
    const pages = getCurrentPages();
    const currentPath = pages[pages.length - 1].route;
    const index = state.tabConf.findIndex(t => t.path === `/${currentPath}`);
    return index < 0 ? 0 : index;
  };
  const tabIndex = ref(initIndex());

  const onChangeTab = (index) => {
    tabIndex.value = index;
    uni.navigateTo({ url: state.tabConf[index].path, });
  };

</script>

<style scoped>

</style>