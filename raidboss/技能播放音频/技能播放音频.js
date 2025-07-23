const abilities = [
  "以太变移",
  "神速咏唱",
  "节制",
  "苦难之心",
  "狂喜之心",
  // "闪灼",
  "安慰之心",
  // "天赐祝福",
  // "天辉",
  "即刻咏唱",
  "无中生有",
  "神祝祷",
  "神名",
  "法令",
  "康复",
  "复活",
  "水流幕",
  // "全大赦",
  "再生",
];

const soundVolume = 1;

Options.Triggers.push({
  id: "souma_ability_sound",
  zoneId: ZoneId.MatchAll,
  triggers: abilities.map((ability) => {
    return {
      id: `ability_${ability}_sound`,
      type: "Ability",
      netRegex: NetRegexes.ability({ ability }),
      condition: (data, matches) => matches.source === data.me,
      suppressSeconds: 1,
      sound: `../../user/raidboss/技能播放音频/音频文件/${ability}.mp3`,
      soundVolume: soundVolume,
    };
  }),
});
