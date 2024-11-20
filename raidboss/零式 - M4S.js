const centerX = 100;
const p2CenterY = 165; // wall-boss platform is south
const replicaCleaveUnsafeMap = {
  'dirN': {
    'left': ['dirNE', 'dirSE'],
    'right': ['dirNW', 'dirSW'],
  },
  'dirE': {
    'left': ['dirSE', 'dirSW'],
    'right': ['dirNW', 'dirNE'],
  },
  'dirS': {
    'left': ['dirSW', 'dirNW'],
    'right': ['dirNE', 'dirSE'],
  },
  'dirW': {
    'left': ['dirNW', 'dirNE'],
    'right': ['dirSE', 'dirSW'],
  },
};
const isCardinalDir = (dir) => {
  return Directions.outputCardinalDir.includes(dir);
};
const phaseMap = {
  '95F2': 'crosstail',
  '9623': 'twilight',
  '9AB9': 'midnight',
  '9622': 'sunrise', // Ion Cluster (because debuffs pre-date the Sunrise Sabbath cast)
};
const swordQuiverSafeMap = {
  '95F9': 'sidesAndBack',
  '95FA': 'frontAndBack',
  '95FB': 'frontAndSides', // back cleave
};
const isSwordQuiverId = (id) => {
  return Object.keys(swordQuiverSafeMap).includes(id);
};
const swordQuiverOutputStrings = {
  frontAndSides: {
    en: 'Go Front / Sides',
    cn: '一二安全',
  },
  frontAndBack: {
    en: 'Go Front / Back',
    cn: '一三安全',
  },
  sidesAndBack: {
    en: 'Go Sides / Back',
    cn: '二三安全',
  },
};
const conductorCurrentStringsNoStrat = {
  remoteCurrent: {
    en: 'Far Cone on You',
    de: 'Fern-Kegel auf DIR',
    fr: 'Cône éloigné sur Vous',
    ja: '自分から遠い人に扇範囲',
    cn: '远雷：目标圈内',
    ko: '원거리 화살표 대상자',
  },
  proximateCurrent: {
    en: 'Near Cone on You',
    de: 'Nah-Kegel auf DIR',
    fr: 'Cône proche sur Vous',
    ja: '自分から近い人に扇範囲',
    cn: '近雷：目标圈内',
    ko: '근거리 화살표 대상자',
  },
  spinningConductorSupport: {
    en: 'Small AoE on You',
    de: 'Kleine AoE auf DIR',
    fr: 'Petite AoE sur Vous',
    ja: '自分に小さい円範囲',
    cn: '小钢铁：TH外D内',
    ko: '작은 원형징 대상자',
  },
  spinningConductorDPS: {
    en: 'Small AoE on You',
    de: 'Kleine AoE auf DIR',
    fr: 'Petite AoE sur Vous',
    ja: '自分に小さい円範囲',
    cn: '小钢铁：TH外D内',
    ko: '작은 원형징 대상자',
  },
  roundhouseConductorSupport: {
    en: 'Donut AoE on You',
    de: 'Donut AoE auf DIR',
    fr: 'Donut sur Vous',
    ja: '自分にドーナツ範囲',
    cn: '月环：TH外D内',
    ko: '도넛징 대상자',
  },
  roundhouseConductorDPS: {
    en: 'Donut AoE on You',
    de: 'Donut AoE auf DIR',
    fr: 'Donut sur Vous',
    ja: '自分にドーナツ範囲',
    cn: '月环：TH外D内',
    ko: '도넛징 대상자',
  },
  colliderConductor: {
    en: 'Get Hit by Cone',
    de: 'Werde vom Kegel getroffen',
    fr: 'Encaissez un cône',
    ja: '扇範囲に当たって',
    cn: '紫圈：目标圈外',
    ko: '화살표 장판 맞기',
  },
};
const handleSportsMeetingsPromise = async (data) => {
  const combatantData = (await callOverlayHandler({
    call: 'getCombatants',
    ids: [data.souma二运塔小怪id],
  })).combatants[0];
  if (combatantData === undefined) {
    throw new Error('promise未找到分身');
  }
  data.souma二运塔小怪 = combatantData;
};
const handleSportsMeetingInfoText = (data) => {
  const kage = data.souma二运塔小怪;
  if (kage === undefined) {
    throw new Error('infoText未找到分身');
  }
  const heading = kage.Heading;
  // N = 0, NE = 1, ..., NW = 7
  const dir = Directions.xyTo8DirNum(kage.PosX, kage.PosY, 100, 165);
  const kageDir = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][dir];
  if (kageDir === undefined) {
    throw new Error('未找到分身朝向');
  }
  const watching = Math.abs(heading);
  let towerPosition;
  if (['N', 'S'].includes(kageDir)) {
    if (watching < 0.2 || watching > 3) {
      towerPosition = '上下';
    } else {
      towerPosition = '左右';
    }
  } else if (['E', 'W'].includes(kageDir)) {
    if (watching < 1.7 && watching > 1.4) {
      towerPosition = '左右';
    } else {
      towerPosition = '上下';
    }
  } else {
    console.error(kage, kageDir, watching);
  }
  if (towerPosition === undefined) {
    throw new Error('未知的塔位置');
  }
  const leaderText = towerPosition === '上下' ? '左右' : '上下';
  if (data.souma二运你干啥 === '引导') {
    // console.log(
    //   data.me,
    //   JSON.parse(JSON.stringify(kage)),
    //   kageDir,
    //   watching,
    //   `${data.souma二运找小怪颜色!}色朝${leaderText}引导`,
    // );
    // return `引${data.souma二运找小怪颜色!}色`;
    return `引${data.souma二运找小怪颜色}色（朝${leaderText}）`;
  }
  // console.log(data.me, JSON.parse(JSON.stringify(kage)), kageDir, watching, `踩${towerPosition}`);
  return `踩塔（${towerPosition}）`;
  // return `踩塔`;
};
Options.Triggers.push({
  id: 'AacLightHeavyweightM4Savage',
  zoneId: ZoneId.AacLightHeavyweightM4Savage,
  // config: [
  // {
  //   id: 'r4s_souma_门神长短分组',
  //   name: {
  //     en: '门神长短buff机制的分组',
  //   },
  //   type: 'select',
  //   options: {
  //     'en': {
  //       'dps左tn右': 'dps左tn右',
  //       'tn左dps右': 'tn左dps右',
  //     },
  //   },
  //   default: 'dps左tn右',
  // },
  // ],
  timelineFile: 'r4s.txt',
  initData: () => {
    return {
      souma门神第一次易伤收集组: { tn: 0, dps: 0 },
      souma4422Count: 0,
      souma长短: '',
      soumahw: '',
      souma分身开始读条: [],
      souma分身武器: [],
      soumaSave: '',
      soumaPhase: 1,
      souma地火: [],
      souma白给机制的分散被打的人id: [],
      souma八人塔: [],
      souma八人塔信息: [],
      souma八人塔结果上次: '',
      souma八人塔结果第几次: 1,
      souma在二运: false,
      souma二运塔小怪id: 0,
      souma门神紫色buff: [],
      soumaB9a: [],
      souma门神第一次易伤是dps: false,
      souma门神紫色小东西: [],
      souma门神二二还是八人: undefined,
      souma门神找不到北机制: [],
      souma门神找不到北机制offset: 0,
      souma门神找不到北机制当前第几轮: 0,
      souma本体二运武器: [],
      seenConductorDebuffs: false,
      fulminousFieldCount: 0,
      conductionPointTargets: [],
      soumaClonesActors: [],
      phase: 'door',
      replicaCleaveCount: 0,
      replicas: {},
      twilightSafeFirst: Directions.outputIntercardDir,
      twilightSafeSecond: Directions.outputIntercardDir,
    };
  },
  timelineTriggers: [
    {
      id: 'R4S Soulshock',
      regex: /Soulshock/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    {
      id: 'R4S Sunrise Sabbath Cannon Color Collect',
      type: 'GainsEffect',
      // 2F4 = yellow cannnon, 2F5 = blue cannon
      netRegex: { effectId: 'B9A', count: ['2F4', '2F5'] },
      condition: (data) => data.phase === 'sunrise',
      run: (data, matches) => {
        const id = matches.targetId;
        const color = matches.count === '2F4' ? 'yellow' : 'blue';
        (data.replicas[id] ??= {}).cannonColor = color;
      },
    },
    {
      id: 'R4S Replica ActorSetPos Data Collect',
      type: 'ActorSetPos',
      netRegex: { id: '4.{7}' },
      condition: (data) => data.phase !== 'door',
      run: (data, matches) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        const hdg = parseFloat(matches.heading);
        const locDir = Directions.xyTo8DirOutput(x, y, centerX, p2CenterY);
        (data.replicas[matches.id] ??= {}).location = locDir;
        // Determining the facing for clones on cardinals using 4Dir could get a little messy -
        // e.g., a NW-facing clone could result in a value of N or W depending on pixels/rounding.
        // To be safe, use the full 8-dir compass, and then adjust based on the clone's position
        // Note: We only care about heading for clones on cardinals during Sunrise Sabbath
        const hdgDir = Directions.outputFrom8DirNum(Directions.hdgTo8DirNum(hdg));
        if (isCardinalDir(locDir))
          (data.replicas[matches.id] ??= {}).cardinalFacing = isCardinalDir(hdgDir)
            ? 'opposite'
            : 'adjacent';
      },
    },
    {
      id: 'R4S Phase Tracker',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(phaseMap) },
      suppressSeconds: 1,
      run: (data, matches) => {
        const phase = phaseMap[matches.id];
        if (phase === undefined)
          throw new UnreachableCode();
        data.phase = phase;
      },
    },
    {
      id: 'R4S Souma Betwitching Flight Burst',
      type: 'StartsUsingExtra',
      netRegex: { id: '95EA' },
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const x = parseFloat(matches.x);
        data.soumaBewitchingBurstSafe = (x > 110 || x < 90) ? 'in' : 'out';
        return output[data.soumaBewitchingBurstSafe]();
      },
      outputStrings: {
        in: { en: '内' },
        out: { en: '外' },
      },
    },
    {
      id: 'R4S Souma 门神第一次易伤',
      type: 'GainsEffect',
      netRegex: { effectId: '24B' },
      preRun: (data, matches) => {
        data.souma门神第一次易伤收集组[data.party.isDPS(matches.target) ? 'dps' : 'tn']++;
      },
    },
    {
      id: 'R4S Souma 门神六根山buff',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: ['2F6', '2F7'] },
      preRun: (data, matches) => {
        const gimmick = matches.count === '2F6' ? 'near' : 'far';
        data.soumaB9a.push(gimmick);
      },
    },
    {
      id: 'R4S Souma 门神连线紫色小东西',
      type: 'AbilityExtra',
      netRegex: { 'id': '95C7' },
      run: (data, matches) => {
        // N = 0, NE = 1, ..., NW = 7
        const dir = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        // 7  1
        // 5  3
        const dirText = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][dir];
        if (dirText === undefined) {
          throw new Error('未知的朝向');
        }
        data.souma门神紫色小东西.push(dirText);
      },
    },
    {
      id: 'R4S Souma 门神二二还是八人',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: ['2F0', '2F1'] },
      preRun: (data, matches) => {
        const gimmick = matches.count === '2F1' ? 'spread' : 'stack';
        data.souma门神二二还是八人 = gimmick;
      },
    },
    {
      id: 'R4S Souma 门神第一次六根山处理',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: ['2F6', '2F7'] },
      condition: (data) => {
        return data.soumaPhase === 1 && data.soumaB9a.length === 1;
      },
      response: (data, _matches, output) => {
        const handle = data.soumaB9a[0];
        const dontHandle = handle === 'near' ? 'far' : 'near';
        const playerIsDps = data.party.isDPS(data.me);
        const handlerIsDps = !(data.souma门神第一次易伤收集组.dps > data.souma门神第一次易伤收集组.tn);
        if (playerIsDps === handlerIsDps) {
          return {
            alertText: output.text({ nearFar: output[handle](), method: output.handler() }),
          };
        }
        return {
          infoText: output.text({ nearFar: output[dontHandle](), method: output.avoid() }),
        };
      },
      outputStrings: {
        near: { en: '近' },
        far: { en: '远' },
        handler: { en: '引导' },
        avoid: { en: '躲避' },
        text: { en: '${nearFar}${method}' },
      },
    },
    {
      id: 'R4S Souma 门神紫色buff',
      type: 'GainsEffect',
      netRegex: { effectId: 'B7C' },
      preRun: (data, matches) => {
        data.souma门神紫色buff.push(matches.target);
      },
    },
    {
      id: 'R4S Souma 门神AoE',
      type: 'StartsUsing',
      netRegex: { id: '95EF' },
      response: Responses.bigAoe(),
    },
    {
      id: 'R4S Souma 3 门神钢铁月环',
      type: 'StartsUsing',
      netRegex: { id: ['95E0', '95E1'] },
      delaySeconds: 0.5,
      durationSeconds: 26,
      response: (data, matches, output) => {
        const gimmick = matches.id === '95E0' ? 'iron' : 'lunar';
        const tts = output[`${gimmick}First`]();
        if (data.soumaB9a[1] === undefined) {
          throw new Error('未找到第二个B9A');
        }
        const start = data.soumaB9a[1];
        const getOtherNearFar = (start) => {
          if (start === 'near') {
            return 'far';
          }
          return 'near';
        };
        const getOtherGimmick = (start) => {
          if (start === 'iron') {
            return 'lunar';
          }
          return 'iron';
        };
        const nearFar4 = [start, getOtherNearFar(start), start, getOtherNearFar(start)].map((v) =>
          output[v]()
        );
        const gimmick4 = [gimmick, getOtherGimmick(gimmick), gimmick, getOtherGimmick(gimmick)].map(
          (v) => output[v](),
        );
        const infoText = gimmick4.map((v, i) =>
          `${output.set({ gimmick: v, nearFar: nearFar4[i] })}`
        ).join(' => ');
        return {
          infoText: infoText,
          tts: tts,
        };
      },
      outputStrings: {
        ironFirst: { en: '先钢铁' },
        lunarFirst: { en: '先月环' },
        iron: { en: '钢' },
        lunar: { en: '月' },
        near: { en: '近' },
        far: { en: '远' },
        set: { en: '${gimmick}引${nearFar}' },
      },
    },
    {
      id: 'R4S Souma 门神半场刀',
      type: 'StartsUsing',
      netRegex: { id: ['95EC', '95ED'] },
      delaySeconds: 0.5,
      durationSeconds: 15,
      infoText: (data, matches, output) => {
        if (data.souma门神二二还是八人 === undefined) {
          console.error('未找到门神二二还是八人');
          if (matches.id === '95EC') {
            return output.goLeft();
          }
          return output.goRight();
        }
        if (data.souma门神紫色小东西.length > 0) {
          const thunders = data.souma门神紫色小东西.slice();
          const statistics = thunders.reduce((acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
          }, {});
          const safe2 = Object.entries(statistics).filter((v) => v[1] === 1).map((v) => v[0]);
          const safeHalf = matches.id === '95EC' ? ['NW', 'SW'] : ['NE', 'SE'];
          const safe1 = safe2.find((v) => safeHalf.includes(v));
          if (safe1 === undefined) {
            console.error('未找到安全角度');
            if (matches.id === '95EC') {
              return output.goLeft();
            }
            return output.goRight();
          }
          const result = output.text({
            dir: output[safe1](),
            pos: '',
            gimmick: output[data.souma门神二二还是八人](),
          });
          return result;
        }
        if (data.souma门神第二次展开位置 === undefined) {
          console.error('未找到门神第二次展开位置');
          return output.text({
            dir: matches.id === '95EC' ? output.goLeft() : output.goRight(),
            pos: '',
            gimmick: output[data.souma门神二二还是八人](),
          });
        }
        return output.text({
          dir: matches.id === '95EC' ? output.goLeft() : output.goRight(),
          pos: data.souma门神二二还是八人 === 'spread' ? '' : output[data.souma门神第二次展开位置](),
          gimmick: output[data.souma门神二二还是八人](),
        });
      },
      run: (data) => {
        data.souma门神紫色小东西.length = 0;
        data.souma门神二二还是八人 = undefined;
      },
      outputStrings: {
        goLeft: Outputs.left,
        goRight: Outputs.right,
        NE: Outputs.northeast,
        NW: Outputs.northwest,
        SE: Outputs.southeast,
        SW: Outputs.southwest,
        text: { en: '${dir} + ${pos}${gimmick}' },
        spread: { en: '散开' },
        stack: { en: '二二分摊' },
        短少tn: { en: '上（A点）' },
        长少tn: { en: '上（A点）' },
        短多dps: { en: '脚下' },
        长多dps: { en: '脚下' },
        短多tn: { en: '侧边' },
        长多tn: { en: '侧边' },
        短少dps: { en: '下（C点）' },
        长少dps: { en: '下（C点）' },
      },
    },
    {
      id: 'R4S Souma 门神找不到北机制',
      type: 'StartsUsingExtra',
      netRegex: { id: '95CF' },
      preRun: (data, matches) => {
        data.souma门神找不到北机制.push(matches);
      },
    },
    {
      id: 'R4S Souma 门神找不到北机制结算',
      type: 'StartsUsingExtra',
      netRegex: { id: '95CF' },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.souma门神找不到北机制.length % 12 === 0) {
          data.souma门神找不到北机制当前第几轮++;
          const arr = data.souma门神找不到北机制.splice(0, 12);
          arr.sort((a, b) => {
            if (a.x === b.x) {
              return parseFloat(a.y) - parseFloat(b.y);
            }
            return parseFloat(a.x) - parseFloat(b.x);
          });
          const headPos = [
            { x: 100.009, y: 79.989, dir: 0 },
            { x: 116.001, y: 96.011, dir: 2 },
            { x: 100.009, y: 112.003, dir: 4 },
            { x: 83.987, y: 96.011, dir: 6 }, // D
          ];
          const getDir = () => {
            for (let i = 0; i < arr.length; i++) {
              const a = arr[i];
              for (let j = 0; j < headPos.length; j++) {
                const h = headPos[j];
                if (Math.abs(h.x - parseFloat(a.x)) < 1 && Math.abs(h.y - parseFloat(a.y)) < 1) {
                  return h.dir;
                }
              }
            }
          };
          const dir = getDir();
          if (dir === undefined) {
            throw new Error('未找到北机制');
          }
          const dirText = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][dir];
          const safeZone = {
            'N': 'S',
            'S': 'N',
            'W': 'E',
            'E': 'W',
            'NE': 'SW',
            'NW': 'SE',
            'SE': 'NW',
            'SW': 'NE',
          }[dirText];
          const roundNow = data.souma门神找不到北机制当前第几轮;
          const roundGo = data.souma长短 === '短' ? 1 : 2;
          const isYourTurn = roundNow === roundGo;
          const clock = data.role === 'dps' ? 1 : -1;
          const turnDir = ((dir + data.souma门神找不到北机制offset * clock) + 8) % 8;
          const turnDirText = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][turnDir];
          const final = isYourTurn ? turnDirText : safeZone;
          const gimmick = isYourTurn ? output.spread() : output.getTogether();
          const resultDir = output[final]();
          const result = output.text({ dir: resultDir, gimmick: gimmick });
          return result;
        }
        data.souma门神找不到北机制.length = 0;
      },
      outputStrings: {
        N: { en: '北(A点)' },
        E: { en: '东(B点)' },
        W: { en: '西(D点)' },
        S: { en: '南(C点)' },
        NE: { en: '东北(2点外)' },
        NW: { en: '西北(1点外)' },
        SE: { en: '东南(3点外)' },
        SW: { en: '西南(4点外)' },
        text: { en: '${dir}${gimmick}' },
        spread: { en: '放圈' },
        getTogether: Outputs.getTogether,
      },
    },
    // FA0 黄色buff
    // FA1 蓝色buff
    // FA3 HW近
    // FA2 HW远
    // FA6 毒buff（负责引导）
    // FA4 钢铁
    // {
    //   id: 'R4S Souma 钢铁',
    //   type: 'GainsEffect',
    //   netRegex: { effectId: 'FA4' },
    //   condition: Conditions.targetIsYou(),
    //   infoText: (_data, _matches, output) => {
    //     return output.text!();
    //   },
    //   outputStrings: { text: { en: '小钢铁' } },
    // },
    // {
    //   id: 'R4S Souma 月环',
    //   type: 'GainsEffect',
    //   netRegex: { effectId: 'FA5' },
    //   condition: Conditions.targetIsYou(),
    //   infoText: (_data, _matches, output) => {
    //     return output.text!();
    //   },
    //   outputStrings: { text: { en: '月环' } },
    // },
    // {
    //   id: 'R4S Souma 毒buff',
    //   type: 'GainsEffect',
    //   netRegex: { effectId: 'FA6' },
    //   condition: Conditions.targetIsYou(),
    //   delaySeconds: 0.5,
    //   suppressSeconds: 1,
    //   infoText: (data, _matches, output) => {
    //     if (data.soumahw === '近') {
    //       return output.near!();
    //     }
    //     if (data.soumahw === '远') {
    //       return output.far!();
    //     }
    //     return output.text!();
    //   },
    //   outputStrings: {
    //     text: { en: '引导' },
    //     near: { en: '引导(近)' },
    //     far: { en: '引导(远)' },
    //   },
    // },
    // {
    //   id: 'R4S Souma HW近',
    //   type: 'GainsEffect',
    //   netRegex: { effectId: 'FA3' },
    //   preRun: (data) => {
    //     data.soumahw = '近';
    //   },
    //   infoText: (data, matches, output) => {
    //     if (data.me === matches.target) {
    //       return output.text!();
    //     }
    //   },
    //   outputStrings: { text: { en: 'HW近' } },
    // },
    // {
    //   id: 'R4S Souma HW远',
    //   type: 'GainsEffect',
    //   netRegex: { effectId: 'FA2' },
    //   preRun: (data) => {
    //     data.soumahw = '远';
    //   },
    //   infoText: (data, matches, output) => {
    //     if (data.me === matches.target) {
    //       return output.text!();
    //     }
    //   },
    //   outputStrings: { text: { en: 'HW远' } },
    // },
    {
      id: 'R4S Souma 22/42',
      type: 'GainsEffect',
      netRegex: { effectId: 'F9F' },
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => {
        if (Number(matches.duration) > 40) {
          data.souma长短 = '长';
          return output.long();
        }
        data.souma长短 = '短';
        return output.short();
      },
      outputStrings: {
        long: { en: '长' },
        short: { en: '短' },
      },
    },
    {
      id: 'R4S Souma 42/22 Ability',
      type: 'Ability',
      netRegex: { id: '9786' },
      condition: Conditions.targetIsYou(),
      preRun: (data) => {
        data.souma4422Count++;
      },
      infoText: (data, _matches, output) => {
        return output.text({ count: data.souma4422Count });
      },
      outputStrings: {
        text: { en: '${count}' },
      },
    },
    {
      id: 'R4S Souma Wicked Thunder',
      type: 'StartsUsing',
      netRegex: { id: '95CE' },
      durationSeconds: 40,
      infoText: (data, _matches, output) => {
        const role = data.role === 'dps' ? 'dps' : 'tn';
        if (data.souma长短 === '长') {
          if (data.souma4422Count === 1) {
            data.souma门神找不到北机制offset = 3;
            data.souma门神第二次展开位置 = `长少${role}`;
          }
          if (data.souma4422Count === 2) {
            data.souma门神找不到北机制offset = 1;
            data.souma门神第二次展开位置 = `长多${role}`;
          }
        } else if (data.souma长短 === '短') {
          if (data.souma4422Count === 2) {
            data.souma门神找不到北机制offset = 3;
            data.souma门神第二次展开位置 = `短少${role}`;
          }
          if (data.souma4422Count === 3) {
            data.souma门神找不到北机制offset = 1;
            data.souma门神第二次展开位置 = `短多${role}`;
          }
        }
        if (data.souma门神第二次展开位置 === undefined) {
          throw new Error('不存在第二次展开位置');
        }
        return output[data.souma门神第二次展开位置]();
      },
      outputStrings: {
        短多dps: { en: '短3：梯形右上 => 半场刀 => 缺口集合' },
        短少dps: { en: '短2：梯形右下 => 半场刀 => 缺口集合' },
        短多tn: { en: '短3：梯形左上 => 半场刀 => 缺口集合' },
        短少tn: { en: '短2：梯形左下 => 半场刀 => 缺口集合' },
        长多dps: { en: '长3：缺口集合 => 半场刀 => 梯形右上' },
        长少dps: { en: '长2：缺口集合 => 半场刀 => 梯形右下' },
        长多tn: { en: '长3：缺口集合 => 半场刀 => 梯形左上' },
        长少tn: { en: '长2：缺口集合 => 半场刀 => 梯形左下' }, // 长1
      },
    },
    {
      id: 'R4S Souma 门神颜色',
      type: 'GainsEffect',
      netRegex: { effectId: ['FA0', 'FA1'] },
      condition: (data, matches) => {
        return data.me === matches.target && data.soumaPhase === 1;
      },
      run: (data, matches) => {
        const color = matches.effectId === 'FA0' ? '黄' : '蓝';
        data.souma门神颜色 = color;
      },
    },
    {
      id: 'R4S Souma 门神的大炮',
      type: 'AbilityExtra',
      netRegex: { id: '95D[23]' },
      infoText: (_data, matches, output) => {
        if (matches.id === '95D3') {
          return output.left();
        }
        return output.right();
      },
      outputStrings: {
        left: { en: '<- 左' },
        right: { en: '右 ->' },
      },
    },
    {
      id: 'R4S Conductor/Current Debuffs',
      type: 'GainsEffect',
      netRegex: { effectId: ['FA2', 'FA3', 'FA4', 'FA5', 'FA6'] },
      condition: Conditions.targetIsYou(),
      durationSeconds: 5,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = conductorCurrentStringsNoStrat;
        switch (matches.effectId) {
          case 'FA2':
            return { alertText: output.remoteCurrent() };
          case 'FA3':
            return { alertText: output.proximateCurrent() };
          case 'FA4':
            if (data.role === 'tank' || data.role === 'healer')
              return { alertText: output.spinningConductorSupport() };
            return { alertText: output.spinningConductorDPS() };
          case 'FA5':
            if (data.role === 'tank' || data.role === 'healer')
              return { alertText: output.roundhouseConductorSupport() };
            return { alertText: output.roundhouseConductorDPS() };
          case 'FA6':
            return { alertText: output.colliderConductor() };
        }
      },
      run: (data) => data.seenConductorDebuffs = true,
    },
    {
      id: 'R4S Electron Stream Debuff',
      type: 'GainsEffect',
      // FA0 - Positron (Yellow), blue safe
      // FA1 - Negatron (Blue), yellow safe
      netRegex: { effectId: ['FA0', 'FA1'] },
      condition: (data, matches) => data.me === matches.target && data.soumaPhase === 1,
      run: (data, matches) =>
        data.electronStreamSafe = matches.effectId === 'FA0' ? 'blue' : 'yellow',
    },
    {
      id: 'R4S Electron Stream Initial',
      type: 'StartsUsing',
      // 95D6 - Yellow cannon north, Blue cannnon south
      // 95D7 - Blue cannon north, Yellow cannon south
      netRegex: { id: ['95D6', '95D7'] },
      condition: (data) => !data.seenConductorDebuffs,
      alertText: (data, matches, output) => {
        if (data.electronStreamSafe === 'yellow')
          data.electronStreamSide = matches.id === '95D6' ? 'north' : 'south';
        else if (data.electronStreamSafe === 'blue')
          data.electronStreamSide = matches.id === '95D6' ? 'south' : 'north';
        const safeDir = data.electronStreamSide ?? 'unknown';
        if (data.role === 'tank')
          return output.tank({ dir: output[safeDir]() });
        return output.nonTank({ dir: output[safeDir]() });
      },
      outputStrings: {
        north: Outputs.north,
        south: Outputs.south,
        unknown: Outputs.unknown,
        tank: {
          en: '${dir} - Be in Front',
          cn: '${dir} - 站在最前',
        },
        nonTank: {
          en: '${dir} - Behind Tank',
          cn: '${dir} - 站在T后面',
        },
      },
    },
    {
      id: 'R4S Electron Stream Subsequent',
      type: 'StartsUsing',
      // 95D6 - Yellow cannon north, Blue cannnon south
      // 95D7 - Blue cannon north, Yellow cannon south
      netRegex: { id: ['95D6', '95D7'] },
      condition: (data) => data.seenConductorDebuffs,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          swap: {
            en: 'Swap Sides',
            cn: '交换场地',
          },
          stay: {
            en: 'Stay',
            cn: '不动',
          },
          unknown: Outputs.unknown,
          tank: {
            en: '${dir} - Be in Front',
            cn: '${dir} - 站在最前',
          },
          nonTank: {
            en: '${dir} - Behind Tank',
            cn: '${dir} - 站在T后面',
          },
        };
        let safeSide = 'unknown';
        let dir = 'unknown';
        if (data.electronStreamSafe === 'yellow')
          safeSide = matches.id === '95D6' ? 'north' : 'south';
        else if (data.electronStreamSafe === 'blue')
          safeSide = matches.id === '95D6' ? 'south' : 'north';
        if (safeSide !== 'unknown') {
          dir = safeSide === data.electronStreamSide ? 'stay' : 'swap';
          data.electronStreamSide = safeSide; // for the next comparison
        }
        const text = data.role === 'tank'
          ? output.tank({ dir: output[dir]() })
          : output.nonTank({ dir: output[dir]() });
        if (dir === 'stay')
          return { infoText: text };
        return { alertText: text };
      },
    },
    {
      id: 'R4S Souma 门神连续分摊',
      type: 'StartsUsing',
      netRegex: { id: '92C2' },
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '连续分摊（5次）' },
      },
    },
    {
      id: 'R4S Souma Wicked Jolt Tankbuster',
      type: 'StartsUsing',
      netRegex: { id: '95F0' },
      response: Responses.tankBusterSwap(),
    },
    // 水波阶段
    // Fulminous Field
    {
      id: 'R4S Fulminous Field',
      type: 'Ability',
      netRegex: { id: '98D3', capture: false },
      infoText: (_data, _matches, output) => output.dodge(),
      outputStrings: {
        dodge: {
          en: 'Dodge w/Partner x7',
          de: 'mit Partner ausweichen x7',
          fr: 'Esquivez avec votre partenaire x7',
          ja: '相方と避ける x7',
          cn: '与搭档躲避 7 次扇形',
        },
      },
    },
    {
      id: 'R4S Fulminous Field Spread',
      type: 'Ability',
      // 90FE = initial hit, 98CD = followup hits (x6)
      netRegex: { id: ['90FE', '98CD'] },
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        if (matches.id === '90FE')
          data.fulminousFieldCount = 1;
        else
          data.fulminousFieldCount++;
        if (data.fulminousFieldCount === 4)
          return output.spread();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'R4S Conduction Point Collect',
      type: 'Ability',
      netRegex: { id: '98CE' },
      run: (data, matches) => data.conductionPointTargets.push(matches.target),
    },
    {
      id: 'R4S Forked Fissures',
      type: 'Ability',
      netRegex: { id: '98CE', capture: false },
      delaySeconds: 0.2,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.conductionPointTargets.includes(data.me))
          return output.far();
        return output.near();
      },
      run: (data) => data.conductionPointTargets = [],
      outputStrings: {
        near: {
          en: 'In Front of Partner',
          de: 'Sei vor deinem Partner',
          fr: 'Devant votre partenaire',
          ja: '相方の前へ',
          cn: '挡在前面',
        },
        far: {
          en: 'Behind Partner',
          de: 'Sei hinter deinem Partner',
          fr: 'Derrière votre partenaire',
          ja: '相方の後ろへ',
          cn: '躲到身后',
        },
      },
    },
    // 本体
    {
      id: 'R4S Souma 本体第一个AoE（交叉尾特技）',
      type: 'StartsUsing',
      netRegex: { id: '95F2' },
      run: (data) => data.soumaPhase = 2,
    },
    {
      id: 'R4S Cross Tail Switch',
      type: 'StartsUsing',
      netRegex: { id: '95F2', capture: false },
      delaySeconds: (data) => data.role === 'tank' ? 3 : 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          lb3: {
            en: 'LB3!',
            de: 'LB3!',
            fr: 'Transcendance !',
            ja: 'タンク LB3!',
            cn: '坦克 LB!',
          },
        };
        if (data.role === 'tank')
          return { alarmText: output.lb3() };
        return Responses.bigAoe();
      },
    },
    {
      id: 'R4S Wicked Blaze',
      type: 'HeadMarker',
      netRegex: { id: '013C', capture: false },
      condition: (data) => data.soumaPhase === 2,
      suppressSeconds: 999,
      infoText: (_data, _matches, output) => output.stacks(),
      outputStrings: {
        stacks: Outputs.healerGroups,
      },
    },
    {
      id: 'R4S Wicked Fire',
      type: 'StartsUsing',
      disabled: true,
      netRegex: { id: '9630', capture: false },
      infoText: (_data, _matches, output) => output.bait(),
      outputStrings: {
        bait: { en: '集合放圈' },
      },
    },
    {
      id: 'R4S Souma 本体1',
      type: 'StartsUsing',
      netRegex: { id: '9610' },
      durationSeconds: 4,
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '去两侧' },
      },
    },
    {
      id: 'R4S Souma 本体去两侧BBB',
      type: 'StartsUsing',
      netRegex: { id: '9614' },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '八人塔站位' },
      },
    },
    {
      id: 'R4S Souma 本体3Aoe',
      type: 'StartsUsing',
      netRegex: { id: '962F' },
      response: Responses.aoe(),
    },
    {
      id: 'R4S Souma 本体3Aoe2',
      type: 'StartsUsing',
      netRegex: { id: '949B' },
      response: Responses.bigAoe(),
    },
    {
      id: 'R4S Souma 本体去中间',
      type: 'StartsUsing',
      netRegex: { id: '9612' },
      durationSeconds: 4,
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '去中间' },
      },
    },
    {
      id: 'R4S Souma 本体白给接线',
      type: 'StartsUsing',
      netRegex: { id: '961E' },
      durationSeconds: 4,
      infoText: (data, _matches, output) => {
        if (data.role === 'tank') {
          return output.tank();
        }
        return output.other();
      },
      outputStrings: {
        tank: { en: '接线 => 散开' },
        other: { en: '送线 => 散开' },
      },
    },
    {
      id: 'R4S Souma 本体白给接线爆炸',
      type: 'Ability',
      netRegex: { id: '9620' },
      preRun: (data, matches) => {
        data.souma白给机制的分散被打的人id.push(matches.target);
      },
      infoText: (data, _matches, output) => {
        if (data.souma白给机制的分散被打的人id.length === 4) {
          const arr = data.souma白给机制的分散被打的人id.slice();
          data.souma白给机制的分散被打的人id.length = 0;
          if (data.role === 'tank') {
            return output.tank();
          }
          if (!arr.includes(data.me)) {
            const partner = data.party.details.find((v) =>
              !arr.includes(v.name) && v.name !== data.me && !data.party.isTank(v.name)
            )?.name;
            if (partner === undefined) {
              throw new Error('找不到配队人');
            }
            return output.other({ partner: data.party.member(partner).toString() });
          }
          const handlers = data.party.details.filter((v) =>
            !arr.includes(v.name) && v.name !== data.me && !data.party.isTank(v.name)
          );
          return handlers.map((v) => data.party.member(v.name)).join('、');
        }
      },
      outputStrings: {
        tank: { en: '传毒' },
        other: { en: '与${partner}找坦克接毒 => 散开' },
      },
    },
    {
      id: 'R4S Souma 本体储存击退1',
      type: 'StartsUsing',
      netRegex: { id: '9603' },
      infoText: (data, _matches, output) => {
        const text = '左击退 => 右击退';
        data.soumaSave = text;
        return output.text({ text });
      },
      outputStrings: {
        text: { en: '储存击退（${text}）' },
      },
    },
    {
      id: 'R4S Souma 本体储存击退2',
      type: 'StartsUsing',
      netRegex: { id: '9605' },
      infoText: (data, _matches, output) => {
        const text = '右击退 => 左击退';
        data.soumaSave = text;
        return output.text({ text });
      },
      outputStrings: {
        text: { en: '储存击退（${text}）' },
      },
    },
    {
      id: 'R4S Souma 本体储存大钢铁1',
      type: 'StartsUsing',
      netRegex: { id: '9602' },
      infoText: (data, _matches, output) => {
        const text = '右上起跑 => 穿左上';
        data.soumaSave = text;
        return output.text({ text });
      },
      outputStrings: {
        text: { en: '储存钢铁（${text}）' },
      },
    },
    {
      id: 'R4S Souma 本体储存大钢铁2',
      type: 'StartsUsing',
      netRegex: { id: '9604' },
      infoText: (data, _matches, output) => {
        const text = '左上起跑 => 穿右上';
        data.soumaSave = text;
        return output.text({ text });
      },
      outputStrings: {
        text: { en: '储存钢铁（${text}）' },
      },
    },
    {
      id: 'R4S Souma 本体释放钢铁1',
      type: 'StartsUsing',
      netRegex: { id: '9606' },
      durationSeconds: 8,
      alarmText: (data, _matches, output) => {
        data.souma在二运 = false;
        return output.text({ text: data.soumaSave });
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Souma 本体释放钢铁2',
      type: 'StartsUsing',
      netRegex: { id: '9608' },
      durationSeconds: 8,
      alarmText: (data, _matches, output) => {
        data.souma在二运 = false;
        return output.text({ text: data.soumaSave });
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Souma 本体释放击退1',
      type: 'StartsUsing',
      netRegex: { id: '9607' },
      durationSeconds: 8,
      alarmText: (data, _matches, output) => {
        data.souma在二运 = false;
        return output.text({ text: data.soumaSave });
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Souma 本体释放击退2',
      type: 'StartsUsing',
      netRegex: { id: '9609' },
      durationSeconds: 8,
      alarmText: (data, _matches, output) => {
        data.souma在二运 = false;
        return output.text({ text: data.soumaSave });
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Twilight Sabbath Sidewise Spark',
      type: 'ActorControlExtra',
      // category: 0197 - PlayActionTimeline
      // param1: 11D6 - first,  right cleave
      // param1: 11D7 - second, right cleave
      // param1: 11D8 - first,  left cleave
      // param1: 11D9 - second, left cleave
      netRegex: { category: '0197', param1: ['11D6', '11D7', '11D8', '11D9'] },
      condition: (data) => data.phase === 'twilight',
      // delay 0.1s to prevent out-of-order line issues
      delaySeconds: 0.1,
      durationSeconds: 9,
      alertText: (data, matches, output) => {
        data.replicaCleaveCount++;
        const dir = data.replicas[matches.id]?.location;
        if (dir === undefined || !isCardinalDir(dir))
          return;
        const cleaveDir = ['11D6', '11D7'].includes(matches.param1) ? 'right' : 'left';
        const unsafeDirs = replicaCleaveUnsafeMap[dir][cleaveDir];
        const firstSet = ['11D6', '11D8'].includes(matches.param1);
        if (firstSet) {
          data.twilightSafeFirst = data.twilightSafeFirst.filter((d) => !unsafeDirs.includes(d));
        } else {
          data.twilightSafeSecond = data.twilightSafeSecond.filter((d) => !unsafeDirs.includes(d));
        }
        // Once we have all four accounted for, set our second spot for use in Wicked Special combo,
        // and then return our first safe spot
        if (data.replicaCleaveCount !== 4)
          return;
        const [safeSecond] = data.twilightSafeSecond;
        data.secondTwilightCleaveSafe = safeSecond;
        if (data.secondTwilightCleaveSafe === undefined) {
          data.secondTwilightCleaveSafe = 'unknown';
        }
        const [safeFirst] = data.twilightSafeFirst;
        // If we couldn't find the first safe spot, at least remind players to bait puddles
        if (safeFirst === undefined)
          return output.bait();
        return output.combo({
          bait: output.bait(),
          dir1: output[safeFirst](),
          dir2: output[data.secondTwilightCleaveSafe](),
        });
      },
      run: (data) => {
        if (data.replicaCleaveCount !== 4)
          return;
        data.replicaCleaveCount = 0;
        data.twilightSafeFirst = Directions.outputIntercardDir;
        data.twilightSafeSecond = Directions.outputIntercardDir;
      },
      outputStrings: {
        ...Directions.outputStringsIntercardDir,
        bait: Outputs.baitPuddles,
        combo: {
          en: '${bait} => ${dir1} => ${dir2}',
          de: '${bait} => ${dir1} => ${dir2}',
          fr: '${bait} => ${dir1} => ${dir2}',
          ja: '${bait} => ${dir1} => ${dir2}',
          cn: '${bait} => ${dir1} => ${dir2}',
          ko: '${bait} => ${dir1} => ${dir2}',
        },
      },
    },
    {
      id: 'R4S Souma 分身的武器刀收集者',
      type: 'GainsEffect',
      netRegex: { effectId: '808' },
      preRun: (data, matches) => {
        data.souma分身开始读条.push(matches);
      },
      durationSeconds: 4,
      infoText: (data, _matches, output) => {
        if (data.souma分身开始读条.length === 2) {
          const ids = data.souma分身开始读条.splice(0, 2).map((v) => v.targetId);
          const weapons = data.souma分身武器.slice();
          const clones = weapons.filter((v) => ids.includes(v.id)).map((v) => ({
            position: v.position,
            knife: v.knife,
          }));
          if (clones.length !== 2) {
            throw new Error('clones length is not 2');
          }
          const safe = {
            '左-右刀': '上',
            '右-左刀': '上',
            '左-左刀': '下',
            '右-右刀': '下',
            '上-左刀': '左',
            '下-右刀': '左',
            '上-右刀': '右',
            '下-左刀': '右',
          };
          const key1 = `${clones[0].position}-${clones[0].knife}`;
          const key2 = `${clones[1].position}-${clones[1].knife}`;
          const result1 = safe[key1];
          const result2 = safe[key2];
          const sortKey = ['左', '右', '上', '下'];
          const resultString = [result1, result2].sort((a, b) => {
            return sortKey.indexOf(a) - sortKey.indexOf(b);
          }).join('');
          return output.text({ text: resultString });
        }
        return '';
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Souma 分身的武器刀结束',
      type: 'GainsEffect',
      netRegex: { effectId: '808' },
      delaySeconds: 20,
      run: (data) => {
        data.souma分身开始读条.length = 0;
        data.souma分身武器.length = 0;
      },
    },
    {
      id: 'R4S Souma Clone Cleave Collector',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        pair: [{ key: 'WeaponId', value: ['33', '121'] }],
        capture: true,
      },
      run: (data, matches) => {
        const { pairHeading, pairWeaponId, pairPosX, pairPosY, id } = matches;
        if (pairHeading === undefined) {
          throw new Error('pairHeading is null');
        }
        if (pairPosX === undefined) {
          throw new Error('pairPosX is null');
        }
        if (pairPosY === undefined) {
          throw new Error('pairPosY is null');
        }
        if (pairWeaponId === undefined) {
          throw new Error('pairWeaponId is null');
        }
        if (id === undefined) {
          throw new Error('id is null');
        }
        const x = Number.parseFloat(pairPosX);
        const y = Number.parseFloat(pairPosY);
        const knife = pairWeaponId === '121' ? '左刀' : '右刀';
        if (data.souma分身武器.find((v) => v.id === id)) {
          return;
        }
        if (x < 95) {
          data.souma分身武器.push({
            id: id,
            position: '左',
            knife: knife,
          });
        } else if (x > 105) {
          data.souma分身武器.push({
            id: id,
            position: '右',
            knife: knife,
          });
        } else if (y < 170) {
          data.souma分身武器.push({
            id: id,
            position: '上',
            knife: knife,
          });
        } else if (y > 170) {
          data.souma分身武器.push({
            id: id,
            position: '下',
            knife: knife,
          });
        }
      },
    },
    // 夜半
    {
      id: 'R4S Souma 夜半 1',
      type: 'ActorControlExtra',
      netRegex: {
        category: '0197',
        param1: ['11D1', '11D2', '11D3', '11D4'],
      },
      condition: (data) => data.soumaPhase === 2,
      run: (data, matches) => {
        data.soumaClonesActors.push({ id: matches.id, param1: matches.param1 });
      },
    },
    {
      id: 'R4S Souma 夜半 2',
      type: 'StartsUsing',
      netRegex: { id: ['962C', '962B'] },
      condition: (data) => data.soumaPhase === 2,
      durationSeconds: 10,
      alertText: (_data, matches, output) => {
        const spread = output.spread();
        const stack = output.stack();
        const disposal = (matches.id === '962C') ? [spread, stack] : [stack, spread];
        return output.text({ text1: disposal[0] });
      },
      outputStrings: {
        spread: { en: '散开' },
        stack: { en: '分摊' },
        text: { en: '先${text1}' },
      },
    },
    // WeaponId: 7 = 激光炮, 31 = 月环
    // param1:  正(月环)11D4    斜(月环)11D3     斜先 (meizu)
    // param1:  正(激光)11D2    斜(月环)11D3     斜先 (08-07 00:20)
    // param1:  正(月环)11D3    斜(月环)11D4     正先
    // param1:  正(月环)11D4    斜(激光)11D1     斜先
    // param1:  正(月环)11D3    斜(激光)11D2     正先
    // param1:  正(激光)11D1    斜(月环)11D4     正先
    // param1 月环：11D3先判定 11D4后判定
    // param1 激光：11D1先判定 11D2后判定
    {
      id: 'R4S Souma 夜半 3',
      type: 'StartsUsing',
      netRegex: { id: ['962C', '962B'] },
      condition: (data) => data.soumaPhase === 2,
      delaySeconds: 2,
      durationSeconds: 8,
      promise: async (data) => {
        const combatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants.filter((v) => v.WeaponId === 7 || v.WeaponId === 31);
        data.soumaCombatant = combatantData;
      },
      infoText: (data, matches, output) => {
        const combatantData = data.soumaCombatant;
        if (combatantData === undefined) {
          console.error('combatantData is undefined');
          return;
        }
        const sortKey = ['11D1', '11D3', '11D2', '11D4'];
        // N = 0, NE = 1, ..., NW = 7
        const clones = combatantData.map((v) => {
          if (v.WeaponId === undefined) {
            throw new Error('WeaponId is undefined');
          }
          return {
            dir: Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 165) % 2 === 0
              ? 'straight'
              : 'slanted',
            weapon: v.WeaponId === 7 ? 'laser' : 'rings',
            param1: data.soumaClonesActors.find((c) => parseInt(c.id, 16) === v.ID).param1,
          };
        }).sort((a, b) => (sortKey.indexOf(a.param1) - sortKey.indexOf(b.param1)));
        const useClones = [clones.at(0), clones.at(4)];
        const getOther = (str) => str === 'slanted' ? 'straight' : 'slanted';
        const disposal = (matches.id === '962C') ? ['spread', 'stack'] : ['stack', 'spread'];
        const playerDo = useClones.map((v, i) => {
          return [v.weapon === 'rings' ? v?.dir : getOther(v.dir), disposal[i]];
        });
        if (playerDo[1][0] === playerDo[0][0]) {
          playerDo[1][0] = 'twoSame';
        }
        const result = output.text({
          text1: `${output[playerDo[0][0]]()}${output[playerDo[0][1]]()}`,
          text2: `${output[playerDo[1][0]]()}${output[playerDo[1][1]]()}`,
        });
        // console.log(result);
        return result;
      },
      outputStrings: {
        straight: { en: '正' },
        slanted: { en: '斜' },
        twoSame: { en: '原地' },
        spread: { en: '散开' },
        stack: { en: '分摊' },
        text: { en: '${text1} => ${text2}' },
      },
    },
    {
      id: 'R4S Souma 本体地火',
      type: 'StartsUsingExtra',
      netRegex: { id: '95F5' },
      preRun: (data, matches) => {
        const x = Number.parseInt(matches.x);
        const y = Number.parseInt(matches.y);
        const heading = Number.parseFloat(matches.heading);
        if (x < 90 || x > 110)
          data.souma地火.push({ x, y, heading });
      },
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        if (data.souma地火.length === 8) {
          const left = data.souma地火.filter((v) => v.x < 90).sort((a, b) => a.y - b.y);
          const right = data.souma地火.filter((v) => v.x > 110).sort((a, b) => a.y - b.y);
          data.souma地火.length = 0;
          const line = {
            left: right.findIndex((v) => v.heading > 0) + 1,
            right: left.findIndex((v) => v.heading < 0) + 1,
          };
          return output.text({ n1: line.left, n2: line.right });
        }
      },
      outputStrings: {
        text: { en: '左${n1}右${n2}' },
      },
    },
    {
      id: 'R4S Souma 八人塔id',
      type: 'StartsUsing',
      netRegex: { id: '9617' },
      preRun: (data, matches) => {
        data.souma八人塔信息.push(matches);
      },
    },
    {
      id: 'R4S Souma 八人塔连线',
      type: 'Tether',
      netRegex: {
        id: ['0117', '0118'],
      },
      run: (data, matches) => {
        const tower = data.souma八人塔信息.find((v) => v.sourceId === matches.sourceId);
        if (tower === undefined) {
          throw new Error('未找到塔信息');
        }
        const x = parseFloat(tower.x);
        const y = parseFloat(tower.y);
        const half = x < 100 ? '左' : '右';
        // row1 = 153.75
        // row2 = 161.25
        // row3 = 168.75
        // row4 = 176.25
        // 相差7.5
        const row = Math.round((y - 153.75) / 7.5) + 1;
        data.souma八人塔.push({
          timestamp: new Date(matches.timestamp).getTime(),
          row: row,
          half: half,
        });
      },
    },
    {
      id: 'R4S Souma 八人塔玩家位置',
      type: 'Ability',
      netRegex: { id: '9617' },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        const x = parseFloat(matches.x);
        data.souma八人塔玩家位置 = x < 100 ? '左' : '右';
      },
    },
    {
      id: 'R4S Souma 八人塔连线结算',
      type: 'Tether',
      netRegex: {
        id: ['0117', '0118'],
      },
      durationSeconds: (data) => {
        if (data.souma八人塔结果第几次 === 4) {
          return 20;
        }
        return 3;
      },
      promise: async (data) => {
        if (data.souma八人塔玩家位置 === undefined) {
          console.error(`${data.me}未踩塔，尝试再次获取玩家位置`);
          const combatantData = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          const player = combatantData.find((v) => v.Name === data.me);
          if (player === undefined) {
            console.error(combatantData.slice());
            throw new Error('还是没有找到玩家信息');
          }
          data.souma八人塔玩家位置 = player.PosX < 100 ? '左' : '右';
        }
      },
      infoText: (data, _matches, output) => {
        if (data.souma八人塔.length % 3 === 0) {
          const playerPosition = data.souma八人塔玩家位置;
          const towers = data.souma八人塔.slice().filter((v) => {
            return playerPosition === v.half;
          }).sort((a, b) => {
            if (a.timestamp === b.timestamp) {
              return a.row - b.row;
            }
            return a.timestamp - b.timestamp;
          });
          const safeNumbers = [];
          for (let i = 0; i < towers.length; i += 3) {
            const three = towers.slice(i, i + 3);
            if (three.length === 0) {
              break;
            }
            const safeNum = [1, 2, 3, 4].filter((v) => !three.some((t) => t.row === v));
            safeNumbers.push(safeNum);
          }
          const resText = safeNumbers.join(' ');
          if (resText === ' ')
            return;
          if (resText !== data.souma八人塔结果上次) {
            data.souma八人塔结果第几次++;
            data.souma八人塔结果上次 = resText;
            return output.text({ text: resText });
          }
        }
      },
      outputStrings: {
        text: { en: '${text}' },
      },
    },
    {
      id: 'R4S Souma 本体二运1',
      type: 'GainsEffect',
      netRegex: { effectId: ['FA0', 'FA1'] },
      condition: (data, matches) => {
        data.souma在二运 = true;
        return data.me === matches.target && data.soumaPhase === 2;
      },
      durationSeconds: 23,
      suppressSeconds: 999,
      infoText: (data, matches, output) => {
        const color = matches.effectId === 'FA0' ? '黄' : '蓝';
        const length = parseInt(matches.duration) < 25 ? '短' : '长';
        const targetColor = color === '黄' ? '蓝' : '黄';
        data.souma二运找小怪颜色 = targetColor;
        if (length === '短') {
          data.souma二运你干啥 = '引导';
          return output.guide({ color: targetColor });
        } else if (length === '长') {
          data.souma二运你干啥 = '踩塔';
          return output.tower();
        }
      },
      outputStrings: {
        tower: { en: '准备踩塔' },
        guide: { en: '准备引导（找${color}色）' },
      },
    },
    {
      id: 'R4S Souma 本体二运2',
      type: 'GainsEffect',
      netRegex: { effectId: ['FA0', 'FA1'] },
      condition: (data, matches) => {
        return data.me === matches.target && data.soumaPhase === 2;
      },
      delaySeconds: 23,
      durationSeconds: 15,
      suppressSeconds: 999,
      infoText: (data, matches, output) => {
        const color = matches.effectId === 'FA0' ? '黄' : '蓝';
        const length = parseInt(matches.duration) < 25 ? '短' : '长';
        if (length === '短') {
          data.souma二运你干啥 = '踩塔';
          return output.tower();
        } else if (length === '长') {
          const targetColor = color === '黄' ? '蓝' : '黄';
          data.souma二运你干啥 = '引导';
          return output.guide({ color: targetColor });
        }
      },
      outputStrings: {
        tower: { en: '准备踩塔' },
        guide: { en: '准备引导（找${color}色）' },
      },
    },
    {
      id: 'R4S Souma 本体二运影分身',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        pair: [{ key: 'WeaponId', value: '28' }],
        capture: true,
      },
      condition: (data) => data.souma在二运,
      preRun: (data, matches) => {
        data.souma二运塔小怪id = Number.parseInt(matches.id, 16);
      },
      suppressSeconds: 1,
      promise: handleSportsMeetingsPromise,
      infoText: handleSportsMeetingInfoText,
    },
    {
      id: 'R4S Souma 本体二运2第二次小怪',
      type: 'GainsEffect',
      netRegex: { effectId: ['FA0', 'FA1'] },
      condition: (data, matches) => {
        return data.me === matches.target && data.soumaPhase === 2;
      },
      delaySeconds: 26,
      suppressSeconds: 999,
      promise: handleSportsMeetingsPromise,
      infoText: handleSportsMeetingInfoText,
    },
    // Finale
    {
      id: 'R4S Sword Quiver AoE',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(swordQuiverSafeMap), capture: false },
      response: Responses.bigAoe(),
    },
    // Use Ability lines for these triggers so they don't collide with the AoE call,
    // and also because the cast starts ~14s before the mechanic resolves, and FFXIV
    // players have goldfish memories.
    {
      id: 'R4S Sword Quiver Safe',
      type: 'Ability',
      netRegex: { id: Object.keys(swordQuiverSafeMap) },
      durationSeconds: 10,
      alertText: (_data, matches, output) => {
        const id = matches.id;
        if (!isSwordQuiverId(id))
          throw new UnreachableCode();
        return output[swordQuiverSafeMap[id]]();
      },
      outputStrings: swordQuiverOutputStrings,
    },
    // {
    //   id: 'R4S Souma 本体软狂暴1',
    //   type: 'StartsUsing',
    //   netRegex: { id: '95FA' },
    //   response: Responses.bigAoe(),
    // },
    // {
    //   id: 'R4S Souma 本体软狂暴2',
    //   type: 'StartsUsing',
    //   netRegex: { id: '95F9' },
    //   response: Responses.bigAoe(),
    // },
    // {
    //   id: 'R4S Souma 本体软狂暴3',
    //   type: 'StartsUsing',
    //   netRegex: { id: '95FB' },
    //   response: Responses.bigAoe(),
    // },
    // {
    //   id: 'R4S Souma 软狂暴第四刀',
    //   type: 'MapEffect',
    //   netRegex: {
    //     flags: '00020001',
    //     location: ['17', '18', '19'],
    //   },
    //   alarmText: (_data, matches, output) => {
    //     const location = matches.location;
    //     const index = ['17', '18', '19'].indexOf(location);
    //     const text = [output.n1!(), output.n2!(), output.n3!()][index]!;
    //     return text;
    //   },
    //   outputStrings: {
    //     'n1': { en: '二三安全' },
    //     'n2': { en: '一三安全' },
    //     'n3': { en: '一二安全' },
    //   },
    // },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Electromine': 'Elektromine',
        'Wicked Replica': 'Tosender Donner-Phantom',
        'Wicked Thunder': 'Tosender Donner',
      },
      'replaceText': {
        '(?<! )Spark': 'Funken',
        '(?<! )Witch Hunt': 'Hexenjagd',
        'Azure Thunder': 'Azurblauer Donner',
        'Bewitching Flight': 'Hexenflug',
        'Burst': 'Explosion',
        'Cannonbolt': 'Kanonenblitz',
        'Chain Lightning': 'Kettenblitz',
        'Conduction Point': 'Blitzpunkt',
        'Cross Tail Switch': 'Elektroschwanz-Wirbel',
        'Eight Star': 'Acht Sterne',
        'Electrifying Witch Hunt': 'Elektrisierende Hexenjagd',
        'Electron Stream': 'Elektronen-Strom',
        'Electrope Edge': 'Elektrob-Aufreihung',
        'Electrope Transplant': 'Elektrob-Umsetzung',
        'Flame Slash': 'Feuerschnitt',
        'Forked Fissures': 'Blitzstrom',
        'Forked Lightning': 'Gabelblitz',
        'Four Star': 'Vier Sterne',
        'Fulminous Field': 'Blitzfeld',
        'Impact': 'Impakt',
        'Ion Cluster': 'Ionen-Ansammlung',
        'Laceration': 'Zerreißen',
        'Left Roll': 'Linke Walze',
        'Lightning Cage': 'Blitzkäfig',
        'Lightning Vortex': 'Donnerkugel',
        'Midnight Sabbath': 'Mitternachtssabbat',
        'Mustard Bomb': 'Senfbombe',
        'Narrowing Witch Hunt': 'Ringförmige Hexenjagd',
        'Raining Swords': 'Klingenregen',
        'Right Roll': 'Rechte Walze',
        'Sidewise Spark': 'Seitlicher Funken',
        'Soulshock': 'Seelenschock',
        'Stampeding Thunder': 'Stampfender Kanonenschlag',
        'Sunrise Sabbath': 'Morgensonnensabbat',
        'Switch of Tides': 'Schwanzplatscher',
        'Sword Quiver': 'Klingentanz',
        'Tail Thrust': 'Schwanzstoß',
        'Thundering': 'Donnerring',
        'Twilight Sabbath': 'Zwielichtssabbat',
        'Wicked Blaze': 'Tosende Flammen',
        'Wicked Bolt': 'Tosender Blitz',
        'Wicked Fire': 'Tosendes Feuer',
        'Wicked Flare': 'Tosende Flare',
        'Wicked Jolt': 'Tosender Stoß',
        'Wicked Spark': 'Tosender Funken',
        'Wicked Special': 'Donnerknall',
        'Wicked Thunder': 'Tosender Donner',
        'Widening Witch Hunt': 'Runde Hexenjagd',
        'Witchgleam': 'Knisternder Funken',
        'Wrath of Zeus': 'Zorn des Zeus',
        '\\(debuffs resolve\\)': '(Debuffs spielen)',
        '\\(debuffs\\)': '(Debuffs)',
        '\\(enrage\\)': '(Finalangriff)',
        '\\(first mines hit\\)': '(erster Minen Treffer)',
        '\\(first set\\)': '(erstes Set)',
        '\\(first sparks detonate\\)': '(erste Funken explodiert)',
        '\\(first towers/cannons resolve\\)': '(ersten Turm/Kanone spielen)',
        '\\(floor no more\\)': '(Boden verschwindet)',
        '\\(fourth set\\)': '(viertes Set)',
        '\\(mines\\)': '(Minen)',
        '\\(players\\)': '(Spieler)',
        '\\(puddles drop\\)': '(Flächen kommen)',
        '\\(second hit\\)': '(Zweiter Treffer)',
        '\\(second mines hit\\)': '(Zweiter Minen Treffer)',
        '\\(second set\\)': '(Zweites Set)',
        '\\(second sparks detonate\\)': '(zweiter Funken explodiert)',
        '\\(second towers/cannons resolve\\)': '(zweiten Turm/Kanone spielen)',
        '\\(spread + tethers\\)': '(verteilen + Verbindungen)',
        '\\(third mines hit\\)': '(Dritte Minen Treffer)',
        '\\(third set\\)': '(Drittes Set)',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Electromine': 'Électromine',
        'Wicked Replica': 'Copie de Wicked Thunder',
        'Wicked Thunder': 'Wicked Thunder',
      },
      'replaceText': {
        '(?<! )Spark': 'Étincelle',
        '(?<! )Witch Hunt': 'Piqué fulgurant',
        'Azure Thunder': 'Foudre azur',
        'Bewitching Flight': 'Vol enchanteur',
        'Burst': 'Explosion',
        'Cannonbolt': 'Canon-éclair',
        'Chain Lightning': 'Chaîne d\'éclairs',
        'Conduction Point': 'Pointe foudroyante',
        'Cross Tail Switch': 'Empalement tentaculaire',
        'Eight Star': 'Huit étoiles',
        'Electrifying Witch Hunt': 'Piqué supra-fulgurant',
        'Electron Stream': 'Courant d\'électrons',
        'Electrope Edge': 'Élévation d\'électrope',
        'Electrope Transplant': 'Transplantation d\'électrope',
        'Flame Slash': 'Tranchant enflammé',
        'Forked Fissures': 'Flux foudroyant',
        'Forked Lightning': 'Éclair divergent',
        'Four Star': 'Quatre étoiles',
        'Fulminous Field': 'Champ d\'éclairs',
        'Impact': 'Impact',
        'Ion Cluster': 'Accumulation d\'ions',
        'Laceration': 'Lacération',
        'Left Roll': 'Rouleau gauche',
        'Lightning Cage': 'Cage d\'éclairs',
        'Lightning Vortex': 'Vortex foudroyant',
        'Midnight Sabbath': 'Diablerie obscure - Minuit',
        'Mustard Bomb': 'Bombe sulfurée',
        'Narrowing Witch Hunt': 'Piqué fulgurant condensé',
        'Raining Swords': 'Pluie d\'épées',
        'Right Roll': 'Rouleau droite',
        'Sidewise Spark': 'Éclair latéral',
        'Soulshock': 'Choc d\'âme',
        'Stampeding Thunder': 'Tonnerre déferlant',
        'Sunrise Sabbath': 'Diablerie obscure - Aurore',
        'Switch of Tides': 'Changement de marées',
        'Sword Quiver': 'Épée dansante',
        'Tail Thrust': 'Percée tentaculaire',
        'Thundering': 'Anneau foudroyant',
        'Twilight Sabbath': 'Diablerie obscure - Crépuscule',
        'Wicked Blaze': 'Embrasement vicieux',
        'Wicked Bolt': 'Fulguration vicieuse',
        'Wicked Fire': 'Feu vicieux',
        'Wicked Flare': 'Brasier vicieux',
        'Wicked Jolt': 'Électrochoc vicieux',
        'Wicked Spark': 'Étincelle vicieuse',
        'Wicked Special': 'Spéciale vicieuse',
        'Wicked Thunder': 'Wicked Thunder',
        'Widening Witch Hunt': 'Piqué fulgurant élargi',
        'Witchgleam': 'Rayon éclatant',
        'Wrath of Zeus': 'Colère de Zeus',
        '\\(debuffs resolve\\)': '(Résolution des debuffs)',
        '\\(debuffs\\)': '(Debuffs)',
        '\\(enrage\\)': '(Enrage)',
        '\\(first mines hit\\)': '(Premier coup des mines)',
        '\\(first set\\)': '(Premier Set)',
        '\\(first sparks detonate\\)': '(Premiere explostion des étincelles)',
        '\\(first towers/cannons resolve\\)': '(Première résolution tours/canons)',
        '\\(floor no more\\)': '(Plus de sol)',
        '\\(fourth set\\)': '(Quatrième set)',
        '\\(mines\\)': '(Mines)',
        '\\(players\\)': '(Joueurs)',
        '\\(puddles drop\\)': '(Arrivée des puddles)',
        '\\(second hit\\)': '(Second coup)',
        '\\(second mines hit\\)': '(Second coup des mines)',
        '\\(second set\\)': '(Second Set)',
        '\\(second sparks detonate\\)': '(Seconde explostion des étincelles)',
        '\\(second towers/cannons resolve\\)': '(Seconde résolution tours/canons)',
        '\\(spread \\+ tethers\\)': '(Dispersion + Liens)',
        '\\(third mines hit\\)': '(Troisième coup des mines)',
        '\\(third set\\)': '(Troisième Set)',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Electromine': 'エレクトリックマイン',
        'Wicked Replica': 'ウィケッドサンダーの幻影',
        'Wicked Thunder': 'ウィケッドサンダー',
      },
      'replaceText': {
        '(?<! )Spark': 'スパーク',
        '(?<! )Witch Hunt': 'ウィッチハント',
        'Azure Thunder': 'アズールサンダー',
        'Bewitching Flight': 'フライングウィッチ',
        'Burst': '爆発',
        'Cannonbolt': 'キャノンボルト',
        'Chain Lightning': 'チェインライトニング',
        'Conduction Point': 'ライトニングポイント',
        'Cross Tail Switch': 'クロステイル・スペシャル',
        'Eight Star': 'エイトスターズ',
        'Electrifying Witch Hunt': 'ライトニング・ウィッチハント',
        'Electron Stream': 'エレクトロンストリーム',
        'Electrope Edge': 'エレクトロープ展開',
        'Electrope Transplant': 'エレクトロープ移植',
        'Flame Slash': '火炎斬り',
        'Forked Fissures': 'ライトニングカレント',
        'Forked Lightning': 'フォークライトニング',
        'Four Star': 'フォースターズ',
        'Fulminous Field': 'ライトニングフィールド',
        'Impact': '衝撃',
        'Ion Cluster': 'イオンクラスター',
        'Laceration': '斬撃',
        'Lightning Cage': 'ライトニングケージ',
        'Lightning Vortex': 'サークルサンダー',
        'Midnight Sabbath': 'ブラックサバト【夜半】',
        'Mustard Bomb': 'マスタードボム',
        'Narrowing Witch Hunt': '輪円式ウィッチハント',
        'Raining Swords': '剣の雨',
        'Sidewise Spark': 'サイドスパーク',
        'Soulshock': 'ソウルショック',
        'Stampeding Thunder': 'カノンスタンピード',
        'Sunrise Sabbath': 'ブラックサバト【日出】',
        'Switch of Tides': 'テイルスプラッシュ',
        'Sword Quiver': '剣の舞',
        'Tail Thrust': 'テイルスラスト',
        'Thundering': 'リングサンダー',
        'Twilight Sabbath': 'ブラックサバト【日没】',
        'Wicked Blaze': 'ウィケッドブレイズ',
        'Wicked Bolt': 'ウィケッドボルト',
        'Wicked Fire': 'ウィケッドファイア',
        'Wicked Flare': 'ウィケッドフレア',
        'Wicked Jolt': 'ウィケッドジョルト',
        'Wicked Spark': 'ウィケッドスパーク',
        'Wicked Special': 'ウィケッドスペシャル',
        'Wicked Thunder': 'ウィケッドサンダー',
        'Widening Witch Hunt': '円輪式ウィッチハント',
        'Witchgleam': 'シャインスパーク',
        'Wrath of Zeus': 'ラス・オブ・ゼウス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Electromine': '雷转质矿组',
        'Wicked Replica': '狡雷的幻影',
        'Wicked Thunder': '狡雷',
      },
      'replaceText': {
        '(?<! )Spark': '电火花',
        '(?<! )Witch Hunt': '魔女狩猎',
        'Azure Thunder': '青雷',
        'Bewitching Flight': '魔女回翔',
        'Burst': '爆炸',
        'Cannonbolt': '聚雷加农炮',
        'Chain Lightning': '雷光链',
        'Conduction Point': '指向雷',
        'Cross Tail Switch': '交叉乱尾击',
        'Eight Star': '八雷星',
        'Electrifying Witch Hunt': '惊电魔女狩猎',
        'Electron Stream': '电子流',
        'Electrope Edge': '雷转质展开',
        'Electrope Transplant': '雷转质移植',
        'Flame Slash': '火焰斩',
        'Forked Fissures': '惊电裂隙',
        'Forked Lightning': '叉形闪电',
        'Four Star': '四雷星',
        'Fulminous Field': '雷电力场',
        'Impact': '冲击',
        'Ion Cluster': '离子簇',
        'Laceration': '斩击',
        'Left Roll': '左转',
        'Lightning Cage': '电牢笼',
        'Lightning Vortex': '电闪圆',
        'Midnight Sabbath': '黑色安息日的午夜',
        'Mustard Bomb': '芥末爆弹',
        'Narrowing Witch Hunt': '环圆式魔女狩猎',
        'Raining Swords': '剑雨',
        'Right Roll': '右转',
        'Sidewise Spark': '侧方电火花',
        'Soulshock': '灵魂震荡',
        'Stampeding Thunder': '奔雷炮',
        'Sunrise Sabbath': '黑色安息日的日出',
        'Switch of Tides': '尖尾溅',
        'Sword Quiver': '剑舞',
        'Tail Thrust': '尖尾刺',
        'Thundering': '电闪环',
        'Twilight Sabbath': '黑色安息日的日落',
        'Wicked Blaze': '狡诡炽焰',
        'Wicked Bolt': '狡诡落雷',
        'Wicked Fire': '狡诡火炎',
        'Wicked Flare': '狡诡核爆',
        'Wicked Jolt': '狡诡摇荡',
        'Wicked Spark': '狡诡电火花',
        'Wicked Special': '狡诡特技',
        'Wicked Thunder': '狡雷',
        'Widening Witch Hunt': '圆环式魔女狩猎',
        'Witchgleam': '辉光电火花',
        'Wrath of Zeus': '宙斯之怒',
        '\\(debuffs resolve\\)': '(处理 Debuff)',
        '\\(debuffs\\)': '(Debuff)',
        '\\(enrage\\)': '(狂暴)',
        '\\(first mines hit\\)': '(第一轮魔方充能)',
        '\\(first set\\)': '(第一轮充能)',
        '\\(first sparks detonate\\)': '(第一轮火花引爆)',
        '\\(first towers/cannons resolve\\)': '(第一轮塔/炮)',
        '\\(floor no more\\)': '(地板消失)',
        '\\(fourth set\\)': '(第四轮充能)',
        '\\(mines\\)': '(魔方)',
        '\\(players\\)': '(玩家)',
        '\\(puddles drop\\)': '(放圈)',
        '\\(second hit\\)': '(第二击)',
        '\\(second mines hit\\)': '(第二轮魔方充能)',
        '\\(second set\\)': '(第二轮充能)',
        '\\(second sparks detonate\\)': '(第二轮火花引爆)',
        '\\(second towers/cannons resolve\\)': '(第二轮塔/炮)',
        '\\(spread \\+ tethers\\)': '(分散 + 连线)',
        '\\(third mines hit\\)': '(第三轮魔方充能)',
        '\\(third set\\)': '(第三轮充能)',
      },
    },
  ],
});
