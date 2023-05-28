if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  //#region
  let isInit = false;
  const prevent = { forceLocalMark: false };
  const jobs = {
    0: { 简体: "冒险者", 繁体: "冒險者", 单字: "冒", 双字: "冒险", role: "none", LB: "none", job: "ADV" },
    1: { 简体: "剑术师", 繁体: "劍術師", 单字: "剑", 双字: "剑术", role: "tank", LB: "tank", job: "GLA" },
    2: { 简体: "格斗家", 繁体: "格鬥家", 单字: "格", 双字: "格斗", role: "dps", LB: "melee", job: "PGL" },
    3: { 简体: "斧术师", 繁体: "斧術師", 单字: "斧", 双字: "斧术", role: "tank", LB: "tank", job: "MRD" },
    4: { 简体: "枪术师", 繁体: "槍術師", 单字: "枪", 双字: "枪术", role: "dps", LB: "melee", job: "LNC" },
    5: { 简体: "弓箭手", 繁体: "弓箭手", 单字: "弓", 双字: "弓箭", role: "dps", LB: "ranged", job: "ARC" },
    6: { 简体: "幻术师", 繁体: "幻術師", 单字: "幻", 双字: "幻术", role: "healer", LB: "healer", job: "CNJ" },
    7: { 简体: "咒术师", 繁体: "咒術師", 单字: "咒", 双字: "咒术", role: "dps", LB: "caster", job: "THM" },
    8: { 简体: "刻木匠", 繁体: "刻木匠", 单字: "木", 双字: "刻木", role: "crafter", LB: "melee", job: "CRP" },
    9: { 简体: "锻铁匠", 繁体: "鍛鐵匠", 单字: "锻", 双字: "锻铁", role: "crafter", LB: "melee", job: "BSM" },
    10: { 简体: "铸甲匠", 繁体: "鑄甲匠", 单字: "甲", 双字: "铸甲", role: "crafter", LB: "melee", job: "ARM" },
    11: { 简体: "雕金匠", 繁体: "雕金匠", 单字: "雕", 双字: "雕金", role: "crafter", LB: "melee", job: "GSM" },
    12: { 简体: "制革匠", 繁体: "製革匠", 单字: "革", 双字: "制革", role: "crafter", LB: "melee", job: "LTW" },
    13: { 简体: "裁衣匠", 繁体: "裁衣匠", 单字: "裁", 双字: "裁衣", role: "crafter", LB: "melee", job: "WVR" },
    14: { 简体: "炼金术士", 繁体: "煉金術士", 单字: "炼", 双字: "炼金", role: "crafter", LB: "melee", job: "ALC" },
    15: { 简体: "烹调师", 繁体: "烹調師", 单字: "烹", 双字: "烹调", role: "crafter", LB: "melee", job: "CUL" },
    16: { 简体: "采矿工", 繁体: "采礦工", 单字: "矿", 双字: "采矿", role: "gatherer", LB: "melee", job: "MIN" },
    17: { 简体: "园艺工", 繁体: "園藝工", 单字: "园", 双字: "园艺", role: "gatherer", LB: "melee", job: "BTN" },
    18: { 简体: "捕鱼人", 繁体: "捕魚人", 单字: "鱼", 双字: "捕鱼", role: "gatherer", LB: "melee", job: "FSH" },
    19: { 简体: "骑士", 繁体: "騎士", 单字: "骑", 双字: "骑士", role: "tank", LB: "tank", job: "PLD" },
    20: { 简体: "武僧", 繁体: "武僧", 单字: "僧", 双字: "武僧", role: "dps", LB: "melee", job: "MNK" },
    21: { 简体: "战士", 繁体: "戰士", 单字: "战", 双字: "战士", role: "tank", LB: "tank", job: "WAR" },
    22: { 简体: "龙骑士", 繁体: "龍騎士", 单字: "龙", 双字: "龙骑", role: "dps", LB: "melee", job: "DRG" },
    23: { 简体: "吟游诗人", 繁体: "吟遊詩人", 单字: "诗", 双字: "诗人", role: "dps", LB: "ranged", job: "BRD" },
    24: { 简体: "白魔法师", 繁体: "白魔法師", 单字: "白", 双字: "白魔", role: "healer", LB: "healer", job: "WHM" },
    25: { 简体: "黑魔法师", 繁体: "黑魔法師", 单字: "黑", 双字: "黑魔", role: "dps", LB: "caster", job: "BLM" },
    26: { 简体: "秘术师", 繁体: "秘術師", 单字: "秘", 双字: "秘术", role: "dps", LB: "caster", job: "ACN" },
    27: { 简体: "召唤师", 繁体: "召喚師", 单字: "召", 双字: "召唤", role: "dps", LB: "caster", job: "SMN" },
    28: { 简体: "学者", 繁体: "學者", 单字: "学", 双字: "学者", role: "healer", LB: "healer", job: "SCH" },
    29: { 简体: "双剑师", 繁体: "雙劍師", 单字: "双", 双字: "双剑", role: "dps", LB: "melee", job: "ROG" },
    30: { 简体: "忍者", 繁体: "忍者", 单字: "忍", 双字: "忍者", role: "dps", LB: "melee", job: "NIN" },
    31: { 简体: "机工士", 繁体: "機工士", 单字: "机", 双字: "机工", role: "dps", LB: "ranged", job: "MCH" },
    32: { 简体: "暗黑骑士", 繁体: "暗黑騎士", 单字: "暗", 双字: "暗骑", role: "tank", LB: "tank", job: "DRK" },
    33: { 简体: "占星术士", 繁体: "占星術士", 单字: "占", 双字: "占星", role: "healer", LB: "healer", job: "AST" },
    34: { 简体: "武士", 繁体: "武士", 单字: "武", 双字: "武士", role: "dps", LB: "melee", job: "SAM" },
    35: { 简体: "赤魔法师", 繁体: "赤魔法師", 单字: "赤", 双字: "赤魔", role: "dps", LB: "caster", job: "RDM" },
    36: { 简体: "青魔法师", 繁体: "青魔法師", 单字: "青", 双字: "青魔", role: "dps", LB: "caster", job: "BLU" },
    37: { 简体: "绝枪战士", 繁体: "絕槍戰士", 单字: "绝", 双字: "绝枪", role: "tank", LB: "tank", job: "GNB" },
    38: { 简体: "舞者", 繁体: "舞者", 单字: "舞", 双字: "舞者", role: "dps", LB: "ranged", job: "DNC" },
    39: { 简体: "钐镰客", 繁体: "釤鐮客", 单字: "钐", 双字: "钐镰", role: "dps", LB: "melee", job: "RPR" },
    40: { 简体: "贤者", 繁体: "賢者", 单字: "贤", 双字: "贤者", role: "healer", LB: "healer", job: "SGE" },
  };

  const sleep = (ms) => new Promise((_resolve, reject) => setTimeout(reject, ms));
  const waitFor = async function waitFor(f) {
    while (!f()) await sleep(200);
    return f();
  };
  const waitForData = async (data, attrName, overtime = 7000) => Promise.race([waitFor(() => data[attrName]), sleep(overtime)]);
  const isNotInRaidboss = /(raidemulator|config)\.html/.test(location.href);
  if (!isNotInRaidboss) console.log("souma拓展运行库已加载 2023.5.28");
  let soumaRuntimeJSData;
  let timer;
  if (!isNotInRaidboss) sendBroadcast("requestData");
  let soumaParty = [];
  function ifMissing() {
    console.trace("缺少参数");
    throw "缺少参数";
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
  function getJobNameByRP(data = ifMissing(), rp = ifMissing(), type = "简体") {
    return jobs?.[data.party.details.find((v) => v.name === getNameByRp(data, rp))?.job]?.[type];
  }
  function getJobNameByHexId(data = ifMissing(), hexId = ifMissing(), type = "简体") {
    return jobs?.[data.party.details.find((v) => v.name === getNameByHexId(data, hexId))?.job]?.[type];
  }
  function getJobNameByName(data = ifMissing(), name = ifMissing(), type = "简体") {
    return jobs?.[data.party.details.find((v) => v.name === name)?.job]?.[type];
  }
  function getRoleByName(data = ifMissing(), name = ifMissing()) {
    return jobs?.[data.party.details.find((v) => v.name === name)?.job]?.role;
  }
  function getLBByName(data = ifMissing(), name = ifMissing()) {
    return jobs?.[data.party.details.find((v) => v.name === name)?.job]?.LB;
  }
  function getHexIdByRp(data = ifMissing(), rp = ifMissing()) {
    return data.party.partyIds_[data.party.partyNames_.indexOf(getNameByRp(data, rp))];
  }
  function getpartyNamesGroupH1(data = ifMissing()) {
    return [getNameByRp(data, "MT"), getNameByRp(data, "H1"), getNameByRp(data, "D1"), getNameByRp(data, "D3")];
  }
  function getpartyNamesGroupH2(data = ifMissing()) {
    return [getNameByRp(data, "ST"), getNameByRp(data, "H2"), getNameByRp(data, "D2"), getNameByRp(data, "D4")];
  }
  function getpartyNamesGroupTank(data = ifMissing()) {
    return [getNameByRp(data, "MT"), getNameByRp(data, "ST")];
  }
  function getpartyNamesGroupHealer(data = ifMissing()) {
    return [getNameByRp(data, "H1"), getNameByRp(data, "H2")];
  }
  function getpartyNamesGroupAllDps(data = ifMissing()) {
    return [getNameByRp(data, "D1"), getNameByRp(data, "D2"), getNameByRp(data, "D3"), getNameByRp(data, "D4")];
  }
  function getpartyNamesGroupMeleeDps(data = ifMissing()) {
    return [getNameByRp(data, "D1"), getNameByRp(data, "D2")];
  }
  function getpartyNamesGroupRangedDps(data = ifMissing()) {
    return [getNameByRp(data, "D3"), getNameByRp(data, "D4")];
  }
  function sortPartyHexIdsByRpRule(data = ifMissing(), partyHexIdsArr = ifMissing(), rpRuleArr = ifMissing()) {
    return partyHexIdsArr.sort((a, b) => {
      return rpRuleArr.indexOf(getRpByHexId(data, a)) - rpRuleArr.indexOf(getRpByHexId(data, b));
    });
  }
  function sortPartyNamsByRpRule(data = ifMissing(), partyNamesArr = ifMissing(), rpRuleArr = ifMissing()) {
    return partyNamesArr.sort((a, b) => {
      return rpRuleArr.indexOf(getRpByName(data, a)) - rpRuleArr.indexOf(getRpByName(data, b));
    });
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
      console.log("邮差在mark动作中本应执行小队标点，但被用户设置改为本地标点");
    }
    if (typeof actorHexID === "string") actorHexID = parseInt(actorHexID, 16);
    if (isNotInRaidboss) {
      console.log(
        "邮差mark",
        actorHexID,
        markType,
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
      console.log("邮差command", text);
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
        "clearMark localOnly:true",
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
        "clearMark localOnly:false",
      );
    }
  }
  function doWaymarks(waymark = ifMissing()) {
    if (isNotInRaidboss) {
      console.log("邮差doWaymarks", waymark);
    } else {
      callOverlayHandler({
        call: "PostNamazu",
        c: "place",
        p: JSON.stringify(waymark),
      });
    }
  }
  function doQueueActionsDebug(queue, notes, data) {
    console.log(
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
        1,
      ),
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
          console.log(`邮差在queue第${i + 1}条动作中本应执行小队标点，但被用户设置改为本地标点`, v.p.ActorID.toString(16).toUpperCase(), v.p.MarkType);
          v.p.LocalOnly = true;
        }
      }
      if (typeof v.p === "object") v.p = JSON.stringify(v.p);
    });
    if (isNotInRaidboss) console.log("邮差queue", notes, JSON.stringify(queue, null, 1));
    else callOverlayHandler({ call: "PostNamazu", c: "DoQueueActions", p: JSON.stringify(queue) });
  }
  function placeReset() {
    if (isNotInRaidboss) console.log("邮差reset");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "reset" });
  }
  function placeSave() {
    if (isNotInRaidboss) console.log("邮差save");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "save" });
  }
  function placeLoad() {
    if (isNotInRaidboss) console.log("邮差load");
    else callOverlayHandler({ call: "PostNamazu", c: "place", p: "load" });
  }
  function placeClear() {
    if (isNotInRaidboss) console.log("邮差clear");
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
  function rpSortByNames(data = ifMissing(), names = ifMissing(), sortRp = ifMissing()) {
    return names.sort((a, b) => sortRp.indexOf(getRpByName(data, a)) - sortRp.indexOf(data.soumaFL.getRpByName(data, b)));
  }
  function rpSortByHexIds(data = ifMissing(), hexIds = ifMissing(), sortRp = ifMissing()) {
    return hexIds.sort((a, b) => sortRp.indexOf(getRpByHexId(data, a)) - sortRp.indexOf(data.soumaFL.getRpByHexId(data, b)));
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
  //#endregion
  Util.souma = {
    getParty: () => soumaParty,
    getRpByName,
    getRpByHexId,
    getNameByRp,
    getNameByHexId,
    getHexIdByRp,
    getHexIdByName,
    getJobNameByRP,
    getJobNameByHexId,
    getJobNameByName,
    getRoleByName,
    getLBByName,
    getpartyNamesGroupH1,
    getpartyNamesGroupH2,
    getpartyNamesGroupTank,
    getpartyNamesGroupHealer,
    getpartyNamesGroupAllDps,
    getpartyNamesGroupMeleeDps,
    getpartyNamesGroupRangedDps,
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
    rpSortByNames,
    rpSortByHexIds,
    getClearMarkQueue,
    getLegalityMarkType,
    rotateCoord,
    getDistance,
    sortMatchesBy: function (data, arr, rule) {
      return arr.sort((a, b) => {
        return rule.indexOf(Util.souma.getRpByName(data, a.name)) - rule.indexOf(Util.souma.getRpByName(data, b.name));
      });
    },
    customFillArray: function (arr, rules) {
      const _rules = rules.slice();
      if (_rules.length > arr.length) _rules.length = arr.length;
      if (arr.length !== _rules.length && arr.length !== _rules.length + 1) {
        throw "customFillArray 接受的长度不一致" + arr.length + _rules.length;
      }
      const result = Array(arr.length);
      for (let i = 0; i < _rules.length; i++) {
        for (const item of _rules[i]) {
          const t = arr.find((f) => f.rp === item && (i === 0 || !result.find((r) => r?.rp === item)));
          if (t) {
            result[i] = t;
            break;
          }
        }
      }
      if (result[arr.length - 1] === undefined && arr.length === _rules.length + 1)
        result[arr.length - 1] = arr.find((f) => !result.find((r) => r?.rp === f.rp));
      return result;
    },
    Orientation4: Object.freeze([
      ["MT", "ST", "D4", "D3", "D2", "D1", "H1", "H2"],
      ["H2", "ST", "D4", "D3", "D2", "D1", "H1"],
      ["D1", "D2", "D3", "D4", "ST", "H1"],
      ["H1", "ST", "D2", "D3", "D4"],
    ]),
  };
  Options.Triggers.push({
    id: "SoumaRunLibrary",
    zoneId: ZoneId.MatchAll,
    zoneLabel: { en: "通用 - 用户设置" },
    config: [
      {
        id: "souma拓展运行库强制本地标点",
        name: { en: "强制使用本地标点" },
        type: "checkbox",
        default: false,
      },
    ],
    initData: () => {
      placeReset();
      return { soumaFL: Util.souma };
    },
    triggers: [
      {
        id: "Souma Runtime 总设置（优先级高于副本内设置）",
        netRegex: NetRegexes.startsUsing({ capture: false }),
        condition: () => !isInit,
        run: (data, _matches) => {
          isInit = true;
          prevent.forceLocalMark = data.triggerSetConfig.souma拓展运行库强制本地标点;
        },
      },
      {
        id: "Souma Runtime 倒计时",
        regex: /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:距离战斗开始还有|Battle commencing in |戦闘開始まで)(?<cd>\d+)[^（]+（/i,
        run: (_data, matches) => {
          if (isNotInRaidboss) console.log("start countdown");
          else
            doQueueActions(
              [
                { c: "stop", p: "Souma Runtime Countdown Queue" },
                { c: "qid", p: "Souma Runtime Countdown Queue" },
                { c: "place", p: "reset" },
                { c: "place", p: "save", d: Number(matches.cd) * 1000 },
              ],
              "runtime countdown",
            );
        },
      },
      {
        id: "Souma Runtime 取消倒计时",
        regex:
          /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:.+取消了战斗开始倒计时。|Countdown canceled by .+\.|.+により、戦闘開始カウントがキャンセルされました。)$/i,
        run: () =>
          isNotInRaidboss ? console.log("cancel countdown") : doQueueActions([{ c: "stop", p: "Souma Runtime Countdown Queue" }], "runtime cancel countdown"),
      },
    ],
  });
  if (!/config\.html/.test(location.href)) {
    addOverlayListener("PartyChanged", (e) => {
      if (soumaRuntimeJSData === null) setTimeout(() => createMyParty(e.party), 500);
      else createMyParty(e.party);
    });
    addOverlayListener("ChangeZone", () => placeReset());
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
      timer = setTimeout(() => {
        if (!soumaRuntimeJSData) {
          defaultSort();
          doQueueActions([
            { c: "qid", p: "update party rp" },
            { c: "command", p: "/e <se.10>缺少配套悬浮窗 https://souma.diemoe.net/#/cactbotRuntime", d: 3000 },
          ]);
        } else {
          soumaParty.forEach((p) => (p.myRP = soumaRuntimeJSData.find((r) => r.id === p.id)?.rp ?? "unknown"));
          sendBroadcast("updateNewPartyRP Success");
          doQueueActions([{ c: "stop", p: "update party rp" }]);
          // doTextCommand("/e 成功<se.9>");
        }
      }, 1000);
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
