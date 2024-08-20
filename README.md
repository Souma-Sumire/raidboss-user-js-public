# raidboss-user-js-public

## 7.0 使用

由于之前让用户自己下载 JS 的门槛过高，即使坚持制作了3年，还是有大把的人被“怎么导入”这一点点门槛所拦住。同时时常有冲突的风险。于是 7.0 目前改用在线链接的方式。

只需要添加悬浮窗：<https://souma.diemoe.net/cactbot/ui/raidboss/raidboss.html> ，以代替原来的Raidboss。

虽然编辑这段的时候已经是国际服第四周了，但其实从首周第三天时我就在QQ群发布了，当时4层的主分支还是空白的，目前已经完善了不少，或许就不需要我写的了？但总之更新一下这里的文档。

## 6.X 使用

1. 请确保 Cactbot Raidboss 悬浮窗正常工作。
1. 你需要在 OverlayPlugin 插件中添加 悬浮窗 `https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`，并在进本后分配职能位置。
1. （可选）如果你需要开启标点等操作，可以加载正确版本的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)。
1. 将相应文件放入你的 user\raidboss 文件夹，刷新 Raidboss 悬浮窗，即可成功加载。

### User 文件夹在哪？

- 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`

- 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

例如 `D:\ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss\Souma\零式 - p9s.js`

### 其他说明

- [欧米茄文档](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)
- 2024/6/2：删除js版一键舞步，改为 [网页版](https://souma.diemoe.net/ff14-overlay-vue/#/okDncDance) ，这里更推荐使用 [DailyRoutines](https://github.com/AtmoOmen/DalamudPlugins) 的 `自动跳舞` 模块。
