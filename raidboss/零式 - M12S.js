const mjMap = {
  BBC: '1麻',
  BBD: '2麻',
  BBE: '3麻',
  D7B: '4麻',
  1292: 'beta',
  1290: 'alpha',
};
const equal = (num, target, diff = 0.1) => {
  return Math.abs(num - target) < diff;
};
Options.Triggers.push({
  id: 'SoumaAacHeavyweightM4Savage',
  zoneId: ZoneId.AacHeavyweightM4Savage,
  zoneLabel: { en: 'M12S Souma特供版' },
  overrideTimelineFile: true,
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
11 "补天之手?/境中奇焰?" StartsUsing { id: "B4D7" } window 20,20 #Lindwurm（Boss）
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
1046 "蛇踢" # Ability { id: "B527" } #リンドブルム（Boss）
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
1141.6 "蛇踢" # Ability { id: "B527" } #リンドブルム（Boss）
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
1311.3 "蛇踢" # Ability { id: "B511" } #人型分体（分身）
1311.3 "力量喷涌" # Ability { id: "B510" } #人型分体（分身）
1316.5 "自我复制" # Ability { id: "B4D8" } #リンドブルム（Boss）
1336.1 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1340.5 "蛇踢" # Ability { id: "BE95" } #リンドブルム（分身）
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
1432.6 "蛇踢" # Ability { id: "BCAF" } #人型分体（分身）
1437.7 "时空重现" # Ability { id: "B4EC" } #リンドブルム（Boss）
1441.1 "魔力爆发" # Ability { id: "BBE3" } #リンドブルム（分身）
1441.3 "重猛击" # Ability { id: "BE5D" } #リンドブルム（分身）
1446.9 "心象投影" # Ability { id: "BBE2" } #リンドブルム（Boss）
1451.3 "蛇踢" # Ability { id: "BE95" } #リンドブルム（分身）
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
    };
  },
  triggers: [
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
          'BBC',
          'BBD',
          'BBE',
          'D7B',
          '1292',
          '1290', // alpha
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
        '1麻alpha': { en: 'alpha1：1线 => 场地3塔' },
        '2麻alpha': { en: 'alpha2：2线 => 场地4塔' },
        '3麻alpha': { en: 'alpha3：场地1塔 => 3线' },
        '4麻alpha': { en: 'alpha4：场地2塔 => 4线' },
        '1麻beta': { en: 'beta1: 反拉1线 => 玩家三塔' },
        '2麻beta': { en: 'beta2: 反拉2线 => 玩家四塔' },
        '3麻beta': { en: 'beta3: 玩家一塔 => 反拉3线' },
        '4麻beta': { en: 'beta4: 玩家二塔 => 反拉4线' },
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
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 10,
      durationSeconds: 6,
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
      countdownSeconds: 14,
      durationSeconds: 14,
      suppressSeconds: 999,
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
      id: 'souma r12s 麻将12-',
      type: 'GainsEffect',
      netRegex: { effectId: ['1292', '1290'], capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) + 14,
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
      id: 'souma r12s ActorSetPos Tracker',
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
          '1299',
          '129A', // 分摊
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
          '1299',
          '129A', // 分摊
        ],
        capture: false,
      },
      delaySeconds: 0.5,
      durationSeconds: 16.5,
      countdownSeconds: 16.5,
      suppressSeconds: 30,
      condition: (data) => data.sPhase === '第一次细胞',
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
          '436',
          '437',
          '438',
          '439', // 左
        ],
        capture: true,
      },
      condition: Conditions.targetIsYou(),
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
        '前': { en: '(前)' },
        '右': { en: '(右)' },
        '后': { en: '(后)' },
        '左': { en: '(左)' },
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
      type: 'AddedCombatant',
      netRegex: { npcNameId: '14378', npcBaseId: ['19200', '19201'], capture: true },
      preRun: (data, matches) => {
        data.sBalls.push(matches);
      },
      durationSeconds: 20,
      infoText: (data, _matches, output) => {
        if (data.sBallsOver || data.sBalls.length % 2 !== 0) {
          return;
        }
        const purples = data.sBalls.filter((v) => v.npcBaseId === '19200');
        if (purples.length > 0) {
          const purpleSide = parseFloat(purples[0].x) < 100 ? 'left' : 'right';
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
              purpleSide === 'left' ? parseFloat(v.x) < 100 : parseFloat(v.x) > 100
            ).map((v) => v.npcBaseId === '19200' ? 't' : 'h');
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
      },
      outputStrings: {
        text: { en: '${side} ${ordered}' },
        t: { en: 'T' },
        h: { en: '奶' },
        left: { en: '左' },
        right: { en: '右' },
      },
    },
    {
      id: 'souma r12s 拉线之1',
      type: 'HeadMarker',
      netRegex: { id: '0291', capture: true },
      condition: (data, matches) => data.sPhase === '第二次细胞' && matches.target === data.me,
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
        '24': { en: '二四安全' },
        '13': { en: '一三安全' },
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
      netRegex: { id: ['013D'], capture: true },
      condition: (data) => data.sPhase === '喋血',
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
          'B4CB',
          'B4CC',
          'B4CD',
          'B4CE', // 右边先出，击退
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
  ],
});
