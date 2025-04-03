<template>
  <view class="header-bar" />
  <view class="login-container">
    <!-- 顶部标题区域 -->
    <view class="header">
      <text class="title font-yozai">账号登录</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 登录按钮区域 -->
      <view class="action-buttons">
        <button v-if="!userStrore.hasLogin" class="action-btn primary-btn font-yozai" @click="handleLogin">
          <!--  #ifdef MP-WEIXIN  -->
          微信授权登录
          <!--  #endif  -->
          <!--  #ifndef MP-WEIXIN  -->
          登录同步数据
          <!--  #endif  -->
        </button>
        <button v-else class="action-btn primary-btn font-yozai" @click="handleLoginout">
          退出登陆
        </button>
        <button class="action-btn secondary-btn font-yozai" @click="handleJoinUs">
          🎁 联系小帅享专属服务🎁
        </button>
        <!--
          <button class="action-btn outline-btn font-yozai" @click="handleContact">
            我们反馈的联系方式
          </button>
          -->
      </view>

      <!-- 附加信息区域 -->
      <!--
      <view class="info-section">
        <text class="info-text font-yozai">一些关于这个产品的承诺</text>
        <text class="info-text font-yozai">一些合规要求我们必须放的</text>
      </view>
      -->
    </view>
  </view>
</template>

<script setup>
import { store as userStrore } from '@/uni_modules/uni-id-pages/common/store.js';
import { mutations } from '@/uni_modules/uni-id-pages/common/store.js';
const handleLogin = () => {
  // 处理登录逻辑
  /*  #ifndef MP-WEIXIN  */
  uni.navigateTo({ url: '/uni_modules/uni-id-pages/pages/login/login-withpwd' });
  /*  #endif  */
  /*  #ifdef MP-WEIXIN  */
  const type = 'weixin';
  uni.showLoading({ title: '正在登陆...' });
  uni.login({
    'provider': type,
    'onlyAuthorize': true,
    success: async e => {
      const params = { code: e.code };
      const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true });

      uniIdCo.loginByWeixin(params).then(result => {
        uni.showToast({
						title: '登录成功',
						icon: 'none',
						duration: 2000
					});
          console.log('mutations.loginSuccess');
					mutations.loginSuccess({ autoBack: false });
				})
				.catch(e => {
					uni.showModal({
						content: e.message,
						confirmText: '知道了',
						showCancel: false
					});
				})
				.finally(e => {
					uni.hideLoading();
				});
    },
    fail: async (err) => {
      uni.showModal({
        content: `登录失败; code: ${err.errCode || -1}`,
        confirmText: '知道了',
        showCancel: false
      });
      uni.hideLoading();
    }
  });
  /*  #endif  */

};
const handleLoginout = () => {
  mutations.logout();
};

const handleJoinUs = () => {
  uni.showActionSheet({
    itemList: ['复制微信号'],
    success: function (res) {
      switch (res.tapIndex) {
        case 0:
          // 复制微信号到剪贴板
          uni.setClipboardData({
            data: 'yihangtang666', // 替换成实际的微信号
            success: function () {
              uni.showToast({
                title: '微信号已复制',
                icon: 'success'
              });
            }
          });
          break;
        case 1:
          // 打开客服会话
          uni.openCustomerServiceChat({
            extInfo: { url: 'YOUR_CUSTOMER_SERVICE_URL' }, // 替换成真实的客服会话链接
            corpId: 'YOUR_CORP_ID', // 替换成企业ID
            success (res) {
              console.log('打开客服会话成功');
            },
            fail (err) {
              console.error('打开客服会话失败', err);
              // 如果打开失败，提供备选方案
              uni.showModal({
                title: '温馨提示',
                content: '无法打开客服会话，请复制微信号添加',
                confirmText: '复制微信号',
                success: (res) => {
                  if (res.confirm) {
                    uni.setClipboardData({
                      data: 'YOUR_WECHAT_ID', // 替换成实际的微信号
                      success: function () {
                        uni.showToast({
                          title: '微信号已复制',
                          icon: 'success'
                        });
                      }
                    });
                  }
                }
              });
            }
          });
          break;
      }
    },
    fail: function (res) {
      console.log(res.errMsg);
    }
  });
};

const handleContact = () => {
  // 处理联系方式逻辑
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  padding: 20px;
}

.header {
  margin-bottom: 40px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #4A90E2;
  color: white;
  border: none;
}

.secondary-btn {
  background: linear-gradient(45deg, #FF6B6B, #43AA8B);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(67, 170, 139, 0.3);
  position: relative;
  overflow: hidden;
}

.secondary-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 40%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 80%,
    transparent 100%
  );
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transform: skewX(20deg);
  animation: conanShine 4s infinite;
  mix-blend-mode: overlay;
}

@keyframes conanShine {
  0% {
    left: -100%;
  }
  45%, 100% {
    left: 200%;
  }
}

.outline-btn {
  background-color: transparent;
  color: #666666;
  border: 1px solid #DDDDDD;
}

.action-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.info-section {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-text {
  font-size: 14px;
  color: #999999;
  text-align: center;
}
</style>