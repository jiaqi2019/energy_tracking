// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const dbJQL = uniCloud.databaseForJQL();
const uniID = require('uni-id-common');
const dbCmd = dbJQL.command;

const getMoodByCustomTime = async ({
  user_id, start_time,  end_time
}) => {
  const res = await dbJQL.collection('user-mood-record').where({
    is_deleted: false,
    user_id,
    create_time: dbCmd.gte(start_time).and(dbCmd.lte(end_time))
  }).get();
  return res;
};

const getMoodGroupByCustomTime = async ({
  user_id, start_time,  end_time
}) => {
  const res = await dbJQL.collection('user-mood-record').where({
    is_deleted: false,
    user_id,
    create_time: dbCmd.gte(start_time).and(dbCmd.lte(end_time))
  }).groupBy('mood_score').groupField('count(*) as total_mood').get();
  return res;
};
module.exports = {
  _before: async function () { // 通用预处理器
    this.startTime = Date.now();
    const clientInfo = this.getClientInfo();
    const uniIDIns = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
      clientInfo
    });
    const payload = await uniIDIns.checkToken(clientInfo.uniIdToken);
    this.payload = payload;
    if (payload.code !== 0) {
      return { errCode: '1002' };
    }
    const {
      permission,
      role,
      uid
    } = payload;
    dbJQL.setUser({
      permission,
      role,
      uid
    });
  },

  add: async function (paramsData) {
    const user_id = this.payload.uid;
    const record = {
      is_deleted: false,
      create_time: Date.now(),
      update_time: Date.now(),
      user_id,
      ...paramsData,
    };
    const res = await dbJQL.collection('user-mood-record').add(record);
    return res;
  },
  getAll: async function () {
    const user_id = this.payload.uid;
    const res = await dbJQL.collection('user-mood-record').where({
      is_deleted: false,
      user_id
    }).orderBy('create_time', 'desc').get();
    return {
      user_info: this.payload,
      ...res,
    };
  },
  // 新增获取当天心情数据的方法
  getMoodByToday: async function () {
    const user_id = this.payload.uid;
    const now = new Date();
    const end_time = now.getTime();
    // 设置时间为当天的 00:00:00
    now.setHours(0, 0, 0, 0);
    const start_time = now.getTime();
    return getMoodByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },
  getMoodByLastWeek: async function () {
    const user_id = this.payload.uid;
    const end_time = new Date().getTime();
    const start_time = end_time - 7 * 24 * 60 * 60 * 1000;
    return getMoodByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },
  getMoodByLastMonth: async function () {
    const user_id = this.payload.uid;
    const end_time = new Date().getTime();
    const start_time = end_time - 30 * 24 * 60 * 60 * 1000;
    return getMoodByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },
  getMonthMood: async function (start_time,  end_time) {
    const user_id = this.payload.uid;
    return getMoodByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },
  getMoodGroupByLastWeek: async function () {
    const user_id = this.payload.uid;
    const end_time = new Date().getTime();
    const start_time = end_time - 7 * 24 * 60 * 60 * 1000;
    return getMoodGroupByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },
  getMoodGroupByLastMonth: async function () {
    const user_id = this.payload.uid;
    const end_time = new Date().getTime();
    const start_time = end_time - 30 * 24 * 60 * 60 * 1000;
    return getMoodGroupByCustomTime({
      user_id,
      start_time,
      end_time
    });
  },

  getMoodGroup: async function (start_date, end_date) {
    const user_id = this.payload.uid;
    const start_time = new Date(start_date).getTime();
    const end_time = new Date(end_date).getTime();
    return getMoodGroupByCustomTime({
      user_id,
      start_time,
      end_time
    });;
  },



  _after (error, result) {
    if (error) {
      return error;
    }
    return result;
  }
};