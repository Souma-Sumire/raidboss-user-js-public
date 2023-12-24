// 大部分的函数都是被废弃的，但是由于一些历史原因没有删。

if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  // #region
  const prevent = { forceLocalMark: false };
  const sleep = (ms) => new Promise((_resolve, reject) => setTimeout(reject, ms));
  const waitFor = async function waitFor(f) {
    while (!f()) await sleep(200);
    return f();
  };
  const waitForData = async (data, attrName, overtime = 7000) =>
    Promise.race([waitFor(() => data[attrName]), sleep(overtime)]);
  const isNotInRaidboss = /(raidemulator|config)\.html/.test(location.href);
  if (!isNotInRaidboss) console.log("souma拓展运行库已加载 2023.12.24");
  let soumaRuntimeJSData;
  let timer;
  if (!isNotInRaidboss) sendBroadcast("requestData");
  let soumaParty = [];
  function ifMissing() {
    console.trace("missing");
    console.error("缺少参数，详情见trace");
    // throw "缺少参数";
  }
  function markTypeLegalityCheck(markTypeStr) {
    return [
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
    ].find((v) => v === markTypeStr);
  }
  function getLegalityMarkType(markType, markNum, complementType) {
    if (!markTypeLegalityCheck(complementType)) throw "备用标记非法" + complementType;
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
    return data.party.partyIds_[data.party.partyNames_.indexOf(getNameByRp(data, rp))];
  }
  function loop() {
    let i = 0;
    return function (max) {
      return (i = (i % max) + 1);
    };
  }
  function mark(actorHexID = ifMissing(), markType = ifMissing(), localOnly = false) {
    if (prevent.forceLocalMark && localOnly === false) {
      localOnly = true;
      console.debug("邮差在mark动作中本应执行小队标点，但被用户设置改为本地标点");
    }
    if (typeof actorHexID === "string") actorHexID = parseInt(actorHexID, 16);
    if (isNotInRaidboss) {
      console.debug(
        "邮差mark",
        actorHexID,
        markType
        // getRpByHexId({ party: soumaData.cactbotParty }, actorHexID.toString(16).toUpperCase()),
      );
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "mark",
        p: JSON.stringify({ ActorID: actorHexID, MarkType: markType, LocalOnly: localOnly }),
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
      doQueueActions(
        [
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack1", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack3", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack4", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack5", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack6", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack7", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack8", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind1", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind3", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "stop1", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "stop2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "square", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "circle", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "cross", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "triangle", LocalOnly: true }) },
        ],
        "clearMark localOnly:true"
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
  function doQueueActionsDebug(queue, notes, data) {
    console.debug(
      "debug queue",
      notes,
      JSON.stringify(
        queue.map((v) => {
          if (v.c === "mark") {
            if (typeof v.p === "string") v.p = JSON.parse(v.p);
            if (typeof v.p.ActorID === "string") v.p.ActorID = parseInt(v.p.ActorID, 16);
            if (Number.isNaN(v.p.ActorID)) throw "v.p.ActorID is not a number";
            if (/undefined/.test(v.p.MarkType)) throw "MarkType has undefined";
            // const decId = v.p.ActorID;
            const hexId = v.p.ActorID.toString(16).toUpperCase();
            v.debugHexId = hexId;
            v.debugName = getNameByHexId(data, hexId);
            if (v.debugName) v.debugRp = getRpByHexId(data, hexId);
          }
          return v;
        }),
        null,
        1
      )
    );
  }
  function doQueueActions(queue, notes) {
    queue.forEach((v, i) => {
      if (v.c === "mark") {
        if (typeof v.p === "string") v.p = JSON.parse(v.p);
        if (typeof v.p.ActorID === "string") v.p.ActorID = parseInt(v.p.ActorID, 16);
        if (Number.isNaN(v.p.ActorID)) throw "v.p.ActorID is not a number";
        if (/undefined/.test(v.p.MarkType)) throw "MarkType has undefined";
        if (prevent.forceLocalMark && v.p.LocalOnly === false) {
          console.debug(
            `邮差在queue第${i + 1}条动作中本应执行小队标点，但被用户设置改为本地标点`,
            v.p.ActorID.toString(16).toUpperCase(),
            v.p.MarkType
          );
          v.p.LocalOnly = true;
        }
      }
      if (typeof v.p === "object") v.p = JSON.stringify(v.p);
    });
    if (isNotInRaidboss) console.debug("邮差queue", notes, JSON.stringify(queue, null, 1));
    else {
      callOverlayHandler({ call: "PostNamazu", c: "DoQueueActions", p: JSON.stringify(queue) });
    }
  }
  function placeReset() {
    if (isNotInRaidboss) console.debug("邮差reset");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "reset" });
  }
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
  function calculationDistance(x1, y1, x2 = 100, y2 = 100) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
  function setRP(tarName, tarRP) {
    const tar = soumaParty.find((v) => v.name === tarName);
    const repeat = soumaParty.find((v) => v.myRP === tarRP);
    if (!tar) doTextCommand(`/e 未找到${tarName} <se.11>`);
    else {
      if (repeat && repeat.name !== tar.name) {
        repeat.myRP = tar.myRP;
        doTextCommand(`/e 由于位置冲突,${repeat.name}自动改为${repeat.myRP}`);
      }
      tar.myRP = tarRP;
      doTextCommand(`/e 已设置${tarName}为${tarRP}`);
    }
  }
  function handleSettings(value) {
    switch (value.toLowerCase()) {
      case "true":
      case "ture": // 猪头专用
      case "是":
      case "开":
      case "开启":
      case "启用":
      case "使能":
      case "确定":
      case "对":
        return true;
      case "false":
      case "flase": // 猪头专用
      case "0":
      case "否":
      case "关":
      case "关闭":
      case "取消":
      case "不":
      case "错":
        return false;
      default:
        return value.split("/").length >= 2 ? value.split("/") : value;
    }
  }
  function getClearMarkQueue(localOnly = ifMissing(), delayMs = 0) {
    return localOnly
      ? [
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack1", LocalOnly: true }), d: delayMs },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack3", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack4", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack5", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack6", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack7", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "attack8", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind1", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "bind3", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "stop1", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "stop2", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "square", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "circle", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "cross", LocalOnly: true }) },
          { c: "mark", p: JSON.stringify({ ActorID: 0xe000000, MarkType: "triangle", LocalOnly: true }) },
        ]
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
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  /**
   * 旋转坐标（FF反转坐标专用）
   * @param {number} x 待处理X坐标
   * @param {number} y 待处理Y坐标
   * @param {number} x2 基准点X坐标
   * @param {number} y2 基准点Y坐标
   * @param {boolean} reverseAngle 是否反转角度，如果用于处理玩家坐标用于坐标排序则应传入true，处理waymarks则应为false或默认。
   * @returns
   */
  function rotateCoord(x = ifMissing(), y = ifMissing(), x2 = ifMissing(), y2 = ifMissing(), reverseAngle = false) {
    function rotateFFPoint(pointX, pointY, angle) {
      const x = pointX * Math.cos((angle * Math.PI) / 180) + pointY * Math.sin((angle * Math.PI) / 180);
      const y = -pointX * Math.sin((angle * Math.PI) / 180) + pointY * Math.cos((angle * Math.PI) / 180);
      return { x: x, y: y };
    }
    const nx = x - 100;
    const ny = -y + 100;
    const nx2 = x2 - 100;
    const ny2 = -y2 + 100;
    const angle = getRotationAngle(nx2, ny2);
    const res = rotateFFPoint(nx, ny, reverseAngle ? -angle : angle);
    const resX = res.x + 100;
    const resY = -res.y + 100;
    return { x: resX, y: resY };
  }
  function deepClone(obj) {
    if (typeof obj !== "object") return obj;
    if (obj instanceof Map) {
      let newMap = new Map();
      obj.forEach((value, key) => {
        newMap.set(key, deepClone(value));
      });
      return newMap;
    }
    if (obj instanceof Set) {
      let newSet = new Set();
      obj.forEach((value) => {
        newSet.add(deepClone(value));
      });
      return newSet;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags);
    }
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        newObj[key] = deepClone(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
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
    doQueueActionsDebug,
    placeSave,
    placeLoad,
    placeClear,
    calculationDistance,
    handleSettings,
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
    zoneLabel: { en: "通用 - 用户设置" },
    config: [
      {
        id: "souma拓展运行库强制本地标点",
        name: { en: "强制使用本地标点（优先级高于副本设置）" },
        type: "checkbox",
        default: false,
      },
    ],
    initData: () => {
      return { soumaFL: souma, soumaRuntime: { isInit: false } };
    },
    triggers: [
      {
        id: "Souma Runtime 总设置（优先级高于副本内设置）",
        type: "LimitBreak",
        netRegex: { bars: "3" },
        condition: (data, matches) => !data.soumaRuntime.isInit && parseInt(matches.valueHex, 16) >= 200,
        run: (data) => {
          placeSave();
          prevent.forceLocalMark = data.triggerSetConfig.souma拓展运行库强制本地标点;
          data.soumaRuntime.isInit = true;
        },
      },
    ],
  });
  if (!/config\.html/.test(location.href)) {
    addOverlayListener("PartyChanged", (e) => {
      if (soumaRuntimeJSData === null) setTimeout(() => createMyParty(e.party), 500);
      else createMyParty(e.party);
    });
    addOverlayListener("ChangeZone", placeReset);
    addOverlayListener("BroadcastMessage", handleBroadcastMessage);
  }
  function handleBroadcastMessage(msg) {
    if (msg.source === "soumaRuntimeJS") {
      soumaRuntimeJSData = msg.msg.party;
      updateNewPartyRP();
    }
  }
  function updateNewPartyRP() {
    if (isNotInRaidboss) defaultSort();
    else {
      clearTimeout(timer);
      if (soumaRuntimeJSData) {
        soumaParty.forEach((p) => (p.myRP = soumaRuntimeJSData.find((r) => r.id === p.id)?.rp ?? "unknown"));
        sendBroadcast("updateNewPartyRP Success");
      } else {
        timer = setTimeout(() => {
          if (!soumaRuntimeJSData) {
            defaultSort();
            console.error("未在3秒内接受到soumaRuntimeJSData，采用默认排序。");
            doQueueActions([{ c: "command", p: "/e <se.10>缺少配套悬浮窗 https://souma.diemoe.net/#/cactbotRuntime" }]);
          } else {
            soumaParty.forEach((p) => (p.myRP = soumaRuntimeJSData.find((r) => r.id === p.id)?.rp ?? "unknown"));
            sendBroadcast("updateNewPartyRP Success");
            // doQueueActions([{ c: "stop", p: "update party rp" }]);
            // doTextCommand("/e 成功<se.9>");
          }
        }, 3000);
      }
    }
  }
  function sendBroadcast(text) {
    callOverlayHandler({ call: "broadcast", source: "soumaUserJS", msg: { text: text } });
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
      "34", //侍
      "30", //忍
      "39", //钐
      "22", //龙
      "20", //僧
      "38", //舞
      "23", //诗
      "31", //机
      "25", //黑
      "27", //召
      "35", //赤
      "36", //青
    ];
    const createRPArr = (r, l) =>
      Array(l)
        .fill(r)
        .map((v, i) => v + ++i);
    const tRP = ["MT", "ST", ...createRPArr("T", 70)];
    const hRP = [...createRPArr("H", 72)];
    const dRP = [...createRPArr("D", 72)];
    const role = {
      tank: [1, 3, 19, 21, 32, 37],
      healer: [6, 24, 28, 33, 40],
      dps: [2, 4, 5, 7, 20, 22, 23, 25, 26, 27, 29, 30, 31, 34, 35, 36, 38, 39],
    };
    let t = 0;
    let h = 0;
    let d = 0;
    soumaParty = soumaParty.sort((a, b) => sort.indexOf(a.job.toString()) - sort.indexOf(b.job.toString()));
    soumaParty.forEach((v) => {
      if (role.tank.includes(Number(v.job))) v.myRP = tRP[t++];
      else if (role.healer.includes(Number(v.job))) v.myRP = hRP[h++];
      else if (role.dps.includes(Number(v.job))) v.myRP = dRP[d++];
      else v.myRP = "unknown";
    });
  }
}
