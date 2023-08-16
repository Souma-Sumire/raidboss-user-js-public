if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const check = (effects, triggerSetConfig, channel = "e") => {
    const time = Number(triggerSetConfig.hunger_police_time);
    const add = triggerSetConfig.hunger_police_add;
    const result = effects
      .map((e) => {
        if (!e.Effects) {
          return triggerSetConfig.hunger_police_noFood.replace("${name}", e.Name).replace("${time}");
        }
        if (e.Effects.Timer < time * 60) {
          return triggerSetConfig.hunger_police_hasFood.replace("${name}", e.Name).replace("${time}", Math.floor(e.Effects.Timer / 60));
        }
      })
      .filter(Boolean);
    result.map((v) => {
      doTextCommand(`/${channel.trim()} ${v}`);
    });
    doTextCommand(result.length ? `/${channel.trim()} ${add}` : `/e ${triggerSetConfig.hunger_police_all_full}`);
    return result.join(",");
  };

  const doTextCommand = (text) =>
    /(raidemulator|config)\.html/.test(location.href)
      ? console.log("邮差command", text)
      : callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });

  Options.Triggers.push({
    zoneId: ZoneId.MatchAll,
    id: "souma_hunger_police",
    config: [
      { id: "hunger_police_countdown", name: { en: "触发条件：倒计时" }, type: "checkbox", default: true },
      {
        id: "hunger_police_echo",
        name: { en: '触发条件："/e food"' },
        type: "checkbox",
        default: true,
        comment: { cn: '如果用"/e food p"，则可以发到小队频道（小心使用）' },
      },
      { id: "hunger_police_time", name: { en: "报警阈值（分钟）" }, type: "string", default: "20" },
      { id: "hunger_police_hasFood", name: { en: "文本：还有" }, type: "string", default: "${name}食物仅剩${time分钟）" },
      { id: "hunger_police_noFood", name: { en: "文本：没吃" }, type: "string", default: "${name}没吃食物" },
      { id: "hunger_police_all_full", name: { en: "文本：都吃饱了" }, type: "string", default: "都吃饱了" },
      { id: "hunger_police_add", name: { en: "报警音" }, type: "string", default: "<se.1>" },
    ],
    triggers: [
      {
        id: "souma hunger police",
        regex:
          /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:距离战斗开始还有|Battle commencing in |戦闘開始まで)(?<cd>\d+)[^（]+（|^.{14} ChatLog 00:0038::(?<echo>food)\s*(?<p>[pe])?\s*$/i,
        condition: (data, matches) =>
          (matches.cd && data.triggerSetConfig.hunger_police_countdown) || (matches.echo && data.triggerSetConfig.hunger_police_echo),
        promise: async (data, matches) => {
          const combatants = (await callOverlayHandler({ call: "getCombatants" })).combatants;
          const ids = data.party.partyIds_.length ? data.party.partyIds_.map((v) => parseInt(v, 16)) : undefined;
          const effects = combatants
            .filter((v) => (ids ? ids.includes(v.ID) : v.Name === data.me))
            .map((v) => ({ Name: data.ShortName(v.Name), Effects: v.Effects?.find((e) => e.BuffID === 48) }));
          data.hunger_police_text = check(effects, data.triggerSetConfig, matches.p);
        },
        infoText: (data) => data.hunger_police_text,
        tts: null,
        run: (data) => delete data.hunger_police_text,
        soundVolume: 0,
      },
    ],
  });
}
