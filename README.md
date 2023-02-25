# raidboss-user-js-public

## 说明

使用文本编辑器打开 JS 文件，文件头部可能会有单独的使用说明。

使用 Cactbot Config 面板修改配置，而不要修改源码。启用：true、1、是、开。禁用：false、0、否、关

不可以与其他人的同副本 JS 文件混用，这是毋庸置疑的。

## 依赖

- 加载 `souma 拓展运行库.js` ，并添加悬浮窗：[SoumaCactbotRuntime](https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime)

- [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases) 1.3.2.5 及以上。

## 手动更新（适合萌新用户）

1. 点页面右上角的`Code - Download ZIP`手动下载文件（你**不可以**直接通过右键下载某个文件），随后：

1. 将 JS 文件放入本地对应文件夹中

   - 咖啡 ACT：`ACT\Plugins\cactbot-offline\user\raidboss\Souma\`
   - 呆萌、原生 ACT：`ACT.呆萌整合\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss\Souma\`

1. 然后刷新 _Cactbot Raidboss_ 悬浮窗。

## Git 更新（适合有一定基础的用户）

`git clone https://github.com/Souma-Sumire/raidboss-user-js-public`

使用 git pull 更新。

不建议直接clone到raidboss文件夹内，因为我可能会非通知的添加一些默认开启的触发器。建议自己选好需要的文件再往raidboss里面扔。
