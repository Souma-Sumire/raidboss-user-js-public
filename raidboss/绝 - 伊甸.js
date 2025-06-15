const { getRpByName, mark, doQueueActions } = Util.souma;
const clearMark = (delay = 0) => {
  // console.debug('clearMark');
  doQueueActions([
    { c: "command", p: "/mk off <1>", d: delay * 1000 },
    { c: "command", p: "/mk off <2>" },
    { c: "command", p: "/mk off <3>" },
    { c: "command", p: "/mk off <4>" },
    { c: "command", p: "/mk off <5>" },
    { c: "command", p: "/mk off <6>" },
    { c: "command", p: "/mk off <7>" },
    { c: "command", p: "/mk off <8>" },
  ]);
};
const markTypeOptions = {
  无: "none",
  攻击1: "attack1",
  攻击2: "attack2",
  攻击3: "attack3",
  攻击4: "attack4",
  攻击5: "attack5",
  攻击6: "attack6",
  攻击7: "attack7",
  攻击8: "attack8",
  锁链1: "bind1",
  锁链2: "bind2",
  锁链3: "bind3",
  禁止1: "stop1",
  禁止2: "stop2",
  圆圈: "circle",
  十字: "cross",
  三角: "triangle",
  方块: "square",
};
const p1LinesHandler = {
  线1: [1, 3],
  线2: [2, 4],
  线3: [1, 3],
  线4: [2, 4],
  闲1: [1, 3],
  闲2: [1, 3],
  闲3: [2, 4],
  闲4: [2, 4],
};
const p1Towers = {
  // 1人塔 火
  "9CC3": 1,
  // 2人塔 火
  "9CBA": 2,
  // 3人塔 火
  "9CBB": 3,
  // 4人塔 火
  "9CBC": 4,
  // 1人塔 雷
  "9CC7": 1,
  // 2人塔 雷
  "9CBD": 2,
  // 3人塔 雷
  "9CBE": 3,
  // 4人塔 雷
  "9CBF": 4,
};
const p2LrGray9 = ["C//", "1C/", "21C", "421", "342", "A34", "/A3", "//A"];
const p3buffs = {
  // 延迟咏唱：黑暗神圣 分摊
  摊: "996",
  // 延迟咏唱：黑暗爆炎 分散
  火: "997",
  // 延迟咏唱：暗影之眼 石化
  眼: "998",
  // 延迟咏唱：暗炎喷发 分散
  圈: "99C",
  // 延迟咏唱：黑暗狂水 分摊
  水: "99D",
  // 延迟咏唱：黑暗冰封 月环
  冰: "99E",
  // 延迟咏唱：回返
  返: "9A0",
};
const p4buffs = {
  // 圣龙牙 红buff 需要撞头
  红buff: "CBF",
  // 圣龙爪 蓝buff 需要踩圈
  蓝buff: "CC0",
  // 延迟咏唱：黑暗冰封 月环
  冰月环: "99E",
  // 延迟咏唱：黑暗暴风 风击退
  风击退: "99F",
  // 延迟咏唱：黑暗神圣 分摊
  黄分摊: "996",
  // 延迟咏唱：暗炎喷发 暗钢铁
  暗钢铁: "99C",
  // 延迟咏唱：黑暗狂水 分摊
  水分摊: "99D",
};
const p3BuffsIdToName = Object.fromEntries(
  Object.entries(p3buffs).map(([name, id]) => [id, name])
);
const p3Outputs = {
  "0": { en: "场中分摊" },
  "1": { en: "引导灯" },
  "2": { en: "远离放火" },
  "圈": { en: "灯脚下" },
  "眼": { en: "内小圆" },
  "水": { en: "内小圆" },
  "0/2": { en: "场中分摊" },
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
  tankBuster: "00DA",
  冰花: "0159",
  P4分摊: "003E",
};
const firstHeadmarker = parseInt(headmarkers.tankBuster, 16);
const getHeadmarkerId = (data, matches) => {
  if (data.soumaDecOffset === undefined)
    data.soumaDecOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.soumaDecOffset)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
};
const p5TowerOutput = {
  dark: "←暗左",
  light: "光右→",
  darkMt1: "←暗左（换T+减伤）",
  darkMt1R: "暗右→（换T+减伤）",
  darkMt2: "暗刀",
  darkSt1: "←暗左(换T) + 近死刑",
  darkSt2: "近死刑",
  lightMt1: "光右→（换T+减伤）",
  lightMt1R: "←光左（换T+减伤）",
  lightMt2: "光刀",
  lightSt1: "光右→(换T) + 远死刑",
  lightSt2: "远死刑",
};
const getTowerResult = (data, output) => {
  data.soumaP5单轮翅膀计数++;
  if (data.soumaP5单轮翅膀计数 === 3) {
    return;
  }
  const attr =
    data.soumaP5单轮翅膀计数 === 1
      ? data.soumaP5翅膀属性
      : data.soumaP5翅膀属性 === "light"
      ? "dark"
      : "light";
  if (data.role === "tank") {
    return getTankResult(data, output);
  }
  return { infoText: output[attr]() };
};
const isCurrentTank = (data) => {
  const rp = getRpByName(data, data.me);
  return (
    (data.triggerSetConfig[
      `伊甸P5第${data.soumaP5翅膀全局轮次}次翅膀先拉的T`
    ] === rp &&
      data.soumaP5单轮翅膀计数 === 1) ||
    (data.triggerSetConfig[
      `伊甸P5第${data.soumaP5翅膀全局轮次}次翅膀先拉的T`
    ] !== rp &&
      data.soumaP5单轮翅膀计数 === 2)
  );
};
const getTankResult = (data, output) => {
  const attr =
    data.soumaP5单轮翅膀计数 === 1
      ? data.soumaP5翅膀属性
      : data.soumaP5翅膀属性 === "light"
      ? "dark"
      : "light";
  if (isCurrentTank(data)) {
    // 当前一仇
    const reverse =
      data.triggerSetConfig.伊甸P5翅膀MT反报 && data.soumaP5单轮翅膀计数 === 1
        ? "R"
        : "";
    return {
      alarmText: `${output[
        `${attr}Mt${data.soumaP5单轮翅膀计数}${reverse}`
      ]()}`,
    };
  }
  // 当前二仇
  return { alarmText: `${output[`${attr}St${data.soumaP5单轮翅膀计数}`]()}` };
};
Options.Triggers.push({
  id: "SoumaEdenUltimate",
  zoneId: ZoneId.FuturesRewrittenUltimate,
  zoneLabel: { en: "光暗未来绝境战 by Souma" },
  config: [
    // location.href = 'http://localhost:8080/ui/config/config.html'
    {
      id: "启用雾龙报安全区",
      name: { en: "启用雾龙直接报安全区" },
      type: "checkbox",
      default: false,
      comment: {
        en: "本功能默认关闭，需要启用的玩家自行勾选。野队请正常处理该机制，避免破坏游戏环境。",
      },
    },
    {
      id: "P1双火线上半场组",
      name: { en: "P1双火线 上半场组优先级" },
      type: "string",
      default: "MT/ST/H1/H2",
    },
    {
      id: "P1双火线下半场组",
      name: { en: "P1双火线 下半场组优先级" },
      type: "string",
      default: "D1/D2/D3/D4",
    },
    {
      id: "P1双火线上半场组换位人",
      name: { en: "P1双火线 上半场组 换位人" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
          H1: "H1",
          H2: "H2",
          D1: "D1",
          D2: "D2",
          D3: "D3",
          D4: "D4",
        },
      },
      default: "MT",
    },
    {
      id: "P1双火线下半场组换位人",
      name: { en: "P1双火线 下半场组 换位人" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
          H1: "H1",
          H2: "H2",
          D1: "D1",
          D2: "D2",
          D3: "D3",
          D4: "D4",
        },
      },
      default: "D1",
    },
    {
      id: "P1雷火线打法",
      name: { en: "P1雷火线 打法" },
      type: "select",
      options: { en: { 常规AC: "ac", BD闲固: "bd" } },
      default: "ac",
    },
    {
      id: "P1连线机制闲人优先级",
      name: { en: "P1雷火线 闲人优先级" },
      type: "string",
      default: "H1/H2/MT/ST/D1/D2/D3/D4",
    },
    {
      id: "伊甸P1连线机制标点",
      name: { en: "P1雷火线 标点" },
      type: "select",
      options: { en: { "开√": "开", "关": "关" } },
      default: "关",
    },
    {
      id: "伊甸P1标线1",
      name: { en: "P1雷火线 标线1" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链1,
    },
    {
      id: "伊甸P1标线2",
      name: { en: "P1雷火线 标线2" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止1,
    },
    {
      id: "伊甸P1标线3",
      name: { en: "P1雷火线 标线3" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链2,
    },
    {
      id: "伊甸P1标线4",
      name: { en: "P1雷火线 标线4" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止2,
    },
    {
      id: "伊甸P1标闲1",
      name: { en: "P1雷火线 标闲1" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: "伊甸P1标闲2",
      name: { en: "P1雷火线 标闲2" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: "伊甸P1标闲3",
      name: { en: "P1雷火线 标闲3" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: "伊甸P1标闲4",
      name: { en: "P1雷火线 标闲4" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.无,
    },
    {
      id: "伊甸P1踩塔基准",
      name: { en: "P1踩塔 报点基准" },
      type: "select",
      options: {
        en: {
          "仅塔人数": "simple",
          "全填充式（小学数学）": "mgl",
          "3固定3补位（龙诗补塔）": "mmw",
        },
      },
      default: "mmw",
    },
    {
      id: "伊甸P1踩塔填充优先级",
      name: { en: "P1踩塔 填充式 优先级" },
      type: "string",
      default: "H1/H2/D1/D2/D3/D4",
    },
    {
      id: "伊甸P1踩塔补位式北塔人",
      name: { en: "P1踩塔 补位式 北塔人" },
      type: "string",
      default: "H1/D1",
      comment: { en: "写在前面的固定站，写在后面的负责补位" },
    },
    {
      id: "伊甸P1踩塔补位式中塔人",
      name: { en: "P1踩塔 补位式 中塔人" },
      type: "string",
      default: "H2/D2",
      comment: { en: "写在前面的固定站，写在后面的负责补位" },
    },
    {
      id: "伊甸P1踩塔补位式南塔人",
      name: { en: "P1踩塔 补位式 南塔人" },
      type: "string",
      default: "D4/D3",
      comment: { en: "写在前面的固定站，写在后面的负责补位" },
    },
    {
      id: "伊甸P2光暴打法",
      name: { en: "P2光暴打法" },
      type: "select",
      options: { en: { "田园郡（六芒星）": "mgl", "灰9": "gray9" } },
      default: "mgl",
      comment: {
        en: "田园郡（六芒星）不需要填写优先级，会以玩家x轴坐标进行判断。默认玩家上下44分组。",
      },
    },
    {
      id: "伊甸P2光暴灰九拨号盘",
      name: { en: "P2光暴 灰九式 拨号盘顺序" },
      type: "string",
      default: "MT/D4/ST/D2/H2/D1/H1/D3",
    },
    {
      id: "伊甸P2光暴机制标点",
      name: { en: "P2光暴 田园郡 标点" },
      type: "select",
      options: { en: { "开√": "开", "关": "关" } },
      default: "关",
      comment: {
        en: "上面锁链123从左到右，下面攻击123从左到右。仅支持田园郡打法。若判定时上下半场没有站好各4个人，则会暴力标出一套可以通过该机制的标点作为最后的兜底（没实测过，应该是对的）。",
      },
    },
    {
      id: "P3一运TH同BUFF优先级",
      name: { en: "P3一运 TH同BUFF优先级" },
      type: "string",
      default: "MT/ST/H1/H2",
    },
    {
      id: "P3一运DPS同BUFF优先级",
      name: { en: "P3一运 DPS同BUFF优先级" },
      type: "string",
      default: "D1/D2/D3/D4",
    },
    {
      id: "P3二运水分摊预站位左组",
      name: { en: "P3二运 水分摊预站位优先级 左组" },
      type: "string",
      default: "MT/ST/H1/H2",
      comment: { en: '优先级写在后面的换去对面"' },
    },
    {
      id: "P3二运水分摊预站位右组",
      name: { en: "P3二运 水分摊预站位优先级 右组" },
      type: "string",
      default: "D1/D2/D3/D4",
      comment: { en: "优先级写在后面的换去对面" },
    },
    {
      id: "P3二运地火报点方式",
      name: { en: "P3二运 地火报点方式" },
      type: "select",
      options: {
        en: {
          "以车头基准：先报车头点位，再报人群点位（例如：车头AC、人群二四）":
            "车头人群",
          "以车头基准：先报车头点位，再报人群顺逆（例如：AC顺）": "车头顺逆",
          "以人群基准：先报人群点位，再报车头点位（例如：人群四二、车头CA）":
            "人群车头",
          "以人群基准：先报人群点位，再报车头顺逆（例如：四二逆）": "人群顺逆",
        },
      },
      default: "人群车头",
      comment: { en: "先报的那个点是TH组，后报的是DPS组。（均以A1D4分）" },
    },
    {
      id: "P4一运打法",
      name: { en: "P4一运打法" },
      type: "select",
      options: {
        en: { "莫古力（翻花绳）": "mgl", "牛奶抱枕（分摊基准）": "nnbz" },
      },
      default: "mgl",
    },
    {
      id: "P4光暴预站位上半场",
      name: { en: "P4光暴 莫古力 上半场站位顺序" },
      type: "string",
      default: "MT/ST/H1/H2",
      comment: { en: "不建议改。改的话只能改顺序，不能写DPS" },
    },
    {
      id: "P4光暴预站位下半场",
      name: { en: "P4光暴 莫古力 下半场站位顺序" },
      type: "string",
      default: "D1/D2/D3/D4",
      comment: { en: "不建议改。改的话只能改顺序，不能写TH" },
    },
    {
      id: "P4光暴牛奶抱枕预站位",
      name: { en: "P4光暴 牛奶抱枕 预站位" },
      type: "string",
      default: "MT/ST/H1/H2/D1/D2/D3/D4",
      comment: {
        en: "以基准点为北，左边从上到下+右边从上到下。报点也是以基准点为北。",
      },
    },
    {
      id: "P4二运同BUFF优先级",
      name: { en: "P4二运 同BUFF优先级" },
      type: "string",
      default: "MT/ST/H1/H2/D1/D2/D3/D4",
    },
    {
      id: "伊甸P4二运机制标点",
      name: { en: "P4二运 标点" },
      type: "select",
      options: { en: { "开√": "开", "关": "关" } },
      default: "关",
      comment: {
        en: '<a href="https://www.bilibili.com/video/BV1HbzQYpEde">动画演示视频</a>',
      },
    },
    {
      id: "伊甸P4二运标短红高",
      name: { en: "P4二运 标短红高" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链1,
    },
    {
      id: "伊甸P4二运标短红低",
      name: { en: "P4二运 标短红低" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链2,
    },
    {
      id: "伊甸P4二运标长红高",
      name: { en: "P4二运 标长红高" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止1,
    },
    {
      id: "伊甸P4二运标长红低",
      name: { en: "P4二运 标长红低" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止2,
    },
    {
      id: "伊甸P4二运标暗钢铁",
      name: { en: "P4二运 标暗钢铁" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击1,
    },
    {
      id: "伊甸P4二运标黄分摊",
      name: { en: "P4二运 标黄分摊" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击2,
    },
    {
      id: "伊甸P4二运标冰月环",
      name: { en: "P4二运 标冰月环" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击3,
    },
    {
      id: "伊甸P4二运标水分摊",
      name: { en: "P4二运 标水分摊" },
      type: "select",
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击4,
    },
    {
      id: "伊甸P4二运击退处理",
      name: { en: "P4二运 击退处理方法" },
      type: "select",
      options: {
        en: {
          正攻: "normal",
          Y字: "y",
        },
      },
      default: "normal",
      comment: {
        en: "若选择Y字，则回返点只报AC。且会提醒你开防击退（时机未实测）",
      },
    },
    {
      id: "P5死亡轮回后谁拉BOSS",
      name: { en: "P5死亡轮回后 谁负责拉正BOSS" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
        },
      },
      default: "MT",
    },
    {
      id: "P5光与暗的双翼后谁拉BOSS",
      name: { en: "P5光与暗的双翼后 谁负责拉正BOSS" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
        },
      },
      default: "MT",
    },
    {
      id: "伊甸P5第1次翅膀先拉的T",
      name: { en: "P5第1次翅膀 先拉的T" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
        },
      },
      default: "MT",
    },
    {
      id: "伊甸P5第2次翅膀先拉的T",
      name: { en: "P5第2次翅膀 先拉的T" },
      type: "select",
      options: {
        en: {
          MT: "MT",
          ST: "ST",
        },
      },
      default: "MT",
    },
    {
      id: "伊甸P5翅膀MT反报",
      name: { en: "P5光与暗的双翼 1刀T反着报（以从塔对面看向BOSS的视角）" },
      type: "checkbox",
      default: true,
      comment: {
        en: "1刀MT若提前穿到1塔对面，此时他的面向就变成了“黑右、白左”",
      },
    },
    {
      id: "P5挡枪顺序1",
      name: { en: "P5挡枪 第1组" },
      type: "string",
      default: "MT/ST",
    },
    {
      id: "P5挡枪顺序2",
      name: { en: "P5挡枪 第2组" },
      type: "string",
      default: "D1/D2",
    },
    {
      id: "P5挡枪顺序3",
      name: { en: "P5挡枪 第3组" },
      type: "string",
      default: "D3/D4",
    },
    {
      id: "P5挡枪顺序4",
      name: { en: "P5挡枪 第4组" },
      type: "string",
      default: "H1/H2",
    },
  ],
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaPhase: "P1",
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
  timeline: `### FUTURES REWRITTEN (ULTIMATE)
# ZoneId: 1238
# -ii 9CB4 9CD8 9CD9 9CC9 9CCA 9CCC 9CCD 9CCF 9CE5 9CE6 9CE9 9CF0 9D0C 9D0E 9D13
# -p 9CFF:215.3 9D22:500.0 9D72:1041.0
hideall "--Reset--"
hideall "--sync--"
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
13.9 "--sync--" Ability { id: ["9CD0", "9CD4"], source: "Fatebreaker" } # Cyclonic Break castbar
14.6 "Cyclonic Break 1 (targeted)" Ability { id: "9CD1", source: "Fatebreaker" }
16.6 "Cyclonic Break 2 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker" }
16.6 "Sinsmoke/Sinsmite" Ability { id: ["9CD3", "9CD5"], source: "Fatebreaker" }
18.6 "Cyclonic Break 3 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker" }
20.6 "Cyclonic Break 4 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker" }
24.4 "Powder Mark Trail" Ability { id: "9CE8", source: "Fatebreaker" }
28.5 "--center--" Ability { id: "9CED", source: "Fatebreaker" }
35.2 "Utopian Sky" Ability { id: ["9CDA", "9CDB"], source: "Fatebreaker" }
35.2 "--untargetable--"
40.6 "Burn Mark" Ability { id: "9CE9", source: "Fatebreaker" }
49.5 "--sync--" Ability { id: "9CDD", source: "Fatebreaker's Image" } # Blasting Zone castbar
50.4 "Sinbound Fire III/Sinbound Thunder III" Ability { id: ["9CDF", "9CE0"], source: ["Fatebreaker", "Fatebreaker's Image"] }
50.5 "Blasting Zone" Ability { id: "9CDE", source: "Fatebreaker's Image" }
55.9 "--sync--" Ability { id: ["9D89", "9D8A"], source: "Fatebreaker's Image" } # Cyclonic Break castbar
56.6 "Cyclonic Break 1 (targeted)" Ability { id: "9CD1", source: "Fatebreaker's Image" }
58.6 "Cyclonic Break 2 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker's Image" }
58.6 "Sinsmoke/Sinsmite" Ability { id: ["9CD3", "9CD5"], source: ["Fatebreaker", "Fatebreaker's Image"] }
60.6 "Cyclonic Break 3 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker's Image" }
62.6 "Cyclonic Break 4 (follow-up)" #Ability { id: "9CD2", source: "Fatebreaker's Image" }
63.8 "Turn Of The Heavens" Ability { id: ["9CD6", "9CD7"], source: "Fatebreaker's Image" }
64.8 "Burnt Strike (lightning)" Ability { id: "9CE3", source: "Fatebreaker's Image" }
66.5 "Burnout" Ability { id: "9CE4", source: "Fatebreaker's Image" }
70.8 "Burnt Strike (fire)" Ability { id: "9CE1", source: "Fatebreaker's Image" }
72.8 "Blastburn" Ability { id: "9CE2", source: "Fatebreaker's Image" }
75.4 "Floating Fetters" Ability { id: "9CEB", source: "Fatebreaker's Image" }
78.6 "Sinsmoke" Ability { id: "9CE7", source: "Fatebreaker's Image" }
79.8 "--targetable--"
86.0 "Burnished Glory" Ability { id: "9CEA", source: "Fatebreaker" }
101.4 "Fall Of Faith" Ability { id: ["9CC9", "9CCC"], source: "Fatebreaker" } # This is manually left in since it's a visible castbar.
102.2 "Floating Fetters 1" #Ability { id: "9CEB", source: "Fatebreaker" }
105.2 "Floating Fetters 2" #Ability { id: "9CEB", source: "Fatebreaker's Image" }
105.5 "Sinblaze/Sinsmite 1" #Ability { id: ["9CCE", "9CDC"], source: "Fatebreaker" }
107.5 "Floating Fetters 3" #Ability { id: "9CEB", source: "Fatebreaker's Image" }
108.4 "Sinblaze/Sinsmite 2" #Ability { id: ["9CCE", "9CDC"], source: "Fatebreaker's Image" }
109.9 "Floating Fetters 4" #Ability { id: "9CEB", source: "Fatebreaker's Image" }
110.8 "Sinblaze/Sinsmite 3" #Ability { id: ["9CCE", "9CDC"], source: "Fatebreaker" }
113.3 "Sinblaze/Sinsmite 4" #Ability { id: ["9CCE", "9CDC"], source: "Fatebreaker's Image" }
121.3 "Burnished Glory" Ability { id: "9CEA", source: "Fatebreaker" }
129.9 "Powder Mark Trail" Ability { id: "9CE8", source: "Fatebreaker" }
132.3 "--center--" Ability { id: "9CED", source: "Fatebreaker" }
141.3 "Burnt Strike" Ability { id: ["9CC1", "9CC5"], source: "Fatebreaker" }
143.1 "Blastburn/Burnout" #Ability { id: ["9CC2", "9CC6"], source: "Fatebreaker" }
# TODO: Add all tower explosion IDs
145.1 "Explosion" #Ability { id: "9CBD", source: "Fatebreaker" }
150.5 "--sync--" StartsUsing { id: "9CC0", source: "Fatebreaker" } # Burnished Glory
160.2 "Burnished Glory (enrage)" Ability { id: "9CC0", source: "Fatebreaker" }
# Phase Two
# Source actors are elided on some lines where stale data can make P1 actors fill it in.
# Ability IDs should be sufficient in those cases.
# Sync on the map change
200.0 "--sync--" MapEffect { flags: "00020001", location: "17" } window 200,5
204.1 "--targetable--"
210.3 "--sync--" StartsUsing { id: "9CFF", source: "Usurper of Frost" }
215.3 "Quadruple Slap 1" Ability { id: "9CFF", source: "Usurper of Frost" }
219.4 "Quadruple Slap 2" Ability { id: "9D00", source: "Usurper of Frost" }
224.5 "--jump south--" Ability { id: "9CEF", source: "Usurper of Frost" }
228.8 "Mirror Image" Ability { id: "9CF4", source: "Usurper of Frost" }
235.9 "Diamond Dust" Ability { id: "9D05", source: "Usurper of Frost" }
239.0 "--untargetable--"
244.6 "Axe Kick/Scythe Kick" Ability { id: ["9D0A", "9D0B"], source: "Oracle's Reflection" }
245.5 "The House of Light" Ability { id: "9D0E" }
247.2 "Frigid Stone" Ability { id: "9D07" }
247.6 "Icicle Impact" Ability { id: "9D06" }
248.4 "--center--" Ability { id: "9CEF" }
251.5 "Heavenly Strike" Ability { id: "9D0F", source: "Usurper of Frost" }
251.6 "Icicle Impact" Ability { id: "9D06" }
254.2 "Frigid Needle" Ability { id: "9D08" }
254.6 "Sinbound Holy (cast)" Ability { id: "9D10", source: "Oracle's Reflection" }
255.5 "Icicle Impact" Ability { id: "9D06" }
255.5 "Sinbound Holy 1 (puddles)" #Ability { id: "9D11", source: "Usurper of Frost" }
256.9 "Sinbound Holy 2 (puddles)" #Ability { id: "9D11", source: "Oracle's Reflection" }
258.5 "Sinbound Holy 3 (puddles)" #Ability { id: "9D11", source: "Oracle's Reflection" }
260.1 "Sinbound Holy 4 (puddles)" #Ability { id: "9D11", source: "Oracle's Reflection" }
263.9 "Shining Armor + Frost Armor" Ability { id: ["9CF8", "9CF9"], source: ["Oracle's Reflection", "Usurper Of Frost"] }
270.5 "Twin Stillness/Twin Silence" Ability { id: ["9D01", "9D02"], source: "Oracle's Reflection" }
272.6 "Twin Silence/Twin Stillness" Ability { id: ["9D03", "9D04"], source: "Oracle's Reflection" }
276.2 "--targetable--"
283.3 "Hallowed Ray" Ability { id: "9D12", source: "Usurper of Frost" }
293.0 "Mirror, Mirror" Ability { id: "9CF3", source: "Usurper of Frost" }
307.1 "Scythe Kick" Ability { id: "9D0B", source: "Usurper of Frost" }
317.2 "Reflected Scythe Kick" Ability { id: "9D0D", source: "Frozen Mirror" }
323.3 "Banish III" Ability { id: ["9D1C", "9D1D"], source: "Usurper of Frost" }
326.4 "--center--" Ability { id: "9CEF", source: "Usurper of Frost" }
332.7 "Light Rampant" Ability { id: "9D14", source: "Usurper of Frost" }
335.7 "--untargetable--"
340.7 "Luminous Hammer 1" #Ability { id: "9D1A", source: "Usurper of Frost" }
342.3 "Luminous Hammer 2" #Ability { id: "9D1A", source: "Usurper of Frost" }
343.9 "Luminous Hammer 3" #Ability { id: "9D1A", source: "Usurper of Frost" }
344.0 "Bright Hunger (solo towers)" Ability { id: "9D15", source: "Usurper of Frost" }
345.4 "Luminous Hammer 4" #Ability { id: "9D1A", source: "Usurper of Frost" }
347.0 "Luminous Hammer 5" #Ability { id: "9D1A", source: "Usurper of Frost" }
349.8 "Powerful Light" Ability { id: "9D19", source: "Usurper of Frost" }
352.2 "Burst 1" #Ability { id: "9D1B", source: "Holy Light" }
355.2 "Burst 2" #Ability { id: "9D1B", source: "Holy Light" }
358.8 "Bright Hunger (group tower)" Ability { id: "9D15", source: "Usurper of Frost" }
361.9 "Banish III" Ability { id: ["9D1C", "9D1D"], source: "Usurper of Frost" }
364.9 "--targetable--"
370.8 "The House of Light" Ability { id: "9CFC", source: "Usurper of Frost" }
376.2 "--center--" Ability { id: "9CEF", source: "Usurper of Frost" }
390.1 "Absolute Zero (enrage)" Ability { id: "9D8D", source: "Usurper of Frost" }
# Adds Phase
# The Heimal Storm casts from the Crystals of Light will stop once they all are killed.
392.4 "Swelling Frost" Ability { id: "9D21", source: "Usurper of Frost" }
411.4 "--adds targetable--"
424.4 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" } window 424.4,2.5
425.4 "Hiemal Storm" Ability { id: "9D40", source: "Crystal of Light" }
428.6 "Hiemal Storm" Ability { id: "9D40", source: "Crystal of Light" }
429.6 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" }
431.8 "Hiemal Storm" Ability { id: "9D40", source: "Crystal of Light" }
434.7 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" }
434.9 "Hiemal Storm?" Ability { id: "9D40", source: "Crystal of Light" }
438.1 "Hiemal Storm?" Ability { id: "9D40", source: "Crystal of Light" }
439.9 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" }
441.3 "Hiemal Storm?" Ability { id: "9D40", source: "Crystal of Light" }
444.5 "Hiemal Storm?" Ability { id: "9D40", source: "Crystal of Light" }
445.2 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" }
447.7 "Hiemal Storm?" Ability { id: "9D40", source: "Crystal of Light" }
450.5 "Sinbound Blizzard III" Ability { id: "9D42", source: "Crystal of Darkness" }
455.7 "Endless Ice Age (enrage)" Ability { id: "9D43", source: "Ice Veil" } # interrupted once <50% HP
# Phase Three
488.8 "--sync--" WasDefeated { target: 'Ice Veil' } window 488.8,5
500.0 "Junction" Ability { id: "9D22", source: "Usurper of Frost" } window 500,5
514.3 "--targetable--"
518.3 "Hell's Judgment" Ability { id: "9D49", source: "Oracle of Darkness" }
521.4 "--sync--" Ability { id: "9CB5", source: "Oracle of Darkness" }
532.4 "Ultimate Relativity" Ability { id: "9D4A", source: "Oracle of Darkness" }
544.2 "Dark Fire III/Unholy Darkness" Ability { id: "9D54" }
549.4 "Sinbound Meltdown 1 (x10)" Ability { id: "9D2B" } duration 10.2
554.3 "Dark Fire III/Dark Blizzard III/Unholy Darkness" Ability { id: "9D54" }
559.4 "Sinbound Meltdown 2 (x10)" Ability { id: "9D2B" } duration 10.2
564.3 "Dark Fire III/Unholy Darkness" Ability { id: "9D54" }
570.4 "Sinbound Meltdown 3 (x10)" Ability { id: "9D2B" } duration 10.2
573.2 "(stun + rewind)" GainsEffect { effectId: "1043" }
576.2 "Shadoweye/Dark Water III/Dark Eruption" Ability { id: "9D56" }
580.1 "Shell Crusher" Ability { id: "9D5E", source: "Oracle of Darkness" }
588.5 "Shockwave Pulsar" Ability { id: "9D5A", source: "Oracle of Darkness" }
596.8 "Black Halo" Ability { id: "9D62", source: "Oracle of Darkness" }
605.9 "Spell-in-Waiting Refrain" Ability { id: "9D4D", source: "Oracle of Darkness" }
621.2 "Apocalypse" Ability { id: "9D68", source: "Oracle of Darkness" }
624.8 "Dark Water III" Ability { id: "9D4F", source: "Oracle of Darkness" }
626.3 "Spirit Taker" Ability { id: "9D60", source: "Oracle of Darkness" }
629.5 "--sync--" Ability { id: "9CB5", source: "Oracle of Darkness" }
635.2 "Apocalypse (x6)" duration 10.0
637.9 "Dark Eruption" Ability { id: "9D52", source: "Oracle of Darkness" }
643.7 "Dark Water III" Ability { id: "9D4F", source: "Oracle of Darkness" }
646.0 "Darkest Dance (jump)" Ability { id: "9CF6", source: "Oracle of Darkness" }
648.9 "Darkest Dance (knockback)" Ability { id: "9CF7", source: "Oracle of Darkness" }
652.8 "Dark Water III" Ability { id: "9D4F", source: "Oracle of Darkness" }
658.2 "Shockwave Pulsar" Ability { id: "9D5A", source: "Oracle of Darkness" }
672.0 "Memory's End (enrage)" Ability { id: "9D6C", source: "Oracle of Darkness" }
675.4 "--untargetable--"
# Phase Four
680.8 "--targetable--"
686.3 "--sync--" StartsUsing { id: "9D36", source: "Usurper of Frost" } window 686.3,5
689.2 "Materialization" Ability { id: "9D36", source: "Usurper of Frost" }
700.4 "Drachen Armor" Ability { id: "9CFA" }
702.9 "Akh Rhai" Ability { id: "9D2D", source: "Usurper of Frost" } duration 5.1
705.4 "Edge of Oblivion 1" Ability { id: "9CEE", source: "Fragment of Fate" }
706.2 "--Oracle targetable--"
708.6 "--sync--" Ability { id: "9CEF", source: "Usurper of Frost" }
714.9 "Darklit Dragonsong" Ability { id: "9D2F", source: "Usurper of Frost" }
726.1 "Bright Hunger" Ability { id: "9D15", source: "Usurper of Frost" }
727.0 "The Path of Light" Ability { id: "9CFE", source: "Usurper of Frost" }
729.1 "Spirit Taker (jump)" Ability { id: "9D60", source: "Oracle of Darkness" }
729.5 "Spirit Taker (damage)" Ability { id: "9D61", source: "Oracle of Darkness" }
734.1 "Dark Water III + Hallowed Wings" Ability { id: "9D4F" }
737.7 "Somber Dance (far)" Ability { id: "9D5C", source: "Oracle of Darkness" }
741.0 "Somber Dance (close)" Ability { id: "9D5D", source: "Oracle of Darkness" }
744.4 "Edge of Oblivion 2" Ability { id: "9CEE", source: "Fragment of Fate" }
745.4 "--Oracle center--" Ability { id: "9CB5", source: "Oracle of Darkness" }
750.7 "Akh Morn (x5)" Ability { id: "9D6E", source: "Oracle of Darkness" } duration 3.9
760.8 "Morn Afah" Ability { id: "9D70", source: "Oracle of Darkness" }
765.1 "--reposition--" Ability { id: "9CB5", source: "Oracle of Darkness" }
776.3 "Crystallize Time" Ability { id: "9D30", source: "Usurper of Frost" }
779.3 "--Usurper untargetable--"
780.3 "--Oracle untargetable--"
782.4 "Edge of Oblivion 3" Ability { id: "9CEE", source: "Fragment of Fate" }
788.3 "Maelstrom (fast)" Ability { id: "9D6B" }
789.3 "Dark Water III" Ability { id: "9D4F" }
791.3 "Dark Blizzard III + Dark Eruption + Dark Aero III" Ability { id: "9D57" }
793.4 "--sync--" Ability { id: "9CEF", source: "Usurper of Frost" }
793.9 "Maelstrom (normal)" Ability { id: "9D6B" }
794.3 "Unholy Darkness" Ability { id: "9D55" }
797.7 "Tidal Light (x4)" Ability { id: "9D3B" } duration 6
798.8 "Maelstrom (slow)" Ability { id: "9D6B" }
799.8 "--sync--" Ability { id: "9CEF", source: "Usurper of Frost" }
804.0 "Tidal Light (x4)" Ability { id: "9D3B" } duration 6
808.2 "Quietus" Ability { id: "9D59", source: "Oracle of Darkness" }
810.2 "(rewind drop)"
813.8 "Spirit Taker" Ability { id: "9D61", source: "Oracle of Darkness" }
817.2 "(stun + rewind)"
819.4 "Hallowed Wings 1" Ability { id: "9D8C", source: "Usurper of Frost" }
824.0 "Hallowed Wings 2" Ability { id: "9D8C", source: "Usurper of Frost" }
828.1 "--center--" Ability { id: "9CB5", source: "Oracle of Darkness" }
829.4 "--targetable--"
833.3 "Akh Morn (x5)" Ability { id: "9D6E", source: "Oracle of Darkness" } duration 3.9
841.3 "Edge of Oblivion 4" Ability { id: "9CEE", source: "Fragment of Fate" }
843.3 "Morn Afah" Ability { id: "9D70", source: "Oracle of Darkness" }
846.5 "--sync--" StartsUsing { id: ["9D71", "9D35"] }
856.5 "Memory's End + Absolute Zero (enrage)" Ability { id: ["9D71","9D35"] }
# Cutscene
956.0 "--sync--" ActorControlExtra { category: "0197", param1: "1E43" } window 150,5 # limited lookbehind due to re-use
962.0 "(stun + cutscene)" Ability { id: "9D28" } window 962,5
# Phase 5
1029.6 "--targetable--"
1034.8 "--sync--" StartsUsing { id: "9D72", source: "Pandora" } window 1034.8,5
1040.8 "Fulgent Blade" Ability { id: "9D72", source: "Pandora" }
# Depending on where the Path of Darkness/Light starts, the duration can range from 18.3s to 22.5s
# The tail end of this is largely irrelevant since the abilities are used at the far perimeter of the arena.
# But to simplify, use a duration of 20.4 (the midpoint).
1052.0 "The Path of Darkness + The Path of Light" Ability { id: "9CB6", source: "Pandora" } duration 20.4
1067.8 "Akh Morn" Ability { id: "9D76", source: "Pandora" }
1076.0 "Paradise Regained" Ability { id: "9D7F", source: "Pandora" }
1086.0 "Wings Dark and Light" Ability { id: ["9D29", "9D79"], source: "Pandora" }
1086.4 "Explosion" Ability { id: "9D80", source: "Pandora" }
1089.9 "Wings Dark and Light + Explosion" Ability { id: "9D80", source: "Pandora" }
1093.4 "Explosion" Ability { id: "9D80", source: "Pandora" }
1107.4 "Polarizing Strikes" Ability { id: "9D7C", source: "Pandora" } duration 2.7
1112.0 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1116.6 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1121.2 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1141.7 "Pandora's Box" Ability { id: "9D86", source: "Pandora" }
1153.8 "Fulgent Blade" Ability { id: "9D72", source: "Pandora" }
1164.9 "The Path of Darkness + The Path of Light" Ability { id: "9CB6", source: "Pandora" } duration 20.4
1180.7 "Akh Morn" Ability { id: "9D76", source: "Pandora" }
1193.0 "Paradise Regained" Ability { id: "9D7F", source: "Pandora" }
1203.0 "Wings Dark and Light" Ability { id: ["9D29", "9D79"], source: "Pandora" }
1203.4 "Explosion" Ability { id: "9D80", source: "Pandora" }
1206.9 "Wings Dark and Light + Explosion" Ability { id: "9D80", source: "Pandora" }
1210.4 "Explosion" Ability { id: "9D80", source: "Pandora" }
1219.2 "Polarizing Strikes" Ability { id: "9D7C", source: "Pandora" } duration 2.7
1223.8 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1228.4 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1233.0 "Polarizing Paths" Ability { id: "9D2A", source: "Pandora" } duration 2.7
1244.3 "Fulgent Blade" Ability { id: "9D72", source: "Pandora" }
1255.3 "The Path of Darkness + The Path of Light" Ability { id: "9CB6", source: "Pandora" } duration 20.4
1271.3 "Akh Morn" Ability { id: "9D76", source: "Pandora" }
1279.8 "--sync--" StartsUsing { id: "9D88", source: "Pandora" }
1301.3 "Paradise Lost (enrage)" Ability { id: "9D88", source: "Pandora" }
# IGNORED ABILITIES
# Fatebreaker
# 9CB4 --sync--: Auto-attack
# 9CC9 Fall Of Faith: Tether castbar, fire
# 9CCA Solemn Charge: Rush to tether target, clones
# 9CCC Fall Of Faith: Tether castbar, lightning
# 9CCD Solemn Charge: Rush to tether target, Fatebreaker
# 9CCF Bow Shock: Lightning bait cones (Sinsmite follow-up)
# 9CD8 Brightfire: Turn Of The Heavens circle explosions
# 9CD9 Brightfire: Turn Of The Heavens circle explosions
# 9CE5 Bound of Faith: Roots + lifts tether target
# 9CE6 Solemn Charge: Rush to tether target, clones, Turn Of The Heavens
# 9CE9 Burn Mark: Tower failure
# Usurper Of Frost
# 9CF0 --sync--: Auto-attack
# 9D0C Reflected Scythe Kick: Blue mirror copy of Scythe Kick
# 9D0E The House Of Light: Mirror Proteans
# 9D13 Hallowed Ray: Stack laser resolves
# ALL ENCOUNTER ABILITIES
# 9CB2 attack
# 9CB3 --sync--: Auto-attack
# 9CB4 --sync--: Auto-attack
# 9CB5 --sync--: P4 boss jump
# 9CB6 the Path of Darkness
# 9CB7 Cruel Path of Light
# 9CB8 Cruel Path of Darkness
# 9CB9 Icecrusher
# 9CBA Explosion: Tower damage
# 9CBB Explosion: Tower damage
# 9CBC Explosion: Tower damage
# 9CBD Explosion: Tower damage
# 9CBE Explosion: Tower damage
# 9CBF Explosion: Tower damage
# 9CC0 Burnished Glory: Enrage
# 9CC1 Burnt Strike: Guillotine cleave, fire
# 9CC2 Blastburn: Fire Burnt Strike knockback
# 9CC3 Explosion: Tower damage
# 9CC4 Unmitigated Explosion
# 9CC5 Burnt Strike: Guillotine cleave, lightning
# 9CC6 Burnout: Lightning Burnt Strike expansion
# 9CC7 Explosion: Tower damage
# 9CC8 Unmitigated Explosion
# 9CC9 Fall Of Faith: Tether castbar, fire
# 9CCA Solemn Charge: Rush to tether target, clones
# 9CCB Sinsmoke
# 9CCC Fall Of Faith: Tether castbar, lightning
# 9CCD Solemn Charge: Rush to tether target, Fatebreaker
# 9CCE Sinsmite: Tether damage, lightning
# 9CCF Bow Shock: Lightning bait cones (Sinsmite follow-up)
# 9CD0 Cyclonic Break: Protean castbar, fire
# 9CD1 Cyclonic Break: Protean, targeted
# 9CD2 Cyclonic Break: Protean, follow-up
# 9CD3 Sinsmoke: Protean follow-up, pairs
# 9CD4 Cyclonic Break: Protean castbar, lightning
# 9CD5 Sinsmite: Protean follow-up, spreads
# 9CD6 Turn Of The Heavens: Emote for Brightfire circle expansion, fire
# 9CD7 Turn Of The Heavens: Emote for Brightfire circle expansion, lightning
# 9CD8 Brightfire: Turn Of The Heavens circle explosions
# 9CD9 Brightfire: Turn Of The Heavens circle explosions
# 9CDA Utopian Sky: Intermission/trio castbar, fire
# 9CDB Utopian Sky: Intermission/trio castbar, lightning
# 9CDC Sinblaze: Tether damage, fire
# 9CDD Blasting Zone: Utopian Sky line AoE castbar
# 9CDE Blasting Zone: Utopian Sky line AoEs
# 9CDF Sinbound Fire III: Utopian Sky light party stacks
# 9CE0 Sinbound Thunder III: Utopian Sky spreads
# 9CE1 Burnt Strike: Utopian Sky guillotine cleave, fire
# 9CE2 Blastburn: Utopian Sky fire Burnt Strike knockback
# 9CE3 Burnt Strike: Utopian Sky guillotine cleave, lightning
# 9CE4 Burnout: Utopian Sky lightning Burnt Strike expansion
# 9CE5 Bound of Faith: Utopian Sky -- Roots + lifts tether target
# 9CE6 Solemn Charge: Utopian Sky -- Rush to tether target, clones
# 9CE7 Sinsmoke: Utopian Sky fire tether damage
# 9CE8 Powder Mark Trail: Splashing tank buster
# 9CE9 Burn Mark: Tower failure
# 9CEA Burnished Glory: Raidwide + bleed
# 9CEB Floating Fetters: Roots + lifts tether target
# 9CEC --sync--: probably also a jump/center
# 9CED --sync--: --center--
# 9CEE Edge of Oblivion
# 9CEF --sync--: P1/P4 boss jump
# 9CF0 --sync--: Auto-attack
# 9CF1 --sync--: Auto-attack
# 9CF2 --sync--: Auto-attack
# 9CF3 Mirror, Mirror: Summon mirrors
# 9CF4 Mirror Image: Summon Shiva clone
# 9CF5 Darkest Dance
# 9CF6 Darkest Dance
# 9CF7 Darkest Dance
# 9CF8 Frost Armor: Slippery floor cast
# 9CF9 Shining Armor: Gaze attack from Shiva and clone
# 9CFA Drachen Armor
# 9CFB the Path of Light
# 9CFC the House of Light: Final P2 Protean castbar
# 9CFD the House of Light: Final P2 Protean castbar
# 9CFE the Path of Light
# 9CFF Quadruple Slap: Shiva tankbuster hit 1
# 9D00 Quadruple Slap: Shiva tankbuster hit 2
# 9D01 Twin Stillness: Front -> back cleave combo, front hit
# 9D02 Twin Silence: Back -> front cleave combo, back hit
# 9D03 Twin Silence: Back -> front cleave combo, front hit
# 9D04 Twin Stillness: Front -> back cleave combo, back hit
# 9D05 Diamond Dust: Raidwide
# 9D06 Icicle Impact: Shiva circles
# 9D07 Frigid Stone: Shiva stars land
# 9D08 Frigid Needle: Shiva star explosions cast (no visible castbar)
# 9D09 Frigid Needle: Shiva star explosions
# 9D0A Axe Kick: Chariot AoE
# 9D0B Scythe Kick: Dynamo AoE
# 9D0C Reflected Scythe Kick: Blue mirror copy of Scythe Kick
# 9D0D Reflected Scythe Kick: Red mirror copy of Scythe Kick
# 9D0E The House Of Light: Mirror Proteans
# 9D0F Heavenly Strike: Knockback
# 9D10 Sinbound Holy: Healer stack puddles castbar
# 9D11 Sinbound Holy: Healer stack puddles
# 9D12 Hallowed Ray: Stack laser castbar
# 9D13 Hallowed Ray: Stack laser resolves
# 9D14 Light Rampant: Raidwide
# 9D15 Bright Hunger: Light Rampant tower resolution
# 9D16 Inescapable Illumination: Lightsteep stacks x5?
# 9D17 Refulgent Fate: Light Rampant chain break
# 9D18 Lightsteep: Light Rampant stack addition
# 9D19 Powerful Light: Light Rampant 4/4 stack orbs
# 9D1A Luminous Hammer: Light Rampant puddles
# 9D1B Burst: Light Rampant large puddle AoEs
# 9D1C Banish III: P2 partner stacks cast (no visible castbar)
# 9D1D Banish III: P2 spreads cast (no visible castbar)
# 9D1E Banish III: P2 partner stacks
# 9D1F Banish III Divided: P2 spreads
# 9D20 Absolute Zero: P2 phase end castbar, raidwide
# 9D21 Swelling Frost
# 9D22 Junction
# 9D23 Hallowed Wings
# 9D24 Hallowed Wings
# 9D25 Hallowed Wings
# 9D26 Hallowed Wings
# 9D27 --sync--: probably also a jump/center
# 9D28 --sync--: probably also a jump/center
# 9D29 Wings Dark and Light
# 9D2A Polarizing Paths
# 9D2B Sinbound Meltdown
# 9D2C Sinbound Fire
# 9D2D Akh Rhai
# 9D2E Akh Rhai
# 9D2F Darklit Dragonsong
# 9D30 Crystallize Time
# 9D31 Longing of the Lost
# 9D32 Joyless Dragonsong
# 9D33 Joyless Dragonsong
# 9D34
# 9D35 Absolute Zero
# 9D36 Materialization
# 9D37 Akh Morn
# 9D38 Akh Morn
# 9D39 Morn Afah
# 9D3A Morn Afah
# 9D3B Tidal Light
# 9D3C Tidal Light
# 9D3D Tidal Light
# 9D3E
# 9D3F Hiemal Storm
# 9D40 Hiemal Storm
# 9D41 Hiemal Ray
# 9D42 Sinbound Blizzard III
# 9D43 Endless Ice Age
# 9D44 Depths of Oblivion
# 9D45 Memory Paradox
# 9D46 Sinbound Blizzard III
# 9D47 Paradise Lost
# 9D48
# 9D49 Hell's Judgment
# 9D4A Ultimate Relativity
# 9D4B Return
# 9D4C Return IV
# 9D4D Spell-in-Waiting Refrain
# 9D4E Dark Water III
# 9D4F Dark Water III
# 9D50 Dark Water III
# 9D51 Dark Eruption
# 9D52 Dark Eruption
# 9D53 Dark Eruption
# 9D54 Dark Fire III
# 9D55 Unholy Darkness
# 9D56 Shadoweye
# 9D57 Dark Blizzard III
# 9D58 Dark Aero III
# 9D59 Quietus
# 9D5A Shockwave Pulsar
# 9D5B Somber Dance
# 9D5C Somber Dance
# 9D5D Somber Dance
# 9D5E Shell Crusher
# 9D5F Shell Crusher
# 9D60 Spirit Taker
# 9D61 Spirit Taker
# 9D62 Black Halo
# 9D63 Sinbound Meltdown
# 9D64 Sinbound Meltdown
# 9D65 Speed
# 9D66 Quicken
# 9D67 Slow
# 9D68 Apocalypse
# 9D69 Apocalypse
# 9D6A Crystallize Time
# 9D6B Maelstrom
# 9D6C Memory's End
# 9D6D Darklit Dragonsong
# 9D6E Akh Morn
# 9D6F Akh Morn
# 9D70 Morn Afah
# 9D71 Memory's End
# 9D72 Fulgent Blade
# 9D73 the Path of Light
# 9D74 the Path of Light
# 9D75 the Path of Darkness
# 9D76 Akh Morn
# 9D77 Akh Morn
# 9D78 Akh Morn
# 9D79 Wings Dark and Light
# 9D7A Wings Dark and Light
# 9D7B Wings Dark and Light
# 9D7C Polarizing Strikes
# 9D7D Cruel Path of Light
# 9D7E Cruel Path of Darkness
# 9D7F Paradise Regained
# 9D80 Explosion
# 9D81 Unmitigated Explosion
# 9D82 Twin Poles
# 9D83 Twin Poles
# 9D84 Twin Poles
# 9D85 Twin Poles
# 9D86 Pandora's Box
# 9D87 Paradise Lost
# 9D88 Paradise Lost
# 9D89 Cyclonic Break: Utopian Sky Protean castbar, fire
# 9D8A Cyckonic Break: Utopian Sky Protean castbar, lightning
# 9D8B Fated Burn Mark
# 9D8C Hallowed Wings
# 9D8D Absolute Zero
# 9D8E Absolute Zero
# 9D8F Memory's End
# 9D90 Memory's End
`,
  overrideTimelineFile: true,
  timelineReplace: [
    {
      locale: "en",
      replaceText: {
        "Axe Kick/Scythe Kick": "Axe/Scythe Kick",
        "Shining Armor + Frost Armor": "Shining + Frost Armor",
        "Sinbound Fire III/Sinbound Thunder III": "Sinbound Fire/Thunder",
        "Dark Fire III/Unholy Darkness": "(spreads/stack)",
        "Dark Fire III/Dark Blizzard III/Unholy Darkness":
          "(spreads/donut/stack)",
        "Shadoweye/Dark Water III/Dark Eruption": "(gazes/stack/spreads)",
        "Dark Water III + Hallowed Wings": "(cleave + stacks)",
        "Dark Blizzard III + Dark Eruption + Dark Aero III":
          "(donut + spread + KBs)",
        "The Path of Darkness + The Path of Light": "(exa-lines)",
      },
    },
    {
      missingTranslations: true,
      locale: "ja",
      replaceSync: {
        "Fatebreaker(?!')": "フェイトブレイカー",
        "Fatebreaker's Image": "フェイトブレイカーの幻影",
        "Usurper of Frost": "シヴァ・ミトロン",
        "Oracle's Reflection": "巫女の鏡像",
        "Ice Veil": "永久氷晶",
        "Frozen Mirror": "氷面鏡",
        "Holy Light": "聖なる光",
        "Crystal of Darkness": "闇水晶",
        "Crystal of Light": "光水晶",
        "Oracle of Darkness": "闇の巫女",
        "Fragment of Fate": "未来の欠片",
        "Sorrow's Hourglass": "悲しみの砂時計",
        "Drachen Wanderer": "聖竜気",
        "Pandora": "パンドラ・ミトロン",
      },
      replaceText: {
        "Blastburn": "バーンブラスト",
        "Blasting Zone": "ブラスティングゾーン",
        "Burn Mark": "爆印",
        "Burnished Glory": "光焔光背",
        "Burnout": "バーンアウト",
        "Burnt Strike": "バーンストライク",
        "Cyclonic Break": "サイクロニックブレイク",
        "Explosion": "爆発",
        "Fall Of Faith": "シンソイルセヴァー",
        "Floating Fetters": "浮遊拘束",
        "Powder Mark Trail": "連鎖爆印刻",
        "Sinblaze": "シンブレイズ",
        "Sinbound Fire III": "シンファイガ",
        "Sinbound Thunder III": "シンサンダガ",
        "Sinsmite": "シンボルト",
        "Sinsmoke": "シンフレイム",
        "Turn Of The Heavens": "転輪召",
        "Utopian Sky": "楽園絶技",
        "the Path of Darkness": "闇の波動",
        "Cruel Path of Light": "光の重波動",
        "Cruel Path of Darkness": "闇の重波動",
        "Icecrusher": "削氷撃",
        "Unmitigated Explosion": "大爆発",
        "Solemn Charge": "チャージスラスト",
        "Bow Shock": "バウショック",
        "Brightfire": "光炎",
        "Bound of Faith": "シンソイルスラスト",
        "Edge of Oblivion": "忘却の此方",
        "Mirror, Mirror": "鏡の国",
        "Mirror Image": "鏡写し",
        "Darkest Dance": "暗夜の舞踏技",
        "Frost Armor": "フロストアーマー",
        "Shining Armor": "ブライトアーマー",
        "Drachen Armor": "ドラゴンアーマー",
        "the Path of Light": "光の波動",
        "the House of Light": "光の津波",
        "Quadruple Slap": "クアドラストライク",
        "Twin Stillness": "静寂の双剣技",
        "Twin Silence": "閑寂の双剣技",
        "Diamond Dust": "ダイアモンドダスト",
        "Icicle Impact": "アイシクルインパクト",
        "Frigid Stone": "アイスストーン",
        "Frigid Needle": "アイスニードル",
        "Axe Kick": "アクスキック",
        "(?<!Reflected )Scythe Kick": "サイスキック",
        "Reflected Scythe Kick": "ミラーリング・サイスキック",
        "Heavenly Strike": "ヘヴンリーストライク",
        "Sinbound Holy": "シンホーリー",
        "Hallowed Ray": "ホーリーレイ",
        "Light Rampant": "光の暴走",
        "Bright Hunger": "浸食光",
        "Inescapable Illumination": "曝露光",
        "Refulgent Fate": "光の呪縛",
        "Lightsteep": "過剰光",
        "Powerful Light": "光爆",
        "Luminous Hammer": "ルミナスイロード",
        "Burst": "爆発",
        "Banish III(?! )": "バニシュガ",
        "Banish III Divided": "ディバイデッド・バニシュガ",
        "Absolute Zero": "絶対零度",
        "Swelling Frost": "凍波",
        "Junction": "ジャンクション",
        "Hallowed Wings": "ホーリーウィング",
        "Wings Dark and Light": "光と闇の片翼",
        "Polarizing Paths": "星霊の剣",
        "Sinbound Meltdown": "シンメルトン",
        "Sinbound Fire(?! )": "シンファイア",
        "Akh Rhai": "アク・ラーイ",
        "Darklit Dragonsong": "光と闇の竜詩",
        "Crystallize Time": "時間結晶",
        "Longing of the Lost": "聖竜気",
        "Joyless Dragonsong": "絶望の竜詩",
        "Materialization": "具象化",
        "Akh Morn": "アク・モーン",
        "Morn Afah": "モーン・アファー",
        "Tidal Light": "光の大波",
        "Hiemal Storm": "ハイマルストーム",
        "Hiemal Ray": "ハイマルレイ",
        "Sinbound Blizzard III": "シンブリザガ",
        "Endless Ice Age": "光の氾濫",
        "Depths of Oblivion": "忘却の彼方",
        "Memory Paradox": "メモリー·パラドックス",
        "Paradise Lost": "失楽園",
        "Hell's Judgment": "ヘル・ジャッジメント",
        "Ultimate Relativity": "時間圧縮・絶",
        "Return": "リターン",
        "Return IV": "リタンジャ",
        "Spell-in-Waiting Refrain": "ディレイスペル・リフレイン",
        "Dark Water III": "ダークウォタガ",
        "Dark Eruption": "ダークエラプション",
        "Dark Fire III": "ダークファイガ",
        "Unholy Darkness": "ダークホーリー",
        "Shadoweye": "シャドウアイ",
        "Dark Blizzard III": "ダークブリザガ",
        "Dark Aero III": "ダークエアロガ",
        "Quietus": "クワイタス",
        "Shockwave Pulsar": "ショックウェーブ・パルサー",
        "Somber Dance": "宵闇の舞踏技",
        "Shell Crusher": "シェルクラッシャー",
        "Spirit Taker": "スピリットテイカー",
        "Black Halo": "ブラックヘイロー",
        "Speed": "スピード",
        "Quicken": "クイック",
        "Slow": "スロウ",
        "Apocalypse": "アポカリプス",
        "Maelstrom": "メイルシュトローム",
        "Memory's End": "エンド・オブ・メモリーズ",
        "Fulgent Blade": "光塵の剣",
        "Polarizing Strikes": "星霊の剣",
        "Paradise Regained": "パラダイスリゲイン",
        "Twin Poles": "光と闇の双剣技",
        "Pandora's Box": "パンドラの櫃",
        "Cyckonic Break": "サイクロニックブレイク",
        "Fated Burn Mark": "死爆印",
      },
    },
    {
      locale: "cn",
      replaceSync: {
        "Fatebreaker(?!')": "绝命战士",
        "Fatebreaker's Image": "绝命战士的幻影",
        "Usurper of Frost": "希瓦·米特隆",
        "Oracle's Reflection": "巫女的镜像",
        "Ice Veil": "永久冰晶",
        "Frozen Mirror": "冰面镜",
        "Holy Light": "圣光",
        "Crystal of Darkness": "暗水晶",
        "Crystal of Light": "光水晶",
        "Oracle of Darkness": "暗之巫女",
        "Fragment of Fate": "未来的碎片",
        "Sorrow's Hourglass": "悲伤的沙漏",
        "Drachen Wanderer": "圣龙气息",
        "Pandora": "潘多拉·米特隆",
      },
      replaceText: {
        "\\(cast\\)": "(咏唱)",
        "\\(close\\)": "(近)",
        "\\(damage\\)": "(伤害)",
        "\\(far\\)": "(远)",
        "\\(fast\\)": "(快)",
        "\\(fire\\)": "(火)",
        "\\(follow-up\\)": "(后续)",
        "\\(group tower\\)": "(小队塔)",
        "\\(jump\\)": "(跳)",
        "\\(knockback\\)": "(击退)",
        "\\(lightning\\)": "(雷)",
        "\\(normal\\)": "(正常)",
        "\\(puddles\\)": "(圈)",
        "\\(rewind drop\\)": "(放置回返)",
        "\\(slow\\)": "(慢)",
        "\\(solo towers\\)": "(单人塔)",
        "\\(stun \\+ cutscene\\)": "(眩晕 + 动画)",
        "\\(stun \\+ rewind\\)": "(眩晕 + 回返)",
        "\\(targeted\\)": "(定向)",
        "--jump south--": "--跳南--",
        "--Oracle center--": "--巫女中央--",
        "--Oracle targetable--": "--巫女可选中--",
        "--Oracle untargetable--": "--巫女不可选中--",
        "--reposition--": "--归位--",
        "--Usurper untargetable--": "--希瓦·米特隆不可选中--",
        "Blastburn": "火燃爆",
        "Blasting Zone": "爆破领域",
        "Burn Mark": "爆印",
        "Burnished Glory": "光焰圆光",
        "Burnout": "雷燃爆",
        "Burnt Strike": "燃烧击",
        "Cyclonic Break": "暴风破",
        "Explosion": "爆炸",
        "Fall Of Faith": "罪壤断",
        "Floating Fetters": "浮游拘束",
        "Powder Mark Trail": "连锁爆印铭刻",
        "Sinblaze": "罪冰焰",
        "Sinbound Fire III": "罪爆炎",
        "Sinbound Thunder III": "罪暴雷",
        "Sinsmite": "罪雷",
        "Sinsmoke": "罪炎",
        "Turn Of The Heavens": "光轮召唤",
        "Utopian Sky": "乐园绝技",
        "the Path of Darkness": "暗之波动",
        "Cruel Path of Light": "光之波涛",
        "Cruel Path of Darkness": "暗之波涛",
        "Icecrusher": "碎冰击",
        "Unmitigated Explosion": "大爆炸",
        "Solemn Charge": "急冲刺",
        "Bow Shock": "弓形冲波",
        "Brightfire": "光炎",
        "Bound of Faith": "罪壤刺",
        "Edge of Oblivion": "忘却的此岸",
        "Mirror, Mirror": "镜中奇遇",
        "Mirror Image": "镜中显影",
        "Darkest Dance": "暗夜舞蹈",
        "Frost Armor": "冰霜护甲",
        "Shining Armor": "闪光护甲",
        "Drachen Armor": "圣龙护甲",
        "the Path of Light": "光之波动",
        "the House of Light": "光之海啸",
        "Quadruple Slap": "四剑斩",
        "Twin Stillness": "静寂的双剑技",
        "Twin Silence": "闲寂的双剑技",
        "Diamond Dust": "钻石星尘",
        "Icicle Impact": "冰柱冲击",
        "Frigid Stone": "冰石",
        "Frigid Needle": "冰针",
        "Axe Kick": "阔斧回旋踢",
        "(?<!Reflected )Scythe Kick": "镰形回旋踢",
        "Reflected Scythe Kick": "连锁反射：镰形回旋踢",
        "Heavenly Strike": "天降一击",
        "Sinbound Holy": "罪神圣",
        "Hallowed Ray": "神圣射线",
        "Light Rampant": "光之失控",
        "Bright Hunger": "侵蚀光",
        "Inescapable Illumination": "曝露光",
        "Refulgent Fate": "光之束缚",
        "Lightsteep": "过量光",
        "Powerful Light": "光爆",
        "Luminous Hammer": "光流侵蚀",
        "Burst": "爆炸",
        "Banish III(?! )": "强放逐",
        "Banish III Divided": "分裂强放逐",
        "Absolute Zero": "绝对零度",
        "Swelling Frost": "寒波",
        "Junction": "融合",
        "Hallowed Wings": "神圣之翼",
        "Wings Dark and Light": "光与暗的孤翼",
        "Polarizing Paths": "星灵之剑",
        "Sinbound Meltdown": "罪熔毁",
        "Sinbound Fire(?! )": "罪火炎",
        "Akh Rhai": "天光轮回",
        "Darklit Dragonsong": "光与暗的龙诗",
        "Crystallize Time": "时间结晶",
        "Longing of the Lost": "圣龙气息",
        "Joyless Dragonsong": "绝望龙诗",
        "Materialization": "赋形",
        "Akh Morn": "死亡轮回",
        "Morn Afah": "无尽顿悟",
        "Tidal Light": "光之巨浪",
        "Hiemal Storm": "严冬风暴",
        "Hiemal Ray": "严冬射线",
        "Sinbound Blizzard III": "罪冰封",
        "Endless Ice Age": "光之泛滥",
        "Depths of Oblivion": "忘却的彼岸",
        "Memory Paradox": "记忆悖论",
        "Paradise Lost": "失乐园",
        "Hell's Judgment": "地狱审判",
        "Ultimate Relativity": "时间压缩·绝",
        "Return": "回返",
        "Return IV": "强回返",
        "Spell-in-Waiting Refrain": "延迟咏唱·递进",
        "Dark Water III": "黑暗狂水",
        "Dark Eruption": "暗炎喷发",
        "Dark Fire III": "黑暗爆炎",
        "Unholy Darkness": "黑暗神圣",
        "Shadoweye": "暗影之眼",
        "Dark Blizzard III": "黑暗冰封",
        "Dark Aero III": "黑暗暴风",
        "Quietus": "寂灭",
        "Shockwave Pulsar": "脉冲星震波",
        "Somber Dance": "真夜舞蹈",
        "Shell Crusher": "破盾一击",
        "Spirit Taker": "碎灵一击",
        "Black Halo": "黑色光环",
        "Speed": "限速",
        "Quicken": "神速",
        "(?<!\\()Slow(?<!\\))": "减速",
        "Apocalypse": "启示",
        "Maelstrom": "巨漩涡",
        "Memory's End": "记忆终结",
        "Fulgent Blade": "光尘之剑",
        "Polarizing Strikes": "星灵之剑",
        "Paradise Regained": "复乐园",
        "Twin Poles": "光与暗的双剑技",
        "Pandora's Box": "潘多拉魔盒",
        "Cyckonic Break": "暴风破",
        "Fated Burn Mark": "死爆印",
      },
    },
  ],
  triggers: [
    { id: "FRU Phase Tracker", disabled: true },
    { id: "FRU ActorSetPos Collector", disabled: true },
    { id: "FRU P1 Cyclonic Break Fire", disabled: true },
    { id: "FRU P1 Cyclonic Break Lightning", disabled: true },
    { id: "FRU P1 Powder Mark Trail", disabled: true },
    { id: "FRU P1 Utopian Sky Collector", disabled: true },
    { id: "FRU Conceal Safe", disabled: true },
    { id: "FRU P1 Burnished Glory", disabled: true },
    { id: "FRU P1 Burnt Strike Fire", disabled: true },
    { id: "FRU P1 Burnt Strike Lightning", disabled: true },
    { id: "FRU P1 Turn of the Heavens Fire", disabled: true },
    { id: "FRU P1 Turn of the Heavens Lightning", disabled: true },
    { id: "FRU P1 Fall of Faith Collector", disabled: true },
    { id: "FRU P2 Quadruple Slap First", disabled: true },
    { id: "FRU P2 Quadruple Slap Debuff Gain", disabled: true },
    { id: "FRU P2 Quadruple Slap Debuff Loss", disabled: true },
    { id: "FRU P2 Quadruple Slap Second", disabled: true },
    { id: "FRU P2 Diamond Dust", disabled: true },
    { id: "FRU P2 Axe/Scythe Kick Collect", disabled: true },
    { id: "FRU P2 Icicle Impact Initial Collect", disabled: true },
    { id: "FRU P2 House of Light/Frigid Stone", disabled: true },
    { id: "FRU P2 Heavenly Strike", disabled: true },
    { id: "FRU P2 Shiva Cleave Add Collect", disabled: true },
    { id: "FRU P2 Sinbound Holy Rotation", disabled: true },
    { id: "FRU P2 Shining Armor", disabled: true },
    { id: "FRU P2 Twin Silence/Stillness First", disabled: true },
    { id: "FRU P2 Twin Silence/Stillness Second", disabled: true },
    { id: "FRU P2 Mirror Mirror Initial Cleaves", disabled: true },
    { id: "FRU P2 Mirror Mirror Reflected Cleaves", disabled: true },
    { id: "FRU P2 Mirror Mirror Banish III", disabled: true },
    { id: "FRU P2 Lightsteeped Counter", disabled: true },
    { id: "FRU P2 Light Rampant Setup", disabled: true },
    { id: "FRU P2 Light Rampant Tower", disabled: true },
    { id: "FRU P2 Light Rampant Banish III", disabled: true },
    { id: "FRU P2 The House of Light", disabled: true },
    { id: "FRU P2 Absolute Zero", disabled: true },
    { id: "FRU Intermission Target Veil", disabled: true },
    { id: "FRU Intermission Junction", disabled: true },
    { id: "FRU P3 Ultimate Relativity AoE", disabled: true },
    { id: "FRU P3 Ultimate Relativity Debuff Collect", disabled: true },
    { id: "FRU P3 Ultimate Relativity Initial Debuff", disabled: true },
    { id: "FRU P3 Ultimate Relativity Stoplight Collect", disabled: true },
    { id: "FRU P3 Ultimate Relativity Y North Spot", disabled: true },
    { id: "FRU P3 Ultimate Rel 1st Fire/Stack", disabled: true },
    { id: "FRU P3 Ultimate Rel 1st Bait/Rewind", disabled: true },
    { id: "FRU P3 Ultimate Rel 2nd Fire/Stack + Ice", disabled: true },
    { id: "FRU P3 Ultimate Rel 2nd Bait/Rewind", disabled: true },
    { id: "FRU P3 Ultimate Rel 3rd Fire/Stack", disabled: true },
    { id: "FRU P3 Ultimate Rel 3nd Bait", disabled: true },
    { id: "FRU P3 Ultimate Rel Rewind", disabled: true },
    { id: "FRU P3 Shockwave Pulsar", disabled: true },
    { id: "FRU P3 Black Halo", disabled: true },
    { id: "FRU P3 Apoc Dark Water Side Collect", disabled: true },
    { id: "FRU P3 Apoc Dark Water Swap Check", disabled: true },
    { id: "FRU P3 Apoc Dark Water Debuff", disabled: true },
    { id: "FRU P3 Apoc Collect", disabled: true },
    { id: "FRU P3 Apoc Safe Early", disabled: true },
    { id: "FRU P3 Apoc Safe", disabled: true },
    { id: "FRU P3 Apoc First Stacks", disabled: true },
    { id: "FRU P3 Apoc Spirit Taker", disabled: true },
    { id: "FRU P3 Apoc Second Stacks", disabled: true },
    { id: "FRU P3 Apoc Darkest Dance Jump Bait", disabled: true },
    { id: "FRU P3 Darkest Dance KB + Third Stacks", disabled: true },
    { id: "FRU P3 Memory's End", disabled: true },
    { id: "FRU P4 Akh Rhai", disabled: true },
    { id: "FRU P4 Akh Morn", disabled: true },
    { id: "FRU P4 Morn Afah", disabled: true },
    { id: "FRU P4 Darklit Dragonsong", disabled: true },
    { id: "FRU P4 Darklit Stacks Collect", disabled: true },
    { id: "FRU P4 Darklit Tether + Cleave Collect", disabled: true },
    { id: "FRU P4 Darklit Tower / Bait", disabled: true },
    { id: "FRU P4 Darklit Cleave Stack", disabled: true },
    { id: "FRU P4 Darklit Spirit Taker", disabled: true },
    { id: "FRU P4 Hallowed Wings", disabled: true },
    { id: "FRU P4 Crystallize Time", disabled: true },
    { id: "FRU P4 Crystallize Time Debuff Collect", disabled: true },
    { id: "FRU P4 Crystallize Time Debuff", disabled: true },
    { id: "FRU P4 Crystallize Time Stoplight Collect", disabled: true },
    { id: "FRU P4 Crystallize Time Initial Position", disabled: true },
    { id: "FRU P4 Crystallize Time Blue Cleanse", disabled: true },
    { id: "FRU P4 Crystallize Time Tidal Light Collect", disabled: true },
    { id: "FRU P4 Crystallize Time Drop Rewind", disabled: true },
    { id: "FRU P4 Crystallize Time Spirit Taker", disabled: true },
    // #region 通用
    {
      id: "Souma 绝伊甸 Headmarker",
      type: "HeadMarker",
      netRegex: {},
      condition: (data) => data.soumaDecOffset === undefined,
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: "Souma 绝伊甸 阶段控制",
      type: "StartsUsing",
      // 9CFF = P2 四剑斩
      // 9D49 = P3 地狱审判
      // 9D36 = P4 赋形
      // 9D72 = P5 光尘之剑
      netRegex: { id: ["9CFF", "9D49", "9D36", "9D72"], capture: true },
      suppressSeconds: 20,
      run: (data, matches) => {
        switch (matches.id) {
          case "9CFF": {
            data.soumaPhase = "P2";
            data.soumaCombatantData = [];
            data.soumaP1线存储.length = 0;
            data.soumaP1线处理 = undefined;
            data.soumaP1雾龙ids.length = 0;
            data.soumaP1雾龙属性 = undefined;
            data.soumaP1塔.length = 0;
            break;
          }
          case "9D49": {
            data.soumaPhase = "P3";
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
          case "9D36": {
            data.soumaPhase = "P4";
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
          case "9D72": {
            data.soumaPhase = "P5";
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
      id: "Souma 绝伊甸 P1 老父亲AOE",
      type: "StartsUsing",
      netRegex: { id: "9CEA" },
      response: Responses.bleedAoe(),
    },
    {
      id: "Souma 绝伊甸 P1 火塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9CD0", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "火：八方 => 与搭档分摊",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 火塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9CD0", capture: false },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "与搭档分摊",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雷塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9CD4", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "雷：八方 => 分散",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雷塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9CD4", capture: false },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "分散",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 死刑",
      type: "StartsUsing",
      netRegex: { id: "9CE8" },
      response: Responses.tankBuster(),
    },
    {
      id: "Souma 绝伊甸 P1 连锁爆印刻",
      type: "GainsEffect",
      netRegex: { effectId: "1046" },
      condition: (data, matches) => {
        return data.role === "tank" || matches.target === data.me;
      },
      delaySeconds: 13,
      alarmText: (data, matches, output) => {
        if (matches.target === data.me) {
          return output.me();
        }
        return output.text({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        me: { en: "爆印死刑" },
        text: { en: "死刑：靠近 ${player}" },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙属性记忆",
      type: "StartsUsing",
      netRegex: { id: ["9CDB", "9CDA"] },
      infoText: (data, matches, output) => {
        data.soumaP1雾龙属性 = matches.id === "9CDB" ? "thunder" : "fire";
        return output[data.soumaP1雾龙属性]();
      },
      outputStrings: {
        fire: { en: "火：稍后分组分摊" },
        thunder: { en: "雷：稍后分散" },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙属性记忆第二次提醒",
      type: "StartsUsing",
      netRegex: { id: ["9CDB", "9CDA"], capture: false },
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
        fire: { en: "分组分摊" },
        thunder: { en: "分散" },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙",
      type: "StartsUsing",
      netRegex: { id: "9CDE" },
      condition: (data) => data.triggerSetConfig.启用雾龙报安全区,
      preRun: (data, matches) => {
        data.soumaP1雾龙ids.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP1雾龙ids.length === 3) {
          data.soumaCombatantData = (
            await callOverlayHandler({
              call: "getCombatants",
            })
          ).combatants.filter((v) => v.WeaponId === 4);
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
          return output[safeDirs.join("")]();
        }
      },
      outputStrings: {
        "04": { en: "A、C安全" },
        "15": { en: "4、2安全" },
        "26": { en: "D、B安全" },
        "37": { en: "1、3安全" },
      },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙后雷塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9D8A", capture: false },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: "雷：八方 => 分散" } },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙后雷塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9D8A", capture: false },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: "分散" } },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙后火塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9D89", capture: false },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: "火：八方 => 与搭档分摊" } },
    },
    {
      id: "Souma 绝伊甸 P1 雾龙后火塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9D89", capture: false },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: "与搭档分摊" } },
    },
    {
      id: "Souma 绝伊甸 P1一运光轮颜色",
      type: "StartsUsing",
      netRegex: { id: "9CD[67]" },
      delaySeconds: 6,
      durationSeconds: 12,
      infoText: (_data, matches, output) => {
        const color = matches.id === "9CD6" ? "fire" : "thunder";
        return output[color]();
      },
      outputStrings: {
        fire: { en: "找蓝色" },
        thunder: { en: "找红色" },
      },
    },
    {
      id: "Souma 绝伊甸 P1一运火击退",
      type: "StartsUsing",
      netRegex: { id: "9CE1", capture: false },
      delaySeconds: 9,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "靠近",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 连线",
      type: "Tether",
      netRegex: {
        // 00F9 火
        // 011F 冰
        id: ["00F9", "011F"],
      },
      condition: (data) => data.soumaPhase === "P1",
      preRun: (data, matches) => {
        data.soumaP1线存储.push(matches);
      },
      durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          switch: { en: "换换换！" },
          fire: { en: "火" },
          thunder: { en: "雷" },
          line1ac: { en: "1${el}：上↑正点" },
          line2ac: { en: "2${el}：下↓正点" },
          line3ac: { en: "3${el}：上↑最外 ${handleOrder}" },
          line4ac: { en: "4${el}：下↓最外 ${handleOrder}" },
          line1bdfire: { en: "1火：左上" },
          line1bdthunder: { en: "1雷：左中" },
          line2bdfire: { en: "2火：右上" },
          line2bdthunder: { en: "2雷：右中" },
          line3bdfirePfire: { en: "3火：左中吃火 => 换位放火" },
          line3bdfirePthunder: { en: "3火：左上引雷 => 原地放火" },
          line3bdthunderPfire: { en: "3雷：左中吃火 => 原地放雷" },
          line3bdthunderPthunder: { en: "3雷：左上引雷 => 换位放雷" },
          line4bdfirePfire: { en: "4火：右中吃火 => 换位放火" },
          line4bdfirePthunder: { en: "4火：右上引雷 => 原地放火" },
          line4bdthunderPfire: { en: "4雷：右中吃火 => 原地放雷" },
          line4bdthunderPthunder: { en: "4雷：右上引雷 => 换位放雷" },
          nothing1ac: { en: "闲1：上↑" },
          nothing2ac: { en: "闲2：上↑" },
          nothing3ac: { en: "闲3：下↓" },
          nothing4ac: { en: "闲4：下↓" },
          nothing1bd: { en: "闲1：左←正点" },
          nothing2bd: { en: "闲2：左←下" },
          nothing3bd: { en: "闲3：右→下" },
          nothing4bd: { en: "闲4：右→正点" },
          handleElLine: { en: "${el1} => ${el2}" },
          handleElNothingfirefire: { en: "火火：保持集合" },
          handleElNothingfirethunder: { en: "火雷：集合 => 散开" },
          handleElNothingthunderfire: { en: "雷火：散开 => 集合" },
          handleElNothingthunderthunder: { en: "雷雷：保持散开" },
          linebdfirefire: { en: "放火 => 换位吃火" },
          linebdfirethunder: { en: "放火 => 原地引雷" },
          linebdthunderfire: { en: "放雷 => 原地吃火" },
          linebdthunderthunder: { en: "放雷 => 换位引雷" },
          text: { en: "${switcherRes}（分摊点：${lines}）" },
          needSwitch: { en: "${rp}换" },
          dontSwitch: { en: "不用换" },
          stack: { en: "分摊（不换）" },
          stackUp: { en: "分摊（换边）" },
          stackDown: { en: "分摊（换边）" },
          handleOrder: { en: "${gimmick} ${handleOrder}" },
        };
        // 第一次连线机制 双分摊
        if (data.soumaP1线存储.length === 2) {
          const northGroup = data.triggerSetConfig.P1双火线上半场组.toString()
            .split(/[,\\/，]/)
            .map((v) => v.trim().toUpperCase());
          const southGroup = data.triggerSetConfig.P1双火线下半场组.toString()
            .split(/[,\\/，]/)
            .map((v) => v.trim().toUpperCase());
          const rule = [...northGroup, ...southGroup];
          const lines = data.soumaP1线存储
            .map((v) => getRpByName(data, v.target))
            .sort((a, b) => rule.indexOf(a) - rule.indexOf(b));
          const northCount = lines.filter((v) => northGroup.includes(v)).length;
          let switcher;
          if (northCount === 0) {
            switcher = data.triggerSetConfig.P1双火线上半场组换位人.toString();
          } else if (northCount === 2) {
            switcher = data.triggerSetConfig.P1双火线下半场组换位人.toString();
          }
          const povRp = getRpByName(data, data.me);
          if (lines[0] === povRp) {
            if (northGroup.includes(povRp) || switcher === undefined) {
              return { infoText: output.stack() };
            }
            return { alertText: output.stackUp() };
          } else if (lines[1] === povRp) {
            if (southGroup.includes(povRp) || switcher === undefined) {
              return { infoText: output.stack() };
            }
            return { alertText: output.stackDown() };
          } else if (switcher === povRp) {
            return { alarmText: output.switch() };
          }
          const switcherRes =
            switcher !== undefined
              ? output.needSwitch({ rp: switcher })
              : output.dontSwitch();
          return {
            infoText: output.text({
              switcherRes: switcherRes,
              lines: lines.join(", "),
            }),
            tts: switcher === povRp ? output.switch() : switcherRes,
          };
        }
        const guide = data.triggerSetConfig.P1雷火线打法.toString();
        // 第二次连线机制 四根雷火线
        if (data.soumaP1线存储.length === 3) {
          // console.debug('P1线');
          if (data.triggerSetConfig.伊甸P1连线机制标点 === "开")
            mark(
              parseInt(data.soumaP1线存储[2].targetId, 16),
              data.triggerSetConfig.伊甸P1标线1.toString(),
              false
            );
          if (data.soumaP1线存储[2]?.target === data.me) {
            data.soumaP1线处理 = "线1";
            const element =
              data.soumaP1线存储[2].id === "00F9" ? "fire" : "thunder";
            if (guide === "ac") {
              return {
                alertText: output[`line1ac`]({ el: output[element]() }),
              };
            }
            if (guide === "bd") {
              return { alertText: output[`line1bd${element}`]() };
            }
          }
          return;
        }
        const elements = data.soumaP1线存储
          .map((v) => (v.id === "00F9" ? "fire" : "thunder"))
          .slice(2, 6);
        if (data.soumaP1线存储.length === 4) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === "开")
            mark(
              parseInt(data.soumaP1线存储[3].targetId, 16),
              data.triggerSetConfig.伊甸P1标线2.toString(),
              false
            );
          if (data.soumaP1线存储[3]?.target === data.me) {
            data.soumaP1线处理 = "线2";
            const element =
              data.soumaP1线存储[3].id === "00F9" ? "fire" : "thunder";
            if (guide === "ac") {
              return {
                alertText: output[`line2ac`]({ el: output[element]() }),
              };
            }
            if (guide === "bd") {
              return { alertText: output[`line2bd${element}`]() };
            }
          }
          return;
        }
        if (data.soumaP1线存储.length === 5) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === "开")
            mark(
              parseInt(data.soumaP1线存储[4].targetId, 16),
              data.triggerSetConfig.伊甸P1标线3.toString(),
              false
            );
          if (data.soumaP1线存储[4]?.target === data.me) {
            data.soumaP1线处理 = "线3";
            const element =
              data.soumaP1线存储[4].id === "00F9" ? "fire" : "thunder";
            const partnerElement =
              data.soumaP1线存储[4 - 2].id === "00F9" ? "fire" : "thunder";
            const playerHandle = p1LinesHandler.线3;
            const el1 = output[elements[playerHandle[0] - 1]]();
            const el2 = output[elements[playerHandle[1] - 1]]();
            const handleOrder = output.handleElLine({ el1, el2 });
            if (guide === "ac") {
              return {
                alertText: output.line3ac({
                  el: output[element](),
                  handleOrder: handleOrder,
                }),
              };
            }
            if (guide === "bd") {
              return {
                alertText: output[`line3bd${element}P${partnerElement}`](),
              };
            }
          }
          return;
        }
        if (data.soumaP1线存储.length === 6) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === "开") {
            mark(
              parseInt(data.soumaP1线存储[5].targetId, 16),
              data.triggerSetConfig.伊甸P1标线4.toString(),
              false
            );
            clearMark(15);
          }
          if (data.soumaP1线存储[5]?.target === data.me) {
            data.soumaP1线处理 = "线4";
          }
          const lines = data.soumaP1线存储.slice(2, 6);
          const targetsIds = lines.map((v) => v.targetId);
          const nothingRule =
            data.triggerSetConfig.P1连线机制闲人优先级.toString()
              .split(/[,\\/，]/)
              .map((v) => v.trim().toUpperCase());
          const nothing = data.party.details
            .filter((v) => !targetsIds.includes(v.id))
            .sort((a, b) => {
              return (
                nothingRule.indexOf(getRpByName(data, a.name)) -
                nothingRule.indexOf(getRpByName(data, b.name))
              );
            });
          if (nothing.length !== 4) {
            throw new Error("nothing长度不等于4");
          }
          if (data.triggerSetConfig.伊甸P1连线机制标点 === "开") {
            mark(
              parseInt(nothing[0].id, 16),
              data.triggerSetConfig.伊甸P1标闲1.toString(),
              false
            );
            mark(
              parseInt(nothing[1].id, 16),
              data.triggerSetConfig.伊甸P1标闲2.toString(),
              false
            );
            mark(
              parseInt(nothing[2].id, 16),
              data.triggerSetConfig.伊甸P1标闲3.toString(),
              false
            );
            mark(
              parseInt(nothing[3].id, 16),
              data.triggerSetConfig.伊甸P1标闲4.toString(),
              false
            );
          }
          if (data.soumaP1线存储[4]?.target === data.me) {
            return;
          }
          if (nothing[0]?.name === data.me) {
            data.soumaP1线处理 = "闲1";
          }
          if (nothing[1]?.name === data.me) {
            data.soumaP1线处理 = "闲2";
          }
          if (nothing[2]?.name === data.me) {
            data.soumaP1线处理 = "闲3";
          }
          if (nothing[3]?.name === data.me) {
            data.soumaP1线处理 = "闲4";
          }
          const playerHandle = p1LinesHandler[data.soumaP1线处理];
          const youIsNothing = nothing.findIndex((v) => v.name === data.me);
          const gimmick = `${
            youIsNothing >= 0
              ? output[`nothing${(youIsNothing + 1).toString()}${guide}`]()
              : ""
          }`;
          if (data.soumaP1线存储[5]?.target === data.me) {
            const el1 = output[elements[playerHandle[0] - 1]]();
            const el2 = output[elements[playerHandle[1] - 1]]();
            const handleOrder = output.handleElLine({ el1, el2 });
            const element =
              data.soumaP1线存储[5].id === "00F9" ? "fire" : "thunder";
            if (guide === "ac") {
              return {
                alertText: output.line4ac({
                  el: output[element](),
                  handleOrder: handleOrder,
                }),
              };
            }
            if (guide === "bd") {
              const partnerElement =
                data.soumaP1线存储[5 - 2].id === "00F9" ? "fire" : "thunder";
              return {
                alertText: output[`line4bd${element}P${partnerElement}`]({
                  el: output[element](),
                }),
              };
            }
          }
          if (guide === "ac" && data.soumaP1线处理?.at(0) === "闲") {
            // ac打法所有闲人
            const el1 = elements[playerHandle[0] - 1];
            const el2 = elements[playerHandle[1] - 1];
            const handleOrder = output[`handleElNothing${el1}${el2}`]();
            return { infoText: output.handleOrder({ gimmick, handleOrder }) };
          }
          if (guide === "bd" && data.soumaP1线处理?.at(0) === "线") {
            // bd打法的线12
            let l1;
            let l2;
            if (data.soumaP1线处理 === "线1") {
              l1 = data.soumaP1线存储[2].id === "00F9" ? "fire" : "thunder";
              l2 = data.soumaP1线存储[4].id === "00F9" ? "fire" : "thunder";
            } else if (data.soumaP1线处理 === "线2") {
              l1 = data.soumaP1线存储[3].id === "00F9" ? "fire" : "thunder";
              l2 = data.soumaP1线存储[5].id === "00F9" ? "fire" : "thunder";
            } else {
              throw new Error("不可能");
            }
            return { infoText: output[`linebd${l1}${l2}`]() };
          }
          // ac打法的线12 与 bd打法的所有闲人
          const el1 = output[elements[playerHandle[0] - 1]]();
          const el2 = output[elements[playerHandle[1] - 1]]();
          const handleOrder = output.handleElLine({ el1, el2 });
          return { infoText: output.handleOrder({ gimmick, handleOrder }) };
        }
        return undefined;
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔+火塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9CC1", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "直线 => 击退",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔+火塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9CC1", capture: false },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "靠近",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔+雷塔器Q",
      type: "StartsUsing",
      netRegex: { id: "9CC5", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "直线 => 去外侧",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔+雷塔器Q after",
      type: "StartsUsing",
      netRegex: { id: "9CC5", capture: false },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "远离",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 狂暴",
      type: "StartsUsing",
      netRegex: { id: "9CC0", capture: false },
      condition: (data) => data.soumaPhase === "P1",
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "狂暴",
        },
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔 collect",
      type: "StartsUsingExtra",
      netRegex: {
        id: Object.keys(p1Towers),
        capture: true,
      },
      condition: (data) => data.soumaPhase === "P1" && data.role !== "tank",
      preRun: (data, matches) => {
        data.soumaP1塔.push({
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          count: p1Towers[matches.id],
        });
      },
    },
    {
      id: "Souma 绝伊甸 P1 塔",
      type: "StartsUsingExtra",
      netRegex: {
        id: Object.keys(p1Towers),
        capture: false,
      },
      condition: (data) => data.soumaPhase === "P1" && data.role !== "tank",
      delaySeconds: 2,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const towers = data.soumaP1塔.sort((a, b) => a.y - b.y).slice();
        if (towers.length !== 3) {
          return output.unknown();
        }
        if (data.triggerSetConfig.伊甸P1踩塔基准 === "simple") {
          return output.simple({
            c1: towers[0].count,
            c2: towers[1].count,
            c3: towers[2].count,
          });
        }
        const rp = getRpByName(data, data.me);
        if (data.triggerSetConfig.伊甸P1踩塔基准 === "mmw") {
          const [northFixed, northFlex] =
            data.triggerSetConfig.伊甸P1踩塔补位式北塔人
              .toString()
              .split(/[,\\/，]/)
              .map((v) => v.trim().toUpperCase());
          const [middleFixed, middleFlex] =
            data.triggerSetConfig.伊甸P1踩塔补位式中塔人
              .toString()
              .split(/[,\\/，]/)
              .map((v) => v.trim().toUpperCase());
          const [southFiexed, southFlex] =
            data.triggerSetConfig.伊甸P1踩塔补位式南塔人
              .toString()
              .split(/[,\\/，]/)
              .map((v) => v.trim().toUpperCase());
          const fiexeds = [northFixed, middleFixed, southFiexed];
          const flexs = [northFlex, middleFlex, southFlex];
          if (fiexeds.includes(rp)) {
            return output[`place${fiexeds.indexOf(rp)}`]();
          }
          const flexsIndex = flexs.findIndex((v) => v === rp);
          if (flexsIndex === -1) {
            return output.unknown();
          }
          if (towers[flexsIndex].count === 1) {
            const flexIndex = towers.findIndex((v) => v.count >= 3);
            if (flexIndex === -1) {
              return output.unknown();
            }
            return output[`flex${flexIndex}`]();
          }
          return output[`place${flexs.indexOf(rp)}`]();
        }
        if (data.triggerSetConfig.伊甸P1踩塔基准 === "mgl") {
          const priority = data.triggerSetConfig.伊甸P1踩塔填充优先级
            .toString()
            .split(/[,\\/，]/)
            .map((v) => v.trim().toUpperCase());
          const seat = [
            Array.from({ length: towers[0].count }),
            Array.from({ length: towers[1].count }),
            Array.from({ length: towers[2].count }),
          ];
          for (let i = 0; i < seat.length; i++) {
            for (let j = 0; j < seat[i].length; j++) {
              if (seat[i][j] === undefined) {
                seat[i][j] = priority.shift();
              }
            }
          }
          const myIndex = seat.findIndex((v) => v.includes(rp));
          return output[`place${myIndex}`]();
        }
      },
      run: (data) => {
        data.soumaP1塔.length = 0;
      },
      outputStrings: {
        unknown: { en: "踩塔" },
        simple: { en: "塔：${c1} ${c2} ${c3}" },
        place0: { en: "踩 北 塔" },
        place1: { en: "踩 中间 塔" },
        place2: { en: "踩 南 塔" },
        flex0: { en: "补 北 塔" },
        flex1: { en: "补 中间 塔" },
        flex2: { en: "补 南 塔" },
      },
    },
    // #endregion P1
    // #region P2
    {
      id: "Souma 伊甸 P2 死刑",
      type: "StartsUsing",
      netRegex: { id: "9CFF" },
      response: Responses.tankBusterSwap(),
    },
    {
      id: "Souma 伊甸 P2 钻石星辰",
      type: "StartsUsing",
      netRegex: { id: "9D05" },
      response: Responses.bigAoe("alert"),
    },
    {
      id: "Souma 伊甸 P2 冰圈初始点",
      type: "CombatantMemory",
      netRegex: {
        id: "4[0-9A-Fa-f]{7}",
        pair: [{ key: "BNpcNameID", value: "3209" }],
        capture: true,
      },
      condition: (data, matches) =>
        matches.change === "Change" &&
        data.soumaPhase === "P2" &&
        matches.pairPosX !== undefined &&
        matches.pairPosY !== undefined,
      suppressSeconds: 30,
      run: (data, matches) => {
        const { pairPosX: x, pairPosY: y } = matches;
        const dirNum = Directions.xyTo8DirNum(
          parseFloat(x),
          parseFloat(y),
          100,
          100
        );
        const sortRule = [0, 7, 6, 5, 4, 3, 2, 1];
        data.soumaP2冰圈初始位置DirNum = [dirNum, (dirNum + 4) % 8].sort(
          (a, b) => sortRule.indexOf(a) - sortRule.indexOf(b)
        );
        data.soumaP2冰圈初始位置 = dirNum % 2 === 0 ? "正" : "斜";
      },
    },
    {
      id: "Souma 伊甸 P2 钢铁还是月环",
      type: "StartsUsing",
      netRegex: { id: ["9D0A", "9D0B"] },
      run: (data, matches) => {
        data.soumaP2钢月 = matches.id === "9D0A" ? "钢铁" : "月环";
      },
    },
    {
      id: "Souma 伊甸 P2 冰花点名",
      type: "HeadMarker",
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === "P2" &&
        getHeadmarkerId(data, matches) === headmarkers.冰花,
      preRun: (data, matches) => {
        data.soumaP2冰花点名.push(matches);
      },
      delaySeconds: 0.4,
      alarmText: (data, _matches, output) => {
        if (data.soumaP2冰花点名.length === 4) {
          const 冰花RP = data.soumaP2冰花点名.map((v) =>
            getRpByName(data, v.target)
          );
          const 冰花职能 = ["MT", "ST", "H1", "H2"].find((v) =>
            冰花RP.includes(v)
          )
            ? "TH"
            : "DPS";
          const 冰花去 =
            data.soumaP2冰圈初始位置 === "正" ? output.斜() : output.正();
          const 水波去 = data.soumaP2冰圈初始位置;
          const 玩家职能 = data.role === "dps" ? "DPS" : "TH";
          data.soumaP2冰花点名.length = 0;
          data.soumaP2DD处理 = 玩家职能 === 冰花职能 ? "冰花" : "水波";
          return 玩家职能 === 冰花职能
            ? output.冰花({ go: output[data.soumaP2钢月](), direction: 冰花去 })
            : output.水波({
                go: output[data.soumaP2钢月](),
                direction: 水波去,
              });
        }
      },
      outputStrings: {
        钢铁: { en: "钢铁外" },
        月环: { en: "月环内" },
        正: { en: "正" },
        斜: { en: "斜" },
        水波: { en: "${go} + ${direction} 水波(靠近)" },
        冰花: { en: "${go} + ${direction} 冰花(远离)" },
      },
    },
    {
      id: "Souma 伊甸 P2 冰花点名2",
      type: "HeadMarker",
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === "P2" &&
        getHeadmarkerId(data, matches) === headmarkers.冰花,
      delaySeconds: 5.5,
      suppressSeconds: 999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          冰花: { en: "放冰花" },
          水波: { en: "去场中" },
        };
        if (data.soumaP2DD处理 === "冰花") {
          return { alarmText: output.冰花() };
        }
        return { infoText: output.水波() };
      },
    },
    {
      id: "Souma 伊甸 P2 击退",
      type: "StartsUsing",
      netRegex: { id: "9D05", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 17,
      durationSeconds: 5,
      alarmText: (data, _matches, output) => {
        return output.text({
          dir: data.soumaP2冰圈初始位置DirNum.map((v) => output[v]()).join("/"),
        });
      },
      outputStrings: {
        text: { en: "${dir}击退" },
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
      id: "Souma 伊甸 P2 击退分身",
      type: "StartsUsing",
      netRegex: { id: "9D10" },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 3,
      durationSeconds: 9,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          0: { en: "<= 顺180" },
          180: { en: "<= 顺180" },
          135: { en: "<= 顺135" },
          90: { en: "<= 顺90" },
          45: { en: "反跑！逆135 =>" },
        };
        const { x, y } = matches;
        const num = Directions.xyTo8DirNum(
          parseFloat(x),
          parseFloat(y),
          100,
          100
        );
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
      id: "Souma 伊甸 P2 4连分摊",
      type: "StartsUsing",
      netRegex: { id: "9D10" },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "连续分摊（4次）" },
      },
    },
    {
      id: "Souma 伊甸 P2 背对",
      type: "StartsUsing",
      netRegex: { id: "9D10", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 12,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "背对场外分身" },
      },
    },
    {
      id: "Souma 伊甸 P2 静后",
      type: "StartsUsing",
      netRegex: { id: "9D01" },
      response: Responses.getBackThenFront(),
    },
    {
      id: "Souma 伊甸 P2 闲前",
      type: "StartsUsing",
      netRegex: { id: "9D02" },
      response: Responses.getFrontThenBack(),
    },
    {
      id: "Souma 伊甸 P2 直线分摊",
      type: "StartsUsing",
      netRegex: { id: "9D12", capture: false },
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "直线分摊" },
      },
    },
    {
      id: "Souma 伊甸 P2 镜中奇遇",
      type: "StartsUsing",
      netRegex: { id: "9CF3" },
      condition: (data) => data.soumaPhase === "P2",
      preRun: (data, _matches) => {
        data.soumaP2镜中奇遇 = true;
        // console.log(_matches.timestamp);
      },
    },
    {
      id: "Souma 伊甸 P2 镜中奇遇分身",
      type: "CombatantMemory",
      netRegex: {
        id: "4[0-9A-Fa-f]{7}",
        capture: true,
      },
      condition: (data, matches) => {
        if (
          !data.soumaP2镜中奇遇 ||
          data.soumaPhase !== "P2" ||
          matches.change !== "Change"
        ) {
          return false;
        }
        const attrs = [
          "type",
          "timestamp",
          "change",
          "id",
          "pairHeading",
          "pairPosX",
          "pairPosY",
          "pairPosZ",
        ];
        return attrs.every((a) => matches[a]);
      },
      preRun: (data, matches) => {
        data.soumaP2镜中奇遇分身.push(matches);
      },
      delaySeconds: 0.5,
      durationSeconds: 20,
      promise: async (data) => {
        data.soumaCombatantData = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        ).combatants.filter(
          (v) =>
            v.BNpcNameID === 9317 &&
            v.BNpcID === 17825 &&
            data.soumaP2镜中奇遇分身.find((w) => parseInt(w.id, 16) === v.ID) &&
            !(v.PosX === 100 && v.PosY === 100)
        );
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP2镜中奇遇 && data.soumaCombatantData.length > 1) {
          const kagami = data.soumaCombatantData.sort((a, b) => a.ID - b.ID);
          // console.log(kagami.slice());
          const dirs = kagami.map((v) =>
            Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 100)
          );
          const blue = dirs[0];
          const reds = dirs.slice(1);
          const group = ["MT", "ST", "D1", "D2"].includes(
            getRpByName(data, data.me)
          )
            ? "近战"
            : "远程";
          const start = group === "近战" ? (blue + 4) % 8 : blue;
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
                if ((start - i + 8) % 8 === v) {
                  if (i < minI) {
                    minI = i;
                    end = (start - i + 8) % 8;
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
        text: { en: "${dir1} => ${dir2}" },
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
      id: "Souma 伊甸 P2 强放逐 分摊",
      type: "StartsUsing",
      netRegex: { id: "9D1C", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      durationSeconds: 6,
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.stackPartner,
      },
    },
    {
      id: "Souma 伊甸 P2 强放逐 分散",
      type: "StartsUsing",
      netRegex: { id: "9D1D", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      durationSeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.spread,
      },
    },
    {
      id: "Souma 伊甸 P2 光之暴走",
      type: "StartsUsing",
      netRegex: { id: "9D14" },
      condition: (data) => data.soumaPhase === "P2",
      response: Responses.bigAoe("alert"),
    },
    {
      id: "Souma 伊甸 P2 光之暴走连线",
      type: "Tether",
      netRegex: { id: "006E" },
      condition: (data) =>
        data.soumaPhase === "P2" &&
        data.triggerSetConfig.伊甸P2光暴打法 === "mgl",
      preRun: (data, matches) => {
        data.soumaP2光之暴走连线.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP2光之暴走连线.length === 6) {
          const combatants = (
            await callOverlayHandler({
              call: "getCombatants",
            })
          ).combatants;
          data.soumaCombatantData = combatants.filter(
            (v) =>
              data.party.nameToRole_[v.Name] &&
              v.ID.toString(16).startsWith("1")
          );
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          圈: { en: "放圈" },
          上1: { en: "上1：去左上↖" },
          上2: { en: "上2：去下中↓" },
          上3: { en: "上3：去右上↗" },
          下1: { en: "下1：去右下↘" },
          下2: { en: "下2：去上中↑" },
          下3: { en: "下3：去左下↙" },
          // 备用1: { en: '上1：去左上↖' },
          // 备用2: { en: '上2：去下中↓' },
          // 备用3: { en: '上3：去右上↗' },
          // 备用4: { en: '下3：去左下↙' },
          // 备用5: { en: '下2：去上中↑' },
          // 备用6: { en: '下1：去右下↘' },
          unknown: { en: "未知错误，各凭本事" },
          error: { en: "线乱了，各凭本事" },
          final0: { en: "去左上↖" },
          final1: { en: "去下中↓" },
          final2: { en: "去右上↗" },
          final3: { en: "去左下↙" },
          final4: { en: "去上中↑" },
          final5: { en: "去右下↘" },
        };
        if (data.soumaP2光之暴走连线.length === 6) {
          const lr = data.soumaP2光之暴走连线.map((v) => {
            const decId = parseInt(v.sourceId, 16);
            const name = v.source;
            const { PosX: x, PosY: y } = data.soumaCombatantData.find(
              (w) => w.ID === decId
            );
            const rp = getRpByName(data, name);
            return { decId, name, x, y, rp };
          });
          const upperHalfPlayerCount = data.soumaCombatantData.filter(
            (player) => player.PosY < 100
          ).length;
          if (upperHalfPlayerCount === 4) {
            // 99%的情况：上下半场站好了各4个人
            lr.sort((a, b) => a.x - b.x);
            const topGroup = lr.filter((v) => v.y < 100);
            const bottomGroup = lr.filter((v) => v.y >= 100);
            if (topGroup.length === 2) topGroup.push(bottomGroup.pop());
            if (bottomGroup.length === 2) bottomGroup.push(topGroup.pop());
            if (data.triggerSetConfig.伊甸P2光暴机制标点 === "开") {
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
            if (lr.find((v) => v.name === data.me) === undefined)
              return { alarmText: output.圈() };
            const index =
              ([...topGroup, ...bottomGroup].findIndex(
                (v) => v.name === data.me
              ) %
                3) +
              1;
            if (index === 0) return { infoText: output.unknown(), tts: null };
            const group = topGroup.find((v) => v.name === data.me)
              ? "上"
              : "下";
            return { infoText: output[`${group}${index}`]() };
          }
          // 有人没预占位
          console.error("有人没预占位，光之暴走进入备用逻辑");
          // 选出一个人作为“上1”基准，尽量让更少的人被分配到陌生的位置上
          const THD = ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"];
          const firstTH = lr
            .map((v) => v.rp)
            .sort((a, b) => THD.indexOf(a) - THD.indexOf(b))[0];
          while (lr[0].rp !== firstTH) lr.push(lr.shift());
          data.soumaP2光之暴走连线.length = 0;
          data.soumaCombatantData = [];
          if (data.triggerSetConfig.伊甸P2光暴机制标点 === "开") {
            mark(lr[0].decId, markTypeOptions.锁链1, false);
            mark(lr[1].decId, markTypeOptions.攻击2, false);
            mark(lr[2].decId, markTypeOptions.锁链3, false);
            mark(lr[3].decId, markTypeOptions.攻击1, false);
            mark(lr[4].decId, markTypeOptions.锁链2, false);
            mark(lr[5].decId, markTypeOptions.攻击3, false);
            clearMark(18);
            const i = lr.findIndex((v) => v.name === data.me);
            return { infoText: output[`final${i}`]() };
          }
          return { infoText: output.error(), tts: null };
        }
      },
    },
    {
      id: "Souma 伊甸 P2 光之暴走连线灰9",
      type: "Tether",
      netRegex: { id: "006E" },
      condition: (data) =>
        data.soumaPhase === "P2" &&
        data.triggerSetConfig.伊甸P2光暴打法 === "gray9",
      preRun: (data, matches) => {
        data.soumaP2光之暴走连线.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP2光之暴走连线.length === 6) {
          const combatants = (
            await callOverlayHandler({
              call: "getCombatants",
            })
          ).combatants;
          data.soumaCombatantData = combatants.filter(
            (v) =>
              data.party.nameToRole_[v.Name] &&
              v.ID.toString(16).startsWith("1")
          );
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          圈: { en: "放圈" },
          A: { en: "上(A点)塔" },
          B: { en: "右(B点)塔" },
          C: { en: "下(C点)塔" },
          D: { en: "左(D点)塔" },
          1: { en: "左上(1点)塔" },
          2: { en: "右上(2点)塔" },
          3: { en: "右下(3点)塔" },
          4: { en: "左下(4点)塔" },
        };
        if (data.soumaP2光之暴走连线.length === 6) {
          const dialPad = data.triggerSetConfig.伊甸P2光暴灰九拨号盘
            .toString()
            .split(/[,\\/，]/)
            .map((v) => v.trim().toUpperCase());
          const lightRampant = data.soumaP2光之暴走连线
            .map((v) => ({
              decId: parseInt(v.sourceId, 16),
              name: v.source,
              rp: getRpByName(data, v.source),
            }))
            .sort((a, b) => dialPad.indexOf(a.rp) - dialPad.indexOf(b.rp));
          data.soumaP2光之暴走连线.length = 0;
          data.soumaCombatantData.length = 0;
          const player = lightRampant.find((v) => v.name === data.me);
          if (player === undefined) {
            return { alarmText: output.圈() };
          }
          const dialPadindex = dialPad.indexOf(player.rp);
          const lightIndex = lightRampant.findIndex((v) => v.rp === player.rp);
          const diff = dialPadindex - lightIndex;
          const password = p2LrGray9[dialPadindex].at(diff);
          return { infoText: output[password]() };
        }
      },
    },
    {
      id: "Souma 伊甸 P2 光之暴走层数",
      type: "GainsEffect",
      netRegex: { effectId: "8D1" },
      condition: (data, matches) =>
        data.soumaPhase === "P2" && data.me === matches.target,
      run: (data, matches) => {
        data.soumaP2光暴过量光层数 = parseInt(matches.count, 16);
      },
    },
    {
      id: "Souma 伊甸 P2 光之暴走踩塔",
      type: "StartsUsing",
      netRegex: { id: "9D14", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 26,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          踩塔: { en: "去踩塔！" },
          不踩: { en: "不踩" },
        };
        return data.soumaP2光暴过量光层数 === 2
          ? { alarmText: output.踩塔() }
          : { infoText: output.不踩() };
      },
    },
    {
      id: "Souma 伊甸 P2 光之海啸",
      type: "StartsUsing",
      netRegex: { id: "9DFD", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "八方分散",
        },
      },
    },
    {
      id: "Souma 伊甸 P2 绝对零度",
      type: "StartsUsing",
      netRegex: { id: "9D20", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "狂暴 打到20%",
        },
      },
    },
    {
      id: "Souma 伊甸 P2 无敌消失",
      type: "LosesEffect",
      netRegex: { effectId: "307", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: "打大冰（到50%）",
        },
      },
    },
    // 39.7秒狂暴读条 打到50%
    {
      id: "Souma 伊甸 P2 光之泛滥1",
      type: "StartsUsing",
      netRegex: { id: "9D43", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 39.7 - 7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "5" } },
    },
    {
      id: "Souma 伊甸 P2 光之泛滥2",
      type: "StartsUsing",
      netRegex: { id: "9D43", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 39.7 - 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "4" } },
    },
    {
      id: "Souma 伊甸 P2 光之泛滥3",
      type: "StartsUsing",
      netRegex: { id: "9D43", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 39.7 - 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "3" } },
    },
    {
      id: "Souma 伊甸 P2 光之泛滥4",
      type: "StartsUsing",
      netRegex: { id: "9D43", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 39.7 - 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "2" } },
    },
    {
      id: "Souma 伊甸 P2 光之泛滥5",
      type: "StartsUsing",
      netRegex: { id: "9D43", capture: false },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 39.7 - 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "1" } },
    },
    {
      id: "Souma 伊甸 P2 融合",
      type: "NetworkCancelAbility",
      netRegex: { id: "9D43" },
      condition: (data) => data.soumaPhase === "P2",
      delaySeconds: 7,
      response: Responses.bigAoe("alert"),
    },
    // #endregion P2
    // #region P2.5
    {
      id: "Souma 伊甸 P2.5 水波",
      type: "StartsUsing",
      netRegex: { id: ["9D46", "9D42"], capture: false },
      condition: (data) =>
        data.soumaPhase === "P2" &&
        ["H1", "H2", "D3", "D4"].includes(getRpByName(data, data.me)),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "水波" } },
    },
    // #endregion P2.5
    // #region P3
    {
      id: "Souma 伊甸 P3 地狱审判",
      type: "StartsUsing",
      netRegex: { id: "9D49", capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "清1血",
        },
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝",
      type: "StartsUsing",
      netRegex: { id: "9D4A" },
      response: Responses.bigAoe("alert"),
      run: (data) => {
        data.soumaP3阶段 = "一运";
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝 BUFF",
      type: "GainsEffect",
      netRegex: { effectId: Object.values(p3buffs) },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
      preRun: (data, matches) => {
        (data.soumaP3一运buff[matches.target] ??= []).push(matches);
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝 长时间提醒",
      type: "GainsEffect",
      netRegex: { effectId: Object.values(p3buffs), capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
      delaySeconds: 0.5,
      durationSeconds: 40,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          回返圈: { en: "[1]" },
          回返眼: { en: "[内]" },
          回返水: { en: "[内]" },
          短火口诀: { en: "2${back}0100" },
          中火口诀: { en: "0${back}2001" },
          长火口诀: { en: "010${back}20" },
          TN冰口诀: { en: "0${back}0100" },
          DPS冰口诀: { en: "010${back}00" },
          TN冰: { en: "冰(短火): 下↓" },
          DPS冰: { en: "冰(长火)：上↑" },
          TN短火: { en: "短火: 下↓" },
          DPS短火低: { en: "短火低：右上↗" },
          DPS短火高: { en: "短火高：左上↖" },
          TN中火: { en: "中火：左←" },
          DPS中火: { en: "中火：右→" },
          TN长火高: { en: "长火：左下↙" },
          TN长火低: { en: "长火：右下↘" },
          DPS长火: { en: "长火：上↑" },
          text: { en: "${gimmick} ${pithy}" },
        };
        const playersGimmick = {};
        const names = Object.keys(data.soumaP3一运buff);
        const role = data.role === "dps" ? "DPS" : "TN";
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
          const type = fire ? "火" : "冰";
          const group = data.party.nameToRole_[name] === "dps" ? "dps" : "tn";
          let len;
          let k;
          if (fire) {
            const dura = parseInt(
              Math.floor(parseInt(fire.duration) / 10)
                .toString()
                .at(0)
            );
            len = ["", "短", "中", "长"][dura];
            k = `${len}${type}`;
          } else if (ice) {
            len = group === "dps" ? "长" : "短";
            k = `${len}火（冰）`;
          }
          playersGimmick[name] = k;
        }
        const gimmick = playersGimmick[data.me];
        const back = `${
          { 圈: output.回返圈(), 眼: output.回返眼(), 水: output.回返水() }[
            mostLong
          ] ?? "?"
        }`;
        if (gimmick === "短火") {
          data.soumaP3处理 = ["2", mostLong, "0", "1", "0", "0"];
          const pithy = output.短火口诀({ back });
          if (role === "TN") {
            const gimmick = output.TN短火();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs.TN短火;
            return { alertText: alertText, tts: gimmick };
          }
          if (role === "DPS") {
            const partner = Object.entries(playersGimmick).find((v) => {
              return v[0] !== data.me && v[1] === "短火";
            })[0];
            const rp = getRpByName(data, data.me);
            const partnerRp = getRpByName(data, partner);
            const sortRule =
              data.triggerSetConfig.P3一运DPS同BUFF优先级.toString()
                .split(/[,\\/，]/)
                .map((v) => v.trim().toUpperCase());
            const sortIndex =
              sortRule.indexOf(rp) - sortRule.indexOf(partnerRp);
            const priority = sortIndex < 0 ? "高" : "低";
            const gimmick = output[`DPS短火${priority}`]();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs[`DPS短火${priority}`];
            return { alertText: alertText, tts: gimmick };
          }
        }
        if (gimmick === "中火") {
          data.soumaP3处理 = ["0", mostLong, "2", "0", "0", "1"];
          const pithy = output.中火口诀({ back });
          const gimmick =
            data.role === "dps" ? output.DPS中火() : output.TN中火();
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir =
            p3Dirs[data.role === "dps" ? "DPS中火" : "TN中火"];
          return { alertText: alertText, tts: gimmick };
        }
        if (gimmick === "长火") {
          data.soumaP3处理 = ["0", "1", "0", mostLong, "2", "0"];
          const pithy = output.长火口诀({ back });
          if (role === "TN") {
            const partner = Object.entries(playersGimmick).find((v) => {
              return v[0] !== data.me && v[1] === "长火";
            })[0];
            const rp = getRpByName(data, data.me);
            const partnerRp = getRpByName(data, partner);
            const sortRule =
              data.triggerSetConfig.P3一运TH同BUFF优先级.toString()
                .split(/[,\\/，]/)
                .map((v) => v.trim().toUpperCase());
            const sortIndex =
              sortRule.indexOf(rp) - sortRule.indexOf(partnerRp);
            const priority = sortIndex < 0 ? "高" : "低";
            const gimmick = output[`TN长火${priority}`]();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs[`TN长火${priority}`];
            return { alertText: alertText, tts: gimmick };
          }
          if (role === "DPS") {
            const gimmick = output.DPS长火();
            const alertText = output.text({ gimmick, pithy });
            data.soumaP3MyDir = p3Dirs.DPS长火;
            return { alertText: alertText, tts: gimmick };
          }
        }
        if (gimmick === "短火（冰）") {
          data.soumaP3处理 = ["0/2", mostLong, "0", "1", "0", "0"];
          const pithy = output.TN冰口诀({ back });
          const gimmick = output.TN冰({ pithy });
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir = p3Dirs.TN冰;
          return { alertText: alertText, tts: gimmick };
        }
        if (gimmick === "长火（冰）") {
          data.soumaP3处理 = ["0", "1", "0", mostLong, "0/2", "0"];
          const pithy = output.DPS冰口诀({ back });
          const gimmick = output.DPS冰({ pithy });
          const alertText = output.text({ gimmick, pithy });
          data.soumaP3MyDir = p3Dirs.DPS冰;
          return { alertText: alertText, tts: gimmick };
        }
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝 第1步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
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
      id: "Souma 伊甸 P3 时间压缩·绝 第2步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
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
      id: "Souma 伊甸 P3 时间压缩·绝 第3步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
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
      id: "Souma 伊甸 P3 时间压缩·绝 第4步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
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
      id: "Souma 伊甸 P3 时间压缩·绝 第5步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
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
      id: "Souma 伊甸 P3 时间压缩·绝 第6步",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.火, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
      delaySeconds: 6 + 5 + 5 + 5 + 5 + 5,
      durationSeconds: 3,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        return output.text({
          gimmick: output[data.soumaP3处理[5]](),
          back: output.背对(),
        });
      },
      outputStrings: {
        ...p3Outputs,
        背对: { en: "面向场外" },
        text: { en: "${gimmick} + ${back}" },
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝 线实体",
      type: "AddedCombatant",
      netRegex: { npcNameId: "9825" },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
      run: (data, matches) => {
        const id = matches.id.toUpperCase();
        data.soumaP3沙漏[id] = Directions.xyTo8DirNum(
          parseInt(matches.x),
          parseInt(matches.y),
          100,
          100
        );
      },
    },
    {
      id: "Souma 伊甸 P3 时间压缩·绝 线",
      type: "Tether",
      // '0086' Yellow
      // '0085' Purple
      netRegex: { id: ["0086", "0085"] },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "一运",
      preRun: (data, matches) => {
        data.soumaP3线存储.push(matches);
      },
      delaySeconds: 0.5,
      durationSeconds: 40 - 4,
      infoText: (data, _matches, output) => {
        if (data.soumaP3线存储.length === 5) {
          const yellows = data.soumaP3线存储.filter((v) => v.id === "0086");
          const reds = data.soumaP3线存储.filter((v) => v.id === "0085");
          const yellowDirs = yellows.map((v) => data.soumaP3沙漏[v.sourceId]);
          const purpleDirs = reds.map((v) => data.soumaP3沙漏[v.sourceId]);
          const northDIr = yellowDirs.find(
            (v) =>
              purpleDirs.includes((v + 2) % 8) &&
              purpleDirs.includes((v + 6) % 8)
          );
          // console.log(yellowDirs, purpleDirs, targetDir, Directions.outputFrom8DirNum(targetDir));
          data.soumaP3线存储.length = 0;
          const finallyDir = (northDIr + data.soumaP3MyDir) % 8;
          return output.text({
            dir: output[Directions.outputFrom8DirNum(finallyDir)](),
          });
        }
      },
      outputStrings: {
        // 上↑
        dirN: "A点↑",
        // 右上↗
        dirNE: "2点↗",
        // 右→
        dirE: "B点→",
        // 右下↘
        dirSE: "3点↘",
        // 下↓
        dirS: "C点↓",
        // 左下↙
        dirSW: "4点↙",
        // 左←
        dirW: "D点←",
        // 左上↖
        dirNW: "1点↖",
        text: {
          en: "${dir}方向",
        },
      },
    },
    {
      id: "Souma 伊甸 P3 破盾一击",
      type: "StartsUsing",
      netRegex: { id: "9D5E", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      infoText: (_data, _matches, output) => output.getTogether(),
      outputStrings: {
        getTogether: {
          en: "集合分摊",
        },
      },
    },
    {
      id: "Souma 伊甸 P3 延迟咏唱·回响",
      type: "StartsUsing",
      netRegex: { id: "9D4D", capture: false },
      run: (data) => {
        data.soumaP3阶段 = "二运";
      },
    },
    {
      id: "Souma 伊甸 P3 脉冲星震波",
      type: "StartsUsing",
      netRegex: { id: "9D5A", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      response: Responses.aoe(),
    },
    {
      id: "Souma 伊甸 P3 黑色光环",
      type: "StartsUsing",
      netRegex: { id: "9D62" },
      alertText: (data, matches, output) => {
        if (matches.target !== data.me) return;
        return output.busterOnYou();
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me) return;
        return output.busterOn({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        busterOn: { en: "分摊死刑点 ${player}" },
        busterOnYou: { en: "分摊死刑点名" },
      },
    },
    {
      id: "Souma 伊甸 P3 三连黑暗狂水",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "二运",
      preRun: (data, matches) => {
        data.soumaP3二运水.push(matches);
      },
    },
    {
      id: "Souma 伊甸 P3 三连黑暗狂水1",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === "P3" &&
        data.soumaP3阶段 === "二运" &&
        parseInt(matches.duration) === 10,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "分摊" } },
    },
    {
      id: "Souma 伊甸 P3 三连黑暗狂水2",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === "P3" &&
        data.soumaP3阶段 === "二运" &&
        parseInt(matches.duration) === 29,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "分摊" } },
    },
    {
      id: "Souma 伊甸 P3 三连黑暗狂水3",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data, matches) =>
        data.soumaPhase === "P3" &&
        data.soumaP3阶段 === "二运" &&
        parseInt(matches.duration) === 38,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "分摊" } },
    },
    {
      id: "Souma 伊甸 P3 碎灵一击",
      type: "StartsUsing",
      netRegex: { id: "9D60", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      delaySeconds: 1,
      response: Responses.spread(),
    },
    {
      id: "Souma 伊甸 P3 三连黑暗狂水 判定",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水, capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "二运",
      delaySeconds: 0.5,
      durationSeconds: 40,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          separator: { en: "、" },
          switcherInfo: { en: "（${name1}与${name2}换）" },
          donTMove: { en: "（都不换）" },
          no: { en: "你不换" },
          text: { en: "${no} ${switcherInfo}" },
          switch: { en: "与${switcher}交换！" },
        };
        const leftRps = data.triggerSetConfig.P3二运水分摊预站位左组.toString()
          .split(/[,\\/，]/)
          .map((v) => v.trim().toUpperCase());
        const rightRps = data.triggerSetConfig.P3二运水分摊预站位右组.toString()
          .split(/[,\\/，]/)
          .map((v) => v.trim().toUpperCase());
        const allSortRule = [...leftRps, ...rightRps];
        const leftSwitcherNames = new Set();
        const rightSwitcherNames = new Set();
        // let res: Record<string, string> | undefined = undefined;
        // 死人的清空下，有3个无，此时让第3个无 与单独的水进行配对。
        const lonely = data.party.details
          .map((v) => v.name)
          .filter((v) => !data.soumaP3二运水.find((vv) => vv.target === v))[2];
        // console.log(lonely);
        for (const name of data.party.details.map((v) => v.name)) {
          if (name === lonely) {
            // 跳过第三个无的处理，否则污染结果。
            continue;
          }
          const me = data.soumaP3二运水.find((v) => v.target === name);
          const rp = getRpByName(data, name);
          const meHalf = leftRps.includes(rp) ? "left" : "right";
          const partner =
            me === undefined
              ? data.party.details.find(
                  (v) =>
                    v.name !== name &&
                    !data.soumaP3二运水.find((vv) => vv.target === v.name)
                ).name
              : data.soumaP3二运水.find(
                  (v) => v.target !== name && v.duration === me.duration
                )?.target ??
                lonely ??
                "???";
          const partnerRp = getRpByName(data, partner);
          const partnerHalf = leftRps.includes(partnerRp) ? "left" : "right";
          const sortIndex =
            allSortRule.indexOf(rp) - allSortRule.indexOf(partnerRp);
          const priority = sortIndex < 0 ? "高" : "低";
          if (meHalf === partnerHalf) {
            (meHalf === "left" ? leftSwitcherNames : rightSwitcherNames).add(
              priority === "低" ? name : partner
            );
          }
        }
        const leftSwitcherNamesArr = Array.from(leftSwitcherNames);
        const rightSwitcherNamesArr = Array.from(rightSwitcherNames);
        const tnSwitcherRps = leftSwitcherNamesArr.map((v) =>
          getRpByName(data, v)
        );
        const dpsSwitcherRps = rightSwitcherNamesArr.map((v) =>
          getRpByName(data, v)
        );
        let i = 0;
        let ii = 0;
        data.soumaP3水分组结果左 = leftRps.map(
          (v) => (tnSwitcherRps.includes(v) ? dpsSwitcherRps[i++] : v) ?? lonely
        );
        data.soumaP3水分组结果右 = rightRps.map(
          (v) =>
            (dpsSwitcherRps.includes(v) ? tnSwitcherRps[ii++] : v) ?? lonely
        );
        for (
          let i = 0;
          i <
          Math.max(rightSwitcherNamesArr.length, leftSwitcherNamesArr.length);
          i++
        ) {
          rightSwitcherNamesArr[i] = rightSwitcherNamesArr[i] ?? lonely;
          leftSwitcherNamesArr[i] = leftSwitcherNamesArr[i] ?? lonely;
        }
        const switcherInfo =
          leftSwitcherNamesArr
            .map((v, i) =>
              output.switcherInfo({
                name1: data.party.member(v),
                name2: data.party.member(rightSwitcherNamesArr[i]),
              })
            )
            .join(output.separator()) || output.donTMove();
        // console.log(
        //   rightSwitcherNamesArr,
        //   leftSwitcherNamesArr,
        //   data.soumaP3水分组结果左,
        //   data.soumaP3水分组结果右,
        // );
        const meIsSwitcher =
          leftSwitcherNames.has(data.me) || rightSwitcherNames.has(data.me);
        data.soumaP3二运水.length = 0;
        if (meIsSwitcher) {
          const meIndex = leftSwitcherNames.has(data.me)
            ? leftSwitcherNamesArr.indexOf(data.me)
            : rightSwitcherNamesArr.indexOf(data.me);
          const switcher = leftSwitcherNames.has(data.me)
            ? rightSwitcherNamesArr[meIndex]
            : leftSwitcherNamesArr[meIndex];
          const alarmText = output.switch({
            switcher: data.party.member(switcher),
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
      id: "Souma 伊甸 P3 二运地火",
      type: "ActorControlExtra",
      netRegex: {
        category: "019D",
        param1: "4",
        param2: [
          // 逆
          "40",
          // 顺
          "10",
        ],
      },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "二运",
      delaySeconds: 2,
      durationSeconds: 6,
      suppressSeconds: 999,
      promise: async (data, matches) => {
        data.soumaCombatantData = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.id, 16)],
          })
        ).combatants;
      },
      alertText: (data, matches, output) => {
        // 1顺  -1逆
        const clock = matches.param2 === "40" ? "逆" : "顺";
        const target = data.soumaCombatantData[0];
        const dirNum = Directions.xyTo8DirNum(
          target.PosX,
          target.PosY,
          100,
          100
        );
        const baseDir = (dirNum + 2) % 4;
        data.soumaCombatantData = [];
        const t = data.triggerSetConfig.P3二运地火报点方式.toString().replace(
          "左右",
          "顺逆"
        );
        return output[`${baseDir}${clock}${t}`]();
      },
      outputStrings: {
        "0顺车头人群": { en: "车头AC、人群二四" },
        "0逆车头人群": { en: "车头AC、人群一三" },
        "1顺车头人群": { en: "车头四二、人群DB" },
        "1逆车头人群": { en: "车头四二、人群CA" },
        "2顺车头人群": { en: "车头DB、人群一三" },
        "2逆车头人群": { en: "车头DB、人群四二" },
        "3顺车头人群": { en: "车头一三、人群AC" },
        "3逆车头人群": { en: "车头一三、人群DB" },
        "0顺车头顺逆": { en: "AC顺" },
        "0逆车头顺逆": { en: "AC逆" },
        "1顺车头顺逆": { en: "四二顺" },
        "1逆车头顺逆": { en: "四二逆" },
        "2顺车头顺逆": { en: "DB顺" },
        "2逆车头顺逆": { en: "DB逆" },
        "3顺车头顺逆": { en: "一三顺" },
        "3逆车头顺逆": { en: "一三逆" },
        "0顺人群车头": { en: "人群四二、车头CA" },
        "0逆人群车头": { en: "人群一三、车头AC" },
        "1顺人群车头": { en: "人群DB、车头四二" },
        "1逆人群车头": { en: "人群AC、车头二四" },
        "2顺人群车头": { en: "人群一三、车头DB" },
        "2逆人群车头": { en: "人群四二、车头DB" },
        "3顺人群车头": { en: "人群AC、车头一三" },
        "3逆人群车头": { en: "人群DB、车头一三" },
        "0顺人群顺逆": { en: "四二逆" },
        "0逆人群顺逆": { en: "一三顺" },
        "1顺人群顺逆": { en: "DB逆" },
        "1逆人群顺逆": { en: "AC顺" },
        "2顺人群顺逆": { en: "一三逆" },
        "2逆人群顺逆": { en: "四二顺" },
        "3顺人群顺逆": { en: "AC逆" },
        "3逆人群顺逆": { en: "DB顺" },
      },
    },
    {
      id: "Souma 伊甸 P3 二运分散",
      type: "StartsUsing",
      netRegex: { id: "9D51", capture: false },
      condition: (data) =>
        data.soumaPhase === "P3" && data.soumaP3阶段 === "二运",
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "分散",
        },
      },
    },
    {
      id: "Souma 伊甸 P3 暗夜舞蹈",
      type: "StartsUsing",
      netRegex: { id: "9CF5", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      alertText: (data, _matches, output) => {
        if (data.role === "tank") return output.tanksOutPartyIn();
        // return output.partyInTanksOut!();
      },
      outputStrings: {
        // partyInTanksOut: {
        //   en: '人群靠近',
        // },
        tanksOutPartyIn: {
          en: "坦克引导",
        },
      },
    },
    {
      id: "Souma 伊甸 P3 暗夜舞蹈2",
      type: "StartsUsing",
      netRegex: { id: "9CF5", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      delaySeconds: 6.5,
      infoText: (data, _matches, output) => {
        const half = data.soumaP3水分组结果左.includes(
          getRpByName(data, data.me)
        )
          ? "left"
          : "right";
        return output.text({
          knockback: output.knockback(),
          stack: output[half](),
        });
      },
      outputStrings: {
        left: { en: "↙左下分摊" },
        right: { en: "右下分摊↘" },
        text: { en: "${knockback} => ${stack}" },
        knockback: Outputs.knockback,
      },
      // response: Responses.knockback(),
    },
    {
      id: "Souma 伊甸 P3 记忆终结",
      type: "StartsUsing",
      netRegex: { id: "9D6C", capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: "狂暴 打到20%",
        },
      },
    },
    // #endregion P3
    // #region P4
    {
      id: "Souma 伊甸 P4 赋形",
      type: "StartsUsing",
      netRegex: { id: "9D36", capture: false },
      delaySeconds: 12,
      response: Responses.getTogether(),
    },
    {
      id: "Souma 伊甸 P4 圣龙护甲",
      type: "Ability",
      netRegex: { id: "9CFA", sourceId: "4.{7}", capture: false },
      response: Responses.moveAway("alert"),
    },
    {
      id: "Souma 伊甸 P4 光与暗的龙诗",
      type: "StartsUsing",
      netRegex: { id: ["9D6D", "9D2F"], capture: false },
      suppressSeconds: 1,
      response: Responses.bigAoe(),
      run: (data) => {
        data.soumaP4阶段 = "一运";
      },
    },
    {
      id: "Souma 伊甸 P4 光之暴走",
      type: "Tether",
      netRegex: { id: "006E" },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "一运",
      preRun: (data, matches) => {
        data.soumaP4光之暴走连线.push(matches);
      },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          bowTieShape: { en: "蝴蝶结，不用动" },
          hourglass: { en: "沙漏，${healer}${dps}换" },
          rectangle: { en: "方形，${tank}${dps}换" },
          noTether: { en: "引导水波" },
          switch: { en: "与${direction}${switcher}交换！" },
          dirDps: { en: "左下" },
          dirTank: { en: "左上" },
          dirHealer: { en: "右上" },
          stackKusari: { en: "原地踩塔" },
          stackIdle: { en: "就近引导水波" },
          doubleIdle: { en: "引导水波" },
          withKusari: { en: "去${dir}塔（与${player}）" },
          notWithKusari: { en: "去${dir}塔（与${player}）" },
          north: { en: "上" },
          south: { en: "下" },
        };
        if (data.soumaP4光之暴走连线.length !== 4) {
          return;
        }
        const iAmLine = data.soumaP4光之暴走连线.find(
          (v) => v.source === data.me || v.target === data.me
        );
        if (data.triggerSetConfig.P4一运打法 === "nnbz") {
          const pre = data.soumaP4一运预分摊.slice();
          const preKusari = pre.find((v) =>
            data.soumaP4光之暴走连线.find(
              (vv) => vv.source === v.name || vv.target === v.name
            )
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
          const connectWithPreKusari = data.soumaP4光之暴走连线.find(
            (v) =>
              (v.source === data.me && v.target === preKusari.name) ||
              (v.target === data.me && v.source === preKusari.name)
          );
          if (connectWithPreKusari) {
            const partner = data.soumaP4光之暴走连线
              .map((v) => [v.source, v.target])
              .flat()
              .find(
                (v) =>
                  v !== data.me &&
                  v !== preKusari.name &&
                  (v !== connectWithPreKusari.source ||
                    v !== connectWithPreKusari.target)
              );
            return {
              alertText: output.withKusari({
                dir: output[preKusariDir === "north" ? "south" : "north"](),
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
        if (data.triggerSetConfig.P4一运打法 === "mgl") {
          // console.log(data.me, iAmLine);
          if (iAmLine !== undefined) {
            const lines = data.soumaP4光之暴走连线.map((v) => {
              return {
                name: v.source,
                rp: getRpByName(data, v.source),
                role: data.party.nameToRole_[v.source],
              };
            });
            const thGroup = data.triggerSetConfig.P4光暴预站位上半场.toString()
              .split(/[,\/，]/)
              .map((v) => v.trim().toUpperCase());
            const dpsGroup = data.triggerSetConfig.P4光暴预站位下半场.toString()
              .split(/[,\/，]/)
              .map((v) => v.trim().toUpperCase());
            // 该机制必点THD，所以不必考虑2根线点奶妈的情况。
            // 默认T左上奶右上dps下面1234排，不兼容其他情况否则过于麻烦。
            // 2025/3/14：兼容了奶左上T右上（应该没bug）
            while (!thGroup.slice(0, 2).includes(lines[0].rp)) {
              lines.push(lines.shift());
            }
            const t = lines[0];
            const nearSet = new Set();
            data.soumaP4光之暴走连线
              .filter((v) => v.source === t.name || v.target === t.name)
              .forEach((v) => {
                nearSet.add(v.source);
                nearSet.add(v.target);
              });
            const otherKey =
              thGroup.findIndex((v) => ["MT", "ST"].includes(v)) < 2
                ? "healer"
                : "tank";
            const nearByFirst = Array.from(nearSet)
              .filter((v) => v !== t.name)
              .map((v) => {
                return {
                  name: v,
                  rp: getRpByName(data, v),
                  role: data.party.nameToRole_[v],
                };
              });
            // console.log(t, nearByTank);
            if (
              nearByFirst.find((v) => v.role === otherKey) &&
              nearByFirst.find((v) => v.role === "dps")
            ) {
              const dps = nearByFirst.find((v) => v.role === "dps");
              const otherDps = lines.find(
                (v) => v.role === "dps" && v.name !== dps.name
              );
              const priority =
                dpsGroup.findIndex((v) => v === dps.rp) <
                dpsGroup.findIndex((v) => v === otherDps.rp)
                  ? "方形"
                  : "沙漏";
              // console.log(dps, otherDps, priority);
              if (priority === "方形") {
                // console.log('方形');
                const tankName = t.name;
                const dpsName = dps.name;
                if (tankName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirDps(),
                      switcher: data.party.member(dpsName),
                    }),
                  };
                }
                if (dpsName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirTank(),
                      switcher: data.party.member(tankName),
                    }),
                  };
                }
                return {
                  alertText: output.rectangle({
                    tank: data.party.member(tankName),
                    dps: data.party.member(dpsName),
                  }),
                };
              }
              if (priority === "沙漏") {
                const healerName = nearByFirst.find(
                  (v) => v.role === otherKey
                ).name;
                const dpsName = otherDps.name;
                // console.log('沙漏形', healerName, dpsName);
                if (healerName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirDps(),
                      switcher: data.party.member(dpsName),
                    }),
                  };
                }
                if (dpsName === data.me) {
                  return {
                    alarmText: output.switch({
                      direction: output.dirHealer(),
                      switcher: data.party.member(healerName),
                    }),
                  };
                }
                return {
                  alertText: output.hourglass({
                    healer: data.party.member(healerName),
                    dps: data.party.member(dpsName),
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
      id: "Souma 伊甸 P4 碎灵一击",
      type: "StartsUsing",
      netRegex: { id: "9D60", capture: false },
      condition: (data) => data.soumaPhase === "P4",
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "分散" } },
    },
    {
      id: "Souma 伊甸 P4 黑暗狂水收集",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "一运",
      preRun: (data, matches) => {
        data.soumaP4黑暗狂水.push(matches);
      },
    },
    {
      id: "Souma 伊甸 P4 光之波动",
      type: "Ability",
      netRegex: { id: "9D15", capture: false },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "一运",
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (
          await callOverlayHandler({
            call: "getCombatants",
          })
        ).combatants;
      },
    },
    {
      id: "Souma 伊甸 P4 一运预分摊 Collection",
      type: "HeadMarker",
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === "P4" &&
        data.triggerSetConfig.P4一运打法 === "nnbz" &&
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
          const sortRule = data.triggerSetConfig.P4光暴牛奶抱枕预站位.toString()
            .split(/[,\\/，]/)
            .map((v) => v.trim().toUpperCase());
          data.soumaP4一运预分摊.sort(
            (a, b) => sortRule.indexOf(a.rp) - sortRule.indexOf(b.rp)
          );
          data.soumaP4一运预分摊[0].direction = "north";
          data.soumaP4一运预分摊[1].direction = "south";
          const playerIndex = data.soumaP4一运预分摊.findIndex(
            (v) => v.name === data.me
          );
          if (playerIndex === 0) {
            return output.up();
          }
          if (playerIndex === 1) {
            return output.down();
          }
        }
      },
      outputStrings: {
        up: { en: "去上塔" },
        down: { en: "去下塔" },
      },
    },
    {
      id: "Souma 伊甸 P4 黑暗狂水",
      type: "GainsEffect",
      netRegex: { effectId: p3buffs.水 },
      condition: (data) =>
        data.soumaPhase === "P4" &&
        data.soumaP4阶段 === "一运" &&
        data.triggerSetConfig.P4一运打法 === "mgl",
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      durationSeconds: 6,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          lines: { en: "分摊，躲开水晶" },
          stack: { en: "${dir}分摊" },
          otherSide: { en: "去对面分摊！" },
          sameSide: { en: "就近分摊" },
          unknown: { en: "分摊" },
        };
        try {
          if (data.soumaP4光之暴走连线 === undefined) {
            // 消除config面板的报错
            return { infoText: output.unknown() };
          }
          if (
            data.soumaP4光之暴走连线.find(
              (v) => v.source === data.me || v.target === data.me
            )
          ) {
            // 光暴4个人，就地分摊
            return { infoText: output.lines() };
          }
          // 剩余4个人
          const towerWater = data.soumaP4黑暗狂水.find((w) =>
            data.soumaP4光之暴走连线.find(
              (l) => l.target === w.target || l.source === w.target
            )
          );
          const freeWater = data.soumaP4黑暗狂水.find(
            (v) => v.target !== towerWater.target
          );
          const towerWaterObj = data.soumaCombatantData.find(
            (v) => v.Name === towerWater.target
          );
          const freeWaterObj = data.soumaCombatantData.find(
            (v) => v.Name === freeWater.target
          );
          const towerWaterTB = towerWaterObj.PosY < 100 ? "Top" : "Bottom";
          // 用坐标判断上下不严谨，但不会有人2个水波站同一半场还没团灭吧。
          const freeWaterTB = freeWaterObj.PosY < 100 ? "Top" : "Bottom";
          const freeWaterLR = freeWaterObj.PosX < 100 ? "Left" : "Right";
          const playerLR =
            data.soumaCombatantData.find((v) => v.Name === data.me).PosX < 100
              ? "Left"
              : "Right";
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
      id: "Souma 伊甸 P4 暗夜舞蹈",
      type: "StartsUsing",
      netRegex: { id: "9D5B", capture: false },
      condition: (data) =>
        data.soumaPhase === "P4" &&
        data.role === "tank" &&
        data.soumaP4阶段 === "一运",
      durationSeconds: 4.5,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "最远死刑！" },
      },
    },
    {
      id: "Souma 伊甸 P4 暗夜舞蹈2",
      type: "StartsUsing",
      netRegex: { id: "9D5B", capture: false },
      condition: (data) =>
        data.soumaPhase === "P4" &&
        data.role === "tank" &&
        data.soumaP4阶段 === "一运",
      delaySeconds: 4.7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "最近死刑！" },
      },
    },
    {
      id: "Souma 伊甸 P4 死亡轮回",
      type: "StartsUsing",
      netRegex: { id: ["9D6E", "9D37"], capture: false },
      condition: (data) => data.soumaPhase === "P4",
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "分组分摊，平血" },
      },
    },
    {
      id: "Souma 伊甸 P4 无尽顿悟",
      type: "StartsUsing",
      netRegex: { id: ["9D70", "9D39"], capture: true },
      condition: (data) => data.soumaPhase === "P4",
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => {
        return output.mornAfah();
      },
      outputStrings: {
        mornAfah: { en: "集合分摊" },
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶",
      type: "StartsUsing",
      netRegex: { id: ["9D6A", "9D30"], capture: true },
      condition: (data) => data.soumaPhase === "P4",
      suppressSeconds: 1,
      response: Responses.bigAoe(),
      run: (data) => {
        data.soumaP4阶段 = "二运";
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶BUFF",
      type: "GainsEffect",
      netRegex: { effectId: Object.values(p4buffs) },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "二运",
      preRun: (data, matches) => {
        (data.soumaP4二运buff[matches.target] ??= []).push(matches);
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶BUFF 初始预提醒",
      type: "GainsEffect",
      netRegex: { effectId: Object.values(p4buffs), capture: false },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "二运",
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const sortRule = data.triggerSetConfig.P4二运同BUFF优先级.toString()
          .split(/[,\\/，]/)
          .map((v) => v.trim().toUpperCase());
        const allBuffs = Object.entries(data.soumaP4二运buff).map(
          ([name, buffs]) => {
            return { name, buffs };
          }
        );
        const getPartner = (name, effectId, duration) => {
          return allBuffs.find(
            (member) =>
              member.name !== name &&
              member.buffs.find(
                (b) => b.effectId === effectId && b.duration === duration
              )
          );
        };
        const playersGimmick = {};
        const gimmickIds = {
          冰月环: 0,
          水分摊: 0,
          暗钢铁: 0,
          黄分摊: 0,
          短红低: 0,
          短红高: 0,
          长红低: 0,
          长红高: 0,
        };
        data.party.details
          .map((v) => ({ id: v.id, name: v.name }))
          .forEach(({ name, id }) => {
            const youBuff = data.soumaP4二运buff[name];
            if (
              youBuff.find((v) => v.effectId === p4buffs.红buff)?.duration ===
              "17.00"
            ) {
              // 短红
              const partner = getPartner(name, p4buffs.红buff, "17.00");
              if (!partner) {
                return output.unknown();
              }
              const priority =
                sortRule.findIndex((v) => v === getRpByName(data, name)) -
                  sortRule.findIndex(
                    (v) => v === getRpByName(data, partner.name)
                  ) <
                0
                  ? "高"
                  : "低";
              playersGimmick[name] = `短红${priority}`;
              gimmickIds[`短红${priority}`] = parseInt(id, 16);
            } else if (
              youBuff.find((v) => v.effectId === p4buffs.红buff)?.duration ===
              "40.00"
            ) {
              // 长红
              const partner = getPartner(name, p4buffs.红buff, "40.00");
              if (!partner) {
                return output.unknown();
              }
              const priority =
                sortRule.findIndex((v) => v === getRpByName(data, name)) -
                  sortRule.findIndex(
                    (v) => v === getRpByName(data, partner.name)
                  ) <
                0
                  ? "高"
                  : "低";
              playersGimmick[name] = `长红${priority}`;
              gimmickIds[`长红${priority}`] = parseInt(id, 16);
            } else if (youBuff.find((v) => v.effectId === p4buffs.暗钢铁)) {
              playersGimmick[name] = "暗钢铁";
              gimmickIds.暗钢铁 = parseInt(id, 16);
            } else if (youBuff.find((v) => v.effectId === p4buffs.水分摊)) {
              playersGimmick[name] = "水分摊";
              gimmickIds.水分摊 = parseInt(id, 16);
            } else if (youBuff.find((v) => v.effectId === p4buffs.冰月环)) {
              playersGimmick[name] = "冰月环";
              gimmickIds.冰月环 = parseInt(id, 16);
            } else if (youBuff.find((v) => v.effectId === p4buffs.黄分摊)) {
              playersGimmick[name] = "黄分摊";
              gimmickIds.黄分摊 = parseInt(id, 16);
            }
          });
        data.soumaP4二运机制 = playersGimmick[data.me];
        if (data.triggerSetConfig.伊甸P4二运机制标点 === "开") {
          // console.log(playersGimmick, gimmickIds);
          mark(
            gimmickIds.短红高,
            data.triggerSetConfig.伊甸P4二运标短红高.toString(),
            false
          );
          mark(
            gimmickIds.短红低,
            data.triggerSetConfig.伊甸P4二运标短红低.toString(),
            false
          );
          mark(
            gimmickIds.长红高,
            data.triggerSetConfig.伊甸P4二运标长红高.toString(),
            false
          );
          mark(
            gimmickIds.长红低,
            data.triggerSetConfig.伊甸P4二运标长红低.toString(),
            false
          );
          mark(
            gimmickIds.暗钢铁,
            data.triggerSetConfig.伊甸P4二运标暗钢铁.toString(),
            false
          );
          mark(
            gimmickIds.黄分摊,
            data.triggerSetConfig.伊甸P4二运标黄分摊.toString(),
            false
          );
          mark(
            gimmickIds.冰月环,
            data.triggerSetConfig.伊甸P4二运标冰月环.toString(),
            false
          );
          mark(
            gimmickIds.水分摊,
            data.triggerSetConfig.伊甸P4二运标水分摊.toString(),
            false
          );
          clearMark(48);
        }
        if (!data.soumaP4二运机制) {
          return output.unknown();
        }
        return output[data.soumaP4二运机制]();
      },
      outputStrings: {
        unknown: { en: "???" },
        短红高: { en: "短红（高）：去左←" },
        短红低: { en: "短红（低）：去右→" },
        长红高: { en: "长红（高）：去左下↙" },
        长红低: { en: "长红（低）：去右下↘" },
        暗钢铁: { en: "蓝暗：去上半场紫线" },
        黄分摊: { en: "蓝分摊：去下半场紫线" },
        冰月环: { en: "蓝冰：去下半场紫线" },
        水分摊: { en: "蓝水：去下半场紫线" },
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶 线实体",
      type: "AddedCombatant",
      netRegex: { npcNameId: "9823" },
      condition: (data) => data.soumaPhase === "P4",
      run: (data, matches) => {
        const id = matches.id.toUpperCase();
        data.soumaP4沙漏[id] = Directions.xyTo8DirNum(
          parseInt(matches.x),
          parseInt(matches.y),
          100,
          100
        );
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶 线",
      type: "Tether",
      // '0085' Purple
      netRegex: { id: "0085" },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "二运",
      durationSeconds: 29,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const dir = data.soumaP4沙漏[matches.sourceId] % 4;
        const type = dir === 1 ? "左下右上安全" : "左上右下安全";
        return output[`${data.soumaP4二运机制}${type}`]?.() ?? output.unknown();
      },
      outputStrings: {
        短红高左下右上安全: { en: "撞头 => 躲钢铁" },
        短红低左下右上安全: { en: "撞头 => 分摊" },
        长红高左下右上安全: { en: "左下↙击退人群 => 稍后撞头" },
        长红低左下右上安全: { en: "右下↘ => 躲钢铁 => 撞头" },
        暗钢铁左下右上安全: { en: "右上↗ => 分摊 => 踩圈" },
        水分摊左下右上安全: { en: "左下↙被击退 => 分摊 => 踩圈" },
        冰月环左下右上安全: { en: "左下↙被击退 => 分摊 => 踩圈" },
        黄分摊左下右上安全: { en: "左下↙被击退 => 分摊 => 踩圈" },
        短红高左上右下安全: { en: "撞头 => 分摊" },
        短红低左上右下安全: { en: "撞头 => 躲钢铁" },
        长红高左上右下安全: { en: "左下↙ => 躲钢铁 => 撞头" },
        长红低左上右下安全: { en: "右下↘击退人群 => 稍后撞头" },
        暗钢铁左上右下安全: { en: "左上↖ => 分摊" },
        水分摊左上右下安全: { en: "右下↘被击退 => 分摊" },
        冰月环左上右下安全: { en: "右下↘被击退 => 分摊" },
        黄分摊左上右下安全: { en: "右下↘被击退 => 分摊" },
        unknown: { en: "???" },
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶 回返",
      type: "GainsEffect",
      netRegex: { effectId: "994", capture: false },
      condition: (data) =>
        data.soumaPhase === "P4" && data.soumaP4阶段 === "二运",
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "分散" },
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶 回返2",
      comment: { en: "没用过，不知道时间准不准，请反馈" },
      type: "GainsEffect",
      netRegex: { effectId: "994", capture: false, duration: "7.00" },
      condition: (data) => data.triggerSetConfig.伊甸P4二运击退处理 === "y",
      delaySeconds: 7 - 3.5,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "防击退" },
      },
    },
    {
      id: "Souma 伊甸 P4 时间结晶 地火",
      type: "StartsUsingExtra",
      netRegex: { id: ["9D3B", "9D3C"] },
      preRun: (data, matches) => data.soumaP4地火.push(matches),
      durationSeconds: 8.5,
      suppressSeconds: 1,
      alarmText: (data, _matches, output) => {
        if (data.soumaP4地火.length < 2) {
          return;
        }
        const dirs = data.soumaP4地火
          .map((v) =>
            Directions.xyTo4DirNum(parseInt(v.x), parseInt(v.y), 100, 100)
          )
          .sort((a, b) => a - b);
        if (data.triggerSetConfig.伊甸P4二运击退处理 === "normal")
          return output[dirs.join("")]();
        return output[`${dirs.join("")}y`]();
      },
      outputStrings: {
        "01": { en: "2点" },
        "12": { en: "3点" },
        "23": { en: "4点" },
        "03": { en: "1点" },
        "01y": { en: "A点击退" },
        "12y": { en: "C点击退" },
        "23y": { en: "C点击退" },
        "03y": { en: "A点击退" },
      },
    },
    // #endregion P4
    // #region P5
    {
      id: "Souma 伊甸 P5 光尘之剑",
      type: "StartsUsing",
      netRegex: { id: "9D72", capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: "Souma 伊甸 P5 死亡轮回",
      type: "StartsUsing",
      netRegex: { id: "9D76", capture: false },
      condition: (data) => data.soumaPhase === "P5",
      delaySeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: "分组分摊" },
      },
    },
    {
      id: "Souma 伊甸 P5 死亡轮回后",
      type: "StartsUsing",
      netRegex: { id: "9D76", capture: false },
      condition: (data) => data.soumaPhase === "P5",
      delaySeconds: 8.5,
      suppressSeconds: 999,
      infoText: (data, _matches, output) => {
        if (
          getRpByName(data, data.me) ===
          data.triggerSetConfig.P5死亡轮回后谁拉BOSS.toString()
        )
          return output.tank();
        return output.text();
      },
      outputStrings: {
        tank: { en: "拉正点，准备踩塔" },
        text: { en: "准备踩塔" },
      },
    },
    {
      id: "Souma 伊甸 P5 复乐园",
      type: "StartsUsing",
      netRegex: { id: "9D7F", capture: false },
      condition: (data) => data.soumaPhase === "P5",
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
      id: "Souma 伊甸 P5 塔",
      type: "MapEffect",
      netRegex: {
        flags: "00020001",
        // 33 左上
        // 34 右上
        // 35 左下
        location: ["33", "34", "35"],
      },
      condition: (data) => data.soumaPhase === "P5" && data.role === "tank",
      preRun: (data, matches) => {
        data.soumaP5塔.push(matches);
      },
      delaySeconds: (data) => {
        const res = [0, 7, 7][data.soumaP5单轮塔计数++];
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
      id: "Souma 伊甸 P5 光与暗的双翼",
      type: "StartsUsing",
      // 9D79 先光再暗
      // 9D29 先暗再光
      netRegex: { id: ["9D79", "9D29"] },
      condition: (data) => data.soumaPhase === "P5",
      preRun: (data, matches) => {
        data.soumaP5翅膀属性 = matches.id === "9D79" ? "light" : "dark";
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
      id: "Souma 伊甸 P5 光与暗的双翼之后",
      type: "StartsUsing",
      netRegex: { id: ["9D79", "9D29"], capture: false },
      condition: (data) => data.soumaPhase === "P5",
      delaySeconds: 15,
      infoText: (data, _matches, output) => {
        if (
          getRpByName(data, data.me) ===
          data.triggerSetConfig.P5光与暗的双翼后谁拉BOSS.toString()
        ) {
          return output.tank();
        }
        return output.text();
      },
      outputStrings: {
        tank: { en: "拉正点，准备挡枪" },
        text: { en: "准备挡枪" },
      },
    },
    {
      id: "Souma 伊甸 P5 星灵之剑",
      type: "StartsUsing",
      netRegex: { id: "9D7C", capture: false },
      condition: (data) => data.soumaPhase === "P5",
      alertText: (data, _matches, output) => {
        const charger = data.triggerSetConfig.P5挡枪顺序1.toString()
          .split(/[,\\/，]/)
          .map((v) => v.trim().toUpperCase());
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
        charge: { en: "站在最前" },
      },
    },
    {
      id: "Souma 伊甸 P5 星灵之剑结束",
      type: "StartsUsing",
      netRegex: { id: "9D7C", capture: false },
      condition: (data) => data.soumaPhase === "P5",
      delaySeconds: 25,
      run: (data) => {
        data.soumaP5星灵之剑.length = 0;
        data.soumaP5星灵之剑阶段 = false;
      },
    },
    {
      id: "Souma 伊甸 P5 星灵之剑2",
      type: "GainsEffect",
      netRegex: {
        effectId: ["1044", "CFB"],
      },
      condition: (data) => data.soumaPhase === "P5" && data.soumaP5星灵之剑阶段,
      preRun: (data, matches) => {
        data.soumaP5星灵之剑.push(matches.target);
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          changeToOtherSide: { en: "走，换边！" },
          dodge: { en: "走" },
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
      id: "Souma 伊甸 P5 星灵之剑3",
      type: "GainsEffect",
      netRegex: {
        effectId: ["1044", "CFB"],
        capture: false,
      },
      condition: (data) => data.soumaPhase === "P5" && data.soumaP5星灵之剑阶段,
      delaySeconds: 2,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          text: { en: "进" },
          charge: { en: "进+最前" },
        };
        if (data.soumaP5星灵之剑.length === 8) {
          return;
        }
        const round = Math.floor((data.soumaP5星灵之剑.length % 8) / 2);
        const charger = data.triggerSetConfig[`P5挡枪顺序${round + 1}`]
          .toString()
          .split(/[,\/，]/)
          .map((v) => v.trim().toUpperCase());
        const rp = getRpByName(data, data.me);
        if (charger.includes(rp) && !data.soumaP5星灵之剑.includes(data.me)) {
          return { alarmText: output.charge() };
        }
        return { infoText: output.text() };
      },
    },
    // #endregion P5
  ],
});
