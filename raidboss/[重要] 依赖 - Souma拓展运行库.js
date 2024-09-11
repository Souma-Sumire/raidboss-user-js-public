if (
  new URLSearchParams(location.search).get("alerts") !== "0" &&
  !/raidboss_timeline_only/.test(location.href)
) {
  // #region
  const sleep = (ms) =>
    new Promise((_resolve, reject) => setTimeout(reject, ms));
  const waitFor = async function waitFor(f) {
    while (!f()) await sleep(200);
    return f();
  };
  const waitForData = async (data, attrName, overtime = 7000) =>
    Promise.race([waitFor(() => data[attrName]), sleep(overtime)]);
  const isNotInRaidboss = /(raidemulator|config)\.html/.test(location.href);
  // if (!isNotInRaidboss) console.log("souma拓展运行库已加载 2024.3.7");
  let soumaRuntimeJSData;
  let timer;
  if (!isNotInRaidboss) sendBroadcast("requestData");
  let soumaParty = [];
  function ifMissing() {
    console.trace("missing");
    console.error("缺少参数，详情见trace");
    // throw "缺少参数";
  }
  const markTypes = [
    "attack1",
    "attack2",
    "attack3",
    "attack4",
    "attack5",
    "attack6",
    "attack7",
    "attack8",
    "bind1",
    "bind2",
    "bind3",
    "stop1",
    "stop2",
    "square",
    "circle",
    "cross",
    "triangle",
  ];
  function markTypeLegalityCheck(markTypeStr) {
    return markTypes.find((v) => v === markTypeStr);
  }
  function getLegalityMarkType(markType, markNum, complementType) {
    if (!markTypeLegalityCheck(complementType))
      throw "备用标记非法" + complementType;
    const result = markType + markNum;
    return markTypeLegalityCheck(result) ? result : complementType;
  }
  function createMyParty(party) {
    soumaParty = party.filter((v) => v.inParty);
    updateNewPartyRP();
  }
  function getRpByName(data = ifMissing(), name = ifMissing()) {
    if (soumaParty.length === 0) {
      createMyParty(data.party.details);
    }
    return soumaParty.find((v) => v.name === name)?.myRP;
  }
  function getRpByHexId(data = ifMissing(), hexId = ifMissing()) {
    return getRpByName(data, getNameByHexId(data, hexId));
  }
  function getNameByRp(data = ifMissing(), rp = ifMissing()) {
    if (soumaParty.length === 0) {
      createMyParty(data.party.details);
    }
    return soumaParty.find((v) => v.myRP === rp)?.name;
  }
  function getNameByHexId(data = ifMissing(), hexId = ifMissing()) {
    return data.party.idToName_[hexId.toUpperCase()];
  }
  function getHexIdByName(data = ifMissing(), name = ifMissing()) {
    return data.party.details.find((v) => v.name === name).id;
  }
  function getHexIdByRp(data = ifMissing(), rp = ifMissing()) {
    return data.party.partyIds_[
      data.party.partyNames_.indexOf(getNameByRp(data, rp))
    ];
  }
  function loop() {
    let i = 0;
    return function (max) {
      return (i = (i % max) + 1);
    };
  }
  function mark(
    actorHexID = ifMissing(),
    markType = ifMissing(),
    localOnly = false
  ) {
    if (typeof actorHexID === "string") actorHexID = parseInt(actorHexID, 16);
    if (isNotInRaidboss) {
      console.debug(
        "邮差mark",
        actorHexID,
        markType
      );
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "mark",
        p: JSON.stringify({
          ActorID: actorHexID,
          MarkType: markType,
          LocalOnly: localOnly,
        }),
      });
    }
  }
  function doTextCommand(text) {
    if (isNotInRaidboss) {
      console.debug("邮差command", text);
    } else {
      callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });
    }
  }
  function clearMark(localOnly = false) {
    if (localOnly) {
      doQueueActions(markTypes.map(v => ({ c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: v, LocalOnly: true }) })), "clearMark localOnly:true"
      );
    } else {
      doQueueActions(
        [
          { c: "DoTextCommand", p: "/mk off <1>" },
          { c: "DoTextCommand", p: "/mk off <2>" },
          { c: "DoTextCommand", p: "/mk off <3>" },
          { c: "DoTextCommand", p: "/mk off <4>" },
          { c: "DoTextCommand", p: "/mk off <5>" },
          { c: "DoTextCommand", p: "/mk off <6>" },
          { c: "DoTextCommand", p: "/mk off <7>" },
          { c: "DoTextCommand", p: "/mk off <8>" },
        ],
        "clearMark localOnly:false"
      );
    }
  }
  function doWaymarks(waymark = ifMissing()) {
    if (isNotInRaidboss) {
      console.debug("邮差doWaymarks", waymark);
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "place",
        p: JSON.stringify(waymark),
      });
    }
  }
  function doQueueActions(queue, notes) {
    queue.forEach((v) => {
      if (v.c === "mark") {
        if (typeof v.p === "string") v.p = JSON.parse(v.p);
        if (typeof v.p.ActorID === "string")
          v.p.ActorID = parseInt(v.p.ActorID, 16);
        if (Number.isNaN(v.p.ActorID)) throw "v.p.ActorID is not a number";
        if (/undefined/.test(v.p.MarkType)) throw "MarkType has undefined";
      }
      if (typeof v.p === "object") v.p = JSON.stringify(v.p);
    });
    if (isNotInRaidboss)
      console.debug("邮差queue", notes, JSON.stringify(queue, null, 1));
    else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "DoQueueActions",
        p: JSON.stringify(queue),
      });
    }
  }
  // function placeReset() {
  //   if (isNotInRaidboss) console.debug("邮差reset");
  //   else callOverlayHandler({ call: "PostNamazu", c: "place", p: "reset" });
  // }
  function placeSave() {
    if (isNotInRaidboss) console.debug("邮差save");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "save" });
  }
  function placeLoad() {
    if (isNotInRaidboss) console.debug("邮差load");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "load" });
  }
  function placeClear() {
    if (isNotInRaidboss) console.debug("邮差clear");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "clear" });
  }
  function getClearMarkQueue(localOnly = ifMissing(), delayMs = 0) {
    return localOnly
      ? markTypes.map((v, i) => ({ c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: v, LocalOnly: true, d: i === 0 ? delayMs : 0 }) }))
      : [
        { c: "DoTextCommand", p: "/mk off <1>", d: delayMs },
        { c: "DoTextCommand", p: "/mk off <2>" },
        { c: "DoTextCommand", p: "/mk off <3>" },
        { c: "DoTextCommand", p: "/mk off <4>" },
        { c: "DoTextCommand", p: "/mk off <5>" },
        { c: "DoTextCommand", p: "/mk off <6>" },
        { c: "DoTextCommand", p: "/mk off <7>" },
        { c: "DoTextCommand", p: "/mk off <8>" },
      ];
  }
  function getRotationAngle(x, y) {
    return (Math.atan2(x, y) * 180) / Math.PI;
  }
  function getDistance(x1, y1, x2 = 100, y2 = 100) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  /**
   * 旋转坐标（FF反转坐标专用）
   * @param {number} x 待处理X坐标
   * @param {number} y 待处理Y坐标
   * @param {number} centerX 基准点X坐标
   * @param {number} centerY 基准点Y坐标
   * @param {boolean} reverseAngle 是否反转角度，如果用于处理玩家坐标用于坐标排序则应传入true，处理waymarks则应为false或默认。
   * @returns
   */
  function rotateCoord(
    x = ifMissing(),
    y = ifMissing(),
    centerX = ifMissing(),
    centerY = ifMissing(),
    reverseAngle = false
  ) {
    function rotateFFPoint(pointX, pointY, angle) {
      const x =
        pointX * Math.cos((angle * Math.PI) / 180) +
        pointY * Math.sin((angle * Math.PI) / 180);
      const y =
        -pointX * Math.sin((angle * Math.PI) / 180) +
        pointY * Math.cos((angle * Math.PI) / 180);
      return { x: x, y: y };
    }
    const nx = x - 100;
    const ny = -y + 100;
    const nx2 = centerX - 100;
    const ny2 = -centerY + 100;
    const angle = getRotationAngle(nx2, ny2);
    const res = rotateFFPoint(nx, ny, reverseAngle ? -angle : angle);
    const resX = res.x + 100;
    const resY = -res.y + 100;
    return { x: resX, y: resY };
  }
  function deepClone(obj) {
    const cache = new Map();
    function _deepClone(value) {
      if (typeof value !== "object" || value === null) return value;
      if (cache.has(value)) return cache.get(value);
      if (value instanceof Date) return new Date(value);
      if (value instanceof RegExp) return new RegExp(value);
      if (value instanceof Set) return new Set(_deepClone(Array.from(value)));
      if (value instanceof Map)
        return new Map(_deepClone(Array.from(value.entries())));
      const result = Array.isArray(value) ? [] : {};
      cache.set(value, result);
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          result[index] = _deepClone(item);
        });
      } else {
        Object.keys(value).forEach((key) => {
          result[key] = _deepClone(value[key]);
        });
      }
      return result;
    }
    return _deepClone(obj);
  }
  //#endregion
  const souma = {
    getRpByName,
    getRpByHexId,
    getNameByRp,
    getNameByHexId,
    getHexIdByRp,
    getHexIdByName,
    loop,
    sleep,
    waitFor,
    waitForData,
    mark,
    doTextCommand,
    clearMark,
    doWaymarks,
    doQueueActions,
    placeSave,
    placeLoad,
    placeClear,
    getClearMarkQueue,
    getLegalityMarkType,
    rotateCoord,
    getDistance,
    deepClone,
  };
  Util.souma = souma;
  Options.Triggers.push({
    id: "SoumaRunLibrary",
    zoneId: ZoneId.MatchAll,
    initData: () => {
      return { soumaFL: souma, };
    },
  });
  if (!/config\.html/.test(location.href)) {
    addOverlayListener("PartyChanged", (e) => {
      // console.log("Party Changed", e);
      if (soumaRuntimeJSData === undefined)
        setTimeout(() => createMyParty(e.party), 500);
      else createMyParty(e.party);
    });
    // addOverlayListener("ChangeZone", placeReset);
    addOverlayListener("BroadcastMessage", handleBroadcastMessage);
  }
  function handleBroadcastMessage(msg) {
    if (msg.source === "soumaRuntimeJS") {
      soumaRuntimeJSData = msg.msg.party;
      if (soumaRuntimeJSData !== undefined) {
        updateNewPartyRP();
      }
    }
  }
  function updateNewPartyRP() {
    if (isNotInRaidboss) defaultSort();
    else {
      clearTimeout(timer);
      if (soumaRuntimeJSData !== undefined) {
        soumaParty.forEach(
          (p) =>
          (p.myRP =
            soumaRuntimeJSData.find((r) => r.id === p.id)?.rp ?? "unknown")
        );
        sendBroadcast("updateNewPartyRP Success");
      } else {
        timer = setTimeout(() => {
          if (soumaRuntimeJSData === undefined) {
            defaultSort();
            // console.error("未在3秒内接受到soumaRuntimeJSData，采用默认排序。");
            // doQueueActions([
            //   {
            //     c: "command",
            //     p: "/e 未接收到职能分配数据，将采用默认排序<se.10>。可能是缺少配套悬浮窗 https://souma.diemoe.net/ff14-overlay-vue/#/cactbotRuntime",
            //   },
            // ]);
          } else {
            soumaParty.forEach(
              (p) =>
              (p.myRP =
                soumaRuntimeJSData.find((r) => r.id === p.id)?.rp ??
                "unknown")
            );
            sendBroadcast("updateNewPartyRP Success");
          }
        }, 3000);
      }
    }
  }
  function sendBroadcast(text) {
    callOverlayHandler({
      call: "broadcast",
      source: "soumaUserJS",
      msg: { text: text },
    });
  }
  function defaultSort() {
    const sort = [
      "21", //战
      "32", //暗
      "37", //枪
      "19", //骑
      "33", //占
      "24", //白
      "40", //贤
      "28", //学
      "41", //蛇
      "34", //侍
      "30", //忍
      "39", //钐
      "22", //龙
      "20", //僧
      "38", //舞
      "23", //诗
      "31", //机
      '42', //绘
      "25", //黑
      "27", //召
      "35", //赤
      "36", //青
    ];
    const createRPArr = (r, l) =>
      Array(l)
        .fill(r)
        .map((v, i) => v + ++i);
    const tRP = ["MT", "ST", ...createRPArr("T", 14)];
    const hRP = [...createRPArr("H", 16)];
    const dRP = [...createRPArr("D", 16)];
    const role = {
      tank: [1, 3, 19, 21, 32, 37],
      healer: [6, 24, 28, 33, 40],
      dps: [2, 4, 5, 7, 20, 22, 23, 25, 26, 27, 29, 30, 31, 34, 35, 36, 38, 39],
    };
    let t = 0;
    let h = 0;
    let d = 0;
    soumaParty = soumaParty.sort(
      (a, b) => sort.indexOf(a.job.toString()) - sort.indexOf(b.job.toString())
    );
    soumaParty.forEach((v) => {
      if (role.tank.includes(Number(v.job))) v.myRP = tRP[t++];
      else if (role.healer.includes(Number(v.job))) v.myRP = hRP[h++];
      else if (role.dps.includes(Number(v.job))) v.myRP = dRP[d++];
      else v.myRP = "unknown";
    });
  }
}
