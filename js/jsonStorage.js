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
    if (typeof key !== 'string') {
      key = JSON.stringify(key);
    }
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  },

  delete(key) {
    localStorage.removeItem(key);
  }
}
