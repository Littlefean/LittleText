/**
 * 全局设置面板
 */
class GLOBAL_SETTINGS_PANEL extends Dialog {
  static panelEle = document.querySelector("dialog#global-settings-panel");
  static closeBtn = this.panelEle.querySelector("button.close");
  static openBtn = document.querySelector("#global-setting-btn");

  // 内部的一些数据
  static lockStateShowEle = document.querySelector("#lock-state");
  static lockStateSwitchBtn = document.querySelector("#lock-switch");

  static init() {
    super.init();
    this.lockStateShowEle.innerText = GLOBAL_DATA.lock ? "开启" : "关闭";
    this.lockStateSwitchBtn.onclick = () => {
      this.switchLock();
    };
  }

  static switchLock() {
    GLOBAL_DATA.update("lock", !GLOBAL_DATA.lock);
    this.lockStateShowEle.innerText = GLOBAL_DATA.lock ? "开启" : "关闭";
    // 刷新时间轴面板
    const lockTimeBox = document.querySelector("#lock-time-box");
    if (GLOBAL_DATA.lock) {
      lockTimeBox.classList.remove("hidden");
    } else {
      lockTimeBox.classList.add("hidden");
    }
  }
}