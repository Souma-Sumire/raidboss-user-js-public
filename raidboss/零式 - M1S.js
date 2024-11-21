// MapEffect tile map:
// 00 01 02 03
// 04 05 06 07
// 08 09 0A 0B
// 0C 0D 0E 0F
// +0x10 is a duplicate used for E&E knockback display
const mapEffectTileState = {
  'cracked': '00020001',
  'clear': '00040004',
  'quickRebuid': '00080004',
  'broken': '00200010',
  'refreshing': '00800004',
  'rebuilding': '01000004', // rebuilding from broken
};
const mapEffectData = {
  '00': {
    'location': '00',
    'centerX': 85,
    'centerY': 85,
    ...mapEffectTileState,
  },
  '03': {
    'location': '03',
    'centerX': 115,
    'centerY': 85,
    ...mapEffectTileState,
  },
  '09': {
    'location': '09',
    'centerX': 95,
    'centerY': 105,
    ...mapEffectTileState,
  },
  '0A': {
    'location': '0A',
    'centerX': 105,
    'centerY': 105,
    ...mapEffectTileState,
  },
};
const headMarkerData = {
  // Vfx Path: tank_lockon02k1
  tankbuster: '00DA',
  // Vfx Path: lockon8_t0w
  spreadMarker1: '00F4',
  // Vfx Path: loc05sp_05a_se_p
  spreadMarker2: '0178',
  // Vfx Path: m0884_vanish_7sec_p1
  pawprint: '021A',
};
Options.Triggers.push({
  id: 'SoumaAacLightHeavyweightM1Savage',
  zoneId: ZoneId.AacLightHeavyweightM1Savage,
  initData: () => ({
    actorSetPosTracker: {},
    storedLeaps: {
      oneTwoPaw: {},
      quadCross: {},
    },
  }),
  triggers: [
    { id: 'R1S Shockwave Knockback Safe Directions', disabled: true},
    { id: 'R1S One-two Paw Right Left', disabled: true},
    { id: 'R1S One-two Paw Left Right', disabled: true},
    { id: 'R1S Biscuit Maker', disabled: true},
    { id: 'R1S Bloody Scratch', disabled: true},
    { id: 'R1S ActorSetPos Collector', disabled: true},
    { id: 'R1S Mouser Collect', disabled: true},
    { id: 'R1S Mouser', disabled: true},
    { id: 'R1S Headmarker Nailchipper Spread', disabled: true},
    { id: 'R1S Headmarker Grimalkin Gale Spread', disabled: true},
    { id: 'R1S Headmarker Pawprint Collector', disabled: true},
    { id: 'R1S Elevate and Eviscerate Launch Self', disabled: true},
    { id: 'R1S Elevate and Eviscerate Launch Other', disabled: true},
    { id: 'R1S Elevate and Eviscerate Stun Self', disabled: true},
    { id: 'R1S Elevate and Eviscerate Stun Other', disabled: true},
    { id: 'R1S Quadruple Swipe', disabled: true},
    { id: 'R1S Delayed Quadruple Swipe', disabled: true},
    { id: 'R1S Double Swipe', disabled: true},
    { id: 'R1S Delayed Double Swipe', disabled: true},
    { id: 'R1S Overshadow', disabled: true},
    { id: 'R1S Splintering Nails', disabled: true},
    { id: 'R1S Leaping One-two Paw', disabled: true},
    { id: 'R1S Leaping Quadruple Crossing', disabled: true},
    { id: 'R1S Leaping clone collector', disabled: true},
    {
      id: 'Souma R1S Shockwave Knockback Safe Directions',
      type: 'MapEffect',
      netRegex: { location: ['00', '03'], flags: mapEffectTileState.quickRebuid, capture: true },
      infoText: (_data, matches, output) => {
        if (matches.location === '00')
          return output.knockback({
            pos1: output.northwest(),
            pos2: output.southeast(),
          });
        return output.knockback({
          pos1: output.northeast(),
          pos2: output.southwest(),
        });
      },
      outputStrings: {
        knockback: {
          en: 'Knockback (${pos1}/${pos2} Safe)',
          de: 'Rückstoß (${pos1}/${pos2} sicher)',
          fr: 'Poussée (${pos1}/${pos2} sûr)',
          ja: 'ノックバック (${pos1}/${pos2} が安地)',
          cn: '击退 (${pos1}/${pos2} 安全)',
          ko: '넉백 (${pos1}/${pos2} 안전)',
        },
        northeast: Outputs.dirNE,
        northwest: Outputs.dirNW,
        southeast: Outputs.dirSE,
        southwest: Outputs.dirSW,
      },
    },
    {
      id: 'Souma R1S One-two Paw Right Left',
      type: 'StartsUsing',
      netRegex: { id: '9436', source: 'Black Cat', capture: false },
      durationSeconds: 9.5,
      response: Responses.goLeftThenRight(),
    },
    {
      id: 'Souma R1S One-two Paw Left Right',
      type: 'StartsUsing',
      netRegex: { id: '9439', source: 'Black Cat', capture: false },
      durationSeconds: 9.5,
      response: Responses.goRightThenLeft(),
    },
    {
      id: 'Souma R1S Biscuit Maker',
      type: 'StartsUsing',
      netRegex: { id: '9495', source: 'Black Cat', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'Souma R1S Bloody Scratch',
      type: 'StartsUsing',
      netRegex: { id: '9494', source: 'Black Cat', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'Souma R1S ActorSetPos Collector',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-F]{7}', capture: true },
      run: (data, matches) => {
        data.actorSetPosTracker[matches.id] = matches;
      },
    },
    {
      id: 'Souma R1S Mouser Collect',
      type: 'StartsUsing',
      netRegex: { id: '996C' },
      delaySeconds: 0.2,
      run: (data, matches) => {
        const actorSetPosLine = data.actorSetPosTracker[matches.sourceId];
        if (actorSetPosLine === undefined)
          return;
        const x = parseFloat(actorSetPosLine.x);
        const y = parseFloat(actorSetPosLine.y);
        const loc = Object.values(mapEffectData)
          .find((tile) =>
            tile.location.startsWith('0') && Math.abs(tile.centerX - x) < 1 &&
            Math.abs(tile.centerY - y) < 1
          );
        if (loc === undefined)
          return;
        const tile = loc.location;
        if (tile !== '09' && tile !== '0A')
          return;
        data.mouserMatchedTile = tile;
      },
    },
    {
      id: 'Souma R1S Mouser',
      type: 'StartsUsing',
      netRegex: { id: '996C', capture: false },
      delaySeconds: 0.2,
      // We don't need a suppressSeconds since only one of the SW/SE tiles will get hit twice
      durationSeconds: 11,
      infoText: (data, _matches, output) => {
        // Undef check for data.mouserMatchedTile needs to happen here as opposed to a `condition`,
        // as the delay needs to happen first.
        const dangerTile = data.mouserMatchedTile;
        if (dangerTile === undefined)
          return;
        // Danger tile is SW, so safe movement is SW => SE (Stay)
        if (dangerTile === '09') {
          return output.swSeStay({
            dir1: output['dirSW'](),
            sep: output.separator(),
            dir2: output['dirSE'](),
          });
        }
        const dirs = ['dirSW', 'dirSE', 'dirSW'].map((e) => output[e]());
        return output.combo({ dirs: dirs.join(output.separator()) });
      },
      run: (data) => delete data.mouserMatchedTile,
      outputStrings: {
        ...Directions.outputStrings8Dir,
        swSeStay: {
          en: '${dir1} ${sep} ${dir2} (Stay)',
          de: '${dir1} ${sep} ${dir2} (Stehen bleiben)',
          fr: '${dir1} ${sep} ${dir2} (Restez)',
          ja: '${dir1} ${sep} ${dir2} (そのまま)',
          cn: '${dir1} ${sep} ${dir2} (不动)',
          ko: '${dir1} ${sep} ${dir2} (그대로)',
        },
        separator: {
          en: ' => ',
          de: ' => ',
          fr: ' => ',
          ja: ' => ',
          cn: ' => ',
          ko: ' => ',
        },
        combo: {
          en: '${dirs}',
          de: '${dirs}',
          fr: '${dirs}',
          ja: '${dirs}',
          cn: '${dirs}',
          ko: '${dirs}',
        },
      },
    },
    {
      id: 'Souma R1S Headmarker Nailchipper Spread',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData.spreadMarker1, capture: true },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.outSpread(),
      outputStrings: {
        outSpread: {
          en: 'Out + Spread',
          de: 'Raus + Verteilen',
          fr: 'Extérieur + Dispersion',
          ja: '外へ + 散開',
          cn: '远离 + 分散',
          ko: '밖으로 + 산개',
        },
      },
    },
    {
      id: 'Souma R1S Headmarker Grimalkin Gale Spread',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData.spreadMarker2, capture: false },
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      id: 'Souma R1S Headmarker Pawprint Collector',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData.pawprint, capture: true },
      run: (data, matches) => data.lastPawprintTarget = matches.target,
    },
    {
      id: 'Souma R1S Elevate and Eviscerate Launch Self',
      type: 'StartsUsing',
      netRegex: { id: '9446', source: 'Copy Cat', capture: false },
      condition: (data) => data.me === data.lastPawprintTarget,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Launch Forward (Aim for uncracked tile)',
          de: 'Schlag Vorwärts (Ziel auf eine ganze Fläche)',
          fr: 'Saut vers l\'avant (Visez une tuile saine)',
          ja: '前方吹き飛ばし (割れていない床を狙って)',
          cn: '向前击飞 (瞄准完好的地板)',
          ko: '전방으로 날아감 (부서지지 않은 칸으로 유도)',
        },
      },
    },
    {
      id: 'Souma R1S Elevate and Eviscerate Launch Other',
      type: 'StartsUsing',
      netRegex: { id: '9446', source: 'Copy Cat', capture: false },
      condition: (data) => data.me !== data.lastPawprintTarget,
      infoText: (data, _matches, output) =>
        output.text({ target: data.party.member(data.lastPawprintTarget) }),
      outputStrings: {
        text: {
          en: '${target} Launch',
          de: '${target} Start',
          fr: '${target} Saut',
          ja: '${target} に吹き飛ばし',
          cn: '${target} 击飞',
          ko: '${target} 날아감',
        },
      },
    },
    {
      id: 'Souma R1S Elevate and Eviscerate Stun Self',
      type: 'StartsUsing',
      netRegex: { id: '9448', source: 'Copy Cat', capture: false },
      condition: (data) => data.me === data.lastPawprintTarget,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Stand on uncracked tile',
          de: 'Steh auf einer ganzen Fläche',
          fr: 'Restez sur une tuile saine',
          ja: '割れてない床に立って',
          cn: '被砸 (站在完好的场地)',
          ko: '부서지지 않은 칸으로 유도',
        },
      },
    },
    {
      id: 'Souma R1S Elevate and Eviscerate Stun Other',
      type: 'StartsUsing',
      netRegex: { id: '9448', source: 'Copy Cat', capture: false },
      condition: (data) => data.me !== data.lastPawprintTarget,
      infoText: (data, _matches, output) =>
        output.text({ target: data.party.member(data.lastPawprintTarget) }),
      outputStrings: {
        text: {
          en: '${target} Stun',
          de: '${target} Betäubung',
          fr: '${target} Étourdissment',
          ja: '${target} にスタン',
          cn: '${target} 被砸',
          ko: '${target} 기절',
        },
      },
    },
    {
      id: 'Souma R1S Quadruple Swipe',
      type: 'StartsUsing',
      netRegex: { id: '945D', source: 'Black Cat', capture: false },
      infoText: (_data, _matches, output) => output.partner(),
      outputStrings: {
        partner: {
          en: 'Partner Stacks',
          de: 'Partner sammeln',
          fr: 'Package partenaire',
          ja: 'ペア',
          cn: '和搭档分摊',
          ko: '파트너 쉐어',
        },
      },
    },
    {
      id: 'Souma R1S Delayed Quadruple Swipe',
      type: 'StartsUsing',
      netRegex: { id: '945D', source: 'Black Cat', capture: false },
      delaySeconds: 24.4,
      infoText: (_data, _matches, output) => output.partner(),
      outputStrings: {
        partner: {
          en: 'Partner Stacks',
          de: 'Partner sammeln',
          fr: 'Package partenaire',
          ja: 'ペア',
          cn: '和搭档分摊',
          ko: '파트너 쉐어',
        },
      },
    },
    {
      id: 'Souma R1S Double Swipe',
      type: 'StartsUsing',
      netRegex: { id: '945F', source: 'Black Cat', capture: false },
      infoText: (_data, _matches, output) => output.healerStacks(),
      outputStrings: {
        healerStacks: Outputs.healerGroups,
      },
    },
    {
      id: 'Souma R1S Delayed Double Swipe',
      type: 'StartsUsing',
      netRegex: { id: '945F', source: 'Black Cat', capture: false },
      delaySeconds: 24.4,
      infoText: (_data, _matches, output) => output.healerStacks(),
      outputStrings: {
        healerStacks: Outputs.healerGroups,
      },
    },
    {
      id: 'Souma R1S Overshadow',
      type: 'StartsUsing',
      netRegex: { id: '9497', source: 'Black Cat', capture: true },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Souma R1S Splintering Nails',
      type: 'StartsUsing',
      netRegex: { id: '9499', source: 'Black Cat', capture: false },
      infoText: (_data, _matches, output) => output.rolePositions(),
      outputStrings: {
        rolePositions: {
          en: 'Role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロールの担当位置へ',
          cn: '职能分散站位',
          ko: '직업별 산개위치로',
        },
      },
    },
    {
      id: 'Souma R1S Leaping One-two Paw',
      type: 'StartsUsing',
      netRegex: { id: ['944D', '944E', '944F', '9450'], source: 'Black Cat', capture: true },
      infoText: (_data, matches, output) => {
        if (matches.id === '944D') {
          return output.combo({ dir: output.dirW(), cleaves: output.outsideIn() });
        } else if (matches.id === '944E') {
          return output.combo({ dir: output.dirW(), cleaves: output.insideOut() });
        } else if (matches.id === '944F') {
          return output.combo({ dir: output.dirE(), cleaves: output.insideOut() });
        } else if (matches.id === '9450') {
          return output.combo({ dir: output.dirE(), cleaves: output.outsideIn() });
        }
        return output.unknown();
      },
      run: (data, matches) => {
        if (matches.id === '944D') {
          data.storedLeaps.oneTwoPaw.leftRight = 'left';
          data.storedLeaps.oneTwoPaw.firstCleaveSide = 'right';
        } else if (matches.id === '944E') {
          data.storedLeaps.oneTwoPaw.leftRight = 'left';
          data.storedLeaps.oneTwoPaw.firstCleaveSide = 'left';
        } else if (matches.id === '944F') {
          data.storedLeaps.oneTwoPaw.leftRight = 'right';
          data.storedLeaps.oneTwoPaw.firstCleaveSide = 'right';
        } else if (matches.id === '9450') {
          data.storedLeaps.oneTwoPaw.leftRight = 'right';
          data.storedLeaps.oneTwoPaw.firstCleaveSide = 'left';
        }
      },
      outputStrings: {
        dirE: {
          en: 'E',
          de: 'O',
          fr: 'E',
          ja: '東',
          cn: '场地右(东)侧',
          ko: '동',
        },
        dirW: {
          en: 'W',
          de: 'W',
          fr: 'O',
          ja: '西',
          cn: '场地左(西)侧',
          ko: '서',
        },
        insideOut: {
          en: 'Inside => Outside',
          de: 'Rein => Raus',
          fr: 'Intérieur => Extérieur',
          ja: '内側 => 外側',
          cn: '场内 => 场外',
          ko: '안으로 => 밖으로',
        },
        outsideIn: {
          en: 'Outside => Inside',
          de: 'Raus => Rein',
          fr: 'Extérieur => Intérieur',
          ja: '外側 => 内側',
          cn: '场外 => 场内',
          ko: '밖으로 => 안으로',
        },
        combo: {
          en: '${dir}, ${cleaves}',
          de: '${dir}, ${cleaves}',
          fr: '${dir}, ${cleaves}',
          ja: '${dir}, ${cleaves}',
          cn: '${dir}：${cleaves}',
          ko: '${dir}, ${cleaves}',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'Souma R1S Quadruple Crossing',
      type: 'StartsUsing',
      netRegex: { id: '943C', source: 'Black Cat', capture: true },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '引导站位',
        },
      },
    },
    {
      id: 'Souma R1S Leaping Quadruple Crossing',
      type: 'StartsUsing',
      netRegex: { id: ['9457', '982F'], source: 'Black Cat', capture: true },
      infoText: (_data, matches, output) => {
        if (matches.id === '9457') {
          return output.left();
        }
        if (matches.id === '982F') {
          return output.right();
        }
      },
      run: (data, matches) => {
        if (data.storedLeaps.oneTwoPaw.leftRight !== undefined) {
          if (matches.id === '9457') {
            data.storedLeaps.quadCross.leftRight = 'left';
          } else if (matches.id === '982F') {
            data.storedLeaps.quadCross.leftRight = 'right';
          }
        }
      },
      outputStrings: {
        left: {
          en: '向左平移 + 引导站位',
        },
        right: {
          en: '向右平移 + 引导站位',
        },
      },
    },
    {
      id: 'Souma R1S Leaping clone collector',
      type: 'Tether',
      netRegex: { id: '0066', capture: true },
      infoText: (data, matches, output) => {
        const actorSetPosEntry = data.actorSetPosTracker[matches.sourceId];
        if (actorSetPosEntry === undefined) {
          console.error(
            `R1S Leaping clone collector: Missing ActorSetPos line for actor ID ${matches.sourceId}`,
          );
          return;
        }
        const cloneNorthSouth = parseFloat(actorSetPosEntry.y) < 100 ? 'north' : 'south';
        if (data.storedLeaps.oneTwoPaw.firstCleaveSide !== undefined) {
          if (data.storedLeaps.oneTwoPaw.northSouth === undefined) {
            data.storedLeaps.oneTwoPaw.northSouth = cloneNorthSouth;
            return;
          }
        }
        if (data.storedLeaps.quadCross.leftRight !== undefined) {
          if (data.storedLeaps.quadCross.northSouth === undefined) {
            data.storedLeaps.quadCross.northSouth = cloneNorthSouth;
            return;
          }
        }
        if (
          data.storedLeaps.oneTwoPaw.northSouth !== undefined &&
          data.storedLeaps.quadCross.northSouth !== undefined
        ) {
          if (
            data.storedLeaps.oneTwoPaw.resolved !== true &&
            data.storedLeaps.oneTwoPaw.northSouth === cloneNorthSouth
          ) {
            data.storedLeaps.oneTwoPaw.resolved = true;
            let dir;
            if (data.storedLeaps.oneTwoPaw.northSouth === 'north') {
              if (data.storedLeaps.oneTwoPaw.leftRight === 'left')
                dir = 'dirE';
              else
                dir = 'dirW';
            } else {
              if (data.storedLeaps.oneTwoPaw.leftRight === 'left')
                dir = 'dirW';
              else
                dir = 'dirE';
            }
            let inOut = 'in';
            if (data.storedLeaps.oneTwoPaw.leftRight !== data.storedLeaps.oneTwoPaw.firstCleaveSide)
              inOut = 'out';
            return output.healerStacks({ dir: output[dir](), inOut: output[inOut]() });
          }
          if (
            data.storedLeaps.quadCross.resolved !== true &&
            data.storedLeaps.quadCross.northSouth === cloneNorthSouth
          ) {
            data.storedLeaps.quadCross.resolved = true;
            let dir;
            if (data.storedLeaps.quadCross.northSouth === 'north') {
              if (data.storedLeaps.quadCross.leftRight === 'left')
                dir = 'dirENE';
              else
                dir = 'dirWNW';
            } else {
              if (data.storedLeaps.quadCross.leftRight === 'left')
                dir = 'dirWSW';
              else
                dir = 'dirESE';
            }
            return output.proximity({ dir: output[dir]() });
          }
        }
      },
      outputStrings: {
        dirE: {
          en: 'E',
          de: 'O',
          fr: 'E',
          ja: '東',
          cn: '场地右(东)侧',
          ko: '동',
        },
        dirW: {
          en: 'W',
          de: 'W',
          fr: 'O',
          ja: '西',
          cn: '场地左(西)侧',
          ko: '서',
        },
        dirWNW: {
          en: 'WNW',
          de: 'WNW',
          fr: 'ONO',
          ja: '西北西(10時)',
          cn: '场地左偏上(西偏北)',
          ko: '10시',
        },
        dirWSW: {
          en: 'WSW',
          de: 'WSW',
          fr: 'OSO',
          ja: '西南西(8時)',
          cn: '场地左偏下(西偏南)',
          ko: '8시',
        },
        dirENE: {
          en: 'ENE',
          de: 'ONO',
          fr: 'ENE',
          ja: '東北東(2時)',
          cn: '场地右偏上(东偏北)',
          ko: '2시',
        },
        dirESE: {
          en: 'ESE',
          de: 'OSO',
          fr: 'ESE',
          ja: '東南東(4時)',
          cn: '场地右偏下(东偏南)',
          ko: '4시',
        },
        in: {
          en: 'In + Healer Stacks => Out',
          de: 'Rein + Auf Heiler sammeln => Raus',
          fr: 'Intérieur + Packs sur les heals => Extérieur',
          ja: '中へ + ヒラ頭割り => 外へ',
          cn: '场内 + 治疗分组分摊 => 场外',
          ko: '안으로 + 힐러 그룹 쉐어 => 밖으로',
        },
        out: {
          en: 'Out + Healer Stacks => In',
          de: 'Raus + Auf Heiler sammeln => Rein',
          fr: 'Extérieur + Packs sur les heals => Intérieur',
          ja: '外へ + ヒラ頭割り => 中へ',
          cn: '场外 + 治疗分组分摊 => 场内',
          ko: '밖으로 + 힐러 그룹 쉐어 => 안으로',
        },
        healerStacks: {
          en: 'Go ${dir} => ${inOut}',
          de: 'Geh nach ${dir} => ${inOut}',
          fr: 'Allez ${dir} => ${inOut}',
          ja: '${dir} へ => ${inOut}',
          cn: '${dir}：${inOut}',
          ko: '${dir}으로 이동 => ${inOut}',
        },
        proximity: {
          en: 'Go ${dir} => Proximity Baits + Spreads',
          de: 'Geh nach ${dir} => Nah-Distanz-Köder + Verteilen',
          fr: 'Allez ${dir} => Baits proches + Dispersion',
          ja: '${dir} へ => ボスに近づいて誘導 + 散開',
          cn: '${dir}：引导站位',
          ko: '${dir}으로 이동 => 대상 근처에서 유도 + 산개',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Black Cat': 'Schwarze Katze',
        'Copy Cat': 'felin(?:e|er|es|en) Nachahmung',
        'Soulshade': 'Seelenschatten',
      },
      'replaceText': {
        '\\(First\\)': '(Erster)',
        '\\(Second\\)': '(Zweiter)',
        '\\(cast\\)': '(wirken)',
        '\\(damage\\)': '(Schaden)',
        '\\(enrage\\)': '(Finalangriff)',
        '\\(hit\\)': '(Treffer)',
        '\\(hits\\)': '(Treffer)',
        '\\(jump\\)': '(Sprung)',
        '\\(knockback\\)': '(Rückstoß)',
        '\\(stacks\\)': '(Sammeln)',
        '\\(telegraphs\\)': '(Anzeige)',
        '\\(tethers\\)': '(Verbindungen)',
        'Biscuit Maker': 'Milchtritt',
        'Bloody Scratch': 'Blutiger Rundumkratzer',
        'Copycat': 'Feline Nachahmung',
        'Double Swipe': 'Doppelte Kralle',
        'Elevate and Eviscerate': 'Präziser Höhenflug',
        'Grimalkin Gale': 'Katerstrophaler Wind',
        'Impact': 'Impakt',
        'Leaping One-two Paw': 'Doppelklauensprung',
        'Leaping Quadruple Crossing': 'Vierfachklauensprung',
        'Mouser': 'Mäusejagd',
        'Nailchipper': 'Krallenschneider',
        'Nine Lives': 'Sieben Leben',
        '(?<! )One-two Paw': 'Doppelklaue',
        'Overshadow': 'Überschattung',
        'Predaceous Pounce': 'Feliner Beutezug',
        '(?<! )Quadruple Crossing': 'Vierfachklaue',
        'Quadruple Swipe': 'Vierfache Kralle',
        'Raining Cats': 'Katzenterror',
        'Shockwave': 'Schockwelle',
        'Soulshade': 'Seelenschatten',
        'Splintering Nails': 'Spreizklaue',
        'Tempestuous Tear': 'Stürmischer Schlitzer',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Black Cat': 'Black Cat',
        'Copy Cat': 'double félin',
        'Soulshade': 'ombre d\'âme',
      },
      'replaceText': {
        '\\(First\\)': '(Premier)',
        '\\(Second\\)': '(Deuxième)',
        '\\(cast\\)': '(Incante)',
        '\\(damage\\)': '(Dommage)',
        '\\(enrage\\)': '(Enrage)',
        '\\(hit\\)': '(Coup)',
        '\\(hits\\)': '(Coups)',
        '\\(jump\\)': '(Saut)',
        '\\(knockback\\)': '(Poussée)',
        '\\(stacks\\)': '(Package)',
        '\\(telegraphs\\)': '(Télégraphe)',
        '\\(tethers\\)': '(Liens)',
        'Biscuit Maker': 'Coup de tatane',
        'Bloody Scratch': 'Griffure sanglante',
        'Copycat': 'Double félin',
        'Double Swipe': 'Double fauchage',
        'Elevate and Eviscerate': 'Élévation éviscérante',
        'Grimalkin Gale': 'Rafale féline',
        'Impact': 'Impact',
        'Leaping One-two Paw': 'Griffade un-deux bondissante',
        'Leaping Quadruple Crossing': 'Quadruple griffade bondissante',
        'Mouser': 'Carnage dératiseur',
        'Nailchipper': 'Charcutage félin',
        'Nine Lives': 'Neuf-Vies',
        '(?<! )One-two Paw': 'Griffade un-deux',
        'Overshadow': 'Ombragement',
        'Predaceous Pounce': 'Prédation preste',
        '(?<! )Quadruple Crossing': 'Quadruple griffade',
        'Quadruple Swipe': 'Quadruple fauchage',
        'Raining Cats': 'Chataclysme',
        'Shockwave': 'Onde de choc',
        'Soulshade': 'ombre d\'âme',
        'Splintering Nails': 'Griffade brisante',
        'Tempestuous Tear': 'Déchiquetage diluvien',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Black Cat': 'ブラックキャット',
        'Copy Cat': 'コピーキャット',
        'Soulshade': 'ソウルシェード',
      },
      'replaceText': {
        'Biscuit Maker': 'ビスケットメーカー',
        'Bloody Scratch': 'ブラッディースクラッチ',
        'Copycat': 'コピーキャット',
        'Double Swipe': 'ダブルクロウ',
        'Elevate and Eviscerate': 'エレベート・エビセレート',
        'Grimalkin Gale': 'キャッタクリスム・ゲイル',
        'Impact': '衝撃',
        'Leaping One-two Paw': 'リーピング・デュアルネイル',
        'Leaping Quadruple Crossing': 'リーピング・クアドラプルネイル',
        'Mouser': 'マウサーラッシュ',
        'Nailchipper': 'ネイルチッパー',
        'Nine Lives': 'ナインライヴス',
        '(?<! )One-two Paw': 'デュアルネイル',
        'Overshadow': 'オーバーシャドウ',
        'Predaceous Pounce': 'キャッツレイド',
        '(?<! )Quadruple Crossing': 'クアドラプルネイル',
        'Quadruple Swipe': 'クァッドクロウ',
        'Raining Cats': 'レイニングキャッツ',
        'Shockwave': '衝撃波',
        'Soulshade': 'ソウルシェード',
        'Splintering Nails': 'スプレッドネイル',
        'Tempestuous Tear': 'テンペストテアー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Black Cat': '黑猫',
        'Copy Cat': '模仿猫',
        'Soulshade': '灵魂之影',
      },
      'replaceText': {
        '\\(First\\)': '(一)',
        '\\(Second\\)': '(二)',
        '\\(cast\\)': '(读条)',
        '\\(damage\\)': '(判定)',
        '\\(enrage\\)': '(狂暴)',
        '\\(hit\\)': '(命中)',
        '\\(hits\\)': '(命中)',
        '\\(jump\\)': '(跳)',
        '\\(knockback\\)': '(击退)',
        '\\(stacks\\)': '(分摊)',
        '\\(telegraphs\\)': '(预兆)',
        '\\(tethers\\)': '(连线)',
        'Biscuit Maker': '踩奶',
        'Bloody Scratch': '血腥抓挠',
        'Copycat': '模仿之猫',
        'Double Swipe': '双重利爪',
        'Elevate and Eviscerate': '腾身开膛',
        'Grimalkin Gale': '猫怪突风',
        'Impact': '冲击',
        'Leaping One-two Paw': '猫跳二连尖甲',
        'Leaping Quadruple Crossing': '猫跳四连尖甲',
        'Mouser': '捕鼠',
        'Nailchipper': '剪指甲',
        'Nine Lives': '猫生九命',
        '(?<! )One-two Paw': '二连尖甲',
        'Overshadow': '超暗影',
        'Predaceous Pounce': '迅猫急袭',
        '(?<! )Quadruple Crossing': '四连尖甲',
        'Quadruple Swipe': '四重利爪',
        'Raining Cats': '倾盆大猫',
        'Shockwave': '冲击波',
        'Soulshade': '灵魂之影',
        'Splintering Nails': '碎裂尖甲',
        'Tempestuous Tear': '暴风裂',
      },
    },
  ],
});
