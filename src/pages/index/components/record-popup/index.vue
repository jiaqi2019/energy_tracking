<template>
	<up-popup :show="props.show" :round="10" @close="props.onClose" @open="onShow" mode="bottom" :safeAreaInsetBottom="false"
		bgColor="#fff5ee" :customStyle="{padding:'16px'}" :closeOnClickOverlay="true">
		<up-form ref="formRef" :model="formData" errorType='none'>
			<view class="emotion-header">
				<view class="emotion-title">你现在的心情如何？</view>
			</view>

			<up-form-item prop="mood_score" :model="formData.mood_score" class="form-item">
				<up-subsection :list="eventTypeCof" :current="0" @change="chagenEventType"></up-subsection>
			</up-form-item>
			<view class="emotion-header">
				<view class="emotion-title">能量值如何？</view>
			</view>
			<up-form-item prop="energy_value">
				<up-line-progress :percentage="formData.energy_value" :showText="false" />
			</up-form-item>
			<view class="button-group">
				<view class="button-group__circle" hover-class="u-hover-class" @click="changeEnergyValue('minus')">
					<text class="button-group__circle__text">减少</text>
				</view>
				<text style="min-width: 25px; text-align: center;">{{formData.energy_value}}</text>
				<view class="button-group__circle" hover-class="u-hover-class" @click="changeEnergyValue('plus')">
					<text class="button-group__circle__text">增加</text>
				</view>
			</view>
			<view class="input-container">
				<view class="input-label">什么触动了你这个情绪？</view>
				<up-form-item prop="event_desc">
					<up-textarea placeholder="发生了什么事" v-model="formData.event_desc" autoHeight></up-textarea>
				</up-form-item>
			</view>
		</up-form>
		<up-toast ref="uToastRef"></up-toast>
		<button class="save-button" @click="onClickSave">保存记录</button>
	</up-popup>
</template>

<script lang="ts" setup>
  import {
    defineProps, reactive, onMounted, ref
  } from 'vue';
  const formRef = ref(null);
  const uToastRef = ref(null);
  const props = defineProps<{
    show : boolean;
    onConfirm : (data:any) => void;
    onClose : () => void;
  }>();
  const onfocus = () => {
    console.log('focus');
  };
  const { formData, } = reactive({
    formData: {
      mood_score: 0,
      energy_value: 50,
      event_desc: '',
    },
  });
  const eventTypeCof = ref(['很不开心', '不开心', '一般', '开心', '很开心']);

  const onShow = () => {
    formRef.value.setRules({
      mood_score: [{
        required: true,
        type: 'number',
        min: 0,
        message: '给心情打个分吧',
      },],
      energy_value: [{
        required: true,
        type: 'number',
        message: '能量值提供了多少呀',
      }],
      event_desc: [{ required: false, }]
    });
  };
  const chagenEventType = (index : number) => {
    formData.mood_score = index;
  };
  const changeEnergyValue = (type : string) => {
    const prEnergyValue = formData.energy_value;
    let delta = type === 'plus' ? 10 : -10;
    formData.energy_value = uni.$u.range(0, 100, prEnergyValue + delta);
  };

  const onClickSave = async () => {
    const res = await formRef.value.validate().catch(res => res);
    if (res.length) {
      uToastRef.value.show({ message: res[0].message });
      return;
    }
    console.log('formadata', formData);
    props.onConfirm(formData);
  };
</script>

<style lang="scss">
	.emotion-header {
		text-align: center;
	}

	.emotion-title {
		font-size: 22px;
		font-weight: 700;
		color: #3d405b;
		margin-bottom: 10px;
	}

	.emotion-selector {
		text-align: center;
		padding: 0 12px;
	}

	.emotion-faces-improved {
		display: flex;
		justify-content: space-between;
		margin: 20px 0;
	}

	.emotion-face-improved {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
	}

	.face-label {
		font-size: 12px;
		color: #81818e;
		transition: color 0.3s;
	}

	.emotion-face-improved.active .face-label {
		font-weight: 600;
		color: #3d405b;
	}

	.input-container {
		background-color: #fff;
		border-radius: 18px;
		padding: 20px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
		margin-top: 20px;
	}

	.input-label {
		font-size: 16px;
		font-weight: 600;
		color: #3d405b;
		margin-bottom: 15px;
	}

	.save-button {
		width: 100%;
		height: 54px;
		margin-top: 20px;
		background: linear-gradient(135deg, #e07a5f, #e8927a);
		border: none;
		border-radius: 16px;
		color: white;
		font-size: 18px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(224, 122, 95, 0.3);
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.input-container .u-textarea {
		background-color: #f9f4f0;
		min-height: 80px;
		border: none;
		border-radius: 12px;
		padding: 15px;
		font-size: 16px;
		line-height: 1.5;
		color: #3d405b;
	}

	.button-group {
		@include flex;
		justify-content: center;
		align-items: center;

		&__circle {
			width: 50px;
			height: 50px;
			background-color: #dbfbdb;
			border-radius: 100px;
			justify-content: center;
			align-items: center;
			margin: 0 10px;
			display: flex;

			&__text {
				color: rgb(25, 190, 107);
				font-size: 13px;
			}
		}
	}
</style>