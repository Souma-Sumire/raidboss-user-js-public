const posHandler = (h, v, offset) => {
  if (offset === 'top') {
    return { h: h - 1, v: v };
  }
  if (offset === 'bottom') {
    return { h: h + 1, v: v };
  }
  if (offset === 'left') {
    return { h: h, v: v - 1 };
  }
  if (offset === 'right') {
    return { h: h, v: v + 1 };
  }
  throw new UnreachableCode();
};
const springWaterSafetyZone = {
  'type1': {
    left: [[1, 1], [4, 1]],
    right: [[1, 3], [4, 3]],
    top: [[1, 1], [1, 3]],
    bottom: [[4, 1], [4, 3]],
  },
  'type2': {
    left: [[1, 2], [4, 2]],
    right: [[1, 4], [4, 4]],
    top: [[1, 2], [1, 4]],
    bottom: [[4, 2], [4, 4]],
  },
  'type3': {
    left: [[1, 1], [3, 1]],
    right: [[1, 4], [3, 4]],
    top: [[1, 1], [1, 4]],
    bottom: [[3, 1], [3, 4]],
  },
  'type4': {
    left: [[2, 1], [4, 1]],
    right: [[2, 4], [4, 4]],
    top: [[2, 1], [2, 4]],
    bottom: [[4, 1], [4, 4]],
  },
};
const springWaterSafetyZoneMap = {
  'LT-horizontal': springWaterSafetyZone.type1,
  'LB-horizontal': springWaterSafetyZone.type1,
  'RT-horizontal': springWaterSafetyZone.type2,
  'RB-horizontal': springWaterSafetyZone.type2,
  'LT-vertical': springWaterSafetyZone.type3,
  'RT-vertical': springWaterSafetyZone.type3,
  'LB-vertical': springWaterSafetyZone.type4,
  'RB-vertical': springWaterSafetyZone.type4,
};
const mmwNsBubbleSafetyZone = {
  'RT-vertical': { MT: [1, 2], D2: [1, 2], H1: [3, 1], D1: [3, 3] },
  'RB-horizontal': { MT: [2, 2], D2: [2, 2], H1: [3, 3], D1: [3, 4] },
  'LB-vertical': { MT: [2, 2], D2: [2, 2], H1: [4, 1], D1: [4, 3] },
  'LT-horizontal': { MT: [2, 1], D2: [2, 1], H1: [3, 1], D1: [3, 3] },
  'RT-horizontal': { MT: [2, 2], D2: [2, 2], H1: [3, 4], D1: [3, 2] },
  'RB-vertical': { MT: [2, 3], D2: [2, 3], H1: [4, 4], D1: [4, 2] },
  'LB-horizontal': { MT: [2, 3], D2: [2, 3], H1: [3, 3], D1: [3, 1] },
  'LT-vertical': { MT: [1, 3], D2: [1, 3], H1: [3, 4], D1: [3, 2] },
};
const mmwGroupPosMap = {
  'LT-vertical': { A: [2, 1], B: [2, 4] },
  'RT-vertical': { A: [2, 1], B: [2, 4] },
  'LB-vertical': { A: [3, 1], B: [3, 4] },
  'RB-vertical': { A: [3, 1], B: [3, 4] },
  'LT-horizontal': { A: [1, 2], B: [4, 2] },
  'LB-horizontal': { A: [1, 2], B: [4, 2] },
  'RT-horizontal': { A: [1, 3], B: [4, 3] },
  'RB-horizontal': { A: [1, 3], B: [4, 3] },
};
const getClock = (x, y, wind) => {
  const quad = getXyPos(x, y);
  const result = clockwise[`${quad}-${wind}`];
  if (result === undefined) {
    throw new UnreachableCode();
  }
  return result;
};
const isUptime = (h, v) => {
  return !((h === 1 || h === 4) && (v === 1 || v === 4));
};
const getStart = (target, clock, type, _job) => {
  const fnA = clockFn[clock](target);
  const mid = fnA(...target);
  const midPos = getHvPos(...mid);
  const midIndex = ['LT', 'RT', 'RB', 'LB'].indexOf(midPos);
  const midMj = type.charAt(midIndex);
  if (
    midMj === '2' &&
    isUptime(...mid)
  ) {
    return mid;
  }
  const fnB = clockFn[clock](mid);
  const start = fnB(...mid);
  return start;
};
const getMjLr = (mjType, half) => {
  let mjlr;
  if (half === 'top') {
    mjlr = [mjType[0], mjType[1]];
  } else if (half === 'bottom') {
    mjlr = [mjType[3], mjType[2]];
  } else if (half === 'left') {
    mjlr = [mjType[0], mjType[3]];
  } else if (half === 'right') {
    mjlr = [mjType[1], mjType[2]];
  } else {
    throw new UnreachableCode();
  }
  return mjlr;
};
const getMjSafe = (mjType, safe, half, mj) => {
  const mjlr = getMjLr(mjType, half);
  const mjIndex = mjlr.indexOf(mj);
  const go = safe[mjIndex];
  if (mjIndex === -1 || go === undefined) {
    throw new UnreachableCode();
  }
  const [h, v] = go;
  return { h, v };
};
const clockFn = {
  'clockwise': (start) => {
    const [h, v] = start;
    if (h <= 2 && v <= 2) {
      // 左上
      return (h, v) => [h + 2, v];
    }
    if (h <= 2 && v >= 3) {
      // 右上
      return (h, v) => [h, v - 2];
    }
    if (h >= 3 && v >= 3) {
      // 右下
      return (h, v) => [h - 2, v];
    }
    if (h >= 3 && v <= 2) {
      // 左下
      return (h, v) => [h, v + 2];
    }
    throw new UnreachableCode();
  },
  'counterclockwise': (start) => {
    const [x, y] = start;
    if (x <= 2 && y <= 2) {
      // 左上
      return (h, v) => [h, v + 2];
    }
    if (x <= 2 && y >= 3) {
      // 右上
      return (h, v) => [h + 2, v];
    }
    if (x >= 3 && y >= 3) {
      // 右下
      return (h, v) => [h, v - 2];
    }
    if (x >= 3 && y <= 2) {
      // 左下
      return (h, v) => [h - 2, v];
    }
    throw new UnreachableCode();
  },
};
const clockwise = {
  'LT-we': 'clockwise',
  'LT-ns': 'counterclockwise',
  'RT-we': 'counterclockwise',
  'RT-ns': 'clockwise',
  'LB-we': 'counterclockwise',
  'LB-ns': 'clockwise',
  'RB-we': 'clockwise',
  'RB-ns': 'counterclockwise',
};
const getXyPos = (x, y) => {
  if (x <= 0 && y <= 0) {
    return 'LT';
  }
  if (x <= 0 && y >= 0) {
    return 'LB';
  }
  if (x >= 0 && y <= 0) {
    return 'RT';
  }
  return 'RB';
};
const getHvPos = (h, v) => {
  if (h <= 2 && v <= 2) {
    return 'LT';
  }
  if (h <= 2 && v >= 3) {
    return 'RT';
  }
  if (h >= 3 && v <= 2) {
    return 'LB';
  }
  return 'RB';
};
const calculateAngles = (x1, y1, x2, y2, x3, y3) => {
  // 计算长度
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  const AB = distance(x1, y1, x2, y2);
  const BC = distance(x2, y2, x3, y3);
  const CA = distance(x3, y3, x1, y1);
  // 计算角度
  const angle = (a, b, c) => {
    return Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
  };
  const angleA = angle(BC, CA, AB);
  const angleB = angle(CA, AB, BC);
  const angleC = angle(AB, BC, CA);
  return {
    angleA: angleA,
    angleB: angleB,
    angleC: angleC,
  };
};
// 判断是否是钝角三角形
const isObtuseTriangle = (angleA, angleB, angleC) => {
  return angleA > 90 || angleB > 90 || angleC > 90;
};
const NumberMarkPositions = {
  'One': { 'x': -186.883 + 200, 'y': -13.117 },
  'Two': { 'x': -186.883 + 200, 'y': 13.117 },
  'Three': { 'x': -213.117 + 200, 'y': 13.117 },
  'Four': { 'x': -213.117 + 200, 'y': -13.117 },
};
const getNearestNumberMark = (bombCoordinates) => {
  let nearestNumberMark = undefined;
  let nearestDistance = Infinity;
  for (const bomb of bombCoordinates) {
    for (const [numberMark, position] of Object.entries(NumberMarkPositions)) {
      const distance = Math.sqrt(
        Math.pow(bomb.x - position.x, 2) + Math.pow(bomb.y - position.y, 2),
      );
      if (distance < nearestDistance) {
        nearestNumberMark = numberMark;
        nearestDistance = distance;
      }
    }
  }
  if (nearestNumberMark === undefined) {
    throw new UnreachableCode();
  }
  return nearestNumberMark;
};
// Horizontal crystals have a heading of 0, vertical crystals are -pi/2.
const isHorizontalCrystal = (line) => {
  const epsilon = 0.1;
  return Math.abs(parseFloat(line.heading)) < epsilon;
};
const headmarkerIds = {
  tethers: '0061',
  enumeration: '015B',
};
// TODO: this maybe should be a method on party?
const isStandardLightParty = (data) => {
  const supports = [...data.party.healerNames, ...data.party.tankNames];
  const dps = data.party.dpsNames;
  return supports.length === 2 && dps.length === 2;
};
Options.Triggers.push({
  id: 'SoumaAnotherAloaloIsland',
  zoneId: ZoneId.AnotherAloaloIsland,
  config: [
    {
      id: 'ketuHydroGuide',
      name: {
        en: '第一次涌水水晶打法',
      },
      type: 'select',
      options: {
        en: {
          '融合法（未实测）': '融合法',
          '南北法（未实测）': '南北法',
          '排队法（未实测）': '排队法',
          '肉桂法（未实测）': '肉桂法',
        },
      },
      default: '融合法',
    },
  ],
  initData: () => {
    return {
      _combatantData: [],
      _ketuSpringCrystalCount: 0,
      _ketuCrystalAdd: [],
      _ketuHydroBuffCount: 0,
      _ketuBuffCollect: [],
      _ketuStackTargets: [],
      _lalaSubAlpha: [],
      _staticeBullet: [],
      _staticeTrapshooting: [],
      _staticeDart: [],
      _staticePresentBoxCount: 0,
      _staticeMissileCollect: [],
      _staticeMissileIdToDir: {},
      _staticeMissileTether: [],
      _staticeClawTether: [],
      _staticeDartboardTether: [],
      soumaAdd: [],
      soumaAddStatus: [],
      soumaAdd2: [],
      soumaAdd2Crystals: [],
      soumaAdd3: [],
      soumaAdd4Boom: [],
      soumaBooms: [],
      soumaBoomCount: 0,
      soumaBoomCoordinate: [],
      soumaInDartboard: false,
    };
  },
  timelineTriggers: [
    {
      id: 'AAI Lala Radiance',
      regex: /^Radiance \d/,
      beforeSeconds: 4,
      alertText: (data, _matches, output) => {
        // TODO: could figure out directions here and say "Point left at NW Orb"
        const dir = data._lalaUnseen;
        if (dir === undefined)
          return output.orbGeneral();
        return {
          front: output.orbDirFront(),
          back: output.orbDirBack(),
          left: output.orbDirLeft(),
          right: output.orbDirRight(),
        }[dir];
      },
      outputStrings: {
        orbDirFront: {
          en: 'Face Towards Orb',
          de: 'Den Orb anschauen',
          fr: 'Pointez l\'orbe',
          cn: '面向球',
          ko: '구슬쪽 보기',
        },
        orbDirBack: {
          en: 'Face Away from Orb',
          de: 'Weg vom Orb schauen',
          fr: 'Ne pointez pas l\'orbe',
          cn: '背对球',
          ko: '뒷면을 구슬쪽으로',
        },
        orbDirLeft: {
          en: 'Point Left at Orb',
          de: 'Zeige links auf den Orb',
          fr: 'Pointez à gauche de l\'orbe',
          cn: '左侧看向球',
          ko: '왼쪽면을 구슬쪽으로',
        },
        orbDirRight: {
          en: 'Point Right at Orb',
          de: 'Zeige Rechts auf den Orb',
          fr: 'Pointez à droite de l\'orbe',
          cn: '右侧看向球',
          ko: '오른쪽면을 구슬쪽으로',
        },
        orbGeneral: {
          en: 'Point opening at Orb',
          de: 'Zeige die Öffnung auf den Orb',
          fr: 'Pointez l\'orbe',
          cn: '开口侧看向球',
          ko: '열린면을 수슬쪽으로',
        },
      },
    },
  ],
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AAI Kiwakin Lead Hook',
      type: 'StartsUsing',
      netRegex: { id: '8C6E', source: 'Aloalo Kiwakin' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankBusterOnYou: {
            en: '3x Tankbuster on YOU',
            de: '3x Tankbuster auf DIR',
            fr: 'Tankbuster x3 sur VOUS',
            cn: '3x 坦克死刑点名',
            ko: '3x 탱버 대상자',
          },
          tankBusterOnPlayer: {
            en: '3x Tankbuster on ${player}',
            de: '3x Tankbuster auf ${player}',
            fr: 'Tankbuster x3 sur ${player}',
            cn: '3x 坦克死刑点 ${player}',
            ko: '3x 탱버 ${player}',
          },
        };
        if (matches.target === data.me)
          return { alertText: output.tankBusterOnYou() };
        const target = data.party.member(matches.target);
        return { infoText: output.tankBusterOnPlayer({ player: target }) };
      },
    },
    {
      id: 'AAI Kiwakin Sharp Strike',
      type: 'StartsUsing',
      netRegex: { id: '8C63', source: 'Aloalo Kiwakin' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Kiwakin Tail Screw',
      type: 'StartsUsing',
      // This is a baited targeted circle.
      netRegex: { id: '8BB8', source: 'Aloalo Kiwakin', capture: false },
      response: Responses.moveAway(),
    },
    {
      id: 'AAI Snipper Water III',
      type: 'StartsUsing',
      netRegex: { id: '8C64', source: 'Aloalo Snipper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Snipper Bubble Shower',
      type: 'StartsUsing',
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'AAI Snipper Crab Dribble',
      type: 'Ability',
      // Crab Dribble 8BBA has a fast cast, so trigger on Bubble Shower ability
      netRegex: { id: '8BB9', source: 'Aloalo Snipper', capture: false },
      suppressSeconds: 5,
      response: Responses.goFront('info'),
    },
    {
      id: 'AAI Ray Hydrocannon',
      type: 'StartsUsing',
      netRegex: { id: '8BBD', source: 'Aloalo Ray', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AAI Ray Expulsion',
      type: 'StartsUsing',
      netRegex: { id: '8BBF', source: 'Aloalo Ray', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AAI Ray Electric Whorl',
      type: 'StartsUsing',
      netRegex: { id: '8BBE', source: 'Aloalo Ray', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AAI Monk Hydroshot',
      type: 'StartsUsing',
      netRegex: { id: '8C65', source: 'Aloalo Monk' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'AAI Monk Cross Attack',
      type: 'StartsUsing',
      netRegex: { id: '8BBB', source: 'Aloalo Monk' },
      response: Responses.tankBuster(),
    },
    // ---------------- Ketuduke ----------------
    {
      id: 'AAI Ketuduke Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '8AD4', source: 'Ketuduke', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Ketuduke Spring Crystals',
      type: 'StartsUsing',
      netRegex: { id: '8AA8', source: 'Ketuduke', capture: false },
      run: (data) => {
        data._ketuSpringCrystalCount++;
        // Note: cannot clear `data.ketuCrystalAdd` here as there has been at least one case
        // where AddCombatant (coming from memory, so racy) is partially before this cast.
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals Saturate Cleanup',
      type: 'StartsUsing',
      netRegex: { id: ['8AAB', '8AAC'], capture: false },
      run: (data) => data._ketuCrystalAdd = [],
    },
    {
      id: 'AAI Ketuduke Spring Crystal Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607' },
      run: (data, matches) => data._ketuCrystalAdd.push(matches),
    },
    {
      id: 'AAI Ketuduke Bubble Net',
      type: 'StartsUsing',
      netRegex: { id: ['8AC5', '8AAD'], source: 'Ketuduke', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Souma Ketuduke Add1',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12539', capture: true },
      preRun: (data, matches) => {
        data.soumaAdd.push(matches);
      },
    },
    {
      id: 'AAI Souma Ketuduke Add1 Cleaner',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12539', capture: false },
      delaySeconds: 22,
      suppressSeconds: 1,
      run: (data) => {
        data.soumaAdd = [];
        data.soumaAddStatus = [];
      },
    },
    {
      id: 'AAI Souma Ketuduke Add2',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12606', capture: true },
      preRun: (data, matches) => {
        data.soumaAdd2.push(matches);
      },
    },
    {
      id: 'AAI Souma Ketuduke Add2 Text',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12606', capture: true },
      delaySeconds: 0.5,
      durationSeconds: (data) => data.role === 'dps' ? 10 : 12,
      suppressSeconds: 1,
      promise: async (data) => {
        data._combatantData = [];
        data._combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      infoText: (data, _matches, output) => {
        if (data.soumaAdd2.length === 4) {
          if (data.role !== 'dps') {
            return output.notDps();
          }
          const half = data.soumaAdd2.find((x) => parseFloat(x.x) < -5) ? 'left' : 'right';
          const balls = data.soumaAdd2.sort((a, b) =>
            Math.abs(parseInt(a.x)) - Math.abs(parseInt(b.x))
          ).filter((v) => Math.abs(parseInt(v.y)) > 12)
            .sort((a, b) => parseFloat(a.y) - parseFloat(b.y)).map((v) => ({
              id: v.id,
              x: v.x,
              y: v.y,
            }));
          if (balls.length !== 2) {
            throw new UnreachableCode();
          }
          data.soumaAdd2Crystals = balls;
          const myData = data._combatantData[0];
          if (myData === undefined) {
            throw new UnreachableCode();
          }
          const myHalf = myData.PosX < 0 ? 'left' : 'right';
          if (half === myHalf) {
            data.soumaAdd2DpsType = 'inside';
            return output.dpsInCrystalSide();
          }
          data.soumaAdd2DpsType = 'outside';
          return output.dpsNotInCrystalSide();
        }
      },
      outputStrings: {
        notDps: { en: '准备踩中间的塔（先不要进去）' },
        dpsInCrystalSide: { en: '找没水晶的气泡' },
        dpsNotInCrystalSide: { en: '观察对面DPS 准备补塔' },
      },
    },
    {
      id: 'AAI Souma Ketuduke Add2 Text2',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12606', capture: false },
      delaySeconds: 24,
      suppressSeconds: 10,
      alertText: (_data, _matches, output) => {
        return output.getTowers();
      },
      outputStrings: {
        getTowers: Outputs.getTowers,
      },
    },
    {
      id: 'AAI Souma Ketuduke Add2 Status',
      type: 'GainsEffect',
      netRegex: { effectId: 'EA1', capture: true },
      condition: (data, matches) =>
        !!(data.role === 'dps' && data.soumaAdd2DpsType !== undefined &&
          data.soumaAdd2Crystals.find((x) => x.id === matches.targetId)),
      promise: async (data) => {
        data._combatantData = [];
        data._combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me],
        })).combatants;
      },
      infoText: (data, matches, output) => {
        const crystal = data.soumaAdd2Crystals.find((x) => x.id === matches.targetId);
        if (crystal === undefined) {
          throw new UnreachableCode();
        }
        const needToGo = data.soumaAdd2Crystals.filter((x) => x.id !== matches.targetId)[0];
        if (needToGo === undefined) {
          throw new UnreachableCode();
        }
        const myData = data._combatantData[0];
        if (myData === undefined) {
          throw new UnreachableCode();
        }
        const myHalf = myData.PosX < 0 ? 'left' : 'right';
        const needToGoHalf = parseFloat(needToGo.x) < 0 ? 'left' : 'right';
        const dir = (() => {
          const x = parseFloat(needToGo.x);
          const y = parseFloat(needToGo.y);
          if (x < 0 && y < 0)
            return ['northWest', 'southEast'];
          if (x > 0 && y < 0)
            return ['northEast', 'southWest'];
          if (x < 0 && y > 0)
            return ['southWest', 'northEast'];
          if (x > 0 && y > 0)
            return ['southEast', 'northWest'];
          throw new UnreachableCode();
        })();
        if (myHalf === needToGoHalf) {
          const pos = output[dir[0]]();
          return output.bubbles({ pos });
        }
        const pos = output[dir[1]]();
        return output.cover({ pos });
      },
      outputStrings: {
        bubbles: { en: '去${pos}水泡里' },
        cover: { en: '准备踩${pos}的塔（先不要进去）' },
        northWest: { en: '左上' },
        northEast: { en: '右上' },
        southWest: { en: '左下' },
        southEast: { en: '右下' },
      },
    },
    {
      id: 'AAI Souma Ketuduke Add2 Cleaner',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12606', capture: false },
      delaySeconds: 22,
      suppressSeconds: 1,
      run: (data) => {
        data.soumaAdd2 = [];
      },
    },
    {
      id: 'AAI Souma Ketuduke Add1 Status',
      type: 'GainsEffect',
      netRegex: { effectId: '808', capture: true },
      condition: (data, matches) => {
        return !!(data.soumaAdd.length === 4 &&
          data.soumaAdd.find((x) => x.id === matches.targetId));
      },
      preRun: (data, matches) => {
        data.soumaAddStatus.push(matches);
      },
      run: (data) => {
        if (data.soumaAddStatus.length === 2) {
          const bubblesIds = data.soumaAddStatus.map((x) => x.targetId);
          // N = 0, E = 1, S = 2, W = 3
          const combatantData = data.soumaAdd.map((x) => {
            const pos = Directions.xyTo4DirNum(parseFloat(x.x), parseFloat(x.y), 0, 0);
            return {
              pos: pos,
              posStr: ['north', 'east', 'south', 'west'][pos],
              id: x.id,
              isBubble: bubblesIds.includes(x.id),
            };
          }).sort((a, b) => a.pos - b.pos);
          const buff = data._ketuBuff;
          const partner = data._ketuBuffPartner;
          if (partner === undefined) {
            throw new UnreachableCode();
          }
          const myRp = Util.souma.getRpByName(data, data.me);
          const partnerRp = Util.souma.getRpByName(data, partner);
          const sortArr = ['MT', 'H1', 'D1', 'D2'];
          const myPriority = sortArr.indexOf(myRp) < sortArr.indexOf(partnerRp)
            ? 'first'
            : 'second';
          let i = 0;
          for (const item of combatantData) {
            if (buff === 'bubble' && !item.isBubble) {
              i++;
            } else if (buff === 'fetters' && item.isBubble) {
              i++;
            }
            if ((myPriority === 'first' && i === 1) || (myPriority === 'second' && i === 2)) {
              if (item.posStr === undefined) {
                throw new UnreachableCode();
              }
              data.soumaAddSafe = item.posStr;
              return;
            }
          }
          throw new UnreachableCode();
        }
      },
    },
    {
      id: 'AAI Ketuduke Foamy Fetters Bubble Weave',
      type: 'GainsEffect',
      // ECC = Foamy Fetters
      // E9F = Bubble Weave
      netRegex: { effectId: ['ECC', 'E9F'] },
      delaySeconds: (data, matches) => {
        data._ketuBuffCollect.push(matches);
        // return data.ketuBuffCollect.length === 4 ? 0 : 0.5;
        return 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data._ketuBuffCollect.length === 0)
          return;
        const myBuff = data._ketuBuffCollect.find((x) => x.target === data.me)?.effectId;
        if (myBuff === undefined)
          return;
        data._ketuBuff = myBuff === 'ECC' ? 'fetters' : 'bubble';
        data._ketuBuffPartner = data._ketuBuffCollect.find((x) => {
          return x.target !== data.me && x.effectId === myBuff;
        })?.target;
        // To avoid too many calls, we'll call this out later for the Fluke Gale
        // versions of this.
        if (data._ketuSpringCrystalCount === 1 || data._ketuSpringCrystalCount === 4)
          return;
        if (data.soumaSpringCrystals2 === undefined) {
          throw new UnreachableCode();
        }
        if (data.soumaAddSafe === undefined || data.soumaSpringCrystals2 === undefined) {
          throw new UnreachableCode();
        }
        const buff = output[data._ketuBuff]();
        return output[`${data.soumaAddSafe}And${data.soumaSpringCrystals2}`]({ buff });
      },
      tts: null,
      run: (data) => data._ketuBuffCollect = [],
      outputStrings: {
        fetters: { en: '止步' },
        bubble: { en: '泡泡' },
        northAndNorthSouth: '南北安全+${buff}：去1点标点偏左上 => 引导A点小怪',
        northAndEastWest: '东西安全+${buff}：去1点标点偏右下 => 引导A点小怪',
        northAndCorners: '四角安全+${buff}：去1点标点偏右上 => 引导A点小怪',
        eastAndNorthSouth: '南北安全+${buff}：去2点标点偏左下 => 引导B点小怪',
        eastAndEastWest: '东西安全+${buff}：去2点标点偏右上 => 引导B点小怪',
        eastAndECorners: '四角安全+${buff}：去2点标点偏右下 => 引导B点小怪',
        southAndNorthSouth: '南北安全+${buff}：去3点标点偏右下 => 引导C点小怪',
        southAndEastWest: '东西安全+${buff}：去3点标点偏左上 => 引导C点小怪',
        southAndCorners: '四角安全+${buff}：去3点标点偏左下 => 引导C点小怪',
        westAndNorthSouth: '南北安全+${buff}：去4点标点偏右上 => 引导D点小怪',
        westAndEastWest: '东西安全+${buff}：去4点标点偏左下 => 引导D点小怪',
        westAndECorners: '四角安全+${buff}：去4点标点偏左上 => 引导D点小怪',
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Counter',
      type: 'StartsUsing',
      // 8AB8 = Hydrobullet (spread)
      // 8AB4 = Hydrofall (stack)
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke', capture: false },
      run: (data) => {
        data._ketuHydroBuffCount++;
        delete data._ketuHydroBuffIsSpreadFirst;
        delete data._ketuHydroBuffIsRoleStacks;
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff 1',
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) => data._ketuHydroBuffCount === 1 || data._ketuHydroBuffCount === 6,
      durationSeconds: 18,
      infoText: (data, matches, output) => {
        if (data._ketuBuff === undefined)
          return;
        const isSpread = matches.id === '8AB8';
        const center = data._ketuCrystalAdd.filter((v) =>
          Number(v.x) <= 10 && Number(v.x) >= -10 && Number(v.y) <= 10 && Number(v.y) >= -10
        )[0];
        if (center === undefined) {
          console.error('Missing center');
          return;
        }
        const centerPos = getXyPos(parseFloat(center.x), parseFloat(center.y));
        const isBubble = data._ketuBuff === 'bubble';
        const centerFacing = isHorizontalCrystal(center) ? 'horizontal' : 'vertical';
        const safetyZone = springWaterSafetyZoneMap[`${centerPos}-${centerFacing}`];
        data.soumaSpringWater = {
          centerPos,
          centerFacing,
          safetyZone,
          isSpread,
          isBubble,
        };
        if (data._ketuBuff === 'bubble') {
          const myRp = Util.souma.getRpByName(data, data.me);
          const [h, v] = mmwNsBubbleSafetyZone[`${centerPos}-${centerFacing}`][myRp];
          const pos = output.pos({ h, v });
          const indicate = output.bubbleAnything();
          return output.text({
            indicate: indicate,
            mj: !isSpread ? output.binderMj1() : output.binderMj2(),
            pos: pos,
          });
        }
        if (
          data.triggerSetConfig.ketuHydroGuide === '融合法' ||
          data.triggerSetConfig.ketuHydroGuide === '排队法'
        ) {
          const myRp = Util.souma.getRpByName(data, data.me);
          const group = ['MT', 'D2'].includes(myRp) ? 'A' : 'B';
          const [h, v] = mmwGroupPosMap[`${centerPos}-${centerFacing}`][group];
          const pos = output.pos({
            h,
            v,
          });
          return output.text({
            indicate: centerFacing === 'horizontal'
              ? output[`binderHorizontal${group}`]()
              : output[`binderVertical${group}`](),
            mj: !isSpread ? output.binderMj1() : output.binderMj2(),
            pos: pos,
          });
        }
      },
      outputStrings: {
        text: {
          en: '${indicate} （${pos}） => ${mj}',
        },
        bubbleBuff: {
          en: '泡泡',
        },
        fettersBuff: {
          en: '止步',
        },
        spread: {
          en: '散开',
        },
        stacks: {
          en: '分摊',
        },
        pos: { en: '第${h}行第${v}列' },
        bubbleAnything: {
          en: '竖对角或横旁边',
        },
        binderHorizontalA: { en: '上场边预站位' },
        binderHorizontalB: { en: '下场边预站位' },
        binderVerticalA: { en: '左场边' },
        binderVerticalB: { en: '右场边' },
        binderMj1: {
          en: '找1麻',
        },
        binderMj2: {
          en: '找2麻',
        },
      },
    },
    // 1 8AB3 2麻逆时针
    // 1 8AB3 2麻逆时针
    // 1 8AB2 1麻逆时针
    // 1 8AB2 1麻逆时针
    // 2 8AB3 2麻顺时针
    // 2 8AB3 2麻顺时针
    // 2 8AB2 1麻顺时针
    // 2 8AB2 1麻顺时针
    {
      id: 'AAI Souma Ketuduke Majiang',
      type: 'StartsUsingExtra',
      netRegex: { id: '8AB3' },
      suppressSeconds: 10,
      promise: async (data, matches) => {
        data._combatantData = [];
        data._combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;
      },
      infoText: (data, matches, output) => {
        if (data.soumaSpringWater === undefined) {
          console.error('Missing soumaSpringWater');
          return;
        }
        const myRp = Util.souma.getRpByName(data, data.me);
        const posX = parseFloat(matches.x);
        const posY = parseFloat(matches.y);
        const mjType = ((posX > 0 && posY > 0) || (posX < 0 && posY < 0)) ? '2121' : '1212';
        const { isBubble, isSpread, safetyZone, centerPos, centerFacing } = data.soumaSpringWater;
        const group = ['MT', 'D2'].includes(myRp) ? 'A' : 'B';
        const [startH, startV] = mmwGroupPosMap[`${centerPos}-${centerFacing}`][group];
        switch (data.triggerSetConfig.ketuHydroGuide) {
          case '肉桂法':
          {
            const half = ['MT', 'D1'].includes(myRp) ? 'left' : 'right';
            const mjSort = (() => {
              if (half === 'left') {
                return mjType === '2121' ? 'reverse' : 'normal';
              }
              return mjType === '2121' ? 'normal' : 'reverse';
            })();
            const halfMjSafe = (() => {
              if (mjSort === 'reverse') {
                return [safetyZone[half][1], safetyZone[half][0]];
              }
              return safetyZone[half];
            })();
            const heading = data._combatantData[0]?.Heading;
            if (heading === undefined) {
              throw new UnreachableCode();
            }
            const facing = Math.abs(heading / Math.PI);
            const wind = (facing < 0.1 || facing > 0.9) ? 'ns' : 'we';
            if (isBubble) {
              // 泡泡玩家
              const clock = getClock(posX, posY, wind);
              const target = halfMjSafe[0];
              const start = getStart(target, clock, mjType, data.job);
              const targetPos = output.pos({
                h: target[0],
                v: target[1],
              });
              const startPos = output.pos({
                h: start[0],
                v: start[1],
              });
              const result = output.bubble({
                start: startPos,
                target: targetPos,
              });
              console.warn('肉桂法', myRp, result);
              return result;
            }
            // 止步玩家
            const pos = output.pos({
              h: halfMjSafe[isSpread ? 1 : 0][0],
              v: halfMjSafe[isSpread ? 1 : 0][1],
            });
            const result = output.bind({ pos });
            console.warn('肉桂法', myRp, result);
            return result;
          }
          case '南北法':
          {
            const half = ['MT', 'D2'].includes(myRp) ? 'top' : 'bottom';
            let result;
            if (isBubble) {
              const [h, v] = mmwNsBubbleSafetyZone[`${centerPos}-${centerFacing}`][myRp];
              result = output.bubbleAnything({
                pos: output.pos({ h, v }),
              });
            } else {
              // 止步玩家
              const safe = safetyZone[half];
              if (isSpread) {
                // 散开
                {
                  const { h, v } = getMjSafe(mjType, safe, half, '2');
                  result = output.mmwNsBinder({
                    mj: '2',
                    pos: output.pos({ h, v }),
                  });
                }
              } else {
                // 分摊
                {
                  const { h, v } = getMjSafe(mjType, safe, half, '1');
                  result = output.mmwNsBinder({
                    mj: '1',
                    pos: output.pos({ h, v }),
                  });
                }
              }
            }
            // console.log('南北法', myRp, result);
            return result;
          }
          case '排队法':
          {
            let result;
            const halfArr = centerFacing === 'vertical'
              ? ['left', 'right']
              : ['top', 'bottom'];
            const halfArrIndex = ['MT', 'D2'].includes(myRp) ? 0 : 1;
            const half = halfArr[halfArrIndex];
            const mjLr = getMjLr(mjType, half);
            if (isBubble) {
              const target = '1';
              const targetIndex = mjLr.indexOf(target);
              const dirKey = {
                horizontal: ['left', 'right'],
                vertical: ['top', 'bottom'],
              }[centerFacing][targetIndex];
              if (dirKey === undefined) {
                throw new UnreachableCode();
              }
              const dir = output[dirKey]();
              const { h, v } = posHandler(startH, startV, dirKey);
              const pos = output.pos({ h, v });
              result = output.mmwFuseStack({ dir, pos });
            } else {
              const target = isSpread ? '2' : '1';
              const targetIndex = mjLr.indexOf(target);
              const dirKey = {
                horizontal: ['left', 'right'],
                vertical: ['top', 'bottom'],
              }[centerFacing][targetIndex];
              if (dirKey === undefined) {
                throw new UnreachableCode();
              }
              const dir = output[dirKey]();
              const { h, v } = posHandler(startH, startV, dirKey);
              const pos = output.pos({ h, v });
              result = !isSpread
                ? output.mmwFuseStack({ dir, pos })
                : output.mmwFuseSpread({ dir, pos });
            }
            // console.log('排队法', myRp, result);
            return result;
          }
          case '融合法':
          {
            let result;
            if (isBubble) {
              const [h, v] = mmwNsBubbleSafetyZone[`${centerPos}-${centerFacing}`][myRp];
              result = output.bubbleAnything({
                pos: output.pos({ h, v }),
              });
            } else {
              const halfArr = centerFacing === 'vertical'
                ? ['left', 'right']
                : ['top', 'bottom'];
              const halfArrIndex = ['MT', 'D2'].includes(myRp) ? 0 : 1;
              const half = halfArr[halfArrIndex];
              const mjLr = getMjLr(mjType, half);
              const target = isSpread ? '2' : '1';
              const targetIndex = mjLr.indexOf(target);
              const dirKey = {
                horizontal: ['left', 'right'],
                vertical: ['top', 'bottom'],
              }[centerFacing][targetIndex];
              if (dirKey === undefined) {
                throw new UnreachableCode();
              }
              const dir = output[dirKey]();
              const { h, v } = posHandler(startH, startV, dirKey);
              const pos = output.pos({ h, v });
              result = !isSpread
                ? output.mmwFuseStack({ dir, pos })
                : output.mmwFuseSpread({ dir, pos });
            }
            // console.log('融合法', myRp, result);
            return result;
          }
          default:
            throw new UnreachableCode();
        }
      },
      outputStrings: {
        bind: { en: '直接去${pos}' },
        bubble: { en: '从 ${start} 被吹到 ${target}' },
        pos: { en: '第${h}行第${v}列' },
        bubbleAnything: {
          en: '竖对角或横旁边（${pos} ）',
        },
        mmwNsBinder: {
          en: '${mj}麻1/4半场的安全区 （${pos}）',
        },
        mmwFuseSpread: {
          en: '向${dir}走一格（到${pos}）',
        },
        mmwFuseStack: {
          en: '向${dir}走一格（到${pos}）',
        },
        left: Outputs.west,
        right: Outputs.east,
        top: Outputs.north,
        bottom: Outputs.south,
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double',
      type: 'StartsUsing',
      netRegex: { id: ['8AB8', '8AB4'], source: 'Ketuduke' },
      condition: (data) =>
        data._ketuHydroBuffCount === 2 || data._ketuHydroBuffCount === 5,
      alertText: (data, matches, output) => {
        data._ketuHydroBuffIsSpreadFirst = matches.id === '8AB8';
        return data._ketuHydroBuffIsSpreadFirst ? output.spread() : output.stacks();
      },
      outputStrings: {
        spread: {
          en: 'Spread => Stacks',
          de: 'Verteilen => Sammeln',
          fr: 'Écarté => Package',
          cn: '分散 => 分摊',
          ko: '산개 => 쉐어',
        },
        stacks: {
          en: 'Stacks => Spread',
          de: 'Sammeln => Verteilen',
          fr: 'Package => Écarté',
          cn: '分摊 => 分散',
          ko: '쉐어 => 산개',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydro Buff Double Followup',
      type: 'Ability',
      netRegex: { id: ['8ABA', '8AB7'], source: 'Ketuduke' },
      suppressSeconds: 10,
      infoText: (data, matches, output) => {
        const wasSpread = matches.id === '8ABA';
        if (wasSpread && data._ketuHydroBuffIsSpreadFirst === true) {
          if (data._ketuHydroBuffIsRoleStacks)
            return output.roleStacks();
          return output.stacks();
        } else if (!wasSpread && data._ketuHydroBuffIsSpreadFirst === false) {
          return output.spread();
        }
      },
      outputStrings: {
        spread: Outputs.spread,
        stacks: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Package',
          cn: '分摊',
          ko: '쉐어',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Hydrofall Role Stack Warning',
      type: 'GainsEffect',
      netRegex: { effectId: 'EA3' },
      delaySeconds: (data, matches) => {
        data._ketuStackTargets.push(matches.target);
        return data._ketuStackTargets.length === 2 ? 0 : 0.5;
      },
      alarmText: (data, _matches, output) => {
        const [stack1, stack2] = data._ketuStackTargets;
        if (data._ketuStackTargets.length !== 2 || stack1 === undefined || stack2 === undefined)
          return;
        // Sorry, non-standard light party comps.
        if (!isStandardLightParty(data))
          return;
        const isStack1DPS = data.party.isDPS(stack1);
        const isStack2DPS = data.party.isDPS(stack2);
        // If both stacks are on dps or neither stack is on a dps, then you have
        // standard "partner" stacks of one support and one dps. If one is on a dps
        // and one is on a support (which can happen if somebody dies), then
        // you (probably) need to have role stacks.
        if (isStack1DPS === isStack2DPS)
          return;
        data._ketuHydroBuffIsRoleStacks = true;
        // Handle Blowing Bubbles/Angry Seas spread+stack combo.
        if (data._ketuHydroBuffIsSpreadFirst === true)
          return output.spreadThenRoleStacks();
        else if (data._ketuHydroBuffIsSpreadFirst === false)
          return output.roleStacksThenSpread();
        return output.roleStacks();
      },
      run: (data) => data._ketuStackTargets = [],
      outputStrings: {
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
        spreadThenRoleStacks: {
          en: 'Spread => Role Stacks',
          de: 'Verteilen => Rollengruppe sammeln',
          fr: 'Écarté => Package par rôle',
          cn: '分散 => 职能分摊',
          ko: '산개 => 역할별 쉐어',
        },
        roleStacksThenSpread: {
          en: 'Role Stacks => Spread',
          de: 'Rollengruppe sammeln => Verteilen',
          fr: 'Package par rôle => Écarté',
          cn: '职能分摊 => 分散',
          ko: '역할별 쉐어 => 산개',
        },
      },
    },
    {
      id: 'AAI Ketuduke Receding Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACC', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data._ketuHydroBuffIsRoleStacks)
          return output.outInRoleStacks();
        return output.outInStacks();
      },
      run: (data) => data._ketuTwintidesNext = 'in',
      outputStrings: {
        outInStacks: {
          en: 'Out => In + Stacks',
          de: 'Raus => Rein + sammeln',
          fr: 'Extérieur => Intérieur + Package',
          cn: '远离 => 靠近 + 分摊',
          ko: '밖 => 안 + 쉐어',
        },
        outInRoleStacks: {
          en: 'Out => In + Role Stacks',
          de: 'Raus => Rein + Rollengruppe sammeln',
          fr: 'Extérieur => Intérieur + Package par rôle',
          cn: '远离 => 靠近 + 职能分摊',
          ko: '밖 => 안 + 역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Encroaching Twintides',
      type: 'StartsUsing',
      netRegex: { id: '8ACE', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data._ketuHydroBuffIsRoleStacks)
          return output.inOutRoleStacks();
        return output.inOutStacks();
      },
      run: (data) => data._ketuTwintidesNext = 'out',
      outputStrings: {
        inOutStacks: {
          en: 'In => Out + Stacks',
          de: 'Rein => Raus + sammeln',
          fr: 'Intérieur => Extérieur + Package',
          cn: '靠近 => 远离 + 分摊',
          ko: '안 => 밖 + 쉐어',
        },
        inOutRoleStacks: {
          en: 'In => Out + Role Stacks',
          de: 'Rein => Raus + Rollengruppe sammeln',
          fr: 'Intérieur => Extérieur + Package par rôle',
          cn: '靠近 => 远离 + 职能分摊',
          ko: '안 => 밖 + 역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Twintides Followup',
      type: 'Ability',
      // 8ABC = Sphere Shatter, which happens slightly after the Twintides hit.
      // You can technically start moving along the safe Sphere Shatter side 0.5s earlier
      // after the initial out/in, but this is hard to explain.
      netRegex: { id: '8ABC', source: 'Ketuduke', capture: false },
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        const mech = data._ketuTwintidesNext;
        if (mech === undefined)
          return;
        const mechStr = output[mech]();
        const stackStr = data._ketuHydroBuffIsRoleStacks ? output.roleStacks() : output.stack();
        return output.text({ inOut: mechStr, stack: stackStr });
      },
      run: (data) => delete data._ketuTwintidesNext,
      outputStrings: {
        text: {
          en: '${inOut} + ${stack}',
          de: '${inOut} + ${stack}',
          fr: '${inOut} + ${stack}',
          cn: '${inOut} + ${stack}',
          ko: '${inOut} + ${stack}',
        },
        in: Outputs.in,
        out: Outputs.out,
        stack: {
          en: 'Stacks',
          de: 'Sammeln',
          fr: 'Package',
          cn: '分摊',
          ko: '쉐어',
        },
        roleStacks: {
          en: 'Role Stacks',
          de: 'Rollengruppe sammeln',
          fr: 'Package par rôle',
          cn: '职能分摊',
          ko: '역할별 쉐어',
        },
      },
    },
    {
      id: 'AAI Ketuduke Spring Crystals 2',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12607', capture: false },
      condition: (data) => data._ketuSpringCrystalCount === 2 && data._ketuCrystalAdd.length === 4,
      // We could call this absurdly early, but knowing this doesn't help with anything
      // until you know what your debuff is, so move it later both so it is less absurd
      // futuresight and so you don't have to remember it as long.
      durationSeconds: 30,
      alertText: (data, _matches, output) => {
        const horizontal = data._ketuCrystalAdd.filter((x) => isHorizontalCrystal(x));
        const vertical = data._ketuCrystalAdd.filter((x) => !isHorizontalCrystal(x));
        if (horizontal.length !== 2 || vertical.length !== 2)
          return;
        // Crystal positions are always -15, -5, 5, 15.
        // Check if any verticals are on the outer vertical edges.
        for (const line of vertical) {
          const y = parseFloat(line.y);
          if (y < -10 || y > 10) {
            data.soumaSpringCrystals2 = 'EastWest';
            return output.eastWestSafe();
          }
        }
        // Check if any horizontals are on the outer horizontal edges.
        for (const line of horizontal) {
          const x = parseFloat(line.x);
          if (x < -10 || x > 10) {
            data.soumaSpringCrystals2 = 'NorthSouth';
            return output.northSouthSafe();
          }
        }
        data.soumaSpringCrystals2 = 'Corners';
        return output.cornersSafe();
      },
      outputStrings: {
        northSouthSafe: {
          en: '南北安全',
        },
        eastWestSafe: {
          en: '东西安全',
        },
        cornersSafe: {
          en: '四角安全',
        },
      },
    },
    {
      id: 'AAI Ketuduke Angry Seas',
      type: 'StartsUsing',
      netRegex: { id: '8AC1', source: 'Ketuduke', capture: false },
      alertText: (data, _matches, output) => {
        if (data._ketuHydroBuffIsSpreadFirst)
          return output.knockbackSpread();
        if (data._ketuHydroBuffIsRoleStacks)
          return output.knockbackRoleStacks();
        return output.knockbackStacks();
      },
      outputStrings: {
        knockbackSpread: {
          en: 'Knockback => Spread',
          de: 'Rückstoß => verteilen',
          fr: 'Pousée => Écartez-vous',
          cn: '击退 => 分散',
          ko: '넉백 => 산개',
        },
        knockbackStacks: {
          en: 'Knockback => Stacks',
          de: 'Rückstoß => sammeln',
          fr: 'Poussée => Package',
          cn: '击退 => 分摊',
          ko: '넉백 => 쉐어',
        },
        knockbackRoleStacks: {
          en: 'Knockback => Role Stacks',
          de: 'Rückstoß => Rollengruppe sammeln',
          fr: 'Poussée => Package par rôle',
          cn: '击退 => 职能分摊',
          ko: '넉백 => 역할별 쉐어',
        },
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'AAI Wood Golem Ancient Aero III',
      type: 'StartsUsing',
      netRegex: { id: '8C4C', source: 'Aloalo Wood Golem' },
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt('alarm'),
    },
    {
      id: 'AAI Wood Golem Tornado',
      type: 'StartsUsing',
      netRegex: { id: '8C4D', source: 'Aloalo Wood Golem' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tornadoOn: {
            en: 'Away from ${player}',
            de: 'Weg von ${player}',
            fr: 'Loin de ${player}',
            cn: '远离 ${player}',
            ko: '${player}에게서 떨어지기',
          },
          tornadoOnYou: {
            en: 'Tornado on YOU',
            de: 'Tornado auf DIR',
            fr: 'Tornade sur VOUS',
            cn: '龙卷风点名',
            ko: '토네이도 대상자',
          },
        };
        if (data.me === matches.target)
          return { alertText: output.tornadoOnYou() };
        return { infoText: output.tornadoOn({ player: data.party.member(matches.target) }) };
      },
    },
    {
      id: 'AAI Wood Golem Tornado Bind',
      type: 'GainsEffect',
      netRegex: { effectId: 'EC0' },
      condition: (data) => data.CanCleanse(),
      infoText: (data, matches, output) => {
        return output.text({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
          fr: 'Guérissez ${player}',
          cn: '康复 ${player}',
          ko: '${player} 디버프 해제',
        },
      },
    },
    {
      id: 'AAI Wood Golem Ovation',
      type: 'StartsUsing',
      netRegex: { id: '8BC1', source: 'Aloalo Wood Golem', capture: false },
      response: Responses.getBehind('info'),
    },
    {
      id: 'AAI Islekeeper Gravity Force',
      type: 'StartsUsing',
      netRegex: { id: '8BC5', source: 'Aloalo Islekeeper' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AAI Islekeeper Isle Drop',
      type: 'StartsUsing',
      netRegex: { id: '8C6F', source: 'Aloalo Islekeeper', capture: false },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind + Out',
          de: 'Geh nach Hinten + Raus',
          fr: 'Derrière + Extérieur',
          cn: '去背后 + 远离',
          ko: '뒤로 + 밖으로',
        },
      },
    },
    {
      id: 'AAI Islekeeper Ancient Quaga',
      type: 'StartsUsing',
      netRegex: { id: '8C4E', source: 'Aloalo Islekeeper', capture: false },
      response: Responses.bleedAoe(),
    },
    {
      id: 'AAI Islekeeper Ancient Quaga Enrage',
      type: 'StartsUsing',
      netRegex: { id: '8C2F', source: 'Aloalo Islekeeper', capture: false },
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Islekeeper!',
          de: 'Wächter besiegen!',
          fr: 'Tuez le gardien !',
          cn: '击杀 阿罗阿罗守卫!',
          ko: '섬지킴이 잡기!',
        },
      },
    },
    // ---------------- Lala ----------------
    {
      id: 'AAI Lala Inferno Theorem',
      type: 'StartsUsing',
      netRegex: { id: '88AE', source: 'Lala', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Lala Rotation Tracker',
      type: 'HeadMarker',
      netRegex: { id: ['01E4', '01E5'], target: 'Lala' },
      run: (data, matches) => data._lalaBossRotation = matches.id === '01E4' ? 'clock' : 'counter',
    },
    {
      id: 'AAI Lala Angular Addition Tracker',
      type: 'Ability',
      netRegex: { id: ['8889', '8D2E'], source: 'Lala' },
      run: (data, matches) => data._lalaBossTimes = matches.id === '8889' ? 3 : 5,
    },
    {
      id: 'AAI Lala Arcane Blight',
      type: 'StartsUsing',
      netRegex: { id: ['888B', '888C', '888D', '888E'], source: 'Lala' },
      alertText: (data, matches, output) => {
        const initialDir = {
          '888B': 2,
          '888C': 0,
          '888D': 1,
          '888E': 3, // initial left safe
        }[matches.id];
        if (initialDir === undefined)
          return;
        if (data._lalaBossTimes === undefined)
          return;
        if (data._lalaBossRotation === undefined)
          return;
        const rotationFactor = data._lalaBossRotation === 'clock' ? 1 : -1;
        const finalDir = (initialDir + rotationFactor * data._lalaBossTimes + 8) % 4;
        const diff = (finalDir - initialDir + 4) % 4;
        if (diff !== 1 && diff !== 3)
          return;
        return {
          0: output.front(),
          1: output.right(),
          2: output.back(),
          3: output.left(),
        }[finalDir];
      },
      run: (data) => {
        delete data._lalaBossTimes;
        delete data._lalaBossRotation;
      },
      outputStrings: {
        front: Outputs.front,
        back: Outputs.back,
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'AAI Lala Analysis Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E8E', 'E8F', 'E90', 'E91'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap = {
          'E8E': 'front',
          'E8F': 'back',
          'E90': 'right',
          'E91': 'left',
        };
        data._lalaUnseen = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Times Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E89', 'ECE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const effectMap = {
          'E89': 3,
          'ECE': 5,
        };
        data._lalaPlayerTimes = effectMap[matches.effectId];
      },
    },
    {
      id: 'AAI Lala Player Rotation Collect',
      type: 'HeadMarker',
      netRegex: { id: ['01ED', '01EE'] },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const idMap = {
          '01ED': 'counter',
          '01EE': 'clock',
        };
        data._lalaPlayerRotation = idMap[matches.id];
      },
    },
    {
      id: 'AAI Lala Targeted Light',
      type: 'StartsUsing',
      netRegex: { id: '8CDE', source: 'Lala', capture: false },
      alertText: (data, _matches, output) => {
        const initialUnseen = data._lalaUnseen;
        if (initialUnseen === undefined)
          return;
        const initialDir = {
          front: 0,
          right: 1,
          back: 2,
          left: 3,
        }[initialUnseen];
        const rotation = data._lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data._lalaPlayerTimes;
        if (times === undefined)
          return;
        // The safe spot rotates, so the player counter-rotates.
        const rotationFactor = rotation === 'clock' ? -1 : 1;
        const finalDir = (initialDir + rotationFactor * times + 8) % 4;
        return {
          0: output.front(),
          1: output.right(),
          2: output.back(),
          3: output.left(),
        }[finalDir];
      },
      run: (data) => {
        delete data._lalaUnseen;
        delete data._lalaPlayerTimes;
      },
      outputStrings: {
        front: {
          en: 'Face Towards Lala',
          de: 'Lala anschauen',
          fr: 'Regardez Lala',
          cn: '面向拉拉鲁',
          ko: '라라 쳐다보기',
        },
        back: {
          en: 'Look Away from Lala',
          de: 'Von Lala weg schauen',
          fr: 'Ne regardez pas Lala',
          cn: '背对拉拉鲁',
          ko: '라라에게서 뒤돌기',
        },
        left: {
          en: 'Left Flank towards Lala',
          de: 'Linke Seite zu Lala zeigen',
          fr: 'Flanc gauche vers Lala',
          cn: '左侧朝向拉拉鲁',
          ko: '왼쪽면을 라라쪽으로',
        },
        right: {
          en: 'Right Flank towards Lala',
          de: 'Rechte Seite zu Lala zeigen',
          fr: 'Flanc droit vers Lala',
          cn: '右侧朝向拉拉鲁',
          ko: '오른쪽면을 라라쪽으로',
        },
      },
    },
    {
      id: 'AAI Lala Strategic Strike',
      type: 'StartsUsing',
      netRegex: { id: '88AD', source: 'Lala' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Lala Planar Tactics',
      type: 'GainsEffect',
      // E8B = Surge Vector
      // E8C = Subtractive Suppressor Alpha
      netRegex: { effectId: ['E8C', 'E8B'] },
      condition: (data, matches) => {
        data._lalaSubAlpha.push(matches);
        return data._lalaSubAlpha.length === 6;
      },
      durationSeconds: 7,
      // Only run once, as Surge Vector is used again.
      suppressSeconds: 9999999,
      infoText: (data, _matches, output) => {
        // For brevity, this code calls "small two" the two that stacks with one
        // and the "big two" the two that stacks with three.
        const stacks = data._lalaSubAlpha.filter((x) => x.effectId === 'E8B').map((x) => x.target);
        const nums = data._lalaSubAlpha.filter((x) => x.effectId === 'E8C');
        const myNumberStr = nums.find((x) => x.target === data.me)?.count;
        if (myNumberStr === undefined)
          return;
        const myNumber = parseInt(myNumberStr);
        if (myNumber < 1 || myNumber > 4)
          return;
        const defaultOutput = output.unknownNum({ num: output[`num${myNumber}`]() });
        if (stacks.length !== 2 || nums.length !== 4)
          return defaultOutput;
        const one = nums.find((x) => parseInt(x.count) === 1)?.target;
        if (one === undefined)
          return defaultOutput;
        const isOneStack = stacks.includes(one);
        const twos = nums.filter((x) => parseInt(x.count) === 2).map((x) => x.target);
        const smallTwos = [];
        for (const thisTwo of twos) {
          // can this two stack with the one?
          const isThisTwoStack = stacks.includes(thisTwo);
          if (isThisTwoStack && !isOneStack || !isThisTwoStack && isOneStack)
            smallTwos.push(thisTwo);
        }
        const [smallTwo1, smallTwo2] = smallTwos;
        if (smallTwos.length === 0 || smallTwo1 === undefined)
          return defaultOutput;
        const isPlayerSmallTwo = smallTwos.includes(data.me);
        // Worst case adjust
        if (isPlayerSmallTwo && smallTwo2 !== undefined) {
          const otherPlayer = smallTwo1 === data.me ? smallTwo2 : smallTwo1;
          return output.eitherTwo({ player: data.party.member(otherPlayer) });
        }
        let playerRole;
        if (one === data.me) {
          playerRole = output.one();
        } else if (twos.includes(data.me)) {
          playerRole = isPlayerSmallTwo ? output.smallTwo() : output.bigTwo();
        } else {
          playerRole = output.three();
        }
        return playerRole;
      },
      outputStrings: {
        one: {
          en: '1：右下',
        },
        bigTwo: {
          en: '2 (找3)：右上',
        },
        smallTwo: {
          en: '2 (找1)：右中',
        },
        eitherTwo: {
          en: '2 (和 ${player})：先到先得',
        },
        three: {
          en: '3：左下贴紧',
        },
        unknownNum: {
          en: '${num}',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
      },
    },
    {
      id: 'AAI Lala Forward March',
      type: 'GainsEffect',
      // E83 = Forward March
      netRegex: { effectId: 'E83' },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 8,
      durationSeconds: 4,
      alertText: (data, _matches, output) => {
        const rotation = data._lalaPlayerRotation;
        if (rotation === undefined)
          return;
        const times = data._lalaPlayerTimes;
        if (times === undefined)
          return;
        const rotationFactor = rotation === 'clock' ? 1 : -1;
        const finalDir = (rotationFactor * times + 8) % 4;
        if (finalDir === 1)
          return output.left();
        if (finalDir === 3)
          return output.right();
      },
      run: (data) => {
        delete data._lalaPlayerRotation;
        delete data._lalaPlayerTimes;
      },
      outputStrings: {
        left: {
          en: 'Leftward March',
          de: 'Linker March',
          fr: 'Marche à gauche',
          cn: '强制移动: 左',
          ko: '강제이동: 왼쪽',
        },
        right: {
          en: 'Rightward March',
          de: 'Rechter March',
          fr: 'Marche à droite',
          cn: '强制移动: 右',
          ko: '강제이동: 오른쪽',
        },
      },
    },
    {
      id: 'AAI Lala Spatial Tactics',
      type: 'GainsEffect',
      // E8D = Subtractive Suppressor Beta
      netRegex: { effectId: 'E8D' },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 999999,
      alertText: (_data, matches, output) => {
        const num = parseInt(matches.count);
        if (num < 1 || num > 4)
          return;
        return output[`num${num}`]();
      },
      outputStrings: {
        num1: {
          en: 'One (avoid all)',
          de: 'Eins (alles ausweichen)',
          fr: 'Un (Évitez tout)',
          cn: '1 (待在中间=>向前1格躲避)',
          ko: '1 (전부 피하기)',
        },
        num2: {
          en: 'Two (stay middle)',
          de: 'Zwei (steh in der Mitte)',
          fr: 'Deux (Restez au centre)',
          cn: '2 (待在中间)',
          ko: '2 (중앙에 머물기)',
        },
        num3: {
          en: 'Three (adjacent to middle)',
          de: 'Drei (steh neben der Mitte)',
          fr: 'Trois (adjacent au centre)',
          cn: '3 (待在下面一格)',
          ko: '3 (중앙에서 옆 칸)',
        },
        num4: {
          en: 'Four',
          de: 'Vier',
          fr: 'Quatre',
          cn: '4 (待在下面一格=>1层buff再次向下)',
          ko: '4',
        },
      },
    },
    {
      id: 'AAI Souma Lala Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12642' },
      condition: (data, matches) => {
        data.soumaAdd3.push(matches);
        return data.soumaAdd3.length === 3;
      },
      promise: async (data, matches) => {
        data._combatantData = [];
        data._combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: data.soumaAdd3.map((x) => parseInt(x.id, 16)),
        })).combatants;
      },
      infoText: (data, _matches, output) => {
        const [first, second, third] = data._combatantData;
        if (first === undefined || second === undefined || third === undefined)
          return;
        const pos = [first, second, third].map((x) => ({ x: (x.PosX), y: (x.PosY) }));
        if (pos[0]?.x === undefined || pos[0].y === undefined) {
          throw new UnreachableCode();
        }
        // N = 0, E = 1, S = 2, W = 3
        const dir = ['N', 'E', 'S', 'W'][Directions.xyTo4DirNum(pos[0].x, pos[0].y, 200, 0)];
        if (dir === undefined) {
          throw new UnreachableCode();
        }
        const left = data._combatantData.filter((v) => {
          const x = v.PosX;
          const y = v.PosY;
          return (dir === 'N' && x < 204) || (dir === 'S' && x > 196) ||
            (dir === 'E' && y < 4) || (dir === 'W' && y > -4);
        }).length;
        const right = data._combatantData.filter((v) => {
          const x = v.PosX;
          const y = v.PosY;
          return (dir === 'S' && x < 204) || (dir === 'N' && x > 196) ||
            (dir === 'W' && y < 4) || (dir === 'E' && y > -4);
        }).length;
        if (left === 0 || right === 0) {
          throw new UnreachableCode();
        }
        let offset;
        if (left === right) {
          offset = 'None';
        } else if (left < right) {
          offset = 'Left';
        } else {
          offset = 'Right';
        }
        return output.text({ dir: output[dir](), offset: output[`offset${offset}`]() });
      },
      outputStrings: {
        text: { en: '小怪在${dir} => 玩家${offset}' },
        N: Outputs.north,
        E: Outputs.east,
        S: Outputs.south,
        W: Outputs.west,
        offsetLeft: { en: '先偏左一格' },
        offsetRight: { en: '先偏右一格' },
        offsetNone: { en: '先在中间' },
      },
    },
    // ---------------- Statice ----------------
    {
      id: 'AAI Statice Aero IV',
      type: 'StartsUsing',
      netRegex: { id: '8949', source: 'Statice', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AAI Statice Trick Reload',
      type: 'Ability',
      // 8925 = Locked and Loaded
      // 8926 = Misload
      netRegex: { id: ['8925', '8926'], source: 'Statice' },
      preRun: (data, matches) => data._staticeBullet.push(matches),
      alertText: (data, _matches, output) => {
        // Statice loads 8 bullets, two are duds.
        // The first and the last are always opposite, and one of them is a dud.
        // The first/ last bullets are for Trapshooting and the middle six are for Trigger Happy.
        const [bullet] = data._staticeBullet;
        if (data._staticeBullet.length !== 1 || bullet === undefined)
          return;
        const isStack = bullet.id === '8926';
        data._staticeTrapshooting = isStack ? ['stack', 'spread'] : ['spread', 'stack'];
        return isStack ? output.stackThenSpread() : output.spreadThenStack();
      },
      infoText: (data, _matches, output) => {
        const lastBullet = data._staticeBullet[data._staticeBullet.length - 1];
        if (data._staticeBullet.length < 2 || data._staticeBullet.length > 7)
          return;
        if (lastBullet?.id !== '8926')
          return;
        data._staticeTriggerHappy = data._staticeBullet.length - 1;
        return output.numSafeLater({ num: output[`num${data._staticeTriggerHappy}`]() });
      },
      run: (data) => {
        if (data._staticeBullet.length === 8)
          data._staticeBullet = [];
      },
      outputStrings: {
        stackThenSpread: Outputs.stackThenSpread,
        spreadThenStack: Outputs.spreadThenStack,
        numSafeLater: {
          en: '(${num} safe later)',
          de: '(${num} später sicher)',
          fr: '(${num} sûr ensuite)',
          cn: '(稍后 ${num} 安全)',
          ko: '(나중에 ${num} 안전)',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Trapshooting',
      type: 'StartsUsing',
      netRegex: { id: ['8D1A', '8959'], source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const mech = data._staticeTrapshooting.shift();
        if (mech === undefined)
          return;
        return output[mech]();
      },
      outputStrings: {
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
      },
    },
    {
      id: 'AAI Statice Trigger Happy',
      type: 'StartsUsing',
      netRegex: { id: '894B', source: 'Statice', capture: false },
      alertText: (data, _matches, output) => {
        const num = data._staticeTriggerHappy;
        if (num === undefined)
          return;
        return output[`num${num}`]();
      },
      run: (data) => delete data._staticeTriggerHappy,
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Bull\'s-eye',
      type: 'GainsEffect',
      netRegex: { effectId: 'E9E' },
      delaySeconds: (data, matches) => {
        // Note: this collects for the pinwheeling dartboard version too.
        data._staticeDart.push(matches);
        if (data.soumaInDartboard) {
          return 11;
        }
        return data._staticeDart.length === 3 ? 0 : 0.5;
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart on YOU',
            de: 'Dart auf DIR',
            fr: 'Dard sur VOUS',
            cn: '飞镖点名',
            ko: '다트 대상자',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
            fr: 'Pas de Dard',
            cn: '无飞镖',
            ko: '다트 없음',
          },
          flexCall: {
            en: '(${player} unmarked)',
            de: '(${player} unmarkiert)',
            fr: '(${player} non-marqué)',
            cn: '(${player} 无标记)',
            ko: '(${player} 다트 없음)',
          },
          switch: { en: '换位' },
          normal: { en: '不换' },
        };
        if (data._staticeIsPinwheelingDartboard) {
          return;
        }
        if (data._staticeDart.length === 0)
          return;
        const dartTargets = data._staticeDart.map((x) => x.target);
        if (!dartTargets.includes(data.me))
          return { alertText: output.noDartOnYou() };
        const partyNames = data.party.partyNames;
        const flexers = partyNames.filter((x) => !dartTargets.includes(x));
        const [flex] = flexers;
        const flexPlayer = flexers.length === 1 ? data.party.member(flex) : undefined;
        return {
          alertText: output.dartOnYou(),
          infoText: output.flexCall({ player: flexPlayer }),
        };
      },
      run: (data) => data._staticeDart = [],
    },
    {
      id: 'AAI Statice Surprise Balloon Reminder',
      // This is an early reminder for the following Trigger Happy with knockback.
      // However, because there's a tight window to immuune both knockbacks,
      // call this ~15s early (in case anybody forgot).
      type: 'StartsUsing',
      netRegex: { id: '894D', source: 'Statice', capture: false },
      infoText: (data, _matches, output) => {
        const num = data._staticeTriggerHappy;
        if (num === undefined)
          return;
        // We'll re-call this out with the knockback warning.
        // However, also clear `data.staticeTriggerHappy` to avoid double callouts.
        data._staticePopTriggerHappyNum = num;
        return output.numSafeSoon({ num: output[`num${num}`]() });
      },
      run: (data) => delete data._staticeTriggerHappy,
      outputStrings: {
        numSafeSoon: {
          en: '(${num} safe soon)',
          de: '(${num} gleich sicher)',
          fr: '(${num} bientôt sûr',
          cn: '(很快 ${num} 安全)',
          ko: '(나중에 ${num} 안전)',
        },
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Pop',
      type: 'StartsUsing',
      // TODO: this might need a slight delay
      netRegex: { id: '894E', source: 'Statice', capture: false },
      suppressSeconds: 20,
      alertText: (data, _matches, output) => {
        const num = data._staticePopTriggerHappyNum;
        if (num === undefined)
          return output.knockback();
        const numStr = output[`num${num}`]();
        return output.knockbackToNum({ num: numStr });
      },
      run: (data) => delete data._staticePopTriggerHappyNum,
      outputStrings: {
        knockbackToNum: {
          en: 'Knockback => ${num}',
          de: 'Rückstoß => ${num}',
          fr: 'Poussée => ${num}',
          cn: '击退 => ${num}',
          ko: '넉백 => ${num}',
        },
        knockback: Outputs.knockback,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
      },
    },
    {
      id: 'AAI Statice Face',
      type: 'GainsEffect',
      // DD2 = Forward March
      // DD3 = About Face
      // DD4 = Left Face
      // DD5 = Right Face
      netRegex: { effectId: ['DD2', 'DD3', 'DD4', 'DD5'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 7,
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        let mech = output.unknown();
        const num = data._staticeTriggerHappy;
        if (num !== undefined) {
          mech = output[`num${num}`]();
          delete data._staticeTriggerHappy;
        } else {
          const mechName = data._staticeTrapshooting.shift();
          mech = mechName === undefined ? output.unknown() : output[mechName]();
        }
        return {
          'DD2': output.forward({ mech: mech }),
          'DD3': output.backward({ mech: mech }),
          'DD4': output.left({ mech: mech }),
          'DD5': output.right({ mech: mech }),
        }[matches.effectId];
      },
      outputStrings: {
        forward: {
          en: 'Forward March => ${mech}',
          de: 'Vorwärtsmarsch => ${mech}',
          fr: 'Marche en avant => ${mech}',
          cn: '强制移动：前 => ${mech}',
          ko: '강제이동: 앞 => ${mech}',
        },
        backward: {
          en: 'Backward March => ${mech}',
          de: 'Rückwärtsmarsch => ${mech}',
          fr: 'Marche en arrière => ${mech}',
          cn: '强制移动：后 => ${mech}',
          ko: '강제이동: 뒤 => ${mech}',
        },
        left: {
          en: 'Left March => ${mech}',
          de: 'Marsch Links => ${mech}',
          fr: 'Marche à gauche => ${mech}',
          cn: '强制移动：左 => ${mech}',
          ko: '강제이동: 왼쪽 => ${mech}',
        },
        right: {
          en: 'Right March => ${mech}',
          de: 'Marsch Rechts => ${mech}',
          fr: 'Marche à droite => ${mech}',
          cn: '强制移动：右 => ${mech}',
          ko: '강제이동: 오른쪽 => ${mech}',
        },
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        num5: Outputs.num5,
        num6: Outputs.num6,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AAI Statice Present Box Counter',
      // This happens ~1s prior to ActorControlExtra on bomb.
      type: 'StartsUsing',
      netRegex: { id: '8955', source: 'Statice', capture: false },
      run: (data) => data._staticePresentBoxCount++,
    },
    {
      id: 'AAI Statice Present Box Missile',
      type: 'Tether',
      netRegex: { source: 'Surprising Missile', id: '0011' },
      delaySeconds: (data, matches) => {
        data._staticeMissileTether.push(matches);
        return data._staticeMissileTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 14,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          missileOnYou: { en: '场中等待 => 拉线 => 导弹分散（偏下躲避）' },
          missileOnYouCrossover: { en: '场中等待 => 拉线 => 导弹分散（正点躲避）' },
        };
        if (data._staticeMissileTether.length !== 2)
          return;
        const missileTether = data._staticeMissileTether.find((x) => x.target === data.me);
        if (missileTether === undefined)
          return;
        return {
          alertText: data.soumaBoomType === 'crossover'
            ? output.missileOnYouCrossover()
            : output.missileOnYou(),
        };
      },
      run: (data) => data._staticeMissileTether = [],
    },
    {
      id: 'AAI Statice Present Box Claw',
      type: 'Tether',
      netRegex: { source: 'Surprising Claw', id: '0011' },
      delaySeconds: (data, matches) => {
        data._staticeClawTether.push(matches);
        return data._staticeClawTether.length === 2 ? 0 : 0.5;
      },
      durationSeconds: 14,
      alertText: (data, _matches, output) => {
        if (data._staticeClawTether.length !== 2)
          return;
        if (!data._staticeClawTether.map((x) => x.target).includes(data.me))
          return;
        if (data.soumaBoomType === 'crossover') {
          return output.stackCrossover();
        }
        return output.stack();
      },
      run: (data) => data._staticeClawTether = [],
      outputStrings: {
        stack: { en: '爪子连线 => 分摊' },
        stackCrossover: { en: '爪子连线 => 分摊（偏左躲避）' },
      },
    },
    {
      id: 'AAI Statice Burning Chains',
      type: 'GainsEffect',
      netRegex: { effectId: '301' },
      condition: Conditions.targetIsYou(),
      // TODO: add a strategy for dart colors and say where to go here
      // for the Pinwheeling Dartboard if you have a dart.
      response: Responses.breakChains(),
    },
    {
      id: 'AAI Statice Shocking Abandon',
      type: 'StartsUsing',
      netRegex: { id: '8948', source: 'Statice' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Tracker',
      type: 'StartsUsing',
      netRegex: { id: '8CBC', source: 'Statice', capture: false },
      run: (data) => data._staticeIsPinwheelingDartboard = true,
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Color',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12507' },
      durationSeconds: 6,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          dartOnYou: {
            en: 'Dart (w/${player})',
            de: 'Dart (mit ${player})',
            fr: 'Dard (avec ${player})',
            cn: '飞镖 (和 ${player})',
            ko: '다트 (+ ${player})',
          },
          noDartOnYou: {
            en: 'No Dart',
            de: 'Kein Dart',
            fr: 'Pas de dard',
            cn: '无飞镖',
            ko: '다트 없음',
          },
          blue: {
            en: 'Avoid Blue',
            de: 'Vermeide Blau',
            fr: 'Évitez le bleu',
            cn: '躲避蓝色',
            ko: '파란색 피하기',
          },
          red: {
            en: 'Avoid Red',
            de: 'Vermeide Rot',
            fr: 'Évitez le rouge',
            cn: '躲避红色',
            ko: '빨간색 피하기',
          },
          yellow: {
            en: 'Avoid Yellow',
            de: 'Vermeide Gelb',
            fr: 'Évitez le jaune',
            cn: '躲避黄色',
            ko: '노란색 피하기',
          },
        };
        let infoText;
        const centerX = -200;
        const centerY = 0;
        const x = parseFloat(matches.x) - centerX;
        const y = parseFloat(matches.y) - centerY;
        // 12 pie slices, the edge of the first one is directly north.
        // It goes in B R Y order repeating 4 times.
        // The 0.5 subtraction (12 - 0.5 = 11.5) is because the Homing Pattern
        // lands directly in the middle of a slice.
        const dir12 = Math.round(6 - 6 * Math.atan2(x, y) / Math.PI + 11.5) % 12;
        const colorOffset = dir12 % 3;
        const colorMap = {
          0: 'blue',
          1: 'red',
          2: 'yellow',
        };
        data._staticeHomingColor = colorMap[colorOffset];
        if (data._staticeHomingColor !== undefined)
          infoText = output[data._staticeHomingColor]();
        if (data._staticeDart.length !== 2)
          return { infoText };
        const dartTargets = data._staticeDart.map((x) => x.target);
        if (!dartTargets.includes(data.me))
          return { infoText: output.noDartOnYou(), alertText: infoText };
        const [target1, target2] = dartTargets;
        if (target1 === undefined || target2 === undefined)
          return { infoText };
        const otherTarget = data.party.member(target1 === data.me ? target2 : target1);
        return { infoText: output.dartOnYou({ player: otherTarget }), alertText: infoText };
      },
    },
    {
      id: 'Souma ASI Statice Dartboard',
      type: 'StartsUsing',
      netRegex: { id: '8CBC', capture: false },
      delaySeconds: (data) => {
        data.soumaInDartboard = true;
        return 20;
      },
      run: (data) => data.soumaInDartboard = false,
    },
    {
      id: 'AAI Statice Pinwheeling Dartboard Mech',
      type: 'HeadMarker',
      netRegex: { id: headmarkerIds.tethers },
      condition: (data) => data._staticeIsPinwheelingDartboard,
      delaySeconds: (data, matches) => {
        data._staticeDartboardTether.push(matches);
        return data._staticeDartboardTether.length === 2 ? 0 : 0.5;
      },
      alertText: (data, _matches, output) => {
        if (data._staticeDartboardTether.length !== 2)
          return;
        const tethers = data._staticeDartboardTether.map((x) => x.target);
        if (tethers.includes(data.me)) {
          const [tether1, tether2] = tethers;
          const other = data.party.member(tether1 === data.me ? tether2 : tether1);
          return output.tether({ player: other });
        }
        const partyNames = data.party.partyNames;
        const nonTethers = partyNames.filter((x) => !tethers.includes(x));
        const [stack1, stack2] = nonTethers;
        const other = data.party.member(stack1 === data.me ? stack2 : stack1);
        const stack1Role = data.party.nameToRole_[stack1];
        const stack2Role = data.party.nameToRole_[stack2];
        return stack1Role === stack2Role
          ? output.stackSwitch({ player: other })
          : output.stack({ player: other });
      },
      run: (data) => data._staticeDartboardTether = [],
      outputStrings: {
        // TODO: maybe this should remind you of dart color
        tether: {
          en: 'Tether w/${player}',
          de: 'Verbindung mit ${player}',
          fr: 'Lien avec ${player}',
          cn: '连线 和 ${player}',
          ko: '사슬 +${player}',
        },
        stack: { en: '分摊 和 ${player} （不换）' },
        stackSwitch: { en: '分摊 和 ${player} （换位！）' },
      },
    },
    {
      id: 'AAI Souma Statice Boom',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12520', capture: true },
      preRun: (data, matches) => {
        data.soumaAdd4Boom.push(matches);
        if (data.soumaAdd4Boom.length === 6) {
          data.soumaBoomCount++;
          const booms = data.soumaAdd4Boom.map((x) => ({
            id: x.id,
            x: Math.floor(parseFloat(x.x) + 200),
            y: parseFloat(x.y),
          })).sort((a, b) => {
            if (a.y === b.y)
              return a.x - b.x;
            return a.y - b.y;
          });
          if (booms.length === 0) {
            throw new UnreachableCode();
          }
          data.soumaBooms = booms;
          data.soumaBoomCoordinate.push(booms[0]);
        }
      },
      delaySeconds: 3,
      run: (data) => {
        data.soumaAdd4Boom.length = 0;
        data.soumaBoomCoordinate.length = 0;
      },
    },
    {
      id: 'AAI Souma Statice Boom Tracker',
      type: 'SpawnNpcExtra',
      netRegex: { 'tetherId': '0036', 'animationState': ['00', '01'], capture: true },
      preRun: (data, matches) => {
        if (matches.animationState === '01')
          data.soumaBoomId = matches.id;
      },
      delaySeconds: 0.5,
      durationSeconds: 16,
      infoText: (data, matches, output) => {
        let parent;
        if (matches.id === data.soumaBooms[0]?.id) {
          parent = data.soumaBooms.find((x) => x.id === matches.parentId);
        }
        if (matches.parentId === data.soumaBooms[0]?.id) {
          parent = data.soumaBooms.find((x) => x.id === matches.id);
        }
        if (!parent) {
          return;
        }
        data.soumaBoomCoordinate.push(parent);
        if (data.soumaBoomCoordinate.length === 3) {
          const A_coords = data.soumaBoomCoordinate.slice();
          const Other_coords = data.soumaBooms.filter((x) => !A_coords.some((y) => y.id === x.id));
          const A_angles = calculateAngles(
            A_coords[0].x,
            A_coords[0].y,
            A_coords[1].x,
            A_coords[1].y,
            A_coords[2].x,
            A_coords[2].y,
          );
          const Other_angles = calculateAngles(
            Other_coords[0].x,
            Other_coords[0].y,
            Other_coords[1].x,
            Other_coords[1].y,
            Other_coords[2].x,
            Other_coords[2].y,
          );
          // A点组成的三角形是否为钝角三角形
          const A_isObtuse = isObtuseTriangle(A_angles.angleA, A_angles.angleB, A_angles.angleC);
          // A点组成的三角形是否存在发光炸弹
          const A_isDanger = !!A_coords.find((v) => v.id === data.soumaBoomId);
          const maxAngle = Math.max(
            A_angles.angleA,
            A_angles.angleB,
            A_angles.angleC,
            Other_angles.angleA,
            Other_angles.angleB,
            Other_angles.angleC,
          );
          const boomType = maxAngle > 140 ? 'crossover' : 'contactless';
          data.soumaBoomType = boomType;
          if (data.soumaBoomCount === 3) {
            const dangerBombs = A_isDanger ? A_coords : Other_coords;
            const markway = getNearestNumberMark(dangerBombs);
            return output[markway]();
          }
          if ((A_isObtuse && A_isDanger) || (!A_isObtuse && !A_isDanger)) {
            return output[boomType === 'crossover' ? 'acute' : 'equilateral']();
          }
          return output['obtuse_' + boomType]();
        }
      },
      outputStrings: {
        obtuse_contactless: { en: '上钝角安全' },
        obtuse_crossover: { en: '扁钝角安全' },
        acute: { en: '长锐角安全' },
        equilateral: { en: '下等边安全' },
        One: { en: '1点为北' },
        Two: { en: '2点为北' },
        Three: { en: '3点为北' },
        Four: { en: '4点为北' },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Far Tide/Near Tide': 'Far/Near Tide',
        'Hydrobullet/Hydrofall': 'Hydrobullet/fall',
        'Hydrofall/Hydrobullet': 'Hydrofall/bullet',
        'Receding Twintides/Encroaching Twintides': 'Receding/Encroaching Twintides',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Aloalo Golem': 'Aloalo-Holzgolem',
        'Aloalo Islekeeper': 'Aloalo-Wächter',
        'Aloalo Kiwakin': 'Aloalo-Kiwakin',
        'Aloalo Monk': 'Aloalo-Mönch',
        'Aloalo Ray': 'Aloalo-Rochen',
        'Aloalo Snipper': 'Aloalo-Schnippler',
        'Aloalo Wood Golem': 'Aloalo-Holzgolem',
        'Aloalo Zaratan': 'Aloalo-Zaratan',
        'Arcane Font': 'arkan(?:e|er|es|en) Körper',
        'Arcane Globe': 'arkan(?:e|er|es|en) Kugel',
        'Ball of Fire': 'Feuerkugel',
        'Bomb': 'Bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'Nadel',
        'Spring Crystal': 'Wasserquell-Kristall',
        'Statice': 'Statice',
        'Surprising Claw': 'Überraschungsklaue',
        'Surprising Missile': 'Überraschungsrakete',
        'Surprising Staff': 'Überraschungsstab',
        'The Dawn Trial': 'Morgenrot-Probe',
        'The Dusk Trial': 'Abendrot-Probe',
        'The Midnight Trial': 'Vollmond-Probe',
      },
      'replaceText': {
        '\\(buff\\)': '(Statusveränderung)',
        '\\(cast\\)': '(wirken)',
        'Aero II': 'Windra',
        'Aero IV': 'Windka',
        'Analysis': 'Analyse',
        'Angry Seas': 'Zornige Fluten',
        'Angular Addition': 'Winkeladdition',
        'Arcane Array': 'Arkanes Spektrum',
        'Arcane Blight': 'Arkane Fäule',
        'Arcane Mine': 'Arkane Mine',
        'Arcane Plot': 'Arkane Flur',
        'Arcane Point': 'Arkane Stätte',
        'Beguiling Glitter': 'Irrleuchten',
        'Blowing Bubbles': 'Pusteblasen',
        'Bright Pulse': 'Glühen',
        'Bubble Net': 'Blasennetz',
        'Burning Chains': 'Brennende Ketten',
        'Burst': 'Explosion',
        'Constructive Figure': 'Ruf der Schöpfer',
        'Dartboard of Dancing Explosives': 'Darts und Drehung',
        'Encroaching Twintides': 'Ring der Zwiegezeiten',
        'Explosive Theorem': 'Arkane Fäule',
        'Faerie Ring': 'Feenring',
        'Far Tide': 'Ring der Gezeiten',
        'Fire Spread': 'Brandstiftung',
        'Fireworks': 'Feuerwerk',
        'Fluke Gale': 'Flossensturm',
        'Fluke Typhoon': 'Flossentaifun',
        'Hundred Lashings': 'Auspeitschung',
        'Hydrobomb': 'Hydro-Bombe',
        'Hydrobullet': 'Hydro-Kugel',
        'Hydrofall': 'Hydro-Sturz',
        'Inferno Divide': 'Infernale Teilung',
        'Inferno Theorem': 'Infernales Theorem',
        'Locked and Loaded': 'Geladen und entsichert',
        'Misload': 'Fehlladung',
        'Near Tide': 'Kreis der Gezeiten',
        'Pinwheeling Dartboard': 'Darts und Rad',
        'Planar Tactics': 'Flächentaktiken',
        'Pop': 'Platzen',
        'Powerful Light': 'Entladenes Licht',
        'Present Box': 'Geschenkschachtel',
        'Radiance': 'Radiation',
        'Receding Twintides': 'Kreis der Zwiegezeiten',
        'Ring a Ring o\' Explosions': 'Ringel-Ringel-Bombe',
        '(?<! )Roar': 'Brüllen',
        'Saturate': 'Wasserfontäne',
        'Shocking Abandon': 'Schockende Hingabe',
        'Spatial Tactics': 'Raumtaktiken',
        'Sphere Shatter': 'Sphärensplitterung',
        'Spring Crystals': 'Quellkristalle',
        'Strategic Strike': 'Schwere Attacke',
        'Strewn Bubbles': 'Streublasen',
        'Surprise Balloon': 'Überraschungsballon',
        'Surprise Needle': 'Überraschungsnadel',
        'Symmetric Surge': 'Symmetrischer Schub',
        'Targeted Light': 'Gezieltes Licht',
        'Telluric Theorem': 'Tellurisches Theorem',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Trapshooting': 'Tontaubenschuss',
        'Trick Reload': 'Trickladung',
        'Trigger Happy': 'Schießwut',
        'Uncommon Ground': 'Voll ins Schwarze',
        'Updraft': 'Aufwind',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aloalo Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Islekeeper': 'gardien d\'Aloalo',
        'Aloalo Kiwakin': 'kiwakin d\'Aloalo',
        'Aloalo Monk': 'moine d\'Aloalo',
        'Aloalo Ray': 'raie rayée d\'Aloalo',
        'Aloalo Snipper': 'cisailleur d\'Aloalo',
        'Aloalo Wood Golem': 'golem sylvestre d\'Aloalo',
        'Aloalo Zaratan': 'zaratan d\'Aloalo',
        'Arcane Font': 'sphère arcanique',
        'Arcane Globe': 'globe arcanique',
        'Ball of Fire': 'orbe de feu',
        'Bomb': 'bombe',
        'Ketuduke': 'Ketuduke',
        'Lala': 'Lala',
        'Needle': 'aiguille',
        'Spring Crystal': 'cristal de source',
        'Statice': 'Statice',
        'Surprising Claw': 'griffe surprise',
        'Surprising Missile': 'missile surprise',
        'Surprising Staff': 'sceptre surprise',
        'The Dawn Trial': 'Épreuve de Dilumu',
        'The Dusk Trial': 'Épreuve de Qurupe',
        'The Midnight Trial': 'Épreuve de Nokosero',
      },
      'replaceText': {
        '\\(buff\\)': '(Buff)',
        '\\(cast\\)': '(Incantation)',
        'Aero II': 'Extra Vent',
        'Aero IV': 'Giga Vent',
        'Analysis': 'Analyse',
        'Angry Seas': 'Mer agitée',
        'Angular Addition': 'Calcul angulaire',
        'Arcane Array': 'Assemblement arcanique',
        'Arcane Blight': 'Canon arcanique',
        'Arcane Mine': 'Mine arcanique',
        'Arcane Plot': 'Modulateur arcanique',
        'Arcane Point': 'Pointe arcanique',
        'Beguiling Glitter': 'Paillettes aveuglantes',
        'Blowing Bubbles': 'Bulles soufflées',
        'Bright Pulse': 'Éclat',
        'Bubble Net': 'Filet de bulles',
        'Burning Chains': 'Chaînes brûlantes',
        'Burst': 'Explosion',
        'Constructive Figure': 'Icône articulée',
        'Dartboard of Dancing Explosives': 'Duo fléchettes-tourbillon',
        'Encroaching Twintides': 'Double marée débordante',
        'Explosive Theorem': 'Théorème explosif',
        'Faerie Ring': 'Cercle féérique',
        'Far Tide': 'Marée lointaine',
        'Fire Spread': 'Nappe de feu',
        'Fireworks': 'Feu d\'artifice',
        'Fluke Gale': 'Bourrasque hasardeuse',
        'Fluke Typhoon': 'Typhon hasardeux',
        'Hundred Lashings': 'Cent coups de fouet',
        'Hydrobomb': 'Hydrobombe',
        'Hydrobullet': 'Barillet hydrique',
        'Hydrofall': 'Pilonnage hydrique',
        'Inferno Divide': 'Division infernale',
        'Inferno Theorem': 'Théorème infernal',
        'Locked and Loaded': 'Rechargement réussi',
        'Misload': 'Rechargement raté',
        'Near Tide': 'Marée proche',
        'Pinwheeling Dartboard': 'Duo fléchettes-moulinette',
        'Planar Tactics': 'Tactique planaire',
        'Pop': 'Rupture',
        'Powerful Light': 'Explosion sacrée',
        'Present Box': 'Boîtes cadeaux',
        'Radiance': 'Irradiation',
        'Receding Twintides': 'Double marée fuyante',
        'Ring a Ring o\' Explosions': 'Tempérament explosif',
        '(?<! )Roar': 'Rugissement',
        'Saturate': 'Jet d\'eau',
        'Shocking Abandon': 'Choc renonciateur',
        'Spatial Tactics': 'Tactique spatiale',
        'Sphere Shatter': 'Rupture glacée',
        'Spring Crystals': 'Cristaux de source',
        'Strategic Strike': 'Coup violent',
        'Strewn Bubbles': 'Bulles éparpillées',
        'Surprise Balloon': 'Ballons surprises',
        'Surprise Needle': 'Aiguille surprise',
        'Symmetric Surge': 'Déferlement symétrique',
        'Targeted Light': 'Rayon ciblé',
        'Telluric Theorem': 'Théorème tellurique',
        'Tidal Roar': 'Vague rugissante',
        'Trapshooting': 'Tir au pigeon',
        'Trick Reload': 'Rechargement habile',
        'Trigger Happy': 'Gâchette impulsive',
        'Uncommon Ground': 'Terrain de mésentente',
        'Updraft': 'Courants ascendants',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aloalo Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Islekeeper': 'アロアロ・キーパー',
        'Aloalo Kiwakin': 'アロアロ・キワキン',
        'Aloalo Monk': 'アロアロ・モンク',
        'Aloalo Ray': 'アロアロ・ストライプレイ',
        'Aloalo Snipper': 'アロアロ・スニッパー',
        'Aloalo Wood Golem': 'アロアロ・ウッドゴーレム',
        'Aloalo Zaratan': 'アロアロ・ザラタン',
        'Arcane Font': '立体魔法陣',
        'Arcane Globe': '球体魔法陣',
        'Ball of Fire': '火球',
        'Bomb': '爆弾',
        'Ketuduke': 'ケトゥドゥケ',
        'Lala': 'ララ',
        'Needle': 'ニードル',
        'Spring Crystal': '湧水のクリスタル',
        'Statice': 'スターチス',
        'Surprising Claw': 'サプライズ・クロー',
        'Surprising Missile': 'サプライズ・ミサイル',
        'Surprising Staff': 'サプライズ・ロッド',
        'The Dawn Trial': 'ディルムの試練',
        'The Dusk Trial': 'クルペの試練',
        'The Midnight Trial': 'ノコセロの試練',
      },
      'replaceText': {
        'Aero II': 'エアロラ',
        'Aero IV': 'エアロジャ',
        'Analysis': 'アナライズ',
        'Angry Seas': 'アングリーシーズ',
        'Angular Addition': '回転角乗算',
        'Arcane Array': '複合魔紋',
        'Arcane Blight': '魔紋砲',
        'Arcane Mine': '地雷魔紋',
        'Arcane Plot': '変光魔紋',
        'Arcane Point': '変光起爆',
        'Beguiling Glitter': '惑わしの光',
        'Blowing Bubbles': 'バブルブロワー',
        'Bright Pulse': '閃光',
        'Bubble Net': 'バブルネットフィーディング',
        'Burning Chains': '炎の鎖',
        'Burst': '爆発',
        'Constructive Figure': '人形召喚',
        'Dartboard of Dancing Explosives': 'ダーツ＆ローテーション',
        'Encroaching Twintides': 'リング・ダブルタイド',
        'Explosive Theorem': '魔爆法',
        'Faerie Ring': 'フェアリーリング',
        'Far Tide': 'リングタイド',
        'Fire Spread': '放火',
        'Fireworks': 'ファイアワークフェスティバル',
        'Fluke Gale': 'フリッパーゲイル',
        'Fluke Typhoon': 'フリッパータイフーン',
        'Hundred Lashings': 'めった打ち',
        'Hydrobomb': 'ハイドロボム',
        'Hydrobullet': 'ハイドロバレット',
        'Hydrofall': 'ハイドロフォール',
        'Inferno Divide': '十火法',
        'Inferno Theorem': '散火法',
        'Locked and Loaded': 'リロード成功',
        'Misload': 'リロード失敗',
        'Near Tide': 'ラウンドタイド',
        'Pinwheeling Dartboard': 'ダーツ＆ウィール',
        'Planar Tactics': '爆雷戦術：面',
        'Pop': '破裂',
        'Powerful Light': '光爆',
        'Present Box': 'プレゼントボックス',
        'Radiance': '光球爆散',
        'Receding Twintides': 'ラウンド・ダブルタイド',
        'Ring a Ring o\' Explosions': 'リンクリンクボム',
        '(?<! )Roar': '咆哮',
        'Saturate': '放水',
        'Shocking Abandon': 'アバンドンショック',
        'Spatial Tactics': '爆雷戦術：立体',
        'Sphere Shatter': '破裂',
        'Spring Crystals': '湧水のクリスタル',
        'Strategic Strike': '強撃',
        'Strewn Bubbles': 'バブルストゥルー',
        'Surprise Balloon': 'サプライズバルーン',
        'Surprise Needle': 'サプライズニードル',
        'Symmetric Surge': '双数爆撃',
        'Targeted Light': '高精度光弾',
        'Telluric Theorem': '地隆法',
        'Tidal Roar': 'タイダルロア',
        'Trapshooting': 'トラップシューティング',
        'Trick Reload': 'トリックリロード',
        'Trigger Happy': 'トリガーハッピー',
        'Uncommon Ground': 'グラウンドシアー',
        'Updraft': '上昇気流',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aloalo Golem': '阿罗阿罗树木巨像',
        'Aloalo Islekeeper': '阿罗阿罗守卫',
        'Aloalo Kiwakin': '阿罗阿罗奇瓦金',
        'Aloalo Monk': '阿罗阿罗鬼鱼',
        'Aloalo Ray': '阿罗阿罗斑鳐',
        'Aloalo Snipper': '阿罗阿罗利螯陆蟹',
        'Aloalo Wood Golem': '阿罗阿罗树木巨像',
        'Aloalo Zaratan': '阿罗阿罗扎拉坦',
        'Arcane Font': '立体魔法阵',
        'Arcane Globe': '球体魔法阵',
        'Ball of Fire': '火球',
        'Bomb': '炸弹',
        'Ketuduke': '凯图嘟凯',
        'Lala': '拉拉鲁',
        'Needle': '飞针',
        'Spring Crystal': '涌水水晶',
        'Statice': '斯塔缇丝',
        'Surprising Claw': '惊喜爪',
        'Surprising Missile': '惊喜导弹',
        'Surprising Staff': '惊喜杖',
        'The Dawn Trial': '曙色的试炼',
        'The Dusk Trial': '暮色的试炼',
        'The Midnight Trial': '夜色的试炼',
      },
      'replaceText': {
        '\\(buff\\)': '(强化)',
        '\\(cast\\)': '(咏唱)',
        'Aero II': '烈风',
        'Aero IV': '飙风',
        'Analysis': '分析',
        'Angry Seas': '愤怒之海',
        'Angular Addition': '旋转角乘算',
        'Arcane Array': '复合魔纹',
        'Arcane Blight': '魔纹炮',
        'Arcane Mine': '地雷魔纹',
        'Arcane Plot': '变光魔纹',
        'Arcane Point': '变光爆炸',
        'Beguiling Glitter': '幻惑之光',
        'Blowing Bubbles': '吹气泡',
        'Bright Pulse': '闪光',
        'Bubble Net': '捕食气泡网',
        'Burning Chains': '火焰链',
        'Burst': '爆炸',
        'Constructive Figure': '召唤人偶',
        'Dartboard of Dancing Explosives': '飞镖·炸弹·转转转',
        'Encroaching Twintides': '环浪连潮',
        'Explosive Theorem': '魔爆法',
        'Faerie Ring': '仙女环',
        'Far Tide': '环浪',
        'Fire Spread': '喷火',
        'Fireworks': '焰火嘉年华',
        'Fluke Gale': '鲸尾突风',
        'Fluke Typhoon': '鲸尾台风',
        'Hundred Lashings': '胡乱打',
        'Hydrobomb': '水化爆弹',
        'Hydrobullet': '水化弹',
        'Hydrofall': '水瀑',
        'Inferno Divide': '十字火法',
        'Inferno Theorem': '散火法',
        'Locked and Loaded': '装填成功',
        'Misload': '装填失败',
        'Near Tide': '圆浪',
        'Pinwheeling Dartboard': '飞镖·焰火·转转转',
        'Planar Tactics': '平面爆雷战术',
        'Pop': '碎裂',
        'Powerful Light': '光爆',
        'Present Box': '礼物箱',
        'Radiance': '光球爆炸',
        'Receding Twintides': '圆浪连潮',
        'Ring a Ring o\' Explosions': '炸弹连连看',
        '(?<! )Roar': '咆哮',
        'Saturate': '喷水',
        'Shocking Abandon': '放纵冲击',
        'Spatial Tactics': '立体爆雷战术',
        'Sphere Shatter': '碎裂',
        'Spring Crystals': '涌水水晶',
        'Strategic Strike': '强击',
        'Strewn Bubbles': '散布气泡',
        'Surprise Balloon': '惊喜气球',
        'Surprise Needle': '惊喜飞针',
        'Symmetric Surge': '双数爆炸',
        'Targeted Light': '高精度光弹',
        'Telluric Theorem': '地隆法',
        'Tidal Roar': '怒潮咆哮',
        'Trapshooting': '陷阱射击',
        'Trick Reload': '花式装填',
        'Trigger Happy': '开心扳机',
        'Uncommon Ground': '盘面攻击',
        'Updraft': '上升气流',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aloalo Golem': '알로알로 나무골렘',
        'Aloalo Islekeeper': '알로알로 섬지킴이',
        'Aloalo Kiwakin': '알로알로 키와킨',
        'Aloalo Monk': '알로알로 문어',
        'Aloalo Ray': '알로알로 줄가오리',
        'Aloalo Snipper': '알로알로 싹둑게',
        'Aloalo Wood Golem': '알로알로 나무골렘',
        'Aloalo Zaratan': '알로알로 자라탄',
        'Arcane Font': '입체마법진',
        'Arcane Globe': '구체마법진',
        'Ball of Fire': '불덩이',
        'Bomb': '폭탄',
        'Ketuduke': '케투두케',
        'Lala': '랄랄',
        'Needle': '바늘',
        'Spring Crystal': '샘물의 크리스탈',
        'Statice': '스타티스',
        'Surprising Claw': '깜짝 손아귀',
        'Surprising Missile': '깜짝 미사일',
        'Surprising Staff': '깜짝 지팡이',
        'The Dawn Trial': '딜루무의 시련',
        'The Dusk Trial': '쿠루페의 시련',
        'The Midnight Trial': '노코세로의 시련',
      },
      'replaceText': {
        '\\(buff\\)': '(디버프)',
        '\\(cast\\)': '(시전)',
        'Aero II': '에어로라',
        'Aero IV': '에어로쟈',
        'Analysis': '분석',
        'Angry Seas': '성난 바다',
        'Angular Addition': '회전각 가산',
        'Arcane Array': '복합 마법 문양',
        'Arcane Blight': '마법 문양포',
        'Arcane Mine': '지뢰 마법 문양',
        'Arcane Plot': '변광 마법 문양',
        'Arcane Point': '변광 기폭',
        'Beguiling Glitter': '환혹의 빛',
        'Blowing Bubbles': '거품 방울',
        'Bright Pulse': '섬광',
        'Bubble Net': '거품 그물 투망',
        'Burning Chains': '화염 사슬',
        'Burst': '산산조각',
        'Constructive Figure': '인형 소환',
        'Dartboard of Dancing Explosives': '다트 돌림판',
        'Encroaching Twintides': '먼바다 연속 풍랑',
        'Explosive Theorem': '마폭법',
        'Faerie Ring': '요정의 고리',
        'Far Tide': '먼바다 풍랑',
        'Fire Spread': '방화',
        'Fireworks': '폭죽 잔치',
        'Fluke Gale': '지느러미 돌풍',
        'Fluke Typhoon': '지느러미 태풍',
        'Hundred Lashings': '마구 때리기',
        'Hydrobomb': '물폭탄',
        'Hydrobullet': '물총알',
        'Hydrofall': '물 쏟기',
        'Inferno Divide': '십자화법',
        'Inferno Theorem': '산화법',
        'Locked and Loaded': '장전 성공',
        'Misload': '장전 실패',
        'Near Tide': '앞바다 풍랑',
        'Pinwheeling Dartboard': '다트 폭죽',
        'Planar Tactics': '폭뢰전술: 평면',
        'Pop': '파열',
        'Powerful Light': '빛의 폭발',
        'Present Box': '선물상자',
        'Radiance': '빛구슬 폭발',
        'Receding Twintides': '앞바다 연속 풍랑',
        'Ring a Ring o\' Explosions': '연결 폭탄',
        '(?<! )Roar': '포효',
        'Saturate': '물 뿜기',
        'Shocking Abandon': '투하 충격',
        'Spatial Tactics': '폭뢰전술: 입체',
        'Sphere Shatter': '파열',
        'Spring Crystals': '샘물의 크리스탈',
        'Strategic Strike': '강력 공격',
        'Strewn Bubbles': '거품 유포',
        'Surprise Balloon': '깜짝 풍선',
        'Surprise Needle': '깜짝 바늘',
        'Symmetric Surge': '대칭 폭격',
        'Targeted Light': '고정밀 광탄',
        'Telluric Theorem': '융기법',
        'Tidal Roar': '바다의 포효',
        'Trapshooting': '함정 사격',
        'Trick Reload': '요술 장전',
        'Trigger Happy': '마구잡이 발사',
        'Uncommon Ground': '그슬린 땅',
        'Updraft': '상승 기류',
      },
    },
  ],
});
