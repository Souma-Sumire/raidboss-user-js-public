if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const headmarkers = {
    dualityOfDeath: "01D4",
    limitCut1: "004F",
    limitCut2: "0050",
    limitCut3: "0051",
    limitCut4: "0052",
    limitCut5: "0053",
    limitCut6: "0054",
    limitCut7: "0055",
    limitCut8: "0056",
    defamation: "014A",
    cometMarker: "01B3",
  };
  const limitCutMarkers = [
    headmarkers.limitCut1,
    headmarkers.limitCut2,
    headmarkers.limitCut3,
    headmarkers.limitCut4,
    headmarkers.limitCut5,
    headmarkers.limitCut6,
    headmarkers.limitCut7,
    headmarkers.limitCut8,
  ];
  const limitCutNumberMap = {
    "004F": 1,
    "0050": 2,
    "0051": 3,
    "0052": 4,
    "0053": 5,
    "0054": 6,
    "0055": 7,
    "0056": 8,
  };
  const firstHeadmarker = parseInt(headmarkers.dualityOfDeath, 16);
  const getHeadmarkerId = (data, matches) => {
    if (data.decOffset === undefined) data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
    return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const rockbreakpos = [
    { num: 1, x: "100.0", y: "83.0" }, //A
    { num: 2, x: "112.0208", y: "87.9792" }, //2
    { num: 3, x: "117.0", y: "100.0" }, //B
    { num: 4, x: "112.0208", y: "112.0208" }, //3
    { num: 5, x: "100.0", y: "117.0" }, //C
    { num: 6, x: "87.9792", y: "112.0208" }, //4
    { num: 7, x: "83.0", y: "100.0" }, //D
    { num: 8, x: "87.9792", y: "87.9792" }, //1
    { num: 9, x: "103.0615", y: "92.609" }, //A2
    { num: 10, x: "107.391", y: "103.0615" }, //B3
    { num: 11, x: "96.9385", y: "107.391" }, //C4
    { num: 12, x: "92.609", y: "96.9385" }, //D1
  ];
  const calculateDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const { getLBByName } = Util.souma;
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheNinthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
    initData: () => {
      return {
        souma: {
          decOffset: undefined,
          stage: 1,
          rockbreaker: [],
          rockbreakerCounter: 0,
          archaicRockbreakerCounter: 0,
          combination: undefined,
          roundhouse: undefined,
        },
      };
    },
    triggers: [
      { id: "P9S Front Inside Combination", disabled: true },
      { id: "P9S Front Outside Combination", disabled: true },
      { id: "P9S Rear Inside Roundhouse", disabled: true },
      { id: "P9S Rear Outside Roundhouse", disabled: true },
      { id: "P9S Roundhouse Followup", disabled: true },
      {
        id: "P9S Souma 连转脚前后",
        comment: { cn: "BOSS面向A" },
        type: "StartsUsing",
        netRegex: { id: ["8167", "8168", "8169", "816A", "815F"], capture: true },
        preRun: (data, matches) => {
          if (matches.id === "815F") data.souma.archaicRockbreakerCounter++;
        },
        durationSeconds: (data) => (data.souma.archaicRockbreakerCounter === 1 ? 12 : 5),
        delaySeconds: (data, matches) => (matches.id === "815F" && data.souma.archaicRockbreakerCounter === 2 ? 8 : 0),
        promise: async (data, matches) => {
          if (matches.id === "815F" && data.souma.archaicRockbreakerCounter === 2) {
            data.souma.combatants = (await callOverlayHandler({ call: "getCombatants" })).combatants.find((v) => v.Name === data.me);
          }
        },
        alertText: (data, matches, output) => {
          if (data.souma.archaicRockbreakerCounter === 1 && data.souma.rockbreakerSafe1) {
            // 第一次古代地裂劲
            // "8167": "远+后",
            // "8168": "近+后",
            // "8169": "远+前",
            // "816A": "近+前",
            const behindSafe = ["8167", "8168"].includes(matches.id); // 后
            const outerSafe = ["8167", "8169"].includes(matches.id); // 远
            const farOrNear = behindSafe ? (v) => v.y > 100 : (v) => v.y < 100;
            const insideOrOutside = outerSafe ? (v) => v.num <= 8 : (v) => v.num >= 9;
            const safe4 = data.souma.rockbreakerSafe1;
            const safe2 = safe4.filter(farOrNear);
            const safe = safe2.find(insideOrOutside);
            let next;
            if (outerSafe) {
              // 钢铁 => 月环
              const danger = rockbreakpos.filter((r) => !safe4.find((s) => s.num === r.num));
              const innerDanger = danger.filter((v) => v.num >= 9);
              const nextInner = innerDanger.find(farOrNear);
              next = nextInner.num;
            } else {
              // 月环 => 钢铁
              next = behindSafe ? "5" : "1"; // 实际上任意就近正点均可 高手近战可去左右打身位，这里只报AC
            }
            return output.text({ step1: output[safe.num](), step2: output[next]() });
          } else if (data.souma.archaicRockbreakerCounter === 2 && data.souma.rockbreakerSafe2) {
            // 第二次古代地裂劲 取最近
            const myPos = { x: data.souma.combatants.PosX, y: data.souma.combatants.PosY };
            const closestPoint = data.souma.rockbreakerSafe2.reduce((prev, curr) => {
              const prevDist = calculateDistance(myPos.x, myPos.y, prev.x, prev.y);
              const currDist = calculateDistance(myPos.x, myPos.y, curr.x, curr.y);
              return prevDist < currDist ? prev : curr;
            });
            // console.log(structuredClone(closestPoint), structuredClone(data.souma.rockbreakerSafe2), data.me, myPos);
            return output.text2({ text: output[closestPoint.num]() });
          }
        },
        outputStrings: {
          text: { en: "${step1} => ${step2}" },
          text2: { en: "${text} => 就近躲避" },
          1: { en: "上+远离" },
          2: { en: "右上+远离" },
          3: { en: "右+远离" },
          4: { en: "右下+远离" },
          5: { en: "下+远离" },
          6: { en: "左下+远离" },
          7: { en: "左+远离" },
          8: { en: "左上+远离" },
          9: { en: "靠近+上偏右" },
          10: { en: "靠近+右偏下" },
          11: { en: "靠近+下偏左" },
          12: { en: "靠近+左偏上" },
        },
      },
      {
        id: "P9S Souma 古代地裂劲",
        type: "CombatantMemory",
        netRegex: {
          id: "40[0-9A-F]{6}",
          pair: [{ key: "Heading", value: "0.0000" }],
          change: "Change",
          capture: true,
        },
        preRun: (data, matches) => {
          if (rockbreakpos.find((r) => Math.abs(matches.pairPosX - r.x) <= 0.2 && Math.abs(matches.pairPosY - r.y) <= 0.2)) {
            data.souma.rockbreaker.push(matches);
          }
          if (data.souma.rockbreaker.length === 8) {
            data.souma.rockbreakerCounter++;
            const arr = data.souma.rockbreaker.map((v) => ({ x: v.pairPosX, y: v.pairPosY }));
            const safe = rockbreakpos.filter((r) => !arr.some((a) => Math.abs(a.x - r.x) <= 0.2 && Math.abs(a.y - r.y) <= 0.2));
            if (safe.length !== 4) throw `第${data.souma.rockbreakerCounter}轮安全点找到不是4个`;
            if (data.souma.rockbreakerCounter === 1) {
              data.souma.rockbreakerSafe1 = safe;
            } else if (data.souma.rockbreakerCounter === 2) {
              data.souma.rockbreakerSafe2 = safe;
            }
          }
        },
        delaySeconds: 1,
        run: (data) => {
          data.souma.rockbreaker.length = 0;
        },
      },
      {
        id: "P9S Souma 二麻",
        type: "StartsUsing",
        netRegex: { id: "81BB", capture: false },
        infoText: (data, _matches, output) => (["tank", "melee"].includes(getLBByName(data, data.me)) ? output.melee() : output.caster()),
        outputStrings: {
          melee: { en: "靠近BOSS" },
          caster: { en: "远离BOSS" },
        },
      },
      {
        id: "P9S Chimeric Limit Cut Player Number",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          return data.seenChimericSuccession && data.me === matches.target && limitCutMarkers.includes(getHeadmarkerId(data, matches));
        },
        preRun: (data, matches) => {
          const correctedMatch = getHeadmarkerId(data, matches);
          data.limitCutNumber = limitCutNumberMap[correctedMatch];
        },
        durationSeconds: 20,
        infoText: (data, _matches, output) => {
          const expectedLimitCutNumbers = [1, 2, 3, 4];
          if (data.limitCutNumber === undefined || !expectedLimitCutNumbers.includes(data.limitCutNumber)) return;
          return output["number" + data.limitCutNumber]();
        },
        outputStrings: {
          number1: { en: "1麻 引导 => 回北" },
          number2: { en: "2麻 引导 => 回北" },
          number3: { en: "3麻 北侧待机 => 与1交换" },
          number4: { en: "4麻 北侧待机 => 与2交换" },
        },
      },
    ],
    timelineReplace: [
      {
        locale: "cn",
        missingTranslations: true,
        replaceText: {
          "Aero IV": "飙风",
          "Archaic Demolish": "古代破碎拳",
          "Archaic Rockbreaker": "古代地烈劲",
          "Ascendant Fist": "穿升拳",
          "Beastly Bile": "野兽咬",
          "Beastly Fury": "野兽之怒",
          "Blizzard III": "冰封",
          "Burst": "飞散",
          "Charybdis": "大漩涡",
          "Chimeric Succession": "嵌合连击",
          "Comet": "彗星",
          "Disgorge": "灵魂逆转",
          "Disintegration": "解体",
          "Duality of Death": "灰飞烟灭",
          "Dualspell": "双重咏唱",
          "Ecliptic Meteor": "黄道陨石",
          "Fire IV": "炽炎",
          "Fire(?!( |m|s))": "火炎",
          "Firemeld": "炎魔冲",
          "Front Combination": "前方连转脚",
          "Front Firestrikes": "前方炎连击",
          "Gluttony's Augur": "暴食的预兆",
          "Icemeld": "冰魔冲",
          "Inside Roundhouse": "内转脚",
          "Levinstrike Summoning": "召唤闪电",
          "Outside Roundhouse": "外转脚",
          "Pile Pyre": "堆火",
          "Pyremeld": "重炎击",
          "Ravening": "噬魂者",
          "Rear Combination": "后方连转脚",
          "Rear Firestrikes": "后方炎连击",
          "Scrambled Succession": "连锁突击",
          "Shock(?!wave)": "放电",
          "Shockwave": "冲击波",
          "Soul Surge": "灵魂涌动",
          "Swinging Kick": "旋身击",
          "Thunder III": "暴雷",
          "Thunder(?!( |bolt))": "闪雷",
          "Thunderbolt": "霹雳",
          "Two Minds": "缠魂双击",
        },
      },
    ],
  });
  Options.PerTriggerOptions = {
    // 让1麻念全部提示文字而不是仅仅是序号
    "P9S Limit Cut 1 Player Number": {
      TTSText: function (data, matches, output) {
        if (data.me !== matches.target || data.limitCutNumber === undefined) return;
        return output[data.limitCutNumber]();
      },
    },
  };
}
