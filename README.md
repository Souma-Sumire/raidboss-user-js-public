# 使用说明

## 用下崽器下载

1. 下载 [下崽器](https://github.com/Souma-Sumire/SoumaDownloader/releases)
1. 在 ACT 中 添加 `SoumaDownloader.dll`，并启用
1. 在下崽器中勾选你需要的 `.js` 文件，点击 `下载/更新` 按钮
1. 刷新 Raidboss 悬浮窗或重启 ACT，使改动生效

### 更新

1. 点击下崽器的 `下载/更新` 按钮，会自动下载最新版本。
2. 刷新 Raidboss 悬浮窗或重启 ACT，使改动生效。

## 手动下载

1. [下载本仓库](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
1. 将 raidboss 文件夹中 *你需要的* `.js` 文件，放入你的 `user\raidboss` 文件夹
    - 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
    - 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

## 常见问题

### 设置职能位置（我是MT/ST/H1/H2/D1/D2/D3/D4）

默认以 `战暗枪骑占白贤学蛇侍忍钐龙僧舞诗机绘黑召赤青` 的顺序自动分配。

但很明显，固定的顺序并不适合所有人，实战中我们可能有各种位置，所以你需要：

1. 在 `OverlayPlugin悬浮窗插件` 中，左下角点击 `新建` 按钮。
1. 名称任意输入，预设选择 `自定义悬浮窗`，类型选择 `数据统计`
1. 切换到该标签，在右侧空白的 `悬浮窗地址` 输入框中填入：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`
1. 移动至合适位置、调整大小后，勾选 `锁定悬浮窗`
1. 组成小队后，在该悬浮窗中分配每个人的正确职能位置

![image](https://github.com/user-attachments/assets/1a9ccfc6-35d1-4f93-a3b8-0a41c698d946)

### 绝伊甸跟自带的触发器重复报

自行禁用cactbot自带的伊甸触发器
![795c401924a050f7eeeaef22b1d1b0c2](https://github.com/user-attachments/assets/09864f99-1a61-4111-803b-f5dce0bd921b)

### 如何使用标点功能

1. 需要加载对应版本的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)（一般来说是最新版）
1. 在 config 面板中手动开启标点功能
![image](https://github.com/user-attachments/assets/3efa5c75-e02d-46c2-a987-eaf008c9e039)

## 其他

[欧米茄标点说明](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)
