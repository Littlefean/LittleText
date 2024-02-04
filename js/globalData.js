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
  isLockCurrent: true,
  lockTimeCurrent: 0,  // 到达60秒的时候锁住
  lockTimeMax: 60,

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