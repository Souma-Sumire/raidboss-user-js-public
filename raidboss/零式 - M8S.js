console.log('已加载M8S');
const getRotationDirection = (p1, p2) => {
  const center = { x: 100, y: 100 };
  // 反转 y 轴
  const v1 = { x: p1.x - center.x, y: center.y - p1.y };
  const v2 = { x: p2.x - center.x, y: center.y - p2.y };
  const cross = v1.x * v2.y - v1.y * v2.x;
  if (cross > 0)
    return 'counter-clockwise';
  if (cross < 0)
    return 'clockwise';
  return 'colinear';
};
const getWeapon = (id) => {
  switch (id) {
    case 'A47B':
    case 'A47D':
      return 'in';
    case 'A47C':
      return 'out';
    case 'A47A':
      return 'mid';
    case 'A479':
      return 'side';
    default:
      throw new Error(`Unknown weapon id: ${id}`);
  }
};
const getSafe = (katana, dir) => {
  // dir 0=N, 1=E, 2=S, 3=W (direction)
  // way 1=NW, 2=NE, 3=SW, 4=SE (waymark)
  const waymark = {
    '0left': { number: [1, 4], alphabet: 'D' },
    '0right': { number: [2, 3], alphabet: 'B' },
    '1left': { number: [1, 2], alphabet: 'A' },
    '1right': { number: [3, 4], alphabet: 'C' },
    '2left': { number: [2, 3], alphabet: 'B' },
    '2right': { number: [1, 4], alphabet: 'D' },
    '3left': { number: [3, 4], alphabet: 'C' },
    '3right': { number: [1, 2], alphabet: 'A' },
  };
  return waymark[`${dir}${katana}`];
};
const WolfSHeadDelay = {
  // 1风
  'wind-21.00': 21 - 11.5,
  // 2风
  'wind-37.00': 37 - 12,
  // 3风
  'wind-54.00': 54 - 14.5,
  // 1土
  'earth-21.00': 21 - 6,
  // 2土
  'earth-37.00': 37 - 6.5,
  // 3土
  'earth-54.00': 54 - 9,
};
const RotationMap = {
  'AB': '左',
  'AD': '右',
  'BA': '右',
  'BC': '左',
  'CB': '右',
  'CD': '左',
  'DA': '左',
  'DC': '右',
};
const getBuffer = (res1, res2) => {
  return res1.number.find((v) => res2.number.includes(v));
};
const 光牙Map = {
  '93.64 93.64 //': { stack: '偏左上', spread: '偏右下' },
  '97.88 97.88 //': { stack: '偏右下', spread: '偏左上' },
  '93.64 106.36 \\\\': { stack: '偏左下', spread: '偏右上' },
  '97.88 102.12 \\\\': { stack: '偏右上', spread: '偏左下' },
};
const HdgDirToFloor = {
  '2': 2,
  '5': 1,
  '8': 5,
  '11': 4,
  '14': 3,
};
/*
   3 2
  4 o 1
    5
  116.64 105.41 return 1 地图右下
  110.29  85.84 return 2 地图右上
  89.71  85.84 return 3 地图左上
  83.36 105.41 return 4 地图左下
  100.00 117.50 return 5 地图南边（Y坐标不完全精确）
*/
const FloorPos = [
  { x: 116.64, y: 105.41 },
  { x: 110.29, y: 85.84 },
  { x: 89.71, y: 85.84 },
  { x: 83.36, y: 105.41 },
  { x: 100.00, y: 117.50 },
];
const getFloor = (x, y) => {
  const distances = FloorPos.map((tower) => {
    const dx = tower.x - x;
    const dy = tower.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  });
  const minDistance = Math.min(...distances);
  const index = distances.indexOf(minDistance);
  return index + 1;
};
const BitsPos = [
  {
    'x': 127.384,
    'y': 104.709,
    'floor': 1,
    'safe': 'left',
  },
  {
    'x': 124.912,
    'y': 112.308,
    'floor': 1,
    'safe': 'right',
  },
  {
    'x': 112.919,
    'y': 75.411,
    'floor': 2,
    'safe': 'left',
  },
  {
    'x': 119.388,
    'y': 80.111,
    'floor': 2,
    'safe': 'right',
  },
  {
    'x': 80.599,
    'y': 80.111,
    'floor': 3,
    'safe': 'left',
  },
  {
    'x': 87.069,
    'y': 75.411,
    'floor': 3,
    'safe': 'right',
  },
  {
    'x': 75.076,
    'y': 112.308,
    'floor': 4,
    'safe': 'left',
  },
  {
    'x': 72.604,
    'y': 104.709,
    'floor': 4,
    'safe': 'right',
  },
  {
    'x': 104.007,
    'y': 127.506,
    'floor': 5,
    'safe': 'left',
  },
  {
    'x': 96.011,
    'y': 127.506,
    'floor': 5,
    'safe': 'right',
  },
];
const getBit = (x, y) => {
  const distances = BitsPos.map((bit) => {
    const dx = bit.x - x;
    const dy = bit.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  });
  const minDistance = Math.min(...distances);
  const index = distances.indexOf(minDistance);
  return BitsPos[index];
};
Options.Triggers.push({
  id: 'SoumaAacCruiserweightM4Savage',
  zoneId: 1263,
  config: [
    {
      id: '四连刀报点方式',
      name: { en: '四连刀报点方式' },
      type: 'select',
      options: {
        en: {
          '正点安全区：D C B': 'waymark',
          '玩家怎么转：左右右': 'rotation',
          '12刀交集 => 34刀交集 => 4刀半场': 'buffer1234',
          '23刀交集 => 4刀半场': 'buffer23',
        },
      },
      default: 'buffer1234',
      comment: {
        en: `正点安全区：最传统的方法，建议提前找到34交集以增加4刀容错。<br/>
        玩家怎么转：减少思考量的一种解决方案，同样建议提前找到34交集以增加4刀容错。<br/>
        12刀交集 => 34刀交集：默认方案，以2次移动为代价，得到了报34交集的优势，可以让4刀更容易就位。<br/>
        23刀交集：仅需要移动2次，但有概率对穿半场。<br/>
        请自行选用最适合自己的报法。`,
      },
    },
  ],
  overrideTimelineFile: true,
  timeline: `
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
11.4 "--sync--" StartsUsing { id: "A3DA" }
12.9 "空间斩"
30.3 "土/土/风之魔技"
40.5 "回/薙之群狼剑"
40.8 "回/薙之群狼剑"
44.5 "群狼剑"
47.6 "群狼剑"
51.8 "空间斩"
67.6 "千年风化"
78.3 "暴风"
93.9 "暴风"
102.1 "连震击"
113.9 "空间斩"
125.2 "一刀两断"
140 "大地的呼唤"
144.7 "斩空剑"
147.9 "光牙召唤"
160.6 "回/薙之群狼剑"
160.8 "回/薙之群狼剑"
164.5 "群狼剑"
167.6 "群狼剑"
180.2 "光狼召唤"
277.2 "光牙召唤"
279.3 "--sync--" StartsUsing { id: "A3BE" } window 20,20
282.3 "大地之怒"
291.4 "残影剑"
306.8 "回/薙之群狼剑"
307 "回/薙之群狼剑"
310.7 "群狼剑"
313.8 "群狼剑"
327.7 "一刀两断"
342 "幻狼召唤"
349.1 "大地之怒"
372.4 "土/风之魔技"
381.6 "连震击"
393.3 "空间斩"
408.2 "空间斩？"
464 "--sync--" StartsUsing { id: "A45A" } window 30,30
468.9 "爆震"
481.1 "魔光"
482.0 "回初始平台"
492.3 "双牙击"
503.6 "不堪一击"
514.8 "魔光"
526 "爆震"
538.3 "刚刃一闪"
546.4 "风震魔印"
550.6 "贪狼之剑"
556.7 "风狼阵"
567.9 "魔狼战型·天岚之相"
577 "双牙暴风击"
584.2 "双牙暴风击"
591.3 "双牙暴风击"
598.4 "双牙暴风击"
610.6 "光牙召唤"
622.1 "回天动地"
626.5 "回天动地"
630.8 "回天动地"
635.2 "回天动地"
639.5 "回天动地"
650 "爆震"
664.1 "魔光"
675.3 "双牙击"
690.5 "魔狼战型·咒刃之相"
695.7 "孤狼诅咒"
705.9 "风狼阵"
723.1 "不堪一击"
736.3 "魔光"
750.8 "八连光弹#1"
761.3 "刚刃一闪#1"
770.4 "八连光弹#2"
780.9 "刚刃一闪#2"
790.1 "八连光弹#3"
800.5 "刚刃一闪#3"
809.7 "八连光弹#4"
820.1 "刚刃一闪#4"
829.3 "八连光弹#5"
846.5 "狂暴了"`,
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaWolfs: [],
      soumaTethers: [],
      souma竹子预占位: [],
      soumaPhase: 'P1-前',
      souma四连CloneIDs: [],
      souma四连导航: [],
      souma二穿一站位: undefined,
      souma不堪一击: [],
      souma风震魔印T: false,
      souma风狼阵: [],
      souma风狼阵处理: [],
      souma回天动地: [],
      souma闪光炮: [],
      souma连击闪光炮: [],
      souma八连光弹Counter: 0,
    };
  },
  timelineTriggers: [
    {
      id: 'R8S Souma Timeline 魔光',
      regex: /^魔光$/,
      beforeSeconds: 10.7,
      durationSeconds: 10.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '魔光排队',
        },
      },
    },
    {
      id: 'R8S Souma Timeline 回初始平台',
      regex: /^回初始平台$/,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '回初始平台',
        },
      },
    },
    {
      id: 'R8S Souma Timeline 八连光弹',
      regex: /^八连光弹#1$/,
      beforeSeconds: 15,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '人群集合' } },
    },
  ],
  triggers: [
    // #region 门神
    {
      id: 'R8S Souma 空间斩',
      type: 'StartsUsing',
      netRegex: { id: 'A74F', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'R8S Souma 土之魔技1',
      type: 'StartsUsing',
      netRegex: { id: 'A3A1', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '外斜散' },
      },
    },
    {
      id: 'R8S Souma 土之魔技2',
      type: 'StartsUsing',
      netRegex: { id: 'A3A2', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '外正散' },
      },
    },
    {
      id: 'R8S Souma 风之魔技1',
      type: 'StartsUsing',
      netRegex: { id: 'A39D', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '内斜摊' },
      },
    },
    {
      id: 'R8S Souma 风之魔技2',
      type: 'StartsUsing',
      netRegex: { id: 'A39E', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '内正摊' },
      },
    },
    // A930 薙之群狼剑 真实分身读条
    // A931 回之群狼剑 真实分身读条
    {
      id: 'R8S Souma 群狼剑真实分身',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A93[01]', capture: true },
      infoText: (_data, matches, output) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        const dir = Directions.xyTo8DirNum(x, y, 100, 100);
        const num = Directions.outputFrom8DirNum(dir);
        return output[num]();
      },
      outputStrings: {
        ...Directions.outputStrings8Dir,
      },
    },
    // A911 薙之群狼剑 分身ABD
    // A912 薙之群狼剑 分身2C1
    {
      id: 'R8S Souma 薙之群狼剑',
      type: 'StartsUsing',
      netRegex: { id: 'A91[12]', capture: false },
      delaySeconds: 2,
      durationSeconds: 10,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '稍后追上扇形' },
      },
    },
    // A913 回之群狼剑 分身ABD
    // A914 回之群狼剑 分身2C1
    {
      id: 'R8S Souma 回之群狼剑',
      type: 'StartsUsing',
      netRegex: { id: 'A91[34]', capture: false },
      delaySeconds: 2,
      durationSeconds: 10,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '稍后留下钢铁' },
      },
    },
    {
      id: 'R8S Souma 千年风化',
      type: 'StartsUsing',
      netRegex: { id: 'A3B2', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'R8S Souma 千年风声',
      type: 'StartsUsing',
      netRegex: { id: 'A3B4', capture: true },
      preRun: (data, matches) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        data.soumaWolfs.push({ x, y });
      },
      durationSeconds: 8,
      infoText: (data, _matches, output) => {
        const wolfs = data.soumaWolfs;
        if (wolfs.length === 1) {
          const wolf1 = wolfs[0];
          const dir = Directions.xyTo4DirNum(wolf1.x, wolf1.y, 100, 100);
          return output[dir]();
        }
        if (wolfs.length === 2) {
          const wolf1 = wolfs[0];
          const wolf2 = wolfs[1];
          const result = getRotationDirection(wolf1, wolf2);
          return output[result]();
        }
      },
      outputStrings: {
        '0': { en: 'A' },
        '2': { en: 'C' },
        'clockwise': { en: '<= 向左走' },
        'counter-clockwise': { en: '向右走 =>' },
      },
    },
    {
      id: 'R8S Souma 红圈',
      type: 'HeadMarker',
      netRegex: { id: '0178' },
      condition: (data, matches) => matches.target === data.me,
      alarmText: (_data, _atches, output) => output.text(),
      outputStrings: { text: { en: '分散' } },
    },
    {
      id: 'R8S Souma 拉线',
      type: 'Tether',
      netRegex: { id: '0039', capture: true },
      preRun: (data, matches) => {
        data.soumaTethers.push({ sourceId: matches.sourceId, target: matches.target });
      },
      promise: async (data) => {
        if (data.soumaTethers.length === 4) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
            ids: data.soumaTethers.map((x) => parseInt(x.sourceId, 16)),
          })).combatants;
        }
      },
      response: (data, _matches, output) => {
        if (data.soumaTethers.length === 4) {
          const combatant = data.soumaCombatantData;
          const tethers = data.soumaTethers.map((v) => v.target);
          if (tethers.includes(data.me)) {
            const clock =
              Directions.xyTo8DirNum(combatant[0].PosX, combatant[0].PosY, 100, 100) % 2 === 0
                ? output.正点()
                : output.斜点();
            data.soumaTethers.length = 0;
            data.soumaCombatantData = [];
            return { alertText: output.tether({ clock }) };
          }
          const clock =
            Directions.xyTo8DirNum(combatant[0].PosX, combatant[0].PosY, 100, 100) % 2 === 0
              ? output.斜点()
              : output.正点();
          data.soumaTethers.length = 0;
          data.soumaCombatantData = [];
          return { infoText: output.tower({ clock }) };
        }
      },
      outputStrings: {
        tower: { en: '${clock}踩塔' },
        tether: { en: '${clock}拉线' },
        正点: { en: '正点' },
        斜点: { en: '斜点' },
      },
    },
    {
      id: 'R8S Souma 连震击',
      type: 'StartsUsing',
      netRegex: { id: 'A3B9', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '连续分摊(8次)' },
      },
    },
    {
      id: 'R8S Souma 一刀两断',
      type: 'StartsUsing',
      netRegex: { id: 'A3D8' },
      response: Responses.tankBuster(),
    },
    // 00800040 12 AC石柱 A内发光
    // 00020001 12 AC石柱 C内发光
    // 00020001 10 BD石柱 B内发光
    // 00800040 10 BD石柱 D内发光
    {
      id: 'R8S Souma 竹子',
      type: 'MapEffect',
      netRegex: { flags: ['00020001', '00800040'], location: ['10', '12'] },
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        const key = `${matches.flags}-${matches.location}`;
        const mapEffect = {
          '00800040-12': { numbers: [2, 4] },
          '00020001-12': { numbers: [1, 3] },
          '00020001-10': { numbers: [2, 4] },
          '00800040-10': { numbers: [1, 3] },
        };
        const effect = mapEffect[key];
        if (effect === undefined) {
          console.error('Souma 竹子 MapEffect 错误', matches);
          return;
        }
        const numbers = effect.numbers;
        data.souma竹子预占位 = numbers;
        return output[numbers.join('')]();
      },
      outputStrings: {
        '13': { en: '1或3' },
        '24': { en: '2或4' },
      },
    },
    {
      id: 'R8S Souma 十字光牙',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A3D7', capture: true },
      alertText: (data, matches, output) => {
        // N = 0, NE = 1, ..., NW = 7
        if (Directions.hdgTo8DirNum(parseFloat(matches.heading)) % 2 === 1) {
          // 1, 3, 5, 7
          const dir = Directions.xyTo4DirNum(
            parseFloat(matches.x),
            parseFloat(matches.y),
            100,
            100,
          );
          const adjacentNumber = [
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 1],
          ][dir];
          const final = data.souma竹子预占位.filter((x) => adjacentNumber.includes(x));
          if (final.length === 0) {
            console.error('Souma 十字光牙 预占位错误', data.souma竹子预占位, dir);
            return;
          }
          data.souma竹子预占位 = [];
          return output[final[0]]();
        }
        return '';
      },
      outputStrings: {
        '1': { en: '1,1,1' },
        '2': { en: '2,2,2' },
        '3': { en: '3,3,3' },
        '4': { en: '4,4,4' },
      },
    },
    {
      id: 'R8S Souma 光狼召唤',
      type: 'StartsUsing',
      netRegex: { id: 'A3C8', capture: false },
      run: (data) => {
        data.soumaWolfs.length = 0;
      },
    },
    {
      id: 'R8S Souma 狼头连线',
      type: 'Tether',
      netRegex: { id: ['0150', '014F'], capture: true },
      condition: (data, matches) => data.me === matches.source,
      infoText: (_data, matches, output) => {
        return output[matches.id === '0150' ? 'wind' : 'earth']();
      },
      outputStrings: {
        earth: { en: '打左风' },
        wind: { en: '打右土' },
      },
    },
    {
      id: 'R8S Souma 狼头AoE',
      type: 'StartsUsing',
      netRegex: { id: ['A3DC'], capture: false },
      delaySeconds: 1,
      response: Responses.aoe(),
    },
    // 1127土
    // 1128风
    {
      id: 'R8S Souma 咒痕',
      type: 'GainsEffect',
      netRegex: { effectId: ['1127', '1128'] },
      delaySeconds: (_data, matches) => {
        const attb = matches.effectId === '1127' ? 'earth' : 'wind';
        const key = `${attb}-${matches.duration}`;
        return WolfSHeadDelay[key];
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          earthMe: { en: '去撞土！' },
          windMe: { en: '去撞风！' },
          earth: { en: '${player}撞土' },
          wind: { en: '${player}撞风' },
        };
        const attb = matches.effectId === '1127' ? 'earth' : 'wind';
        if (data.me === matches.target) {
          return { alarmText: output[`${attb}Me`]() };
        }
        return { infoText: output[attb]({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'R8S Souma 咒痕准备',
      type: 'GainsEffect',
      netRegex: { effectId: ['1127', '1128'] },
      delaySeconds: (_data, matches) => {
        const attb = matches.effectId === '1127' ? 'earth' : 'wind';
        const key = `${attb}-${matches.duration}`;
        return WolfSHeadDelay[key] - 4;
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          earthMe: { en: '准备' },
          windMe: { en: '准备' },
          earth: { en: '${player}准备' },
          wind: { en: '${player}准备' },
        };
        const attb = matches.effectId === '1127' ? 'earth' : 'wind';
        if (data.me === matches.target) {
          return { alertText: output[`${attb}Me`]() };
        }
        return { infoText: output[attb]({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'R8S Souma 风尘光狼斩',
      type: 'StartsUsing',
      netRegex: { id: 'A3CB', capture: false },
      response: Responses.bigAoe(),
      run: (data) => data.soumaPhase = 'P1-后大地1',
    },
    {
      id: 'R8S Souma 大地之怒',
      type: 'StartsUsing',
      netRegex: { id: 'A3BE', capture: false },
      condition: (data) => data.soumaPhase === 'P1-后大地1',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '二穿一站位' },
      },
    },
    {
      id: 'R8S Souma 分散点名',
      type: 'HeadMarker',
      netRegex: { id: '008B' },
      condition: (data, matches) => matches.target === data.me,
      infoText: (data, _matches, output) => {
        if (data.souma二穿一站位 !== undefined) {
          return output[data.souma二穿一站位.spread]();
        }
        return output.text();
      },
      outputStrings: {
        text: '分散',
        偏左上: '分散,偏左上',
        偏右下: '分散,偏右下',
        偏右上: '分散,偏右上',
        偏左下: '分散,偏左下',
      },
    },
    {
      id: 'R8S Souma 分摊点名',
      type: 'HeadMarker',
      netRegex: { id: '005D' },
      condition: (data, matches) => {
        if (data.soumaPhase === 'P1-后大地1' || data.soumaPhase === 'P1-后大地2') {
          const targetRole = data.party.nameToRole_[matches.target] === 'dps' ? 'dps' : 'th';
          const myRole = data.role === 'dps' ? 'dps' : 'th';
          if (targetRole === myRole) {
            return true;
          }
        }
        return false;
      },
      infoText: (data, _matches, output) => {
        if (data.souma二穿一站位 !== undefined) {
          return output[data.souma二穿一站位.stack]();
        }
        return output.text();
      },
      outputStrings: {
        text: { en: '分摊' },
        偏左上: '分摊,偏左上',
        偏右下: '分摊,偏右下',
        偏右上: '分摊,偏右上',
        偏左下: '分摊,偏左下',
      },
    },
    {
      id: 'R8S Souma 地裂波',
      type: 'StartsUsing',
      netRegex: { id: 'A78[DE]', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.soumaPhase = 'P1-后大地2';
      },
      outputStrings: {
        text: { en: '躲龙头' },
      },
    },
    {
      id: 'R8S Souma 幻狼召唤',
      type: 'StartsUsing',
      netRegex: { id: 'A3C1', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '4连半场刀' },
      },
    },
    {
      id: 'R8S Souma 分身105',
      type: 'CombatantMemory',
      netRegex: {
        pair: [
          { key: 'WeaponId', value: '[67]' },
        ],
      },
      preRun: (data, matches) => {
        data.souma四连CloneIDs.push(parseInt(matches.id, 16));
      },
      durationSeconds: 15,
      promise: async (data) => {
        if (data.souma四连CloneIDs.length === 4 || data.souma四连CloneIDs.length === 1) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
            ids: data.souma四连CloneIDs,
          })).combatants;
        }
      },
      response: (data, _matches, output) => {
        const getKatana = (weaponId) => weaponId === '7' ? 'left' : 'right';
        if (data.souma四连CloneIDs.length === 1) {
          const k1 = data.soumaCombatantData[0];
          const katana = getKatana(k1.WeaponId.toString());
          const dir = Directions.xyTo4DirNum(k1.PosX, k1.PosY, 100, 100);
          const safe = getSafe(katana, dir);
          return { infoText: output.first({ s1: output[safe.alphabet]() }) };
        }
        if (data.souma四连CloneIDs.length === 4) {
          const clones = data.soumaCombatantData.sort((a, b) => {
            return data.souma四连CloneIDs.indexOf(a.ID) - data.souma四连CloneIDs.indexOf(b.ID);
          });
          const res = [];
          clones.forEach((c) => {
            const katana = getKatana(c.WeaponId.toString());
            const dir = Directions.xyTo4DirNum(c.PosX, c.PosY, 100, 100);
            const safe = getSafe(katana, dir);
            if (safe === undefined) {
              console.error(katana, dir, c);
            }
            res.push(safe);
          });
          const w2 = output[res[1].alphabet]();
          const w3 = output[res[2].alphabet]();
          const w4 = output[res[3].alphabet]();
          const last = output.last();
          if (data.triggerSetConfig.四连刀报点方式 === 'buffer1234') {
            const b12 = output[getBuffer(res[0], res[1])]();
            const b34 = output[getBuffer(res[2], res[3])]();
            const buffer = output.buffer1234({ b12, b34, w4 });
            data.souma四连导航 = [b12.toString(), b34.toString(), w4, last];
            return { alertText: buffer };
          }
          if (data.triggerSetConfig.四连刀报点方式 === 'buffer23') {
            const b23 = output[getBuffer(res[1], res[2])]();
            const buffer = output.buffer23({ b23, w4 });
            data.souma四连导航 = [b23.toString(), output.stay({ w4 }), w4, last];
            return { alertText: buffer };
          }
          if (data.triggerSetConfig.四连刀报点方式 === 'waymark') {
            const waymark = output.waymark({ w2, w3, w4 });
            data.souma四连导航 = [w2, w3, w4, last];
            return { alertText: waymark };
          }
          if (data.triggerSetConfig.四连刀报点方式 === 'rotation') {
            const r2 = RotationMap[`${res[0].alphabet}${res[1].alphabet}`];
            const r3 = RotationMap[`${res[1].alphabet}${res[2].alphabet}`];
            const r4 = RotationMap[`${res[2].alphabet}${res[3].alphabet}`];
            const rotation = output.rotation({ r2, r3, r4 });
            data.souma四连导航 = [r2, r3, r4, last];
            return { alertText: rotation };
          }
        }
      },
      outputStrings: {
        A: { en: 'A' },
        B: { en: 'Boy' },
        C: { en: 'C' },
        D: { en: 'Dog' },
        1: { en: '1' },
        2: { en: '2' },
        3: { en: '3' },
        4: { en: '4' },
        first: { en: '${s1}' },
        waymark: { en: '${w2} => ${w3} => ${w3}' },
        rotation: { en: '${r2} => ${r3} => ${r4}' },
        buffer1234: { en: '${b12} => ${b34} => ${w4}' },
        buffer23: { en: '${b23} => ${w4}' },
        stay: { en: '准备${w4}' },
        last: { en: '正点躲龙头' },
      },
    },
    {
      id: 'R8S Souma 分身左右刀判定导航',
      type: 'Ability',
      netRegex: { id: 'A3C[23]', capture: false },
      condition: (data) => data.souma四连导航.length > 0,
      suppressSeconds: 0.5,
      // eslint-disable-next-line rulesdir/cactbot-output-strings
      alarmText: (data) => data.souma四连导航.shift(),
    },
    {
      id: 'R8S Souma 十字光牙2',
      type: 'StartsUsing',
      netRegex: { id: 'A3D6', capture: true },
      condition: (_data, matches) => parseFloat(matches.x) < 100,
      preRun: (data, matches, _output) => {
        const heading = parseFloat(matches.heading) > 0 ? '//' : '\\\\';
        const result = 光牙Map[`${matches.x} ${matches.y} ${heading}`];
        data.souma二穿一站位 = result;
      },
      delaySeconds: 2,
      run: (data) => {
        data.souma二穿一站位 = undefined;
      },
    },
    {
      id: 'R8S Souma 十字光牙2-',
      type: 'Ability',
      netRegex: { id: 'A3D6', capture: false },
      suppressSeconds: 10,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '穿' },
      },
    },
    {
      id: 'R8S Souma 风狼豪波',
      type: 'StartsUsing',
      netRegex: { id: 'A789', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '龙头后面' },
      },
    },
    // #endregion
    // #region 本体
    {
      id: 'R8S Souma 进入本体',
      type: 'ActorControl',
      netRegex: { command: '80000001', data0: '4EB6' },
      run: (data) => {
        data.soumaPhase = 'P2';
        data.soumaCombatantData.length = 0;
        data.soumaWolfs.length = 0;
        data.soumaTethers.length = 0;
        data.souma竹子预占位.length = 0;
        data.souma四连CloneIDs.length = 0;
        data.souma四连导航.length = 0;
        data.souma二穿一站位 = undefined;
      },
    },
    {
      id: 'R8S Souma 爆震',
      type: 'StartsUsing',
      netRegex: { id: 'A45A', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '双奶分摊' },
      },
    },
    {
      id: 'R8S Souma 魔光',
      type: 'HeadMarker',
      netRegex: { id: '000E', capture: true },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '魔光点名' } },
    },
    {
      id: 'R8S Souma 双牙击',
      type: 'StartsUsing',
      netRegex: { id: 'A4CD' },
      response: Responses.tankBuster(),
    },
    // A45F A460 A463 外右安全
    // A45F A460 A464 内右安全
    // A461 A462 A464 内左安全
    // A461 A462 A463 外左安全
    {
      id: 'R8S Souma 不堪一击',
      type: 'StartsUsing',
      netRegex: { id: ['A45F', 'A461', 'A463', 'A464'], capture: true },
      condition: (data) => data.souma远近线 === undefined,
      preRun: (data, matches) => data.souma不堪一击.push(matches),
      delaySeconds: 0.5,
      durationSeconds: 6.7 - 0.5,
      alertText: (data, _matches, output) => {
        if (data.souma不堪一击.length === 2) {
          const res = output[data.souma不堪一击.map((v) => v.id).sort().join('+')]();
          data.souma不堪一击.length = 0;
          return res;
        }
      },
      outputStrings: {
        'A45F+A463': '外+右',
        'A45F+A464': '内+右',
        'A461+A463': '外+左',
        'A461+A464': '内+左',
      },
    },
    {
      id: 'R8S Souma 刚刃一闪',
      type: 'StartsUsing',
      netRegex: { id: 'A464', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '走！' },
    },
    {
      id: 'R8S Souma 风震魔印',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: (data, matches) => data.party.nameToRole_[matches.target] === 'tank',
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBuster: { en: '风圈点名' },
          text: { en: '风圈点${player}' },
        };
        if (matches.target === data.me) {
          data.souma风震魔印T = true;
          return { alarmText: output.tankBuster() };
        }
        return {
          infoText: output.text({ player: data.party.member(matches.target) }),
        };
      },
    },
    // 不考虑开无敌的情况，不然没法写了
    {
      id: 'R8S Souma 风震魔印人群',
      type: 'GainsEffect',
      netRegex: { effectId: '112B' },
      infoText: (data, _matches, output) => {
        if (data.souma风震魔印T) {
          data.souma风震魔印T = false;
          return output.wind();
        }
        if (data.role === 'tank') {
          return output.nonWindTank();
        }
        return output.text();
      },
      outputStrings: {
        wind: { en: '风圈' },
        nonWindTank: { en: '死刑刀' },
        text: { en: '分摊' },
      },
    },
    {
      id: 'R8S Souma 风震魔印人群',
      type: 'StartsUsing',
      netRegex: { id: 'A46E', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '踩塔分组' } },
    },
    {
      id: 'R8S Souma 风狼阵',
      type: 'Ability',
      netRegex: { id: 'A46F', capture: true },
      preRun: (data, matches) => {
        const towerPos = getFloor(parseFloat(matches.x), parseFloat(matches.y));
        data.souma风狼阵.push({ name: matches.target, index: towerPos });
      },
    },
    {
      id: 'R8S Souma 风狼阵2',
      type: 'Ability',
      netRegex: { id: 'A46F', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const myIndex = data.souma风狼阵.find((v) => v.name === data.me).index;
        if (myIndex === 1 || myIndex === 4) {
          return output['14']();
        }
        if (myIndex === 2 || myIndex === 3) {
          return output['23']();
        }
        return output.unknown();
      },
      outputStrings: {
        '14': { en: '原地等线' },
        '23': { en: '去送线' },
        'unknown': { en: '???' },
      },
    },
    {
      id: 'R8S Souma 风狼阵线',
      type: 'Tether',
      netRegex: { id: '0054', capture: true },
      suppressSeconds: 999,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          line: { en: '带线远离' },
          in: { en: '返回 => 靠近引导' },
          leftStart: { en: '左起，返回' },
          rightStart: { en: '右起，返回' },
        };
        const targetIndex = data.souma风狼阵.find((v) => v.name === matches.target).index;
        const myIndex = data.souma风狼阵.find((v) => v.name === data.me).index;
        if (targetIndex === 1 || targetIndex === 2) {
          data.souma风狼阵处理 = [
            // { line: 1, in: 3 },
            { line: 2, in: 4 },
            { line: 3, in: 1 },
            { line: 4, in: 2 },
          ];
          if (myIndex === 1) {
            return { alertText: output.line() };
          }
          if (myIndex === 3) {
            return { alertText: output.in() };
          }
          return { infoText: output.leftStart() };
        }
        if (targetIndex === 3 || targetIndex === 4) {
          data.souma风狼阵处理 = [
            // { line: 4, in: 2 },
            { line: 3, in: 1 },
            { line: 2, in: 4 },
            { line: 1, in: 3 },
          ];
          if (myIndex === 2) {
            return { alertText: output.in() };
          }
          if (myIndex === 4) {
            return { alertText: output.line() };
          }
          return { infoText: output.rightStart() };
        }
      },
    },
    {
      id: 'R8S Souma 风狼阵 Ability',
      type: 'Ability',
      netRegex: { id: 'A472', capture: false },
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          line: { en: '接线后远离' },
          in: { en: '靠近引导' },
          text: { en: '${line}线${in}引' },
          back: { en: '回初始平台' },
        };
        const turn = data.souma风狼阵处理.shift();
        const myIndex = data.souma风狼阵.find((v) => v.name === data.me).index;
        if (turn) {
          if (myIndex === turn.line) {
            return { alertText: output.line() };
          }
          if (myIndex === turn.in) {
            return { alertText: output.in() };
          }
          return { infoText: output.text({ line: turn.line, in: turn.in }) };
        }
        return { infoText: output.back() };
      },
    },
    // A47B in
    // A47D in
    // A47C out
    // A47A mid(!)
    // A479 side
    {
      id: 'R8S Souma 回天动地收集',
      type: 'StartsUsingExtra',
      netRegex: { id: ['A47D', 'A47A', 'A479', 'A47C', 'A47B'], capture: true },
      preRun: (data, matches) => {
        const id = matches.id;
        const weapon = getWeapon(id);
        if (id === 'A47A') {
          // 月环不看面相，而是坐标
          const dir = Directions.xyTo16DirNum(
            parseFloat(matches.x),
            parseFloat(matches.y),
            100,
            100,
          );
          const floor = HdgDirToFloor[dir.toString()];
          data.souma回天动地.push({ floor, weapon });
        } else {
          const heading = parseFloat(matches.heading);
          // N = 0, NNE = 1, ..., NNW = 15
          const dir = Directions.hdgTo16DirNum(heading);
          const floor = HdgDirToFloor[dir.toString()];
          data.souma回天动地.push({ floor, weapon });
        }
      },
    },
    {
      id: 'R8S Souma 回天动地 全归档',
      type: 'HeadMarker',
      netRegex: { id: ['01F5', '01F6'] },
      // 01F5 橙色 <<<
      // 01F6 蓝色 >>>
      delaySeconds: 0.5,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) => data.party.details.find((p) => p.name === v.Name));
      },
      alertText: (data, matches, output) => {
        const handler = (f) =>
          matches.id === '01F5' ? (f === 1 ? 5 : (f - 1)) : (f === 5 ? 1 : (f + 1));
        data.souma回天动地Iterator = () => {
          data.souma回天动地 = data.souma回天动地.map((v) => {
            const f = v.floor;
            const newF = handler(f);
            return { weapon: v.weapon, floor: newF };
          });
        };
        // 第一次报点
        const gimmicks = data.souma回天动地.sort((a, b) =>
          matches.id === '01F5' ? (a.floor - b.floor) : (b.floor - a.floor)
        );
        const playersFloor = data.soumaCombatantData.map((v) => getFloor(v.PosX, v.PosY));
        // 以玩家数量最多的台子作为起始点
        const maxFloor = playersFloor.reduce((a, b) => Math.max(a, b));
        while (gimmicks[0].floor.toString() !== maxFloor.toString()) {
          gimmicks.push(gimmicks.shift());
        }
        return output.text({
          w1: output[gimmicks[0].weapon](),
          w2: output[gimmicks[1].weapon](),
          w3: output[gimmicks[2].weapon](),
          w4: output[gimmicks[3].weapon](),
          w5: output[gimmicks[4].weapon](),
        });
      },
      outputStrings: {
        'text': { en: '${w1}${w2}${w3}${w4}${w5}' },
        'in': { en: '内' },
        'out': { en: '外' },
        'side': { en: '侧' },
        'mid': { en: '中' },
      },
    },
    {
      id: 'R8S Souma 连击闪光炮收集',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A476', capture: true },
      preRun: (data, matches) => data.souma连击闪光炮.push(matches),
    },
    {
      id: 'R8S Souma 连击闪光炮',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A476', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      infoText: (data, _matches, output) => {
        if (data.soumaCombatantData.length === 0) {
          return;
        }
        const bits = data.souma连击闪光炮.map((v) => {
          const x = parseFloat(v.x);
          const y = parseFloat(v.y);
          const bit = getBit(x, y);
          return bit;
        });
        const nowFloor = getFloor(data.soumaCombatantData[0].PosX, data.soumaCombatantData[0].PosY);
        const nowBit = bits.find((v) => v.floor === nowFloor);
        const nowGimmick = data.souma回天动地.find((v) => v.floor === nowFloor);
        // console.warn(data.souma回天动地);
        data.souma回天动地Iterator();
        return output[`${nowGimmick.weapon}-${nowBit.safe}`]();
      },
      run: (data) => data.souma连击闪光炮.length = 0,
      outputStrings: {
        'in-left': { en: '靠近+左' },
        'in-right': { en: '靠近+右' },
        'out-left': { en: '远离+左' },
        'out-right': { en: '远离+右' },
        'mid-left': { en: '中间+左' },
        'mid-right': { en: '中间+右' },
        'side-left': { en: '左+外侧' },
        'side-right': { en: '右+外侧' },
      },
    },
    {
      id: 'R8S Souma 闪光炮收集',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A45E', capture: true },
      preRun: (data, matches) => data.souma闪光炮.push(matches),
      delaySeconds: 4,
      run: (data) => data.souma闪光炮.length = 0,
    },
    {
      id: 'R8S Souma 闪光炮',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A45E', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      infoText: (data, _matches, output) => {
        if (data.soumaCombatantData.length === 0) {
          return output.unknown();
        }
        const nowFloor = getFloor(data.soumaCombatantData[0].PosX, data.soumaCombatantData[0].PosY);
        const bits = data.souma闪光炮.map((v) => {
          const x = parseFloat(v.x);
          const y = parseFloat(v.y);
          const bit = getBit(x, y);
          return bit;
        });
        const nowBit = bits.find((v) => v.floor === nowFloor);
        return output[nowBit.safe]();
      },
      outputStrings: {
        unknown: { en: '躲浮游炮' },
        left: { en: '左半安全' },
        right: { en: '右半安全' },
      },
    },
    {
      id: 'R8S Souma 转移平台',
      type: 'GainsEffect',
      netRegex: { effectId: 'A12', capture: true },
      condition: (data, matches) => data.me === matches.target && data.souma闪光炮.length > 0,
      delaySeconds: 0.5,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      infoText: (data, _matches, output) => {
        if (data.soumaCombatantData.length === 0) {
          return output.unknown();
        }
        const nowFloor = getFloor(data.soumaCombatantData[0].PosX, data.soumaCombatantData[0].PosY);
        const bits = data.souma闪光炮.map((v) => {
          const x = parseFloat(v.x);
          const y = parseFloat(v.y);
          const bit = getBit(x, y);
          return bit;
        });
        const nowBit = bits.find((v) => v.floor === nowFloor);
        return output[nowBit.safe]();
      },
      outputStrings: {
        unknown: { en: '躲浮游炮' },
        left: { en: '左半安全' },
        right: { en: '右半安全' },
      },
    },
    {
      id: 'R8S Souma 魔狼战型·咒刃之相',
      type: 'StartsUsing',
      netRegex: { id: 'A82C', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '远近线站位' } },
    },
    {
      id: 'R8S Souma 远近线',
      type: 'Tether',
      // 013D 近线
      // 013E 远线
      netRegex: { id: '013[DE]', capture: true },
      condition: (data, matches) => matches.target === data.me || matches.source === data.me,
      durationSeconds: 21,
      alertText: (data, matches, output) => {
        const line = matches.id === '013D' ? 'near' : 'far';
        data.souma远近线 = line;
        return output[`${line}-${data.role}`]({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        'near-tank': { en: '近线：与${player}踩双人塔' },
        'far-tank': { en: '远线：等待${player}移动2次，再向右移动' },
        'near-healer': { en: '近线：与${player}贴贴' },
        'far-healer': { en: '远线：与${player}' },
        'near-dps': { en: '近线：与${player}贴贴' },
        'far-dps': { en: '远线：向右移动两次 (与${player})' },
      },
    },
    {
      id: 'R8S Souma 魔狼战型·咒刃之相2',
      type: 'StartsUsing',
      netRegex: { id: 'A82C', capture: false },
      delaySeconds: 23,
      infoText: (data, _matches, output) => output[`${data.souma远近线}-${data.role}`](),
      outputStrings: {
        'near-tank': { en: '踩双人塔' },
        'far-tank': { en: '踩单人塔（站在边缘）' },
        'near-healer': { en: '踩三人塔' },
        'far-healer': { en: '踩三人塔（站在边缘）' },
        'near-dps': { en: '踩三人塔' },
        'far-dps': { en: '踩三人塔（站在边缘）' },
      },
    },
    {
      id: 'R8S Souma 最后一次不堪一击',
      type: 'StartsUsing',
      netRegex: { id: ['A45F', 'A461', 'A463', 'A464'], capture: true },
      condition: (data) => data.souma远近线 !== undefined,
      preRun: (data, matches) => data.souma不堪一击.push(matches),
      delaySeconds: 0.5,
      durationSeconds: 6.7 - 0.5,
      promise: async (data) => {
        if (data.souma不堪一击.length === 2) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
            names: [data.me],
          })).combatants;
        }
      },
      alertText: (data, _matches, output) => {
        if (data.souma不堪一击.length === 2) {
          // A45F 右安全
          // A45F 右安全
          // A461 左安全
          // A461 左安全
          const heading = data.souma不堪一击.filter((v) =>
            v.id === 'A45F' || v.id === 'A461'
          )[0].heading;
          const headingFloor =
            HdgDirToFloor[Directions.hdgTo16DirNum(parseFloat(heading)).toString()];
          if (data.soumaCombatantData.length === 0) {
            return output[`${data.souma不堪一击.map((v) => v.id).sort().join('+')}`]();
          }
          const nowFloor = getFloor(
            data.soumaCombatantData[0].PosX,
            data.soumaCombatantData[0].PosY,
          );
          const rawSub = nowFloor - headingFloor;
          const sub = (Math.abs(rawSub) >= 3 && Math.abs(rawSub) <= 5)
            ? (rawSub < 0 ? rawSub + 5 : rawSub - 5)
            : rawSub;
          const res = output[`sub${sub}+${data.souma不堪一击.map((v) => v.id).sort().join('+')}`]();
          data.souma不堪一击.length = 0;
          return res;
        }
      },
      outputStrings: {
        'A45F+A463': '去右边+远离',
        'A45F+A464': '去右边+靠近',
        'A461+A463': '去左边+远离',
        'A461+A464': '去左边+靠近',
        'sub0+A45F+A463': '原地 外+右',
        'sub0+A45F+A464': '原地 内+右',
        'sub0+A461+A463': '原地 外+左',
        'sub0+A461+A464': '原地 内+左',
        'sub1+A45F+A463': '原地远离',
        'sub1+A45F+A464': '原地靠近',
        'sub1+A461+A463': '左1格 => 外+左',
        'sub1+A461+A464': '左1格 => 内+左',
        'sub2+A45F+A463': '原地远离',
        'sub2+A45F+A464': '原地靠近',
        'sub2+A461+A463': '右1格 => 外+右',
        'sub2+A461+A464': '右1格 => 内+右',
        'sub-1+A45F+A463': '右1格 => 外+右',
        'sub-1+A45F+A464': '右1格 => 内+右',
        'sub-1+A461+A463': '原地远离',
        'sub-1+A461+A464': '原地靠近',
        'sub-2+A45F+A463': '左1格 => 外+左',
        'sub-2+A45F+A464': '左1格 => 内+左',
        'sub-2+A461+A463': '原地远离',
        'sub-2+A461+A464': '原地靠近', // 左1格 => 内+右
      },
    },
    // 暂时不知为何2种ID 似乎AA02是第一轮 之后都是A494
    {
      id: 'R8S Souma 八连光弹',
      type: 'StartsUsing',
      netRegex: { id: ['AA02', 'A494'], capture: false },
      preRun: (data) => data.souma八连光弹Counter++,
      alertText: (data, _matches, output) => output.text({ count: data.souma八连光弹Counter }),
      outputStrings: { text: { en: '第${count}轮八连分摊' } },
    },
    {
      id: 'R8S Souma 刚刃一闪',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A74C', capture: true },
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      response: (data, matches, output) => {
        if (data.soumaCombatantData.length === 0) {
          return { infoText: output.unknown() };
        }
        const heading = parseFloat(matches.heading);
        // N = 0, NNE = 1, ..., NNW = 15
        const dir = Directions.hdgTo16DirNum(heading);
        const playerFloor = getFloor(
          data.soumaCombatantData[0].PosX,
          data.soumaCombatantData[0].PosY,
        );
        const damagedFloor = HdgDirToFloor[dir.toString()];
        if (playerFloor === damagedFloor) {
          return { alarmText: output.change() };
        }
        return { infoText: output.text() };
      },
      outputStrings: {
        change: { en: '走！' },
        text: { en: '不动' },
        unknown: { en: '拆地板' },
      },
    },
    {
      id: 'R8S Souma 刚刃一闪·终',
      type: 'StartsUsing',
      netRegex: { id: 'A49D', capture: false },
      countdownSeconds: (_data, matches) => parseFloat(matches.duration),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '狂暴' } },
    },
    // #endregion
  ],
});
