if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  console.log("一键DK倒数换装已加载");
  const isTrue = (str) => /^(?:放|1|是|真|开|对|确定|确认|肯定|恩|嗯)$/.test(str);
  Options.Triggers.push({
    zoneId: ZoneId.MatchAll,
    triggers: [
      {
        id: "Souma DK OK CD",
        regex:
          /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:距离战斗开始还有|Battle commencing in |戦闘開始まで)(?<cd>\d+)[^（]+（/i,
        infoText: "",
        condition: (data) => data.job === "DRK" && location.href.includes("raidboss.html"),
        run: (_data, matches, output) => {
          const cd = parseInt(matches.cd);
          const lang = output.客户端语言();
          const 嗜血 = { cn: "嗜血", ja: "ブラッドウェポン", en: "Blood Weapon" }[lang];
          const 血乱 = { cn: "血乱", ja: "ブラッドデリリアム", en: "Delirium" }[lang];
          const 黑盾 = { cn: "至黑之夜", ja: "The Blackest Night", en: "ブラックナイト" }[lang];
          const p = [];
          p.push({ c: "DoTextCommand", p: `/gs change ${output.压血套装()}`, d: (cd - 4) * 1000 });
          p.push({ c: "DoTextCommand", p: isTrue(output.开嗜血()) ? `/ac "${嗜血}"` : "", d: 500 });
          p.push({ c: "DoTextCommand", p: isTrue(output.开黑盾()) ? `/ac "${黑盾}"` : "", d: 1000 });
          p.push({ c: "DoTextCommand", p: `/gs change ${output.输出套装()}`, d: 500 });
          p.push({ c: "DoTextCommand", p: isTrue(output.开血乱()) ? `/ac "${血乱}"` : "", d: 1000 });
          callOverlayHandler({ call: "PostNamazu", c: "DoQueueActions", p: JSON.stringify(p) });
        },
        outputStrings: {
          客户端语言: { en: "cn" },
          压血套装: { en: "33" },
          输出套装: { en: "3" },
          开嗜血: { en: "是" },
          开血乱: { en: "否" },
          开黑盾: { en: "是" },
        },
      },
    ],
  });
}
