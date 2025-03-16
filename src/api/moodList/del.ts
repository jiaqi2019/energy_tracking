import type { Mood } from '.';
const userMoodRecordApi = uniCloud.importObject('user-mood-record', { customUI: true });

export const delMoodListFromLocal = (create_time: number) => {
  const localData: Mood[] = uni.getStorageSync('moodList');
  if(localData) {
    const index = localData.findIndex(item => item.create_time === create_time);
    if(index !== -1) {
      localData.splice(index, 1);
    }
  }
  uni.setStorageSync('moodList', localData);
};

export const delMoodListFromApi = async (id: string) => {
  return await userMoodRecordApi.deleteById(id);
};
