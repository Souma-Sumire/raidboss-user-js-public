Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  initData: () => {
    return { souma加农炮20230131: [] };
  },
  triggers: [
    {
      id: "TOP Souma Sniper Cannon Fodder 20230131",
      type: "GainsEffect",
      netRegex: { effectId: "D61" },
      preRun: (data, matches) => data.souma加农炮20230131.push({ id: matches.targetId, effect: "spread" }),
    },
    {
      id: "TOP Souma High-Powered Sniper Cannon Fodder Collect 20230131",
      type: "GainsEffect",
      netRegex: { effectId: "D62" },
      preRun: (data, matches) => data.souma加农炮20230131.push({ id: matches.targetId, effect: "stack" }),
    },
    {
      id: "TOP Souma High-Powered Sniper Cannon Fodder 20230131",
      type: "GainsEffect",
      netRegex: { effectId: "D62", capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: "",
      run: (data, _matches, output) => {
        if (output.标记() === "开") {
          const spreads = data.souma加农炮20230131.filter((v) => v.effect === "spread").map((v) => v.id);
          const stacks = data.souma加农炮20230131.filter((v) => v.effect === "stack").map((v) => v.id);
          const unmarkedStack = data.party.partyIds_.filter((v) => ![...spreads, ...stacks].includes(v));
          spreads.map((v, i) => mark(v, "attack" + ++i, false));
          stacks.map((v, i) => mark(v, "bind" + ++i, false));
          unmarkedStack.map((v, i) => mark(v, "stop" + ++i, false));
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
