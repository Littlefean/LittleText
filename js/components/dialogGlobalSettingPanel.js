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

  static exportBtn = document.querySelector("#export-btn");
  static importBtn = document.querySelector("#import-btn");
  static importFileInput = document.querySelector("#import-file-input");

  static init() {
    super.init();
    this.lockStateShowEle.innerText = GLOBAL_DATA.lock ? "开启" : "关闭";
    this.lockStateSwitchBtn.onclick = () => {
      this.switchLock();
    };

    // 点击导出，会出现下载
    this.exportBtn.onclick = () => {
      this.handleClickExport();
    };

    // 点击导入
    this.importBtn.onclick = () => {
      this.handleClickImport();
    };
  }

  static handleClickExport() {
    let blob = new Blob([JSON_STORAGE.exportToJsonString()], {
      type: "text/plain",
    });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const date = new Date();
    a.download = `宫格日记本${date.getFullYear()}-${date.getMonth()}-${date.getDate()}导出.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  static handleClickImport() {
    let file = this.importFileInput.files[0];

    if (file) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let content = e.target.result;
        JSON_STORAGE.importByJsonString(content);
        alert("导入过程结束");
        location.reload(); // 结束之后刷新一下（偷懒一下）
      };
      reader.readAsText(file);
    } else {
      alert("请先选择一个文件");
    }
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
