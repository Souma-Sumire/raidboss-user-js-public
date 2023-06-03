if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const firstMarker = parseInt("028B", 16);
  const headmarkers = {
    buster: "028B",
    双分摊: "0264",
    能搭桥的蛛网: "0266",
    普通蛛网: "0263",
    红点名: "00CF",
    mj1: "0208",
    mj2: "0209",
    mj3: "020A",
    mj4: "020B",
  };
  const getHeadmarkerId = (data, matches) => {
    if (data.souma.decOffset === undefined) data.souma.decOffset = parseInt(matches.id, 16) - firstMarker;
    return (parseInt(matches.id, 16) - data.souma.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const {
    getRpByName,
    doTextCommand,
    doQueueActions,
    doQueueActionsDebug,
    sortMatchesBy,
    sortMatchesByFill,
    getClearMarkQueue,
    orientation4,
    deepClone,
    mark,
  } = Util.souma;
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTenthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheTenthCircleSavage,
    config: [
      {
        id: "翅膀标点",
        name: { en: "翅膀标点" },
        type: "select",
        options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
        default: "关",
      },
    ],
    initData: () => {
      if (!location.href.includes("raidemulator.html")) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P10S Souma Public Queue .*" },
            // { c: "DoWaymarks", p: "load", d: 3000 },
            { c: "DoTextCommand", p: "/mk off <1>", d: 3000 },
            { c: "DoTextCommand", p: "/mk off <2>" },
            { c: "DoTextCommand", p: "/mk off <3>" },
            { c: "DoTextCommand", p: "/mk off <4>" },
            { c: "DoTextCommand", p: "/mk off <5>" },
            { c: "DoTextCommand", p: "/mk off <6>" },
            { c: "DoTextCommand", p: "/mk off <7>" },
            { c: "DoTextCommand", p: "/mk off <8>" },
          ]),
        });
      }
      return {
        souma: {
          decOffset: undefined,
          zhuzi: [],
          delay: [],
          chibang: [],
          safeRow: undefined,
        },
      };
    },
    triggers: [
      // {
      //   id: "Souma P10S Casting Entrance",
      //   netRegex: NetRegexes.startsUsing({}),
      //   condition: (_data, matches) => !!startsUsingStrings[matches.id],
      //   infoText: (_data, matches, output) => output[matches.id](),
      //   outputStrings: startsUsingStrings,
      // },
      {
        id: "P10S Souma Headmarker Tracker",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => data.souma.decOffset === undefined,
        run: (data, matches) => getHeadmarkerId(data, matches),
      },
      {
        id: "P10S Souma 究极",
        type: "StartsUsing",
        netRegex: { id: "82A5", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P10S Souma 钢铁",
        type: "StartsUsing",
        netRegex: { id: "82A6", capture: false },
        infoText: "远离",
        run: (data) => (data.souma.safeRow = 2),
      },
      {
        id: "P10S Souma 月环",
        type: "StartsUsing",
        netRegex: { id: "82A7", capture: false },
        infoText: "靠近",
        run: (data) => (data.souma.safeRow = 1),
      },
      {
        id: "P10S Souma 柱子",
        type: "StartsUsing",
        netRegex: { id: ["8285", "8287"], capture: true },
        preRun: (data, matches) => {
          let row = 0;
          if (Math.abs(matches.y - 91.5) < 2) row = 1;
          else if (Math.abs(matches.y - 103) < 2) row = 2;
          else row = 3;
          data.souma.zhuzi.push({ type: matches.id === "8285" ? "钢铁" : "月环", row, x: matches.x, y: matches.y });
        },
      },
      {
        id: "P10S Souma 柱子结算",
        type: "StartsUsing",
        netRegex: { id: ["8285", "8287"], capture: true },
        suppressSeconds: 1,
        delaySeconds: 0.1,
        infoText: (data, matches) => {
          if (data.souma.zhuzi.length >= 6) {
            const row = data.souma.zhuzi
              .filter((v) => v.row === data.souma.safeRow)
              .sort((a, b) => a.x - b.x)
              .map((v) => (v.type === "钢铁" ? 1 : 0))
              .join("");
            data.souma.zhuzi.length = 0;
            let result;
            switch (row) {
              case "100":
                result = "中(偏左)";
                break;
              case "010":
                result = "两侧";
                break;
              case "001":
                result = "中(偏右)";
                break;
              case "110":
                result = "右";
                break;
              case "101":
                result = "中间";
                break;
              case "011":
                result = "左";
                break;
              default:
                throw "柱子结算" + row;
            }
            return result;
          }
        },
      },
      {
        id: "P10S Souma 翅膀连线",
        type: "Tether",
        netRegex: { id: "00F2" },
        preRun: (data, matches) => data.souma.chibang.push(matches),
        alarmText: (data, matches, output) => {
          if (matches.target === data.me) return output.text();
        },
        outputStrings: {
          text: { en: "扇形点名 => 剪线" },
        },
      },
      {
        id: "P10S Souma 翅膀连线2",
        type: "Tether",
        netRegex: { id: "00F2" },
        delaySeconds: 0.1,
        suppressSeconds: 1,
        run: (data, matches) => {
          if (data.souma.chibang.length >= 2) {
            const isMark = ["开", "本地"].includes(data.triggerSetConfig.翅膀标点);
            const local = data.triggerSetConfig.翅膀标点 === "本地";
            if (isMark) {
              mark(parseInt(data.souma.chibang[0].targetId, 16), "stop1", local);
              mark(parseInt(data.souma.chibang[1].targetId, 16), "stop2", local);
              doQueueActions([...getClearMarkQueue(local, 10000)]);
            }
            data.souma.chibang.length = 0;
          }
        },
      },
      {
        id: "P10S Souma 死刑",
        type: "StartsUsing",
        netRegex: { id: "829F" },
        response: Responses.tankBuster(),
      },
      {
        id: "P10S Souma 左右刀1",
        type: "StartsUsing",
        netRegex: { id: "828B" },
        alarmText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "左左左" },
        },
      },
      {
        id: "P10S Souma 左右刀2",
        type: "StartsUsing",
        netRegex: { id: "8289" },
        alarmText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "右右右" },
        },
      },
      {
        id: "P10S Souma 延迟分散",
        type: "GainsEffect",
        netRegex: { effectId: "DDE", capture: true }, // DDE 22
        condition: Conditions.targetIsYou(),
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
        infoText: (data, _, output) => output.text(),
        outputStrings: { text: { en: "散开" } },
      },
      {
        id: "P10S Souma 延迟2分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["DDF"], capture: true },
        //   condition: Conditions.targetIsYou(),
        suppressSeconds: 1,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
        infoText: (data, _, output) => output.text(),
        outputStrings: { text: { en: "2人分摊" } },
      },
      {
        id: "P10S Souma 延迟4分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["E70"], capture: true },
        //   condition: Conditions.targetIsYou(),
        suppressSeconds: 1,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
        infoText: (data, _, output) => output.text(),
        outputStrings: { text: { en: "4人分摊" } },
      },
      {
        id: "P10S Souma 延迟分散分摊",
        type: "GainsEffect",
        netRegex: { effectId: ["DDE", "DDF", "E70"], capture: true },
        //   condition: Conditions.targetIsYou(),
        preRun: (data, matches) => {
          if (!data.souma.delay.find((v) => v.effectId === matches.effectId)) data.souma.delay.push(matches);
        },
        infoText: (data, matches, output) => {
          if (data.souma.delay.length === 2) {
            const arr = deepClone(data.souma.delay).sort((a, b) => a.duration - b.duration);
            const a = output[arr[0].effectId]();
            const b = output[arr[1].effectId]();
            //   doTextCommand(`/p ${a} => ${b}`);
            data.souma.delay.length = 0;
            return output.text({ a, b });
          }
        },
        outputStrings: { DDE: { en: "散开" }, DDF: { en: "2人分摊" }, E70: { en: "4人分摊" }, text: { en: "${a} => ${b}" } },
      },
      {
        id: "P10S Souma 延迟分散分摊清理",
        type: "GainsEffect",
        netRegex: { effectId: ["DDE", "DDF", "E70"], capture: false },
        suppressSeconds: 1,
        delaySeconds: 1,
        run: (data) => (data.souma.delay.length = 0),
      },
    ],
  });
}
