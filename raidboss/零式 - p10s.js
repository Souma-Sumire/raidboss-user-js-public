if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const { deepClone } = Util.souma;
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTenthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
    config: [],
    initData: () => {
      return {
        souma: {
          zhuzi: [],
          safeRow: undefined,
          delay: [],
        },
      };
    },
    triggers: [
      { id: "P10S Pandaemoniac Bonds Cleanup", disabled: true },
      { id: "P10S Tetradaemoniac Bonds Collect", disabled: true },
      { id: "P10S Daemoniac Bonds Timer", disabled: true },
      { id: "P10S Dueodaemoniac Bonds Future", disabled: true },
      { id: "P10S TetraDaemoniac Bonds Future", disabled: true },
      { id: "P10S Daemoniac Bonds First", disabled: true },
      { id: "P10S Daemoniac Bonds Followup", disabled: true },
      { id: "P10S TetraDaemoniac Bonds First", disabled: true },
      { id: "P10S Dueodaemoniac Bonds First", disabled: true },
      {
        id: "P10S Souma 钢铁",
        type: "StartsUsing",
        netRegex: { id: "82A6", capture: false },
        preRun: (data) => (data.souma.safeRow = 2),
        delaySeconds: 10,
        run: (data) => {
          data.souma.safeRow = undefined;
        },
      },
      {
        id: "P10S Souma 月环",
        type: "StartsUsing",
        netRegex: { id: "82A7", capture: false },
        preRun: (data) => (data.souma.safeRow = 1),
        delaySeconds: 10,
        run: (data) => {
          data.souma.safeRow = undefined;
        },
      },
      {
        id: "P10S Souma 小东西",
        type: "StartsUsing",
        netRegex: { id: ["8285", "8287"], capture: true },
        preRun: (data, matches) => {
          let row = 0;
          if (Math.abs(matches.y - 91.5) < 2) row = 1;
          else if (Math.abs(matches.y - 103) < 2) row = 2;
          else row = 3;
          data.souma.zhuzi.push({ type: matches.id === "8285" ? 1 : 0, row, x: matches.x, y: matches.y });
        },
        alertText: (data, _matches, output) => {
          if (data.souma.zhuzi.length === 6) {
            const row = data.souma.zhuzi
              .filter((v) => v.row === data.souma.safeRow)
              .sort((a, b) => a.x - b.x)
              .map((v) => v.type)
              .join("");
            data.souma.zhuzi.length = 0;
            return output[row]();
          }
        },
        outputStrings: {
          "100": { en: "中间偏左" }, // 或者右偏右 或者左贴边（躲开钢铁）
          "010": { en: "两侧" },
          "001": { en: "中间偏右" }, // 或者左偏左 或者右贴边（躲开钢铁）
          "110": { en: "右" },
          "101": { en: "中间" },
          "011": { en: "左" },
        },
      },
      {
        id: "P10S Souma 延迟分散",
        type: "GainsEffect",
        netRegex: { effectId: "DDE", capture: true },
        condition: Conditions.targetIsYou(),
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "散开" } },
      },
      {
        id: "P10S Souma 延迟2分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["DDF"], capture: true },
        suppressSeconds: 1,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "二二分摊" } },
      },
      {
        id: "P10S Souma 延迟4分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["E70"], capture: true },
        suppressSeconds: 1,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "四四分摊" } },
      },
      {
        id: "P10S Souma 延迟分散分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["DDE", "DDF", "E70"], capture: true },
        preRun: (data, matches) => {
          if (!data.souma.delay.find((v) => v.effectId === matches.effectId)) data.souma.delay.push(matches);
        },
        durationSeconds: (_data, matches) => parseFloat(matches.duration),
        infoText: (data, _matches, output) => {
          if (data.souma.delay.length === 2) {
            const arr = deepClone(data.souma.delay).sort((a, b) => a.duration - b.duration);
            const a = output[arr[0].effectId]();
            const b = output[arr[1].effectId]();
            data.souma.delay.length = 0;
            return output.text({ a, b });
          }
        },
        outputStrings: { DDE: { en: "散开" }, DDF: { en: "二二" }, E70: { en: "四四" }, text: { en: "延迟${a} => ${b}" } },
      },
      {
        id: "P10S Souma 延迟分散分摊清理",
        type: "GainsEffect",
        netRegex: { effectId: ["DDE", "DDF", "E70"], capture: false },
        suppressSeconds: 1,
        delaySeconds: 1,
        run: (data) => (data.souma.delay.length = 0),
      },
      {
        id: "P10S Jade Passage",
        type: "AddedCombatant",
        netRegex: { npcNameId: "12356" },
        suppressSeconds: 5,
        infoText: (_data, _, output) => output.text(),
        outputStrings: {
          text: { en: "躲激光" },
        },
        // infoText: (_data, matches, output) => (Math.floor(parseInt(matches.y) / 2) % 2 === 1 ? output.lines() : output.boxes()),
        // outputStrings: { lines: { en: "站边框" }, boxes: { en: "站格子里" } },
      },
      {
        id: "P10S Souma 魔殿震击",
        type: "StartsUsing",
        netRegex: { id: "828F", capture: false },
        infoText: (data, _matches, output) => output[data.role === "tank" ? "tank" : "text"](),
        outputStrings: {
          tank: { en: "8连AOE（站最前）" },
          text: { en: "8连AOE（站坦克后面）" },
        },
      },
      {
        id: "P10S Souma 魔殿震击2",
        type: "StartsUsing",
        netRegex: { id: "8294", capture: false },
        infoText: (data, _matches, output) => output[data.role === "tank" ? "tank" : "text"](),
        outputStrings: {
          tank: { en: "击退（站最前）" },
          text: { en: "击退（站坦克后面）" },
        },
      },
      {
        id: "P10S Souma 猪B",
        type: "GainsEffect",
        netRegex: { effectId: "D24", capture: true },
        alarmText: (data, matches, output) => {
          const canCleanse = Util.canCleanse(data.job);
          if (matches.target === data.me) {
            return canCleanse ? output.cleanse() : output.canNotCleanse();
          } else if (canCleanse) {
            return output.help({ name: data.ShortName(matches.target) });
          }
        },
        outputStrings: {
          cleanse: { en: "驱散自己" },
          canNotCleanse: { en: "喊救命！" },
          help: { en: "驱散${name}" },
        },
      },
    ],
  });
}
