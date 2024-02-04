/**
 * 节流函数，限制函数的调用频率
 * @param func 原函数
 * @param wait 冷却时间，毫秒
 * @returns {(function(): void)|*}
 */
function throttle(func, wait) {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;

    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
}