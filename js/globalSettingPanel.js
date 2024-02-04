/**
 * 全局设置面板
 */
const GLOBAL_SETTINGS_PANEL = {
  panelEle: document.querySelector("dialog#global-settings-panel"),
  closeBtn: document.querySelector("dialog#global-settings-panel button.close"),

  // 内部的一些数据
  lockStateShowEle: document.querySelector("dialog#global-settings-panel #lock-state"),
  lockStateSwitchBtn: document.querySelector("dialog#global-settings-panel #lock-switch"),

  /**
   * 加载面板内部的信息
   */
  load() {
    GLOBAL_SETTINGS_PANEL.lockStateShowEle.innerText = GLOBAL_DATA.lock ? "开启" : "关闭";
  },

  switchLock() {
    GLOBAL_DATA.update("lock", !GLOBAL_DATA.lock);
    GLOBAL_SETTINGS_PANEL.lockStateShowEle.innerText = GLOBAL_DATA.lock ? "开启" : "关闭";
    // 刷新时间轴面板
    const lockTimeBox = document.querySelector("#lock-time-box");
    if (GLOBAL_DATA.lock) {
      lockTimeBox.classList.remove("hidden");
    } else {
      lockTimeBox.classList.add("hidden");
    }
  },

  close() {
    this.panelEle.classList.add("hidden");
  },

  open() {
    this.panelEle.classList.remove("hidden");
  }
};