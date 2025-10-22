const cx = -600;
const cy = -300;
const getRad = (x, y) => {
  const heading = Math.atan2(x - cx, y - cy);
  if (heading > Math.PI)
    return heading - 2 * Math.PI;
  if (heading <= -Math.PI)
    return heading + 2 * Math.PI;
  return heading;
};
// const calculateFinalAngleDifference = (startAngle: number, endAngle: number) => {
//   const TWO_PI = 2 * Math.PI;
//   let delta = endAngle - startAngle;
//   delta = ((delta + Math.PI) % TWO_PI) - Math.PI;
//   delta = -delta;
//   const direction = delta > 0
//     ? '顺时针'
//     : delta < 0
//     ? '逆时针'
//     : '无旋转';
//   return { delta, direction };
// };
const 快慢刀ID = {
  AC41: '旋风',
  AC49: '旋风',
  AC43: '热风',
  AC4A: '热风',
  AC46: '打中间',
  AC4C: '打中间',
  AC47: '打两侧',
  AC4D: '打两侧',
};
Options.Triggers.push({
  id: 'Souma妖宫诗想',
  zoneId: 1311,
  initData: () => {
    return {
      combatantData: [],
      地火方向: undefined,
      地火: [],
      地火安全区: undefined,
      千年风化: [],
      快慢刀: [],
    };
  },
  triggers: [
    {
      id: 'Souma FVQ 地火方向',
      type: 'StartsUsing',
      // AEFD 左右拉
      // AEFE 上下拉
      netRegex: { id: 'AEF[DE]', capture: true },
      run: (data, matches, _output) => {
        data.地火方向 = matches.id === 'AEFD' ? '左右' : '上下';
      },
    },
    {
      id: 'Souma FVQ 地火收集',
      type: 'AbilityExtra',
      netRegex: { id: 'AC53', capture: true },
      preRun: (data, matches) => {
        data.地火.push({
          PosX: parseFloat(matches.x),
          PosY: parseFloat(matches.y),
        });
      },
    },
    {
      id: 'Souma FVQ 地火2',
      type: 'AbilityExtra',
      netRegex: { id: 'AC53', capture: true },
      delaySeconds: 0.5,
      durationSeconds: 35,
      suppressSeconds: 35,
      infoText: (data, _matches, output) => {
        if (data.地火.length === 0) {
          return;
        }
        const fires = data.地火.slice();
        data.地火.length = 0;
        const dir = data.地火方向;
        const keyFire = fires.find((v) => {
          const abs = Math.abs(v.PosX + 600);
          return abs < 7 && abs > 5;
        });
        if (!keyFire) {
          throw new Error('地火缺失');
        }
        const keyPos = keyFire.PosX < -600 ? '左' : '右';
        const key = `${keyPos}+${dir}`;
        const map = {
          '左+上下': '右下',
          '右+上下': '左下',
          '左+左右': '左上',
          '右+左右': '右上',
        };
        const res = map[key];
        // console.log(_matches.timestamp, key, fires, keyFire);
        if (!res) {
          throw new Error(`地火res错误,key=${key}`);
        }
        const safe = output[res]();
        data.地火安全区 = safe;
        return output.text({ safe: safe });
      },
      outputStrings: {
        '左上': '↖左上安全',
        '右上': '右上安全↗',
        '左下': '↙左下安全',
        '右下': '右下安全↘',
        'text': '（稍后 ${safe}）',
      },
    },
    {
      id: 'Souma FVQ 地火清理',
      type: 'AbilityExtra',
      netRegex: { id: 'AC53', capture: false },
      delaySeconds: 30,
      suppressSeconds: 30,
      run: (data) => {
        data.地火.length = 0;
      },
    },
    {
      id: 'Souma FVQ 吸入淋巴',
      type: 'StartsUsing',
      netRegex: { id: 'AC58', capture: false },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '吸引',
      },
    },
    {
      id: 'Souma FVQ 千年风化',
      type: 'StartsUsingExtra',
      netRegex: { id: 'AC5A', capture: true },
      preRun: (data, matches) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);
        data.千年风化.push({
          x: x,
          y: y,
          heading: parseFloat(matches.heading),
          time: matches.timestamp,
        });
      },
      response: (data, _matches, output) => {
        const arrs = data.千年风化.slice().map((v) => {
          const rad = getRad(v.x, v.y);
          return {
            ...v,
            rad,
          };
        }).sort((a, b) =>
          a.time === b.time
            ? a.rad - b.rad
            : new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        const [a1] = arrs;
        const ward = Math.abs(a1.heading - a1.rad) < 0.2 ? '打外' : '打内';
        if (arrs.length === 2 && arrs[1].time !== arrs[0].time) {
          // 一个起点
          if (ward === '打外') {
            return {
              alertText: output.外(),
            };
          }
          const dirNum = Directions.xyTo4DirNum(arrs[0].x, arrs[0].y, -600, -300);
          return {
            infoText: output[['上', '右', '下', '左'][dirNum]](),
          };
        } else if (
          arrs.length === 4 && arrs[0].time === arrs[1].time && arrs[2].time === arrs[3].time
        ) {
          // 两个起点
          if (ward === '打外') {
            return {
              alertText: output.外(),
            };
          }
          const dirNum = Directions.xyTo4DirNum(a1.x, a1.y, -600, -300);
          const dir = dirNum % 2 === 0 ? '上下' : '左右';
          return {
            infoText: output[`内${dir}`](),
          };
        }
      },
      outputStrings: {
        外: '中间',
        内上下: '上下外',
        内左右: '左右外',
        上: '上',
        下: '下',
        左: '左',
        右: '右',
      },
    },
    {
      id: 'Souma FVQ 千年风化2',
      type: 'StartsUsingExtra',
      netRegex: { id: 'AC5A', capture: false },
      delaySeconds: 5,
      suppressSeconds: 5,
      run: (data, _matches, _output) => {
        data.千年风化.length = 0;
      },
    },
    {
      id: 'Souma FVQ 旋风和热风和左右刀',
      type: 'StartsUsing',
      // 旋风 快读条 AC41
      // 旋风 慢读条 AC49
      // 热风 快读条 AC43
      // 热风 慢读条 AC4A
      // 打中间 快读条 AC46
      // 打中间 慢读条 AC4C
      // 打两侧 快读条 AC47
      // 打两侧 慢读条 AC4D
      netRegex: {
        id: [
          'AC41',
          'AC49',
          'AC43',
          'AC4A',
          'AC46',
          'AC4C',
          'AC47',
          'AC4D',
        ],
        capture: true,
      },
      preRun: (data, matches) => {
        if (data.快慢刀.find((v) => v.id === matches.id)) {
          return;
        }
        data.快慢刀.push({
          id: matches.id,
          castTime: parseFloat(matches.castTime),
          gimmick: 快慢刀ID[matches.id],
        });
      },
      infoText: (data, _matches, output) => {
        if (data.快慢刀.length < 2) {
          return;
        }
        const key = data.快慢刀.slice().sort((a, b) => a.castTime - b.castTime).map((v) => v.gimmick);
        data.快慢刀.length = 0;
        return output.text({ g1: output[key[0]](), g2: output[key[1]]() });
      },
      outputStrings: {
        旋风: '旋风',
        热风: '别动',
        打中间: '两侧',
        打两侧: '中间',
        text: '${g1} => ${g2}',
      },
    },
    {
      id: 'Souma FVQ 旋风和热风',
      type: 'StartsUsing',
      netRegex: {
        id: [
          'AC41',
          'AC49',
          'AC43',
          'AC4A',
        ],
        capture: true,
      },
      delaySeconds: (_data, matches) =>
        parseFloat(matches.castTime) - (['AC41', 'AC49'].includes(matches.id) ? 0.2 : 0.8),
      alarmText: (_data, matches, output) => {
        const key = 快慢刀ID[matches.id];
        return output[key]();
      },
      outputStrings: {
        旋风: '快走开！',
        热风: '停止移动！',
      },
    },
    {
      id: 'Souma FVQ Vodoriga Minion Spawn',
      // 14039 = Vodoriga Minion
      type: 'AddedCombatant',
      netRegex: { npcNameId: '14039', capture: false },
      response: Responses.killExtraAdd(),
    },
    // {
    //   id: 'Souma PT 99 Eminent Grief Drain Aether',
    //   // AC38 = short cast
    //   // AC39 = long cast
    //   // [AC3B, AC3D] = failstate casts?
    //   type: 'StartsUsing',
    //   netRegex: { id: ['AC38', 'AC39'], capture: true },
    //   delaySeconds: (_data, matches) =>
    //     matches.id === 'AC38' ? 0 : parseFloat(matches.castTime) - 5,
    //   alertText: (_data, _matches, output) => output.text!(),
    //   outputStrings: {
    //     text: {
    //       en: 'Get Light debuff',
    //       cn: '吃光',
    //     },
    //   },
    // },
    // {
    //   id: 'Souma PT 99 Devoured Eater Drain Aether',
    //   // AC3A = short cast
    //   // AC3C = long cast
    //   type: 'StartsUsing',
    //   netRegex: { id: ['AC3A', 'AC3C'], capture: true },
    //   delaySeconds: (_data, matches) =>
    //     matches.id === 'AC3A' ? 0 : parseFloat(matches.castTime) - 4,
    //   alertText: (_data, _matches, output) => output.text!(),
    //   outputStrings: {
    //     text: {
    //       en: 'Get Dark debuff',
    //       cn: '吃暗',
    //     },
    //   },
    // },
  ],
});
