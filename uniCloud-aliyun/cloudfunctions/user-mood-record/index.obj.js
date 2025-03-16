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

  // 新增批量添加接口
  batchAdd: async function (recordsArray) {
    const user_id = this.payload.uid;

    // 为每条记录添加必要的字段
    const records = recordsArray.map(record => ({
      is_deleted: false,
      user_id,
      ...record
    }));

    const res = await dbJQL.collection('user-mood-record').add(records);
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
  getMoodList: async function (offset = 0, limit = 10) {
    const user_id = this.payload.uid;

    // Get total count for has_more calculation
    const countResult = await dbJQL.collection('user-mood-record')
      .where({
        is_deleted: false,
        user_id
      })
      .count();

    // Get paginated records
    const result = await dbJQL.collection('user-mood-record')
      .where({
        is_deleted: false,
        user_id
      })
      .orderBy('create_time', 'desc')
      .skip(offset)
      .limit(limit)
      .get();

    // Calculate if there are more records
    const total = countResult.total;
    const has_more = offset + limit < total;
    return {
      ...result,
      data: {
        mood_list: result.data,
        has_more,
      }
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
  getMoodByCurrentYear: async function () {
    const user_id = this.payload.uid;
    const now = new Date();
    const end_time = now.getTime();
    // 设置时间为当年的1月1日 00:00:00
    now.setMonth(0, 1);
    now.setHours(0, 0, 0, 0);
    const start_time = now.getTime();
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

  // 新增删除心情记录的方法
  deleteById: async function (id) {
    const user_id = this.payload.uid;
    // 确保用户只能删除自己的数据
    const res = await dbJQL.collection('user-mood-record')
      .where({
        _id: id,
        user_id,
        is_deleted: false
      })
      .update({
        is_deleted: true,
        update_time: Date.now()
      });

    return res;
  },

  _after (error, result) {
    if (error) {
      return error;
    }
    return result;
  }
};