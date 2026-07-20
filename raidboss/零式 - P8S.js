if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  const defaultSettings = {
    隆起数字标记开关: { en: "关" },
    隆起数字仅本地标点: { en: "否" },
    一蛇顺位: { en: ["MT", "D1", "ST", "D2", "H1", "D3", "H2", "D4"].join("/") },
    小蛇处理顺序标点: { en: "关" },
    小蛇处理顺序仅本地标点: { en: "否" },
    小蛇场地标点: { en: "否" },
    小蛇场地标点缩放: { en: "0.5" },
    大蛇debuff优先级: { en: ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"].join("/") },
    大蛇大圈标记开关: { en: "关" },
    大蛇大圈仅本地标点: { en: "否" },
    大蛇分摊标记开关: { en: "关" },
    大蛇分摊仅本地标点: { en: "否" },
    冰火优先级TN: { en: ["H1", "MT", "ST", "H2"].join("/") },
    冰火优先级DPS: { en: ["D1", "D2", "D3", "D4"].join("/") },
    冰火标记开关: { en: "关" },
    冰火标记仅本地标点: { en: "否" },
    冰火打法切换: { en: "菓子" },
    冰火缝合式发宏的频道: { en: "e" },
    注: { en: "不填菓子则为扫码特制究极缝合式" },
    扫码特制究极缝合式冰火动脑人优先级: { en: ["MT", "ST"].join("/") },
    扫码特制究极缝合式冰火动脑人补位优先级与站位无关: { en: ["D1", "D2", "H1", "H2", "D3", "D4"].join("/") },
    攻略视频链接: { en: "BV1QW4y137Ae" },
    一运塔发宏: { en: "开" },
    一运塔发宏的频道: { en: "e" },
    灰烬标点开关: { en: "关" },
    灰烬标点仅本地标点: { en: "否" },
    支配者的一击标点开关: { en: "关" },
    支配者的一击仅本地标点: { en: "否" },
    支配者的一击排队优先级: { en: ["MT", "ST", "H1", "H2", "D4", "D3", "D2", "D1"].join("/") },
    支配者的一击狂暴踩塔场地本地标点: { en: "关" },
  };
  const arcaneChannelFlags = "00020001";
  const perfectedConcepts = ["alpha", "beta", "gamma"];
  // 对应标点1A2 蛇A起顺时针 已写死
  const 蛇标点优先级 = ["A", "2", "B", "3", "C", "4", "D", "1"]; //不可更改 除非你和下面的函数还有“P8S Souma 蛇 菓子12点起顺时针”中的snakeMap逻辑一起改 还有Map
  function getOppositeMarker(m1, m2) {
    switch (m1 + m2) {
      case "AB":
        return [..."CD"];
      case "AC":
        return [..."BD"];
      case "AD":
        return [..."BC"];
      case "BC":
        return [..."AD"];
      case "BD":
        return [..."AC"];
      case "CD":
        return [..."AB"];
      case "23":
        return [..."41"];
      case "24":
        return [..."31"];
      case "21":
        return [..."34"];
      case "34":
        return [..."21"];
      case "31":
        return [..."24"];
      case "41":
        return [..."23"];
      default:
        throw new Error("蛇优先级处理错误");
    }
  }
  const snakeMarkMap = new Map();
  const left = 89.39;
  const center = 100.0;
  const right = 110.61;
  const top = 85.0; //?
  const bottom = 115.0; //?
  snakeMarkMap.set("1", { X: left, Y: 0, Z: top, Active: true });
  snakeMarkMap.set("A", { X: center, Y: 0, Z: top, Active: true });
  snakeMarkMap.set("2", { X: right, Y: 0, Z: top, Active: true });
  snakeMarkMap.set("D", { X: left, Y: 0, Z: center, Active: true });
  snakeMarkMap.set("B", { X: right, Y: 0, Z: center, Active: true });
  snakeMarkMap.set("4", { X: left, Y: 0, Z: bottom, Active: true });
  snakeMarkMap.set("C", { X: center, Y: 0, Z: bottom, Active: true });
  snakeMarkMap.set("3", { X: right, Y: 0, Z: bottom, Active: true });
  function getDirection(marker) {
    return (
      {
        A: "上",
        1: "左上",
        D: "左",
        4: "左下",
        C: "下",
        3: "右下",
        B: "右",
        2: "右上",
      }?.[marker] ?? ""
    );
  }
  Options.Triggers.push({
    zoneId: ZoneId.AbyssosTheEighthCircleSavage,
    initData: () => {
      if (!location.href.includes("raidemulator.html")) {
        callOverlayHandler({
          call: "PostNamazu",
          c: "DoQueueActions",
          p: JSON.stringify([
            { c: "stop", p: "P8S Souma Public Queue Mark", d: 0 },
            { c: "DoWaymarks", p: "load", d: 3000 },
          ]),
        });
      }
      return {
        soumaSettings: {},
        souma隆起收集组: [],
        souma大蛇大圈RP: [],
        souma大蛇分摊RP: [],
        souma蛇正斜: null,
        souma蛇位置: [],
        souma蛇收集单独: [],
        souma本体紫色: [],
        souma逆反: [],
        souma冰火: 0,
        souma灰烬: 0,
        souma狂暴: [],
        souma狂暴塔坐标: [],
        soumaConcept: {},
        soumaSplicer: {},
        soumaSeenFirstTankAutos: null,
        soumaArcaneChannelCount: 0,
        soumaArcaneChannelColor: new Set(),
        soumaHighConceptCount: 0,
        soumaNoBuffNames: [],
        soumaSeenSnakeIllusoryCreation: false,
        soumaSnakecombatantData: [],
        souma开大车2: [],
      };
    },
    timelineTriggers: [
      {
        id: "P8S Souma Tank Cleave Autos",
        regex: /--auto--/,
        beforeSeconds: 8,
        suppressSeconds: 20,
        run: (data) => (data.soumaSeenFirstTankAutos = true),
      },
    ],
    triggers: [
      {
        id: "P8S Souma 全局设置",
        netRegex: NetRegexes.startsUsing({ capture: false }),
        suppressSeconds: 1800,
        infoText: "",
        sound: "",
        soundVolume: 0,
        run: (data, _matches, output) => {
          data.soumaFL.doQueueActions([{ c: "DoWaymarks", p: "save", d: 0 }]);
          function handleSettings(value) {
            switch (value.toLowerCase()) {
              case "true":
              case "1":
              case "是":
              case "开":
                return true;
              case "false":
              case "0":
              case "否":
              case "关":
                return false;
              default:
                return value;
            }
          }
          for (const key in defaultSettings) data.soumaSettings[key] = handleSettings(output[key]());
          // console.log("Souma Settings Loaded: " + JSON.stringify(data.soumaSettings));
        },
        outputStrings: {
          ...defaultSettings,
        },
      },
      {
        id: "P8S Souma 方向文本覆盖",
        netRegex: NetRegexes.startsUsing({ capture: false }),
        suppressSeconds: 1800,
        infoText: "",
        sound: "",
        soundVolume: 0,
        run: (_data, _matches, output) => {
          Outputs.north.cn = output.north();
          Outputs.east.cn = output.east();
          Outputs.south.cn = output.south();
          Outputs.west.cn = output.west();
          Outputs.dirN.cn = output.north();
          Outputs.dirE.cn = output.east();
          Outputs.dirS.cn = output.south();
          Outputs.dirW.cn = output.west();
          Outputs.dirNE.cn = output.dirNE();
          Outputs.dirSE.cn = output.dirSE();
          Outputs.dirSW.cn = output.dirSW();
          Outputs.dirNW.cn = output.dirNW();
        },
        outputStrings: {
          north: { en: "上" },
          east: { en: "右" },
          south: { en: "下" },
          west: { en: "左" },
          dirNE: { en: "右上" },
          dirSE: { en: "右下" },
          dirSW: { en: "左下" },
          dirNW: { en: "左上" },
        },
      },
      {
        id: "P8S Footprint",
        type: "Ability",
        netRegex: { id: "794B", capture: false },
        delaySeconds: 1.5,
        response: Responses.knockback(),
        run: (data) => {
          data.soumaFL.clearMark(data.soumaSettings.隆起数字仅本地标点);
        },
      },
      {
        id: "P8S Snaking Kick",
        type: "StartsUsing",
        netRegex: { id: "794C", capture: false },
        response: Responses.getOut(),
        run: (data) => {
          data.soumaFL.clearMark(data.soumaSettings.小蛇处理顺序仅本地标点 && data.soumaSettings.大蛇大圈仅本地标点 && data.soumaSettings.大蛇分摊仅本地标点);
        },
      },
      {
        id: "P8S Souma 隆起收集",
        netRegex: NetRegexes.ability({ id: "7935" }),
        preRun: (data, matches) => {
          if (!data.soumaSettings.隆起数字标记开关) return;
          data.souma隆起收集组.push(matches.targetId);
          if (data.souma隆起收集组.length === 2) {
            data.soumaFL.mark(data.souma隆起收集组[0], "attack1", data.soumaSettings.隆起数字仅本地标点);
            data.soumaFL.mark(data.souma隆起收集组[1], "bind1", data.soumaSettings.隆起数字仅本地标点);
          } else if (data.souma隆起收集组.length === 4) {
            data.soumaFL.mark(data.souma隆起收集组[2], "attack2", data.soumaSettings.隆起数字仅本地标点);
            data.soumaFL.mark(data.souma隆起收集组[3], "bind2", data.soumaSettings.隆起数字仅本地标点);
          } else if (data.souma隆起收集组.length === 6) {
            data.soumaFL.mark(data.souma隆起收集组[4], "attack3", data.soumaSettings.隆起数字仅本地标点);
            data.soumaFL.mark(data.souma隆起收集组[5], "bind3", data.soumaSettings.隆起数字仅本地标点);
          } else if (data.souma隆起收集组.length === 8) {
            data.soumaFL.mark(data.souma隆起收集组[6], "attack4", data.soumaSettings.隆起数字仅本地标点);
            data.soumaFL.mark(data.souma隆起收集组[7], "attack5", data.soumaSettings.隆起数字仅本地标点);
          }
        },
        sound: "",
        tts: null,
      },
      {
        id: "P8S Souma 隆起后清理头顶标点",
        type: "Ability",
        netRegex: { id: "7935", capture: false },
        delaySeconds: 21,
        suppressSeconds: 30,
        condition: (data) => data.soumaSettings.隆起数字标记开关,
        run: (data) => data.soumaFL.clearMark(data.soumaSettings.隆起数字仅本地标点),
      },
      {
        id: "P8S Souma 蛇 菓子12点起顺时针",
        netRegex: NetRegexes.startsUsing({ id: "792B" }),
        condition: (data) => data.souma蛇位置.length < 2,
        preRun: (data, matches) => {
          data.souma蛇位置.push({ x: matches.x, y: matches.y });
        },
        delaySeconds: 1,
        durationSeconds: 21,
        infoText: (data, _matches, output) => {
          if (data.souma蛇位置.length === 2) {
            const snake = JSON.parse(JSON.stringify([data.souma蛇位置[0], data.souma蛇位置[1]]));
            data.souma蛇位置.length = 10;
            let snakeMap = [];
            snake.map((v) => {
              if (Math.abs(parseInt(v.x) - 110.6) <= 5 && Math.abs(parseInt(v.y) - 110.6) <= 5) snakeMap.push("3");
              else if (Math.abs(parseInt(v.x) - 89.39) <= 5 && Math.abs(parseInt(v.y) - 110.61) <= 5) snakeMap.push("4");
              else if (Math.abs(parseInt(v.x) - 89.39) <= 5 && Math.abs(parseInt(v.y) - 89.39) <= 5) snakeMap.push("1");
              else if (Math.abs(parseInt(v.x) - 110.6) <= 5 && Math.abs(parseInt(v.y) - 89.39) <= 5) snakeMap.push("2");
              else if (Math.abs(parseInt(v.x) - 100) <= 5 && Math.abs(parseInt(v.y) - 85) <= 5) snakeMap.push("A");
              else if (Math.abs(parseInt(v.x) - 115) <= 5 && Math.abs(parseInt(v.y) - 100) <= 5) snakeMap.push("B");
              else if (Math.abs(parseInt(v.x) - 100) <= 5 && Math.abs(parseInt(v.y) - 115) <= 5) snakeMap.push("C");
              else if (Math.abs(parseInt(v.x) - 85) <= 5 && Math.abs(parseInt(v.y) - 100) <= 5) snakeMap.push("D");
            });
            snakeMap.sort((a, b) => 蛇标点优先级.indexOf(a) - 蛇标点优先级.indexOf(b));
            snakeMap.push(...getOppositeMarker(...snakeMap));
            const 石 = data.souma蛇收集单独.filter((v) => v.effectId === "D17").sort(rpSort());
            const 炸 = data.souma蛇收集单独.filter((v) => v.effectId === "CFE").sort(rpSort());
            const res = [
              { 点: snakeMap[0], 组: 1, 喷: 石[0].rp, 炸: 炸[0].rp },
              { 点: snakeMap[1], 组: 1, 喷: 石[1].rp, 炸: 炸[1].rp },
              { 点: snakeMap[2], 组: 2, 喷: 石[2].rp, 炸: 炸[2].rp },
              { 点: snakeMap[3], 组: 2, 喷: 石[3].rp, 炸: 炸[3].rp },
            ];
            if (data.soumaSettings.小蛇场地标点) {
              const arr = res.map((v) => snakeMarkMap.get(v.点));
              const arr2 = arr.map((v) => {
                const multiple = parseFloat(data.soumaSettings.小蛇场地标点缩放);
                const x = v.X > 100 ? 100 + (v.X - 100) * multiple : 100 - (100 - v.X) * multiple;
                const z = v.Z > 100 ? 100 + (v.Z - 100) * multiple : 100 - (100 - v.Z) * multiple;
                return {
                  X: x,
                  Y: 0.0,
                  Z: z,
                  Active: true,
                };
              });
              const firstSnake = arr2.slice(0, 2);
              const thenSnake = arr2.slice(2, 4);
              data.soumaFL.doQueueActions([
                { c: "qid", p: "P8S Souma Public Queue Mark", d: 0 },
                { c: "DoWaymarks", p: { One: firstSnake[0], Two: firstSnake[1] }, d: 0 },
                { c: "DoWaymarks", p: { One: thenSnake[0], Two: thenSnake[1] }, d: 9000 },
                { c: "DoWaymarks", p: "load", d: 13000 },
              ]);
            }
            const 我喷 = res.find((v) => data.soumaFL.getNameByRp(data, v.喷) === data.me);
            const 我炸 = res.find((v) => data.soumaFL.getNameByRp(data, v.炸) === data.me);
            if (我喷) {
              return output.石化({ i: 我喷.组, way: getDirection(我喷.点), mark: 我喷.点 });
            } else if (我炸) {
              return output.炸毒({ i: 我炸.组, way: getDirection(我炸.点), mark: 我炸.点 });
            }
            function rpSort() {
              return function (a, b) {
                if (Number(a.duration) === Number(b.duration)) {
                  return (
                    data.soumaSettings.一蛇顺位.split("/").indexOf(data.soumaFL.getRpByName(data, a.name)) -
                    data.soumaSettings.一蛇顺位.split("/").indexOf(data.soumaFL.getRpByName(data, b.name))
                  );
                }
                return Number(a.duration) - Number(b.duration);
              };
            }
          }
        },
        outputStrings: {
          石化: { en: "第${i}轮 石化${way}${mark}点" },
          炸毒: { en: "第${i}轮 去炸${way}${mark}点" },
        },
      },
      {
        id: "P8S Souma 蛇debuff收集者",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D17", "CFE"] }),
        preRun: (data, matches) => {
          data.souma蛇收集单独.push({
            rp: data.soumaFL.getRpByName(data, matches.target),
            id: matches.targetId,
            name: matches.target,
            effectId: matches.effectId,
            duration: matches.duration,
          });
        },
      },
      {
        id: "P8S Souma 小蛇优先级标点",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D17", "CFE"] }),
        delaySeconds: 0.5,
        suppressSeconds: 999,
        run: (data) => {
          if (data.soumaSettings.小蛇处理顺序标点 && data.souma蛇位置.length === 0) {
            const local = data.soumaSettings.小蛇处理顺序仅本地标点;
            const 石 = data.souma蛇收集单独.filter((v) => v.effectId === "D17").sort(rpSort());
            const 炸 = data.souma蛇收集单独.filter((v) => v.effectId === "CFE").sort(rpSort());
            function rpSort() {
              return function (a, b) {
                if (Number(a.duration) === Number(b.duration)) {
                  return (
                    data.soumaSettings.一蛇顺位.split("/").indexOf(data.soumaFL.getRpByName(data, a.name)) -
                    data.soumaSettings.一蛇顺位.split("/").indexOf(data.soumaFL.getRpByName(data, b.name))
                  );
                }
                return Number(a.duration) - Number(b.duration);
              };
            }
            data.soumaFL.doQueueActions([
              { c: "qid", p: "P8S Souma Public Queue Mark", d: 0 },
              { c: "mark", p: { ActorID: parseInt(石[0].id, 16), MarkType: "attack1", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(石[1].id, 16), MarkType: "attack2", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(炸[0].id, 16), MarkType: "bind1", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(炸[1].id, 16), MarkType: "bind2", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(石[2].id, 16), MarkType: "attack1", LocalOnly: local }, d: 23000 },
              { c: "mark", p: { ActorID: parseInt(石[3].id, 16), MarkType: "attack2", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(炸[2].id, 16), MarkType: "bind1", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(炸[3].id, 16), MarkType: "bind2", LocalOnly: local }, d: 0 },
              { c: "DoTextCommand", p: "/mk off <1>", d: 9000 },
              { c: "DoTextCommand", p: "/mk off <2>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <3>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <4>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <5>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <6>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <7>", d: 0 },
              { c: "DoTextCommand", p: "/mk off <8>", d: 0 },
            ]);
          }
        },
      },
      {
        id: "P8S Souma 蛇石化debuff处理",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D17"] }),
        condition: Conditions.targetIsYou(),
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "石化" } },
      },
      {
        id: "P8S Souma 蛇爆炸debuff处理",
        netRegex: NetRegexes.gainsEffect({ effectId: ["CFE"] }),
        condition: Conditions.targetIsYou(),
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "炸毒" } },
      },
      {
        id: "P8S Souma 蛇正斜",
        netRegex: NetRegexes.addedCombatantFull({ npcBaseId: "15052" }),
        suppressSeconds: 1,
        promise: async (data, matches) => {
          data.souma蛇正斜 = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [parseInt(matches.id, 16)],
            })
          ).combatants[0];
        },
        infoText: (data, _matches, output) => {
          if (data.souma蛇正斜.PosX == 100 || data.souma蛇正斜.PosY == 100) return output.正点();
          return output.斜点();
        },
        outputStrings: {
          正点: { en: "正点蛇" },
          斜点: { en: "斜点蛇" },
        },
      },
      {
        id: "P8S Souma 小蛇清理标点",
        netRegex: NetRegexes.addedCombatantFull({ npcBaseId: "15052" }),
        suppressSeconds: 9999,
        run: (data) => {
          if (data.soumaSettings.小蛇场地标点) {
            data.soumaFL.doQueueActions([
              { c: "DoWaymarks", p: "save", d: 0 },
              { c: "DoWaymarks", p: "clear", d: 500 },
            ]);
          }
        },
      },
      {
        id: "P8S Souma Gains Effects 大蛇大圈提醒",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D18"] }),
        condition: (data, matches) => matches.target === data.me,
        delaySeconds: (_data, matches) => Number(matches.duration) - 4,
        alarmText: (_data, _matches, output) => output.text(),
        outputStrings: { text: { en: "去蛇后" } },
      },
      {
        id: "P8S Souma Gains Effects 大蛇大圈",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D18"] }),
        preRun: (data, matches) => {
          data.souma大蛇大圈RP.push(data.soumaFL.getRpByName(data, matches.target));
        },
        // delaySeconds: ,
        run: (data) => {
          if (data.souma大蛇大圈RP.length === 2) {
            const 优先级 = data.soumaSettings.大蛇debuff优先级.split("/");
            data.souma大蛇大圈RP.sort((a, b) => 优先级.findIndex((v) => v === a) - 优先级.findIndex((v) => v === b));
            if (data.soumaSettings.大蛇大圈标记开关) {
              const ids = data.souma大蛇大圈RP.map((v) => data.soumaFL.getHexIdByRp(data, v));
              data.soumaFL.mark(ids[0], "stop1", data.soumaSettings.大蛇大圈仅本地标点);
              data.soumaFL.mark(ids[1], "stop2", data.soumaSettings.大蛇大圈仅本地标点);
            }
          }
        },
      },
      {
        id: "P8S Souma Gains Effects 大蛇分摊",
        netRegex: NetRegexes.gainsEffect({ effectId: ["CFF"] }),
        preRun: (data, matches) => {
          data.souma大蛇分摊RP.push(data.soumaFL.getRpByName(data, matches.target));
        },
        // delaySeconds: 28,
        run: (data) => {
          if (data.souma大蛇分摊RP.length === 2) {
            const 优先级 = data.soumaSettings.大蛇debuff优先级.split("/");
            data.souma大蛇分摊RP.sort((a, b) => 优先级.findIndex((v) => v === a) - 优先级.findIndex((v) => v === b));
            if (data.soumaSettings.大蛇分摊标记开关) {
              const ids = data.souma大蛇分摊RP.map((v) => data.soumaFL.getHexIdByRp(data, v));
              data.soumaFL.mark(ids[0], "bind1", data.soumaSettings.大蛇分摊仅本地标点);
              data.soumaFL.mark(ids[1], "bind2", data.soumaSettings.大蛇分摊仅本地标点);
            }
          }
        },
      },
      {
        id: "P8S Souma Gains Effects 大蛇结束清理标记",
        netRegex: NetRegexes.gainsEffect({ effectId: ["CFF"] }),
        delaySeconds: 39,
        condition: (data) => data.soumaSettings.大蛇分摊标记开关 || data.soumaSettings.大蛇大圈标记开关,
        run: (data) => data.soumaFL.clearMark(data.soumaSettings.大蛇分摊仅本地标点 && data.soumaSettings.大蛇大圈仅本地标点),
      },
      {
        id: "P8S Snake 2 Illusory Creation",
        type: "StartsUsing",
        netRegex: { id: "7931", capture: false },
        run: (data) => (data.soumaSeenSnakeIllusoryCreation = true),
      },
      {
        id: "P8S Gorgospit Location",
        type: "StartsUsing",
        netRegex: { id: "7932" },
        condition: (data) => data.soumaSeenSnakeIllusoryCreation,
        durationSeconds: 5,
        promise: async (data, matches) => {
          data.soumaSnakecombatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [parseInt(matches.sourceId, 16)],
            })
          ).combatants;
        },
        alertText: (data, _matches, output) => {
          const combatant = data.soumaSnakecombatantData[0];
          if (combatant === undefined || data.soumaSnakecombatantData.length !== 1) return;
          const x = combatant.PosX;
          const y = combatant.PosY;
          const epsilon = 3;
          const povRP = data.soumaFL.getRpByName(data, data.me);
          const finallyDecideWhereToGo = (() => {
            if (data.souma大蛇分摊RP[0] === povRP || data.souma大蛇大圈RP[0] === povRP) return "1";
            if (data.souma大蛇分摊RP[1] === povRP || data.souma大蛇大圈RP[1] === povRP) return "2";
            return output.去左或上的人().split("/").includes(povRP) ? "1" : "2";
          })();
          const doStr = data.souma大蛇大圈RP.includes(povRP) ? "蛇后" : "分摊";
          if (Math.abs(x - 100) < epsilon) return output["eastWest" + finallyDecideWhereToGo]({ do: doStr });
          if (Math.abs(y - 100) < epsilon) return output["northSouth" + finallyDecideWhereToGo]({ do: doStr });
          if (Math.abs(x - 90) < epsilon) return output["east" + finallyDecideWhereToGo]({ do: doStr });
          if (Math.abs(x - 110) < epsilon) return output["west" + finallyDecideWhereToGo]({ do: doStr });
          if (Math.abs(y - 90) < epsilon) return output["south" + finallyDecideWhereToGo]({ do: doStr });
          if (Math.abs(y - 110) < epsilon) return output["north" + finallyDecideWhereToGo]({ do: doStr });
        },
        outputStrings: {
          去左或上的人: { en: ["MT", "ST", "H1", "H2"].join("/") },
          northSouth1: { en: "上下，去上${do}" },
          northSouth2: { en: "上下，去下${do}" },
          eastWest1: { en: "左右，去左${do}" },
          eastWest2: { en: "左右，去右${do}" },
          north1: { en: "上半场，去左${do}" },
          north2: { en: "上，去右${do}" },
          east1: { en: "右，去上${do}" },
          east2: { en: "右，去下${do}" },
          west1: { en: "左，去上${do}" },
          west2: { en: "左，去下${do}" },
          south1: { en: "下，去左${do}" },
          south2: { en: "下，去右${do}" },
        },
      },

      {
        id: "P8S Souma 四连判定黑条击退收集",
        netRegex: NetRegexes.ability({ id: "793B" }),
        run: (data, matches) => {
          const i = data.souma开大车2.findIndex((v) => v === "黑线击退");
          if (matches.x === "100.00") data.souma开大车2[i] = "左右黑线击退";
          else if (matches.y === "100.00") data.souma开大车2[i] = "上下黑线击退";
        },
      },
      {
        id: "P8S Souma 四连判定大击退",
        netRegex: NetRegexes.ability({ id: "793C" }),
        run: (data, matches) => {
          const i = data.souma开大车2.findIndex((v) => v === "大击退");
          if (matches.x === "100.00" && matches.y === "80.00") data.souma开大车2[i] = "A点大击退";
          else if (matches.x === "120.00" && matches.y === "100.00") data.souma开大车2[i] = "B点大击退";
          else if (matches.x === "100.00" && matches.y === "120.00") data.souma开大车2[i] = "C点大击退";
          else if (matches.x === "80.00" && matches.y === "100.00") data.souma开大车2[i] = "D点大击退";
        },
      },
      {
        id: "P8S Souma 四连判定大钢铁",
        netRegex: NetRegexes.ability({ id: "793D" }),
        run: (data, matches) => {
          const i = data.souma开大车2.findIndex((v) => v === "大钢铁");
          if (matches.x === "100.00" && matches.y === "80.00") data.souma开大车2[i] = "A点大钢铁";
          else if (matches.x === "120.00" && matches.y === "100.00") data.souma开大车2[i] = "B点大钢铁";
          else if (matches.x === "100.00" && matches.y === "120.00") data.souma开大车2[i] = "C点大钢铁";
          else if (matches.x === "80.00" && matches.y === "100.00") data.souma开大车2[i] = "D点大钢铁";
        },
      },
      {
        id: "P8S Souma 四连读条行",
        netRegex: NetRegexes.startsUsing({ id: ["793B", "793D", "793B", "793C"] }),
        condition: (_data, matches) => matches.sourceId[0] === "4",
        preRun: (data, matches) => {
          let res = "";
          switch (matches.id) {
            case "793B":
              res = "黑线击退";
              break;
            case "793C":
              res = "大击退";
              break;
            case "793D":
              res = "大钢铁";
              break;
          }
          data.souma开大车2.push(res);
        },
      },
      {
        id: "P8S Souma 开大车是吧", //sb机制真难搞
        netRegex: NetRegexes.ability({ id: ["793B", "793D", "793B", "793C"] }),
        delaySeconds: 0.5,
        condition: (data) => data.souma开大车2.length === 4,
        durationSeconds: 15,
        infoText: (data, _matches, output) => {
          const res = new Array(2);
          const 大钢铁 = data.souma开大车2.findIndex((v) => /大钢铁$/.test(v));
          const 大击退 = data.souma开大车2.findIndex((v) => /大击退$/.test(v));
          const 大钢铁标点 = data.souma开大车2[大钢铁][0];
          const 大击退标点 = data.souma开大车2[大击退][0];
          if (大钢铁 < 大击退) {
            //先钢铁
            if (大钢铁标点 === "B") res[0] = output.开始黑线击退({ mark: "D" });
            if (大钢铁标点 === "D") res[0] = output.开始黑线击退({ mark: "B" });
            if (大击退标点 === "A") res[1] = output.先碎击再击退({ mark1: 大钢铁标点 === "B" ? "1" : "2", mark2: "A" });
            if (大击退标点 === "C") res[1] = output.先碎击再击退({ mark1: 大钢铁标点 === "B" ? "4" : "3", mark2: "C" });
          }
          if (大钢铁 > 大击退) {
            //先击退
            if (大击退标点 === "B") res[0] = output.开始黑线击退({ mark: "B" });
            if (大击退标点 === "D") res[0] = output.开始黑线击退({ mark: "D" });
            if (大钢铁标点 === "A") res[1] = output.先击退再碎击({ mark1: 大击退标点, mark2: "C" });
            if (大钢铁标点 === "C") res[1] = output.先击退再碎击({ mark1: 大击退标点, mark2: "A" });
          }
          return res[0] + res[1];
        },
        tts: null,
        outputStrings: {
          开始黑线击退: { en: "" },
          先击退再碎击: { en: "${mark1} => ${mark2}" },
          先碎击再击退: { en: "稍后 => ${mark2}" },
        },
      },
      // 以下本体
      {
        id: "P8S Souma 本体紫色buff回收",
        type: "GainsEffect",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        suppressSeconds: 1,
        delaySeconds: 48,
        run: (data) => {
          data.souma本体紫色 = [];
          if (data.soumaSettings.冰火标记开关) data.soumaFL.clearMark(data.soumaSettings.冰火标记仅本地标点);
        },
      },
      {
        id: "P8S Souma 本体紫色buff收集",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        preRun: (data, matches) => {
          data.souma本体紫色.push(matches.target);
          data.soumaFL.doQueueActions([{ c: "DoWaymarks", p: "save", d: 0 }]);
        },
      },
      {
        id: "P8S Souma 本体紫色buff提前清理头顶标记",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        suppressSeconds: 1,
        run: (data) => {
          data.soumaFL.clearMark(data.soumaSettings.冰火标记仅本地标点);
        },
      },
      {
        id: "P8S Souma 本体紫色buff立即提醒",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        suppressSeconds: 1,
        delaySeconds: 0.5,
        infoText: (data, _matches, output) => {
          if (data.souma本体紫色.length === 2) {
            const jobSort =
              data.soumaSettings.冰火打法切换 === "菓子"
                ? ["MT", "ST", "H1", "H2", "D1", "D2", "D3", "D4"]
                : [
                    ...data.soumaSettings.扫码特制究极缝合式冰火动脑人优先级.split("/"),
                    ...data.soumaSettings.扫码特制究极缝合式冰火动脑人补位优先级与站位无关.split("/"),
                  ];
            const resArr = data.souma本体紫色.map((v) => data.soumaFL.getRpByName(data, v)).sort((a, b) => jobSort.indexOf(a) - jobSort.indexOf(b));
            return output.text({ rp1: resArr[0], rp2: resArr[1] });
          }
        },
        outputStrings: {
          text: { en: "紫圈：${rp1}/${rp2}" },
        },
      },
      {
        id: "P8S Souma 本体紫色buff排序",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        condition: (data) => data.soumaSettings.冰火打法切换 === "菓子",
        delaySeconds: 25,
        durationSeconds: 18,
        suppressSeconds: 1,
        infoText: (data, _matches, output) => {
          const purpleRole = data.party.nameToRole_[data.souma本体紫色[0]] === "dps" ? "dps" : "tn";
          const povRole = data.role === "dps" ? "dps" : "tn";
          const sortArr = purpleRole === "dps" ? data.soumaSettings.冰火优先级DPS.split("/") : data.soumaSettings.冰火优先级TN.split("/");
          const purplesRP = data.souma本体紫色.map((v) => data.soumaFL.getRpByName(data, v));
          const surplusRP = sortArr.filter((v) => !purplesRP.includes(v));
          const purplesNames = surplusRP.map((v) => data.soumaFL.getNameByRp(data, v));
          if (data.soumaSettings.冰火标记开关) {
            const purplesIDs = surplusRP.map((v) => data.soumaFL.getHexIdByRp(data, v));
            data.soumaFL.mark(purplesIDs[0], "attack1", data.soumaSettings.冰火标记仅本地标点);
            data.soumaFL.mark(purplesIDs[1], "attack2", data.soumaSettings.冰火标记仅本地标点);
          }
          if (data.souma本体紫色.includes(data.me)) return output.purpleGroup();
          if (purpleRole !== povRole) return output.anencephaly();
          else {
            if (purplesNames[0] === data.me) return output.动脑高优先级();
            else if (purplesNames[1] === data.me) return output.动脑低优先级();
          }
        },
        outputStrings: {
          anencephaly: { en: "无脑组 固定站位" },
          purpleGroup: { en: "紫圈 去中间" },
          动脑高优先级: { en: "动脑组 高优先级" },
          动脑低优先级: { en: "动脑组 低优先级" },
        },
      },
      {
        id: "P8S Souma 本体紫色buff排序 扫码究极缝合式text",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        condition: (data) => data.soumaSettings.冰火打法切换 !== "菓子",
        delaySeconds: 1,
        suppressSeconds: 1,
        run: (data, _matches, output) => {
          const brains = data.soumaSettings.扫码特制究极缝合式冰火动脑人优先级.split("/");
          const needHelps = data.soumaSettings.扫码特制究极缝合式冰火动脑人补位优先级与站位无关.split("/");
          let queue = [];
          const purples2 = data.souma本体紫色.map((v) => data.soumaFL.getRpByName(data, v));
          const brains2 = brains.filter((v) => !purples2.includes(v));
          purples2
            .filter((v) => !brains.includes(v))
            .sort((a, b) => needHelps.indexOf(a) - needHelps.indexOf(b))
            .map((p, i) => {
              const b = brains2[i];
              queue.push({
                c: "doTextCommand",
                p: `/${data.soumaSettings.冰火缝合式发宏的频道} ${output.text({ b, p })}`,
                d: i === 0 ? 0 : 100,
              });
            });
          data.soumaFL.doQueueActions(queue, "扫码究极缝合式");
        },
        outputStrings: {
          text: { en: "${b}补${p}" },
        },
      },
      {
        id: "P8S Souma 本体紫色buff排序 扫码究极缝合式",
        netRegex: NetRegexes.gainsEffect({ effectId: "D54" }),
        condition: (data) => data.soumaSettings.冰火打法切换 !== "菓子",
        delaySeconds: 25,
        durationSeconds: 22,
        suppressSeconds: 1,
        response: (data, _matches, output) => {
          const needHelps = data.soumaSettings.扫码特制究极缝合式冰火动脑人补位优先级与站位无关.split("/");
          const purples = data.souma本体紫色.map((v) => data.soumaFL.getRpByName(data, v)).sort((a, b) => needHelps.indexOf(a) - needHelps.indexOf(b));
          const povRP = data.soumaFL.getRpByName(data, data.me);
          const brains = data.soumaSettings.扫码特制究极缝合式冰火动脑人优先级.split("/");
          const purplesHelps = purples.filter((v) => !brains.includes(v)).sort((a, b) => needHelps.indexOf(a) - needHelps.indexOf(b));
          if (purples.includes(povRP)) return { infoText: output.purple() };
          else if (needHelps.includes(povRP)) return { infoText: output[povRP]() };
          else {
            const repairRP = purplesHelps.length === 1 ? purplesHelps[0] : purplesHelps[brains[0] === povRP ? 0 : 1];
            return {
              infoText: output.repair({
                rp: repairRP,
                text: output[repairRP](),
              }),
              tts: output.repairTTS({
                rp: repairRP,
              }),
            };
          }
        },
        outputStrings: {
          purple: { en: "紫圈站安全格中间" },
          MT: { en: "" },
          ST: { en: "" },
          H1: { en: "左侧黑线" },
          H2: { en: "场中黑线" },
          D1: { en: "左侧偏左" },
          D2: { en: "左侧偏左 火垂直出" },
          D3: { en: "火左垂直黑线 冰场中偏右" },
          D4: { en: "去场中偏右" },
          repair: { en: "补${rp}：${text}" },
          repairTTS: { en: "补${rp}" },
        },
      },
      {
        id: "P8S Souma 冰火",
        regex: /^(?<stamptime>.+) StatusAdd 1A:9F8:[^:]*:9999\.00:E0000000::1.{7}:(?<target>[^:]*?):(?<count>[^:]*?):/i,
        delaySeconds: (data) => (data.souma冰火 % 2 === 0 ? 0 : 6),
        durationSeconds: 12,
        infoText: (data, matches, output) => {
          const firstStr = data.souma冰火 % 2 === 0 ? output.first() : output.then();
          const violation = data.souma逆反.includes(matches.target);
          const 分散Str = data.souma本体紫色.includes(data.me) ? output.紫色分散() : output.分散();
          const 分摊Str = data.souma本体紫色.includes(data.me) ? output.紫色分摊() : output.分摊();
          const iceStr = output.ice();
          const fireStr = output.fire();
          switch (matches.count.toUpperCase()) {
            case "1E0":
            case "1E3":
              return firstStr + (!violation ? 分散Str : 分摊Str);
            case "1E1":
            case "1E2":
              return firstStr + (!violation ? 分摊Str : 分散Str);
            case "1DC":
            case "1DF":
              const res1 = !violation ? iceStr : fireStr;
              return firstStr + res1;
            case "1DD":
            case "1DE":
              const res2 = !violation ? fireStr : iceStr;
              return firstStr + res2;
          }
        },
        run: (data) => data.souma冰火++,
        outputStrings: {
          first: { en: "" },
          then: { en: "" },
          ice: { en: "冰冰冰" },
          fire: { en: "火火火" },
          分散: { en: "散开" },
          分摊: { en: "分摊" },
          紫色分散: { en: "散开" },
          紫色分摊: { en: "远离人群" },
        },
      },
      {
        id: "P8S Souma 逆反debuff",
        netRegex: NetRegexes.gainsEffect({ effectId: ["D15"] }),
        preRun: (data, matches) => {
          data.souma逆反.push(matches.target);
        },
      },
      {
        id: "P8S Limitless Desolation",
        type: "StartsUsing",
        netRegex: { id: "75ED", capture: false },
        response: Responses.spread("alert"),
        run: (data) => {
          data.soumaFL.clearMark(data.soumaSettings.灰烬标点仅本地标点);
        },
      },
      {
        id: "P8S Souma 灰烬 1",
        netRegex: NetRegexes.ability({ id: "75F0" }),
        condition: (_data, matches) => matches.targetId[0] === "1",
        suppressSeconds: 1,
        preRun: (data) => data.souma灰烬++,
      },
      {
        id: "P8S Souma 灰烬 2",
        netRegex: NetRegexes.ability({ id: "75F0" }),
        condition: (_data, matches) => matches.targetId[0] === "1",
        run: (data, matches) => {
          let m = data.soumaFL.getpartyNamesGroupAllDps(data).includes(matches.target) ? "attack" : "bind";
          m = m + data.souma灰烬;
          if (m === "bind4") m = "attack5";
          if (data.soumaSettings.灰烬标点开关) data.soumaFL.mark(matches.targetId, m, data.soumaSettings.灰烬标点仅本地标点);
          if (m === "attack5") {
            let queue = [{ c: "qid", p: "P8S Souma Public Queue Mark", d: 12000 }];
            if (data.soumaSettings.灰烬标点仅本地标点) {
              queue.push(
                ...[
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "attack1", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "attack2", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "attack3", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "attack4", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "attack5", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "bind1", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "bind2", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "bind3", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "stop1", LocalOnly: true } },
                  { c: "mark", p: { ActorID: 0xe000000, MarkType: "stop2", LocalOnly: true } },
                ],
              );
            } else {
              queue.push(
                ...[
                  { c: "DoTextCommand", p: "/mk off <1>" },
                  { c: "DoTextCommand", p: "/mk off <2>" },
                  { c: "DoTextCommand", p: "/mk off <3>" },
                  { c: "DoTextCommand", p: "/mk off <4>" },
                  { c: "DoTextCommand", p: "/mk off <5>" },
                  { c: "DoTextCommand", p: "/mk off <6>" },
                  { c: "DoTextCommand", p: "/mk off <7>" },
                  { c: "DoTextCommand", p: "/mk off <8>" },
                ],
              );
            }
            data.soumaFL.doQueueActions(queue);
          }
        },
      },
      {
        id: "P8S Souma 狂暴塔 场地标记",
        type: "StartsUsing",
        netRegex: { id: "79DC" },
        durationSeconds: 5,
        promise: async (data, matches) => {
          const towersPos = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [parseInt(matches.sourceId, 16)],
            })
          )?.combatants?.[0];
          if (!towersPos) throw new Error("获取狂暴塔位置未成功");
          const x = towersPos.PosX;
          const y = towersPos.PosY;
          data.souma狂暴塔坐标.push({ x, y });
        },
        run: (data, _matches) => {
          if (data.souma狂暴塔坐标.length === 4) {
            data.souma狂暴塔坐标.sort((a, b) => a.x - b.x);
            const towers = data.souma狂暴塔坐标.slice();
            if (data.soumaSettings.支配者的一击狂暴踩塔场地本地标点) {
              data.soumaFL.doWaymarks({
                A: {},
                B: {},
                C: {},
                D: {},
                One: { X: towers[0].x, Y: 0, Z: towers[0].y, Active: true },
                Two: { X: towers[1].x, Y: 0, Z: towers[1].y, Active: true },
                Three: { X: towers[2].x, Y: 0, Z: towers[2].y, Active: true },
                Four: { X: towers[3].x, Y: 0, Z: towers[3].y, Active: true },
              });
            }
            data.souma狂暴塔坐标.length = 0;
          }
        },
        tts: null,
      },
      {
        id: "P8S Souma 支配者的一击保存标点",
        type: "StartsUsing",
        netRegex: { id: "79D9" },
        suppressSeconds: 999,
        preRun: (data) => data.soumaFL.placeSave(),
      },
      {
        id: "P8S Souma Dominion",
        type: "StartsUsing",
        netRegex: { id: "79D9", capture: false },
        run: (data) => {
          data.souma狂暴 = [];
          data.soumaFL.clearMark(data.soumaSettings.支配者的一击仅本地标点);
        },
      },
      {
        id: "P8S Souma Orogenic Deformation Hit",
        type: "Ability",
        netRegex: { id: "79DB" },
        preRun: (data, matches) => data.souma狂暴.push(matches.target),
      },
      {
        id: "P8S Souma Orogenic Deformation Not Hit",
        type: "Ability",
        netRegex: { id: "79DB" },
        delaySeconds: 0.5,
        suppressSeconds: 1,
        alertText: (data, _matches) => {
          if (data.soumaSettings.支配者的一击标点开关) {
            const 第1轮塔 = data.party.partyNames_.filter((v) => !data.souma狂暴.includes(v));
            const 第2轮塔 = data.souma狂暴;
            const sortArr = data.soumaSettings.支配者的一击排队优先级.split("/");
            const 第1轮塔RPSorted = 第1轮塔.map((v) => data.soumaFL.getRpByName(data, v)).sort((a, b) => sortArr.indexOf(a) - sortArr.indexOf(b));
            const 第2轮塔RPSorted = 第2轮塔.map((v) => data.soumaFL.getRpByName(data, v)).sort((a, b) => sortArr.indexOf(a) - sortArr.indexOf(b));
            const 第1轮塔IDs = 第1轮塔RPSorted.map((v) => data.soumaFL.getHexIdByRp(data, v));
            const 第2轮塔IDs = 第2轮塔RPSorted.map((v) => data.soumaFL.getHexIdByRp(data, v));
            const local = data.soumaSettings.支配者的一击仅本地标点;
            data.soumaFL.doQueueActions([
              { c: "qid", p: "P8S Souma Public Queue Mark", d: 0 },
              { c: "mark", p: { ActorID: parseInt(第1轮塔IDs[0], 16), MarkType: "attack1", LocalOnly: local }, d: 250 },
              { c: "mark", p: { ActorID: parseInt(第1轮塔IDs[1], 16), MarkType: "attack2", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(第1轮塔IDs[2], 16), MarkType: "attack3", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(第1轮塔IDs[3], 16), MarkType: "attack4", LocalOnly: local }, d: 0 },
              {
                c: "mark",
                p: { ActorID: parseInt(第2轮塔IDs[0], 16), MarkType: "attack1", LocalOnly: local },
                d: 6000,
              },
              { c: "mark", p: { ActorID: parseInt(第2轮塔IDs[1], 16), MarkType: "attack2", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(第2轮塔IDs[2], 16), MarkType: "attack3", LocalOnly: local }, d: 0 },
              { c: "mark", p: { ActorID: parseInt(第2轮塔IDs[3], 16), MarkType: "attack4", LocalOnly: local }, d: 0 },
            ]);
          }
        },
      },
      {
        id: "P8S Inverse Magics",
        netRegex: NetRegexes.gainsEffect({ effectId: "D15" }),
        disable: true,
      },
      {
        id: "P8S Natural Alignment First",
        netRegex: NetRegexes.gainsEffect({ effectId: "9F8" }),
        disable: true,
      },
      {
        id: "P8S Natural Alignment Second",
        netRegex: NetRegexes.ability({ id: ["79C0", "79BF", "79BD", "79BE"] }),
        disable: true,
      },
      {
        id: "P8S Natural Alignment Purple on You",
        netRegex: NetRegexes.gainsEffect({ effectId: "9F8", count: "209" }),
        disable: true,
      },
      {
        id: "P8S Natural Alignment Purple Targets",
        netRegex: NetRegexes.gainsEffect({ effectId: "9F8", count: "209", capture: false }),
        disable: true,
      },
      {
        id: "P8S Souma High Concept Counter",
        type: "StartsUsing",
        netRegex: { id: "79AC", capture: false },
        run: (data) => {
          data.soumaHighConceptCount++;
        },
      },
      {
        id: "P8S Souma High Concept Collect",
        type: "GainsEffect",
        netRegex: { effectId: ["D0[2-79A-F]", "D1[0-3]"] },
        delaySeconds: (data, matches) => (data.soumaNoBuffNames.includes(matches.target) ? 1 : 0),
        run: (data, matches) => {
          const id = matches.effectId;
          const isLong = parseFloat(matches.duration) > 10;
          if (id === "D02") data.soumaConcept[matches.target] = isLong ? "longalpha" : "shortalpha";
          else if (id === "D03") data.soumaConcept[matches.target] = isLong ? "longbeta" : "shortbeta";
          else if (id === "D04") data.soumaConcept[matches.target] = isLong ? "longgamma" : "shortgamma";
          else if (id === "D05") data.soumaConcept[matches.target] = "alpha";
          else if (id === "D06") data.soumaConcept[matches.target] = "beta";
          else if (id === "D07") data.soumaConcept[matches.target] = "gamma";
          else if (id === "D11") data.soumaSplicer[matches.target] = "solosplice";
          else if (id === "D12") data.soumaSplicer[matches.target] = "multisplice";
          else if (id === "D13") data.soumaSplicer[matches.target] = "supersplice";
          else data.soumaConcept[matches.target] = "primal";
        },
      },
      {
        id: "P8S Souma High Concept",
        type: "StartsUsing",
        netRegex: { id: "79AC", capture: false },
        run: (data) => {
          data.soumaConcept = {};
          data.soumaSplicer = {};
          data.soumaNoBuffNames = [];
        },
      },
      {
        id: "P8S Souma High Concept Debuffs",
        type: "GainsEffect",
        netRegex: { effectId: ["D0[2-4]", "D1[1-3]"] },
        delaySeconds: 0.5,
        suppressSeconds: 1,
        durationSeconds: 40,
        response: (data, _matches, output) => {
          for (const p of data.party.partyNames_) if (data.soumaConcept[p] === undefined && data.soumaSplicer[p] === undefined) data.soumaNoBuffNames.push(p);
          const concept = data.soumaConcept[data.me];
          const splicer = data.soumaSplicer[data.me];
          const singleConceptMap = {
            shortalpha: output["shortAlpha" + data.soumaHighConceptCount](),
            longalpha: output["longAlpha" + data.soumaHighConceptCount](),
            shortbeta: output["shortBeta" + data.soumaHighConceptCount](),
            longbeta: output["longBeta" + data.soumaHighConceptCount](),
            shortgamma: output["shortGamma" + data.soumaHighConceptCount](),
            longgamma: output["longGamma" + data.soumaHighConceptCount](),
          };
          if (splicer === undefined) {
            if (concept === undefined) return { alarmText: output.noDebuff() };
            const isShort = concept === "shortalpha" || concept === "shortbeta" || concept === "shortgamma";
            const conceptStr = singleConceptMap[concept];
            if (isShort) return { alarmText: conceptStr };
            return { alertText: conceptStr };
          }
          const splicerMap = {
            solosplice: data.soumaHighConceptCount === 1 ? "" : output["soloSplice" + data.soumaConcept[data.me]](),
            multisplice: output["multiSplice" + (data.soumaHighConceptCount === 1 ? "" : data.soumaConcept[data.me])](),
            supersplice: output.superSplice(),
          };
          const splicerStr = splicerMap[splicer];
          if (concept === undefined) return { infoText: splicerStr };
          else if (concept === "longalpha") return { alertText: output.longAlphaSplicer({ splicer: splicerStr }) };
          else if (concept === "longbeta") return { alertText: output.longBetaSplicer({ splicer: splicerStr }) };
          else if (concept === "longgamma") return { alertText: output.longGammaSplicer({ splicer: splicerStr }) };
          return { alarmText: singleConceptMap[concept] };
        },
        sound: "",
        soundVolume: 0,
        tts: null,
        outputStrings: {
          noDebuff: { en: "无buff：去左上 => 原地贴贴 => 左右刀 => 预站位拉线 => 找风合成" },
          shortAlpha1: {
            en: "短α：去左上 => 左右刀+（合成？/右上挂机+合成？（菓子:下/长短:上））",
          },
          shortAlpha2: { en: "短α：去左上 => 左右刀+（合成：预站位后拉线/未合成右上角待机后右侧合成）" },
          longAlpha1: { en: "长α：去2点 => 左右刀 => 去左上 => 合成？（菓子:上/长短:下）" },
          longAlpha2: { en: "长α：去2点 => 左右刀 => 去左上 => 左侧合成" },
          longAlphaSplicer: { en: "${splicer}" },
          shortBeta1: {
            en: "短β：去左下 => 左右刀+合成？ => 右上挂机+合成？（上）",
          },
          shortBeta2: { en: "短β：去左下 => 左右刀+（合成：预站位后拉线/未合成：右上角待机后右侧合成）" },
          longBeta1: { en: "长β：去3点 => 左右刀 => 去左下 => 合成？（下）" },
          longBeta2: { en: "长β：去2点 => 左右刀 => 去左下 => 左侧合成" },
          longBetaSplicer: { en: "${splicer}" },
          shortGamma1: {
            en: "短γ：去右下 => 左右刀+合成？ => 右上挂机 => 合成？（上）",
          },
          shortGamma2: { en: "短γ：去右下 => 左右刀+场中合成 => 预站位拉线" },
          longGamma1: { en: "长γ：去3点 => 左右刀 => 去右下 => 合成？（下）" },
          longGamma2: { en: "长γ：去2点 => 左右刀 => 去右下 => 右侧合成" },
          longGammaSplicer: { en: "${splicer}" },
          soloSplicelongalpha: { en: "长α+单分摊：去1点 => 左右刀 => 去左上 => 左侧合成" },
          soloSplicelongbeta: { en: "长β+单分摊：去1点 => 左右刀 => 去左下 => 左侧合成" },
          soloSplicelonggamma: { en: "长γ+单分摊：去1点 => 左右刀 => 去右下 => 右侧合成" },
          multiSplice: { en: "双分摊：去2点 => 左右刀 => 吃大圈 => 合成？（菓子:相对/长短:上）" },
          multiSplicelongalpha: { en: "长α+双分摊：去2点 => 左右刀 => 去左上 => 左侧合成" },
          multiSplicelongbeta: { en: "长β+双分摊：去2点 => 左右刀 => 去左下 => 左侧合成" },
          multiSplicelonggamma: { en: "长γ+双分摊：去2点 => 左右刀 => 去右下 => 右侧合成" },
          superSplice: { en: "三分摊：去3点 => 左右刀 => 吃大圈 => 合成？（上）" },
        },
      },
      {
        id: "P8S Souma Arcane Channel Collect",
        type: "MapEffect",
        netRegex: { flags: arcaneChannelFlags },
        condition: (data) => data.soumaSeenFirstTankAutos,
        run: (data, matches) => {
          const colorInt = parseInt(matches.location, 16);
          if (colorInt >= 0x1a && colorInt <= 0x23) data.soumaArcaneChannelColor.add("purple");
          if (colorInt >= 0x24 && colorInt <= 0x2d) data.soumaArcaneChannelColor.add("blue");
          if (colorInt >= 0x2e && colorInt <= 0x37) data.soumaArcaneChannelColor.add("green");
        },
      },
      {
        id: "P8S Souma rcane Channel Color",
        type: "MapEffect",
        netRegex: { flags: arcaneChannelFlags, capture: false },
        condition: (data) => data.soumaArcaneChannelColor.size > 0,
        delaySeconds: 0.1,
        suppressSeconds: 1,
        durationSeconds: 15,
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            colorTowerMergePlayer: { en: "合成${color}塔 (与 ${player})" },
            colorTowerMergeLetter: { en: "合成${color}塔 (与 ${letter})" },
            colorTowerMergePlayers: { en: "合成${color}塔 (与 ${player1} 或 ${player2})" },
            towerMergeLetters: { en: "塔 (与 ${letter1} 或 ${letter2})" },
            towerMergePlayers: { en: "塔 (与 ${player1} 或 ${player2})" },
            colorTowerAvoid: { en: "不参与踩塔（${color}）" },
            cloneTether: { en: "拉线" },
            alpha: { en: "α" },
            beta: { en: "β" },
            gamma: { en: "γ" },
            purple: { en: "雷" },
            blue: { en: "水" },
            green: { en: "风" },
            multisplicepurple: { en: "（雷）一会去左下" },
            supersplicepurple: { en: "（雷）一会去右下" },
            multispliceblue: { en: "（水）一会去左上" },
            superspliceblue: { en: "（水）一会去右下" },
            multisplicegreen: { en: "（风）一会去左上" },
            supersplicegreen: { en: "（风）一会去左下" },
            purpleMacro: { en: "<se.5>雷：2去B 3去C" },
            blueMacro: { en: "<se.5>水：2去A 3去C" },
            greenMacro: { en: "<se.5>风：2去A 3去B" },
          };
          const towerColors = Array.from(data.soumaArcaneChannelColor.keys());
          const [tower1, tower2] = towerColors;
          if (tower1 === undefined) return;
          const myConcept = data.soumaConcept[data.me];
          if (data.soumaArcaneChannelCount === 0 && data.soumaSettings.一运塔发宏) {
            data.soumaFL.doTextCommand(`/${data.soumaSettings.一运塔发宏的频道.toLowerCase()} ${output[tower1 + "Macro"]()}`);
          }
          if (myConcept !== "alpha" && myConcept !== "beta" && myConcept !== "gamma") {
            if (data.soumaArcaneChannelCount !== 3) {
              if (data.soumaSplicer[data.me] === "supersplice" && data.soumaConcept[data.me] === undefined)
                return { infoText: output["supersplice" + tower1]() };
              if (data.soumaSplicer[data.me] === "multisplice" && data.soumaConcept[data.me] === undefined)
                return { infoText: output["multisplice" + tower1]() };
              return { infoText: output.colorTowerAvoid({ color: output[tower1]() }) };
            }
            if (tower2 !== undefined && myConcept === "primal") return { alertText: output.cloneTether() };
            return;
          }
          const towerToConcept = {
            green: ["alpha", "beta"],
            blue: ["alpha", "gamma"],
            purple: ["beta", "gamma"],
          };
          const conceptToPlayers = {
            alpha: [],
            beta: [],
            gamma: [],
          };
          for (const [name, concept] of Object.entries(data.soumaConcept)) {
            if (concept === "alpha" || concept === "beta" || concept === "gamma") conceptToPlayers[concept].push(name);
          }
          if (tower2 === undefined) {
            const color = output[tower1]();
            const concepts = towerToConcept[tower1];
            if (!concepts.includes(myConcept)) return { infoText: output.colorTowerAvoid({ color: color }) };
            const [otherConcept] = [...concepts].filter((x) => x !== myConcept);
            if (otherConcept === undefined) throw new UnreachableCode();
            const [name1, name2] = conceptToPlayers[otherConcept].map((x) => data.ShortName(x));
            if (name1 === undefined)
              return {
                alertText: output.colorTowerMergeLetter({
                  color: color,
                  letter: output[otherConcept](),
                }),
              };
            if (name2 === undefined) return { alertText: output.colorTowerMergePlayer({ color: color, player: name1 }) };
            return {
              alertText: output.colorTowerMergePlayers({
                color: color,
                player1: name1,
                player2: name2,
              }),
            };
          }
          const [doubled, doub2] = perfectedConcepts.filter((x) => conceptToPlayers[x].length === 2);
          if (doub2 !== undefined || doubled === undefined) return;
          if (myConcept === doubled) {
            const [concept1, concept2] = [...perfectedConcepts].filter((x) => x !== myConcept);
            if (concept1 === undefined || concept2 === undefined) throw new UnreachableCode();
            const [name1, name2] = [...conceptToPlayers[concept1], ...conceptToPlayers[concept2]].map((x) => data.ShortName(x));
            if (name1 === undefined || name2 === undefined)
              return {
                alertText: output.towerMergeLetters({
                  letter1: output[concept1](),
                  letter2: output[concept2](),
                }),
              };
            return { alertText: output.towerMergePlayers({ player1: name1, player2: name2 }) };
          }
          const [name1, name2] = conceptToPlayers[doubled].map((x) => data.ShortName(x));
          const [tower] = towerColors.filter((x) => towerToConcept[x].includes(myConcept));
          if (tower === undefined) throw new UnreachableCode();
          const color = output[tower]();
          if (name1 === undefined || name2 === undefined)
            return {
              alertText: output.colorTowerMergeLetter({ color: color, letter: output[doubled]() }),
            };
          return {
            alertText: output.colorTowerMergePlayers({
              color: color,
              player1: name1,
              player2: name2,
            }),
          };
        },
        run: (data) => {
          data.soumaArcaneChannelColor.clear();
          data.soumaArcaneChannelCount++;
        },
      },
      {
        id: "P8S Arcane Channel Color",
        type: "MapEffect",
        netRegex: { flags: arcaneChannelFlags, capture: false },
        disable: true,
      },
      {
        id: "P8S High Concept Debuffs",
        type: "GainsEffect",
        netRegex: { effectId: ["D0[2-4]", "D1[1-3]"], capture: false },
        disabled: true,
      },
    ],
  });
}
