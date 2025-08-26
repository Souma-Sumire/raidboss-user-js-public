if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const { doTextCommand } = Util.souma;
  const unimportantStatus = [
    { id: "4B9", en: "Arm's Length", ja: "アームズレングス", cn: "亲疏自行" },
    { id: "A0", en: "Surecast", ja: "堅実魔", cn: "沉稳咏唱" },
    { id: "362", en: "The Warden's Paean", ja: "時神のピーアン", cn: "光阴神的礼赞凯歌" },
    { id: "9B", en: "Freecure", ja: "ケアルラ効果アップ", cn: "救疗效果提高" },
    { id: "32F", en: "Enhanced Benefic II", ja: "ベネフィラ効果アップ", cn: "福星效果提高" },
    { id: "4D4", en: "Enhanced Enpi", ja: "燕飛効果アップ", cn: "燕飞效果提高" },
    { id: "B1D", en: "Enhanced Harpe", ja: "ハルパー効果アップ", cn: "勾刃效果提高" },
    { id: "A98", en: "Expedience", ja: "疾風の計", cn: "疾风之计" },
    { id: "32", en: "Sprint", ja: "スプリント", cn: "冲刺" },
    { id: "A89", en: "Improvised Finish", ja: "インプロビゼーション・フィニッシュ", cn: "即兴表演结束" },
    { id: "A30", en: "Differential Diagnosis", ja: "エウクラシア・ディアグノシス[強]", cn: "齐衡诊断" },
    { id: "77E", en: "Catalyze", ja: "激励", cn: "激励" },
    { id: "57", en: "Thrill of Battle", ja: "スリル・オブ・バトル", cn: "战栗" },
    { id: "A96", en: "Protraction", ja: "生命回生法", cn: "生命回生法" },
    { id: "A87", en: "Improvisation", ja: "インプロビゼーション：効果", cn: "享受即兴表演" },
    { id: "A3D", en: "Autophysis", ja: "ピュシスII[被]", cn: "催进" },
    { id: "66", en: "Mantra", ja: "マントラ", cn: "真言" },
    { id: "4B2", en: "Nature's Minne", ja: "地神のミンネ", cn: "大地神的抒情恋歌" },
    { id: "A3E", en: "Krasis", ja: "クラーシス", cn: "混合" },
    { id: "13D", en: "Fey Illumination", ja: "フェイイルミネーション", cn: "异想的幻光" },
    { id: "A26", en: "Crest of Time Returned", ja: "活性のクレスト", cn: "活性纹" },
    { id: "49C", en: "Earth's Reply", ja: "金剛の決意", cn: "金刚决意" },
    { id: "83C", en: "Shake It Off (Over Time)", ja: "シェイクオフ[被]", cn: "持续摆脱" },
    { id: "A90", en: "Rekindle", ja: "再生の炎", cn: "苏生之炎" },
    { id: "A91", en: "Undying Flame", ja: "再生の炎：効果", cn: "苏生之炎" },
    { id: "77D", en: "Seraphic Veil", ja: "セラフィックヴェール", cn: "炽天的幕帘" },
    { id: "76A", en: "Brutal Shell", ja: "ブルータルシェル", cn: "残暴弹" },
    { id: "C1A", en: "Consolation", ja: "コンソレイション", cn: "慰藉" },
    { id: "74C", en: "Everlasting Flight", ja: "不死鳥の翼", cn: "不死鸟之翼" },
    { id: "A74", en: "Knight's Benediction", ja: "ナイトの加護", cn: "骑士的加护" },
  ];
  const unimportantStatusKeys = unimportantStatus.map((v) => v.id);
  Object.freeze(unimportantStatus);
  Object.freeze(unimportantStatusKeys);
  const unbuffs = (buffNames, echo) => {
    if (echo) doTextCommand(`/e 已帮你点掉${buffNames.length}个buff：${buffNames.join(", ")}`);
    buffNames.map((v) => {
      doTextCommand(`/statusoff "${v}"`);
    });
  };
  Options.Triggers.push({
    // zoneId: ZoneId.TheOmegaProtocolUltimate,
    zoneId: ZoneId.MatchAll,
    id: "souma_top_unbuff",
    config: [
      { id: "automaticClearUpBuffSwitch", name: { en: "启用自动点buff" }, type: "checkbox", default: true },
      {
        id: "automaticClearUpBuffClientLanguage",
        name: { en: "客户端Action语言" },
        type: "select",
        options: { en: { "简体中文（国服/国际服汉化）": "cn", "英语（国际服E端）": "en", "日语（国际服J端）": "ja" } },
        default: "cn",
      },
      { id: "automaticClearUpBuffTriggerQuantity", name: { en: "到达多少个状态时清理已有buff（可能无法统计部队buff）" }, type: "string", default: "26" },
      { id: "automaticClearUpBuffMacheteQuantity", name: { en: "最多一次允许点掉几个buff" }, type: "string", default: "2" },
      { id: "automaticClearUpBuffSendEchoMessage", name: { en: "点掉的时候发默语宏提示" }, type: "checkbox", default: true },
    ],
    initData: () => {
      return { soumaAutoUnBuff: { effects: new Set() } };
    },
    triggers: [
      {
        id: "Souma Unbuff Gains Effect",
        type: "GainsEffect",
        netRegex: {},
        condition: (data, matches) => data.triggerSetConfig.automaticClearUpBuffSwitch && matches.target === data.me,
        preRun: (data, matches) => data.soumaAutoUnBuff.effects.add(matches.effectId),
      },
      {
        id: "Souma Unbuff Gains Effect Action",
        type: "GainsEffect",
        netRegex: {},
        condition: (data, matches) => data.triggerSetConfig.automaticClearUpBuffSwitch && matches.target === data.me,
        delaySeconds: 0.1,
        suppressSeconds: 0.1,
        run: (data) => {
          const triggerQuantity = parseInt(data.triggerSetConfig.automaticClearUpBuffTriggerQuantity);
          if (data.soumaAutoUnBuff.effects.size >= triggerQuantity) {
            const macheteQuantity = parseInt(data.triggerSetConfig.automaticClearUpBuffMacheteQuantity);
            const effects = [...data.soumaAutoUnBuff.effects];
            const offStatus = unimportantStatusKeys.filter((v) => effects.includes(v)).slice(0, macheteQuantity);
            const quest = offStatus.map((v) => unimportantStatus.find((s) => s.id === v)[data.triggerSetConfig.automaticClearUpBuffClientLanguage]);
            if (quest.length) unbuffs(quest, data.triggerSetConfig.automaticClearUpBuffSendEchoMessage);
          }
        },
      },
      {
        id: "Souma Unbuff Loses Effect",
        type: "LosesEffect",
        netRegex: {},
        condition: Conditions.targetIsYou(),
        preRun: (data, matches) => {
          data.soumaAutoUnBuff.effects.delete(matches.effectId);
        },
      },
    ],
  });
}
