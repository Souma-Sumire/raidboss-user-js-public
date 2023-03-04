# raidboss-user-js-public

## js 文件的加载方式

1. 将 JS 文件放入本地对应文件夹中

   - 咖啡 ACT：`ACT\Plugins\cactbot-offline\user\raidboss\Souma\`
   - 呆萌、原生 ACT：`ACT.呆萌整合\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss\Souma\`

1. 然后刷新 _Cactbot Raidboss_ 悬浮窗。

## 如何下载

### 手动下载与更新（适合萌新用户）

1. 点页面右上角的`Code - Download ZIP`手动下载文件（你**不可以**直接通过右键下载某个文件）

### 通过 Git 下载与更新（适合有一定基础的用户）

1. `git clone https://github.com/Souma-Sumire/raidboss-user-js-public`

1. 然后使用 git pull 更新。

1. 不建议直接 clone 到 raidboss 文件夹内，因为我可能会非通知的添加一些默认开启的触发器。建议自己选好需要的文件再往 raidboss 里面扔。

## 加载 "依赖运行库" 的文件之前需要做

1. 加载 `souma 拓展运行库.js`

1. 添加悬浮窗：[SoumaCactbotRuntime](https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime)

1. ACT 加载 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases) 1.3.2.5 及以上。

## 修改配置、开关功能

使用 Cactbot Config 面板修改配置，而不要修改源码。

- 表示启用：ture、ture、1、是、开、开启、启用、使能、确定、对
- 表示禁用：false、flase、0、否、关、关闭、取消、不、错

不会有人找不到位置吧？
![Cactbot Config](https://raw.fastgit.org/quisquous/cactbot/main/screenshots/config_panel.png)

## 其他说明

不可以与其他人的同副本 JS 文件混用，这是毋庸置疑的。
