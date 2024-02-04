window.onload = function() {
  // 初始化缓存，防止一些key没有
  initStorage();

  // 刷新缓存剩余量 1分钟刷新一次
  refreshCurrentCacheSize();
  setInterval(() => {
    refreshCurrentCacheSize();
  }, 1000 * 60);

  // 所有组件初始化逻辑绑定
  NAV_LIST.init();
  ComponentTextareaContainer.init();
  GLOBAL_SETTINGS_PANEL.init();
  DIALOG_ADD_PANEL.init();

  // 刷新时间轴渲染状态
  const lockTimeBox = document.querySelector("#lock-time-box");
  if (GLOBAL_DATA.lock) {
    lockTimeBox.classList.remove("hidden");
  }

  // 定时检测锁状态
  setInterval(() => {
    // 开启了保护功能 并且现在还没有锁住
    if (GLOBAL_DATA.lock && !GLOBAL_DATA.isLockCurrent) {
      // 判断是不是要锁住了
      if (GLOBAL_DATA.lockTimeCurrent >= GLOBAL_DATA.lockTimeMax) {
        GLOBAL_DATA.update("isLockCurrent", true);  // 锁住
        GLOBAL_DATA.update("currentPanel", "default");
        NAV_LIST.refreshDom();
        ComponentTextareaContainer.refreshDomByPanelName(GLOBAL_DATA.currentPanel);
      } else {
        // 时间步进
        GLOBAL_DATA.update("lockTimeCurrent", GLOBAL_DATA.lockTimeCurrent + 1);
      }
      // 更新渲染
      const lockTimeBar = document.querySelector("#lock-time-bar");
      lockTimeBar.style.width = `${GLOBAL_DATA.lockTimeCurrent * 100 / GLOBAL_DATA.lockTimeMax}%`;
    }
  }, 1000);

  // 按键和鼠标移动来清空时间
  const throttledClearTime = throttle(() => {
    // 开启了保护功能并且现在还没有锁住
    if (GLOBAL_DATA.lock && !GLOBAL_DATA.isLockCurrent) {
      GLOBAL_DATA.update("lockTimeCurrent", 0);
    }
  }, 1000);
  document.addEventListener("mousemove", throttledClearTime);
  document.addEventListener("keydown", throttledClearTime);

  // 隐私保护锁解锁
  document.addEventListener("keydown", function(event) {
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    const isQKeyPressed = event.key === "Q" || event.key === "q";
    if (isCtrlPressed && isQKeyPressed) {
      GLOBAL_DATA.update("isLockCurrent", false);
      GLOBAL_DATA.update("lockTimeCurrent", 0);
      NAV_LIST.refreshDom();
    }
  });
};

/**
 * 刷新一次剩余缓存
 */
function refreshCurrentCacheSize() {
  const currentCache = document.querySelector(".current-cache");
  currentCache.innerText = JSON_STORAGE.getSize().toFixed(2);
}

/**
 * 初始化本地缓存
 * 同时会对全局数据发生更新
 */
function initStorage() {
  let panelList = JSON_STORAGE.get("panelList");
  if (panelList === null) {
    panelList = ["default"];
    JSON_STORAGE.set("panelList", panelList);
    // 设置default信息
    JSON_STORAGE.set(`default-data`, {
      width: 3,
      height: 2,
      createTime: new Date().getTime()
    });
    for (let i = 0; i < 6; i++) {
      JSON_STORAGE.set(`default-text-${i}`, "");
    }
  }
  let globalData = JSON_STORAGE.get("GLOBAL_DATA");
  if (globalData === null) {
    JSON_STORAGE.set(`GLOBAL_DATA`, GLOBAL_DATA);
  } else {
    for (let key in globalData) {
      GLOBAL_DATA[key] = globalData[key];
    }
  }
}
