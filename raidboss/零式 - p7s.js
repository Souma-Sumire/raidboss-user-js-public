if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const { mark, loop, clearMark } = Util.souma;
  Options.Triggers.push({
    zoneId: ZoneId.AbyssosTheSeventhCircleSavage,
    initData: () => {
      return {
        soumaCustomMethods: { loop: loop() },
      };
    },
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
    ],
  });
}
