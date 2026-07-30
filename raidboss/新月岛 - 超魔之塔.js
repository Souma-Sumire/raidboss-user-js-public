// Build Time: 2026-07-30T08:50:37.171Z
console.log('已加载超魔之塔');
const center = {
  boss1: { x: -900, y: 700 },
};
// x = -15  -> n= 1
// x = -5   -> n= 2
// x = +5   -> n= 3
// x = +15  -> n= 4
const getBoss1Column = (x) => {
  const n = Math.round((x + 915) / 10) + 1;
  return { n: n, m: n % 2 ? n + 1 : n - 1 };
};
Options.Triggers.push({
  id: 'Souma超模之塔',
  zoneId: 1346,
  overrideTimelineFile: true,
  timeline: `
### 蜃景幻界新月岛 北征之章
# ZoneId: 1346
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
1000.0 "--sync--" SystemLogMessage { id: "7DC", param1: "1573" } window 1100,1
# BOSS 1
1014.9 "决战" #Ability { id: "C23E" }
1027.3 "风暴吐息" #Ability { id: "BA0F" }
1027.3 "冰柱赋格" #Ability { id: "BA11" }
1035.5 "雷霜暴风雨" #Ability { id: "BA7B" }
1051.2 "双重冰焰凝环" #Ability { id: "BA38" }
1051.2 "冰焰" #Ability { id: "BA43" }
1057.0 "冰焰交错" #Ability { id: "BA45" }
1061.5 "冰焰交错" #Ability { id: "BA47" }
1073.2 "太古之怒"
1089.9 "雷电赋格" #Ability { id: "BA10" }
1089.9 "剧毒吐息" #Ability { id: "C61D" }
1097.9 "雷霜暴风雨" #Ability { id: "BA7B" }
1109.1 "魔法阵展开" #Ability { id: "BA67" }
1118.8 "魔阵光" #Ability { id: "BA69" }
1119.0 "双头恐惧" #Ability { id: "BA51" }
1128.1 "召唤" #Ability { id: "BA5E" }
1148.3 "双重吐息" #Ability { id: "BA1E" }
1148.3 "冰簇" #Ability { id: "BA22" }
1148.3 "雷簇" #Ability { id: "BA21" }
1148.7 "冰流" #Ability { id: "BA63" }
1148.7 "雷流" #Ability { id: "BA62" }
1155.3 "冰簇" #Ability { id: "BA24" }
1155.3 "雷簇" #Ability { id: "BA23" }
1155.7 "冰流" #Ability { id: "BA63" }
1155.7 "雷流" #Ability { id: "BA62" }
1164.4 "以太分享" #Ability { id: "BE02" }
1169.3 "魔法阵展开" #Ability { id: "BA67" }
1183.4 "魔阵光" #Ability { id: "BA6A" }
1183.4 "冰柱赋格" #Ability { id: "C624" }
1186.5 "雷电赋格" #Ability { id: "BA03" }
1194.5 "雷霜暴风雨" #Ability { id: "BA7B" }
1202.2 "太古之怒" #Ability { id: "BA85" }
1213.0 "共鸣诅咒展开" #Ability { id: "BA6B" }
1227.2 "双重冰焰凝环" #Ability { id: "BA38" }
1227.2 "冰焰" #Ability { id: "BA43" }
1227.6 "突风" #Ability { id: "BA70" }
1233.3 "冰焰交错" #Ability { id: "BA45" }
1235.7 "突风" #Ability { id: "BA70" }
1238.3 "冰焰交错" #Ability { id: "BA47" }
1249.4 "雷霜暴风雨" #Ability { id: "BA7B" }
1261.0 "魔法阵展开" #Ability { id: "BA67" }
1271.0 "魔阵光"
1271.2 "双头恐惧" #Ability { id: "BA51" }
1278.8 "魔法阵展开" #Ability { id: "BA67" }
1291.8 "魔阵光"
1291.8 "冰柱赋格" #Ability { id: "C624" }
1295.0 "雷电赋格" #Ability { id: "BA03" }
1304.8 "雷霜暴风雨" #Ability { id: "BA7B" }
1314.0 "召唤" #Ability { id: "BA5E" }
`,
  initData: () => {
    return {
      phase: 'boss1',
      boss1吐息赋格: [],
      boss1冰焰交错: [],
      boss1双头恐惧: [],
      boss1魔法阵展开赋格: [],
      boss1蓝之共鸣诅咒: null,
      boss1召唤: false,
      boss1召唤连线ID: [],
      boss1召唤MJ: [],
      boss1召唤Res: [],
      boss1球: [],
      boss1Boss: {},
    };
  },
  triggers: [
    // #region BOSS1
    {
      id: '超模之塔 BOSS1 决战',
      type: 'StartsUsing',
      netRegex: { id: 'C23E' },
      promise: async (data, matches) => {
        const boss = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants[0];
        data.boss1Boss[matches.sourceId] = boss.PosX < center.boss1.x ? 'blue' : 'green';
      },
    },
    {
      id: '超模之塔 BOSS1 01AD',
      type: 'Tether',
      netRegex: { id: '01AD' },
      // condition: (data, matches) => data.me === matches.source,
      infoText: (data, matches, output) => {
        if (data.me === matches.source)
          return output.text({ target: matches.target });
      },
      outputStrings: { text: { en: '打${target}' } },
    },
    {
      id: '超模之塔 BOSS1 吐息赋格',
      type: 'StartsUsing',
      netRegex: { id: ['BA0F', 'C61D', 'BA11', 'BA10'] },
      preRun: (data, matches) => {
        data.boss1吐息赋格.push(matches.id);
      },
      durationSeconds: 4.7,
      infoText: (data, _matches, output) => {
        const arr = data.boss1吐息赋格;
        if (arr.length === 2) {
          const sortArr = [
            'BA0F',
            'BA11',
            'BA10',
            'C61D', // '场中钢铁 // '剧毒吐息',
          ];
          const [a, b] = arr.sort((a, b) => {
            const indexA = sortArr.indexOf(a);
            const indexB = sortArr.indexOf(b);
            return indexA - indexB;
          });
          data.boss1吐息赋格.length = 0;
          return output.text({ g1: output[a](), g2: output[b]() });
        }
      },
      outputStrings: {
        'BA0F': { en: '场中击退' },
        'C61D': { en: '场中钢铁' },
        'BA11': { en: 'BOSS钢铁' },
        'BA10': { en: 'BOSS月环' },
        'text': { en: '${g1} + ${g2}' },
      },
    },
    {
      id: '超模之塔 BOSS1 雷霜暴风雨',
      type: 'StartsUsing',
      netRegex: { id: 'BA7B' },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: '超模之塔 BOSS1 冰焰交错',
      type: 'StartsUsing',
      netRegex: {
        id: ['BA37', 'BA38', 'BA39', 'BA3A', 'BA3B', 'BA3C', 'BA3D', 'BA3E'],
      },
      // # BA37 双重冰焰交错
      // # BA38 双重冰焰凝环
      // # BA39 冰焰交错凝环
      // # BA3A 冰焰凝环交错
      // # BA3B 双重冰焰交错
      // # BA3C 双重冰焰凝环
      // # BA3D 冰焰交错凝环
      // # BA3E 冰焰凝环交错
      preRun: (data, matches) => {
        data.boss1冰焰交错.push({
          id: matches.id,
          color: data.boss1Boss[matches.sourceId],
          timestamp: new Date(matches.timestamp).getTime(),
        });
      },
      durationSeconds: 26,
      alertText: (data, _matches, output) => {
        const arr = data.boss1冰焰交错.sort((a, b) => a.timestamp - b.timestamp);
        const d = {
          'BA37': ['交错', '交错'],
          'BA38': ['凝环', '凝环'],
          'BA39': ['交错', '凝环'],
          'BA3A': ['凝环', '交错'],
          'BA3B': ['交错', '交错'],
          'BA3C': ['凝环', '凝环'],
          'BA3D': ['交错', '凝环'],
          'BA3E': ['凝环', '交错'],
        };
        if (arr.length === 2) {
          const w = data.boss1蓝之共鸣诅咒 === null ? '' : data.boss1蓝之共鸣诅咒.wind;
          const color = data.boss1蓝之共鸣诅咒 === null ? '' : data.boss1蓝之共鸣诅咒.color;
          const [g1, g3] = d[arr[0].id].map((v) =>
            output[`${arr[0].color === color ? w : ''}${v}`]()
          );
          const [g2, g4] = d[arr[1].id].map((v) =>
            output[`${arr[1].color === color ? w : ''}${v}`]()
          );
          data.boss1冰焰交错.length = 0;
          return output.text({ g1, g2, g3, g4 });
        }
      },
      outputStrings: {
        交错: { en: '出' },
        凝环: { en: '进' },
        西风交错: { en: '(右击退)+出' },
        西风凝环: { en: '(右击退)+进' },
        东风交错: { en: '(左击退)+出' },
        东风凝环: { en: '(左击退)+进' },
        text: { en: '${g1} -> ${g2} -> ${g3} -> ${g4}' },
      },
    },
    {
      id: '超模之塔 BOSS1 太古之怒',
      type: 'StartsUsing',
      netRegex: { id: 'BA85' },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: '超模之塔 BOSS1 BA67',
      type: 'StartsUsing',
      netRegex: { id: 'BA67' },
      run: (data) => {
        data.boss1双头恐惧.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 双头恐惧',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BA56', 'BA57'] },
      preRun: (data, matches) => {
        data.boss1双头恐惧.push({
          id: matches.id,
          x: parseFloat(matches.x),
          sourceId: matches.sourceId,
        });
      },
      durationSeconds: 14.2,
      infoText: (data, _matches, output) => {
        const bossLight = data.boss1双头恐惧.find((v) => v.id === 'BA57');
        const other = data.boss1双头恐惧.find((v) => v.id === 'BA56');
        if (data.boss1双头恐惧.length === 2 && bossLight && other) {
          const bossColor = bossLight.x < other.x ? 'blue' : 'green';
          const m = getBoss1Column(bossLight.x).m;
          return output.text({
            column: output[m](),
            color: output[bossColor](),
          });
        }
      },
      outputStrings: {
        'blue': { en: '找蓝' },
        'green': { en: '找绿' },
        '1': { en: '左1' },
        '2': { en: '左2' },
        '3': { en: '右3' },
        '4': { en: '右4' },
        'text': { en: '${column} ${color}' },
      },
    },
    {
      id: '超模之塔 BOSS1 魔法阵展开赋格',
      type: 'StartsUsingExtra',
      netRegex: { id: ['C624', 'BA03'] },
      preRun: (data, matches) => {
        data.boss1魔法阵展开赋格.push({ id: matches.id, x: parseFloat(matches.x) });
      },
      durationSeconds: (data) => data.boss1魔法阵展开赋格.length === 1 ? 4 : 10,
      response: (data, _matches, output) => {
        const arr = data.boss1魔法阵展开赋格;
        if (arr.length === 1) {
          const a = arr[0];
          return {
            infoText: output.mic({
              gimmick: output[a.id](),
              color: output[a.x < center.boss1.x ? 'blue' : 'green'](),
            }),
          };
        }
        if (arr.length === 2) {
          const [a, b] = arr;
          data.boss1魔法阵展开赋格.length = 0;
          const amic = output.mic({
            gimmick: output[a.id](),
            color: output[a.x < center.boss1.x ? 'blue' : 'green'](),
          });
          const bmic = output.mic({
            gimmick: output[b.id](),
            color: output[b.x < center.boss1.x ? 'blue' : 'green'](),
          });
          return { alertText: output.text({ a: amic, b: bmic }) };
        }
      },
      outputStrings: {
        'C624': { en: '远离' },
        'BA03': { en: '靠近' },
        'blue': { en: '找绿' },
        'green': { en: '找蓝' },
        'mic': { en: '${gimmick}${color}' },
        'text': { en: '${a} => ${b}' },
      },
    },
    {
      id: '超模之塔 BOSS1 蓝之共鸣诅咒1',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 蓝击退：处理蓝头机制的时候触发
          // 绿击退：处理绿头机制的时候触发
          '13BD',
          '13BF',
          '13BC',
          '13BE', // 东风（蓝头）
        ],
      },
      condition: (data, matches) => data.me === matches.target,
      run: (data, matches) => {
        data.boss1蓝之共鸣诅咒 = {
          // color: 'blue',
          color: ['13BF', '13BE'].includes(matches.effectId) ? 'blue' : 'green',
          wind: ['13BF', '13BD'].includes(matches.effectId) ? '西风' : '东风',
        };
      },
    },
    {
      id: '超模之塔 BOSS1 蓝之共鸣诅咒2',
      type: 'LosesEffect',
      netRegex: { effectId: ['13BD', '13BF', '13BC', '13BE'] },
      condition: (data, matches) => data.me === matches.target,
      run: (data) => {
        data.boss1蓝之共鸣诅咒 = null;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤',
      type: 'StartsUsing',
      netRegex: { id: 'BA5E' },
      run: (data) => {
        data.boss1召唤 = true;
        data.boss1召唤连线ID.length = 0;
        data.boss1召唤Res.length = 0;
        data.boss1召唤MJ.length = 0;
        data.boss1球.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤end',
      type: 'StartsUsing',
      netRegex: { id: 'BA5E' },
      delaySeconds: 20,
      run: (data) => {
        data.boss1召唤 = false;
        data.boss1召唤连线ID.length = 0;
        data.boss1召唤Res.length = 0;
        data.boss1召唤MJ.length = 0;
        data.boss1球.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤连线',
      type: 'Tether',
      netRegex: { id: '019B' },
      condition: (data) => data.boss1召唤,
      promise: async (data, matches) => {
        const s = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants[0];
        data.boss1召唤连线ID.push({
          id: matches.targetId,
          x: s.PosX,
          color: undefined,
        });
        if (data.boss1召唤连线ID.length === 2 && data.boss1召唤连线ID[0]?.color === undefined) {
          data.boss1召唤连线ID.sort((a, b) => a.x - b.x);
          data.boss1召唤连线ID[0].color = 'blue';
          data.boss1召唤连线ID[1].color = 'green';
        }
      },
    },
    {
      id: '超模之塔 BOSS1 召唤Add ID收集',
      type: 'CombatantMemory',
      netRegex: {
        'pair': [
          { 'key': 'BNpcID', 'value': ['4C20', '4C1F'] }, // 4C20 导流冰球, 4C1F 导流雷球
        ],
      },
      condition: (data) => data.boss1召唤,
      run: (data, matches) => {
        if (matches.change === 'Add') {
          data.boss1球.push({
            id: matches.id,
            bNpcId: matches.pairBNpcID,
            x: parseFloat(matches.pairPosX),
            y: parseFloat(matches.pairPosY),
          });
        }
        if (matches.change === 'Change') {
          const b = data.boss1球.find((v) => v.id === matches.id);
          if (b) {
            b.bNpcId = matches.pairBNpcID !== undefined ? matches.pairBNpcID : b.bNpcId;
            b.x = matches.pairPosX !== undefined ? parseFloat(matches.pairPosX) : b.x;
            b.y = matches.pairPosY !== undefined ? parseFloat(matches.pairPosY) : b.y;
          }
        }
      },
    },
    {
      id: '超模之塔 BOSS1 MJ',
      type: 'HeadMarker',
      netRegex: { id: ['02D2', '02D3', '02D4', '02D5'] },
      condition: (data) => data.boss1召唤,
      preRun: (data, matches) => data.boss1召唤MJ.push({ targetId: matches.targetId }),
      durationSeconds: (data) => data.boss1召唤Res.length === 0 ? 3 : 9,
      promise: async (data, _matches, output) => {
        if (data.boss1召唤MJ.length % 2 === 0) {
          const combatants = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          const targets = combatants.filter((v) =>
            data.boss1召唤MJ.slice(-2).some((a) => parseInt(a.targetId, 16) === v.ID)
          ).map((v) => ({
            x: v.PosX,
            y: v.PosY,
            id: v.ID?.toString(16).toUpperCase(),
            color: data.boss1召唤连线ID.find((x) => x.id === v.ID?.toString(16).toUpperCase())
              ?.color,
          }));
          const blue = targets.find((x) => x.color === 'blue');
          const green = targets.find((x) => x.color === 'green');
          const ball = data.boss1球.sort((a, b) => a.y - b.y)[0].bNpcId === '4C1F'
            ? 'green'
            : 'blue';
          const xType = ball === 'green' ? green : blue;
          const yType = ball === 'green' ? blue : green;
          const xSafe = xType.x < center.boss1.x ? ['NE', 'SE'] : ['NW', 'SW'];
          const ySafe = yType.y < center.boss1.y ? ['SW', 'SE'] : ['NW', 'NE'];
          const target = xSafe.find((q) => ySafe.includes(q));
          const targetStr = output[target]();
          data.boss1召唤Res.push(targetStr);
          if (data.boss1召唤Res.length === 1) {
            data.boss1召唤Res2 = { text: data.boss1召唤Res[0], level: 'infoText' };
          }
          if (data.boss1召唤Res.length === 4) {
            data.boss1召唤Res2 = {
              text: output.text({
                a: data.boss1召唤Res[0],
                b: data.boss1召唤Res[1],
                c: data.boss1召唤Res[2],
                d: data.boss1召唤Res[3],
              }),
              level: 'alertText',
            };
          }
        }
      },
      response: (data) => {
        if (data.boss1召唤Res2) {
          const t = data.boss1召唤Res2.text;
          const l = data.boss1召唤Res2.level;
          data.boss1召唤Res2 = undefined;
          return { [l]: t };
        }
      },
      outputStrings: {
        'NE': { en: '右上' },
        'SE': { en: '右下' },
        'NW': { en: '左上' },
        'SW': { en: '左下' },
        'text': { en: '${a} -> ${b} -> ${c} -> ${d}' },
      },
    },
    // #endregion
    // #region BOSS2
    {
      id: '超模之塔 BOSS2 剑刃风暴',
      type: 'StartsUsing',
      netRegex: { id: 'C20B', capture: false },
      response: Responses.aoe(),
    },
    // #endregion
  ],
});
