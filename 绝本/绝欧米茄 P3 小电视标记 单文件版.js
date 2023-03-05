Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  initData: () => {
    return { souma20230131小电视: [] };
  },
  triggers: [
    {
      id: "TOP Souma 7分15秒 探测式波动炮 20230129",
      type: "GainsEffect",
      netRegex: { effectId: ["D7C", "D7D"] },
      preRun: (data, matches) => data.souma20230131小电视.push(matches.targetId),
      infoText: "",
      run: (data, _matches, output) => {
        if (data.souma20230131小电视.length === 3 && output.标记() === "开") {
          data.party.partyIds_
            .filter((v) => !data.souma20230131小电视.includes(v))
            .map((v, i) => mark(v, "attack" + ++i, false));
          data.souma20230131小电视.map((v, i) => mark(v, "bind" + ++i, false));
        }
      },
      outputStrings: { 标记: { en: "开" } },
    },
  ],
});
function mark(actorHexID, markType, localOnly) {
  if (/(raidemulator|config)\.html/.test(location.href)) {
    console.log(JSON.stringify({ ActorID: parseInt(actorHexID, 16), MarkType: markType, LocalOnly: localOnly }));
  } else {
    callOverlayHandler({
      call: "PostNamazu",
      c: "mark",
      p: JSON.stringify({ ActorID: parseInt(actorHexID, 16), MarkType: markType, LocalOnly: localOnly }),
    });
  }
}
