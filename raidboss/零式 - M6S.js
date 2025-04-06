console.log('已加载M6S');
const getSafe = (bNpcID, dir) => {
  // N = 0, E = 1, S = 2, W = 3
  const handler = {
    // 18340 魔界花
    '18340': (dir) => {
      return {
        0: [1, 2],
        1: [2, 3],
        2: [3, 4],
        3: [4, 1],
      }[dir.toString()];
    },
    // 18341 梦魇
    '18341': (dir) => {
      return {
        0: [3, 4],
        1: [4, 1],
        2: [1, 2],
        3: [2, 3],
      }[dir.toString()];
    },
    // 18336 炸弹
    '18336': (dir) => {
      return {
        0: [3, 4],
        1: [4, 1],
        2: [1, 2],
        3: [2, 3],
      }[dir.toString()];
    },
    // 18337 翅膀炸弹
    '18337': (dir) => {
      return {
        0: [1, 2],
        1: [2, 3],
        2: [3, 4],
        3: [4, 1],
      }[dir.toString()];
    },
  };
  const result = handler[bNpcID](dir);
  return result;
};
Options.Triggers.push({
  id: 'SoumaAacCruiserweightM2Savage',
  zoneId: 1259,
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaAddIds: [],
      souma涂鸦阶段: false,
      soumaTankBuff: undefined,
      soumaDesertBuff: {},
      soumaSpreadBuffs: [],
    };
  },
  triggers: [
    {
      id: 'R6S Souma 慕斯骤雨',
      type: 'StartsUsing',
      netRegex: { id: 'A6BC' },
      response: Responses.aoe(),
    },
    {
      id: 'R6S Souma 顏色buff',
      type: 'GainsEffect',
      netRegex: { effectId: ['1163', '1164'] },
      condition: (data, matches) => {
        return data.role === 'tank' && matches.target === data.me;
      },
      run: (data, matches) => {
        data.soumaTankBuff = matches.effectId === '1163' ? 'orange' : 'blue';
      },
    },
    {
      id: 'R6S Souma 色彩暴乱',
      type: 'StartsUsing',
      // A691 蓝色举手
      // A692 橙色举手
      netRegex: { id: 'A69[12]' },
      alertText: (data, matches, output) => {
        const handColor = matches.id === 'A691' ? 'blue' : 'orange';
        if (data.role === 'tank') {
          if (data.soumaTankBuff === undefined)
            return output.first();
          return data.soumaTankBuff === handColor ? output.out() : output.in();
        }
        return output.text();
      },
      outputStrings: {
        text: { en: '坦克死刑' },
        first: { en: '坦克死刑' },
        out: { en: '死刑远离' },
        in: { en: '死刑靠近' },
      },
    },
    {
      id: 'R6S Souma 黏黏慕斯',
      type: 'StartsUsing',
      netRegex: { id: 'A695', capture: false },
      response: Responses.spread(),
    },
    {
      id: 'R6S Souma 黏黏慕斯2',
      type: 'StartsUsing',
      netRegex: { id: 'A695', capture: false },
      delaySeconds: 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '分摊',
      },
    },
    {
      id: 'R6S Souma 色彩碰撞',
      type: 'StartsUsing',
      netRegex: { id: ['A68B', 'A68D'] },
      infoText: (_data, matches, output) => {
        return output[matches.id]();
      },
      outputStrings: {
        'A68B': { en: '稍后双奶' },
        'A68D': { en: '稍后找搭档' },
      },
    },
    {
      id: 'R6S Souma 色彩碰撞2',
      type: 'StartsUsing',
      // A68B 打2下 44分摊
      // A68D 打4下 22分摊
      netRegex: { id: ['A68B', 'A68D'] },
      delaySeconds: 20,
      alertText: (_data, matches, output) => {
        return output[matches.id]();
      },
      outputStrings: {
        'A68B': { en: '双奶分摊' },
        'A68D': { en: '与搭档分摊' },
      },
    },
    {
      id: 'R6S Souma 双重涂鸦阶段',
      type: 'StartsUsing',
      netRegex: {
        id: [
          // 梦魇+魔界花
          '93CA',
          // 梦魇+魔界花
          '9408',
          // 魔界花+魔界花
          'A67D',
          // 梦魇+梦魇
          'A67E',
          // 梦魇+炸弹
          'A67F',
          // 梦魇+飞行炸弹
          'A680',
          // 炸弹+魔界花
          'A681',
          // 魔界花+飞行炸弹
          'A682',
        ],
      },
      run: (data) => data.souma涂鸦阶段 = true,
    },
    {
      id: 'R6S Souma 双重涂鸦阶段2',
      type: 'StartsUsing',
      netRegex: {
        id: [
          // 'A65F',
          // 'A660',
          // 'A661',
          // 'A662',
          // // 炸弹
          // 'A683',
          // 猜测是火+箭
          'A687',
          // 雷+箭
          'A689',
        ],
      },
      infoText: (_data, matches, output) => {
        return output[matches.id]();
      },
      outputStrings: {
        'A687': { en: '火：水中分摊' },
        'A689': { en: '雷：陆地分散' },
      },
    },
    {
      id: 'R6S Souma Tether',
      type: 'Tether',
      netRegex: { id: ['013F', '0140'], targetId: '4.{7}', sourceId: '4.{7}' },
      condition: (data) => data.souma涂鸦阶段,
      preRun: (data, matches) => {
        data.soumaAddIds.push(parseInt(matches.sourceId, 16));
      },
    },
    {
      id: 'R6S Souma Tether2',
      type: 'Tether',
      netRegex: { id: ['013F', '0140'] },
      condition: (data) => data.souma涂鸦阶段,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({ call: 'getCombatants' })).combatants
          .filter((v) => v.ID && data.soumaAddIds.includes(v.ID));
        data.souma涂鸦阶段 = false;
        data.soumaAddIds = [];
      },
      infoText: (data, _matches, output) => {
        const safe = { '1': 0, '2': 0, '3': 0, '4': 0 };
        data.soumaCombatantData.forEach((v) => {
          const dir = Directions.xyTo4DirNum(v.PosX, v.PosY, 100, 100);
          getSafe(v.BNpcID, dir).forEach((d) => safe[d] = safe[d] + 1);
        });
        const maxSafeKey = Object.keys(safe).reduce((a, b) => (safe[a] > safe[b] ? a : b));
        return output[maxSafeKey]();
      },
      outputStrings: {
        '1': { en: '3跳1' },
        '3': { en: '1跳3' },
        '4': { en: '2跳4' },
        '2': { en: '4跳2' },
      },
    },
    {
      id: 'R6S Souma 沙漠buff大圈',
      type: 'GainsEffect',
      // 1166 大圈
      netRegex: { effectId: '1166' },
      condition: (data, matches) => matches.duration === '43.00' && matches.target === data.me,
      preRun: (data, matches) => {
        data.soumaSpreadBuffs.push(matches.target);
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 8,
      durationSeconds: 8,
      countdownSeconds: 8,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '远离放大圈' } },
    },
    {
      id: 'R6S Souma 沙漠buff分摊',
      type: 'GainsEffect',
      // 1160 分摊
      netRegex: { effectId: '1160' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      durationSeconds: 3,
      countdownSeconds: 3,
      alertText: (data, _matches, output) => {
        if (data.soumaSpreadBuffs.includes(data.me)) {
          return;
        }
        return output.text();
      },
      run: (data) => data.soumaSpreadBuffs.length = 0,
      outputStrings: { text: { en: '分摊' } },
    },
    {
      id: 'R6S Souma Tether3',
      type: 'Tether',
      netRegex: { id: ['013F', '0140'], targetId: '4.{7}', sourceId: '1.{7}' },
      condition: (data, matches) => matches.source === data.me,
      infoText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        '0140': { en: '流沙内' },
        '013F': { en: '陆地上' },
      },
    },
    {
      id: 'R6S Souma 谢谢原石！',
      type: 'StartsUsing',
      netRegex: { id: 'A6AC', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '松鼠AoE' } },
    },
  ],
});
