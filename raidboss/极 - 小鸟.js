if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const { mark } = Util.souma;
  Options.Triggers.push({
    zoneId: ZoneId.TheMinstrelsBalladEndsingersAria,
    timelineReplace: [
      {
        locale: "cn",
        replaceText: {
          "^脓液弹$": "大圈",
          "^博爱$": "分摊",
          "^绝望侵蚀：记录事件": "三连点名",
          "^分离$": "鸟头吐息",
          "^反讽$": "双奶分摊",
          "^哀歌：记录事件$": "AoE",
          "^反诘$": "中间/两侧",
          "^流溢：绝望轮唱$": "音游阶段",
          "^绝望轮唱$": "音游~",
          "^宿命$": "二连撞",
          "^绝望的锁链$": "锁链",
          "^傲慢$": "坦克死刑",
          "^天体撞击$": "红远蓝近",
          "^终末狂热": "AoE五连+流血 ",
          "^终末$": "AoE",
          "^神学宿命$": "回溯光圈",
          "^流溢：绝望合唱$": "大鸟转转转",
          "^终极命运$": "狂暴",
        },
      },
    ],
    timelineTriggers: [
      {
        id: "EndsingerEx 回溯标记开关",
        regex: /Diairesis/,
        infoText: "",
        run: (data, _matches, output) => {
          if (["true", "是", "1", "真", "开"].includes(output.标记总开关())) data.soumaEndsingerExPostNamazuEnable = true;
        },
        outputStrings: {
          标记总开关: {
            en: "关",
          },
        },
      },
      {
        id: "EndsingerEx 防不胜防",
        regex: /^Diairesis$/,
        beforeSeconds: 5,
        alarmText: "看鸟头",
      },
    ],
    initData: () => {
      return {
        soumaEndsingerExBuffCollector: {},
        soumaEndsingerExBuffSettlement: [],
        soumaEndsingerExPostNamazuEnable: false,
      };
    },
    triggers: [
      {
        id: "EndsingerEx 回溯标记",
        netRegex: NetRegexes.gainsEffect({ effectId: "95D" }),
        run: (data, matches, output) => {
          if (data.soumaEndsingerExPostNamazuEnable) {
            data.soumaEndsingerExBuffSettlement.push({
              name: matches.target,
              id: matches.targetId,
              role: data.party.nameToRole_[matches.target],
              effect:
                data.soumaEndsingerExBuffCollector[matches.target][
                  {
                    "17C": 2,
                    "17D": 1,
                    "17E": 0,
                  }[matches.count]
                ],
            });
            if (data.soumaEndsingerExBuffSettlement.length === 8) {
              const sortArr = ["tank", "dps", "healer"];
              const flare = data.soumaEndsingerExBuffSettlement
                .filter((v) => v.effect === "flare")
                .sort((a, b) => sortArr.indexOf(a.role) - sortArr.indexOf(b.role));
              const spread = data.soumaEndsingerExBuffSettlement.find((v) => v.effect === "spread");
              mark(parseInt(flare[0].id, 16), output.核爆坦克标记());
              mark(parseInt(flare[1].id, 16), output.核爆DPS标记());
              mark(parseInt(flare[2].id, 16), output.核爆治疗标记());
              mark(parseInt(spread.id, 16), output.大圈标记());
            }
          }
        },
        infoText: "",
        outputStrings: {
          核爆坦克标记: { en: "attack1" },
          核爆DPS标记: { en: "attack2" },
          核爆治疗标记: { en: "attack3" },
          大圈标记: { en: "stop1" },
        },
      },
      {
        id: "EndsingerEx buff收集",
        netRegex: NetRegexes.gainsEffect({ effectId: ["BB0", "BAD", "BAF", "BAE"] }),
        preRun: (data, matches) => {
          if (data.soumaEndsingerExBuffCollector[matches.target] === undefined) data.soumaEndsingerExBuffCollector[matches.target] = [];
          data.soumaEndsingerExBuffCollector[matches.target].push({ BB0: "stack", BAD: "donut", BAF: "flare", BAE: "spread" }[matches.effectId]);
        },
      },
      {
        id: "EndsingerEx 清理现有标记(前)",
        netRegex: NetRegexes.gainsEffect({ effectId: ["BB0", "BAD", "BAF", "BAE"] }),
        suppressSeconds: 999,
        run: (data) => {
          if (data.soumaEndsingerExPostNamazuEnable) clearMark();
        },
      },
      {
        id: "EndsingerEx 清理现有标记(后)",
        netRegex: NetRegexes.gainsEffect({ effectId: ["BB0", "BAD", "BAF", "BAE"] }),
        suppressSeconds: 999,
        delaySeconds: 60,
        run: (data) => {
          if (data.soumaEndsingerExPostNamazuEnable) clearMark();
        },
      },
    ],
  });
}
