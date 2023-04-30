const jobToCN = {
  1: "剑术",
  2: "格斗",
  3: "斧术",
  4: "枪术",
  5: "弓箭",
  6: "幻术",
  7: "咒术",
  19: "骑士",
  20: "武僧",
  21: "战士",
  22: "龙骑",
  23: "诗人",
  24: "白魔",
  25: "黑魔",
  26: "秘术",
  27: "召唤",
  28: "学者",
  29: "双剑",
  30: "忍者",
  31: "机工",
  32: "暗骑",
  33: "占星",
  34: "武士",
  35: "赤魔",
  36: "青魔",
  37: "绝枪",
  38: "舞者",
  39: "钐镰",
  40: "贤者",
};
addOverlayListener("PartyChanged", (e) => {
  for (const key in Options.PlayerNicks) delete Options.PlayerNicks[key];
  e.party.forEach((pm) => {
    const convertJob = jobToCN[pm.job] ?? pm.name;
    Options.PlayerNicks[pm.name] = e.party.some((p) => p.name !== pm.name && p.job === pm.job)
      ? `${convertJob}（${pm.name}）`
      : convertJob;
  });
});
