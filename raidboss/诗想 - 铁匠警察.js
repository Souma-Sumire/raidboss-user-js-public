if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const total = new Map();
  Options.Triggers.push({
    id: "Souma妖宫铁匠",
    zoneId: [1290, 1311, 1333],
    initData: () => {
      const t = Array.from(total.entries());
      if (t.length > 1) {
        const str = t
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => `${name}(${count}次)`)
          .join("，");
        doTextCommand(`/e 打铁统计：${str}`);
      }
      total.clear();
      return {};
    },
    triggers: [
      {
        id: "诗想 Souma 铁匠警察",
        type: "Ability",
        netRegex: {},
        run: (data, matches) => {
          const { type, source, flags, targetIndex, ownerName } = matches;
          const name = ownerName || source;
          if (/103$/.test(flags) && (type === "21" || (type === "22" && targetIndex === "0"))) {
            if (name === data.me) {
              callOverlayHandler({ call: "cactbotSay", text: "叮！" });
            }
            if (data.party.inParty(name)) {
              total.set(name, (total.get(name) || 0) + 1);
            }
          }
        },
      },
    ],
  });
  function doTextCommand(text) {
    if (/(raidemulator|config)\.html/.test(location.href)) {
      console.log("邮差command", text);
    } else {
      callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
    }
  }
}
