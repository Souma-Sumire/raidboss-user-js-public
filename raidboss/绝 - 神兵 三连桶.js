if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const defaultPriority = 'MT/ST/D1/D2/D3/D4/H2/H1';
  const { getRpByName, mark } = Util.souma;
  Options.Triggers.push({
    id: "Souma_TheWeaponsRefrainUltimate",
    zoneId: ZoneId.TheWeaponsRefrainUltimate,
    config: [
      { id: "UWU_Titan_Gaols_Sort", name: { en: "机制优先级" }, type: "string", default: defaultPriority },
      { id: "UWU_Titan_Gaols_Mark", name: { en: "头顶标点" }, type: "checkbox", default: false },
    ],
    triggers: [
      {
        id: "UWU Titan Gaols",
        type: "Ability",
        netRegex: { id: ["2B6C", "2B6B"] },
        preRun: (data, matches) => {
          data.titanGaols ??= [];
          data.titanGaols.push({ name: matches.target, id: matches.targetId, rp: getRpByName(data, matches.target) });
          if (data.titanGaols.length === 3) {
            const sortRule = (data.triggerSetConfig.UWU_Titan_Gaols_Sort || defaultPriority).split(/[,\/ ]/);
            data.titanGaols.sort((a, b) => sortRule.indexOf(a.rp) - sortRule.indexOf(b.rp));
          }
        },
        response: (data, _matches, output) => {
          if (data.titanGaols?.length !== 3) return;
          const idx = data.titanGaols.findIndex((v) => v.name === data.me);
          if (idx < 0)
            return {
              infoText: output.text({
                player1: data.titanGaols[0].rp,
                player2: data.titanGaols[1].rp,
                player3: data.titanGaols[2].rp,
              }),
            };
          return { alertText: output.num({ num: idx + 1 }) };
        },
        run: (data, _matches, _output) => {
          if (data.titanGaols?.length === 3) {
            if (data.triggerSetConfig.UWU_Titan_Gaols_Mark) {
              mark(parseInt(data.titanGaols[0].id, 16), "attack1");
              mark(parseInt(data.titanGaols[1].id, 16), "attack2");
              mark(parseInt(data.titanGaols[2].id, 16), "attack3");
            }
          }
        },
        outputStrings: { num: { en: "${num}桶" }, text: { en: "${player1} / ${player2} / ${player3}" } },
      },
      {
        id: "UWU Titan Bomb Failure",
        type: "Ability",
        netRegex: { id: "2B6A" },
        alarmText: (data, matches, output) => {
          if (data.titanGaols?.length < 3) return;
          if (!data.titanGaols?.find((v) => v.name === matches.target)) return;
          // if (matches.target === data.me) return;
          const num = data.titanGaols.findIndex((v) => v.name === matches.target) + 1;
          return output.text({ num });
        },
        outputStrings: { text: { en: "补${num}桶" } },
      },
      {
        id: "UWU Gaol Cleanup",
        type: "Ability",
        netRegex: { id: ["2B6C", "2B6B"], capture: false },
        delaySeconds: 15,
        run: (data) => delete data.titanGaols,
      },
    ],
  });
}
