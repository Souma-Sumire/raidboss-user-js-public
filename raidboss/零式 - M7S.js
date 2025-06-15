console.log("已加载M7S");
const isMeleeOrTank = (x) => Util.isMeleeDpsJob(x) || Util.isTankJob(x);
Options.Triggers.push({
  id: "SoumaAacCruiserweightM3Savage",
  zoneId: 1261,
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaWeapon: undefined,
      souma冰花Counter: 0,
      soumaP3转移Counter: 0,
      soumaPhase: "P1",
    };
  },
  triggers: [
    { id: "R7S Brutal Impact", disabled: true },
    { id: "R7S Stoneringer", disabled: true },
    { id: "R7S Smash Here/There", disabled: true },
    { id: "R7S Sinister Seeds", disabled: true },
    { id: "R7S Impact", disabled: true },
    { id: "R7S Quarry Swamp", disabled: true },
    { id: "R7S Explosion", disabled: true },
    { id: "R7S Pulp Smash", disabled: true },
    { id: "R7S Neo Bombarian Special", disabled: true },
    { id: "R7S Brutish Swing", disabled: true },
    { id: "R7S Glower Power", disabled: true },
    { id: "R7S Revenge of the Vines", disabled: true },
    { id: "R7S Thorny Deathmatch", disabled: true },
    { id: "R7S Abominable Blink", disabled: true },
    { id: "R7S Demolition Deathmatch", disabled: true },
    { id: "R7S Strange Seeds", disabled: true },
    { id: "R7S Tendrils of Terror", disabled: true },
    { id: "R7S Killer Seeds", disabled: true },
    { id: "R7S Powerslam", disabled: true },
    { id: "R7S Stoneringer 2: Stoneringers", disabled: true },
    { id: "R7S Lashing Lariat", disabled: true },
    { id: "R7S Slaminator", disabled: true },
    { id: "R7S Debris Deathmatch", disabled: true },
    {
      id: "R7S Souma 粉碎冲击",
      type: "StartsUsing",
      netRegex: { id: "A55B", capture: false },
      response: Responses.aoe(),
    },
    {
      id: "R7S Souma 荆棘世界",
      type: "StartsUsing",
      netRegex: { id: "A587", capture: false },
      response: Responses.aoe(),
    },
    {
      id: "R7S Souma 石武",
      type: "StartsUsing",
      // A55D P1棒
      // A55E P1刀
      // A57F P2棒
      // A580 P2刀
      netRegex: { id: ["A57F", "A580", "A55D", "A55E"] },
      infoText: (_data, matches, output) => {
        return output[matches.id]();
      },
      run: (data, matches) =>
        (data.soumaWeapon = ["A55D", "A57F"].includes(matches.id)
          ? "棒"
          : "刀"),
      outputStrings: {
        A55D: { en: "稍后钢铁" },
        A55E: { en: "稍后月环" },
        A57F: { en: "稍后钢铁" },
        A580: { en: "稍后月环" },
      },
    },
    {
      id: "R7S Souma 远近",
      type: "StartsUsing",
      // A560 远
      // A55F 近
      netRegex: { id: ["A55F", "A560"] },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          刀坦克远: { en: "月环 => 坦克远离" },
          刀坦克近: { en: "月环 => 坦克靠近" },
          刀人群远: { en: "月环 => 人群靠近" },
          刀人群近: { en: "月环 => 人群远离" },
          棒坦克远: { en: "钢铁 => 坦克远离" },
          棒坦克近: { en: "钢铁 => 坦克靠近" },
          棒人群远: { en: "钢铁 => 人群靠近" },
          棒人群近: { en: "钢铁 => 人群远离" },
        };
        const weapon = data.soumaWeapon;
        const buster = matches.id === "A560" ? "远" : "近";
        return {
          [data.role === "tank" ? "alertText" : "infoText"]:
            output[
              `${weapon}${data.role === "tank" ? "坦克" : "人群"}${buster}`
            ](),
        };
      },
    },
    {
      id: "R7S Souma 转移",
      type: "StartsUsing",
      // A592 开场：北跳到东
      // A593 ？
      // 不管了自己看往哪跳
      netRegex: { id: "A59[23]", capture: false },
      alertText: (data, _matches, output) => {
        const weapon = data.soumaWeapon;
        return output[`${weapon}`]();
      },
      outputStrings: {
        刀: { en: "转移+月环" },
        棒: { en: "转移+钢铁" },
      },
    },
    {
      id: "R7S Souma 怒视",
      type: "StartsUsing",
      netRegex: { id: "A94[CA]", capture: false },
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "两侧+分散" },
      },
    },
    {
      id: "R7S Souma 打断",
      type: "StartsUsing",
      netRegex: { id: "A90D" },
      suppressSeconds: 1,
      response: Responses.interruptIfPossible(),
    },
    {
      id: "R7S Souma 石化波动",
      type: "StartsUsing",
      netRegex: { id: "A575", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "躲石化" },
      },
    },
    {
      id: "R7S Souma 分摊",
      type: "StartsUsing",
      netRegex: { id: "A577", capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "分摊 准备八方" } },
    },
    {
      id: "R7S Souma 分摊2",
      type: "StartsUsing",
      netRegex: { id: "A577", capture: false },
      delaySeconds: 4.5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "八方分散" } },
    },
    {
      id: "R7S Souma 最新式",
      type: "StartsUsing",
      netRegex: { id: "A57C", capture: false },
      countdownSeconds: 7.7,
      infoText: (data, _matches, output) => {
        data.soumaPhase = "P2";
        return output.text();
      },
      outputStrings: {
        text: "场地北边击退",
      },
    },
    {
      id: "R7S Souma 孢囊",
      type: "StartsUsing",
      netRegex: { id: "A569", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "召小怪" },
      },
    },
    {
      id: "R7S Souma 转场",
      type: "StartsUsing",
      netRegex: { id: "A59E", capture: false },
      infoText: (data, _matches, output) => {
        data.soumaPhase = "P3";
        return output.text();
      },
      outputStrings: {
        text: { en: "AoE" },
      },
    },
    {
      id: "R7S Souma 小怪安全区",
      type: "MapEffect",
      // P1 0D 11 远左上右下 内左下右上 P3 1D?21
      // P1 05 09 远左下右上 内左上右下 P3 15 19
      netRegex: {
        flags: "00020001",
        location: ["0D", "11", "05", "09", "1D", "21", "15", "19"],
      },
      suppressSeconds: 10,
      infoText: (data, matches, output) =>
        output[
          `${["0D", "11", "1D", "21"].includes(matches.location) ? "a" : "b"}${
            isMeleeOrTank(data.job) ? "Melee" : "Caster"
          }`
        ](),
      outputStrings: {
        aMelee: { en: "左下↙右上↗" },
        bMelee: { en: "左上↖右下↘" },
        aCaster: { en: "左上↖右下↘" },
        bCaster: { en: "左下↙右上↗" },
      },
    },
    {
      id: "R7S Souma 粉圈",
      type: "HeadMarker",
      netRegex: { id: "0177" },
      condition: (data, matches) => matches.target === data.me,
      alarmText: (_data, _atches, output) => output.text(),
      outputStrings: { text: { en: "放冰花" } },
    },
    {
      id: "R7S Souma P2冰花",
      type: "HeadMarker",
      netRegex: { id: "01D2" },
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        data.souma冰花Counter++;
        if (data.souma冰花Counter >= 5 || data.soumaPhase !== "P2") {
          return;
        }
        const num = data.souma冰花Counter;
        return output[data.souma冰花Counter % 2 === 1 ? "out" : "in"]({ num });
      },
      outputStrings: {
        out: "${num}外",
        in: "${num}内",
      },
    },
    {
      id: "R7S Souma 孢子云",
      type: "StartsUsing",
      netRegex: { id: "A58A", capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "三穿一" } },
    },
    {
      id: "R7S Souma 二二分摊",
      type: "HeadMarker",
      netRegex: { id: "005D", capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: "与搭档分摊+放冰花" } },
    },
    {
      id: "R7S Souma 转移2",
      type: "StartsUsing",
      // A5A0 左手刀右手大棒  A5A3大棒回转
      // A5A0 左手刀右手大棒  A5A5刀回转
      // A5A1 左手大棒右手刀  A5A3大棒回转
      // A5A1 左手大棒右手刀  A5A5刀回转
      netRegex: { id: "A5A[35]" },
      alertText: (data, matches, output) => {
        data.soumaP3转移Counter++;
        const weapon = matches.id === "A5A3" ? "棒" : "刀";
        return output[
          `${weapon}${data.soumaP3转移Counter === 1 ? "1" : "2"}`
        ]();
      },
      outputStrings: {
        刀1: { en: "转移+月环 => AoE" },
        刀2: { en: "转移+月环" },
        棒1: { en: "转移+钢铁 => AoE" },
        棒2: { en: "转移+钢铁" },
      },
    },
    {
      id: "R7S Souma 常春藤碎颈臂",
      type: "StartsUsing",
      // A5A7 BOSS打右手，面向BOSS玩家去右边
      // A5A9 BOSS打左手，面向BOSS玩家去左边
      netRegex: { id: "A5A[79]" },
      alarmText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        A5A7: { en: "右 =>" },
        A5A9: { en: "<= 左" },
      },
    },
    {
      id: "R7S Souma 野蛮俯冲",
      type: "StartsUsing",
      netRegex: { id: "A5AD" },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tank: { en: "踩塔" },
          healer: { en: "塔" },
          dps: { en: "塔" },
        };
        return {
          [data.role === "tank" ? "alarmText" : "infoText"]:
            output[data.role](),
        };
      },
    },
    {
      id: "R7S Souma 荆棘死斗围墙",
      type: "StartsUsing",
      netRegex: { id: "A5B0", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      infoText: (data, _matches, output) => {
        if (isMeleeOrTank(data.job)) {
          return output.melee();
        }
        return output.caster();
      },
      outputStrings: {
        caster: { en: "场边接线" },
        melee: { en: "场中准备" },
      },
    },
    {
      id: "R7S Souma 散播种子",
      type: "StartsUsing",
      netRegex: { id: "A56D", capture: false },
      condition: (data) => data.soumaPhase === "P3",
      infoText: (data, _matches, output) => {
        if (isMeleeOrTank(data.job)) {
          return output.melee();
        }
        return output.caster();
      },
      outputStrings: {
        caster: { en: "场边接线" },
        melee: { en: "近战集合" },
      },
    },
    {
      id: "R7S Souma 爆裂种子",
      type: "StartsUsing",
      netRegex: { id: "A90A" },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "斜冰花加钢铁月环" },
      },
    },
    {
      id: "R7S Souma P3冰花",
      type: "HeadMarker",
      netRegex: { id: "01D2" },
      condition: (data, matches) =>
        matches.target === data.me && data.soumaPhase === "P3",
      alarmText: (_data, _atches, output) => output.text(),
      outputStrings: { text: { en: "斜点放冰花" } },
    },
    {
      id: "R7S Souma 究极超豪华野蛮大乱击",
      type: "StartsUsing",
      netRegex: { id: "A5B1" },
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: "狂暴" },
      },
    },
  ],
});
