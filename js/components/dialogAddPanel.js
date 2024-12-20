/**
 * 一些默认的面板类型
 */
const PANEL_TYPES = {
  CLASSICS: { name: "经典六宫格", width: 3, height: 2 },
  SINGLE: { name: "单文档", width: 1, height: 1 },
  LEFT_RIGHT: { name: "左右分屏", width: 2, height: 1 },
  CROSS: { name: "十字格", width: 2, height: 2 },
  EIGHT: { name: "八宫格", width: 4, height: 2 },
  NINE: { name: "九宫格", width: 3, height: 3 },
  WEEK: { name: "一周七天", width: 7, height: 1 },
  MOON: { name: "一月表格", width: 7, height: 6},
  YEAR: { name: "一年十二月", width: 4, height: 3 }
};

/**
 * 增加面板弹窗的交互逻辑
 * 当成一个全局对象来处理
 */
class DIALOG_ADD_PANEL extends Dialog {
  static panelEle = document.querySelector("dialog#add-panel");
  static closeBtn = this.panelEle.querySelector("button.close");
  static openBtn = document.querySelector("#add-panel-btn");

  static createBtn = this.panelEle.querySelector("button.create");
  static titleInput = this.panelEle.querySelector("input.title-input");
  static selectEle = this.panelEle.querySelector("select");
  // 用户即将输入的标题
  static title = "";
  static width = 3;
  static height = 2;
  static currentSelect = "CLASSICS";

  static init() {
    super.init();
    this.createBtn.onclick = () => {
      this.create();
      this.close();
      // refreshNav();
      NAV_LIST.refreshDom();
    };
    // 更新select框里的选项
    for (let key in PANEL_TYPES) {
      let option = document.createElement("option");
      option.innerText = PANEL_TYPES[key].name;
      option.value = key;
      this.selectEle.appendChild(option);
    }
    this.titleInput.oninput = (e) => {
      this.title = e.target.value;
    };
    // select切换
    this.selectEle.onchange = (e) => {
      this.currentSelect = e.target.value;
      this.updateDataBySelect();
    };
  }

  static updateDataBySelect() {
    const type = PANEL_TYPES[this.currentSelect];
    this.width = type.width;
    this.height = type.height;
  }

  static create() {
    // 看看当前面板是否重复
    if (this.title === "") {
      alert("不能为空");
      return;
    }
    if (ComponentTextareaContainer.isRepeat(this.title)) {
      alert("名称重复了");
      return;
    }
    // 判断是否含有自动填写初始内容
    let defaultContent = null;
    if (this.currentSelect === "WEEK") {
      defaultContent = [
        "周一\n\n",
        "周二\n\n",
        "周三\n\n",
        "周四\n\n",
        "周五\n\n",
        "周六\n\n",
        "周日\n\n"
      ];
    } else if (this.currentSelect === "MOON") {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      defaultContent = generateCalendarArray(currentYear, currentMonth);
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      // 获取当月总天数
      const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      // 计算当月第一天在表格中的位置
      let startingIndex = firstDay === 0 ? 6 : firstDay - 1;
      // 计算横跨的周数
      let weeksNum = Math.ceil((startingIndex + totalDays) / 7);
      this.height = weeksNum;
    } else if (this.currentSelect === "YEAR") {
      const months = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ];
      defaultContent = months.map((month) => month + "\n\n");
    }
    const panel = new ComponentTextareaContainer(this.title, this.width, this.height, this.currentSelect);
    panel.create(defaultContent);
    // 创建完之后自动切换到新建Panel
    GLOBAL_DATA.update("currentPanel", this.title);
    NAV_LIST.refreshDom();
    ComponentTextareaContainer.refreshDomByPanelName(GLOBAL_DATA.currentPanel);
    // 清空输入框(只有在创建成功之后才清空，在遇到同名的时候不清空，方便用户再次打开进行修改)
    this.titleInput.value = '';
  }
}

/**
 * 星期一作为第一列，星期日作为最后一列。
 * 将这个6行7列的表格转换成一个一维字符串数组，这个一维数组是从左往右，
 * 从上往下的顺序读取这个月表格里的每一天，例如: arr = ["1月1日", "1月2日", ...]，
 * 增加了周几的信息
 * 注意这个一维数组固定长度是6*7=42个元素，前后可能有空字符串作为填充
 * @param {number} year
 * @param {number} month
 * @returns
 */
function generateCalendarArray(year, month) {
  const calendarArray = [];
  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay();
  // 获取当月总天数
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 计算当月第一天在表格中的位置
  let startingIndex = firstDay === 0 ? 6 : firstDay - 1;

  // 填充前面的空字符串
  for (let i = 0; i < startingIndex; i++) {
    calendarArray.push("");
  }

  // 填充日期和星期几
  for (let day = 1; day <= totalDays; day++) {
    const dayOfWeek = daysOfWeek[new Date(year, month, day).getDay()];
    calendarArray.push(`${month + 1}月${day}日 ${dayOfWeek}\n\n`);  // 结尾加换行，方便编辑
  }

  // 补齐数组长度
  let weeksNum = Math.ceil((startingIndex + totalDays) / 7);
  while (calendarArray.length < (7 * weeksNum)) {
    calendarArray.push("");
  }

  return calendarArray;
}

