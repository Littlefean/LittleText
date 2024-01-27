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
  MOON: { name: "一月表格", width: 7, height: 5 },
  YEAR: { name: "一年十二月", width: 4, height: 3 },
};
/**
 * 增加面板弹窗的交互逻辑
 */
const ADD_PANEL = {
  panelEle: document.querySelector("dialog.add-panel"),
  closeBtn: document.querySelector("dialog.add-panel button.close"),
  createBtn: document.querySelector("dialog.add-panel button.create"),
  titleInput: document.querySelector("dialog.add-panel input.title-input"),
  selectEle: document.querySelector("dialog.add-panel select"),
  // 用户即将输入的标题
  title: "",
  width: 3,
  height: 2,
  currentSelect: "CLASSICS",

  updateDataBySelect() {
    const type = PANEL_TYPES[this.currentSelect];
    this.width = type.width;
    this.height = type.height;
  },
  close() {
    this.panelEle.style.display = "none";
  },
  open() {
    this.panelEle.style.display = "block";
  },
  create() {
    // 看看当前面板是否重复
    if (this.title === "") {
      alert("不能为空");
      return;
    }
    if (Panel.isRepeat(this.title)) {
      alert("名称重复了");
      return;
    }
    // 判断是否含有自动填写初始内容
    let defaultContent = null;
    if (this.currentSelect == "WEEK") {
      defaultContent = [
        "周一\n",
        "周二\n",
        "周三\n",
        "周四\n",
        "周五\n",
        "周六\n",
        "周日\n",
      ];
    } else if (this.currentSelect == "MOON") {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      defaultContent = generateCalendarArray(currentYear, currentMonth);
    } else if (this.currentSelect == "YEAR") {
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
        "十二月",
      ];
      defaultContent = months.map((month) => month + "\n");
    }
    const panel = new Panel(this.title, this.width, this.height);
    panel.create(defaultContent);
  },
};

/**
 * 星期一作为第一列，星期日作为最后一列。
 * 将这个6行7列的表格转换成一个一维字符串数组，这个一维数组是从左往右，
 * 从上往下的顺序读取这个月表格里的每一天，例如: arr = ["1月1日", "1月2日", ...]，
 * 注意这个一维数组固定长度是6*7=42个元素，前后可能有空字符串作为填充
 * @param {number} year
 * @param {number} month
 * @returns
 */
function generateCalendarArray(year, month) {
  const calendarArray = [];

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay();
  // 获取当月总天数
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 计算星期一在表格中的位置
  let startingIndex = firstDay === 0 ? 6 : firstDay - 1;

  // 填充前面的空字符串
  for (let i = 0; i < startingIndex; i++) {
    calendarArray.push("");
  }

  // 填充日期
  for (let day = 1; day <= totalDays; day++) {
    calendarArray.push(`${month + 1}月${day}日\n`); // 结尾加换行，方便编辑
  }

  // 补齐数组长度
  while (calendarArray.length < 42) {
    calendarArray.push("");
  }

  return calendarArray;
}
