# raidboss-user-js-public

## 7.0 之后

悬浮窗中添加以下Raidboss链接，并临时关闭原有的Raidboss悬浮窗，以免重复报。
地址：<https://souma.diemoe.net/cactbot/ui/raidboss/raidboss.html>
![image](https://github.com/user-attachments/assets/de4902c5-3490-4386-a1a8-914412ae9898)
![image](https://github.com/user-attachments/assets/5bb036bf-aa5e-4219-b491-f8dbd1949a23)

### 修改输出文本

上面的链接把raidboss全部改成config，在这里面可以改设置。
不直接贴出链接，因为这是一个智商检测。看不懂就别改。

### 其他说明

使用在线链接的目的是为了防止冲突并方便更新。其他副本几乎都是由各位社区大佬开发，没有侵占冠名权的意思。

不要在任何ACT整合群或Cactbot的GitHub页面提问本链接的问题，他们不负责这部分内容（如果你这样做了，只会让别人觉得你是傻逼）

## 6.X 及之前

1. 确保 Cactbot Raidboss 悬浮窗正常工作
1. [下载](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip) 后，将相应 js 文件放入你的 user\raidboss 文件夹
1. 刷新 Raidboss 悬浮窗

### User 文件夹在哪？

- 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
- 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

### 部分文件需要额外依赖

以下副本

- 绝神兵三连桶
- 绝龙诗
- 绝欧米茄
- P1S、P4S、P6S、P7S、P8S、P9S、P10S、P11S、P12S
- 阿罗阿罗岛
- 挖宝曼德拉

需要

1. 除了副本本身的 js 文件，还需要 **加载 `[重要] 依赖 - Souma拓展运行库.js`**
1. 在 OverlayPlugin 插件中添加数据统计悬浮窗 `https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`，用于手动分配位置，否则会默认分配（MT、ST、H1、H2、D1、D2、D3、D4）
1. 若需要标点等操作，还需要加载正确版本的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)

### 其他说明

- [欧米茄文档](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)
- 2024/6/2：删除js版一键舞步，改为 [网页版](https://souma.diemoe.net/ff14-overlay-vue/#/okDncDance) ，这里更推荐使用 [DailyRoutines](https://github.com/AtmoOmen/DalamudPlugins) 的 `自动跳舞` 模块。
