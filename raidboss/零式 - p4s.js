if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
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
  const isRaidEmulator = location.href.includes("raidemulator.html");
  const eviscerationMarker = parseInt("00DA", 16);
  const orangeMarker = parseInt("012F", 16);
  const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
    if (typeof data.decOffset === "undefined") data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
    return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  const pullLineOutputStrings = {
    pullLineNowYou: { en: "Go now!", cn: "拉线拉线" },
    pullLineNowAnother: { en: "${name} pull", cn: "${name}拉" },
  };
  const tetherOutputStrings = {
    purpleTether: {
      en: "Purple Tether",
      cn: "紫线",
    },
    orangeTether: {
      en: "Orange Tether",
      cn: "橙线",
    },
    greenTether: {
      en: "Green Tether",
      cn: "绿线",
    },
    blueTether: {
      en: "Blue Tether",
      cn: "蓝线",
    },
  };
  Options.Triggers.push({
    zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
    initData: () => {
      return { postNamazuTextCommand: false, postNamazumark: false, actHeadmarkers: {} };
    },
    triggers: [
      {
        id: "P4S Bloodrake Store",
        disabled: true,
        netRegex: new RegExp(),
      },
      {
        id: "P4S Inversive Chlamys",
        disabled: true,
        netRegex: new RegExp(),
      },
      {
        id: "P4S Belone Coils",
        disabled: true,
        netRegex: new RegExp(),
      },
      {
        id: "P4S Role Call",
        disabled: true,
        netRegex: new RegExp(),
      },
      {
        id: "P4S Director's Belone",
        disabled: true,
        netRegex: new RegExp(),
      },
      {
        id: "P4S Bloodrake",
        netRegex: NetRegexes.tether({ id: "00A5" }),
        suppressSeconds: 1,
        response: Responses.aoe(),
        preRun: (data) => (data.bloodrakeCounter = (data.bloodrakeCounter ?? 0) + 1),
      },
      {
        id: "P4S 聚血收集器",
        netRegex: NetRegexes.tether({ id: "00A5" }),
        delaySeconds: 0.5,
        infoText: (data, matches) => {
          if (data.bloodrakeCounter <= 2) {
            if (data.bloodrakeIsYourself === undefined) data.bloodrakeIsYourself = 0;
            if (matches.source === data.me) data.bloodrakeIsYourself++; //自己
            if (matches.source === data.me && data.bloodrakeCounter === 2) data.bloodrakeTheSecondTimeIsYourself = true;
          }
        },
      },
      {
        id: "P4S 聚血指示",
        netRegex: NetRegexes.tether({ id: "00A5" }),
        delaySeconds: 1,
        suppressSeconds: 1,
        durationSeconds: 10,
        infoText: (data, _matches, output) => {
          if (data.bloodrakeCounter === 2) {
            if (data?.bloodrakeTheSecondTimeIsYourself) {
              if (data?.bloodrakeIsYourself === 1) {
                if (data.postNamazuTextCommand) {
                  doTextCommand(`/p TN：${data.role !== "dps" ? output.bloodrakeIsYourself01() : output.bloodrakeIsYourself10()}`);
                  doTextCommand(`/p DPS：${data.role !== "dps" ? output.bloodrakeIsYourself10() : output.bloodrakeIsYourself01()}`);
                }
                return output.bloodrakeIsYourself01();
              } //01
              if (data?.bloodrakeIsYourself === 2) {
                if (data.postNamazuTextCommand) {
                  doTextCommand(`/p TN：${data.role !== "dps" ? output.bloodrakeIsYourself11() : output.bloodrakeIsYourself00()}`);
                  doTextCommand(`/p DPS：${data.role !== "dps" ? output.bloodrakeIsYourself00() : output.bloodrakeIsYourself11()}`);
                }
                return output.bloodrakeIsYourself11();
              } //11
            } else {
              if (data?.bloodrakeIsYourself === 0) {
                if (data.postNamazuTextCommand) {
                  doTextCommand(`/p TN：${data.role !== "dps" ? output.bloodrakeIsYourself00() : output.bloodrakeIsYourself11()}`);
                  doTextCommand(`/p DPS：${data.role !== "dps" ? output.bloodrakeIsYourself11() : output.bloodrakeIsYourself00()}`);
                }
                return output.bloodrakeIsYourself00();
              } //00
              if (data?.bloodrakeIsYourself === 1) {
                if (data.postNamazuTextCommand) {
                  doTextCommand(`/p TN：${data.role !== "dps" ? output.bloodrakeIsYourself10() : output.bloodrakeIsYourself01()}`);
                  doTextCommand(`/p DPS：${data.role !== "dps" ? output.bloodrakeIsYourself01() : output.bloodrakeIsYourself10()}`);
                }
                return output.bloodrakeIsYourself10();
              } //10
            }
          }
        },
        outputStrings: {
          bloodrakeIsYourself01: { en: "1 => stay => move", cn: "1点 => 不动 => 拉线" },
          bloodrakeIsYourself11: { en: "2 => stay => stay", cn: "2点 => 不动 => 不动" },
          bloodrakeIsYourself00: { en: "spread => poison => 1 => tethers", cn: "散开接毒 => 1点 => 拉线" },
          bloodrakeIsYourself10: { en: "spread => poison => 2", cn: "散开接毒 => 2点 => 不动" },
        },
      },
      {
        id: "P4S 踩塔职能",
        netRegex: NetRegexes.startsUsing({ id: ["69DE", "69DF", "69E0", "69E1"] }),
        suppressSeconds: 1,
        delaySeconds: 1,
        infoText: (data, matches, output) => {
          if (data.towerRole === undefined) data.towerRole = [];
          data.towerRole.push(matches.id === "69DE" ? ["dps"] : ["tank", "healer"]);
          const towerIsYou = new RegExp(data.role, "i").test(data.towerRole[data.towerRole.length - 1]);
          if (data.towerRole.length === 1) return `${towerIsYou ? output.towerRole11() : output.towerRole10()}`;
          if (data.towerRole.length === 2) return `${towerIsYou ? output.towerRole21() : output.towerRole20()}`;
        },
        outputStrings: {
          towerRole11: { en: "tower", cn: "踩塔" },
          towerRole10: { en: "tethers", cn: "接线" },
          towerRole21: { en: "tower", cn: "踩塔" },
          towerRole20: { en: "spread", cn: "散开" },
        },
      },
      {
        id: "P4S 两次踩塔结束",
        netRegex: NetRegexes.startsUsing({ id: ["69DE", "69DF", "69E0", "69E1"] }),
        condition: (data) => data.bloodrakeCounter === 6,
        delaySeconds: 10,
        suppressSeconds: 1,
        durationSeconds: 20,
        infoText: (data, _matches, output) => {
          if (data.towerRole[1]?.includes(data.role)) {
            if (data.towerRole[0]?.includes(data.role)) {
              if (data.postNamazuTextCommand) {
                doTextCommand(`/p TN：${data.role !== "dps" ? output.towerRoleFinish11() : output.towerRoleFinish00()}`);
                doTextCommand(`/p DPS：${data.role !== "dps" ? output.towerRoleFinish00() : output.towerRoleFinish11()}`);
              }
              return output.towerRoleFinish11(); //11
            } else {
              if (data.postNamazuTextCommand) {
                doTextCommand(`/p TN：${data.role !== "dps" ? output.towerRoleFinish01() : output.towerRoleFinish10()}`);
                doTextCommand(`/p DPS：${data.role !== "dps" ? output.towerRoleFinish10() : output.towerRoleFinish01()}`);
              }
              return output.towerRoleFinish01(); //01
            }
          } else {
            if (data.towerRole[0]?.includes(data.role)) {
              if (data.postNamazuTextCommand) {
                doTextCommand(`/p TN：${data.role !== "dps" ? output.towerRoleFinish10() : output.towerRoleFinish01()}`);
                doTextCommand(`/p DPS：${data.role !== "dps" ? output.towerRoleFinish01() : output.towerRoleFinish10()}`);
              }
              return output.towerRoleFinish10(); //10
            } else {
              if (data.postNamazuTextCommand) {
                doTextCommand(`/p TN：${data.role !== "dps" ? output.towerRoleFinish00() : output.towerRoleFinish11()}`);
                doTextCommand(`/p DPS：${data.role !== "dps" ? output.towerRoleFinish11() : output.towerRoleFinish00()}`);
              }
              return output.towerRoleFinish00(); //00
            }
          }
        },
        outputStrings: {
          towerRoleFinish11: { en: "2 => stay => stay", cn: "2点 => 不动 => 不动" },
          towerRoleFinish01: { en: "1 => stay => tethers", cn: "1点 => 不动 => 拉线" },
          towerRoleFinish10: { en: "poison => 2 => stay", cn: "接毒 => 2点 => 不动" },
          towerRoleFinish00: { en: "poison => 1 => tethers", cn: "接毒 => 1点 => 拉线" },
        },
      },
      {
        id: "P4S Searing Stream",
        netRegex: NetRegexes.startsUsing({ id: "6A2D", capture: false }),
        response: Responses.aoe(),
      },
      {
        id: "P4S Act Tracker",
        netRegex: NetRegexes.startsUsing({ id: ["6A0C", "6EB[4-7]", "6A36"] }),
        run: (data, matches) => {
          const actMap = {
            "6A0C": "1",
            "6EB4": "2",
            "6EB5": "3",
            "6EB6": "4",
            "6EB7": "finale",
            "6A36": "curtain",
          };
          data.act = actMap[matches.id];
          data.actHeadmarkers = {};
          clearMark();
        },
      },
      {
        id: "P4S Ultimate Impulse",
        netRegex: NetRegexes.startsUsing({ id: "6A2C", capture: false }),
        response: Responses.bigAoe(),
        run: (data) => {
          if (data.act === "curtain") clearMark();
        },
      },
      {
        id: "P4S Act One Safe Spots",
        netRegex: NetRegexes.tether({ id: "00AD" }),
        condition: (data) => data.act === "1",
        suppressSeconds: 7,
        infoText: (data, matches, output) => {
          let i = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));
          switch (i) {
            case 4:
            case 5:
              return output.act1OneNSSafe();
            case 6:
            case 7:
              return output.act1OneEWSafe();
          }
        },
        outputStrings: {
          act1OneNSSafe: { en: "N/S safe", cn: "上下安全" },
          act1OneEWSafe: { en: "E/W safe", cn: "左右安全" },
        },
      },
      {
        id: "P4S Act Two Safe Spots",
        netRegex: NetRegexes.tether({ id: "00AD" }),
        condition: (data) => data.act === "2",
        durationSeconds: 25,
        suppressSeconds: 4,
        infoText: (data, matches, output) => {
          let i = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));
          if (i > 0) {
            if (i < 4) return output.act1TwoNSSafe();
            return output.act1twoEWSafe();
          }
        },
        outputStrings: {
          act1TwoNSSafe: {
            en: "N/S safe, Treat A as ahead",
            cn: "上下安全 以A为12点",
          },
          act1twoEWSafe: {
            en: "E/W safe, Treat B as ahead",
            cn: "左右安全 以B为12点",
          },
        },
      },
      // {
      //   id: "P4S Color Headmarker Collector",
      //   netRegex: NetRegexes.headMarker({}),
      //   condition: (data) => data.decOffset === undefined && data.act !== undefined,
      //   run: (data, matches) => {
      //     const id = parseInt(matches.id, 16);
      //     data.colorHeadmarkerIds.push(id);
      //   },
      // },
      // {
      //   id: "P4S Color Headmarkers",
      //   netRegex: NetRegexes.headMarker({}),
      //   condition: (data) => data.act !== undefined,
      //   delaySeconds: (data) => (data.decOffset ? 0 : 0.3),
      //   response: (data, matches, output) => {
      //     output.responseOutputStrings = tetherOutputStrings;
      //     if (!data.decOffset) {
      //       data.colorHeadmarkerIds.sort((a, b) => a - b);
      //       data.decOffset = (data.colorHeadmarkerIds[0] ?? 0) - purpleMarker;
      //     }
      //     if (matches.target === data.me) {
      //       data.myMarker = getHeadmarkerId(data, matches);
      //       const result = {
      //         "012C": output.blueTether(),
      //         "012D": output.purpleTether(),
      //         "012E": output.greenTether(),
      //         "012F": output.orangeTether(),
      //       }[getHeadmarkerId(data, matches)];
      //       return {
      //         infoText: result,
      //         tts: result[0].toString().repeat(3),
      //       };
      //     }
      //   },
      // },
      {
        id: "P4S Act Headmarker Collector",
        netRegex: NetRegexes.headMarker({}),
        condition: (data) => data.act !== undefined,
        run: (data, matches) => {
          data.actHeadmarkers[matches.target] = getHeadmarkerId(data, matches, orangeMarker);
        },
      },
      {
        id: "P4S Act 2 Color Tether",
        netRegex: NetRegexes.tether({ id: "00AC" }),
        condition: (data) => data.act === "2",
        durationSeconds: 20,
        response: (data, matches, output) => {
          if (matches.target !== data.me && matches.source !== data.me) return;
          const id = data.actHeadmarkers[matches.source] ?? data.actHeadmarkers[matches.target];
          if (id === undefined) return;
          const other = data.ShortName(matches.target === data.me ? matches.source : matches.target);
          return {
            alertText: {
              "012D": output.purpleTether({ player: other }),
              "012E": output.greenTether({ player: other }),
              "012F": output.orangeTether({ player: other }),
            }[id],
            infoText: {
              "012D": output?.[`purpleTether${data.role}`]?.(),
              "012E": output?.[`greenTether${data.role}`]?.(),
              "012F": output?.[`orangeTether${data.role}`]?.(),
            }[id],
          };
        },
        outputStrings: {
          purpleTether: { en: "紫 （${player}）" },
          purpleTethertank: { en: "左上 => 12点踩塔 => 3点分摊" },
          purpleTetherhealer: { en: "右下 => 6点踩塔 => 3点踩塔" },
          purpleTetherdps: { en: "" },
          orangeTether: { en: "橙 （${player}）" },
          orangeTethertank: { en: "场中 => 1点分摊 => 3点分摊" },
          orangeTetherhealer: { en: "场中 => 6点分摊 => 9点踩塔" },
          orangeTetherdps: { en: "场中 => 12点分摊 => 优先级3/9点分摊" },
          greenTether: { en: "绿 （${player}）" },
          greenTethertank: { en: "" },
          greenTetherhealer: { en: "" },
          greenTetherdps: { en: "场中 => 6点分摊 => 9点分摊" },
        },
        tts: null,
        sound: "",
        soundVolume: 0,
      },
      // {
      //   id: "P4S 二运橙D收集器",
      //   netRegex: NetRegexes.headMarker({}),
      //   condition: (data, matches) =>
      //     data.act === "2" &&
      //     data.role === "dps" &&
      //     data.party.nameToRole_[matches.target] === "dps" &&
      //     matches.target !== data.me &&
      //     getHeadmarkerId(data, matches) === "012F",
      //   delaySeconds: (data) => (data.role === "dps" ? 0.3 : 0) + (data.decOffset ? 0 : 0.3),
      //   run: (data, matches, _output) => (data.act2OrangeDps = matches.target),
      // },
      // {
      //   id: "P4S 二运",
      //   netRegex: NetRegexes.headMarker({}),
      //   condition: (data) => data.act === "2",
      //   delaySeconds: (data) => (data.role === "dps" ? 0.3 : 0) + 0.3 + (data.decOffset ? 0 : 0.3),
      //   durationSeconds: 18,
      //   infoText: (data, matches, output) => {
      //     let result;
      //     switch (data.role) {
      //       case "tank":
      //         result = data.myMarker === "012D" ? "" : output.act2OrangeTank();
      //         break;
      //       case "healer":
      //         result = data.myMarker === "012D" ? output.act2PurpleHealer() : output.act2OrangeHealer();
      //         break;
      //       case "dps":
      //         result = data.myMarker === "012F" ? output.act2OrangeDps({ name: data.ShortName(data.act2OrangeDps) }) : output.act2GreenDps();
      //         break;
      //     }
      //     if (matches.target === data.me) {
      //       return result;
      //     } else if (data.myMarker === undefined && data.role === "tank") {
      //       data.myMarker = null;
      //       return output.act2PurpleTank();
      //     }
      //   },
      //   sound: "",
      //   soundVolume: 0,
      //   tts: null,
      //   outputStrings: {
      //     act2PurpleTank: {
      //       en: "Pupur: pull => 12 => 3",
      //       cn: "紫：左上拉线 => 12点踩塔 => 3点分摊",
      //     },
      //     act2OrangeTank: {
      //       en: "Orange: stay => 12 => 3",
      //       cn: "橙：场中 => 1点拉线分摊 => 3点分摊",
      //     },
      //     act2PurpleHealer: {
      //       en: "Pupur: pull => 6 => 3",
      //       cn: "紫：右下拉线 => 6点踩塔 => 3点踩塔",
      //     },
      //     act2OrangeHealer: {
      //       en: "Orange: stay => 6 => 9",
      //       cn: "橙：场中 => 6点拉线分摊 => 9点踩塔",
      //     },
      //     act2OrangeDps: {
      //       en: "Orange, stay => 12 => 3 or 9 with ${name}",
      //       cn: "橙：场中 => 12点分摊 => 与${name}各自去3/9点拉线分摊",
      //     },
      //     act2GreenDps: {
      //       en: "Green: stay => 6 => 9",
      //       cn: "绿：场中 => 6点分摊 => 9点分摊",
      //     },
      //   },
      // },

      {
        id: "P4S Act 4 Color Tether",
        netRegex: NetRegexes.tether({ id: "00A[CD]" }),
        condition: (data, matches) => data.act === "4" && matches.target === data.me,
        durationSeconds: (data, matches) => (data.actHeadmarkers[matches.target] === "012D" ? 12 : 9),
        suppressSeconds: 999,
        promise: async (data, matches) => {
          const result = await callOverlayHandler({
            call: "getCombatants",
            ids: [parseInt(matches.sourceId, 16)],
          });
          const myThorn = result.combatants[0];
          if (!myThorn) return;
          data.actFourThorn = myThorn;
        },
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            blueTether: {
              en: "Blue Tether",
              cn: "蓝：顺3",
            },
            purpleTether: {
              en: "Purple Tether",
              cn: "紫：顺1",
            },
            blueTetherDir: {
              en: "Blue Tether Go ${dir}",
              cn: "蓝：AOE => ${dir}",
            },
            blueTetherDirTTS: {
              en: "Go ${dir}",
              cn: "即将去${dir}",
            },
            purpleTetherDir: {
              en: "Go ${dir}",
              cn: "紫：AOE => ${dir} => 准备拉线",
            },
            purpleTetherDirTTS: {
              en: "Go ${dir}",
              cn: "即将去${dir}",
            },
            dirN: Outputs.dirN,
            dirNE: Outputs.dirNE,
            dirE: Outputs.dirE,
            dirSE: Outputs.dirSE,
            dirS: Outputs.dirS,
            dirSW: Outputs.dirSW,
            dirW: Outputs.dirW,
            dirNW: Outputs.dirNW,
            unknown: Outputs.unknown,
          };
          const id = data.actHeadmarkers[matches.target];
          if (id === undefined) return;
          if (data.actFourThorn === undefined) {
            if (id === "012C") return { infoText: output.blueTether() };
            if (id === "012D") return { alertText: output.purpleTether() };
            return;
          }
          const centerX = 100;
          const centerY = 100;
          const x = data.actFourThorn.PosX - centerX;
          const y = data.actFourThorn.PosY - centerY;
          let offset = 0;
          if (id === "012C") offset = 3;
          if (id === "012D") offset = 1;
          const thornDir = Math.round(4 - (4 * Math.atan2(x, y)) / Math.PI + offset) % 8;
          const dirStr =
            {
              0: output.dirN(),
              1: output.dirNE(),
              2: output.dirE(),
              3: output.dirSE(),
              4: output.dirS(),
              5: output.dirSW(),
              6: output.dirW(),
              7: output.dirNW(),
            }[thornDir] ?? output.unknown();

          if (id === "012C") return { infoText: output.blueTetherDir({ dir: dirStr }), tts: output.blueTetherDirTTS({ dir: dirStr }) };
          if (id === "012D")
            return {
              alertText: output.purpleTetherDir({ dir: dirStr }),
              tts: output.purpleTetherDirTTS({ dir: dirStr }),
            };
        },
      },
      {
        id: "P4S 四运拉线",
        netRegex: NetRegexes.tether({ id: "00AC" }),
        condition: (data) => data.act === "4",
        durationSeconds: 42,
        alertText: (data, matches, output) => {
          if (!data.act4Tether) data.act4Tether = [];
          data.act4Tether.push({ sourceId: matches.sourceId, targetName: matches.target, targetId: matches.targetId });
          if (data.act4Tether.length === 8) {
            data.act4Move = data.act4Tether
              .sort((a, b) => parseInt(b.sourceId, 16) - parseInt(a.sourceId, 16))
              .slice(0, 4)
              .map((a) => a.targetName);
            data.act4MoveNextNum = 0;
            if (data.postNamazuTextCommand) doTextCommand("/p " + data.act4Move.join(" => "));
            if (data.postNamazumark) {
              data.act4Tether
                .sort((a, b) => parseInt(b.sourceId, 16) - parseInt(a.sourceId, 16))
                .slice(0, 4)
                .forEach((item, index) => {
                  mark(parseInt(item.targetId, 16), index + 1);
                  // console.warn((parseInt(item.targetId, 16), index + 1));
                });
            }
            return output.act4PullOrder({
              n1: data.ShortName(data.act4Move[0]),
              n2: data.ShortName(data.act4Move[1]),
              n3: data.ShortName(data.act4Move[2]),
              n4: data.ShortName(data.act4Move[3]),
            });
          }
        },
        sound: "",
        soundVolume: 0,
        tts: null,
        outputStrings: {
          act4PullOrder: {
            en: "${n1} => ${n2} => ${n3} => ${n4}",
            cn: "${n1} => ${n2} => ${n3} => ${n4}",
          },
        },
      },
      {
        id: "P4S 四运拉线1",
        netRegex: NetRegexes.tether({ id: "00AC" }),
        condition: (data) => data.act === "4",
        delaySeconds: 15,
        suppressSeconds: 1,
        alertText: (data, _matches, output) => {
          const result = data.act4Move[0] ?? "";
          return data.me === result ? output.pullLineNowYou() : output.pullLineNowAnother({ name: data.ShortName(result) });
        },
        outputStrings: pullLineOutputStrings,
      },
      {
        id: "P4S 四运拉线2-4",
        netRegex: NetRegexes.ability({ id: "6A16" }),
        condition: (data) => data.act === "4",
        delaySeconds: 2,
        suppressSeconds: 1,
        alertText: (data, _matches, output) => {
          const result = data.act4Move[++data.act4MoveNextNum];
          if (!result) {
            delete data.act4Move;
            delete data.act4MoveNextNum;
            return;
          }
          return data.me === result ? output.pullLineNowYou() : output.pullLineNowAnother({ name: data.ShortName(result) });
        },
        outputStrings: pullLineOutputStrings,
      },
      {
        id: "P4S Fleeting Impulse",
        netRegex: NetRegexes.ability({ id: "6A1C" }),
        preRun: (data, matches) => {
          data.fleetingImpulseCounter = (data.fleetingImpulseCounter ?? 0) + 1;
          if (data.postNamazumark) mark(parseInt(matches.targetId, 16), data.fleetingImpulseCounter);
        },
        durationSeconds: 22,
        alertText: (data, matches) => {
          if (!data.act5Num) data.act5Num = {};
          data.act5Num[matches.target] = data.fleetingImpulseCounter;
          if (matches.target === data.me) {
            if (!data.act5FleetingImpulseCounter) data.act5FleetingImpulseCounter = {};
            data.act5FleetingImpulseCounter[data.me] = data.fleetingImpulseCounter;
            return data.fleetingImpulseCounter;
          }
        },
      },
      {
        id: "P4S 五运踩塔",
        netRegex: NetRegexes.tether({ id: "00AD" }),
        condition: (data) => data.act === "finale",
        duration: 10,
        suppressSeconds: 10,
        alertText: (data, matches, output) => {
          const firstTower = (data.thornIds ??= []).indexOf(parseInt(matches.sourceId, 16));
          const playerTower = data.act5FleetingImpulseCounter[data.me];
          return output[`act5SiteIndication${(8 - firstTower + playerTower - 1) % 8}`]();
        },
        outputStrings: {
          act5SiteIndication0: { en: "↖ (northwest)", cn: "↖左上(西北)塔" },
          act5SiteIndication1: { en: "↑ (North)", cn: "↑上(北)塔" },
          act5SiteIndication2: { en: "↗ (northeast)", cn: "↗右上(东北)塔" },
          act5SiteIndication3: { en: "→ (East)", cn: "→右(东)塔" },
          act5SiteIndication4: { en: "↘ (southeast)", cn: "↘右下(东南)塔" },
          act5SiteIndication5: { en: "↓ (South)", cn: "↓下(南)塔" },
          act5SiteIndication6: { en: "↙ (southwest)", cn: "↙左下(西南)塔" },
          act5SiteIndication7: { en: "← (West)", cn: "←左(西)塔" },
        },
      },
      {
        id: "P4S Curtain Call Debuffs",
        netRegex: NetRegexes.gainsEffect({ effectId: "AF4", capture: true }),
        condition: (data, matches) => data.act === "curtain" && data.me === matches.target && Math.ceil((parseFloat(matches.duration) - 2) / 10) > 1,
        delaySeconds: 2,
        infoText: (_data, matches, output) => output.act6Group({ group: Math.ceil((parseFloat(matches.duration) - 2) / 10) }),
        outputStrings: {
          act6Group: {
            en: "You are No.${group} ",
            cn: "你是第${group}组",
          },
        },
      },
      {
        id: "P4S Hell's Sting",
        netRegex: NetRegexes.startsUsing({ id: "6A1E", capture: false }),
        infoText: (_data, _matches, output) => output.act6HellSting(),
        outputStrings: { act6HellSting: { en: "sting", cn: "水波" } },
      },
      {
        id: "P4S 六运水波",
        netRegex: NetRegexes.startsUsing({ id: "6A1E", capture: false }),
        delaySeconds: 2.1,
        infoText: (_data, _matches, output) => output.act6HellStingGo(),
        outputStrings: { act6HellStingGo: { en: "move!", cn: "穿" } },
      },
      {
        id: "P4S 六运拉线",
        netRegex: NetRegexes.gainsEffect({ effectId: "AF4", capture: true }),
        condition: (data) => data.act === "curtain",
        delaySeconds: (data, matches) => parseFloat(matches.duration) - 7 - (data.party.nameToRole_[matches.target] === "dps" ? 5 : 0),
        alarmText: (data, matches, output) => {
          return data.me === matches.target ? output.pullLineNowYou() : output.pullLineNowAnother({ name: data.ShortName(matches.target) });
        },
        run: (data, matches, output) => {
          if (data.postNamazuTextCommand) doTextCommand(`/p ${data.ShortName(matches.target)} <se.5>`);
          if (data.postNamazumark) mark(parseInt(matches.targetId, 16), output.标记Type());
        },
        outputStrings: {
          ...pullLineOutputStrings,
          标记Type: { en: "attack1", cn: "attack1" },
        },
      },
      {
        id: "P4S 六运拉线准备",
        netRegex: NetRegexes.gainsEffect({ effectId: "AF4", capture: true }),
        condition: (data, matches) => data.act === "curtain" && !(matches.duration < 13 && data.party.nameToRole_[matches.target] === "dps"),
        delaySeconds: (data, matches) => parseFloat(matches.duration) - 7 - (data.party.nameToRole_[matches.target] === "dps" ? 5 : 0) - 3,
        soundVolume: (data, matches) => (data.me === matches.target ? 0.25 : 0),
        alertText: (data, matches, output) => output.pullLineReady({ name: data.ShortName(matches.target) }),
        tts: (data, matches, output) => (data.me === matches.target ? output.pullLineReadyYou() : null),
        run: (data, matches, output) => {
          if (data.postNamazumark) mark(parseInt(matches.targetId, 16), output.标记Type());
        },
        outputStrings: {
          pullLineReady: { en: "${name} ready", cn: "${name}准备" },
          pullLineReadyYou: { en: "Get ready", cn: "准备" },
          标记Type: { en: "bind2", cn: "bind2" },
        },
      },
    ],
    timeline: ['hideall "Inversive Chlamys"', 'hideall "--role debuffs--"', 'hideall "--element debuffs--"', 'hideall "Elemental Belone"'],
    timelineReplace: [
      {
        missingTranslations: true,
        replaceSync: {
          "Engage!": "(?:战斗开始！|Engage!|戦闘開始！)",
          "戦闘開始！": "(?:战斗开始！|Engage!|戦闘開始！)",
          "Hesperos": "[^:]+",
          "ヘスペロス": "[^:]+",
        },
        replaceText: {
          "Acid Pinax": "毒",
          "Acid/": "毒/",
          "ピナクスポイズン": "毒",
          "Aetheric Chlamys": "以太斗篷",
          "エーテルクラミュス": "以太斗篷",
          "Akanthai: Act 1": "一运",
          "茨の悲劇：序幕": "一运",
          "Akanthai: Act 2": "二运",
          "茨の悲劇：第ニ幕": "二运",
          "Akanthai: Act 3": "三运",
          "茨の悲劇：第三幕": "三运",
          "Akanthai: Act 4": "四运",
          "茨の悲劇：第四幕": "四运",
          "Akanthai: Curtain Call": "六运",
          "茨の悲劇：カーテンコール": "六运",
          "Akanthai: Finale": "五运",
          "茨の悲劇：終幕": "五运",
          "Belone Bursts": "反职能：撞球",
          "エンチャンテッドペロネー：エクスプロージョン": "反职能：撞球",
          "Belone Coils": "反职能：踩塔",
          "エンチャンテッドペロネー：ラウンド": "反职能：踩塔",
          "Bloodrake": "抽4人TN/DPS",
          "ブラッドレイク": "抽4人TN/DPS",
          "Burst$": "踩塔/连线判定",
          "爆発$": "踩塔/连线判定",
          "Cursed Casting": "诅咒发动",
          "呪詛発動": "诅咒发动",
          "Dark Design": "暗黑创设",
          "ダークデザイン": "暗黑创设",
          "Decollation": "AOE",
          "デコレーション": "AOE",
          "Director's Belone": "赋予病毒",
          "エンチャンテッドペロネー：ペルソナ": "赋予病毒",
          "Elegant Evisceration": "死刑",
          "エレガントイヴィセレーション": "死刑",
          // "Elemental Belone": "魔法佩罗尼：元素",
          // "エンチャンテッドペロネー：エレメンタル": "魔法佩罗尼：元素",
          "Fleeting Impulse": "挨个点名",
          "フリーティングインパルス": "挨个点名",
          "Heart Stake": "DOT死刑",
          "ハートステイク": "DOT死刑",
          "Hell's Sting": "水波",
          "ヘルスティング": "水波",
          "Hemitheos's Aero III": "风圈（回避）",
          "ヘーミテオス・エアロガ": "风圈（回避）",
          "Hemitheos's Dark IV": "爆炸",
          "ヘーミテオス・ダージャ": "爆炸",
          "Hemitheos's Fire III": "分摊",
          "ヘーミテオス・ファイガ": "分摊",
          "Hemitheos's Fire IV": "大圈",
          "ヘーミテオス・ファイジャ": "大圈",
          "Hemitheos's Thunder III": "踩塔",
          "ヘーミテオス・サンダガ": "踩塔",
          "Hemitheos's Water IV": "场中击退",
          "ヘーミテオス・ウォタジャ": "场中击退",
          "Inversive Chlamys": "颠倒斗篷",
          "インヴァースクラミュス": "颠倒斗篷",
          "Kothornos Kick": "超级跳",
          "コトルヌスキック": "超级跳",
          "Kothornos Quake": "大地摇动",
          "コトルヌスクエイク": "大地摇动",
          "Lava Pinax": "火",
          "Lava/": "火/",
          "ピナクスラーヴァ": "火",
          "Levinstrike Pinax": "雷",
          "Levinstrike/": "雷/",
          "ピナクスサンダー": "雷",
          "Periaktoi": "找安全地板",
          "ペリアクトイ": "找安全地板",
          "^Pinax$": "地板",
          "^ピナクス$": "地板",
          "Searing Stream": "AOE",
          "シアリングストリーム": "AOE",
          "Setting the Scene": "地板阶段",
          "劇場創造": "地板阶段",
          "Shifting Strike": "瞬移到场边",
          "シフティングストライク": "瞬移到场边",
          "Ultimate Impulse": "大AOE",
          "アルティメットインパルス": "大AOE",
          "Vengeful Belone": "30秒后撞球",
          "エンチャンテッドペロネー：リベンジ": "30秒后撞球",
          "Well Pinax": "水",
          "Well/": "水/",
          "ピナクススプラッシュ": "水",
          "Wreath of Thorns": "荆棘篱",
          "ソーンヘッジ": "荆棘篱",
          "Nearsight": "靠近",
          "Farsight": "远离",
          "Directional Shift": "瞬移到场边",
          "Demigod Double": "分摊死刑",
          "--untargetable--": "--不可选中--",
          "--ターゲット不可--": "--不可选中--",
          "\\(enrage\\)": "(狂暴)",
          "\\(時間切れ\\)": "(狂暴)",

          //"--Debuff--":"",
          //"--元素Debuff--":"",
          //"--职能Debuff--":"",
          //"剧毒板画":"",
          //"以太斗篷":"",
          //"荆棘悲剧：序幕":"",
          //"荆棘悲剧：第二幕":"",
          //"荆棘悲剧：第三幕":"",
          //"荆棘悲剧：第四幕":"",
          //"荆棘悲剧：谢幕":"",
          //"荆棘悲剧：结幕":"",
          //"附魔佩罗涅·爆炸":"",
          //"附魔佩罗涅·场地":"",
          //"聚血":"",
          //"爆炸":"",
          //"诅咒发动":"",
          "黑暗设计": "赋予连线",
          "断头": "AOE",
          "半神的双击": "分摊死刑",
          "附魔佩罗涅·职责": "赋予毒",
          // "换位强袭·方位":"",
          "优雅除脏": "死刑",
          "附魔佩罗涅·元素": "赋予耐性降低",
          // "远见的魔击":"",
          "闪现脉冲": "8次目标AOE",
          "刺心桩": "DOT死刑",
          "地狱苦痛": "水波",
          "半神暴风": "绿线AOE",
          "半神冥暗": "紫线AOE",
          "半神爆炎": "橙线分摊",
          "半神炽炎": "场地钢铁",
          "半神暴雷": "场地踩塔",
          "半神骇水": "场地击退",
          "翻转斗篷": "储存以太",
          "舞台靴重踢": "超级跳",
          "舞台靴踏地": "大地摇动",
          "熔岩板画": "火分摊",
          "雷电板画": "雷远离",
          // "近思的魔击":"",
          "场景旋转": "去安全地板",
          "板画": "激活地板",
          "灼热流": "AOE",
          "布置剧场": "召唤地板",
          // "换位强袭":"",
          "究极脉冲": "大AOE",
          "附魔佩罗涅·复仇": "赋予职能诅咒",
          "喷水板画": "水击退",
          "荆棘缠绕": "荆棘连线",
        },
      },
    ],
    timelineTriggers: [
      {
        id: "邮差设置",
        regex: /--sync--|Decollation|Searing Stream/,
        beforeSeconds: 5,
        tts: null,
        run: (data, _matches, output) => {
          data.postNamazuTextCommand = output.聊天() === "开" || output.聊天() === "true" || output.聊天() === "1";
          data.postNamazumark = output.标记() === "开" || output.标记() === "true" || output.标记() === "1";
        },
        outputStrings: { 聊天: { en: "false", cn: "关" }, 标记: { en: "false", cn: "关" } },
      },
      {
        id: "P4S Hemitheos's Water IV",
        regex: /Hemitheos's Water IV/,
        beforeSeconds: 5,
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "Middle Knockback",
            cn: "防击退",
          },
        },
      },
    ],
  });
}
