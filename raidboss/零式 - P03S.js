Options.Triggers.push({
  zoneId: ZoneId.AsphodelosTheThirdCircleSavage,
  timeline: [
    'hideall "--giant fireplume?--"',
    'hideall "Joint Pyre"',
    'hideall "Storms of Asphodelos"',
    'hideall "Beacons of Asphodelos"',
    'hideall "将BOSS拉到场边"',
    'hideall "将BOSS拉回场中"',
    '1 "将BOSS拉到场边"',
    '105 "将BOSS拉到场边"',
    '562 "将BOSS拉到场边"',
    '588.5 "将BOSS拉回场中"',
    '795 "将BOSS拉到场边"',
    '832 "将BOSS拉到场边"',
  ],
  timelineTriggers: [
    {
      id: "拉北",
      regex: /将BOSS拉到场边/,
      condition: (data) => data.role === "tank",
      infoText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "north", cn: "拉北" },
      },
    },
    {
      id: "拉中",
      regex: /将BOSS拉回场中/,
      condition: (data) => data.role === "tank",
      infoText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "north", cn: "回场中" },
      },
    },
    {
      id: "上天前",
      regex: /--untargetable--/,
      infoText: (_data, _matches, output) => output.text(),
      beforeSeconds: 9,
      durationSeconds: 9,
      tts: null,
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "10s to untargetable", cn: "即将上天" },
      },
    },
    {
      id: "上天前4",
      regex: /--untargetable--/,
      beforeSeconds: 5,
      tts: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "untargetable", cn: "上天" },
      },
    },
    {
      id: "上天前3",
      regex: /--untargetable--/,
      beforeSeconds: 3,
      tts: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "3" },
      },
    },
    {
      id: "上天前2",
      regex: /--untargetable--/,
      beforeSeconds: 2,
      tts: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "2" },
      },
    },
    {
      id: "上天前1",
      regex: /--untargetable--/,
      beforeSeconds: 1,
      tts: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "1" },
      },
    },
    {
      id: "截线死刑T",
      regex: /Heat of Condemnation/,
      condition: (data) => data.role === "tank",
      beforeSeconds: 12,
      infoText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "ready tank burst", cn: "准备截线" },
      },
    },
    {
      id: "截线死刑HD",
      regex: /Heat of Condemnation/,
      condition: (data) => data.role !== "tank",
      beforeSeconds: 12,
      infoText: (_data, _matches, output) => output.text(),
      sound: "",
      soundVolume: 0,
      outputStrings: {
        text: { en: "gathers behind", cn: "身后集合" },
      },
    },
  ],
  timelineReplace: [
    {
      missingTranslations: true,
      replaceSync: {
        "Engage!": "(?:战斗开始！|Engage!|戦闘開始！)",
        "戦闘開始！": "(?:战斗开始！|Engage!|戦闘開始！)",
        "Phoinix": "[^:]+",
        "フェネクス": "[^:]+",
        "Darkblaze Twister": "[^:]+",
        "辺獄の闇炎旋風": "[^:]+",
        "Fountain of Fire": "[^:]+",
        "霊泉の炎": "[^:]+",
        "Phoinix": "[^:]+",
        "フェネクス": "[^:]+",
        "Sparkfledged": "[^:]+",
        "火霊鳥": "[^:]+",
        "Sunbird": "[^:]+",
        "陽炎鳥": "[^:]+",
      },
      replaceText: {
        "Ashen Eye": "扇形攻击",
        "闇の瞳": "扇形攻击",
        "^Ashplume$": "分摊/散开",
        "^暗闇の劫火天焦$": "分摊/散开",
        "Beacons of Asphodelos": "边狱之炎",
        "辺獄の火": "边狱之炎",
        "Blazing Rain": "小AOE",
        "炎の雨": "小AOE",
        "Brightened Fire": "炸火苗",
        "光の炎": "炸火苗",
        "^Burning Twister$": "小龙卷月环",
        "^炎旋風$": "小龙卷月环",
        "^Dark Twister$": "小龙卷击退",
        "^闇旋風$": "小龙卷击退",
        "Darkblaze Twister": "前往黑色连线",
        "辺獄の闇炎旋風": "前往黑色连线",
        "Darkened Fire": "站位放鸟",
        "闇の炎": "站位放鸟",
        "Dead Rebirth": "大AOE",
        "黒き不死鳥": "大AOE",
        "Death's Toll": "死之超越1外2斜4中间",
        "死の運命": "死之超越1外2斜4中间",
        "Devouring Brand": "十字走火",
        "十字走火": "十字走火",
        "Experimental Ashplume": "分摊/散开",
        "魔力錬成：暗闇の劫火天焦": "分摊/散开",
        "Experimental Fireplume": "场中集合引导",
        "魔力錬成：劫火天焦": "场中集合引导",
        "Experimental Gloryplume": "场中集合引导",
        "魔力錬成：炎闇劫火": "场中集合引导",
        "Final Exaltation": "狂暴",
        "灰燼の豪炎": "狂暴",
        "Fireglide Sweep": "连续强袭滑空",
        "連続強襲滑空": "连续强袭滑空",
        "Firestorms of Asphodelos": "AOE",
        "辺獄の炎嵐": "AOE",
        "Flames of Asphodelos": "三穿一",
        "辺獄の炎": "三穿一",
        "Flames of Undeath": "反魂之炎",
        "反魂の炎": "反魂之炎",
        "Flare of Condemnation": "8人散开",
        "獄炎の火撃": "8人散开",
        "Fledgling Flight": "点名放鸟",
        "群鳥飛翔": "点名放鸟",
        "Fountain of Death": "场边踩塔",
        "霊泉の波動": "场边踩塔",
        "Fountain of Fire": "灵泉阶段",
        "霊泉の炎": "灵泉阶段",
        "(?<!\\w )Gloryplume": "分摊/散开",
        "^炎闇劫火$": "分摊/散开",
        "Great Whirlwind": "大龙卷风",
        "大旋風": "大龙卷风",
        "Heat of Condemnation": "双T死刑",
        "獄炎の炎撃": "双T死刑",
        "Joint Pyre": "共燃",
        "共燃": "共燃",
        "Left Cinderwing": "左刀",
        "左翼焼却": "左刀",
        "Life's Agonies": "大AOE",
        "生苦の炎": "大AOE",
        "Right Cinderwing": "右刀",
        "右翼焼却": "右刀",
        "Scorched Exaltation": "AOE",
        "灰燼の炎": "AOE",
        "Searing Breeze": "集合放圈",
        "熱噴射": "集合放圈",
        "Sparks of Condemnation": "2X4分摊",
        "獄炎の火花": "2X4分摊",
        "Storms of Asphodelos": "边狱之暴",
        "辺獄の嵐": "边狱之暴",
        "Sun's Pinion": "点名冲锋",
        "陽炎の翼": "点名冲锋",
        "Trail of Condemnation": "俯冲",
        "獄炎の焔": "俯冲",
        "Winds of Asphodelos": "引导火龙卷",
        "辺獄の風": "引导火龙卷",
        "fire expands": "火扩大",
        "untargetable": "不可选中",
        "ターゲット不可": "不可选中",
        "(?<=--)targetable": "可选中",
        "ターゲット可能": "可选中",
        "adds targetable": "小怪可选中",
        "雑魚ターゲット可能": "小怪可选中",

        "暗之瞳": "小鸟扇形", //"Ashen Eye"
        "暗黑劫火焚天": "散开/分摊", //"(?<!\\w )Ashplume"
        // "边境之火":"",//"Beacons of Asphodelos"
        "炎之雨": "全场AOE", //"Blazing Rain"
        "光之炎": "麻将", //"Brightened Fire"
        "炎旋风": "小龙卷 月环", //"Burning Twister"
        "暗旋风": "小龙卷 击退", //"Dark Twister"
        "边境暗炎旋风": "黑色连线", //"Darkblaze Twister"
        "暗之炎": "召唤暗炎", //"Darkened Fire"
        "黑暗不死鸟": "大AOE", //"Dead Rebirth"
        // "死亡的命运":"",//"Death's Toll"
        // "十字地火":"",//"Devouring Brand"
        "魔力炼成：暗黑劫火焚天": "散开/分摊", //"Experimental Ashplume"
        "魔力炼成：劫火焚天": "大钢铁/九连环", //"Experimental Fireplume"
        "魔力炼成：炎暗劫火": "即将散开/分摊", //"Experimental Gloryplume"
        "灰烬豪焰": "狂暴", //"Final Exaltation"
        // "连续滑空强袭":"",//"Fireglide Sweep"
        "边境火焰风暴": "火龙卷", //"Firestorms of Asphodelos"
        "边境火焰": "三穿一", //"Flames of Asphodelos"
        // "返魂之炎":"",//"Flames of Undeath"
        "狱炎火击": "黄圈散开", //"Flare of Condemnation"
        "群鸟飞翔": "点名小鸟", //"Fledgling Flight"
        "灵泉之波动": "灵泉踩塔", //"Fountain of Death"
        // "灵泉之炎":"",//"Fountain of Fire"
        "炎暗劫火": "散开/分摊", //"(?<!\\w )Gloryplume"
        "大旋风": "狂暴", //"Great Whirlwind"
        "狱炎炎击": "接线死刑", //"Heat of Condemnation"
        // "共燃":"",//"Joint Pyre"
        // "左翼焚烧":"",//"Left Cinderwing"
        "生苦之炎": "大AOE", //"Life's Agonies"
        // "右翼焚烧":"",//"Right Cinderwing"
        "灰烬火焰": "AOE", //"Scorched Exaltation"
        "热喷射": "集合放圈", //"Searing Breeze"
        "狱炎火花": "分组分摊", //"Sparks of Condemnation"
        "边境风暴": "引导扇形", //"(?<!fire)Storms of Asphodelos"
        "阳炎之翼": "引导灵鸟", //"Sun's Pinion"
        "狱炎之焰": "中间/两侧", //"Trail of Condemnation"
        "边境之风": "引导火龙卷", //"Winds of Asphodelos"
      },
    },
  ],
});
