import Taro from '@tarojs/taro';
import config from '@/src/config.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { has, clone, sum } from '@/src/utils/mylodash.js';

class Store {
  async addUserToCloud(data) {
    const openid = data.openid;
    if (!openid) return;
    try {
      const db = Taro.cloud.database();
      const res = await db.collection('users').where({ openid: openid }).get();
      const user = res.data[0];
      if (user) {
        this.setObject('records', user.records || {});
        this.setObject('types', user.types || []);
        this.setObject('state', user.state || {});
        Taro.setStorageSync('openid', user.openid);
      } else {
        userInfo.types = ['跑步🏃‍♀️'];
        await db.collection('users').add({ data: userInfo });
      }

    } catch(err) {
      console.log(err)
    }
  }

  async updateUserToCloud(data) {
    const openid = this.getString('openid');
    if (!openid) return;
    try {
      const db = Taro.cloud.database();
      const res = await db.collection('users')
                          .where({ openid: openid })
                          .update({ data: data })
    } catch(err) {
      console.log(err)
    }
  }

  setObject(key, object) {
    try {
      Taro.setStorageSync(key, JSON.stringify(object));
      this.updateUserToCloud({[key]: object});
    } catch (e) { console.error('invalid object'); }
  }

  getString(key) {
    try {
      return Taro.getStorageSync(key);
    } catch (e) { console.error(e.message); }
  }

  setRecords(records) {
    this.setObject('records', records);
  }

  get(key) {
    const str = Taro.getStorageSync(key);
    return str ? JSON.parse(str) : str;
  }

  getTypes() {
    // this.setObject('types', ['弹琴', '学习', '运动']);
    return this.get('types') || [];
  }

  loggedIn() {
    console.log('xxx');
    console.log(this.getString('openid'));
    return this.getString('openid');
  }

  addType(name) {
    const types = this.get('types') || [];
    console.log(types);
    if (Array.isArray(types) && types.length <= 5) {
      if (!types.includes(name)) {
        types.push(name);
        this.setObject('types', types);
      }
    }
  }

  removeType(type) {
    const types = this.get('types');
    if (Array.isArray(types)) {
      const newTypes = types.filter(i => i !== type);
      console.log(newTypes);
      return this.setObject('types', newTypes);
    }
  }

  random(factor) {
    return Math.floor(Math.random() * factor);
  }

  renameType(oldName, newName) {
    this.removeType(oldName);
    this.addType(newName);
  }

  currentState() {
    const s = this.getState();
    s.result = this.summary()
    return s;
  }

  getState() {
    try {
      return this.get('state') || {};
    } catch (e) {
      return {}
    }
  }

  getRecords() {
    try {
      return this.get('records') || {};
    } catch (e) {
      return {}
    }
  }

  getStartedSeconds() {
    const current = this.getState();
    if (current.status === 'idle') {
      return 0;
    } else {
      const ms = moment().diff(moment(current.start));
      return this.msToHms(ms);
    }
  }

  getHumanTime(dateStr) {
    return moment(dateStr).format('LLLL');
  }

  msToHms(ms) {
    const seconds = Math.floor(ms / 1000);
    const ss = seconds % 60;
    const mm = Math.floor(seconds / 60) % 60;
    const hh = Math.floor(seconds / 3600);
    if (hh > 0) {
      return `${hh}小时${mm}分${ss}秒`;
    } else if (mm > 0) {
      return `${mm}分${ss}秒`;
    } else {
      return `${ss}秒`;
    }
  }

  setStart(type) {
    const state = {
      type,
      start: new Date(),
      status: 'started'
    };
    this.setObject('state', state);
  }

  setStop() {
    const last = this.get('state');
    const lastType = last ? last.type : null;
    const newState = {
      type: last.type,
      end: new Date(),
      status: 'idle'
    };
    if (last && last.status === 'started') {
      const ms = moment().diff(moment(last.start));
      const date = moment().format('YYYY-MM-DD');
      this.addRecord(last.type, date, ms);
    }
    this.setObject('state', newState);
  }

  addRecord(type, date, ms) {
    const records = this.getRecords();
    const typeRecords = records[type] || {};
    const newTypeRecords = clone(typeRecords[date] || []);
    newTypeRecords.push(ms);
    typeRecords[date] = newTypeRecords
    records[type] = typeRecords;
    this.setRecords(records);
  }

  todaySummary() {
    return this.dateSummary();
  }

  dateSummary(date = undefined) {
    const records = this.getRecords();
    const d = moment(date).format('YYYY-MM-DD');
    console.log(d);
    const data = [];
    const keys = Object.keys(records);
    keys.forEach(key => {
      const ms = sum((records[key][d] || []));
      data.push({
        name: key,
        value: ms,
        a: '1',
        label: this.msToHms(ms)
      });
    });
    return data;
  }

  summary() {
    const records = this.getRecords();
    const sumAll = (date_ms_arr) => {
      const daily = Object.entries(date_ms_arr)
                             .map(item => item[1])
                             .map(arr => sum(arr))
      return sum(daily);
    }
    const data = [];
    const keys = Object.keys(records);
    keys.forEach(key => {
      const ms = sumAll(records[key]);
      data.push({
        name: key,
        value: ms / 1000,
        a: '1',
        label: this.msToHms(ms)
      });
    });
    return data;
  }

  lineSummary() {
    const records = this.getRecords();
    const dates = [];
    const limit = 7;
    [...Array(limit).keys()].forEach(i => dates.push(moment().subtract(i, 'day').format('YYYY-MM-DD')));
    const data = [];
    const types = Object.keys(records);
    dates.forEach(date => {
      types.forEach(type => {
        data.push({
          type,
          date,
          value: sum(records[type][date] || []) / 1000 / 60
        });
      })
    });
    return data;
  }

  async clearAll() {
    try {
      await this.setObject('records', {});
      await this.setObject('state', {});
    } catch(e) {
      // Do something when catch error
    }
  }
}

export default new Store();
