if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const doTextCommand = (text) =>
    /(raidemulator|config)\.html/.test(location.href)
      ? console.log("邮差command", text)
      : callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
  const RAIDBUFFS = {
    "8D": { name: "战斗之声", duration: 15000 },
    "AA2": { name: "光明神的最终乐章", duration: 15000 },
    "A27": { name: "神秘环", duration: 20000 },
    "312": { name: "战斗连祷", duration: 15000 },
    "776": { name: "巨龙右眼", duration: 20000 },
    "5AE": { name: "巨龙左眼", duration: 20000 },
    "49E": { name: "义结金兰：斗气", duration: 15000 },
    "4A1": { name: "义结金兰：攻击", duration: 15000 },
    "A8F": { name: "灼热之光", duration: 30000 },
    "511": { name: "鼓励", duration: 20000 },
    "71E": { name: "技巧舞步结束", duration: 20000 },
    "721": { name: "进攻之探戈", duration: 20000 },
    "756": { name: "占卜", duration: 15000 },
    "75A": { name: "太阳神之衡", duration: 15000 },
    "75C": { name: "放浪神之箭", duration: 15000 },
    "75D": { name: "战争神之枪", duration: 15000 },
    "75B": { name: "世界树之干", duration: 15000 },
    "75E": { name: "河流神之瓶", duration: 15000 },
    "75F": { name: "建筑神之塔", duration: 15000 },
  };
  Options.Triggers.push({
    id: "SoumaFindTheSb",
    zoneId: ZoneId.MatchAll,
    zoneLabel: {
      en: "发现那个点掉团辅的傻逼",
    },
    initData: () => {
      return {
        findTheSbCombatantData: [],
        findTheSbRaidbuffs: {},
      };
    },
    triggers: [
      {
        id: "Who Is Sb Gains",
        type: "GainsEffect",
        netRegex: {
          effectId: Object.keys(RAIDBUFFS),
          capture: true,
        },
        condition: (_data, matches) => matches.targetId.startsWith("1"),
        run: (data, matches) => {
          const r = RAIDBUFFS[matches.effectId];
          const time = new Date(matches.timestamp).getTime();
          (data.findTheSbRaidbuffs[matches.targetId] ??= {})[matches.effectId] = {
            obtainingTime: time,
            expirationTime: time + r.duration,
            source: matches.source,
          };
        },
      },
      {
        id: "Who Is Sb Loses",
        type: "LosesEffect",
        netRegex: {
          effectId: Object.keys(RAIDBUFFS),
          capture: true,
        },
        condition: (data, matches) => {
          if (!matches.targetId.startsWith("1")) {
            return false;
          }
          const buff = data.findTheSbRaidbuffs[matches.targetId]?.[matches.effectId];
          if (!buff) {
            // 理应不可能进入这里
            // 但实际上会进来 可能是gains的时候距离过远？
            console.error("buff not found:", matches.effectId, matches.targetId);
            return false;
          }
          const expirationTime = buff.expirationTime - buff.obtainingTime;
          const losesTime = new Date(matches.timestamp).getTime() - buff.obtainingTime;
          // 故意不删除过期buff，属性留着下面还有用，虽然会有一些内存占用，但团灭之后就重置了，胡萝卜鸡。
          // Reflect.deleteProperty(data.findTheSbRaidbuffs[matches.targetId!]!, matches.effectId);
          if (losesTime < expirationTime * 0.7) {
            return true;
          }
          return false;
        },
        promise: async (data, matches) => {
          data.findTheSbCombatantData = [];
          data.findTheSbCombatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [parseInt(matches.targetId, 16)],
            })
          ).combatants;
        },
        run: (data, matches) => {
          const targetData = data.findTheSbCombatantData[0];
          const buff = data.findTheSbRaidbuffs[matches.targetId]?.[matches.effectId];
          if (!buff) {
            // 理应不可能进入这里
            console.error(`${matches.effectId} not found in raidbuffs`, buff);
            return;
          }
          if (!targetData) {
            // 理应不可能进入这里
            console.error(`${matches.targetId} not found in combatantData`);
            return;
          }
          // 排除死人
          if (targetData.CurrentHP > 0) {
            const { name: buffName } = RAIDBUFFS[matches.effectId];
            const losesTime = new Date(matches.timestamp).getTime() - buff.obtainingTime;
            if (losesTime > 0) {
              const text = `${matches.target}的${buffName}仅存在了${(losesTime / 1000).toFixed(1)}秒就消失了。`;
              doTextCommand(`/e ${text} <se.1>`);
            }
          }
        },
      },
    ],
  });
}
