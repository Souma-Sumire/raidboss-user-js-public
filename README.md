# raidboss-user-js-public

本套 JS 文件是在官方的基础上针对国服特色环境改造，使其更加符合国服宝宝体制。

## 如何使用

### 前置依赖

1. Cactbot Raidboss 悬浮窗正常工作。
1. 职业分配悬浮窗：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`，进入副本后正确设置**每个人**的职业位置。
1. （可选）加载正确版本的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)，用于执行标点等操作（如果你开了）。

### 安装

#### 使用下载器

适合大多数宝宝们使用。

1. 加载 [下崽器](https://github.com/Souma-Sumire/SoumaDownloader/releases/latest)
1. 勾选需要的文件然后点 [下载/更新] 按钮，程序会自动识别 user 文件夹并帮你下载最新的文件。
1. 刷新 Raidboss 悬浮窗即可成功加载

优势：文件通过呆萌服务器进行下载，对大多数人来说访问比Github顺畅。

劣势：程序的一些自动化可能会有潜在的风险。

下崽器特性：会删除目录下一切用户未勾选的文件。并且会进行覆盖式更新，所以如果你对源码进行了修改请不要通过下崽器更新，可以放到其他文件夹目录中或选择手动加载。默认的Souma目录请完全交给下崽器进行管理。虽然有一定的弹窗提醒但也不能完全保证您的文件稳定性。

#### 手动

适合熟练控制计算机的大宝宝们。

1. 手动点右上角下载或克隆本仓库
1. 把对应文件放入你的 user 文件夹
1. 刷新 Raidboss 悬浮窗即可成功加载

优势：本地文件完全掌控在自己手中。

劣势：获取更新可能不及时。网络访问可能不顺畅。

## 副本

### 极神

- 高贝扎：四风提醒、核爆提醒、暂存连续剑提醒、修正主库的一些问题

### 荒天篇

本次零式无任何标点功能。

- P9S：game8
- P10S game8
- P11S：默认game8、可选uptime调停
- P12S：门神默认菓子君、可选game8，本体game8。

### 旧零式

- P1S：通用
- P2S：无
- P3S：无
- P4S：被窝攻略
- P5S：无
- P6S：千星
- P7S：四风标点
- P8S：菓子（青瓜）

### 绝

- 神兵：三连桶标点
- 龙诗：莫古力
- 欧米茄： 我自己的打法/莫古力/其他打法也可调整自定义选项实现，详情见 [腾讯文档](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)

## 注意事项

- 在进入副本之前开启 ACT。
- 小队内不可以存在重名玩家。
- 不保证兼容其他作者的同副本 JS 文件。
- 排序与小队列表的显示顺序无关。
- JS 与 Triggernometry 或 MoreLog 插件无关。（MoreLog 又名 CactbotSelf，但他与 Cactbot 官方没有关系，这种起名方式让普通用户十分头晕）

## 修改配置、开关功能

Cactbot Config 面板
![Cactbot Config](https://github.com/Souma-Sumire/raidboss-user-js-public/assets/33572696/267c0cb7-233c-4c54-87ce-b9d0f49fd5d2)

## 反馈

- 2 群：231937107
