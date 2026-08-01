// Build Time: 2026-08-01T21:38:50.075Z
console.log('已加载超魔之塔');
const center = {
  boss1: { x: -900, y: 700 },
  boss3: { x: 100, y: 800 },
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
3000.0 "--sync--" SystemLogMessage { id: "7DC", param1: "1575" } window 2100,1
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
# BOSS3
3009.6 "核爆雨" Ability { id: "B97A" }
3015.9 "魔具召唤" #Ability { id: "B97D" }
3025.8 "魔力注入" #Ability { id: "B97E" }
3030.5 "魔具展开" #Ability { id: "B980" }
3045.0 "古代冰封" #Ability { id: "B987" }
3045.0 "魔具联动：冰封" #Ability { id: "B983" }
3052.7 "古代爆炎" #Ability { id: "B986" }
3052.7 "魔具联动：爆炎" #Ability { id: "B982" }
3060.2 "古代暴雷" #Ability { id: "B988" }
3060.2 "魔具联动：暴雷" #Ability { id: "B984" }
3061.0 "魔具联动：暴雷" #Ability { id: "C4B6" }
3061.0 "古代暴雷" #Ability { id: "B989" }
3069.3 "核爆雨" #Ability { id: "B97A" }
3075.5 "魔具展开" #Ability { id: "B98F" }
3080.8 "黑暗奔流" #Ability { id: "B98B" }
3081.6 "黑暗奔流" #Ability { id: "B98C" }
3088.2 "真空波" #Ability { id: "B98E" }
3097.5 "碎尸" #Ability { id: "B991" }
3104.8 "魔具召唤" #Ability { id: "B97D" }
3115.5 "魔力注入" #Ability { id: "B97E" }
3120.5 "魔具展开" #Ability { id: "B980" }
3132.9 "其墓须有三" #Ability { id: "B992" }
3143.2 "魔具联动：黑暗奔流" #Ability { id: "B993" }
3143.9 "黑暗奔流" #Ability { id: "B994" }
3145.3 "黑暗奔流" #Ability { id: "B995" }
3145.3 "古代冰封" #Ability { id: "B997" }
3150.2 "黑暗奔流" #Ability { id: "B994" }
3151.0 "古代暴雷" #Ability { id: "B998" }
3151.7 "黑暗奔流" #Ability { id: "B995" }
3156.8 "黑暗奔流" #Ability { id: "B994" }
3158.3 "黑暗奔流" #Ability { id: "B995" }
3158.3 "古代爆炎" #Ability { id: "B996" }
3163.9 "真空波" #Ability { id: "B98E" }
3173.6 "核爆雨" #Ability { id: "B97A" }
3184.2 "多产的土壤" #Ability { id: "B99A" }
3185.7 "多产的土壤" #Ability { id: "BF40" }
3187.6 "魔具召唤" #Ability { id: "B97D" }
3197.8 "魔力注入" #Ability { id: "B97E" }
3202.5 "魔具展开" #Ability { id: "B980" }
3217.6 "魔力连锁" #Ability { id: "B99B" }
3218.5 "播撒惊慌" #Ability { id: "B9D6" }
3218.8 "播撒惊恐" #Ability { id: "B99F" }
3218.8 "播撒恐慌" #Ability { id: "B9A0" }
3224.0 "播撒惊慌" #Ability { id: "B9D6" }
3224.4 "播撒恐慌" #Ability { id: "B9A0" }
3229.3 "播撒惊慌" #Ability { id: "B9D6" }
3229.6 "播撒惊恐" #Ability { id: "B99F" }
3229.6 "播撒恐慌" #Ability { id: "B9A0" }
3229.8 "古代冰封" #Ability { id: "B9A2" }
3234.7 "播撒惊慌" #Ability { id: "B9D6" }
3235.1 "播撒惊恐" #Ability { id: "B99F" }
3235.1 "播撒恐慌" #Ability { id: "B9A0" }
3240.2 "播撒惊慌" #Ability { id: "B99C" }
3240.6 "播撒恐慌" #Ability { id: "B99E" }
3240.6 "播撒惊恐" #Ability { id: "B99D" }
3241.0 "古代爆炎" #Ability { id: "B9A1" }
3245.7 "播撒惊慌" #Ability { id: "B99C" }
3246.0 "播撒恐慌" #Ability { id: "B99E" }
3246.0 "播撒惊恐" #Ability { id: "B99D" }
3251.0 "播撒惊慌" #Ability { id: "B99C" }
3251.3 "古代暴雷" #Ability { id: "B9A3" }
3251.4 "播撒恐慌" #Ability { id: "B99E" }
3251.4 "播撒惊恐" #Ability { id: "B99D" }
3252.0 "古代暴雷" #Ability { id: "B985" }
3256.8 "播撒惊慌" #Ability { id: "B9D6" }
3257.2 "播撒惊恐" #Ability { id: "B99F" }
3257.2 "播撒恐慌" #Ability { id: "B9A0" }
3263.3 "核爆雨" #Ability { id: "B97A" }
3270.2 "魔具展开" #Ability { id: "B98F" }
3275.5 "黑暗奔流" #Ability { id: "B98B" }
3276.8 "黑暗奔流" #Ability { id: "B98C" }
3284.0 "真空波" #Ability { id: "B98E" }
3293.1 "碎尸" #Ability { id: "B991" }
3301.0 "魔具召唤" #Ability { id: "B97D" }
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
      boss3魔力注入: {},
      boss3B981: [],
      boss3魔力注入count: 0,
      boss3魔力注入1: false,
      boss3魔力注入res: { '冰': '', '火': '', '雷': '' },
      boss3魔力注入中: false,
      boss3其墓须有三: false,
      boss39F8: [],
      boss3地水count: 0,
      boss3鸳鸯锅中: false,
      boss3鸳鸯锅9F8: [],
      boss3鸳鸯锅: [],
      boss3鸳鸯锅buff: undefined,
      boss3鸳鸯锅count: 0,
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
            'C61D',
            'BA11',
            'BA10', // 'BOSS月环 // '雷电赋格',
          ];
          const [a, b] = arr.sort((a, b) => {
            const indexA = sortArr.indexOf(a);
            const indexB = sortArr.indexOf(b);
            return indexA - indexB;
          });
          data.boss1吐息赋格.length = 0;
          // return output.text!({ g1: output[a]!(), g2: output[b]!() });
          return output[`${a}+${b}`]();
        }
      },
      outputStrings: {
        'BA0F+BA11': { en: '击退到后面' },
        'BA0F+BA10': { en: '击退到前面' },
        'C61D+BA11': { en: '远离+两侧' },
        'C61D+BA10': { en: '靠近+两侧' },
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
      netRegex: {
        id: [
          'C623',
          'C624',
          'BA03',
          'BA04', // 冰柱赋格 钢铁
        ],
      },
      preRun: (data, matches) => {
        data.boss1魔法阵展开赋格.push({ id: matches.id, x: parseFloat(matches.x) });
      },
      durationSeconds: (data) => data.boss1魔法阵展开赋格.length === 1 ? 4 : 10,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          'C623': { en: '靠近' },
          'C624': { en: '远离' },
          'BA03': { en: '靠近' },
          'BA04': { en: '远离' },
          'blue': { en: '找绿' },
          'green': { en: '找蓝' },
          'mic': { en: '${gimmick}${color}' },
          'text': { en: '${a} => ${b}' },
        };
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
      durationSeconds: (data) => data.boss1召唤Res.length === 0 ? 3 : 12,
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
          data.boss1召唤Res.push(target);
          if (data.boss1召唤Res.length === 2) {
            const a = data.boss1召唤Res[0];
            const b = data.boss1召唤Res[1];
            const map = ['NE', 'SE', 'SW', 'NW'];
            const aIndex = map.indexOf(a);
            const bIndex = map.indexOf(b);
            const clock = (bIndex - aIndex) === 1 || (bIndex - aIndex) === -3 ? true : false;
            const cIndex = (4 + bIndex + (clock ? 1 : -1)) % 4;
            const dIndex = (4 + cIndex + (clock ? 1 : -1)) % 4;
            const c = map[cIndex];
            const d = map[dIndex];
            data.boss1召唤Res2 = {
              text: output.text({
                a: output[a](),
                b: output[b](),
                c: output[c](),
                d: output[d](),
              }),
              level: 'alertText',
            };
          }
        }
      },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          'NE': { en: '右上' },
          'SE': { en: '右下' },
          'NW': { en: '左上' },
          'SW': { en: '左下' },
          'text': { en: '${a} -> ${b} -> ${c} -> ${d}' },
        };
        if (data.boss1召唤Res2) {
          const t = data.boss1召唤Res2.text;
          const l = data.boss1召唤Res2.level;
          data.boss1召唤Res2 = undefined;
          return { [l]: t };
        }
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
    // #region BOSS3
    {
      id: '超模之塔 BOSS3 核爆雨',
      type: 'StartsUsing',
      netRegex: { id: 'B97A', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '5连AoE' },
    },
    {
      id: '超模之塔 BOSS3 魔力注入',
      type: 'StartsUsing',
      netRegex: { id: 'B97E', capture: false },
      run: (data) => {
        data.boss3魔力注入 = {};
        data.boss3魔力注入中 = true;
        data.boss3魔力注入count++;
        data.boss3B981.length = 0;
        data.boss3魔力注入res = { '冰': '', '火': '', '雷': '' };
      },
    },
    {
      id: '超模之塔 BOSS3 Tether',
      type: 'Tether',
      netRegex: {
        id: [
          '0190',
          '0191',
          '0192',
          '0193', // 鸳鸯锅
        ],
      },
      run: (data, matches) => {
        data.boss3魔力注入[matches.sourceId] = {
          '0190': '火',
          '0191': '冰',
          '0192': '雷',
          '0193': '鸳鸯锅',
        }[matches.id];
      },
    },
    {
      id: '超模之塔 BOSS3 B981',
      type: 'AbilityExtra',
      netRegex: { id: ['B981'] },
      durationSeconds: 2,
      infoText: (data, matches, output) => {
        if (data.boss3魔力注入中 === false && data.boss3鸳鸯锅中 === false) {
          return;
        }
        data.boss3B981.push({
          id: matches.sourceId,
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          el: data.boss3魔力注入[matches.sourceId] ?? 'unknown',
        });
        // console.log(data.boss3B981.length);
        if (data.boss3魔力注入[matches.sourceId] === undefined) {
          console.error(`${matches.timestamp} 魔力注入属性获取出错,sourceId:${matches.sourceId}`);
        }
        if (data.boss3魔力注入[matches.sourceId] === '鸳鸯锅') {
          data.boss3鸳鸯锅.push({
            dir: Directions.xyTo8DirNum(
              parseFloat(matches.x),
              parseFloat(matches.y),
              center.boss3.x,
              center.boss3.y,
            ),
            id: matches.sourceId,
          });
        } else if (data.boss3B981.length % 2 === 0) {
          const last2 = data.boss3B981.slice(-2);
          const [e1, e2] = last2;
          const d1 = Directions.xyTo8DirNum(e1.x, e1.y, center.boss3.x, center.boss3.y);
          const d2 = Directions.xyTo8DirNum(e2.x, e2.y, center.boss3.x, center.boss3.y);
          if (e1.el === '火') {
            // 火：如果对称刷，则报2个另外的点。如果120度刷，找斜点那个，去水平镜像的对面（然后靠近A/C）半格
            const diff = Math.abs(d1 - d2);
            if (diff === 4) {
              const s1 = (d1 - 2 + 8) % 8;
              const s2 = (d2 - 2 + 8) % 8;
              const res = output.火或({ r1: output[`火${s1}`](), r2: output[`火${s2}`]() });
              data.boss3魔力注入res.火 = res;
              return output.火最终({ text: res });
            }
            const e = (d1 === 0 || d1 === 4) ? d2 : d1;
            const res = output[`火${e}`]();
            data.boss3魔力注入res.火 = res;
            return output.火最终({ text: res });
          } else if (e1.el === '冰') {
            // 1冰：找斜点那个，去对面（与小怪重合）
            // 2冰：找斜点那个，去对面（然后靠近B/D）半格
            const e = (d1 === 0 || d1 === 4) ? d2 : d1;
            const res = output[`${data.boss3魔力注入count >= 2 ? 2 : 1}冰${e}`]();
            data.boss3魔力注入res.冰 = res;
            return output.冰最终({ text: res });
          } else if (e1.el === '雷') {
            // 雷：如果AC有，去他的另一边 ，如果AC没有，去左右
            const ac = [d1, d2].find((d) => d === 0 || d === 4);
            if (ac !== undefined) {
              const s = (ac + 4 + 8) % 8;
              const r = Directions.outputFrom8DirNum(s);
              const res = output[`雷${r}`]();
              data.boss3魔力注入res.雷 = res;
              return output.雷最终({ text: res });
            }
            const res = output.雷左右();
            data.boss3魔力注入res.雷 = res;
            return output.雷最终({ text: res });
          }
        }
      },
      tts: null,
      outputStrings: {
        'unknown': { en: '??' },
        '火1': { en: 'A1之间' },
        '火3': { en: 'C4之间' },
        '火5': { en: 'C3之间' },
        '火7': { en: 'A2之间' },
        '1冰1': { en: '4点(头下)' },
        '1冰3': { en: '1点(头下)' },
        '1冰5': { en: '2点(头下)' },
        '1冰7': { en: '3点(头下)' },
        '2冰1': { en: 'D4之间' },
        '2冰3': { en: 'D1之间' },
        '2冰5': { en: 'B2之间' },
        '2冰7': { en: 'B3之间' },
        '火或': { en: '${r1}或${r2}' },
        '雷dirN': { en: 'A点(外一点)' },
        '雷dirS': { en: 'C点(外一点)' },
        '雷左右': { en: 'BD点(外一点)' },
        '冰最终': { en: '(稍后) 冰：${text}' },
        '火最终': { en: '(稍后) 火：${text}' },
        '雷最终': { en: '(稍后) 雷：${text}' },
      },
    },
    {
      // B982|魔具联动：爆炎
      // B983|魔具联动：冰封
      // B984|魔具联动：暴雷
      id: '超模之塔 BOSS3 魔具联动',
      type: 'StartsUsing',
      netRegex: { id: ['B982', 'B983', 'B984'] },
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        data.boss3魔力注入中 = false;
        if (data.boss3其墓须有三 === true) {
          return;
        }
        if (matches.id === 'B982') {
          const res = data.boss3魔力注入res.火;
          return output.火最终({ text: res });
        } else if (matches.id === 'B983') {
          const res = data.boss3魔力注入res.冰;
          return output.冰最终({ text: res });
        } else if (matches.id === 'B984') {
          const res = data.boss3魔力注入res.雷;
          return output.雷最终({ text: res });
        }
      },
      outputStrings: {
        '冰最终': { en: '冰：${text}' },
        '火最终': { en: '火：${text}' },
        '雷最终': { en: '雷：${text}' },
      },
    },
    {
      id: '超模之塔 BOSS3 黑暗奔流',
      type: 'StartsUsing',
      netRegex: { id: 'B98B' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '躲头+穿地水' },
      },
    },
    {
      id: '超模之塔 BOSS3 真空波',
      type: 'StartsUsing',
      netRegex: { id: 'B98E' },
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '去背后+躲头' },
      },
    },
    {
      id: '超模之塔 BOSS3 碎尸',
      type: 'StartsUsing',
      netRegex: { id: 'B991' },
      response: Responses.tankBuster(),
    },
    {
      id: '超模之塔 BOSS3 B992',
      type: 'StartsUsing',
      netRegex: { id: 'B992' },
      preRun: (data) => {
        data.boss3其墓须有三 = true;
        data.boss39F8.length = 0;
        data.boss3地水count = 0;
      },
      delaySeconds: 30,
      run: (data) => {
        data.boss3其墓须有三 = false;
        data.boss39F8.length = 0;
        data.boss3地水count = 0;
      },
    },
    {
      id: '超模之塔 BOSS3 你撒播啊',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          '1410',
          '1411', // 紫buff
        ],
      },
      condition: Conditions.targetIsYou(),
      durationSeconds: 5.9,
      infoText: (data, matches, output) => {
        // TODO: 可优化为直接报场地半场，不用玩家自己看小怪，但现在懒得写。
        data.boss3鸳鸯锅buff = matches.effectId === '1410' ? '蓝' : '紫';
        if (data.boss3鸳鸯锅9F8.length > 0) {
          data.boss3鸳鸯锅count++;
          const yyg = data.boss3鸳鸯锅9F8[data.boss3鸳鸯锅count];
          if (yyg === undefined) {
            // 最后一次，不用再战斗了
            return;
          }
          const { el, dir } = yyg;
          const g = [el.at(1), el.at(3)];
          const safe = g.findIndex((v) => v === data.boss3鸳鸯锅buff) === 0 ? '左' : '右';
          const d = Directions.outputFrom8DirNum(dir);
          return output.text({ dir: output[d](), lr: safe });
        }
      },
      outputStrings: {
        'text': { en: '看"${dir}"去${lr}' },
        'dirN': { en: 'A' },
        'dirNE': { en: '2' },
        'dirE': { en: 'Boy' },
        'dirSE': { en: '3' },
        'dirS': { en: 'C' },
        'dirSW': { en: '4' },
        'dirW': { en: 'Dog' },
        'dirNW': { en: '1' },
      },
    },
    // B9A2|古代冰封|
    // B9A1|古代爆炎|
    // B9A3|古代暴雷|
    {
      id: '超模之塔 BOSS3 古代计数',
      type: 'StartsUsing',
      netRegex: { id: ['B9A2', 'B9A1', 'B9A3'] },
      alertText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        'B9A2': { en: '斜点' },
        'B9A1': { en: '远离' },
        'B9A3': { en: '正点' },
      },
    },
    {
      id: '超模之塔 BOSS3 9F8',
      type: 'GainsEffect',
      netRegex: { effectId: '9F8', count: ['45A', '45B', '45C', '45D', '45E'] },
      condition: (data) => data.boss3其墓须有三 || data.boss3鸳鸯锅中,
      durationSeconds: (data) => {
        if (data.boss3其墓须有三) {
          return (data.boss39F8.length === 0 ? 2 : 18);
        }
        if (data.boss3鸳鸯锅中) {
          return 13.695;
        }
      },
      countdownSeconds: (data) => data.boss3鸳鸯锅中 ? 13.695 : 0,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          '雷': { en: '雷' },
          '冰': { en: '冰' },
          '火': { en: '火' },
          'text1': { en: '${a}：${g}' },
          'text3': { en: '${a1}${a2}${a3}(带地水)：${g1} -> ${g2} -> ${g3}' },
          '鸳鸯锅1': { en: '看"${dir}"去${lr}' },
          'dirN': { en: 'A' },
          'dirNE': { en: '2' },
          'dirE': { en: 'Boy' },
          'dirSE': { en: '3' },
          'dirS': { en: 'C' },
          'dirSW': { en: '4' },
          'dirW': { en: 'Dog' },
          'dirNW': { en: '1' },
        };
        if (data.boss3鸳鸯锅中 && ['45D', '45E'].includes(matches.count)) {
          const id = matches.targetId;
          const dir = data.boss3鸳鸯锅.find((v) => v.id === id).dir;
          const el = { '45D': '左蓝右紫', '45E': '左紫右蓝' }[matches.count];
          // console.log(matches.timestamp, id, dir, el);
          data.boss3鸳鸯锅9F8.push({ el, dir, id });
          if (data.boss3鸳鸯锅9F8.length === 1) {
            const yyg = [el.at(1), el.at(3)];
            // 这里不用反 因为小怪的面向已经是反的了 负负得正
            const safe = yyg.findIndex((v) => v === data.boss3鸳鸯锅buff) === 0 ? '左' : '右';
            const d = Directions.outputFrom8DirNum(dir);
            // console.log(data.me, data.boss3鸳鸯锅buff, yyg);
            return { infoText: output.鸳鸯锅1({ dir: output[d](), lr: safe }) };
          }
        }
        if (data.boss3其墓须有三 && ['45A', '45B', '45C'].includes(matches.count)) {
          data.boss39F8.push({ '45A': '火', '45B': '冰', '45C': '雷' }[matches.count]);
        }
        if (data.boss39F8.length === 1) {
          return {
            infoText: output.text1({
              a: output[data.boss39F8[0]](),
              g: data.boss3魔力注入res[data.boss39F8[0]],
            }),
          };
        }
        if (data.boss39F8.length === 3) {
          const a1 = output[data.boss39F8[0]]();
          const a2 = output[data.boss39F8[1]]();
          const a3 = output[data.boss39F8[2]]();
          const g1 = data.boss3魔力注入res[data.boss39F8[0]];
          const g2 = data.boss3魔力注入res[data.boss39F8[1]];
          const g3 = data.boss3魔力注入res[data.boss39F8[2]];
          return {
            alertText: output.text3({ a1, a2, a3, g1, g2, g3 }),
            tts: null,
          };
        }
      },
    },
    {
      id: '超模之塔 BOSS3 B995',
      type: 'StartsUsing',
      netRegex: { id: 'B995' },
      delaySeconds: 1,
      durationSeconds: 6,
      infoText: (data, _matches, output) => {
        data.boss3地水count++;
        if (data.boss3地水count === 3) {
          return output.text3();
        }
        const text = data
          .boss3魔力注入res[data.boss39F8[data.boss3地水count]];
        return output.text({ text });
      },
      outputStrings: {
        text: '穿 => ${text}',
        text3: '穿',
      },
    },
    {
      id: '超模之塔 BOSS3 多产的土壤',
      type: 'StartsUsing',
      netRegex: { id: 'B99A' },
      response: Responses.bigAoe(),
    },
    {
      id: '超模之塔 BOSS3 B99A',
      type: 'StartsUsing',
      netRegex: { id: 'B99A' },
      preRun: (data) => {
        data.boss3鸳鸯锅中 = true;
      },
      delaySeconds: 60,
      run: (data) => {
        data.boss3鸳鸯锅中 = false;
        data.boss3鸳鸯锅buff = undefined;
      },
    },
    // #endregion
  ],
});
