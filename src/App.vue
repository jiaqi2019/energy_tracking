<script setup lang="ts">
  import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
  import {
    onLaunch, onShow, onHide
  } from '@dcloudio/uni-app';
  import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';

  onLaunch(async () => {
    await uniIdPageInit();
    console.log('userStrore', userStrore);
    if(!userStrore.hasLogin || userStrore.isExpired) {
      uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' });
    }
    uniCloud.onRefreshToken(function (e) {
      console.log('refreshToken', e);
    });
    console.log('App Launch');
  });
  onShow(() => {
    console.log('App Show');
  });
  onHide(() => {
    console.log('App Hide');
  });
</script>
<style lang="scss">
@import "uview-plus/index.scss";
@import '@/uni_modules/uni-scss/index.scss';
body {
  background-color: rgb(248, 241, 234);
}
</style>
