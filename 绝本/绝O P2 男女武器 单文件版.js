// 依赖CactbotSelf.dll

Options.Triggers.push({
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  initData: () => {
    return {
      soumaP2BossMF20230204: [],
      soumaP2BossMFAction20230204: [null, null],
    };
  },
  triggers: [
    { id: "TOP Party Synergy", type: "Ability", netRegex: { id: "" }, disabled: true },
    {
      id: "TOP Souma P2二运狗男女1 20230204",
      regex: /\] ChatLog 00:0:106:(?<sourceID>[^:]*):[^:]*:0031:.{4}:.{4}0031:/,
      preRun: (data, matches) => data.soumaP2BossMF20230204.push(parseInt(matches.sourceID, 16)),
    },
    {
      id: "TOP Souma P2二运狗男女2 20230204",
      type: "Ability",
      netRegex: { id: "7B3E", capture: false },
      delaySeconds: 5.5,
      promise: async (data) => {
        const bosses = (await callOverlayHandler({ call: "getCombatants" })).combatants.filter((v) =>
          data.soumaP2BossMF20230204.includes(v.ID),
        );
        data.soumaP2BossMFAction20230204 = [
          Number(!!bosses.find((v) => v.BNpcID === 15714)),
          Number(!!bosses.find((v) => v.BNpcID === 15715)),
        ];
      },
      alertText: (data, _matches, output) => {
        return output[`M${data.soumaP2BossMFAction20230204[0]}F${data.soumaP2BossMFAction20230204[1]}`]();
      },
      outputStrings: {
        M0F0: { en: "远离男女（钢铁十字）" },
        M1F0: { en: "男的两边（月环十字）" },
        M0F1: { en: "靠近女的（钢铁辣翅）" },
        M1F1: { en: "靠近男的（月环辣翅）" },
      },
    },
  ],
});
