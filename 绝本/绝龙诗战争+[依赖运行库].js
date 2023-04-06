//说明：必须同时加载"souma拓展运行库.js" 并阅读其内部的说明
//所有用户配置都暴露在Cactbot Config面板中，若非确定且必要，请勿修改源码。
const headmarkers = {
  hyperdimensionalSlash: "00EA",
  firechainCircle: "0119",
  firechainTriangle: "011A",
  firechainSquare: "011B",
  firechainX: "011C",
  skywardTriple: "014A",
  sword1: "0032",
  sword2: "0033",
  meteor: "011D",
  dot1: "013F",
  dot2: "0140",
  dot3: "0141",
  skywardSingle: "000E",
  cauterize: "0014",
};
const direction = {
  N: "上北",
  E: "右东",
  W: "左西",
  S: "下南",
  NW: "左上",
  NE: "右上",
  SE: "右下",
  SW: "左下",
};
const includesRoleGroup = {
  TH: (p) => ["MT", "ST", "H1", "H2"].includes(p),
  DPS: (p) => ["D1", "D2", "D3", "D4"].includes(p),
  T: (p) => ["MT", "ST"].includes(p),
  H: (p) => ["H1", "H2"].includes(p),
  M: (p) => ["MT", "ST", "D1", "D2"].includes(p),
  R: (p) => ["H1", "H2", "D3", "D4"].includes(p),
};
const justShowTextSort = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"];
const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
  if (!data.soumaDecOffset && firstDecimalMarker) data.soumaDecOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  return (parseInt(matches.id, 16) - data.soumaDecOffset).toString(16).toUpperCase().padStart(4, "0");
};
const firstMarker = (phase) => (phase === "doorboss" ? headmarkers.hyperdimensionalSlash : headmarkers.skywardTriple);
const handleDistributeName = (data, name) => (data.me === name ? `${name}(你)` : name);
const matchedPositionTo8Dir = (x, y) => {
  return Math.round(5 - (4 * Math.atan2(x - 100, y - 100)) / Math.PI) % 8;
};
const matchedPositionTo4Dir = (x, y) => {
  return Math.round(2 - (2 * Math.atan2(x - 100, y - 100)) / Math.PI) % 4;
};
const myMatchedPositionToDir = (x, y, dir) => {
  return Math.round(dir / 2 - ((Math.atan2(x - 100, y - 100) / Math.PI) * dir) / 2);
};
const positionTo8Direction = [
  direction.N,
  direction.NE,
  direction.E,
  direction.SE,
  direction.S,
  direction.SW,
  direction.W,
  direction.NW,
];
const matchedPositionToNEWS = (min, middle, max, deviation = 3, x, y) => {
  if (Math.abs(x - middle) < deviation && Math.abs(y - min) < deviation) return direction.N;
  if (Math.abs(x - max) < deviation && Math.abs(y - middle) < deviation) return direction.E;
  if (Math.abs(x - min) < deviation && Math.abs(y - middle) < deviation) return direction.W;
  if (Math.abs(x - middle) < deviation && Math.abs(y - max) < deviation) return direction.S;
};
const universalSortMarking = (arr, sortRule = []) => {
  return arr.sort((a, b) => sortRule.findIndex((v) => v === a) - sortRule.findIndex((v) => v === b));
};
Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData: () => {
    return {
      soumaP1ShiningBlade: null,
      soumaP1SeenEmptyDimension: null,
      soumaP1DoorbossLaser: [],
      soumaP1HoliestHallowing: 0,
      soumaP15BrightwingCounter: 0,
      soumaP2SanctityWardDir: null,
      soumaP2SpiralThrust: [],
      soumaP2SkywardTriple: [],
      soumaP2MeteorMarkers: [],
      soumaP2SwordList: { One: null, Two: null },
      soumaP2Knights: [],
      soumaP2tower: [],
      soumaHasDoom: {},
      soumaEyeOfTheTyrantCounter: 0,
      soumaDiveCounter: 1,
      soumaMajiang: [],
      soumaPovMajiang: {},
      soumaP3CombinedSkill: 0,
      soumaP3Next1InOrOut: null,
      soumaP3Next2InOrOut: null,
      soumaP3myTowerPlace: null,
      soumaP3myTowerToGo: null,
      soumaP38PersonTower: [],
      soumaP3BossId: null,
      soumaP4DiveFirstGroup: [],
      soumaP5Doom: [],
      soumaP5ThunderStruck: [],
      soumaP5NorthIndex: -1,
      soumaP5Charibert: null,
      soumaP6SpreadingFlame: [],
      soumaP6EntangledFlame: [],
      soumaP6Poison: -1,
      soumaP6IceFireConnectionCount: 1,
      soumaP6IceFireConnectionArr: [],
      soumaP6NidhoggGlowing: null,
      soumaP6HraesvelgrGlowing: null,
      soumaP6FireBall: [],
      soumaP6FireBallSafe: null,
      soumap6AddsPhaseNidhoggId: null,
      soumap6AddsPhaseHraesvelgrId: null,
      soumaP6HallowedWingsCount: 0,
      soumaP6CombatantData: [],
      soumaP6PoisonArr: [],
      soumaP6PoisonSecondHolder: null,
      soumaP6PoisonSecondTarget: null,
      soumaDiveFromGraceNum: {},
      soumaDiveFromGraceHasArrow: { 1: false, 2: false, 3: false },
      soumaDiveFromGraceLashGnashKey: "unknown",
      soumaDiveFromGracePositions: {},
      soumaDiveFromGraceDir: {},
      soumaWaitingForGeirskogul: false,
      soumaStackAfterGeirskogul: false,
      soumaDiveFromGracePreviousPosition: {},
      soumaDiveFromGraceTowerCounter: 0,
    };
  },
  timelineTriggers: [
    {
      id: "DSR Eye of the Tyrant Counter",
      regex: /Eye of the Tyrant/,
      beforeSeconds: 1,
      run: (data) => data.soumaEyeOfTheTyrantCounter++,
    },
    {
      id: "DSR Mortal Vow",
      regex: /Mortal Vow/,
      suppressSeconds: 999,
      beforeSeconds: 5,
      condition: (data) => data.role === "dps",
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "散开等毒",
        },
      },
    },
    {
      id: "DSR Resentment",
      regex: /Resentment/,
      beforeSeconds: 5,
      condition: (data) => data.soumaPhase === "nidhogg",
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "AOE + dot" } },
    },
  ],
  triggers: [
    {
      id: "刷新页面",
      netRegex: NetRegexes.echo({ line: "reload", capture: false }),
      run: () => {
        location.reload();
      },
    },
    {
      id: "DSR Phase Tracker",
      netRegex: NetRegexes.startsUsing({
        id: ["62D4", "63C8", "6708", "62E2", "6B86", "6667", "7438"],
      }),
      run: (data, matches) => {
        data.soumaP15BrightwingCounter = 0;
        switch (matches.id) {
          case "62D4":
            data.soumaPhase = "doorboss";
            break;
          case "63C8":
            data.soumaPhase = "thordan";
            break;
          case "6708":
            data.soumaPhase = "nidhogg";
            break;
          case "62E2":
            if (data.soumaPhase !== "doorboss") data.soumaPhase = "haurchefant";
            break;
          case "6B86":
            data.soumaPhase = "thordan2";
            break;
          case "6667":
            data.soumaPhase = "nidhogg2";
            break;
          case "71E4":
            data.soumaPhase = "dragon-king";
            break;
        }
      },
    },
    {
      id: "DSR Headmarker Tracker",
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => undefined === data.soumaDecOffset,
      run: (data, matches) => {
        const firstHeadmarker = parseInt(firstMarker(data.soumaPhase), 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: "DSR Hyperdimensional Slash Headmarker",
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) =>
        data.soumaPhase === "doorboss" && getHeadmarkerId(data, matches) === headmarkers.hyperdimensionalSlash,
      preRun: (data, matches) => data.soumaP1DoorbossLaser.push(data.soumaFL.getRpByName(data, matches.target)),
      alertText: (data, _matches, output) => {
        if (data.soumaP1DoorbossLaser.length >= 4) {
          data.soumaP1DoorbossLaser = universalSortMarking(data.soumaP1DoorbossLaser, output.优先级().split("/"));
          return output.text({
            n1: handleDistributeName(data, data.soumaP1DoorbossLaser[0]),
            n2: handleDistributeName(data, data.soumaP1DoorbossLaser[1]),
            n3: handleDistributeName(data, data.soumaP1DoorbossLaser[2]),
            n4: handleDistributeName(data, data.soumaP1DoorbossLaser[3]),
          });
        }
      },
      tts: (data, _matches, output) => {
        if (data.soumaP1DoorbossLaser.length >= 4) {
          const index = data.soumaP1DoorbossLaser.findIndex((v) => v === data.soumaFL.getRpByName(data, data.me));
          return index >= 0 ? output.tts({ num: index + 1 }) : output.notYou();
        }
        return null;
      },
      sound: "",
      soundVolume: 0,
      run: (data) => {
        if (data.soumaP1DoorbossLaser.length >= 4) data.soumaP1DoorbossLaser.length = 0;
      },
      outputStrings: {
        text: {
          en: "激光点名: ${n1} / ${n2} / ${n3} / ${n4}",
        },
        tts: {
          en: "激光点名（${num}）",
        },
        notYou: {
          en: "集合分摊",
        },
        优先级: {
          en: ["H1", "H2", "MT", "ST", "D1", "D2", "D3", "D4"].join("/"),
        },
      },
    },
    {
      id: "DSR Holiest Hallowing",
      netRegex: NetRegexes.startsUsing({ id: "62D0", capture: false }),
      alertText: (data, _matches, output) => {
        output.text({
          name: handleDistributeName(data, output.优先级()?.split("/")?.[data.soumaP1HoliestHallowing]),
        });
      },
      tts: (data, _matches, output) =>
        output.优先级()?.split("/")?.[data.soumaP1HoliestHallowing] === data.soumaFL.getRpByName(data, data.me)
          ? output.text({ name: "" })
          : null,
      soundVolume: 0,
      run: (data) => data.soumaP1HoliestHallowing++,
      outputStrings: {
        text: { en: "${name}沉默打断" },
        优先级: { en: ["ST", "D3", "MT"].join("/") },
      },
    },
    {
      id: "DSR Playstation Fire Chains",
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) => data.soumaPhase === "doorboss" && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle) return output.circle();
        else if (id === headmarkers.firechainTriangle) return output.triangle();
        else if (id === headmarkers.firechainSquare) return output.square();
        else if (id === headmarkers.firechainX) return output.cross();
      },
      outputStrings: {
        作者注: { en: "此trigger只针对P1" },
        circle: {
          en: "圆圈（左右）",
        },
        triangle: {
          en: "三角（左上右下）",
        },
        square: {
          en: "正方（左下右上）",
        },
        cross: {
          en: "叉叉（上下）",
        },
      },
    },
    {
      id: "DSR Empty Dimension",
      netRegex: NetRegexes.startsUsing({ id: "62DA", capture: false }),
      alertText: (data, _matches, output) =>
        data.soumaPhase !== "doorboss" || data.soumaP1SeenEmptyDimension
          ? output.in()
          : data.role === "tank"
          ? output.inAndTetherTank()
          : output.inAndTetherNotTank(),
      run: (data) => (data.soumaP1SeenEmptyDimension = true),
      outputStrings: {
        inAndTetherNotTank: {
          en: "月环 + 背后",
        },
        inAndTetherTank: {
          en: "月环 + 截线",
        },
        in: { en: "月环" },
      },
    },
    {
      id: "DSR Full Dimension",
      netRegex: NetRegexes.startsUsing({ id: "62DB", capture: false }),
      response: Responses.getOut(),
    },
    {
      id: "DSR Faith Unmoving",
      netRegex: NetRegexes.startsUsing({ id: "62DC", capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "击退",
        },
      },
    },
    {
      id: "DSR Adelphel KB Direction",
      netRegex: NetRegexes.startsUsing({ id: "62D4" }),
      alertText: (_data, matches) => matchedPositionToNEWS(78, 100, 122, 2, matches.x, matches.y) ?? null,
    },
    {
      id: "DSR P1光芒剑",
      netRegex: NetRegexes.ability({ id: "62CE" }),
      suppressSeconds: 5,
      promise: async (data, matches) => {
        data.soumaP1ShiningBlade = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.sourceId, 16)],
          })
        ).combatants?.[0];
      },
      alertText: (data, matches, output) => {
        const h = Number(data.soumaP1ShiningBlade.Heading) / Math.PI;
        const x = Number(matches.x);
        const y = Number(matches.y);
        const pos = matchedPositionToNEWS(78, 100, 122, 2, x, y);
        const way = (() => {
          if (0.5 <= h && h < 1) return direction.NE;
          else if (-1 <= h && h < -0.5) return direction.NW;
          else if (0 <= h && h < 0.5) return direction.SE;
          else if (-0.5 <= h && h < 0) return direction.SW;
        })();
        if (
          (pos === direction.N && way === direction.SW) ||
          (pos === direction.E && way === direction.NW) ||
          (pos === direction.S && way === direction.NE) ||
          (pos === direction.W && way === direction.SE)
        )
          return output.left();
        else if (
          (pos === direction.N && way === direction.SE) ||
          (pos === direction.E && way === direction.SW) ||
          (pos === direction.S && way === direction.NW) ||
          (pos === direction.W && way === direction.NE)
        )
          return output.right();
      },
      outputStrings: {
        left: { en: "左" },
        right: { en: "右" },
      },
    },
    {
      id: "DSR Brightwing Counter",
      netRegex: NetRegexes.startsUsing({ id: "62E2", capture: false }),
      infoText: (data, _matches, output) => {
        const p = output.第1组().split("/");
        switch (p.findIndex((v) => v === data.soumaFL.getRpByName(data, data.me))) {
          case -1:
            return output.notYou({ tar1: p[0], tar2: p[1] });
          case 0:
            return output.left();
          case 1:
            return output.right();
        }
      },
      outputStrings: {
        第1组: { en: ["H1", "H2"].join("/") },
        notYou: { en: "${tar1} / ${tar2} 引导" },
        left: { en: "去引导" },
        right: { en: "去引导" },
      },
    },
    {
      id: "DSR P1.5引导后半",
      netRegex: NetRegexes.ability({ id: "6319", capture: false }),
      suppressSeconds: 1,
      preRun: (data) => data.soumaP15BrightwingCounter++,
      response: (data, _matches, output) => {
        if (data.soumaP15BrightwingCounter > 3) return;
        const p = output.第234组().split("/");
        const i = (data.soumaP15BrightwingCounter - 1) * 2;
        const group = p.slice(i, i + 2);
        switch (group.findIndex((v) => v === data.soumaFL.getRpByName(data, data.me))) {
          case -1:
            return {
              infoText: output.notYou({ tar1: group[0], tar2: group[1] }),
            };
          case 0:
            return { alertText: output.group1() };
          case 1:
            return { alertText: output.group2() };
        }
      },
      outputStrings: {
        第234组: { en: ["D3", "D4", "D1", "D2", "MT", "ST"].join("/") },
        notYou: { en: "${tar1} / ${tar2} 引导" },
        group1: { en: "去引导" },
        group2: { en: "去引导" },
      },
    },
    {
      id: "DSR Sanctity of the Ward Meteor You",
      disable: true,
      netRegex: NetRegexes.headMarker({}),
    },
    {
      id: "DSR Spiral Thrust Safe Spots",
      netRegex: NetRegexes.ability({ id: "63D3", capture: false }),
      delaySeconds: 5,
      promise: async (data) => {
        const bossData = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        ).combatants;
        if (bossData.length < 3) Promise.reject(bossData);
        data.soumaP2SpiralThrust = [
          bossData.find((boss) => boss.BNpcID === 12633),
          bossData.find((boss) => boss.BNpcID === 12634),
          bossData.find((boss) => boss.BNpcID === 12635),
        ];
      },
      alertText: (data, _matches, output) => {
        if (data.soumaP2SpiralThrust.includes(undefined)) return;
        const pos = [
          {
            marker: output.type1(),
            safePos: [
              [100, 77],
              [100, 123],
            ],
            isSafe: true,
          },
          {
            marker: output.type2(),
            safePos: [
              [77, 100],
              [123, 100],
            ],
            isSafe: true,
          },
          {
            marker: output.type3(),
            safePos: [
              [83, 116],
              [116, 83],
            ],
            isSafe: true,
          },
          {
            marker: output.type4(),
            safePos: [
              [116, 116],
              [83, 83],
            ],
            isSafe: true,
          },
        ];
        for (const knight of data.soumaP2SpiralThrust) {
          const k = [parseInt(knight.PosX), parseInt(knight.PosY)];
          for (const p of pos)
            if (p.safePos[0].toString() === k.toString() || p.safePos[1].toString() === k.toString()) p.isSafe = false;
        }
        const safe = pos.find((v) => v.isSafe === true).marker;
        data.soumaFL.doTextCommand("/e " + safe);
        return output.safe({ safe: safe });
      },
      outputStrings: {
        safe: { en: "${safe}安全" },
        type1: { en: "AC" },
        type2: { en: "BD" },
        type3: { en: "一三" },
        type4: { en: "二四" },
      },
    },
    {
      id: "DSR Dragon's Rage",
      disable: true,
      netRegex: NetRegexes.ability({ id: "63D7", capture: false }),
    },
    {
      id: "DSR Skyward Leap",
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) =>
        data.soumaPhase === "thordan" &&
        data.me === matches.target &&
        getHeadmarkerId(data, matches) === headmarkers.skywardTriple,
      infoText: (_data, _matches, output) => output.leapOnYou(),
      tts: null,
      outputStrings: {
        leapOnYou: {
          en: "核爆点名",
        },
      },
    },
    {
      id: "DSR P2骑神位置",
      netRegex: NetRegexes.startsUsing({ id: "63D3", capture: false }),
      delaySeconds: 22,
      durationSeconds: 5,
      promise: async (data) => {
        const combatants = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        ).combatants.filter((c) => c.BNpcID === 12601 || c.BNpcID === 12632);
        if (combatants.length < 2) Promise.reject(combatants);
        data.soumaP2Knights = combatants;
      },
      infoText: (data, _matches, output) => {
        const knights = data.soumaP2Knights;
        if (knights.length < 2) return;
        const midPoint = [
          Math.round((knights[0].PosX + knights[1].PosX) / 2),
          Math.round((knights[0].PosY + knights[1].PosY) / 2),
        ];
        const midPointDir = matchedPositionTo8Dir(midPoint[0], midPoint[1]);
        return output.safe({ dir: output[`safe${midPointDir}`]() });
      },
      outputStrings: {
        safe0: "2",
        safe1: "C",
        safe2: "3",
        safe3: "D",
        safe4: "4",
        safe5: "A",
        safe6: "1",
        safe7: "B",
        safe: { en: "${dir}点骑神" },
      },
    },
    {
      id: "DSR P2一运核爆",
      netRegex: NetRegexes.headMarker({}),
      durationSeconds: 14,
      condition: (data, matches) =>
        data.soumaPhase === "thordan" && getHeadmarkerId(data, matches) === headmarkers.skywardTriple,
      preRun: (data, matches) => data.soumaP2SkywardTriple.push(data.soumaFL.getRpByName(data, matches.target)),
      response: (data, _matches, output) => {
        if (data.soumaP2SkywardTriple.length === 3) {
          if (includesRoleGroup.T(data.soumaFL.getRpByName(data, data.me))) return;
          const list = universalSortMarking(data.soumaP2SkywardTriple, output.优先级().split("/"));
          if (list.includes(data.soumaFL.getRpByName(data, data.me))) {
            return {
              alertText: output.meteor({
                text: list.map((v) => handleDistributeName(data, v)).join(" / "),
              }),
              tts:
                output.打法() === "优先级"
                  ? output[`meteor${list.findIndex((v) => v === data.soumaFL.getRpByName(data, data.me)) + 1}TTS`]
                  : output.meteorNoPriorityTTS(),
            };
          }
          const none = output
            .优先级()
            .split("/")
            .filter((v) => !list.includes(v));
          return {
            infoText: output.noMarker({
              text: none.map((v) => handleDistributeName(data, v)).join(" / "),
            }),
            tts:
              output.打法() === "优先级"
                ? output[`noMarker${none.findIndex((v) => v === data.soumaFL.getRpByName(data, data.me)) + 1}TTS`]
                : output.noMarkerNoPriorityTTS(),
            sound: "",
            soundVolume: 0,
          };
        }
      },
      outputStrings: {
        meteor: {
          en: "核爆：${text}",
        },
        noMarker: {
          en: "无点名：${text}",
        },
        meteor1TTS: { en: "左左左" },
        meteor2TTS: { en: "下下下" },
        meteor3TTS: { en: "右右右" },
        meteorNoPriorityTTS: { en: "核爆" },
        优先级: {
          en: ["D1", "D2", "D3", "D4", "H1", "H2"].join("/"),
        },
        注: { en: "预站位or优先级" },
        打法: { en: "预站位" },
        noMarker1TTS: { en: "去骑神 => 左侧塔" },
        noMarker2TTS: { en: "去骑神 => 中间塔" },
        noMarker3TTS: { en: "去骑神 => 右侧塔" },
        noMarkerNoPriorityTTS: { en: "去骑神预站位" },
      },
      run: (data) => {
        if (data.soumaP2SkywardTriple.length === 4) data.soumaP2SkywardTriple.length = 0;
      },
    },
    {
      id: "DSR Sanctity of the Ward Swords",
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) =>
        data.soumaPhase === "thordan" &&
        (getHeadmarkerId(data, matches) === headmarkers.sword1 ||
          getHeadmarkerId(data, matches) === headmarkers.sword2),
      preRun: (data, matches) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.sword1) data.soumaP2SwordList.One = data.soumaFL.getRpByName(data, matches.target);
        else if (id === headmarkers.sword2) data.soumaP2SwordList.Two = data.soumaFL.getRpByName(data, matches.target);
      },
      response: (data, _matches, output) => {
        if (data.soumaP2SwordList.One !== null && data.soumaP2SwordList.Two !== null) {
          const closerRPArr = output.closerGroup().split("/");
          const farAwayRPArr = output.farAwayGroup().split("/");
          const closerSRP = output.closerGroupSwitch();
          const farAwaySRP = output.farAwayGroupSwitch();
          const pov = data.soumaFL.getRpByName(data, data.me);
          const sword = universalSortMarking([data.soumaP2SwordList.One, data.soumaP2SwordList.Two], justShowTextSort);
          let groupInfo;
          if (closerRPArr.includes(sword[0]) && closerRPArr.includes(sword[1]))
            groupInfo = output.sameGroup({ who: output.farAwayGroupSwitch() });
          else if (farAwayRPArr.includes(sword[0]) && farAwayRPArr.includes(sword[1]))
            groupInfo = output.sameGroup({ who: output.closerGroupSwitch() });
          else groupInfo = output.notSameGroup();
          data.soumaFL.doTextCommand("/e " + groupInfo);
          if (pov === data.soumaP2SwordList.One)
            return {
              alarmText: output.farAway(),
              infoText: groupInfo,
            };
          if (pov === data.soumaP2SwordList.Two)
            return {
              alarmText: output.closer(),
              infoText: groupInfo,
            };
          if (pov === closerSRP && farAwayRPArr.reduce((p, c) => (c === sword[0] || c === sword[1] ? p + 1 : p), 0))
            return {
              alertText: output.closerSwitch(),
              infoText: groupInfo,
            };
          if (pov === farAwaySRP && closerRPArr.reduce((p, c) => (c === sword[0] || c === sword[1] ? p + 1 : p), 0))
            return {
              alertText: output.farAwaySwitch(),
              infoText: groupInfo,
            };
          if (closerRPArr.includes(pov))
            return {
              alertText: output.closer(),
              infoText: groupInfo,
            };
          if (farAwayRPArr.includes(pov))
            return {
              alertText: output.farAway(),
              infoText: groupInfo,
            };
        }
      },
      outputStrings: {
        closerGroup: { en: ["MT", "H1", "D1", "D3"].join("/") },
        farAwayGroup: { en: ["ST", "H2", "D2", "D4"].join("/") },
        closerGroupSwitch: { en: "D1" },
        farAwayGroupSwitch: { en: "D2" },
        closer: { en: "靠近靠近" },
        farAway: { en: "远离远离" },
        closerSwitch: { en: "（换位）远离远离" },
        farAwaySwitch: { en: "（换位）靠近靠近" },
        sameGroup: { en: "${who}换" },
        notSameGroup: { en: "不换" },
      },
    },
    {
      id: "DSR Sanctity of the Ward Sword Names",
      disable: true,
      netRegex: NetRegexes.headMarker(),
    },
    {
      id: "DSR Sanctity of the Ward Direction",
      netRegex: NetRegexes.ability({ id: "63E1", capture: false }),
      condition: (data) => data.soumaPhase === "thordan",
      delaySeconds: 7,
      durationSeconds: 10,
      promise: async (data, _matches, output) => {
        let combatantDataJanlenoux = await callOverlayHandler({
          call: "getCombatants",
          names: ["Ser Janlenoux", "Janlenoux", "sire Janlenoux", "聖騎士ジャンルヌ", "圣骑士让勒努", "성기사 장르누"],
        });
        if (combatantDataJanlenoux === null) return;
        if (combatantDataJanlenoux.combatants.length < 1) return;
        const combatantJanlenoux = combatantDataJanlenoux.combatants.sort((a, b) => (a.ID ?? 0) - (b.ID ?? 0)).shift();
        if (!combatantJanlenoux) return;
        if (combatantJanlenoux.PosX < 100) data.soumaP2SanctityWardDir = output.clockwise();
        if (combatantJanlenoux.PosX > 100) data.soumaP2SanctityWardDir = output.counterclock();
      },
      infoText: (data, _matches) => data.soumaP2SanctityWardDir ?? null,
      run: (data) => delete data.soumaP2SanctityWardDir,
      outputStrings: {
        clockwise: {
          en: "顺时针（右）",
        },
        counterclock: {
          en: "逆时针（左）",
        },
      },
    },
    {
      id: "DSR Sanctity of the Ward Meteor Role",
      netRegex: NetRegexes.headMarker({}),
      condition: (data, matches) =>
        data.soumaPhase === "thordan" && getHeadmarkerId(data, matches) === headmarkers.meteor,
      delaySeconds: 0.4,
      preRun: (data, matches) => {
        data.soumaP2MeteorMarkers.push({
          name: matches.target,
          id: matches.targetId,
          rp: data.soumaFL.getRpByName(data, matches.target),
        });
      },
      durationSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.soumaP2MeteorMarkers.length === 2) {
          const marks = data.soumaP2MeteorMarkers.slice();
          data.soumaP2MeteorMarkers.length = 0;
          const playerD = data.soumaFL.getRpByName(data, data.me);
          const twoMeteors = marks.sort(
            (a, b) => justShowTextSort.findIndex((v) => v === a) - justShowTextSort.findIndex((v) => v === b),
          );
          const twoMeteorsWays = twoMeteors.map((v) => getWays(v.rp));
          const iNeedSwitch =
            output.换位规则() === "整组" ||
            ["D1", "D2", "D3", "D4"].includes(twoMeteors[0].rp) === (data.role === "dps");
          const BDSwitch = output.BD换不换() !== "不换";
          const myWay = getWays(playerD);
          if (
            (twoMeteorsWays[0] === direction.N && twoMeteorsWays[1] === direction.S) ||
            (twoMeteorsWays[1] === direction.N && twoMeteorsWays[0] === direction.S)
          ) {
            return output.safe();
          } else if (
            (twoMeteorsWays[0] === direction.W && twoMeteorsWays[1] === direction.E) ||
            (twoMeteorsWays[1] === direction.W && twoMeteorsWays[0] === direction.E)
          ) {
            if (BDSwitch) {
              switch (myWay) {
                case direction.N:
                  return iNeedSwitch ? output.switch({ dir: direction.W }) : output.safe();
                case direction.E:
                  return iNeedSwitch ? output.switch({ dir: direction.S }) : output.safe();
                case direction.W:
                  return iNeedSwitch ? output.switch({ dir: direction.N }) : output.safe();
                case direction.S:
                  return iNeedSwitch ? output.switch({ dir: direction.E }) : output.safe();
              }
            } else {
              return output.safe();
            }
          } else if (
            (twoMeteorsWays[0] === direction.N && twoMeteorsWays[1] === direction.E) ||
            (twoMeteorsWays[1] === direction.N && twoMeteorsWays[0] === direction.E)
          ) {
            switch (myWay) {
              case direction.N:
              case direction.W:
                return output.safe();
              case direction.E:
                return iNeedSwitch ? output.switch({ dir: direction.S }) : output.safe();
              case direction.S:
                return iNeedSwitch ? output.switch({ dir: direction.E }) : output.safe();
            }
          } else if (
            (twoMeteorsWays[0] === direction.N && twoMeteorsWays[1] === direction.W) ||
            (twoMeteorsWays[1] === direction.N && twoMeteorsWays[0] === direction.W)
          ) {
            switch (myWay) {
              case direction.N:
              case direction.E:
                return output.safe();
              case direction.W:
                return iNeedSwitch ? output.switch({ dir: direction.S }) : output.safe();
              case direction.S:
                return iNeedSwitch ? output.switch({ dir: direction.W }) : output.safe();
            }
          } else if (
            (twoMeteorsWays[0] === direction.S && twoMeteorsWays[1] === direction.E) ||
            (twoMeteorsWays[1] === direction.S && twoMeteorsWays[0] === direction.E)
          ) {
            switch (myWay) {
              case direction.N:
                return iNeedSwitch ? output.switch({ dir: direction.E }) : output.safe();
              case direction.E:
                return iNeedSwitch ? output.switch({ dir: direction.N }) : output.safe();
              case direction.S:
              case direction.W:
                return output.safe();
            }
          } else if (
            (twoMeteorsWays[0] === direction.S && twoMeteorsWays[1] === direction.W) ||
            (twoMeteorsWays[1] === direction.S && twoMeteorsWays[0] === direction.W)
          ) {
            switch (myWay) {
              case direction.N:
                return iNeedSwitch ? output.switch({ dir: direction.W }) : output.safe();
              case direction.W:
                return iNeedSwitch ? output.switch({ dir: direction.N }) : output.safe();
              case direction.E:
              case direction.S:
                return output.safe();
            }
          }
          function getWays(rp) {
            switch (rp) {
              case output.北DPS():
              case output.北TH():
                return direction.N;
              case output.南DPS():
              case output.南TH():
                return direction.S;
              case output.西DPS():
              case output.西TH():
                return direction.W;
              case output.东DPS():
              case output.东TH():
                return direction.E;
            }
          }
        }
      },
      sound: "",
      outputStrings: {
        北TH: { en: "MT" },
        北DPS: { en: "D1" },
        南TH: { en: "ST" },
        南DPS: { en: "D2" },
        西TH: { en: "H1" },
        西DPS: { en: "D3" },
        东TH: { en: "H2" },
        东DPS: { en: "D4" },
        safe: { en: "不动" },
        switch: { en: "去${dir}" },
        换位规则: { en: "整组" },
        BD换不换: { en: "不换" },
      },
    },
    {
      id: "DSR Broad Swing Right",
      netRegex: NetRegexes.startsUsing({ id: "63C0", capture: false }),
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "后 => 右",
        },
      },
    },
    {
      id: "DSR Broad Swing Left",
      netRegex: NetRegexes.startsUsing({ id: "63C1", capture: false }),
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "后 => 左",
        },
      },
    },

    {
      id: "DSR P3箭头点名倒数前",
      netRegex: NetRegexes.gainsEffect({ effectId: ["AC3", "AC4", "AC5"] }),
      condition: (data, matches) => matches.target === data.me,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
      tts: (_data, matches, output) => {
        if (matches.effectId === "AC3") return output.circle();
        else if (matches.effectId === "AC4") return output.up();
        else if (matches.effectId === "AC5") return output.down();
      },
      outputStrings: {
        up: {
          en: "面对面对",
        },
        down: {
          en: "背对背对",
        },
        circle: {
          en: "", //圆圈
        },
      },
    },
    {
      id: "DSR Dive From Grace Number",
      netRegex: NetRegexes.headMarker(),
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.dot1) {
          data.soumaDiveFromGraceNum[matches.target] = 1;
          if (matches.target === data.me) return output.num1();
        } else if (id === headmarkers.dot2) {
          data.soumaDiveFromGraceNum[matches.target] = 2;
          if (matches.target === data.me) return output.stackNorthNum({ num: output.num2() });
        } else if (id === headmarkers.dot3) {
          data.soumaDiveFromGraceNum[matches.target] = 3;
          if (matches.target === data.me) return output.stackNorthNum({ num: output.num3() });
        }
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        stackNorthNum: {
          en: "${num} (预站位 => 分摊)",
        },
      },
    },
    {
      id: "DSR Dive From Grace Dir Collect",
      netRegex: NetRegexes.gainsEffect({ effectId: ["AC3", "AC4", "AC5"] }),
      run: (data, matches) => {
        if (matches.effectId === "AC4" || matches.effectId === "AC5") {
          const duration = parseFloat(matches.duration);
          if (duration < 15) data.soumaDiveFromGraceHasArrow[1] = true;
          else if (duration < 25) data.soumaDiveFromGraceHasArrow[2] = true;
          else data.soumaDiveFromGraceHasArrow[3] = true;
        }
        switch (matches.effectId) {
          case "AC3":
            data.soumaDiveFromGraceDir[matches.target] = "circle";
            break;
          case "AC4":
            data.soumaDiveFromGraceDir[matches.target] = "up";
            break;
          case "AC5":
            data.soumaDiveFromGraceDir[matches.target] = "down";
            break;
        }
      },
    },
    {
      id: "DSR Dive From Grace Dir You",
      netRegex: NetRegexes.gainsEffect({ effectId: ["AC3", "AC4", "AC5"] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        const num = data.soumaDiveFromGraceNum[data.me];
        if (!num) return;
        if (data.soumaDiveFromGraceDir[data.me] === "up") return output.upArrow({ num: num });
        else if (data.soumaDiveFromGraceDir[data.me] === "down") return output.downArrow({ num: num });
        if (data.soumaDiveFromGraceHasArrow[num]) return output.circleWithArrows({ num: num });
        return output.circleAllCircles({ num: num });
      },
      outputStrings: {
        circleAllCircles: {
          en: "#${num} 预站位",
        },
        circleWithArrows: {
          en: "#${num} 下塔 (单圆圈)",
        },
        upArrow: {
          en: "#${num} 右塔 (上箭头)",
        },
        downArrow: {
          en: "#${num} 左塔 (下箭头)",
        },
      },
    },
    {
      id: "DSR Gnash and Lash",
      netRegex: NetRegexes.startsUsing({ id: ["6712", "6713"] }),
      durationSeconds: 7,
      preRun: (data, matches) => {
        data.soumaP3BossId = matches.sourceId;
      },
      alertText: (data, matches, output) => {
        const key = matches.id === "6712" ? "out" : "in";
        const inout = output[key]();
        data.soumaDiveFromGraceLashGnashKey = key;
        const num = data.soumaDiveFromGraceNum[data.me];
        if (num !== 1 && num !== 2 && num !== 3) return inout;
        if (
          data.soumaEyeOfTheTyrantCounter === 1 &&
          num === 1 &&
          data.soumaDiveFromGracePreviousPosition[data.me] !== "middle"
        )
          return output.baitStackInOut({ inout: inout });
        const firstStack = data.soumaEyeOfTheTyrantCounter === 0 && num !== 1;
        const secondStack = data.soumaEyeOfTheTyrantCounter === 1 && num !== 3;
        if (firstStack || secondStack) return output.stackInOut({ inout: inout });
        if (!data.soumaDiveFromGraceHasArrow[num]) {
          return {
            1: output.circlesDive1({ inout: inout }),
            2: inout,
            3: output.circlesDive3({ inout: inout }),
          }[num];
        }
        if (num === 1) {
          if (data.soumaDiveFromGraceDir[data.me] === "circle") return output.southDive1({ inout: inout });
          if (data.soumaDiveFromGraceDir[data.me] === "up") return output.upArrowDive1({ inout: inout });
          if (data.soumaDiveFromGraceDir[data.me] === "down") return output.downArrowDive1({ inout: inout });
        } else if (num === 3) {
          if (data.soumaDiveFromGraceDir[data.me] === "circle") return output.southDive3({ inout: inout });
          if (data.soumaDiveFromGraceDir[data.me] === "up") return output.upArrowDive3({ inout: inout });
          if (data.soumaDiveFromGraceDir[data.me] === "down") return output.downArrowDive3({ inout: inout });
        }
        return inout;
      },
      outputStrings: {
        in: Outputs.in,
        out: Outputs.out,
        stackInOut: {
          en: "分摊 => ${inout}",
        },
        baitStackInOut: {
          en: "引导 => 分摊 => ${inout}",
        },
        circlesDive1: {
          en: "放塔 (预站位) => ${inout}",
        },
        circlesDive3: {
          en: "原地放塔 => ${inout}",
        },
        southDive1: {
          en: "下放塔 => ${inout}",
        },
        southDive3: {
          en: "下放塔 => ${inout}",
        },
        upArrowDive1: {
          en: "右放塔 => ${inout}",
        },
        upArrowDive3: {
          en: "右放塔 => ${inout}",
        },
        downArrowDive1: {
          en: "左放塔 => ${inout}",
        },
        downArrowDive3: {
          en: "左放塔 => ${inout}",
        },
      },
    },
    {
      id: "DSR Lash Gnash Followup",
      netRegex: NetRegexes.ability({ id: ["6715", "6716"] }),
      suppressSeconds: 6,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          out: Outputs.out,
          in: Outputs.in,
          inOutAndBait: {
            en: "${inout} + 引导",
          },
          circlesDive2: {
            en: "${inout} => 放二塔 (预站位)",
          },
          upArrowDive2: {
            en: "${inout} => 右上放塔",
          },
          downArrowDive2: {
            en: "${inout} => 左上放塔",
          },
        };
        const key = matches.id === "6715" ? "in" : "out";
        const inout = output[key]();
        data.soumaDiveFromGraceLashGnashKey = key;
        const num = data.soumaDiveFromGraceNum[data.me];
        if (num === undefined) {
          return { infoText: inout };
        }
        if (data.soumaEyeOfTheTyrantCounter === 1) {
          if (num === 2) {
            if (!data.soumaDiveFromGraceHasArrow[num]) return { alertText: output.circlesDive2({ inout: inout }) };
            if (data.soumaDiveFromGraceDir[data.me] === "up")
              return { alertText: output.upArrowDive2({ inout: inout }) };
            if (data.soumaDiveFromGraceDir[data.me] === "down")
              return { alertText: output.downArrowDive2({ inout: inout }) };
          } else if (num === 3) {
            return { alertText: output.inOutAndBait({ inout: inout }) };
          }
        } else if (data.soumaEyeOfTheTyrantCounter === 2) {
          if (num === 2 || (num === 1 && data.soumaDiveFromGracePreviousPosition[data.me] === "middle"))
            return { alertText: output.inOutAndBait({ inout: inout }) };
          if (num === 3) return { infoText: inout };
        }
        return { infoText: inout };
      },
    },
    {
      id: "DSR Dive From Grace Dive Collect",
      netRegex: NetRegexes.ability({ id: ["670E", "670F", "6710"] }),
      run: (data, matches) => {
        const posX = parseFloat(matches.targetX);
        data.soumaDiveFromGracePositions[matches.target] = posX;
      },
    },
    {
      id: "DSR Dive From Grace Post Stack",
      netRegex: NetRegexes.ability({ id: "6714", capture: false }),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const num = data.soumaDiveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Tower 1 Reminder: missing number: ${JSON.stringify(data.soumaDiveFromGraceNum)}`);
          return;
        }
        const inout = output[data.soumaDiveFromGraceLashGnashKey]();
        if (data.soumaEyeOfTheTyrantCounter === 1) {
          if (num === 3) {
            if (data.soumaDiveFromGraceDir[data.me] === "circle") {
              if (data.soumaDiveFromGraceHasArrow[3]) return output.southTower1({ inout: inout });
              return output.circleTowers1({ inout: inout });
            } else if (data.soumaDiveFromGraceDir[data.me] === "up") {
              return output.upArrowTower1({ inout: inout });
            } else if (data.soumaDiveFromGraceDir[data.me] === "down") {
              return output.downArrowTower1({ inout: inout });
            }
            return output.unknownTower({ inout: inout });
          }
        } else if (data.soumaEyeOfTheTyrantCounter === 2) {
          const pos = data.soumaDiveFromGracePreviousPosition[data.me];
          if (num === 1) {
            if (pos === "middle") return output.southTower3({ inout: inout });
            if (pos === "east" || pos === "west") return inout;
          } else if (num === 2) {
            if (pos === "west") return output.westTower3({ inout: inout });
            if (pos === "east") return output.eastTower3({ inout: inout });
          }
        }
        return inout;
      },
      outputStrings: {
        unknown: Outputs.unknown,
        in: Outputs.in,
        out: Outputs.out,
        unknownTower: {
          en: "${inout} + 踩塔",
        },
        southTower1: {
          en: "${inout} + 下踩塔",
        },
        southTower3: {
          en: "${inout} + 下踩塔",
        },
        circleTowers1: {
          en: "${inout} + 踩塔(预站位)",
        },
        circleTowers3: {
          en: "${inout} + 踩塔(预站位)",
        },
        upArrowTower1: {
          en: "${inout} + 右踩塔",
        },
        downArrowTower1: {
          en: "${inout} + 左踩塔",
        },
        upArrowTower3: {
          en: "${inout} + 右踩塔",
        },
        downArrowTower3: {
          en: "${inout} + 左踩塔",
        },
        westTower3: {
          en: "${inout} + 左踩塔 ",
        },
        eastTower3: {
          en: "${inout} + 右踩塔 ",
        },
      },
    },
    {
      id: "DSR Dive From Grace Post Dive",
      netRegex: NetRegexes.ability({ id: ["670E", "670F", "6710"], capture: false }),
      preRun: (data) => (data.soumaDiveFromGraceTowerCounter = (data.soumaDiveFromGraceTowerCounter ?? 0) + 1),
      delaySeconds: 0.2,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const num = data.soumaDiveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Tower 1 and 2: missing number: ${JSON.stringify(data.soumaDiveFromGraceNum)}`);
          return;
        }
        const [nameA, nameB, nameC] = [
          ...Object.keys(data.soumaDiveFromGracePositions).sort((keyA, keyB) => {
            const posA = data.soumaDiveFromGracePositions[keyA];
            const posB = data.soumaDiveFromGracePositions[keyB];
            if (posA === undefined || posB === undefined) return 0;
            return posA - posB;
          }),
          output.unknown(),
          output.unknown(),
          output.unknown(),
        ];
        if (data.soumaDiveFromGraceTowerCounter !== 2) {
          data.soumaDiveFromGracePreviousPosition[nameA] = "west";
          data.soumaDiveFromGracePreviousPosition[nameB] = "middle";
          data.soumaDiveFromGracePreviousPosition[nameC] = "east";
        } else {
          data.soumaDiveFromGracePreviousPosition[nameA] = "west";
          data.soumaDiveFromGracePreviousPosition[nameB] = "east";
        }
        if (num === 1 && data.soumaDiveFromGraceTowerCounter === 2) {
          if (data.soumaDiveFromGracePreviousPosition[data.me] === "west") return output.northwestTower2();
          if (data.soumaDiveFromGracePreviousPosition[data.me] === "east") return output.northeastTower2();
          if (data.soumaDiveFromGracePreviousPosition[data.me] === "middle") return;
          return output.unknownTower();
        }
      },
      run: (data) => (data.soumaDiveFromGracePositions = {}),
      outputStrings: {
        unknown: Outputs.unknown,
        unknownTower: {
          en: "踩二塔",
        },
        northwestTower2: {
          en: "左上踩塔",
        },
        northeastTower2: {
          en: "右上踩塔",
        },
      },
    },
    {
      id: "DSR Darkdragon Dive Single Tower",
      netRegex: NetRegexes.ability({ id: "6711" }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const num = data.soumaDiveFromGraceNum[data.me];
        if (!num) {
          console.error(`DFG Dive Single Tower: missing number: ${JSON.stringify(data.soumaDiveFromGraceNum)}`);
          return output.text();
        }
        if (data.soumaDiveFromGraceTowerCounter === 2) {
          data.soumaStackAfterGeirskogul = true;
          return;
        }
        return output.text();
      },
      run: (data) => (data.soumaWaitingForGeirskogul = true),
      outputStrings: {
        text: {
          en: "引导",
        },
      },
    },
    {
      id: "DSR Geirskogul",
      netRegex: NetRegexes.startsUsing({ id: "670A", capture: false }),
      condition: (data) => data.soumaWaitingForGeirskogul,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.soumaWaitingForGeirskogul) return;
        if (data.soumaStackAfterGeirskogul) {
          const inout = output[data.soumaDiveFromGraceLashGnashKey]();
          return output.stackInOut({ inout: inout });
        }
        return output.move();
      },
      run: (data) => {
        delete data.soumaWaitingForGeirskogul;
        delete data.soumaStackAfterGeirskogul;
      },
      outputStrings: {
        in: Outputs.in,
        out: Outputs.out,
        unknown: Outputs.unknown,
        stackInOut: {
          en: "分摊 => ${inout}",
        },
        move: Outputs.moveAway,
      },
    },
    {
      id: "DSR P3 8人塔",
      netRegex: NetRegexes.startsUsing({
        id: ["6717", "6718", "6719", "671A"],
      }),
      durationSeconds: 10,
      promise: async (data, matches) => {
        const towers = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.sourceId, 16)],
          })
        ).combatants?.[0];
        const towerLen = parseInt(matches.id, 16) - 26390;
        if (!towers) return;
        const [x, y] = [towers.PosX, towers.PosY];
        let towerDir = -1;
        if (Math.abs(x - 92) <= 3 && Math.abs(y - 92) <= 3) towerDir = 0;
        else if (Math.abs(x - 108) <= 3 && Math.abs(y - 92) <= 3) towerDir = 1;
        else if (Math.abs(x - 108) <= 3 && Math.abs(y - 108) <= 3) towerDir = 2;
        else if (Math.abs(x - 92) <= 3 && Math.abs(y - 108) <= 3) towerDir = 3;
        data.soumaP38PersonTower.push({ dirNum: towerDir, len: towerLen });
      },
      response: (data, _matches, output) => {
        if (data.soumaP38PersonTower.length === 4) {
          const povRp = data.soumaFL.getRpByName(data, data.me);
          const tower = data.soumaP38PersonTower.slice().sort((a, b) => a.dirNum - b.dirNum);
          data.soumaP38PersonTower.length = 0;
          const myStandingIndex = [
            output.左上换位(),
            output.右上换位(),
            output.右下换位(),
            output.左下换位(),
          ].findIndex((v) => v === povRp);
          if (myStandingIndex === -1)
            return {
              alertText: tower.map((v) => v.len).join(" "),
              tts: output.stay(),
            };
          if (tower[myStandingIndex].len === 1) {
            let targetDirNum = -1;
            switch (tower[myStandingIndex].dirNum) {
              case 0:
                if (tower[1].len >= 3) targetDirNum = 1;
                else if (tower[3].len >= 3) targetDirNum = 3;
                else if (tower[2].len >= 3) targetDirNum = 2;
                break;
              case 1:
                if (tower[2].len >= 3) targetDirNum = 2;
                else if (tower[0].len >= 3) targetDirNum = 0;
                else if (tower[3].len >= 3) targetDirNum = 3;
                break;
              case 2:
                if (tower[3].len >= 3) targetDirNum = 3;
                else if (tower[1].len >= 3) targetDirNum = 1;
                else if (tower[0].len >= 3) targetDirNum = 0;
                break;
              case 3:
                if (tower[0].len >= 3) targetDirNum = 0;
                else if (tower[2].len >= 3) targetDirNum = 2;
                else if (tower[1].len >= 3) targetDirNum = 1;
                break;
            }
            if (targetDirNum < 0) return;
            return {
              alertText: tower.map((v) => v.len).join(" "),
              tts: output.move({
                dir: [direction.NW, direction.NE, direction.SE, direction.SW]?.[targetDirNum],
              }),
            };
          } else if (tower[myStandingIndex].len >= 2)
            return {
              alertText: tower.map((v) => v.len).join(" "),
              tts: output.stay(),
            };
        }
      },
      outputStrings: {
        左上换位: { en: "MT" },
        右上换位: { en: "ST" },
        右下换位: { en: "D2" },
        左下换位: { en: "D1" },
        stay: { en: "不动" },
        move: { en: "去${dir}塔" },
      },
    },
    {
      id: "DSR P3 八人塔连线",
      netRegex: NetRegexes.tether({ id: "0054" }),
      condition: (data, matches) =>
        data.role === "tank" &&
        ["尼德霍格", "Nidhogg", "ニーズヘッグ"].includes(matches.source) &&
        data.soumaP3BossId !== matches.sourceId,
      suppressSeconds: 30,
      promise: async (data, matches, output) => {
        const kage = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.sourceId, 16)],
          })
        ).combatants?.[0];
        if (!kage) {
          console.error("kage is undefined", v);
          return;
        }
        const [x, y] = [kage.PosX, kage.PosY];
        if (x < 100 && y < 100) data.soumaP38TowersTetherRes = output.LT();
        else if (x >= 100 && y < 100) data.soumaP38TowersTetherRes = output.RT();
        else if (x >= 100 && y >= 100) data.soumaP38TowersTetherRes = output.RB();
        else if (x < 100 && y >= 100) data.soumaP38TowersTetherRes = output.LB();
      },
      alertText: (data) => data.soumaP38TowersTetherRes,
      outputStrings: {
        LT: { en: "左上(4点)死刑" },
        RT: { en: "右上(1点)死刑" },
        RB: { en: "右下(2点)死刑" },
        LB: { en: "左下(3点)死刑" },
      },
    },
    {
      id: "DSR P4 龙眼第一次连线",
      netRegex: NetRegexes.tether({ id: ["0033", "0034"] }),
      condition: (data, matches) => matches.source === data.me,
      suppressSeconds: 120,
      alertText: (data, matches, output) => {
        const blue = output.撞蓝球组().split("/");
        const red = output.撞黄球组().split("/");
        const povRp = data.soumaFL.getRpByName(data, data.me);
        if (blue.includes(povRp)) {
          return matches.id === "0033" ? output.noMove() : output.switch();
        }
        if (red.includes(povRp)) {
          return matches.id === "0034" ? output.noMove() : output.switch();
        }
      },
      outputStrings: {
        撞蓝球组: { en: ["MT", "ST", "H1", "H2"].join("/") },
        撞黄球组: { en: ["D1", "D2", "D3", "D4"].join("/") },
        noMove: {
          en: "不动",
        },
        switch: {
          en: "换色",
        },
      },
    },
    {
      id: "DSR Right Eye Blue Tether",
      netRegex: NetRegexes.tether({ id: "0033" }),
      condition: (data, matches) => matches.source === data.me,
      infoText: (_data, _matches, output) => output.text(),
      tts: null,
      outputStrings: {
        text: {
          en: "蓝",
        },
      },
    },
    {
      id: "DSR Left Eye Red tether",
      netRegex: NetRegexes.tether({ id: "0034" }),
      condition: (data, matches) => matches.source === data.me,
      infoText: (_data, _matches, output) => output.text(),
      tts: null,
      outputStrings: {
        text: {
          en: "红",
        },
      },
    },
    {
      id: "DSR 黄球",
      netRegex: NetRegexes.tether({ id: ["0033", "0034"] }),
      delaySeconds: 6,
      suppressSeconds: 120,
      condition: (data) => data.role === "dps",
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "黄球撞",
        },
      },
    },
    {
      id: "DSR 蓝球",
      netRegex: NetRegexes.tether({ id: ["0033", "0034"] }),
      delaySeconds: 12,
      suppressSeconds: 120,
      condition: (data) => data.role !== "dps",
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "蓝球撞",
        },
      },
    },
    {
      id: "DSR Eyes Dive 第一组收集",
      netRegex: NetRegexes.ability({ id: "68C4" }),
      condition: (data) => data.soumaP4DiveFirstGroup.length < 2,
      preRun: (data, matches, output) => {
        data.soumaP4DiveFirstGroup.push(data.soumaFL.getRpByName(data, matches.target));
        if (data.soumaP4DiveFirstGroup.length === 2) {
          data.soumaP4DiveFirstGroup = universalSortMarking(data.soumaP4DiveFirstGroup, output.sort().split("/"));
        }
      },
      infoText: () => {},
      outputStrings: {
        sort: { en: ["MT", "ST", "H1", "H2"].join("/") },
      },
    },
    {
      id: "DSR Eyes Dive Counter",
      netRegex: NetRegexes.ability({ id: "68C4", capture: false }),
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        if (data.soumaDiveCounter === 4) return { infoText: output.over() };
        const group =
          data.soumaDiveCounter < 3 ? output[`role${data.soumaDiveCounter}`]() : data.soumaP4DiveFirstGroup.join("/");
        let tts;
        const i = group.split("/").findIndex((v) => v === data.soumaFL.getRpByName(data, data.me));
        if (i === -1) tts = data.soumaDiveCounter;
        if (i === 0) tts = output.forward();
        if (i === 1) tts = output.backward();
        return {
          infoText: `#${output[`dive${data.soumaDiveCounter}`]()} ${output.go({
            text: group
              .split("/")
              .map((v) => handleDistributeName(data, v))
              .join("/"),
          })}`,
          tts: tts,
        };
      },
      run: (data) => data.soumaDiveCounter++,
      outputStrings: {
        dive1: Outputs.num1,
        dive2: Outputs.num2,
        dive3: Outputs.num3,
        dive4: Outputs.num4,
        role1: { en: ["D1", "D2"].join("/") },
        role2: { en: ["D3", "D4"].join("/") },
        go: { en: "${text}补位" },
        forward: { en: "顺顺顺" },
        backward: { en: "逆逆逆" },
        over: { en: "结束" },
      },
    },
    {
      id: "DSR Eyes Dive Cast",
      netRegex: NetRegexes.startsUsing({ id: "68C3", capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "幻象冲",
        },
      },
    },

    {
      id: "DSR Spear of the Fury Limit Break",
      netRegex: NetRegexes.startsUsing({ id: "62E2", capture: false }),
      condition: (data) => data.role === "tank" && data.soumaPhase === "haurchefant",
      delaySeconds: 10 - 2.8,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "坦克LB！！",
        },
      },
    },

    {
      id: "DSR Ancient Quaga",
      netRegex: NetRegexes.startsUsing({ id: "63C6", capture: false }),
      response: Responses.aoe(),
    },
    {
      id: "DSR Holiest of Holy",
      netRegex: NetRegexes.startsUsing({ id: "62D4", capture: false }),
      response: Responses.aoe(),
    },
    {
      id: "DSR Eyes Steep in Rage",
      netRegex: NetRegexes.startsUsing({ id: "68BD", capture: false }),
      suppressSeconds: 1,
      response: Responses.bigAoe("alert"),
    },
    {
      id: "DSR Heavenly Heel",
      netRegex: NetRegexes.startsUsing({ id: "63C7" }),
      response: Responses.tankBusterSwap("alert", "alert"),
    },
    {
      id: "DSR Skyblind",
      netRegex: NetRegexes.gainsEffect({ effectId: "A65" }), //苍穹刻印
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      response: Responses.moveAway(),
    },
    {
      id: "DSR Brightwing Move",
      netRegex: NetRegexes.ability({ id: "6319", capture: false }), //光翼闪
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway("alert"),
    },
    {
      id: "DSR Ascalon's Mercy Concealed",
      netRegex: NetRegexes.startsUsing({ id: ["63C8"] }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      response: Responses.moveAway(),
    },
    {
      id: "DSR Wrath Spiral Pierce",
      netRegex: NetRegexes.tether({ id: "0005" }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "连线点名",
        },
      },
    },
    {
      id: "DSR P5一运找北",
      netRegex: NetRegexes.tether({ id: "0005" }),
      suppressSeconds: 3,
      promise: async (data) => {
        const vedrfolnir = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        )?.combatants?.find((c) => c.BNpcID === 12646);
        data.soumaP5NorthIndex = myMatchedPositionToDir(vedrfolnir?.PosX, vedrfolnir?.PosY, 8);
      },
    },
    {
      id: "DSR Wrath Skyward Leap",
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alarmText: (data, matches, output) => {
        if (getHeadmarkerId(data, matches) === headmarkers.skywardSingle) return output.leapOnYou();
      },
      outputStrings: {
        leapOnYou: {
          en: "蓝球点名",
        },
      },
    },
    {
      id: "DSR Twisting Dive",
      netRegex: NetRegexes.ability({ id: "6B8B", capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: {
          en: "旋风旋风",
        },
      },
    },
    {
      id: "DSR Wrath Cauterize Marker",
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alarmText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.cauterize) return output.diveOnYou();
      },
      outputStrings: {
        diveOnYou: {
          en: "去法师",
        },
      },
    },
    {
      id: "DSR P5一运水波",
      netRegex: NetRegexes.startsUsing({ id: "63CA", capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "散开" },
      },
    },
    {
      id: "DSR Playstation2 Fire Chains No Marker",
      disable: true,
      netRegex: NetRegexes.headMarker(),
    },
    {
      id: "DSR Playstation2 Fire Chains Unexpected Pair",
      disable: true,
      netRegex: NetRegexes.headMarker(),
    },
    {
      id: "DSR P5一运找NPC",
      netRegex: NetRegexes.ability({ id: "6B8F" }),
      delaySeconds: 1,
      durationSeconds: 20,
      suppressSeconds: 3,
      promise: async (data) => {
        data.soumaP5Charibert = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        ).combatants.find((c) => c.BNpcID === 12603);
      },
      infoText: (data, _matches, output) => {
        if (!data.soumaP5Charibert) return;
        const pos = myMatchedPositionToDir(data.soumaP5Charibert.PosX, data.soumaP5Charibert.PosY, 8);
        const dir = output[`safe${pos}`]();
        const way = pos - data.soumaP5NorthIndex === 0 ? output.north() : output.south();
        data.soumaFL.doTextCommand("/e " + dir.toUpperCase().repeat(3));
        return output.safe({ way: way, dir: dir });
      },
      sound: "",
      soundVolume: 0,
      outputStrings: {
        safe0: { en: "C" },
        safe2: { en: "D" },
        safe4: { en: "A" },
        safe6: { en: "B" },
        safe: { en: "${way}/${dir}点月环" },
        south: { en: "上" },
        north: { en: "下" },
      },
    },
    {
      id: "DSR Wrath Thunderstruck Targets",
      netRegex: NetRegexes.ability({ id: "6B8F" }),
      condition: (data, matches) => data.me === matches.target,
      delaySeconds: 12,
      alertText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: {
          en: "出去放雷",
        },
      },
    },
    {
      id: "DSR Wrath Thunderstruck",
      netRegex: NetRegexes.ability({ id: "6B8F" }),
      preRun: (data, matches) => data.soumaP5ThunderStruck.push(data.soumaFL.getRpByName(data, matches.target)),
      durationSeconds: 14,
      alarmText: (data, _matches, output) => {
        if (data.soumaP5ThunderStruck.length === 2) {
          const _ = [...data.soumaP5ThunderStruck];
          data.soumaP5ThunderStruck.length = 0;
          const arr = universalSortMarking(_, output.优先级().split("/"));
          const pov = data.soumaFL.getRpByName(data, data.me);
          if (output.标记() === "开" || output.标记() === "true" || output.标记() === "1" || output.标记() === "是") {
            const local =
              output.本地标点() === "开" ||
              output.本地标点() === "true" ||
              output.本地标点() === "1" ||
              output.本地标点() === "是";
            data.soumaFL.mark(data.soumaFL.getHexIdByRp(data, arr[0]), data.soumaData.targetMakers.禁止1, local);
            data.soumaFL.mark(data.soumaFL.getHexIdByRp(data, arr[1]), data.soumaData.targetMakers.禁止2, local);
          }
          if (!arr.includes(pov)) return null;
          return output.text({
            n1: handleDistributeName(data, arr[0]),
            n2: handleDistributeName(data, arr[1]),
          });
        }
      },
      tts: null,
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: {
          en: "雷点名：${n1} / ${n2}",
        },
        优先级: {
          en: ["H1", "H2", "MT", "ST", "D1", "D2", "D3", "D4"].join("/"),
        },
        标记: { en: "关" },
        本地标点: { en: "否" },
      },
    },
    {
      id: "DSR P5一运开始清理脑袋上的标记",
      netRegex: NetRegexes.startsUsing({ id: "6B89", capture: false }),
      run: (data, _matches, output) => {
        if (
          output.P5一运开始清空标记() === "开" ||
          output.P5一运开始清空标记() === "true" ||
          output.P5一运开始清空标记() === "1" ||
          output.P5一运开始清空标记() === "是"
        )
          data.soumaFL.clearMark();
      },
      outputStrings: {
        P5一运开始清空标记: {
          en: "否",
        },
      },
    },
    {
      id: "DSR P5一运结束清理脑袋上的标记",
      netRegex: NetRegexes.startsUsing({ id: "63C6", capture: false }),
      run: (data, _matches, output) => {
        if (
          output.P5一运结束清空标记() === "开" ||
          output.P5一运结束清空标记() === "true" ||
          output.P5一运结束清空标记() === "1" ||
          output.P5一运结束清空标记() === "是"
        )
          data.soumaFL.clearMark();
      },
      outputStrings: {
        P5一运结束清空标记: {
          en: "否",
        },
      },
    },
    {
      id: "DSR Doom Gain",
      netRegex: NetRegexes.gainsEffect({ effectId: "BA0" }),
      preRun: (data, matches) => {
        data.soumaP5Doom.push(data.soumaFL.getRpByName(data, matches.target));
      },
      alertText: (data, _matches, output) => {
        if (data.soumaP5Doom.length === 4) {
          const pov = data.soumaFL.getRpByName(data, data.me);
          const sort = output.优先级().split("/");
          const doom = universalSortMarking(data.soumaP5Doom, sort);
          const notDoom = sort.filter((v) => !doom.includes(v));
          const myDoom = doom.findIndex((v) => v === pov);
          const myNotDoom = notDoom.findIndex((v) => v === pov);
          if (myDoom === 0) return output.doom1();
          else if (myDoom === 1) return output.doom2();
          else if (myDoom === 2) return output.doom3();
          else if (myDoom === 3) return output.doom4();
          else if (myNotDoom === 0) return output.notDoom1();
          else if (myNotDoom === 1) return output.notDoom2();
          else if (myNotDoom === 2) return output.notDoom3();
          else if (myNotDoom === 3) return output.notDoom4();
        }
      },
      durationSeconds: 10,
      run: (data, matches) => (data.soumaHasDoom[matches.target] = true),
      outputStrings: {
        text: {
          en: "死宣点名",
        },
        优先级: {
          en: ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"].join("/"),
        },
        doom1: { en: `上,死1去左内标点 => 快穿` },
        doom2: { en: `上,死2去左上偏上 => 快穿` },
        doom3: { en: `上,死3去右上偏上 => 快穿` },
        doom4: { en: `上,死4去右内标点 => 快穿` },
        notDoom1: { en: `下,光1去最左 => 慢穿` },
        notDoom2: { en: `下,光2去左下偏下 => 慢穿` },
        notDoom3: { en: `下,光3去右下偏下 => 慢穿` },
        notDoom4: { en: `下,光4最右 => 慢穿` },
        注: { en: "辉夜姬横向排队式" },
      },
    },
    {
      id: "DSR Playstation2 Fire Chains",
      netRegex: NetRegexes.headMarker(),
      condition: (data) => data.soumaPhase === "thordan2",
      alertText: (data, matches, output) => {
        if (data.me !== matches.target) return;
        const id = getHeadmarkerId(data, matches);
        const soumaHasDoom = data.soumaHasDoom[data.me];
        if (soumaHasDoom) {
          if (id === headmarkers.firechainCircle) return output.circleWithDoom();
          else if (id === headmarkers.firechainTriangle) return output.triangleWithDoom();
          else if (id === headmarkers.firechainSquare) return output.squareWithDoom();
        } else {
          if (id === headmarkers.firechainTriangle) return output.triangle();
          else if (id === headmarkers.firechainSquare) return output.square();
          else if (id === headmarkers.firechainX) return output.cross();
        }
      },
      outputStrings: {
        triangle: {
          en: "左上左上", //绿角无死宣
        },
        square: {
          en: "右上右上", //紫色无死宣
        },
        cross: { en: "叉叉（左去上，右去下）" }, //蓝叉
        circleWithDoom: {
          en: "左右左右", //红圆（死宣）
        },
        triangleWithDoom: {
          en: "右下右下", // 绿角（死宣）
        },
        squareWithDoom: {
          en: "左下左下", //紫方（死宣）
        },
      },
    },
    {
      id: "DSR Dragon's Gaze",
      netRegex: NetRegexes.startsUsing({ id: "63D0", capture: false }),
      durationSeconds: 5,
      response: Responses.lookAway("alert"),
    },
    {
      id: "DSR Drachenlance",
      netRegex: NetRegexes.startsUsing({ id: "670C", capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: "DSR Adds Phase Nidhogg",
      netRegex: NetRegexes.addedCombatantFull({
        npcNameId: "3458",
        npcBaseId: "12612",
      }),
      run: (data, matches) => (data.soumap6AddsPhaseNidhoggId = matches.id),
    },
    {
      id: "DSR Adds Phase Hraesvelgr",
      netRegex: NetRegexes.addedCombatantFull({
        npcNameId: "4954",
        npcBaseId: "12613",
      }),
      run: (data, matches) => (data.soumap6AddsPhaseHraesvelgrId = matches.id),
    },
    {
      id: "DSR P6 冰火线计数",
      netRegex: NetRegexes.tether({ id: ["00C2", "00C3", "00C4"] }),
      suppressSeconds: 999,
      delaySeconds: 20,
      run: (data) => (data.soumaP6IceFireConnectionCount = 2),
    },
    {
      id: "DSR P6 冰火线1",
      netRegex: NetRegexes.tether({ id: ["00C2", "00C3", "00C4"] }),
      condition: (data) => data.soumaP6IceFireConnectionCount === 1,
      preRun: (data, matches) => {
        data.soumaP6IceFireConnectionArr.push({
          rp: data.soumaFL.getRpByName(data, matches.source),
          tether: matches.id,
          source: {
            hraesvelgr: ["赫拉斯瓦尔格", "Hraesvelgr", "フレースヴェルグ"].includes(matches.target),
            nidhogg: ["尼德霍格", "Nidhogg", "ニーズヘッグ"].includes(matches.target),
          },
        });
      },
      response: (data, _matches, output) => {
        if (data.soumaP6IceFireConnectionArr.length === 6 && data.soumaP6IceFireConnectionCount === 1) {
          const _ = data.soumaP6IceFireConnectionArr.slice();
          data.soumaP6IceFireConnectionArr.length = 0;
          const tethers = {};
          for (let i = 0; i < _.length; i++) {
            const v = _[i];
            if (v.source.hraesvelgr) tethers[v.rp] = "ice";
            else if (v.source.nidhogg) tethers[v.rp] = "fire";
            else console.error(v);
          }
          const group = {
            mid: output.mid().split("/"),
            left: output.left().split("/"),
            right: output.right().split("/"),
          };
          const hasSame = {
            mid: tethers[group.mid[0]] === tethers[group.mid[1]],
            left: tethers[group.left[0]] === tethers[group.left[1]],
            right: tethers[group.right[0]] === tethers[group.right[1]],
          };
          const pov = data.soumaFL.getRpByName(data, data.me);
          let res;
          if (!hasSame.mid && !hasSame.left && !hasSame.right) res = { infoText: output.allDifferent() };
          else if (hasSame.mid && hasSame.left && !hasSame.right)
            res = {
              infoText: output.hasDifferent({
                w1: "中间",
                r1: group.mid[0],
                w2: "左下",
                r2: group.left[0],
              }),
              tts: didIChange("中间", group.mid[0], "左下", group.left[0]),
            };
          else if (hasSame.mid && !hasSame.left && hasSame.right)
            res = {
              infoText: output.hasDifferent({
                w1: "中间",
                r1: group.mid[0],
                w2: "右下",
                r2: group.right[0],
              }),
              tts: didIChange("中间", group.mid[0], "右下", group.right[0]),
            };
          else if (!hasSame.mid && hasSame.left && hasSame.right)
            res = {
              infoText: output.hasDifferent({
                w1: "左下",
                r1: group.left[0],
                w2: "右下",
                r2: group.right[0],
              }),
              tts: didIChange("左下", group.left[0], "右下", group.right[0]),
            };
          data.soumaP6IceFireConnectionCount = -1;
          data.soumaFL.doTextCommand("/e " + res.infoText);
          if (data.role === "tank") return;
          return res;
          function didIChange(way1, role1, way2, role2) {
            if (role1 === pov) {
              return output.ttsChange({ way: way2 });
            } else if (role2 === pov) {
              return output.ttsChange({ way: way1 });
            } else {
              return output.ttsStay();
            }
          }
        }
      },
      outputStrings: {
        mid: {
          en: ["D2", "D1"].join("/"),
        },
        left: {
          en: ["D3", "H1"].join("/"),
        },
        right: {
          en: ["D4", "H2"].join("/"),
        },
        注: { en: "写在前面的负责换位" },
        allDifferent: {
          en: "都不用动",
        },
        hasDifferent: {
          en: "${w1}（${r1}）与${w2}（${r2}）换",
        },
        ttsChange: {
          en: "去${way}",
        },
        ttsStay: { en: "不动" },
      },
    },
    {
      id: "DSR P6 冰火线2",
      netRegex: NetRegexes.tether({ id: ["00C2", "00C3", "00C4"] }),
      condition: (data, matches) => data.soumaP6IceFireConnectionCount === 2 && data.me === matches.source,
      promise: (data) => data.soumaFL.waitForData(data, "soumaP6NidhoggGlowing"),
      suppressSeconds: 20,
      infoText: (data, matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (output.打法() === "四固定") {
          if (data.role === "tank") return;
          switch (pov) {
            case "H1":
            case "H2":
            case "D2":
            case "D4":
              return output[`四固定${pov}`]();
            case "D3":
              return data.soumaP6NidhoggGlowing ? output.四固定D3Stay() : output.四固定D3Move();
            case "D1":
              // return matches.id === "00C2" ? output.D1Fire() : output.D1Ice();
              if (["赫拉斯瓦尔格", "Hraesvelgr", "フレースヴェルグ"].includes(matches.target))
                return output.四固定D1Ice();
              else if (["尼德霍格", "Nidhogg", "ニーズヘッグ"].includes(matches.target)) return output.四固定D1Fire();
              else console.error(matches);
          }
        } else if (output.打法() === "六固定") {
          return output[`六固定${pov}`]();
        }
      },
      outputStrings: {
        打法: { en: "六固定" },
        四固定H1: { en: "正北" },
        四固定H2: { en: "正南" },
        四固定D1Fire: { en: "右偏下" },
        四固定D1Ice: { en: "左偏下" },
        四固定D2: { en: "右下贴右" },
        四固定D3Stay: { en: "左上左上" },
        四固定D3Move: { en: "右上右上" },
        四固定D4: { en: "左下贴左" },
        六固定H1: { en: "正北" },
        六固定H2: { en: "正南" },
        六固定D1: { en: "A点右下" },
        六固定D2: { en: "C点左上" },
        六固定D3: { en: "右上固定" },
        六固定D4: { en: "左下固定" },
      },
    },
    {
      id: "DSR Great Wyrmsbreath Nidhogg Not Glowing",
      netRegex: NetRegexes.startsUsing({ id: "6D32", capture: false }),
      infoText: (data, _matches, output) => {
        data.soumaP6NidhoggGlowing = false;
        if (data.role === "tank")
          return data.soumaFL.getRpByName(data, data.me) === output.邪龙T() ? output.you() : output.notYou();
      },
      outputStrings: {
        you: {
          en: "场边死刑",
        },
        notYou: {
          en: "场边闲T",
        },
        邪龙T: {
          en: "MT",
        },
      },
    },
    {
      id: "DSR Great Wyrmsbreath Hraesvelgr Not Glowing",
      netRegex: NetRegexes.startsUsing({ id: "6D34", capture: false }),
      infoText: (data, _matches, output) => {
        data.soumaP6HraesvelgrGlowing = false;
        if (data.role === "tank")
          return data.soumaFL.getRpByName(data, data.me) === output.圣龙T() ? output.you() : output.notYou();
      },
      outputStrings: {
        you: {
          en: "场边死刑",
        },
        notYou: {
          en: "场边闲T",
        },
        圣龙T: {
          en: "ST",
        },
      },
    },
    {
      id: "DSR P6十字火前",
      netRegex: NetRegexes.startsUsing({ id: "6D45", capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "看邪龙",
        },
      },
    },
    {
      id: "DSR Great Wyrmsbreath Nidhogg Glowing",
      netRegex: NetRegexes.startsUsing({ id: "6D33", capture: false }),
      run: (data) => (data.soumaP6NidhoggGlowing = true),
    },
    {
      id: "DSR Great Wyrmsbreath Hraesvelgr Glowing",
      netRegex: NetRegexes.startsUsing({ id: "6D35", capture: false }),
      run: (data) => (data.soumaP6HraesvelgrGlowing = true),
    },
    {
      id: "DSR Great Wyrmsbreath Both Glowing",
      netRegex: NetRegexes.startsUsing({
        id: ["6D33", "6D35"],
        capture: false,
      }),
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        if (!(data.role === "tank")) return;
        if (!data.soumaP6HraesvelgrGlowing || !data.soumaP6NidhoggGlowing) return;
        return { alertText: output.sharedBuster() };
      },
      outputStrings: {
        sharedBuster: {
          en: "分摊死刑",
        },
      },
    },
    {
      id: "DSR P6双龙发光回收",
      netRegex: NetRegexes.startsUsing({
        id: ["6D33", "6D35"],
        capture: false,
      }),
      delaySeconds: 15,
      run: (data) => {
        data.soumaP6HraesvelgrGlowing = null;
        data.soumaP6NidhoggGlowing = null;
      },
    },
    {
      id: "DSR Akh Afah",
      netRegex: NetRegexes.startsUsing({
        id: ["6D41", "6D43"],
        capture: false,
      }),
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.groups(),
      outputStrings: {
        groups: {
          en: "分组分摊 平血",
        },
      },
    },
    {
      id: "DSR 分摊后看白龙",
      netRegex: NetRegexes.startsUsing({
        id: ["6D41", "6D43"],
        capture: false,
      }),
      suppressSeconds: 2,
      delaySeconds: 9,
      infoText: (_data, _matches, output) => output.look(),
      outputStrings: {
        look: {
          en: "看圣龙",
        },
      },
    },
    {
      id: "DSR Hallowed Wings and Plume",
      netRegex: NetRegexes.startsUsing({
        id: ["6D23", "6D24", "6D26", "6D27"],
      }),
      preRun: (data) => data.soumaP6HallowedWingsCount++,
      durationSeconds: 6,
      promise: async (data) => {
        if (data.soumaP6HallowedWingsCount !== 1) return;
        const id = data.soumap6AddsPhaseNidhoggId;
        if (id === undefined) return;
        data.soumaP6CombatantData = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(id, 16)],
          })
        ).combatants;
        if (data.soumaP6CombatantData.length === 0) console.error(`Hallowed: no Nidhoggs found`);
        else if (data.soumaP6CombatantData.length > 1)
          console.error(`Hallowed: unexpected number of Nidhoggs: ${JSON.stringify(data.soumaP6CombatantData)}`);
      },
      alertText: (data, matches, output) => {
        const wings = matches.id === "6D23" || matches.id === "6D24" ? output.left() : output.right();
        let head;
        const isHeadDown = matches.id === "6D23" || matches.id === "6D26";
        if (isHeadDown) head = data.role === "tank" ? output.tanksNear() : output.partyFar();
        else head = data.role === "tank" ? output.tanksFar() : output.partyNear();
        const [nidhogg] = data.soumaP6CombatantData;
        if (nidhogg !== undefined && data.soumaP6CombatantData.length === 1) {
          const dive = nidhogg.PosX < 100 ? output.forward() : output.backward();
          return output.wingsDiveHead({
            wings: wings,
            dive: data.soumaP6HallowedWingsCount === 1 ? dive : "",
            head: head,
          });
        }
        return output.wingsHead({ wings: wings, head: head });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        forward: {
          en: "前场",
        },
        backward: {
          en: "后场",
        },
        partyNear: {
          en: "靠近",
        },
        tanksNear: {
          en: "靠近",
        },
        partyFar: {
          en: "远离",
        },
        tanksFar: {
          en: "远离",
        },
        wingsHead: {
          en: "${wings}, ${head}",
        },
        wingsDiveHead: {
          en: "${wings}${dive}+${head}",
        },
      },
    },
    {
      id: "DSR P6火球获取",
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: "13238" }),
      run: (data, matches) => data.soumaP6FireBall.push({ x: matches.x, y: matches.y }),
    },
    {
      id: "DSR P6火球判断",
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: "13238" }),
      condition: (data) => data.soumaP6FireBall.length === 6,
      promise: async (data, _matches, output) => {
        const hraX = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(data.soumap6AddsPhaseHraesvelgrId, 16)],
          })
        ).combatants[0]?.PosX;
        const arr = data.soumaP6FireBall.slice(-3);
        const ave = {
          x: arr.reduce((p, c) => p + parseFloat(c.x), 0) / 3,
          y: arr.reduce((p, c) => p + parseFloat(c.y), 0) / 3,
        };
        if (hraX < 96) {
          if (100 <= ave.y) data.soumaP6FireBallSafe = output.NE();
          else if (ave.y < 100) data.soumaP6FireBallSafe = output.SE();
        } else {
          if ((ave.x < 100 && 100 <= ave.y) || (100 <= ave.x && 100 <= ave.y)) data.soumaP6FireBallSafe = output.NW();
          else if ((ave.x < 100 && ave.y < 100) || (100 <= ave.x && ave.y < 100))
            data.soumaP6FireBallSafe = output.SW();
        }
      },
      infoText: (data) => data.soumaP6FireBallSafe,
      durationSeconds: 15,
      outputStrings: {
        NW: { en: "右前(4点)起跑 => A" },
        NE: { en: "右后(1点)起跑 => A" },
        SW: { en: "左前(3点)起跑 => C" },
        SE: { en: "左后(2点)起跑 => C" },
      },
    },
    {
      id: "DSR Spreading/Entangled Flame",
      netRegex: NetRegexes.gainsEffect({ effectId: ["AC6", "AC7"] }),
      preRun: (data, matches) => {
        if (matches.effectId === "AC6") data.soumaP6SpreadingFlame.push({ name: matches.target, id: matches.targetId });
        else if (matches.effectId === "AC7")
          data.soumaP6EntangledFlame.push({ name: matches.target, id: matches.targetId });
      },
      response: (data, _matches, output) => {
        if (data.soumaP6SpreadingFlame.length < 4) return;
        if (data.soumaP6EntangledFlame.length < 2) return;
        if (output.标记() === "开" || output.标记() === "true" || output.标记() === "1" || output.标记() === "是") {
          const arr = [data.soumaP6PoisonSecondHolder, data.soumaP6PoisonSecondTarget];
          const black = data.soumaP6SpreadingFlame.map((v) => v.id).sort(sort);
          const white = data.soumaP6EntangledFlame.map((v) => v.id).sort(sort);
          const nobuff = data.party.partyIds_
            .slice()
            .filter((v) => !(black.includes(v) || white.includes(v)))
            .sort(sort);
          const local =
            output.本地标点() === "开" ||
            output.本地标点() === "true" ||
            output.本地标点() === "1" ||
            output.本地标点() === "是";
          data.soumaFL.mark(black[0], data.soumaData.targetMakers.攻击1, local);
          data.soumaFL.mark(black[1], data.soumaData.targetMakers.攻击2, local);
          data.soumaFL.mark(black[2], data.soumaData.targetMakers.攻击3, local);
          data.soumaFL.mark(black[3], data.soumaData.targetMakers.攻击4, local);
          data.soumaFL.mark(nobuff[0], data.soumaData.targetMakers.禁止1, local);
          data.soumaFL.mark(nobuff[1], data.soumaData.targetMakers.禁止2, local);
          data.soumaFL.mark(white[0], data.soumaData.targetMakers.止步1, local);
          data.soumaFL.mark(white[1], data.soumaData.targetMakers.止步2, local);
          function sort(a, b) {
            if (arr.includes(a)) return 1;
            else if (arr.includes(b)) return -1;
            return 0;
          }
        }
        if (data.soumaP6SpreadingFlame.some((v) => v.name === data.me))
          return { alertText: output.spread(), tts: output.spreadTTS() };
        if (data.soumaP6EntangledFlame.some((v) => v.name === data.me))
          return { alertText: output.stack(), tts: output.stackTTS() };
        return { alertText: output.nodebuff(), tts: output.nodebuffTTS() };
      },
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      outputStrings: {
        spread: {
          en: "黑",
        },
        stack: {
          en: "白",
        },
        nodebuff: {
          en: "无",
        },
        spreadTTS: { en: "黑" },
        stackTTS: { en: "白" },
        nodebuffTTS: { en: "无" },
        标记: { en: "关" },
        本地标点: { en: "否" },
        注: { en: "会优先让传毒的2人获得数字更大的标记" },
      },
    },
    {
      id: "DSR Nidhogg Hot Wing",
      netRegex: NetRegexes.startsUsing({ id: "6D2B", capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "内内内",
        },
      },
    },
    {
      id: "DSR Nidhogg Hot Tail",
      netRegex: NetRegexes.startsUsing({ id: "6D2D", capture: false }),
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "外外外",
        },
      },
    },
    {
      id: "DSR Wyrmsbreath 2 Boiling and Freezing",
      netRegex: NetRegexes.gainsEffect({ effectId: ["B52", "B53"] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 6,
      infoText: (_data, matches, output) => {
        if (matches.effectId === "B52") return output.hraesvelgr();
        return output.nidhogg();
      },
      outputStrings: {
        nidhogg: {
          en: "找邪龙",
        },
        hraesvelgr: {
          en: "找圣龙",
        },
      },
    },
    {
      id: "DSR Wyrmsbreath 2 Pyretic",
      netRegex: NetRegexes.gainsEffect({ effectId: ["B52"] }),
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      durationSeconds: 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "停停停停停",
        },
      },
    },
    {
      id: "DSR P6 初始毒",
      netRegex: NetRegexes.gainsEffect({ effectId: ["B50"] }),
      condition: (data) => data.soumaP6Poison === -1,
      infoText: (data, matches, output) => {
        const first = data.soumaFL.getRpByName(data, matches.target);
        return output.text({ first: handleDistributeName(data, first) });
      },
      outputStrings: {
        text: {
          en: "${first}初始毒",
        },
      },
    },
    {
      id: "DSR P6传毒",
      netRegex: NetRegexes.gainsEffect({ effectId: ["B50"] }),
      preRun: (data, matches, output) => {
        if (data.soumaP6Poison === 0) {
          data.soumaP6PoisonSecondHolder = matches.targetId;
          const a = data.soumaP6PoisonArr.slice();
          a.push(data.soumaFL.getRpByName(data, matches.target));
          let arr = output.打法() === "全D" ? output.全Darr().split("/") : output.DTTDDarr().split("/");
          arr = [...arr, ...arr];
          let tar = arr[data.soumaP6Poison];
          if (data.soumaFL.getHexIdByRp(data, tar) === data.soumaP6PoisonSecondHolder)
            tar = arr.find((v) => !a.includes(v));
          data.soumaP6PoisonSecondTarget = data.soumaFL.getHexIdByRp(data, tar);
        }
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      response: (data, matches, output) => {
        data.soumaP6Poison++;
        if (data.soumaP6Poison >= 4) return null;
        const ori = data.soumaFL.getRpByName(data, matches.target);
        data.soumaP6PoisonArr.push(ori);
        let arr;
        let p;
        if (output.打法() === "全D") {
          arr = output.全Darr().split("/");
          p = output.全Dpos().split("/");
        } else if (output.打法() === "DTTDD") {
          arr = output.DTTDDarr().split("/");
          p = output.DTTDDpos().split("/");
        } else {
          console.warn("传毒打法选择错误，默认使用DTTDD");
          arr = output.DTTDDarr().split("/");
          p = output.DTTDDpos().split("/");
        }
        arr = [...arr, ...arr];
        let tar;
        if (data.soumaP6Poison === 3) {
          tar = data.soumaP6PoisonArr[0];
        } else {
          tar = arr[data.soumaP6Poison];
          if (tar === ori) tar = arr.find((v) => !data.soumaP6PoisonArr.includes(v));
        }
        const pos = [...p][data.soumaP6Poison];
        if (output.标记() === "开" || output.标记() === "true" || output.标记() === "1" || output.标记() === "是") {
          const local =
            output.本地标点() === "开" ||
            output.本地标点() === "true" ||
            output.本地标点() === "1" ||
            output.本地标点() === "是";
          data.soumaFL.mark(data.soumaFL.getHexIdByRp(data, ori), data.soumaData.targetMakers.圆圈, local);
          data.soumaFL.mark(data.soumaFL.getHexIdByRp(data, tar), data.soumaData.targetMakers.三角, local);
        }
        return {
          alarmText: output.text({
            ori: handleDistributeName(data, ori),
            tar: handleDistributeName(data, tar),
            pos: pos,
          }),
          tts: [ori, tar].includes(data.soumaFL.getRpByName(data, data.me))
            ? output.do({ pos: pos })
            : output.away({ pos: pos }),
        };
      },
      outputStrings: {
        text: {
          en: "${ori}→${tar}${pos}传毒",
        },
        注: { en: "打法在全D与DTTDD中选择" },
        打法: {
          en: "DTTDD",
        },
        全Darr: {
          en: ["D1", "D2", "D3", "D4"].join("/"),
        },
        全Dpos: {
          en: ["原地", "场中", "原地", "原地"].join("/"),
        },
        DTTDDarr: {
          en: ["MT", "ST", "D1", "D2"].join("/"),
        },
        DTTDDpos: {
          en: ["场中", "场中", "场中", "原地"].join("/"),
        },
        do: {
          en: "${pos}传毒！",
        },
        away: {
          en: "远离${pos}",
        },
        标记: { en: "关" },
        本地标点: { en: "否" },
      },
    },
    {
      id: "DSR Trinity Tank Dark Resistance",
      netRegex: NetRegexes.gainsEffect({
        effectId: "C40",
        count: "02",
      }),
      condition: (data, matches) => data.me === matches.target,
      alertText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 10) return output.text();
      },
      outputStrings: {
        text: {
          en: "关盾二仇",
        },
      },
    },
    {
      id: "DSR Trinity Tank Light Resistance",
      netRegex: NetRegexes.gainsEffect({
        effectId: "C3F",
        count: "02",
      }),
      condition: (data, matches) => data.me === matches.target,
      alertText: (_data, matches, output) => {
        if (parseFloat(matches.duration) > 10) return output.text();
      },
      outputStrings: {
        text: {
          en: "开盾挑衅",
        },
      },
    },
    {
      id: "DSR Flames of Ascalon",
      netRegex: NetRegexes.gainsEffect({
        effectId: "808",
        count: "12A",
        capture: false,
      }),
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "远离远离",
        },
      },
    },
    {
      id: "DSR Ice of Ascalon",
      netRegex: NetRegexes.gainsEffect({
        effectId: "808",
        count: "12B",
        capture: false,
      }),
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "靠近靠近",
        },
      },
    },
    // {
    //   id: "DSR P7 332分摊",
    //   netRegex: NetRegexes.startsUsing({ id: "6D93", capture: false }),
    //   infoText: (data, _matches, output) => {
    //     const pov = data.soumaFL.getRpByName(data, data.me);
    //     if (output.左前().split("/").includes(pov)) return output.left();
    //     else if (output.右前().split("/").includes(pov)) return output.right();
    //     else if (output.背后().split("/").includes(pov)) return output.behind();
    //     else return output.unknown();
    //   },
    //   outputStrings: {
    //     左前: { en: ["H1", "D1", "D3"].join("/") },
    //     left: { en: "左前分摊" },
    //     右前: { en: ["H2", "D2", "D4"].join("/") },
    //     right: { en: "右前分摊" },
    //     背后: { en: ["MT", "ST"].join("/") },
    //     behind: { en: "背后分摊" },
    //     unknown: { en: "332分摊" },
    //   },
    // },
    {
      id: "DSR P7 光暗引导T1",
      netRegex: NetRegexes.startsUsing({ id: "6D9B", capture: false }),
      condition: (data) => data.role === "tank",
      delaySeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "接刀" },
      },
    },
    {
      id: "DSR P7 光暗引导T2",
      netRegex: NetRegexes.startsUsing({ id: "6D93", capture: false }),
      condition: (data) => data.role === "tank",
      delaySeconds: 13,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "接刀" },
      },
    },
    {
      id: "DSR P7 光暗引导T3",
      netRegex: NetRegexes.startsUsing({ id: "6D99", capture: false }),
      condition: (data) => data.role === "tank",
      delaySeconds: 19,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "接刀" },
      },
    },
    {
      id: "DSR P7 光暗引导1",
      netRegex: NetRegexes.startsUsing({ id: "6D9B", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 10,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "D1" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
    {
      id: "DSR P7 光暗引导2",
      netRegex: NetRegexes.startsUsing({ id: "6D9B", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 15,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "D2" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
    {
      id: "DSR P7 光暗引导3",
      netRegex: NetRegexes.startsUsing({ id: "6D93", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 13,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "D3" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
    {
      id: "DSR P7 光暗引导4",
      netRegex: NetRegexes.startsUsing({ id: "6D93", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 18,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "D4" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
    {
      id: "DSR P7 光暗引导5",
      netRegex: NetRegexes.startsUsing({ id: "6D99", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 19,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "H1" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
    {
      id: "DSR P7 光暗引导6",
      netRegex: NetRegexes.startsUsing({ id: "6D99", capture: false }),
      condition: (data) => data.role !== "tank",
      delaySeconds: 26,
      infoText: (data, _matches, output) => {
        const pov = data.soumaFL.getRpByName(data, data.me);
        if (pov === output.role()) return output.you();
        else return output.text({ role: output.role() });
      },
      soundVolume: (data, _matches, output) => (data.soumaFL.getRpByName(data, data.me) === output.role() ? 1 : 0),
      outputStrings: {
        role: { en: "H2" },
        you: { en: "去引导" },
        text: { en: "${role}引导" },
      },
    },
  ],
});
