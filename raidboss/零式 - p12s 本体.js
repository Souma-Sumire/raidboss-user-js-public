if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const firstMarker = parseInt("027F", 16);
  const headmarkers = {
    butser: "027F",
    sony1: "021A",
    sony2: "021D",
    sony3: "021B",
    sony4: "021C",
    // "01DA":"",//热素红点名
  };
  const getHeadmarkerId = (data, matches) => {
    if (data.souma2.decOffset === undefined) data.souma2.decOffset = parseInt(matches.id, 16) - firstMarker;
    return (parseInt(matches.id, 16) - data.souma2.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const { getRpByName, doQueueActions, getClearMarkQueue, deepClone, mark } = Util.souma;

  function calculateDistance(x1, y1, x2, y2) {
    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  }
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTwelfthCircleSavage2",
    zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
    config: [
      {
        id: "热素1标点",
        name: { en: "热素1标点" },
        type: "select",
        options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
        default: "关",
      },
      // {
      //   id: "消失因子标记",
      //   name: { en: "消失因子标记" },
      //   type: "select",
      //   options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
      //   default: "关",
      // },
    ],
    initData: () => {
      if (!location.href.includes("raidemulator.html")) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P12S Souma Public Queue .*" },
            { c: "DoWaymarks", p: "load", d: 3000 },
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
        souma2: {
          decOffset: undefined,
          重火: [],
          诱风: [],
          消失因子: [],
          sony: [],
          white: [],
          dark: [],
          quanshen: false,
        },
      };
    },
    triggers: [
      {
        id: "P12S Souma 究极",
        type: "StartsUsing",
        netRegex: { id: "8682", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P12S Souma 创世纪",
        type: "StartsUsing",
        netRegex: { id: "833F", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P12S Souma 盖亚之怒",
        type: "StartsUsing",
        netRegex: { id: "8326", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P12S Souma 理念元素",
        type: "StartsUsing",
        netRegex: { id: "8331", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P12S Souma 星天豹击打",
        type: "StartsUsing",
        netRegex: { id: "8317", capture: false },
        infoText: (data, _, output) => {
          if (data.role === "tank") return "死刑";
          else if (data.role === "healer") return "准备驱散";
        },
      },
      {
        id: "P12S Souma Headmarker Tracker",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => data.souma2.decOffset === undefined,
        preRun: (data, matches) => getHeadmarkerId(data, matches),
      },
      {
        id: "P12S Souma Synergy Marker Collect",
        type: "HeadMarker",
        netRegex: {},
        delaySeconds: 0.2,
        preRun: (data, matches, output) => {
          const id = getHeadmarkerId(data, matches);
          switch (id) {
            case headmarkers.sony1:
              data.souma2.sony.push({ target: matches.target, sony: 1 });
              break;
            case headmarkers.sony2:
              data.souma2.sony.push({ target: matches.target, sony: 2 });
              break;
            case headmarkers.sony3:
              data.souma2.sony.push({ target: matches.target, sony: 3 });
              break;
            case headmarkers.sony4:
              data.souma2.sony.push({ target: matches.target, sony: 4 });
              break;
            default:
              break;
          }
        },
        infoText: (data, matches, output) => {
          if (data.souma2.sony.length === 8) {
            const sony = deepClone(data.souma2.sony);
            data.souma2.sony.length = 0;
            return output[sony.find((v) => v.target === data.me).sony]({ greek: data.souma2.myGreek });
          }
        },
        tts: null,
        outputStrings: {
          1: { en: "第1列${greek}" },
          2: { en: "第2列${greek}" },
          3: { en: "第3列${greek}" },
          4: { en: "第4列${greek}" },
        },
      },
      {
        id: "P12S Souma 本体α",
        type: "GainsEffect",
        netRegex: { effectId: "DE8", capture: true },
        condition: Conditions.targetIsYou(),
        preRun: (data) => {
          data.souma2.myGreek = "α";
        },
      },
      {
        id: "P12S Souma 本体β",
        type: "GainsEffect",
        netRegex: { effectId: "DE9", capture: true },
        condition: Conditions.targetIsYou(),
        preRun: (data) => {
          data.souma2.myGreek = "β";
        },
      },
      {
        id: "P12S Souma 本体α热素1",
        type: "GainsEffect",
        netRegex: { effectId: "DE8", capture: true },
        condition: Conditions.targetIsYou(),
        durationSeconds: 10,
        suppressSeconds: 30,
        // delaySeconds: 1.5,
        delaySeconds: 0.5,
        infoText: (data, _, output) => output.text(),
        tts: null,
        outputStrings: { text: { en: "找红三角" } },
      },
      {
        id: "P12S Souma 本体β热素1",
        type: "GainsEffect",
        netRegex: { effectId: "DE9", capture: true },
        condition: Conditions.targetIsYou(),
        suppressSeconds: 30,
        // delaySeconds: 1.5,
        delaySeconds: 0.5,
        infoText: (data, _, output) => output.text(),
        tts: null,
        outputStrings: { text: { en: "找黄正方" } },
      },
      {
        id: "P12S Souma 重火之兆",
        type: "GainsEffect",
        netRegex: { effectId: "E06", capture: true },
        preRun: (data, matches) => {
          data.souma2.重火.push({ ...matches, rp: getRpByName(data, matches.target) });
        },
      },
      {
        id: "P12S Souma 诱风之兆",
        type: "GainsEffect",
        netRegex: { effectId: "E07", capture: true },
        preRun: (data, matches) => {
          data.souma2.诱风.push({ ...matches, rp: getRpByName(data, matches.target) });
        },
      },
      {
        id: "P12S Souma 重火之兆1结算",
        type: "GainsEffect",
        netRegex: { effectId: ["E06", "E07"], capture: true },
        delaySeconds: 0.2,
        durationSeconds: 23,
        suppressSeconds: 3,
        infoText: (data, _, output) => {
          const isMark = ["开", "本地"].includes(data.triggerSetConfig.热素1标点);
          const local = data.triggerSetConfig.热素1标点 === "本地";
          const 优先级 = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"];
          let res;

          if (data.souma2.重火.length === 4) {
            data.souma2.重火.sort((a, b) => 优先级.indexOf(a.rp) - 优先级.indexOf(b.rp));
            data.souma2.诱风.sort((a, b) => 优先级.indexOf(a.rp) - 优先级.indexOf(b.rp));
            if (isMark) {
              mark(parseInt(data.souma2.重火[0].targetId, 16), "attack1", local);
              mark(parseInt(data.souma2.重火[1].targetId, 16), "attack2", local);
              mark(parseInt(data.souma2.重火[2].targetId, 16), "attack3", local);
              mark(parseInt(data.souma2.重火[3].targetId, 16), "attack4", local);
              mark(parseInt(data.souma2.诱风[0].targetId, 16), "bind1", local);
              mark(parseInt(data.souma2.诱风[1].targetId, 16), "bind2", local);
              mark(parseInt(data.souma2.诱风[2].targetId, 16), "bind3", local);
              mark(parseInt(data.souma2.诱风[3].targetId, 16), "square", local);
              doQueueActions(getClearMarkQueue(local, 7000));
            }
            data.souma2.重火1bak = deepClone(data.souma2.重火);
            switch (data.me) {
              case data.souma2.重火[0].target:
                // data.souma2.isFire = true;
                res = output.火1();
                break;
              case data.souma2.重火[1].target:
                // data.souma2.isFire = true;
                res = output.火2();
                break;
              case data.souma2.重火[2].target:
                // data.souma2.isFire = true;
                res = output.火3();
                break;
              case data.souma2.重火[3].target:
                // data.souma2.isFire = true;
                res = output.火4();
                break;
              case data.souma2.诱风[0].target:
                res = output.风1();
                break;
              case data.souma2.诱风[1].target:
                res = output.风2();
                break;
              case data.souma2.诱风[2].target:
                res = output.风3();
                break;
              case data.souma2.诱风[3].target:
                res = output.风4();
                break;
              default:
                return;
                break;
            }
          } else if (data.souma2.重火.length === 2) {
            // if (data.souma2.isFire) {
            // console.warn(deepClone(data.souma2.重火1bak), deepClone(data.souma2.重火));
            const fireOld4 = deepClone(data.souma2.重火1bak);
            const fireNew2 = deepClone(data.souma2.重火);
            const index = fireOld4.map((v) => (fireNew2.find((n) => n.target === v.target) ? 1 : 0)).join("");
            switch (index) {
              // case "0011":
              // case "1100":
              case "1100":
              case "1010":
              case "0101":
              case "0011":
                res = "上下";
                break;
              case "1001":
              case "0110":
                res = "左右";
                break;
              default:
                console.error("index", index);
                break;
              // }
            }
          }
          data.souma2.重火.length = 0;
          data.souma2.诱风.length = 0;
          if (res) return res;
        },
        outputStrings: {
          火1: { en: "火1：左上 => 等分摊 => 贴贴" },
          火2: { en: "火2：右上 => 等分摊 => 贴贴" },
          火3: { en: "火3：右下 => 等分摊 => 贴贴" },
          火4: { en: "火4：左下 => 等分摊 => 贴贴" },
          风1: { en: "风1：左上 => 等分摊 => 出去" },
          风2: { en: "风2：右上 => 等分摊 => 出去" },
          风3: { en: "风3：右下 => 等分摊 => 出去" },
          风4: { en: "风4：左下 => 等分摊 => 出去" },
        },
      },
      {
        id: "P12S Souma 本体星极偏向灵(白) in 全神",
        type: "GainsEffect",
        netRegex: { effectId: "DF8", capture: true },
        condition: (data, matches) => data.souma2.quanshen && matches.target === data.me,
        infoText: (data, _, output) => output.text(),
        run: (data, _, output) => {
          data.souma2.quanshenLastText = output.text();
          data.souma2.quanshenReported = true;
        },
        outputStrings: {
          text: { en: "踩黑" },
        },
      },
      {
        id: "P12S Souma 本体星极偏向灵(黑) in 全神",
        type: "GainsEffect",
        netRegex: { effectId: "DF9", capture: true },
        condition: (data, matches) => data.souma2.quanshen && matches.target === data.me,
        infoText: (data, _, output) => output.text(),
        run: (data, _, output) => {
          data.souma2.quanshenLastText = output.text();
          data.souma2.quanshenReported = true;
        },
        outputStrings: {
          text: { en: "踩白" },
        },
      },
      {
        id: "P12S Souma 本体星极偏向灵 in 全神",
        type: "GainsEffect",
        netRegex: { effectId: ["DF8", "DF9"], capture: true },
        condition: (data, matches) => data.souma2.quanshen,
        suppressSeconds: 1,
        delaySeconds: 0.2,
        infoText: (data, _, output) => {
          if (data.souma2.quanshenReported) return;
          return data.souma2.quanshenLastText;
        },
        run: (data) => (data.souma2.quanshenReported = false),
      },
      {
        id: "P12S Souma 本体星极偏向灵(白)",
        type: "GainsEffect",
        netRegex: { effectId: "DF8", capture: true },
        // condition: Conditions.targetIsYou(),
        preRun: (data, matches) => {
          data.souma2.white.push({
            id: matches.targetId,
            target: matches.target,
            effect: "星极偏向:灵",
            count: Number(matches.count),
            duration: parseFloat(matches.duration),
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体星极偏向星(黑)",
        type: "GainsEffect",
        netRegex: { effectId: "DF9", capture: true },
        // condition: Conditions.targetIsYou(),
        preRun: (data, matches) => {
          data.souma2.dark.push({
            id: matches.targetId,
            target: matches.target,
            effect: "星极偏向:星",
            count: Number(matches.count),
            duration: matches.duration,
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体 消失因子",
        type: "GainsEffect",
        netRegex: { effectId: "E09", capture: true },
        preRun: (data, matches) => {
          data.souma2.消失因子.push({
            id: matches.targetId,
            target: matches.target,
            effect: "消失因子",
            count: Number(matches.count),
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体 消失因子结算",
        type: "GainsEffect",
        netRegex: { effectId: "E09", capture: true },
        durationSeconds: 12,
        suppressSeconds: 30,
        delaySeconds: 0.2,
        alertText: (data, matches) => {
          // console.warn("data.me", data.me);
          const 优先级 = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"];
          const 消失因子 = deepClone(data.souma2.消失因子).sort((a, b) => 优先级.indexOf(a.rp) - 优先级.indexOf(b.rp));
          const [闲1, 闲2] = data.party.partyNames_
            .filter((v) => !消失因子.find((n) => n.target === v))
            .sort((a, b) => 优先级.indexOf(getRpByName(data, a)) - 优先级.indexOf(getRpByName(data, b)));
          const [单1, 单2] = 消失因子.filter((v) => v.count === 1).map((v) => v.target);
          const [黑1, 黑2] = 消失因子
            .filter((v) => {
              v.dark = data.souma2.dark.find((d) => d.target === v.target);
              return v.count === 2 && v.dark;
            })
            .sort((a, b) => a.dark.duration - b.dark.duration)
            .map((v) => v.target);
          const [白1, 白2] = 消失因子
            .filter((v) => {
              v.white = data.souma2.white.find((d) => d.target === v.target);
              return v.count === 2 && v.white;
            })
            .sort((a, b) => a.white.duration - b.white.duration)
            .map((v) => v.target);
          // console.warn(消失因子);
          // console.warn("单1", 单1);
          // console.warn("单2", 单2);
          // console.warn("黑1", 黑1);
          // console.warn("黑2", 黑2);
          // console.warn("白1", 白1);
          // console.warn("白2", 白2);
          // console.warn("闲1", 闲1);
          // console.warn("闲2", 闲2);
          switch (data.me) {
            case 单1:
              data.souma2.quanshenLastText = "踩同色";
              return "单1：去踩左半场的塔";
            case 单2:
              data.souma2.quanshenLastText = "踩同色";
              return "单2：去踩右半场的塔";
            case 黑1:
              data.souma2.quanshenLastText = "踩白";
              return "黑1：去踩白塔";
            case 白1:
              data.souma2.quanshenLastText = "踩黑";
              return "白1：去踩黑塔";
            case 黑2:
              data.souma2.quanshenLastText = "踩白";
              return "黑2：白半场等待 => 第2个开始踩白塔";
            case 白2:
              data.souma2.quanshenLastText = "踩黑";
              return "白2：黑半场等待 => 第2个开始踩黑塔";
            case 闲1:
              data.souma2.quanshenLastText = "踩第1波塔反色的塔";
              data.souma2.quanshenIsIdle = true;
              return "闲1：左半场等待 => 踩与第1波塔反色的塔";
            case 闲2:
              data.souma2.quanshenIsIdle = true;
              data.souma2.quanshenLastText = "踩第1波塔反色的塔";
              return "闲2：右半场等待 => 踩与第1波塔反色的塔";
            default:
              return;
              break;
          }
        },
      },
      {
        id: "P12S Souma 全神",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        run: (data) => (data.souma2.quanshen = true),
      },
      {
        id: "P12S Souma 全神2",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        delaySeconds: 25,
        run: (data) => (data.souma2.quanshen = false),
      },
      {
        id: "P12S Souma 全神3",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        delaySeconds: 20.5,
        response: (data) => {
          if (data.souma2.quanshenIsIdle) return { alertText: "截线" };
          return { infoText: "去南边" };
        },
      },
      {
        id: "P12S Souma 触手圆着",
        type: "StartsUsing",
        netRegex: { id: "832A", capture: true },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "月环" },
        },
      },
      {
        id: "P12S Souma 触手竖着",
        type: "StartsUsing",
        netRegex: { id: "8329", capture: true },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "竖" },
        },
      },
      {
        id: "P12S Souma 触手横着",
        type: "StartsUsing",
        netRegex: { id: "832B", capture: true },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "横" },
        },
      },
      {
        id: "P12S Hua 引导扇形",
        type: "StartsUsing",
        netRegex: { id: "8323", capture: false },
        infoText: (data, _, output) => {
          return output.text();
        },
        outputStrings: {
          text: { en: "引导扇形" },
        },
      },

      {
        id: "P12S Hua 引导扇形2",
        type: "StartsUsing",
        netRegex: { id: "8323", capture: false },
        delaySeconds: 4.8,
        response: Responses.moveAway(),
      },
    ],
  });
}
