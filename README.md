# raidboss-user-js-public

## 安装准备（前置条件）

在开始之前，请确保你已经准备好以下内容：

- ✅ **ACT (Advanced Combat Tracker)**  —— 通常包含在“呆萌”或“咖啡”整合包中
- ✅ **悬浮窗插件 (OverlayPlugin)** —— 通常包含在“呆萌”或“咖啡”整合包中
- ✅ **Cactbot 触发器 (Cactbot Raidboss)** —— 通常包含在“呆萌”或“咖啡”整合包中
- **鲶鱼精邮差 (PostNamazu)** —— 可选，用于标点功能 [下载链接](https://github.com/Natsukage/PostNamazu/releases)

## 安装方法

### 方法1：使用下载器（推荐）

1. 下载 [SoumaDownloader.dll](https://github.com/Souma-Sumire/SoumaDownloader/releases)
2. 至少有过一次：“在启动了 OverlayPlugin 悬浮窗 & Cactbot 插件的情况下关闭ACT”，然后在 ACT 中加载该插件（否则无法自动获取目录）
3. 选择你需要的触发器文件，点击"开始下崽"
4. 刷新 Cactbot Raidboss 悬浮窗（或重启ACT）

### 方法2：手动安装

1. 下载 [仓库ZIP](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
2. 解压后，将 `raidboss` 文件夹里的 .js 文件复制到：
   - 呆萌整合：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
   - 咖啡整合：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`
3. 刷新 Cactbot Raidboss 悬浮窗（或重启ACT）

## 设置

### 分配职能位置

1. 在 OverlayPlugin 中新建一个悬浮窗：
   - 名称：随意（如"职责分配"）
   - 类型：数据统计
   - 悬浮窗地址：<https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime>
2. 进入副本后，在悬浮窗中手动分配每个人的职位（MT/ST/H1/H2/D1-D4）
3. 如果未分配，触发器会按默认顺序（战暗枪骑占白贤学蛇侍忍钐龙僧舞诗机绘黑召赤青）自动处理

### 修改触发器设置

1. 打开 OverlayPlugin → Cactbot Config → Raidboss → 具体 JS 文件
2. 找到对应设置，按需调整
3. 所有更改会保存到 OverlayPlugin 配置中，不会因更新文件而丢失
![image](https://github.com/user-attachments/assets/3efa5c75-e02d-46c2-a987-eaf008c9e039)

## 按文件说明

### 核心依赖

- `[必装] 依赖 - Souma拓展运行库`：核心依赖，请无脑安装

### 绝本系列

- `绝 - 神兵 三连桶`：三连桶标记，需要[分配职能位置](#分配职能位置)、鲶鱼精邮差
- `绝 - 龙诗`：兼容常见打法（除了P5鸡排），需要[分配职能位置](#分配职能位置)
- `绝 - 欧米茄.o`：适配莫古力攻略，[自动标点图示](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)，需要[分配职能位置](#分配职能位置)
- `绝 - 欧米茄 P2铁匠警察`：当P2有人使用单体技能攻击防火墙目标时，发出通报批评，需要鲶鱼精邮差。
- `绝 - 伊甸`：默认“MMW&MGL合作攻略”一套，兼容常见打法，需要[分配职能位置](#分配职能位置)
- `绝 - 伊甸 P4未来碎片保镖`：当P4未来碎片被错误攻击时，发出通报并抓出凶手，需要鲶鱼精邮差

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
- `零式 - P4S`：适配海豹式拉线、被窝攻略，需要[分配职能位置](#分配职能位置)
- `零式 - P5S`：略
- `零式 - P6S`：适配 uptime 打法，需要[分配职能位置](#分配职能位置)
- `零式 - P7S`：略
- `零式 - P8S`：适配菓子攻略等，需要[分配职能位置](#分配职能位置)
- `零式 - P9S`：略
- `零式 - P10S`：略
- `零式 - P11S`：适配"光与暗的调和"机制（Game8/美服uptime）
- `零式 - P12S`：适配Game8、菓子、NL改、papan等解法，需要[分配职能位置](#分配职能位置)

### 杂项

- `灭 - 暗黑之云`：首周存档，不再维护
- `挖宝 - 曼德拉标点`：标记曼德拉顺序，需要鲶鱼精邮差
- `玩具 - 食物警察`：检查队友食物是否（即将）到期
- `异闻零式 - 阿罗阿罗岛`：云编写，适配 MMW/肉桂攻略，未经测试，需要[分配职能位置](#分配职能位置)
- `易用性 - TTS不念出东南西北`：屏蔽 TTS 中的方向词（不影响文本提示）
- `易用性 - 风脉泉标记`：宏指令 `/e fengmai`
- `易用性 - 关闭提示音`：关闭默认的触发器音效
- `易用性 - 招募满人提醒`：若切屏时招募组满人，循环播放“人齐了”语音
