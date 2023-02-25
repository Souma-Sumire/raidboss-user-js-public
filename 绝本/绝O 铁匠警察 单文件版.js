Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  triggers: [
    {
      id: "TOP Souma 铁匠警察",
      type: "Ability",
      regex: /^.{14} A\w+ 15:.{8}:(?<source>[^:]+):(?!0[78]:)(?<id>[^:]+):(?<ability>[^:]+):4.{7}:[^:]+:7:0:/,
      promise: async (_data, matches, output) => {
        const name =
          output.铁匠名字缩写() === "是" ? matches.source.replace(/^([A-Z])\w+ ([A-Z])\w+/, "$1.$2.") : matches.source;
        const channel = output.频道();
        const ability = matches.ability;
        if (output.使用API获得中文技能名但可能导致响应变慢() === "是") {
          fetch(`https://${output.api()}/action/${parseInt(matches.id, 16)}?columns=Name`)
            .then((v) => v.json())
            .then((v) => doTextCommand(output.文本({ channel, name, ability: v.Name })))
            .catch((_e) => doTextCommand(output.文本({ channel, name, ability })));
        } else doTextCommand(output.文本({ channel, name, ability }));
      },
      outputStrings: {
        文本: { en: "/${channel} 恭喜${name}打铁成功！（${ability}）<se.5>" },
        频道: { en: "p" },
        铁匠名字缩写: { en: "是" },
        使用API获得中文技能名但可能导致响应变慢: { en: "是" },
        api: { en: "cafemaker.wakingsands.com" },
      },
      infoText: "",
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
