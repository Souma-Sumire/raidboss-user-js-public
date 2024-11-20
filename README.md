## 使用说明

### 2024-11-21 更新

由于使用在线链接的人数过多，对服务器压力过大，现将回归原始方法。

曾经加载了 `config面板转换.js` 的用户，需删除该文件。

曾经使用了在线链接的用户，需恢复至原本的 Cactbot Raidboss 版本。

- 咖啡 ACT 如何恢复：地址下面有个下拉选择框，选择 `Cactbot 副本辅助(时间轴+触发器)` 即可。

- 呆萌 ACT 如何恢复：删了之前的，左下角新建预设 `Cactbot 时间轴与触发器` 即可。

### 使用下崽器下载

1. 下载 [下崽器](https://github.com/Souma-Sumire/SoumaDownloader/releases)
2. 在 ACT 中 添加 `SoumaDownloader.dll`，并启用
3. 切换到下崽器，选择你需要的 `.js` 文件，点击 `下载` 按钮，程序会自动识别你的 user 目录， 并将文件下载到该文件夹
4. 刷新 Cactbot Raidboss 悬浮窗

### 手动下载

1. [下载本仓库](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
1. 将 raidboss 文件夹中 *你需要的* `.js` 文件，放入你的 `user\raidboss` 文件夹
1. （可选）存在优先级的副本，需将 `[重要] 依赖 - Souma拓展运行库.js` 文件也一并放入，并新建*数据统计*悬浮窗 <https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime>，以实现职能位置分配
1. （可选）使用标点功能，需要加载**正确版本**的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)
1. 重启 ACT，使文件生效

## 常见问题

### User 文件夹在哪

- 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
- 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

### 其他

- [欧米茄标点说明](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)
