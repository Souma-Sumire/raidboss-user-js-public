// 全部是main分支复制来的，不是我写的，仅仅删除了source的限制，以适配汉化端
console.log('已加载M5S');
// map of ids to number of hits and first safe side
const snapTwistIdMap = {
  // 2-snap Twist & Drop the Needle
  'A728': ['two', 'west'],
  'A729': ['two', 'west'],
  'A72A': ['two', 'west'],
  'A4DB': ['two', 'west'],
  'A72B': ['two', 'east'],
  'A72C': ['two', 'east'],
  'A72D': ['two', 'east'],
  'A4DC': ['two', 'east'],
  // 3-snap Twist & Drop the Needle
  'A730': ['three', 'west'],
  'A731': ['three', 'west'],
  'A732': ['three', 'west'],
  'A4DD': ['three', 'west'],
  'A733': ['three', 'east'],
  'A734': ['three', 'east'],
  'A735': ['three', 'east'],
  'A4DE': ['three', 'east'],
  // 4-snap Twist & Drop the Needle
  'A739': ['four', 'west'],
  'A73A': ['four', 'west'],
  'A73B': ['four', 'west'],
  'A4DF': ['four', 'west'],
  'A73C': ['four', 'east'],
  'A73D': ['four', 'east'],
  'A73E': ['four', 'east'],
  'A4E0': ['four', 'east'],
};
// map of Frogtourage cast ids to safe dirs
const feverIdMap = {
  'A70A': 'dirN',
  'A70B': 'dirS',
  'A70C': 'dirW',
  'A70D': 'dirE', // west cleave
};
const hustleMap = {
  // Frogtourage clones:
  'A775': 'right',
  'A776': 'left',
  // Boss:
  'A724': 'right',
  'A725': 'left',
};
const getSafeDirsForCloneCleave = (matches) => {
  const isLeftCleave = hustleMap[matches.id] === 'left';
  // Snap the frog to the nearest cardinal in the direction of their cleave
  const headingAdjust = isLeftCleave ? -(Math.PI / 8) : (Math.PI / 8);
  let snappedHeading = (parseFloat(matches.heading) + headingAdjust) % Math.PI;
  if (snappedHeading < -Math.PI)
    snappedHeading = Math.PI - snappedHeading;
  snappedHeading = snappedHeading % Math.PI;
  // Frog's snapped heading and the next one CW or CCW depending on cleave direction are safe
  const snappedFrogDir = Directions.hdgTo4DirNum(snappedHeading);
  const otherSafeDir = ((snappedFrogDir + 4) + (isLeftCleave ? 1 : -1)) % 4;
  return [
    Directions.outputCardinalDir[snappedFrogDir] ?? 'unknown',
    Directions.outputCardinalDir[otherSafeDir] ?? 'unknown',
  ];
};
Options.Triggers.push({
  id: '_AacCruiserweightM1Savage',
  zoneId: 1257,
  initData: () => ({
    deepCutTargets: [],
    discoInfernalCount: 0,
    feverSafeDirs: [],
    wavelengthCount: {
      alpha: 0,
      beta: 0,
    },
    storedHustleCleaves: [],
    hustleCleaveCount: 0,
  }),
  triggers: [
    {
      // headmarkers with self-targeted cast
      id: 'R5S Deep Cut',
      type: 'HeadMarker',
      netRegex: { id: '01D7' },
      infoText: (data, matches, output) => {
        data.deepCutTargets.push(matches.target);
        if (data.deepCutTargets.length < 2)
          return;
        if (data.deepCutTargets.includes(data.me))
          return output.cleaveOnYou();
        return output.avoidCleave();
      },
      run: (data) => {
        if (data.deepCutTargets.length >= 2)
          data.deepCutTargets = [];
      },
      outputStrings: {
        cleaveOnYou: Outputs.tankCleaveOnYou,
        avoidCleave: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'R5S Flip to AB Side',
      type: 'StartsUsing',
      netRegex: { id: ['A780', 'A781'] },
      infoText: (data, matches, output) => {
        // A780 = Flip to A-side, A781 = Flip to B-side
        data.storedABSideMech = matches.id === 'A780' ? 'roleGroup' : 'lightParty';
        return output.stored({ mech: output[data.storedABSideMech]() });
      },
      outputStrings: {
        stored: {
          en: '(${mech} later)',
          de: '(${mech} später)',
          fr: '(${mech} après)',
          ja: '(あとで ${mech})',
          cn: '(稍后 ${mech})',
          ko: '(나중에 ${mech})',
        },
        lightParty: Outputs.healerGroups,
        roleGroup: Outputs.rolePositions,
      },
    },
    {
      id: 'R5S X-Snap Twist',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(snapTwistIdMap) },
      durationSeconds: 10,
      alertText: (data, matches, output) => {
        const snapTwist = snapTwistIdMap[matches.id];
        if (!snapTwist)
          return;
        const snapCountStr = output[snapTwist[0]]();
        const safeDirStr = output[snapTwist[1]]();
        const mechStr = output[data.storedABSideMech ?? 'unknown']();
        return output.combo({ dir: safeDirStr, num: snapCountStr, mech: mechStr });
      },
      run: (data) => delete data.storedABSideMech,
      outputStrings: {
        combo: {
          en: 'Start ${dir} (${num} hits) => ${mech}',
          de: 'Start ${dir} (${num} Treffer) => ${mech}',
          fr: 'Commencez ${dir} (${num} coups) => ${mech}',
          ja: '${dir} 開始 (${num} ポイント) からの ${mech}',
          cn: '${dir} 开始 (打 ${num} 次) => ${mech}',
          ko: '${dir} 시작 (${num}번 공격) => ${mech}',
        },
        lightParty: Outputs.healerGroups,
        roleGroup: Outputs.rolePositions,
        east: Outputs.east,
        west: Outputs.west,
        two: Outputs.num2,
        three: Outputs.num3,
        four: Outputs.num4,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'R5S Celebrate Good Times',
      type: 'StartsUsing',
      netRegex: { id: 'A723', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'R5S Disco Inferno',
      type: 'StartsUsing',
      netRegex: { id: 'A756', capture: false },
      response: Responses.bigAoe(),
      run: (data) => data.discoInfernalCount++,
    },
    {
      id: 'R5S Burn Baby Burn 1 Early',
      type: 'GainsEffect',
      netRegex: { effectId: '116D' },
      condition: (data, matches) =>
        data.discoInfernalCount === 1 &&
        data.me === matches.target,
      durationSeconds: 7,
      infoText: (_data, matches, output) => {
        // During Disco 1, debuffs are by role: 23.5s or 31.5s
        if (parseFloat(matches.duration) < 25)
          return output.shortBurn();
        return output.longBurn();
      },
      outputStrings: {
        shortBurn: {
          en: '(short cleanse)',
          de: '(kurze Reinigung)',
          fr: '(compteur court)',
          ja: '(先にスポットライト)',
          cn: '(短舞点名)',
          ko: '(짧은 디버프)',
        },
        longBurn: {
          en: '(long cleanse)',
          de: '(lange Reinigung)',
          fr: '(compteur long)',
          ja: '(あとでスポットライト)',
          cn: '(长舞点名)',
          ko: '(긴 디버프)',
        },
      },
    },
    {
      id: 'R5S Burn Baby Burn 1 Cleanse',
      type: 'GainsEffect',
      netRegex: { effectId: '116D' },
      condition: (data, matches) =>
        data.discoInfernalCount === 1 &&
        data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      countdownSeconds: 5,
      alertText: (_data, _matches, output) => output.cleanse(),
      outputStrings: {
        cleanse: {
          en: 'Cleanse in spotlight',
          de: 'Reinige im Scheinwerfer',
          fr: 'Purifiez sous le projecteur',
          ja: 'スポットライトで浄化',
          cn: '灯下跳舞',
          ko: '스포트라이트에 서기',
        },
      },
    },
    {
      id: 'R5S Burn Baby Burn 2 First',
      type: 'GainsEffect',
      netRegex: { effectId: '116D' },
      condition: (data, matches) =>
        data.discoInfernalCount === 2 &&
        data.me === matches.target,
      durationSeconds: 9,
      alertText: (_data, matches, output) => {
        // During Disco 2, debuffs are by role: 9s or 19s
        if (parseFloat(matches.duration) < 14)
          return output.cleanse();
        return output.bait();
      },
      outputStrings: {
        cleanse: {
          en: 'Cleanse in spotlight',
          de: 'Reinige im Scheinwerfer',
          fr: 'Purifiez sous le projecteur',
          ja: 'スポットライトで浄化',
          cn: '灯下跳舞',
          ko: '스포트라이트에 서기',
        },
        bait: {
          en: 'Bait Frog',
          de: 'Frosch ködern',
          fr: 'Prenez la grenouille',
          ja: 'カエル誘導',
          cn: '引导青蛙',
          ko: '개구리 유도',
        },
      },
    },
    {
      id: 'R5S Burn Baby Burn 2 Second',
      type: 'GainsEffect',
      netRegex: { effectId: '116D' },
      condition: (data, matches) =>
        data.discoInfernalCount === 2 &&
        data.me === matches.target,
      delaySeconds: 11,
      durationSeconds: 8,
      alertText: (_data, matches, output) => {
        // During Disco 2, debuffs are by role: 9s or 19s
        if (parseFloat(matches.duration) < 14)
          return output.bait();
        return output.cleanse();
      },
      outputStrings: {
        cleanse: {
          en: 'Cleanse in spotlight',
          de: 'Reinige im Scheinwerfer',
          fr: 'Purifiez sous le projecteur',
          ja: 'スポットライトで浄化',
          cn: '灯下跳舞',
          ko: '스포트라이트에 서기',
        },
        bait: {
          en: 'Bait Frog',
          de: 'Frosch ködern',
          fr: 'Prenez la grenouille',
          ja: 'カエル誘導',
          cn: '引导青蛙',
          ko: '개구리 유도',
        },
      },
    },
    {
      id: 'R5S Inside Out',
      type: 'StartsUsing',
      netRegex: { id: 'A77C', capture: false },
      durationSeconds: 8.5,
      alertText: (_data, _matches, output) => output.insideOut(),
      outputStrings: {
        insideOut: {
          en: 'Max Melee => Under',
          de: 'Max Nahkampf => Unter ihn',
          fr: 'Max mêlée => Dessous',
          ja: '外からボス下に',
          cn: '钢铁 => 月环',
          ko: '칼끝딜 => 안으로',
        },
      },
    },
    {
      id: 'R5S Outside In',
      type: 'StartsUsing',
      netRegex: { id: 'A77E', capture: false },
      durationSeconds: 8.5,
      alertText: (_data, _matches, output) => output.outsideIn(),
      outputStrings: {
        outsideIn: {
          en: 'Under => Max Melee',
          de: 'Unter ihn => Max Nahkampf',
          fr: 'Dessous => Max mêlée',
          ja: 'ボス下から外に',
          cn: '月环 => 钢铁',
          ko: '안으로 => 칼끝딜',
        },
      },
    },
    {
      // Wavelength α debuff timers are applied with 40.5, 25.5, 25.5, 30.5 or
      //  38.0, 23.0, 23.0, 28.0 durations depending on which group gets hit first
      //
      // Wavelength β debuff timers are applied with 45.5, 30.5, 20.5, 25.5 or
      //  43.0, 28.0, 18.0, 23.0 durations depending on which group gets hit first
      id: 'R5S Wavelength Merge Order',
      type: 'GainsEffect',
      netRegex: { effectId: ['116E', '116F'] },
      preRun: (data, matches) => {
        matches.effectId === '116E' ? data.wavelengthCount.alpha++ : data.wavelengthCount.beta++;
      },
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      infoText: (data, matches, output) => {
        if (matches.target === data.me) {
          if (matches.effectId === '116E') {
            const count = data.wavelengthCount.alpha;
            switch (count) {
              case 1:
                return output.merge({ order: output.third() });
              case 2:
                return output.merge({ order: output.first() });
              case 3:
                return output.merge({ order: output.second() });
              case 4:
                return output.merge({ order: output.fourth() });
              default:
                return output.merge({ order: output.unknown() });
            }
          } else {
            const count = data.wavelengthCount.beta;
            switch (count) {
              case 1:
                return output.merge({ order: output.fourth() });
              case 2:
                return output.merge({ order: output.second() });
              case 3:
                return output.merge({ order: output.first() });
              case 4:
                return output.merge({ order: output.third() });
              default:
                return output.merge({ order: output.unknown() });
            }
          }
        }
      },
      outputStrings: {
        merge: {
          en: '${order} merge',
          de: '${order} berühren',
          fr: '${order} fusion',
          ja: '${order} にペア割り',
          cn: '${order} 撞毒',
          ko: '${order} 융합',
        },
        first: {
          en: 'First',
          de: 'Erstes',
          fr: 'Première',
          ja: '最初',
          cn: '第1组',
          ko: '첫번째',
        },
        second: {
          en: 'Second',
          de: 'Zweites',
          fr: 'Seconde',
          ja: '2番目',
          cn: '第2组',
          ko: '두번째',
        },
        third: {
          en: 'Third',
          de: 'Drittes',
          fr: 'Troisième',
          ja: '3番目',
          cn: '第3组',
          ko: '세번째',
        },
        fourth: {
          en: 'Fourth',
          de: 'Viertes',
          fr: 'Quatrième',
          ja: '4番目',
          cn: '第4组',
          ko: '네번째',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'R5S Wavelength Merge Reminder',
      type: 'GainsEffect',
      netRegex: { effectId: ['116E', '116F'] },
      condition: Conditions.targetIsYou(),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 5,
      alertText: (_data, _matches, output) => output.merge(),
      outputStrings: {
        merge: {
          en: 'Merge debuff',
          de: 'Debuff berühren',
          fr: 'Fusionner le debuff',
          ja: 'ペア割り',
          cn: '撞毒',
          ko: '융합하기',
        },
      },
    },
    {
      id: 'R5S Quarter Beats',
      type: 'StartsUsing',
      netRegex: { id: 'A75B', capture: false },
      infoText: (_data, _matches, output) => output.quarterBeats(),
      outputStrings: {
        quarterBeats: Outputs.stackPartner,
      },
    },
    {
      id: 'R5S Eighth Beats',
      type: 'StartsUsing',
      netRegex: { id: 'A75D', capture: false },
      infoText: (_data, _matches, output) => output.eighthBeats(),
      outputStrings: {
        eighthBeats: Outputs.spread,
      },
    },
    {
      // cast order of the 8 adds is always W->E, same as firing order
      id: 'R5S Arcady Night Fever + Encore Collect',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(feverIdMap) },
      run: (data, matches) => data.feverSafeDirs.push(feverIdMap[matches.id] ?? 'unknown'),
    },
    {
      id: 'R5S Let\'s Dance!',
      type: 'StartsUsing',
      // A76A - Let's Dance!; A390 - Let's Dance! Remix
      // Remix is faster, so use a shorter duration
      netRegex: { id: ['A76A', 'A390'] },
      durationSeconds: (_data, matches) => matches.id === 'A76A' ? 23 : 18,
      infoText: (data, _matches, output) => {
        if (data.feverSafeDirs.length < 8)
          return output['unknown']();
        const dirStr = data.feverSafeDirs.map((dir) => output[dir]()).join(output.next());
        return dirStr;
      },
      run: (data) => data.feverSafeDirs = [],
      outputStrings: {
        ...Directions.outputStringsCardinalDir,
        next: Outputs.next,
      },
    },
    {
      id: 'R5S Let\'s Pose',
      type: 'StartsUsing',
      netRegex: { id: 'A770', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'R5S Do the Hustle',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(hustleMap) },
      preRun: (data, matches) => data.storedHustleCleaves.push(matches),
      infoText: (data, _matches, outputs) => {
        // Order is double cleave, double cleave, single cleave, triple cleave
        const expectedCountMap = [
          2,
          2,
          1,
          3,
        ];
        if (
          data.storedHustleCleaves.length <
            (expectedCountMap[data.hustleCleaveCount] ?? 0)
        )
          return;
        const cleaves = data.storedHustleCleaves;
        const currentCleaveCount = data.hustleCleaveCount;
        data.storedHustleCleaves = [];
        ++data.hustleCleaveCount;
        // Double cleaves from clones
        if (currentCleaveCount === 0 || currentCleaveCount === 1) {
          const [cleave1, cleave2] = cleaves;
          if (cleave1 === undefined || cleave2 === undefined)
            return;
          const safeDirs1 = getSafeDirsForCloneCleave(cleave1);
          const safeDirs2 = getSafeDirsForCloneCleave(cleave2);
          for (const dir of safeDirs1) {
            if (safeDirs2.includes(dir)) {
              return outputs[dir]();
            }
          }
          return outputs['unknown']();
        }
        // Single boss cleave
        if (currentCleaveCount === 2) {
          const [cleave1] = cleaves;
          if (cleave1 === undefined)
            return;
          return hustleMap[cleave1.id] === 'left' ? outputs['dirE']() : outputs['dirW']();
        }
        // Double cleaves from clones plus boss cleave
        if (currentCleaveCount === 3) {
          const cleave3 = cleaves.find((cleave) => ['A724', 'A725'].includes(cleave.id));
          const [cleave1, cleave2] = cleaves.filter((c) => c !== cleave3);
          if (cleave1 === undefined || cleave2 === undefined || cleave3 === undefined)
            return;
          const safeDirs1 = getSafeDirsForCloneCleave(cleave1);
          const safeDirs2 = getSafeDirsForCloneCleave(cleave2);
          let safeDir = 'unknown';
          for (const dir of safeDirs1) {
            if (safeDirs2.includes(dir)) {
              safeDir = dir;
            }
          }
          const isBossLeftCleave = hustleMap[cleave3.id] === 'left';
          // safeDir should be either 'dirN' or 'dirS' at this point, adjust with boss left/right
          if (safeDir === 'dirN') {
            if (isBossLeftCleave)
              return outputs['dirNNE']();
            return outputs['dirNNW']();
          }
          if (safeDir === 'dirS') {
            if (isBossLeftCleave)
              return outputs['dirSSE']();
            return outputs['dirSSW']();
          }
          return outputs['unknown']();
        }
        return outputs['unknown']();
      },
      outputStrings: {
        ...Directions.outputStrings16Dir,
      },
    },
  ],
});
