/**
 * 一个包含很多宫格记事本的面板
 * 内部封装对本地数据的操作和修改
 */
class Panel {
  /**
   * @param {string} title
   * @param {number} width
   * @param {number} height
   */
  constructor(title, width, height) {
    this.title = title;
    this.width = width;
    this.height = height;
    this.createTime = new Date();
  }
  /**
   * 判断面板是否重复了，在创建的时候调用
   * @param {string} title
   */
  static isRepeat(title) {
    const panelList = JSON_STORAGE.get("panelList");
    return panelList.includes(title);
  }

  /**
   * 新生成一个到缓存数据中
   * @param {array[string]} defaultContent 默认填充的内容长度需要自觉保证
   */
  create(defaultContent) {
    const panelList = JSON_STORAGE.get("panelList");
    // 更新数据
    panelList.push(this.title);
    JSON_STORAGE.set("panelList", panelList);
    // 详细信息
    JSON_STORAGE.set(`${this.title}-data`, {
      width: this.width,
      height: this.height,
      createTime: this.createTime.getTime(),
    });

    // 宫格信息
    for (let i = 0; i < this.width * this.height; i++) {
      JSON_STORAGE.set(
        `${this.title}-text-${i}`,
        defaultContent ? defaultContent[i] : ""
      );
    }
  }

  /**
   * 删除这个面板，清除存储数据信息
   */
  delete() {
    if (this.title === "default") {
      alert("default不能删除");
      return;
    }
    const panelList = JSON_STORAGE.get("panelList");
    const idxRemove = panelList.indexOf(this.title);
    if (idxRemove === -1) {
      alert("已经不存在了");
      return;
    }
    panelList.splice(idxRemove, 1);
    JSON_STORAGE.set("panelList", panelList);
    // 清空对应的信息
    for (let i = 0; i < this.width * this.height; i++) {
      JSON_STORAGE.delete(`${this.title}-text-${i}`);
    }
    JSON_STORAGE.delete(`${this.title}-data`);
  }

  /**
   * 从localStorage中解析出这个对象来
   * 例如 panelList: "[{title: "xxx", width: 3, height: 6, createTime: 147777}]"
   * 传入的参数是将字符串解析后的json
   * {title: "xxx", width: 3, height: 6, createTime: 147777}
   */
  static fromCache(title) {
    if (!title) {
      console.warn(`格式不对${title}`);
    }
    const panelList = JSON_STORAGE.get("panelList");
    if (!panelList.includes(title)) {
      console.warn(`没从缓存中找到${title}的面板`);
    } else {
      console.log(`找到了${title}的面板`);
    }

    const obj = JSON_STORAGE.get(`${title}-data`);
    console.log(`从缓存中读取面板信息：`, obj);
    if (obj === null) {
      // 说明是老版本，经典六宫格
      let res = new Panel(title, 3, 2);
      res.createTime = new Date();
      // 顺手更新一下date数据
      JSON_STORAGE.set(`${title}-data`, {
        width: 3,
        height: 2,
        createTime: res.createTime.getTime(),
      });
      return res;
    } else {
      // 新版本
      let res = new Panel(title, obj.width, obj.height);
      res.createTime = new Date(obj.createTime);
      return res;
    }
  }

  /**
   * 根据当前对象，更新右侧面板，用于切换面板的时候。
   */
  refreshTextArea() {
    const mainEle = document.querySelector("main");
    mainEle.innerHTML = "";
    // 修改main的布局分布
    mainEle.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
    mainEle.style.gridTemplateRows = `repeat(${this.height}, auto)`;
    for (let i = 0; i < this.width * this.height; i++) {
      console.log(i, "创建textarea");
      let textarea = document.createElement("textarea");
      textarea.value = JSON_STORAGE.get(`${this.title}-text-${i}`);
      textarea.oninput = (e) => {
        console.log(e.target.value, this.title);
        JSON_STORAGE.set(`${this.title}-text-${i}`, e.target.value);
      };
      mainEle.appendChild(textarea);
    }
  }
  /**
   * 更改其中一个宫格内容所触发的信息改变
   * @param {{x: number, y: number}} param0 发生更改的位置
   */
  onchange({ x, y }, newText) {
    JSON_STORAGE.set(
      `${this.title}-text-${this.locationToIndex({ x, y })}`,
      newText
    );
  }

  /**
   * 之所以用静态方法，是因为当成工具函数使用。
   * [0][1][2]
   * [3][4][5]
   *
   * height: 2
   * width: 3
   *
   * 5 --> {x: 2, y: 1}
   */
  static indexToLocation(index, width) {
    return {
      x: index % width,
      y: Math.floor(index / width),
    };
  }
  /**
   * 与上面的方法相反
   */
  static locationToIndex({ x, y }, width) {
    return y * width + x;
  }
}
