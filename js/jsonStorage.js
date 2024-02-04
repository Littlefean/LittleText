const JSON_STORAGE = {
  /**
   *
   * @param {string} key
   * @returns {object | string | null} JSON 对象，null的情况可能是不存在key或者解析错误
   */
  get(key) {
    let res = localStorage.getItem(key);
    if (res === null) {
      return null;
    }
    // 不是null的情况
    try {
      return JSON.parse(res);
    } catch (e) {
      return null;
    }
  },

  /**
   * 设置一个内容
   * @param {string} key 保证key是字符串，不要像python那样搞
   * @param {object} value
   */
  set(key, value) {
    if (typeof key !== "string") {
      key = JSON.stringify(key);
    }
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  },

  delete(key) {
    localStorage.removeItem(key);
  },

  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const item = localStorage[key];
        for (let i = 0; i < item.length; i++) {
          const charCode = item.charCodeAt(i);
          total += charCode <= 0xff ? 1 : 2; // 单字节字符占用 1 字节，多字节字符占用 2 字节
        }
      }
    }
    return total / (1024 * 1024); // 转换为 MB
  }
};
