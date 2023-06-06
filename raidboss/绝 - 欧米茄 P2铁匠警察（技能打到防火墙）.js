Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  id: "souma_top_blacksmith_police",
  config: [
    { id: "铁匠警察", name: { en: "开启" }, type: "checkbox", default: true },
    {
      id: "铁匠聊天频道",
      name: { en: "聊天频道" },
      type: "select",
      options: { en: { 小队: "p", 默语: "e" } },
      default: "e",
    },
    { id: "名字缩写", name: { en: "名字使用缩写(国服无效)" }, type: "checkbox", default: true },
    { id: "使用API", name: { en: "使用API获得中文技能名(国服请关闭API)" }, type: "checkbox", default: true },
    {
      id: "铁匠API",
      name: { en: "API(国服请关闭API)" },
      type: "select",
      options: { en: { XIVAPI: "xivapi.com", cafemaker: "cafemaker.wakingsands.com" } },
      default: "cafemaker.wakingsands.com",
    },
  ],
  triggers: [
    {
      id: "TOP Souma 铁匠警察",
      type: "Ability",
      regex: /^.{14} A\w+ 15:.{8}:(?<source>[^:]+):(?!0[78]:)(?<id>[^:]+):(?<ability>[^:]+):4.{7}:[^:]+:7\d*:0:/,
      condition: (data) => data.triggerSetConfig.铁匠警察,
      promise: async (data, matches, output) => {
        const name = data.triggerSetConfig.名字缩写 ? matches.source.replace(/^([A-Z])\w+ ([A-Z])\w+/, "$1.$2.") : matches.source;
        const channel = data.triggerSetConfig.铁匠聊天频道;
        const ability = matches.ability;
        if (data.triggerSetConfig.使用API) {
          fetch(`https://${data.triggerSetConfig.铁匠API}/action/${parseInt(matches.id, 16)}?columns=Name`)
            .then((v) => v.json())
            .then((v) => doTextCommand("/ " + channel + output.text({ name, ability: v.Name })))
            .catch((_e) => doTextCommand("/ " + channel + output.text({ name, ability })));
        } else doTextCommand("/ " + channel + output.text({ name, ability }));
      },
      outputStrings: {
        text: { en: "恭喜${name}打铁成功！（${ability}）<se.5>" },
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
