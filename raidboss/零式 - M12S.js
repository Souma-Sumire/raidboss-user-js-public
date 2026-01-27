// Build Time: 2026-01-27T20:52:16.489Z
const headmarkers = {
  '点奶分摊': '00A9',
  '死刑': '0160',
  '拉线': '0299',
  '分摊': '0145',
  '分散': '017F',
};
const getHeadmarkerId = (data, matches) => {
  if (data.firstHeadmarker === undefined) {
    return undefined;
  }
  if (data.sStage === '本体') {
    // 本体不需要
    return undefined;
  }
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - parseInt(data.firstHeadmarker, 16);
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object')
    return obj;
  if (Array.isArray(obj))
    return obj.map((item) => deepClone(item));
  const clone = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      clone[key] = deepClone(obj[key]);
  }
  return clone;
};
const mjMap = {
  BBC: '1麻',
  BBD: '2麻',
  BBE: '3麻',
  D7B: '4麻',
  1292: 'beta',
  1290: 'alpha',
};
const towers = {
  '1EBF25': '风',
  '1EBF26': '暗',
  '1EBF27': '土',
  '1EBF28': '火',
};
const center = { x: 100, y: 100 };
const equal = (num, target, diff = 0.1) => {
  return Math.abs(num - target) < diff;
};
const getDis = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
Options.Triggers.push({
  id: 'AacHeavyweightM4Savage',
  zoneId: ZoneId.AacHeavyweightM4Savage,
  zoneLabel: { en: 'M12S Souma特供版' },
  config: [
    {
      id: 'soumaM12Sbentiyiyun',
      name: {
        en: '本体一运近战报法',
      },
      type: 'select',
      options: {
        en: {
          '整合文档（看刀）': 'doc',
          'MMW（猫猫窝）': 'mmw',
          '不报安全区（精准）': 'skip',
        },
      },
      default: 'doc',
    },
    {
      id: 'soumaM12Sbentisiyun',
      name: {
        en: '本体四运分组分摊处理方法',
      },
      type: 'select',
      options: {
        en: {
          '盗火改（MT组ST组）': 'stealfire',
          '盗火uptime（T组远程组近战闲人）': 'uptime',
        },
      },
      default: 'stealfire',
    },
  ],
  overrideTimelineFile: true,
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
11 "--sync--" StartsUsing { id: "B4D7" } window 20,20 #Lindwurm（Boss）
15.9 "补天之手" # Ability { id: "B4D7" } #Lindwurm（Boss）
41.3 "致命灾变" # Ability { id: "B495" } #Lindwurm（Boss）
70.7 "细胞附身·早期" # Ability { id: "BEBD" } #Lindwurm（Boss）
77.9 "极饿伸展" # Ability { id: "B469" } #Lindwurm（Boss）
108.2 "补天之手" # Ability { id: "B4D7" } #Lindwurm（Boss）
120.4 "细胞附身·中期" # Ability { id: "BEBE" } #Lindwurm（Boss）
135.6 "残暴拘束" # Ability { id: "B4B8" } #Lindwurm（Boss）
141.6 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
146.6 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
151.5 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
153.4 "细胞变异" # Ability { id: "B4B7" } #Blood Vessel（分身）
154.6 "细胞变异" # Ability { id: "B4B3" } #Blood Vessel（分身）
156.5 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
158.4 "细胞变异" # Ability { id: "B4B7" } #Blood Vessel（分身）
159.5 "细胞变异" # Ability { id: "B4B3" } #Blood Vessel（分身）
161.5 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
163.3 "细胞变异" # Ability { id: "B4B7" } #Blood Vessel（分身）
164.8 "细胞变异" # Ability { id: "B4B3" } #Blood Vessel（分身）
166.4 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
168.4 "细胞变异" # Ability { id: "B4B7" } #Blood Vessel（分身）
171.3 "细胞变异" # Ability { id: "B4B3" } #Blood Vessel（分身）
171.4 "蜕鳞" # Ability { id: "B4BC" } #Lindwurm（Boss）
176.3 "巨蟒绞缠" # Ability { id: "B4BD" } #Lindwurm（Boss）
186.5 "溅血" # Ability { id: "B9C4" } #Lindwurm（Boss）
206.7 "细胞附身·晚期" # Ability { id: "BEBF" } #Lindwurm（Boss）
211.9 "野性分裂" # Ability { id: "BE09" } #Lindwurm（Boss）
216.1 "震场" # Ability { id: "BE0A" } #Lindwurm（Boss）
241.4 "补天之手" # Ability { id: "B4D7" } #Lindwurm（Boss）
253.6 "细胞附身·末期" # Ability { id: "BEC0" } #Lindwurm（Boss）
257.7 "极饿伸展" # Ability { id: "B469" } #Lindwurm（Boss）
288 "溅血" # Ability { id: "B9C3" } #Lindwurm（Boss）
316.3 "致命灾变" # Ability { id: "B495" } #Lindwurm（Boss）
340.6 "喋血" # Ability { id: "B4C6" } #Lindwurm（Boss）
357.4 "灾变吐息" # Ability { id: "B4D2" } #Lindwurm（Boss）
361.9 "灾变吐息" # Ability { id: "B4D1" } #Lindwurm（Boss）
369.5 "喋血" # Ability { id: "B4C3" } #Lindwurm（Boss）
386.3 "追猎重击" # Ability { id: "B4D0" } #Lindwurm（Boss）
390.8 "追猎重击" # Ability { id: "B4CF" } #Lindwurm（Boss）
398.4 "喋血" # Ability { id: "B4C6" } #Lindwurm（Boss）
415.2 "追猎重击" # Ability { id: "B4D0" } #Lindwurm（Boss）
1011.1 "境中奇焰" StartsUsing { id: "B528" } window 2000,30 #リンドブルム（Boss）
1016.1 "境中奇焰" # Ability { id: "B528" } #リンドブルム（Boss）
1028.5 "自我复制" # Ability { id: "B4D8" } #リンドブルム（Boss）
1040 "强力魔法" # Ability { id: "B4DF" } #人型分体（分身）
1040 "天顶猛击" # Ability { id: "B4DD" } #人型分体（分身）
1040.3 "天顶猛击" # Ability { id: "B4DE" } #人型分体（分身）
1041.3 "强力魔法" # Ability { id: "B4E0" } #リンドブルム（分身）
1046 "蛇踢" Ability { id: "B527" } #リンドブルム（Boss）
1061.5 "天顶猛击" # Ability { id: "B4DD" } #人型分体（分身）
1061.5 "强力魔法" # Ability { id: "B4DF" } #人型分体（分身）
1061.8 "天顶猛击" # Ability { id: "B4DE" } #人型分体（分身）
1062.8 "强力魔法" # Ability { id: "B4E0" } #リンドブルム（分身）
1070.7 "双重飞踢" # Ability { id: "B523" } #リンドブルム（Boss）
1075.3 "双重飞踢" # Ability { id: "B525" } #リンドブルム（分身）
1077.8 "魔力连击" # Ability { id: "B526" } #リンドブルム（分身）
1092 "模仿细胞" # Ability { id: "B4E1" } #リンドブルム（Boss）
1106.1 "自我复制" # Ability { id: "B4D8" } #リンドブルム（Boss）
1128.4 "落火飞溅" # Ability { id: "B4E3" } #リンドブルム（Boss）
1129.3 "炎波" # Ability { id: "B4E5" } #リンドブルム（分身）
1130.6 "魔力爆发" # Ability { id: "B4E7" } #リンドブルム（分身）
1136.2 "细胞附身" # Ability { id: "B4E9" } #人型分体（分身）
1136.2 "重猛击" # Ability { id: "B4E8" } #人型分体（分身）
1137.5 "细胞附身" # Ability { id: "B4EA" } #リンドブルム（分身）
1138 "指向性冲击波" # Ability { id: "B4EB" } #リンドブルム（分身）
1141.6 "蛇踢" Ability { id: "B527" } #リンドブルム（Boss）
1151.8 "时空重现" # Ability { id: "B4EC" } #リンドブルム（Boss）
1159.9 "落火飞溅" # Ability { id: "B4ED" } #人型分体（分身）
1160 "近/远界阴怒" # Ability { id: "B52F" } #リンドブルム（Boss）
1161.2 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1161.5 "炎波" # Ability { id: "B8E1" } #リンドブルム（分身）
1165.2 "细胞附身" # Ability { id: "B4EA" } #リンドブルム（分身）
1165.2 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1165.7 "指向性冲击波" # Ability { id: "B922" } #リンドブルム（分身）
1169.4 "重猛击" # Ability { id: "BE5D" } #リンドブルム（分身）
1173.2 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1173.2 "细胞附身" # Ability { id: "B4EA" } #リンドブルム（分身）
1173.8 "指向性冲击波" # Ability { id: "B922" } #リンドブルム（分身）
1184.5 "变异细胞" # Ability { id: "B505" } #リンドブルム（Boss）
1190.7 "魔力球" # Ability { id: "B4FB" } #リンドブルム（Boss）
1201.7 "魔力扩散" # Ability { id: "B4FE" } #リンドブルム（分身）
1203.3 "细胞爆炸" # Ability { id: "B507" } #リンドブルム（分身）
1218 "魔力球苏醒" # Ability { id: "B500" } #リンドブルム（Boss）
1219.8 "黑洞判定" # Ability { id: "B503" } #リンドブルム（分身）
1224.9 "黑洞判定" # Ability { id: "B503" } #リンドブルム（分身）
1224.9 "林德布鲁姆狂水" # Ability { id: "B501" } #リンドブルム（分身）
1229.2 "阴界近/远景" # Ability { id: "B52C" } #リンドブルム（Boss）
1230.5 "阴界波" # Ability { id: "B52D" } #リンドブルム（分身）
1233.4 "细胞爆炸" # Ability { id: "B507" } #リンドブルム（分身）
1237.3 "境中奇焰" # Ability { id: "B528" } #リンドブルム（Boss）
1247.1 "双重飞踢" # Ability { id: "B521" } #リンドブルム（Boss）
1251.7 "双重飞踢" # Ability { id: "B525" } #リンドブルム（分身）
1254.1 "魔力连击" # Ability { id: "B526" } #リンドブルム（分身）
1270.3 "境中奇梦" # Ability { id: "B509" } #リンドブルム（Boss）
1276.5 "模仿细胞" # Ability { id: "B4E1" } #リンドブルム（Boss）
1291.7 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1297.8 "自我复制" # Ability { id: "B4D8" } #リンドブルム（Boss）
1310.3 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1311.3 "蛇踢" Ability { id: "B511" } #人型分体（分身）
1311.3 "力量喷涌" # Ability { id: "B510" } #人型分体（分身）
1316.5 "自我复制" # Ability { id: "B4D8" } #リンドブルム（Boss）
1336.1 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1340.5 "蛇踢" Ability { id: "BE95" } #リンドブルム（分身）
1340.7 "力量喷涌" # Ability { id: "B516" } #リンドブルム（分身）
1344.6 "林德布鲁姆陨石" # Ability { id: "B4F2" } #リンドブルム（Boss）
1350.7 "陨落" # Ability { id: "B4F3" } #リンドブルム（Boss）
1358.2 "境中奇奥" # Ability { id: "B9D9" } #リンドブルム（分身）
1364.9 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1371.4 "重猛击" # Ability { id: "B519" } #人型分体（分身）
1377.7 "魔力爆发" # Ability { id: "B518" } #リンドブルム（分身）
1381.5 "重猛击" # Ability { id: "B519" } #人型分体（分身）
1387.8 "魔力爆发" # Ability { id: "B518" } #リンドブルム（分身）
1395.5 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1399.9 "轰击" # Ability { id: "B4F4" } #リンドブルム（分身）
1400.5 "踩塔判定" # Ability { id: "B4F6" } #リンドブルム（分身）
1410.6 "远近判定" # Ability { id: "B4FA" } #リンドブルム（分身）
1419 "空间裂断" # Ability { id: "B51C" } #リンドブルム（Boss）
1431.6 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1432.6 "力量喷涌" # Ability { id: "B50F" } #人型分体（分身）
1432.6 "蛇踢" Ability { id: "BCAF" } #人型分体（分身）
1437.7 "时空重现" # Ability { id: "B4EC" } #リンドブルム（Boss）
1441.1 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1441.3 "重猛击" # Ability { id: "BE5D" } #リンドブルム（分身）
1446.9 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1451.3 "蛇踢" Ability { id: "BE95" } #リンドブルム（分身）
1451.6 "力量喷涌" # Ability { id: "B516" } #リンドブルム（分身）
1454.4 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1460.8 "魔力爆发" # Ability { id: "B4EE" } #人型分体（分身）
1460.8 "重猛击" # Ability { id: "B4EF" } #人型分体（分身）
1462.1 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1462.3 "重猛击" # Ability { id: "BE5D" } #リンドブルム（分身）
1467.1 "力量喷涌" # Ability { id: "B516" } #リンドブルム（分身）
1472.9 "境中奇梦" # Ability { id: "B509" } #リンドブルム（Boss）
1481.6 "双重飞踢" # Ability { id: "B521" } #リンドブルム（Boss）
1486.2 "双重飞踢" # Ability { id: "B525" } #リンドブルム（分身）
1488.6 "魔力连击" # Ability { id: "B526" } #リンドブルム（分身）
1502.1 "自我复制" # Ability { id: "B46C" } #リンドブルム（Boss）
1515.7 "境中奇狱" # Ability { id: "B533" } #リンドブルム（Boss）
1531.9 "境中奇狱" # Ability { id: "B533" } #リンドブルム（Boss）
1554.7 "境中奇狱" # Ability { id: "BEC1" } #人型分体（分身）
`,
  initData: () => {
    return {
      sActorPositions: {},
      sWeaponId: undefined,
      sBuffs: [],
      sSpreadStack: [],
      sMj: undefined,
      sWings: {},
      sPhase: '第一次细胞',
      sBalls: [],
      sBallsFirst: false,
      sBallsOver: false,
      sMjNikus: [],
      sCombatantData: [],
      sStage: '门神',
      sMj2NikuIds: [],
      sMjDieXueIds: [],
      sDieXue: { spread: 'left', stack: 'left' },
      sP2一运buff: [],
      sP2二运num: undefined,
      sP2二运打哪里: undefined,
      sP2二运暗分身: undefined,
      sP2二运火分身: undefined,
      sP2二运暗分身分身: undefined,
      sP2二运火分身分身: undefined,
      sP2二运我找谁: undefined,
      s三运buff: undefined,
      s三运先吸: undefined,
      s四运长记忆1: undefined,
      s四运分摊分散玩家机制: undefined,
      s四运分摊分散正点机制: undefined,
      s四运B9D9: [],
      sCombatantMemory: {},
      sActorPositionsClone: {},
      decOffset: undefined,
      firstHeadmarker: undefined,
      headmarkers: [],
    };
  },
  triggers: [
    {
      id: 'souma r12s ActorSetPos Tracker',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) => {
        data.sActorPositions[matches.id] = {
          id: matches.id,
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        };
      },
    },
    {
      id: 'souma r12s ActorMove Tracker',
      type: 'ActorMove',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) => {
        data.sActorPositions[matches.id] = {
          id: matches.id,
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        };
      },
    },
    {
      id: 'souma r12s AddedCombatant Tracker',
      type: 'AddedCombatant',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) => {
        data.sActorPositions[matches.id] = {
          id: matches.id,
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        };
      },
    },
    {
      id: 'souma r12s CombatantMemory Tracker',
      type: 'CombatantMemory',
      netRegex: {
        change: 'Add',
        id: '4[0-9A-Fa-f]{7}',
        pair: [{
          key: 'BNpcID',
          value: Object.keys(towers),
        }],
        capture: true,
      },
      run: (data, matches) => {
        if (
          matches.pairBNpcID !== undefined &&
          matches.pairPosX !== undefined &&
          matches.pairPosY !== undefined
        ) {
          data.sCombatantMemory[matches.id] = {
            id: matches.id,
            x: parseFloat(matches.pairPosX),
            y: parseFloat(matches.pairPosY),
            bNpcId: matches.pairBNpcID,
            tower: towers[matches.pairBNpcID],
          };
        }
      },
    },
    {
      id: 'souma r12s First Headmarker',
      type: 'HeadMarker',
      netRegex: {},
      preRun: (data, matches) => {
        if (data.decOffset === undefined) {
          data.headmarkers.push(matches.id);
        }
      },
      delaySeconds: (data) => data.decOffset === undefined ? 0.5 : 0,
      run: (data, matches) => {
        if (data.decOffset === undefined) {
          // data.headmarkers里现在应该有3个id，其中出现一次的就是点奶分摊的ID，出现两次的就是死刑的实际ID
          const marker = data.headmarkers.find((v) =>
            data.headmarkers.filter((v2) => v2 === v).length === 1
          );
          if (marker !== undefined) {
            data.firstHeadmarker = headmarkers.点奶分摊;
            getHeadmarkerId(data, matches);
            data.headmarkers.length = 0;
          }
        }
      },
    },
    // #region 门神
    {
      id: 'souma r12s 阶段判断',
      type: 'StartsUsing',
      netRegex: { id: ['B4D7', 'B528'], capture: false },
      preRun: (data, matches) => {
        if (matches.id === 'B4D7') {
          data.sStage = '门神';
        }
        if (matches.id === 'B528') {
          data.sStage = '本体';
        }
      },
    },
    {
      id: 'souma r12s aoe B4D7',
      type: 'StartsUsing',
      netRegex: { id: 'B4D7', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'souma r12s aoe B9C4',
      type: 'StartsUsing',
      netRegex: { id: 'B9C4', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '小AoE' } },
    },
    {
      id: 'souma r12s 伸展',
      type: 'StartsUsing',
      netRegex: { id: 'B469', capture: false },
      delaySeconds: 4,
      promise: async (data) => {
        const add = (await callOverlayHandler({ call: 'getCombatants' })).combatants.find((v) =>
          v.BNpcID === 19196 && v.BNpcNameID === 14378 && v.WeaponId
        );
        if (!add) {
          throw new Error('没有找到武器');
        }
        data.sWeaponId = add.WeaponId;
      },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          left: { en: '左侧安全' },
          right: { en: '右侧安全' },
          分散left: { en: '←左分散' },
          分散right: { en: '右→分散' },
          死超left: { en: '右→分散' },
          死超right: { en: '←左分散' },
        };
        if (data.sPhase === '第二次细胞') {
          const safe = data.sWeaponId === 5 ? 'right' : 'left';
          const buff = data.sSaibo2 === '死超' ? '死超' : '分散';
          return {
            [buff === '死超' ? 'alertText' : 'infoText']: output[buff + safe](),
          };
        }
        return {
          infoText: data.sWeaponId === 5 ? output.right() : output.left(),
        };
      },
    },
    {
      id: 'souma r12s majiang',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 1麻
          'BBC',
          // 2麻
          'BBD',
          // 3麻
          'BBE',
          // 4麻
          'D7B',
          // beta
          '1292',
          // alpha
          '1290',
        ],
        capture: true,
      },
      condition: (data, matches) => {
        return matches.target === data.me;
      },
      run: (data, matches) => {
        const arr = data.sBuffs;
        arr.push(matches.effectId);
        if (arr.length === 2) {
          arr.sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
          const mj = arr[0];
          const sym = arr[1];
          data.sMj = { mj: mjMap[mj], sym: sym === '1292' ? 'beta' : 'alpha' };
        }
      },
    },
    {
      id: 'souma r12s 麻将出发',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      durationSeconds: 40,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => output[data.sMj.mj + data.sMj.sym](),
      outputStrings: {
        '1麻alpha': { en: 'alpha1：拉1线 => 场地3塔' },
        '2麻alpha': { en: 'alpha2：拉2线 => 场地4塔' },
        '3麻alpha': { en: 'alpha3：场地1塔 => 拉3线' },
        '4麻alpha': { en: 'alpha4：场地2塔 => 拉4线' },
        '1麻beta': { en: 'beta1: 反拉1线 => 玩家3塔' },
        '2麻beta': { en: 'beta2: 反拉2线 => 玩家4塔' },
        '3麻beta': { en: 'beta3: 玩家1塔 => 反拉3线' },
        '4麻beta': { en: 'beta4: 玩家2塔 => 反拉4线' },
      },
    },
    {
      id: 'souma r12s 麻将0-',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      suppressSeconds: 999,
      countdownSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.sMj?.mj === '1麻' || data.sMj?.mj === '2麻') {
          return output[data.sMj.sym]();
        }
      },
      outputStrings: {
        'alpha': { en: '准备出去' },
        'beta': { en: '准备反向拉线' },
      },
    },
    {
      id: 'souma r12s 麻将0',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      suppressSeconds: 999,
      alertText: (data, _matches, output) => output[data.sMj.sym](),
      outputStrings: {
        'alpha': { en: '出去！' },
        'beta': { en: '反向拉线！' },
      },
    },
    {
      id: 'souma r12s 麻将34',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) =>
        parseFloat(matches.duration) - (matches.effectId === '1292' ? 10 : 14),
      durationSeconds: (_data, matches) => (matches.effectId === '1292' ? 6 : 10),
      suppressSeconds: 999,
      alertText: (data, _matches, output) => {
        if (data.sMj?.mj === '3麻' || data.sMj?.mj === '4麻') {
          if (data.sMj.sym === 'alpha') {
            const tower = data.sMjNikus.at(data.sMj.mj === '3麻' ? 0 : 1);
            if (tower === undefined) {
              return output.unknown();
            }
            return output.alpha({
              tower,
            });
          }
          return output.beta();
        }
      },
      outputStrings: {
        'alpha': { en: '踩（${tower}）场地塔 => 场中准备出门拉线' },
        'unknown': { en: '踩场地塔 => 场中准备出门拉线' },
        'beta': { en: '踩玩家塔 => 场中准备反向拉线' },
      },
    },
    {
      id: 'souma r12s 麻将12',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) + 1,
      durationSeconds: 14,
      suppressSeconds: 999,
      countdownSeconds: 14,
      alertText: (data, _matches, output) => {
        if (data.sMj?.mj === '1麻' || data.sMj?.mj === '2麻') {
          if (data.sMj.sym === 'alpha') {
            const tower = data.sMjNikus.at(data.sMj.mj === '1麻' ? 2 : 3);
            if (tower === undefined) {
              return output.unknown();
            }
            return output.alpha({
              tower,
            });
          }
          return output.beta();
        }
      },
      outputStrings: {
        'alpha': { en: '准备（${tower}）场地塔' },
        'unknown': { en: '准备场地塔' },
        'beta': { en: '准备玩家塔' },
      },
    },
    {
      id: 'souma r12s 麻将12啊',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) + 12.5,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => {
        if (data.sMj?.mj === '1麻' || data.sMj?.mj === '2麻') {
          if (data.sMj.sym === 'alpha') {
            return output.alpha();
          }
          return output.beta();
        }
      },
      outputStrings: {
        'alpha': { en: '踩场地塔' },
        'beta': { en: '踩玩家塔' },
      },
    },
    {
      id: 'souma r12s 麻将滚',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: 50,
      suppressSeconds: 999,
      alarmText: (data, _matches, output) => {
        if (data.sMj?.sym === 'beta') {
          return output.text();
        }
      },
      outputStrings: { text: { en: '快出去！' } },
    },
    {
      id: 'souma r12s 中期',
      type: 'StartsUsing',
      netRegex: { id: 'BEBE', capture: false },
      delaySeconds: 1,
      run: (data) => data.sPhase = '麻将',
    },
    {
      id: 'souma r12s 拘束',
      type: 'StartsUsing',
      netRegex: { id: 'B4B8', capture: false },
      delaySeconds: 1,
      run: (data) => data.sPhase = '麻将后',
    },
    {
      id: 'souma r12s ActorSetPos Tracker2',
      type: 'ActorSetPos',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        heading: '-0.0001',
        x: [
          '85.0000',
          '96.0000',
          '104.0000',
          '115.0000',
        ],
        y: [
          '90.0000',
          '96.0000',
          '104.0000',
          '110.0000',
        ],
        capture: true,
      },
      condition: (data) => data.sPhase === '麻将',
      run: (data, matches) => {
        const xLabel = {
          '85.0000': '外左',
          '96.0000': '内左',
          '104.0000': '内右',
          '115.0000': '外右',
        }[matches.x];
        const yLabel = {
          '90.0000': '上',
          '96.0000': '上',
          '104.0000': '下',
          '110.0000': '下',
        }[matches.y];
        if (
          xLabel !== undefined && yLabel !== undefined &&
          !data.sMjNikus.includes(`${xLabel}${yLabel}`)
        ) {
          data.sMjNikus.push(`${xLabel}${yLabel}`);
        }
      },
    },
    {
      id: 'souma r12s 细胞buff',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 分散
          '1299',
          // 分摊
          '129A',
        ],
        capture: true,
      },
      preRun: (data, matches) => {
        data.sSpreadStack.push(matches);
      },
    },
    {
      id: 'souma r12s 细胞buff判定',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 分散
          '1299',
          // 分摊
          '129A',
        ],
        capture: false,
      },
      condition: (data) => data.sPhase === '第一次细胞',
      delaySeconds: 0.5,
      durationSeconds: 16.5,
      suppressSeconds: 30,
      countdownSeconds: 16.5,
      alertText: (data, _matches, output) => {
        const buff = data.sSpreadStack.find((v) => v.target === data.me)?.effectId === '1299'
          ? 'spread'
          : 'stack';
        const buffStr = output[buff]();
        if (data.sPhase === '第一次细胞') {
          data.sPhase = '第一次细胞后';
          const countStr = output[data.sWings[data.me]]();
          return output.text({
            buff: buffStr,
            count: countStr,
          });
        }
      },
      run: (data) => {
        data.sSpreadStack.length = 0;
      },
      outputStrings: {
        '40C': '向前射',
        '40D': '向右射',
        '40E': '向后射',
        '40F': '向左射',
        'spread': { en: '稍后散开' },
        'stack': { en: '稍后分摊' },
        'text': { en: '${buff} + ${count}' },
      },
    },
    {
      id: 'souma r12s 小翅膀',
      type: 'GainsEffect',
      netRegex: {
        effectId: 'DE6',
        count: ['40C', '40D', '40E', '40F'],
        capture: true,
      },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.sWings[data.me] = matches.count;
      },
    },
    {
      id: 'souma r12s 小翅膀2',
      type: 'GainsEffect',
      netRegex: {
        effectId: 'DE6',
        count: [
          // 前
          '436',
          // 右
          '437',
          // 后
          '438',
          // 左
          '439',
        ],
        capture: true,
      },
      condition: Conditions.targetIsYou(),
      sound: '',
      soundVolume: 0,
      infoText: (data, matches, output) => {
        data.sWings2 = {
          '436': '前',
          '437': '右',
          '438': '后',
          '439': '左',
        }[matches.count];
        return output[data.sWings2]();
      },
      tts: null,
      outputStrings: {
        '前': { en: '(去下)' },
        '右': { en: '(去左)' },
        '后': { en: '(去上)' },
        '左': { en: '(去右)' },
      },
    },
    // 斜点安全
    // [02:53:26.903] 263 107:400062FB:B4A3:107.517:92.502:0.000:0.000
    // [02:53:26.903] 263 107:4000633A:B4A0:92.502:87.497:0.000:1.249
    // [02:53:27.216] 263 107:4000633E:B4A2:82.492:97.507:0.000:0.785
    // [02:53:27.216] 263 107:400062FA:B4A3:87.497:102.512:0.000:0.000
    // [02:53:27.530] 263 107:40006339:B4A0:92.502:97.507:0.000:1.249
    // [02:53:27.530] 263 107:400062F9:B4A3:107.517:102.512:0.000:0.000
    // [02:53:27.844] 263 107:4000633F:B4A2:112.491:97.507:0.000:0.785
    // [02:53:27.844] 263 107:400062F8:B4A3:117.496:102.512:0.000:0.000
    // [02:53:28.111] 263 107:40006338:B4A0:92.502:107.517:0.000:1.249
    // [02:53:28.111] 263 107:400062F7:B4A3:107.517:112.491:0.000:0.000
    // 正点安全
    // [02:12:44.256] 263 107:40005E43:B4A3:92.502:92.502:0.000:0.000
    // [02:12:44.256] 263 107:40005EF8:B4A1:82.492:87.497:0.000:1.107
    // [02:12:44.566] 263 107:40005E42:B4A3:117.496:92.502:0.000:0.000
    // [02:12:44.566] 263 107:40005EF7:B4A1:107.517:87.497:0.000:1.107
    // [02:12:44.877] 263 107:40005E41:B4A3:92.502:102.512:0.000:0.000
    // [02:12:44.877] 263 107:40005EFB:B4A0:107.517:97.507:0.000:-1.249
    // [02:12:45.188] 263 107:40005E40:B4A3:92.502:112.491:0.000:0.000
    // [02:12:45.188] 263 107:40005EF6:B4A1:82.492:107.517:0.000:1.107
    // [02:12:45.456] 263 107:40005EFE:B4A1:107.517:107.517:0.000:1.107
    // [02:12:45.456] 263 107:40005E3F:B4A3:117.496:112.491:0.000:0.000
    {
      id: 'souma r12s 大蛇丸',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B4A1', 'B4A2'] },
      suppressSeconds: 6,
      infoText: (data, matches, output) => {
        const safe = matches.id === 'B4A1' ? '正' : '斜';
        const wing = data.sWings2;
        return output[safe + wing]();
      },
      outputStrings: {
        '正前': { en: '↓正下方格，换位' },
        '正右': { en: '←正左方格' },
        '正后': { en: '↑正上方格，换位' },
        '正左': { en: '→正右方格' },
        '斜前': { en: '↙左下方格' },
        '斜右': { en: '↖左上方格' },
        '斜后': { en: '↗右上方格' },
        '斜左': { en: '↘右下方格' },
      },
    },
    {
      id: 'souma r12s 晚期了这孩子',
      type: 'StartsUsing',
      netRegex: { id: 'BEBF', capture: false },
      delaySeconds: 18,
      durationSeconds: 7,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          'tank': { en: '引导直线死刑 => 去场中' },
          'other': { en: '躲避直线死刑 => 引导分散' },
        };
        if (data.role === 'tank') {
          return {
            alertText: output.tank(),
          };
        }
        return {
          infoText: output.other(),
        };
      },
    },
    {
      id: 'souma r12s 末期了这孩子',
      type: 'StartsUsing',
      netRegex: { id: 'BEC0', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.sPhase = '第二次细胞',
      outputStrings: {
        text: Outputs.baitPuddles,
      },
    },
    {
      id: 'souma r12s 致死细胞',
      type: 'GainsEffect',
      netRegex: { effectId: ['129B', '1299'], capture: true },
      condition: (data, matches) => data.sPhase === '第二次细胞' && data.me === matches.target,
      alertText: (data, matches, output) => {
        data.sSaibo2 = matches.effectId === '129B' ? '死超' : '分散';
        return output[data.sSaibo2]();
      },
      outputStrings: {
        '死超': { en: '死超' },
        '分散': { en: '分散' },
      },
    },
    {
      id: 'souma r12s 初始化球',
      type: 'StartsUsing',
      netRegex: { id: 'B495', capture: false },
      run: (data) => {
        data.sBalls = [];
        data.sBallsOver = false;
        data.sBallsFirst = false;
      },
    },
    {
      id: 'souma r12s 球',
      // type: 'AddedCombatant',
      // netRegex: { npcNameId: '14378', npcBaseId: ['19200', '19201'], capture: true },
      type: 'CombatantMemory',
      netRegex: {
        change: ['Add', 'Change'],
        id: '4[0-9A-Fa-f]{7}',
        capture: true,
      },
      preRun: (data, matches) => {
        if (
          matches.change === 'Add' && matches.pairBNpcNameID === '382A' &&
          matches.pairBNpcID !== undefined && ['4B00', '4B01'].includes(matches.pairBNpcID)
        ) {
          data.sBalls.push(matches);
        } else if (matches.change === 'Change') {
          const ball = data.sBalls.find((v) => v.id === matches.id);
          if (ball) {
            if (matches.pairPosX !== undefined)
              ball.pairPosX = matches.pairPosX;
          }
        }
      },
      durationSeconds: 20,
      infoText: (data, _matches, output) => {
        const balls = data.sBalls.filter((v) => v.pairPosX !== '100.0000');
        const purples = balls.filter((v) => v.pairBNpcID === '4B00');
        const greens = balls.filter((v) => v.pairBNpcID === '4B01');
        if (data.sBallsOver || purples.length % 2 !== 0) {
          return;
        }
        if (purples.length > 0) {
          const purpleSide = parseFloat(purples[0].pairPosX) < 100 ? 'left' : 'right';
          if (data.role === 'dps') {
            data.sBallsOver = true;
            data.sBallsFirst = true;
            return output[purpleSide === 'left' ? 'right' : 'left']();
          }
          // TH 1紫
          if (purples.length === 1) {
            if (data.sBallsFirst) {
              return;
            }
            data.sBallsFirst = true;
            return output[purpleSide]();
          }
          // TH 2紫
          if (purples.length >= 2) {
            data.sBallsOver = true;
            const side = data.sBallsFirst ? '' : output[purpleSide]();
            const ordered = data.sBalls.filter((v) =>
              purpleSide === 'left' ? parseFloat(v.pairPosX) < 100 : parseFloat(v.pairPosX) > 100
            ).map((v) => v.pairBNpcID === '4B00' ? 't' : 'h');
            // console.log(data.sBalls.slice(), ordered);
            const result = Array.from({ length: 4 }, (_, i) => ordered[i] ?? 'h').map((v) =>
              output[v]()
            ).join('/');
            if (data.sBallsFirst) {
              return result;
            }
            data.sBallsFirst = true;
            return output.text({
              side: side,
              ordered: result,
            });
          }
        }
        if (greens.length === 6 && purples.length === 0) {
          // 一边有4个绿，一边有2个绿，找到2个绿的那边当作2紫，报HHTT
          const leftGreen = greens.filter((v) => parseFloat(v.pairPosX) < 100);
          const rightGreen = greens.filter((v) => parseFloat(v.pairPosX) > 100);
          const greenSide = leftGreen.length < rightGreen.length ? 'left' : 'right';
          data.sBallsOver = true;
          data.sBallsFirst = true;
          return output.text({
            side: output[greenSide](),
            ordered: [...'hhtt'].map((v) => output[v]()).join('/'),
          });
        }
      },
      outputStrings: {
        text: { en: '${side}：${ordered}' },
        t: { en: 'T' },
        h: { en: '奶' },
        left: { en: '左' },
        right: { en: '右' },
      },
    },
    {
      id: 'souma r12s 拉线之1',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.sPhase === '第二次细胞' && matches.target === data.me &&
        getHeadmarkerId(data, matches) === headmarkers.拉线,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '集合拉线' },
      },
    },
    {
      id: 'souma r12s 拉线之2',
      type: 'GainsEffect',
      netRegex: { effectId: '1291', capture: true },
      condition: (data, matches) => data.sPhase === '第二次细胞' && matches.target === data.me,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '走！' },
      },
    },
    {
      id: 'souma r12s ActorControlExtra',
      type: 'ActorControlExtra',
      netRegex: {
        category: '019D',
        param1: '10',
        param2: '20',
        param3: '0',
        param4: '0',
      },
      condition: (data) => data.sPhase === '第二次细胞' || data.sPhase === '喋血',
      preRun: (data, matches) => {
        if (data.sPhase === '喋血') {
          data.sMjDieXueIds.push(matches.id);
        } else {
          data.sMj2NikuIds.push(matches.id);
        }
      },
    },
    {
      id: 'souma r12s ActorControlExtra2',
      type: 'ActorControlExtra',
      netRegex: {
        category: '019D',
        param1: '10',
        param2: '20',
        param3: '0',
        param4: '0',
        capture: false,
      },
      condition: (data) => data.sPhase === '第二次细胞' && data.sMj2NikuIds.length > 0,
      delaySeconds: 0.5,
      suppressSeconds: 999,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: data.sMj2NikuIds.map((v) => parseInt(v, 16)),
        })).combatants;
        data.sMj2NikuIds.length = 0;
      },
      infoText: (data, _matches, output) => {
        // console.log(data.sCombatantData.map((v) => ({ x: v.PosX, y: v.PosY })));
        // {x: 91, y: 87} {x: 109, y: 113} 24安全
        if (data.sCombatantData.find((v) => equal(v.PosX, 91) && equal(v.PosY, 87))) {
          return output['24']();
        }
        return output['13']();
      },
      outputStrings: {
        '24': { en: '右上/左下安全' },
        '13': { en: '左上/右下安全' },
      },
    },
    {
      id: 'souma r12s 喋血',
      type: 'StartsUsing',
      netRegex: {
        id: [
          'B4C3',
          'B4C6',
        ],
      },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.sPhase = '喋血';
        data.sDieXue = undefined;
      },
      outputStrings: {
        text: { en: 'AoE' },
      },
    },
    {
      id: 'souma r12s 溅血',
      type: 'StartsUsing',
      netRegex: { id: 'B9C3', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r12s ActorControlExtra2喋血',
      type: 'ActorControlExtra',
      netRegex: {
        category: '019D',
        param1: '10',
        param2: '20',
        param3: '0',
        param4: '0',
        capture: false,
      },
      condition: (data) => data.sPhase === '喋血' && data.sMjDieXueIds.length > 0,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: data.sMjDieXueIds.map((v) => parseInt(v, 16)),
        })).combatants;
        data.sMjDieXueIds.length = 0;
        if (data.sCombatantData.find((v) => equal(v.PosX, 110.75) && equal(v.PosY, 96.5))) {
          data.sDieXue = {
            spread: 'left',
            stack: 'right',
          };
        } else {
          data.sDieXue = {
            spread: 'right',
            stack: 'left',
          };
        }
      },
    },
    {
      id: 'souma r12s 喋血分摊分散',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.sPhase === '喋血' && getHeadmarkerId(data, matches) === headmarkers.分摊,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const gimmick = (data.party.nameToRole_[matches.target] === 'dps') === (data.role === 'dps')
          ? 'stack'
          : 'spread';
        const side = data.sDieXue?.[gimmick] ?? 'left';
        return output.text({
          side: output[side](),
          gimmick: output[gimmick](),
        });
      },
      outputStrings: {
        text: { en: '${side}${gimmick}' },
        left: { en: '左' },
        right: { en: '右' },
        stack: { en: '分摊' },
        spread: { en: '散开' },
      },
    },
    {
      id: 'souma r12s 喋血用',
      type: 'Ability',
      netRegex: {
        id: [
          // 左先出，蛇
          'B4CB',
          // 左先出，击退
          'B4CC',
          // 右先出，蛇
          'B4CD',
          // 右边先出，击退
          'B4CE',
        ],
      },
      condition: (data) => data.sPhase === '喋血',
      delaySeconds: 5,
      durationSeconds: 18 - 5,
      alertText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        'B4CB': { en: '右半安全 => 左半安全' },
        'B4CC': { en: '左上击退 => 右上击退' },
        'B4CD': { en: '左半安全 => 右半安全' },
        'B4CE': { en: '右上击退 => 左上击退' },
      },
    },
    {
      id: 'souma r12s 门神狂暴',
      type: 'StartsUsing',
      netRegex: { id: 'B538', capture: false },
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: 'Enrage', cn: '狂暴' } },
    },
    // #endregion
    // #region 本体
    {
      id: 'souma r12s p2 境中奇焰',
      type: 'StartsUsing',
      netRegex: { id: 'B528', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r12s p2 自我复制',
      type: 'StartsUsing',
      netRegex: { id: 'B4D8', capture: false },
      run: (data) => {
        if (data.sPhase === '第一次细胞') {
          // 刚开局
          data.sPhase = '本体1运';
        }
      },
    },
    {
      id: 'souma r12s p2 有翼灾变',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B4DC'], capture: true },
      durationSeconds: 3,
      suppressSeconds: 62 - 38,
      infoText: (data, matches, output) => {
        const hdg = (equal(parseFloat(matches.heading), 0.000, 0.1) ||
            equal(parseFloat(matches.heading), 3.141, 0.1))
          ? 'AC'
          : 'BD';
        data.sP2一运打哪里 = hdg;
        return output[hdg]();
      },
      outputStrings: {
        AC: { en: '(分身打上下)' },
        BD: { en: '(分身打左右)' },
      },
    },
    {
      id: 'souma r12s p2 一运buff',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 火耐
          'B79',
          // 暗耐
          'CFB',
        ],
        capture: true,
      },
      condition: (data) => data.sPhase === '本体1运',
      preRun: (data, matches) => {
        data.sP2一运buff.push(matches);
      },
      delaySeconds: 1,
      durationSeconds: 11,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          text: { en: '${side}${hdg}' },
          dark: { en: '暗找斜' },
          fire: { en: '火找正' },
          AC: { en: '(分身打上下)' },
          BD: { en: '(分身打左右)' },
        };
        if (data.sP2一运buff.length !== 6)
          return;
        const dark4 = data.sP2一运buff.filter((v) => v.effectId === 'CFB').map((v) => v.target);
        const myGroup = dark4.includes(data.me) ? 'dark' : 'fire';
        data.sP2二运我找谁 = myGroup === 'dark' ? 'fire' : 'dark';
        const side = output[myGroup]();
        const hdg = output[data.sP2一运打哪里]();
        data.sP2一运buff.length = 0;
        return {
          infoText: output.text({
            side: side,
            hdg: hdg,
          }),
          tts: side,
        };
      },
    },
    {
      id: 'souma r12s p2 蛇踢 B527',
      type: 'StartsUsing',
      netRegex: { id: 'B527', capture: false },
      delaySeconds: 0.5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '去背后' } },
    },
    {
      id: 'souma r12s p2 强力魔法',
      type: 'StartsUsingExtra',
      netRegex: { id: 'B4DF', capture: true },
      suppressSeconds: 999,
      run: (data, matches) => {
        data.sP2二运暗分身 = {
          'id': matches.sourceId,
          'x': parseFloat(matches.x),
          'y': parseFloat(matches.y),
        };
      },
    },
    {
      id: 'souma r12s p2 天顶猛击',
      type: 'AbilityExtra',
      netRegex: { 'id': 'B4DE', 'capture': true },
      suppressSeconds: 999,
      run: (data, matches) => {
        data.sP2二运火分身 = {
          'id': matches.sourceId,
          'x': parseFloat(matches.x),
          'y': parseFloat(matches.y),
        };
      },
    },
    {
      id: 'souma r12s p2 蛇踢 B527吧吧吧',
      type: 'StartsUsing',
      netRegex: { id: 'B527', capture: false },
      delaySeconds: 13,
      suppressSeconds: 999,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) =>
          v.ID &&
          v.BNpcID === 19204 && v.BNpcNameID === 14380 &&
          v.PosX !== undefined && v.PosY !== undefined &&
          !(v.PosX === 100 && v.PosY === 100)
        );
        const fire = data.sP2二运火分身;
        const dark = data.sP2二运暗分身;
        // console.log(fire, dark);
        const origin = data.sCombatantData.map((v) => {
          return {
            id: v.ID.toString(16).toUpperCase(),
            disD: getDis(dark.x, dark.y, v.PosX, v.PosY),
            disF: getDis(fire.x, fire.y, v.PosX, v.PosY),
            x: v.PosX,
            y: v.PosY,
          };
        });
        // console.log(origin.slice());
        data.sP2二运火分身分身 = origin.filter((v) => (v.disF < 6 && v.disF > 4)).map((v) => ({
          id: v.id,
          x: v.x,
          y: v.y,
        }));
        data.sP2二运暗分身分身 = origin.filter((v) => (v.disD < 6 && v.disD > 4)).map((v) => ({
          id: v.id,
          x: v.x,
          y: v.y,
        }));
        // console.log(data.sP2二运火分身分身, data.sP2二运暗分身分身);
      },
    },
    {
      id: 'souma r12s p2 蛇踢 B527吃吃吃吃吃吃吃',
      comment: { en: '根据职业判断近战/远程，不考虑D2黑魔的特殊情况。' },
      type: 'StartsUsing',
      netRegex: { id: 'B527', capture: false },
      delaySeconds: 15,
      durationSeconds: 5.5,
      suppressSeconds: 999,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) =>
          v.ID &&
          v.BNpcID === 19204 && v.BNpcNameID === 14380 &&
          v.PosX !== undefined && v.PosY !== undefined &&
          !(v.PosX === 100 && v.PosY === 100)
        );
      },
      alertText: (data, _matches, output) => {
        if (data.triggerSetConfig.soumaM12Sbentiyiyun === 'skip')
          return;
        const fires = data.sCombatantData.filter((v) =>
          data.sP2二运火分身分身.some((v2) => v2.id === v.ID.toString(16).toUpperCase())
        ).map((v) => {
          return {
            x: v.PosX,
            y: v.PosY,
            dis: getDis(v.PosX, v.PosY, center.x, center.y),
            dir: Directions.xyToIntercardDirOutput(v.PosX, v.PosY, center.x, center.y),
          };
        }).sort((v1, v2) => v1.dis - v2.dis);
        // console.log(JSON.stringify(data.sCombatantData));
        const darks = data.sCombatantData.filter((v) =>
          data.sP2二运暗分身分身.some((v2) => v2.id === v.ID.toString(16).toUpperCase())
        ).map((v) => {
          return {
            x: v.PosX,
            y: v.PosY,
            dis: getDis(v.PosX, v.PosY, center.x, center.y),
            dir: Directions.xyToIntercardDirOutput(v.PosX, v.PosY, center.x, center.y),
          };
        }).sort((v1, v2) => v1.dis - v2.dis);
        const fire1 = fires[0];
        const fire2 = fires[1];
        const dark1 = darks[0];
        const dark2 = darks[1];
        const warymark = {
          'dirNE': ['A', 'B'],
          'dirNW': ['A', 'D'],
          'dirSE': ['B', 'C'],
          'dirSW': ['C', 'D'],
        };
        const wmMelee = data.sP2一运打哪里 === 'AC' ? ['A', 'C'] : ['B', 'D'];
        const wmCaster = data.sP2一运打哪里 === 'AC' ? ['B', 'D'] : ['A', 'C'];
        const meleeAdd = data.sP2二运我找谁 === 'fire' ? fire1.dir : dark1.dir;
        const casterAdd = data.sP2二运我找谁 === 'fire' ? fire2.dir : dark2.dir;
        let melee = warymark[meleeAdd].find((v) => wmMelee.includes(v));
        if (data.triggerSetConfig.soumaM12Sbentiyiyun === 'doc') {
          if (data.sP2二运我找谁 === 'fire' || data.role === 'tank')
            melee = warymark[meleeAdd].find((v) => v === 'A' || v === 'C');
          else
            melee = warymark[meleeAdd].find((v) => v === 'B' || v === 'D');
        }
        const caster = warymark[casterAdd].find((v) => wmCaster.includes(v));
        const meleeDir = output[meleeAdd]();
        const casterDir = output[casterAdd]();
        const attr = output[data.sP2二运我找谁]();
        const meleeText = output[melee]();
        const casterText = output[caster]();
        if (data.role === 'tank' || Util.isMeleeDpsJob(data.job)) {
          return output.melee({ melee: meleeText, dir: meleeDir, attr: attr });
        }
        return output.caster({ caster: casterText, dir: casterDir, attr: attr });
      },
      outputStrings: {
        error: { en: '???' },
        A: { en: 'A' },
        B: { en: 'B' },
        C: { en: 'C' },
        D: { en: 'D' },
        melee: { en: '去${melee}${attr}(分身在${dir})' },
        caster: { en: '去${caster}${attr}(分身在${dir})' },
        fire: { en: '分摊' },
        dark: { en: '散开' },
        ...Directions.outputStringsIntercardDir,
      },
      // [
      //   { 'id': '40005069', 'x': 95.0041, 'y': 105.0142 },
      //   { 'id': '4000506A', 'x': 109.8972, 'y': 90.0906 },
      //   { 'id': '4000506D', 'x': 105.0142, 'y': 95.0041 },
      //   { 'id': '4000506E', 'x': 90.0906, 'y': 109.8972 },
      // ];
      // [17:35:24.400] StartsCasting 14:40005069:人形分身:B4DF:强力魔法:40005069:人形分身:2.700:94.99:105.00:0.00:0.00
      // [17:35:24.400] StartsCasting 14:4000506A:人形分身:B4DF:强力魔法:4000506A:人形分身:2.700:109.88:90.07:0.00:0.00
      // [17:35:24.400] StartsCasting 14:4000506D:人形分身:B4DD:天顶猛击:4000506D:人形分身:2.700:105.00:94.99:0.00:0.00
      // [17:35:24.400] StartsCasting 14:4000506E:人形分身:B4DD:天顶猛击:4000506E:人形分身:2.700:90.07:109.88:0.00:0.00
    },
    // {
    //   id: 'souma r12s p2 蛇踢 BCAF',
    //   type: 'StartsUsing',
    //   netRegex: { id: 'BCAF', capture: false },
    //   infoText: (_data, _matches, output) => output.text!(),
    //   outputStrings: { text: { en: '自定义文本' } },
    // },
    {
      id: 'souma r12s p2 双重飞踢1',
      type: 'StartsUsing',
      netRegex: { id: ['B520'], capture: false },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          tank: { en: '坦克死刑' },
          other: { en: '去背后' },
        };
        return {
          [data.role === 'tank' ? 'alertText' : 'infoText']: output
            [data.role === 'tank' ? 'tank' : 'other'](),
        };
      },
    },
    {
      id: 'souma r12s p2 双重飞踢2',
      type: 'StartsUsing',
      netRegex: { id: ['B525'], capture: false },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          tank: { en: '去背后 => 大圈死刑' },
          other: { en: '去背后脚下' },
        };
        return {
          [data.role === 'tank' ? 'alertText' : 'infoText']: output
            [data.role === 'tank' ? 'tank' : 'other'](),
        };
      },
    },
    {
      id: 'souma r12s p2 模仿细胞 B4E1',
      type: 'StartsUsing',
      netRegex: { id: 'B4E1', capture: false },
      run: (data) => {
        if (data.sPhase === '本体1运') {
          data.sPhase = '本体2运';
          data.sP2一运buff.length = 0;
        }
      },
    },
    {
      id: 'souma r12s p2 二运初始连线',
      type: 'Tether',
      netRegex: { 'id': '0175' },
      condition: (data, matches) => data.me === matches.target && data.sPhase === '本体2运',
      durationSeconds: 37,
      suppressSeconds: 999,
      alertText: (data, matches, output) => {
        const source = data.sActorPositions[matches.sourceId];
        if (!source) {
          throw new Error('source not found');
        }
        const dir = Directions.xyTo8DirNum(source.x, source.y, center.x, center.y);
        const res = Directions.outputFrom8DirNum(dir);
        data.sP2二运num = dir;
        return output.text({
          dir: output[res](),
          do: output[data.sP2二运num](),
        });
      },
      outputStrings: {
        ...Directions.outputStrings8Dir,
        '0': { en: '接本体线 => 跳A' },
        '1': { en: 'A顺接扇形 => 引导火波' },
        '2': { en: 'A顺接分摊 => 引导火波' },
        '3': { en: 'A顺接大圈 => 右偏下放大圈' },
        '4': { en: '不接线 => 正下放大圈' },
        '5': { en: '4逆接大圈 => 左偏下放大圈' },
        '6': { en: '4逆接分摊 => 引导火波' },
        '7': { en: '4逆接扇形 => 引导火波' },
        'text': { en: '${do}' },
      },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      suppressSeconds: 999,
      infoText: (data, _matches, output) => output[data.sP2二运num](),
      outputStrings: {
        '0': { en: '跳A' },
        '1': { en: '引导火波' },
        '2': { en: '引导火波' },
        '3': { en: '右偏下放大圈' },
        '4': { en: '正下放大圈' },
        '5': { en: '左偏下放大圈' },
        '6': { en: '引导火波' },
        '7': { en: '引导火波' },
      },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 7,
      durationSeconds: 7,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => output[data.sP2二运num](),
      outputStrings: {
        '0': { en: '右分摊' },
        '1': { en: '右分摊' },
        '2': { en: '右分摊' },
        '3': { en: '右分摊' },
        '4': { en: '左分摊' },
        '5': { en: '左分摊' },
        '6': { en: '左分摊' },
        '7': { en: '左分摊' },
      },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后扇形',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 9,
      durationSeconds: 5,
      suppressSeconds: 999,
      alarmText: (data, _matches, output) => {
        if (data.sP2二运num === 1 || data.sP2二运num === 7)
          return output.text();
      },
      outputStrings: {
        text: { en: '面向场外！面向场外！' },
      },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后后',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 20,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => output[data.sP2二运num](),
      outputStrings: {
        '0': { en: '右分摊，看远近' },
        '1': { en: '引导火波' },
        '2': { en: '引导火波' },
        '3': { en: '右分摊，看远近' },
        '4': { en: '左分摊，看远近' },
        '5': { en: '左分摊，看远近' },
        '6': { en: '引导火波' },
        '7': { en: '引导火波' },
      },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后后后',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 40,
      suppressSeconds: 999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '斜点准备' } },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后后后后',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 43,
      suppressSeconds: 999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '踩塔' } },
    },
    {
      id: 'souma r12s p2 落火飞溅 B4E3 后后后后后',
      type: 'StartsUsing',
      netRegex: { id: 'B4E3', capture: false },
      condition: (data) => data.sPhase === '本体2运',
      delaySeconds: 47,
      suppressSeconds: 999,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '回A' } },
    },
    // {
    //   id: 'souma r12s p2 时空重现 B4EC',
    //   type: 'StartsUsing',
    //   netRegex: { id: 'B4EC', capture: false },
    //   infoText: (_data, _matches, output) => output.text!(),
    //   outputStrings: { text: { en: '自定义文本' } },
    // },
    {
      id: 'souma r12s p2 远界阴怒 B52F',
      type: 'StartsUsing',
      netRegex: { id: 'B52F', capture: false },
      infoText: (data, _matches, output) => {
        if (data.sPhase === '本体2运') {
          if (['0', '4', '3', '5'].includes(data.sP2二运num.toString()))
            return output.text();
        }
      },
      outputStrings: { text: { en: '打远' } },
    },
    {
      id: 'souma r12s p2 近界阴怒 B52E',
      type: 'StartsUsing',
      netRegex: { id: 'B52E', capture: false },
      infoText: (data, _matches, output) => {
        if (data.sPhase === '本体2运') {
          if (['0', '4', '3', '5'].includes(data.sP2二运num.toString()))
            return output.text();
        }
      },
      outputStrings: { text: { en: '打近' } },
    },
    // {
    //   id: 'souma r12s p2 变异细胞 B505',
    //   type: 'StartsUsing',
    //   netRegex: { id: 'B505', capture: false },
    //   infoText: (_data, _matches, output) => output.text!(),
    //   outputStrings: { text: { en: '自定义文本' } },
    // },
    {
      id: 'souma r12s p2 三运buff',
      type: 'GainsEffect',
      netRegex: { effectId: ['12A1', '12A3'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (data) => data.role === 'tank' ? 1 : 0,
      durationSeconds: (data, matches) =>
        parseFloat(matches.duration) - (data.role === 'tank' ? 1 : 0) - 1,
      countdownSeconds: (data, matches) =>
        parseFloat(matches.duration) - (data.role === 'tank' ? 1 : 0) - 1,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          '1b': { en: '撞球组' },
          '1a': { en: '闲人组' },
        };
        const buff = matches.effectId === '12A1' ? 'a' : 'b';
        if (data.s三运buff === undefined) {
          // 第一次
          data.s三运buff = buff;
          return { [buff === 'b' ? 'alertText' : 'infoText']: output[`1${buff}`]() };
        }
        // 第二次
        data.s三运buff = buff;
        // return { [buff === 'b' ? 'alertText' : 'infoText']: output[`2${buff}`]!() };
      },
    },
    {
      id: 'souma r12s p2 三运buff T',
      type: 'GainsEffect',
      netRegex: { effectId: ['12A1', '12A3'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: 0.5,
      durationSeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      suppressSeconds: 999,
      countdownSeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      infoText: (data, matches, output) => {
        const buff = matches.effectId === '12A1' ? 'a' : 'b';
        if (buff === 'a' && data.role === 'tank')
          return output[`a`]();
      },
      outputStrings: {
        'a': { en: '稍后挑衅BOSS' },
      },
    },
    {
      id: 'souma r12s p2 三运buff 换T',
      type: 'GainsEffect',
      netRegex: { effectId: ['12A1', '12A3'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      suppressSeconds: 999,
      alertText: (data, matches, output) => {
        const buff = matches.effectId === '12A1' ? 'a' : 'b';
        if (buff === 'a' && data.role === 'tank')
          return output[`a`]();
      },
      outputStrings: {
        'a': { en: '挑衅BOSS' },
      },
    },
    {
      id: 'souma r12s p2 阴界近景 B52B',
      type: 'StartsUsing',
      netRegex: { id: 'B52B', capture: false },
      condition: (data) => data.sPhase === '本体3运',
      infoText: (data, _matches, output) => output[data.s三运buff === 'a' ? '近a' : '近b'](),
      outputStrings: {
        近b: { en: '近引导' },
        近a: { en: '远躲避' },
      },
    },
    {
      id: 'souma r12s p2 阴界远景 B52c',
      type: 'StartsUsing',
      netRegex: { id: 'B52c', capture: false },
      condition: (data) => data.sPhase === '本体3运',
      infoText: (data, _matches, output) => output[data.s三运buff === 'a' ? '远a' : '远b'](),
      outputStrings: {
        远b: { en: '远引导' },
        远a: { en: '近躲避' },
      },
    },
    // 19205 暗黑球
    // 19206 蓝水球
    // 19207 绿风圈
    // 19208 紫雷晶
    // 19209 红火结
    {
      id: 'souma r12s p2 魔力球 B4FB',
      type: 'StartsUsing',
      netRegex: { id: 'B4FB', capture: false },
      preRun: (data) => {
        data.sPhase = '本体3运';
        data.sP2二运num = undefined;
        data.sP2二运暗分身 = undefined;
        data.sP2二运火分身 = undefined;
        data.sP2二运暗分身分身 = undefined;
        data.sP2二运火分身分身 = undefined;
        data.sP2二运我找谁 = undefined;
      },
    },
    {
      id: 'souma r12s p2 魔力球后',
      type: 'StartsUsing',
      netRegex: { id: 'B4FB', capture: false },
      delaySeconds: 15 - 7,
      durationSeconds: 6,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) =>
          v.BNpcNameID === 14382 && v.BNpcID && [
            19206,
            19207,
            19208,
            19209,
          ].includes(v.BNpcID)
        );
      },
      alertText: (data, _matches, output) => {
        const left = data.sCombatantData.filter((v) => v.PosX < 100).map((v) => ({
          BNpcID: v.BNpcID,
          PosX: v.PosX,
          PosY: v.PosY,
        }));
        const right = data.sCombatantData.filter((v) => v.PosX > 100).map((v) => ({
          BNpcID: v.BNpcID,
          PosX: v.PosX,
          PosY: v.PosY,
        }));
        const leftWithDis = left.map((v) => {
          return {
            ...v,
            dis: getDis(v.PosX, v.PosY, 90, 100),
          };
        });
        const rightWithDis = right.map((v) => {
          return {
            ...v,
            dis: getDis(v.PosX, v.PosY, 110, 100),
          };
        });
        // 近的大约6 远的大约12
        const early = leftWithDis.find((v) => v.dis < 9) ? 'left' : 'right';
        const balls = early === 'left' ? leftWithDis : rightWithDis;
        const blue = balls.find((v) => v.BNpcID === 19206);
        const green = balls.find((v) => v.BNpcID === 19207);
        const purple = balls.find((v) => v.BNpcID === 19208);
        const red = balls.find((v) => v.BNpcID === 19209);
        const dis = [
          { color: 'blue', dis: blue.dis },
          { color: 'green', dis: green.dis },
          { color: 'purple', dis: purple.dis },
          { color: 'red', dis: red.dis },
        ];
        // console.log(early, dis);
        const earlySideHasGreen = green.dis < 9;
        data.s三运先吸 = earlySideHasGreen ? early : (early === 'left' ? 'right' : 'left');
        const min2Dis = dis.sort((a, b) => a.dis - b.dis).slice(0, 2);
        if (data.s三运buff === 'b') {
          return output.text({
            dir: output[early !== 'left' ? 'left' : 'right'](),
            c1: output[min2Dis[0].color](),
            c2: output[min2Dis[1].color](),
          });
        }
        if (data.s三运buff === 'a') {
          return output.a();
        }
      },
      outputStrings: {
        blue: { en: '蓝' },
        green: { en: '绿' },
        purple: { en: '紫' },
        red: { en: '红' },
        left: { en: '左' },
        right: { en: '右' },
        text: { en: '撞${dir}边${c1}/${c2}' },
        a: { en: '场中别动' },
        aTank: { en: '场中别动，一会换T' },
      },
    },
    {
      id: 'souma r12s p2 魔力球后后',
      type: 'StartsUsing',
      netRegex: { id: 'B4FB', capture: false },
      delaySeconds: 19,
      durationSeconds: 12,
      infoText: (data, _matches, output) => {
        return output.text({ dir: output[data.s三运先吸]() });
      },
      outputStrings: {
        left: { en: '左D' },
        right: { en: '右B' },
        text: { en: '${dir}球安全' },
      },
    },
    {
      id: 'souma r12s p2 魔力球苏醒 B500',
      type: 'StartsUsing',
      netRegex: { id: 'B500', capture: false },
      delaySeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '走' } },
    },
    {
      id: 'souma r12s p2 境中奇梦',
      type: 'StartsUsing',
      netRegex: { id: 'B509', capture: false },
      response: Responses.aoe(),
      run: (data) => {
        if (data.sPhase === '本体3运') {
          data.sPhase = '本体4运';
        }
      },
    },
    {
      id: 'souma r12s p2 四运长记忆1',
      type: 'ActorControlExtra',
      netRegex: {
        category: '0197',
        param1: '11D2',
      },
      condition: (data) => data.sPhase === '本体4运',
      suppressSeconds: 999,
      infoText: (data, matches, output) => {
        const actor = data.sActorPositions[matches.id];
        if (!actor) {
          throw new Error('actor not found');
        }
        const dir = Directions.xyTo8DirNum(actor.x, actor.y, center.x, center.y);
        if (dir % 2 === 0) {
          data.s四运长记忆1 = '正点先刷';
          return output.even();
        }
        data.s四运长记忆1 = '斜点先刷';
        return output.odd();
      },
      outputStrings: {
        even: { en: '正点先刷' },
        odd: { en: '斜点先刷' },
      },
    },
    {
      id: 'souma r12s p2 四运长记忆1读取1',
      type: 'ActorControlExtra',
      netRegex: {
        category: '0197',
        param1: '11D2',
      },
      condition: (data) => data.sPhase === '本体4运',
      delaySeconds: 150,
      durationSeconds: 13,
      suppressSeconds: 999,
      alertText: (data, _matches, output) => {
        let str = data.s四运长记忆1;
        if (data.triggerSetConfig.soumaM12Sbentisiyun === 'uptime')
          str += 'uptime';
        return output[str]();
      },
      outputStrings: {
        正点先刷: { en: 'MT组去A，ST组去B' },
        斜点先刷: { en: 'MT组去4，ST组去3' },
        正点先刷uptime: { en: 'T组去A，远组去B，近战去1' },
        斜点先刷uptime: { en: 'T组去4，远组去3，近战去D' },
      },
    },
    {
      id: 'souma r12s p2 四运长记忆1读取2',
      type: 'ActorControlExtra',
      netRegex: {
        category: '0197',
        param1: '11D2',
      },
      condition: (data) => data.sPhase === '本体4运',
      delaySeconds: 150 + 22,
      durationSeconds: 13,
      suppressSeconds: 999,
      alertText: (data, _matches, output) => {
        let str = data.s四运长记忆1;
        if (data.triggerSetConfig.soumaM12Sbentisiyun === 'uptime')
          str += 'uptime';
        return output[str]();
      },
      outputStrings: {
        正点先刷: { en: 'MT组去4，ST组去3' },
        斜点先刷: { en: 'MT组去A，ST组去B' },
        正点先刷uptime: { en: 'T组去4，远组去3，近战去D' },
        斜点先刷uptime: { en: 'T组去A，远组去B，近战去1' },
      },
    },
    {
      id: 'souma r12s p2 四运初始连线',
      type: 'Tether',
      netRegex: { 'id': '0175' },
      condition: (data, matches) => data.me === matches.target && data.sPhase === '本体4运',
      durationSeconds: 55,
      suppressSeconds: 999,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          '0': { en: 'A：接同色分摊' },
          '2': { en: 'B：接同色分摊' },
          '5': { en: '3：接同色分摊' },
          '7': { en: '4：接同色分摊' },
          '4': { en: 'C：接同色大圈' },
          '6': { en: 'D：接同色大圈' },
          '1': { en: '1：接同色大圈' },
          '3': { en: '2：接同色大圈' },
        };
        const source = data.sActorPositions[matches.sourceId];
        if (!source) {
          throw new Error('source not found');
        }
        const dir = Directions.xyTo8DirNum(source.x, source.y, center.x, center.y);
        const count = {
          0: 1,
          1: 1,
          2: 2,
          3: 2,
          4: 1,
          5: 1,
          6: 2,
          7: 2,
        }[dir];
        const gimmick = [0, 2, 5, 7].includes(dir) ? '分摊' : '大圈';
        data.s四运分摊分散玩家机制 = { count, gimmick };
        return { [gimmick === '大圈' ? 'alertText' : 'infoText']: output[dir]() };
      },
    },
    {
      id: 'souma r12s p2 四运初始连线接',
      type: 'Tether',
      netRegex: { 'id': ['0170', '0171'] },
      condition: (data, matches) => data.me === matches.target && data.sPhase === '本体4运',
      suppressSeconds: 999,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          circle: { en: '接大圈' },
          stack: { en: '接分摊' },
        };
        const source = data.sActorPositions[matches.sourceId];
        if (!source) {
          throw new Error('source not found');
        }
        const dir = Directions.xyTo8DirNum(source.x, source.y, center.x, center.y);
        const gimmick = matches.id === '0170' ? '大圈' : '分摊';
        const num = dir % 2 === 0 ? '正点' : '斜点';
        data.s四运分摊分散正点是大圈 = (gimmick === '大圈' && num === '正点') ||
          (gimmick === '分摊' && num === '斜点');
        return {
          [data.s四运分摊分散玩家机制.gimmick === '大圈' ? 'alertText' : 'infoText']: output
            [data.s四运分摊分散玩家机制.gimmick === '大圈' ? 'circle' : 'stack'](),
        };
      },
    },
    // 04:25
    {
      id: 'souma r12s p2 本体4运读取分摊分散记忆',
      type: 'StartsUsing',
      netRegex: { id: 'B509', capture: false },
      delaySeconds: 364 - 265,
      durationSeconds: 24,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => {
        return output.text({
          g: data.s四运分摊分散正点是大圈 ? output.圈先() : output.摊先(),
          you: output[data.s四运分摊分散玩家机制.gimmick === '分摊' ? 'stack' : 'circle']({
            count: data.s四运分摊分散玩家机制.count,
            gimmick: data.s四运分摊分散玩家机制.gimmick,
          }),
        });
      },
      outputStrings: {
        圈先: { en: '圈摊圈摊' },
        摊先: { en: '摊圈摊圈' },
        text: { en: '${g}。${you}' },
        stack: {
          en: '你是${gimmick}',
        },
        circle: {
          en: '你处理第${count}次${gimmick}',
        },
      },
    },
    {
      id: 'souma r12s p2 力量喷涌',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B512'], capture: true },
      condition: (data, matches) => {
        return data.sPhase === '本体4运' && equal(parseFloat(matches.x), 100.00, 0.1) &&
          equal(parseFloat(matches.y), 88.00, 0.1);
      },
      suppressSeconds: 999,
      infoText: (data, matches, output) => {
        const kage = (equal(parseFloat(matches.heading), 0.000, 0.1) ||
            equal(parseFloat(matches.heading), 3.141, 0.1))
          ? 'A'
          : 'C';
        data.s四运分身打上下 = kage;
        return output[kage]();
      },
      outputStrings: {
        A: { en: '稍后1、4' },
        C: { en: '稍后2、3' },
      },
    },
    {
      id: 'souma r12s p2 力量喷涌后',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B512'], capture: true },
      condition: (data, matches) => {
        return data.sPhase === '本体4运' && equal(parseFloat(matches.x), 100.00, 0.1) &&
          equal(parseFloat(matches.y), 88.00, 0.1);
      },
      delaySeconds: 26,
      durationSeconds: 5,
      suppressSeconds: 999,
      infoText: (data, matches, output) => {
        const kage = (equal(parseFloat(matches.heading), 0.000, 0.1) ||
            equal(parseFloat(matches.heading), 3.141, 0.1))
          ? 'A'
          : 'C';
        data.s四运分身打上下 = kage;
        return output[kage]();
      },
      outputStrings: {
        A: { en: '1、4安全 => 小世界分组' },
        C: { en: '2、3安全 => 小世界分组' },
      },
    },
    {
      id: 'souma r12s p2 境中奇狱 B533',
      type: 'StartsUsing',
      netRegex: { id: ['B533'], capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r12s p2 境中奇狱 B537',
      type: 'StartsUsing',
      netRegex: { id: ['B537'], capture: false },
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '狂暴' } },
    },
    // {
    //   id: 'souma r12s p2 B4F3',
    //   type: 'StartsUsing',
    //   netRegex: { id: ['B4F3'], capture: false },
    //   preRun: (data) => data.s四运小世界 = true,
    //   delaySeconds: 15,
    //   run: (data) => data.s四运小世界 = false,
    // },
    {
      id: 'souma r12s B9D9 后',
      comment: { en: '根据职业判断近战/远程，不考虑D2黑魔的特殊情况。' },
      type: 'Ability',
      netRegex: { id: ['B9D9'], capture: false },
      delaySeconds: 30,
      durationSeconds: 12 + 22,
      suppressSeconds: 30,
      alertText: (data, _matches, output) => {
        if (data.s四运踩塔 === undefined) {
          return output.unknown();
        }
        const { tower, position } = data.s四运踩塔;
        const role = data.role === 'tank' || Util.isMeleeDpsJob(data.job) ? 'melee' : 'caster';
        return output.text({
          tower: output[`${tower}${['暗', '风'].includes(tower) ? '' : role}`](),
          position: output[position](),
        });
      },
      outputStrings: {
        unknown: { en: '踩塔' },
        text: { en: '${position}${tower}' },
        火melee: { en: '火塔（等热风）=> 中间' },
        火caster: { en: '火塔（等热风）=> 左后' },
        土melee: { en: '土塔（躲竹笋）=> 中间' },
        土caster: { en: '土塔（躲竹笋）=> 左后' },
        暗: { en: '暗塔（射场外）=> 最前' },
        风: { en: '风塔（被吹飞）=> 右前' },
        左上: { en: '左上' },
        右上: { en: '右上' },
        左下: { en: '左下' },
        右下: { en: '右下' },
      },
    },
    {
      id: 'souma r12s B9D9',
      type: 'Ability',
      netRegex: { id: ['B9D9'], capture: true },
      preRun: (data, matches) => data.s四运B9D9.push(matches),
      // 模拟器现在（在M12S本体限定？）目前有bug，至少要延迟一些，才能拿到正确的坐标
      // https://github.com/OverlayPlugin/cactbot/issues/957
      delaySeconds: 1,
      promise: async (data) => {
        data.sCombatantData = (await callOverlayHandler({ call: 'getCombatants' })).combatants
          .filter((v) =>
            v.ID &&
            v.ID >= 0x10000000 && v.ID <= 0x1FFFFFFF
          );
      },
      infoText: (data, _matches, output) => {
        if (data.s四运B9D9.length !== 4)
          return;
        const debuffs = data.s四运B9D9.map((v) => v.target);
        data.s四运B9D9.length = 0;
        const me = data.sCombatantData.find((v) => v.Name === data.me);
        if (!me)
          return;
        const isMT = me.PosX <= 100;
        const magicTower = ['土', '火'];
        const swapPos = { '左上': '右上', '右上': '左上', '左下': '右下', '右下': '左下' };
        const players = data.sCombatantData
          .filter((v) => isMT === (v.PosX <= 100))
          .map((v) => ({ x: v.PosX, y: v.PosY, name: v.Name }))
          .sort((a, b) => a.x - b.x);
        const [t1, t2, t3, t4] = Object.values(data.sCombatantMemory)
          .filter((v) => isMT === (v.x <= 100))
          .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
        if (players.length !== 4 || !t1 || !t2 || !t3 || !t4) {
          if (debuffs.includes(data.me))
            return output.unknownDebuff();
          return output.unknown();
        }
        // 1 2   center   1  2
        // 3 4   center   3  4
        const [p1, p3] = players.slice(0, 2).sort((a, b) => a.y - b.y);
        const [p2, p4] = players.slice(2, 4).sort((a, b) => a.y - b.y);
        const configs = isMT
          ? [
            [p2, t2, [t2, t4], '左上'],
            [p4, t4, [t2, t4], '右上'],
            [p1, t1, [t1, t3], '左下'],
            [p3, t3, [t1, t3], '右下'],
          ]
          : [
            [p3, t3, [t3, t1], '左上'],
            [p1, t1, [t3, t1], '右上'],
            [p4, t4, [t4, t2], '左下'],
            [p2, t2, [t4, t2], '右下'],
          ];
        const result = {};
        for (const [p, originT, sideTs, pos] of configs) {
          const targetT = sideTs.find((t) =>
            debuffs.includes(p.name) === magicTower.includes(t.tower)
          );
          const isSwapped = originT.tower !== targetT.tower;
          result[p.name] = {
            tower: targetT.tower,
            position: isSwapped ? swapPos[pos] : pos,
            switch: isSwapped,
          };
        }
        data.s四运踩塔 = result[data.me];
        return output.text({
          tower: output[result[data.me].tower](),
          position: output[result[data.me].position](),
        });
      },
      outputStrings: {
        unknownDebuff: { en: '踩纯色塔' },
        unknown: { en: '踩混色塔' },
        text: {
          en: '(稍后${position}${tower}塔)',
        },
        火: { en: '火' },
        土: { en: '土' },
        暗: { en: '暗' },
        风: { en: '风' },
        左上: { en: '左上' },
        右上: { en: '右上' },
        左下: { en: '左下' },
        右下: { en: '右下' },
      },
    },
    {
      id: 'souma r12s p2 空间裂断',
      type: 'StartsUsing',
      netRegex: { id: ['B51C'], capture: false },
      infoText: (data, _matches, output) => {
        return output[data.s四运分身打上下]();
      },
      outputStrings: {
        A: { en: 'A打上下' },
        C: { en: 'C打上下' },
      },
    },
    {
      id: 'souma r12s p2 空间裂断吧吧',
      type: 'StartsUsing',
      netRegex: { id: 'B51C', capture: true },
      delaySeconds: 0,
      run: (data) => {
        data.sActorPositionsClone = deepClone(data.sActorPositions);
      },
    },
    {
      id: 'souma r12s p2 空间裂断啊',
      type: 'Ability',
      netRegex: { id: ['B51D'], capture: true },
      infoText: (data, matches, output) => {
        const kage = data.sActorPositionsClone[matches.sourceId];
        if (!kage) {
          return;
        }
        if (
          (kage.y <= 100 && data.s四运分身打上下 === 'A') ||
          (kage.y > 100 && data.s四运分身打上下 === 'C')
        ) {
          data.s四运分身哪安全 = 'Sides';
          return output.两侧();
        }
        data.s四运分身哪安全 = 'Target';
        return output.目标圈();
      },
      outputStrings: {
        两侧: { en: '两侧' },
        目标圈: { en: '目标圈' },
      },
    },
    {
      id: 'souma r12s p2 空间裂斩钢铁',
      type: 'AbilityExtra',
      netRegex: { id: 'B4D9', capture: true },
      condition: (data) => data.s四运分身哪安全 !== undefined,
      infoText: (data, matches, output) => {
        const kage = data.sActorPositionsClone[matches.sourceId];
        if (!kage) {
          return;
        }
        if (Math.abs(kage.y - 104.50) < 1) {
          const safe = parseFloat(matches.x) <= 100 ? 'B' : 'D';
          return output[safe + data.s四运分身哪安全]();
        }
      },
      outputStrings: {
        BSides: { en: '稍后Boy两侧' },
        DSides: { en: '稍后Dog两侧' },
        BTarget: { en: '稍后Boy目标圈' },
        DTarget: { en: '稍后Dog目标圈' },
      },
    },
    {
      id: 'souma r12s p2 空间裂斩钢铁之之',
      type: 'AbilityExtra',
      netRegex: { id: 'B4D9', capture: true },
      condition: (data) => data.s四运分身哪安全 !== undefined,
      delaySeconds: 15.5,
      infoText: (data, matches, output) => {
        const kage = data.sActorPositionsClone[matches.sourceId];
        if (!kage) {
          return;
        }
        if (Math.abs(kage.y - 104.50) < 1) {
          const safe = parseFloat(matches.x) <= 100 ? 'B' : 'D';
          return output[safe + data.s四运分身哪安全]();
        }
      },
      outputStrings: {
        BSides: { en: 'Boy两侧' },
        DSides: { en: 'Dog两侧' },
        BTarget: { en: 'Boy目标圈' },
        DTarget: { en: 'Dog目标圈' },
      },
    },
    {
      id: 'souma r12s p2 空间裂斩钢铁之之之之',
      type: 'AbilityExtra',
      netRegex: { id: 'B4D9', capture: true },
      condition: (data) => data.s四运分身哪安全 !== undefined,
      delaySeconds: 38,
      suppressSeconds: 99,
      infoText: (data, _matches, output) => {
        return output[data.s四运分身哪安全]();
      },
      outputStrings: {
        Sides: { en: 'A两侧' },
        Target: { en: 'A目标圈' },
      },
    },
    // #endregion
  ],
});
