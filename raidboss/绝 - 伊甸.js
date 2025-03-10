const { getRpByName, mark, doQueueActions } = Util.souma;
const clearMark = (delay = 0) => {
  // console.debug('clearMark');
  doQueueActions([
    { c: 'command', p: '/mk off <1>', d: delay * 1000 },
    { c: 'command', p: '/mk off <2>' },
    { c: 'command', p: '/mk off <3>' },
    { c: 'command', p: '/mk off <4>' },
    { c: 'command', p: '/mk off <5>' },
    { c: 'command', p: '/mk off <6>' },
    { c: 'command', p: '/mk off <7>' },
    { c: 'command', p: '/mk off <8>' },
  ]);
};
const markTypeOptions = {
  无: 'none',
  攻击1: 'attack1',
  攻击2: 'attack2',
  攻击3: 'attack3',
  攻击4: 'attack4',
  攻击5: 'attack5',
  攻击6: 'attack6',
  攻击7: 'attack7',
  攻击8: 'attack8',
  锁链1: 'bind1',
  锁链2: 'bind2',
  锁链3: 'bind3',
  禁止1: 'stop1',
  禁止2: 'stop2',
  圆圈: 'circle',
  十字: 'cross',
  三角: 'triangle',
  方块: 'square',
};
const p1Towers = {
  // 1人塔 火
  '9CC3': 1,
  // 2人塔 火
  '9CBA': 2,
  // 3人塔 火
  '9CBB': 3,
  // 4人塔 火
  '9CBC': 4,
  // 1人塔 雷
  '9CC7': 1,
  // 2人塔 雷
  '9CBD': 2,
  // 3人塔 雷
  '9CBE': 3,
  // 4人塔 雷
  '9CBF': 4,
};
const p3buffs = {
  // 延迟咏唱：黑暗神圣 分摊
  '摊': '996',
  // 延迟咏唱：黑暗爆炎 分散
  '火': '997',
  // 延迟咏唱：暗影之眼 石化
  '眼': '998',
  // 延迟咏唱：暗炎喷发 分散
  '圈': '99C',
  // 延迟咏唱：黑暗狂水 分摊
  '水': '99D',
  // 延迟咏唱：黑暗冰封 月环
  '冰': '99E',
  // 延迟咏唱：回返
  '返': '9A0',
};
const p4buffs = {
  // 圣龙牙 红buff 需要撞头
  红buff: 'CBF',
  // 圣龙爪 蓝buff 需要踩圈
  蓝buff: 'CC0',
  // 延迟咏唱：黑暗冰封 月环
  冰月环: '99E',
  // 延迟咏唱：黑暗暴风 风击退
  风击退: '99F',
  // 延迟咏唱：黑暗神圣 分摊
  黄分摊: '996',
  // 延迟咏唱：暗炎喷发 暗钢铁
  暗钢铁: '99C',
  // 延迟咏唱：黑暗狂水 分摊
  水分摊: '99D',
};
const p3BuffsIdToName = Object.fromEntries(Object.entries(p3buffs).map(([name, id]) => [id, name]));
const p3Outputs = {
  '0': { en: '场中分摊' },
  '1': { en: '引导灯' },
  '2': { en: '远离放火' },
  '圈': { en: '灯脚下' },
  '眼': { en: '内小圆' },
  '水': { en: '内小圆' },
  '0/2': { en: '场中分摊' },
};
const p3Dirs = {
  DPS长火: 0,
  DPS短火低: 1,
  DPS中火: 2,
  TN长火低: 3,
  TN短火: 4,
  TN长火高: 5,
  TN中火: 6,
  DPS短火高: 7,
  TN冰: 4,
  DPS冰: 0,
};
const headmarkers = {
  tankBuster: '00DA',
  冰花: '0159',
  P4分摊: '003E',
};
const firstHeadmarker = parseInt(headmarkers.tankBuster, 16);
const getHeadmarkerId = (data, matches) => {
  if (data.soumaDecOffset === undefined)
    data.soumaDecOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.soumaDecOffset).toString(16).toUpperCase().padStart(
    4,
    '0',
  );
};
const p5TowerOutput = {
  dark: '←暗左',
  light: '光右→',
  darkMt1: '←暗左（换T+减伤）',
  darkMt1R: '暗右→（换T+减伤）',
  darkMt2: '暗刀',
  darkSt1: '←暗左(换T) + 近死刑',
  darkSt2: '近死刑',
  lightMt1: '光右→（换T+减伤）',
  lightMt1R: '←光左（换T+减伤）',
  lightMt2: '光刀',
  lightSt1: '光右→(换T) + 远死刑',
  lightSt2: '远死刑',
};
const getTowerResult = (data, output) => {
  data.soumaP5单轮翅膀计数++;
  if (data.soumaP5单轮翅膀计数 === 3) {
    return;
  }
  const attr = data.soumaP5单轮翅膀计数 === 1
    ? data.soumaP5翅膀属性
    : data.soumaP5翅膀属性 === 'light'
    ? 'dark'
    : 'light';
  if (data.role === 'tank') {
    return getTankResult(data, output);
  }
  return { infoText: output[attr]() };
};
const isCurrentTank = (data) => {
  const rp = getRpByName(data, data.me);
  return (data.triggerSetConfig[`伊甸P5第${data.soumaP5翅膀全局轮次}次翅膀先拉的T`] === rp &&
    data.soumaP5单轮翅膀计数 === 1) ||
    (data.triggerSetConfig[`伊甸P5第${data.soumaP5翅膀全局轮次}次翅膀先拉的T`] !== rp && data.soumaP5单轮翅膀计数 === 2);
};
const getTankResult = (data, output) => {
  const attr = data.soumaP5单轮翅膀计数 === 1
    ? data.soumaP5翅膀属性
    : data.soumaP5翅膀属性 === 'light'
    ? 'dark'
    : 'light';
  if (isCurrentTank(data)) {
    // 当前一仇
    const reverse = data.triggerSetConfig.伊甸P5翅膀MT反报 && data.soumaP5单轮翅膀计数 === 1
      ? 'R'
      : '';
    return { alarmText: `${output[`${attr}Mt${data.soumaP5单轮翅膀计数}${reverse}`]()}` };
  }
  // 当前二仇
  return { alarmText: `${output[`${attr}St${data.soumaP5单轮翅膀计数}`]()}` };
};
Options.Triggers.push({
  id: 'SoumaEdenUltimate',
  zoneId: ZoneId.FuturesRewrittenUltimate,
  zoneLabel: { en: '光暗未来绝境战 by Souma' },
  config: [
    // location.href = 'http://localhost:8080/ui/config/config.html'
    {
      id: '启用雾龙报安全区',
      name: { en: '启用雾龙直接报安全区' },
      type: 'checkbox',
      default: false,
      comment: {
        en: '本功能默认关闭，需要启用的玩家自行勾选。野队请正常处理该机制，避免破坏游戏环境。',
      },
    },
    {
      id: 'P1双火线上半场组',
      name: { en: 'P1双火线 上半场组优先级' },
      type: 'string',
      default: 'MT/ST/H1/H2',
    },
    {
      id: 'P1双火线下半场组',
      name: { en: 'P1双火线 下半场组优先级' },
      type: 'string',
      default: 'D1/D2/D3/D4',
    },
    {
      id: 'P1双火线上半场组换位人',
      name: { en: 'P1双火线 上半场组 换位人' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
          'H1': 'H1',
          'H2': 'H2',
          'D1': 'D1',
          'D2': 'D2',
          'D3': 'D3',
          'D4': 'D4',
        },
      },
      default: 'MT',
    },
    {
      id: 'P1双火线下半场组换位人',
      name: { en: 'P1双火线 下半场组 换位人' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
          'H1': 'H1',
          'H2': 'H2',
          'D1': 'D1',
          'D2': 'D2',
          'D3': 'D3',
          'D4': 'D4',
        },
      },
      default: 'D1',
    },
    {
      id: 'P1连线机制闲人优先级',
      name: { en: 'P1雷火线 闲人优先级' },
      type: 'string',
      default: 'H1/H2/MT/ST/D1/D2/D3/D4',
    },
    {
      id: '伊甸P1连线机制标点',
      name: { en: 'P1雷火线 标点' },
      type: 'select',
      options: { en: { '开√': '开', '关': '关' } },
      default: '关',
    },
    {
      id: '伊甸P1标线1',
      name: { en: 'P1雷火线 标线1' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链1,
    },
    {
      id: '伊甸P1标线2',
      name: { en: 'P1雷火线 标线2' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止1,
    },
    {
      id: '伊甸P1标线3',
      name: { en: 'P1雷火线 标线3' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链2,
    },
    {
      id: '伊甸P1标线4',
      name: { en: 'P1雷火线 标线4' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止2,
    },
    {
      id: '伊甸P1标闲1',
      name: { en: 'P1雷火线 标闲1' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: '伊甸P1标闲2',
      name: { en: 'P1雷火线 标闲2' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: '伊甸P1标闲3',
      name: { en: 'P1雷火线 标闲3' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: '伊甸P1标闲4',
      name: { en: 'P1雷火线 标闲4' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: '伊甸P1踩塔基准',
      name: { en: 'P1踩塔 报点基准' },
      type: 'select',
      options: {
        en: {
          '仅塔人数': 'simple',
          '全填充式（小学数学）': 'mgl',
          '3固定3补位式': 'mmw',
        },
      },
      default: 'mmw',
    },
    {
      id: '伊甸P1踩塔填充优先级',
      name: { en: 'P1踩塔 填充式 优先级' },
      type: 'string',
      default: 'H1/H2/D1/D2/D3/D4',
    },
    {
      id: '伊甸P1踩塔补位式固定北塔',
      name: { en: 'P1踩塔 补位式 固定北塔者' },
      type: 'select',
      options: {
        en: {
          'H1': 'H1',
          'H2': 'H2',
          'D1': 'D1',
          'D2': 'D2',
          'D3': 'D3',
          'D4': 'D4',
        },
      },
      default: 'H1',
    },
    {
      id: '伊甸P1踩塔补位式固定中塔',
      name: { en: 'P1踩塔 补位式 固定中塔者' },
      type: 'select',
      options: {
        en: {
          'H1': 'H1',
          'H2': 'H2',
          'D1': 'D1',
          'D2': 'D2',
          'D3': 'D3',
          'D4': 'D4',
        },
      },
      default: 'D4',
    },
    {
      id: '伊甸P1踩塔补位式固定南塔',
      name: { en: 'P1踩塔 补位式 固定南塔者' },
      type: 'select',
      options: {
        en: {
          'H1': 'H1',
          'H2': 'H2',
          'D1': 'D1',
          'D2': 'D2',
          'D3': 'D3',
          'D4': 'D4',
        },
      },
      default: 'H2',
    },
    {
      id: '伊甸P2光暴打法',
      name: { en: 'P2光暴打法' },
      type: 'select',
      options: { en: { '田园郡（六芒星）': 'mgl', '灰9': 'gray9' } },
      default: 'mgl',
    },
    {
      id: '伊甸P2光暴灰九拨号盘',
      name: { en: 'P2光暴 灰九式 拨号盘顺序' },
      type: 'string',
      default: 'MT/D4/ST/D2/H2/D1/H1/D3',
      comment: { en: '若修改此处，则下方触发器ID"Souma 伊甸 P2 光之暴走连线灰9"中的密码表部分也需要同步修改' },
    },
    {
      id: '伊甸P2光暴机制标点',
      name: { en: 'P2光暴 田园郡 标点' },
      type: 'select',
      options: { en: { '开√': '开', '关': '关' } },
      default: '关',
      comment: {
        en:
          '预站位TN站上半场，DPS站下半场。上面锁链123从左到右，下面攻击123从左到右。默认玩家上下44分组。若未正常44分组，则会忽视攻略的优先级，暴力标出一套可以通过该机制的点。',
      },
    },
    {
      id: 'P3一运TH同BUFF优先级',
      name: { en: 'P3一运 TH同BUFF优先级' },
      type: 'string',
      default: 'MT/ST/H1/H2',
    },
    {
      id: 'P3一运DPS同BUFF优先级',
      name: { en: 'P3一运 DPS同BUFF优先级' },
      type: 'string',
      default: 'D1/D2/D3/D4',
    },
    {
      id: 'P3二运水分摊预站位左组',
      name: { en: 'P3二运 水分摊预站位优先级 左组' },
      type: 'string',
      default: 'MT/ST/H1/H2',
      comment: { en: '优先级低（写在后面的）换去对面，如果打双分组法则填写"H1/H2/MT/ST"' },
    },
    {
      id: 'P3二运水分摊预站位右组',
      name: { en: 'P3二运 水分摊预站位优先级 右组' },
      type: 'string',
      default: 'D1/D2/D3/D4',
      comment: { en: '优先级低（写在后面的）换去对面，如果打双分组法则填写"D4/D3/D2/D1"（应该吧）' },
    },
    {
      id: 'P3二运地火报点方式',
      name: { en: 'P3二运 地火报点方式' },
      type: 'select',
      options: { en: { '全部：先报车头再报人群（车头AC、大团二四）': '全', '简洁：报人群和车头怎么走（二四左）': '人群' } },
      default: '人群',
    },
    {
      id: 'P4二运同BUFF优先级',
      name: { en: 'P4二运 同BUFF优先级' },
      type: 'string',
      default: 'MT/ST/H1/H2/D1/D2/D3/D4',
    },
    {
      id: 'P4一运打法',
      name: { en: 'P4一运打法' },
      type: 'select',
      options: { en: { '莫古力（翻花绳）': 'mgl', '牛奶抱枕（分摊基准）': 'nnbz' } },
      default: 'mgl',
    },
    {
      id: 'P4光暴预站位上半场',
      name: { en: 'P4光暴 莫古力 上半场站位顺序' },
      type: 'string',
      default: 'MT/ST/H1/H2',
    },
    {
      id: 'P4光暴预站位下半场',
      name: { en: 'P4光暴 莫古力 下半场站位顺序' },
      type: 'string',
      default: 'D1/D2/D3/D4',
    },
    {
      id: 'P4光暴牛奶抱枕预站位',
      name: { en: 'P4光暴 牛奶抱枕 预站位' },
      type: 'string',
      default: 'MT/ST/H1/H2/D1/D2/D3/D4',
      comment: { en: '以基准点为北，左边从上到下+右边从上到下。报点也是以基准点为北。' },
    },
    {
      id: '伊甸P4二运机制标点',
      name: { en: 'P4二运 标点' },
      type: 'select',
      options: { en: { '开√': '开', '关': '关' } },
      default: '关',
      comment: { en: '<a href="https://www.bilibili.com/video/BV1HbzQYpEde">动画演示视频</a>' },
    },
    {
      id: '伊甸P4二运标短红高',
      name: { en: 'P4二运 标短红高' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链1,
    },
    {
      id: '伊甸P4二运标短红低',
      name: { en: 'P4二运 标短红低' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链2,
    },
    {
      id: '伊甸P4二运标长红高',
      name: { en: 'P4二运 标长红高' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止1,
    },
    {
      id: '伊甸P4二运标长红低',
      name: { en: 'P4二运 标长红低' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止2,
    },
    {
      id: '伊甸P4二运标暗钢铁',
      name: { en: 'P4二运 标暗钢铁' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击1,
    },
    {
      id: '伊甸P4二运标黄分摊',
      name: { en: 'P4二运 标黄分摊' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击2,
    },
    {
      id: '伊甸P4二运标冰月环',
      name: { en: 'P4二运 标冰月环' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击3,
    },
    {
      id: '伊甸P4二运标水分摊',
      name: { en: 'P4二运 标水分摊' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击4,
    },
    {
      id: 'P5死亡轮回后谁拉BOSS',
      name: { en: 'P5死亡轮回后 谁负责拉正BOSS' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
        },
      },
      default: 'MT',
    },
    {
      id: 'P5光与暗的双翼后谁拉BOSS',
      name: { en: 'P5光与暗的双翼后 谁负责拉正BOSS' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
        },
      },
      default: 'MT',
    },
    {
      id: '伊甸P5第1次翅膀先拉的T',
      name: { en: 'P5第1次翅膀 先拉的T' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
        },
      },
      default: 'MT',
    },
    {
      id: '伊甸P5第2次翅膀先拉的T',
      name: { en: 'P5第2次翅膀 先拉的T' },
      type: 'select',
      options: {
        en: {
          'MT': 'MT',
          'ST': 'ST',
        },
      },
      default: 'MT',
    },
    {
      id: '伊甸P5翅膀MT反报',
      name: { en: 'P5光与暗的双翼 1刀T反着报（以从塔对面看向BOSS的视角）' },
      type: 'checkbox',
      default: true,
      comment: { en: '1刀MT若提前穿到1塔对面，此时他的面向就变成了“黑右、白左”' },
    },
    {
      id: 'P5挡枪顺序1',
      name: { en: 'P5挡枪 第1组' },
      type: 'string',
      default: 'MT/ST',
    },
    {
      id: 'P5挡枪顺序2',
      name: { en: 'P5挡枪 第2组' },
      type: 'string',
      default: 'H1/H2',
    },
    {
      id: 'P5挡枪顺序3',
      name: { en: 'P5挡枪 第3组' },
      type: 'string',
      default: 'D1/D2',
    },
    {
      id: 'P5挡枪顺序4',
      name: { en: 'P5挡枪 第4组' },
      type: 'string',
      default: 'D3/D4',
    },
  ],
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaPhase: 'P1',
      soumaDecOffset: 0,
      soumaP1线存储: [],
      soumaP1线处理: undefined,
      soumaP1雾龙ids: [],
      soumaP1雾龙属性: undefined,
      soumaP1塔: [],
      soumaP2冰圈初始位置DirNum: [],
      soumaP2冰圈初始位置: undefined,
      soumaP2冰花点名: [],
      soumaP2钢月: undefined,
      soumaP2DD处理: undefined,
      soumaP2镜中奇遇: false,
      soumaP2镜中奇遇分身: [],
      soumaP2光之暴走连线: [],
      soumaP2光暴过量光层数: 0,
      soumaP3阶段: undefined,
      soumaP3一运buff: {},
      soumaP3二运水: [],
      soumaP3沙漏: {},
      soumaP3线存储: [],
      soumaP3处理: [],
      soumaP3MyDir: undefined,
      soumaP3水分组结果左: [],
      soumaP3水分组结果右: [],
      soumaP4光之暴走连线: [],
      soumaP4黑暗狂水: [],
      soumaP4阶段: undefined,
      soumaP4二运buff: {},
      soumaP4二运机制: undefined,
      soumaP4沙漏: {},
      soumaP4地火: [],
      soumaP4一运预分摊: [],
      soumaP5翅膀属性: undefined,
      soumaP5单轮翅膀计数: 0,
      soumaP5翅膀全局轮次: 0,
      soumaP5塔: [],
      soumaP5单轮塔计数: 0,
      soumaP5星灵之剑: [],
      soumaP5星灵之剑阶段: false,
    };
  },
  // 临时用，主分支合并国服翻译后删除
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
13.9 "--sync--" Ability { id: ["9CD0", "9CD4"] }
14.6 "Cyclonic Break 1 (targeted)" Ability { id: "9CD1" }
16.6 "Cyclonic Break 2 (follow-up)" #Ability { id: "9CD2" }
16.6 "Sinsmoke/Sinsmite" Ability { id: ["9CD3", "9CD5"] }
18.6 "Cyclonic Break 3 (follow-up)" #Ability { id: "9CD2" }
20.6 "Cyclonic Break 4 (follow-up)" #Ability { id: "9CD2" }
24.4 "Powder Mark Trail" Ability { id: "9CE8" }
28.5 "--center--" Ability { id: "9CED" }
35.2 "Utopian Sky" Ability { id: ["9CDA", "9CDB"] }
35.2 "--untargetable--"
40.6 "Burn Mark" Ability { id: "9CE9" }
49.5 "--sync--" Ability { id: "9CDD" } # Blasting Zone castbar
50.4 "Sinbound Fire III/Sinbound Thunder III" Ability { id: ["9CDF", "9CE0"] }
50.5 "Blasting Zone" Ability { id: "9CDE" }
55.9 "--sync--" Ability { id: ["9D89", "9D8A"] }
56.6 "Cyclonic Break 1 (targeted)" Ability { id: "9CD1" }
58.6 "Cyclonic Break 2 (follow-up)" #Ability { id: "9CD2" }
58.6 "Sinsmoke/Sinsmite" Ability { id: ["9CD3", "9CD5"] }
60.6 "Cyclonic Break 3 (follow-up)" #Ability { id: "9CD2" }
62.6 "Cyclonic Break 4 (follow-up)" #Ability { id: "9CD2" }
63.8 "Turn Of The Heavens" Ability { id: ["9CD6", "9CD7"] }
64.8 "Burnt Strike (lightning)" Ability { id: "9CE3" }
66.5 "Burnout" Ability { id: "9CE4" }
70.8 "Burnt Strike (fire)" Ability { id: "9CE1" }
72.8 "Blastburn" Ability { id: "9CE2" }
75.4 "Floating Fetters" Ability { id: "9CEB" }
78.6 "Sinsmoke" Ability { id: "9CE7" }
79.8 "--targetable--"
86.0 "Burnished Glory" Ability { id: "9CEA" }
101.4 "Fall Of Faith" Ability { id: ["9CC9", "9CCC"] } # This is manually left in since it's a visible castbar.
102.2 "Floating Fetters 1" #Ability { id: "9CEB" }
105.2 "Floating Fetters 2" #Ability { id: "9CEB" }
105.5 "Sinblaze/Sinsmite 1" #Ability { id: ["9CCE", "9CDC"] }
107.5 "Floating Fetters 3" #Ability { id: "9CEB" }
108.4 "Sinblaze/Sinsmite 2" #Ability { id: ["9CCE", "9CDC"] }
109.9 "Floating Fetters 4" #Ability { id: "9CEB" }
110.8 "Sinblaze/Sinsmite 3" #Ability { id: ["9CCE", "9CDC"] }
113.3 "Sinblaze/Sinsmite 4" #Ability { id: ["9CCE", "9CDC"] }
121.3 "Burnished Glory" Ability { id: "9CEA" }
129.9 "Powder Mark Trail" Ability { id: "9CE8" }
132.3 "--center--" Ability { id: "9CED" }
141.3 "Burnt Strike" Ability { id: ["9CC1", "9CC5"] }
143.1 "Blastburn/Burnout" #Ability { id: ["9CC2", "9CC6"] }
145.1 "Explosion" #Ability { id: "9CBD" }
150.5 "--sync--" StartsUsing { id: "9CC0" } # Burnished Glory
160.2 "Burnished Glory (enrage)" Ability { id: "9CC0" }
# Phase Two
200.0 "--sync--" MapEffect { flags: "00020001", location: "17" } window 200,5
204.1 "--targetable--"
210.3 "--sync--" StartsUsing { id: "9CFF" }
215.3 "Quadruple Slap 1" Ability { id: "9CFF" }
219.4 "Quadruple Slap 2" Ability { id: "9D00" }
224.5 "--jump south--" Ability { id: "9CEF" }
228.8 "Mirror Image" Ability { id: "9CF4" }
235.9 "Diamond Dust" Ability { id: "9D05" }
239.0 "--untargetable--"
244.6 "Axe Kick/Scythe Kick" Ability { id: ["9D0A", "9D0B"] }
245.5 "The House of Light" Ability { id: "9D0E" }
247.2 "Frigid Stone" Ability { id: "9D07" }
247.6 "Icicle Impact" Ability { id: "9D06" }
248.4 "--center--" Ability { id: "9CEF" }
251.5 "Heavenly Strike" Ability { id: "9D0F" }
251.6 "Icicle Impact" Ability { id: "9D06" }
254.2 "Frigid Needle" Ability { id: "9D08" }
254.6 "Sinbound Holy (cast)" Ability { id: "9D10" }
255.5 "Icicle Impact" Ability { id: "9D06" }
255.5 "Sinbound Holy 1 (puddles)" #Ability { id: "9D11" }
256.9 "Sinbound Holy 2 (puddles)" #Ability { id: "9D11" }
258.5 "Sinbound Holy 3 (puddles)" #Ability { id: "9D11" }
260.1 "Sinbound Holy 4 (puddles)" #Ability { id: "9D11" }
263.9 "Shining Armor + Frost Armor" Ability { id: ["9CF8", "9CF9"] }
270.5 "Twin Stillness/Twin Silence" Ability { id: ["9D01", "9D02"] }
272.6 "Twin Silence/Twin Stillness" Ability { id: ["9D03", "9D04"] }
276.2 "--targetable--"
283.3 "Hallowed Ray" Ability { id: "9D12" }
293.0 "Mirror, Mirror" Ability { id: "9CF3" }
307.1 "Scythe Kick" Ability { id: "9D0B" }
317.2 "Reflected Scythe Kick" Ability { id: "9D0D" }
323.3 "Banish III" Ability { id: ["9D1C", "9D1D"] }
326.4 "--center--" Ability { id: "9CEF" }
332.7 "Light Rampant" Ability { id: "9D14" }
335.7 "--untargetable--"
340.7 "Luminous Hammer 1" #Ability { id: "9D1A" }
342.3 "Luminous Hammer 2" #Ability { id: "9D1A" }
343.9 "Luminous Hammer 3" #Ability { id: "9D1A" }
344.0 "Bright Hunger (solo towers)" Ability { id: "9D15" }
345.4 "Luminous Hammer 4" #Ability { id: "9D1A" }
347.0 "Luminous Hammer 5" #Ability { id: "9D1A" }
349.8 "Powerful Light" Ability { id: "9D19" }
352.2 "Burst 1" #Ability { id: "9D1B" }
355.2 "Burst 2" #Ability { id: "9D1B" }
358.8 "Bright Hunger (group tower)" Ability { id: "9D15" }
361.9 "Banish III" Ability { id: ["9D1C", "9D1D"] }
364.9 "--targetable--"
370.8 "The House of Light" Ability { id: "9CFC" }
376.2 "--center--" Ability { id: "9CEF" }
390.1 "Absolute Zero (enrage)" Ability { id: "9D8D" }
# Adds Phase
# The Heimal Storm casts from the Crystals of Light will stop once they all are killed.
392.4 "Swelling Frost" Ability { id: "9D21" }
411.4 "--adds targetable--"
424.4 "Sinbound Blizzard III" Ability { id: "9D42" } window 424.4,2.5
425.4 "Hiemal Storm" Ability { id: "9D40"  }
428.6 "Hiemal Storm" Ability { id: "9D40"  }
429.6 "Sinbound Blizzard III" Ability { id: "9D42" }
431.8 "Hiemal Storm" Ability { id: "9D40"  }
434.7 "Sinbound Blizzard III" Ability { id: "9D42" }
434.9 "Hiemal Storm?" Ability { id: "9D40"  }
438.1 "Hiemal Storm?" Ability { id: "9D40"  }
439.9 "Sinbound Blizzard III" Ability { id: "9D42" }
441.3 "Hiemal Storm?" Ability { id: "9D40"  }
444.5 "Hiemal Storm?" Ability { id: "9D40"  }
445.2 "Sinbound Blizzard III" Ability { id: "9D42" }
447.7 "Hiemal Storm?" Ability { id: "9D40"  }
450.5 "Sinbound Blizzard III" Ability { id: "9D42" }
455.7 "Endless Ice Age (enrage)" Ability { id: "9D43" } # interrupted once <50% HP
# Phase Three
488.8 "--sync--" WasDefeated { target: 'Ice Veil' } window 488.8,5
500.0 "Junction" Ability { id: "9D22" } window 500,5
514.3 "--targetable--"
518.3 "Hell's Judgment" Ability { id: "9D49" }
521.4 "--sync--" Ability { id: "9CB5" }
532.4 "Ultimate Relativity" Ability { id: "9D4A" }
544.2 "Dark Fire III/Unholy Darkness" Ability { id: "9D54" }
549.4 "Sinbound Meltdown 1 (x10)" Ability { id: "9D2B" } duration 10.2
554.3 "Dark Fire III/Dark Blizzard III/Unholy Darkness" Ability { id: "9D54" }
559.4 "Sinbound Meltdown 2 (x10)" Ability { id: "9D2B" } duration 10.2
564.3 "Dark Fire III/Unholy Darkness" Ability { id: "9D54" }
570.4 "Sinbound Meltdown 3 (x10)" Ability { id: "9D2B" } duration 10.2
573.2 "(stun + rewind)" GainsEffect { effectId: "1043" }
576.2 "Shadoweye/Dark Water III/Dark Eruption" Ability { id: "9D56" }
580.1 "Shell Crusher" Ability { id: "9D5E" }
588.5 "Shockwave Pulsar" Ability { id: "9D5A" }
596.8 "Black Halo" Ability { id: "9D62" }
605.9 "Spell-in-Waiting Refrain" Ability { id: "9D4D" }
621.2 "Apocalypse" Ability { id: "9D68" }
624.8 "Dark Water III" Ability { id: "9D4F" }
626.3 "Spirit Taker" Ability { id: "9D60" }
629.5 "--sync--" Ability { id: "9CB5" }
635.2 "Apocalypse (x6)" duration 10.0
637.9 "Dark Eruption" Ability { id: "9D52" }
643.7 "Dark Water III" Ability { id: "9D4F" }
646.0 "Darkest Dance (jump)" Ability { id: "9CF6" }
648.9 "Darkest Dance (knockback)" Ability { id: "9CF7" }
652.8 "Dark Water III" Ability { id: "9D4F" }
658.2 "Shockwave Pulsar" Ability { id: "9D5A" }
672.0 "Memory's End (enrage)" Ability { id: "9D6C" }
675.4 "--untargetable--"
# Phase Four
680.8 "--targetable--"
686.3 "--sync--" StartsUsing { id: "9D36" } window 686.3,5
689.2 "Materialization" Ability { id: "9D36" }
700.4 "Drachen Armor" Ability { id: "9CFA" }
702.9 "Akh Rhai" Ability { id: "9D2D" } duration 5.1
705.4 "Edge of Oblivion 1" Ability { id: "9CEE"  }
706.2 "--Oracle targetable--"
708.6 "--sync--" Ability { id: "9CEF" }
714.9 "Darklit Dragonsong" Ability { id: "9D2F" }
726.1 "Bright Hunger" Ability { id: "9D15" }
727.0 "The Path of Light" Ability { id: "9CFE" }
729.1 "Spirit Taker (jump)" Ability { id: "9D60" }
729.5 "Spirit Taker (damage)" Ability { id: "9D61" }
734.1 "Dark Water III + Hallowed Wings" Ability { id: "9D4F" }
737.7 "Somber Dance (far)" Ability { id: "9D5C" }
741.0 "Somber Dance (close)" Ability { id: "9D5D" }
744.4 "Edge of Oblivion 2" Ability { id: "9CEE"  }
745.4 "--Oracle center--" Ability { id: "9CB5" }
750.7 "Akh Morn (x5)" Ability { id: "9D6E" } duration 3.9
760.8 "Morn Afah" Ability { id: "9D70" }
765.1 "--reposition--" Ability { id: "9CB5" }
776.3 "Crystallize Time" Ability { id: "9D30" }
779.3 "--Usurper untargetable--"
780.3 "--Oracle untargetable--"
782.4 "Edge of Oblivion 3" Ability { id: "9CEE"  }
788.3 "Maelstrom (fast)" Ability { id: "9D6B" }
789.3 "Dark Water III" Ability { id: "9D4F" }
791.3 "Dark Blizzard III + Dark Eruption + Dark Aero III" Ability { id: "9D57" }
793.4 "--sync--" Ability { id: "9CEF" }
793.9 "Maelstrom (normal)" Ability { id: "9D6B" }
794.3 "Unholy Darkness" Ability { id: "9D55" }
797.7 "Tidal Light (x4)" Ability { id: "9D3B" } duration 6
798.8 "Maelstrom (slow)" Ability { id: "9D6B" }
799.8 "--sync--" Ability { id: "9CEF" }
804.0 "Tidal Light (x4)" Ability { id: "9D3B" } duration 6
808.2 "Quietus" Ability { id: "9D59" }
810.2 "(rewind drop)"
813.8 "Spirit Taker" Ability { id: "9D61" }
817.2 "(stun + rewind)"
819.4 "Hallowed Wings 1" Ability { id: "9D8C" }
824.0 "Hallowed Wings 2" Ability { id: "9D8C" }
828.1 "--center--" Ability { id: "9CB5" }
829.4 "--targetable--"
833.3 "Akh Morn (x5)" Ability { id: "9D6E" } duration 3.9
841.3 "Edge of Oblivion 4" Ability { id: "9CEE"  }
843.3 "Morn Afah" Ability { id: "9D70" }
846.5 "--sync--" StartsUsing { id: ["9D71", "9D35"] }
856.5 "Memory's End + Absolute Zero (enrage)" Ability { id: ["9D71","9D35"] }
956.0 "--sync--" ActorControlExtra { category: "0197", param1: "1E43" } window 150,5 # limited lookbehind due to re-use
962.0 "(stun + cutscene)" Ability { id: "9D28" } window 962,5
# Phase 5
1029.6 "--targetable--"
1034.8 "--sync--" StartsUsing { id: "9D72" } window 1034.8,5
1040.8 "Fulgent Blade" Ability { id: "9D72" }
# Depending on where the Path of Darkness/Light starts, the duration can range from 18.3s to 22.5s
# The tail end of this is largely irrelevant since the abilities are used at the far perimeter of the arena.
# But to simplify, use a duration of 20.4 (the midpoint).
1052.0 "The Path of Darkness + The Path of Light" Ability { id: "9CB6" } duration 20.4
1067.8 "Akh Morn" Ability { id: "9D76" }
1076.0 "Paradise Regained" Ability { id: "9D7F" }
1086.0 "Wings Dark and Light" Ability { id: ["9D29", "9D79"] }
1086.4 "Explosion" Ability { id: "9D80" }
1089.9 "Wings Dark and Light + Explosion" Ability { id: "9D80" }
1093.4 "Explosion" Ability { id: "9D80" }
1107.4 "Polarizing Strikes" Ability { id: "9D7C" } duration 2.7
1112.0 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1116.6 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1121.2 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1141.7 "Pandora's Box" Ability { id: "9D86" }
1153.8 "Fulgent Blade" Ability { id: "9D72" }
1164.9 "The Path of Darkness + The Path of Light" Ability { id: "9CB6" } duration 20.4
1180.7 "Akh Morn" Ability { id: "9D76" }
1193.0 "Paradise Regained" Ability { id: "9D7F" }
1203.0 "Wings Dark and Light" Ability { id: ["9D29", "9D79"] }
1203.4 "Explosion" Ability { id: "9D80" }
1206.9 "Wings Dark and Light + Explosion" Ability { id: "9D80" }
1210.4 "Explosion" Ability { id: "9D80" }
1219.2 "Polarizing Strikes" Ability { id: "9D7C" } duration 2.7
1223.8 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1228.4 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1233.0 "Polarizing Paths" Ability { id: "9D2A" } duration 2.7
1244.3 "Fulgent Blade" Ability { id: "9D72" }
1255.3 "The Path of Darkness + The Path of Light" Ability { id: "9CB6" } duration 20.4
1271.3 "Akh Morn" Ability { id: "9D76" }
1279.8 "--sync--" StartsUsing { id: "9D88" }
1301.3 "Paradise Lost (enrage)" Ability { id: "9D88" }`,
  overrideTimelineFile: true,
  triggers: [
    // #region 通用
    {
      id: 'Souma 绝伊甸 Headmarker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.soumaDecOffset === undefined,
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'Souma 绝伊甸 阶段控制',
      type: 'StartsUsing',
      // 9CFF = P2 四剑斩
      // 9D49 = P3 地狱审判
      // 9D36 = P4 赋形
      // 9D72 = P5 光尘之剑
      netRegex: { id: ['9CFF', '9D49', '9D36', '9D72'], capture: true },
      suppressSeconds: 20,
      run: (data, matches) => {
        switch (matches.id) {
          case '9CFF':
          {
            data.soumaPhase = 'P2';
            data.soumaCombatantData = [];
            data.soumaP1线存储.length = 0;
            data.soumaP1线处理 = undefined;
            data.soumaP1雾龙ids.length = 0;
            data.soumaP1雾龙属性 = undefined;
            data.soumaP1塔.length = 0;
            break;
          }
          case '9D49':
          {
            data.soumaPhase = 'P3';
            data.soumaCombatantData = [];
            data.soumaP2DD处理 = undefined;
            data.soumaP2镜中奇遇 = false;
            data.soumaP2镜中奇遇分身.length = 0;
            data.soumaP2光之暴走连线.length = 0;
            data.soumaP2光暴过量光层数 = 0;
            data.soumaP2冰圈初始位置 = undefined;
            data.soumaP2冰圈初始位置DirNum.length = 0;
            data.soumaP2冰花点名.length = 0;
            data.soumaP2钢月 = undefined;
            break;
          }
          case '9D36':
          {
            data.soumaPhase = 'P4';
            data.soumaCombatantData = [];
            data.soumaP3MyDir = undefined;
            data.soumaP3一运buff = {};
            data.soumaP3二运水.length = 0;
            data.soumaP3水分组结果左.length = 0;
            data.soumaP3水分组结果右.length = 0;
            data.soumaP3线存储.length = 0;
            data.soumaP3处理.length = 0;
            data.soumaP3沙漏 = {};
            break;
          }
          case '9D72':
          {
            data.soumaPhase = 'P5';
            data.soumaCombatantData = [];
            data.soumaP4光之暴走连线.length = 0;
            data.soumaP4黑暗狂水.length = 0;
            data.soumaP4二运buff = {};
            data.soumaP4二运机制 = undefined;
            data.soumaP4沙漏 = {};
            data.soumaP4地火.length = 0;
            break;
          }
        }
      },
    },
    // #endregion 通用
    // #region P1
    {
      id: 'Souma 绝伊甸 P1 老父亲AOE',
      type: 'StartsUsing',
      netRegex: { id: '9CEA' },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Souma 绝伊甸 P1 火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CD0', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '火：八方 => 与搭档分摊',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CD0', capture: false },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '与搭档分摊',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CD4', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '雷：八方 => 分散',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CD4', capture: false },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '分散',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 死刑',
      type: 'StartsUsing',
      netRegex: { id: '9CE8' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Souma 绝伊甸 P1 连锁爆印刻',
      type: 'GainsEffect',
      netRegex: { effectId: '1046' },
      condition: (data, matches) => {
        return data.role === 'tank' || matches.target === data.me;
      },
      delaySeconds: 13,
      alarmText: (data, matches, output) => {
        if (matches.target === data.me) {
          return output.me();
        }
        return output.text({ player: data.party.member(matches.target).job });
      },
      outputStrings: {
        me: { en: '爆印死刑' },
        text: {
          en: '死刑：靠近 ${player}',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙属性记忆',
      type: 'StartsUsing',
      netRegex: { id: ['9CDB', '9CDA'] },
      infoText: (data, matches, output) => {
        data.soumaP1雾龙属性 = matches.id === '9CDB' ? 'thunder' : 'fire';
        return output[data.soumaP1雾龙属性]();
      },
      outputStrings: {
        fire: { en: '火：稍后分组分摊' },
        thunder: { en: '雷：稍后分散' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙属性记忆第二次提醒',
      type: 'StartsUsing',
      netRegex: { id: ['9CDB', '9CDA'], capture: false },
      delaySeconds: 11,
      durationSeconds: 8,
      alertText: (data, _matches, output) => {
        if (data.soumaP1雾龙属性 === undefined) {
          throw new UnreachableCode();
        }
        return output[data.soumaP1雾龙属性]();
      },
      run: (data) => {
        data.soumaP1雾龙属性 = undefined;
      },
      outputStrings: {
        fire: { en: '分组分摊' },
        thunder: { en: '分散' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙',
      type: 'StartsUsing',
      netRegex: { id: '9CDE' },
      condition: (data) => data.triggerSetConfig.启用雾龙报安全区,
      preRun: (data, matches) => {
        data.soumaP1雾龙ids.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP1雾龙ids.length === 3) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants.filter((v) => v.WeaponId === 4);
        }
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP1雾龙ids.length === 3) {
          const shadows = data.soumaCombatantData.map((v) => {
            const dir = Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 100);
            const opposite = (dir + 4) % 8;
            return { dir, opposite };
          });
          const allDirs = [0, 1, 2, 3, 4, 5, 6, 7];
          const safeDirs = allDirs.filter((dir) => {
            return shadows.every((v) => v.dir !== dir && v.opposite !== dir);
          });
          data.soumaCombatantData = [];
          return output[safeDirs.join('')]();
        }
      },
      outputStrings: {
        '04': { 'en': 'A、C安全' },
        '15': { 'en': '4、2安全' },
        '26': { 'en': 'D、B安全' },
        '37': { 'en': '1、3安全' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9D8A', capture: false },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '雷：八方 => 分散' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9D8A', capture: false },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '分散' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9D89', capture: false },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '火：八方 => 与搭档分摊' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9D89', capture: false },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '与搭档分摊' } },
    },
    {
      id: 'Souma 绝伊甸 P1一运光轮颜色',
      type: 'StartsUsing',
      netRegex: { id: '9CD[67]' },
      delaySeconds: 6,
      durationSeconds: 12,
      infoText: (_data, matches, output) => {
        const color = matches.id === '9CD6' ? 'fire' : 'thunder';
        return output[color]();
      },
      outputStrings: {
        'fire': { en: '找蓝色' },
        'thunder': { en: '找红色' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1一运火击退',
      type: 'StartsUsing',
      netRegex: { id: '9CE1', capture: false },
      delaySeconds: 9,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '靠近',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 连线',
      type: 'Tether',
      netRegex: {
        // 00F9 火
        // 011F 冰
        'id': ['00F9', '011F'],
      },
      condition: (data) => data.soumaPhase === 'P1',
      preRun: (data, matches) => {
        data.soumaP1线存储.push(matches);
      },
      durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          switch: { en: '换换换！' },
          fire: { en: '火' },
          thunder: { en: '雷' },
          line1: { en: '1${el}：上↑正点' },
          line2: { en: '2${el}：下↓正点' },
          line3: { en: '3${el}：上↑最外' },
          line4: { en: '4${el}：下↓最外 ${handleOrder}' },
          nothing1: { en: '闲1：上↑' },
          nothing2: { en: '闲2：上↑' },
          nothing3: { en: '闲3：下↓' },
          nothing4: { en: '闲4：下↓' },
          handleEl: { en: '${el1} => ${el2}' },
          text: { en: '${switcherRes}（分摊点：${lines}）' },
          needSwitch: { en: '${rp}换' },
          dontSwitch: { en: '不用换' },
          stack: { en: '分摊点名（不用换）' },
          stackHigh: { en: '高优先级：近A' },
          stackDown: { en: '低优先级：近C' },
          handleOrder: { en: '${gimmick} ${handleOrder}' },
        };
        // 第一次连线机制 双分摊
        if (data.soumaP1线存储.length === 2) {
          const northGroup = data.triggerSetConfig.P1双火线上半场组.toString().split(/[,\\/，]/).map((
            v,
          ) => (v.trim().toUpperCase()));
          const southGroup = data.triggerSetConfig.P1双火线下半场组.toString().split(/[,\\/，]/).map((
            v,
          ) => (v.trim().toUpperCase()));
          const rule = [...northGroup, ...southGroup];
          const lines = data.soumaP1线存储.map((v) => getRpByName(data, v.target)).sort((a, b) =>
            rule.indexOf(a) - rule.indexOf(b)
          );
          const northCount = lines.filter((v) => northGroup.includes(v)).length;
          let switcher;
          if (northCount === 0) {
            switcher = data.triggerSetConfig.P1双火线上半场组换位人.toString();
          } else if (northCount === 2) {
            switcher = data.triggerSetConfig.P1双火线下半场组换位人.toString();
          }
          const povRp = getRpByName(data, data.me);
          if (lines[0] === povRp) {
            // if (switcher === undefined)
            //   return { alertText: output.stack!() };
            return { alarmText: output.stackHigh() };
          }
          if (lines[1] === povRp) {
            // if (switcher === undefined) {
            //   return { alertText: output.stack!() };
            // }
            return { alarmText: output.stackDown() };
          }
          if (switcher === povRp) {
            return { alarmText: output.switch() };
          }
          const switcherRes = switcher !== undefined
            ? output.needSwitch({ rp: switcher })
            : output.dontSwitch();
          return {
            infoText: output.text({ switcherRes: switcherRes, lines: lines.join(', ') }),
            tts: switcher === povRp ? output.switch() : switcherRes,
          };
        }
        // 第二次连线机制 四根雷火线
        if (data.soumaP1线存储.length === 3) {
          // console.debug('P1线');
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[2].targetId, 16),
              data.triggerSetConfig.伊甸P1标线1.toString(),
              false,
            );
          if (data.soumaP1线存储[2]?.target === data.me) {
            data.soumaP1线处理 = '线1';
            const element = data.soumaP1线存储[2].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line1({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 4) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[3].targetId, 16),
              data.triggerSetConfig.伊甸P1标线2.toString(),
              false,
            );
          if (data.soumaP1线存储[3]?.target === data.me) {
            data.soumaP1线处理 = '线2';
            const element = data.soumaP1线存储[3].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line2({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 5) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[4].targetId, 16),
              data.triggerSetConfig.伊甸P1标线3.toString(),
              false,
            );
          if (data.soumaP1线存储[4]?.target === data.me) {
            data.soumaP1线处理 = '线3';
            const element = data.soumaP1线存储[4].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line3({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 6) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开') {
            mark(
              parseInt(data.soumaP1线存储[5].targetId, 16),
              data.triggerSetConfig.伊甸P1标线4.toString(),
              false,
            );
            clearMark(15);
          }
          if (data.soumaP1线存储[5]?.target === data.me) {
            data.soumaP1线处理 = '线4';
          }
          const lines = data.soumaP1线存储.slice(2, 6);
          const targetsIds = lines.map((v) => v.targetId);
          const nothingRule = data.triggerSetConfig.P1连线机制闲人优先级.toString().split(/[,\\/，]/).map((
            v,
          ) => (v.trim().toUpperCase()));
          const nothing = data.party.details.filter((v) => !targetsIds.includes(v.id)).sort(
            (a, b) => {
              return nothingRule.indexOf(getRpByName(data, a.name)) -
                nothingRule.indexOf(getRpByName(data, b.name));
            },
          );
          if (nothing.length !== 4) {
            throw new Error('nothing长度不等于4');
          }
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(parseInt(nothing[0].id, 16), data.triggerSetConfig.伊甸P1标闲1.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(parseInt(nothing[1].id, 16), data.triggerSetConfig.伊甸P1标闲2.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(parseInt(nothing[2].id, 16), data.triggerSetConfig.伊甸P1标闲3.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(parseInt(nothing[3].id, 16), data.triggerSetConfig.伊甸P1标闲4.toString(), false);
          if (nothing[0]?.name === data.me) {
            data.soumaP1线处理 = '闲1';
          }
          if (nothing[1]?.name === data.me) {
            data.soumaP1线处理 = '闲2';
          }
          if (nothing[2]?.name === data.me) {
            data.soumaP1线处理 = '闲3';
          }
          if (nothing[3]?.name === data.me) {
            data.soumaP1线处理 = '闲4';
          }
          const handler = {
            '线1': [1, 3],
            '线2': [2, 4],
            '线3': [1, 3],
            '线4': [2, 4],
            '闲1': [1, 3],
            '闲2': [1, 3],
            '闲3': [2, 4],
            '闲4': [2, 4],
          };
          const playerHandle = handler[data.soumaP1线处理];
          const elements = data.soumaP1线存储.map((v) => v.id === '00F9' ? 'fire' : 'thunder').slice(
            2,
            6,
          ).map((v) => output[v]());
          const youIsNothing = nothing.findIndex((v) => v.name === data.me);
          const gimmick = `${
            youIsNothing >= 0 ? output[`nothing${(youIsNothing + 1).toString()}`]() : ''
          }`;
          const handleOrder = output.handleEl({
            el1: elements[playerHandle[0] - 1],
            el2: elements[playerHandle[1] - 1],
          });
          if (data.soumaP1线存储[5]?.target === data.me) {
            const element = data.soumaP1线存储[5].id === '00F9' ? 'fire' : 'thunder';
            return {
              alertText: output.line4({ el: output[element](), handleOrder: handleOrder }),
            };
          }
          return {
            infoText: output.handleOrder({ gimmick, handleOrder }),
            // tts: gimmick,
          };
        }
        return undefined;
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CC1', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '火：两侧 => 中间击退',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CC1', capture: false },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '靠近',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CC5', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '雷：两侧 => 两侧远离',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CC5', capture: false },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '远离',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 狂暴',
      type: 'StartsUsing',
      netRegex: { id: '9CC0', capture: false },
      condition: (data) => data.soumaPhase === 'P1',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '狂暴',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔 collect',
      type: 'StartsUsing',
      netRegex: {
        id: Object.keys(p1Towers),
        capture: true,
      },
      condition: (data) => data.soumaPhase === 'P1' && data.role !== 'tank',
      preRun: (data, matches) => {
        data.soumaP1塔.push({
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          count: p1Towers[matches.id],
        });
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔',
      type: 'StartsUsingExtra',
      netRegex: {
        id: Object.keys(p1Towers),
        capture: false,
      },
      condition: (data) => data.soumaPhase === 'P1' && data.role !== 'tank',
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const towers = data.soumaP1塔.sort((a, b) => a.y - b.y).slice();
        if (towers.length !== 3) {
          return output.unknown();
        }
        if (data.triggerSetConfig.伊甸P1踩塔基准 === 'simple') {
          return output.simple({
            c1: towers[0].count,
            c2: towers[1].count,
            c3: towers[2].count,
          });
        }
        let priority = data.triggerSetConfig.伊甸P1踩塔填充优先级.toString().split(/[,\\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const rp = getRpByName(data, data.me);
        const seat = [
          Array.from({ length: towers[0].count }),
          Array.from({ length: towers[1].count }),
          Array.from({ length: towers[2].count }),
        ];
        if (data.triggerSetConfig.伊甸P1踩塔基准 === 'mmw') {
          const fixed = [
            data.triggerSetConfig.伊甸P1踩塔补位式固定北塔.toString(),
            data.triggerSetConfig.伊甸P1踩塔补位式固定中塔.toString(),
            data.triggerSetConfig.伊甸P1踩塔补位式固定南塔.toString(),
          ];
          priority = priority.filter((v) => !fixed.includes(v));
          seat[0][0] = fixed[0];
          seat[1][0] = fixed[1];
          seat[2][0] = fixed[2];
        }
        for (let i = 0; i < seat.length; i++) {
          for (let j = 0; j < seat[i].length; j++) {
            if (seat[i][j] === undefined) {
              seat[i][j] = priority.shift();
            }
          }
        }
        const myIndex = seat.findIndex((v) => v.includes(rp));
        return output[`place${myIndex}`]();
      },
      run: (data) => {
        data.soumaP1塔.length = 0;
      },
      outputStrings: {
        unknown: { en: '踩塔' },
        simple: { en: '塔：${c1} ${c2} ${c3}' },
        place0: { en: '踩 北 塔' },
        place1: { en: '踩 中间 塔' },
        place2: { en: '踩 南 塔' },
      },
    },
    // #endregion P1
    // #region P2
    {
      id: 'Souma 伊甸 P2 死刑',
      type: 'StartsUsing',
      netRegex: { id: '9CFF' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'Souma 伊甸 P2 钻石星辰',
      type: 'StartsUsing',
      netRegex: { id: '9D05' },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'Souma 伊甸 P2 冰圈初始点',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        pair: [
          { key: 'BNpcNameID', value: '3209' },
        ],
        capture: true,
      },
      condition: (data, matches) =>
        matches.change === 'Change' && data.soumaPhase === 'P2' && matches.pairPosX !== undefined &&
        matches.pairPosY !== undefined,
      suppressSeconds: 30,
      run: (data, matches) => {
        const { pairPosX: x, pairPosY: y } = matches;
        const dirNum = Directions.xyTo8DirNum(parseFloat(x), parseFloat(y), 100, 100);
        const sortRule = [0, 7, 6, 5, 4, 3, 2, 1];
        data.soumaP2冰圈初始位置DirNum = [dirNum, (dirNum + 4) % 8].sort((a, b) =>
          sortRule.indexOf(a) - sortRule.indexOf(b)
        );
        data.soumaP2冰圈初始位置 = dirNum % 2 === 0 ? '正' : '斜';
      },
    },
    {
      id: 'Souma 伊甸 P2 钢铁还是月环',
      type: 'StartsUsing',
      netRegex: { id: ['9D0A', '9D0B'] },
      run: (data, matches) => {
        data.soumaP2钢月 = matches.id === '9D0A' ? '钢铁' : '月环';
      },
    },
    {
      id: 'Souma 伊甸 P2 冰花点名',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === 'P2' && getHeadmarkerId(data, matches) === headmarkers.冰花,
      preRun: (data, matches) => {
        data.soumaP2冰花点名.push(matches);
      },
      delaySeconds: 0.4,
      alarmText: (data, _matches, output) => {
        if (data.soumaP2冰花点名.length === 4) {
          const 冰花RP = data.soumaP2冰花点名.map((v) => getRpByName(data, v.target));
          const 冰花职能 = ['MT', 'ST', 'H1', 'H2'].find((v) => 冰花RP.includes(v))
            ? 'TH'
            : 'DPS';
          const 冰花去 = data.soumaP2冰圈初始位置 === '正' ? output.斜() : output.正();
          const 水波去 = data.soumaP2冰圈初始位置;
          const 玩家职能 = data.role === 'dps' ? 'DPS' : 'TH';
          data.soumaP2冰花点名.length = 0;
          data.soumaP2DD处理 = 玩家职能 === 冰花职能 ? '冰花' : '水波';
          return 玩家职能 === 冰花职能
            ? output.冰花({ go: output[data.soumaP2钢月](), direction: 冰花去 })
            : output.水波({ go: output[data.soumaP2钢月](), direction: 水波去 });
        }
      },
      outputStrings: {
        钢铁: { en: '钢铁外' },
        月环: { en: '月环内' },
        正: { en: '正' },
        斜: { en: '斜' },
        水波: { en: '${go} + ${direction} 水波(靠近)' },
        冰花: { en: '${go} + ${direction} 冰花(远离)' },
      },
    },
    {
      id: 'Souma 伊甸 P2 冰花点名2',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === 'P2' && getHeadmarkerId(data, matches) === headmarkers.冰花,
      delaySeconds: 5.5,
      suppressSeconds: 999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          冰花: { en: '放冰花' },
          水波: { en: '去场中' },
        };
        if (data.soumaP2DD处理 === '冰花') {
          return { alarmText: output.冰花() };
        }
        return { infoText: output.水波() };
      },
    },
    {
      id: 'Souma 伊甸 P2 击退',
      type: 'StartsUsing',
      netRegex: { id: '9D05', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 17,
      durationSeconds: 5,
      alarmText: (data, _matches, output) => {
        return output.text({ dir: data.soumaP2冰圈初始位置DirNum.map((v) => output[v]()).join('/') });
      },
      outputStrings: {
        text: { en: '${dir}击退' },
        0: Outputs.north,
        1: Outputs.northeast,
        2: Outputs.east,
        3: Outputs.southeast,
        4: Outputs.south,
        5: Outputs.southwest,
        6: Outputs.west,
        7: Outputs.northwest,
      },
    },
    {
      id: 'Souma 伊甸 P2 击退分身',
      type: 'StartsUsing',
      netRegex: { id: '9D10' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 3,
      durationSeconds: 9,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          0: { en: '<= 顺180' },
          180: { en: '<= 顺180' },
          135: { en: '<= 顺135' },
          90: { en: '<= 顺90' },
          45: { en: '反跑！逆135 =>' },
        };
        const { x, y } = matches;
        const num = Directions.xyTo8DirNum(parseFloat(x), parseFloat(y), 100, 100);
        const dir = data.soumaP2冰圈初始位置DirNum;
        let index = 0;
        for (let i = 0; i < 8; i++) {
          const d = (dir[0] + i) % 8;
          if (d === num || d === (num + 4) % 8) {
            index = i;
            break;
          }
        }
        const angle = index * 45;
        if (angle === 45) {
          return { alarmText: output[angle]() };
        }
        return { infoText: output[angle]() };
      },
    },
    {
      id: 'Souma 伊甸 P2 4连分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D10' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '连续分摊（4次）' },
      },
    },
    {
      id: 'Souma 伊甸 P2 背对',
      type: 'StartsUsing',
      netRegex: { id: '9D10', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 12,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '背对场外分身' },
      },
    },
    {
      id: 'Souma 伊甸 P2 静后',
      type: 'StartsUsing',
      netRegex: { id: '9D01' },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'Souma 伊甸 P2 闲前',
      type: 'StartsUsing',
      netRegex: { id: '9D02' },
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'Souma 伊甸 P2 直线分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D12', capture: false },
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '直线分摊' },
      },
    },
    {
      id: 'Souma 伊甸 P2 镜中奇遇',
      type: 'StartsUsing',
      netRegex: { id: '9CF3' },
      condition: (data) => data.soumaPhase === 'P2',
      preRun: (data, _matches) => {
        data.soumaP2镜中奇遇 = true;
        // console.log(_matches.timestamp);
      },
    },
    {
      id: 'Souma 伊甸 P2 镜中奇遇分身',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        capture: true,
      },
      condition: (data, matches) => {
        if (!data.soumaP2镜中奇遇 || data.soumaPhase !== 'P2' || matches.change !== 'Change') {
          return false;
        }
        const attrs = [
          'type',
          'timestamp',
          'change',
          'id',
          'pairHeading',
          'pairPosX',
          'pairPosY',
          'pairPosZ',
        ];
        return attrs.every((a) => matches[a]);
      },
      preRun: (data, matches) => {
        data.soumaP2镜中奇遇分身.push(matches);
      },
      delaySeconds: 0.5,
      durationSeconds: 20,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) =>
          v.BNpcNameID === 9317 && v.BNpcID === 17825 &&
          data.soumaP2镜中奇遇分身.find((w) => parseInt(w.id, 16) === v.ID) &&
          !(v.PosX === 100 && v.PosY === 100)
        );
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP2镜中奇遇 && data.soumaCombatantData.length > 1) {
          const kagami = data.soumaCombatantData.sort((a, b) => a.ID - b.ID);
          // console.log(kagami.slice());
          const dirs = kagami.map((v) => Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 100));
          const blue = dirs[0];
          const reds = dirs.slice(1);
          const group = ['MT', 'ST', 'D1', 'D2'].includes(getRpByName(data, data.me)) ? '近战' : '远程';
          const start = group === '近战' ? (blue + 4) % 8 : blue;
          // 找到距离start最近的红
          let minDist = 999;
          let minI = 999;
          let end = 999;
          reds.forEach((v) => {
            const d = Math.abs(v - start);
            const dd = d < 4 ? d : 8 - d;
            if (dd < minDist) {
              minDist = dd;
              end = v;
            }
            // 距离相同时，去逆时针方向
            if (dd === minDist) {
              for (let i = 0; i < 8; i++) {
                if (((start - i) + 8) % 8 === v) {
                  if (i < minI) {
                    minI = i;
                    end = ((start - i) + 8) % 8;
                  }
                  break;
                }
              }
            }
          });
          // console.log(
          //   `timestamp: ${_matches.timestamp}, blue: ${blue}, reds: ${
          //     reds.join(',')
          //   }, start: ${start}, end: ${end}`,
          // );
          data.soumaP2镜中奇遇 = false;
          data.soumaCombatantData.length = 0;
          return output.text({ dir1: output[start](), dir2: output[end]() });
        }
      },
      outputStrings: {
        text: { en: '${dir1} => ${dir2}' },
        0: Outputs.north,
        1: Outputs.northeast,
        2: Outputs.east,
        3: Outputs.southeast,
        4: Outputs.south,
        5: Outputs.southwest,
        6: Outputs.west,
        7: Outputs.northwest,
      },
    },
    {
      id: 'Souma 伊甸 P2 强放逐 分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D1C', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      durationSeconds: 6,
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.stackPartner,
      },
    },
    {
      id: 'Souma 伊甸 P2 强放逐 分散',
      type: 'StartsUsing',
      netRegex: { id: '9D1D', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      durationSeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.spread,
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走',
      type: 'StartsUsing',
      netRegex: { id: '9D14' },
      condition: (data) => data.soumaPhase === 'P2',
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'Souma 伊甸 P2 光之暴走连线',
      type: 'Tether',
      netRegex: { id: '006E' },
      condition: (data) => data.soumaPhase === 'P2' && data.triggerSetConfig.伊甸P2光暴打法 === 'mgl',
      preRun: (data, matches) => {
        data.soumaP2光之暴走连线.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP2光之暴走连线.length === 6) {
          const combatants = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          data.soumaCombatantData = combatants.filter((v) =>
            data.party.nameToRole_[v.Name] && v.ID.toString(16).startsWith('1')
          );
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          圈: { en: '放圈' },
          上1: { en: '上1：去左上↖' },
          上2: { en: '上2：去下中↓' },
          上3: { en: '上3：去右上↗' },
          下1: { en: '下1：去右下↘' },
          下2: { en: '下2：去上中↑' },
          下3: { en: '下3：去左下↙' },
          // 备用1: { en: '上1：去左上↖' },
          // 备用2: { en: '上2：去下中↓' },
          // 备用3: { en: '上3：去右上↗' },
          // 备用4: { en: '下3：去左下↙' },
          // 备用5: { en: '下2：去上中↑' },
          // 备用6: { en: '下1：去右下↘' },
          unknown: { en: '未知，自己看' },
          error: { en: '出错了，自己看' },
        };
        if (data.soumaP2光之暴走连线.length === 6) {
          const upperHalfPlayerCount = data.soumaCombatantData.filter((player) =>
            player.PosY < 100
          ).length;
          const lowerHalfPlayerCount = data.soumaCombatantData.filter((player) =>
            player.PosY >= 100
          ).length;
          if (upperHalfPlayerCount === 4 && lowerHalfPlayerCount === 4) {
            // 99%的情况：上下半场站好了各4个人，以当时x轴排序，以保证站错了也能标出可以处理的标点，如果站的对就跟攻略解法的result一样。
            const sortGroup = ['TN', 'DPS'];
            const lightRampant = data.soumaP2光之暴走连线.map((v) => {
              const x = data.soumaCombatantData.find((w) => w.ID === parseInt(v.sourceId, 16)).PosX;
              const y = data.soumaCombatantData.find((w) => w.ID === parseInt(v.sourceId, 16)).PosY;
              const rp = getRpByName(data, v.source);
              const role = ['MT', 'ST', 'H1', 'H2'].includes(rp) ? 'TN' : 'DPS';
              return {
                decId: parseInt(v.sourceId, 16),
                name: v.source,
                rp: rp,
                role: role,
                x: x,
                y: y,
              };
            }).sort((a, b) => {
              if (a.role === b.role) {
                return a.x - b.x;
              }
              return sortGroup.indexOf(a.role) - sortGroup.indexOf(b.role);
            });
            const topGroup = lightRampant.filter((v) => v.y < 100);
            const bottomGroup = lightRampant.filter((v) => v.y >= 100);
            if (topGroup.length === 2) {
              topGroup.push(bottomGroup.pop());
            }
            if (bottomGroup.length === 2) {
              bottomGroup.push(topGroup.pop());
            }
            if (data.triggerSetConfig.伊甸P2光暴机制标点 === '开') {
              // console.debug('P2光暴');
              mark(topGroup[0].decId, markTypeOptions.锁链1, false);
              mark(topGroup[1].decId, markTypeOptions.攻击2, false);
              mark(topGroup[2].decId, markTypeOptions.锁链3, false);
              mark(bottomGroup[0].decId, markTypeOptions.攻击3, false);
              mark(bottomGroup[1].decId, markTypeOptions.锁链2, false);
              mark(bottomGroup[2].decId, markTypeOptions.攻击1, false);
              clearMark(18);
            }
            data.soumaP2光之暴走连线.length = 0;
            const player = lightRampant.find((v) => v.name === data.me);
            if (player === undefined) {
              return { alarmText: output.圈() };
            }
            const playerGroup = topGroup.find((v) => v.name === data.me) ? 'top' : 'bottom';
            const index = [...topGroup, ...bottomGroup].findIndex((v) => v.name === data.me) % 3 +
              1;
            if (index === 0) {
              console.error(data.me, playerGroup, topGroup, bottomGroup);
              return { infoText: output.unknown(), tts: null };
            }
            return { infoText: output[`${playerGroup === 'bottom' ? '下' : '上'}${index}`]() };
          }
          // 有SB连上下站位都没做到，则无视攻略，暴力标出一套可以处理的标点
          console.error('有人没按上下分组站位，光之暴走进入备用逻辑');
          const lr = data.soumaP2光之暴走连线.map((v) => ({
            name: v.source,
            decId: parseInt(v.sourceId, 16),
          }));
          if (data.triggerSetConfig.伊甸P2光暴机制标点 === '开') {
            mark(lr[0].decId, data.triggerSetConfig.伊甸P2光暴标上1.toString(), false);
            mark(lr[1].decId, data.triggerSetConfig.伊甸P2光暴标上2.toString(), false);
            mark(lr[2].decId, data.triggerSetConfig.伊甸P2光暴标上3.toString(), false);
            mark(lr[3].decId, data.triggerSetConfig.伊甸P2光暴标下1.toString(), false);
            mark(lr[4].decId, data.triggerSetConfig.伊甸P2光暴标下2.toString(), false);
            mark(lr[5].decId, data.triggerSetConfig.伊甸P2光暴标下3.toString(), false);
            clearMark(18);
          }
          // const index = lr.findIndex((v) => v.name === data.me);
          data.soumaP2光之暴走连线.length = 0;
          data.soumaCombatantData = [];
          // if (index === -1) {
          return { infoText: output.error(), tts: null };
          // }
          // 好像不对  算了不报了
          // return { infoText: output[`备用${index + 1}`]!() };
        }
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走连线灰9',
      type: 'Tether',
      netRegex: { id: '006E' },
      condition: (data) => data.soumaPhase === 'P2' && data.triggerSetConfig.伊甸P2光暴打法 === 'gray9',
      preRun: (data, matches) => {
        data.soumaP2光之暴走连线.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP2光之暴走连线.length === 6) {
          const combatants = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          data.soumaCombatantData = combatants.filter((v) =>
            data.party.nameToRole_[v.Name] && v.ID.toString(16).startsWith('1')
          );
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          '圈': { en: '放圈' },
          'MT': { en: 'C//' },
          'D4': { en: '1C/' },
          'ST': { en: '21C' },
          'D2': { en: '421' },
          'H2': { en: '342' },
          'D1': { en: 'A34' },
          'H1': { en: '/A3' },
          'D3': { en: '//A' },
          'text': { en: '${t}' },
          'A': { en: '上(A点)塔' },
          'B': { en: '右(B点)塔' },
          'C': { en: '下(C点)塔' },
          'D': { en: '左(D点)塔' },
          '1': { en: '左上(1点)塔' },
          '2': { en: '右上(2点)塔' },
          '3': { en: '右下(3点)塔' },
          '4': { en: '左下(4点)塔' },
        };
        if (data.soumaP2光之暴走连线.length === 6) {
          const dialPad = data.triggerSetConfig.伊甸P2光暴灰九拨号盘.toString().split(/[,\\/，]/).map((
            v,
          ) => (v.trim().toUpperCase()));
          const lightRampant = data.soumaP2光之暴走连线.map((v) => ({
            decId: parseInt(v.sourceId, 16),
            name: v.source,
            rp: getRpByName(data, v.source),
          })).sort((a, b) => dialPad.indexOf(a.rp) - dialPad.indexOf(b.rp));
          data.soumaP2光之暴走连线.length = 0;
          data.soumaCombatantData.length = 0;
          const player = lightRampant.find((v) => v.name === data.me);
          if (player === undefined) {
            return { alarmText: output.圈() };
          }
          const index = dialPad.indexOf(player.rp);
          const lightIndex = lightRampant.findIndex((v) => v.rp === player.rp);
          const diff = index - lightIndex;
          const password = output[player.rp]().at(diff);
          const t = output[password]();
          const infoText = output.text({ t });
          return { infoText };
        }
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走层数',
      type: 'GainsEffect',
      netRegex: { effectId: '8D1' },
      condition: (data, matches) => data.soumaPhase === 'P2' && data.me === matches.target,
      run: (data, matches) => {
        data.soumaP2光暴过量光层数 = parseInt(matches.count, 16);
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走踩塔',
      type: 'StartsUsing',
      netRegex: { id: '9D14', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 26,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          踩塔: { en: '去踩塔！' },
          不踩: { en: '不踩' },
        };
        return data.soumaP2光暴过量光层数 === 2 ? { alarmText: output.踩塔() } : { infoText: output.不踩() };
      },
    },
    {
      id: 'Souma 伊甸 P2 光之海啸',
      type: 'StartsUsing',
      netRegex: { id: '9DFD', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '八方分散',
        },
      },
    },
    {
      id: 'Souma 伊甸 P2 绝对零度',
      type: 'StartsUsing',
      netRegex: { id: '9D20', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '狂暴 打到20%',
        },
      },
    },
    {
      id: 'Souma 伊甸 P2 无敌消失',
      type: 'LosesEffect',
      netRegex: { effectId: '307', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '打大冰（到50%）',
        },
      },
    },
    // 39.7秒狂暴读条 打到50%
    {
      id: 'Souma 伊甸 P2 光之泛滥1',
      type: 'StartsUsing',
      netRegex: { id: '9D43', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '5' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥2',
      type: 'StartsUsing',
      netRegex: { id: '9D43', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '4' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥3',
      type: 'StartsUsing',
      netRegex: { id: '9D43', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '3' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥4',
      type: 'StartsUsing',
      netRegex: { id: '9D43', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '2' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥5',
      type: 'StartsUsing',
      netRegex: { id: '9D43', capture: false },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '1' } },
    },
    {
      id: 'Souma 伊甸 P2 融合',
      type: 'NetworkCancelAbility',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 7,
      response: Responses.bigAoe('alert'),
    },
    // #endregion P2
    // #region P2.5
    {
      id: 'Souma 伊甸 P2.5 水波',
      type: 'StartsUsing',
      netRegex: { id: ['9D46', '9D42'], capture: false },
      condition: (data) =>
        data.soumaPhase === 'P2' && ['H1', 'H2', 'D3', 'D4'].includes(getRpByName(data, data.me)),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '水波' } },
    },
    // #endregion P2.5
    // #region P3
    {
      id: 'Souma 伊甸 P3 地狱审判',
      type: 'StartsUsing',
      netRegex: { id: '9D49', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '清1血',
        },
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝',
      type: 'StartsUsing',
      netRegex: { id: '9D4A' },
      response: Responses.bigAoe('alert'),
      run: (data) => {
        data.soumaP3阶段 = '一运';
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 BUFF',
      type: 'GainsEffect',
      netRegex: { effectId: Object.values(p3buffs) },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      preRun: (data, matches) => {
        (data.soumaP3一运buff[matches.target] ??= []).push(matches);
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 长时间提醒',
      type: 'GainsEffect',
      netRegex: { effectId: Object.values(p3buffs), capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 0.5,
      durationSeconds: 40,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          '回返圈': { en: '[1]' },
          '回返眼': { en: '[内]' },
          '回返水': { en: '[内]' },
          '短火口诀': { en: '2${back}0100' },
          '中火口诀': { en: '0${back}2001' },
          '长火口诀': { en: '010${back}20' },
          'TN冰口诀': { en: '0${back}0100' },
          'DPS冰口诀': { en: '010${back}00' },
          'TN冰': { en: '冰(短火): 下↓' },
          'DPS冰': { en: '冰(长火)：上↑' },
          'TN短火': { en: '短火: 下↓' },
          'DPS短火低': { en: '短火低：右上↗' },
          'DPS短火高': { en: '短火高：左上↖' },
          'TN中火': { en: '中火：左←' },
          'DPS中火': { en: '中火：右→' },
          'TN长火高': { en: '长火：左下↙' },
          'TN长火低': { en: '长火：右下↘' },
          'DPS长火': { en: '长火：上↑' },
          'text': { en: '${gimmick} ${pithy}' },
        };
        const playersGimmick = {};
        const names = Object.keys(data.soumaP3一运buff);
        const role = data.role === 'dps' ? 'DPS' : 'TN';
        let mostLong;
        for (const name of names) {
          const buffs = data.soumaP3一运buff[name];
          const fire = buffs.find((v) => v.effectId === p3buffs.火);
          const ice = buffs.find((v) => v.effectId === p3buffs.冰);
          if (name === data.me) {
            const mostLongBuff = buffs.slice().sort((a, b) => {
              const aDur = parseInt(a.duration);
              const bDur = parseInt(b.duration);
              return bDur - aDur;
            })[0];
            const bf = p3BuffsIdToName[mostLongBuff.effectId];
            mostLong = bf;
            // console.log(name, bf);
          }
          const type = fire ? '火' : '冰';
          const group = data.party.nameToRole_[name] === 'dps' ? 'dps' : 'tn';
          let len;
          let k;
          if (fire) {
            const dura = parseInt(Math.floor(parseInt(fire.duration) / 10).toString().at(0));
            len = ['', '短', '中', '长'][dura];
            k = `${len}${type}`;
          } else if (ice) {
            len = group === 'dps' ? '长' : '短';
            k = `${len}火（冰）`;
          }
          playersGimmick[name] = k;
        }
        const gimmick = playersGimmick[data.me];
        const back = `${
          { '圈': output.回返圈(), '眼': output.回返眼(), '水': output.回返水() }[mostLong] ?? '?'
        }`;
        if (gimmick === '短火') {
          data.soumaP3处理 = ['2', mostLong, '0', '1', '0', '0'];
          const pithy = output.短火口诀({ back });
          if (role === 'TN') {
            const gimmick = output.TN短火();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs.TN短火;
            return { alertText: alertText, tts: gimmick };
          }
          if (role === 'DPS') {
            const partner = Object.entries(playersGimmick).find((v) => {
              return v[0] !== data.me && v[1] === '短火';
            })[0];
            const rp = getRpByName(data, data.me);
            const partnerRp = getRpByName(data, partner);
            const sortRule = data.triggerSetConfig.P3一运DPS同BUFF优先级.toString().split(/[,\\/，]/)
              .map((v) => (v.trim().toUpperCase()));
            const sortIndex = sortRule.indexOf(rp) - sortRule.indexOf(partnerRp);
            const priority = sortIndex < 0 ? '高' : '低';
            const gimmick = output[`DPS短火${priority}`]();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs[`DPS短火${priority}`];
            return { alertText: alertText, tts: gimmick };
          }
        }
        if (gimmick === '中火') {
          data.soumaP3处理 = ['0', mostLong, '2', '0', '0', '1'];
          const pithy = output.中火口诀({ back });
          const gimmick = data.role === 'dps' ? output.DPS中火() : output.TN中火();
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir = p3Dirs[data.role === 'dps' ? 'DPS中火' : 'TN中火'];
          return { alertText: alertText, tts: gimmick };
        }
        if (gimmick === '长火') {
          data.soumaP3处理 = ['0', '1', '0', mostLong, '2', '0'];
          const pithy = output.长火口诀({ back });
          if (role === 'TN') {
            const partner = Object.entries(playersGimmick).find((v) => {
              return v[0] !== data.me && v[1] === '长火';
            })[0];
            const rp = getRpByName(data, data.me);
            const partnerRp = getRpByName(data, partner);
            const sortRule = data.triggerSetConfig.P3一运TH同BUFF优先级.toString().split(/[,\\/，]/)
              .map((v) => (v.trim().toUpperCase()));
            const sortIndex = sortRule.indexOf(rp) - sortRule.indexOf(partnerRp);
            const priority = sortIndex < 0 ? '高' : '低';
            const gimmick = output[`TN长火${priority}`]();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs[`TN长火${priority}`];
            return { alertText: alertText, tts: gimmick };
          }
          if (role === 'DPS') {
            const gimmick = output.DPS长火();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs.DPS长火;
            return { alertText: alertText, tts: gimmick };
          }
        }
        if (gimmick === '短火（冰）') {
          data.soumaP3处理 = ['0/2', mostLong, '0', '1', '0', '0'];
          const pithy = output.TN冰口诀({ back });
          const gimmick = output.TN冰({ pithy });
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir = p3Dirs.TN冰;
          return { alertText: alertText, tts: gimmick };
        }
        if (gimmick === '长火（冰）') {
          data.soumaP3处理 = ['0', '1', '0', mostLong, '0/2', '0'];
          const pithy = output.DPS冰口诀({ back });
          const gimmick = output.DPS冰({ pithy });
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir = p3Dirs.DPS冰;
          return { alertText: alertText, tts: gimmick };
        }
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第1步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output[data.soumaP3处理[0]]();
      },
      outputStrings: {
        ...p3Outputs,
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第2步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output[data.soumaP3处理[1]]();
      },
      outputStrings: {
        ...p3Outputs,
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第3步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6 + 5 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output[data.soumaP3处理[2]]();
      },
      outputStrings: {
        ...p3Outputs,
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第4步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6 + 5 + 5 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output[data.soumaP3处理[3]]();
      },
      outputStrings: {
        ...p3Outputs,
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第5步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6 + 5 + 5 + 5 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output[data.soumaP3处理[4]]();
      },
      outputStrings: {
        ...p3Outputs,
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 第6步',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      delaySeconds: 6 + 5 + 5 + 5 + 5 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output.text({ gimmick: output[data.soumaP3处理[5]](), back: output.背对() });
      },
      outputStrings: {
        ...p3Outputs,
        背对: { en: '面向场外' },
        text: { en: '${gimmick} + ${back}' },
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 线实体',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9825' },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      run: (data, matches) => {
        const id = matches.id.toUpperCase();
        data.soumaP3沙漏[id] = Directions.xyTo8DirNum(
          parseInt(matches.x),
          parseInt(matches.y),
          100,
          100,
        );
      },
    },
    {
      id: 'Souma 伊甸 P3 时间压缩·绝 线',
      type: 'Tether',
      // '0086' Yellow
      // '0085' Purple
      netRegex: { id: ['0086', '0085'] },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '一运',
      preRun: (data, matches) => {
        data.soumaP3线存储.push(matches);
      },
      delaySeconds: 0.5,
      durationSeconds: 40 - 4,
      infoText: (data, _matches, output) => {
        if (data.soumaP3线存储.length === 5) {
          const yellows = data.soumaP3线存储.filter((v) => v.id === '0086');
          const reds = data.soumaP3线存储.filter((v) => v.id === '0085');
          const yellowDirs = yellows.map((v) => data.soumaP3沙漏[v.sourceId]);
          const purpleDirs = reds.map((v) => data.soumaP3沙漏[v.sourceId]);
          const northDIr = yellowDirs.find((v) =>
            purpleDirs.includes((v + 2) % 8) && purpleDirs.includes((v + 6) % 8)
          );
          // console.log(yellowDirs, purpleDirs, targetDir, Directions.outputFrom8DirNum(targetDir));
          data.soumaP3线存储.length = 0;
          const finallyDir = (northDIr + data.soumaP3MyDir) % 8;
          return output.text({ dir: output[Directions.outputFrom8DirNum(finallyDir)]() });
        }
      },
      tts: null,
      outputStrings: {
        // 上↑
        dirN: 'A点↑',
        // 右上↗
        dirNE: '2点↗',
        // 右→
        dirE: 'B点→',
        // 右下↘
        dirSE: '3点↘',
        // 下↓
        dirS: 'C点↓',
        // 左下↙
        dirSW: '4点↙',
        // 左←
        dirW: 'D点←',
        // 左上↖
        dirNW: '1点↖',
        text: {
          en: '${dir}方向',
        },
      },
    },
    {
      id: 'Souma 伊甸 P3 破盾一击',
      type: 'StartsUsing',
      netRegex: { id: '9D5E', capture: false },
      condition: (data) => data.soumaPhase === 'P3',
      infoText: (_data, _matches, output) => output.getTogether(),
      outputStrings: {
        getTogether: {
          en: '集合分摊',
        },
      },
    },
    {
      id: 'Souma 伊甸 P3 延迟咏唱·回响',
      type: 'StartsUsing',
      netRegex: { id: '9D4D', capture: false },
      run: (data) => {
        data.soumaP3阶段 = '二运';
      },
    },
    {
      id: 'Souma 伊甸 P3 脉冲星震波',
      type: 'StartsUsing',
      netRegex: { id: '9D5A', capture: false },
      condition: (data) => data.soumaPhase === 'P3',
      response: Responses.aoe(),
    },
    {
      id: 'Souma 伊甸 P3 黑色光环',
      type: 'StartsUsing',
      netRegex: { id: '9D62' },
      alertText: (data, matches, output) => {
        if (matches.target !== data.me)
          return;
        return output.busterOnYou();
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return;
        return output.busterOn({ player: data.party.member(matches.target).job });
      },
      outputStrings: {
        busterOn: { en: '分摊死刑点 ${player}' },
        busterOnYou: { en: '分摊死刑点名' },
      },
    },
    {
      id: 'Souma 伊甸 P3 三连黑暗狂水',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运',
      preRun: (data, matches) => {
        data.soumaP3二运水.push(matches);
      },
    },
    {
      id: 'Souma 伊甸 P3 三连黑暗狂水1',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运' && parseInt(matches.duration) === 10,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分摊' } },
    },
    {
      id: 'Souma 伊甸 P3 三连黑暗狂水2',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运' && parseInt(matches.duration) === 29,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分摊' } },
    },
    {
      id: 'Souma 伊甸 P3 三连黑暗狂水3',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运' && parseInt(matches.duration) === 38,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分摊' } },
    },
    {
      id: 'Souma 伊甸 P3 碎灵一击',
      type: 'StartsUsing',
      netRegex: { id: '9D60', capture: false },
      condition: (data) => data.soumaPhase === 'P3',
      delaySeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'Souma 伊甸 P3 三连黑暗狂水 判定',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水, capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运',
      delaySeconds: 0.5,
      durationSeconds: 40,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          separator: { en: '、' },
          switcherInfo: { en: '（${name1}与${name2}换）' },
          donTMove: { en: '（都不换）' },
          no: { en: '你不换' },
          text: { en: '${no} ${switcherInfo}' },
          switch: { en: '与${switcher}交换！' },
        };
        const leftRps = data.triggerSetConfig.P3二运水分摊预站位左组.toString().split(/[,\\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const rightRps = data.triggerSetConfig.P3二运水分摊预站位右组.toString().split(/[,\\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const allSortRule = [...leftRps, ...rightRps];
        const leftSwitcherNames = new Set();
        const rightSwitcherNames = new Set();
        // let res: Record<string, string> | undefined = undefined;
        // 死人的清空下，有3个无，此时让第3个无 与单独的水进行配对。
        const lonely = data.party.details.map((v) =>
          v.name
        ).filter((v) => !data.soumaP3二运水.find((vv) => vv.target === v))[2];
        // console.log(lonely);
        for (
          const name of data.party.details.map((v) =>
            v.name
          )
        ) {
          if (name === lonely) {
            // 跳过第三个无的处理，否则污染结果。
            continue;
          }
          const me = data.soumaP3二运水.find((v) => v.target === name);
          const rp = getRpByName(data, name);
          const meHalf = leftRps.includes(rp) ? 'left' : 'right';
          const partner = me === undefined
            ? data.party.details.find((v) =>
              v.name !== name && !data.soumaP3二运水.find((vv) => vv.target === v.name)
            ).name
            : data.soumaP3二运水.find((v) => v.target !== name && v.duration === me.duration)
              ?.target ?? lonely ?? '???';
          const partnerRp = getRpByName(data, partner);
          const partnerHalf = leftRps.includes(partnerRp) ? 'left' : 'right';
          const sortIndex = allSortRule.indexOf(rp) - allSortRule.indexOf(partnerRp);
          const priority = sortIndex < 0 ? '高' : '低';
          if (meHalf === partnerHalf) {
            (meHalf === 'left' ? leftSwitcherNames : rightSwitcherNames).add(
              priority === '低' ? name : partner,
            );
          }
        }
        const leftSwitcherNamesArr = Array.from(leftSwitcherNames);
        const rightSwitcherNamesArr = Array.from(rightSwitcherNames);
        const tnSwitcherRps = leftSwitcherNamesArr.map((v) => getRpByName(data, v));
        const dpsSwitcherRps = rightSwitcherNamesArr.map((v) => getRpByName(data, v));
        let i = 0;
        let ii = 0;
        data.soumaP3水分组结果左 = leftRps.map((v) =>
          (tnSwitcherRps.includes(v) ? dpsSwitcherRps[i++] : v) ?? lonely
        );
        data.soumaP3水分组结果右 = rightRps.map((v) =>
          (dpsSwitcherRps.includes(v) ? tnSwitcherRps[ii++] : v) ?? lonely
        );
        for (
          let i = 0;
          i < Math.max(rightSwitcherNamesArr.length, leftSwitcherNamesArr.length);
          i++
        ) {
          rightSwitcherNamesArr[i] = rightSwitcherNamesArr[i] ?? lonely;
          leftSwitcherNamesArr[i] = leftSwitcherNamesArr[i] ?? lonely;
        }
        const switcherInfo = leftSwitcherNamesArr.map((v, i) =>
          output.switcherInfo({
            name1: data.party.member(v).job,
            name2: data.party.member(rightSwitcherNamesArr[i]).job,
          })
        ).join(output.separator()) || output.donTMove();
        // console.log(
        //   rightSwitcherNamesArr,
        //   leftSwitcherNamesArr,
        //   data.soumaP3水分组结果左,
        //   data.soumaP3水分组结果右,
        // );
        const meIsSwitcher = leftSwitcherNames.has(data.me) || rightSwitcherNames.has(data.me);
        data.soumaP3二运水.length = 0;
        if (meIsSwitcher) {
          const meIndex = leftSwitcherNames.has(data.me)
            ? leftSwitcherNamesArr.indexOf(data.me)
            : rightSwitcherNamesArr.indexOf(data.me);
          const switcher = leftSwitcherNames.has(data.me)
            ? rightSwitcherNamesArr[meIndex]
            : leftSwitcherNamesArr[meIndex];
          const alarmText = output.switch({
            switcher: data.party.member(switcher).job,
          });
          return {
            alarmText: alarmText,
            infoText: switcherInfo,
            tts: alarmText,
          };
        }
        const no = output.no();
        return {
          infoText: output.text({ no, switcherInfo }),
          tts: no,
        };
      },
    },
    {
      id: 'Souma 伊甸 P3 二运地火',
      type: 'ActorControlExtra',
      netRegex: {
        category: '019D',
        param1: '4',
        param2: [
          // 逆
          '40',
          // 顺
          '10',
        ],
      },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运',
      delaySeconds: 2,
      durationSeconds: 6,
      suppressSeconds: 999,
      promise: async (data, matches) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.id, 16)],
        })).combatants;
      },
      alertText: (data, matches, output) => {
        // 1顺  -1逆
        const clock = matches.param2 === '40' ? '逆' : '顺';
        const target = data.soumaCombatantData[0];
        const dirNum = Directions.xyTo8DirNum(target.PosX, target.PosY, 100, 100);
        const baseDir = (dirNum + 2) % 4;
        data.soumaCombatantData = [];
        const t = data.triggerSetConfig.P3二运地火报点方式;
        return output[`${baseDir}${clock}${t}`]();
      },
      outputStrings: {
        '0顺全': { en: '车头AC、大团二四' },
        '0逆全': { en: '车头AC、大团一三' },
        '1顺全': { en: '车头四二、大团DB' },
        '1逆全': { en: '车头四二、大团CA' },
        '2顺全': { en: '车头DB、大团一三' },
        '2逆全': { en: '车头DB、大团四二' },
        '3顺全': { en: '车头一三、大团AC' },
        '3逆全': { en: '车头一三、大团DB' },
        '0顺人群': { en: '二四左' },
        '0逆人群': { en: '一三右' },
        '1顺人群': { en: 'DB左' },
        '1逆人群': { en: 'CA右' },
        '2顺人群': { en: '一三左' },
        '2逆人群': { en: '四二右' },
        '3顺人群': { en: 'AC左' },
        '3逆人群': { en: 'DB右' },
      },
    },
    {
      id: 'Souma 伊甸 P3 二运分散',
      type: 'StartsUsing',
      netRegex: { id: '9D51', capture: false },
      condition: (data) => data.soumaPhase === 'P3' && data.soumaP3阶段 === '二运',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '分散',
        },
      },
    },
    {
      id: 'Souma 伊甸 P3 暗夜舞蹈',
      type: 'StartsUsing',
      netRegex: { id: '9CF5', capture: false },
      condition: (data) => data.soumaPhase === 'P3',
      alertText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.tanksOutPartyIn();
        // return output.partyInTanksOut!();
      },
      outputStrings: {
        // partyInTanksOut: {
        //   en: '人群靠近',
        // },
        tanksOutPartyIn: {
          en: '坦克引导',
        },
      },
    },
    {
      id: 'Souma 伊甸 P3 暗夜舞蹈2',
      type: 'StartsUsing',
      netRegex: { id: '9CF5', capture: false },
      condition: (data) => data.soumaPhase === 'P3',
      delaySeconds: 6.5,
      infoText: (data, _matches, output) => {
        const half = data.soumaP3水分组结果左.includes(getRpByName(data, data.me)) ? 'left' : 'right';
        return output.text({
          knockback: output.knockback(),
          stack: output[half](),
        });
      },
      outputStrings: {
        left: { en: '↙左下分摊' },
        right: { en: '右下分摊↘' },
        text: { en: '${knockback} => ${stack}' },
        knockback: Outputs.knockback,
      },
      // response: Responses.knockback(),
    },
    {
      id: 'Souma 伊甸 P3 记忆终结',
      type: 'StartsUsing',
      netRegex: { id: '9D6C', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: '狂暴 打到20%',
        },
      },
    },
    // #endregion P3
    // #region P4
    {
      id: 'Souma 伊甸 P4 赋形',
      type: 'StartsUsing',
      netRegex: { id: '9D36', capture: false },
      delaySeconds: 12,
      response: Responses.getTogether(),
    },
    {
      id: 'Souma 伊甸 P4 圣龙护甲',
      type: 'Ability',
      netRegex: { id: '9CFA', sourceId: '4.{7}', capture: false },
      response: Responses.moveAway('alert'),
    },
    {
      id: 'Souma 伊甸 P4 光与暗的龙诗',
      type: 'StartsUsing',
      netRegex: { id: ['9D6D', '9D2F'], capture: false },
      suppressSeconds: 1,
      response: Responses.bigAoe(),
      run: (data) => {
        data.soumaP4阶段 = '一运';
      },
    },
    {
      id: 'Souma 伊甸 P4 光之暴走',
      type: 'Tether',
      netRegex: { id: '006E' },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '一运',
      preRun: (data, matches) => {
        data.soumaP4光之暴走连线.push(matches);
      },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          bowTieShape: { en: '蝴蝶结，不用动' },
          hourglass: { en: '沙漏，${healer}${dps}换' },
          rectangle: { en: '方形，${tank}${dps}换' },
          noTether: { en: '引导水波' },
          switch: { en: '与${direction}${switcher}交换！' },
          dirDps: { en: '左下' },
          dirTank: { en: '左上' },
          dirHealer: { en: '右上' },
          stackKusari: { en: '原地踩塔' },
          stackIdle: { en: '就近引导水波' },
          doubleIdle: { en: '引导水波' },
          withKusari: { en: '去${dir}塔（与${player.job}）' },
          notWithKusari: { en: '去${dir}塔（与${player.job}）' },
          north: { en: '上' },
          south: { en: '下' },
        };
        if (data.soumaP4光之暴走连线.length !== 4) {
          return;
        }
        const iAmLine = data.soumaP4光之暴走连线.find((v) =>
          v.source === data.me || v.target === data.me
        );
        if (data.triggerSetConfig.P4一运打法 === 'nnbz') {
          const pre = data.soumaP4一运预分摊.slice();
          const preKusari = pre.find((v) =>
            data.soumaP4光之暴走连线.find((vv) => vv.source === v.name || vv.target === v.name)
          );
          const preIdle = pre.find((v) => v.name !== preKusari.name);
          data.soumaP4一运预分摊.length = 0;
          if (preKusari.name === data.me) {
            return { infoText: output.stackKusari() };
          }
          if (preIdle.name === data.me) {
            return { alertText: output.stackIdle() };
          }
          if (iAmLine === undefined) {
            return { infoText: output.doubleIdle() };
          }
          // 3个锁链
          const preKusariDir = preKusari.direction;
          const connectWithPreKusari = data.soumaP4光之暴走连线.find((v) =>
            (v.source === data.me && v.target === preKusari.name) ||
            (v.target === data.me && v.source === preKusari.name)
          );
          if (connectWithPreKusari) {
            const partner = data.soumaP4光之暴走连线.map((v) => [v.source, v.target]).flat().find((v) =>
              v !== data.me && v !== preKusari.name &&
              (v !== connectWithPreKusari.source || v !== connectWithPreKusari.target)
            );
            return {
              alertText: output.withKusari({
                dir: output[preKusariDir === 'north' ? 'south' : 'north'](),
                player: data.party.member(partner),
              }),
            };
          }
          return {
            alertText: output.notWithKusari({
              dir: output[preKusariDir](),
              player: data.party.member(preKusari.name),
            }),
          };
        }
        if (data.triggerSetConfig.P4一运打法 === 'mgl') {
          // console.log(data.me, iAmLine);
          if (iAmLine !== undefined) {
            const lines = data.soumaP4光之暴走连线.map((v) => {
              return {
                name: v.source,
                rp: getRpByName(data, v.source),
                role: data.party.nameToRole_[v.source],
              };
            });
            const thGroup = data.triggerSetConfig.P4光暴预站位上半场.toString().split(/[,\/，]/).map((
              v,
            ) => (v.trim().toUpperCase()));
            const dpsGroup = data.triggerSetConfig.P4光暴预站位下半场.toString().split(/[,\/，]/).map((
              v,
            ) => (v.trim().toUpperCase()));
            // 该机制必点THD，所以不必考虑2根线点奶妈的情况。
            // 默认T左上奶右上dps下面1234排，不兼容其他情况否则过于麻烦。
            while (!thGroup.slice(0, 2).includes(lines[0].rp)) {
              lines.push(lines.shift());
            }
            const t = lines[0];
            const nearSet = new Set();
            data.soumaP4光之暴走连线.filter((v) => v.source === t.name || v.target === t.name).forEach(
              (v) => {
                nearSet.add(v.source);
                nearSet.add(v.target);
              },
            );
            const nearByTank = Array.from(nearSet).filter((v) => v !== t.name).map((v) => {
              return {
                name: v,
                rp: getRpByName(data, v),
                role: data.party.nameToRole_[v],
              };
            });
            // console.log(t, nearByTank);
            if (
              nearByTank.find((v) => v.role === 'healer') &&
              nearByTank.find((v) => v.role === 'dps')
            ) {
              const dps = nearByTank.find((v) => v.role === 'dps');
              const otherDps = lines.find((v) => v.role === 'dps' && v.name !== dps.name);
              const priority = dpsGroup.findIndex((v) => v === dps.rp) < dpsGroup.findIndex((v) =>
                  v === otherDps.rp
                )
                ? '方形'
                : '沙漏';
              // console.log(dps, otherDps, priority);
              if (priority === '方形') {
                // console.log('方形');
                const tankName = t.name;
                const dpsName = dps.name;
                if (tankName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirDps(),
                      switcher: data.party.member(dpsName).job,
                    }),
                  };
                }
                if (dpsName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirTank(),
                      switcher: data.party.member(tankName).job,
                    }),
                  };
                }
                return {
                  alertText: output.rectangle({
                    tank: data.party.member(tankName).job,
                    dps: data.party.member(dpsName).job,
                  }),
                };
              }
              if (priority === '沙漏') {
                const healerName = nearByTank.find((v) => v.role === 'healer').name;
                const dpsName = otherDps.name;
                // console.log('沙漏形', healerName, dpsName);
                if (healerName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirDps(),
                      switcher: data.party.member(dpsName).job,
                    }),
                  };
                }
                if (dpsName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirHealer(),
                      switcher: data.party.member(healerName).job,
                    }),
                  };
                }
                return {
                  alertText: output.hourglass({
                    healer: data.party.member(healerName).job,
                    dps: data.party.member(dpsName).job,
                  }),
                };
              }
            }
            // 蝴蝶结形
            return { alertText: output.bowTieShape() };
          }
          return { infoText: output.noTether() };
        }
      },
    },
    {
      id: 'Souma 伊甸 P4 碎灵一击',
      type: 'StartsUsing',
      netRegex: { id: '9D60', capture: false },
      condition: (data) => data.soumaPhase === 'P4',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分散' } },
    },
    {
      id: 'Souma 伊甸 P4 黑暗狂水收集',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '一运',
      preRun: (data, matches) => {
        data.soumaP4黑暗狂水.push(matches);
      },
    },
    {
      id: 'Souma 伊甸 P4 光之波动',
      type: 'Ability',
      netRegex: { id: '9D15', capture: false },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '一运',
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants;
      },
    },
    {
      id: 'Souma 伊甸 P4 一运预分摊 Collection',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === 'P4' && data.triggerSetConfig.P4一运打法 === 'nnbz' &&
        getHeadmarkerId(data, matches) === headmarkers.P4分摊,
      preRun: (data, matches) => {
        data.soumaP4一运预分摊.push({
          name: matches.target,
          role: data.party.nameToRole_[matches.target],
          rp: getRpByName(data, matches.target),
          direction: undefined,
        });
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP4一运预分摊.length === 2) {
          const sortRule = data.triggerSetConfig.P4光暴牛奶抱枕预站位.toString().split(/[,\\/，]/).map((
            v,
          ) => (v.trim().toUpperCase()));
          data.soumaP4一运预分摊.sort((a, b) => sortRule.indexOf(a.rp) - sortRule.indexOf(b.rp));
          data.soumaP4一运预分摊[0].direction = 'north';
          data.soumaP4一运预分摊[1].direction = 'south';
          const playerIndex = data.soumaP4一运预分摊.findIndex((v) => v.name === data.me);
          if (playerIndex === 0) {
            return output.up();
          }
          if (playerIndex === 1) {
            return output.down();
          }
        }
      },
      outputStrings: {
        up: { en: '去上塔' },
        down: { en: '去下塔' },
      },
    },
    {
      id: 'Souma 伊甸 P4 黑暗狂水',
      type: 'GainsEffect',
      netRegex: { effectId: p3buffs.水 },
      condition: (data) =>
        data.soumaPhase === 'P4' && data.soumaP4阶段 === '一运' &&
        data.triggerSetConfig.P4一运打法 === 'mgl',
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      durationSeconds: 6,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          lines: { en: '分摊，躲开水晶' },
          stack: { en: '${dir}分摊' },
          otherSide: { en: '去对面分摊！' },
          sameSide: { en: '就近分摊' },
          unknown: { en: '分摊' },
        };
        try {
          if (data.soumaP4光之暴走连线 === undefined) {
            // 消除config面板的报错
            return { infoText: output.unknown() };
          }
          if (data.soumaP4光之暴走连线.find((v) => v.source === data.me || v.target === data.me)) {
            // 光暴4个人，就地分摊
            return { infoText: output.lines() };
          }
          // 剩余4个人
          const towerWater = data.soumaP4黑暗狂水.find((w) =>
            data.soumaP4光之暴走连线.find((l) => l.target === w.target || l.source === w.target)
          );
          const freeWater = data.soumaP4黑暗狂水.find((v) => v.target !== towerWater.target);
          const towerWaterObj = data.soumaCombatantData.find((v) => v.Name === towerWater.target);
          const freeWaterObj = data.soumaCombatantData.find((v) => v.Name === freeWater.target);
          const towerWaterTB = towerWaterObj.PosY < 100 ? 'Top' : 'Bottom';
          // 用坐标判断上下不严谨，但不会有人2个水波站同一半场还没团灭吧。
          const freeWaterTB = freeWaterObj.PosY < 100 ? 'Top' : 'Bottom';
          const freeWaterLR = freeWaterObj.PosX < 100 ? 'Left' : 'Right';
          const playerLR = data.soumaCombatantData.find((v) => v.Name === data.me).PosX < 100
            ? 'Left'
            : 'Right';
          // 两个分摊是不是在同（上/下）半场？
          const isSameSide = towerWaterTB === freeWaterTB;
          // 如果在同半场，那么无分摊一侧依旧去自己半场，而有分摊一侧的两个人去对方半场。
          const isStackSide = playerLR === freeWaterLR;
          if (isSameSide && isStackSide) {
            return { alarmText: output.otherSide() };
          }
          // 如果不在同半场，那么所有人都去自己半场即可。（靠近A的去A，靠近C的去C）
          return { infoText: output.sameSide() };
        } catch (e) {
          console.error(e);
          return { infoText: output.unknown() };
        }
      },
    },
    {
      id: 'Souma 伊甸 P4 暗夜舞蹈',
      type: 'StartsUsing',
      netRegex: { id: '9D5B', capture: false },
      condition: (data) =>
        data.soumaPhase === 'P4' && data.role === 'tank' && data.soumaP4阶段 === '一运',
      durationSeconds: 4.5,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '最远死刑！' },
      },
    },
    {
      id: 'Souma 伊甸 P4 暗夜舞蹈2',
      type: 'StartsUsing',
      netRegex: { id: '9D5B', capture: false },
      condition: (data) =>
        data.soumaPhase === 'P4' && data.role === 'tank' && data.soumaP4阶段 === '一运',
      delaySeconds: 4.7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '最近死刑！' },
      },
    },
    {
      id: 'Souma 伊甸 P4 死亡轮回',
      type: 'StartsUsing',
      netRegex: { id: ['9D6E', '9D37'], capture: false },
      condition: (data) => data.soumaPhase === 'P4',
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '分组分摊，平血' },
      },
    },
    {
      id: 'Souma 伊甸 P4 无尽顿悟',
      type: 'StartsUsing',
      netRegex: { id: ['9D70', '9D39'], capture: true },
      condition: (data) => data.soumaPhase === 'P4',
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => {
        return output.mornAfah();
      },
      outputStrings: {
        mornAfah: { en: '集合分摊' },
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶',
      type: 'StartsUsing',
      netRegex: { id: ['9D6A', '9D30'], capture: true },
      condition: (data) => data.soumaPhase === 'P4',
      suppressSeconds: 1,
      response: Responses.bigAoe(),
      run: (data) => {
        data.soumaP4阶段 = '二运';
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶BUFF',
      type: 'GainsEffect',
      netRegex: { effectId: Object.values(p4buffs) },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '二运',
      preRun: (data, matches) => {
        (data.soumaP4二运buff[matches.target] ??= []).push(matches);
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶BUFF 初始预提醒',
      type: 'GainsEffect',
      netRegex: { effectId: Object.values(p4buffs), capture: false },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '二运',
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const sortRule = data.triggerSetConfig.P4二运同BUFF优先级.toString().split(/[,\\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const allBuffs = Object.entries(data.soumaP4二运buff).map(([name, buffs]) => {
          return { name, buffs };
        });
        const getPartner = (name, effectId, duration) => {
          return allBuffs.find((member) =>
            member.name !== name &&
            member.buffs.find((b) => b.effectId === effectId && b.duration === duration)
          );
        };
        const playersGimmick = {};
        const gimmickIds = {
          '冰月环': 0,
          '水分摊': 0,
          '暗钢铁': 0,
          '黄分摊': 0,
          '短红低': 0,
          '短红高': 0,
          '长红低': 0,
          '长红高': 0,
        };
        data.party.details.map((v) => ({ id: v.id, name: v.name })).forEach(({ name, id }) => {
          const youBuff = data.soumaP4二运buff[name];
          if (youBuff.find((v) => v.effectId === p4buffs.红buff)?.duration === '17.00') {
            // 短红
            const partner = getPartner(name, p4buffs.红buff, '17.00');
            if (!partner) {
              return output.unknown();
            }
            const priority = sortRule.findIndex((v) => v === getRpByName(data, name)) -
                  sortRule.findIndex((v) => v === getRpByName(data, partner.name)) < 0
              ? '高'
              : '低';
            playersGimmick[name] = `短红${priority}`;
            gimmickIds[`短红${priority}`] = parseInt(id, 16);
          } else if (youBuff.find((v) => v.effectId === p4buffs.红buff)?.duration === '40.00') {
            // 长红
            const partner = getPartner(name, p4buffs.红buff, '40.00');
            if (!partner) {
              return output.unknown();
            }
            const priority = sortRule.findIndex((v) => v === getRpByName(data, name)) -
                  sortRule.findIndex((v) => v === getRpByName(data, partner.name)) < 0
              ? '高'
              : '低';
            playersGimmick[name] = `长红${priority}`;
            gimmickIds[`长红${priority}`] = parseInt(id, 16);
          } else if (youBuff.find((v) => v.effectId === p4buffs.暗钢铁)) {
            playersGimmick[name] = '暗钢铁';
            gimmickIds.暗钢铁 = parseInt(id, 16);
          } else if (youBuff.find((v) => v.effectId === p4buffs.水分摊)) {
            playersGimmick[name] = '水分摊';
            gimmickIds.水分摊 = parseInt(id, 16);
          } else if (youBuff.find((v) => v.effectId === p4buffs.冰月环)) {
            playersGimmick[name] = '冰月环';
            gimmickIds.冰月环 = parseInt(id, 16);
          } else if (youBuff.find((v) => v.effectId === p4buffs.黄分摊)) {
            playersGimmick[name] = '黄分摊';
            gimmickIds.黄分摊 = parseInt(id, 16);
          }
        });
        data.soumaP4二运机制 = playersGimmick[data.me];
        if (data.triggerSetConfig.伊甸P4二运机制标点 === '开') {
          // console.log(playersGimmick, gimmickIds);
          mark(gimmickIds.短红高, data.triggerSetConfig.伊甸P4二运标短红高.toString(), false);
          mark(gimmickIds.短红低, data.triggerSetConfig.伊甸P4二运标短红低.toString(), false);
          mark(gimmickIds.长红高, data.triggerSetConfig.伊甸P4二运标长红高.toString(), false);
          mark(gimmickIds.长红低, data.triggerSetConfig.伊甸P4二运标长红低.toString(), false);
          mark(gimmickIds.暗钢铁, data.triggerSetConfig.伊甸P4二运标暗钢铁.toString(), false);
          mark(gimmickIds.黄分摊, data.triggerSetConfig.伊甸P4二运标黄分摊.toString(), false);
          mark(gimmickIds.冰月环, data.triggerSetConfig.伊甸P4二运标冰月环.toString(), false);
          mark(gimmickIds.水分摊, data.triggerSetConfig.伊甸P4二运标水分摊.toString(), false);
          clearMark(48);
        }
        if (!data.soumaP4二运机制) {
          return output.unknown();
        }
        return output[data.soumaP4二运机制]();
      },
      outputStrings: {
        unknown: { en: '???' },
        短红高: { en: '短红（高）：去左←' },
        短红低: { en: '短红（低）：去右→' },
        长红高: { en: '长红（高）：去左下↙' },
        长红低: { en: '长红（低）：去右下↘' },
        暗钢铁: { en: '蓝暗：去上半场紫线' },
        黄分摊: { en: '蓝风：去下半场紫线' },
        冰月环: { en: '蓝冰：去下半场紫线' },
        水分摊: { en: '蓝水：去下半场紫线' },
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶 线实体',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '9823' },
      condition: (data) => data.soumaPhase === 'P4',
      run: (data, matches) => {
        const id = matches.id.toUpperCase();
        data.soumaP4沙漏[id] = Directions.xyTo8DirNum(
          parseInt(matches.x),
          parseInt(matches.y),
          100,
          100,
        );
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶 线',
      type: 'Tether',
      // '0085' Purple
      netRegex: { id: '0085' },
      condition: (data) => data.soumaPhase === 'P4' && data.soumaP4阶段 === '二运',
      durationSeconds: 29,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const dir = data.soumaP4沙漏[matches.sourceId] % 4;
        const type = dir === 1 ? '左下右上安全' : '左上右下安全';
        return output[`${data.soumaP4二运机制}${type}`]?.() ?? output.unknown();
      },
      outputStrings: {
        短红高左下右上安全: { en: '撞头 => 躲钢铁' },
        短红低左下右上安全: { en: '撞头 => 分摊' },
        长红高左下右上安全: { en: '左下↙击退人群 => 稍后撞头' },
        长红低左下右上安全: { en: '右下↘ => 躲钢铁 => 撞头' },
        暗钢铁左下右上安全: { en: '右上↗ => 分摊 => 踩圈' },
        水分摊左下右上安全: { en: '左下↙被击退 => 分摊 => 踩圈' },
        冰月环左下右上安全: { en: '左下↙被击退 => 分摊 => 踩圈' },
        黄分摊左下右上安全: { en: '左下↙被击退 => 分摊 => 踩圈' },
        短红高左上右下安全: { en: '撞头 => 分摊' },
        短红低左上右下安全: { en: '撞头 => 躲钢铁' },
        长红高左上右下安全: { en: '左下↙ => 躲钢铁 => 撞头' },
        长红低左上右下安全: { en: '右下↘击退人群 => 稍后撞头' },
        暗钢铁左上右下安全: { en: '左上↖ => 分摊' },
        水分摊左上右下安全: { en: '右下↘被击退 => 分摊' },
        冰月环左上右下安全: { en: '右下↘被击退 => 分摊' },
        黄分摊左上右下安全: { en: '右下↘被击退 => 分摊' },
        unknown: { en: '???' },
      },
    },
    {
      id: 'Souma 伊甸 P4 时间结晶 地火',
      type: 'StartsUsingExtra',
      netRegex: { id: ['9D3B', '9D3C'] },
      preRun: (data, matches) => data.soumaP4地火.push(matches),
      durationSeconds: 8.5,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        if (data.soumaP4地火.length < 2) {
          return;
        }
        const dirs = data.soumaP4地火.map((v) =>
          Directions.xyTo4DirNum(parseInt(v.x), parseInt(v.y), 100, 100)
        ).sort((a, b) => a - b);
        // console.log(data.soumaP4地火);
        return output[dirs.join('')]();
      },
      outputStrings: {
        '01': { en: '2点' },
        '12': { en: '3点' },
        '23': { en: '4点' },
        '03': { en: '1点' },
      },
    },
    // #endregion P4
    // #region P5
    {
      id: 'Souma 伊甸 P5 光尘之剑',
      type: 'StartsUsing',
      netRegex: { id: '9D72', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Souma 伊甸 P5 死亡轮回',
      type: 'StartsUsing',
      netRegex: { id: '9D76', capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      delaySeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '分组分摊' },
      },
    },
    {
      id: 'Souma 伊甸 P5 死亡轮回后',
      type: 'StartsUsing',
      netRegex: { id: '9D76', capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      delaySeconds: 8.5,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => {
        if (getRpByName(data, data.me) === data.triggerSetConfig.P5死亡轮回后谁拉BOSS.toString())
          return output.tank();
        return output.text();
      },
      outputStrings: {
        tank: { en: '拉正点，准备踩塔' },
        text: { en: '准备踩塔' },
      },
    },
    {
      id: 'Souma 伊甸 P5 复乐园',
      type: 'StartsUsing',
      netRegex: { id: '9D7F', capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      // infoText: 'test',
      run: (data) => {
        data.soumaP5塔.length = 0;
        data.soumaP5翅膀属性 = undefined;
        data.soumaP5翅膀全局轮次++;
        data.soumaP5单轮翅膀计数 = 0;
        data.soumaP5单轮塔计数 = 0;
      },
    },
    {
      id: 'Souma 伊甸 P5 塔',
      type: 'MapEffect',
      netRegex: {
        flags: '00020001',
        // 33 左上
        // 34 右上
        // 35 左下
        location: ['33', '34', '35'],
      },
      condition: (data) => data.soumaPhase === 'P5' && data.role === 'tank',
      preRun: (data, matches) => {
        data.soumaP5塔.push(matches);
      },
      delaySeconds: (data) => {
        const res = ([0, 7, 7][data.soumaP5单轮塔计数++]);
        return res;
      },
      response: (data, _matches, output) => {
        if (data.soumaP5单轮塔计数 === 1) {
          return;
        }
        return getTowerResult(data, output);
      },
      outputStrings: {
        ...p5TowerOutput,
      },
    },
    {
      id: 'Souma 伊甸 P5 光与暗的双翼',
      type: 'StartsUsing',
      // 9D79 先光再暗
      // 9D29 先暗再光
      netRegex: { id: ['9D79', '9D29'] },
      condition: (data) => data.soumaPhase === 'P5',
      preRun: (data, matches) => {
        data.soumaP5翅膀属性 = matches.id === '9D79' ? 'light' : 'dark';
      },
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        return getTowerResult(data, output);
      },
      outputStrings: {
        ...p5TowerOutput,
      },
    },
    {
      id: 'Souma 伊甸 P5 光与暗的双翼之后',
      type: 'StartsUsing',
      netRegex: { id: ['9D79', '9D29'], capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      delaySeconds: 15,
      infoText: (data, _matches, output) => {
        if (getRpByName(data, data.me) === data.triggerSetConfig.P5光与暗的双翼后谁拉BOSS.toString()) {
          return output.tank();
        }
        return output.text();
      },
      outputStrings: {
        tank: { en: '拉正点，准备挡枪' },
        text: { en: '准备挡枪' },
      },
    },
    {
      id: 'Souma 伊甸 P5 星灵之剑',
      type: 'StartsUsing',
      netRegex: { id: '9D7C', capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      alertText: (data, _matches, output) => {
        const charger = data.triggerSetConfig.P5挡枪顺序1.toString().split(/[,\\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const rp = getRpByName(data, data.me);
        if (charger.includes(rp)) {
          return output.charge();
        }
      },
      run: (data) => {
        data.soumaP5星灵之剑.length = 0;
        data.soumaP5星灵之剑阶段 = true;
      },
      outputStrings: {
        charge: { en: '站在最前' },
      },
    },
    {
      id: 'Souma 伊甸 P5 星灵之剑结束',
      type: 'StartsUsing',
      netRegex: { id: '9D7C', capture: false },
      condition: (data) => data.soumaPhase === 'P5',
      delaySeconds: 25,
      run: (data) => {
        data.soumaP5星灵之剑.length = 0;
        data.soumaP5星灵之剑阶段 = false;
      },
    },
    {
      id: 'Souma 伊甸 P5 星灵之剑2',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['1044', 'CFB'],
      },
      condition: (data) => data.soumaPhase === 'P5' && data.soumaP5星灵之剑阶段,
      preRun: (data, matches) => {
        data.soumaP5星灵之剑.push(matches.target);
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          changeToOtherSide: { en: '走，换边！' },
          dodge: { en: '走' },
        };
        if (data.soumaP5星灵之剑.length % 2 === 0) {
          const turn = data.soumaP5星灵之剑.slice(-2);
          const hasMe = turn.includes(data.me);
          if (hasMe) {
            return { alarmText: output.changeToOtherSide() };
          }
          return { alertText: output.dodge() };
        }
      },
    },
    {
      id: 'Souma 伊甸 P5 星灵之剑3',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['1044', 'CFB'],
        capture: false,
      },
      condition: (data) => data.soumaPhase === 'P5' && data.soumaP5星灵之剑阶段,
      delaySeconds: 2,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          text: { en: '进' },
          charge: { en: '进+最前' },
        };
        if (data.soumaP5星灵之剑.length === 8) {
          return;
        }
        const round = Math.floor(data.soumaP5星灵之剑.length % 8 / 2);
        const charger = data.triggerSetConfig[`P5挡枪顺序${round + 1}`].toString().split(/[,\/，]/).map((
          v,
        ) => (v.trim().toUpperCase()));
        const rp = getRpByName(data, data.me);
        if (charger.includes(rp) && !data.soumaP5星灵之剑.includes(data.me)) {
          return { alarmText: output.charge() };
        }
        return { infoText: output.text() };
      },
    },
    // #endregion P5
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceText': {
        '\\(cast\\)': '(咏唱)',
        '\\(damage\\)': '(判定)',
        '\\(enrage\\)': '(狂暴)',
        '\\(lightning\\)': '(雷)',
        '\\(fire\\)': '(火)',
        '\\(puddles\\)': '(放圈)',
        '\\(solo towers\\)': '(单人塔)',
        '\\(group tower\\)': '(多人塔)',
        'the Path of Darkness': '暗之波动',
        'Cruel Path of Light': '光之重波动',
        'Cruel Path of Darkness': '暗之重波动',
        'Icecrusher': '削冰击',
        'Explosion': '爆炸',
        'Burnished Glory': '光焰圆光',
        'Burnt Strike': '燃烧击',
        'Blastburn': '火燃爆',
        'Unmitigated Explosion': '大爆炸',
        'Burnout': '雷燃爆',
        'Fall Of Faith': '罪裁断',
        'Solemn Charge': '急冲刺',
        'Sinsmoke': '罪炎',
        'Sinsmite': '罪雷',
        'Bow Shock': '弓形冲波',
        'Cyclonic Break': '暴风破',
        'Turn Of The Heavens': '光轮召唤',
        'Brightfire': '光炎',
        'Utopian Sky': '乐园绝技',
        'Sinblaze': '罪冰焰',
        'Blasting Zone': '爆破领域',
        'Sinbound Fire III': '罪爆炎',
        'Sinbound Thunder III': '罪暴雷',
        'Bound of Faith': '罪壤刺',
        'Powder Mark Trail': '连锁爆印铭刻',
        'Burn Mark': '爆印',
        'Floating Fetters': '浮游拘束',
        'Edge of Oblivion': '忘却的此岸',
        'Mirror, Mirror': '镜中奇遇',
        'Mirror Image': '镜像',
        'Darkest Dance': '暗夜舞蹈',
        'Frost Armor': '冰霜护甲',
        'Shining Armor': '闪光护甲',
        'Drachen Armor': '圣龙护甲',
        'the Path of Light': '光之波动',
        'the House of Light': '光之海啸',
        'Quadruple Slap': '四剑斩',
        'Twin Stillness': '静寂的双剑技',
        'Twin Silence': '闲寂的双剑技',
        'Diamond Dust': '钻石星尘',
        'Icicle Impact': '冰柱冲击',
        'Frigid Stone': '冰石',
        'Frigid Needle': '冰针',
        'Axe Kick': '阔斧回旋踢',
        '(?<!Reflected )Scythe Kick': '镰形回旋踢',
        'Reflected Scythe Kick': '连锁反射：镰形回旋踢',
        'Heavenly Strike': '天降一击',
        'Sinbound Holy': '罪神圣',
        'Hallowed Ray': '神圣射线',
        'Light Rampant': '光之失控',
        'Bright Hunger': '侵蚀光',
        'Inescapable Illumination': '曝露光',
        'Refulgent Fate': '光之束缚',
        'Lightsteep': '过量光',
        'Powerful Light': '光爆',
        'Luminous Hammer': '光明侵蚀',
        'Burst': '爆炸',
        'Banish III': '强放逐',
        'Banish III Divided': '分裂强放逐',
        'Absolute Zero': '绝对零度',
        'Swelling Frost': '冻波',
        'Junction': '融合',
        'Hallowed Wings': '神圣之翼',
        'Wings Dark and Light': '光与暗的双翼',
        'Polarizing Paths': '星灵之剑',
        'Sinbound Meltdown': '罪熔毁',
        'Sinbound Fire': '罪火炎',
        'Akh Rhai': '天光轮回',
        'Darklit Dragonsong': '光与暗的龙诗',
        'Crystallize Time': '时间结晶',
        'Longing of the Lost': '圣龙气息',
        'Joyless Dragonsong': '绝望龙诗',
        'Materialization': '具象化',
        'Akh Morn': '死亡轮回',
        'Morn Afah': '无尽顿悟',
        'Tidal Light': '光之巨浪',
        'Hiemal Storm': '严冬风暴',
        'Hiemal Ray': '严冬射线',
        'Sinbound Blizzard III': '罪冰封',
        'Endless Ice Age': '光之泛滥',
        'Depths of Oblivion': '忘却的彼岸',
        'Memory Paradox': '记忆悖论',
        'Paradise Lost': '失乐园',
        'Hell\'s Judgment': '地狱审判',
        'Ultimate Relativity': '时间压缩·绝',
        'Return': '回返',
        'Return IV': '强回返',
        'Spell-in-Waiting Refrain': '延迟咏唱·递进',
        'Dark Water III': '黑暗狂水',
        'Dark Eruption': '暗炎喷发',
        'Dark Fire III': '黑暗爆炎',
        'Unholy Darkness': '黑暗神圣',
        'Shadoweye': '暗影之眼',
        'Dark Blizzard III': '黑暗冰封',
        'Dark Aero III': '黑暗暴风',
        'Quietus': '寂灭',
        'Shockwave Pulsar': '脉冲星震波',
        'Somber Dance': '真夜舞蹈',
        'Shell Crusher': '破盾一击',
        'Spirit Taker': '碎灵一击',
        'Black Halo': '黑色光环',
        'Speed': '限速',
        'Quicken': '神速',
        'Slow': '减速',
        'Apocalypse': '启示',
        'Maelstrom': '巨漩涡',
        'Memory\'s End': '记忆终结',
        'Fulgent Blade': '光尘之剑',
        'Polarizing Strikes': '星灵之剑',
        'Paradise Regained': '复乐园',
        'Twin Poles': '光与暗的双剑技',
        'Pandora\'s Box': '潘多拉之匣',
        'Fated Burn Mark': '死爆印',
      },
    },
  ],
});
