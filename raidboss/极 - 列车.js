/* eslint-disable @typescript-eslint/ban-ts-comment */
// 在pr#847（原作者 valarnin）的提交基础上进行的修改。2025年12月20日 00:04:52。
// @TODO:
// Could get a slightly more accurate prediction for add phase train stop location
// by adding additional rotation based on delta time between the mechanic headmarker
// and the tank headmarkers
// Train cars are 20y x 30y
// Boss is 10y north of edge
const arenas = {
  '1': {
    x: 100,
    y: 100,
  },
  '2': {
    x: 100,
    y: 150,
  },
  // car 3 happens both before and after add phase
  '3': {
    x: 100,
    y: 200,
  },
  // During add phase, small train firing tank cones is 25y away from center
  // Arena is ~30y circle
  'add': {
    x: -400,
    y: -400,
  },
  '4': {
    x: 100,
    y: 250,
  },
  '5': {
    x: 100,
    y: 300,
  },
  '6': {
    x: 100,
    y: 350,
  },
};
const normalizeDelta = (a) => {
  const TAU = Math.PI * 2;
  a = (a + Math.PI) % TAU;
  if (a < 0)
    a += TAU;
  return a - Math.PI;
};
Options.Triggers.push({
  id: '改HellOnRailsExtreme',
  zoneId: 1308,
  zoneLabel: { en: '极火车 Souma特供版' },
  overrideTimelineFile: true,
  timeline: `
hideall "--sync--"
hideall "--Reset--"
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
9.1 "--sync--" StartsUsing { id: "B25F" } #超增压
13.1 "(储存)"
15.2 "--sync--" StartsUsing { id: "B266" } #超增压急行
21.2 "击退/吸引"
26.3 "分散/分摊"
28.2 "--sync--" StartsUsing { id: "B260" } #超增压
32.2 "(储存)"
34.2 "--sync--" StartsUsing { id: "B26D" } #超增压抽雾
40.2 "吸引/击退"
45.4 "分散/分摊"
47.3 "--sync--" StartsUsing { id: "B237" } #无控急行
52.2 "掀车"
61.3 "--sync--" StartsUsing { id: "B25F" } #超增压
65.3 "(储存)"
67.3 "--sync--" StartsUsing { id: "B23C" } #炮塔出击
74.4 "--sync--" StartsUsing { id: "B26D" } #超增压抽雾
79.5 "炮台激光"
80.4 "吸引/击退"
85.5 "分散/分摊"
87.4 "--sync--" StartsUsing { id: "B260" } #超增压
91.3 "(储存)"
93.4 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
96 "炮台激光"
98.4 "双T死刑"
102.5 "--sync--" StartsUsing { id: "B266" } #超增压急行
107.6 "炮台激光"
108.5 "击退/吸引"
113.7 "分散/分摊"
115.7 "--sync--" StartsUsing { id: "B237" } #无控急行
120.7 "掀车"
131.7 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
136.7 "双T死刑"
145 "--sync--" StartsUsing { id: "B246" } #无尽狂奔
149.9 "换场地"
153.1 "溢流"
176.6 "火车技#1"
191.5 "火车技#2"
207.6 "火车技#3"
230.8 "转场AoE" Ability { id: "B24D" } window 60,60
243.4 "小AoE?"
253.5 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
258.4 "双T死刑"
260.6 "--sync--" StartsUsing { id: "B250" } #脱轨捶打
266.6 "踩塔 x3"
270.7 "--sync--" StartsUsing { id: "B28D" } #脱轨
275.7 "脱轨"
287 "旋风"
294 "--sync--" StartsUsing { id: "B277" } #雷鸣吐息
300 "打高/低"
307 "--sync--" StartsUsing { id: "B9A7" } #魔法阵展开
309 "魔法阵展开"
320.8 "判定#1"
331.9 "判定#2"
348.8 "判定#3"
362.9 "打高/低"
366.4 "旋风"
373.5 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
378.4 "双T死刑"
382.6 "--sync--" StartsUsing { id: "B284" } #脱轨捶打
388.6 "踩塔 x4"
394.9 "--sync--" StartsUsing { id: "B599" } #脱轨
399.9 "脱轨"
410.1 "--sync--" StartsUsing { id: "B264" } #念动反应
418.1 "黄圈 x2"
419.1 "旋风"
425.2 "--sync--" StartsUsing { id: "B264" } #念动反应
433.2 "黄圈 x3"
434.2 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
439.2 "双T死刑"
441.3 "--sync--" StartsUsing { id: "B264" } #念动反应
449.4 "黄圈 x5"
450.3 "旋风"
459.4 "--sync--" StartsUsing { id: "B285" } #脱轨捶打
465.4 "踩塔 x5"
472.1 "--sync--" StartsUsing { id: "B59A" } #脱轨
477.1 "脱轨"
487.4 "--sync--" StartsUsing { id: "B25F" } #超增压
491.3 "(储存)"
493.4 "--sync--" StartsUsing { id: "B23C" } #炮塔出击
505.6 "炮台激光"
510.9 "打高/低"
517.5 "--sync--" StartsUsing { id: "B264" } #念动反应
521.6 "炮台激光"
525.5 "黄圈 x4"
526.5 "旋风"
534.6 "--sync--" StartsUsing { id: "B26D" } #超增压抽雾
538.7 "炮台激光"
541.5 "吸引/击退"
545.7 "分散/分摊"
547.5 "--sync--" StartsUsing { id: "B25C" } #雷电爆发
552.5 "双T死刑"
556.6 "--sync--" StartsUsing { id: "B260" } #超增压
560.6 "(储存)"
562.6 "--sync--" StartsUsing { id: "B9A7" } #魔法阵展开
564.6 "魔法阵展开"
579.3 "判定#1"
590.4 "判定#2"
592.9 "旋风"
600.8 "--sync--" StartsUsing { id: "B266" } #超增压急行
606.8 "(储存)"
612 "分摊/分散"
619.8 "打高/低"
626.8 "双T死刑" StartsUsing { id: "B25C" }
634 "旋风"
642 "狂暴读条" StartsUsing { id: "B286" } #脱轨捶打
647.9 "脱轨捶打?"
649 "脱轨捶打?"
650 "脱轨捶打?"
651 "脱轨捶打?"
652 "脱轨捶打?"
`,
  initData: () => ({
    改actorPositions: {},
    改addTrainId: '',
    改addCleaveOnMe: false,
    改addCleaveDir: -1,
    改addTrainSpeed: 'slow',
    改phase: 'car1',
    改turretDir: 'east',
    改car2MechCount: 0,
    改car6MechCount: 0,
    改hailLastPos: 'dirN',
    改hailMoveCount: -1,
    改hailActorId: '',
    改psychokinesisCount: 0,
    改addTrainDir: 'unknown',
    改hailNeedMotion: true,
  }),
  timelineTriggers: [
    {
      id: '改 DoomtrainEx Third Rail Bait',
      regex: /^旋风$/,
      beforeSeconds: 2.5,
      infoText: (_data, _matches, output) => output.bait(),
      outputStrings: {
        bait: {
          en: '引导旋风',
        },
      },
    },
  ],
  triggers: [
    // 禁用原来的触发器，防止冲突
    {
      id: 'DoomtrainEx Phase Tracker 1',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Phase Tracker Add Phase Start',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Phase Tracker Add Phase End',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Phase Tracker Car4+',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx ActorMove Tracker',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx ActorSetPos Tracker',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx AddedCombatant Tracker',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Dead Man\'s Overdraught',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Dead Man\'s Express/Windpipe Car1',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Turret Side',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Car2 Tankbuster',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Dead Man\'s Express/Windpipe Car2',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Add Actor Finder',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Add Train Speed Collector',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Add Mechanics',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Add Tank Cleave Headmarker Collector',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Car3 Tankbuster',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Derailment Siege Car3',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Derailment Siege Car4',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Derailment Siege Car5',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Derailment Siege Car6',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Headlight',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Thunderous Breath',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Arcane Revelation',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Hail of Thunder Move Count Collector',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Hail of Thunder Actor Finder',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Hail of Thunder Motion Detector',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Car4 Tankbuster',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Psychokinesis',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Car6 Turret2',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Dead Man\'s Express/Windpipe Car6',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Add Train Direction Predictor',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    {
      id: 'DoomtrainEx Hail of Thunder Stacks',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '_', capture: false },
    },
    // General triggers
    {
      id: '改 DoomtrainEx Phase Tracker 1',
      type: 'StartsUsing',
      netRegex: { id: 'B237', capture: false },
      run: (data) => {
        if (data.改phase === 'car1') {
          data.改phase = 'car2';
        } else if (data.改phase === 'car2') {
          data.改phase = 'car3';
        }
      },
    },
    {
      id: '改 DoomtrainEx Phase Tracker Add Phase Start',
      type: 'StartsUsing',
      netRegex: { id: 'B246', capture: false },
      run: (data) => data.改phase = 'add',
    },
    {
      id: '改 DoomtrainEx Phase Tracker Add Phase End',
      type: 'Ability',
      netRegex: { id: 'B24C', capture: false },
      suppressSeconds: 1,
      run: (data) => data.改phase = 'car3',
    },
    {
      id: '改 DoomtrainEx Phase Tracker Car4+',
      type: 'StartsUsing',
      netRegex: { id: 'B28F', capture: false },
      run: (data) => {
        if (data.改phase === 'car3')
          data.改phase = 'car4';
        else if (data.改phase === 'car4')
          data.改phase = 'car5';
        else
          data.改phase = 'car6';
      },
    },
    {
      id: '改 DoomtrainEx ActorMove Tracker',
      type: 'ActorMove',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.改actorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
          time: new Date(matches.timestamp).getTime(),
        },
    },
    {
      id: '改 DoomtrainEx ActorSetPos Tracker',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.改actorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
          time: new Date(matches.timestamp).getTime(),
        },
    },
    {
      id: '改 DoomtrainEx AddedCombatant Tracker',
      type: 'AddedCombatant',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.改actorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
          time: new Date(matches.timestamp).getTime(),
        },
    },
    {
      id: '改 DoomtrainEx Dead Man\'s Overdraught',
      type: 'StartsUsing',
      netRegex: { id: ['B25F', 'B260'], capture: true },
      preRun: (data, matches) => {
        data.改storedKBMech = matches.id === 'B260' ? 'pairs' : 'spread';
      },
      infoText: (data, _matches, output) =>
        output.text({ mech: output[data.改storedKBMech ?? 'unknown']() }),
      outputStrings: {
        text: {
          en: 'Stored ${mech}',
          cn: '(稍后 ${mech})',
        },
        pairs: Outputs.stackPartner,
        spread: Outputs.spread,
      },
    },
    // Car 1
    {
      id: '改 DoomtrainEx Dead Man\'s Express/Windpipe Car1',
      type: 'StartsUsing',
      netRegex: { id: ['B266', 'B280'], capture: true },
      condition: (data) => data.改phase === 'car1',
      alertText: (data, matches, output) =>
        output.text({
          mech1: output[matches.id === 'B266' ? 'knockback' : 'drawIn'](),
          mech2: output[data.改storedKBMech ?? 'unknown'](),
        }),
      outputStrings: {
        text: {
          en: '${mech1} => ${mech2}',
        },
        unknown: Outputs.unknown,
        knockback: Outputs.knockback,
        drawIn: Outputs.drawIn,
        pairs: Outputs.stackPartner,
        spread: Outputs.spread,
      },
    },
    // Car 2
    {
      id: '改 DoomtrainEx Turret Side',
      type: 'StartsUsing',
      netRegex: { id: ['B271', 'B272', 'B273', 'B276'], capture: true },
      suppressSeconds: 1,
      run: (data, matches) =>
        data.改turretDir = parseFloat(matches.x) < arenas[2].x ? 'west' : 'east',
    },
    {
      id: '改 DoomtrainEx Car2 Tankbuster',
      type: 'StartsUsing',
      netRegex: { id: ['B271', 'B272', 'B273', 'B276'], capture: false },
      condition: (data) => data.改phase === 'car2' && data.改car2MechCount === 1,
      response: (data, _matches, output) => {
        return {
          [data.role === 'tank' ? 'alertText' : 'infoText']: output.text({
            turretDir: output[data.改turretDir](),
          }),
        };
      },
      run: (data) => data.改car2MechCount++,
      outputStrings: {
        east: Outputs.east,
        west: Outputs.west,
        text: {
          en: 'LoS ${turretDir} => Tankbusters',
          cn: '${turretDir}箱体 => 坦克死刑',
        },
      },
    },
    {
      id: '改 DoomtrainEx Dead Man\'s Express/Windpipe Car2',
      type: 'StartsUsing',
      netRegex: { id: ['B266', 'B280'], capture: true },
      condition: (data) => data.改phase === 'car2',
      alertText: (data, matches, output) =>
        output.text({
          turretDir: output[data.改turretDir](),
          mech1: output[matches.id === 'B266' ? 'knockback' : 'drawIn'](),
          mech2: output[data.改storedKBMech ?? 'unknown'](),
        }),
      run: (data) => data.改car2MechCount++,
      outputStrings: {
        text: {
          en: 'LoS ${turretDir} => ${mech1} => Dodge Lasers => ${mech2}',
          cn: '${turretDir}箱体 => ${mech1} => ${mech2}',
        },
        unknown: Outputs.unknown,
        east: Outputs.east,
        west: Outputs.west,
        knockback: Outputs.knockback,
        drawIn: Outputs.drawIn,
        pairs: Outputs.stackPartner,
        spread: Outputs.spread,
      },
    },
    {
      id: 'SM 极火车 无控急行',
      type: 'StartsUsing',
      netRegex: { id: 'B237' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'AoE + 掀车',
        },
      },
    },
    // Add phase
    {
      id: '改 DoomtrainEx Add Actor Finder',
      type: 'ActorMove',
      // @ts-ignore
      regex: /^.{14} 270 10E:(?<id>4.{7}):[^:]+:[^:]+:(?<moveType>0096|00FA):/,
      // suppressSeconds: 9999,
      run: (data, matches) => {
        if (data.改addTrainId === '') {
          data.改addTrainId = matches.id;
        }
      },
    },
    {
      id: '改 DoomtrainEx Add Train Speed Collector',
      type: 'ActorMove',
      // @ts-ignore
      regex: /^.{14} 270 10E:(?<id>4.{7}):[^:]+:[^:]+:(?<moveType>0096|00FA):/,
      condition: (data, matches) =>
        matches.id === data.改addTrainId && data.改addTrainDir === 'unknown',
      run: (data, matches) => {
        data.改addTrainSpeed = matches.moveType === '0096' ? 'slow' : 'fast';
      },
    },
    {
      id: '改 DoomtrainEx Add Train Direction Predictor',
      type: 'HeadMarker',
      netRegex: { id: '027F', capture: true },
      infoText: (data, matches, output) => {
        const actor = data.改actorPositions[data.改addTrainId];
        if (actor === undefined)
          return;
        let addCleaveDir = Math.atan2(actor.x - arenas.add.x, actor.y - arenas.add.y);
        // Slow rotates 3.122 rads base
        const slowMoveBase = 3.122;
        // Plus 0.0005666 rads per millisecond of delay since ActorMove was last recorded
        const slowMoveDelta = 0.0005666;
        // Same info, but for fast movement
        const fastMoveBase = 4.1697;
        const fastMoveDelta = 0.00061112;
        const deltaMs = new Date(matches.timestamp).getTime() - actor.time;
        if (data.改addTrainSpeed === 'slow') {
          addCleaveDir -= slowMoveBase + (slowMoveDelta * deltaMs);
        } else {
          addCleaveDir -= fastMoveBase + (fastMoveDelta * deltaMs);
        }
        if (addCleaveDir < -Math.PI) {
          addCleaveDir += Math.PI * 2;
        }
        const dirNum = Directions.hdgTo16DirNum(addCleaveDir);
        data.改addTrainDir = dirNum !== undefined
          ? Directions.output16Dir[dirNum] ?? 'unknown'
          : 'unknown';
        return output.text({ dir: output[data.改addTrainDir]() });
      },
      outputStrings: {
        ...Directions.outputStrings16Dir,
        text: {
          en: 'Train cleaves from ${dir}',
          cn: '车到${dir}',
        },
      },
    },
    {
      id: '改 DoomtrainEx Add Mechanics',
      type: 'HeadMarker',
      netRegex: { id: ['027D', '027E'], capture: true },
      alertText: (data, matches, output) => {
        const addMech = matches.id === '027D' ? 'healerStacks' : 'spread';
        const mech = data.改addCleaveOnMe ? output.cleave() : output[addMech]();
        return output.text({
          mech: mech,
        });
      },
      run: (data) => {
        data.改addCleaveOnMe = false;
        data.改addTrainDir = 'unknown';
      },
      outputStrings: {
        healerStacks: Outputs.healerGroups,
        spread: Outputs.spread,
        cleave: Outputs.tankCleaveOnYou,
        unknown: Outputs.unknown,
        text: {
          en: '${mech}',
        },
      },
    },
    {
      id: '改 DoomtrainEx Add Tank Cleave Headmarker Collector',
      type: 'HeadMarker',
      netRegex: { id: '019C', capture: true },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      run: (data) => {
        data.改addCleaveOnMe = true;
      },
    },
    // Car 3
    {
      id: '改 DoomtrainEx Car3 Tankbuster',
      type: 'HeadMarker',
      netRegex: { id: '0157', capture: true },
      condition: (data, matches) =>
        data.改phase === 'car3' && Conditions.targetIsYou()(data, matches),
      response: Responses.tankBuster(),
    },
    {
      id: '改 DoomtrainEx Derailment Siege Car3',
      type: 'StartsUsing',
      netRegex: { id: 'B250', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '踩塔 x3 => 下一节车厢',
        },
      },
    },
    // Car 4
    {
      id: '改 DoomtrainEx Derailment Siege Car4',
      type: 'StartsUsing',
      netRegex: { id: 'B284', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.改hailActorId = '',
      outputStrings: {
        text: {
          en: '踩塔 x4 => 下一节车厢',
        },
      },
    },
    // Car 5
    {
      id: '改 DoomtrainEx Derailment Siege Car5',
      type: 'StartsUsing',
      netRegex: { id: 'B285', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '踩塔 x5 => 下一节车厢',
        },
      },
    },
    // Car 6
    {
      id: '改 DoomtrainEx Derailment Siege Car6',
      type: 'StartsUsing',
      netRegex: { id: 'B286', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '踩塔 x6 => 狂暴',
        },
      },
    },
    {
      id: 'SM 极火车 旋风旋风',
      type: 'StartsUsing',
      netRegex: { id: 'B262', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '旋风旋风！',
        },
      },
    },
    {
      id: 'SM 极火车 cjb',
      type: 'StartsUsing',
      netRegex: { id: 'B24E', capture: false },
      response: Responses.aoe(),
    },
    {
      id: '改 DoomtrainEx Headlight',
      type: 'StartsUsing',
      netRegex: { id: 'B27A', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '先低 => 高',
        },
      },
    },
    {
      id: '改 DoomtrainEx Thunderous Breath',
      type: 'StartsUsing',
      netRegex: { id: 'B277', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '先高 => 低',
        },
      },
    },
    {
      id: '改 DoomtrainEx Arcane Revelation',
      type: 'StartsUsing',
      netRegex: { id: 'B9A7', capture: false },
      run: (data) => {
        data.改hailActorId = 'need';
        data.改hailLastPos = 'dirN';
      },
    },
    {
      id: '改 DoomtrainEx Hail of Thunder Move Count Collector',
      type: 'Ability',
      netRegex: { id: ['B258', 'B259', 'B25A'], capture: true },
      run: (data, matches) => {
        let moveCount = 2;
        if (matches.id === 'B259')
          moveCount = 3;
        else if (matches.id === 'B25A')
          moveCount = 4;
        data.改hailMoveCount = moveCount;
      },
    },
    {
      id: '改 DoomtrainEx Hail of Thunder Actor Finder',
      type: 'CombatantMemory',
      netRegex: {
        change: 'Add',
        id: '4[0-9A-F]{7}',
        pair: [{ key: 'BNpcID', value: '4A36' }],
        capture: true,
      },
      condition: (data) => data.改hailActorId === 'need',
      run: (data, matches) => data.改hailActorId = matches.id,
    },
    {
      id: '改 DoomtrainEx Hail of Thunder Stacks',
      type: 'Ability',
      netRegex: { id: 'B292', capture: false },
      run: (data) => data.改hailNeedMotion = true,
    },
    {
      id: '改 DoomtrainEx Hail of Thunder Motion Detector',
      type: 'ActorMove',
      netRegex: { capture: true },
      condition: (data, matches) => data.改hailActorId === matches.id && data.改hailNeedMotion,
      preRun: (data) => data.改hailNeedMotion = false,
      suppressSeconds: 14,
      infoText: (data, _matches, output) => {
        // Easy cases first
        // data.hailMoveCount === 4, no-op
        const oldIdx = Directions.outputCardinalDir.indexOf(data.改hailLastPos);
        if (data.改hailMoveCount === 2) {
          data.改hailLastPos = Directions.outputCardinalDir[(oldIdx + 2) % 4] ?? 'unknown';
        } else if (data.改hailMoveCount === 3) {
          // Now we determine CW or CCW
          const actor = data.改actorPositions[data.改hailActorId];
          if (actor === undefined) {
            console.error('No actor position for hail of thunder calc');
            return;
          }
          const arena = data.改phase === 'car4' ? 4 : 6;
          const oldAngle = Math.PI - (oldIdx / 4) * (Math.PI * 2);
          const newAngle = Math.atan2(actor.x - arenas[arena].x, actor.y - arenas[arena].y);
          const delta = normalizeDelta(newAngle - oldAngle);
          if (delta > 0)
            data.改hailLastPos = Directions.outputCardinalDir[(oldIdx + 1) % 4] ?? 'unknown';
          else
            data.改hailLastPos = Directions.outputCardinalDir[(oldIdx - 1 + 4) % 4] ?? 'unknown';
        }
        const idx = (Directions.outputCardinalDir.indexOf(data.改hailLastPos) + 2) % 4;
        return output.text({
          // step: data.改hailMoveCount.toString(),
          dir: output[Directions.outputCardinalDir[idx] ?? 'unknown'](),
        });
      },
      outputStrings: {
        dirN: { en: '前面安全' },
        dirE: { en: '右侧安全' },
        dirS: { en: '后面安全' },
        dirW: { en: '左侧安全' },
        unknown: Outputs.unknown,
        text: { en: '${dir} + 分摊' },
        // text: { en: '（${step}步） ${dir} + 分摊' },
      },
    },
    {
      id: '改 DoomtrainEx Car4 Tankbuster',
      type: 'HeadMarker',
      netRegex: { id: '0157', capture: true },
      condition: (data, matches) =>
        data.改phase === 'car4' && Conditions.targetIsYou()(data, matches),
      response: Responses.tankBuster(),
    },
    {
      id: '改 DoomtrainEx Psychokinesis',
      type: 'StartsUsing',
      netRegex: { id: 'B264', capture: false },
      preRun: (data) => data.改psychokinesisCount++,
      infoText: (data, _matches, output) => {
        if (data.改psychokinesisCount !== 2) {
          return output.spreadIntoBait();
        }
        return output.spreadIntoBuster();
      },
      outputStrings: {
        spreadIntoBait: {
          en: '处理黄圈 => 引导旋风',
        },
        spreadIntoBuster: {
          en: '处理黄圈 => 坦克死刑',
        },
      },
    },
    {
      id: '改 DoomtrainEx Car6 Turret2',
      type: 'StartsUsing',
      netRegex: { id: ['B271', 'B272', 'B273', 'B276'], capture: false },
      condition: (data) => data.改phase === 'car6',
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.改car6MechCount >= 1) {
          return data.改turretDir === 'east' ? output.up() : output.down();
        }
        return output.text({ turretDir: output[data.改turretDir]() });
      },
      run: (data) => data.改car6MechCount++,
      outputStrings: {
        up: {
          en: '左高台上',
        },
        down: {
          en: '左箱体侧',
        },
        east: Outputs.east,
        west: Outputs.west,
        text: {
          en: 'LoS ${turretDir}',
          cn: '${turretDir}箱体',
        },
      },
    },
    {
      id: '改 DoomtrainEx Dead Man\'s Express/Windpipe Car6',
      type: 'StartsUsing',
      netRegex: { id: ['B266', 'B280'], capture: true },
      condition: (data) => data.改phase === 'car6',
      infoText: (data, matches, output) => {
        let mech1;
        if (matches.id === 'B266') {
          mech1 = output.express({ knockback: output.knockback() });
        } else {
          mech1 = output.windpipe({ drawIn: output.drawIn() });
        }
        const mech3 = data.改car6MechCount === 3
          ? output.tbFollowup({ mech3: output.tankbuster() })
          : '';
        return output.text({
          mech1: mech1,
          mech2: output[data.改storedKBMech ?? 'unknown'](),
          mech3: mech3,
        });
      },
      run: (data) => data.改car6MechCount++,
      outputStrings: {
        text: {
          en: '${mech1} => ${mech2}${mech3}',
        },
        express: {
          en: '${knockback}',
        },
        windpipe: {
          en: '${drawIn}',
        },
        tbFollowup: {
          en: ' => ${mech3}',
        },
        unknown: Outputs.unknown,
        knockback: Outputs.knockback,
        drawIn: Outputs.drawIn,
        pairs: Outputs.stackPartner,
        spread: Outputs.spread,
        tankbuster: Outputs.tankBuster,
      },
    },
  ],
});
