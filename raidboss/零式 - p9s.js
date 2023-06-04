if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const firstMarker = parseInt("0221", 16);
  const headmarkers = {
    m1: "009C",
    m2: "009D",
    m3: "009E",
    m4: "009F",
    m5: "00A0",
    m6: "00A1",
    m7: "00A2",
    m8: "00A3",
    lan: "0197",
  };
  const getHeadmarkerId = (data, matches) => {
    if (data.souma.decOffset === undefined) data.souma.decOffset = parseInt(matches.id, 16) - firstMarker;
    return (parseInt(matches.id, 16) - data.souma.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
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
  // console.warn("p9s");
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheNinthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheNinthCircleSavage,
    config: [
      {
        id: "麻将6824标点1234",
        name: { en: "麻将6824标点1234" },
        type: "select",
        options: { en: { "开(正常模式)": "开", "关": "关", "开(本地标点)": "本地" } },
        default: "关",
      },
    ],
    initData: () => {
      if (!location.href.includes("raidemulator.html")) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P9S Souma Public Queue .*" },
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
          stage: 1,
          // element: undefined,
          // markers: {
          //   spider: [],
          // },
          // towers: [],
          // towersMap: [],
          // plumesStr: undefined,
        },
      };
    },
    triggers: [
      {
        id: "P9S Souma Headmarker Tracker",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => data.souma.decOffset === undefined,
        run: (data, matches) => getHeadmarkerId(data, matches),
      },
      {
        id: "P9S Souma HeadMarker 麻将1",
        type: "HeadMarker",
        netRegex: {},
        durationSeconds: 30,
        alertText: (data, matches, output) => {
          // console.warn(matches);
          if (data.souma.stage === 1) {
            const id = getHeadmarkerId(data, matches);
            // console.warn(id);
            let res;
            const isMark = ["开", "本地"].includes(data.triggerSetConfig.麻将6824标点1234);
            const local = data.triggerSetConfig.麻将6824标点1234 === "本地";
            switch (id) {
              case headmarkers.m2:
                res = "2麻 1火3塔";
                if (isMark) mark(parseInt(matches.targetId, 16), "attack3", local);
                break;
              case headmarkers.m4:
                res = "4麻 3火4塔";
                if (isMark) mark(parseInt(matches.targetId, 16), "attack4", local);
                break;
              case headmarkers.m6:
                res = "6麻 1塔3火";
                if (isMark) mark(parseInt(matches.targetId, 16), "attack1", local);
                break;
              case headmarkers.m8:
                res = "8麻 2塔4火";
                if (isMark) mark(parseInt(matches.targetId, 16), "attack2", local);
                break;
              case headmarkers.lan:
                // mark(parseInt(matches.targetId, 16), "stop1", local);
                res = "篮球 找BOSS";
                break;
            }
            if (matches.target === data.me) return res;
          }
        },
      },
      {
        id: "P9S Souma 前方踢脚",
        type: "StartsUsing",
        netRegex: { id: ["8167", "8168"], capture: false },
        infoText: "后后后",
      },
      {
        id: "P9S Souma 后方踢脚",
        type: "StartsUsing",
        netRegex: { id: ["8169", "816A"], capture: false },
        infoText: "前前前",
      },
      {
        id: "P9S Souma 双击1",
        type: "StartsUsing",
        netRegex: { id: "8184", capture: false },
        infoText: "双分摊",
        run: (data) => (data.souma.stage = 2),
        // run: (data, matches) => doTextCommand(`/p (冰+火) 遠離+分組`),
      },
      {
        id: "P9S Souma 双击2",
        type: "StartsUsing",
        netRegex: { id: "8185", capture: false },
        infoText: "靠近+八方",
        run: (data) => (data.souma.stage = 2),
        // run: (data, matches) => doTextCommand(`/p (冰+雷) 靠近+散開`),
      },
    ],
  });
}
