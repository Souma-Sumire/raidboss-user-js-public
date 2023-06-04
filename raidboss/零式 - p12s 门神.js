if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  let decOffset = undefined;
  const headmarkers = {
    tankbuster: "0265",
    下起左上: "023D",
    下起左下: "0237",
    下起右上: "023E",
    下起右下: "0238",
    上起左上: "0233",
    上起左下: "023F",
    上起右上: "0234",
    上起右下: "0240",
    左中: "0235",
    右中: "0236",
    mj1: "01DE",
    mj2: "01DF",
    mj3: "01E0",
    mj4: "01E1",
    mj5: "0243",
    mj6: "0244",
    mj7: "0245",
    mj8: "0246",
  };
  const initHeadmarkerId = (matches) => {
    decOffset = parseInt(matches.id, 16) - parseInt("0265", 16);
  };
  const getHeadmarkerId = (matches) => {
    return (parseInt(matches.id, 16) - decOffset).toString(16).toUpperCase().padStart(4, "0");
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
  function nearestMark(obj) {
    const standardWaymark = {
      "A": { X: 100, Y: 0, Z: 91.6 },
      "B": { X: 108.4, Y: 0, Z: 100 },
      "C": { X: 100, Y: 0, Z: 108.4 },
      "D": { X: 91.6, Y: 0, Z: 100 },
      "1点": { X: 91.6, Y: 0, Z: 91.6 },
      "2点": { X: 108.4, Y: 0, Z: 91.6 },
      "3点": { X: 108.4, Y: 0, Z: 108.4 },
      "4点": { X: 91.6, Y: 0, Z: 108.4 },
      "场中": { X: 100, Y: 0, Z: 100 },
    };
    let closerMark = "A";
    let closerDis = 1000;
    for (const mark in standardWaymark) {
      const markInfo = standardWaymark[mark];
      const distance = calculateDistance(markInfo.X, markInfo.Z, Number(obj.x), Number(obj.y));
      // console.warn(markInfo.X, markInfo.Z, obj.x, obj.y, distance, mark);
      if (distance < closerDis) {
        closerMark = mark;
        closerDis = distance;
      }
    }
    obj.closerMark = closerMark;
  }
  function getType(obj) {
    switch (obj.npcBaseId) {
      case "16176":
        obj.type = "球";
        break;
      case "16177":
        obj.type = "钢铁";
        break;
      case "16180":
        obj.type = "二二";
        break;
      case "16178":
        obj.type = "月环";
        break;
      case "16179":
        obj.type = "八方";
        break;
      default:
        break;
    }
  }
  function calculateDistance(x1, y1, x2, y2) {
    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  }
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTwelfthCircleSavageAll",
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        id: "P12S 清空defOffset",
        regex: /^.{14} 01:|の攻略を開始した。|任务开始。| has begun\./,
        run: (data, matches) => {
          // console.warn("01");
          decOffset = undefined;
        },
      },
    ],
  });
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTwelfthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
    config: [
      {
        id: "麻将标点",
        name: { en: "麻将标点" },
        type: "select",
        options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
        default: "关",
      },
      {
        id: "分身冲安全点标点",
        name: { en: "分身冲安全点标点" },
        type: "checkbox",
        default: false,
      },
      {
        id: "光暗塔标禁止",
        name: { en: "光暗塔标禁止" },
        type: "checkbox",
        default: false,
      },
    ],
    initData: () => {
      // console.warn("----------------------------------------");
      if (!location.href.includes("raidemulator.html")) {
        // console.warn("团灭");
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
        souma: {
          phase: 1,
          effects: [],
          fanshi: 0,
          majiang: [],
          chibang: [],
          buster: 0,
          chaolian: [],
          majiangAbility: 0,
          jiguangAbility: 0,
          chaolianing: false,
          prohibitStubbornness: false,

          fenshens: [],
          chaolianbuff: [],
          // hua

          anthropos: [],
          anthroposData: [],
          anthroposLastTimeStamp: "",
          darkTetherCollect: {},
          lightTetherCollect: {},
          fanshiActive: 0,
          paradeigma2TetherRecord: {},
          //
        },
      };
    },
    triggers: [
      // {
      //   id: "P12S Souma Effect 收集",
      //   type: "GainsEffect",
      //   netRegex: { capture: true },
      //   // condition: Conditions.targetIsYou(),
      //   preRun: (data, matches, output) => data.souma.effects.push(matches),
      // },

      {
        id: "P12S Souma 连线g",
        type: "Tether",
        netRegex: { id: ["00E9", "00FA"], capture: true },
        suppressSeconds: 20,
        condition: Conditions.targetIsYou(),
        durationSeconds: 15,
        alertText: (data, _, output) => {
          if (data.souma.phase === 2 && data.role === "dps") {
            if (data.souma.p1towerbuff === "guang") return "光 => 引导激光";
            if (data.souma.p1towerbuff === "an") return "光 => 躲避 => 踩塔(左原地右场中)";
          }
          return output.text();
        },
        outputStrings: { text: { en: "光线" } },
      },
      {
        id: "P12S Souma 连线a",
        type: "Tether",
        netRegex: { id: ["00EA", "00FB"], capture: true },
        suppressSeconds: 20,
        condition: Conditions.targetIsYou(),
        durationSeconds: 15,
        alertText: (data, _, output) => {
          if (data.souma.phase === 2 && data.role === "dps") {
            if (data.souma.p1towerbuff === "an") return "暗 => 引导激光";
            if (data.souma.p1towerbuff === "guang") return "暗 => 躲避 => 踩塔(左原地右场中)";
          }
          return output.text();
        },
        outputStrings: { text: { en: "暗线" } },
      },
      {
        id: "P12S Souma 连线ga",
        type: "Tether",
        netRegex: { id: ["00EA", "00FB", "00E9", "00FA"], capture: false },
        suppressSeconds: 20,
        delaySeconds: 15,
        run: (data) => (data.souma.phase = 3),
      },
      {
        id: "P12S Souma 第一次超链BUFF收集",
        type: "GainsEffect",
        netRegex: {
          effectId: [
            "DFA", // 大圈
            "DF9", // 暗buff
            "DF8", // 光buff
            "DFD", // 光直线
            "DFE", // 暗直线
            "DFB", // 光塔
            "DFC", // 暗塔
          ],
          capture: true,
        },
        condition: (data) => data.souma.chaolianing && data.souma.chaolianPhase === 1,
        preRun: (data, matches) => {
          data.souma.chaolianbuff.push(matches);
        },
        run: (data, matches) => {
          if (data.triggerSetConfig.光暗塔标禁止) {
            if (matches.effectId === "DFB") mark(matches.targetId, "stop1");
            if (matches.effectId === "DFC") mark(matches.targetId, "stop2");
          }
        },
        // condition: Conditions.targetIsYou(),
        // suppressSeconds: 30,
        // durationSeconds: 12,
        // infoText: (data, matches, output) => {},
      },
      {
        id: "P12S Souma 第一次超链BUFF",
        type: "GainsEffect",
        netRegex: {
          effectId: [
            "DFA", // 大圈
            "DF9", // 暗buff
            "DF8", // 光buff
            "DFD", // 光直线
            "DFE", // 暗直线
            "DFB", // 光塔
            "DFC", // 暗塔
          ],
          capture: true,
        },
        condition: (data) => data.souma.chaolianing && data.souma.chaolianPhase === 1,
        suppressSeconds: 30,
        durationSeconds: 20,
        delaySeconds: 0.5,
        response: (data, matches, output) => {
          const effectMap = {
            DFA: "大圈",
            DF9: "暗buff",
            DF8: "光buff",
            DFD: "光直线",
            DFE: "暗直线",
            DFB: "光塔",
            DFC: "暗塔",
          };
          const myBuffs = data.souma.chaolianbuff
            .filter((v) => v.target === data.me)
            .map((v) => {
              return { ...v, effect: effectMap[v.effectId] };
            })
            .sort((a, b) => parseInt(a.effectId, 16) - parseInt(b.effectId, 16));
          const key = myBuffs.map((v) => v.effect).join("_");
          const result = output[key]();
          // doTextCommand(`/e ${result}`);
          return { infoText: result, tts: result.replace(/\(去.\)/, "") };
        },
        run: (data) => (data.souma.chaolianbuff.length = 0),
        outputStrings: {
          光buff_大圈: { en: "光大圈(左)" },
          暗buff_大圈: { en: "暗大圈(右)" },
          光塔: { en: "光塔(左)" },
          暗塔: { en: "暗塔(右)" },
          光直线: { en: "光直线(右)" },
          暗直线: { en: "暗直线(左)" },
        },
      },
      {
        id: "P12S Souma 灵临印记",
        type: "GainsEffect",
        netRegex: { effectId: "DFB", capture: true },
        condition: Conditions.targetIsYou(),
        durationSeconds: 12,
        response: (data, matches, output) => {
          // console.debug(data.souma.fanshi, "灵临印记");
          // console.warn(matches.timestamp, data.souma.chaolianing);
          if (data.souma.phase === 2 && !data.souma.chaolianing && !data.souma.prohibitStubbornness) return { infoText: "找暗线对面" };
          if (!data.souma.chaolianing && !data.souma.prohibitStubbornness) return { infoText: output.fanshi2(), tts: null };
        },
        // tts: null,
        outputStrings: { fanshi2: { en: "光" } },
      },
      {
        id: "P12S Souma 星临印记",
        type: "GainsEffect",
        netRegex: { effectId: "DFC", capture: true },
        condition: Conditions.targetIsYou(),
        durationSeconds: 12,
        response: (data, matches, output) => {
          // console.debug(data.souma.fanshi, "星临印记");
          // if (data.souma.fanshi === 2)
          // console.warn(matches.timestamp, data.souma.chaolianing);
          if (data.souma.phase === 2 && !data.souma.chaolianing && !data.souma.prohibitStubbornness) return { infoText: "找光线对面" };
          if (!data.souma.chaolianing && !data.souma.prohibitStubbornness) return { infoText: output.fanshi2(), tts: null };
        },
        // tts: null,
        outputStrings: { fanshi2: { en: "暗" } },
      },
      {
        id: "P12S Souma 范式计数",
        type: "StartsUsing",
        netRegex: { id: "82ED" },
        preRun: (data, matches) => {
          data.souma.fanshi++;
          // console.debug("范式", data.souma.fanshi);
        },
      },
      // {
      //   id: "P12S Souma Anthropos Collect", // 分身
      //   type: "AddedCombatant",
      //   netRegex: { npcNameId: "12378", npcBaseId: "16172" },
      //   run: (data, matches) => data.souma.fenshens.push(matches),
      // },
      // {
      //   id: "P12S Souma 范式1",
      //   type: "StartsUsing",
      //   netRegex: { id: "82ED" },
      //   suppressSeconds: 999,
      //   condition: (data) => data.souma.fanshi === 1,
      //   delaySeconds: 10,
      //   // promise: async (data, matches) => {
      //   //   const combatants = (await callOverlayHandler({ call: "getCombatants" })).combatants;
      //   //   const fenshen = combatants.filter((v) => v.BNpcID === 16172 && v.BNpcNameID === 12378);
      //   //   console.warn("范式1", matches.timestamp, fenshen);
      //   // },
      //   infoText: (data, _, output) => {
      //     console.warn(data.souma.fenshens);
      //   },
      // },
      {
        id: "P12S Souma 分身",
        type: "StartsUsing",
        netRegex: { id: "82EE", capture: true },
        suppressSeconds: 1,
        infoText: (data, matches, output) => {
          // console.warn(matches);
          const col = Math.abs(Number(matches.x) - 105) < 1 || Math.abs(Number(matches.x) - 85) < 1 ? "二四" : "一三";
          const offset = col === "一三" ? 0 : 10;
          const waymark = {
            A: { X: 85.0 + offset, Y: 0.0, Z: 85.0, Active: true },
            B: { X: 85.0 + offset, Y: 0.0, Z: 95.0, Active: true },
            C: { X: 85.0 + offset, Y: 0.0, Z: 105.0, Active: true },
            D: { X: 85.0 + offset, Y: 0.0, Z: 115.0, Active: true },
            One: { X: 105.0 + offset, Y: 0.0, Z: 85.0, Active: true },
            Two: { X: 105.0 + offset, Y: 0.0, Z: 95.0, Active: true },
            Three: { X: 105.0 + offset, Y: 0.0, Z: 105.0, Active: true },
            Four: { X: 105.0 + offset, Y: 0.0, Z: 115.0, Active: true },
          };
          if (data.triggerSetConfig.分身冲安全点标点)
            doQueueActions(
              [
                { c: "qid", p: "P12S Souma Public Queue Mark", d: 0 },
                { c: "DoWaymarks", p: waymark, d: 0 },
                { c: "DoWaymarks", p: "load", d: 5000 },
              ],
              "P12S 分身",
            );
          return col + "安全";
        },
      },
      {
        id: "P12S Souma 论灵魂",
        type: "StartsUsing",
        netRegex: { id: "8304", capture: false },
        response: Responses.aoe(),
      },
      {
        id: "P12S Souma 阶段控制 魂之刻印",
        type: "StartsUsing",
        netRegex: { id: "8305", capture: false },
        run: (data, matches) => (data.souma.phase = 2),
      },
      {
        id: "P12S Souma 阶段控制 明眸",
        type: "StartsUsing",
        netRegex: { id: "82F5", capture: false },
        run: (data, matches) => data.souma.buster++,
      },
      {
        id: "P12S Souma 一运暗buff",
        type: "GainsEffect",
        netRegex: { effectId: "DFC", capture: false },
        suppressSeconds: 10,
        condition: (data) => data.souma.phase === 2,
        run: (data) => (data.souma.p1towerbuff = "an"),
      },
      {
        id: "P12S Souma 一运光buff",
        type: "GainsEffect",
        netRegex: { effectId: "DFB", capture: false },
        suppressSeconds: 10,
        condition: (data) => data.souma.phase === 2,
        run: (data) => (data.souma.p1towerbuff = "guang"),
      },
      {
        id: "P12S Souma 对话A",
        type: "StartsUsing",
        netRegex: { id: "82FE", capture: false },
        alertText: (data, _, output) => {
          if (data.role === "tank") return output.tank();
          return output.text();
        },
        outputStrings: {
          tank: { en: "最远距离" },
          text: { en: "靠近BOSS" },
        },
      },
      {
        id: "P12S Souma 对话P",
        type: "StartsUsing",
        netRegex: { id: "82FF", capture: false },
        alertText: (data, _, output) => {
          if (data.role === "tank") return output.tank();
          return output.text();
        },
        outputStrings: {
          tank: { en: "去脚下" },
          text: { en: "最远距离" },
        },
      },
      {
        id: "P12S Souma Headmarker Tracker 死刑初始化",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => decOffset === undefined && data.souma.fanshi === 2,
        run: (data, matches) => {
          initHeadmarkerId(matches);
        },
      },
      {
        id: "P12S Souma Headmarker 收集1",
        type: "HeadMarker",
        netRegex: {},
        condition: () => decOffset !== undefined,
        durationSeconds: 1,
        infoText: (data, matches) => {
          const id = getHeadmarkerId(matches);
          let re;
          switch (id) {
            case headmarkers.下起左上:
              data.souma.chibang.push({ time: matches.timestamp, 起: "下", 打: "左", 去: "右", 翅膀: "上", origin: "下起左上" });
              return "右";
            case headmarkers.下起左下:
              data.souma.chibang.push({ time: matches.timestamp, 起: "下", 打: "左", 去: "右", 翅膀: "下", origin: "下起左下" });
              return "右";
            case headmarkers.上起左上:
              data.souma.chibang.push({ time: matches.timestamp, 起: "上", 打: "左", 去: "右", 翅膀: "上", origin: "上起左上" });
              return "右";
            case headmarkers.上起左下:
              data.souma.chibang.push({ time: matches.timestamp, 起: "上", 打: "左", 去: "右", 翅膀: "下", origin: "上起左下" });
              return "右";
            case headmarkers.下起右上:
              data.souma.chibang.push({ time: matches.timestamp, 起: "下", 打: "右", 去: "左", 翅膀: "上", origin: "下起右上" });
              return "左";
            case headmarkers.下起右下:
              data.souma.chibang.push({ time: matches.timestamp, 起: "下", 打: "右", 去: "左", 翅膀: "下", origin: "下起右下" });
              return "左";
            case headmarkers.上起右上:
              data.souma.chibang.push({ time: matches.timestamp, 起: "上", 打: "右", 去: "左", 翅膀: "上", origin: "上起右上" });
              return "左";
            case headmarkers.上起右下:
              data.souma.chibang.push({ time: matches.timestamp, 起: "上", 打: "右", 去: "左", 翅膀: "下", origin: "上起右下" });
              return "左";
            case headmarkers.左中:
              re = data.souma.chibang[0].起 === "下";
              data.souma.chibang.push({ time: matches.timestamp, 起: re ? "下" : "上", 打: "左", 去: re ? "左" : "右", 翅膀: "中", origin: "左中" });
              return re ? "左" : "右";
            case headmarkers.右中:
              re = data.souma.chibang[0].起 === "下";
              data.souma.chibang.push({ time: matches.timestamp, 起: re ? "下" : "上", 打: "右", 去: re ? "右" : "左", 翅膀: "中", origin: "右中" });
              return re ? "右" : "左";
            case headmarkers.mj1:
              data.souma.majiang.push({ mj: 1, matches });
              break;
            case headmarkers.mj2:
              data.souma.majiang.push({ mj: 2, matches });
              break;
            case headmarkers.mj3:
              data.souma.majiang.push({ mj: 3, matches });
              break;
            case headmarkers.mj4:
              data.souma.majiang.push({ mj: 4, matches });
              break;
            case headmarkers.mj5:
              data.souma.majiang.push({ mj: 5, matches });
              break;
            case headmarkers.mj6:
              data.souma.majiang.push({ mj: 6, matches });
              break;
            case headmarkers.mj7:
              data.souma.majiang.push({ mj: 7, matches });
              break;
            case headmarkers.mj8:
              data.souma.majiang.push({ mj: 8, matches });
              break;
            case headmarkers.tankbuster:
              // 死刑
              break;
            default:
              console.error(id);
              break;
          }
        },
      },
      {
        id: "P12S Souma Headmarker 结算",
        type: "HeadMarker",
        netRegex: {},
        delaySeconds: 0.3,
        suppressSeconds: 0.1,
        condition: () => decOffset !== undefined,
        durationSeconds: 18,
        response: (data, matches, output) => {
          // console.warn(deepClone(data.souma.chibang));
          if (data.souma.majiang.length === 8) {
            const arr = deepClone(data.souma.majiang).sort((a, b) => a.mj - b.mj);
            data.souma._mj = deepClone(arr);
            const isMark = ["开", "本地"].includes(data.triggerSetConfig.麻将标点);
            // console.warn(arr);
            if (isMark) {
              const local = data.triggerSetConfig.麻将标点 === "本地";
              mark(parseInt(arr[0].matches.targetId, 16), "attack1", local);
              mark(parseInt(arr[1].matches.targetId, 16), "attack2", local);
              mark(parseInt(arr[2].matches.targetId, 16), "attack3", local);
              mark(parseInt(arr[3].matches.targetId, 16), "attack4", local);
              mark(parseInt(arr[4].matches.targetId, 16), "attack5", local);
              mark(parseInt(arr[5].matches.targetId, 16), "attack6", local);
              mark(parseInt(arr[6].matches.targetId, 16), "attack7", local);
              mark(parseInt(arr[7].matches.targetId, 16), "attack8", local);
            }
            const myMJ = arr.find((v) => v.matches.target === data.me);
            if (myMJ) {
              data.souma.majiang.length = 0;
              console.warn(myMJ, arr);
              return { alarmText: output["mj" + myMJ.mj](), tts: myMJ.mj };
            }
            data.souma.majiang.length = 0;
          } else if (data.souma.chibang.length === 3) {
            const chibang = deepClone(data.souma.chibang);
            data.souma.chibang.length = 0;
            const result = chibang.map((v) => v.去).join("");
            // console.warn("结算翅膀", result, chibang);
            return { alertText: result };
          }
        },
        outputStrings: {
          mj1: { en: "1麻：下分摊2次 => 顺转 => 3喷(偏左)" },
          mj2: { en: "2麻：上散 => 分摊2次 => 顺转 => 4喷(偏左)" },
          mj3: { en: "3麻：下分摊2次 => 顺转 => 3喷(偏右)" },
          mj4: { en: "4麻：上散 => 分摊2次 => 顺转 => 4喷(偏右)" },
          mj5: { en: "5麻：左 + 1喷(偏左) => 等3冲 => 分摊2次" },
          mj6: { en: "6麻：右等 => 2喷(偏左) => 等4冲 => 分摊2次" },
          mj7: { en: "7麻：左 + 1喷(偏右) => 等3冲 => 分摊2次" },
          mj8: { en: "8麻：右等 => 2喷(偏右) => 等4冲 => 分摊2次" },
        },
      },
      {
        id: "P12S Souma 超链",
        type: "AddedCombatant",
        netRegex: { npcBaseId: [16176, 16177, 16178, 16179, 16180] },
        preRun: (data, matches) => {
          data.souma.chaolian.push(matches);
        },
      },
      {
        id: "P12S Souma 超链判定",
        type: "AddedCombatant",
        suppressSeconds: 1,
        delaySeconds: (data) => data.souma.chaolianDelay,
        condition: (data) => data.souma.chaolianPhase < 2,
        netRegex: { npcBaseId: [16176, 16177, 16178, 16179, 16180] },
        durationSeconds: 5,
        infoText: (data, matches, output) => {
          // console.warn(matches.timestamp, data.souma.chaolianing);
          const chaolian = deepClone(data.souma.chaolian).sort((a, b) => parseInt(a.id, 16) - parseInt(b.id, 16));
          if (data.souma.chaolianPhase === 1) {
            if (data.souma.chaolian1Step === 1) data.souma.chaolianDelay = 3;
            else if (data.souma.chaolian1Step === 2) data.souma.chaolianDelay = 7.5;
            data.souma.chaolian1Step++;
          }
          // console.warn(data.souma.chaolianDelay);
          data.souma.chaolian.length = 0;
          // console.warn(chaolian);
          const 球s = chaolian.filter((v) => v.npcBaseId === "16176");
          // console.warn(matches.timestamp, balls);
          for (const ball of 球s) nearestMark(ball);
          // console.warn("球", balls);
          if (球s.length === 1) {
            const 球 = 球s[0];
            const 钢铁 = chaolian.find((v) => v.npcBaseId === "16177");
            const 月环 = chaolian.find((v) => v.npcBaseId === "16178");
            const 八方 = chaolian.find((v) => v.npcBaseId === "16179");
            const 二二 = chaolian.find((v) => v.npcBaseId === "16180");
            // console.warn(matches.timestamp, 球, 钢铁, 月环, 八方, 二二);
            if (钢铁 && 二二) return output.text({ mark: "", gimmick: "钢铁 + 二二分摊" });
            else if (钢铁 && 八方) return output.text({ mark: "", gimmick: "钢铁 + 八方" });
            else if (月环 && 二二) return output.text({ mark: "", gimmick: "月环 + 二二分摊" });
            else if (月环 && 八方) return output.text({ mark: "", gimmick: "月环 + 八方" });
            else if (月环 && 钢铁) {
              钢铁.距离球 = calculateDistance(钢铁.x, 钢铁.y, 球.x, 球.y);
              月环.距离球 = calculateDistance(月环.x, 月环.y, 球.x, 球.y);
              if (钢铁.距离球 < 月环.距离球) return output.text({ mark: "", gimmick: " 先钢铁" });
              else return output.text({ mark: "", gimmick: " 先月环" });
            } else {
              console.error("未知情况", 球s, chaolian);
            }
          } else if (球s.length === 2) {
            const ballArr = chaolian.filter((v, i) => {
              if (v.npcBaseId === "16176") {
                v.bro = chaolian[i - 1];
                return true;
              }
              return false;
            });
            const other = chaolian.filter((v) => {
              return !ballArr.find((b) => b.id === v.id) && !ballArr.find((b) => b.bro.id === v.id);
            });
            if (other.length === 0) {
              const yuehuanBall = 球s.find((v) => v.bro.npcBaseId === "16178");
              if (yuehuanBall) return;
              // return output.text({ mark: yuehuanBall.closerMark, gimmick: "月环" });
              const ererBall = 球s.find((v) => v.bro.npcBaseId === "16180");
              if (ererBall) return output.text({ mark: "", gimmick: "二二" });
              // return output.text({ mark: ererBall.closerMark, gimmick: "二二" });
              const bafangBall = 球s.find((v) => v.bro.npcBaseId === "16179");
              if (bafangBall) return output.text({ mark: "", gimmick: "八方" });
              // return output.text({ mark: bafangBall.closerMark, gimmick: "八方" });
            }
            for (const item of chaolian) nearestMark(item);
            for (const item of chaolian) getType(item);
            console.error("other", matches.timestamp, chaolian, other);
          } else if (球s.length === 3) {
            // const ballArr = chaolian.filter((v, i) => {
            //   if (v.npcBaseId === "16176") {
            //     v.bro = chaolian[i - 1];
            //     return true;
            //   }
            //   return false;
            // });
            // for (const item of chaolian) nearestMark(item);
            // for (const item of chaolian) getType(item);
            // const other = chaolian.filter((v) => {
            //   return !ballArr.find((b) => b.id === v.id) && !ballArr.find((b) => b.bro.id === v.id);
            // });
            // console.warn("balls>3", matches.timestamp, 球s);
            // console.warn(chaolian);
            // console.error("球s", 球s);
            // const 钢铁s = chaolian.filter((v) => v.npcBaseId === "16177");
            // console.error("钢铁s", 钢铁s);
            // const 月环s = chaolian.filter((v) => v.npcBaseId === "16178");
            // console.error("月环s", 月环s);
            // const 八方s = chaolian.filter((v) => v.npcBaseId === "16179");
            // console.error("八方s", 八方s);
            // const 二二s = chaolian.filter((v) => v.npcBaseId === "16180");
            // console.error("二二s", 二二s);
            // let last;
            // if (ballArr[2].bro.type === "钢铁") {
            //   const reverseMark = {
            //     A: "C",
            //     C: "A",
            //   };
            //   const other = chaolian
            //     .filter((v) => {
            //       return !ballArr.find((b) => b.id === v.id) && !ballArr.find((b) => b.bro.id === v.id);
            //     })
            //     .sort((a, b) => a.y - b.y);
            //   const newMark = reverseMark[ballArr[2].closerMark];
            //   let lastGimmick;
            //   // console.warn(newMark,other);
            //   if (newMark === "A") lastGimmick = other[other.length - 1];
            //   else lastGimmick = other[0];
            //   last = newMark + lastGimmick.type;
            // } else {
            //   last = ballArr[2].closerMark + ballArr[2].bro.type;
            // }
            // console.warn(ballArr, last);
            // const lasttype
            // const result = ballArr[0].closerMark + "二二 => 场中月环 => " + last;
            // console.warn(result);
            // return result;
          }
        },
        outputStrings: {
          text: { en: "${mark}${gimmick}" },
        },
      },
      {
        id: "P12S Souma 超级连锁理论I",
        type: "StartsUsing",
        netRegex: { id: "82DA", capture: false },
        // infoText: "超链1",
        run: (data) => {
          data.souma.prohibitStubbornness = true;
          data.souma.chaolianPhase = 1;
          data.souma.chaolianDelay = 0.5;
          data.souma.chaolian1Step = 1;
          data.souma.chaolianing = true;
        },
      },
      {
        id: "P12S Souma 超级连锁理论IIA",
        type: "StartsUsing",
        netRegex: { id: "86FA", capture: false },
        infoText: "半场二二=>月环=>找二二或八方",
        tts: null,
        run: (data) => {
          data.souma.chaolianPhase = 2;
          data.souma.chaolianDelay = 0.5;
          data.souma.chaolian1Step = 1;
          data.souma.chaolianing = true;
        },
      },
      {
        id: "P12S Souma 超级连锁理论IIB",
        type: "StartsUsing",
        netRegex: { id: "86FB", capture: false },
        durationSeconds: 20,
        infoText: (data, _, output) => {
          return output.text();
        },
        tts: null,
        outputStrings: {
          text: { en: "找内侧月环=>直线+两侧机制+躲分身=>找八方+钢铁" },
        },
        // infoText: "超链2B",
        run: (data) => {
          data.souma.chaolianPhase = 3;
          data.souma.chaolianDelay = 0.5;
          data.souma.chaolian1Step = 1;
          data.souma.chaolianing = true;
        },
      },
      {
        id: "P12S Souma 超级连锁理论IIA后",
        type: "StartsUsing",
        netRegex: { id: "82DA", capture: false },
        delaySeconds: 35,
        run: (data) => {
          data.souma.chaolianPhase = undefined;
          data.souma.chaolianDelay = 0.5;
          data.souma.chaolian1Step = 1;
          data.souma.chaolianing = true;
        },
      },
      {
        id: "P12S Souma 超级连锁理论I后",
        type: "StartsUsing",
        netRegex: { id: "82DA", capture: false },
        delaySeconds: 35,
        run: (data) => {
          data.souma.chaolianPhase = undefined;
          data.souma.chaolianDelay = 0.5;
          data.souma.chaolian1Step = 1;
          data.souma.chaolianing = false;
        },
      },
      {
        id: "P12S Souma 门神麻将冲锋计数",
        type: "Ability",
        netRegex: { id: "82F6", capture: false },
        suppressSeconds: 0.5,
        durationSeconds: 1,
        preRun: (data) => data.souma.majiangAbility++,
        response: (data) => {
          return {
            infoText: data.souma.majiangAbility + "冲",
            tts: null,
          };
        },
      },
      {
        id: "P12S Souma 门神麻将引导激光计数",
        type: "Ability",
        netRegex: { id: "82F0", capture: false },
        condition: (data) => data.souma?._mj?.length >= 4,
        suppressSeconds: 0.5,
        response: (data) => {
          data.souma.jiguangAbility++;
          let res;
          const myMJ = data.souma._mj.find((v) => v.matches.target === data.me);
          const mjPov = myMJ.mj;
          switch (data.souma.jiguangAbility) {
            case 1:
              res = mjPov === 6 || mjPov === 8 ? { alertText: "去引导" } : { tts: "六八" };
              break;
            case 2:
              res = mjPov === 1 || mjPov === 3 ? { alertText: "去引导" } : { tts: "一三" };
              break;
            case 3:
              res = mjPov === 2 || mjPov === 4 ? { alertText: "去引导" } : { tts: "二四" };
              break;
            default:
              return;
          }
          return res;
        },
      },
      {
        id: "P12S Souma 处女",
        type: "StartsUsing",
        netRegex: { id: "8303", capture: false },
        infoText: "去两侧",
      },

      {
        id: "P12S hua Paradeigma 3 Tower Plus Alert", // 报十字
        type: "GainsEffect",
        netRegex: { effectId: "DFF", capture: true },
        condition: (data, matches) => data.me == matches.target && data.souma.fanshi == 3 && data.souma.fanshiActive == 1,
        delaySeconds: 1,
        durationSeconds: 6,
        infoText: (data, _, output) => {
          return output.text({});
        },
        outputStrings: {
          text: { en: "十字" },
        },
      },

      {
        id: "P12S hua Paradeigma 3 Tower Cross Alert", // 报叉字
        type: "GainsEffect",
        netRegex: { effectId: "E00", capture: true },
        condition: (data, matches) => data.me == matches.target && data.souma.fanshi == 3 && data.souma.fanshiActive == 1,
        delaySeconds: 1,
        durationSeconds: 6,
        infoText: (data, _, output) => {
          return output.text({});
        },
        outputStrings: {
          text: { en: "叉字" },
        },
      },
    ],
  });
}
