// flags
// 月光/花车 连击背       4471X003
// 月光/花车 连击侧       3F71X003
// 月光/花车 真北连击背   4471X003
// 月光/花车 真北连击侧   4471X003
// 月光/花车 真北明镜背   4471X003
// 月光/花车 真北明镜侧   4471X003
// 月光/花车 裸打背       1D71X003
// 月光/花车 真北裸打背   1D71X003
// 月光/花车 真北裸打侧   1D71X003
// 月光/花车 裸打侧         71X003

// 侧 龙牙龙爪 D720003
// 侧 龙牙龙爪 D720003
// 背 龙牙龙爪 720003
// 背 龙牙龙爪 724003
// 背 龙尾大回旋 A720003
// 背 龙尾大回旋 A720003
// 侧 龙尾大回旋 720003
// 侧 龙尾大回旋 720003

// 背 缢杀 5F3F
// 侧 绞决 5F3E
// 缢杀 背 正确 B714003 B700003
// 绞决 侧 正确 D710003
// 绞决 错误 710003 712003 714003


// https://nga.178.com/read.php?&tid=36166091
// 感谢souma大佬
// 其余职业由Phoenix实现

const soundPath = "../../user/raidboss/心之钢/heartsteel.mp3";
const soundVolume = 1.0;

Options.Triggers.push({
  zoneId: ZoneId.MatchAll, // 任意地图
  triggers: [
    {
      id: "心之钢 - 武士", // 独一无二的ID
      type: "Ability", // 能力命中
      netRegex: { id: ["1D39", "1D3A"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配月光与花车
      delaySeconds: (_data, matches) => {
        // 添加延迟 配合动作一起打出 听起来比较帅
        if (matches.id === "1D3A") return 0.3; // 花车
        if (matches.id === "1D39") return 0.38; // 月光
      },
      condition: (data, matches) => {
        return matches.source === data.me && /^3D71\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
    {
      id: "心之钢 - 龙骑", // 独一无二的ID
      type: "Ability", // 能力命中
      netRegex: { id: ["DE2", "DE4", "64AC"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配龙牙龙爪/龙尾大回旋/樱花缭乱
      condition: (data, matches) => {
        return matches.source === data.me && /^3A72\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
    {
      id: "心之钢 - 钐镰客", // 独一无二的ID,
      type: "Ability", // 能力命中
      netRegex: { id: ["5F3E", "5F3F", "906A", "906B"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配[绞决、缢杀、绞决处刑、缢杀处刑]
      condition: (data, matches) => {
        return matches.source === data.me && /^[79A]71\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
    {
      id: "心之钢 - 忍者", // 独一无二的ID,
      type: "Ability", // 能力命中
      netRegex: { id: ["8CF", "DEB"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配[旋风刃、强甲破点突]
      condition: (data, matches) => {
        return matches.source === data.me && /^(2A|34)71\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
    {
      id: "心之钢 - 武僧", // 独一无二的ID,
      type: "Ability", // 能力命中
      netRegex: { id: ["9053", "42"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配[豹袭崩拳、破碎拳]
      condition: (data, matches) => {
        return matches.source === data.me && /^(10|B|E)73\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
    {
      id: "心之钢 - 蝰蛇", // 独一无二的ID,
      type: "Ability", // 能力命中
      netRegex: { id: ["8732", "8733", "8734", "8735", "873D", "873E"] }, // 利用Cactbot内置的NetRegexes构造正则 匹配[侧击獠齿 侧裂獠齿 背击獠齿 背裂獠齿 猛袭盘蛇 疾速盘蛇]
      condition: (data, matches) => {
        return matches.source === data.me && /^(30|3C|8)71\d003$/.test(matches.flags); // 判断是否为玩家释放且身位正确
      },
      sound: soundPath, // 音频文件对于 ui/raidboss/ 文件夹的相对路径。
      soundVolume: soundVolume, // 音量
    },
  ],
});
