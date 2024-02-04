window.onload = function() {
  // 初始化缓存，防止一些key没有
  initStorage();
  // 更新左侧导航栏
  refreshNav();
  // 更新右侧区域
  refreshTextareaByPanel(GLOBAL_DATA.currentPanel);
  // 刷新缓存剩余量 1分钟刷新一次
  refreshCurrentCacheSize();
  setInterval(() => {
    refreshCurrentCacheSize();
  }, 1000 * 60);

  // 设置面板
  document.querySelector("#global-setting-btn").onclick = () => {
    GLOBAL_SETTINGS_PANEL.open();
  };
  GLOBAL_SETTINGS_PANEL.load();
  GLOBAL_SETTINGS_PANEL.lockStateSwitchBtn.onclick = () => {
    console.log(123456);
    GLOBAL_SETTINGS_PANEL.switchLock();
  };

  GLOBAL_SETTINGS_PANEL.closeBtn.onclick = () => {
    GLOBAL_SETTINGS_PANEL.close();
  };

  // 增加面板按钮 绑定
  document.querySelector("#add-panel-btn").onclick = () => {
    ADD_PANEL.open();
  };

  // 弹窗面板内部交互逻辑
  ADD_PANEL.createBtn.onclick = () => {
    ADD_PANEL.create();
    ADD_PANEL.close();
    refreshNav();
  };
  ADD_PANEL.closeBtn.onclick = () => {
    ADD_PANEL.close();
  };
  ADD_PANEL.titleInput.oninput = (e) => {
    ADD_PANEL.title = e.target.value;
  };
  // 更新select框里的选项
  for (let key in PANEL_TYPES) {
    let option = document.createElement("option");
    option.innerText = PANEL_TYPES[key].name;
    option.value = key;
    ADD_PANEL.selectEle.appendChild(option);
  }
  // select切换
  ADD_PANEL.selectEle.onchange = (e) => {
    ADD_PANEL.currentSelect = e.target.value;
    ADD_PANEL.updateDataBySelect();
  };


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
        refreshNav();
        refreshTextareaByPanel(GLOBAL_DATA.currentPanel);
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
    console.log("时间清空了");
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
      refreshNav();
    }
  });
};

/**
 * 根据面板的名字初始化右侧界面
 */
function refreshTextareaByPanel(panelName) {
  // 获取一下这个面板的宫格宽高
  const panel = Panel.fromCache(panelName);
  console.log(panel);
  panel.refreshTextArea();
}

/**
 * 刷新左侧导航栏界面区域
 * 比较暴力，重新生成全部内容
 */
function refreshNav() {
  const navContent = document.querySelector("#nav-content");
  // 清除原有内容
  navContent.innerHTML = "";
  // 更新内容
  let panelList = JSON_STORAGE.get("panelList");

  // 如果开启了隐私保护锁，只显示一个default
  if (GLOBAL_DATA.isLockCurrent) {
    panelList = ["default"];
  }

  for (let navItemName of panelList) {
    if (!navItemName) return;
    navContent.appendChild(
      getNavItem(navItemName, GLOBAL_DATA.currentPanel === navItemName)
    );
  }
}

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

/**
 * 创建一个左侧的面板选项条，顺便绑定逻辑
 * @param {string} name 面板标题
 * @param {boolean} isSelected 当前是否选中了这个
 * @returns {HTMLElement} 一个元素
 */
function getNavItem(name, isSelected) {
  if (!name) {
    return;
  }
  let res = document.createElement("div");
  res.className = `group flex p-1 bg-stone-800 my-2 overflow-hidden transition rounded select-none cursor-pointer ring-green-400`;
  res.classList.add("nav-item");
  if (isSelected) {
    res.classList.add("ring");
    res.classList.add("text-green-400");
  }

  let title = document.createElement("span");
  title.innerText = name;
  title.className = `flex-1 truncate`;
  res.appendChild(title);

  // 点击这个元素本身的效果
  res.onclick = function() {
    // 更新右侧数据
    GLOBAL_DATA.update("currentPanel", name);
    refreshTextareaByPanel(name);

    // 更改 selected 样式
    const navContentList = document.querySelectorAll(".nav-item");
    for (let navItem of navContentList) {
      if (navItem.classList.contains("ring")) {
        navItem.classList.remove("ring");
        navItem.classList.remove("text-green-400");
      }
      if (!navItem.classList.contains("ring")) {
        res.classList.add("ring");
        res.classList.add("text-green-400");

      }
    }
  };

  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "💥";
  deleteBtn.className = `h-full px-2 rounded text-red-100 bg-red-700 hidden group-hover:block`;

  // 删除按钮的点击事件
  deleteBtn.onclick = () => {
    if (!confirm(`你确定要删除【${name}】吗？`)) {
      return;
    }
    // 删除数据
    Panel.fromCache(name).delete();
    // 如果当前选择的是被删除的界面，那么更改当前选择
    if (GLOBAL_DATA.currentPanel === name) {
      GLOBAL_DATA.update("currentPanel", "default"); // 将当前界面指向default
    }
    refreshNav();
    // 更改右侧界面信息
    refreshTextareaByPanel(GLOBAL_DATA.currentPanel);
  };
  res.appendChild(deleteBtn);

  return res;
}
