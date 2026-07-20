Options.Triggers.push({
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  initData: () => {
    return {
      soumaP1S结咒魔锁Red: null,
      soumaP1S结咒魔锁Purple: null,
    };
  },
  triggers: [
    {
      id: "P1S Shackles of Time",
      netRegex: NetRegexes.gainsEffect({ effectId: "AB5" }),
      alertText: (data, matches, output) => {
        if (matches.target === data.me) return output.oppositeIsYou();
        return output.oppositeAnother({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        oppositeAnother: {
          en: "Opposite color of ${player}",
          cn: "站在火（除了${player}）",
        },
        oppositeIsYou: {
          en: "Opposite color of Party",
          cn: "站在光（点你）",
        },
      },
    },
    {
      id: "P1S Fourfold Shackles of Companionship 1",
      netRegex: NetRegexes.gainsEffect({ effectId: "B45" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Nearly 3", cn: "近3（上）" },
        tts: { en: "Close to and above", cn: "靠近上上" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Companionship 2",
      netRegex: NetRegexes.gainsEffect({ effectId: "B46" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Nearly 8", cn: "近8（右）" },
        tts: { en: "Close to right", cn: "靠近右右" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Companionship 3",
      netRegex: NetRegexes.gainsEffect({ effectId: "B47" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Nearly 13", cn: "近13（下）" },
        tts: { en: "Close down", cn: "靠近下下" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Companionship 4",
      netRegex: NetRegexes.gainsEffect({ effectId: "B6B" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Nearly 18", cn: "近18（左）" },
        tts: { en: "Close to left", cn: "靠近左左" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Loneliness 1",
      netRegex: NetRegexes.gainsEffect({ effectId: "B48" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Far 3", cn: "远3（左上）" },
        tts: { en: "Upper right away", cn: "左上远离" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Loneliness 2",
      netRegex: NetRegexes.gainsEffect({ effectId: "B49" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Far 8", cn: "远8（右上）" },
        tts: { en: "Lower right away", cn: "右上远离" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Loneliness 3",
      netRegex: NetRegexes.gainsEffect({ effectId: "B4A" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Far 13", cn: "远13（右下）" },
        tts: { en: "Lower left away", cn: "右下远离" },
      },
    },
    {
      id: "P1S Fourfold Shackles of Loneliness 4",
      netRegex: NetRegexes.gainsEffect({ effectId: "B6C" }),
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, _matches, output) => output.alert(),
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: {
        alert: { en: "Far 18", cn: "远18（左下）" },
        tts: { en: "Upper left away", cn: "左下远离" },
      },
    },
    {
      id: "P1S Shackles of Companionship",
      netRegex: NetRegexes.gainsEffect({ effectId: "AB6" }),
      condition: (data, matches) => matches.target === data.me,
      infoText: (_data, _matches, output) => output.closeShacklesOnYou(),
      outputStrings: {
        closeShacklesOnYou: {
          en: "Close Shackles on YOU",
          cn: "近线",
        },
      },
    },
    {
      id: "P1S Shackles of Loneliness",
      netRegex: NetRegexes.gainsEffect({ effectId: "AB7" }),
      condition: (data, matches) => matches.target === data.me,
      infoText: (_data, _matches, output) => output.farShacklesOnYou(),
      outputStrings: {
        farShacklesOnYou: {
          en: "Far Shackles on YOU",
          cn: "远线",
        },
      },
    },
    { id: "P1S Aetherial Shackles Callout", disabled: true, netRegex: NetRegexes.gainsEffect({ effectId: "AB[67]" }) },
    {
      id: "P1S 结咒魔锁",
      netRegex: NetRegexes.gainsEffect({ effectId: ["AB6", "AB7"] }),
      preRun: (data, matches) => {
        if (matches.effectId === "AB6") data.soumaP1S结咒魔锁Purple = matches.target;
        else if (matches.effectId === "AB7") data.soumaP1S结咒魔锁Red = matches.target;
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP1S结咒魔锁Purple && data.soumaP1S结咒魔锁Red) {
          const purple = data.soumaP1S结咒魔锁Purple.toString();
          const red = data.soumaP1S结咒魔锁Red.toString();
          data.soumaP1S结咒魔锁Purple = null;
          data.soumaP1S结咒魔锁Red = null;
          if (purple === data.me) {
            return data.role === "dps" ? output.aetherExChangeIsYou() : output.aetherStayIsYou();
          } else if (red === data.me) {
            return data.role !== "dps" ? output.aetherExChangeIsYou() : output.aetherStayIsYou();
          } else {
            const nearRole = data.party.nameToRole_[purple];
            const farRole = data.party.nameToRole_[red];
            return (
              (nearRole === "dps" ? output.aetherExchange({ group: data.ShortName(purple) }) : "") +
              (farRole !== "dps" ? output.aetherExchange({ group: data.ShortName(red) }) : "") +
              (nearRole === "dps" && farRole !== "dps"
                ? output.aetherExtraOptimize({
                    near: data.ShortName(purple),
                    far: data.ShortName(red),
                  })
                : "")
            );
          }
        }
      },
      outputStrings: {
        aetherStayIsYou: {
          en: "Keep standing",
          cn: "保持站位",
        },
        aetherExChangeIsYou: {
          en: "Need transposition",
          cn: "同组交换！",
        },
        aetherExchange: {
          en: "${group} group swap. ",
          cn: "${group}组换！ ",
        },
        aetherExtraOptimize: {
          en: "Optimizeable: ${near} and ${far} exchange",
          cn: "可选优化:${near}与${far}换",
        },
      },
    },
    {
      id: "P1S Gaoler's Flail Out => In",
      netRegex: NetRegexes.startsUsing({ id: "65F[89]" }),
      condition: (data) => !(data.intemperance === 2),
      alertText: (_data, _matches, output) => output.out2InAlert(),
      tts: (_data, _matches, output) => output.out2InTTS(),
      outputStrings: {
        out2InAlert: {
          en: "Out => In",
          cn: "远离 => 靠近",
        },
        out2InTTS: {
          en: "Out first",
          cn: "先远离",
        },
      },
    },
    {
      id: "P1S Gaoler's Flail Out => In, 后靠近",
      netRegex: NetRegexes.startsUsing({ id: "65F[89]" }),
      condition: (data) => !(data.intemperance === 2),
      delaySeconds: 11.2,
      tts: (_data, _matches, output) => output.afterTTS(),
      outputStrings: {
        afterTTS: {
          en: "In",
          cn: "靠近",
        },
      },
    },
    {
      id: "P1S Gaoler's Flail In => Out",
      netRegex: NetRegexes.startsUsing({ id: "65F[AB]" }),
      condition: (data) => !(data.intemperance === 2),
      alertText: (_data, _matches, output) => output.in2OutAlert(),
      tts: (_data, _matches, output) => output.in2OutTTS(),
      outputStrings: {
        in2OutAlert: {
          en: "In => Out",
          cn: "靠近 => 远离",
        },
        in2OutTTS: {
          en: "In first",
          cn: "先靠近",
        },
      },
    },
    {
      id: "P1S Gaoler's Flail In => Out, 后远离",
      netRegex: NetRegexes.startsUsing({ id: "65F[AB]" }),
      condition: (data) => !(data.intemperance === 2),
      delaySeconds: 11.2,
      tts: (_data, _matches, output) => output.afterTTS(),
      outputStrings: {
        afterTTS: {
          en: "Out",
          cn: "远离",
        },
      },
    },

    {
      id: "P1S 第二次温度计踩塔钢铁月环",
      netRegex: NetRegexes.startsUsing({ id: "65F[89]" }),
      condition: (data) => data.intemperance === 2,
      durationSeconds: 18,
      infoText: (_data, _matches, output) => output.intemperance2Out2In(),
      tts: null,
      outputStrings: {
        intemperance2Out2In: {
          en: "Stand => Out => In",
          cn: "踩方块 => 远离 => 靠近",
        },
      },
    },
    {
      id: "P1S 第二次温度计踩塔月环钢铁",
      netRegex: NetRegexes.startsUsing({ id: "65F[AB]" }),
      condition: (data) => data.intemperance === 2,
      durationSeconds: 18,
      infoText: (_data, _matches, output) => output.intemperance2In2Out(),
      tts: null,
      outputStrings: {
        intemperance2In2Out: {
          en: "Stand => In => Out",
          cn: "踩方块 => 靠近 => 远离",
        },
      },
    },
    {
      id: "P1S 第二次温度计先远离然后靠近",
      netRegex: NetRegexes.startsUsing({ id: "65F[89]" }),
      condition: (data) => data.intemperance === 2,
      delaySeconds: 8.5,
      tts: (_data, _matches, output) => output.intemperance2Out2In(),
      outputStrings: {
        intemperance2Out2In: {
          en: "Out then In",
          cn: "远离然后靠近",
        },
      },
    },
    {
      id: "P1S 第二次温度计先靠近再远离",
      netRegex: NetRegexes.startsUsing({ id: "65F[AB]" }),
      condition: (data) => data.intemperance === 2,
      delaySeconds: 8.5,
      tts: (_data, _matches, output) => output.intemperance2In2Out(),
      outputStrings: {
        intemperance2In2Out: {
          en: "In then Out",
          cn: "靠近然后远离",
        },
      },
    },
    { id: "P1S 温度计1", netRegex: NetRegexes.startsUsing({ id: "6620" }), run: (data) => (data.intemperance = 1) },
    { id: "P1S 温度计2", netRegex: NetRegexes.startsUsing({ id: "661F" }), run: (data) => (data.intemperance = 2) },
  ],
  timeline: [
    'hideall "温度计结束"',
    'hideall "踩方块定位"',
    '163.5 "温度计结束"',
    '386.6 "温度计结束"',
    '132 "踩方块定位"',
    '143 "踩方块定位"',
    '153.5 "踩方块定位"',
    '355 "踩方块定位"',
    '366 "踩方块定位"',
    '376.5 "踩方块定位"',
  ],
  timelineTriggers: [
    {
      id: "P1S Tile Positions",
      regex: new RegExp(),
      disabled: true,
    },
    {
      id: "P1S 温度计结束倒计时4",
      regex: /踩方块定位/,
      delaySeconds: 0,
      tts: (_data, _matches, output) => output.tts(),
      suppressSeconds: 3,
      outputStrings: {
        tts: {
          en: "Tile Positions",
          cn: "踩方块",
        },
      },
    },
    {
      id: "P1S 温度计结束倒计时3",
      regex: /踩方块定位/,
      delaySeconds: 1,
      tts: (_data, _matches, output) => output.tts(),
      suppressSeconds: 3,
      outputStrings: { tts: { en: "3", cn: "3" } },
    },
    {
      id: "P1S 温度计结束倒计时2",
      regex: /踩方块定位/,
      delaySeconds: 2,
      tts: (_data, _matches, output) => output.tts(),
      suppressSeconds: 3,
      outputStrings: { tts: { en: "2", cn: "2" } },
    },
    {
      id: "P1S 温度计结束倒计时1",
      regex: /踩方块定位/,
      delaySeconds: 3,
      suppressSeconds: 3,
      tts: (_data, _matches, output) => output.tts(),
      outputStrings: { tts: { en: "1", cn: "1" } },
    },
    {
      id: "P1S 温度计计数回收",
      regex: /^温度计结束$/,
      run: (data) => {
        delete data.intemperance;
      },
    },
  ],
  timelineReplace: [
    {
      missingTranslations: true,
      replaceSync: {
        "Engage!": "(?:战斗开始！|Engage!|戦闘開始！)",
        "戦闘開始！": "(?:战斗开始！|Engage!|戦闘開始！)",
        "Erichthonios": "[^:]+",
        "エリクトニオス": "[^:]+",
      },
      replaceText: {
        "Intemperate Torment": "侵蚀发动",
        "Aetherchain": "去反色地板",
        "爆鎖": "去反色地板",
        "Aetherial Shackles": "红远/紫近",
        "結呪の魔鎖": "红远/紫近",
        "Chain Pain": "锁链判定",
        "結呪執行": "锁链判定",
        "Fourfold Shackles": "四连-红远/紫近",
        "結呪の四連魔鎖": "四连-红远/紫近",
        "Gaoler's Flail": "武器技",
        "懲罰撃": "武器技",
        "Heavy Hand": "死刑",
        "痛撃": "死刑",
        "Inevitable Flame": "定时炎爆",
        "時限炎爆": "定时炎爆",
        "Inevitable Light": "定时光爆",
        "(?<=[^ ])Light": "光",
        "(?<=[^ ])Fire": "光",
        "時限光爆": "定时光爆",
        "Intemperance": "温度计阶段",
        "氷火の侵食": "温度计阶段",
        "Lethe": "狂暴",
        "辺獄送り": "狂暴",
        "Pitiless Flail of Grace": "死刑+分摊",
        "Flail of Grace": "分摊",
        "懲罰連撃・聖": "死刑+分摊",
        "Pitiless Flail of Purgation": "死刑+核爆",
        "Purgation": "核爆",
        "懲罰連撃・炎": "死刑+核爆",
        "Powerful Fire": "火地板",
        "炎爆": "火地板",
        "Powerful Light": "光地板",
        "光爆": "光地板",
        "Shackles of Time": "被点名站在光",
        "時限の魔鎖": "被点名站在光",
        "Shining Cells": "AOE",
        "光炎監獄": "AOE",
        "Slam Shut": "AOE",
        "監獄閉塞": "AOE",
        "True Flare": "核爆判定",
        "トゥルー・フレア": "核爆判定",
        "True Holy": "分摊判定",
        "Holy": "分摊",
        "トゥルー・ホーリー": "分摊判定",
        "Warder's Wrath": "AOE",
        "魔鎖乱流": "AOE",
        "First Element": "第一次方块",
        "Second Element": "第二次方块",
        "Third Element": "第三次方块",
        "In/Out": "靠近/远离",
        "Out/In": "远离/靠近",

        "爆锁": "去反色地板",
        "结咒魔锁": "红远/紫近",
        "结咒发动": "锁链判定",
        "第一元素": "第一次方块",
        "结咒四连魔锁": "四连-红远/紫近",
        "惩罚抽击": "武器技",
        "惩罚抽击 内/外": "武器技 内/外",
        "惩罚抽击 外/内": "武器技 内/外",
        "掌掴": "死刑",
        // "限时炎爆":"",
        // "限时光爆":"",
        // "冰火侵蚀":"",
        // "侵蚀发动":"",
        "边境流刑": "狂暴",
        "惩罚连击·圣": "死刑+分摊",
        "惩罚连击·炎": "死刑+核爆",
        // "炎爆": "核爆",
        // "光爆": "分摊",
        "第二元素": "第二次方块",
        // "限时魔锁":"",
        "光炎监狱": "大AOE",
        "监狱封闭": "大AOE",
        "第三元素": "第三次方块",
        "纯正核爆": "核爆判定",
        "纯正神圣": "分摊判定",
        "魔锁乱流": "AOE",
      },
    },
  ],
});

Object.assign(Options.PerTriggerOptions, {
  "P1S Pitiless Flail of Grace": {
    AlertText: "死刑+分摊",
  },
  "P1S Pitiless Flail of Purgation": {
    AlertText: "死刑+核爆",
  },
});
