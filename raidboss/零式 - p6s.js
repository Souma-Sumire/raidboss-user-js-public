// 说明：必须同时加载"souma拓展运行库.js" 
if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const startsUsingStrings = {
    // "7860": { en: "AoE" }, //半神冥暗
    // "788A": { en: "分摊死刑" }, //螯合协同
    // "7866": { en: "Aetheric Polyominoid" }, //多元以太
    "7891": { en: "治疗分摊组" }, //黑暗神圣
    "7869": { en: "水波" }, //界外劈砍
    // "7864": { en: "麻将" }, //软体细胞流
    // "784D": { en: "Aetherial Exchange" }, //以太变换
    // "786C": { en: "Exchange of Agonies" }, //苦痛交换
    "7887": { en: "双死刑" }, //协同
    // "7861": { en: "Transmission" }, //寄生 蛇看场外翅膀看场内
    // "7868": { en: "Polyominoid Sigma" }, //多元以太∑
    // "788B": { en: "引导黄圈" }, //暗天顶
    "788D": { en: "X字分散" }, //黑暗之烬
    // "7876": { en: "_rsv_30838" }, //恶病质
    // "7878": { en: "双击" }, //双重捕食
    // "787C": { en: "_rsv_30844" }, //翅目寄生
    "788F": { en: "黑白格散开" }, //黑暗球
    "7881": { en: "先去左右" }, //完全寄生 7881+7885+79EC 打前后  7881+7885打前后 79EC
    "7883": { en: "先去前后" }, //完全寄生 7883打左右
  };
  const leftWaymarks = {
    A: { X: 95, Y: 0, Z: 88, Active: true },
    B: { X: 88, Y: 0, Z: 95, Active: true },
    C: { X: 88, Y: 0, Z: 105, Active: true },
    D: { X: 95, Y: 0, Z: 112, Active: true },
    One: { X: 96.9, Y: 0, Z: 93, Active: true },
    Two: { X: 93, Y: 0, Z: 97, Active: true },
    Three: { X: 93, Y: 0, Z: 103, Active: true },
    Four: { X: 96.9, Y: 0, Z: 107, Active: true },
  };
  const rightWaymarks = {
    A: { X: 105, Y: 0, Z: 88, Active: true },
    B: { X: 112, Y: 0, Z: 95, Active: true },
    C: { X: 112, Y: 0, Z: 105, Active: true },
    D: { X: 105, Y: 0, Z: 112, Active: true },
    One: { X: 103.1, Y: 0, Z: 93, Active: true },
    Two: { X: 107, Y: 0, Z: 97, Active: true },
    Three: { X: 107, Y: 0, Z: 103, Active: true },
    Four: { X: 103.1, Y: 0, Z: 107, Active: true },
  };
  const firstMarker = "01D1"; //双奶分摊
  const getHeadmarkerId = (data, matches, firstHeadmarker) => {
    if (!data.soumaDecOffset && firstHeadmarker) data.soumaDecOffset = parseInt(matches.id, 16) - firstHeadmarker;
    return (parseInt(matches.id, 16) - data.soumaDecOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const headMakersStrings = {
    "00E2": { en: "1号1号" }, //麻将1
    "00E3": { en: "2号2号" }, //麻将2
    "00E4": { en: "3号3号" }, //麻将3
    "00E5": { en: "4号4号" }, //麻将4
    "00E6": { en: "5号5号" }, //麻将5
    "00E7": { en: "6号6号" }, //麻将6
    "00E8": { en: "7号7号" }, //麻将7
    "00E9": { en: "8号8号" }, //麻将8
    "00F8": { en: "散开" }, //通用黄圈分散
    "01DB": { en: "散开" }, //通用大红圈分散
  };
  const headMakersStrings2 = {
    "01F6": { en: "分摊" }, //单分摊
    "01F7": { en: "大圈" }, //单大圈
    "01F8": { en: "大圈" }, //分摊连大圈
    "01FA": { en: "分摊" }, //大圈连分摊
    "01FB": { en: "月环" }, //大圈连月环
    "01FD": { en: "大圈" }, //月环连大圈
    "0201": { en: "月环" }, //单月环
  };
  class Status {
    constructor(matches) {
      for (const key in matches) this[key] = matches[key];
    }
  }
  const isRaidEmulator = location.href.includes("raidemulator.html");
  function mark(actorID, markType, localOnly) {
    if (isRaidEmulator) {
      console.log(actorID, markType);
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "mark",
        p: JSON.stringify({ ActorID: parseInt(actorID, 16), MarkType: markType, localOnly: localOnly }),
      });
    }
  }
  function doTextCommand(text) {
    if (isRaidEmulator) console.log(text);
    else callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
  }
  function clearMark() {
    doTextCommand("/mk off <1>");
    doTextCommand("/mk off <2>");
    doTextCommand("/mk off <3>");
    doTextCommand("/mk off <4>");
    doTextCommand("/mk off <5>");
    doTextCommand("/mk off <6>");
    doTextCommand("/mk off <7>");
    doTextCommand("/mk off <8>");
  }
  Options.Triggers.push({
    zoneId: ZoneId.AbyssosTheSixthCircleSavage,
    id: "SoumaAbyssosTheSixthCircleSavage",
    config: [
      {
        id: "恶病质标点",
        name: { en: "恶病质标点" },
        type: "select",
        options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
        default: "关",
      },
    ],
    initData: () => {
      if (!isRaidEmulator) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P6S Souma Public Queue Mark", d: 0 },
            { c: "DoWaymarks", p: "load", d: 100 },
          ]),
        });
      }
      return {
        pathogenicCellsCounter: 0,
        aetheronecrosisDuration: 0,
        predationCount: 0,
        soumaDecOffset: undefined,
        soumaP6SEffectsArr: {
          CF7: [],
          CF8: [],
          CF9: [],
        },
        souma极苦交换: 0,
        souma极苦交换第二次收集: {},
      };
    },
    timelineReplace: [
      {
        locale: "cn",
        missingTranslations: true,
        replaceSync: {
          Hegemone: "[^:]+",
          Parasitos: "[^:]+",
        },
        replaceText: {
          "Aetherial Exchange": "以太变换",
          "Aetheric Polyominoid": "多元以太",
          "Aetheronecrosis": "魔活细胞",
          "Cachexia": "恶病质",
          "Chelic Claw": "爪击",
          "Choros Ixou": "完全寄生",
          "Dark Ashes": "黑暗之烬",
          "Dark Dome": "暗天顶",
          "Dark Sphere": "黑暗球",
          "Dual Predation": "甲软双击",
          "Exchange Of Agonies": "苦痛交换",
          "Exocleaver": "界外劈砍",
          "Hemitheos's Dark IV": "半神冥暗",
          "Pathogenic Cells": "软体细胞流",
          "Polyominoid Sigma": "多元以太Σ",
          "Polyominous Dark IV": "多元冥暗",
          "Ptera Ixou": "翅目寄生",
          "Reek Havoc": "喷气",
          "Synergy": "协同",
          "Transmission": "寄生",
          "Unholy Darkness": "黑暗神圣",
        },
      },
    ],
    triggers: [
      {
        id: "P6S Pathogenic Cells Counter",
        netRegex: NetRegexes.ability({ id: "7865", capture: false }),
        preRun: (data, _matches) => data.pathogenicCellsCounter++,
        suppressSeconds: 1,
        sound: "",
        infoText: (data, _matches, output) => output.text({ num: data.pathogenicCellsCounter }),
        tts: null,
        outputStrings: {
          text: {
            en: "${num}",
          },
        },
      },
      {
        id: "P6S Predation Debuff Collect",
        netRegex: NetRegexes.gainsEffect({ effectId: ["CF7", "CF8"] }),
        condition: Conditions.targetIsYou(),
        run: (data, matches) => (data.predationDebuff = matches.effectId),
      },
      {
        id: "P6S Exocleaver Healer Groups",
        netRegex: NetRegexes.startsUsing({ id: ["7869", "786B"], capture: false }),
        disabled: true,
      },
      {
        id: "P6S Pathogenic Cells Numbers",
        netRegex: NetRegexes.headMarker({}),
        disabled: true,
      },
      {
        id: "P6S Choros Ixou Sides",
        netRegex: NetRegexes.startsUsing({ id: "7881", capture: false }),
        disabled: true,
      },
      {
        id: "P6S Synergy",
        netRegex: NetRegexes.startsUsing({ id: "7887", capture: false }),
        disabled: true,
      },
      {
        id: "P6S Choros Ixou Front Back",
        netRegex: NetRegexes.startsUsing({ id: "7883", capture: false }),
        disabled: true,
      },
      { id: "P6S Exchange of Agonies Markers", netRegex: NetRegexes.headMarker({}), disabled: true },
      {
        id: "P6S Predation Bait Order",
        netRegex: NetRegexes.gainsEffect({ effectId: "CF9" }),
        condition: Conditions.targetIsYou(),
        preRun: (data, matches) => (data.aetheronecrosisDuration = parseFloat(matches.duration)),
        delaySeconds: 0.1,
        durationSeconds: (_data, matches) => {
          const duration = parseFloat(matches.duration);
          return duration > 16 ? duration - 3.8 : duration + 12.3;
        },
        infoText: (data, matches, output) => {
          const duration = parseFloat(matches.duration);
          const dir = data.predationDebuff === "CF7" ? output.left() : output.right();
          let numBait;
          if (duration <= 8) {
            numBait = output.secondBait();
          } else if (duration <= 12) {
            numBait = output.thirdBait();
          } else if (duration <= 16) {
            numBait = output.fourthBait();
          } else {
            numBait = output.firstBait();
          }
          return output.text({ dir: dir, bait: numBait });
        },
        outputStrings: {
          text: {
            en: "${dir}, ${bait}",
          },
          left: {
            en: "左左左",
          },
          right: {
            en: "右右右",
          },
          firstBait: {
            en: "第一轮引导(20秒)",
          },
          secondBait: {
            en: "第二轮引导(8秒)",
          },
          thirdBait: {
            en: "第三轮引导(12秒)",
          },
          fourthBait: {
            en: "第四轮引导(16秒)",
          },
        },
      },
      {
        id: "P6S Predation In First Bait Reminder",
        netRegex: NetRegexes.startsUsing({ id: "7878" }),
        condition: (data) => data.aetheronecrosisDuration > 16,
        delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
        infoText: (_data, _matches, output) => output.inFirstBait(),
        outputStrings: {
          inFirstBait: {
            en: "去引导 (第一次)",
          },
        },
      },
      {
        id: "P6S Predation In Bait Reminder",
        netRegex: NetRegexes.ability({ id: ["787A", "787B"], capture: false }),
        durationSeconds: 4,
        suppressSeconds: 1,
        infoText: (data, _matches, output) => {
          data.predationCount = data.predationCount + 1;
          let countMap;
          if (data.aetheronecrosisDuration <= 8) {
            countMap = 1;
          } else if (data.aetheronecrosisDuration <= 12) {
            countMap = 2;
          } else if (data.aetheronecrosisDuration <= 16) {
            countMap = 3;
          } else {
            countMap = 0;
          }
          if (countMap === data.predationCount) {
            const inBaitMap = {
              1: output.inSecondBait(),
              2: output.inThirdBait(),
              3: output.inFourthBait(),
            };
            return inBaitMap[data.predationCount];
          }
        },
        outputStrings: {
          inSecondBait: {
            en: "去引导 (第二次)",
          },
          inThirdBait: {
            en: "去引导 (第三次)",
          },
          inFourthBait: {
            en: "去引导 (第四次)",
          },
        },
      },
      {
        id: "P6S Ptera Ixou",
        netRegex: NetRegexes.startsUsing({ id: "787C", capture: false }),
        infoText: (data, _matches, output) => (data.predationDebuff === "CF7" ? output.left() : output.right()),
        outputStrings: {
          left: {
            en: "左左左",
          },
          right: {
            en: "右右右",
          },
        },
      },
      {
        id: "Souma P6S Headmarker Tracker",
        netRegex: NetRegexes.headMarker({}),
        condition: (data) => undefined === data.soumaDecOffset,
        run: (data, matches) => {
          const firstHeadmarker = parseInt(firstMarker, 16);
          getHeadmarkerId(data, matches, firstHeadmarker);
        },
      },
      {
        id: "Souma P6S Headmarker Entrance",
        netRegex: NetRegexes.headMarker({}),
        condition: (data, matches) => undefined !== data.soumaDecOffset && data.me === matches.target && !!headMakersStrings[getHeadmarkerId(data, matches)],
        infoText: (data, matches, output) => output[getHeadmarkerId(data, matches)](),
        outputStrings: headMakersStrings,
      },
      {
        id: "Souma P6S Headmarker 极苦交换第二次无点名",
        netRegex: NetRegexes.headMarker({}),
        condition: (data, matches) => data.souma极苦交换 === 2 && undefined !== data.soumaDecOffset && !!headMakersStrings2[getHeadmarkerId(data, matches)],
        delaySeconds: 0.5,
        durationSeconds: 7,
        suppressSeconds: 1,
        infoText: (data, _matches, output) => {
          const rp = data.soumaFL.getRpByName(data, data.me);
          if (data.souma极苦交换第二次收集[rp] === undefined) {
            const role = data.role === "dps" ? "dps" : "tn";
            return output["极苦2无点名" + role]();
          }
        },
        outputStrings: {
          极苦2无点名tn: { en: "左上3点（参与分摊）" },
          极苦2无点名dps: { en: "右下4点（参与分摊）" },
        },
      },
      {
        id: "Souma P6S Headmarker 极苦交换",
        netRegex: NetRegexes.headMarker({}),
        condition: (data, matches) => undefined !== data.soumaDecOffset && !!headMakersStrings2[getHeadmarkerId(data, matches)],
        durationSeconds: 7,
        infoText: (data, matches, output) => {
          const marker = getHeadmarkerId(data, matches);
          const rp = data.soumaFL.getRpByName(data, matches.target);
          const gimmick = headMakersStrings2[marker].en;
          const index = data.souma极苦交换 === 1 || data.souma极苦交换 === 3 ? 13 : 2;
          if (data.souma极苦交换 === 2) data.souma极苦交换第二次收集[rp] = headMakersStrings2[marker];
          if (data.me === matches.target) {
            return output["极苦" + index + gimmick + rp]();
          }
        },
        outputStrings: {
          极苦13分摊MT: { en: "左上3点（分摊）" },
          极苦13分摊ST: { en: "左上3点（分摊）" },
          极苦13分摊H1: { en: "左上3点（分摊）" },
          极苦13分摊H2: { en: "左上3点（分摊）" },
          极苦13分摊D1: { en: "右下4点（分摊）" },
          极苦13分摊D2: { en: "右下4点（分摊）" },
          极苦13分摊D3: { en: "右下4点（分摊）" },
          极苦13分摊D4: { en: "右下4点（分摊）" },

          极苦13月环MT: { en: "左上3点（月环）" },
          极苦13月环ST: { en: "左上3点（月环）" },
          极苦13月环H1: { en: "左上3点（月环）" },
          极苦13月环H2: { en: "左上3点（月环）" },
          极苦13月环D1: { en: "右下4点（月环）" },
          极苦13月环D2: { en: "右下4点（月环）" },
          极苦13月环D3: { en: "右下4点（月环）" },
          极苦13月环D4: { en: "右下4点（月环）" },

          极苦13大圈MT: { en: "左上3点（大圈）" },
          极苦13大圈ST: { en: "右上D点（大圈）" },
          极苦13大圈H1: { en: "左上角落（大圈）" },
          极苦13大圈H2: { en: "左下B点（大圈）" },
          极苦13大圈D1: { en: "左下B点（大圈）" },
          极苦13大圈D2: { en: "右下4点（大圈）" },
          极苦13大圈D3: { en: "右下角落（大圈）" },
          极苦13大圈D4: { en: "右上D点（大圈）" },

          极苦2大圈MT: { en: "右上D点（大圈）" },
          极苦2大圈ST: { en: "右上D点（大圈）" },
          极苦2大圈H1: { en: "右上D点（大圈）" },
          极苦2大圈H2: { en: "右上D点（大圈）" },
          极苦2大圈D1: { en: "左下B点（大圈）" },
          极苦2大圈D2: { en: "左下B点（大圈）" },
          极苦2大圈D3: { en: "左下B点（大圈）" },
          极苦2大圈D4: { en: "左下B点（大圈）" },

          极苦2分摊MT: { en: "左上3点（分摊）" },
          极苦2分摊ST: { en: "左上3点（分摊）" },
          极苦2分摊H1: { en: "左上3点（分摊）" },
          极苦2分摊H2: { en: "左上3点（分摊）" },
          极苦2分摊D1: { en: "右下4点（分摊）" },
          极苦2分摊D2: { en: "右下4点（分摊）" },
          极苦2分摊D3: { en: "右下4点（分摊）" },
          极苦2分摊D4: { en: "右下4点（分摊）" },
        },
      },
      {
        id: "Souma P6S Casting 极苦交换计数器",
        netRegex: NetRegexes.startsUsing({ id: "786C", capture: false }),
        run: (data) => data.souma极苦交换++,
      },
      {
        id: "Souma P6S Casting Entrance",
        netRegex: NetRegexes.startsUsing({}),
        condition: (_data, matches) => !!startsUsingStrings[matches.id],
        infoText: (_data, matches, output) => output[matches.id](),
        outputStrings: startsUsingStrings,
      },
      {
        id: "Souma P6S Gains Effects 小可爱寄生",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D48", "CF3"] }),
        condition: Conditions.targetIsYou(),
        // delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2.5,
        durationSeconds: (_data, matches) => parseFloat(matches.duration),
        alertText: (_data, matches, output) => output[matches.effectId](),
        outputStrings: {
          D48: { en: "喷前面" },
          CF3: { en: "喷后面" },
        },
      },
      {
        id: "Souma P6S Gains Effects 恶病质场地标点",
        netRegex: NetRegexes.gainsEffect({ effectId: "CF[78]" }),
        condition: Conditions.targetIsYou(),
        delaySeconds: 1,
        infoText: (data, matches, output) => {
          if (
            data.soumaP6SEffectsArr.CF7.length === 4 &&
            data.soumaP6SEffectsArr.CF8.length === 4 &&
            data.soumaP6SEffectsArr.CF9.length === 8 &&
            (output.恶病质本地场地标点() === "是" ||
              output.恶病质本地场地标点() === "开" ||
              output.恶病质本地场地标点() === "true" ||
              output.恶病质本地场地标点() === "1")
          ) {
            const left = matches.effectId === "CF7";
            data.soumaFL.doQueueActions([
              { c: "qid", p: "P6S Souma Public Queue Mark", d: 0 },
              { c: "DoWaymarks", p: left ? leftWaymarks : rightWaymarks, d: 0 },
              { c: "DoWaymarks", p: "load", d: 30000 },
            ]);
          }
          return "";
        },
        outputStrings: {
          恶病质本地场地标点: { en: "开" },
        },
      },
      {
        id: "Souma P6S 开场保存waymarks",
        type: "StartsUsing",
        netRegex: { id: "7860", capture: false },
        suppressSeconds: 999,
        run: (data) => {
          data.soumaFL.doQueueActions([{ c: "DoWaymarks", p: "save", d: 0 }]);
        },
      },
      {
        id: "Souma P6S Gains Effects 双重捕食",
        netRegex: NetRegexes.gainsEffect({ effectId: "CF[7-9]" }),
        infoText: (data, matches) => {
          if (["开", "本地"].includes(data.triggerSetConfig.恶病质标点)) {
            const localOnly = data.triggerSetConfig.恶病质标点 === "本地";
            data.soumaP6SEffectsArr[matches.effectId].push(new Status(matches));
            //"CF7" 软体抗性下降
            //"CF8" 甲壳抗性下降
            //"CF9" 魔活细胞
            if (data.soumaP6SEffectsArr.CF7.length === 4 && data.soumaP6SEffectsArr.CF8.length === 4 && data.soumaP6SEffectsArr.CF9.length === 8) {
              const arr = [...data.soumaP6SEffectsArr.CF7, ...data.soumaP6SEffectsArr.CF8, ...data.soumaP6SEffectsArr.CF9].reduce((p, c) => {
                if (!p[c.targetId]) p[c.targetId] = [];
                p[c.targetId].push({ effectId: c.effectId, duration: c.duration });
                return p;
              }, {});
              for (const key in arr) {
                const p = arr[key];
                if (p.find((v) => v.effectId === "CF7")) {
                  if (p.find((v) => v.effectId === "CF9" && v.duration === "8.00")) mark(key, "bind1", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "12.00")) mark(key, "bind2", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "16.00")) mark(key, "bind3", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "20.00")) mark(key, "stop1", localOnly);
                } else if (p.find((v) => v.effectId === "CF8")) {
                  if (p.find((v) => v.effectId === "CF9" && v.duration === "8.00")) mark(key, "attack1", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "12.00")) mark(key, "attack2", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "16.00")) mark(key, "attack3", localOnly);
                  else if (p.find((v) => v.effectId === "CF9" && v.duration === "20.00")) mark(key, "stop2", localOnly);
                }
              }
            }
          }
        },
      },
    ],
  });
}
