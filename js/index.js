const GlobalData = {
  // 当前选择的面板
  currentPanel: "default",
};

window.onload = function () {
  // 初始化缓存，防止一些key没有
  initStorage();
  // 加载默认
  initLoad();
  // 刷新

  // 增加面板按钮 绑定
  let addPanelBtn = document.querySelector(".add-panel-btn");
  addPanelBtn.addEventListener("click", () => {
    let name = prompt("请输入你要创建的名字");
    if (name === null) {
      return;
    }
    // 检查名字是否重复
    const panelList = JSON_STORAGE.get("panelList");
    if (panelList.includes(name)) {
      alert("不能取这个名字，重复了");
      return;
    }
    // 更新数据
    panelList.push(name);
    JSON_STORAGE.set("panelList", panelList);
    // 初始化数据
    for (let i = 0; i < 6; i++) {
      JSON_STORAGE.set(`${name}-text-${i}`, "");
    }
    // 更新界面
    refreshNav();
  });
};

/**
 * 读取本地缓存，加载信息
 *
 * 所有的面板名称数组
 * panelList: ["name", "name2" .... ]
 *
 * 每一个面板名称里对应的
 * panelDict: {
 *  "name": ["text-a1f240", "text-1315"...]
 *  "name2": []
 *  ...
 * }
 *
 * "text-a1f240": {
 *  content: "..."
 *  type: "..."
 * }
 *
 */
function initLoad() {
  // 加载左侧导航栏内容
  refreshNav();
  refreshTextareaByPanel("default");
}

/**
 * 根据面板的名字初始化右侧界面
 */
function refreshTextareaByPanel(panelName) {
  let textareaList = document.querySelectorAll("textarea");
  for (let i = 0; i < textareaList.length; i++) {
    let textarea = textareaList[i];
    textarea.value = JSON_STORAGE.get(`${panelName}-text-${i}`);
    // 移除之前绑定的事件监听器
    // textarea.removeEventListener("input", handleTextareaInput);

    // 绑定新的事件监听器
    // textarea.addEventListener("input", handleTextareaInput);
    textarea.oninput = (e) => {
      JSON_STORAGE.set(`${panelName}-text-${i}`, e.target.value);
    }
    // function handleTextareaInput(e) {
    //   JSON_STORAGE.set(`${panelName}-text-${i}`, e.target.value);
    // }
  }
}
/**
 * 刷新左侧导航栏
 */
function refreshNav() {
  const navContent = document.querySelector(".nav-content");
  // 清除原有内容
  navContent.innerHTML = "";
  // 更新内容
  const panelList = JSON_STORAGE.get("panelList");
  for (let navItemName of panelList) {
    navContent.appendChild(getNavItem(navItemName, GlobalData.currentPanel === navItemName));
  }
}
/**
 * 初始化本地缓存
 */
function initStorage() {
  let panelList = JSON_STORAGE.get("panelList");
  if (panelList === null) {
    panelList = ["default", "a2"];
    JSON_STORAGE.set("panelList", panelList);
  }
}

function getNavItem(name, isSelected) {
  let res = document.createElement("div");
  res.classList.add("nav-item");
  if (isSelected) {
    res.classList.add("selected");
  }

  let title = document.createElement("span");
  title.innerText = name;
  res.appendChild(title);

  // 点击这个元素本身的效果
  res.onclick = function () {
    // 更新右侧数据
    GlobalData.currentPanel = name;
    refreshTextareaByPanel(name);

    // 更改样式
    const navContentList = document.querySelectorAll(".nav-item");
    for (let navItem of navContentList) {
      if (navItem.classList.contains("selected")) {
        navItem.classList.remove("selected");
      }
      if (!navItem.classList.contains("selected")) {
        res.classList.add("selected");
      }
    }
  };

  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "x";

  // 删除按钮的点击事件
  deleteBtn.addEventListener("click", () => {
    if (name === "default") {
      alert("default不能删除");
      return;
    }
    const panelList = JSON_STORAGE.get("panelList");
    const idxRemove = panelList.indexOf(name);
    if (idxRemove === -1) {
      alert("已经不存在了");
      return;
    }
    panelList.splice(idxRemove, 1);
    JSON_STORAGE.set("panelList", panelList);
    refreshNav();
    // 如果当前选择的是被删除的界面，那么更改当前选择
    if (GlobalData.currentPanel === name) {
      GlobalData.currentPanel = "default"; // 偷个懒，直接等于第一个默认
      // 更改右侧界面信息
      refreshTextareaByPanel(GlobalData.currentPanel);
    }
    // 还要清空对应的textarea
    for (let i = 0; i < 6; i++) {
      JSON_STORAGE.delete(`${name}-text-${i}`);
    }
  });
  res.appendChild(deleteBtn);

  return res;
}
