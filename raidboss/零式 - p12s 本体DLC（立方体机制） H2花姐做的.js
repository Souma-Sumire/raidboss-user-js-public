if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const firstMarker = parseInt("027F", 16);
  const headmarkers = {
    butser: "027F",
    sony1: "021A",
    sony2: "021D",
    sony3: "021B",
    sony4: "021C",
  };

  const { deepClone } = Util.souma;

  const getHeadmarkerId = (data, matches) => {
    if (data.hua.decOffset === undefined) data.hua.decOffset = parseInt(matches.id, 16) - firstMarker;
    return (parseInt(matches.id, 16) - data.hua.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };

  const polyhedronToPos = (combatant) => {
    var pos = -1;
    var x = combatant.PosX;
    var y = combatant.PosY;
    var row = 0;
    var column = 0;
    if (Math.abs(y - 84) <= 2) {
      row = 1;
    } else if (Math.abs(y - 92) <= 2) {
      row = 2;
    } else if (Math.abs(y - 100) <= 2) {
      row = 3;
    }
    if (Math.abs(x - 88) <= 2) {
      column = 1;
    } else if (Math.abs(x - 96) <= 2) {
      column = 2;
    } else if (Math.abs(x - 104) <= 2) {
      column = 3;
    } else if (Math.abs(x - 112) <= 2) {
      column = 4;
    }
    if (row != 0 && column != 0) {
      pos = (column - 1) * 3 + row - 1;
    }
    return pos;
  };

  function getSpecificPolyhedron(map, id) {
    var m = deepClone(map);
    var res = [];
    while (true) {
      var i = m.indexOf(id);
      if (i == -1) break;
      res.push(i);
      m[i] = -1;
    }
    return res;
  }

  function getColumn(x) {
    return parseInt(x / 3) + 1;
  }

  function getRow(x) {
    return (x % 3) + 1;
  }

  function getNeighborInfo(base, target) {
    var baseColumn = getColumn(base);
    var baseRow = getRow(base);
    var targetColumn = getColumn(target);
    var targetRow = getRow(target);
    if (baseColumn == targetColumn && baseRow - targetRow == 1) {
      return { row: baseRow, column: baseColumn, dir: "上边" };
    } else if (baseColumn == targetColumn && baseRow - targetRow == -1) {
      return { row: baseRow, column: baseColumn, dir: "下边" };
    } else if (baseRow == targetRow && baseColumn - targetColumn == 1) {
      return { row: baseRow, column: baseColumn, dir: "左边" };
    } else if (baseRow == targetRow && baseColumn - targetColumn == -1) {
      return { row: baseRow, column: baseColumn, dir: "右边" };
    } else {
      return { row: baseRow, column: baseColumn, dir: "不相邻" };
    }
  }

  function getMatchingResult(base, target) {
    // 这不是完美的匹配算法，但是游戏里不可能有复杂的匹配情况，更不可能有多解
    var result = [-1, -1, -1, -1];
    var m1 = deepClone(base);
    var m2 = deepClone(target);
    for (var i = 0; i < 4; i++) {
      // 总循环次数
      for (var j = 0; j < 4; j++) {
        // 尝试这个能不能匹配
        if (m1[j] == -1) continue;
        var matchNum = 0;
        var matchK = -1;
        for (var k = 0; k < 4; k++) {
          // 匹配每个目标
          if (m2[k] == -1) continue;
          var neighbor = getNeighborInfo(m1[j], m2[k]);
          if (neighbor["dir"] != "不相邻") {
            matchNum += 1;
            matchK = k;
          }
        }
        if (matchNum == 1) {
          // 只有恰好为1时才匹配
          result[j] = m2[matchK];
          m1[j] = -1;
          m2[matchK] = -1;
          break;
        }
      }
      // 异常处理，但是假设没有异常，省略了
    }
    return result;
  }

  function getOpposite(x) {
    var newDir = "不相邻";
    if (x["dir"] == "上边") newDir = "下边";
    if (x["dir"] == "下边") newDir = "上边";
    if (x["dir"] == "左边") newDir = "右边";
    if (x["dir"] == "右边") newDir = "左边";
    return { row: 4 - x["row"], column: 5 - x["column"], dir: newDir };
  }

  Options.Triggers.push({
    id: "AnabaseiosTheTwelfthCircleSavageHua2",
    zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
    initData: () => {
      return {
        hua: {
          decOffset: undefined,
          sony: [],
          classicalConceptsNum: 0,
          actualResult: undefined,
          earths: [],
          waters: [],
          fires: [],
          currentMap: [],
          currentSony: -1,
        },
      };
    },
    triggers: [
      {
        id: "P12S 花 2 Headmarker Tracker",
        type: "HeadMarker",
        netRegex: {},
        condition: (data) => data.hua.decOffset === undefined,
        preRun: (data, matches) => getHeadmarkerId(data, matches),
      },
      {
        id: "P12S 花 2 Synergy Marker Collect",
        type: "HeadMarker",
        netRegex: {},
        delaySeconds: 0.5,
        preRun: (data, matches, output) => {
          const id = getHeadmarkerId(data, matches);
          switch (id) {
            case headmarkers.sony1:
              data.hua.sony.push({ target: matches.target, sony: 1 });
              break;
            case headmarkers.sony2:
              data.hua.sony.push({ target: matches.target, sony: 2 });
              break;
            case headmarkers.sony3:
              data.hua.sony.push({ target: matches.target, sony: 3 });
              break;
            case headmarkers.sony4:
              data.hua.sony.push({ target: matches.target, sony: 4 });
              break;
            default:
              break;
          }
        },
        run: (data, matches) => {
          if (data.hua.sony.length === 8) {
            const sony = deepClone(data.hua.sony);
            data.hua.sony.length = 0;
            data.hua.currentSony = sony.find((v) => v.target === data.me).sony;
          }
        },
      },
      {
        id: "P12S 花 Classical Concepts",
        type: "StartsUsing",
        netRegex: { id: "8331" },
        infoText: (data, _matches, output) => {
          data.hua.currentMap = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
          data.hua.classicalConceptsNum += 1;
          data.hua.currentSony = -1;
          return output.text();
        },
        delaySeconds: 2,
        outputStrings: {
          text: { en: "立方体准备" },
        },
      },
      {
        id: "P12S 花 Fire Collect", // Fire立方体
        type: "AddedCombatant",
        netRegex: { npcNameId: "12384", npcBaseId: "16183" },
        run: (data, matches) => data.hua.fires.push(matches),
      },
      {
        id: "P12S 花 Water Collect", // Water立方体
        type: "AddedCombatant",
        netRegex: { npcNameId: "12385", npcBaseId: "16184" },
        run: (data, matches) => data.hua.waters.push(matches),
      },
      {
        id: "P12S 花 Earth Collect", // Earth立方体
        type: "AddedCombatant",
        netRegex: { npcNameId: "12386", npcBaseId: "16185" },
        run: (data, matches) => data.hua.earths.push(matches),
      },
      {
        id: "P12S 花 Classical Concepts Calculate",
        type: "GainsEffect",
        netRegex: { effectId: ["DE8", "DE9"], capture: true },
        condition: Conditions.targetIsYou(),
        delaySeconds: 0.5,
        durationSeconds: 10,
        promise: async (data) => {
          var waterId = data.hua.waters.map((key) => parseInt(key.id, 16));
          var fireId = data.hua.fires.map((key) => parseInt(key.id, 16));
          var earthId = data.hua.earths.map((key) => parseInt(key.id, 16));
          var allId = waterId.concat(fireId).concat(earthId);
          var allData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: allId,
            })
          ).combatants;
          for (var combatant of allData) {
            var pos = polyhedronToPos(combatant);
            if (pos != -1) {
              if (waterId.indexOf(combatant.ID) != -1) {
                data.hua.currentMap[pos] = 1;
              } else if (fireId.indexOf(combatant.ID) != -1) {
                data.hua.currentMap[pos] = 2;
              } else if (earthId.indexOf(combatant.ID) != -1) {
                data.hua.currentMap[pos] = 3;
              }
            }
          }
        },
        alertText: (data, matches, output) => {
          var validNum = 0;
          for (var t of data.hua.currentMap) {
            if (t != -1) {
              validNum += 1;
            }
          }
          if (validNum != 12) {
            return output.nothing();
          }
          var myId = 2;
          if (matches.effectId == "DE9") {
            myId = 3;
          }
          var baseIds = getSpecificPolyhedron(data.hua.currentMap, 1);
          var targetIds = getSpecificPolyhedron(data.hua.currentMap, myId);
          var matchResult = getMatchingResult(baseIds, targetIds);
          var resultInfo = getNeighborInfo(baseIds[data.hua.currentSony - 1], matchResult[data.hua.currentSony - 1]);
          if (resultInfo["dir"] == "不相邻") {
            return output.nothing();
          }
          if (data.hua.classicalConceptsNum == 1) {
            return output.act1(resultInfo);
          } else if (data.hua.classicalConceptsNum == 2) {
            data.hua.actualResult = getOpposite(resultInfo);
            return output.act2(resultInfo);
          }
        },
        outputStrings: {
          act1: { en: "${column}列${row}${dir}" },
          act2: { en: "看${column}列${row}${dir}" },
          nothing: { en: "数据错误，自己去找" },
        },
      },
      {
        id: "P12S 花 Classical Concepts Collect",
        type: "GainsEffect",
        netRegex: { effectId: ["DE8", "DE9"], capture: true },
        condition: Conditions.targetIsYou(),
        delaySeconds: 3.5,
        durationSeconds: 7,
        suppressSeconds: 7,
        condition: (data) => data.hua.classicalConceptsNum == 2,

        infoText: (data, matches, output) => {
          if (data.hua.actualResult == undefined || data.hua.actualResult["dir"] == "不相邻") {
            return output.nothing();
          } else {
            return output.act2(data.hua.actualResult);
          }
        },
        outputStrings: {
          act2: { en: "找${column}列${row}${dir}" },
          nothing: { en: "数据错误，自己去找" },
        },
      },
    ],
  });
}
