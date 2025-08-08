if (
  new URLSearchParams(location.search).get("alerts") !== "0" &&
  !/raidboss_timeline_only/.test(location.href)
) {
  const inEmulator = /(raidemulator|config)\.html/.test(location.href);
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const doQueueActions = (queue, notes) => {
    if (inEmulator)
      console.debug("邮差queue", notes, JSON.stringify(queue, null, 2));
    else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "DoQueueActions",
        p: JSON.stringify(queue),
      });
    }
  };
  Options.Triggers.push({
    id: "souma_mandragora_mark",
    zoneId: ZoneId.MatchAll,
    config: [
      {
        id: "蔓德拉标记",
        name: { en: "蔓德拉标记" },
        type: "select",
        options: {
          en: { "开(正常模式)": "开", 关: "关", "开(本地标点)": "本地" },
        },
        default: "本地",
      },
    ],
    triggers: [
      {
        id: "蔓德拉出现",
        type: "AddedCombatant",
        netRegex: {
          npcNameId: [
            2827, //洋葱王子
            2828, //茄子骑士
            2829, //蒜头明星
            2830, //番茄国王
            2831, //蔓德拉王后

            5090, //水城洋葱
            5091, //水城茄子
            5092, //水城蒜头
            5093, //水城番茄
            5094, //水城王后

            6847, //运河洋葱
            6848, //运河茄子
            6849, //运河蒜头
            6850, //运河番茄
            6851, //运河王后

            7604, //神殿洋葱
            7605, //神殿茄子
            7606, //神殿蒜头
            7607, //神殿番茄
            7608, //神殿王后

            8282, //研究所洋葱
            8283, //研究所茄子
            8284, //研究所蒜头
            8285, //研究所番茄
            8286, //研究所王后

            8684, //宝库洋葱
            8685, //宝库茄子
            8686, //宝库蒜头
            8687, //宝库番茄
            8688, //宝库王后

            9801, //神秘洋葱
            9802, //神秘茄子
            9803, //神秘蒜头
            9804, //神秘番茄
            9805, //神秘王后

            10686, //误入歧途的洋葱
            10687, //误入歧途的茄子
            10688, //误入歧途的蒜头
            10689, //误入歧途的番茄
            10690, //误入歧途的王后

            10835, //惊奇洋葱
            10836, //惊奇茄子
            10837, //惊奇蒜头
            10838, //惊奇番茄
            10839, //惊奇王后

            11606, //洋葱王子
            11607, //茄子骑士
            11608, //蒜头明星
            11609, //番茄国王
            11610, //蔓德拉王后

            12036, //育体洋葱
            12037, //育体茄子
            12038, //育体大蒜
            12039, //育体番茄
            12040, //育体王后

            13242, // Turali onion
            13243, // Turali eggplant
            13244, // Turali garlic
            13245, // Turali tomato
            13246, // Tuligora queen

            14016, // vault onion
            14017, // vault eggplant
            14018, // vault garlic
            14019, // vault tomato
            14020, // vault queen
          ],
          capture: true,
        },
        preRun: (data, matches) => {
          if (data.souma_mandragora === undefined) {
            data.souma_mandragora = [];
          }
          data.souma_mandragora.push(matches);
        },
        delaySeconds: 0.5,
        run: (data) => {
          if (data.souma_mandragora.length >= 5) {
            const arr = data.souma_mandragora
              .slice()
              .sort((a, b) => Number(a.npcNameId) - Number(b.npcNameId));
            if (["开", "本地"].includes(data.triggerSetConfig.蔓德拉标记)) {
              const local = data.triggerSetConfig.蔓德拉标记 === "本地";
              doQueueActions(
                arr.map((v, i) => ({
                  c: "mark",
                  p: JSON.stringify({
                    ActorID: Number.parseInt(v.id, 16),
                    MarkType: `attack${i + 1}`,
                    LocalOnly: local,
                  }),
                  d: local ? 0 : random(800, 3000),
                })),
                "souma_mandragora"
              );
            }
            data.souma_mandragora.length = 0;
          }
        },
      },
    ],
  });
}
