Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  triggers: [
    {
      id: "P5S Venom Squall/Surge",
      netRegex: NetRegexes.startsUsing({ id: "771[67]" }),
      durationSeconds: 15,
      alertText: (_data, matches, output) => {
        const spread = output.spread();
        const healerGroups = output.healerGroups();
        if (matches.id === "7716") return output.text({ dir1: spread, dir2: healerGroups });
        return output.text({ dir1: healerGroups, dir2: spread });
      },
      outputStrings: {
        healerGroups: { en: "治疗分摊组" },
        spread: { en: "散开" },
        text: {
          en: "${dir1} -> 放圈 -> ${dir2}",
        },
      },
    },
  ],
  // timelineReplace: [
  //   {
  //     "locale": "cn",
  //     "missingTranslations": true,
  //     "replaceSync": {
  //       "Lively Bait": "[^:]+",
  //       "Proto-Carbuncle": "[^:]+",
  //     },
  //     "replaceText": {
  //       "--towers--": "--踩塔--",
  //       "Acidic Slaver": "强酸唾液",
  //       "Claw to Tail": "爪尾连击",
  //       "Devour": "捕食",
  //       "Double Rush": "双重冲撞",
  //       "Impact": "塌方",
  //       "Raging Claw": "狂怒爪击",
  //       "Raging Tail": "狂怒扫尾",
  //       "Ruby Glow": "红宝石之光",
  //       "Ruby Reflection": "红宝石反射",
  //       "Scatterbait": "撒饵",
  //       "Searing Ray": "灼热射线",
  //       "Sonic Howl": "音嚎",
  //       "Sonic Shatter": "音速破碎",
  //       "Spit": "吐出",
  //       "Starving Stampede": "饥饿暴动",
  //       "Tail to Claw": "尾爪连击",
  //       "Topaz Cluster": "黄宝石晶簇",
  //       "Topaz Ray": "黄宝石射线",
  //       "Topaz Stones": "黄宝石飞石",
  //       "Toxic Crunch": "猛毒啮咬",
  //       "Venom(?!( |ous))": "毒液",
  //       "Venom Drops": "猛毒坠落",
  //       "Venom Pool": "猛毒喷溅",
  //       "Venom Rain": "猛毒之雨",
  //       "Venom Squall": "猛毒风暴",
  //       "Venom Surge": "猛毒喷涌",
  //       "Venomous Mass": "猛毒聚集",
  //     },
  //   },
  // ],
});
Object.assign(Options.PerTriggerOptions, {
  "P5S Raging Claw Move": { InfoText: "去前面" },
  "P5S Raging Tail Move": { InfoText: "去背后" },
});
