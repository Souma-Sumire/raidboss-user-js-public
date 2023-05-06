/*
  使用说明：
  使用宏触发："/e roll [收集时间] [random设置最大值]"
  方括号表示选项是可选的，可以省略。并不是命令的一部分。
  收集时间：  在XX秒后结束收集，并输出最大与最小值。
  random设置最大值：限制参与者的random设置的最大值，不一致的结果将不被统计。（留空则表示random无参数）

  例如：
  /e roll 
  代表开启一轮无限制random的默认时间收集
  /e roll 15
  代表开启一轮无限制random的15秒时间收集
  /e roll 15 2
  代表开启一轮限制random参数为2的15秒时间收集
*/

const isRaidEmulator = location.href.includes("raidemulator.html");

function doQueueCommand(queue = []) {
  if (isRaidEmulator) console.log(queue);
  else callOverlayHandler({ call: "PostNamazu", c: "DoQueueActions", p: JSON.stringify(queue) });
}

function doTextCommand(text) {
  if (isRaidEmulator) console.log(text);
  else callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
}

Options.Triggers.push({
  zoneId: ZoneId.MatchAll,
  initData: () => {
    return {
      lootStart: false,
      lootMax: undefined,
      lootCollect: new Map(),
    };
  },
  triggers: [
    {
      id: "20230505 loot - 开始",
      regex: /^.{14} ChatLog 00:0038::\s*roll\s*(?:time=)?(?<time>\d+)?\s*(?:max=)?(?<max>\d+)?\s*$/,
      condition: (data, _matches, output) => {
        if (data.lootStart) {
          doTextCommand(output.repeatStart());
          return false;
        }
        return (data.lootStart = true);
      },
      preRun: (data, matches, output) => {
        data.lootCollect.clear();
        const time = matches.time ?? Number(output.defaultTime());
        const max = matches.max;
        data.lootMax = matches.max;
        if (!max) doTextCommand(output.start({ time }));
        else doTextCommand(output.startMax({ time, max }));
      },
      delaySeconds: (_data, matches, output) => Number(matches.time ?? output.defaultTime()),
      infoText: "",
      sound: "",
      soundVolume: 0,
      run: (data, _matches, output) => {
        data.lootStart = false;
        if (data.lootCollect.size === 0) {
          doTextCommand(output.noPlayer());
          return;
        }
        const collect = [...data.lootCollect].sort((a, b) => a[1] - b[1]);
        const [minName, minLoot] = collect[0];
        const [maxName, maxLoot] = collect[collect.length - 1];
        if (minName === maxName) doTextCommand(output.lonely({ name: minName, loot: minLoot }));
        else {
          doTextCommand(output.debug({ minName, minLoot, maxName, maxLoot, size: collect.length }));
          const delay = Number(output.queueDelay());
          doQueueCommand(
            output
              .textQueue({ minName, minLoot, maxName, maxLoot })
              .split("|")
              .map((v) => ({ c: "command", p: v, d: delay })),
          );
        }
      },
      outputStrings: {
        defaultTime: { en: "30" }, // 默认收集时间
        repeatStart: { en: "/e 上轮还没结束！<se.11>" },
        start: { en: "/y 开始记录${time}秒内的roll点结果" },
        startMax: { en: "/y 开始记录${time}秒内最大${max}的roll点结果" },
        noPlayer: { en: "/y 本轮无人参与" },
        lonely: { en: "/y 本轮仅有一人参与：${name} ${loot}点" },
        debug: { en: "/e 人数：${size} 最高：${maxName} ${maxLoot}点 最低：${minName} ${minLoot}点" }, // 结算文本
        textQueue: { en: "/y 本回合最高：${maxName} 最低：${minName}！|/y 输家请选择《倒霉蛋》以及惩罚方式|/y {8人以上}与输家尾号相同的玩家一同受罚！" }, //结算文本 使用 | 分割多行
        queueDelay: { en: "2000" }, // 多行延迟
      },
    },
    {
      id: "20230505 loot - loot",
      regex: /^.{14} ChatLog 00:(084A|204A|104A):.*:(?<text>.*)/,
      condition: (data) => data.lootStart,
      run: (data, matches) => {
        const cn = matches.text.match(/^(?<name>.+)掷出了(?<loot>\d+)点！(?:（最大(?<max>\d+)）)?/);
        // todo: 其他语言？ （真有人在外服玩RP吗）
        if (!cn) return;
        const { name, loot, max } = cn.groups;
        if (!data.lootCollect.get(name) && max === data.lootMax) data.lootCollect.set(name, loot);
      },
    },
  ],
});
