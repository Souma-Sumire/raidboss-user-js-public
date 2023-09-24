if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
  // 因牵扯到变量作用域入侵，所以是在主库的基础上进行修改/新增的，大部分非原创。
  const { getRpByName } = Util.souma;
  const centerX = 100;
  const centerY = 100;
  const distSqr = (a, b) => {
    const dX = parseFloat(a.x) - parseFloat(b.x);
    const dY = parseFloat(a.y) - parseFloat(b.y);
    return dX * dX + dY * dY;
  };
  const wings = {
    topLeftFirst: "01A5",
    topRightFirst: "01A6",
    middleLeftSecond: "01A7",
    middleRightSecond: "01A8",
    bottomLeftFirst: "01A9",
    bottomRightFirst: "01AA",
    topLeftThird: "01AF",
    topRightThird: "01B0",
    bottomLeftThird: "01B1",
    bottomRightThird: "01B2",
  };
  const superchainNpcNameId = "12377";
  const superchainNpcBaseIdMap = {
    destination: "16176",
    out: "16177",
    in: "16178",
    protean: "16179",
    partners: "16180",
  };
  const engravementLabelMapAsConst = {
    DF8: "lightTilt",
    DF9: "darkTilt",
    DFB: "lightTower",
    DFC: "darkTower",
    DFD: "lightBeam",
    DFE: "darkBeam",
    DFF: "crossMarked",
    E00: "xMarked",
  };
  const engravementLabelMap = engravementLabelMapAsConst;
  const engravementIdMap = Object.fromEntries(Object.entries(engravementLabelMap).map(([k, v]) => [v, k]));
  const engravementBeamIds = [engravementIdMap.lightBeam, engravementIdMap.darkBeam];
  const engravementTowerIds = [engravementIdMap.lightTower, engravementIdMap.darkTower];
  const engravementTiltIds = [engravementIdMap.lightTilt, engravementIdMap.darkTilt];
  const engravement3TheosSoulIds = [engravementIdMap.crossMarked, engravementIdMap.xMarked];
  const anthroposTetherMap = {
    "00E9": "light",
    "00EA": "dark",
    "00FA": "light",
    "00FB": "dark",
  };
  const tetherAbilityToTowerMap = {
    "82F1": "lightTower",
    "82F2": "darkTower",
  };
  const headmarkers = {
    ...wings,
    glaukopis: "01D7",
    limitCut1: "0150",
    limitCut2: "0151",
    limitCut3: "0152",
    limitCut4: "0153",
    limitCut5: "01B5",
    limitCut6: "01B6",
    limitCut7: "01B7",
    limitCut8: "01B8",
    palladianGrasp: "01D4",
    chains: "0061",
    geocentrismSpread: "0016",
    playstationCircle: "016F",
    playstationTriangle: "0170",
    playstationSquare: "0171",
    playstationCross: "0172",
    caloric1Beacon: "012F",
    caloric2InitialFire: "01D6",
    caloric2Wind: "01D5",
  };
  const limitCutMap = {
    [headmarkers.limitCut1]: 1,
    [headmarkers.limitCut2]: 2,
    [headmarkers.limitCut3]: 3,
    [headmarkers.limitCut4]: 4,
    [headmarkers.limitCut5]: 5,
    [headmarkers.limitCut6]: 6,
    [headmarkers.limitCut7]: 7,
    [headmarkers.limitCut8]: 8,
  };
  const limitCutIds = Object.keys(limitCutMap);
  const wingIds = Object.values(wings);
  const superchainNpcBaseIds = Object.values(superchainNpcBaseIdMap);
  const whiteFlameDelayOutputStrings = {
    delay1: {
      en: "引导激光！",
    },
    delay2: {
      en: "等1会",
    },
    delay3: {
      en: "等2会",
    },
    delay4: {
      en: "等3会",
    },
    delay5: {
      en: "等4会",
    },
  };
  const conceptPairMap = {
    [headmarkers.playstationCircle]: "circle",
    [headmarkers.playstationTriangle]: "triangle",
    [headmarkers.playstationSquare]: "square",
    [headmarkers.playstationCross]: "cross",
  };
  const conceptDebuffIds = {
    DE8: "alpha",
    DE9: "beta",
  };
  const conceptDebuffToColor = {
    alpha: "red",
    beta: "yellow",
  };
  const npcBaseIdToConceptColor = {
    16183: "red",
    16184: "blue",
    16185: "yellow",
  };
  const conceptDebuffEffectIds = Object.keys(conceptDebuffIds);
  const conceptNpcBaseIds = Object.keys(npcBaseIdToConceptColor);
  const conceptPairIds = Object.keys(conceptPairMap);
  const conceptLocationMap = {
    north: [0, 10, 20, 30],
    middle: [2, 12, 22, 32],
    south: [4, 14, 24, 34],
  };
  const getConceptLocation = (concept) => {
    const x = parseFloat(concept.x);
    const y = parseFloat(concept.y);
    let row;
    if (y < 88) row = "north";
    else row = y > 96 ? "south" : "middle";
    let col;
    if (x < 92) col = 0;
    else if (x > 108) col = 3;
    else col = x > 100 ? 2 : 1;
    return conceptLocationMap[row][col];
  };
  const getConceptMap = (startLoc) => {
    const conceptMap = [];
    const expectedLocs = [...conceptLocationMap.north, ...conceptLocationMap.middle, ...conceptLocationMap.south];
    const [n, e, s, w] = [startLoc - 2, startLoc + 10, startLoc + 2, startLoc - 10];
    if (expectedLocs.includes(n)) conceptMap.push([n, n + 1]);
    if (expectedLocs.includes(e)) conceptMap.push([e, e - 5]);
    if (expectedLocs.includes(s)) conceptMap.push([s, s - 1]);
    if (expectedLocs.includes(w)) conceptMap.push([w, w + 5]);
    return conceptMap;
  };
  const getHeadmarkerId = (data, matches) => {
    if (data.souma.decOffset === undefined) {
      if (data.souma.expectedFirstHeadmarker === undefined) {
        console.error("missing expected first headmarker");
        return "OOPS";
      }
      data.souma.decOffset = parseInt(matches.id, 16) - parseInt(data.souma.expectedFirstHeadmarker, 16);
    }
    return (parseInt(matches.id, 16) - data.souma.decOffset).toString(16).toUpperCase().padStart(4, "0");
  };
  Options.Triggers.push({
    id: "SoumaAnabaseiosTheTwelfthCircleSavage",
    zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
    config: [
      {
        id: "engravement1DropTower",
        name: {
          en: "范式1拉线规则",
        },
        type: "select",
        options: {
          en: {
            "game8相反 (找终点+TN顺时针)": "tank/healer",
            "game8 (找终点+dps顺时针)": "dps",
            "菓子君 (找起点+TN顺时针+对面的终点)": "guozi",
          },
        },
        default: "guozi",
      },
      {
        id: "engravement3TowerTHSort",
        comment: { en: '用"/"斜线分割' },
        name: {
          en: "范式3 TN组的优先级规则",
        },
        type: "string",
        default: "MT/ST/H1/H2",
      },
      {
        id: "engravement3TowerTHSort2",
        name: {
          en: "范式3 TN组踩塔的分组规则",
        },
        type: "select",
        options: {
          en: {
            "game8 (从上到下)": "上下",
            "菓子君 (从左到右)": "左右",
          },
        },
        default: "左右",
      },
      {
        id: "engravement3TowerDPS",
        name: {
          en: "范式3 DPS组的踩塔规则",
        },
        type: "select",
        options: {
          en: {
            "菓子君 (直线踩中间斜线踩原地)": "heading",
            "game8 (按D1234优先级高的去中间)": "priority",
          },
        },
        default: "heading",
      },
      {
        id: "classicalConceptsPairOrder",
        name: {
          en: "经典概念 索尼顺序（左->右）",
        },
        type: "select",
        options: {
          en: {
            "X□○Δ (BPOG)": "xsct",
            "○XΔ□ (1234笔画)": "cxts",
            "○Δ□X (Rocketship)": "ctsx",
            "○ΔX□ (彩虹)": "ctxs",
            "只报形状和debuff": "shapeAndDebuff",
          },
        },
        default: "cxts",
      },
      {
        id: "classicalConcepts2ActualNoFlip",
        name: {
          en: "经典概念2: 只报自己图案的最终位置，没有位置变换",
        },
        type: "checkbox",
        default: false,
      },
      {
        id: "theHandOfParas",
        name: {
          en: "立方体后的激光诱导站位",
        },
        type: "select",
        options: {
          en: {
            先K后X: "KX",
            全程X: "XX",
          },
        },
        default: "KX",
      },
      { id: "windFirePriority", comment: { cn: "A起顺，职能用'/'分割。" }, name: { en: "风火优先级" }, type: "string", default: "MT/ST/H1/H2/D1/D2/D3/D4" },
      {
        id: "pantheismPriority",
        comment: { en: '用"/"斜线分割' },
        name: {
          en: "本体踩塔优先级从左到右",
        },
        type: "string",
        default: "MT/ST/H1/H2/D1/D2/D3/D4",
      },
    ],
    initData: () => {
      return {
        souma: {
          isDoorBoss: true,
          combatantData: [],
          combatantDataEngravement3: [],
          paradeigmaCounter: 0,
          glaukopisSecondHitSame: false,
          engravementCounter: 0,
          engravement1BeamsPosMap: new Map(),
          engravement1SourcePos: new Map(),
          engravement1TetherIds: [],
          engravement1TetherPlayers: {},
          engravement1LightBeamsPos: [],
          engravement1DarkBeamsPos: [],
          engravement1Towers: [],
          engravement3TetherIds: [],
          engravement3TowerPlayers: [],
          engravement3TetherPlayers: {},
          engravement3TetherMap: {},
          engravement3BeamsPosMap: new Map(),
          engravement3GroupInfo: {},
          wingCollect: [],
          wingCalls: [],
          superchainCollect: [],
          lcCombatants: [],
          lcCombatantsOffset: 0,
          whiteFlameCounter: 0,
          sampleTiles: [],
          sampleTilesEngravement3: [],
          darknessClones: [],
          conceptData: {},
          gaiaochosCounter: 0,
          classicalCounter: 0,
          caloricCounter: 0,
          caloric1First: [],
          caloric1Buff: {},
          caloric2PassCount: 0,
          gaiaochosTetherCollect: [],
          seenSecondTethers: false,
          unstableFactor: [],
          white: [],
          dark: [],
          pantheism: false,
          pantheismCount: 1,
        },
      };
    },
    triggers: [
      {
        id: "P12S Phase Tracker 1",
        type: "StartsUsing",
        netRegex: { id: ["82DA", "82F5", "86FA", "86FB"] },
        run: (data, matches) => {
          data.souma.whiteFlameCounter = 0;
          data.souma.superchainCollect = [];
          const phaseMap = {
            "82DA": "superchain1",
            "82F5": "palladion",
            "86FA": "superchain2a",
            "86FB": "superchain2b",
          };
          data.souma.phase = phaseMap[matches.id];
        },
      },
      {
        id: "P12S Phase Tracker 2",
        type: "StartsUsing",
        netRegex: { id: "8682", capture: false },
        run: (data) => {
          data.souma.isDoorBoss = false;
          data.souma.expectedFirstHeadmarker = headmarkers.palladianGrasp;
        },
      },
      {
        id: "P12S Phase Tracker 3",
        type: "StartsUsing",
        netRegex: { id: ["8326", "8331", "8338", "833F"] },
        run: (data, matches) => {
          switch (matches.id) {
            case "8326":
              data.souma.phase = data.souma.gaiaochosCounter === 0 ? "gaiaochos1" : "gaiaochos2";
              data.souma.gaiaochosCounter++;
              break;
            case "8331":
              data.souma.phase = data.souma.classicalCounter === 0 ? "classical1" : "classical2";
              data.souma.classicalCounter++;
              break;
            case "8338":
              data.souma.phase = "caloric";
              data.souma.caloricCounter++;
              break;
            case "833F":
              data.souma.phase = "pangenesis";
              break;
          }
        },
      },
      {
        id: "P12S Door Boss Headmarker Tracker",
        type: "StartsUsing",
        netRegex: { id: ["82E7", "82E8"] },
        suppressSeconds: 99999,
        run: (data, matches) => {
          const isBottomLeft = matches.id === "82E8";
          const first = isBottomLeft ? headmarkers.bottomLeftFirst : headmarkers.bottomRightFirst;
          data.souma.expectedFirstHeadmarker = first;
        },
      },
      {
        id: "P12S On the Soul",
        type: "StartsUsing",
        netRegex: { id: "8304", capture: false },
        response: Responses.aoe(),
      },
      {
        id: "P12S Theos's Ultima",
        type: "StartsUsing",
        netRegex: { id: "82FA", capture: false },
        response: Responses.bigAoe(),
      },
      {
        id: "P12S Paradeigma Counter",
        type: "StartsUsing",
        netRegex: { id: "82ED", capture: false },
        run: (data) => data.souma.paradeigmaCounter++,
      },
      {
        id: "P12S Paradeigma 1 Clones",
        type: "Ability",
        netRegex: { id: "8314" },
        condition: (data) => data.souma.paradeigmaCounter === 1,
        delaySeconds: 0.5,
        suppressSeconds: 10,
        promise: async (data, matches) => {
          data.souma.combatantData = [];
          const id = parseInt(matches.sourceId, 16);
          data.souma.combatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [id],
            })
          ).combatants;
        },
        infoText: (data, _matches, output) => {
          if (data.souma.combatantData.length === 0) return output.clones({ dir: output.unknown() });
          const y = data.souma.combatantData[0]?.PosY;
          if (y === undefined) return output.clones({ dir: output.unknown() });
          const cloneSide = y > centerY ? "south" : "north";
          return output.clones({ dir: output[cloneSide]() });
        },
        outputStrings: {
          clones: {
            en: "${dir}小怪",
          },
          north: Outputs.north,
          south: Outputs.south,
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Ray of Light 1",
        type: "StartsUsing",
        netRegex: { id: "82EE" },
        condition: (data) => data.souma.paradeigmaCounter === 2,
        suppressSeconds: 1,
        promise: async (data) => {
          data.souma.combatantData = [];
          data.souma.combatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: [parseInt(data.party.details.find((v) => v.name === data.me).id, 16)],
            })
          ).combatants;
        },
        alertText: (data, matches, output) => {
          const x = Math.round(parseFloat(matches.x));
          const playerHalf = data.souma.combatantData[0].PosX < 100 ? "L" : "R";
          let safeLanes;
          if (x < 90) safeLanes = "insideWestOutsideEast";
          else if (x > 110) safeLanes = "insideEastOutsideWest";
          else safeLanes = x < 100 ? "insideEastOutsideWest" : "insideWestOutsideEast";
          return output[safeLanes + playerHalf]();
        },
        outputStrings: {
          insideWestOutsideEastL: { en: "内（西）" },
          insideWestOutsideEastR: { en: "外（东）" },
          insideEastOutsideWestL: { en: "外（西）" },
          insideEastOutsideWestR: { en: "内（东）" },
        },
      },
      {
        id: "P12S First Wing",
        type: "StartsUsing",
        netRegex: { id: ["82E7", "82E8", "82E1", "82E2"] },
        durationSeconds: 7,
        alertText: (data, matches, output) => {
          data.souma.wingCollect = [];
          data.souma.wingCalls = [];
          const isLeftAttack = matches.id === "82E8" || matches.id === "82E2";
          const firstDir = data.souma.superchain2aFirstDir;
          const secondDir = data.souma.superchain2aSecondDir;
          if (data.souma.phase !== "superchain2a" || firstDir === undefined || secondDir === undefined) return isLeftAttack ? output.right() : output.left();
          if (isLeftAttack) {
            if (firstDir === "north") {
              if (secondDir === "north") return output.superchain2aRightNorthNorth();
              return output.superchain2aRightNorthSouth();
            }
            if (secondDir === "north") return output.superchain2aRightSouthNorth();
            return output.superchain2aRightSouthSouth();
          }
          if (firstDir === "north") {
            if (secondDir === "north") return output.superchain2aLeftNorthNorth();
            return output.superchain2aLeftNorthSouth();
          }
          if (secondDir === "north") return output.superchain2aLeftSouthNorth();
          return output.superchain2aLeftSouthSouth();
        },
        outputStrings: {
          left: Outputs.left,
          right: Outputs.right,
          superchain2aLeftNorthNorth: {
            en: "左 + A点二二 => 月环 => 回A",
          },
          superchain2aLeftNorthSouth: {
            en: "左 + A点二二 => 月环 => 去C",
          },
          superchain2aLeftSouthNorth: {
            en: "左 + C点二二 => 月环 => 去A",
          },
          superchain2aLeftSouthSouth: {
            en: "左 + C点二二 => 月环 => 回C",
          },
          superchain2aRightNorthNorth: {
            en: "右 + A点二二 => 月环 => 回A",
          },
          superchain2aRightNorthSouth: {
            en: "右 + A点二二 => 月环 => 去C",
          },
          superchain2aRightSouthNorth: {
            en: "右 + C点二二 => 月环 => 去A",
          },
          superchain2aRightSouthSouth: {
            en: "右 + C点二二 => 月环 => 回C",
          },
        },
      },
      {
        id: "P12S Wing Collect",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => {
          const id = getHeadmarkerId(data, matches);
          if (!wingIds.includes(id)) return false;
          data.souma.wingCollect.push(id);
          return true;
        },
        delaySeconds: (data) => (data.souma.decOffset === undefined ? 1 : 0),
        durationSeconds: (data) => (data.souma.wingCollect.length === 3 ? 7 : 2),
        infoText: (data, _matches, output) => {
          if (data.souma.wingCollect.length !== 3 && data.souma.wingCollect.length !== 2) return;
          const [first, second, third] = data.souma.wingCollect;
          if (first === undefined || second === undefined) return;
          const isFirstLeft = first === wings.topLeftFirst || first === wings.bottomLeftFirst;
          const isSecondLeft = second === wings.middleLeftSecond;
          const isThirdLeft = third === wings.topLeftThird || third === wings.bottomLeftThird;
          const firstStr = isFirstLeft ? output.right() : output.left();
          const isFirstTop = first === wings.topLeftFirst || first === wings.topRightFirst;
          let secondCall;
          let thirdCall;
          if (isFirstTop) {
            secondCall = isFirstLeft === isSecondLeft ? "stay" : "swap";
            thirdCall = isSecondLeft === isThirdLeft ? "stay" : "swap";
          } else {
            secondCall = isFirstLeft === isSecondLeft ? "swap" : "stay";
            thirdCall = isSecondLeft === isThirdLeft ? "swap" : "stay";
          }
          data.souma.wingCalls = [secondCall, thirdCall];
          if (third === undefined) {
            if (secondCall === "stay") return output.secondWingCallStay();
            return output.secondWingCallSwap();
          }
          return output.allThreeWings({
            first: firstStr,
            second: output[secondCall](),
            third: output[thirdCall](),
          });
        },
        outputStrings: {
          left: Outputs.left,
          right: Outputs.right,
          swap: {
            en: "穿",
          },
          stay: {
            en: "停",
          },
          secondWingCallStay: {
            en: "(停)",
          },
          secondWingCallSwap: {
            en: "(穿)",
          },
          allThreeWings: {
            en: "${first} → ${second} → ${third}",
          },
        },
      },
      {
        id: "P12S Wing Followup",
        type: "Ability",
        netRegex: {
          id: ["82E1", "82E2", "82E3", "82E4", "82E7", "82E8", "82E9", "82EA"],
          capture: false,
        },
        durationSeconds: 2.5,
        suppressSeconds: 1,
        alertText: (data, _matches, output) => {
          const call = data.souma.wingCalls.shift();
          if (call === undefined) return;
          const firstDir = data.souma.superchain2aFirstDir;
          const secondDir = data.souma.superchain2aSecondDir;
          const secondMech = data.souma.superchain2aSecondMech;
          if (data.souma.phase !== "superchain2a" || firstDir === undefined || secondDir === undefined || secondMech === undefined) {
            if (call === "swap") return output.swap();
            return output.stay();
          }
          const isSecondWing = data.souma.wingCalls.length === 1;
          const finalDir = secondDir === "north" ? output.north() : output.south();
          if (isSecondWing) {
            const isReturnBack = firstDir === secondDir;
            if (call === "swap") {
              if (isReturnBack) return output.superchain2aSwapMidBack({ dir: finalDir });
              return output.superchain2aSwapMidGo({ dir: finalDir });
            }
            if (isReturnBack) return output.superchain2aStayMidBack({ dir: finalDir });
            return output.superchain2aStayMidGo({ dir: finalDir });
          }
          const isProtean = secondMech === "protean";
          if (call === "swap") {
            if (isProtean) return output.superchain2aSwapProtean({ dir: finalDir });
            return output.superchain2aSwapPartners({ dir: finalDir });
          }
          if (isProtean) return output.superchain2aStayProtean({ dir: finalDir });
          return output.superchain2aStayPartners({ dir: finalDir });
        },
        outputStrings: {
          swap: {
            en: "穿",
          },
          stay: {
            en: "停",
          },
          superchain2aSwapMidBack: {
            en: "穿月环 => 回${dir}",
          },
          superchain2aSwapMidGo: {
            en: "穿月环 => 去${dir}",
          },
          superchain2aStayMidBack: {
            en: "停月环 => 回${dir}",
          },
          superchain2aStayMidGo: {
            en: "停月环 => 去${dir}",
          },
          superchain2aSwapProtean: {
            en: "穿 + ${dir} + 八方分散",
          },
          superchain2aStayProtean: {
            en: "停${dir} + 八方分散",
          },
          superchain2aSwapPartners: {
            en: "穿 + ${dir} + 二二分摊",
          },
          superchain2aStayPartners: {
            en: "停${dir} + 二二分摊",
          },
          north: "A",
          south: "C",
        },
      },
      {
        id: "P12S Wing Followup Third Wing Superchain IIA",
        type: "Ability",
        netRegex: { id: ["82E5", "82E6", "82EB", "82EC"], capture: false },
        condition: (data) => data.souma.phase === "superchain2a",
        suppressSeconds: 1,
        alertText: (data, _matches, output) => {
          const secondMech = data.souma.superchain2aSecondMech;
          if (secondMech === undefined) return;
          if (secondMech === "protean") return output.protean();
          return output.partners();
        },
        outputStrings: {
          protean: {
            en: "八方分散",
          },
          partners: {
            en: "二二分摊",
          },
        },
      },
      {
        id: "P12S Engravement of Souls Tracker",
        type: "Ability",
        netRegex: { id: "8305", capture: false },
        run: (data) => ++data.souma.engravementCounter,
      },
      {
        id: "P12S Engravement 1 Tether Tracker",
        type: "Tether",
        netRegex: { id: Object.keys(anthroposTetherMap) },
        run: (data, matches) => {
          const tetherType = anthroposTetherMap[matches.id];
          if (tetherType === undefined) return;
          data.souma.engravement1TetherPlayers[matches.sourceId] = tetherType;
          data.souma.engravement1TetherIds.push(parseInt(matches.sourceId, 16));
        },
      },
      {
        id: "P12S Engravement 1 Beam",
        type: "StartsUsing",
        netRegex: { id: Object.keys(tetherAbilityToTowerMap) },
        condition: (data) => data.souma.engravementCounter === 1,
        alertText: (data, matches, output) => {
          if (data.me === matches.target) {
            if (matches.id === "82F1") return output.lightBeam();
            return output.darkBeam();
          }
        },
        outputStrings: {
          lightBeam: {
            en: "引导光激光",
          },
          darkBeam: {
            en: "引导暗激光",
          },
        },
      },
      {
        id: "P12S Engravement 1 Tower Drop",
        type: "GainsEffect",
        netRegex: { effectId: engravementTowerIds },
        condition: (data) => data.souma.engravementCounter === 1,
        durationSeconds: (_data, matches) => parseFloat(matches.duration),
        promise: async (data) => {
          data.souma.combatantData = [];
          data.souma.combatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: data.souma.engravement1TetherIds,
            })
          ).combatants;
        },
        alertText: (data, matches, output) => {
          data.souma.engravement1Towers.push(matches.target);
          for (const combatant of data.souma.combatantData) {
            const x = combatant.PosX;
            const y = combatant.PosY;
            const combatantId = combatant.ID;
            if (combatantId === undefined) return;
            const tempColor = data.souma.engravement1TetherPlayers[combatantId.toString(16).toUpperCase()];
            const color = tempColor === "light" ? "dark" : "light";
            if (x < 80 && y < 100) {
              data.souma.engravement1BeamsPosMap.set("NE", color);
              data.souma.engravement1SourcePos.set("D2", color);
            } else if (x < 100 && y < 80) {
              data.souma.engravement1BeamsPosMap.set("SW", color);
              data.souma.engravement1SourcePos.set("A1", color);
            } else if (x > 100 && y < 80) {
              data.souma.engravement1BeamsPosMap.set("SE", color);
              data.souma.engravement1SourcePos.set("A2", color);
            } else if (x > 120 && y < 100) {
              data.souma.engravement1BeamsPosMap.set("NW", color);
              data.souma.engravement1SourcePos.set("B1", color);
            } else if (x > 120 && y > 100) {
              data.souma.engravement1BeamsPosMap.set("SW", color);
              data.souma.engravement1SourcePos.set("B2", color);
            } else if (x > 100 && y > 120) {
              data.souma.engravement1BeamsPosMap.set("NE", color);
              data.souma.engravement1SourcePos.set("C1", color);
            } else if (x < 100 && y > 120) {
              data.souma.engravement1BeamsPosMap.set("NW", color);
              data.souma.engravement1SourcePos.set("C2", color);
            } else if (x < 80 && y > 100) {
              data.souma.engravement1BeamsPosMap.set("SE", color);
              data.souma.engravement1SourcePos.set("D1", color);
            }
          }
          if (data.me === matches.target) {
            data.souma.engravement1DarkBeamsPos = [];
            data.souma.engravement1LightBeamsPos = [];
            data.souma.engravement1BeamsPosMap.forEach((value, key) => {
              if (matches.effectId === engravementIdMap.lightTower && value === "light") {
                data.souma.engravement1LightBeamsPos.push(key);
              } else if (matches.effectId === engravementIdMap.darkTower && value === "dark") {
                data.souma.engravement1DarkBeamsPos.push(key);
              }
            });
            if (data.triggerSetConfig.engravement1DropTower === "guozi") {
              const arr = data.role === "dps" ? ["D2", "D1", "C2", "C1", "B2", "B1", "A2", "A1"] : ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];
              const shadows = Array.from(data.souma.engravement1SourcePos).sort((a, b) => arr.indexOf(a[0]) - arr.indexOf(b[0]));
              const color = matches.effectId === engravementIdMap.lightTower ? "light" : "dark";
              const target = shadows.find((v) => v[1] === color)[0];
              const goal = {
                D2: "NE",
                A1: "SW",
                A2: "SE",
                B1: "NW",
                B2: "SW",
                C1: "NE",
                C2: "NW",
                D1: "SE",
              };
              return output[goal[target]]();
            }
            const arr = data.triggerSetConfig.engravement1DropTower === "tank/healer" ? ["NE", "SE", "SW", "NW"] : ["NW", "SW", "SE", "NE"];
            const rule = {
              tank: arr,
              healer: arr,
              dps: [...arr].reverse(),
            }[data.role];
            if (matches.effectId === engravementIdMap.lightTower) {
              data.souma.engravement1LightBeamsPos.sort((a, b) => rule.indexOf(a) - rule.indexOf(b));
              return output.lightTowerSide({
                pos: output[data.souma.engravement1LightBeamsPos[0]](),
              });
            } else {
              data.souma.engravement1DarkBeamsPos.sort((a, b) => rule.indexOf(a) - rule.indexOf(b));
              return output.darkTowerSide({
                pos: output[data.souma.engravement1DarkBeamsPos[0]](),
              });
            }
          }
        },
        outputStrings: {
          lightTowerSide: {
            en: "去 ${pos} 放光塔",
          },
          darkTowerSide: {
            en: "去 ${pos} 放暗塔",
          },
          lightTower: {
            en: "放光塔",
          },
          darkTower: {
            en: "放暗塔",
          },
          NE: Outputs.dirNE,
          NW: Outputs.dirNW,
          SE: Outputs.dirSE,
          SW: Outputs.dirSW,
        },
      },
      {
        id: "P12S Engravement 1 Tower Soak",
        type: "GainsEffect",
        netRegex: { effectId: engravementTiltIds },
        condition: (data, matches) => data.souma.engravementCounter === 1 && data.me === matches.target,
        suppressSeconds: 5,
        alertText: (data, matches, output) => {
          if (!data.souma.engravement1Towers.includes(data.me)) {
            if (matches.effectId === engravementIdMap.lightTilt) return output.lightTilt();
            return output.darkTilt();
          }
        },
        outputStrings: {
          lightTilt: {
            en: "踩暗塔",
          },
          darkTilt: {
            en: "踩光塔",
          },
        },
      },
      {
        id: "P12S Engravement 2 Debuff",
        type: "GainsEffect",
        netRegex: {
          effectId: [...engravementBeamIds, ...engravementTowerIds, ...engravementTiltIds],
        },
        condition: (data, matches) => data.souma.engravementCounter === 2 && data.me === matches.target,
        suppressSeconds: 30,
        run: (data, matches) => (data.souma.engravement2MyLabel = engravementLabelMap[matches.effectId]),
      },
      {
        id: "P12S Engravement 2 Heavensflame Soul Early",
        type: "GainsEffect",
        netRegex: { effectId: "DFA" },
        diabled: true,
        // condition: (data, matches) => data.souma.engravementCounter === 2 && data.me === matches.target,
        // delaySeconds: 6.5,
        // infoText: (_data, _matches, output) => output.spreadLater(),
        // outputStrings: {
        //   spreadLater: {
        //     en: "（稍后分散）",
        //   },
        // },
      },
      {
        id: "P12S Engravement 2 Tower Drop/Soak Reminder",
        type: "GainsEffect",
        netRegex: { effectId: [...engravementTowerIds, ...engravementBeamIds] },
        condition: (data, matches) => data.souma.engravementCounter === 2 && data.me === matches.target,
        delaySeconds: 16,
        alertText: (_data, matches, output) => {
          const engraveLabel = engravementLabelMap[matches.effectId];
          if (engraveLabel === undefined) return;
          return output[engraveLabel]();
        },
        outputStrings: {
          lightBeam: {
            en: "踩暗塔",
          },
          darkBeam: {
            en: "踩光塔",
          },
          lightTower: {
            en: "放光塔",
          },
          darkTower: {
            en: "放暗塔",
          },
        },
      },
      {
        id: "P12S Engravement 2 Heavensflame Soul",
        type: "GainsEffect",
        netRegex: { effectId: "DFA" },
        condition: (data, matches) => data.souma.engravementCounter === 2 && data.me === matches.target,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
        response: Responses.spread("alert"),
      },
      {
        id: "P12S Engravement 3 Theos Initial",
        type: "GainsEffect",
        netRegex: { effectId: engravement3TheosSoulIds },
        condition: (data, matches) => data.souma.engravementCounter === 3 && data.me === matches.target,
        alertText: (data, matches, output) => {
          const engraveLabel = engravementLabelMap[matches.effectId];
          if (engraveLabel === undefined) return;
          if (engraveLabel === "crossMarked") data.souma.en3b = ["outsideNW", "outsideNE"];
          else if (engraveLabel === "xMarked") data.souma.en3b = ["outsideSW", "outsideSE"];
          return output[engraveLabel]();
        },
        outputStrings: {
          crossMarked: {
            en: "第一排 十点名",
          },
          xMarked: {
            en: "第四排 叉点名",
          },
        },
      },
      {
        id: "P12S Engravement 3 Theos Drop AoE",
        type: "GainsEffect",
        netRegex: { effectId: engravement3TheosSoulIds },
        condition: (data, matches) => data.souma.engravementCounter === 3 && data.me === matches.target,
        delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
        alertText: (_data, matches, output) => {
          const engraveLabel = engravementLabelMap[matches.effectId];
          if (engraveLabel === undefined) return;
          return output[engraveLabel]();
        },
        outputStrings: {
          crossMarked: {
            en: "角落放十字",
          },
          xMarked: {
            en: "正南放叉字",
          },
        },
      },
      {
        id: "P12S Engravement 3 Theos Bait Adds",
        type: "GainsEffect",
        netRegex: { effectId: engravement3TheosSoulIds },
        condition: (data, matches) => data.souma.engravementCounter === 3 && data.me === matches.target,
        delaySeconds: (_data, matches) => parseFloat(matches.duration),
        alertText: (_data, _matches, output) => output.baitCleave(),
        outputStrings: {
          baitCleave: {
            en: "引导射线",
          },
        },
      },
      {
        id: "P12S Engravement 3 Towers Collect",
        type: "GainsEffect",
        netRegex: { effectId: engravementTowerIds },
        condition: (data) => data.souma.engravementCounter === 3,
        run: (data, matches) => {
          data.souma.engravement3TowerPlayers.push(matches.target);
          data.souma.engravement3TowerType = matches.effectId === engravementIdMap.lightTower ? "lightTower" : "darkTower";
        },
      },

      {
        id: "P12S Engravement 3 Sample Safe Tile",
        type: "Tether",
        netRegex: { id: "00E8", capture: true },
        condition: (data) => data.souma.engravementCounter === 3 && data.souma.sampleTilesEngravement3 !== undefined,
        preRun: (data, matches) => data.souma.sampleTilesEngravement3.push(matches),
        promise: async (data) => {
          data.souma.combatantDataEngravement3 = [];
          const ids = data.souma.sampleTilesEngravement3.map((tile) => parseInt(tile.sourceId, 16));
          data.souma.combatantDataEngravement3 = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: ids,
            })
          ).combatants;
        },
        alertText: (data, _matches, output) => {
          if (data.souma.combatantDataEngravement3.length !== 4) return;
          let safeTiles = ["outsideNW", "outsideNE", "insideNW", "insideNE", "insideSW", "insideSE", "outsideSW", "outsideSE"];
          data.souma.combatantDataEngravement3.forEach((tile) => {
            if (tile.PosX !== undefined && tile.PosY !== undefined) {
              let unsafeTile;
              if (tile.PosX < centerX) {
                if (tile.PosY < 90) unsafeTile = "outsideNW";
                else if (tile.PosY > 110) unsafeTile = "outsideSW";
                else unsafeTile = tile.PosY < centerY ? "insideNW" : "insideSW";
              } else {
                if (tile.PosY < 90) unsafeTile = "outsideNE";
                else if (tile.PosY > 110) unsafeTile = "outsideSE";
                else unsafeTile = tile.PosY < centerY ? "insideNE" : "insideSE";
              }
              safeTiles = safeTiles.filter((tile) => tile !== unsafeTile);
            }
          });
          data.souma.combatantDataEngravement3 = undefined;
          data.souma.engravement3SafeTiles = safeTiles.filter((v) => ["insideNW", "insideSW", "insideNE", "insideSE"].includes(v));
          if (data.souma.en3b) {
            const safe = safeTiles.find((v) => data.souma.en3b.includes(v));
            data.souma.en3b = undefined;
            return output[safe]();
          }
        },
        outputStrings: {
          insideNW: { en: "二左" },
          insideNE: { en: "二右" },
          insideSW: { en: "三左" },
          insideSE: { en: "三右" },
          outsideNW: { en: "左上" },
          outsideNE: { en: "右上" },
          outsideSW: { en: "左下" },
          outsideSE: { en: "右下" },
        },
      },
      {
        id: "P12S Engravement 3 Paradeigma Adds Collect",
        type: "StartsUsing",
        netRegex: { id: ["82F1", "82F2"] },
        condition: (data) => data.souma.engravementCounter === 3,
        run: (data, matches) => {
          const tetherPlayerSide = parseFloat(matches.x) > 100 ? "west" : "east";
          if (tetherAbilityToTowerMap[matches.id] === data.souma.engravement3TowerType) data.souma.engravement3TethersSide = tetherPlayerSide;
        },
      },
      {
        id: "P12S Engravement 3 Towers Initial",
        type: "GainsEffect",
        netRegex: { effectId: engravementTowerIds },
        condition: (data, matches) => data.souma.engravementCounter === 3 && data.me === matches.target,
        delaySeconds: 0.3,
        alertText: (data, _matches, output) => {
          let color = output.unknown();
          if (data.souma.engravement3TowerType !== undefined) color = data.souma.engravement3TowerType === "lightTower" ? output.light() : output.dark();
          const partner = data.souma.engravement3TowerPlayers.find((name) => name !== data.me);
          const rp = {
            me: getRpByName(data, data.me),
            partner: getRpByName(data, partner),
          };
          const rule = (data.triggerSetConfig.engravement3TowerTHSort ?? "MT/ST/H1/H2").toUpperCase().split(/[\/\\,\.\>\<\|\:]/);
          const index = {
            me: rule.findIndex((v) => v === rp.me),
            partner: rule.findIndex((v) => v === rp.partner),
          };
          if (data.triggerSetConfig.engravement3TowerTHSort2 === "上下") {
            const num = index.me < index.partner ? "二" : "三";
            if (num === "二") data.souma.en3b = ["insideNW", "insideNE"];
            else data.souma.en3b = ["insideSW", "insideSE"];
            return output.towerOnYouGame8({ num, color });
          } else {
            const dir = index.me < index.partner ? "左" : "右";
            if (dir === "左") data.souma.en3b = ["insideNW", "insideSW"];
            else data.souma.en3b = ["insideNE", "insideSE"];
            return output.towerOnYouGuozi({ dir, color });
          }
        },
        outputStrings: {
          towerOnYouGuozi: { en: "${dir}侧${color}塔" },
          towerOnYouGame8: {
            en: "第${num}排${color}塔",
          },
          light: {
            en: "光",
          },
          dark: {
            en: "暗",
          },
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Engravement 3 Paradeigma Tethers Collect",
        type: "Tether",
        netRegex: { id: Object.keys(anthroposTetherMap) },
        condition: (data) => data.souma.engravementCounter === 3 && data.souma.engravement3TetherIds.length < 4,
        preRun: (data, matches) => {
          const tetherType = anthroposTetherMap[matches.id];
          if (tetherType === undefined) return;
          data.souma.engravement3TetherPlayers[matches.target] = tetherType;
          const sourceId = parseInt(matches.sourceId, 16);
          if (!data.souma.engravement3TetherIds.includes(sourceId)) {
            data.souma.engravement3TetherIds.push(sourceId);
            data.souma.engravement3TetherMap[sourceId] = matches.target;
          }
        },
        delaySeconds: 1.5,
        duration: 6,
        promise: async (data) => {
          if (data.souma.engravement3TetherIds.length === 4) {
            data.souma.combatantData = [];
            data.souma.combatantData = (
              await callOverlayHandler({
                call: "getCombatants",
                ids: data.souma.engravement3TetherIds,
              })
            ).combatants;
            const myColor = data.souma.engravement3TetherPlayers[data.me];
            if (myColor === undefined) return;
            const parnter = Object.entries(data.souma.engravement3TetherPlayers).find((v) => v[1] === myColor && v[0] !== data.me)[0];
            const group = [];
            for (const combatant of data.souma.combatantData) {
              const x = combatant.PosX;
              const y = combatant.PosY;
              const combatantId = combatant.ID;
              if (combatantId === undefined) return;
              const target = data.souma.engravement3TetherMap[combatantId];
              if (target === data.me || target === parnter) {
                group.push({ name: target, x, y, rp: getRpByName(data, target) });
              }
            }
            group.sort((a, b) => {
              return group[0].x < 100 ? a.y - b.y : b.y - a.y;
            });
            data.souma.engravement3GroupInfo = { left: group[0], right: group[1] };
          }
        },
        infoText: (data, _, output) => {
          // 75,97 右半场 靠下
          // 75,103 右半场 靠上
          // 125,97 左半场 靠下
          // 125,103 左半场 靠下
          if (data.souma._engravement3Exported) return;
          if (data.souma.engravement3TetherIds.length === 4 && data.souma.engravement3TetherPlayers[data.me] && data.souma.engravement3GroupInfo) {
            const info =
              data.souma.engravement3GroupInfo.left.name === data.me
                ? data.souma.engravement3GroupInfo.left
                : data.souma.engravement3GroupInfo.right.name === data.me
                ? data.souma.engravement3GroupInfo.right
                : undefined;
            if (info) {
              const pos = data.souma.engravement3SafeTiles.find((v) => v.endsWith(info.x < 100 ? "E" : "W"));
              const upOrDown = +info.y < 100 ? "down" : "up";
              const result = output[pos + upOrDown]();
              data.souma._engravement3Exported = true;
              return result;
            }
          }
        },
        outputStrings: {
          insideNEup: { en: "右上 斜线" },
          insideNEdown: { en: "右偏上 直线" },
          insideNWup: { en: "左上 斜线" },
          insideNWdown: { en: "左偏上 直线" },
          insideSEup: { en: "右偏下 直线" },
          insideSEdown: { en: "右下 斜线" },
          insideSWup: { en: "左偏下 直线" },
          insideSWdown: { en: "左下 斜线" },
        },
      },
      {
        id: "P12S Engravement 3 Paradeigma Early Tower Color",
        type: "Tether",
        netRegex: { id: Object.keys(anthroposTetherMap) },
        condition: (data, matches) => data.souma.engravementCounter === 3 && data.me === matches.target,
        suppressSeconds: 10,
        delaySeconds: 4,
        infoText: (data, matches, output) => {
          if (data.souma.engravement3TowerPlayers.includes(data.me)) return;
          const soakMap = {
            lightTower: "dark",
            darkTower: "light",
          };
          const myEffect = anthroposTetherMap[matches.id];
          if (myEffect === undefined || data.souma.engravement3TowerType === undefined) return;
          const soakTiltType = soakMap[data.souma.engravement3TowerType];
          if (myEffect === soakTiltType) {
            let dir;
            if (data.triggerSetConfig.engravement3TowerDPS === "heading") {
              dir = data.souma.engravement3GroupInfo.left.name === data.me ? "enter" : "back";
            } else if (data.triggerSetConfig.engravement3TowerDPS === "priority") {
              const rule = ["D1", "D2", "D3", "D4"];
              const arr = Object.entries(data.souma.engravement3GroupInfo).sort((a, b) => {
                return rule.indexOf(a[1].rp) - rule.indexOf(b[1].rp);
              });
              dir = arr[0][1].name === data.me ? "enter" : "back";
            }
            const text = output.tower({ way: output[dir]() });
            data.souma.engravement3TowerText = text;
            return output.ready({ text });
          }
          const text = output.baitLater();
          data.souma.engravement3TowerText = text;
          return output.ready({ text });
        },
        outputStrings: {
          ready: { en: "准备${text}" },
          tower: { en: "踩${way}的塔" },
          back: { en: "原地" },
          enter: { en: "场中" },
          baitLater: { en: "引导激光" },
        },
      },
      {
        id: "P12S Engravement 3 Towers Drop Location",
        type: "Ability",
        netRegex: { id: "8312" },
        condition: (data, matches) =>
          data.souma.engravementCounter === 3 && data.me === matches.target && data.souma.engravement3TowerPlayers.includes(data.me),
        durationSeconds: 6,
        alertText: (data, matches, output) => {
          let towerColor = output.unknown();
          if (data.souma.engravement3TowerType !== undefined) towerColor = data.souma.engravement3TowerType === "lightTower" ? output.light() : output.dark();
          if (data.souma.engravement3TethersSide === undefined) return output.dropTower({ color: towerColor, spot: output.unknown() });
          const mySide = parseFloat(matches.x) > 100 ? "east" : "west";
          const towerSpot = mySide === data.souma.engravement3TethersSide ? output.corner() : output.platform();
          return output.dropTower({ color: towerColor, spot: towerSpot });
        },
        outputStrings: {
          dropTower: {
            en: "${spot}放${color}塔",
          },
          light: {
            en: "光",
          },
          dark: {
            en: "暗",
          },
          platform: {
            en: "原地",
          },
          corner: {
            en: "场中",
          },
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Engravement 3 Soak Tower/Bait Adds",
        type: "GainsEffect",
        netRegex: { effectId: engravementTiltIds },
        condition: (data, matches) => {
          if (!data.souma.isDoorBoss) return false;
          if (data.souma.engravementCounter === 3 && data.me === matches.target && data.souma.engravement3TowerText) return true;
          return false;
        },
        suppressSeconds: 15,
        alertText: (data) => data.souma.engravement3TowerText,
        run: (data) => {
          delete data.souma.engravement3TowerText;
          delete data.souma._engravement3Exported;
        },
      },
      {
        id: "P12S Glaukopis First Cleave",
        type: "StartsUsing",
        netRegex: { id: "82FC" },
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            cleaveOnYou: Outputs.tankCleaveOnYou,
            tankBusterCleaves: Outputs.tankBusterCleaves,
            cleaveSwap: Outputs.tankSwap,
            avoidTankCleaves: Outputs.avoidTankCleaves,
          };
          data.souma.glaukopisFirstHit = matches.target;
          if (data.me === matches.target) return { alertText: output.cleaveOnYou() };
          if (data.role === "tank") return { alertText: output.cleaveSwap() };
          if (data.role === "healer" || data.job === "BLU") return { alertText: output.tankBusterCleaves() };
          return { infoText: output.avoidTankCleaves() };
        },
      },
      {
        id: "P12S Glaukopis Second Cleave Collect",
        type: "Ability",
        netRegex: { id: "82FD" },
        run: (data, matches) => {
          if (matches.target === data.souma.glaukopisFirstHit) data.souma.glaukopisSecondHitSame = true;
        },
      },
      {
        id: "P12S Glaukopis Second Cleave Swap",
        type: "Ability",
        netRegex: { id: "82FD", capture: false },
        condition: (data) => data.role === "tank" || data.job === "BLU",
        delaySeconds: 0.1,
        suppressSeconds: 1,
        alertText: (data, _matches, output) => {
          if (data.me === data.souma.glaukopisFirstHit && !data.souma.glaukopisSecondHitSame) return output.tankSwap();
        },
        run: (data) => {
          delete data.souma.glaukopisFirstHit;
          data.souma.glaukopisSecondHitSame = false;
        },
        outputStrings: {
          tankSwap: Outputs.tankSwap,
        },
      },
      {
        id: "P12S Peridialogos",
        type: "StartsUsing",
        netRegex: { id: "82FF", capture: false },
        alertText: (data, _matches, output) => (data.role === "tank" ? output.tanksInPartyOut() : output.partyOutTanksIn()),
        outputStrings: {
          partyOutTanksIn: {
            en: "远离",
          },
          tanksInPartyOut: {
            en: "靠近",
          },
        },
      },
      {
        id: "P12S Apodialogos",
        type: "StartsUsing",
        netRegex: { id: "82FE", capture: false },
        alertText: (data, _matches, output) => (data.role === "tank" ? output.tanksOutPartyIn() : output.partyInTanksOut()),
        outputStrings: {
          partyInTanksOut: {
            en: "靠近",
          },
          tanksOutPartyIn: {
            en: "远离",
          },
        },
      },
      {
        id: "P12S Limit Cut",
        type: "HeadMarker",
        netRegex: {},
        condition: Conditions.targetIsYou(),
        durationSeconds: 20,
        response: (data, matches, output) => {
          const id = getHeadmarkerId(data, matches);
          if (!limitCutIds.includes(id)) return;
          const num = limitCutMap[id];
          if (num === undefined) return;
          data.souma.limitCutNumber = num;
          return {
            alertText: output[num.toString()](),
            tts: output.tts({ num: num }),
          };
        },
        outputStrings: {
          tts: { en: "${num}麻" },
          1: { en: "1麻：下 => 分摊 => 转 => 3喷" },
          2: { en: "2麻：上偏右 => 分摊 => 转 => 4喷" },
          3: { en: "3麻：下 => 分摊 => 转 => 3喷" },
          4: { en: "4麻：上偏右 => 分摊 => 转 => 4喷" },
          5: { en: "5麻：左 + 1喷 => 转 => 分摊" },
          6: { en: "6麻：右 => 2喷 => 转 => 分摊" },
          7: { en: "7麻：左 + 1喷 => 转 => 分摊" },
          8: { en: "8麻：右 => 2喷 => 转 => 分摊" },
        },
      },
      {
        id: "P12S Limit Cut Combatant Tracker",
        type: "Ability",
        netRegex: { id: "82F3", capture: false },
        promise: async (data) => {
          const actorData = await callOverlayHandler({
            call: "getCombatants",
          });
          if (actorData === null) {
            console.error(`LC Combatant Tracker: null data`);
            return;
          }
          const combatants = actorData.combatants.filter((combatant) => {
            const distX = Math.abs(100 - combatant.PosX);
            const distY = Math.abs(100 - combatant.PosY);
            const distance = Math.hypot(distX, distY);
            return combatant.BNpcNameID === 12378 && Math.abs(distance - 10) < 0.25;
          });
          if (combatants.length !== 8) {
            console.error(`LC Combatant Tracker: expected 8, got ${combatants.length}`);
            return;
          }
          data.souma.lcCombatants = combatants;
        },
      },
      {
        id: "P12S Limit Cut Line Bait Collector",
        type: "CombatantMemory",
        netRegex: {
          id: "40[0-9A-F]{6}",
          pair: [{ key: "ModelStatus", value: "16384" }],
          capture: true,
        },
        condition: (data, matches) => {
          if (data.souma.lcWhiteFlameDelay !== undefined) return false;
          const combatant = data.souma.lcCombatants.find((c) => c.ID === parseInt(matches.id, 16));
          if (combatant === undefined) return false;
          combatant.order = data.souma.lcCombatantsOffset;
          ++data.souma.lcCombatantsOffset;
          return data.souma.lcCombatantsOffset === 8;
        },
        run: (data) => {
          const orderedJumps = data.souma.lcCombatants
            .filter((combatant) => Directions.xyTo8DirNum(combatant.PosX, combatant.PosY, 100, 100) % 2 === 1)
            .map((combatant) => combatant.order)
            .sort((left, right) => (left ?? 0) - (right ?? 0));
          if (orderedJumps.length !== 4) {
            console.error(`LC Line Bait Collector: Incorrect count of intercardinal adds`, data.souma.lcCombatants);
            return;
          }
          const [o1, o2, o3, o4] = orderedJumps;
          if (o1 === undefined || o2 === undefined || o3 === undefined || o4 === undefined) return;
          data.souma.lcWhiteFlameDelay = [o1 + 1, o2 - o1, o3 - o2, o4 - o3];
        },
      },
      {
        id: "P12S Palladion White Flame Initial",
        type: "StartsUsing",
        netRegex: { id: "82F5", capture: false },
        delaySeconds: 2,
        durationSeconds: (data) => {
          const delay = data.souma.lcWhiteFlameDelay?.[0] ?? 1;
          return 8 - 2 + 3 * (delay - 1) - 0.5;
        },
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            baitLaser: {
              en: "${delay}",
            },
            firstWhiteFlame: {
              en: "(五七)",
            },
            ...whiteFlameDelayOutputStrings,
          };
          const delayMap = {
            1: output.delay1(),
            2: output.delay2(),
            3: output.delay3(),
            4: output.delay4(),
            5: output.delay5(),
          };
          const delayStr = delayMap[data.souma.lcWhiteFlameDelay?.[0] ?? 1];
          const infoText = output.firstWhiteFlame();
          if (data.souma.limitCutNumber === 5 || data.souma.limitCutNumber === 7) {
            return { alarmText: output.baitLaser({ delay: delayStr }) };
          }
          return { infoText: infoText, tts: null };
        },
      },
      {
        id: "P12S Palladion White Flame Followup",
        type: "Ability",
        netRegex: { id: "82EF", capture: false },
        condition: (data) => data.souma.phase === "palladion",
        preRun: (data) => data.souma.whiteFlameCounter++,
        durationSeconds: (data) => {
          const delay = data.souma.lcWhiteFlameDelay?.[data.souma.whiteFlameCounter] ?? 1;
          return 3 * delay - 0.5;
        },
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            baitLaser: {
              en: "${delay}",
            },
            secondWhiteFlame: {
              en: "(六八)",
            },
            thirdWhiteFlame: {
              en: "(一三)",
            },
            fourthWhiteFlame: {
              en: "(二四)",
            },
            ...whiteFlameDelayOutputStrings,
          };
          const delayMap = {
            1: output.delay1(),
            2: output.delay2(),
            3: output.delay3(),
            4: output.delay4(),
            5: output.delay5(),
          };
          const delayStr = delayMap[data.souma.lcWhiteFlameDelay?.[data.souma.whiteFlameCounter] ?? 1];
          const baitLaser = output.baitLaser({ delay: delayStr });
          if (data.souma.whiteFlameCounter === 1) {
            const infoText = output.secondWhiteFlame({ delay: delayStr });
            if (data.souma.limitCutNumber === 6 || data.souma.limitCutNumber === 8) return { alarmText: baitLaser, infoText: infoText };
            return { infoText: infoText, tts: null };
          }
          if (data.souma.whiteFlameCounter === 2) {
            const infoText = output.thirdWhiteFlame({ delay: delayStr });
            if (data.souma.limitCutNumber === 1 || data.souma.limitCutNumber === 3) return { alarmText: baitLaser, infoText: infoText };
            return { infoText: infoText, tts: null };
          }
          if (data.souma.whiteFlameCounter === 3) {
            const infoText = output.fourthWhiteFlame({ delay: delayStr });
            if (data.souma.limitCutNumber === 2 || data.souma.limitCutNumber === 4) return { alarmText: baitLaser, infoText: infoText };
            return { infoText: infoText, tts: null };
          }
        },
      },

      {
        id: "P12S Superchain Theory Collect",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds },
        run: (data, matches) => data.souma.superchainCollect.push(matches),
      },
      {
        id: "P12S Superchain Theory I First Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain1" && data.souma.superchainCollect.length === 3,
        alertText: (data, _matches, output) => {
          const ids = data.souma.superchainCollect
            .slice(0, 3)
            .map((x) => x.npcBaseId)
            .sort();
          const [destMatches] = data.souma.superchainCollect.filter((x) => x.npcBaseId === superchainNpcBaseIdMap.destination);
          const [, inOut, proteanPartner] = ids;
          if (destMatches === undefined || inOut === undefined || proteanPartner === undefined) return;
          const dirStr = Directions.addedCombatantPosTo8DirOutput(destMatches, centerX, centerY);
          const dir = output[dirStr]();
          data.souma.superchain1FirstDest = destMatches;
          if (inOut === superchainNpcBaseIdMap.in) {
            if (proteanPartner === superchainNpcBaseIdMap.protean) return output.inAndProtean({ dir: dir });
            return output.inAndPartners({ dir: dir });
          }
          if (proteanPartner === superchainNpcBaseIdMap.protean) return output.outAndProtean({ dir: dir });
          return output.outAndPartners({ dir: dir });
        },
        outputStrings: {
          inAndProtean: {
            en: "${dir} 靠近 + 八方分散",
          },
          inAndPartners: {
            en: "${dir} 靠近 + 二二分摊",
          },
          outAndProtean: {
            en: "${dir} 远离 + 八方分散",
          },
          outAndPartners: {
            en: "${dir} 远离 + 二二分摊",
          },
          ...Directions.outputStrings8Dir,
        },
      },
      {
        id: "P12S Superchain Theory I Second Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain1" && data.souma.superchainCollect.length === 7,
        delaySeconds: 4.5,
        durationSeconds: 8,
        alertText: (data, _matches, output) => {
          const collect = data.souma.superchainCollect.slice(3, 7).sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const firstMechDest = data.souma.superchain1FirstDest;
          if (firstMechDest === undefined) return;
          const [dest1, dest2, donut, sphere] = collect;
          if (dest1 === undefined || dest2 === undefined || donut === undefined || sphere === undefined) return;
          const expectedDistanceSqr = 561.3101;
          const dest1Donut = Math.abs(distSqr(dest1, donut) - expectedDistanceSqr);
          const dest2Donut = Math.abs(distSqr(dest2, donut) - expectedDistanceSqr);
          const dest1Sphere = Math.abs(distSqr(dest1, sphere) - expectedDistanceSqr);
          const dest2Sphere = Math.abs(distSqr(dest2, sphere) - expectedDistanceSqr);
          let donutDest;
          if (dest1Donut < dest1Sphere && dest2Donut > dest2Sphere) donutDest = dest1;
          else if (dest1Donut > dest1Sphere && dest2Donut < dest2Sphere) donutDest = dest2;
          if (donutDest === undefined) return;
          const prevDir = Directions.addedCombatantPosTo8Dir(firstMechDest, centerX, centerY);
          const thisDir = Directions.addedCombatantPosTo8Dir(donutDest, centerX, centerY);
          const engrave = output[data.souma.engravement2MyLabel ?? "unknown"]();
          const rotation = (thisDir - prevDir + 8) % 8;
          if (rotation === 2) return output.leftClockwise({ engrave: engrave });
          if (rotation === 6) return output.rightCounterclockwise({ engrave: engrave });
        },
        outputStrings: {
          leftClockwise: {
            en: "左左 => ${engrave}",
          },
          rightCounterclockwise: {
            en: "右右 => ${engrave}",
          },
          lightBeam: {
            // 光直线
            en: "分摊（右）",
          },
          darkBeam: {
            // 暗直线
            en: "分摊（左）",
          },
          lightTower: {
            // 光塔
            en: "分摊（左）",
          },
          darkTower: {
            // 暗塔
            en: "分摊（右）",
          },
          lightTilt: {
            // 光易伤
            en: "分摊（左）",
          },
          darkTilt: {
            // 暗易伤
            en: "分摊（右）",
          },
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Superchain Theory I Third Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain1" && data.souma.superchainCollect.length === 10,
        delaySeconds: 9.1,
        durationSeconds: 5.5,
        alertText: (data, _matches, output) => {
          const collect = data.souma.superchainCollect.slice(7, 10).sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const [dest, donut, sphere] = collect;
          if (dest === undefined || donut === undefined || sphere === undefined) return;
          const donutDistSqr = distSqr(donut, dest);
          const sphereDistSqr = distSqr(sphere, dest);
          const moveOrder = donutDistSqr > sphereDistSqr ? output.inThenOut() : output.outThenIn();
          const engrave = output[data.souma.engravement2MyLabel ?? "unknown"]();
          return output.combined({ move: moveOrder, engrave: engrave });
        },
        outputStrings: {
          combined: {
            en: "${move} => ${engrave}",
          },
          inThenOut: Outputs.inThenOut,
          outThenIn: Outputs.outThenIn,
          lightBeam: {
            en: "右边踩暗塔",
          },
          darkBeam: {
            en: "左边踩光塔",
          },
          lightTower: {
            en: "左边放光塔",
          },
          darkTower: {
            en: "右边放暗塔",
          },
          lightTilt: Outputs.spread,
          darkTilt: Outputs.spread,
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Superchain Theory IIa ",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain2a" && data.souma.superchainCollect.length === 10,
        run: (data) => {
          const collect = data.souma.superchainCollect.sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const [dest1, dest2, dest3, , , , , , /* out1 */ /* out2 */ /* out3 */ /* out4 */ /* in1 */ mech1, mech2] = collect;
          if (dest1 === undefined || dest2 === undefined || dest3 === undefined || mech1 === undefined || mech2 === undefined) return;
          const [destNorth /* destMid */, , destSouth] = [dest1, dest2, dest3].sort((a, b) => parseFloat(a.y) - parseFloat(b.y));
          if (destNorth === undefined || destSouth === undefined) return;
          const mech1NorthDist = distSqr(mech1, destNorth);
          const mech2NorthDist = distSqr(mech2, destNorth);
          const mech1SouthDist = distSqr(mech1, destSouth);
          const mech2SouthDist = distSqr(mech2, destSouth);
          const firstDistance = 100;
          const secondDistance = 1000;
          let secondMech;
          let firstDir;
          let secondDir;
          if (mech1NorthDist < firstDistance || mech2NorthDist < firstDistance) firstDir = "north";
          else if (mech1SouthDist < firstDistance || mech2SouthDist < firstDistance) firstDir = "south";
          if (mech1NorthDist > secondDistance) {
            secondDir = "north";
            secondMech = mech1;
          } else if (mech1SouthDist > secondDistance) {
            secondDir = "south";
            secondMech = mech1;
          } else if (mech2NorthDist > secondDistance) {
            secondDir = "north";
            secondMech = mech2;
          } else if (mech2SouthDist > secondDistance) {
            secondDir = "south";
            secondMech = mech2;
          }
          if (secondMech === undefined || firstDir === undefined || secondDir === undefined) {
            const distances = [mech1NorthDist, mech1SouthDist, mech2NorthDist, mech2SouthDist];
            console.error(`Superchain2a: bad distances: ${JSON.stringify(distances)}`);
            return;
          }
          const isSecondMechProtean = secondMech.npcBaseId === superchainNpcBaseIdMap.protean;
          data.souma.superchain2aFirstDir = firstDir;
          data.souma.superchain2aSecondDir = secondDir;
          data.souma.superchain2aSecondMech = isSecondMechProtean ? "protean" : "partners";
        },
      },
      {
        id: "P12S Superchain Theory IIb First Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain2b" && data.souma.superchainCollect.length === 4,
        alertText: (data, _matches, output) => {
          const collect = data.souma.superchainCollect.slice(0, 4).sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const donut = collect[3];
          if (donut === undefined) return;
          if (parseFloat(donut.y) > 100) {
            data.souma.superchain2bFirstDir = "south";
            return output.south();
          }
          data.souma.superchain2bFirstDir = "north";
          return output.north();
        },
        outputStrings: {
          north: { en: "A点月环 面向BOSS" },
          south: { en: "C点月环" },
        },
      },
      {
        id: "P12S Superchain Theory IIb Second Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain2b" && data.souma.superchainCollect.length === 8,
        delaySeconds: 4.5,
        durationSeconds: 8,
        alertText: (data, _matches, output) => {
          const collect = data.souma.superchainCollect.slice(4, 8).sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const partnerProtean = collect[3];
          if (partnerProtean === undefined) return;
          let mechanicStr;
          if (partnerProtean.npcBaseId === superchainNpcBaseIdMap.protean) {
            mechanicStr = output.protean();
            data.souma.superchain2bSecondMech = "protean";
          } else {
            mechanicStr = output.partners();
            data.souma.superchain2bSecondMech = "partners";
          }
          const x = parseFloat(partnerProtean.x);
          data.souma.superchain2bSecondDir = x > 100 ? "east" : "west";
          let dirStr;
          if (x > 100) {
            data.souma.superchain2bSecondDir = "east";
            dirStr = data.souma.superchain2bFirstDir === "south" ? "eastFromSouth" : "eastFromNorth";
          } else {
            data.souma.superchain2bSecondDir = "west";
            dirStr = data.souma.superchain2bFirstDir === "south" ? "westFromSouth" : "westFromNorth";
          }
          return output.combined({ dir: output[dirStr](), mechanic: mechanicStr });
        },
        outputStrings: {
          combined: {
            en: "${dir} 躲直线 => ${mechanic}",
          },
          east: Outputs.east,
          west: Outputs.west,
          eastFromSouth: {
            en: "向右走",
          },
          eastFromNorth: {
            en: "向左走",
          },
          westFromSouth: {
            en: "向左走",
          },
          westFromNorth: {
            en: "向右走",
          },
          protean: {
            en: "八方分散",
          },
          partners: {
            en: "两人分摊",
          },
        },
      },
      {
        id: "P12S Superchain Theory IIb Second Mechanic + Ray of Light 2",
        type: "StartsUsing",
        netRegex: { id: "82EE" },
        condition: (data) => data.souma.paradeigmaCounter === 4,
        suppressSeconds: 1,
        alertText: (data, matches, output) => {
          if (data.souma.superchain2bSecondMech === undefined) return output.avoid();
          const mechanicStr = output[data.souma.superchain2bSecondMech]();
          const x = Math.round(parseFloat(matches.x));
          if (data.souma.superchain2bSecondDir === undefined || x === undefined) return output.combined({ mechanic: mechanicStr, dir: output.avoid() });
          let safeLane = output.avoid();
          if (x < 92) safeLane = data.souma.superchain2bSecondDir === "east" ? output.outside() : output.inside();
          else if (x > 108) safeLane = data.souma.superchain2bSecondDir === "east" ? output.inside() : output.outside();
          else if (x > 100) safeLane = data.souma.superchain2bSecondDir === "east" ? output.outside() : output.inside();
          else safeLane = data.souma.superchain2bSecondDir === "east" ? output.inside() : output.outside();
          return output.combined({ mechanic: mechanicStr, dir: safeLane });
        },
        outputStrings: {
          combined: {
            en: "${mechanic} => ${dir}",
          },
          protean: {
            en: "八方分散",
          },
          partners: {
            en: "两人分摊",
          },
          inside: {
            en: "进内侧",
          },
          outside: {
            en: "回外侧",
          },
          avoid: {
            en: "躲激光",
          },
        },
      },
      {
        id: "P12S Superchain Theory IIb Third Mechanic",
        type: "AddedCombatant",
        netRegex: { npcNameId: superchainNpcNameId, npcBaseId: superchainNpcBaseIds, capture: false },
        condition: (data) => data.souma.phase === "superchain2b" && data.souma.superchainCollect.length === 13,
        delaySeconds: 13.6,
        durationSeconds: 6,
        alertText: (data, _matches, output) => {
          const collect = data.souma.superchainCollect.slice(8, 13).sort((a, b) => parseInt(a.npcBaseId) - parseInt(b.npcBaseId));
          const partnerProtean = collect[4];
          if (partnerProtean === undefined) return;
          const mechanicStr = partnerProtean.npcBaseId === superchainNpcBaseIdMap.protean ? output.protean() : output.partners();
          const dirStr = parseFloat(partnerProtean.y) > 100 ? output.north() : output.south();
          return output.combined({ dir: dirStr, mechanic: mechanicStr });
        },
        outputStrings: {
          combined: {
            en: "${dir} => 远离 + ${mechanic}",
          },
          north: "A点",
          south: "C点",
          protean: {
            en: "八方分散",
          },
          partners: {
            en: "两人分摊",
          },
        },
      },
      {
        id: "P12S Sample Collect",
        type: "Tether",
        netRegex: { id: "00E8" },
        condition: (data) => data.souma.phase === "superchain2b",
        run: (data, matches) => data.souma.sampleTiles.push(matches),
      },
      {
        id: "P12S Sample Safe Tile",
        type: "Tether",
        netRegex: { id: "00E8", capture: true },
        condition: (data) => data.souma.phase === "superchain2b" && data.souma.sampleTiles.length === 7,
        delaySeconds: 1,
        promise: async (data) => {
          data.souma.combatantData = [];
          const ids = data.souma.sampleTiles.map((tile) => parseInt(tile.sourceId, 16));
          data.souma.combatantData = (
            await callOverlayHandler({
              call: "getCombatants",
              ids: ids,
            })
          ).combatants;
        },
        alertText: (data, _matches, output) => {
          if (data.souma.combatantData.length !== 7) return output.default();
          let safeTiles = ["outsideNW", "outsideNE", "insideNW", "insideNE", "insideSW", "insideSE", "outsideSW", "outsideSE"];
          data.souma.combatantData.forEach((tile) => {
            if (tile.PosX !== undefined && tile.PosY !== undefined) {
              let unsafeTile;
              if (tile.PosX < centerX) {
                if (tile.PosY < 90) unsafeTile = "outsideNW";
                else if (tile.PosY > 110) unsafeTile = "outsideSW";
                else unsafeTile = tile.PosY < centerY ? "insideNW" : "insideSW";
              } else {
                if (tile.PosY < 90) unsafeTile = "outsideNE";
                else if (tile.PosY > 110) unsafeTile = "outsideSE";
                else unsafeTile = tile.PosY < centerY ? "insideNE" : "insideSE";
              }
              safeTiles = safeTiles.filter((tile) => tile !== unsafeTile);
            }
          });
          if (safeTiles.length !== 1) return output.default();
          const safeTile = safeTiles[0];
          if (safeTile === undefined) return output.default();
          return output[safeTile]();
        },
        outputStrings: {
          outsideNW: {
            en: "左上(西北) 外侧",
          },
          outsideNE: {
            en: "右上(东北) 外侧",
          },
          insideNW: {
            en: "左上(西北) 内侧",
          },
          insideNE: {
            en: "右上(东北) 内侧",
          },
          insideSW: {
            en: "左下(西南) 内侧",
          },
          insideSE: {
            en: "右下(东南) 内侧",
          },
          outsideSW: {
            en: "左下(西南) 外侧",
          },
          outsideSE: {
            en: "右下(东南) 外侧",
          },
          default: {
            en: "找安全地板",
          },
        },
      },
      {
        id: "P12S Geocentrism Vertical",
        type: "StartsUsing",
        netRegex: { id: "8329", capture: false },
        alertText: (data, _matches, output) => {
          if (data.souma.phase === "gaiaochos1") return output.text();
          data.souma.geocentrism2OutputStr = output.text();
          return;
        },
        outputStrings: {
          text: {
            en: "垂直",
          },
        },
      },
      {
        id: "P12S Geocentrism Circle",
        type: "StartsUsing",
        netRegex: { id: "832A", capture: false },
        alertText: (data, _matches, output) => {
          if (data.souma.phase === "gaiaochos1") return output.text();
          data.souma.geocentrism2OutputStr = output.text();
          return;
        },
        outputStrings: {
          text: {
            en: "月环",
          },
        },
      },
      {
        id: "P12S Geocentrism Horizontal",
        type: "StartsUsing",
        netRegex: { id: "832B", capture: false },
        alertText: (data, _matches, output) => {
          if (data.souma.phase === "gaiaochos1") return output.text();
          data.souma.geocentrism2OutputStr = output.text();
          return;
        },
        outputStrings: {
          text: {
            en: "水平",
          },
        },
      },
      {
        id: "P12S Classical Concepts Headmarker",
        type: "HeadMarker",
        netRegex: {},
        condition: Conditions.targetIsYou(),
        run: (data, matches) => {
          const id = getHeadmarkerId(data, matches);
          if (!conceptPairIds.includes(id)) return;
          const pair = conceptPairMap[id];
          if (pair === undefined) return;
          data.souma.conceptPair = pair;
        },
      },
      {
        id: "P12S Classical Concepts Debuff",
        type: "GainsEffect",
        netRegex: { effectId: conceptDebuffEffectIds },
        condition: Conditions.targetIsYou(),
        run: (data, matches) => (data.souma.conceptDebuff = conceptDebuffIds[matches.effectId]),
      },
      {
        id: "P12S Classical Concepts Shape Collect",
        type: "AddedCombatant",
        netRegex: { npcBaseId: conceptNpcBaseIds },
        run: (data, matches) => {
          const location = getConceptLocation(matches);
          const color = npcBaseIdToConceptColor[parseInt(matches.npcBaseId)];
          if (location !== undefined && color !== undefined) data.souma.conceptData[location] = color;
        },
      },
      {
        id: "P12S Classical Concepts",
        type: "StartsUsing",
        netRegex: { id: ["8331", "8336"] },
        delaySeconds: (_data, matches) => {
          if (matches.id === "8331") return 8.5;
          return 0;
        },
        durationSeconds: (data, matches) => {
          if (data.souma.phase === "classical1") return 12;
          if (matches.id === "8331") return 7;
          return 9.7;
        },
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            classic1: {
              en: "${column}, ${row} ${intercept} => ${safeZone}",
            },
            alphaSafe: {
              en: "一会去上边",
            },
            betaSafe: {
              en: "一会去下边",
            },
            classic2initial: {
              en: "先去 ${column}, ${row} + ${intercept}",
            },
            classic2actual: {
              en: "再去 ${column}, ${row} + ${intercept}",
            },
            shapeAndDebuff: {
              en: "${shape}, ${debuff}",
            },
            outsideWest: {
              en: "第1列",
            },
            insideWest: {
              en: "第2列",
            },
            insideEast: {
              en: "第3列",
            },
            outsideEast: {
              en: "第4列",
            },
            northRow: {
              en: "第1个方块",
            },
            middleRow: {
              en: "第2个方块",
            },
            southRow: {
              en: "第3个方块",
            },
            leanNorth: {
              en: "靠上",
            },
            leanEast: {
              en: "靠右",
            },
            leanSouth: {
              en: "靠下",
            },
            leanWest: {
              en: "靠左",
            },
            circle: {
              en: "红圆圈",
            },
            triangle: {
              en: "绿三角",
            },
            square: {
              en: "紫方块",
            },
            cross: {
              en: "蓝叉字",
            },
            alpha: {
              en: "阿尔法",
            },
            beta: {
              en: "贝塔",
            },
          };
          if (Object.keys(data.souma.conceptData).length !== 12 || data.souma.conceptDebuff === undefined || data.souma.conceptPair === undefined) return;
          if (data.triggerSetConfig.classicalConceptsPairOrder === "shapeAndDebuff") {
            if (matches.id === "8336") return;
            const myShape = data.souma.conceptPair;
            const myDebuff = data.souma.conceptDebuff;
            const outputStr = output.shapeAndDebuff({
              shape: output[myShape](),
              debuff: output[myDebuff](),
            });
            return { alertText: outputStr };
          }
          let myColumn;
          let myRow;
          let myInterceptOutput;
          if (matches.id === "8331") {
            const columnOrderFromConfig = {
              xsct: ["cross", "square", "circle", "triangle"],
              cxts: ["circle", "cross", "triangle", "square"],
              ctsx: ["circle", "triangle", "square", "cross"],
              ctxs: ["circle", "triangle", "cross", "square"],
            };
            const columnOrder = columnOrderFromConfig[data.triggerSetConfig.classicalConceptsPairOrder];
            if (columnOrder?.length !== 4) return;
            if (data.triggerSetConfig.classicalConcepts2ActualNoFlip && data.souma.phase === "classical2") columnOrder.reverse();
            myColumn = columnOrder.indexOf(data.souma.conceptPair);
            const myColumnLocations = [conceptLocationMap.north[myColumn], conceptLocationMap.middle[myColumn], conceptLocationMap.south[myColumn]];
            const [north, middle, south] = myColumnLocations;
            if (north === undefined || middle === undefined || south === undefined) return;
            let myColumnBlueLocation;
            if (data.souma.conceptData[north] === "blue") myColumnBlueLocation = north;
            else myColumnBlueLocation = data.souma.conceptData[middle] === "blue" ? middle : south;
            myRow = myColumnLocations.indexOf(myColumnBlueLocation);
            const conceptMap = getConceptMap(myColumnBlueLocation);
            const myShapeColor = conceptDebuffToColor[data.souma.conceptDebuff];
            const possibleLocations = [];
            const possibleIntercepts = [];
            conceptMap.forEach((adjacentPair) => {
              const [location, intercept] = adjacentPair;
              if (location !== undefined && intercept !== undefined) {
                const adjacentColor = data.souma.conceptData[location];
                if (adjacentColor === myShapeColor) {
                  possibleLocations.push(location);
                  possibleIntercepts.push(intercept);
                }
              }
            });
            let myIntercept;
            if (possibleLocations.length === 1) {
              myIntercept = possibleIntercepts[0];
            } else if (possibleLocations.length === 2) {
              const possible1 = possibleLocations[0];
              myIntercept = possibleIntercepts[0];
              if (possible1 === undefined) return;
              const possible1AdjacentsMap = getConceptMap(possible1);
              for (const [possibleAdjacentLocation] of possible1AdjacentsMap) {
                if (possibleAdjacentLocation === undefined) continue;
                const possibleAdjacentColor = data.souma.conceptData[possibleAdjacentLocation];
                if (possibleAdjacentColor === "blue" && possibleAdjacentLocation !== myColumnBlueLocation) {
                  myIntercept = possibleIntercepts[1];
                  break;
                }
              }
            }
            if (myIntercept === undefined) return;
            const interceptDelta = myIntercept - myColumnBlueLocation;
            if (interceptDelta === -1) myInterceptOutput = "leanNorth";
            else if (interceptDelta === 5) myInterceptOutput = "leanEast";
            else if (interceptDelta === 1) myInterceptOutput = "leanSouth";
            else myInterceptOutput = "leanWest";
            if (data.souma.phase === "classical1") {
              data.souma.classical1InitialColumn = myColumn;
            }
            if (data.souma.phase === "classical2") {
              data.souma.classical2InitialColumn = myColumn;
              data.souma.classical2InitialRow = myRow;
              data.souma.classical2Intercept = myInterceptOutput;
            }
          }
          if (matches.id === "8336" || (matches.id === "8331" && data.triggerSetConfig.classicalConcepts2ActualNoFlip)) {
            if (data.souma.classical2InitialColumn !== undefined) myColumn = 3 - data.souma.classical2InitialColumn;
            if (data.souma.classical2InitialRow !== undefined) myRow = 2 - data.souma.classical2InitialRow;
            if (data.souma.classical2Intercept !== undefined) {
              const interceptOutputInvertMap = {
                leanNorth: "leanSouth",
                leanSouth: "leanNorth",
                leanEast: "leanWest",
                leanWest: "leanEast",
              };
              myInterceptOutput = interceptOutputInvertMap[data.souma.classical2Intercept];
            }
          }
          if (myColumn === undefined || myRow === undefined || myInterceptOutput === undefined) return;
          const columnOutput = ["outsideWest", "insideWest", "insideEast", "outsideEast"][myColumn];
          const rowOutput = ["northRow", "middleRow", "southRow"][myRow];
          if (columnOutput === undefined || rowOutput === undefined) return;
          let outputStr;
          if (data.souma.phase === "classical1") {
            outputStr = output.classic1({
              column: output[columnOutput](),
              row: output[rowOutput](),
              intercept: output[myInterceptOutput](),
              safeZone: output[data.souma.conceptDebuff + "Safe"](),
            });
            return { alertText: outputStr };
          }
          if (
            (matches.id === "8336" && !data.triggerSetConfig.classicalConcepts2ActualNoFlip) ||
            (matches.id === "8331" && data.triggerSetConfig.classicalConcepts2ActualNoFlip)
          ) {
            outputStr = output.classic2actual({
              column: output[columnOutput](),
              row: output[rowOutput](),
              intercept: output[myInterceptOutput](),
            });
            return { alertText: outputStr };
          }
          if (matches.id === "8331") {
            outputStr = output.classic2initial({
              column: output[columnOutput](),
              row: output[rowOutput](),
              intercept: output[myInterceptOutput](),
            });
            return { infoText: outputStr };
          }
          return;
        },
        run: (data) => {
          if (data.souma.phase === "classical1") {
            delete data.souma.conceptPair;
            data.souma.conceptData = {};
          }
        },
      },
      {
        id: "P12S Palladian Ray 1 Initial",
        type: "LosesEffect",
        netRegex: { effectId: "E04" },
        condition: (data, matches) => data.me === matches.target && data.souma.phase === "classical1",
        durationSeconds: 8,
        alertText: (data, _matches, output) => {
          if (data.souma.conceptDebuff === undefined) return output.default();
          data.souma.conceptResult =
            data.souma.conceptDebuff === "alpha"
              ? output["alpha" + "Col" + (data.souma.classical1InitialColumn + 1) + data.triggerSetConfig.theHandOfParas]()
              : output["beta" + "Col" + (data.souma.classical1InitialColumn + 1) + data.triggerSetConfig.theHandOfParas]();
          return output.text({ debuff: output[data.souma.conceptDebuff](), action: data.souma.conceptResult });
        },
        run: (data) => delete data.souma.conceptDebuff,
        outputStrings: {
          text: { en: "${debuff}空地 => 引导射线 ${action}" },
          alpha: { en: "上边" },
          beta: { en: "下边" },
          alphaCol1KX: { en: "(左上)" },
          alphaCol2KX: { en: "(正上)" },
          alphaCol3KX: { en: "(正上)" },
          alphaCol4KX: { en: "(右上)" },
          betaCol1KX: { en: "(左下)" },
          betaCol2KX: { en: "(正下)" },
          betaCol3KX: { en: "(正下)" },
          betaCol4KX: { en: "(右下)" },
          alphaCol1XX: { en: "(左上)" },
          alphaCol2XX: { en: "(右上)" },
          alphaCol3XX: { en: "(左上)" },
          alphaCol4XX: { en: "(右上)" },
          betaCol1XX: { en: "(左下)" },
          betaCol2XX: { en: "(右下)" },
          betaCol3XX: { en: "(左下)" },
          betaCol4XX: { en: "(右下)" },
          default: { en: "引导射线" },
        },
      },
      {
        id: "P12S Palladian Ray 1 After",
        type: "LosesEffect",
        netRegex: { effectId: "E04" },
        condition: (data, matches) => data.me === matches.target && data.souma.phase === "classical1",
        delaySeconds: 5.5,
        alertText: (data, _matches, output) => {
          if (data.souma.conceptResult) return output.text({ action: data.souma.conceptResult });
        },
        run: (data) => delete data.souma.conceptResult,
        outputStrings: {
          text: { en: "引导 ${action}" },
        },
      },
      {
        id: "P12S Palladian Ray 2 Initial",
        type: "Tether",
        netRegex: { id: "0001" },
        condition: (data, matches) => data.me === matches.target && data.souma.phase === "classical2",
        alertText: (data, _matches, output) => {
          if (data.souma.conceptDebuff === undefined) return output.default();
          data.souma.conceptResult =
            data.souma.conceptDebuff === "alpha"
              ? output["alpha" + "Col" + (data.souma.classical2InitialColumn + 1)]()
              : output["beta" + "Col" + (data.souma.classical2InitialColumn + 1)]();
          return output.text({ action: data.souma.conceptResult });
        },
        outputStrings: {
          text: { en: "引导射线 ${action} => 远离方块" },
          alphaCol1: { en: "(左上)" },
          alphaCol2: { en: "(右上)" },
          alphaCol3: { en: "(左上)" },
          alphaCol4: { en: "(右上)" },
          betaCol1: { en: "(左下)" },
          betaCol2: { en: "(右下)" },
          betaCol3: { en: "(左下)" },
          betaCol4: { en: "(右下)" },
          default: {
            en: "引导射线",
          },
        },
      },
      {
        id: "P12S Palladian Ray Followup",
        type: "Ability",
        netRegex: { id: "8323", capture: false },
        delaySeconds: 2.5,
        alertText: (data, _matches, output) => {
          if (data.souma.phase === "classical2") return output.moveAvoid();
          return output.move();
        },
        outputStrings: {
          moveAvoid: {
            en: "快躲开! (远离方块)",
          },
          move: Outputs.moveAway,
        },
      },
      {
        id: "P12S Pangenesis Collect",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Initial",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Tilt Gain",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Tilt Lose",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Tower",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Slime Reminder",
        disabled: true,
      },
      {
        id: "P12S Pangenesis Tower Call",
        disabled: true,
      },
      {
        id: "P12S Summon Darkness Preposition",
        type: "StartsUsing",
        netRegex: { id: "832F", capture: false },
        condition: (data) => data.souma.seenSecondTethers === false,
        infoText: (_data, _matches, output) => output.stackForTethers(),
        outputStrings: {
          stackForTethers: {
            en: "集合等待连线出现",
          },
        },
      },
      {
        id: "P12S Ultima Ray 1",
        type: "StartsUsing",
        netRegex: { id: "8330" },
        condition: (data) => data.souma.phase === "gaiaochos1",
        infoText: (data, matches, output) => {
          data.souma.darknessClones.push(matches);
          if (data.souma.darknessClones.length !== 3) return;
          const uavCenterX = 100;
          const uavCenterY = 90;
          const unsafeMap = {
            dirN: "dirS",
            dirNE: "dirSW",
            dirE: "dirW",
            dirSE: "dirNW",
            dirS: "dirN",
            dirSW: "dirNE",
            dirW: "dirE",
            dirNW: "dirSE",
          };
          let safeDirs = Object.keys(unsafeMap);
          data.souma.darknessClones.forEach((clone) => {
            const x = parseFloat(clone.x);
            const y = parseFloat(clone.y);
            const cloneDir = Directions.xyTo8DirOutput(x, y, uavCenterX, uavCenterY);
            const pairedDir = unsafeMap[cloneDir];
            safeDirs = safeDirs.filter((dir) => dir !== cloneDir && dir !== pairedDir);
          });
          if (safeDirs.length !== 2) return;
          const sortArr = ["W", "NW", "N", "NE", "SW", "S", "SE", "E"].map((v) => "dir" + v);
          const [dir1, dir2] = safeDirs.sort((a, b) => sortArr.indexOf(a) - sortArr.indexOf(b));
          if (dir1 === undefined || dir2 === undefined) return;
          return output.combined({ dir1: output[dir1](), dir2: output[dir2]() });
        },
        outputStrings: {
          combined: {
            en: "${dir1} / ${dir2} 安全",
          },
          ...Directions.outputStrings8Dir,
        },
      },
      {
        id: "P12S Ultima Ray 2",
        type: "StartsUsing",
        netRegex: { id: "8330", source: "Hemitheos" },
        condition: (data) => data.souma.phase === "gaiaochos2",
        infoText: (_data, matches, output) => {
          const uavCenterX = 100;
          const uavCenterY = 90;
          const safeMap = {
            dirN: ["dirW", "dirE"],
            dirNE: ["dirNW", "dirSE"],
            dirE: ["dirN", "dirS"],
            dirSE: ["dirNE", "dirSW"],
            dirS: ["dirW", "dirE"],
            dirSW: ["dirNW", "dirSE"],
            dirW: ["dirN", "dirS"],
            dirNW: ["dirNE", "dirSW"],
            unknown: [],
          };
          const x = parseFloat(matches.x);
          const y = parseFloat(matches.y);
          const cloneDir = Directions.xyTo8DirOutput(x, y, uavCenterX, uavCenterY);
          const [dir1, dir2] = safeMap[cloneDir];
          if (dir1 === undefined || dir2 === undefined) return;
          return output.combined({ dir1: output[dir1](), dir2: output[dir2]() });
        },
        outputStrings: {
          combined: {
            en: "${dir1} / ${dir2} 安全",
          },
          ...Directions.outputStrings8Dir,
        },
      },
      {
        id: "P12S Gaiaochos",
        type: "StartsUsing",
        netRegex: { id: "8326", capture: false },
        response: Responses.bigAoe("alert"),
      },
      {
        id: "P12S Gaiaochos Tether",
        type: "Tether",
        netRegex: { id: "0009" },
        condition: (data) => data.souma.phase === "gaiaochos1" || data.souma.phase === "gaiaochos2",
        durationSeconds: (data) => (data.souma.phase === "gaiaochos2" ? 6 : 4),
        alertText: (data, matches, output) => {
          if (matches.source !== data.me && matches.target !== data.me) return;
          const partner = matches.source === data.me ? matches.target : matches.source;
          if (data.souma.phase === "gaiaochos1") return output.uav1({ partner: data.ShortName(partner) });
          data.souma.seenSecondTethers = true;
          return output.uav2({
            partner: data.ShortName(partner),
            geocentrism: data.souma.geocentrism2OutputStr ?? output.unknown(),
          });
        },
        outputStrings: {
          uav1: {
            en: "拉断连线",
          },
          uav2: {
            en: "拉断连线 => ${geocentrism} + 躲小怪激光",
          },
          unknown: Outputs.unknown,
        },
      },
      {
        id: "P12S Ultima Blow Tether Collect",
        type: "Tether",
        netRegex: { id: "0001" },
        condition: (data) => data.souma.phase === "gaiaochos2",
        run: (data, matches) => data.souma.gaiaochosTetherCollect.push(matches.target),
      },
      {
        id: "P12S Ultima Blow Tether",
        type: "Tether",
        netRegex: { id: "0001", capture: false },
        condition: (data) => data.souma.phase === "gaiaochos2",
        delaySeconds: 0.5,
        suppressSeconds: 5,
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            blockPartner: {
              en: "替搭档挡枪",
            },
            stretchTether: {
              en: "拉线",
            },
          };
          if (data.souma.gaiaochosTetherCollect.includes(data.me)) return { infoText: output.stretchTether() };
          return { alertText: output.blockPartner() };
        },
        run: (data) => (data.souma.gaiaochosTetherCollect = []),
      },
      {
        id: "P12S Ultima",
        type: "StartsUsing",
        netRegex: { id: ["8682", "86F6"], capture: false },
        response: Responses.aoe("alert"),
      },
      {
        id: "P12S Palladian Grasp Target",
        type: "HeadMarker",
        netRegex: {},
        run: (data, matches) => {
          const id = getHeadmarkerId(data, matches);
          if (id === headmarkers.palladianGrasp) data.souma.palladionGrapsTarget = matches.target;
        },
      },
      {
        id: "P12S Palladian Grasp",
        type: "StartsUsing",
        netRegex: { id: "831A", capture: false },
        response: (data, _match, output) => {
          output.responseOutputStrings = {
            tankBusterCleavesOnYou: { en: "坦克死刑 避开人群半场" },
            tankBusterCleaves: { en: "坦克死刑" },
            avoidTankCleaves: { en: "躲避坦克半场" },
          };
          if (data.soumapalladionGrapsTarget === data.me) return { alertText: output.tankBusterCleavesOnYou() };
          if (data.role === "tank" || data.role === "healer" || data.job === "BLU") return { alertText: output.tankBusterCleaves() };
          return { infoText: output.avoidTankCleaves() };
        },
      },
      {
        id: "P12S Caloric Theory 1 Beacon Collect",
        type: "HeadMarker",
        netRegex: {},
        run: (data, matches) => {
          const id = getHeadmarkerId(data, matches);
          if (id === headmarkers.caloric1Beacon) data.souma.caloric1First.push(matches.target);
        },
      },
      {
        id: "P12S Caloric Theory 1 Beacon",
        type: "StartsUsing",
        netRegex: { id: "8338", capture: false },
        condition: (data) => data.souma.caloricCounter === 1,
        preRun: (data) => {
          data.souma.caloric1Buff = {};
          data.souma.caloric1Mine = undefined;
        },
        delaySeconds: 1,
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            beacon_tank: { en: "预备火 站第三横线偏左" },
            beacon_healer: { en: "预备火 站第三横线偏左" },
            beacon_dps: { en: "预备火 站第三横线偏右" },
            noBeacon: { en: "CD中间" },
          };
          if (data.souma.caloric1First.length !== 2) return;
          const index = data.souma.caloric1First.indexOf(data.me);
          if (index < 0) {
            return { infoText: output.noBeacon() };
          }
          return {
            alertText: output["beacon" + "_" + data.role](),
          };
        },
      },
      {
        id: "P12S Caloric Theory 1 Wind",
        type: "GainsEffect",
        netRegex: { effectId: "E07" },
        run: (data, matches) => (data.souma.caloric1Buff[matches.target] = "wind"),
      },
      {
        id: "P12S Caloric Theory 1 Fire",
        type: "GainsEffect",
        netRegex: { effectId: "E06" },
        alertText: (data, matches, output) => {
          data.souma.caloric1Buff[matches.target] = "fire";
          const duration = parseFloat(matches.duration);
          if (duration < 12 && matches.target === data.me) return output.text();
        },
        outputStrings: {
          text: { en: "二次火点名" },
        },
      },
      {
        id: "P12S Caloric Theory 1 Fire Final",
        type: "GainsEffect",
        netRegex: { effectId: ["E06"] },
        condition: (_data, matches) => parseFloat(matches.duration) > 11,
        delaySeconds: 12.8,
        suppressSeconds: 2,
        alertText: (data, _matches, output) => {
          if (data.souma.caloric1Mine === "fire" && data.souma.caloric1Buff[data.me] === undefined) return output.none();
          if (data.souma.caloric1Mine === "wind") return output.wind();
        },
        outputStrings: {
          none: {
            en: "找火分摊",
          },
          wind: {
            en: "风点名散开",
          },
        },
      },
      {
        id: "P12S Caloric Theory 1 Initial Buff",
        type: "Ability",
        netRegex: { id: "8338", capture: false },
        condition: (data) => data.souma.caloricCounter === 1,
        delaySeconds: 2,
        durationSeconds: 8,
        suppressSeconds: 1,
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            fire1: { en: "左上A点偏上（火1）" },
            fire2: { en: "右上B点偏上（火2）" },
            fire3: { en: "右C点（火3）" },
            fire4: { en: "左D点（火4）" },
            wind3: { en: "右下C点（风3）" },
            wind4: { en: "左下D点（风4）" },
            windBeacon: { en: "平移" },
          };
          const sortArr = (data.triggerSetConfig.windFirePriority ?? "MT/ST/H1/H2/D1/D2/D3/D4").toUpperCase().split(/[\/\\,\.\>\<\|\:]/);
          const myBuff = data.souma.caloric1Buff[data.me];
          data.souma.caloric1Mine = myBuff;
          if (myBuff === undefined) return;
          if (myBuff === "fire") {
            const myTeam = [];
            for (const [name, stat] of Object.entries(data.souma.caloric1Buff)) {
              if (stat === myBuff) myTeam.push(name);
            }
            // 4人火
            const fullTeam = myTeam.sort((a, b) => sortArr.indexOf(getRpByName(data, a)) - sortArr.indexOf(getRpByName(data, b)));
            const myFire = fullTeam.indexOf(data.me) + 1;
            return {
              alertText: output
                ["fire" + myFire]
                // {
                // team: myTeam
                //   .filter((v) => v !== data.me)
                //   .map(data.ShortName)
                //   .join(", "),
                // }
                (),
            };
          }
          if (data.souma.caloric1First.includes(data.me)) {
            // 预备风 直接返回
            return { infoText: output.windBeacon() };
          }
          const myTeam = [];
          for (const [name, stat] of Object.entries(data.souma.caloric1Buff)) {
            if (stat === myBuff && !data.souma.caloric1First.includes(name)) myTeam.push(name);
          }
          const fullTeam = myTeam.sort((a, b) => sortArr.indexOf(getRpByName(data, a)) - sortArr.indexOf(getRpByName(data, b)));
          const myWind = fullTeam.indexOf(data.me) + 1 + 2;
          return {
            alertText: output
              ["wind" + myWind]
              // {
              // team: myTeam
              //   .filter((v) => v !== data.me)
              //   .map(data.ShortName)
              //   .join(", "),
              // }
              (),
          };
        },
        run: (data) => {
          data.souma.caloric1First = [];
          data.souma.caloric1Buff = {};
        },
      },
      {
        id: "P12S Caloric Theory 2 Fire Beacon",
        type: "HeadMarker",
        netRegex: {},
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            fireOnMe: {
              en: "去中间（火点名） ",
            },
            fireOn: { en: "火点 ${player}" },
            fireSwitch: { en: "和 ${player} 换位" },
          };
          if (data.souma.decOffset === undefined) return;
          const id = getHeadmarkerId(data, matches);
          if (id !== headmarkers.caloric2InitialFire) return;
          if (data.me === matches.target) return { alarmText: output.fireOnMe() };
          if (getRpByName(data, data.me) === "MT") {
            return { alertText: output.fireSwitch({ player: `${data.ShortName(matches.target)}(${getRpByName(data, matches.target)})` }) };
          }
          return { infoText: output.fireOn({ player: data.ShortName(matches.target) }) };
        },
      },
      {
        id: "P12S Caloric Theory 2 Wind",
        type: "HeadMarker",
        netRegex: {},
        condition: (data, matches) => data.me === matches.target,
        infoText: (data, matches, output) => {
          const id = getHeadmarkerId(data, matches);
          if (id !== headmarkers.caloric2Wind) return;
          return output.text();
        },
        outputStrings: {
          text: {
            en: "风点名散开",
          },
        },
      },
      {
        id: "P12S Caloric Theory 2 Pass",
        type: "GainsEffect",
        netRegex: { effectId: "E08" },
        condition: (data) => data.souma.caloricCounter === 2,
        durationSeconds: 3,
        response: (data, matches, output) => {
          output.responseOutputStrings = {
            passFire: {
              en: "传火!",
            },
            moveAway: Outputs.moveAway,
          };
          const prevFire = data.souma.caloric2Fire;
          const thisFire = matches.target;
          if (prevFire === thisFire) return;
          data.souma.caloric2Fire = matches.target;
          data.souma.caloric2PassCount++;
          if (thisFire !== data.me && prevFire !== data.me) return;
          if (data.souma.caloric2PassCount === 8 || prevFire === data.me) return { infoText: output.moveAway() };
          if (thisFire === data.me) return { alertText: output.passFire() };
        },
      },
      {
        id: "P12S Ekpyrosis Cast",
        type: "StartsUsing",
        netRegex: { id: "831E", capture: false },
        delaySeconds: (data) => (data.souma.caloricCounter === 2 ? 3 : 0),
        alertText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: {
            en: "地火 + 大AoE伤害!",
          },
        },
      },
      {
        id: "P12S Ekpyrosis Spread",
        type: "Ability",
        netRegex: { id: "831F", capture: false },
        delaySeconds: 0.5,
        suppressSeconds: 2,
        response: Responses.spread("alert"),
      },
      {
        id: "P12S Souma Crush Helm Cleanse",
        type: "StartsUsing",
        netRegex: { id: "8317", capture: false },
        condition: (data) => data.CanCleanse(),
        infoText: (_data, _matches, output) => output.cleanse(),
        outputStrings: {
          cleanse: { en: "准备驱散" },
        },
      },
      {
        id: "P12S Souma Crush Helm Feint",
        type: "StartsUsing",
        netRegex: { id: "8317", capture: false },
        condition: (data) => data.CanFeint(),
        infoText: (_data, _matches, output) => output.text(),
        outputStrings: {
          text: { en: "坦克死刑" },
        },
      },
      {
        id: "P12S Souma Crush Helm Tank",
        type: "StartsUsing",
        netRegex: { id: "8317" },
        condition: (data) => data.role === "tank",
        response: Responses.tankBuster(),
      },
      {
        id: "P12S Souma 理念元素",
        type: "StartsUsing",
        netRegex: { id: "8331", capture: false },
        response: Responses.aoe(),
      },
      {
        id: "P12S Souma 本体星极偏向灵(白) in 泛神论",
        type: "GainsEffect",
        netRegex: { effectId: "DF8", capture: true },
        condition: (data, matches) => data.souma.pantheism && matches.target === data.me && data.souma.pantheismCount < 3,
        infoText: (_data, _matches, output) => output.text(),
        run: (data, _matches, output) => {
          data.souma.pantheismLastText = output.text();
          data.souma.pantheismReported = true;
        },
        outputStrings: {
          text: { en: "踩黑" },
        },
      },
      {
        id: "P12S Souma 本体星极偏向灵(黑) in 泛神论",
        type: "GainsEffect",
        netRegex: { effectId: "DF9", capture: true },
        condition: (data, matches) => data.souma.pantheism && matches.target === data.me && data.souma.pantheismCount < 3,
        infoText: (_data, _matches, output) => output.text(),
        run: (data, _matches, output) => {
          data.souma.pantheismLastText = output.text();
          data.souma.pantheismReported = true;
        },
        outputStrings: {
          text: { en: "踩白" },
        },
      },
      {
        id: "P12S Souma 本体星极偏向灵 in 泛神论",
        type: "GainsEffect",
        netRegex: { effectId: ["DF8", "DF9"], capture: true },
        condition: (data) => data.souma.pantheism,
        suppressSeconds: 1,
        delaySeconds: 0.5,
        infoText: (data) => {
          data.souma.pantheismCount++;
          if (data.souma.pantheismReported) return;
          return data.souma.pantheismLastText;
        },
        run: (data) => (data.souma.pantheismReported = false),
      },
      {
        id: "P12S Souma 本体 星极偏向灵(白)",
        type: "GainsEffect",
        netRegex: { effectId: "DF8", capture: true },
        preRun: (data, matches) => {
          data.souma.white.push({
            target: matches.target,
            count: Number(matches.count),
            duration: parseFloat(matches.duration),
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体 星极偏向星(黑)",
        type: "GainsEffect",
        netRegex: { effectId: "DF9", capture: true },
        preRun: (data, matches) => {
          data.souma.dark.push({
            target: matches.target,
            count: Number(matches.count),
            duration: matches.duration,
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体 消失因子",
        type: "GainsEffect",
        netRegex: { effectId: "E09", capture: true },
        preRun: (data, matches) => {
          data.souma.unstableFactor.push({
            target: matches.target,
            count: Number(matches.count),
            rp: getRpByName(data, matches.target),
          });
        },
      },
      {
        id: "P12S Souma 本体 消失因子结算",
        type: "GainsEffect",
        netRegex: { effectId: "E09", capture: true },
        durationSeconds: 12,
        suppressSeconds: 30,
        delaySeconds: 0.5,
        alertText: (data, _matches, output) => {
          const 优先级 = (data.triggerSetConfig.pantheismPriority ?? "MT/ST/H1/H2/D1/D2/D3/D4").toUpperCase().split(/[\/\\,\.\>\<\|\:]/);
          const 消失因子 = data.souma.unstableFactor.filter(() => true).sort((a, b) => 优先级.indexOf(a.rp) - 优先级.indexOf(b.rp));
          const [闲1, 闲2] = data.party.partyNames_
            .filter((v) => !消失因子.find((n) => n.target === v))
            .sort((a, b) => 优先级.indexOf(getRpByName(data, a)) - 优先级.indexOf(getRpByName(data, b)));
          const [单1, 单2] = 消失因子.filter((v) => v.count === 1).map((v) => v.target);
          const [黑1, 黑2] = 消失因子
            .filter((v) => {
              v.dark = data.souma.dark.find((d) => d.target === v.target);
              return v.count === 2 && v.dark;
            })
            .sort((a, b) => a.dark.duration - b.dark.duration)
            .map((v) => v.target);
          const [白1, 白2] = 消失因子
            .filter((v) => {
              v.white = data.souma.white.find((d) => d.target === v.target);
              return v.count === 2 && v.white;
            })
            .sort((a, b) => a.white.duration - b.white.duration)
            .map((v) => v.target);
          switch (data.me) {
            case 单1:
              data.souma.pantheismLastText = output.南塔();
              return output.单1();
            case 单2:
              data.souma.pantheismLastText = output.南塔();
              return output.单2();
            case 黑1:
              data.souma.pantheismLastText = output.白塔();
              data.souma.pantheismUndetermined = { color: "白", round: 1 };
              return output.短黑();
            case 白1:
              data.souma.pantheismLastText = output.黑塔();
              data.souma.pantheismUndetermined = { color: "黑", round: 1 };
              return output.短白();
            case 黑2:
              data.souma.pantheismLastText = output.白塔();
              data.souma.pantheismUndetermined = { color: "白", round: 2 };
              return output.长黑();
            case 白2:
              data.souma.pantheismLastText = output.黑塔();
              data.souma.pantheismUndetermined = { color: "黑", round: 2 };
              return output.长白();
            case 闲1:
              data.souma.pantheismLastText = output.北塔();
              data.souma.pantheismIsIdle = true;
              return output.闲1();
            case 闲2:
              data.souma.pantheismIsIdle = true;
              data.souma.pantheismLastText = output.北塔();
              return output.闲2();
            default:
              return;
          }
        },
        outputStrings: {
          南塔: { en: "踩南塔" },
          北塔: { en: "踩北塔" },
          黑塔: { en: "踩黑" },
          白塔: { en: "踩白" },
          单1: { en: "单1：踩左半场1塔" },
          单2: { en: "单2：踩右半场1塔" },
          短黑: { en: "短黑：踩白1塔" },
          短白: { en: "短白：踩黑1塔" },
          长黑: { en: "长黑：白半场等待 => 踩第二轮南塔" },
          长白: { en: "长白：黑半场等待 => 踩第二轮南塔" },
          闲1: { en: "闲1：左半场等待 => 踩第二轮北塔" },
          闲2: { en: "闲2：右半场等待 => 踩第二轮北塔" },
        },
      },
      {
        id: "P12S Souma 泛神论开",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        run: (data) => (data.souma.pantheism = true),
      },
      {
        id: "P12S Souma 泛神论关",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        delaySeconds: 25,
        run: (data) => (data.souma.pantheism = false),
      },
      {
        id: "P12S Souma 泛神论结束",
        type: "StartsUsing",
        netRegex: { id: "8342", capture: true },
        delaySeconds: 20,
        response: (data, _matches, output) => {
          if (data.souma.pantheismIsIdle) return { alertText: output.idle() };
          return { infoText: output.text() };
        },
        outputStrings: {
          idle: { en: "截线" },
          text: { en: "去南边" },
        },
      },
      {
        id: "P12S Souma 不确定的黑白塔",
        type: "StartsUsing",
        netRegex: { id: "8343", capture: true },
        suppressSeconds: 999,
        infoText: (data, matches, output) => {
          if (data.souma.pantheismUndetermined === undefined) return;
          const tower = (parseFloat(matches.x) < 100 ? { 白: "left", 黑: "right" } : { 白: "right", 黑: "left" })[data.souma.pantheismUndetermined.color];
          return output[tower + data.souma.pantheismUndetermined.round]();
        },
        outputStrings: {
          left1: { en: "左1" },
          left2: { en: "左等待 " },
          right1: { en: "右1" },
          right2: { en: "右等待" },
        },
      },
    ],
    // timelineReplace: [
    //   {
    //     locale: "cn",
    //     missingTranslations: true,
    //     replaceText: {
    //       "Apodialogos": "远翼对话", // アポ・ディアロゴス
    //       "Astral Advance": "星极顺行", // アストラルアドバンス
    //       "Astral Advent": "星极降临", // アストラルアドベント
    //       "Astral Glow": "星极之光", // アストラルグロウ
    //       "Astral Impact": "星击", // 星撃
    //       "Caloric Theory": "热质说", // カロリックセオリー
    //       "Crush Helm": "星天爆击打", // 星天爆撃打
    //       "Demi Parhelion": "半幻日", // デミパルヘリオン
    //       "(?<!(Apo|Peri))Dialogos": "对话", // ディアロゴス
    //       "Divine Excoriation": "神罚", // 神罰
    //       "Dynamic Atmosphere": "冲风", // 衝風
    //       "Ekpyrosis": "世界燃烧", // エクピロシス
    //       "Engravement of Souls": "魂之刻印", // 魂の刻印
    //       "Entropic Excess": "焦热波", // 焦熱波
    //       "Factor In": "因子还原", // 因子還元
    //       "Gaiaochos": "大地之主", // ガイアオコス
    //       "Geocentrism": "地心说", // ジオセントリズム
    //       "Glaukopis": "明眸", // グラウコピス
    //       "Ignorabimus": "不可知论", // イグノラビムス
    //       "Implode": "自毁", // 自壊
    //       "Missing Link": "苦痛之链", // 苦痛の鎖
    //       "On the Soul": "论灵魂", // オン・ザ・ソウル
    //       "Palladian Grasp": "帕拉斯之手", // パラスの手
    //       "Palladian Ray": "帕拉斯射线", // パラスレイ
    //       "Palladion": "圣像骑士", // パラディオン
    //       "Pangenesis": "泛生论", // パンゲネシス
    //       "Panta Rhei": "万物流变", // パンタレイ
    //       "Paradeigma": "范式", // パラデイグマ
    //       "Parthenos": "帕尔忒农", // パルテノン
    //       "Peridialogos": "近翼对话", // ペリ・ディアロゴス
    //       "Polarized Ray": "极性射线", // ポラリティレイ
    //       "Pyre Pulse": "重热波", // 重熱波
    //       "Ray of Light": "光波", // 光波
    //       "Sample": "暴食", // 貪食
    //       "Searing Radiance": "光辉", // レイディアンス
    //       "Shadowsear": "灵极幻影", // シャドーシアー
    //       "Shock": "放电", // 放電
    //       "Summon Darkness": "黑暗召唤", // サモンダークネス
    //       "Superchain Burst": "超链爆发", // スーパーチェイン・バースト
    //       "Superchain Coil": "超链之环", // スーパーチェイン・サークル
    //       "Superchain Theory I(?!I)": "超链理论I", // スーパーチェイン・セオリーI
    //       "Superchain Theory IIA": "超链理论IIA", // スーパーチェイン・セオリーIIA
    //       "Superchain Theory IIB": "超链理论IIB", // スーパーチェイン・セオリーIIB
    //       "The Classical Concepts": "理念元素", // イデア・エレメンタル
    //       "Theos's Cross": "神·十字", // テオス・クロス
    //       "Theos's Holy": "神·圣光", // テオス・ホーリー
    //       "Theos's Saltire": "神·斜十字", // テオス・サルタイアー
    //       "Theos's Ultima": "神·究极", // テオス・アルテマ
    //       "Trinity of Souls": "三位一体之魂", // トリニティ・ソウル
    //       "(?<! )Ultima(?! (B|R))": "究极", // アルテマ
    //       "Ultima Blade": "究极之刃", // アルテマブレイド
    //       "Ultima Blow": "究极一击", // アルテマブロウ
    //       "Ultima Ray": "究极射线", // アルテマレイ
    //       "Umbral Advance": "灵极顺行", // アンブラルアドバンス
    //       "Umbral Advent": "灵极降临", // アンブラルアドベント
    //       "Umbral Glow": "灵极之光", // アンブラルグロウ
    //       "Umbral Impact": "灵击", // 霊撃
    //       "Unnatural Enchainment": "灵魂束缚", // 魂の鎖
    //       "White Flame": "白火", // 白火
    //     },
    //   },
    // ],
  });
}
