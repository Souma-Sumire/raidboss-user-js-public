// import Util from '../../../../../resources/util';
// import { Directions } from '../../../../../resources/util';
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
  'wind-21.00': 21 - 11,
  // 2风
  'wind-37.00': 37 - 12,
  // 3风
  'wind-54.00': 54 - 14.5,
  // 1土
  'earth-21.00': 21 - 5.5,
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
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaKages: [],
      soumaWolfs: [],
      soumaTethers: [],
      souma竹子预占位: [],
      soumaPhase: 'P1-前',
      souma四连半场阶段: false,
      souma四连CloneIDs: [],
      souma四连导航: [],
    };
  },
  triggers: [
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
        '0': { en: 'AA' },
        '2': { en: 'CC' },
        'clockwise': { en: '<= 顺' },
        'counter-clockwise': { en: '逆 =>' },
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
        text: { en: '连续分摊 x8' },
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
        '1': { en: '1 1 1' },
        '2': { en: '2 2 2' },
        '3': { en: '3 3 3' },
        '4': { en: '4 4 4' },
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
      // 四连不报 避免打扰看分身
      condition: (data, matches) => matches.target === data.me && !data.souma四连半场阶段,
      response: Responses.spread(),
    },
    {
      id: 'R8S Souma 分摊点名',
      type: 'HeadMarker',
      netRegex: { id: '005D' },
      condition: (data, matches) => {
        if (data.souma四连半场阶段) {
          // 四连不报 避免打扰看分身
          return;
        }
        if (data.soumaPhase === 'P1-后大地1' || data.soumaPhase === 'P1-后大地2') {
          const targetRole = data.party.nameToRole_[matches.target] === 'dps' ? 'dps' : 'th';
          const myRole = data.role === 'dps' ? 'dps' : 'th';
          if (targetRole === myRole) {
            return true;
          }
        }
        return false;
      },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '分摊' },
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
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({ call: 'getCombatants' })).combatants
          .filter((v) => v.BNpcID === 18217);
      },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => {
        data.souma四连半场阶段 = true;
      },
      outputStrings: {
        text: { en: '4连半场刀' },
      },
    },
    {
      id: 'R8S Souma 幻狼召唤结束',
      type: 'StartsUsing',
      netRegex: { id: 'A3C1', capture: false },
      delaySeconds: 30,
      run: (data) => {
        data.souma四连半场阶段 = false;
      },
    },
    // 新方案，报的更快，但需要更多测试
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
        last: { en: '躲龙头' },
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
    // 旧方案 先留着万一有用
    // {
    //   id: 'R8S Souma 分身左右刀B',
    //   type: 'StartsUsingExtra',
    //   // A3C2 右手发光
    //   // A3C3 左手发光
    //   netRegex: { id: 'A3C[23]' },
    //   preRun: (data, matches) => {
    //     const sourceId = matches.sourceId;
    //     const katana = matches.id === 'A3C2' ? 'right' : 'left';
    //     const dir = Directions.xyTo4DirNum(parseFloat(matches.x), parseFloat(matches.y), 100, 100);
    //     const safe = getSafe(katana, dir);
    //     data.soumaKages.push({ katana, dir, safe, sourceId });
    //   },
    //   durationSeconds: (data) => data.soumaKages.length === 4 ? 6 : 3,
    //   response: (data, _matches, output) => {
    //     // cactbot-builtin-response
    //     output.responseOutputStrings = {
    //       kata1: { en: '${alphabet}' },
    //       kata2: { en: '${alphabet}' },
    //       kata4: { en: '${number}=> ${alphabet}' },
    //     };
    //     const kages = data.soumaKages;
    //     if (kages.length === 1) {
    //       // 一刀报半场
    //       return { infoText: output.kata1!({ alphabet: kages[0]!.safe.alphabet }) };
    //     }
    //     if (kages.length === 2) {
    //       // 二刀报半场
    //       return { infoText: output.kata2!({ alphabet: kages[1]!.safe.alphabet }) };
    //     }
    //     if (kages.length === 3) {
    //       // 三刀不报等四
    //       return;
    //     }
    //     if (kages.length === 4) {
    //       // 四报34交集然后半场
    //       const k3 = kages[2]!.safe.number;
    //       const k4 = kages[3]!.safe.number;
    //       const safe = k4.filter((x) => k3.includes(x))[0]!;
    //       if (safe === undefined)
    //         console.error('Souma 分身左右刀 交集错误', kages[1], kages[2]);
    //       const kage4 = kages[3]!.safe.alphabet;
    //       data.soumaKages.length = 0;
    //       return { alertText: output.kata4!({ number: safe, alphabet: kage4 }) };
    //     }
    //   },
    // },
  ],
});
