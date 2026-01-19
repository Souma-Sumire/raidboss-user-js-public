const center = {
  x: 100,
  y: 100,
};
const weaponMap = {
  '11D1': '十字',
  '11D2': '钢铁',
  '11D3': '月环',
};
const equal = (num, target, diff = 0.1) => {
  return Math.abs(num - target) < diff;
};
const orbitalMap = {
  'X2': [
    [1, 0],
    [1, 0],
  ],
  'X3': [
    [0, 1],
    [0, 1],
  ],
  'Y2': [
    [1, 1],
    [0, 0],
  ],
  'Y3': [
    [0, 0],
    [1, 1],
  ],
};
const getOrb = (arr) => {
  const orb = arr.map((v) => orbitalMap[v.pos]).filter((v) => !!v);
  return orb;
};
const getOrbitalInt = (orb) => {
  const int = orb.reduce((a, b) => {
    return [
      [a[0][0] | b[0][0], a[0][1] | b[0][1]],
      [a[1][0] | b[1][0], a[1][1] | b[1][1]],
    ];
  }, [
    [0, 0],
    [0, 0],
  ]);
  return int;
};
const getOrbitalSafe = (orbStr) => {
  const map = {
    '0101': 'left',
    '1010': 'right',
    '1100': 'bottom',
    '0011': 'top',
    '1110': 'bottom right',
    '1101': 'bottom left',
    '1011': 'top right',
    '0111': 'top left',
  };
  return map[orbStr];
};
const orbitalEasyCase = ['bottom right', 'bottom left', 'top left', 'top right'];
const handleOrb = (arr) => {
  const orb = getOrb(arr);
  const int = getOrbitalInt(orb);
  const safe = getOrbitalSafe(int.map((x) => x.map((x) => x.toString()).join('')).join(''));
  return { orb, int, safe };
};
const headMarkerData = {
  // Offsets: 08:58
  // Vfx Path: m0017trg_a0c
  '001E': '001E',
  // Offsets: 01:51
  // Vfx Path: target_ae_s5f
  '008B': '008B',
  // Offsets: 01:25, 02:25
  // Vfx Path: com_share3t
  '00A1': '00A1',
  // Offsets: 04:54, 05:04, 05:14, 06:36, 07:08
  // Vfx Path: lockon8_t0w
  '00F4': '00F4',
  // Offsets: 07:22
  // Vfx Path: com_share4a1
  '0131': '0131',
  // Offsets: 04:54, 05:04, 05:14, 05:25
  // Vfx Path: share_laser_5sec_0t
  '020D': '020D',
  '0164': '0164',
};
Options.Triggers.push({
  id: 'AacHeavyweightM3Savage',
  zoneId: ZoneId.AacHeavyweightM3Savage,
  zoneLabel: { en: 'M11S Souma特供版' },
  overrideTimelineFile: true,
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
6.0 "--sync--" StartsUsing { id: "B406" } windows 60,10
11.3 "天顶的主宰" # Ability { id: "B406" } #The Tyrant（Boss）
18.5 "铸兵之令：轰击" # Ability { id: "B422" } #The Tyrant（Boss）
39.3 "历战之兵武" # Ability { id: "B416" } #The Tyrant（Boss）
55.8 "重打击" # Ability { id: "B41B" } #The Tyrant（分身）
73.3 "历战之兵武" # Ability { id: "B416" } #The Tyrant（Boss）
80.5 "彗星雨" # Ability { id: "B412" } #The Tyrant（Boss）
90.7 "重彗星" # Ability { id: "B415" } #The Tyrant（分身）
101.0 "重打击" # Ability { id: "B41B" } #The Tyrant（分身）
123.4 "天顶的主宰" # Ability { id: "B406" } #The Tyrant（Boss）
136.1 "铸兵之令：统治" # Ability { id: "B7BB" } #The Tyrant（Boss）
142.2 "统治的战舞" # Ability { id: "B41E" } #The Tyrant（Boss）
146.8 "统治的战舞" # Ability { id: "B7EA" } #The Tyrant（分身）
151.7 "霸王飓风" # Ability { id: "B424" } #The Tyrant（分身）
157.8 "铸兵之令：轰击" # Ability { id: "B423" } #The Tyrant（Boss）
165.3 "重斩击" # Ability { id: "B410" } #The Tyrant（分身）
180.5 "霸王大漩涡" # Ability { id: "B425" } #The Tyrant（Boss）
186.2 "历战之极武" # Ability { id: "B7ED" } #The Tyrant（Boss）
194.0 "铸兵崩落" # Ability { id: "B7EE" } #The Tyrant（Boss）
206.3 "重打击" # Ability { id: "B41B" } #The Tyrant（分身）
211.4 "重打击" # Ability { id: "B41B" } #The Tyrant（分身）
229.0 "万劫不朽的统治" # Ability { id: "B428" } #The Tyrant（Boss）
242.2 "举世无双的霸王" # Ability { id: "B42A" } #The Tyrant（分身）
254.4 "火焰流" # Ability { id: "B42B" } #The Tyrant（Boss）
276.6 "兽焰连尾击" # Ability { id: "B42F" } #The Tyrant（Boss）
277.1 "星轨链" # Ability { id: "B433" } #The Tyrant（分身）
277.6 "兽焰连尾击" # Ability { id: "B431" } #The Tyrant（分身）
294.1 "流星雨" # Ability { id: "B434" } #The Tyrant（Boss）
311.4 "夺命链" # Ability { id: "B436" } #The Tyrant（分身）
336.1 "三重霸王坠击" # Ability { id: "B43B" } #The Tyrant（Boss）
362.3 "绝命分断击" # Ability { id: "B43F" } #The Tyrant（Boss）
364.3 "绝命分断击" # Ability { id: "BA90" } #The Tyrant（分身）
405.7 "火焰吐息" # Ability { id: "B446" } #The Tyrant（Boss）
406.5 "王者陨石震" # Ability { id: "B443" } #The Tyrant（分身）
406.5 "王者陨石雨" # Ability { id: "B442" } #The Tyrant（分身）
406.5 "火焰吐息" # Ability { id: "B447" } #The Tyrant（分身）
438.6 "王者陨石震" # Ability { id: "B443" } #The Tyrant（分身）
438.6 "王者陨石雨" # Ability { id: "B442" } #The Tyrant（分身）
438.6 "火焰吐息" # Ability { id: "B447" } #The Tyrant（分身）
448 "重陨石" # Ability { id: "B448" } #The Tyrant（Boss）
472.3 "登天碎地" # Ability { id: "B451" } #The Tyrant（分身）
482.9 "天顶的主宰" # Ability { id: "B406" } #The Tyrant（Boss）
494.1 "火焰流" # Ability { id: "B42B" } #The Tyrant（Boss）
507.7 "星轨链" # Ability { id: "B432" } #The Tyrant（Boss）
517.2 "兽焰连尾击" # Ability { id: "B431" } #The Tyrant（分身）
525.6 "天顶的主宰" # Ability { id: "B406" } #The Tyrant（Boss）
538.2 "陨石狂奔" # Ability { id: "B452" } #The Tyrant（Boss）
545.3 "遮天陨石" # Ability { id: "B453" } #The Tyrant（分身）
561.3 "重轰击" # Ability { id: "B457" } #The Tyrant（分身）
570.9 "王者陨石震" # Ability { id: "B459" } #The Tyrant（分身）
575.1 "双向回旋火" # Ability { id: "B7BE" } #The Tyrant（分身）
583.5 "天顶的主宰" # Ability { id: "B406" } #The Tyrant（Boss）
596.1 "碎心踢x6" # Ability { id: "B45D" } #The Tyrant（Boss）
615.3 "碎心踢x7" # Ability { id: "B45D" } #The Tyrant（Boss）
636.5 "碎心踢x8" # Ability { id: "B45D" } #The Tyrant（Boss）`,
  initData: () => {
    return {
      sCombatants: [],
      sActorPositions: {},
      sActorParam1: [],
      sWeaponCount: 0,
      sLastWeapon: undefined,
      sSword: [],
      sPhase: 'p1',
      sCw: true,
      sTether: {},
      sPlayer: undefined,
      sMeteor: [],
      sMeteorTether: {},
      sTowerCount: 0,
      sIsTether: false,
      sTetherCount: 0,
      sOrbital: [],
      sOrbitalSafe: [],
    };
  },
  triggers: [
    {
      id: 'souma r11s ActorSetPos Tracker',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      preRun: (data, matches) => {
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        };
        if (data.sPhase === '劈刀') {
          const x = parseFloat(matches.x);
          const y = parseFloat(matches.y);
          if (
            ((equal(x, 85) || equal(x, 115)) && equal(y, 100)) ||
            ((equal(y, 85) || equal(y, 115)) && equal(x, 100))
          ) {
            if (data.sSword.find((sword) => sword.x === x && sword.y === y)) {
              return;
            }
            data.sSword.push({ x, y });
          }
        }
      },
      durationSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.sSword.length === 3 && data.sPhase === '劈刀') {
          const dirs = data.sSword.map((v) => Directions.xyTo4DirNum(v.x, v.y, center.x, center.y));
          const none = [0, 1, 2, 3].filter((v) => !dirs.includes(v))[0];
          const dir = ['dirN', 'dirE', 'dirS', 'dirW'][none];
          data.sSword.length = 0;
          data.sPhase = '劈刀后';
          return output.text({ dir: output[dir]() });
        }
      },
      outputStrings: {
        dirN: { en: '远离南' },
        dirE: { en: '远离西' },
        dirS: { en: '远离北' },
        dirW: { en: '远离东' },
        text: { en: '${dir}' },
      },
    },
    {
      id: 'souma r11s ActorMove Tracker',
      type: 'ActorMove',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        },
    },
    {
      id: 'souma r11s B7BB',
      type: 'StartsUsing',
      netRegex: { id: 'B7BB', capture: false },
      response: Responses.aoe(),
      run: (data) => data.sPhase = '劈刀',
    },
    {
      id: 'souma r11s 拉线',
      type: 'Tether',
      netRegex: { id: ['0039', '00F9'], capture: true },
      condition: (data) => data.sPhase === '连线',
      preRun: (data, matches) => {
        data.sTether[matches.target] = true;
      },
    },
    {
      id: 'souma r11s 拉线吗',
      type: 'Tether',
      netRegex: { id: ['0039', '00F9'], capture: true },
      condition: (data) => data.sPhase === '连线',
      delaySeconds: 0.5,
      suppressSeconds: 30,
      alertText: (data, _matches, output) => {
        data.sIsTether = !!data.sTether[data.me];
        return data.sIsTether ? output.line() : output.noLine();
      },
      outputStrings: {
        line: { en: '连线' },
        noLine: { en: '闲人' },
      },
    },
    {
      id: 'souma r11s 拉线完了',
      type: 'Tether',
      netRegex: { id: ['0039', '00F9'], capture: true },
      condition: (data) => data.sPhase === '连线',
      delaySeconds: 30,
      suppressSeconds: 30,
      run: (data) => {
        data.sIsTether = false;
        data.sTether[data.me] = false;
      },
    },
    {
      id: 'souma r11s 爆炸了快',
      type: 'StartsUsing',
      netRegex: { id: 'B444', capture: false },
      suppressSeconds: 1,
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '踩塔' },
      },
    },
    {
      id: 'souma r11s 爆炸了兄弟真的',
      type: 'StartsUsing',
      netRegex: { id: 'B444', capture: false },
      delaySeconds: 21,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        data.sTetherCount++;
        if (data.sTetherCount >= 3) {
          return;
        }
        return data.sIsTether ? output.line() : output.noLine();
      },
      outputStrings: {
        line: { en: '边缘中点' },
        noLine: { en: '数字标点' },
      },
    },
    {
      id: 'souma r11s Headmarker Custom 001E',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['001E'], capture: true },
      preRun: (data, matches) => {
        data.sMeteor.push(matches.target);
      },
    },
    {
      id: 'souma r11s Headmarker Spread 008B',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['008B'], capture: true },
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      id: 'souma r11s Headmarker Stack 00A1',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['00A1'], capture: true },
      condition: (data) => data.sPhase !== '劈刀',
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分摊' } },
    },
    {
      id: 'souma r11s Headmarker Healer Groups 0131',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['0131'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.healerGroups(),
      outputStrings: {
        healerGroups: {
          en: 'Healer Groups x5',
          cn: '双奶分组分摊 x5',
        },
      },
    },
    {
      id: 'souma r11s 天顶的主宰',
      type: 'StartsUsing',
      netRegex: { id: 'B406', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r11s 铸兵之令：轰击',
      type: 'StartsUsing',
      netRegex: { id: ['B422', 'B423'], capture: true },
      durationSeconds: 10,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          tankStack: { en: '分摊死刑' },
          tankCone: { en: '扇形死刑' },
          otherStack: { en: '集合分摊' },
          otherSpread: { en: '散开' },
        };
        if (matches.id === 'B423') {
          // T扇形死刑 人群集合分摊
          if (data.role === 'tank') {
            return { alarmText: output.tankCone() };
          }
          return { infoText: output.otherStack() };
        }
        if (matches.id === 'B422') {
          // T分摊死刑 人群分散
          if (data.role === 'tank') {
            return { alarmText: output.tankStack() };
          }
          return { infoText: output.otherSpread() };
        }
      },
    },
    {
      id: 'souma r11s 猪鼻突袭',
      type: 'ActorControlExtra',
      netRegex: {
        category: '0197',
        param1: [
          // 十字
          '11D1',
          // 钢铁
          '11D2',
          // 月环
          '11D3',
        ],
      },
      preRun: (data, matches) => {
        const gimmick = weaponMap[matches.param1];
        data.sActorParam1.push({
          id: matches.id,
          gimmick: gimmick,
        });
      },
    },
    {
      id: 'souma r11s 猪鼻突袭 init',
      type: 'StartsUsing',
      netRegex: { id: ['B416', 'B425'], capture: false },
      preRun: (data) => {
        data.sActorParam1.length = 0;
        data.sWeaponCount = 0;
        data.sLastWeapon = undefined;
        data.sCw = true;
      },
    },
    {
      id: 'souma r11s 猪鼻突袭?',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B417', 'B418', 'B419', 'B41A', 'B7EE'], capture: true },
      // 等上一轮机制结束再报下一个
      delaySeconds: (data) => data.sPhase === 'p1' ? (data.sLastWeapon === undefined ? 0 : 1.5) : 0,
      durationSeconds: (data) =>
        data.sPhase === 'p1' ? (data.sLastWeapon === undefined ? 5.5 : 4) : 4,
      alertText: (data, matches, output) => {
        data.sWeaponCount++;
        const dirNum = Directions.hdgTo16DirNum(parseFloat(matches.heading));
        const dists = data.sActorParam1.map((v) => {
          const actor = data.sActorPositions[v.id];
          if (!actor) {
            throw new Error(`未找到武器${v.id}`);
          }
          const x = data.sActorPositions[v.id].x;
          const y = data.sActorPositions[v.id].y;
          const d = Directions.xyTo16DirNum(actor.x, actor.y, center.x, center.y);
          return {
            ...v,
            x: x,
            y: y,
            dirNum: d,
            dist: Math.abs(d - dirNum),
          };
        });
        if (data.sLastWeapon === undefined) {
          const mostClosest = dists.sort((a, b) => a.dist - b.dist)[0];
          // 1
          data.sLastWeapon = mostClosest;
          return output[mostClosest.gimmick]();
        }
        // 非1
        if (
          (data.sPhase === 'p1' && data.sWeaponCount === 4) ||
          (data.sPhase === '大漩涡后' && data.sWeaponCount === 7)
        ) {
          return;
        }
        if (data.sPhase === '大漩涡后') {
          const weapon = data.sActorParam1[data.sWeaponCount - 1];
          if (weapon) {
            if (data.sWeaponCount === 6) {
              return output[weapon.gimmick]() + output['cone']();
            }
            return output[weapon.gimmick]();
          }
        }
        for (let i = 1; i < 16; i++) {
          let next = data.sLastWeapon.dirNum + (data.sCw ? i : -i);
          if (next >= 16) {
            next -= 16;
          }
          if (next < 0) {
            next += 16;
          }
          const nextWeapon = dists.find((v) => v.dirNum === next);
          if (nextWeapon) {
            data.sLastWeapon = nextWeapon;
            return output[nextWeapon.gimmick]();
          }
        }
        return output.unknown();
      },
      outputStrings: {
        'unknown': { en: '???' },
        '钢铁': { en: '钢铁+分摊' },
        '十字': { en: '十字+四四' },
        '月环': { en: '月环+八方' },
        'cone': { en: ' => 引导风圈' },
      },
    },
    /*
    [00:43:57.259] 263 107:40000DD9:B406:99.918:101.657:0.122:-2.998  AOE
    [00:44:07.418] 263 107:40000DD9:B423:99.918:101.657:0.122:-3.141 死刑
    [00:44:27.147] 263 107:40000DD9:B416:100.009:100.009:0.214:-3.142 召唤兵武
    [00:44:34.012] 263 107:40000DD9:B417:100.009:100.009:0.214:0.262 兵武1
    [00:44:40.250] 263 107:40000DFD:B418:103.122:111.606:0.000:0.262 兵武2
    [00:44:45.368] 263 107:40000DFD:B41A:88.412:96.896:0.000:-2.356 兵武3
    [00:44:50.494] 263 107:40000DFD:B419:108.493:91.525:0.000:1.832 ？
    [00:45:01.713] 263 107:40000DD9:B416:100.009:100.009:0.214:-2.767 召唤兵武
        */
    {
      id: 'souma r11s 彗星雨 B412',
      type: 'StartsUsing',
      netRegex: { id: 'B412', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '准备3连黄圈',
        },
      },
    },
    {
      id: 'souma r11s 彗星雨 B412 后',
      type: 'StartsUsing',
      netRegex: { id: 'B412', capture: false },
      delaySeconds: 29,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '3连黄圈',
        },
      },
    },
    {
      id: 'souma r11s 霸王大漩涡 B425',
      type: 'StartsUsing',
      netRegex: { id: 'B425', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.sPhase = '大漩涡后';
      },
      outputStrings: {
        text: {
          en: '清1血',
        },
      },
    },
    {
      id: 'souma r11s 举世无双的霸王',
      type: 'StartsUsing',
      netRegex: { id: ['B429', 'B42A'], capture: false },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'souma r11s 火焰流',
      type: 'StartsUsing',
      netRegex: { id: 'B42B', capture: false },
      response: Responses.tankBuster(),
    },
    {
      id: 'souma r11s 绝命分断击',
      type: 'StartsUsing',
      netRegex: { id: 'BA90', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.sPhase = '连线',
      outputStrings: {
        text: {
          en: 'AoE 站目标圈内',
        },
      },
    },
    {
      id: 'souma r11s 星轨链 B432',
      type: 'StartsUsing',
      netRegex: { id: 'B432', capture: false },
      preRun: (data) => {
        data.sPhase = '星轨';
      },
      delaySeconds: 20,
      run: (data) => {
        data.sPhase = '星轨后';
        data.sOrbital.length = 0;
        data.sOrbitalSafe.length = 0;
      },
    },
    {
      id: 'souma r11s 星轨链 B433',
      type: 'StartsUsingExtra',
      netRegex: { id: 'B433', capture: true },
      preRun: (data, matches) => {
        /*
                            X1            X2               X3               X4
                      {x: 85, y: 75} {x: 95, y: 75}  {x: 105, y: 75} {x: 115, y: 75}
                                                                                      {x: 125, y: 85}  Y1
                                                                                      {x: 125, y: 95}  Y2
                                                                                      {x: 125, y: 105} Y3
                                                                                      {x: 125, y: 115} Y4
                */
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        const isX = equal(y, 75, 1);
        const isY = equal(x, 125, 1);
        const xCount = Math.round((x - 85) / 10) + 1;
        const yCount = Math.round((y - 85) / 10) + 1;
        if (isX && (xCount < 1 || xCount > 4)) {
          throw new Error(`Invalid orbital X position: ${x}, ${y} ${xCount}, ${yCount}`);
        }
        if (isY && (yCount < 1 || yCount > 4)) {
          throw new Error(`Invalid orbital Y position: ${x}, ${y} ${xCount}, ${yCount}`);
        }
        const pos = isX ? `X${xCount}` : isY ? `Y${yCount}` : 'Unknown';
        data.sOrbital.push({
          x: x,
          y: y,
          pos: pos,
        });
      },
      durationSeconds: 6,
      infoText: (data, _matches, output) => {
        if (data.sOrbital.length === 2) {
          const { safe } = handleOrb(data.sOrbital);
          data.sOrbitalSafe.push(safe);
        }
        if (data.sOrbital.length === 4) {
          const { safe } = handleOrb(data.sOrbital.slice(2, 4));
          data.sOrbitalSafe.push(safe);
          const s = data.sOrbitalSafe;
          const speed = s[0] === undefined ? 'slow' : 'fast';
          const eazy = orbitalEasyCase.includes(speed === 'fast' ? s[0] : s[1]);
          if (eazy) {
            // 简单模式：一步斜穿 第1下穿
            if (speed === 'fast') {
              return output.eazyFast({ dir: output[`first ${s[0]}`]() });
            }
            // 简单模式：一步斜穿 第2下穿
            if (speed === 'slow') {
              return output.eazySlow({
                dir: output[`second ${s[1]}`](),
              });
            }
          }
          if (!eazy) {
            // 困难模式 34穿12
            return output.hard({
              dir1: output[`first ${s[0]}`](),
              dir2: output[s[1]](),
            });
          }
          throw new Error('Unknown case');
        }
      },
      outputStrings: {
        'eazySlow': { en: '${dir} => 第二下斜穿' },
        'eazyFast': { en: '${dir} => 斜穿' },
        'hard': { en: '${dir1} => ${dir2} => 斜穿' },
        'left': { en: '左' },
        'right': { en: '右' },
        'bottom': { en: '下' },
        'top': { en: '上' },
        'bottom right': { en: '右下' },
        'bottom left': { en: '左下' },
        'top right': { en: '右上' },
        'top left': { en: '左上' },
        'first left': { en: '左' },
        'first right': { en: '右' },
        'first bottom': { en: '下两侧' },
        'first top': { en: '上两侧' },
        'first bottom right': { en: '右偏下' },
        'first bottom left': { en: '左偏下' },
        'first top right': { en: '右偏上' },
        'first top left': { en: '左偏上' },
        'second left': { en: '左' },
        'second right': { en: '右' },
        'second bottom': { en: '下' },
        'second top': { en: '上' },
        'second bottom right': { en: '右偏下' },
        'second bottom left': { en: '左偏下' },
        'second top right': { en: '右偏上' },
        'second top left': { en: '左偏上' },
      },
    },
    {
      id: 'souma r11s 碎心踢',
      type: 'StartsUsing',
      netRegex: { id: 'B45D', capture: true },
      alertText: (data, _matches, output) => {
        return output.text({ num: ++data.sTowerCount });
      },
      outputStrings: {
        text: { en: '${num}塔' },
      },
    },
    {
      id: 'souma r11s 碎心击',
      type: 'StartsUsing',
      netRegex: { id: 'B462', capture: true },
      countdownSeconds: 7.7,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Enrage',
          cn: '狂暴',
        },
      },
    },
    // D安全，1安全
    // [01:28:33.222] 263 107:4000FCE3:B450:100.009:100.009:0.214:1.571
    // [01:28:33.266] 263 107:4000FD08:B451:104.343:97.507:0.000:-1.047
    // B安全，2安全
    // [23:50:29.796] 263 107:4000CC76:B44A:100.009:100.009:0.214:-1.571
    // [23:50:29.796] 263 107:4000CC9A:B44B:95.676:97.507:0.000:1.047
    // B安全，3安全
    // [00:19:10.373] 263 107:4002E382:B44C:100.009:100.009:0.214:-1.571
    // [00:19:10.373] 263 107:4002E3A6:B44D:95.676:102.512:0.000:2.094
    // D安全，4安全
    // [01:54:24.950] 263 107:400063DC:B44E:100.009:100.009:0.214:1.571
    // [01:54:24.995] 263 107:40006400:B44F:104.343:102.512:0.000:-2.094
    {
      id: 'souma r11s 碎地板2',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B44E', 'B44C', 'B450', 'B44A'], capture: true },
      delaySeconds: 0.5,
      durationSeconds: 15.2,
      countdownSeconds: 15.2,
      suppressSeconds: 1,
      promise: async (data) => {
        const player = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.find((v) => v.Name === data.me);
        data.sPlayer = player;
      },
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          '1': { en: '1点' },
          '2': { en: '2点' },
          '3': { en: '3点' },
          '4': { en: '4点' },
          'text': { en: '${sw} => ${num}安全' },
          'switch': { en: '去对面' },
          'stay': { en: '留原地' },
        };
        const safeLookup = {
          B450: ['left', '1'],
          B44A: ['right', '2'],
          B44C: ['right', '3'],
          B44E: ['left', '4'],
        };
        const safe = safeLookup[matches.id];
        if (!safe) {
          // Handle the error: log it, return early, or set defaults
          console.error(`ID ${matches.id} not found in safe mapping`);
          return;
        }
        const [sideSide, num] = safe;
        const playerSide = data.sPlayer.PosX < 100 ? 'left' : 'right';
        const needSwitch = playerSide !== sideSide;
        const sw = needSwitch ? output.switch() : output.stay();
        return {
          [sw ? 'alertText' : 'infoText']: output.text({ num, sw }),
        };
      },
    },
    {
      id: 'souma r11s 陨石狂奔',
      type: 'StartsUsing',
      netRegex: { id: 'B452', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.sPhase === '陨石',
      outputStrings: {
        text: { en: '预站位' },
      },
    },
    {
      id: 'souma r11s 陨石点名结算',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['001E'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          text: { en: '火圈点名' },
          noMeteor: { en: '场中等待六连黄圈' },
        };
        if (data.sMeteor.includes(data.me)) {
          return {
            alertText: output.text(),
          };
        }
        return {
          infoText: output.noMeteor(),
        };
      },
    },
    {
      id: 'souma r11s 陨石拉线',
      type: 'Tether',
      netRegex: { id: ['0039', '00F9'], capture: true },
      condition: (data) => data.sPhase === '陨石',
      preRun: (data, matches) => {
        data.sMeteorTether[matches.target] = true;
      },
    },
    {
      id: 'souma r11s 陨石拉线之',
      type: 'Tether',
      netRegex: { id: ['0039', '00F9'], capture: true },
      condition: (data, matches) => data.me === matches.target && data.sPhase === '陨石',
      delaySeconds: 0.5,
      durationSeconds: 8,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        const line = data.sMeteorTether[data.me];
        if (line) {
          return output.line();
        }
      },
      outputStrings: {
        line: { en: '拉线至右下' },
        noLine: { en: '场中集合' },
      },
    },
    {
      id: 'souma r11s 我有四向精神病',
      type: 'StartsUsing',
      netRegex: { id: 'B45A', capture: false },
      durationSeconds: 5.7,
      countdownSeconds: 5.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: 'X字二二分摊' },
      },
    },
    {
      id: 'souma r11s 我有双向精神病',
      type: 'StartsUsing',
      netRegex: { id: 'B7BD', capture: false },
      durationSeconds: 5.7,
      countdownSeconds: 5.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '上下四四分摊' },
      },
    },
  ],
});
