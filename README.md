# raidboss-user-js-public

## 依赖

1. 悬浮窗插件 新建悬浮窗（类型：数据统计）：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`

1. [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases) 1.3.2.5 及以上。（就算你不用标点功能也要装。你可以不开对应功能，但是不能没有。）

## 下载

### 插件自动

- 使用 [下崽器](https://github.com/Souma-Sumire/SoumaDownloader/releases/latest) ，加载到ACT中使用，一键同时解决下载、安装、更新。
  
### 传统手动

1. 手动下载 [Github档案](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip) 或者 `git clone https://github.com/Souma-Sumire/raidboss-user-js-public.git`
1. 将 raidboss 文件夹中，你**需要的 JS 文件** 放入本地的 `user\raidboss` 文件夹中（其中 `Souma 拓展运行库.js` 是必须的）
    - 咖啡 ACT：`ACT\Plugins\cactbot-offline\user\raidboss\Souma\`
    - 呆萌、原生 ACT：`ACT.呆萌整合\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss\Souma\`

1. 刷新 _Cactbot Raidboss_ 悬浮窗 以加载文件。

## 天国篇使用事项

1. 首周自用分享，不会有太多自定义选项，也不会所有机制都报，能用就行。
2. 主库频繁更新，我不会帮你禁用，届时请自己去禁用掉主库更新的英文触发器。
3. 1风火是nl式。

## 悬浮窗的作用

部分副本需要正确配置悬浮窗的职能位置，才会正确进行优先级排序，进行对应报点。所以请在包含优先级机制的高难副本中正确选择你与你队友的职能位置。

## 攻略适配

- p6s：千星
- p8s：菓子
- 绝龙诗：莫古力全套。P2陨石默认整组换（可改），P5横排辉夜姬式（只有横排，没做鸡排）。
- 绝欧米茄： [https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)

## 修改配置、开关功能

![image](https://user-images.githubusercontent.com/33572696/236646515-46844cf6-0179-4fae-a471-1a37f078b1da.png)

## 注意事项

- **不要禁用触发器，如果你不需要他的提示文本，将对应输出改为空格即可。**
- 不要在打本的中途重启或开启 ACT。
- 小队内不可以存在重名玩家。
- 不需要 MoreLog（CactbotSelf）插件。
- 不保证兼容其他作者的同副本 JS 文件。
- 悬浮窗的职能位置分配与小队列表的排序无关。
- 建议卸载Triggernometry。

## 交流/反馈

- 1 群：~~868116069~~（已满，别加了）
- 2 群：231937107
