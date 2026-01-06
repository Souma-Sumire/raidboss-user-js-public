const headMarkerData = {
  // Offsets: 00:41, 04:12, 08:13
  // Vfx Path: com_share4a1
  '0131': '0131',
  // Offsets: 00:15, 03:35, 08:53
  // Vfx Path: tank_lockonae_0m_5s_01t
  '01D4': '01D4',
  // Offsets: 03:08, 03:10, 03:12, 03:14
  // Vfx Path: lockon5_line_1p
  '028C': '028C',
};
const center = {
  x: 100,
  y: 100,
};
Options.Triggers.push({
  id: 'AacHeavyweightM1Savage',
  zoneId: ZoneId.AacHeavyweightM1Savage,
  overrideTimelineFile: true,
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
6.4 "--sync--" StartsUsing { id: "B384" } #Boss 魅亡之音
11.4 "魅亡之音" # Ability { id: "B384" } #Boss
16.6 "--sync--" StartsUsing { id: ["B35A","B37F"] } #Boss 硬核之声
19.6 "硬核之声x2" # Ability { id: "B35A" } #Boss
26.7 "--sync--" StartsUsing { id: ["B34A","B374"] } #Boss 血魅的靴踏音
30.8 "血魅的靴踏音" # Ability { id: "B34A" } #Boss
31.7 "血魅的靴踏音" # Ability { id: "B374" } #Boss
35.9 "共振波" # Ability { id: "B375" } #分身
36.6 "共振波" # Ability { id: "B376" } #Boss
46.7 "粗暴之雨" # Ability { id: "B35D" } #Boss
48 "粗暴之雨" # Ability { id: "B383" } #Boss
56.3 "--sync--" StartsUsing { id: "B333" } window 60,60 #Boss 施虐的尖啸
61.3 "施虐的尖啸" # Ability { id: "B333" } #Boss
69 "前进" # Ability { id: "B705" } #分身
69.5 "前进" # Ability { id: "B367" } #分身
76 "月之半相" # Ability { id: "B350" } #Boss
76.7 "冲出" # Ability { id: "B706" } #分身
76.7 "冲出" # Ability { id: "B368" } #分身
76.7 "月之半相" # Ability { id: "B37B" } #Boss
94.1 "冲出" # Ability { id: "B369" } #分身
94.1 "月之半相" # Ability { id: "B377" } #Boss
97.1 "月之半相" # Ability { id: "B378" } #Boss
111.5 "冲出" # Ability { id: "B36A" } #分身
139.8 "施虐的尖啸" # Ability { id: "B366" } #分身
148.3 "--sync--" StartsUsing { id: "B33E" }  window 60,60 #Boss 全场杀伤
148.7 "全场杀伤" # Ability { id: "B33E" } #Boss
154.2 "全场杀伤" # Ability { id: "B36D" } #Boss
167.1 "--sync--" StartsUsing { id: "B340" } #Boss 致命的闭幕曲
172 "致命的闭幕曲" # Ability { id: "B340" } #Boss
173.2 "致命的闭幕曲" # Ability { id: "B36F" } #Boss
174.1 "--sync--" StartsUsing { id: "B373" } #Boss 碎烂脉冲
178.1 "碎烂脉冲" # Ability { id: "B373" } #Boss
179.2 "--sync--" StartsUsing { id: ["B38F","B391","B392"] } #Boss 以太流失
191.5 "以太流失" # Ability { id: "B38F" } #Boss
192.2 "以太流失" # Ability { id: "B391" } #Boss
193.6 "以太流失" # Ability { id: "B390" } #Boss
194.2 "以太流失" # Ability { id: "B392" } #Boss
194.7 "--sync--" StartsUsing { id: "B393" } #Boss 以太流失
208.7 "以太流失" # Ability { id: "B393" } #Boss
266.3 "--sync--" StartsUsing { id: "B344" } #Boss 贪欲无厌
269.1 "贪欲无厌" # Ability { id: "B344" } #Boss
272.4 "贪欲无厌" # Ability { id: "B372" } #Boss
289.6 "蹂躏" # Ability { id: "B36C" } #分身
289.6 "蹂躏" # Ability { id: "B36B" } #分身
290.8 "--sync--" StartsUsing { id: "B38B" } #分身 掉落
297.7 "掉落" # Ability { id: "B38B" } #分身
298.4 "--sync--" StartsUsing { id: "B38D" } #分身 刚刺发射
390.2 "致命的闭幕曲" # Ability { id: "B341" } #Boss
391.4 "致命的闭幕曲" # Ability { id: "B370" } #Boss
397.4 "--sync--" StartsUsing { id: "B395" } #Boss 笼中地狱
401.2 "笼中地狱" # Ability { id: "B395" } #Boss
402.4 "血锁牢狱" # Ability { id: "B396" } #Boss
405 "血棘鞭打" # Ability { id: "B39B" } #分身
405 "血棘鞭打" # Ability { id: "B39A" } #分身
405 "血棘鞭打" # Ability { id: "B399" } #分身
409.5 "音速集聚" # Ability { id: "B39D" } #Boss
410.3 "音速集聚" # Ability { id: "B39F" } #Boss
416.6 "音速流散" # Ability { id: "B39C" } #Boss
417.4 "音速流散" # Ability { id: "B39E" } #Boss
417.4 "音速流散" # Ability { id: "B883" } #Boss
454 "血蝠死斗" # Ability { id: "B3A0" } #Boss
455.2 "血锁牢狱" # Ability { id: "B3A1" } #Boss
461.6 "嗜血抓挠" # Ability { id: "B3A4" } #Boss
462.3 "嗜血抓挠" # Ability { id: "B3A5" } #Boss
464.1 "嗜血抓挠" # Ability { id: "B3A6" } #Boss
464.1 "爆炸" # Ability { id: "B3A3" } #Boss
464.7 "嗜血抓挠" # Ability { id: "B3A7" } #Boss
474.9 "以太碎拍" # Ability { id: "B3A9" } #分身
474.9 "以太碎击" # Ability { id: "B3A8" } #分身
493.3 "以太碎拍" # Ability { id: "B3AB" } #分身
493.3 "以太碎击" # Ability { id: "B3AA" } #分身
528.8 "月之半相" # Ability { id: "B351" } #Boss
529.5 "月之半相" # Ability { id: "B37D" } #Boss
532.5 "月之半相" # Ability { id: "B37E" } #Boss
539.6 "硬核之声" # Ability { id: "B380", source: "致命美人" }
544.5 "碎烂脉冲" # Ability { id: "B373", source: "致命美人" }
550.9 "嗜血抓挠" # Ability { id: "B3A4", source: "致命美人" }
551.7 "嗜血抓挠" # Ability { id: "B3A5", source: "致命美人" }
553.5 "嗜血抓挠" ## Ability { id: "B3A6", source: "致命美人" }
554.2 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
554.2 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
555.9 "嗜血抓挠" ## Ability { id: "B3A6", source: "致命美人" }
556.6 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
556.6 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
558.3 "嗜血抓挠" ## Ability { id: "B3A6", source: "致命美人" }
559.0 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
559.0 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
560.7 "嗜血抓挠" ## Ability { id: "B3A6", source: "致命美人" }
561.3 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
561.3 "嗜血抓挠" ## Ability { id: "B3A7", source: "致命美人" }
568.9 "贪欲无厌" # Ability { id: "B344", source: "致命美人" }
572.2 "贪欲无厌" # Ability { id: "B372", source: "致命美人" }
580.9 "全场杀伤" # Ability { id: "B33E", source: "致命美人" }
586.3 "全场杀伤" # Ability { id: "B36D", source: "致命美人" }
588.8 "--sync--" # Ability { id: "B7C8", source: "致命美人" }
591.8 "--sync--" # Ability { id: "B7C8", source: "致命美人" }
`,
  initData: () => {
    return {
      sActorPositions: {},
      sBats: { inner: [], middle: [], outer: [] },
      sPlaying: false,
      sSaw: [],
      sTetherId: 0,
    };
  },
  triggers: [
    {
      id: 'souma r9s Headmarker Stack 0131',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['0131'], capture: true },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'souma r9s Headmarker Tankbuster 01D4',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['01D4'], capture: true },
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'souma r9s Headmarker Spread 028C',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['028C'], capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.seed(),
      outputStrings: {
        seed: {
          en: 'Drop seed',
          de: 'Saaten ablegen',
          fr: 'Déposez les graines',
          ja: '種捨て',
          cn: '放置冰花',
          ko: '씨앗 놓기',
          tc: '放置冰花',
        },
      },
    },
    {
      id: 'souma r9s 魅亡之音',
      type: 'StartsUsing',
      netRegex: { id: 'B384', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s ActorSetPos Tracker',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        },
    },
    {
      id: 'souma r9s ActorMove Tracker',
      type: 'ActorMove',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        },
    },
    {
      id: 'souma r9s Bat Tracker',
      type: 'ActorControlExtra',
      netRegex: { id: '4[0-9A-Fa-f]{7}', category: '0197', param1: '11D1', capture: true },
      run: (data, matches) => {
        const moveRads = {
          'inner': 1.5128,
          'middle': 1.5513,
          'outer': 1.5608,
        };
        const actor = data.sActorPositions[matches.id];
        if (actor === undefined)
          return;
        const dist = Math.hypot(actor.x - center.x, actor.y - center.y);
        const dLen = dist < 16 ? (dist < 8 ? 'inner' : 'middle') : 'outer';
        const angle = Math.atan2(actor.x - center.x, actor.y - center.y);
        let angleCW = angle - (Math.PI / 2);
        if (angleCW < -Math.PI)
          angleCW += Math.PI * 2;
        let angleDiff = Math.abs(angleCW - actor.heading);
        if (angleDiff > Math.PI * 1.75)
          angleDiff = Math.abs(angleDiff - (Math.PI * 2));
        const cw = angleDiff < (Math.PI / 2) ? 'cw' : 'ccw';
        const adjustRads = moveRads[dLen];
        let endAngle = angle + (adjustRads * ((cw === 'cw') ? -1 : 1));
        if (endAngle < -Math.PI)
          endAngle += Math.PI * 2;
        else if (endAngle > Math.PI)
          endAngle -= Math.PI * 2;
        data.sBats[dLen].push(
          Directions.output16Dir[Directions.hdgTo16DirNum(endAngle)] ?? 'unknown',
        );
      },
    },
    {
      id: 'souma r9s Blast Beat Inner',
      type: 'ActorControlExtra',
      netRegex: { id: '4[0-9A-Fa-f]{7}', category: '0197', param1: '11D1', capture: false },
      delaySeconds: 4.1,
      durationSeconds: 5.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const [dir1, dir2] = data.sBats.inner;
        return output.away({
          dir1: output[dir1 ?? 'unknown'](),
          dir2: output[dir2 ?? 'unknown'](),
        });
      },
      run: (data, _matches) => {
        data.sBats.inner = [];
      },
      outputStrings: {
        ...Directions.outputStrings16Dir,
        away: {
          en: 'Away from bats ${dir1}/${dir2}',
          fr: 'Loin des chauves-souris ${dir1}/${dir2}',
          cn: '远离 ${dir1}、${dir2} 蝙蝠',
          ko: '박쥐 피하기 ${dir1}/${dir2}',
        },
      },
    },
    {
      id: 'souma r9s 血魅的靴踏音',
      type: 'StartsUsing',
      netRegex: { id: ['B34A', 'B374'], capture: false },
      suppressSeconds: 1,
      response: Responses.getOut('info'),
    },
    {
      id: 'souma r9s 粗暴之雨',
      type: 'StartsUsing',
      netRegex: { id: 'B35D', capture: true },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'souma r9s 施虐的尖啸',
      type: 'StartsUsing',
      netRegex: { id: 'B333', capture: false },
      response: Responses.aoe(),
      run: (data) => data.sPlaying = false,
    },
    {
      id: 'souma r9s SM start',
      type: 'SystemLogMessage',
      netRegex: { id: '2C40', capture: false },
      run: (data) => data.sPlaying = true,
    },
    {
      id: 'souma r9s 冲出',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B368', 'B369', 'B36A'], capture: true },
      preRun: (data, matches) => {
        data.sSaw.push(parseFloat(matches.x));
      },
    },
    {
      id: 'souma r9s 冲出2',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B368', 'B369', 'B36A'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 10,
      infoText: (data, _matches, output) => {
        const dir = {
          'right+right': 'front',
          'right+left': 'back',
          'right+bottom': 'right',
          'left+right': 'back',
          'left+left': 'front',
          'left+bottom': 'left',
          'bottom+right': 'right',
          'bottom+left': 'left',
        };
        const start = dir[`${data.sMoon?.side}+${data.sMoon?.dir}`];
        const end = {
          'left': 'right',
          'right': 'left',
          'front': 'back',
          'back': 'front',
        }[start];
        const diff = Math.abs(data.sSaw.at(0) - data.sSaw.at(1));
        const isFar = diff > 14 && data.sMoon?.dir === 'bottom';
        return output.text({
          start: output[start](),
          end: output[end](),
          far: isFar ? output.far() : '',
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        front: Outputs.front,
        back: Outputs.back,
        text: {
          en: '${start} => ${end}${far}',
        },
        far: {
          en: 'Far',
          cn: '（三步）',
        },
      },
    },
    {
      id: 'souma r9s 冲出3',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B368', 'B369', 'B36A'], capture: false },
      delaySeconds: 10,
      suppressSeconds: 10,
      run: (data) => {
        data.sSaw.length = 0;
        data.sMoon = undefined;
      },
    },
    {
      id: 'souma r9s 月之半相',
      type: 'StartsUsingExtra',
      netRegex: {
        id: [
          'B34E',
          'B350', // 左侧安全（左边=前，右边=后，前=左）
        ],
        capture: true,
      },
      infoText: (data, matches, output) => {
        const side = matches.id === 'B34E' ? 'right' : 'left';
        if (!data.sPlaying) {
          // 普通情况
          return output.text({
            dir1: output[side](),
            dir2: output[side === 'left' ? 'right' : 'left'](),
          });
        }
        const dir = parseFloat(matches.y) >= 121
          ? 'bottom'
          : (parseFloat(matches.x) >= 100 ? 'right' : 'left');
        data.sMoon = { side, dir };
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        text: { en: '${dir1} => ${dir2}' },
      },
    },
    {
      id: 'souma r9s 月之半相强化版',
      type: 'StartsUsingExtra',
      netRegex: {
        id: [
          'B351',
          'B34F', // 右侧安全（强化版）
        ],
        capture: true,
      },
      infoText: (_data, matches, output) => {
        const safe = matches.id === 'B351' ? 'left' : 'right';
        return output.text({
          dir1: output[safe](),
          dir2: output[safe === 'left' ? 'right' : 'left'](),
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        text: {
          en: '${dir1} max melee => ${dir2} max melee',
          cn: '${dir1} 最大近战距离 => ${dir2} 最大近战距离',
        },
      },
    },
    {
      id: 'souma r9s 全场杀伤',
      type: 'StartsUsing',
      netRegex: { id: 'B33E', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s 致命的闭幕曲',
      type: 'StartsUsing',
      netRegex: { id: ['B340', 'B341'], capture: false },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s 致命的闭幕曲狂暴',
      type: 'StartsUsing',
      netRegex: { id: 'B36E', capture: false },
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Enrage',
          de: 'Finalangriff',
          fr: 'Enrage',
          ja: '時間切れ',
          cn: '狂暴',
          ko: '전멸기',
          tc: '狂暴',
        },
      },
    },
    {
      id: 'souma r9s 贪欲无厌',
      type: 'StartsUsing',
      netRegex: { id: 'B344', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s 感电',
      type: 'StartsUsing',
      netRegex: { id: 'B709', capture: false },
      condition: (data) => data.role === 'tank',
      suppressSeconds: 1,
      response: Responses.getTowers(),
    },
    {
      id: 'souma r9s 刚刺发射 B38D',
      type: 'StartsUsing',
      netRegex: { id: 'B38D', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
    {
      id: 'souma r9s _rsv_45981_-1_4_0_0_SE2DC5B04_EE2DC5B04',
      type: 'StartsUsing',
      netRegex: { id: 'B39D', capture: true },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'souma r9s _rsv_45980_-1_4_0_0_SE2DC5B04_EE2DC5B04',
      type: 'StartsUsing',
      netRegex: { id: 'B39C', capture: false },
      suppressSeconds: 5,
      response: Responses.rolePositions(),
    },
    {
      id: 'souma r9s 血蝠死斗',
      type: 'StartsUsing',
      netRegex: { id: 'B3A0', capture: false },
      response: Responses.getTowers(),
    },
    {
      id: 'souma r9s 连线',
      type: 'Tether',
      netRegex: { 'id': '0161' },
      condition: (data, matches) => data.me === matches.source,
      preRun: (data, matches) => {
        data.sTetherId = parseInt(matches.targetId, 16);
      },
    },
    {
      id: 'souma r9s 808',
      type: 'GainsEffect',
      netRegex: { effectId: '808', count: ['426', '427'] },
      condition: (data, matches) => data.sTetherId === parseInt(matches.targetId, 16),
      durationSeconds: 4,
      infoText: (_data, matches, output) => {
        const inout = matches.count === '427' ? 'in' : 'out';
        return output.text({ inout: output[inout]() });
      },
      outputStrings: {
        in: { en: '月环' },
        out: { en: '钢铁' },
        text: { en: '蝙蝠${inout}' },
      },
    },
    // {
    //   id: 'souma r9s 嗜血抓挠',
    //   type: 'StartsUsing',
    //   netRegex: { id: ['B3A4', 'B3A5'],  capture: false },
    //   infoText: (_data, _matches, output) => output.text!(),
    //   outputStrings: {
    //     text: {
    //       en: 'Custom Text',
    //       de: 'Benutzerdefinierter Text',
    //       fr: 'Texte personnalisé',
    //       cn: '自定义文本',
    //     },
    //   },
    // },
  ],
});
