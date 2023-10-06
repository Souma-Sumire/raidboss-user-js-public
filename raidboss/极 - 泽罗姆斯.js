// 从主库偷的 然后小改了一下 非原创
const headmarkerMap = {
  tankbuster: "016C",
  blackHole: "014A",
  spread: "0017",
  enums: "00D3",
  stack: "003E",
};
const firstHeadmarker = parseInt(headmarkerMap.tankbuster, 16);
const getHeadmarkerId = (data, matches) => {
  if (typeof data.decOffset === "undefined") data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, "0");
};
const centerX = 100;
const centerY = 100;
const xyTo16DirNum = (x, y, centerX, centerY) => {
  // N = 0, NNE = 1, ..., NNW = 15
  x = x - centerX;
  y = y - centerY;
  return Math.round(8 - (8 * Math.atan2(x, y)) / Math.PI) % 16;
};
Options.Triggers.push({
  id: "SoumaTheAbyssalFractureExtreme",
  zoneId: ZoneId.TheAbyssalFractureExtreme,
  initData: () => {
    return {
      miasmicBlasts: [],
    };
  },
  triggers: [
    {
      id: "ZeromusEx Headmarker Tracker",
      type: "HeadMarker",
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    {
      id: "ZeromusEx Visceral Whirl NE Safe",
      type: "StartsUsing",
      netRegex: { id: "8B43", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.ne(), dir2: output.sw() });
      },
      outputStrings: {
        text: {
          en: "${dir1}/${dir2}",
          de: "${dir1}/${dir2}",
        },
        ne: Outputs.northeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: "ZeromusEx Visceral Whirl NW Safe",
      type: "StartsUsing",
      netRegex: { id: "8B46", capture: false },
      infoText: (_data, _matches, output) => {
        return output.text({ dir1: output.nw(), dir2: output.se() });
      },
      outputStrings: {
        text: {
          en: "${dir1}/${dir2}",
          de: "${dir1}/${dir2}",
        },
        nw: Outputs.northwest,
        se: Outputs.southeast,
      },
    },
    {
      id: "ZeromusEx Fractured Eventide NE Safe",
      type: "StartsUsing",
      netRegex: { id: "8B3C", capture: false },
      alertText: (_data, _matches, output) => output.ne(),
      outputStrings: {
        ne: Outputs.northeast,
      },
    },
    {
      id: "ZeromusEx Fractured Eventide NW Safe",
      type: "StartsUsing",
      netRegex: { id: "8B3D", capture: false },
      alertText: (_data, _matches, output) => output.nw(),
      outputStrings: {
        nw: Outputs.northwest,
      },
    },
    {
      id: "ZeromusEx Black Hole Headmarker",
      type: "HeadMarker",
      netRegex: {},
      condition: (data) => data.role === "tank",
      suppressSeconds: 20,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkerMap.blackHole) return output.blackHole();
      },
      outputStrings: {
        blackHole: {
          en: "Black Hole on YOU",
          de: "Schwarzes Loch auf DIR",
          cn: "黑洞点名",
        },
      },
    },
    {
      id: "ZeromusEx Spread Headmarker",
      type: "HeadMarker",
      netRegex: { capture: true },
      condition: (data, matches) => data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.spread,
      suppressSeconds: 2,
      response: Responses.spread(),
    },
    {
      id: "ZeromusEx Enum Headmarker",
      type: "HeadMarker",
      netRegex: { capture: true },
      condition: (data, matches) => data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.enums,
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.enumeration(),
      outputStrings: {
        enumeration: {
          en: "Enumeration",
          de: "Enumeration",
          fr: "Énumération",
          ja: "エアーバンプ",
          cn: "蓝圈分摊",
          ko: "2인 장판",
        },
      },
    },
    {
      id: "ZeromusEx Stack Headmarker",
      type: "HeadMarker",
      netRegex: { capture: true },
      condition: (data, matches) => data.decOffset !== undefined && getHeadmarkerId(data, matches) === headmarkerMap.stack,
      response: Responses.stackMarkerOn(),
    },
    {
      id: "ZeromusEx Miasmic Blasts Reset",
      type: "StartsUsing",
      // reset Blasts combatant data when the preceding Visceral Whirl is used
      netRegex: { id: "8B4[36]", source: "Zeromus", capture: false },
      run: (data) => (data.miasmicBlasts = []),
    },
    {
      id: "ZeromusEx Miasmic Blast Safe Spots",
      type: "StartsUsing",
      netRegex: { id: "8B49", capture: true },
      delaySeconds: 0.5,
      promise: async (data, matches) => {
        const combatants = (
          await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.sourceId, 16)],
          })
        ).combatants;
        if (combatants.length !== 1) return;
        const combatant = combatants[0];
        if (combatant === undefined) return;
        data.miasmicBlasts.push(combatant);
      },
      alertText: (data, _matches, output) => {
        if (data.miasmicBlasts.length !== 3) {
          return;
        }
        // Blasts can spawn center, on cardinals (+/-14 from center), or on intercards (+/-7 from center).
        // Unsafe spots vary for each of the 9 possible spawn points, but are always the same *relative* to that type.
        // So apply a fixed set of modifiers based on type, regardless of spawn point, to eliminate unsafe spots.
        const cardinal16Dirs = [0, 4, 8, 12];
        const intercard16Dirs = [2, 6, 10, 14];
        const unsafe16DirModifiers = {
          cardinal: [-1, 0, 1, 4, 5, 11, 12],
          intercard: [-2, 0, 2, 3, 8, 13],
        };
        let possibleSafeSpots = Directions.output16Dir;
        for (const blast of data.miasmicBlasts) {
          // special case for center - don't need to find relative dirs, just remove all intercards
          if (Math.round(blast.PosX) === 100 && Math.round(blast.PosY) === 100)
            intercard16Dirs.forEach((intercard) => (possibleSafeSpots = possibleSafeSpots.filter((dir) => dir !== Directions.output16Dir[intercard])));
          else {
            const blastPos16Dir = xyTo16DirNum(blast.PosX, blast.PosY, centerX, centerY);
            const relativeUnsafeDirs = cardinal16Dirs.includes(blastPos16Dir) ? unsafe16DirModifiers.cardinal : unsafe16DirModifiers.intercard;
            for (const relativeUnsafeDir of relativeUnsafeDirs) {
              const actualUnsafeDir = (16 + blastPos16Dir + relativeUnsafeDir) % 16;
              possibleSafeSpots = possibleSafeSpots.filter((dir) => dir !== Directions.output16Dir[actualUnsafeDir]);
            }
          }
        }
        if (possibleSafeSpots.length !== 2) return output.avoidUnknown();
        const sortArr = [
          "dirWNW",
          "dirNW",
          "dirNNW",
          "dirN",
          "dirNNE",
          "dirNE",
          "dirENE",
          "dirE",
          "dirESE",
          "dirSE",
          "dirSSE",
          "dirS",
          "dirSSW",
          "dirSW",
          "dirWSW",
          "dirW",
        ];
        const [safeDir1] = possibleSafeSpots.sort((a, b) => sortArr.indexOf(a) - sortArr.indexOf(b));
        if (safeDir1 === undefined) return output.avoidUnknown();
        return output.combo({ dir1: output[safeDir1]() });
      },
      outputStrings: {
        combo: {
          en: "${dir1}",
        },
        avoidUnknown: {
          en: "Avoid Line Cleaves",
          cn: "躲避射线",
        },
        dirN: Outputs.dirN,
        dirNNE: {
          en: "NNE",
          de: "NNO",
          fr: "NNE",
          ja: "北北東(1時)",
          cn: "上偏右(B点)",
          ko: "1시",
        },
        dirNE: {
          en: "NE",
          de: "NO",
          fr: "NE",
          ja: "北東",
          cn: "右上(2点)",
          ko: "북동",
        },
        dirENE: {
          en: "ENE",
          de: "ONO",
          fr: "ENE",
          ja: "東北東(2時)",
          cn: "右偏上(3点)",
          ko: "2시",
        },
        dirE: Outputs.dirE,
        dirESE: Outputs.dirESE,
        dirSE: Outputs.dirSE,
        dirSSE: Outputs.dirSSE,
        dirS: Outputs.dirS,
        dirSSW: Outputs.dirSSW,
        dirSW: Outputs.dirSW,
        dirWSW: Outputs.dirWSW,
        dirW: Outputs.dirW,
        dirWNW: {
          en: "WNW",
          de: "WNW",
          fr: "ONO",
          ja: "西北西(10時)",
          cn: "左偏上(4点)",
          ko: "10시",
        },
        dirNW: {
          en: "NW",
          de: "NW",
          fr: "NO",
          ja: "北西",
          cn: "左上(1点)",
          ko: "북서",
        },
        dirNNW: {
          en: "NNW",
          de: "NNW",
          fr: "NNO",
          ja: "北北西(11時)",
          cn: "上偏左(A点)",
          ko: "11시",
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: "ZeromusEx Acceleration Bomb",
      type: "GainsEffect",
      netRegex: { effectId: "A61" },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      response: Responses.stopEverything(),
    },
  ],
  timelineReplace: [
    {
      locale: "en",
      replaceText: {
        "Branding Flare/Sparking Flare": "Branding/Sparking Flare",
      },
    },
    {
      locale: "de",
      replaceSync: {
        "Comet": "Komet",
        "Toxic Bubble": "Giftblase",
        "Zeromus": "Zeromus",
      },
      replaceText: {
        "Abyssal Echoes": "Abyssal-Echos",
        "Abyssal Nox": "Abyssal-Nox",
        "Akh Rhai": "Akh Rhai",
        "Big Bang": "Großer Knall",
        "Big Crunch": "Großer Quetscher",
        "Black Hole": "Schwarzes Loch",
        "Branding Flare": "Flare-Brand",
        "Burst": "Kosmos-Splitter",
        "Bury": "Impakt",
        "Chasmic Nails": "Abyssal-Nagel",
        "Dark Matter": "Dunkelmaterie",
        "Dimensional Surge": "Dimensionsschwall",
        "Explosion": "Explosion",
        "(?<! )Flare": "Flare",
        "Flow of the Abyss": "Abyssaler Strom",
        "Forked Lightning": "Gabelblitz",
        "Fractured Eventide": "Abendglut",
        "Meteor Impact": "Meteoreinschlag",
        "Miasmic Blast": "Miasma-Detonation",
        "Nostalgia": "Heimweh",
        "Primal Roar": "Lautes Gebrüll",
        "Prominence Spine": "Ossale Protuberanz",
        "Rend the Rift": "Dimensionsstörung",
        "Sable Thread": "Pechschwarzer Pfad",
        "Sparking Flare": "Flare-Funken",
        "Umbral Prism": "Umbrales Prisma",
        "Umbral Rays": "Pfad der Dunkelheit",
        "Visceral Whirl": "Viszerale Schürfwunden",
        "Void Bio": "Nichts-Bio",
        "Void Meteor": "Nichts-Meteo",
        "the Dark Beckons": "Fressende Finsternis: Last",
        "the Dark Binds": "Fressende Finsternis: Kette",
        "the Dark Divides": "Fressende Finsternis: Zerschmetterung",
      },
    },
    {
      locale: "fr",
      replaceSync: {
        "Comet": "comète",
        "Toxic Bubble": "bulle empoisonnée",
        "Zeromus": "Zeromus",
      },
      replaceText: {
        "Abyssal Echoes": "Écho abyssal",
        "Abyssal Nox": "Nox abyssal",
        "Akh Rhai": "Akh Rhai",
        "Big Bang": "Big bang",
        "Big Crunch": "Big crunch",
        "Black Hole": "Trou noir",
        "Branding Flare": "Marque de brasier",
        "Burst": "Éclatement",
        "Bury": "Impact",
        "Chasmic Nails": "Clous abyssaux",
        "Dark Matter": "Matière sombre",
        "Dimensional Surge": "Déferlante dimensionnelle",
        "Explosion": "Explosion",
        "(?<! )Flare": "Brasier",
        "Flow of the Abyss": "Flot abyssal",
        "Forked Lightning": "Éclair ramifié",
        "Fractured Eventide": "Éclat crépusculaire",
        "Meteor Impact": "Impact de météore",
        "Miasmic Blast": "Explosion miasmatique",
        "Nostalgia": "Nostalgie",
        "Primal Roar": "Rugissement furieux",
        "Prominence Spine": "Évidence ossuaire",
        "Rend the Rift": "Déchirure dimensionnelle",
        "Sable Thread": "Rayon sombre",
        "Sparking Flare": "Étincelle de brasier",
        "Umbral Prism": "Déluge de Ténèbres",
        "Umbral Rays": "Voie de ténèbres",
        "Visceral Whirl": "Écorchure viscérale",
        "Void Bio": "Bactéries du néant",
        "Void Meteor": "Météores du néant",
        "the Dark Beckons": "Ténèbres rongeuses : Gravité",
        "the Dark Binds": "Ténèbres rongeuses : Chaînes",
        "the Dark Divides": "Ténèbres rongeuses : Pulvérisation",
      },
    },
    {
      locale: "ja",
      replaceSync: {
        "Comet": "コメット",
        "Toxic Bubble": "ポイズナスバブル",
        "Zeromus": "ゼロムス",
      },
      replaceText: {
        "Abyssal Echoes": "アビサルエコー",
        "Abyssal Nox": "アビサルノックス",
        "Akh Rhai": "アク・ラーイ",
        "Big Bang": "ビッグバーン",
        "Big Crunch": "ビッグクランチ",
        "Black Hole": "ブラックホール",
        "Branding Flare": "フレアブランド",
        "Burst": "飛散",
        "Bury": "衝撃",
        "Chasmic Nails": "アビサルネイル",
        "Dark Matter": "ダークマター",
        "Dimensional Surge": "ディメンションサージ",
        "Explosion": "爆発",
        "(?<! )Flare": "フレア",
        "Flow of the Abyss": "アビサルフロウ",
        "Forked Lightning": "フォークライトニング",
        "Fractured Eventide": "黒竜閃",
        "Meteor Impact": "メテオインパクト",
        "Miasmic Blast": "瘴気爆発",
        "Nostalgia": "望郷",
        "Primal Roar": "大咆哮",
        "Prominence Spine": "プロミネンススパイン",
        "Rend the Rift": "次元干渉",
        "Sable Thread": "漆黒の熱線",
        "Sparking Flare": "フレアスパーク",
        "Umbral Prism": "闇の重波動",
        "Umbral Rays": "闇の波動",
        "Visceral Whirl": "ヴィセラルワール",
        "Void Bio": "ヴォイド・バイオ",
        "Void Meteor": "ヴォイド・メテオ",
        "the Dark Beckons": "闇の侵食：重",
        "the Dark Binds": "闇の侵食：鎖",
        "the Dark Divides": "闇の侵食：砕",
      },
    },
    {
      locale: "cn",
      missingTranslations: true,
      replaceSync: {
        "Comet": "[^:]+",
        "Toxic Bubble": "[^:]+",
        "Zeromus": "[^:]+",
      },
      replaceText: {
        "Abyssal Echoes": "深渊之韵",
        "Abyssal Nox": "深渊之夜",
        "Akh Rhai": "天光轮回",
        "Big Bang": "大爆炸",
        "Big Crunch": "大坍缩",
        "Black Hole": "黑洞",
        "Branding Flare": "核爆烙印",
        "Burst": "飞散",
        "Bury": "塌方",
        "Chasmic Nails": "深渊之爪",
        "Dark Matter": "暗物质",
        "Dimensional Surge": "维度涌动",
        "Explosion": "爆炸",
        "(?<! )Flare": "核爆",
        "Flow of the Abyss": "深渊之流",
        "Forked Lightning": "叉形闪电",
        "Fractured Eventide": "黑龙闪",
        "Meteor Impact": "陨石冲击",
        "Miasmic Blast": "瘴气爆发",
        "Nostalgia": "望乡",
        "Primal Roar": "大咆哮",
        "Prominence Spine": "突出脊柱",
        "Rend the Rift": "次元干涉",
        "Sable Thread": "漆黑射线",
        "Sparking Flare": "核爆火花",
        "Umbral Prism": "暗之重波",
        "Umbral Rays": "暗之波动",
        "Visceral Whirl": "脏腑之旋",
        "Void Bio": "虚空毒菌",
        "Void Meteor": "虚空陨石",
        "the Dark Beckons": "黑暗侵蚀：吸引",
        "the Dark Binds": "黑暗侵蚀：锁链",
        "the Dark Divides": "黑暗侵蚀：分离",
      },
    },
  ],
});
