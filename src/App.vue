<script setup lang="ts">
  import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
  import {
    onLaunch, onShow, onHide
  } from '@dcloudio/uni-app';
  import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';
  import { syncMoodList } from '@/api/moodList/syncMoodList';

  onLaunch(async () => {
    await uniIdPageInit();
    console.log('userStrore', userStrore);
    if(!userStrore.isExpired) {
      // uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' });
      // return;
    }
    if(!userStrore.hasLogin) {
      uni.$on('uni-id-pages-login-success', () => {
        console.log('login success');
        syncMoodList();
      });
    }
    uniCloud.onRefreshToken(function (e) {
      console.log('refreshToken', e);
    });
  });
  onShow(() => {
    console.log('App Show');
  });
  onHide(() => {
    console.log('App Hide');
  });
</script>
<style lang="scss">
@import '@/uni_modules/uni-scss/index.scss';
  #app, uni-app, uni-page, uni-page-wrapper {
    height: unset;
  }
  body {
    --text-primary: #161823;
    background-color: #ebf2fa;
    // background-color: #16182314;
    color: var(--text-primary);
    height: unset;
    padding-bottom: 80px;
  }
	/*每个页面公共css */
	.w-full {
    width: 100%;
  }
  .flex {
    display: flex;
    flex-direction:row;
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }
  .justify-around {
    justify-content: space-around;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .flex-1 {
    flex: 1
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .absolute {
    position: absolute;
  }
  .relative {
    position: relative;
  }
  .fixed {
    position: fixed;
  }
  .bottom-tabbar {
   	// bottom: var(--window-bottom);
  }
  .left-0 {
    left: 0;
  }
  .right-0 {
    right: 0;
  }
  .top-0 {
    top-0: 0;
  }
  .text-medium {
    font-weight: bold;
  }

  .text-center {
    text-align: center;
  }
  .abs-full {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .abs-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .p-16 {
    padding: 16px;
  }
  .m-16 {
    margin: 16px;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .mt-8 {
    margin-top: 8px;
  }
  .ml-16 {
    margin-left: 16px;
  }

  .px-16 {
    padding:  0 16px;
  }
  .py-16 {
    padding: 16px 0;
  }

  .overflow-hidden {
    overflow: hidden;
  }
  .h1 {
    font-size: 40px;
    line-height: 1.5em;
  }

  .h3 {
    font-size: 20px;
    line-height: 1.5em;
  }

  .text-TextPrimary {
    color: var(--text-primary);
  }
  .icon-font {
    font-family: 'iconfont';
  }
  .font-yozai {
    font-family: Yozai;
  }
  @font-face {
    font-family: 'iconfont';
    src: url('~@/static/icon/iconfont.ttf') format('truetype');
  }

  @font-face {
    font-family: Yozai;
    src: url('./static/font/Yozai-Medium.ttf');
  }
  // .uni-tabbar {
  //   display: none !important;
  // }
  // .uni-placeholder {
  //   display: none !important;
  // }
  // .uni-tabbar {
  //   display: none;
  // }
</style>
