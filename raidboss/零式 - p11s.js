if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const firstMarker = parseInt("", 16);
  const headmarkers = {};
  const getHeadmarkerId = (data, matches) => {
    if (data.souma.decOffset === undefined) data.souma.decOffset = parseInt(matches.id, 16) - firstMarker;
    return (parseInt(matches.id, 16) - data.souma.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const startsUsingStrings = {};
  const {
    getRpByName,
    doTextCommand,
    doQueueActions,
    doQueueActionsDebug,
    sortMatchesBy,
    sortMatchesByFill,
    getClearMarkQueue,
    orientation4,
    deepClone,
    mark,
  } = Util.souma;
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheEleventhCircleSavage",
    zoneId: ZoneId.AnabaseiosTheEleventhCircleSavage,
    config: [],
    initData: () => {
      if (!location.href.includes("raidemulator.html")) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P11S Souma Public Queue .*" },
            // { c: "DoWaymarks", p: "load", d: 3000 },
            { c: "DoTextCommand", p: "/mk off <1>", d: 3000 },
            { c: "DoTextCommand", p: "/mk off <2>" },
            { c: "DoTextCommand", p: "/mk off <3>" },
            { c: "DoTextCommand", p: "/mk off <4>" },
            { c: "DoTextCommand", p: "/mk off <5>" },
            { c: "DoTextCommand", p: "/mk off <6>" },
            { c: "DoTextCommand", p: "/mk off <7>" },
            { c: "DoTextCommand", p: "/mk off <8>" },
          ]),
        });
      }
      return {
        souma: {
          decOffset: undefined,
          phase: 1,
        },
      };
    },
    triggers: [
      {
        id: "P11S Souma Headmarker Tracker",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => data.souma.decOffset === undefined,
        run: (data, matches) => getHeadmarkerId(data, matches),
      },
      {
        id: "P11S Souma エウノミアー",
        type: "StartsUsing",
        netRegex: { id: "822B", capture: true },
        response: Responses.bigAoe(),
      },
      {
        id: "P11S Souma 连线",
        type: "Tether",
        netRegex: { id: "00F9", capture: true },
        condition: Conditions.targetIsYou(),
        alertText: (data, _, output) => output.text(),
        outputStrings: { text: { en: "连线" } },
      },
      {
        id: "P11S Souma 死刑",
        type: "StartsUsing",
        netRegex: { id: "822D" },
        response: Responses.tankBuster(),
      },
      {
        id: "P11S Souma 连线光",
        type: "StartsUsing",
        netRegex: { id: "87D3" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "集合 => 外4人分摊" },
        },
      },
      {
        id: "P11S Souma 连线暗",
        type: "StartsUsing",
        netRegex: { id: "87D4" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "外 => 内X字分摊" },
        },
      },
      {
        id: "P11S Souma 普通光",
        type: "StartsUsing",
        netRegex: { id: "81E6" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "外八方散开 => 内4人分摊" },
        },
      },
      {
        id: "P11S Souma 普通暗",
        type: "StartsUsing",
        netRegex: { id: "81E7" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "八方散开 + 小月环2人分摊" },
        },
      },
      {
        id: "P11S Souma 不知道什么光",
        type: "StartsUsing",
        netRegex: { id: "81EC" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "两侧(大) => 4人分摊" },
        },
      },
      {
        id: "P11S Souma 不知道什么暗",
        type: "StartsUsing",
        netRegex: { id: "81ED" },
        alertText: (data, _, output) => output.text(),
        durationSeconds: 12,
        outputStrings: {
          text: { en: "两侧 => 内X字分摊" },
        },
      },
      {
        id: "P11S Souma 塔器Q光",
        type: "StartsUsing",
        netRegex: { id: "87B3" },
        durationSeconds: 12,
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "两侧(大) => 4人分摊" },
        },
      },
      {
        id: "P11S Souma 塔器Q暗",
        type: "StartsUsing",
        netRegex: { id: "87B4" },
        durationSeconds: 12,
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "两侧(大) => 内X字分摊" },
        },
      },
      {
        id: "P11S Souma 魔法阵光",
        type: "StartsUsing",
        netRegex: { id: "820D" },
        infoText: (data, _, output) => (data.souma.phase === 1 ? output.text() : output.text2()),
        durationSeconds: 6,
        outputStrings: {
          text: { en: "找光门" },
          text2: { en: "找暗门" },
        },
      },
      {
        id: "P11S Souma 魔法阵暗",
        type: "StartsUsing",
        netRegex: { id: "820E" },
        infoText: (data, _, output) => (data.souma.phase === 1 ? output.text() : output.text2()),
        durationSeconds: 6,
        outputStrings: {
          text: { en: "找暗门" },
          text2: { en: "找光门" },
        },
      },
      {
        id: "P11S Souma 这又是什么光",
        type: "StartsUsing",
        netRegex: { id: "8784" },
        delaySeconds: 2.5,
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "钢铁 + 4人分摊" },
        },
      },
      {
        id: "P11S Souma 这又是什么暗",
        type: "StartsUsing",
        netRegex: { id: "8785" },
        delaySeconds: 2.5,
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "月环 => 内X字分摊" },
        },
      },
      {
        id: "P11S Souma 魔法阵光2",
        type: "StartsUsing",
        netRegex: { id: "820F" },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "找暗球" },
        },
      },
      {
        id: "P11S Souma 魔法阵暗2",
        type: "StartsUsing",
        netRegex: { id: "8210" },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "找光球" },
        },
      },
      {
        id: "P11S Souma 冥河",
        type: "StartsUsing",
        netRegex: { id: "8217" },
        infoText: (data, _, output) => output.text(),
        outputStrings: {
          text: { en: "集合分摊" },
        },
      },
      {
        id: "P11S Souma 分阶段",
        type: "StartsUsing",
        netRegex: { id: "8202" },
        run: (data) => (data.souma.phase = 2),
      },
    ],
  });
}
