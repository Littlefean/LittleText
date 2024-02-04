class NAV_LIST {
  static navListEle = document.querySelector("#nav-content");

  static init() {
    this.refreshDom();
  }

  static refreshDom() {
    // 清除原有内容
    this.navListEle.innerHTML = "";
    // 更新内容
    let panelNameList = JSON_STORAGE.get("panelList");

    // 如果开启了隐私保护锁，只显示一个default
    if (GLOBAL_DATA.isLockCurrent) {
      panelNameList = ["default"];
    }

    for (let navItemName of panelNameList) {
      if (!navItemName) return;
      this.navListEle.appendChild(
        this.createNavItem(navItemName, GLOBAL_DATA.currentPanel === navItemName)
      );
    }
  }

  /**
   *
   *
   *
   * 创建一个左侧的面板选项条，顺便绑定逻辑
   * @param {string} name 面板标题
   * @param {boolean} isSelected 当前是否选中了这个
   * @returns {Element} 一个元素
   */
  static createNavItem(name, isSelected) {
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
    res.onclick = () => {
      // 更新右侧数据
      GLOBAL_DATA.update("currentPanel", name);
      ComponentTextareaContainer.refreshDomByPanelName(name);

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
      ComponentTextareaContainer.fromCache(name).delete();
      // 如果当前选择的是被删除的界面，那么更改当前选择
      if (GLOBAL_DATA.currentPanel === name) {
        GLOBAL_DATA.update("currentPanel", "default"); // 将当前界面指向default
      }
      this.refreshDom();
      // 更改右侧界面信息
      ComponentTextareaContainer.refreshDomByPanelName(name);
    };
    res.appendChild(deleteBtn);

    return res;
  }
}