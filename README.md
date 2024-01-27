# 小记事本

平时在做东西的时候可能会开很多记事本，临时记一些东西。不止开一个，可能会开很多个记事本窗口。

这个项目做成了六宫格，并放在浏览器里存储，好处是实时保存。窗口方便管理，不乱。

## 部署

为了方便部署，直接使用githubPages进行了部署，省去了服务器过期的顾虑。

体验地址：

```
https://littlefean.github.io/LittleText/
```

## key-value存储结构

```js
// 存放所有的面板 其作用仅仅像一个索引表一样。
`panelList`: "['default', '面板1', '计划']"

// 增加更详细的信息
`${name}-data`: `{
    width: 2,
    height: 3,
    createTime: 177756447.5456,
}`

// name为面板，i为从上往下从左往右第几个宫格
// i 是从0开始的
// [0][1][2]
// [3][4][5]
`${name}-text-${i}`: "xxxx"



```

