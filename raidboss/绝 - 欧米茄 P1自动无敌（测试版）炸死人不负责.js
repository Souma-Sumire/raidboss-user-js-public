if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  Options.Triggers.push({
    zoneId: ZoneId.TheOmegaProtocolUltimate,
    id: "Souma_TheOmegaProtocolUltimate_P1自动无敌",
    initData: () => {
      return { autoHolmgang: true };
    },
    config: [{ id: "P1自动无敌", name: { en: "开启" }, type: "checkbox", default: true }],
    triggers: [
      {
        id: "TOP Souma P1自动无敌",
        type: "HeadMarker",
        netRegex: { capture: false },
        suppressSeconds: 1000,
        condition: (data) => data.autoHolmgang && ["WAR", "DRK", "PLD", "GNB"].includes(data.job),
        run: (data, matches) => {
          if (data.triggerSetConfig.P1自动无敌) {
            let queue;
            if (data.job === "WAR") queue = { skillName: "死斗", delay: 4100 }; // 不知道4100够不
            else if (data.job === "DRK") queue = { skillName: "行尸走肉", delay: 0 }; //他一定够
            else if (data.job === "GNB") queue = { skillName: "超火流星", delay: 4100 }; //不知道4100够不
            else if (data.job === "PLD") queue = { skillName: "神圣领域", delay: 4000 }; //不知道4000够不
            callOverlayHandler({
              call: "PostNamazu",
              c: "DoQueueActions",
              p: JSON.stringify([
                { c: "command", p: `/ac ${queue.skillName}`, d: queue.delay },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
                { c: "command", p: `/ac ${queue.skillName}`, d: 50 },
              ]),
            });
          }
          data.autoHolmgang = false;
        },
      },
    ],
  });
}
