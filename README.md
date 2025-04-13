# 使用说明

## 安装

### 下崽器

1. 下载 [下崽器](https://github.com/Souma-Sumire/SoumaDownloader/releases) 并在 ACT 中加载
1. 选择你需要的文件，点击下崽按钮
1. 每次下崽成功后，手动刷新 _Cactbot Raidboss_ 悬浮窗 或 重启ACT，使文件生效
1. 为防止重复报点，请禁用对应副本的默认自带触发器集合，以绝伊甸为例（只需要禁用一次）
   ![795c401924a050f7eeeaef22b1d1b0c2](/img/eden.png)

### 手动安装

1. 下载 [仓库 ZIP](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)

1. 将 **raidboss** 文件夹中 _你需要的_ `.js` 文件，放入 ACT 对应文件夹
    - 🐱 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
    - ☕ 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

1. 每次文件放置完毕后，手动刷新 _Cactbot Raidboss_ 悬浮窗 或 重启ACT，使文件生效
1. 为防止重复报点，请禁用对应副本的默认自带触发器集合，以绝伊甸为例（只需要禁用一次）
   ![795c401924a050f7eeeaef22b1d1b0c2](/img/eden.png)

## 配置

### 设置职能位置

为了知道谁是MT/ST/H1/H2/D1/D2/D3/D4，你需要新建一个悬浮窗：

1. 在 `OverlayPlugin悬浮窗插件` 中，左下角点击 `新建` 按钮
1. 名称任意输入，预设选择 `自定义悬浮窗`，类型选择 `数据统计`
1. 切换到该标签，在右侧空白的 `悬浮窗地址` 输入框中填入：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`
1. 移动至合适位置、调整大小后，勾选 `锁定悬浮窗`
1. 组成小队后，在该悬浮窗中分配每个人的正确职能位置

![image](https://github.com/user-attachments/assets/1a9ccfc6-35d1-4f93-a3b8-0a41c698d946)

如果你跳过了此步骤，将默认以 `战暗枪骑占白贤学蛇侍忍钐龙僧舞诗机绘黑召赤青` 的顺序自动分配

### 开启自动标点

我的设计哲学要求任何可能会打扰到队友的功能都是默认关闭的，你需要在 **config 面板** 中手动开启对应功能
![image](https://github.com/user-attachments/assets/3efa5c75-e02d-46c2-a987-eaf008c9e039)

- 标点功能需要 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)，请自行加载最新版

## 按文件说明

### 核心依赖

- `[必装] 依赖 - Souma拓展运行库`：核心依赖，请无脑安装

### 绝本系列

- `绝 - 神兵 三连桶`：单纯的三连桶标记，默认关闭，**需要[设置职能位置](#设置职能位置)、鲶鱼精邮差**
- `绝 - 龙诗`：兼容常见打法（除了P5鸡排），**需要[设置职能位置](#设置职能位置)**
- `绝 - 欧米茄.o`：适配莫古力攻略，[自动标点图示](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)，**需要[设置职能位置](#设置职能位置)**
- `绝 - 欧米茄 P2铁匠警察`：当P2有人使用单体技能攻击防火墙目标时，发出通报批评，**需要鲶鱼精邮差。**
- `绝 - 伊甸`：默认“MMW&MGL合作攻略”一套，兼容常见打法，**需要[设置职能位置](#设置职能位置)**
- `绝 - 伊甸 P4未来碎片保镖`：当P4未来碎片被错误攻击时，发出通报并抓出凶手，**需要鲶鱼精邮差**

### 零式系列

#### 阿卡狄亚

- `零式 - M1S`：略
- `零式 - M2S`：略
- `零式 - M3S`：略
- `零式 - M4S`：首周代码存档，适配Game8攻略
- `零式 - M5S`：通用
- `零式 - M6S`：通用
- `零式 - M7S`：通用
- `零式 - M8S`：门神MMW，本体瑞凌

#### 万魔殿

- `零式 - P1S`：略
- `零式 - P2S`：略
- `零式 - P3S`：略
- `零式 - P4S`：适配海豹式拉线、被窝攻略，**需要[设置职能位置](#设置职能位置)**
- `零式 - P5S`：略
- `零式 - P6S`：适配 uptime 打法，**需要[设置职能位置](#设置职能位置)**
- `零式 - P7S`：略
- `零式 - P8S`：适配菓子攻略等，**需要[设置职能位置](#设置职能位置)**
- `零式 - P9S`：略
- `零式 - P10S`：略
- `零式 - P11S`：适配"光与暗的调和"机制（Game8/美服uptime）
- `零式 - P12S`：适配Game8、菓子、NL改、papan等解法，**需要[设置职能位置](#设置职能位置)**

### 杂项

- `灭 - 暗黑之云`：首周存档，不再维护
- `挖宝 - 曼德拉标点`：标记曼德拉顺序，需要鲶鱼精邮差
- `玩具 - 食物警察`：检查队友食物是否（即将）到期
- `异闻零式 - 阿罗阿罗岛`：云编写，适配MMW/肉桂攻略，未经测试，**需要[设置职能位置](#设置职能位置)**
- `易用性 - TTS不念出东南西北`：屏蔽TTS中的方向词（不影响文本提示）
- `易用性 - 风脉泉标记`：宏指令 `/e fengmai`
- `易用性 - 关闭提示音`：关闭默认的触发器音效
- `易用性 - 招募满人提醒`：若切屏时招募组满人，循环播放"人齐了"语音
