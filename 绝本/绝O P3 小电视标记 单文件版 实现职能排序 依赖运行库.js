Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  initData: () => {
    return { soumaOversampledWaveConnonLoadingArr20230216: [] };
  },
  triggers: [
    {
      id: "TOP Souma P3 小电视 探测式波动炮标点 独立排序版 20230216",
      type: "GainsEffect",
      netRegex: { effectId: ["D7C", "D7D"] },
      preRun: (data, matches) => data.soumaOversampledWaveConnonLoadingArr20230216.push(matches.targetId),
      infoText: (data, _matches, output) => {
        if (data.soumaOversampledWaveConnonLoadingArr20230216.length === 3 && output.标记() === "是") {
          const arr = output.优先级().split("/");
          const local = output.仅本地() === "是";
          const queue = [];
          const sortFn = (a, b) =>
            arr.indexOf(data.soumaFL.getRpByHexId(data, a)) - arr.indexOf(data.soumaFL.getRpByHexId(data, b));
          data.party.partyIds_
            .filter((v) => !data.soumaOversampledWaveConnonLoadingArr20230216.includes(v))
            .sort(sortFn)
            .map((v, i) => {
              queue.push({
                c: "mark",
                p: JSON.stringify({
                  ActorID: v,
                  MarkType: `attack${++i}`,
                  LocalOnly: local,
                }),
              });
            });
          data.soumaOversampledWaveConnonLoadingArr20230216.sort(sortFn).map((v, i) => {
            queue.push({
              c: "mark",
              p: JSON.stringify({
                ActorID: v,
                MarkType: `bind${++i}`,
                LocalOnly: local,
              }),
            });
          });
          data.soumaFL.doQueueActions(
            [
              { c: "stop", p: "TOP Souma Public Queue Mark 20230216" },
              { c: "qid", p: "TOP Souma Public Queue Mark 20230216" },
              ...queue,
              ...data.soumaFL.getClearMarkQueue(local, 11000),
            ],
            "P3小电视20230216",
          );
        }
      },
      outputStrings: {
        优先级: { en: ["H1", "MT", "ST", "D1", "D2", "D3", "D4", "H2"].join("/") },
        标记: { en: "是" },
        仅本地: { en: "否" },
      },
    },
  ],
});
