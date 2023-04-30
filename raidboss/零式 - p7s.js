if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const isRaidEmulator = location.href.includes("raidemulator.html");
  function loop() {
    let i = 0;
    return function (max) {
      return (i = (i % max) + 1);
    };
  }
  function mark(actorID, markType, localOnly) {
    if (isRaidEmulator) {
      console.log(actorID, markType);
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "mark",
        p: JSON.stringify({ ActorID: parseInt(actorID, 16), MarkType: markType, localOnly: localOnly }),
      });
    }
  }
  function doTextCommand(text) {
    if (isRaidEmulator) {
      console.log(text);
    } else {
      callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
    }
  }
  function clearMark() {
    doTextCommand("/mk off <1>");
    doTextCommand("/mk off <2>");
    doTextCommand("/mk off <3>");
    doTextCommand("/mk off <4>");
    doTextCommand("/mk off <5>");
    doTextCommand("/mk off <6>");
    doTextCommand("/mk off <7>");
    doTextCommand("/mk off <8>");
  }
  Options.Triggers.push({
    zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
    initData: () => {
      return {
        soumaCustomMethods: { loop: loop() },
      };
    },
    timelineReplace: [
      {
        locale: "cn",
        missingTranslations: true,
        replaceSync: {
          "Agdistis": "[^:]+",
          "Immature Io": "[^:]+",
          "Immature Minotaur": "[^:]+",
          "Immature Stymphalide": "[^:]+",
        },
        replaceText: {
          "\\(close\\)": "(内)",
          "\\(far\\)": "(外)",
          "\\(arrow\\)": "(箭头)",
          "--eggs--": "果实",
          "Blades of Attis": "阿提斯之叶",
          "Bough of Attis": "阿提斯之干",
          "Bronze Bellows": "强袭突风",
          "Bullish Slash": "猛牛斩击",
          "Bullish Swipe": "猛牛横扫",
          "Condensed Aero II": "烈风凝聚",
          "Death's Harvest": "生命之繁茂【凶】",
          "Dispersed Aero II": "烈风散布",
          "Famine's Harvest": "生命之繁茂【猛】",
          "Forbidden Fruit": "生命的果实",
          "Hemitheos's Aero III": "半神暴风",
          "Hemitheos's Aero IV": "半神飙风",
          "Hemitheos's Glare(?! III)": "半神闪耀",
          "Hemitheos's Glare III": "半神闪灼",
          "Hemitheos's Holy(?! III)": "半神神圣",
          "Hemitheos's Holy III": "半神豪圣",
          "Hemitheos's Tornado": "半神龙卷",
          "Immortal's Obol": "生与死之歧",
          "Inviolate Bonds": "魔印创造",
          "Inviolate Purgation": "魔印创造·炼净",
          "Light of Life": "生命的极光",
          "Multicast": "多重咏唱",
          "Roots of Attis": "阿提斯之根",
          "Shadow of Attis": "阿提斯之露",
          "Spark of Life": "生命的光芒",
          "Static Path": "静滞之念",
          "Stymphalian Strike": "飞鸟强袭",
          "War's Harvest": "生命之繁茂【乱】",
        },
      },
    ],
    triggers: [
      {
        id: "Souma P7S Gains Effects Delay",
        netRegex: NetRegexes.gainsEffect({ effectId: "D4[56]" }),
        condition: (data, matches) => matches.target === data.me,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
        infoText: (_data, matches, output) => output[matches.effectId](),
        outputStrings: { D45: { en: "散开" }, D46: { en: "分摊" } },
      },
      {
        id: "Souma P7S Gains Effects 生命繁茂之狱",
        netRegex: NetRegexes.gainsEffect({
          effectId: ["CEC", "D45", "CED", "D46", "CEE", "CEF", "D3F", "D40", "D41", "D42", "D43", "D44"],
        }),
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 10,
        infoText: "",
        run: (data, matches, output) => {
          if (!["是", "开", "true", "1"].includes(output.标记())) return;
          const local = ["是", "开", "true", "1"].includes(output.本地标点());
          switch (matches.effectId) {
            case "CEC": //风1
            case "D45": //风2
            case "CEE": //新风1 钢铁
            case "D3F": //新风2 钢铁
            case "D40": //新风3 钢铁
            case "D41": //新风4 钢铁
              mark(matches.targetId, "attack" + data.soumaCustomMethods.loop(4), local);
              break;
            case "CED": //光1
            case "D46": //光2
            case "CEF": //新光1 月环
            case "D42": //新光2 月环
            case "D43": //新光3 月环
            case "D44": //新光4 月环
              mark(matches.targetId, "bind1", local);
              break;
          }
        },
        outputStrings: { 标记: { en: "关" }, 本地标点: { en: "是" } },
      },
      {
        id: "Souma P7S Gains Effects 魔印回收标记",
        netRegex: NetRegexes.gainsEffect({ effectId: ["CEF", "D42", "D43", "D44"] }),
        delaySeconds: (_data, matches) => parseFloat(matches.duration),
        run: () => {
          clearMark();
        },
      },
      // {
      //   id: "P7S Forbidden Fruit 4 and Harvest Tethers",
      //   netRegex: NetRegexes.tether({ id: ["0001", "0006", "0039", "0011"] }),
      //   condition: (data) => !data.stopTethers,
      //   preRun: (data, matches) => data.tetherCollect.push(matches.target),
      //   delaySeconds: 0.1,
      //   response: (data, matches, output) => {
      //     output.responseOutputStrings = {
      //       bullTether: {
      //         en: "牛直线",
      //       },
      //       deathBullTether: {
      //         en: "牛直线",
      //       },
      //       warBullTether: {
      //         en: "牛直线",
      //       },
      //       minotaurTether: {
      //         en: "牛扇形",
      //       },
      //       famineMinotaurTether: {
      //         en: "牛扇形拉线",
      //       },
      //       warMinotaurTether: {
      //         en: "牛扇形",
      //       },
      //       warBirdTether: {
      //         en: "鸟冲直线",
      //       },
      //       noTether: {
      //         en: "中间引导扇形牛",
      //       },
      //       famineNoTether: {
      //         en: "无连线 引导双牛扇形",
      //       },
      //     };
      //     if (data.me === matches.target) {
      //       if (matches.id === "0006") {
      //         if (data.tetherCollectPhase === "death") return { infoText: output.deathBullTether() };
      //         if (data.tetherCollectPhase === "war") return { infoText: output.warBullTether() };
      //         return { infoText: output.bullTether() };
      //       }
      //       if (matches.id === "0001" || matches.id === "0039") {
      //         if (data.tetherCollectPhase === "famine") return { infoText: output.famineMinotaurTether() };
      //         if (data.tetherCollectPhase === "war") return { infoText: output.warMinotaurTether() };
      //         return { infoText: output.minotaurTether() };
      //       }
      //       if (matches.id === "0011") return { infoText: output.warBirdTether() };
      //     }
      //     if (!data.tetherCollect.includes(data.me)) {
      //       data.tetherCollect.push(data.me);
      //       if (!data.tetherCollectPhase) return { infoText: output.noTether() };
      //       if (data.tetherCollectPhase === "famine") return { alertText: output.famineNoTether() };
      //     }
      //   },
      // },
      // {
      //   id: "P7S Forbidden Fruit 4 and Harvest Stop Collection",
      //   netRegex: NetRegexes.tether({ id: ["0006", "0039"], capture: false }),
      //   delaySeconds: 0.2,
      //   suppressSeconds: 6,
      //   run: (data) => (data.stopTethers = true),
      // },
      // {
      //   id: "P7S Harvest Phase Tracker",
      //   netRegex: NetRegexes.startsUsing({ id: ["7A4F", "7A50", "7A51"] }),
      //   run: (data, matches) => {
      //     data.stopTethers = false;
      //     data.tetherCollect = [];
      //     switch (matches.id) {
      //       case "7A4F":
      //         data.tetherCollectPhase = "famine";
      //         break;
      //       case "7A50":
      //         data.tetherCollectPhase = "death";
      //         break;
      //       case "7A51":
      //         data.tetherCollectPhase = "war";
      //         break;
      //     }
      //   },
      // },
    ],
  });
  Object.assign(Options.PerTriggerOptions, {
    "P7S Spark of Life": { InfoText: "AOE + 出血" },
    "P7S Dispersed Aero II": { AlertText: "双T死刑" },
  });
}
