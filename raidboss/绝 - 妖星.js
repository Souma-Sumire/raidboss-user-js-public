// Build Time: 2026-07-08T00:55:30.667Z
console.log('绝妖星已加载，开发成本原因，默认报的标点为1A2，其他标点需自己改。');
const phases = {
  'BAB9': 'p1-3',
  'C24C': 'p2',
  'C3F7': 'p3',
  'C2DC': 'p4',
  'BB40': 'p5', // 连续究极
};
const centerX = 100;
const centerY = 100;
const rpSortArr = ['MT', 'ST', 'H1', 'H2', 'D1', 'D2', 'D3', 'D4'];
const dmuMark = (actorDecID, markType, localOnly = false) => {
  if (/raidemulator\.html/.test(location.href)) {
    console.debug(`尝试标记${markType}给${actorDecID}(${actorDecID.toString(16).toUpperCase()})`);
    return;
  }
  void callOverlayHandler({
    call: 'PostNamazu',
    c: 'mark',
    p: JSON.stringify({ ActorID: actorDecID, MarkType: markType, LocalOnly: localOnly }),
  });
};
const p2OutputStirngs = {
  第1轮fallback: '${gimmick}组+${buff}',
  第1轮我分摊搭档扇形: '左踩塔（分摊）',
  第1轮我分摊搭档钢铁: '右踩塔（分摊）',
  第1轮我扇形搭档分摊: '左踩塔（扇形）',
  第1轮我钢铁搭档分摊: '右踩塔（钢铁）',
  第1轮我扇形搭档扇形: '左闲人引导（扇形）',
  第1轮我钢铁搭档钢铁: '右闲人引导（钢铁）',
  第2到8轮踩塔单: '${i}轮 (单${gimmick}) 踩塔',
  第2到8轮踩塔双: '${i}轮 (双${gimmick}) 踩塔',
  第2到8轮引导: '${i}轮 塔外引导',
  第2到8轮超级跳: '${i}轮 闲人 去超级跳',
  第2到8轮踩塔分摊: '${i}轮 分摊 踩塔',
  分摊: '分摊',
  钢铁: '钢铁',
  扇形: '扇形',
  打法1234: '5轮 闲人 中间挂机',
  打法1238: '8轮 闲人 去超级跳',
  打法1458: '8轮 闲人 去超级跳',
};
const getP2 = (data, _matches, output) => {
  let me;
  for (let i = 0; i <= data.p2count; i++) {
    if (me === undefined) {
      me = data.p2hm[data.p2count - i - 1]?.find((v) => v.target === data.me);
    }
    if (me) {
      break;
    }
  }
  const towerCount = data.p2count;
  const groupA = data.p2第一轮踩塔人.includes(data.me);
  const ab = data.triggerSetConfig.p2一运打法.split('');
  const goTower = (groupA && ab.includes(towerCount.toString())) ||
    (!groupA && !ab.includes(towerCount.toString()));
  const doubleTurn = {
    '1234': [2, 4, 5, 6],
    '1238': [2, 4, 6, 8],
    '1458': [2, 4, 6, 8],
  };
  const isDoubleTurn = doubleTurn[data.triggerSetConfig.p2一运打法].includes(towerCount);
  if (me === undefined) {
    console.error(data.me, ' is undefined', data.p2hm);
    return 'Error';
  }
  data.p2报过了 = true;
  if (data.p2count === 1) {
    if (Util?.souma?.getRpByName !== undefined) {
      const myRp = Util.souma.getRpByName(data, data.me);
      const partnerMap = data.triggerSetConfig.p2分组 === 'MTH1'
        ? {
          'MT': 'H1',
          'H1': 'MT',
          'ST': 'H2',
          'H2': 'ST',
          'D1': 'D3',
          'D3': 'D1',
          'D2': 'D4',
          'D4': 'D2',
        }
        : {
          'MT': 'ST',
          'ST': 'MT',
          'H1': 'H2',
          'H2': 'H1',
          'D1': 'D2',
          'D2': 'D1',
          'D3': 'D4',
          'D4': 'D3',
        };
      const partner = data.p2hm[0].find((v) => v.rp === partnerMap[myRp]);
      return output[`第1轮我${me.buff}搭档${partner.buff}`]();
    }
    const roleGimmick = data.p2hm[0].find((v) => v.buff !== '分摊' && v.role === data.role);
    return output.第1轮fallback({ gimmick: roleGimmick.buff, buff: me.buff });
  }
  if (data.p2BuffCount[data.me] === 0) {
    if (ab.join('') === '1234' && data.p2count === 5) {
      return output.打法1234();
    }
    if (ab.join('') === '1238' && data.p2count === 8) {
      return output.打法1238();
    }
    if (ab.join('') === '1458' && data.p2count === 8) {
      return output.打法1458();
    }
  }
  const spjp = ['2', '4', '6', '8'];
  const goSpjp = spjp.includes(towerCount.toString());
  // 2-8轮
  if (goTower) {
    // 踩塔，每一轮
    if (me.buff === '分摊') {
      const otherStack = data.p2hm[towerCount - 1].find((v) =>
        v.buff === '分摊' && v.target !== data.me
      );
      return output.第2到8轮踩塔分摊({ i: towerCount, player: otherStack.target });
    }
    return output[`第2到8轮踩塔${isDoubleTurn ? '双' : '单'}`]({
      i: towerCount,
      gimmick: output[me.buff](),
    });
  }
  if (!goSpjp) {
    // 不踩塔，奇数轮，引导
    return output.第2到8轮引导({ i: towerCount, gimmick: output[me.buff]() });
  }
  // 不踩塔，偶数轮，超级跳
  return output.第2到8轮超级跳({ i: towerCount });
};
const headMarkerData = {
  'tankbuster': '00DA',
  'spread': '007F',
  'stack': '0080',
  '假火': '02A1',
  '真火': '02A2',
  '假冰': '02A3',
  '真冰': '02A4',
  '假雷': '02A5',
  '真雷': '02A6',
  '分摊': '02CB',
  '钢铁': '02CC',
  '扇形': '02CD',
};
const arrowBuffs = {
  '13D7': '上',
  '13D8': '下',
  '13D9': '右',
  '13DA': '左',
  '130C': '上',
  '130D': '下',
  '130E': '右',
  '130F': '左',
};
const p3buff = {
  '640': { name: '混沌之炎' },
  '641': { name: '混沌之水' },
  '642': { name: '混沌之风' },
  '643': { name: '混沌之逆风' },
};
const p3mj = {
  '0150': 1,
  '0151': 2,
  '0152': 3,
  '0153': 4,
  '01B5': 5,
  '01B6': 6,
  '01B7': 7,
  '01B8': 8,
};
const p3tar = {
  'BBC': 1,
  'BBD': 2,
  'BBE': 3,
};
const p4buff = {
  '15A8': { name: '叉形闪电', true: '雷分散', false: '水分摊', source: '新生艾克斯迪司' },
  '15A9': { name: '水属性压缩', true: '水分摊', false: '雷分散', source: '新生艾克斯迪司' },
  '15A7': { name: '诅咒之嚎', true: '背对眼', false: '面对眼', source: '新生艾克斯迪司' },
  '15AA': { name: '加速度炸弹', true: '停手', false: '移动', source: '新生艾克斯迪司' },
  '15AB': { name: '混沌之炎', true: '钢铁', false: '月环', source: '卡奥斯' },
  '15AC': { name: '混沌之水', true: '月环', false: '钢铁', source: '卡奥斯' },
  '1558': { name: '超越死亡', true: '死超', false: '亚拉戈', source: '新生艾克斯迪司' },
  '566': { name: '超越死亡', true: '死超', false: '亚拉戈', source: '新生艾克斯迪司' },
  '1C6': { name: '亚拉戈领域', true: '亚拉戈', false: '死超', source: '新生艾克斯迪司' },
  '1317': { name: '生者之伤', true: '吃蓝', false: '吃紫', source: '新生艾克斯迪司' },
  '15A5': { name: '生者之伤', true: '吃蓝', false: '吃紫', source: '新生艾克斯迪司' },
  '1318': { name: '死者之伤', true: '吃紫', false: '吃蓝', source: '新生艾克斯迪司' },
  '15A6': { name: '死者之伤', true: '吃紫', false: '吃蓝', source: '新生艾克斯迪司' },
};
// const p3line = [
//   [
//     ['attack1', null, null],
//     ['attack1', 'attack2', null],
//   ],
//   [
//     ['attack1', 'attack2', 'attack3'],
//     ['bind1', 'attack2', 'attack3'],
//     ['bind1', 'bind2', 'attack3'],
//   ],
//   [
//     ['bind1', 'bind2', 'bind3'],
//     ['stop1', 'bind2', 'bind3'],
//     ['stop1', 'stop2', 'bind3'],
//   ],
//   [
//     ['stop1', 'stop2', null],
//     ['stop2', null, null],
//   ],
// ];
// 你听说过古法编程吗
const p3timeline = [
  // { time: 0, text: '黑洞开始' },
  { id: 'step1', time: 3326, text: '回中间，攻击1接', duration: 4640 },
  { id: 'step2', time: 7966, text: '攻击2准备', duration: 2582 },
  { id: 'step3', time: 10548, text: '攻击2接 => 准备暴雷', duration: 8452 },
  { id: 'step4', time: 19000, text: '准备半场+耳光', duration: 10000 },
  { id: 'step5', time: 29000, text: '攻击准备', duration: 4745 },
  { id: 'step6', time: 33745, text: '攻击接', duration: 5255 },
  { id: 'step7', time: 39000, text: '锁链1准备', duration: 2662 },
  { id: 'step8', time: 41662, text: '锁链1替攻击1', duration: 2338 },
  // 攻击1结束：41662
  { id: 'step9', time: 44000, text: '锁链2准备', duration: 3000 },
  { id: 'step10', time: 47000, text: '锁链2替攻击2 => 准备半场+两侧+暴雷', duration: 17000 },
  // 攻击击2结束：47000
  { id: 'step11', time: 64000, text: '锁链准备', duration: 4762 },
  { id: 'step12', time: 68762, text: '锁链接', duration: 3238 },
  { id: 'step13', time: 72000, text: '禁止1准备', duration: 3000 },
  { id: 'step14', time: 75000, text: '禁止1替锁链1', duration: 4000 },
  { id: 'step15', time: 79000, text: '禁止2准备', duration: 2000 },
  { id: 'step16', time: 81000, text: '禁止2替锁链2', duration: 8000 },
  { id: 'step17', time: 83000, text: '准备白洞+经纬+耳光', duration: 16500 },
  // 固定队改
  { id: 'step18', time: 99500, text: '禁止2准备', duration: 2500 },
  { id: 'step19', time: 102000, text: '禁止2接两根', duration: 7000 },
  { id: 'step20', time: 109000, text: '禁止1接', duration: 6000 },
  // { time: 99500, text: '“禁止1,2”准备', duration: 2500 },
  // { time: 102000, text: '“禁止1,2”接', duration: 7000 },
  // { time: 109000, text: “禁止2接', duration: 6000 },
];
const p5water = {
  '82.292|89.372|0.785': ['A', 'B'],
  '110.582|82.292|-0.785': ['B', 'C'],
  '75.242|96.452|0.785': ['C', 'D'],
  '103.532|75.242|-0.785': ['D', 'A'],
};
const p5buff = {
  'B56': '火',
  'BB6': '雷',
  'B57': '冰',
};
Options.Triggers.push({
  id: 'DancingMadUltimate',
  zoneId: 1363,
  config: [
    {
      id: 'p1击退加真假火冰打法',
      name: {
        en: 'p1击退加真假火冰打法',
      },
      type: 'select',
      options: {
        en: {
          '正攻（被击退的去下半场）': '正攻',
          '职能固定（不推荐！）未测试': 'TN左DPS右',
        },
      },
      default: '正攻',
    },
    {
      id: 'p2一运打法',
      name: {
        en: 'p2打法',
      },
      type: 'select',
      options: {
        en: {
          '1238': '1238',
          '1234（TLB）': '1234',
          '1458 未测试': '1458',
        },
      },
      default: '1238',
    },
    {
      id: 'p2分组',
      name: {
        en: 'p2分组',
      },
      type: 'select',
      options: {
        en: {
          'MT/H1 ST/H2 D1/D3 D2/D4': 'MTH1',
          'MT/ST H1/H2 D1/D2 D3/D4': 'MTST',
        },
      },
      default: 'MTH1',
    },
    {
      id: 'p3麻将发宏',
      name: { en: '开启P3麻将发小队宏' },
      type: 'checkbox',
      default: false,
      comment: { en: '需要插件“鲶鱼精邮差”' },
    },
    {
      id: 'p3混沌之土标记',
      name: { en: '开启P3混沌之土标记' },
      type: 'checkbox',
      default: false,
      comment: { en: '需要插件“鲶鱼精邮差”' },
    },
    {
      id: 'p3混沌之土标记方法',
      name: { en: '开启P3混沌之土标记方法' },
      type: 'select',
      options: {
        en: {
          '美式（推荐）非泥D/H必是1，双T必是2，泥必是3': '美式',
          '自定义': '自定义',
        },
      },
      default: '美式',
    },
    {
      id: 'p3混沌之土标记美式优先级',
      comment: {
        en: '仅在“美式”方法下生效，此处的D与H必定为“非泥”，mud为“混沌之泥土”。只接受小写"dps"、"healer"、"tank"、"mud"，并用半角“大于号”隔开。',
      },
      name: { en: 'P3混沌之土美式优先级' },
      type: 'string',
      default: 'dps>healer>tank>mud',
    },
    {
      id: 'p3混沌之土标记自定义优先级',
      comment: {
        en:
          '仅在“自定义”方法下生效，此优先级不考虑混沌之泥土debuff。只接受大写"D1"、"D2"、"D3"、"D4"、"H1"、"H2"、"ST"、"MT"，并用半角“大于号”隔开。必须联动职能分配悬浮窗，若未发现职能则自动降级至美式标记。',
      },
      name: { en: 'P3混沌之土自定义优先级' },
      type: 'string',
      default: 'MT>ST>H1>H2>D1>D2>D3>D4',
    },
    {
      id: 'p3打铁警察',
      name: { en: '开启P3简易打铁警察' },
      type: 'checkbox',
      default: false,
      comment: {
        en:
          '需要插件“鲶鱼精邮差”，只能简单监控，更完整的体验请前往<a href="https://souma.diemoe.net/ff14-overlay-vue/#/dmuBlacksmithPolice">网页分析版</a>',
      },
    },
    {
      id: 'p3打铁聊天频道',
      name: {
        en: '打铁发送到聊天频道',
      },
      type: 'string',
      default: 'e',
    },
    {
      id: 'p3打铁监控范围',
      name: {
        en: '打铁监控范围',
      },
      type: 'select',
      options: {
        en: {
          '仅自己': 'me',
          '所有人': 'all',
        },
      },
      default: 'all',
    },
  ],
  overrideTimelineFile: true,
  timeline: `
hideall "--Reset--"
hideall "--sync--"
hideall "准备魔击x2"
hideall "准备魔击x3"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
# P1
15.2 "恶狠狠毁荡 x2"
37.9 "呼啦啦爆炎"
42.1 "波动炮"
45.9 "爆炸"
49.4 "连环环陷阱"
62.4 "制裁之光"
65.6 "超驱动 x3"
87.2 "重力弹"
91.2 "岩石弹"
97.1 "恶狠狠毁荡 x2"
105.7 "重力弹"
109.7 "岩石弹"
118 "连环环陷阱"
120.7 "强重力"
132.2 "制裁之光"
135.4 "超驱动 x3"
159.3 "唰啦啦传送 x2"
167.7 "连环环陷阱"
173.3 "睡魔/圣母的神气"
186.4 "圣母颂"
187 "呼啦啦爆炎"
# P2
220.1 "终末双腕"
235.3 "遗弃末世"
248.5 "塔#1"
258.6 "塔#2"
269.6 "塔#3"
279.7 "塔#4"
290.6 "塔#5"
300.7 "塔#6"
311.6 "塔#7"
321.7 "塔#8"
342.1 "制裁之光"
370.7 "破坏之翼"
377.8 "终末双腕"
# P3
450.5 "深层痛楚"
469.6 "混沌之炎/水"
479.1 "暴雷 x2"
497.6 "海啸/烈焰"
507.9 "究极冲击波 x3"
512.1 "本影爆碎"
513.9 "究极冲击波 x3"
519 "龙卷风"
519.9 "究极冲击波 x4"
537.6 "暴雷 x2"
554.8 "暴雷 x2"
567.4 "地震 x2"
578.6 "重冲击"
585.9 "黑洞（攻1）"
593 "黑洞（攻12）"
596.3 "暴雷 x2"
609 "冲击波"
616.5 "黑洞（攻123）"
618.1 "攻1死超"
621.5 "黑洞（锁1攻23）"
623.2 "攻2死超"
626.7 "黑洞（锁12攻3）"
628.3 "攻3死超"
637.6 "暴雷"
640.6 "暴雷"
650.8 "黑洞（锁123）"
652.5 "锁1死超"
655.9 "黑洞（禁1锁23）"
657.5 "锁2死超"
660.9 "黑洞（锁12锁3）"
662.5 "锁3死超"
672 "白洞"
677.1 "重冲击"
684.3 "黑洞（禁2）"
685.9 "禁2死超"
691.3 "黑洞（禁1）"
692.9 "禁1死超"
705.8 "轰击"
706.1 "轰隆隆跺脚"
707.5 "轰隆隆跺脚"
708.7 "轰隆隆跺脚"
710 "轰隆隆跺脚"
711.4 "轰击"
# P4
741.4 "闹哄哄魂击" Ability { id: "C2DC" } window 60,60
755.5 "大十字#1"
760.7 "烈焰/海啸"
770.5 "大十字#2"
775.6 "海啸/烈焰"
785.5 "大十字#3"
798.1 "鸳鸯锅"
801.9 "死亡波涛"
806.6 "水雷1"
815.7 "石化眼1"
824.6 "扑腾腾究极"
831.6 "水雷2"
839.6 "石化眼2"
863.6 "扑腾腾究极"
# P5
902.8 "连续究极 x4" StartsUsing { id: "BB40" } window 20,20
905.7 "准备魔击x3"
907.7 "魔击 x3"
920.3 "混沌洪水 x4"
933.3 "癫狂交响曲"
936.5 "混沌核爆/神圣"
940 "核爆扩散/混沌神圣"
942.2 "准备魔击x2"
944.6 "魔击 x2"
963.3 "三星"
969.3 "三星"
975.4 "三星"
984.8 "连续究极 x4"
987.3 "准备魔击x2"
989.7 "魔击 x2"
1016.3 "混沌涡旋"
1025.4 "癫狂交响曲"
1028.6 "混沌核爆/神圣"
1032.1 "核爆扩散/混沌神圣"
1034.7 "准备魔击x3"
1036.7 "魔击 x3"
1054.3 "遗弃末世"
1059.4 "遗弃末狱"
1062.5 "遗弃末世"
1067.5 "遗弃末狱"
1070.6 "遗弃末世"
1075.7 "遗弃末狱"
1078.7 "遗弃末世"
1083.8 "遗弃末狱"
1118.0 "狂暴"
`,
  initData: () => {
    return {
      phase: 'p1-1a',
      假冰: false,
      假火: false,
      假雷: false,
      p1Tethers: [],
      p1毒: [],
      p1Cannon: [],
      combatantData: [],
      p1放石头: false,
      p1Arrow: [],
      p1石头count: 1,
      p3究极冲击波hdg: [],
      p1收集: [],
      eyeTowerIds: [],
      fakeEyeTowerIds: [],
      p2未来过去count: 0,
      purpleTowerIds: [],
      yellowTowerIds: [],
      p2hm: {},
      p2count: 1,
      p2第一轮踩塔人: [],
      p2BuffCount: {},
      p2报过了: false,
      p3buffs: {},
      p3jjcjb: undefined,
      p3混沌之泥土: [],
      p3第N目标: [],
      p4真假: { '新生艾克斯迪司': [], '卡奥斯': [] },
      p4count: { '新生艾克斯迪司': 0, '卡奥斯': 0 },
      p4CastCount: 0,
      p4buffs: {},
      p4ReportedTimes: [],
      p1IsTether: false,
      p4魔法储存: undefined,
      p4魔法放出暂存: undefined,
      p5洪水: [],
      p5buff: [],
      p5三星塔: [],
      p5三星count: 0,
      p5三星buff: [],
      p5三星是闲人: false,
      p5Tower: { 右上: [], 下: [], 左上: [] },
      p5三星亮起来: [],
      p5魔击count: 0,
      p5神圣: [],
      p5软狂暴count: 0,
    };
  },
  timelineTriggers: [
    {
      id: 'DMU P5 魔击',
      regex: /^准备魔击x(?<count>2|3)$/,
      beforeSeconds: 0.01,
      durationSeconds: 3,
      alertText: (_data, matches, output) => output.text({ count: matches.count }),
      outputStrings: { text: { en: '准备平A (${count}次)' } },
    },
    {
      id: 'DMU P5 癫狂交响曲',
      regex: /^癫狂交响曲$/,
      beforeSeconds: 5,
      durationSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '癫狂八方' } },
    },
  ],
  triggers: [
    {
      id: 'DMU Phase Tracker',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(phases) },
      run: (data, matches) => {
        data.phase = phases[matches.id] ?? 'unknown';
        if (data.phase === 'p5') {
          data.假冰 = false;
          data.假火 = false;
          data.假雷 = false;
          data.p1Tethers = [];
          data.p1毒 = [];
          data.p1Cannon = [];
          data.combatantData = [];
          data.p1放石头 = false;
          data.p1Arrow = [];
          data.p1石头count = 1;
          data.p3究极冲击波hdg = [];
          data.p3混沌之泥土 = [];
          data.p1收集 = [];
          data.eyeTowerIds = [];
          data.fakeEyeTowerIds = [];
          data.p2未来过去count = 0;
          data.purpleTowerIds = [];
          data.yellowTowerIds = [];
          data.p2hm = {};
          data.p2count = 1;
          data.p2第一轮踩塔人 = [];
          data.p2BuffCount = {};
          data.p2报过了 = false;
          data.p3buffs = {};
          data.p3jjcjb = undefined;
          data.p4真假 = { '新生艾克斯迪司': [], '卡奥斯': [] };
          data.p4count = { '新生艾克斯迪司': 0, '卡奥斯': 0 };
          data.p4CastCount = 0;
          data.p4buffs = {};
          data.p4ReportedTimes = [];
          data.p1IsTether = false;
          data.p4魔法储存 = undefined;
          data.p4魔法放出暂存 = undefined;
          data.p5洪水 = [];
        }
      },
    },
    {
      id: 'DMU Phase P1 Tracker',
      type: 'StartsUsing',
      netRegex: { id: 'BCF2' },
      run: (data) => {
        if (data.phase === 'p1-1a') {
          return;
        } else if (data.phase === 'p1-1b') {
          data.phase = 'p1-2';
        } else if (data.phase === 'p1-2') {
          data.phase = 'p1-3';
        }
      },
    },
    {
      id: 'DMU P1 Graven Image Collect',
      // Tower entity actions
      // The CombatantMemory Add lines are added prior to combat
      // OverlayPlugin can retrieve the matching BNpcID
      // However, these entities seem to always spawn in the same order and the
      // first tower is the highest ID and the towers are in sequential order
      // These are the BNpcID values:
      // 1EBFBB (2015163) => Wave Cannon entity (blue)
      // 1EBFBC (2015164) => Gravitational Wave entity (purple)
      // 1EBFBD (2015165) => Intemperate Will entity (yellow)
      // 1EBFBE (2015166) => Indolent Will entity (eye)
      // 1EBFBF (2015167) => Ave Maria entity (fake eye)
      // There are two of each, they are added at start of fight
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      preRun: (data, matches) => {
        const id = parseInt(matches.id, 16);
        // const blueTowers = [id, id - 1]; // First tower is blue and highest ID
        const purpleTowers = [id - 2, id - 4]; // Next are in pair with yellow
        const yellowTowers = [id - 3, id - 5];
        const eyeTowers = [id - 7, id - 9]; // Next are in paire with fake
        const fakeEyeTowers = [id - 6, id - 8];
        const toStringId = (id) => {
          return id.toString(16).toUpperCase();
        };
        // data.blueTowerIds = blueTowers.map((id) => toStringId(id));
        data.purpleTowerIds = purpleTowers.map((id) => toStringId(id));
        data.yellowTowerIds = yellowTowers.map((id) => toStringId(id));
        data.eyeTowerIds = eyeTowers.map((id) => toStringId(id));
        data.fakeEyeTowerIds = fakeEyeTowers.map((id) => toStringId(id));
      },
      suppressSeconds: 99999,
    },
    {
      id: 'DMU P1 恶狠狠毁荡',
      type: 'StartsUsing',
      netRegex: { id: 'C403' },
      response: Responses.tankBuster(),
    },
    {
      id: 'DMU P1 tether',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-1a',
      preRun: (data, matches) => {
        data.p1Tethers.push(matches.target);
      },
      delaySeconds: 0.5,
      durationSeconds: 6,
      infoText: (data, _matches, output) => {
        if (data.p1Tethers.length !== 0) {
          if (data.p1Tethers.includes(data.me)) {
            data.p1Tethers = [];
            data.p1IsTether = true;
            return output.tetherOnYou();
          }
          data.p1Tethers = [];
          data.p1IsTether = false;
          return output.idle();
        }
      },
      outputStrings: {
        tetherOnYou: { en: '击退' },
        idle: { en: '无' },
      },
    },
    {
      id: 'DMU 真假',
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.假冰,
          headMarkerData.真冰,
          headMarkerData.假火,
          headMarkerData.真火,
          headMarkerData.假雷,
          headMarkerData.真雷,
        ],
        capture: true,
      },
      preRun: (data, matches) => {
        if (matches.id === headMarkerData.假冰) {
          if (data.phase === 'p4' && data.p4魔法储存 !== undefined && data.p4魔法储存.假冰 === undefined) {
            data.p4魔法储存.假冰 = true;
          }
          data.假冰 = true;
        } else if (matches.id === headMarkerData.真冰) {
          if (data.phase === 'p4' && data.p4魔法储存 !== undefined && data.p4魔法储存.假冰 === undefined) {
            data.p4魔法储存.假冰 = false;
          }
          data.假冰 = false;
        } else if (matches.id === headMarkerData.假火) {
          data.假火 = true;
        } else if (matches.id === headMarkerData.真火) {
          data.假火 = false;
        } else if (matches.id === headMarkerData.假雷) {
          if (data.phase === 'p4' && data.p4魔法储存 !== undefined && data.p4魔法储存.假雷 === undefined) {
            data.p4魔法储存.假雷 = true;
          }
          data.假雷 = true;
        } else if (matches.id === headMarkerData.真雷) {
          if (data.phase === 'p4' && data.p4魔法储存 !== undefined && data.p4魔法储存.假雷 === undefined) {
            data.p4魔法储存.假雷 = false;
          }
          data.假雷 = false;
        }
      },
      delaySeconds: 5,
      run: (data) => {
        data.假冰 = false;
        data.假火 = false;
      },
    },
    {
      id: 'DMU 连环环陷阱',
      type: 'GainsEffect',
      netRegex: { effectId: '13D6' },
      preRun: (data, matches) => {
        data.p1毒.push(matches.target);
      },
    },
    {
      id: 'DMU 连环环陷阱L',
      type: 'LosesEffect',
      netRegex: { effectId: '13D6' },
      preRun: (data, matches) => {
        data.p1毒 = data.p1毒.filter((name) => name !== matches.target);
      },
    },
    {
      id: 'DMU 连环环陷阱预兆',
      type: 'GainsEffect',
      netRegex: { effectId: '13D6' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
      suppressSeconds: 1,
      countdownSeconds: 3.5,
      response: (data, _matches, output) => {
        if (data.phase === 'p1-1a') {
          data.phase = 'p1-1b';
        }
        if (data.p1毒.includes(data.me))
          return { alarmText: output.text() };
        return { alertText: output.idle() };
      },
      outputStrings: {
        text: { en: '传毒（出去）' },
        idle: { en: '吃毒' },
      },
    },
    {
      id: 'DMU 头标',
      type: 'HeadMarker',
      netRegex: { id: [headMarkerData.stack, headMarkerData.spread] },
      delaySeconds: (data) => data.phase === 'p1-1a' ? (data.p1IsTether ? 1.3 : 0.5) : 0.5,
      durationSeconds: 6,
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        if (data.phase === 'p1-3') {
          if (
            (!data.假火 && matches.id === headMarkerData.stack) ||
            (data.假火 && matches.id === headMarkerData.spread)
          )
            return output[`${data.假雷 ? '假雷' : '真雷'}分摊`]();
          return output[`${data.假雷 ? '假雷' : '真雷'}分散`]();
        }
        if (
          (!data.假火 && matches.id === headMarkerData.stack) ||
          (data.假火 && matches.id === headMarkerData.spread)
        )
          return output.stack();
        return output.spread();
      },
      outputStrings: {
        stack: { en: '分摊' },
        spread: { en: '散开散开！' },
        假雷分摊: { en: '危险区+分摊' },
        真雷分摊: { en: '安全区+分摊' },
        假雷分散: { en: '危险区+散开' },
        真雷分散: { en: '安全区+散开' },
      },
    },
    {
      id: 'DMU P1 真假雷',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BA98', 'BA9E'] },
      condition: (data) => data.phase === 'p1-1a',
      durationSeconds: 6,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const dirNum = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const rr = [1, 7, 3, 5];
        const [n1, n2] = ([(dirNum + 2) % 8, (dirNum + 4 + 2) % 8].sort((a, b) => {
          return rr.indexOf(a) - rr.indexOf(b);
        }));
        if (data.triggerSetConfig.p1击退加真假火冰打法 === 'TN左DPS右') {
          const role = data.role === 'dps' ? 'dps' : 'th';
          const n = (role === 'dps' ? [1, 3] : [5, 7]).includes(n1) ? n1 : n2;
          const nn = {
            3: 1,
            5: 7,
            1: 1,
            7: 7,
          }[n];
          const dir = output[`职能固定${Directions.outputFrom8DirNum(nn)}`]();
          return data.p1IsTether ? output.职能固定击退({ dir }) : dir;
        }
        if (data.triggerSetConfig.p1击退加真假火冰打法 === '正攻') {
          const n = (data.p1IsTether ? [3, 5] : [1, 7]).includes(n1) ? n1 : n2;
          const nn = {
            3: 1,
            5: 7,
            1: 1,
            7: 7,
          }[n];
          return output[`${'正攻'}${Directions.outputFrom8DirNum(nn)}${nn !== n ? '击退' : ''}`]();
        }
      },
      outputStrings: {
        text: { en: '${dir1}${dir2}' },
        dirNE: { en: '二' },
        dirSE: { en: '三' },
        dirSW: { en: '四' },
        dirNW: { en: '一' },
        正攻dirNE: { en: '右上' },
        正攻dirNE击退: { en: '右上击退' },
        正攻dirSE: { en: '右下' },
        正攻dirSW: { en: '左下' },
        正攻dirNW: { en: '左上' },
        正攻dirNW击退: { en: '左上击退' },
        职能固定dirNE: { en: '右上' },
        职能固定dirSE: { en: '右下' },
        职能固定dirSW: { en: '左下' },
        职能固定dirNW: { en: '左上' },
        职能固定击退: { en: '击退到${dir}' },
      },
    },
    {
      id: 'DMU P1 真假雷冰',
      type: 'StartsUsing',
      netRegex: { id: 'BA94' },
      condition: (data) => data.phase === 'p1-1b',
      delaySeconds: 0.25,
      infoText: (data, _matches, output) => {
        return output[`${data.假冰 ? '假' : '真'}冰${data.假雷 ? '假' : '真'}雷`]();
      },
      outputStrings: {
        '真冰真雷': { en: '都躲开' },
        '真冰假雷': { en: '吃直条' },
        '假冰真雷': { en: '吃扇形' },
        '假冰假雷': { en: '都吃' },
      },
    },
    {
      id: 'DMU 制裁之光',
      type: 'StartsUsing',
      netRegex: { id: 'C622' },
      response: (data) => {
        if (data.role === 'tank' || data.role === 'healer') {
          return { alertText: '大AoE伤害！ => 死刑x3' };
        }
        return { infoText: '大AoE伤害！' };
      },
    },
    {
      id: 'DMU P1 Wave Cannon',
      type: 'Ability',
      netRegex: { id: 'BAA8' },
      condition: (data) => data.phase === 'p1-1a',
      preRun: (data, matches) => {
        if (matches.type === '21') {
          data.p1Cannon.push(matches.target);
        }
        if (matches.type === '22' && (+matches.targetCount === (+matches.targetIndex + 1))) {
          data.p1Cannon.push(matches.target);
        }
      },
      response: (data, _matches, output) => {
        if (data.p1Cannon.length === 4) {
          if (data.p1Cannon.includes(data.me)) {
            data.p1Cannon = [];
            return { infoText: output.avoid() };
          }
          data.p1Cannon = [];
          return { alertText: output.tower() };
        }
      },
      outputStrings: {
        avoid: { en: '躲开' },
        tower: { en: '踩塔' },
      },
    },
    {
      id: 'DMU P1 神像2 连线',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data, matches) => data.phase === 'p1-2' && matches.target === data.me,
      durationSeconds: 7,
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;
      },
      response: (data, _matches, output) => {
        const x = data.combatantData[0].PosX;
        if (x < 110) {
          data.p1放石头 = false;
          // 放黑洞
          return {
            infoText: output.placeBlackHole(),
          };
        }
        // 放石头
        data.p1放石头 = true;
        return { alertText: output.placeRock() };
      },
      outputStrings: {
        placeBlackHole: { en: '黑洞' },
        placeRock: { en: '石头' },
      },
    },
    {
      id: 'DMU P1 神像2 连线++',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data, matches) => data.phase === 'p1-2' && matches.target === data.me,
      delaySeconds: 2,
      durationSeconds: 4,
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        return data.假冰 ? output.假冰() : output.真冰();
      },
      outputStrings: {
        假冰: { en: '吃扇形' },
        真冰: { en: '不吃' },
      },
    },
    {
      id: 'DMU P1 神像2 连线~',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-2',
      delaySeconds: (data) => data.p1石头count === 1 ? 6 : 8.5,
      response: (data, matches, output) => {
        if (matches.target === data.me) {
          data.p1石头count++;
          return data.p1放石头 ? { alarmText: output.placeRock() } : { infoText: output.mid() };
        }
      },
      outputStrings: {
        placeRock: { en: '出去放石头' },
        mid: { en: '中间' },
      },
    },
    {
      id: 'DMU P1 神像3',
      type: 'GainsEffect',
      netRegex: { 'effectId': Object.keys(arrowBuffs) },
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        data.p1Arrow.push({
          a: arrowBuffs[matches.effectId],
          s: parseFloat(matches.duration),
        });
        if (data.p1Arrow.length === 2) {
          // const r = ['左', '右', '上', '下'];
          const a = data.p1Arrow.sort((a, b) => a.s - b.s);
          return output.text({
            a1: output[a[0].a](),
            a2: output[a[1].a](),
          });
        }
      },
      outputStrings: {
        'text': '${a1} + ${a2}',
        '上': '上',
        '下': '下',
        '左': '左',
        '右': '右',
      },
    },
    {
      id: 'DMU P1 神像3 连线收集',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-3',
      preRun: (data, matches) => {
        data.p1收集.push({ sourceId: matches.sourceId, target: matches.target });
      },
    },
    {
      id: 'DMU P1 神像3 连线',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-3',
      delaySeconds: 3,
      durationSeconds: 7,
      promise: async (data) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants;
      },
      response: (data, matches, output) => {
        if (matches.target === data.me) {
          const id = data.p1收集.find((v) => v.target === data.me).sourceId;
          const x = data.combatantData.find((v) => v.ID === parseInt(id, 16)).PosX;
          data.combatantData.length = 0;
          if (x < 100) {
            return { alertText: output.a() };
          }
          return { infoText: output.b() };
        }
      },
      outputStrings: {
        a: { en: '去外面' },
        b: { en: '在里面' },
      },
    },
    {
      id: 'DMU P1 Ave Maria',
      // BAB3 Ave Maria
      // The animation is visible ~9.89s before cast goes off, however
      // When animation becomes visible, the players will be asleep or
      // confused for another ~3.4s. Once the debuff ends the players have
      // ~6.4s to turn character
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.fakeEyeTowerIds.includes(matches.id),
      durationSeconds: 10,
      countdownSeconds: 10,
      alarmText: (_data, _matches, output) => output.lookAt(),
      outputStrings: {
        lookAt: {
          en: 'Look At Statue',
          cn: '看神像',
        },
      },
    },
    {
      id: 'DMU P1 Indolent Will',
      // BAB4 Indolent Will
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.eyeTowerIds.includes(matches.id),
      durationSeconds: 10,
      countdownSeconds: 10,
      alarmText: (_data, _matches, output) => output.lookAway(),
      outputStrings: {
        lookAway: {
          en: 'Look Away From Statue',
          cn: '背对神像',
        },
      },
    },
    {
      id: 'DMU P1 Impertinent Will',
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.yellowTowerIds.includes(matches.id),
      alertText: (_data, _matches, output) => output.goWest(),
      outputStrings: {
        goWest: Outputs.getLeftAndWest,
      },
    },
    {
      id: 'DMU P1 Gravitational Wave',
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.purpleTowerIds.includes(matches.id),
      alertText: (_data, _matches, output) => output.goEast(),
      outputStrings: {
        goEast: Outputs.getRightAndEast,
      },
    },
    {
      id: 'DMU P2 双腕',
      type: 'StartsUsing',
      netRegex: { id: 'C24C' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'DMU P2 遗弃末世',
      type: 'StartsUsing',
      netRegex: { id: 'BABC' },
      response: Responses.bigAoe(),
    },
    {
      id: 'DMU P2 未来终结',
      type: 'StartsUsing',
      netRegex: { id: 'BAD2' },
      preRun: (data) => {
        data.p2未来过去count++;
      },
      delaySeconds: 7,
      durationSeconds: (data) => data.p2未来过去count === 4 ? 10 : 5,
      alarmText: (data, _matches, output) => {
        if (data.p2未来过去count === 4) {
          return output.text4();
        }
        return output.text();
      },
      outputStrings: {
        text: '未来，塔对面，对面',
        text4: '未来，对穿，对穿',
      },
    },
    {
      id: 'DMU P2 过去终结',
      type: 'StartsUsing',
      netRegex: { id: 'BAD3' },
      preRun: (data) => {
        data.p2未来过去count++;
      },
      delaySeconds: 7,
      durationSeconds: (data) => data.p2未来过去count === 4 ? 10 : 5,
      alarmText: (data, _matches, output) => {
        if (data.p2未来过去count === 4) {
          return output.text4();
        }
        return output.text();
      },
      outputStrings: {
        text: '过去，塔中间，中间',
        text4: '过去，不动，不动',
      },
    },
    {
      id: 'DMU P2 HM',
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.分摊,
          headMarkerData.钢铁,
          headMarkerData.扇形,
        ],
      },
      preRun: (data, matches) => {
        data.p2hm[data.p2count - 1] ??= [];
        data.p2hm[data.p2count - 1].push({
          target: matches.target,
          buff: {
            [headMarkerData.分摊]: '分摊',
            [headMarkerData.钢铁]: '钢铁',
            [headMarkerData.扇形]: '扇形',
          }[matches.id],
          role: data.party.nameToRole_[matches.target],
          rp: Util?.souma?.getRpByName?.(data, matches.target),
        });
      },
      delaySeconds: 0.2,
      durationSeconds: 9,
      soundVolume: 0,
      infoText: (data, matches, output) => {
        if (matches.target !== data.me)
          return;
        const config = {
          [headMarkerData.分摊]: { buff: '分摊', out: output.stack },
          [headMarkerData.钢铁]: { buff: '钢铁', out: output.spread },
          [headMarkerData.扇形]: { buff: '扇形', out: output.fan },
        }[matches.id];
        if (!config)
          return;
        const otherNames = [output.you()].concat(
          ...data.p2hm[data.p2count - 1]
            .filter((v) => v.target !== data.me && v.buff === config.buff)
            .map((v) =>
              Util?.souma?.getRpByName === undefined
                ? (output.target({ target: data.party.member(v.target) }))
                : Util.souma.getRpByName(data, v.target)
            ),
        )
          .sort((a, b) => rpSortArr.indexOf(a) - rpSortArr.indexOf(b))
          .join(output.separator());
        if (otherNames.length)
          return config.out({ names: otherNames });
      },
      tts: null,
      outputStrings: {
        separator: '、',
        you: '你',
        target: '${target.job}',
        stack: '分摊点名：${names}',
        spread: '钢铁点名：${names}',
        fan: '扇形点名：${names}',
      },
    },
    {
      id: 'DMU P2 第一轮踩塔',
      type: 'Ability',
      netRegex: { id: 'BABE' },
      preRun: (data, matches) => {
        if (data.p2第一轮踩塔人.length >= 4) {
          return;
        }
        data.p2第一轮踩塔人.push(matches.target);
      },
    },
    {
      id: 'DMU P2 踩塔计数',
      type: 'Ability',
      netRegex: { id: 'BABE' },
      preRun: (data) => {
        data.p2count++;
        data.p2报过了 = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'DMU P2 事',
      type: 'GainsEffect',
      netRegex: {
        effectId: '13DB',
      },
      preRun: (data, matches) => {
        data.p2BuffCount[matches.target] = Number(matches.count);
      },
    },
    {
      id: 'DMU P2 没事干了',
      comment: { en: '这里的 output 和"DMU P2 HM判"是完全一样的，如果改的话也都改成一样的。' },
      type: 'LosesEffect',
      netRegex: {
        effectId: '13DB',
      },
      preRun: (data, matches) => {
        data.p2BuffCount[matches.target] = 0;
      },
      delaySeconds: (data) => data.triggerSetConfig.p2一运打法 === '1234' ? 6 : 0.25,
      alertText: (data, matches, output) => {
        if (data.p2count === 9) {
          return;
        }
        if (data.p2报过了) {
          return;
        }
        return getP2(data, matches, output);
      },
      outputStrings: {
        ...p2OutputStirngs,
      },
    },
    {
      id: 'DMU P2 HM判',
      comment: { en: '这里的 output 和"DMU P2 没事干了"是完全一样的，如果改的话也都改成一样的。' },
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.分摊,
          headMarkerData.钢铁,
          headMarkerData.扇形,
        ],
      },
      delaySeconds: (data) => {
        return [3, 5, 7].includes(data.p2count) ? 5 : 0.25;
      },
      durationSeconds: (data) => {
        return [3, 5, 7].includes(data.p2count) ? 5.5 : 10.25;
      },
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        if (data.p2报过了) {
          return;
        }
        return getP2(data, matches, output);
      },
      outputStrings: {
        ...p2OutputStirngs,
      },
    },
    {
      id: 'DMU P2 Light of Judgment',
      type: 'StartsUsing',
      netRegex: { id: 'BABD', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'DMU P2 Single Wing of Destruction',
      // BACD Wings of Destruction, Left wing highlight
      // BACE Wingso of Desctruction, Right wing highlight
      // Halfroom cleaves
      type: 'StartsUsing',
      netRegex: { id: ['BACD', 'BACE'], capture: true },
      infoText: (_data, matches, output) => {
        if (matches.id === 'BACD')
          return output.right();
        return output.left();
      },
      outputStrings: {
        right: Outputs.right,
        left: Outputs.left,
      },
    },
    {
      id: 'DMU P2 Wings of Destruction',
      type: 'StartsUsing',
      netRegex: { id: 'C487', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          maxMeleeAvoidTanks: {
            en: 'Max Melee: Avoid Tanks',
            cn: '最大近战距离，避开坦克',
          },
          wingsBeNearFar: {
            en: 'Wings: Be Near/Far',
            cn: '双翅膀：近或远',
          },
        };
        if (data.role === 'tank')
          return { alertText: output.wingsBeNearFar() };
        return { infoText: output.maxMeleeAvoidTanks() };
      },
    },
    {
      id: 'DMU P2 Aero III Assault',
      // Knockback from boss that can't be resisted
      // Applies 306 Down for the Count
      type: 'StartsUsing',
      netRegex: { id: 'C3F7', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'DMU P3 简易打铁警察',
      type: 'Ability',
      netRegex: { targetId: '4.{7}' },
      condition: (data, matches) => {
        if (data.triggerSetConfig.p3打铁警察 === false)
          return false;
        if (data.phase !== 'p3')
          return false;
        if (!matches.targetId.startsWith('4'))
          return false;
        // AOE技能，因为判断太复杂
        if (matches.type === '22') {
          return false;
        }
        if ((data.triggerSetConfig.p3打铁监控范围 ?? 'all') === 'me') {
          if (matches.source !== data.me)
            return false;
        } else {
          if (!data.party.partyNames.includes(matches.source))
            return false;
        }
        // 自动攻击
        if (['07', '08'].includes(matches.id))
          return false;
        if (matches.targetIndex !== '0')
          return false;
        const damageVal = parseInt(matches.damage ?? '0', 16);
        if (damageVal !== 0) {
          return false;
        }
        const flagVal = parseInt(matches.flags ?? '0', 16);
        return (flagVal & 0xFF) === 7;
      },
      infoText: (data, matches, output) => {
        const channel = data.triggerSetConfig.p3打铁聊天频道 ?? 'e';
        const name = data.party.member(matches.source);
        const ability = matches.ability;
        const text = output.singleTarget({ name, ability });
        void callOverlayHandler({
          call: 'PostNamazu',
          c: 'DoTextCommand',
          p: `/${channel} ${text}`,
        });
        return undefined;
        // return text;
      },
      outputStrings: {
        singleTarget: '恭喜 ${name.job} 打铁成功！${ability}<se.5>',
      },
    },
    {
      id: 'DMU P3 混沌之泥土',
      type: 'GainsEffect',
      netRegex: { effectId: '644' },
      preRun: (data, matches) => data.p3混沌之泥土.push(matches.target),
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        if (data.p3混沌之泥土.length === 2 && data.role === 'healer') {
          if (data.party.nameToRole_[data.p3混沌之泥土[0]] === 'dps') {
            data.p3混沌之泥土.reverse();
          }
          return output.text({
            name1: data.party.member(data.p3混沌之泥土[0]),
            name2: data.party.member(data.p3混沌之泥土[1]),
          });
        }
        return undefined;
      },
      outputStrings: { text: '奶满${name1}和${name2}' },
    },
    {
      id: 'DMU P3 第N目标',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(p3tar) },
      preRun: (data, matches) =>
        data.p3第N目标.push({
          n: p3tar[matches.effectId],
          target: matches.target,
          id: parseInt(matches.targetId, 16),
          mud: data.p3混沌之泥土.includes(matches.target),
          role: data.party.nameToRole_[matches.target],
          rp: Util?.souma?.getRpByName?.(data, matches.target) ?? undefined,
        }),
      delaySeconds: 0.5,
      run: (data) => {
        if (data.p3第N目标.length === 8 && data.triggerSetConfig.p3混沌之土标记) {
          if (data.triggerSetConfig.p3混沌之土标记方法 === '美式' || data.p3第N目标[0]?.rp === undefined) {
            if (data.triggerSetConfig.p3混沌之土标记方法 === '自定义' && data.p3第N目标[0]?.rp === undefined) {
              console.warn('未发现玩家职能，已将 混沌之土 标记方法 降级至美式标记');
            }
            const sortArr = data.triggerSetConfig.p3混沌之土标记美式优先级.split('>').map((v) => v.trim());
            data.p3第N目标.sort((a, b) =>
              sortArr.indexOf(a.mud ? 'mud' : a.role) -
              sortArr.indexOf(b.mud ? 'mud' : b.role)
            );
          } else if (data.triggerSetConfig.p3混沌之土标记方法 === '自定义') {
            const sortArr = data.triggerSetConfig.p3混沌之土标记自定义优先级.split('>').map((v) => v.trim());
            data.p3第N目标.sort((a, b) => sortArr.indexOf(a.rp ?? '') - sortArr.indexOf(b.rp ?? ''));
          }
          const m1 = data.p3第N目标.filter((v) => v.n === 1);
          const m2 = data.p3第N目标.filter((v) => v.n === 2);
          const m3 = data.p3第N目标.filter((v) => v.n === 3);
          dmuMark(m1[0].id, 'attack1', false);
          dmuMark(m1[1].id, 'attack2', false);
          dmuMark(m1[2].id, 'attack3', false);
          dmuMark(m2[0].id, 'bind1', false);
          dmuMark(m2[1].id, 'bind2', false);
          dmuMark(m2[2].id, 'bind3', false);
          dmuMark(m3[0].id, 'stop1', false);
          dmuMark(m3[1].id, 'stop2', false);
          // console.log(m1, m2, m3);
        }
      },
    },
    {
      id: 'DMU P3 debuff',
      type: 'StartsUsing',
      netRegex: { id: ['C2E2', 'C2E3'], capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '获取防火墙' },
    },
    {
      id: 'DMU P3 深层痛楚',
      type: 'StartsUsing',
      netRegex: { id: 'BAF2', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'DMU P3-1 debuff',
      type: 'GainsEffect',
      netRegex: {
        effectId: Object.keys(p3buff),
      },
      preRun: (data, matches) => {
        data.p3buffs[matches.target] ??= [];
        data.p3buffs[matches.target].push({
          name: p3buff[matches.effectId].name,
          duration: parseFloat(matches.duration),
        });
      },
    },
    {
      id: 'DMU P3-1 debuff 风',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['642', '643'],
      },
      condition: (data, matches) => {
        return data.phase === 'p3' && matches.target === data.me;
      },
      delaySeconds: 68 - 10,
      durationSeconds: 10,
      suppressSeconds: 300,
      countdownSeconds: 7,
      response: (_data, matches, output) => {
        return {
          [matches.id === '643' ? 'infoText' : 'alertText']: output[matches.effectId](),
        };
      },
      outputStrings: {
        '643': '面向艾克斯迪斯',
        '642': '背对BOSS',
      },
    },
    {
      id: 'DMU P3-1 debuff 水火',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['640', '641'],
      },
      condition: (data, matches) => {
        return data.phase === 'p3' && matches.target === data.me;
      },
      delaySeconds: 0.5,
      durationSeconds: (_data, matches) => {
        return parseFloat(matches.duration);
      },
      suppressSeconds: 200,
      countdownSeconds: (_data, matches) => {
        return parseFloat(matches.duration);
      },
      infoText: (_data, matches, output) => {
        return output
          [
            `${parseFloat(matches.duration) > 30 ? '长' : '短'}${
              matches.effectId === '640' ? '火' : '水'
            }`
          ]();
      },
      outputStrings: {
        长火: '长火',
        短火: '短火',
        长水: '长水',
        短水: '短水',
      },
    },
    {
      id: 'DMU P3 究极冲击波',
      type: 'AbilityExtra',
      netRegex: { id: 'BAE3' },
      preRun: (data, matches) => {
        data.p3究极冲击波hdg.push(parseFloat(matches.heading));
      },
      durationSeconds: 20,
      alertText: (data, _matches, output) => {
        if (data.p3究极冲击波hdg.length === 2) {
          const [c1, c2] = data.p3究极冲击波hdg;
          const dir1 = Directions.hdgTo8DirNum(c1);
          const dir2 = Directions.hdgTo8DirNum(c2);
          const start = Directions.outputFrom8DirNum(dir1);
          const clock = (dir2 - dir1 === 1) || (dir2 === 0 && dir1 === 7);
          const clk = clock ? '顺' : '逆';
          data.p3jjcjb = {
            c1,
            c2,
            clk,
          };
          return output.text({
            start: output[start](),
            clk: output[clk](),
          });
        }
      },
      outputStrings: {
        text: '${start} ${clk}',
        顺: '逆←',
        逆: '顺→',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'B',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'D',
        unknown: 'unknown',
      },
    },
    {
      id: 'DMU P3 MJ',
      type: 'HeadMarker',
      netRegex: { id: Object.keys(p3mj), capture: true },
      condition: (data, matches) => data.phase === 'p3' && matches.target === data.me,
      durationSeconds: 12,
      infoText: (data, matches, output) => {
        const n = p3mj[matches.id];
        let res;
        // 这里的clk没取反，是boss的冲锋顺序，所以下面的判断是!==
        if (data.p3jjcjb === undefined) {
          return output.unknown({ n });
        }
        const { c1, clk } = data.p3jjcjb;
        const dir1 = Directions.hdgTo8DirNum(c1);
        const p = (clk !== '顺' ? +1 : -1);
        const macro = [];
        for (let i = 1; i <= 8; i++) {
          if (data.triggerSetConfig.p3麻将发宏 === false && i !== n) {
            continue;
          }
          const g = dir1 * 2 + p + (2 * (i - 1)) * p;
          const r = (g + 16) % 16;
          const [a1, a2] = [
            Directions.outputFrom8DirNum(((r - 1 + 16) % 16) / 2),
            Directions.outputFrom8DirNum(((r + 1) % 16) / 2),
          ];
          const r1 = output[a1]();
          const r2 = output[a2]();
          if (i === n) {
            res = output.text({ n, r1, r2 });
          }
          macro.push({ mj: i, wy: [r1, r2].sort() });
        }
        if (res === undefined) {
          return output.unknown({ n });
        }
        if (data.triggerSetConfig.p3麻将发宏) {
          Util.souma.doQueueActions(macro.map((m, i) => {
            return {
              'c': 'DoTextCommand',
              'p': `/p ${m.mj}麻：${m.wy.join('/')}`,
              'd': i === 0 ? 0 : 100,
            };
          }));
        }
        return res;
      },
      outputStrings: {
        unknown: '${n}麻，出错了自己看',
        text: '${n}麻，去 ${r1}${r2}之间',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'B',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'D',
      },
    },
    {
      id: 'DMU P3 暴雷钢铁',
      type: 'StartsUsing',
      netRegex: { id: 'BB12', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '远离艾克斯迪斯',
      },
    },
    {
      id: 'DMU P3 暴雷死刑',
      type: 'StartsUsing',
      netRegex: { id: 'BB09', capture: true },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 8.6,
      countdownSeconds: 8.6,
      // response: Responses.tankBuster(),
      response: (data, _matches, output) => {
        return {
          [
            {
              'tank': 'alarmText',
              'healer': 'alertText',
              'dps': 'infoText',
              'crafter': null,
              'gatherer': null,
              'none': null,
            }[data.role]
          ]: output[data.role](),
        };
      },
      outputStrings: {
        tank: '死刑 x2',
        healer: '死刑 x2',
        dps: '死刑 x2',
      },
    },
    // {
    //   id: 'DMU P3 暴雷死刑2',
    //   type: 'StartsUsing',
    //   netRegex: { id: 'BB09', capture: true },
    //   condition: (data) => data.phase === 'p3',
    //   delaySeconds: 4.5,
    //   countdownSeconds: 3,
    //   response: Responses.tankBuster(),
    // },
    {
      id: 'DMU P3 纬度聚爆',
      type: 'StartsUsing',
      netRegex: { id: 'BAFE', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      countdownSeconds: 4.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '前后 => 左右' },
    },
    {
      id: 'DMU P3 经度聚爆',
      type: 'StartsUsing',
      netRegex: { id: 'BAFD', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      countdownSeconds: 4.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '左右 => 前后' },
    },
    {
      id: 'DMU P3 响亮亮耳光',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BAE6', 'BAE7'], capture: true },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 9,
      countdownSeconds: 9,
      alarmText: (data, matches, output) => {
        const d = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const dirBase = Directions.outputFrom8DirNum((d + 4) % 8);
        if (matches.id === 'BAE6') {
          const stackIn = Directions.outputFrom8DirNum((d + 4 + 2) % 8);
          return output.text({
            role: output.all(),
            dir: output[dirBase](),
            gmk: output[matches.id](),
            in: output[stackIn](),
          });
        } else if (matches.id === 'BAE7') {
          const spreadIn = Directions.outputFrom8DirNum(
            (d + 4 + ({
              'tank': -1,
              'healer': -2,
              'dps': -3,
            }[data.role])) % 8,
          );
          return output.text({
            role: output[data.role](),
            dir: output[dirBase](),
            gmk: output[matches.id](),
            in: output[spreadIn](),
          });
        }
      },
      outputStrings: {
        // text: '看${dir}，${gmk}（${role}去${in}）',
        text: '${gmk}（${role}去${in}）',
        all: '都',
        tank: '坦克',
        healer: '治疗',
        dps: '输出',
        BAE6: '右分摊',
        BAE7: '左职能刀',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'B',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'D',
      },
    },
    ...p3timeline.map((item) => {
      const { time, text, id } = item;
      return {
        id: `DMU P3 黑洞接线 ${id}`,
        type: 'StartsUsing',
        netRegex: { id: 'BAFB', capture: false },
        condition: (data) => data.phase === 'p3',
        durationSeconds: (item.duration / 1000) - 0.5,
        delaySeconds: (time / 1000) - 0.25,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: { text: text },
      };
    }),
    {
      id: 'DMU P3 白洞',
      type: 'StartsUsing',
      netRegex: { id: 'BD66', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      countdownSeconds: 4.7,
      soundVolume: 0,
      infoText: (_data, _matches, output) => output.text(),
      tts: null,
      outputStrings: { text: '满血检测' },
    },
    {
      id: 'DMU P3 本色出演的你1',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BAEC', 'BAED'], capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      suppressSeconds: 1,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '去两侧！' },
    },
    {
      id: 'DMU P3 本色出演的你2',
      type: 'StartsUsingExtra',
      netRegex: { id: 'BAED', capture: true },
      condition: (data) => data.phase === 'p3',
      delaySeconds: 5,
      durationSeconds: 10,
      alertText: (_data, matches, output) => {
        const d1 = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const d2 = (d1 + 4) % 8;
        const dir2 = output[Directions.outputFrom8DirNum(d1)]();
        const dir1 = output[Directions.outputFrom8DirNum(d2)]();
        return output.text({ dir1, dir2 });
      },
      outputStrings: {
        text: 't奶去${dir1},dps去${dir2}',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'BOY',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'DOG',
      },
    },
    {
      id: 'DMU P3 轰击',
      type: 'HeadMarker',
      netRegex: { id: '00A1' },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 5.5,
      infoText: (data, matches, output) => {
        const r = data.party.nameToRole_[matches.target];
        if (r === 'dps') {
          // DPS分摊
          return data.role === 'dps' ? output.stack() : output.tower();
        }
        // TN分摊
        return data.role === 'dps' ? output.tower() : output.stack();
      },
      outputStrings: {
        stack: '场中分摊',
        tower: '外面踩塔',
      },
    },
    {
      id: 'DMU P3 诅咒赦令',
      type: 'StartsUsing',
      netRegex: { id: 'BB01', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '去背后' },
    },
    {
      id: 'DMU P3 顶~起！',
      type: 'StartsUsing',
      netRegex: { id: 'BB05', capture: false },
      condition: (data) => data.phase === 'p3',
      durationSeconds: 4.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '去外面 + 保持移动' },
    },
    {
      id: 'DMU P4 真假雷冰',
      type: 'StartsUsing',
      netRegex: { id: 'BA94' },
      condition: (data) => data.phase === 'p4',
      delaySeconds: 0.25,
      alertText: (data, _matches, output) => {
        return output[`${data.假冰 ? '假' : '真'}冰${data.假雷 ? '假' : '真'}雷`]();
      },
      outputStrings: {
        '真冰真雷': { en: '都躲开' },
        '真冰假雷': { en: '吃直条' },
        '假冰真雷': { en: '吃扇形' },
        '假冰假雷': { en: '都吃' },
      },
    },
    {
      id: 'DMU P4 真假大十字',
      type: 'GainsEffect',
      // 45F = 卡奥斯 假
      // 460 = 卡奥斯 真
      // 461 = 新生艾克斯迪司 假
      // 462 = 新生艾克斯迪司 真
      netRegex: { effectId: '808' },
      condition: (data) => data.phase === 'p4',
      delaySeconds: (data) => data.p4真假.新生艾克斯迪司.length === 3 ? 0 : 3,
      run: (data, matches) => {
        data.p4真假[['45F', '460'].includes(matches.count) ? '卡奥斯' : '新生艾克斯迪司'].push([
          '460',
          '462',
        ].includes(matches.count));
      },
    },
    {
      id: 'DMU P4 BUFF 判定前提示',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(p4buff), capture: true },
      condition: (data, matches) => {
        return data.phase === 'p4' &&
          !['生者之伤', '死者之伤', '亚拉戈领域', '超越死亡'].includes(p4buff[matches.effectId].name);
      },
      delaySeconds: (_data, matches) => {
        return parseFloat(matches.duration) - 8;
      },
      durationSeconds: 8,
      countdownSeconds: 8,
      alertText: (data, matches, output) => {
        const resolveTime = (new Date(matches.timestamp).getTime() / 1000) +
          parseFloat(matches.duration);
        data.p4ReportedTimes ??= [];
        if (data.p4ReportedTimes.some((t) => Math.abs(t - resolveTime) <= 1)) {
          return undefined;
        }
        data.p4ReportedTimes.push(resolveTime);
        // 遍历data.p4buffs,按照time进行归组，相差在1秒钟之内的归为一组，否则新开一组。
        const groupedByTime = {};
        Object.entries(data.p4buffs).forEach(([player, v]) => {
          v.forEach((item) => {
            if (!['生者之伤', '死者之伤', '亚拉戈领域', '超越死亡'].includes(item.name)) {
              // 寻找相差在1秒钟之内的组
              const matchKey = Object.keys(groupedByTime).find((key) => {
                return Math.abs(item.time - parseFloat(key)) <= 1;
              });
              if (matchKey !== undefined) {
                groupedByTime[parseFloat(matchKey)].push({
                  player,
                  ...item,
                });
              } else {
                groupedByTime[item.time] = [{
                  player,
                  ...item,
                }];
              }
            }
          });
        });
        // 按照时间顺序排序所有的组
        const sortedTimes = Object.keys(groupedByTime).map(Number).sort((a, b) => a - b);
        const myGimmickByTime = {};
        sortedTimes.forEach((time) => {
          const group = groupedByTime[time];
          const myBuffs = group.filter((item) => item.player === data.me);
          const hasWater = group.some((item) => item.gimmick === '水分摊');
          if (myBuffs.length > 0) {
            myBuffs.sort((a, b) => {
              const aIsSword = a.gimmick === '移动' || a.gimmick === '停手';
              const bIsSword = b.gimmick === '移动' || b.gimmick === '停手';
              if (aIsSword && !bIsSword)
                return 1;
              if (!aIsSword && bIsSword)
                return -1;
              return 0;
            });
            const gimmickStr = myBuffs.map((item) => output[item.gimmick]()).join(output.plus());
            const onlySword = myBuffs.every((item) =>
              item.gimmick === '移动' || item.gimmick === '停手'
            );
            if (hasWater && onlySword) {
              myGimmickByTime[time] = output['水分摊']() + output.plus() + gimmickStr;
            } else {
              myGimmickByTime[time] = gimmickStr;
            }
          } else {
            if (hasWater) {
              myGimmickByTime[time] = output['水分摊']();
            }
          }
        });
        const gTime = sortedTimes.find((t) => Math.abs(t - resolveTime) <= 1);
        if (gTime === undefined) {
          return undefined;
        }
        const currentGimmick = myGimmickByTime[gTime];
        if (currentGimmick === undefined) {
          return undefined;
        }
        // 检查上一个自己需要做的机制时间
        const idx = sortedTimes.indexOf(gTime);
        let preTime;
        for (let j = idx - 1; j >= 0; j--) {
          const t = sortedTimes[j];
          if (myGimmickByTime[t] !== undefined) {
            preTime = t;
            break;
          }
        }
        if (preTime !== undefined) {
          const diff = Math.abs(preTime - gTime);
          // 如果这次机制与上一个自己有提示的机制时间相差小于等于3秒，则这次不报
          if (diff <= 3) {
            return undefined;
          }
        }
        return currentGimmick;
      },
      outputStrings: {
        plus: { en: '+' },
        雷分散: { en: '出去分散' },
        水分摊: { en: '3人分摊' },
        背对眼: { en: '出去背对' },
        面对眼: { en: '脚底互看' },
        停手: { en: '静剑停停停' },
        移动: { en: '动剑动动动' },
        钢铁: { en: '放钢铁' },
        月环: { en: '放月环' },
      },
    },
    {
      id: 'DMU P4 BUFF 长时间提示',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(p4buff), capture: false },
      condition: (data) => data.phase === 'p4',
      delaySeconds: 0.25,
      durationSeconds: (data) => {
        data.p4CastCount++;
        return [3, 3, 3, 3, 3, 60][data.p4CastCount];
      },
      suppressSeconds: 1,
      // sound: '',
      soundVolume: 0,
      response: (data, _matches, output) => {
        if (data.p4CastCount > 5)
          return {};
        if (data.p4CastCount <= 4) {
          return {};
          // return {
          //   infoText: output.n1t4!({
          //     text: data.p4buffs[data.me]!.filter((v) => v.count === data.p4CastCount).map((v) =>
          //       output[v.gimmick]!()
          //     ).join(output.join1!()),
          //   }),
          //   tts: null,
          // };
        }
        // 遍历data.p4buffs,按照time进行归组，相差在1秒钟之内的归为一组，否则新开一组。
        const groupedByTime = {};
        Object.entries(data.p4buffs).forEach(([player, v]) => {
          v.forEach((item) => {
            if (!['生者之伤', '死者之伤', '亚拉戈领域', '超越死亡'].includes(item.name)) {
              // 寻找相差在1秒钟之内的组
              const matchKey = Object.keys(groupedByTime).find((key) => {
                return Math.abs(item.time - parseFloat(key)) <= 1;
              });
              if (matchKey !== undefined) {
                groupedByTime[parseFloat(matchKey)].push({
                  player,
                  ...item,
                });
              } else {
                groupedByTime[item.time] = [{
                  player,
                  ...item,
                }];
              }
            }
          });
        });
        // 按照时间顺序排序所有的组
        const sortedTimes = Object.keys(groupedByTime).map(Number).sort((a, b) => a - b);
        const myGimmicks = [];
        sortedTimes.forEach((time) => {
          const group = groupedByTime[time];
          // 找到当前玩家在此机制组中的buff
          const myBuffs = group.filter((item) => item.player === data.me);
          const hasWater = group.some((item) => item.gimmick === '水分摊');
          if (myBuffs.length > 0) {
            myBuffs.sort((a, b) => {
              const aIsSword = a.gimmick === '移动' || a.gimmick === '停手';
              const bIsSword = b.gimmick === '移动' || b.gimmick === '停手';
              if (aIsSword && !bIsSword)
                return 1;
              if (!aIsSword && bIsSword)
                return -1;
              return 0;
            });
            // 如果玩家自己有buff，播报自己的buff（有多个则用 plus (+) 连接）
            const gimmickStr = myBuffs.map((item) => output[item.gimmick]()).join(output.plus());
            const onlySword = myBuffs.every((item) =>
              item.gimmick === '移动' || item.gimmick === '停手'
            );
            if (hasWater && onlySword) {
              myGimmicks.push(output['水分摊']() + output.plus() + gimmickStr);
            } else {
              myGimmicks.push(gimmickStr);
            }
          } else {
            // 如果自己在这个机制轮次里没有对应的buff（即没事可做），且别人有“水分摊”，则需要去帮忙分摊
            if (hasWater) {
              myGimmicks.push(output['水分摊']());
            }
          }
        });
        const text = myGimmicks.join(output.join5());
        return { alarmText: output.text5({ text }), tts: null };
      },
      outputStrings: {
        雷分散: { en: '雷分散' },
        水分摊: { en: '水分摊' },
        背对眼: { en: '真石化' },
        面对眼: { en: '假石化' },
        停手: { en: '静剑' },
        移动: { en: '动剑' },
        钢铁: { en: '放钢铁' },
        月环: { en: '放月环' },
        plus: { en: '+' },
        // join1: { en: '、' },
        join5: { en: '→' },
        // n1t4: '${text}',
        text5: '${text}',
      },
    },
    {
      id: 'DMU P4 放钢铁瞬间提示',
      type: 'GainsEffect',
      netRegex: { effectId: ['15AB', '15AC'] },
      condition: (data, matches) => {
        if (data.phase !== 'p4' || matches.target !== data.me)
          return false;
        const buff = p4buff[matches.effectId];
        if (!buff)
          return false;
        const sourceTF = data.p4真假.卡奥斯[data.p4count.卡奥斯 - 1];
        if (sourceTF === undefined)
          return false;
        const gimmick = buff[sourceTF ? 'true' : 'false'];
        return gimmick === '钢铁';
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      infoText: (_data, _matches, output) => output.go(),
      outputStrings: { go: { en: '走!' } },
    },
    {
      id: 'DMU P4 放月环瞬间提示',
      type: 'GainsEffect',
      netRegex: { effectId: ['15AB', '15AC'] },
      condition: (data, matches) => {
        if (data.phase !== 'p4' || matches.target !== data.me)
          return false;
        const buff = p4buff[matches.effectId];
        if (!buff)
          return false;
        const sourceTF = data.p4真假.卡奥斯?.[data.p4count.卡奥斯 - 1];
        if (sourceTF === undefined)
          return false;
        const gimmick = buff[sourceTF ? 'true' : 'false'];
        return gimmick === '月环';
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      countdownSeconds: 4,
      soundVolume: 0,
      infoText: (_data, _matches, output) => output.wait(),
      tts: null,
      outputStrings: { wait: { en: '等月环' } },
    },
    {
      id: 'DMU P4 大十字',
      type: 'StartsUsing',
      netRegex: { id: 'BB14' },
      delaySeconds: 2,
      run: (data) => data.p4count.新生艾克斯迪司++,
    },
    {
      id: 'DMU P4 烈焰/海啸',
      type: 'StartsUsing',
      netRegex: { id: ['BB1E', 'BB20', 'BB1F', 'BB21'] },
      delaySeconds: 2,
      suppressSeconds: 1,
      run: (data) => data.p4count.卡奥斯++,
    },
    {
      id: 'DMU P4 BUFF',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(p4buff) },
      run: (data, matches) => {
        if (data.phase !== 'p4')
          return false;
        const buff = p4buff[matches.effectId];
        const source = buff.source;
        const sourceTF = data.p4真假[source][data.p4count[source] - 1];
        const gimmick = buff[sourceTF ? 'true' : 'false'];
        (data.p4buffs[matches.target] ??= []).push({
          name: buff.name,
          tf: sourceTF ? '真' : '假',
          gimmick: gimmick,
          // duration: parseFloat(matches.duration),
          time: (new Date(matches.timestamp).getTime() / 1000) + parseFloat(matches.duration),
          count: data.p4CastCount,
          bossCount: data.p4count[source],
        });
        data.p4buffs[matches.target].sort((a, b) => a.time - b.time);
        // return matches.target === data.me;
      },
    },
    {
      id: 'DMU P4 无之泛滥',
      type: 'StartsUsing',
      netRegex: {
        id: [
          'C3A1',
          'C3A2',
          'C392',
          'C393',
        ],
      },
      // C3A1左紫右蓝（假的？）（猜的）
      // C3A2左蓝右紫（假的）
      // C392左紫右蓝（真的）
      // C393左蓝右紫（真的）
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        data.p4count.新生艾克斯迪司++;
        const tf = data.p4真假['新生艾克斯迪司'][3];
        const buffa = data.p4buffs[data.me].find((v) => v.name === '生者之伤' || v.name === '死者之伤');
        const buffb = data.p4buffs[data.me].find((v) => v.name === '超越死亡' || v.name === '亚拉戈领域');
        const see = (matches.id === 'C392' || matches.id === 'C3A1') ? ['紫', '蓝'] : ['蓝', '紫'];
        // 死同 亚异
        let color = buffb.name === '亚拉戈领域'
          ? (buffa.name === '生者之伤' ? '蓝' : '紫')
          : (buffa.name === '生者之伤' ? '紫' : '蓝');
        if (tf === false) {
          color = color === '蓝' ? '紫' : '蓝';
        }
        const index = see.findIndex((v) => v === color);
        const dir = index === 0 ? 'left' : 'right';
        return output[dir]({ c: color });
      },
      outputStrings: {
        left: '<= 吃左边${c}色',
        right: '吃右边${c}色 =>',
      },
    },
    {
      id: 'DMU P4 魔法粗存',
      type: 'StartsUsing',
      netRegex: { id: 'BAA4', capture: false },
      run: (data) => {
        data.p4魔法储存 = { 假雷: undefined, 假冰: undefined };
      },
    },
    {
      id: 'DMU P4 劈啪啪暴雷',
      type: 'StartsUsing',
      netRegex: { id: 'C5DE' },
      condition: (data) => data.phase === 'p4' && data.p4魔法储存 !== undefined,
      delaySeconds: 0.25,
      alertText: (data, _matches, output) => {
        const thunder = data.p4魔法储存?.假雷 ? '假雷' : '真雷';
        // console.log('假雷是', thunder, data.p4魔法储存?.假雷);
        const buffs = Object.entries(data.p4buffs);
        const eyes = [];
        // 只需要背对眼或面对眼的数组
        buffs.forEach(([k, v]) => {
          const eye = v.find((p) => p.gimmick === '背对眼' || p.gimmick === '面对眼');
          if (eye) {
            eyes.push({
              player: k,
              gimmick: eye.gimmick,
              time: eye.time,
            });
          }
        });
        eyes.sort((a, b) => a.time - b.time);
        const isEyes = eyes.find((v, i) => v.player === data.me && i < 2);
        if (isEyes) {
          return output.text({
            t: output[thunder](),
            e: output[isEyes.gimmick](),
          });
        }
        const t = output[thunder]();
        const e = output[`人群${eyes[0].gimmick}`]();
        return output.text({
          t: t,
          e: e,
        });
      },
      outputStrings: {
        'text': { en: '${t}+${e}' },
        '假雷': { en: '吃直条' },
        '真雷': { en: '不吃' },
        '背对眼': { en: '出去背对' },
        '面对眼': { en: '脚底互看' },
        '人群背对眼': { en: '躲石化' },
        '人群面对眼': { en: '看石化' },
      },
    },
    {
      id: 'DMU P4 第二次石化',
      type: 'StartsUsing',
      netRegex: { id: 'C5DE' },
      condition: (data) => data.phase === 'p4' && data.p4魔法储存 !== undefined,
      delaySeconds: 24,
      alertText: (data, _matches, output) => {
        const buffs = Object.entries(data.p4buffs);
        const eyes = [];
        // 只需要背对眼或面对眼的数组
        buffs.forEach(([k, v]) => {
          const eye = v.find((p) => p.gimmick === '背对眼' || p.gimmick === '面对眼');
          if (eye) {
            eyes.push({
              player: k,
              gimmick: eye.gimmick,
              time: eye.time,
            });
          }
        });
        eyes.sort((a, b) => b.time - a.time);
        const isEyes = eyes.find((v, i) => v.player === data.me && i < 2);
        if (isEyes) {
          // 石化眼通过个人buff报，这里不管。
          return;
        }
        return output[`人群${eyes[0].gimmick}`]();
      },
      outputStrings: {
        '人群背对眼': { en: '躲石化' },
        '人群面对眼': { en: '看石化' },
      },
    },
    {
      id: 'DMU P4 扩大大冰封',
      type: 'StartsUsing',
      netRegex: { id: 'BA95' },
      condition: (data) => data.phase === 'p4' && data.p4魔法储存 !== undefined,
      delaySeconds: 0.25,
      alertText: (data, _matches, output) => {
        const ice = data.p4魔法储存?.假冰 ? '假冰' : '真冰';
        return output[ice]();
      },
      outputStrings: {
        '假冰': { en: '吃扇形' },
        '真冰': { en: '不吃' },
      },
    },
    {
      id: 'DMU P4 扑腾腾究极',
      type: 'StartsUsing',
      netRegex: { id: 'C24A', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'DMU P4 魔法放出 暂存',
      type: 'StartsUsing',
      netRegex: { id: 'BAA5', capture: false },
      delaySeconds: 1,
      run: (data, _matches) => {
        const ice0 = data.p4魔法储存.假冰 ? 1 : 0;
        const thunder0 = data.p4魔法储存.假雷 ? 1 : 0;
        const ice1 = data.假冰 ? 1 : 0;
        const thunder1 = data.假雷 ? 1 : 0;
        const res = {
          冰: (ice0 + ice1) % 2 === 0 ? '真冰' : '假冰',
          雷: (thunder0 + thunder1) % 2 === 0 ? '真雷' : '假雷',
        };
        data.p4魔法放出暂存 = `${res.冰}${res.雷}`;
      },
    },
    {
      id: 'DMU P4 魔法放出 提示',
      type: 'StartsUsing',
      netRegex: { id: 'BAA5', capture: false },
      delaySeconds: 3,
      durationSeconds: 7,
      alertText: (data, _matches, output) => output[data.p4魔法放出暂存](),
      outputStrings: {
        '真冰真雷': { en: '（稍后）都不吃' },
        '真冰假雷': { en: '（稍后）吃直条' },
        '假冰真雷': { en: '（稍后）吃扇形' },
        '假冰假雷': { en: '（稍后）都吃' },
      },
    },
    {
      id: 'DMU P5 连续究极',
      type: 'StartsUsing',
      netRegex: { id: 'BB40', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: 'AoE x4' },
    },
    {
      id: 'DMU P5 洪水',
      type: 'StartsUsingExtra',
      netRegex: { id: 'C183' },
      condition: (data) => data.phase === 'p5',
      preRun: (data, matches) => {
        data.p5洪水.push(matches);
      },
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        if (data.p5洪水.length === 4) {
          const w1 = data.p5洪水.slice(0, 2).sort((a, b) => (parseInt(a.x)) - (parseInt(b.x)));
          const w3 = data.p5洪水.slice(2, 4).sort((a, b) => (parseInt(a.x)) - (parseInt(b.x)));
          const key1 = `${w1[0]?.x}|${w1[0]?.y}|${w1[0]?.heading}`;
          const key3 = `${w3[0]?.x}|${w3[0]?.y}|${w3[0]?.heading}`;
          const s1 = p5water[key1];
          const s3 = p5water[key3];
          const start = s1.find((v) => s3.includes(v));
          const d = s1.find((v) => !s3.includes(v));
          // console.warn(`s1=${s1.join(',')}, s3=${s3.join(',')}, start=${start}, d=${d}`);
          const idx1 = ['A', 'B', 'C', 'D'].indexOf(start);
          const idx2 = ['A', 'B', 'C', 'D'].indexOf(d);
          const clk = ((idx1 - idx2 + 4) % 4) === 1 ? '顺时针' : '逆时针';
          return output.text({ start: output[start](), clk: output[clk]() });
        }
      },
      outputStrings: {
        text: '${start}，${clk}',
        A: 'A',
        B: 'BOY',
        C: 'C',
        D: 'DOG',
        顺时针: { en: '左 ←' },
        逆时针: { en: '右 →' },
      },
    },
    {
      id: 'DMU P5 神圣',
      type: 'Ability',
      netRegex: { id: 'BB54' },
      condition: (data) => data.phase === 'p5' && data.role !== 'tank',
      preRun: (data, matches) => data.p5神圣.push(matches),
      alertText: (data, matches, output) => {
        if (matches.target === data.me && matches.targetIndex === '0')
          return output.text();
      },
      outputStrings: { text: { en: '出去' } },
    },
    {
      id: 'DMU P5 神圣闲',
      type: 'Ability',
      netRegex: { id: 'BB54' },
      condition: (data) => data.phase === 'p5' && data.role !== 'tank',
      delaySeconds: 0.2,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.p5神圣.find((v) => v.target === data.me) === undefined) {
          return output.text();
        }
      },
      outputStrings: { text: { en: '靠近' } },
    },
    {
      id: 'DMU P5 三星',
      type: 'GainsEffect',
      netRegex: {
        effectId: Object.keys(p5buff),
      },
      condition: (data) => data.phase === 'p5',
      preRun: (data, matches) => {
        data.p5三星buff.push(matches);
      },
    },
    {
      id: 'DMU P5 三星1判',
      type: 'GainsEffect',
      netRegex: {
        effectId: Object.keys(p5buff),
      },
      condition: (data) => data.phase === 'p5',
      delaySeconds: 0.5,
      durationSeconds: 5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        data.p5三星count++;
        if (data.p5三星count === 1) {
          const towers = data.p5三星塔.map((v) => {
            const { pairBNpcID, pairPosX, pairPosY, id } = v;
            const dir = Directions.xyTo16DirNum(
              parseFloat(pairPosX),
              parseFloat(pairPosY),
              centerX,
              centerY,
            );
            const elMap = {
              '1EC03F': '冰',
              '1EC040': '雷',
              '1EC03E': '火',
            };
            const el = elMap[pairBNpcID];
            return { dir, el, id };
          });
          const me = data.p5三星buff.find((v) => v.target === data.me);
          if (me === undefined) {
            // 无buff
            data.p5三星是闲人 = true;
          }
          // 有debuff
          const pos = ['左上', '右上', '下'];
          const getNextPos = (p) => {
            const idx = pos.indexOf(p);
            return pos[(idx + 1) % 3];
          };
          const tower = {
            右上: towers.filter((v) => v.dir <= 5.3).sort((a, b) => a.dir - b.dir),
            下: towers.filter((v) => v.dir > 5.3 && v.dir < 10.6).sort((a, b) => a.dir - b.dir),
            左上: towers.filter((v) => v.dir > 10.6).sort((a, b) => a.dir - b.dir),
          };
          data.p5Tower = tower;
          if (me === undefined) {
            return output.none();
          }
          const myElPos = (() => {
            for (const k in tower) {
              const t = tower[k];
              if (t[0]?.el === p5buff[me.effectId]) {
                return k;
              }
            }
            return undefined;
          })();
          if (myElPos === undefined) {
            return;
          }
          const next = getNextPos(myElPos);
          const nextEl = tower[next][0].el;
          const next2 = output.text({
            pos: getNextPos(next),
            el: tower[getNextPos(next)][0].el,
          });
          const next3 = output.text({
            pos: getNextPos(getNextPos(next)),
            el: tower[getNextPos(getNextPos(next))][0].el,
          });
          data.p5三星暂存 = { next2, next3 };
          return output.text({ pos: next, el: nextEl });
        }
        if (data.p5三星count === 2) {
          return data.p5三星暂存?.next2 ?? undefined;
        }
        if (data.p5三星count === 3) {
          return data.p5三星暂存?.next3 ?? undefined;
        }
      },
      outputStrings: {
        text: { en: '${pos}找${el}1' },
        none: { en: '闲人' },
      },
    },
    {
      id: 'DMU P5 三星塔',
      type: 'CombatantMemory',
      netRegex: {
        change: 'Add',
        pair: [{
          key: 'BNpcID',
          value: [
            // 冰
            '1EC03F',
            // 雷
            '1EC040',
            // 火
            '1EC03E',
          ],
        }],
      },
      condition: (data) => data.phase === 'p5',
      preRun: (data, matches) => {
        data.p5三星塔.push(matches);
      },
    },
    {
      id: 'DMU P5 二选一',
      type: 'StartsUsing',
      netRegex: { id: ['C24E', 'C24F'], capture: true },
      delaySeconds: (data) => data.p5三星count === 1 ? 0 : 1.5,
      durationSeconds: (data) => data.p5三星count === 1 ? 4 : 2.5,
      alertText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        'C24E': { en: '钢铁' },
        'C24F': { en: '月环' },
      },
    },
    {
      id: 'DMU P5 三星塔都亮起来吧收集',
      type: 'ActorControlExtra',
      netRegex: {
        'category': '019D',
        'param1': '10',
        'param2': '20',
        'param3': '0',
        'param4': '0',
      },
      condition: (data) => data.phase === 'p5',
      preRun: (data, matches) => {
        data.p5三星亮起来.push(matches.id);
      },
    },
    {
      id: 'DMU P5 三星塔都亮起来吧',
      type: 'ActorControlExtra',
      netRegex: {
        'category': '019D',
        'param1': '10',
        'param2': '20',
        'param3': '0',
        'param4': '0',
        'capture': false,
      },
      condition: (data) => data.phase === 'p5',
      delaySeconds: 0.2,
      durationSeconds: 5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.p5三星是闲人) {
          return;
        }
        const tower = data.p5Tower;
        // 看一下哪个区域的塔亮起来了2个
        for (const k in tower) {
          const t = tower[k];
          const count = t.filter((v) => data.p5三星亮起来.includes(v.id)).length;
          if (count === 2) {
            data.p5三星亮起来.length = 0;
            return output.text({ pos: k, el: t[0].el });
          }
        }
        data.p5三星亮起来.length = 0;
        return output.unknown();
      },
      outputStrings: {
        text: { en: '${pos}找${el}2' },
        unknown: { en: '出错了，自己找' },
      },
    },
    {
      id: 'DMU P5 魔击A',
      type: 'Ability',
      netRegex: { id: 'C654', capture: false },
      condition: (data) => data.phase === 'p5',
      durationSeconds: 2.8,
      suppressSeconds: 1,
      soundVolume: 0,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          text: { en: '还有${n}下' },
          over: { en: '打完了' },
        };
        const n = [3, 2, 1, 2, 1, 2, 1, 3, 2, 1][data.p5魔击count] - 1;
        data.p5魔击count++;
        return n === 0 ? { infoText: output.over() } : { alertText: output.text({ n }) };
      },
    },
    {
      id: 'DMU P5 软狂暴啦',
      type: 'StartsUsing',
      netRegex: { id: 'BB35', capture: false },
      countdownSeconds: 9.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '软狂暴集合' } },
    },
    {
      id: 'DMU P5 软狂暴中途1',
      type: 'StartsUsing',
      netRegex: { id: 'BB38', capture: false },
      countdownSeconds: 4.7,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '走' } },
    },
    {
      id: 'DMU P5 软狂暴中途2',
      type: 'StartsUsing',
      netRegex: { id: 'BB38', capture: false },
      delaySeconds: 4.7,
      countdownSeconds: 4.7,
      infoText: (data, _matches, output) => {
        data.p5软狂暴count++;
        if (data.p5软狂暴count === 4) {
          return output.over();
        }
        return output.text();
      },
      outputStrings: { text: { en: '停' }, over: { en: '结束' } },
    },
    {
      id: 'DMU P5 狂暴啦',
      type: 'StartsUsing',
      netRegex: { id: 'BB3A', capture: false },
      countdownSeconds: 30,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '狂暴' } },
    },
  ],
});
