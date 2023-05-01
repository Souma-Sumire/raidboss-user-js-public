# raidboss-user-js-public

## 依赖

1. 悬浮窗插件 新建悬浮窗（类型：数据统计）：`https://souma.diemoe.net/ff14-overlay-vite/#/cactbotRuntime`

1. [鲶鱼精邮差](https://github.com/Natsukage/PostNamazu/releases) 1.3.2.5 及以上。

## 下载

- 我是萌新：能连上哪个用哪个 [原生](https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 1](https://git.xfj0.cn/https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 2](https://js.xxooo.ml/https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 3](https://gh.con.sh/https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 4](https://ghps.cc/https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 5](https://archive.fastgit.org/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 6](https://ghproxy.com/https://github.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)
  [节点 7](https://kgithub.com/Souma-Sumire/raidboss-user-js-public/archive/refs/heads/main.zip)，然后解压。
- 我是电脑高手：直接用 Git Clone 即可

## 安装

1. 将需要的 JS 文件放入本地对应文件夹中

   - 咖啡 ACT：`ACT\Plugins\cactbot-offline\user\raidboss\Souma\`
   - 呆萌、原生 ACT：`ACT.呆萌整合\Plugins\ACT.OverlayPlugin\cactbot\user\raidboss\Souma\`

1. 刷新 _Cactbot Raidboss_ 悬浮窗 以加载文件。

## 特化打法说明

- p6s：千星
- p8s：菓子
- 绝欧米茄： [https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh](https://docs.qq.com/doc/DTXZHb1lXcUZ4eXBh)

## 修改配置、开关功能

![config](https://i.328888.xyz/2023/04/30/iKKJgQ.png)

### Tips

如果你不需要某个提示文本，请不要在下拉选项中禁用，因为这可能导致其逻辑也一同被禁用，导致其他触发器出错。

安全的禁用方式：将对应文本改为空格。

## 其他说明

1. **不赞同**与其他人制作的的**同副本**JS 文件混用，这是 _十分危险_ 的。
1. 悬浮窗中设置的职能位置与你小队列表的排序**无关**。
1. 任何 JS 都**不需要**MoreLog（CactbotSelf）插件。
1. 你**不应该**在打本的中途重启 ACT，这会影响到许多初始化的工作。
1. 游戏内的 ID 设置为缩写并不会影响任何逻辑。
1. 不支持小队内存在重名玩家，无论他们的服务器来自哪里。
