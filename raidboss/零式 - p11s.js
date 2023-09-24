if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  // 因牵扯到变量作用域入侵，所以是在主库的基础上进行修改/新增的，大部分非原创。
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheEleventhCircleSavage",
    zoneId: ZoneId.AnabaseiosTheEleventhCircleSavage,
    config: [
      {
        id: "darkAndLight",
        name: {
          en: "光与暗的调停打法",
        },
        type: "select",
        options: {
          en: {
            game8: "game8",
            美服uptime: "uptime",
          },
        },
        default: "game8",
      },
    ],
    initData: () => {
      return {
        souma: {
          upheldTethers: [],
          lightDarkDebuff: {},
          lightDarkTether: {},
          lightDarkBuddy: {},
          tankbuster: [],
        },
      };
    },
    triggers: [
      {
        id: "P11S Phase Tracker",
        type: "StartsUsing",
        netRegex: { id: ["8219", "81FE", "87D2"] },
        run: (data, matches) => {
          data.souma.upheldTethers = [];
          const phaseMap = {
            "8219": "messengers",
            "81FE": "darkLight",
            "87D2": "letter",
          };
          data.souma.phase = phaseMap[matches.id];
        },
      },
      {
        id: "P11S Upheld Tether Collector",
        type: "Tether",
        netRegex: { id: "00F9" },
        run: (data, matches) => data.souma.upheldTethers.push(matches),
      },
      {
        id: "P11S Dark and Light Tether Collect",
        type: "Tether",
        netRegex: { id: ["00EC", "00ED", "00EE", "00EF", "00F0", "00F1"] },
        run: (data, matches) => {
          const isNear = matches.id === "00F0" || matches.id === "00F1";
          const nearFarStr = isNear ? "短" : "长";
          data.souma.lightDarkTether[matches.source] = data.souma.lightDarkTether[matches.target] = nearFarStr;
          data.souma.lightDarkBuddy[matches.source] = matches.target;
          data.souma.lightDarkBuddy[matches.target] = matches.source;
        },
      },
      {
        id: "P11S Dark and Light Buff Collect",
        type: "GainsEffect",
        netRegex: { effectId: ["DE1", "DE2", "DE3", "DE4"] },
        run: (data, matches) => {
          const isLight = matches.effectId === "DE1" || matches.effectId === "DE3";
          data.souma.lightDarkDebuff[matches.target] = isLight ? "光" : "暗";
        },
      },
      {
        id: "P11S Dark and Light Tether Callout",
        type: "Tether",
        netRegex: { id: ["00EC", "00ED", "00EE", "00EF", "00F0", "00F1"], capture: false },
        delaySeconds: 0.5,
        durationSeconds: 60,
        suppressSeconds: 9999,
        infoText: (data, _, output) => {
          const myColor = data.souma.lightDarkDebuff[data.me];
          const myLength = data.souma.lightDarkTether[data.me];
          const myBuddy = data.ShortName(data.souma.lightDarkBuddy[data.me]);
          const myRole = data.role === "dps" ? "dps" : "TH";
          if (!myLength || !myColor | !myRole) {
            // 人死了
            return;
          }
          if (data.triggerSetConfig.darkAndLight === "uptime") {
            if (data.role === "dps") {
              data.souma.uptime = output[`uptimeDps搭档${myLength}${data.party.nameToRole_[data.souma.lightDarkBuddy[data.me]]}`]();
            } else {
              data.souma.uptime = output[`uptime${myLength}${data.role}`]();
            }
            return data.souma.uptime;
          }
          return output[`${myLength}${myColor}${myRole}`]({ buddy: myBuddy });
        },
        outputStrings: {
          短光TH: { en: "左（西）侧 短光 与${buddy}" },
          长光TH: { en: "左（西）侧 长光 与${buddy}" },
          短暗dps: { en: "左（西）侧 短暗 与${buddy}" },
          长暗dps: { en: "左（西）侧 长暗 与${buddy}" },
          短暗TH: { en: "右（东）侧 短暗 与${buddy}" },
          长暗TH: { en: "右（东）侧 长暗 与${buddy}" },
          短光dps: { en: "右（东）侧 短光 与${buddy}" },
          长光dps: { en: "右（东）侧 长光 与${buddy}" },
          uptime长tank: { en: "上A点" },
          uptime短tank: { en: "左D点" },
          uptime长healer: { en: "下C点" },
          uptime短healer: { en: "右B点" },
          uptimeDps搭档长tank: { en: "左下3点" },
          uptimeDps搭档短tank: { en: "左上4点" },
          uptimeDps搭档长healer: { en: "右上1点" },
          uptimeDps搭档短healer: { en: "右下2点" },
        },
      },
      {
        id: "P11S Jury Overruling Light",
        type: "StartsUsing",
        netRegex: { id: "81E6", capture: false },
        durationSeconds: 6,
        alertText: (data, _matches, output) => {
          if (!data.souma.lightDarkDebuff[data.me]) return output.text();
          if (data.triggerSetConfig.darkAndLight === "uptime") {
            return output["uptime" + data.souma.lightDarkTether[data.me] + (data.role === "dps" ? "dps" : "tn")]({
              pos: data.souma.uptime,
              text: output.text(),
            });
          } else {
            const myColor = data.souma.lightDarkDebuff[data.me];
            const myLength = data.souma.lightDarkTether[data.me];
            const result = output[`${myLength}${myColor}`]();
            return result;
          }
        },
        outputStrings: {
          uptime长dps: { en: "${pos} + ${text}（45度）" },
          uptime长tn: { en: "${pos} + ${text}（90度）" },
          uptime短dps: { en: "${pos} + ${text}（反45度）" },
          uptime短tn: { en: "${pos} + ${text}（向外）" },
          text: { en: "八方分散 => 四四分摊" },
          长光: { en: "原地 + 八方分散 => 四四分摊" },
          长暗: { en: "45度 + 八方分散 => 四四分摊" },
          短光: { en: "90度 + 八方分散 => 四四分摊" },
          短暗: { en: "135度 + 八方分散 => 四四分摊" },
        },
      },
      {
        id: "P11S Jury Overruling Light Followup",
        type: "Ability",
        netRegex: { id: "81E8", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "四四分摊",
          },
        },
      },
      {
        id: "P11S Jury Overruling Dark",
        type: "StartsUsing",
        netRegex: { id: "81E7", capture: false },
        durationSeconds: 6,
        alertText: (data, _matches, output) => {
          if (!data.souma.lightDarkDebuff[data.me]) return output.text();
          if (data.triggerSetConfig.darkAndLight === "uptime") {
            return output["uptime" + data.souma.lightDarkTether[data.me] + (data.role === "dps" ? "dps" : "tn")]({
              pos: data.souma.uptime,
              text: output.text(),
            });
          } else {
            const myColor = data.souma.lightDarkDebuff[data.me];
            const myLength = data.souma.lightDarkTether[data.me];
            const result = output[`${myLength}${myColor}`]();
            return result;
          }
        },
        outputStrings: {
          uptime长dps: { en: "${pos} + ${text}（原地）" },
          uptime长tn: { en: "${pos} + ${text}（45度）" },
          uptime短dps: { en: "${pos} + ${text}（45度）" },
          uptime短tn: { en: "${pos} + ${text}（90度）" },
          text: { en: "八方分散 => 二二分摊" },
          长光: { en: "原地 + 八方分散 => 45度 + 二二分摊" },
          长暗: { en: "45度 + 八方分散 => 原地 + 二二分摊" },
          短光: { en: "90度 + 八方分散 => 场外 + 二二分摊" },
          短暗: { en: "135度 + 八方分散 => 场外 + 二二分摊" },
        },
      },
      {
        id: "P11S Jury Overruling Dark Followup",
        type: "Ability",
        netRegex: { id: "81E9", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            cn: "二二分摊",
          },
        },
      },
      {
        id: "P11S Divisive Overruling Dark Followup",
        type: "Ability",
        netRegex: { id: "81EE", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (data, _matches, output) => output[data.souma.divisiveColor](),
        run: (data) => {
          delete data.souma.divisiveColor;
        },
        outputStrings: {
          light: { en: "两侧 + 四四分摊" },
          dark: { en: "内侧 + 二二分摊" },
        },
      },
      {
        id: "P11S Upheld Overruling Dark",
        type: "StartsUsing",
        netRegex: { id: "87D4", capture: false },
        durationSeconds: 6,
        response: (data, _matches, output) => {
          const [tether] = data.souma.upheldTethers;
          if (tether === undefined || data.souma.upheldTethers.length !== 1) return { alertText: output.upheldNotOnYou() };
          if (tether.target === data.me) return { alarmText: output.upheldOnYou() };
          return { alertText: output.upheldOnPlayer({ player: data.ShortName(tether.target) }) };
        },
        run: (data) => (data.souma.upheldTethers = []),
        outputStrings: {
          upheldOnYou: {
            en: "引导月环 => 月环 + 二二分摊",
          },
          upheldOnPlayer: {
            en: "远离 => 月环 + 二二分摊",
          },
          upheldNotOnYou: {
            en: "远离 => 月环 + 二二分摊",
          },
        },
      },
      {
        id: "P11S Upheld Overruling Dark Followup",
        type: "Ability",
        netRegex: { id: "81F3", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "月环 + 二二分摊",
          },
        },
      },
      {
        id: "P11S Upheld Ruling Tether",
        type: "StartsUsing",
        netRegex: { id: "87D1" },
        delaySeconds: (data) => (data.souma.phase === "messengers" ? 5.7 : 0),
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            tankTether: {
              en: "远离放月环",
            },
            partyStackPlayerOut: {
              en: "集合分摊",
            },
            partyStack: {
              en: "集合分摊",
            },
          };
          const sourceId = matches.sourceId;
          const [tether] = data.souma.upheldTethers.filter((x) => x.sourceId === sourceId);
          if (tether === undefined || data.souma.upheldTethers.length !== 2) return { alertText: output.partyStack() };
          if (tether.target === data.me) return { alarmText: output.tankTether() };
          return {
            alertText: output.partyStackPlayerOut({ player: data.ShortName(tether.target) }),
          };
        },
        run: (data) => (data.souma.upheldTethers = []),
      },
      {
        id: "P11S Dark Perimeter Followup",
        type: "Ability",
        netRegex: { id: "8225", capture: false },
        condition: (data) => data.souma.phase === "letter",
        suppressSeconds: 5,
        response: Responses.getTowers("alert"),
      },
      {
        id: "P11S Upheld Overruling Light",
        type: "StartsUsing",
        netRegex: { id: "87D3", capture: false },
        durationSeconds: 6,
        alertText: (_data, _matches, output) => output.text(),
        run: (data) => (data.souma.upheldTethers = []),
        outputStrings: {
          text: {
            en: "场中集合 => 远离 + 四四分摊",
          },
        },
      },
      {
        id: "P11S Upheld Overruling Light Followup",
        type: "Ability",
        netRegex: { id: "81F2", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "远离 + 四四分摊",
          },
        },
      },
      {
        id: "P11S Divisive Overruling Light",
        type: "StartsUsing",
        netRegex: { id: "81EC", capture: false },
        durationSeconds: 9,
        alertText: (_data, _matches, output) => output.text(),
        run: (data) => (data.souma.divisiveColor = "light"),
        outputStrings: {
          text: {
            en: "两侧 => 两侧 + 四四分摊 ",
          },
        },
      },
      {
        id: "P11S Divisive Overruling Dark",
        type: "StartsUsing",
        netRegex: { id: "81ED", capture: false },
        durationSeconds: 9,
        alertText: (data, _matches, output) => {
          if (!data.souma.lightDarkDebuff[data.me]) return output.text();
          if (data.triggerSetConfig.darkAndLight === "uptime") {
            return output.text();
          }
          return output[data.souma.lightDarkTether[data.me]]();
        },
        run: (data) => (data.souma.divisiveColor = "dark"),
        outputStrings: {
          text: { en: "两侧 => 内侧 + 二二分摊" },
          长: { en: "两侧 => 内右侧 + 二二分摊" },
          短: { en: "两侧 => 内左侧 + 二二分摊" },
        },
      },
      {
        id: "P11S Souma Emissary's Will",
        type: "StartsUsing",
        netRegex: { id: "8202", capture: false },
        run: (data) => {
          data.souma.lightDarkDebuff = {};
          data.souma.lightDarkTether = {};
          data.souma.lightDarkBuddy = {};
        },
      },
      {
        id: "P11S Dismissal Overruling Light",
        type: "StartsUsing",
        netRegex: { id: "8784", capture: false },
        durationSeconds: 6,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "击退 => 远离 + 四四分摊",
          },
        },
      },
      {
        id: "P11S Dismissal Overruling Light Followup",
        type: "Ability",
        netRegex: { id: "8784", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "远离 + 四四分摊",
          },
        },
      },
      {
        id: "P11S Dismissal Overruling Dark",
        type: "StartsUsing",
        netRegex: { id: "8785", capture: false },
        durationSeconds: 6,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "击退 => 月环 + 二二分摊",
          },
        },
      },
      {
        id: "P11S Dismissal Overruling Dark Followup",
        type: "Ability",
        netRegex: { id: "8785", capture: false },
        durationSeconds: 4,
        suppressSeconds: 5,
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "月环 + 二二分摊",
          },
        },
      },
      {
        id: "P11S Divisive Overruling Light Shadowed Messengers",
        type: "StartsUsing",
        netRegex: { id: "87B3", capture: false },
        durationSeconds: 8,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "两侧 + 四四分摊",
          },
        },
      },
      {
        id: "P11S Divisive Overruling Dark Shadowed Messengers",
        type: "StartsUsing",
        netRegex: { id: "87B4", capture: false },
        durationSeconds: 12,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "内侧 + 二二分摊",
          },
        },
      },
    ],
    timelineReplace: [
      {
        locale: "cn",
        missingTranslations: true,
        replaceText: {
          "Arcane Revelation": "魔法阵展开",
          "Arche": "始元",
          "Blinding Light": "光弹",
          "Dark Current": "黑暗奔流",
          "Dark Perimeter": "黑暗回环",
          "Dark and Light": "光与暗的调和",
          "Dike": "正义裁决",
          "Dismissal Overruling": "驳回否决",
          "Divisive Overruling": "分歧否决",
          "Divisive Ruling": "分歧裁决",
          "Emissary's Will": "调停",
          "Eunomia": "秩序裁决",
          "Explosion": "爆炸",
          "Heart of Judgment": "刑律波动",
          "Inevitable Law": "必然法律",
          "Inevitable Sentence": "必然判决",
          "Jury Overruling": "陪审否决",
          "Letter of the Law": "理法之幻奏",
          "Lightburst": "光爆破",
          "Lightstream": "光明奔流",
          "Shadowed Messengers": "戒律之幻奏",
          "Styx": "仇恨",
          "Twofold Revelation": "双重魔法阵展开",
          "Ultimate Verdict": "究极调停",
          "Unlucky Lot": "魔爆",
          "Upheld Overruling": "未决否决",
          "Upheld Ruling": "未决裁决",
        },
      },
    ],
  });
}
