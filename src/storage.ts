type Data = {
  panels: Record<
    string,
    {
      width: number;
      height: number;
      data: string[];
    }
  >;
};

export class MyStorage {
  /**
   * 更新字段
   * @param fn
   */
  public update(fn: (prev: Data) => Data): void {
    // 实现更新逻辑
    const data = fn(this.get());
    localStorage.setItem("data", JSON.stringify(data));
  }

  public get(): Data {
    // 实现获取逻辑
    const data = localStorage.getItem("data");
    if (!data) {
      return {
        panels: {
          default: {
            width: 3,
            height: 2,
            data: ["", "", "", "", "", ""]
          }
        }
      };
    }
    return JSON.parse(data);
  }

  public set(data: Data): void {
    // 实现设置逻辑
    localStorage.setItem("data", JSON.stringify(data));
  }
}
