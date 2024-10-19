/**
 * 存放一些全局变量信息，
 * 此信息也会在本地缓存存储一份
 */
const GLOBAL_DATA = {
  // 当前选择的面板
  currentPanel: "default",
  // 是否开启隐私保护
  lock: false,
  // 当前是否是锁的状态，只要让这个值=true，整个系统就能保证锁住了
  isLockCurrent: false,  //初始时刻不要锁住，用户一开始创建宫格会发现看不到新建宫格。
  lockTimeCurrent: 0,  // 到达60秒的时候锁住
  lockTimeMax: 60,
  lastDate: null,    //记录日期，用于在日期变更时自动刷新。
  previousPannel: "default",   //用于记录在锁住之前的pannel，以便解锁的时候自动打开。

  /**
   * 更新全局信息
   * @param key {string}
   * @param value {object}
   */
  update(key, value) {
    this[key] = value;
    JSON_STORAGE.set("GLOBAL_DATA", this);
  },
};