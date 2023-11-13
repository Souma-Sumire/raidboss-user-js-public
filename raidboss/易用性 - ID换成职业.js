const jobEnumTojobName = {
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
const allJobEnums = Object.keys(jobEnumTojobName).map((v) => Number(v).toString(16));
let _data;
Options.PlayerNicks = new Proxy(Options.PlayerNicks, {
  get: (target, prop) => {
    if (typeof prop === "symbol" || prop === "toJSON") {
      return target[prop];
    }
    const job = target[prop] === undefined && prop === _data?.me ? Util.jobToJobEnum(_data?.job) : _data?.party?.details?.find((v) => v.name === prop)?.job;
    if (!job) {
      return prop;
    }
    const res = jobEnumTojobName[job] ?? prop;
    return _data.party.details.some((v) => v.name !== prop && v.job === job) ? `${res}（${prop}）` : res;
  },
});
Options.Triggers.push({
  id: "SoumaGeneralPlayerToJob",
  zoneId: ZoneId.MatchAll,
  triggers: [
    {
      id: "Souma Id2Job AddedCombatant",
      type: "AddedCombatant",
      netRegex: { job: allJobEnums },
      preRun: (data) => (_data = data),
      run: (data, matches, _output) => {
        const target = data.party.details.find((v) => v.name === matches.name);
        if (target) {
          target.job = Number(matches.job);
        }
      },
    },
  ],
});
