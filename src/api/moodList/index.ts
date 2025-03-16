const userMoodRecordApi = uniCloud.importObject('user-mood-record');

interface GetMoodListParams {
    offset?: number;
}
export interface Mood {
    _id?: string;
    user_id: string;
    event_desc?: string;
    mood_score: number;
    energy_value?: number;
    is_deleted?: boolean;
    create_time: number;
    update_time?: number;
}

export const getMoodList = async (params: GetMoodListParams) => {
  return await userMoodRecordApi.getAll(params);
};

export const getMoodListFromLocal = (needReverse: boolean = false) => {
  const localData = uni.getStorageSync('moodList');
  if(localData) {
    return needReverse ? localData.reverse() : localData as Array<any>;
  }
  return [];
};

// 获取今天的心情记录
export const getTodayMoodList = (): Mood[] => {
  const list = getMoodListFromLocal();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return list.filter((item: Mood) => {
    const itemDate = new Date(item.create_time);
    return itemDate >= today;
  });
};

export function calculateAverageMoodByDay (moodList: Mood[]) {
  // Group moods by date (YYYY-MM-DD)
  const groupedByDay = moodList.reduce((acc, mood) => {
    const date = new Date(mood.create_time).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(mood);
    return acc;
  }, {} as Record<string, Mood[]>);
  // Calculate average mood_score for each day
  return Object.entries(groupedByDay).map(([date, moods]) => {
    const avgScore = moods.reduce((sum, mood) => sum + mood.mood_score, 0) / moods.length;
    return {
      ...moods[0], // Keep other properties from first mood
      create_time: new Date(date).getTime(), // Set time to start of day
      mood_score: avgScore
    };
  });
}


// 获取最近30天的心情记录
export const getLastMonthMoodList = (): Mood[] => {
  const allMoods = getMoodListFromLocal();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Filter last month's moods
  const lastMonthMoods = allMoods.filter(mood =>
    new Date(mood.create_time) >= oneMonthAgo
  );

  return calculateAverageMoodByDay(lastMonthMoods);
};

// 获取最近7天的心情记录
export const getLastWeekMoodList = (): Mood[] => {
  const allMoods = getMoodListFromLocal();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Filter last week's moods
  const lastWeekMoods = allMoods.filter((mood: Mood) =>
    new Date(mood.create_time) >= oneWeekAgo
  );

  return calculateAverageMoodByDay(lastWeekMoods);
};

// 统一获取本地心情记录的方法
export const getMoodListLocal = (type: 'today' | 'week' | 'month'): Mood[] => {
  switch (type) {
  case 'today':
    return getTodayMoodList();
  case 'week':
    return getLastWeekMoodList();
  case 'month':
    return getLastMonthMoodList();
  default:
    return [];
  }
};