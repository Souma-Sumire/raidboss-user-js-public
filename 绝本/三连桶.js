// const isWS = !!new URLSearchParams(new URL(window.location).search).get("OVERLAY_WS");
const jobConvert = {
  "PLD": 19,
  "骑": 19,
  "骑士": 19,
  "MNK": 20,
  "僧": 20,
  "武僧": 20,
  "WAR": 21,
  "战": 21,
  "战士": 21,
  "DRG": 22,
  "龙": 22,
  "龙骑": 22,
  "龙骑士": 22,
  "BRD": 23,
  "诗": 23,
  "诗人": 23,
  "吟游诗人": 23,
  "WHM": 24,
  "白": 24,
  "白魔": 24,
  "白魔法师": 24,
  "BLM": 25,
  "黑": 25,
  "黑魔": 25,
  "黑魔法师": 25,
  "SMN": 27,
  "召": 27,
  "召唤": 27,
  "召唤师": 27,
  "SCH": 28,
  "学": 28,
  "学者": 28,
  "NIN": 30,
  "忍": 30,
  "忍者": 30,
  "MCH": 31,
  "机": 31,
  "机工": 31,
  "机工士": 31,
  "DK": 32,
  "DRK": 32,
  "暗": 32,
  "暗骑": 32,
  "暗黑骑士": 32,
  "AST": 33,
  "占": 33,
  "占星": 33,
  "占星术士": 33,
  "SAM": 34,
  "侍": 34,
  "武": 34,
  "武士": 34,
  "RDM": 35,
  "赤": 35,
  "赤魔": 35,
  "赤魔法师": 35,
  "GNB": 37,
  "绝": 37,
  "枪": 37,
  "绝枪": 37,
  "绝枪战士": 37,
  "DNC": 38,
  "舞": 38,
  "舞者": 38,
  "RPR": 39,
  "镰": 39,
  "镰刀": 39,
  "钐镰": 39,
  "钐镰客": 39,
  "钐镰师": 39,
  "SGE": 40,
  "贤": 40,
  "贤者": 40,
};
function mark(actorID, markType) {
  // if (isWS) return;
  try {
    callOverlayHandler({
      call: "PostNamazu",
      c: "mark",
      p: JSON.stringify({ ActorID: actorID, MarkType: markType }),
    });
  } catch {}
}
Options.Triggers.push({
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  triggers: [
    {
      id: "UWU Titan Gaols",
      netRegex: NetRegexes.ability({ id: ["2B6C", "2B6B"] }),
      preRun: (data, matches) => (data.titanGaols ??= []).push(matches.target),
    },
    {
      id: "三连桶",
      netRegex: NetRegexes.ability({ id: ["2B6C", "2B6B"] }),
      preRun: (data, matches, output) => {
        (data.titanGaolsMark ??= []).push({
          id: matches.targetId,
          name: matches.target,
          job: data.party.details.find((detail) => detail.id === matches.targetId)?.job,
        });
        if (data.titanGaolsMark?.length === 3) {
          const sortRule = output.sortRule().split(/[\|:;,.\/\\]/);
          for (const key in sortRule) sortRule[key] = jobConvert[sortRule[key].toUpperCase()] ?? sortRule[key];
          data.titanGaolsMark.sort((a, b) => sortRule.indexOf(a.job) - sortRule.indexOf(b.job));
        }
      },
      infoText: (data, _matches, output) => {
        if ((output.enable() === "true" || output.enable() === "开") && data.titanGaolsMark?.length === 3) {
          mark(parseInt(data.titanGaolsMark[0].id, 16), "attack1");
          mark(parseInt(data.titanGaolsMark[1].id, 16), "attack2");
          mark(parseInt(data.titanGaolsMark[2].id, 16), "attack3");
          return output.text({
            n1: data.ShortName(data.titanGaolsMark[0].name),
            n2: data.ShortName(data.titanGaolsMark[1].name),
            n3: data.ShortName(data.titanGaolsMark[2].name),
          });
        }
      },
      alertText: (data, _matches, output) => {
        if (data.titanGaolsMark?.length === 3) {
          const idx = data.titanGaolsMark.findIndex((value) => value.name === data.me) + 1;
          return idx > 0 ? output.markYou({ num: idx }) : null;
        }
      },
      tts: (data, _matches, output) => {
        if (data.titanGaolsMark?.length === 3) {
          const idx = data.titanGaolsMark.findIndex((value) => value.name === data.me) + 1;
          return idx > 0 ? output.markYou({ num: idx }) : null;
        }
      },
      soundVolume: 0,
      run: (data) => {
        if (data.titanGaolsMark?.length === 3) {
          delete data.titanGaolsMark;
        }
      },
      outputStrings: {
        enable: { en: "true", cn: "开" },
        markYou: { en: "${num}", cn: "${num}桶" },
        text: {
          en: "${n1}, ${n2}, ${n3}",
          cn: "1:${n1} 2:${n2} 3:${n3}",
        },
        sortRule: {
          en: "MNK/DRG/NIN/SAM/RPR/BRD/MCH/DNC/BLM/SMN/RDM/GNB/DRK/WAR/PLD/SGE/AST/WHM/SCH",
          cn: "僧/龙/忍/武/镰/诗/机/舞/黑/召/赤/枪/暗/战/骑/贤/占/白/学",
        },
      },
    },
    {
      id: "爆破岩石回收",
      netRegex: NetRegexes.ability({ id: ["2B6C", "2B6B"], capture: false }),
      delaySeconds: 15,
      run: (data) => delete data.titanGaolsMark,
    },
  ],
});
