if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const check = (effects, time) =>
    effects
      .map((e) =>
        e.Effects ? (e.Effects.Timer < time * 60 ? `${e.Name}食物即将消失（${Math.floor(e.Effects.Timer / 60)}分钟)` : undefined) : `${e.Name}没吃食物`,
      )
      .filter(Boolean)
      .join(",");

  Options.Triggers.push({
    zoneId: ZoneId.MatchAll,
    id: "souma_hunger_police",
    config: [
      { id: "hunger_police_enable", name: { en: "开启" }, type: "checkbox", default: true },
      { id: "hunger_police_time", name: { en: "报警阈值（分钟）" }, type: "string", default: "20" },
      { id: "hunger_police_countdown", name: { en: "倒计时触发" }, type: "checkbox", default: true },
      { id: "hunger_police_echo", name: { en: '"/e food"触发' }, type: "checkbox", default: true },
    ],
    triggers: [
      {
        id: "souma hunger police",
        regex:
          /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:距离战斗开始还有|Battle commencing in |戦闘開始まで)(?<cd>\d+)[^（]+（|^.{14} ChatLog 00:0038::(?<echo>food)$/i,
        condition: (data, matches) =>
          data.triggerSetConfig.hunger_police_enable ||
          (matches.cd && data.triggerSetConfig.hunger_police_countdown) ||
          (matches.echo && data.triggerSetConfig.hunger_police_echo),
        promise: async (data) => {
          const ids = data.party.partyIds_.length ? data.party.partyIds_.map((v) => parseInt(v, 16)) : undefined;
          const combatants = (await callOverlayHandler({ call: "getCombatants" })).combatants.filter((v) => {
            return ids ? ids.includes(v.ID) : v.Name === data.me;
          });
          const effects = combatants.map((v) => ({ Name: data.ShortName(v.Name), Effects: v.Effects?.filter((e) => e.BuffID === 48)?.[0] }));
          data.hunger_police_text = check(effects, Number(data.triggerSetConfig.hunger_police_time));
        },
        infoText: (data) => data.hunger_police_text,
        run: (data) => delete data.hunger_police_text,
        soundVolume: 0,
      },
    ],
  });
}
