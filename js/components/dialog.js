/**
 * 对话框组件，抽象的
 * 规定：
 * 1. 必须使用dialog标签
 * 2. 内部必须有一个类名为close的button，用来关闭
 * 3. 外部必须有一个按钮来触发打开此弹窗
 *
 *  <dialog>
 *    <button class="close">
 *  </dialog>
 *
 *  button
 */
class Dialog {

  static panelEle = document.querySelector("dialog");
  static closeBtn = this.panelEle.querySelector("button.close");
  static openBtn = this.panelEle.querySelector("button");
  // 以上属性一定要重写，否则报错

  static close() {
    this.panelEle.classList.add("hidden");
  }

  static open() {
    this.panelEle.classList.remove("hidden");
  }

  /**
   * 需要将init函数在main函数中调用一次，自动绑定对应的一些逻辑
   */
  static init() {
    this.openBtn.onclick = () => {
      this.open();
    };
    this.closeBtn.onclick = () => {
      this.close();
    };
  }
}