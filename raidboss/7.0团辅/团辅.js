if (
  new URLSearchParams(location.search).get("alerts") !== "0" &&
  !/raidboss_timeline_only/.test(location.href)
) {
  const raidbuffs = [
    ["5F55", { sound: "../../user/raidboss/Souma/团辅/sounds/奥秘环.mp3", volume: 0.5 }],
    ["905D", { sound: "../../user/raidboss/Souma/团辅/sounds/背刺.mp3", volume: 0.5 }],
    ["8C8", { sound: "../../user/raidboss/Souma/团辅/sounds/背刺.mp3", volume: 0.5 }],
    ["1D60", { sound: "../../user/raidboss/Souma/团辅/sounds/鼓励.mp3", volume: 0.5 }],
    ["3F41", { sound: "../../user/raidboss/Souma/团辅/sounds/技巧舞步.mp3", volume: 0.5 }],
    ["3F42", { sound: "../../user/raidboss/Souma/团辅/sounds/技巧舞步.mp3", volume: 0.5 }],
    ["3F43", { sound: "../../user/raidboss/Souma/团辅/sounds/技巧舞步.mp3", volume: 0.5 }],
    ["3F44", { sound: "../../user/raidboss/Souma/团辅/sounds/技巧舞步.mp3", volume: 0.5 }],
    ["1D0C", { sound: "../../user/raidboss/Souma/团辅/sounds/连环计.mp3", volume: 0.5 }],
    ["64C9", { sound: "../../user/raidboss/Souma/团辅/sounds/灵护.mp3", volume: 0.5 }],
    ["650C", { sound: "../../user/raidboss/Souma/团辅/sounds/跑快快.mp3", volume: 0.5 }],
    ["1CE4", { sound: "../../user/raidboss/Souma/团辅/sounds/义结金兰.mp3", volume: 0.5 }],
    ["40A8", { sound: "../../user/raidboss/Souma/团辅/sounds/占卜.mp3", volume: 0.5 }],
    ["DE5", { sound: "../../user/raidboss/Souma/团辅/sounds/战斗连祷.mp3", volume: 0.5 }],
    ["76", { sound: "../../user/raidboss/Souma/团辅/sounds/战斗之声.mp3", volume: 0.5 }],
    ["8773", { sound: "../../user/raidboss/Souma/团辅/sounds/星空构想.mp3", volume: 0.5 }],
    ["64B9", { sound: "../../user/raidboss/Souma/团辅/sounds/光明神的最终乐章.mp3", volume: 0.5 }],
  ];

  Options.Triggers.push({
    id: "SoumaRaidbuffs",
    zoneId: ZoneId.MatchAll,
    triggers: raidbuffs.map(([id, { sound, volume }]) => ({
      id: `Souma Raidbuffs ${id}`,
      type: "Ability",
      netRegex: { id, capture: true },
      condition: (data, matches) => matches.source === data.me || data.party.partyNames.includes(matches.source),
      suppressSeconds: 1,
      sound,
      soundVolume: volume,
    }))
  });
}