/**
 * 存放一些全局变量信息
 */
const GlobalData = {
  // 当前选择的面板
  currentPanel: "default",
};

window.onload = function () {
  // 初始化缓存，防止一些key没有
  initStorage();
  // 更新左侧导航栏
  refreshNav();
  // 更新右侧区域
  refreshTextareaByPanel(GlobalData.currentPanel);
  // 刷新缓存剩余量
  refreshCurrentCacheSize();

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
  const panelList = JSON_STORAGE.get("panelList");
  for (let navItemName of panelList) {
    if (!navItemName) return;
    navContent.appendChild(
      getNavItem(navItemName, GlobalData.currentPanel === navItemName)
    );
  }
}

/**
 * 刷新剩余缓存
 * TODO: 有必要做一个定期自动刷新
 */
function refreshCurrentCacheSize() {
  const currentCache = document.querySelector(".current-cache");
  currentCache.innerText = JSON_STORAGE.getSize().toFixed(2);
}

/**
 * 初始化本地缓存
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
      createTime: new Date().getTime(),
    });
    for (let i = 0; i < 6; i++) {
      JSON_STORAGE.set(`default-text-${i}`, "");
    }
  }
}

/**
 * 创建一个左侧的面板选项条，顺便绑定逻辑
 * @param {string} name 面板标题
 * @param {boolean} isSelected 当前是否选中了这个
 * @returns 一个元素
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
  title.className = `flex-1 truncate`
  res.appendChild(title);

  // 点击这个元素本身的效果
  res.onclick = function () {
    // 更新右侧数据
    GlobalData.currentPanel = name;
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
  deleteBtn.innerText = "x";
  deleteBtn.className = `h-full px-2 rounded text-red-100 bg-red-700 hidden group-hover:block`

  // 删除按钮的点击事件
  deleteBtn.onclick = () => {
    // 删除数据
    Panel.fromCache(name).delete();
    // 如果当前选择的是被删除的界面，那么更改当前选择
    if (GlobalData.currentPanel === name) {
      GlobalData.currentPanel = "default"; // 将当前界面指向default
    }
    refreshNav();
    // 更改右侧界面信息
    refreshTextareaByPanel(GlobalData.currentPanel);
  };
  res.appendChild(deleteBtn);

  return res;
}
