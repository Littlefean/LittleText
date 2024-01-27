const JSON_STORAGE = {
  /**
   *
   * @param {string} key
   * @returns JSON 对象，也有可能是null
   */
  get(key) {
    let res = localStorage.getItem(key);
    if (res === null) {
      return null;
    }
    // 不是null的情况
    return JSON.parse(res);
  },

  /**
   *
   * @param {string} key
   * @param {JSON} value
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
  },
};
