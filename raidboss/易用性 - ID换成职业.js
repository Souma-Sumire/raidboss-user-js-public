const job2CN = new Map([
  [1, "剑术"],
  [2, "格斗"],
  [3, "斧术"],
  [4, "枪术"],
  [5, "弓箭"],
  [6, "幻术"],
  [7, "咒术"],
  [19, "骑士"],
  [20, "武僧"],
  [21, "战士"],
  [22, "龙骑"],
  [23, "诗人"],
  [24, "白魔"],
  [25, "黑魔"],
  [26, "秘术"],
  [27, "召唤"],
  [28, "学者"],
  [29, "双剑"],
  [30, "忍者"],
  [31, "机工"],
  [32, "暗骑"],
  [33, "占星"],
  [34, "武士"],
  [35, "赤魔"],
  [36, "青魔"],
  [37, "绝枪"],
  [38, "舞者"],
  [39, "钐镰"],
  [40, "贤者"],
]);
let isInit = false;
let party;
Options.PlayerNicks = new Proxy(Options.PlayerNicks, {
  get: (target, prop) => {
    if (prop === "toJSON") return target[prop];
    const job = party.details.find((v) => v.name === prop)?.job;
    const res = job2CN.get(job) ?? prop;
    return party.details.some((v) => v.name !== prop && v.job === job) ? `${res}（${prop}）` : res;
  },
});
Options.Triggers.push({
  id: "SoumaId2Job",
  zoneId: ZoneId.MatchAll,
  initData: () => {
    isInit = false;
    return {};
  },
  triggers: [
    {
      id: "Souma Id2Job Trigger",
      netRegex: NetRegexes.startsUsing({ capture: false }),
      condition: () => !isInit,
      run: (data) => {
        isInit = true;
        party = data.party;
      },
    },
  ],
});
