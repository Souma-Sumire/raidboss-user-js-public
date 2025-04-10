# 使用说明

## 手动下载

1. [下载本仓库](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)

1. 将 **raidboss** 文件夹中 _你需要的_ `.js` 文件，放入对应文件夹
    - 🐱 呆萌：`ACT.DieMoe\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss`
    - ☕ 咖啡：`ACT.ffcafe\Plugins\cactbot-offline\user\raidboss`

1. 关掉对应副本的默认自带触发器，以绝伊甸为例
   ![795c401924a050f7eeeaef22b1d1b0c2](/img/eden.png)

1. 刷新 _Cactbot Raidboss_ 悬浮窗 或 重启ACT

## 常见问题

### 绝伊甸雾龙怎么不报

   雾龙功能默认关闭，需要手动到 **config 面板** 勾选开启

### 切换机制打法

   同样到 **config 面板** 具体文件的菜单中切换，高难副本几乎所有解法均有适配

### 设置职能位置（我是MT/ST/H1/H2/D1/D2/D3/D4）

默认以 `战暗枪骑占白贤学蛇侍忍钐龙僧舞诗机绘黑召赤青` 的顺序自动分配。

但实战中我们可能有各种位置，所以你需要：

1. 在 `OverlayPlugin悬浮窗插件` 中，左下角点击 `新建` 按钮。
1. 名称任意输入，预设选择 `自定义悬浮窗`，类型选择 `数据统计`
1. 切换到该标签，在右侧空白的 `悬浮窗地址` 输入框中填入：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`
1. 移动至合适位置、调整大小后，勾选 `锁定悬浮窗`
1. 组成小队后，在该悬浮窗中分配每个人的正确职能位置

![image](https://github.com/user-attachments/assets/1a9ccfc6-35d1-4f93-a3b8-0a41c698d946)

### 自动标点或自动喊话功能

1. 需要加载对应版本的 [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases)（一般来说是最新版）
1. 所有可能对队友产生影响的功能都是默认关闭的，你需要在 **config 面板** 中手动开启他们
![image](https://github.com/user-attachments/assets/3efa5c75-e02d-46c2-a987-eaf008c9e039)

## 按文件说明

### 核心依赖

- `[必装] 依赖 - Souma拓展运行库`：必须有，且最好不要重命名，因需要保证其在名称排序时处于首位

### 绝本系列

- `绝 - 龙诗`：兼容常见打法（不支持P5鸡排式）
- `绝 - 欧米茄 P2铁匠警察`：当P2有人使用单体技能攻击防火墙时，发出通报批评
- `绝 - 欧米茄.o`：适配莫古力攻略。[自动标点图示](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)
- `绝 - 神兵 三连桶`：三连桶标记
- `绝 - 伊甸 P4未来碎片保镖`：当P4未来碎片被错误攻击时，发出通报并抓出凶手
- `绝 - 伊甸`：默认“MMW&MGL合作攻略”一套，兼容其他常见打法

### 零式系列

- `零式 - M1S`：略
- `零式 - M2S`：略
- `零式 - M3S`：略
- `零式 - M4S`：首周代码存档，适配Game8攻略
- `零式 - M5S`：通用
- `零式 - M6S`：通用
- `零式 - M7S`：通用
- `零式 - M8S`：门神MMW，本体瑞凌
- `零式 - P1S`：略
- `零式 - P2S`：略
- `零式 - P3S`：略
- `零式 - P4S`：适配海豹式拉线、被窝攻略
- `零式 - P5S`：略
- `零式 - P6S`：适配 uptime 打法
- `零式 - P7S`：略
- `零式 - P8S`：适配菓子攻略等
- `零式 - P09S`：略
- `零式 - P10S`：略
- `零式 - P11S`：适配"光与暗的调和"机制（Game8/美服uptime）
- `零式 - P12S`：适配Game8、菓子、NL改、papan等解法

### 其他功能

- `灭 - 暗黑之云`：首周存档，不再维护
- `挖宝 - 曼德拉标点`：标记曼德拉顺序
- `玩具 - 食物警察`：检查队友食物是否（即将）到期
- `异闻零式 - 阿罗阿罗岛`：云编写，适配MMW/肉桂攻略，未经测试
- `易用性 - TTS不念出东南西北`：屏蔽TTS中的方向词（不影响文本提示）
- `易用性 - 风脉泉标记`：宏指令 `/e fengmai`
- `易用性 - 关闭提示音`：关闭默认的触发器音效
- `易用性 - 招募满人提醒`：若切屏时招募组满人，循环播放"人齐了"语音
