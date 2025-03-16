import { getMoodListFromLocal } from './index';
import type { Mood } from './index';
const userMoodRecordApi = uniCloud.importObject('user-mood-record');

export const syncMoodList = async () => {
  const moodList: Mood[] = await getMoodListFromLocal();
  // 使用事务批量插入数据
  const result = await userMoodRecordApi.batchAdd(moodList);
  if (result.code === 0) {
    // 插入成功，删除本地数据
    uni.removeStorageSync('moodList');
  }
  return result;
};