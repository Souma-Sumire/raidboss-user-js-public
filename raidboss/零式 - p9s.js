if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  // 因牵扯到变量作用域入侵，所以是在主库的基础上进行修改/新增的，大部分非原创。
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
  const limitCutPlayerActive = [
    // These ordered nested arrays contain the limit cut headmarkers for [ dash order, tower soak order ]
    [2, 6],
    [4, 8],
    [6, 2],
    [8, 4],
  ];

  // Time between headmarker and defamation for Chimeric Succession.
  const chimericLimitCutTime = {
    1: 10,
    2: 13,
    3: 16,
    4: 19,
  };
  const firstHeadmarker = parseInt(headmarkers.dualityOfDeath, 16);
  const getHeadmarkerId = (data, matches) => {
    if (data.souma.decOffset === undefined) data.souma.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
    return (parseInt(matches.id, 16) - data.souma.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };

  const centerX = 100;
  const centerY = 100;

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
  const { getLBByName, deepClone } = Util.souma;
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheNinthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
    initData: () => {
      return {
        souma: {
          decOffset: undefined,
          rockCounter: 0,
          dualityBuster: [],
          levinOrbs: {},
          limitCutDash: 0,
          limitCut1Count: 0,
          defamationCount: 0,
          rockArr: [],
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
        id: "P9S Souma 古代地裂劲 你是猪1",
        type: "CombatantMemory",
        netRegex: {
          id: "40[0-9A-F]{6}",
          pair: [{ key: "CastBuffID", value: "33121" }],
          change: "Change",
          capture: true,
        },
        preRun: (data, matches) => data.souma.rockArr.push(matches.id),
        delaySeconds: 5,
        run: (data) => {
          data.souma.rockArr.length = 0;
        },
      },
      {
        id: "P9S Souma 古代地裂劲 你是猪2",
        type: "CombatantMemory",
        netRegex: {
          id: "40[0-9A-F]{6}",
          pair: [{ key: "CastBuffID", value: "33121" }],
          change: "Change",
          capture: false,
        },
        delaySeconds: 0.5,
        suppressSeconds: 30,
        promise: async (data, _matches, output) => {
          data.souma.rockCounter++;
          if (data.souma.rockArr.length === 8) {
            const combatants = (await callOverlayHandler({ call: "getCombatants", ids: data.souma.rockArr.map((v) => parseInt(v, 16)) })).combatants;
            console.debug(data.souma.rockCounter, combatants);
            const arr = combatants.map(({ ID: id, PosX: x, PosY: y }) => ({ id, x, y }));
            const safe = rockbreakpos.filter((r) => !arr.some((a) => Math.abs(a.x - r.x) <= 0.2 && Math.abs(a.y - r.y) <= 0.2));
            if (safe.length !== 4) {
              console.error(safe);
            }
            if (data.souma.rockCounter === 1) {
              data.souma.rockSafe1 = deepClone(safe);
            }
            if (data.souma.rockCounter === 2) {
              const c = (await callOverlayHandler({ call: "getCombatants", names: [data.me] })).combatants;
              const myPos = { x: c[0].PosX, y: c[0].PosY };
              const x = Math.min(100, myPos.x) + Math.abs(myPos.x - 100) * 0.8;
              const y = Math.min(100, myPos.y) + Math.abs(myPos.y - 100) * 0.8;
              const safe2 = safe.filter(v => v.num >= 9);
              const step1 = safe2.reduce((prev, curr) => {
                const prevDist = calculateDistance(x, y, prev.x, prev.y);
                const currDist = calculateDistance(x, y, curr.x, curr.y);
                return prevDist < currDist ? prev : curr;
              });
              const danger = rockbreakpos.filter((v) => !safe2.find((s) => s.num === v.num));
              const step2 = danger.reduce((prev, curr) => {
                const prevDist = calculateDistance(x, y, prev.x, prev.y);
                const currDist = calculateDistance(x, y, curr.x, curr.y);
                return prevDist < currDist ? prev : curr;
              });
              data.souma.rockInfoText = output.text({ step1: output[step1.num](), step2: output[step2.num]() });
            }
          } else {
            console.error("怎么事？", deepClone(data.souma.rockArr));
          }
        },
        infoText: (data) => data.souma.rockInfoText,
        run: (data) => {
          delete data.souma.rockInfoText;
        },
        outputStrings: {
          text: { en: "${step1} => ${step2}" },
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
        id: "P9S Souma 第一次前后脚",
        comment: { cn: "假设BOSS面向A。不确定100%能报，有待更多测试。" },
        type: "StartsUsing",
        netRegex: { id: ["8167", "8168", "8169", "816A"], capture: true },
        suppressSeconds: 9999,
        infoText: (data, matches, output) => {
          const behindSafe = ["8167", "8168"].includes(matches.id); // 后
          const outerSafe = ["8167", "8169"].includes(matches.id); // 远
          const farOrNear = behindSafe ? (v) => v.y > 100 : (v) => v.y < 100;
          const insideOrOutside = outerSafe ? (v) => v.num <= 8 : (v) => v.num >= 9;
          const safe = data.souma.rockSafe1.filter(farOrNear).find(insideOrOutside);
          if (!safe) {
            console.error(deepClone(data.souma.rockSafe1));
          }
          let next;
          if (outerSafe) {
            // 钢铁 => 月环
            const danger = rockbreakpos.filter((r) => !data.souma.rockSafe1.find((s) => s.num === r.num));
            const innerDanger = danger.filter((v) => v.num >= 9);
            const nextInner = innerDanger.find(farOrNear);
            next = nextInner.num;
          } else {
            // 月环 => 钢铁
            next = behindSafe ? "5" : "1"; // 实际上任意就近正点均可 高手近战可去左右打身位，这里只报AC
          }
          return output.text({ step1: output[safe.num](), step2: output[next]() });
        },
        run: (data) => (data.souma.rockSafe1.length = 0),
        outputStrings: {
          text: { en: "${step1} => ${step2}" },
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
        id: "P9S Chimeric Succession",
        type: "StartsUsing",
        netRegex: { id: "81BB", capture: false },
        run: (data) => (data.souma.seenChimericSuccession = true),
      },
      {
        id: "P9S Limit Cut Levin Orb Collect",
        type: "AddedCombatant",
        netRegex: { name: "Ball of Levin", level: "5A" },
        run: (data, matches) => {
          const orb8Dir = Directions.addedCombatantPosTo8Dir(matches, centerX, centerY);
          data.souma.levinOrbs[matches.id] = { dir: orb8Dir };
        },
      },
      {
        id: "P9S Limit Cut Levin Orb Order Collect",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          return limitCutMarkers.includes(getHeadmarkerId(data, matches)) && Object.keys(data.souma.levinOrbs).includes(matches.targetId);
        },
        run: (data, matches) => {
          const correctedMatch = getHeadmarkerId(data, matches);
          const orbLimitCutNumber = limitCutNumberMap[correctedMatch];

          // Levin orbs should always receive a odd-numbered limit cut headmarker
          const expectedOrbLimitCutNumbers = [1, 3, 5, 7];
          if (orbLimitCutNumber === undefined || !expectedOrbLimitCutNumbers.includes(orbLimitCutNumber)) {
            console.error("Invalid limit cut headmarker on orb");
            return;
          }

          const orbData = data.souma.levinOrbs[matches.targetId] ?? {};
          if (typeof orbData.dir === "undefined") {
            console.error("Limit cut headmarker on unknown orb");
            return;
          }
          orbData.order = orbLimitCutNumber;
          data.souma.levinOrbs[matches.targetId] = orbData;
        },
      },
      {
        id: "P9S Limit Cut Levin Orb Start and Rotation",
        type: "StartsUsing",
        netRegex: { id: "817D", capture: false },
        delaySeconds: 1.5,
        infoText: (data, _matches, output) => {
          let firstOrb8Dir;
          let secondOrb8Dir;
          for (const combatant in data.souma.levinOrbs) {
            switch (data.souma.levinOrbs[combatant]?.order) {
              case 1:
                firstOrb8Dir = data.souma.levinOrbs[combatant]?.dir;
                break;
              case 3:
                secondOrb8Dir = data.souma.levinOrbs[combatant]?.dir;
                break;
            }
          }
          if (firstOrb8Dir === undefined || secondOrb8Dir === undefined) return;
          const firstOrb8DirStr = Directions.outputFrom8DirNum(firstOrb8Dir);
          if (firstOrb8DirStr === undefined) return;
          const firstOrbDir = output[firstOrb8DirStr]();

          const rotationDir = (secondOrb8Dir - firstOrb8Dir + 8) % 8 === 2 ? output.clockwise() : output.counterclock();

          if (firstOrbDir !== undefined && rotationDir !== undefined) return output.text({ dir: firstOrbDir, rotation: rotationDir });
          return;
        },
        outputStrings: {
          text: {
            en: "${dir} => ${rotation}",
          },
          clockwise: Outputs.clockwise,
          counterclock: Outputs.counterclockwise,
          ...Directions.outputStrings8Dir,
        },
      },
      {
        id: "P9S Limit Cut 1 Player Number",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          return !data.souma.seenChimericSuccession && limitCutMarkers.includes(getHeadmarkerId(data, matches));
        },
        preRun: (data, matches) => {
          data.souma.limitCut1Count++;
          if (data.me === matches.target) {
            const correctedMatch = getHeadmarkerId(data, matches);
            data.souma.limitCutNumber = limitCutNumberMap[correctedMatch];
          }
        },
        durationSeconds: 30,
        infoText: (data, matches, output) => {
          if (data.me !== matches.target) return;
          const expectedLimitCutNumbers = [2, 4, 6, 8];
          if (data.souma.limitCutNumber === undefined || !expectedLimitCutNumbers.includes(data.souma.limitCutNumber)) return;
          return output[data.souma.limitCutNumber]();
        },
        outputStrings: {
          2: {
            en: "2麻 1火3塔",
          },
          4: {
            en: "4麻 2火4塔",
          },
          6: {
            en: "6麻 1塔3火",
          },
          8: {
            en: "8麻 2塔4火",
          },
          tts: {
            en: "${num}",
          },
        },
      },
      {
        id: "P9S Limit Cut 1 Early Defamation",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          return data.souma.limitCut1Count === 4 && !data.souma.seenChimericSuccession && limitCutMarkers.includes(getHeadmarkerId(data, matches));
        },
        infoText: (data, _matches, output) => {
          if (data.souma.limitCutNumber !== undefined) return;
          return output.defamationLater();
        },
        outputStrings: {
          defamationLater: {
            en: "蓝球组",
          },
        },
      },
      {
        id: "P9S Chimeric Limit Cut Defamation",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          return (
            data.souma.seenChimericSuccession &&
            data.me === matches.target &&
            data.souma.limitCutNumber !== undefined &&
            limitCutMarkers.includes(getHeadmarkerId(data, matches))
          );
        },
        delaySeconds: (data) => {
          if (data.souma.limitCutNumber === undefined) return 0;
          const time = chimericLimitCutTime[data.souma.limitCutNumber];
          if (time === undefined) return 0;
          // 6 seconds ahead of time
          return time - 6;
        },
        alarmText: (_data, _matches, output) => output.defamation(),
        outputStrings: {
          defamation: {
            en: "蓝球点名",
          },
        },
      },
      {
        id: "P9S Limit Cut First Dash/Tower Combo",
        type: "Ability",
        netRegex: { id: "817D", capture: false },
        condition: (data) => data.souma.limitCutDash === 0,
        alertText: (data, _matches, output) => {
          const activePlayers = limitCutPlayerActive[data.souma.limitCutDash];
          if (activePlayers === undefined) return;
          const [dashPlayer, soakPlayer] = activePlayers;
          if (dashPlayer === undefined || soakPlayer === undefined) return;
          if (data.souma.limitCutNumber === dashPlayer) return output.dash();
          else if (data.souma.limitCutNumber === soakPlayer) return output.soak();
          return;
        },
        outputStrings: {
          dash: {
            en: "放火",
          },
          soak: {
            en: "踩塔",
          },
        },
      },
      {
        id: "P9S Limit Cut Combo Tracker",
        type: "Ability",
        netRegex: { id: "8180", capture: false },
        run: (data) => data.souma.limitCutDash++,
      },
      {
        id: "P9S Limit Cut Later Dash/Tower Combo",
        type: "Ability",
        netRegex: { id: "8180", capture: false },
        condition: (data) => data.souma.limitCutDash > 0 && data.souma.limitCutDash < 4,
        delaySeconds: (data) => {
          return limitCutPlayerActive[data.souma.limitCutDash]?.[1] === data.souma.limitCutNumber ? 1 : 0;
        },
        alertText: (data, _matches, output) => {
          const [dashPlayer, soakPlayer] = limitCutPlayerActive[data.souma.limitCutDash] ?? [];
          if (dashPlayer === undefined || soakPlayer === undefined) return;
          if (data.souma.limitCutNumber === dashPlayer) return output.dash();
          else if (data.souma.limitCutNumber === soakPlayer) return output.soak();
          return;
        },
        outputStrings: {
          dash: {
            en: "放火",
          },
          soak: {
            en: "踩塔",
          },
        },
      },
      {
        id: "P9S Limit Cut 1 Defamation",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          if (getHeadmarkerId(data, matches) === headmarkers.defamation) {
            data.souma.defamationCount++;
            return data.me === matches.target;
          }
          return false;
        },
        alarmText: (data, _matches, output) => output.defamation({ num: data.souma.defamationCount }),
        outputStrings: {
          defamation: {
            en: "蓝球点名(#${num})",
          },
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
          return data.souma.seenChimericSuccession && data.me === matches.target && limitCutMarkers.includes(getHeadmarkerId(data, matches));
        },
        preRun: (data, matches) => {
          const correctedMatch = getHeadmarkerId(data, matches);
          data.souma.limitCutNumber = limitCutNumberMap[correctedMatch];
        },
        durationSeconds: 20,
        infoText: (data, _matches, output) => {
          const expectedLimitCutNumbers = [1, 2, 3, 4];
          if (data.souma.limitCutNumber === undefined || !expectedLimitCutNumbers.includes(data.souma.limitCutNumber)) return;
          return output["number" + data.souma.limitCutNumber]();
        },
        outputStrings: {
          number1: { en: "1麻 引导 => 回北" },
          number2: { en: "2麻 引导 => 回北" },
          number3: { en: "3麻 等待 => 与1交换" },
          number4: { en: "4麻 等待 => 与2交换" },
        },
      },
    ],
    timelineReplace: [
      {
        locale: "ja",
        missingTranslations: true,
        replaceSync: {
          "Ball of Levin": "雷球",
        },
      },
      {
        locale: "cn",
        missingTranslations: true,
        replaceSync: {
          "Ball of Levin": "雷球",
        },
      },
    ],
  });
}
