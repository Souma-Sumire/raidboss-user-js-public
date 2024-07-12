const tileNames = [
  'northCorner',
  'northwestNorth',
  'northeastNorth',
  'northwestWest',
  'insideNorth',
  'northeastEast',
  'westCorner',
  'insideWest',
  'insideEast',
  'eastCorner',
  'southwestWest',
  'insideSouth',
  'southeastEast',
  'southwestSouth',
  'southeastSouth',
  'southCorner',
];
const syncTilesMap = {
  // y1: { x1: tileName, x2: tileName, etc. }
  // Use rounded ints for all positions to avoid fuzzy floating point values on StartsUsing lines
  89: { 100: 'northCorner' },
  93: {
    96: 'northwestNorth',
    104: 'northeastNorth',
  },
  96: {
    93: 'northwestWest',
    100: 'insideNorth',
    107: 'northeastEast',
  },
  100: {
    89: 'westCorner',
    96: 'insideWest',
    104: 'insideEast',
    111: 'eastCorner',
  },
  104: {
    93: 'southwestWest',
    100: 'insideSouth',
    107: 'southeastEast',
  },
  107: {
    96: 'southwestSouth',
    104: 'southeastSouth',
  },
  111: { 100: 'southCorner' },
};
const findClosestTile = (x, y) => {
  const tileValues = Object.keys(syncTilesMap).map(Number);
  const closestX = tileValues.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a);
  const closestY = tileValues.reduce((a, b) => Math.abs(b - y) < Math.abs(a - y) ? b : a);
  const possibleTiles = syncTilesMap[closestY];
  if (possibleTiles === undefined) {
    return 'unknown';
  }
  const closestTile = possibleTiles[closestX];
  if (closestTile === undefined) {
    return 'unknown';
  }
  return closestTile;
};
const quadrantNames = ['north', 'east', 'south', 'west'];
const knockPlatforms = ['northwest', 'northeast', 'southwest', 'southeast'];
// Forged Track
// The NE & NW platforms always have wind+fire tethers; SE & SW platforms always have line cleaves
// There are two possible arrangements for wind/fire and two for line cleave, so four in total.
// 1. Fire/Wind: Either both pairs of fire tethers will be closer to N than wind tethers, or both
//     will be closer to E&W. We'll call these 'fireInside' and 'fireOutside' respectively.
// 2. Line Cleaves: The line cleave tethers are identical for SE & SW, but one set is
//    inverted (e.g. mirror platform and main platform connections are swapped).
//    The easiest way to describe / distingish the two possible configurations is to look at
//    adjacent pairs of tiles on the SE/SW edge of the *main plat*. On one intercard, the tethers
//    coming from the adjacent tile pairs cross each other; on the other intercard, they do not
//    cross each other but run more parallel. So, in one configuration, the adjacent SE tethers
//    cross while the adjacent SW tethers do not; in the second config, it's vice-versa.
//    We'll call these configurations 'seCross' and 'swCross' respectively.
// tldr; 4 possible arrangements: fireInside or fireOutside + seCross or swCross.
//
// We can determine which it is based on MapEffect combinations:
//   locations '05'/'08' - NW/NE platforms (unclear which is which, but doesn't matter):
//      { location: '05', flags: '00020001' } - fireInside
//      { location: '08', flags: '00020001' } - fireOutside
//   locations '02'/'03' - SE/SW platforms (same):
//      { location: '02', flags: '02000100' } - swCross
//      { location: '03', flags: '02000100' } - seCross
const forgedTrackMapEffectFlags = ['00020001', '02000100'];
const forgedTrackMapEffectLocs = ['02', '03', '05', '08'];
// define "safe lanes" for each intercardinal side of the main platform,
// consisting of all 4 tiles on that side.  Order the corner tiles last,
// so they will be used for a safe callout only if no intercard tile is safe
const forgedTrackSafeLanes = {
  'northeast': ['northeastNorth', 'northeastEast', 'northCorner', 'eastCorner'],
  'southeast': ['southeastEast', 'southeastSouth', 'eastCorner', 'southCorner'],
  'southwest': ['southwestSouth', 'southwestWest', 'southCorner', 'westCorner'],
  'northwest': ['northwestWest', 'northwestNorth', 'westCorner', 'northCorner'],
};
// For seCross & swCross, handle the crossing tether logic by mapping each of the possible tiles
// the sword could start on, through its tether, to the near and far tiles it will hit
// (thereby eliminating those as potential safe spots).
const crossMap = {
  'seCross': {
    'eastCorner': ['southeastEast', 'northwestNorth'],
    'southeastEast': ['southCorner', 'westCorner'],
    'southeastSouth': ['eastCorner', 'northCorner'],
    'southwestSouth': ['southCorner', 'eastCorner'],
    'southwestWest': ['westCorner', 'northCorner'],
    'westCorner': ['southwestSouth', 'northeastEast'], // crosses to southwestSouth
  },
  'swCross': {
    'eastCorner': ['southeastSouth', 'northwestWest'],
    'southeastEast': ['eastCorner', 'northCorner'],
    'southeastSouth': ['southCorner', 'westCorner'],
    'southwestSouth': ['westCorner', 'northCorner'],
    'southwestWest': ['southCorner', 'eastCorner'],
    'westCorner': ['southwestWest', 'northeastNorth'], // crosses to southwestWest
  },
};
// A `southCorner` starting sword needs special handling, as it will hit different tiles
// depending on whether it originates from the southeast or southwest platform.
const crossMapSouthCorner = {
  'seCross': {
    'southeast': ['southeastSouth', 'northwestWest'],
    'southwest': ['southwestWest', 'northeastNorth'], // southCorner crosses to southwestWest
  },
  'swCross': {
    'southeast': ['southeastEast', 'northwestNorth'],
    'southwest': ['southwestSouth', 'northeastEast'], // southCorner crosses to southwestSouth
  },
};
const stayGoOutputStrings = {
  stay: {
    en: 'Stay',
    de: 'Bleib Stehen',
    cn: '原地'
  },
  goAcross: {
    en: 'Go Across',
    de: 'Geh rüber',
    cn: '去对面'
  },
};
Options.Triggers.push({
  id: 'SoumaEverkeepExtreme',
  zoneId: ZoneId.EverkeepExtreme,
  initData: () => {
    return {
      phase: 'arena',
      unsafeTiles: [],
      forgedTrackSafeTiles: [],
      drumTargets: [],
      drumFar: false,
      unsafeQuadrants: [],
      cantTakeTornadoJump: false,
      seenHalfCircuit: false,
    };
  },
  triggers: [
    {
      id: 'Zoraal Ja Ex Phase Tracker',
      type: 'StartsUsing',
      // 9397 - Dawn of an Age
      // 938F - Drum of Vollok
      // 938A - Projection of Triumph
      // 93A2 - Multidirectional Divide (needed to reset to arena phase before enrage)
      netRegex: { id: ['9397', '938F', '938A', '93A2'], source: 'Zoraal Ja' },
      run: (data, matches) => {
        // Knockaround is preceded by a 'Dawn of an Age' cast, but catching 'Drum of Vollok'
        // allows us to detect phase correctly.
        if (matches.id === '9397')
          data.phase = 'swords';
        else if (matches.id === '938F')
          data.phase = 'knockaround';
        else if (matches.id === '938A')
          data.phase = 'lines';
        else
          data.phase = 'arena';
      },
    },
    {
      id: 'Zoraal Ja Ex Actualize',
      type: 'StartsUsing',
      netRegex: { id: '9398', source: 'Zoraal Ja', capture: false },
      response: Responses.aoe(),
    },
    {
      // Right sword glowing (right safe)
      id: 'Zoraal Ja Ex Forward Half Right Sword',
      type: 'StartsUsing',
      netRegex: { id: ['937B', '999A'], source: 'Zoraal Ja', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 'knockaround') { // 999A is the knockaround version
          const stayGo = data.drumFar ? output.goAcross() : output.stay();
          return output.frontRightKnockaround({ stayGo: stayGo });
        }
        return output.frontRight();
      },
      outputStrings: {
        frontRight: {
          en: 'Front + Boss\'s Right',
          de: 'Vorne + Rechts vom Boss',
          cn: 'Boss 右前',
        },
        ...stayGoOutputStrings,
        frontRightKnockaround: {
          en: 'Front + Boss\'s Right (${stayGo})',
          de: 'Vorne + Rechts vom Boss (${stayGo})',
          cn: 'Boss 右前 (${stayGo})',
        },
      },
    },
    {
      // Left sword glowing (left safe)
      id: 'Zoraal Ja Ex Forward Half Left Sword',
      type: 'StartsUsing',
      netRegex: { id: ['937C', '999B'], source: 'Zoraal Ja', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 'knockaround') { // 999B is the knockaround version
          const stayGo = data.drumFar ? output.goAcross() : output.stay();
          return output.frontLeftKnockaround({ stayGo: stayGo });
        }
        return output.frontLeft();
      },
      outputStrings: {
        frontLeft: {
          en: 'Front + Boss\'s Left',
          de: 'Vorne + Links vom Boss',
          cn: 'Boss 左前',
        },
        ...stayGoOutputStrings,
        frontLeftKnockaround: {
          en: 'Front + Boss\'s Left (${stayGo})',
          de: 'Vorne + Links vom Boss (${stayGo})',
          cn: 'Boss 左前 (${stayGo})',
        },
      },
    },
    {
      // Right sword glowing (left safe)
      id: 'Zoraal Ja Ex Backward Half Right Sword',
      type: 'StartsUsing',
      netRegex: { id: ['937D', '999C'], source: 'Zoraal Ja', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 'knockaround') { // 999C is the knockaround version
          const stayGo = data.drumFar ? output.stay() : output.goAcross();
          return output.backRightKnockaround({ stayGo: stayGo });
        }
        return output.backRight();
      },
      outputStrings: {
        backRight: {
          en: 'Behind + Boss\'s Left',
          de: 'Hinten + Links vom Boss',
          cn: 'Boss 左前',
        },
        ...stayGoOutputStrings,
        backRightKnockaround: {
          en: 'Behind + Boss\'s Left (${stayGo})',
          de: 'Hinten + Links vom Boss (${stayGo})',
          cn: 'Boss 左前 (${stayGo})',
        },
      },
    },
    {
      // Left sword glowing (right safe)
      id: 'Zoraal Ja Ex Backward Half Left Sword',
      type: 'StartsUsing',
      netRegex: { id: ['937E', '999D'], source: 'Zoraal Ja', capture: false },
      alertText: (data, _matches, output) => {
        if (data.phase === 'knockaround') { // 999D is the knockaround version
          const stayGo = data.drumFar ? output.stay() : output.goAcross();
          return output.backLeftKnockaround({ stayGo: stayGo });
        }
        return output.backLeft();
      },
      outputStrings: {
        backLeft: {
          en: 'Behind + Boss\'s Right',
          de: 'Hinten + Rechts vom Boss',
          cn: 'Boss 右前',
        },
        ...stayGoOutputStrings,
        backLeftKnockaround: {
          en: 'Behind + Boss\'s Right (${stayGo})',
          de: 'Hinten + Rechts vom Boss (${stayGo})',
          cn: 'Boss 右前 (${stayGo})',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Regicidal Rage',
      type: 'StartsUsing',
      netRegex: { id: '993B', source: 'Zoraal Ja', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tetherBuster: Outputs.tetherBusters,
          busterAvoid: Outputs.avoidTetherBusters,
        };
        if (data.role === 'tank')
          return { alertText: output.tetherBuster() };
        return { infoText: output.busterAvoid() };
      },
    },
    {
      id: 'Zoraal Ja Ex Dawn of an Age',
      type: 'StartsUsing',
      netRegex: { id: '9397', source: 'Zoraal Ja', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'Zoraal Ja Ex Chasm of Vollok Sword Collect',
      type: 'StartsUsing',
      netRegex: { id: '9399', source: 'Fang' },
      run: (data, matches) => {
        const mirrorAdjust = 21.21; // sqrt(5^2 + 5^2) * 3
        let swordX = parseFloat(matches.x);
        let swordY = parseFloat(matches.y);
        if (swordX < 100 && swordY < 100) { // NW mirror platform
          swordX += mirrorAdjust;
          swordY += mirrorAdjust;
        } else if (swordX < 100) { // SW mirror platform
          swordX += mirrorAdjust;
          swordY -= mirrorAdjust;
        } else if (swordY < 100) { // NE mirror platform
          swordX -= mirrorAdjust;
          swordY += mirrorAdjust;
        } else { // SE mirror platform
          swordX -= mirrorAdjust;
          swordY -= mirrorAdjust;
        }
        const adjustedTile = findClosestTile(swordX, swordY);
        if (adjustedTile === 'unknown')
          return;
        data.unsafeTiles.push(adjustedTile);
      },
    },
    {
      id: 'Zoraal Ja Ex Chasm of Vollok + Half Full',
      type: 'StartsUsing',
      // 9368 - Right Sword (left/west safe)
      // 9369 - Left Sword (right/east safe)
      // Boss always faces north
      netRegex: { id: ['9368', '9369'], source: 'Zoraal Ja' },
      condition: (data) => data.phase === 'swords' && !data.seenHalfCircuit,
      durationSeconds: 6,
      alertText: (data, matches, output) => {
        // To make this call somewhat reasonable, use the following priority system
        // for calling a safe tile, depending on sword cleave:
        //   1. insideEast/insideWest
        //   2. insideNorth/insideSouth, lean E/W
        //   3. If all inside are bad, the outer intercard pairs (E/W depending on cleave)
        const safeSide = matches.id === '9368' ? 'west' : 'east';
        const leanOutput = matches.id === '9368' ? output.leanWest() : output.leanEast();
        const safeTiles = tileNames.filter((tile) => !data.unsafeTiles.includes(tile));
        if (safeTiles.length !== 8)
          return;
        if (safeSide === 'west' && safeTiles.includes('insideWest'))
          return output.insideWest();
        else if (safeSide === 'east' && safeTiles.includes('insideEast'))
          return output.insideEast();
        else if (safeTiles.includes('insideNorth'))
          return output.insideNS({ lean: leanOutput });
        else if (safeSide === 'east')
          return output.intercardsEast();
        return output.intercardsWest();
      },
      run: (data) => data.unsafeTiles = [],
      outputStrings: {
        insideWest: {
          en: 'Inner West Diamond',
          de: 'Innerer Westlicher Diamant',
          cn: '内部左',
        },
        insideEast: {
          en: 'Inner East Diamond',
          de: 'Innerer Östlicher Diamant',
          cn: '内部右',
        },
        insideNS: {
          en: 'Inner North/South Diamonds - ${lean}',
          de: 'Innerer Nördlicher/Südlicher Diamant - ${lean}',
          cn: '内部上/下 (${lean})',
        },
        leanWest: {
          en: 'Lean West',
          de: 'Westlich halten',
          cn: '偏左',
        },
        leanEast: {
          en: 'Lean East',
          de: 'Östlich halten',
          cn: '偏右',
        },
        intercardsEast: {
          en: 'Outer Intercard Diamonds - East',
          de: 'Äußere Interkardinale Diamanten - Osten',
          cn: '右侧外围（除了角落）',
        },
        intercardsWest: {
          en: 'Outer Intercard Diamonds - West',
          de: 'Äußere Interkardinale Diamanten - Westen',
          cn: '左侧外围（除了角落）',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Swords Spread Markers',
      type: 'HeadMarker',
      netRegex: { id: '00B9' },
      condition: (data, matches) => data.phase === 'swords' && data.me === matches.target,
      alertText: (_data, _matches, output) => output.safeSpread(),
      outputStrings: {
        safeSpread: Outputs.spread,
      },
    },
    // For Forged Track, we use four triggers:
    // 1. Collect the MapEffect lines to determine the fire/wind/line cleave configuration
    // 2. Collect the fire/wind sword, determine the effect and safe direction
    // 3. Collect each line cleave sword to determine safe lanes
    // 4. Provide a consolidated alert
    {
      id: 'Zoraal Ja Ex Forged Track MapEffect Collect',
      type: 'MapEffect',
      netRegex: { flags: forgedTrackMapEffectFlags, location: forgedTrackMapEffectLocs },
      condition: (data) => data.phase === 'swords',
      run: (data, matches) => {
        if (matches.location === '05')
          data.fireWindSetup = 'fireInside';
        else if (matches.location === '08')
          data.fireWindSetup = 'fireOutside';
        else if (matches.location === '02')
          data.lineCleaveSetup = 'swCross';
        else if (matches.location === '03')
          data.lineCleaveSetup = 'seCross';
      },
    },
    {
      id: 'Zoraal Ja Ex Forged Track Fire/Wind Sword Collect',
      type: 'StartsUsing',
      netRegex: { id: '939C', source: 'Fang' },
      condition: (data, matches) => data.phase === 'swords' && parseFloat(matches.y) < 85,
      run: (data, matches) => {
        if (data.fireWindSetup === undefined)
          return;
        // Same as Chasm of Vollok, remap the sword position to a corresponding main platform tile
        // But unlike Chasm of Vollok, these Fang actors are positioned at the bak of the tiles,
        // so we need a slightly different mirrorAdjust value
        const mirrorAdjust = 22.98; // sqrt(5^2 + 5^2) * 3.25
        const swordY = parseFloat(matches.y) + mirrorAdjust;
        let swordX = parseFloat(matches.x);
        let fireWindPlatform;
        if (swordX < 85) {
          swordX += mirrorAdjust;
          fireWindPlatform = 'northwest';
        } else {
          swordX -= mirrorAdjust;
          fireWindPlatform = 'northeast';
        }
        const swordTile = findClosestTile(swordX, swordY);
        if (swordTile === 'unknown')
          return;
        // To avoid repeated nested if/else statements, assume we're seeing fireInside.
        // At the end, check the real value, and if it's fireOutside, just flip this bool
        // before setting `data.fireWindEffect` (it works because they're mirrored).
        let isFireCleave = false;
        // Since the fire/wind tethers always map to the same tiles, we can use fixed logic
        if (swordTile === 'northCorner') {
          isFireCleave = true;
          // corner tile could have two outcomes depending which platform it came from
          data.fireWindSafeDir = fireWindPlatform === 'northwest'
            ? 'southwest'
            : 'southeast';
        } else if (swordTile === 'northeastNorth') {
          isFireCleave = true;
          data.fireWindSafeDir = 'northwest';
        } else if (swordTile === 'northeastEast')
          data.fireWindSafeDir = 'southeast';
        else if (swordTile === 'eastCorner')
          data.fireWindSafeDir = 'northwest';
        else if (swordTile === 'northwestNorth') {
          isFireCleave = true;
          data.fireWindSafeDir = 'northeast';
        } else if (swordTile === 'northwestWest')
          data.fireWindSafeDir = 'southwest';
        else if (swordTile === 'westCorner')
          data.fireWindSafeDir = 'northeast';
        else
          return;
        data.forgedTrackSafeTiles = forgedTrackSafeLanes[data.fireWindSafeDir];
        if (data.fireWindSetup === 'fireOutside')
          isFireCleave = !isFireCleave;
        data.fireWindEffect = isFireCleave ? 'fire' : 'wind';
      },
    },
    {
      id: 'Zoraal Ja Ex Forged Track Cleave Swords Collect',
      type: 'StartsUsing',
      netRegex: { id: '939C', source: 'Fang' },
      condition: (data, matches) => data.phase === 'swords' && parseFloat(matches.y) > 115,
      delaySeconds: 0.2,
      run: (data, matches) => {
        if (data.lineCleaveSetup === undefined || data.forgedTrackSafeTiles.length !== 4)
          return;
        const mirrorAdjust = 22.98; // sqrt(5^2 + 5^2) * 3.25
        const swordY = parseFloat(matches.y) - mirrorAdjust;
        let swordX = parseFloat(matches.x);
        let lineCleavePlatform;
        if (swordX < 85) {
          swordX += mirrorAdjust;
          lineCleavePlatform = 'southwest';
        } else {
          swordX -= mirrorAdjust;
          lineCleavePlatform = 'southeast';
        }
        const swordTile = findClosestTile(swordX, swordY);
        if (swordTile === 'unknown')
          return `Unknown Tile`;
        const unsafeTiles = swordTile === 'southCorner'
          ? crossMapSouthCorner[data.lineCleaveSetup][lineCleavePlatform]
          : crossMap[data.lineCleaveSetup][swordTile];
        if (unsafeTiles === undefined)
          return;
        data.unsafeTiles.push(...unsafeTiles);
      },
    },
    {
      id: 'Zoraal Ja Ex Forged Track',
      type: 'StartsUsing',
      netRegex: { id: '935F', source: 'Zoraal Ja', capture: false },
      condition: (data) => data.phase === 'swords',
      delaySeconds: 0.4,
      durationSeconds: 9,
      alertText: (data, _matches, output) => {
        if (data.fireWindEffect === undefined)
          return output.unknown();
        const fireWindOutput = output[data.fireWindEffect]();
        if (data.fireWindSafeDir === undefined)
          return fireWindOutput;
        const fireWindSafeOutput = output.fireWindSafe({
          fireWind: fireWindOutput,
          safeDir: output[data.fireWindSafeDir](),
        });
        // There should always be two safe tiles, but we only need one. Use the first one in the
        // array, as it is ordered to give preference to intercard (non-corner) tiles.
        let tileOutput;
        const safeTiles = data.forgedTrackSafeTiles.filter((tile) =>
          !data.unsafeTiles.includes(tile)
        );
        if (safeTiles.length !== 2)
          return `WTF? ${safeTiles.length} = ${safeTiles.join('|')}`;
        const [safe0] = safeTiles;
        if (safe0 === undefined)
          return fireWindSafeOutput;
        // if the first safe tile is a corner, both are. So we can call corners generally as being
        // safe (to avoid overloading the player with directional text).
        // Otherwise, call leanLeft/leanRight based on the tile orientation to the boss.
        if (safe0.includes('Corner'))
          tileOutput = output.corner();
        else if (data.fireWindSafeDir === 'northwest')
          tileOutput = safe0 === 'northwestNorth' ? output.leanLeft() : output.leanRight();
        else if (data.fireWindSafeDir === 'northeast')
          tileOutput = safe0 === 'northeastEast' ? output.leanLeft() : output.leanRight();
        else if (data.fireWindSafeDir === 'southeast')
          tileOutput = safe0 === 'southeastSouth' ? output.leanLeft() : output.leanRight();
        else
          tileOutput = safe0 === 'southwestWest' ? output.leanLeft() : output.leanRight();
        return output.combo({ fireWindCombo: fireWindSafeOutput, tile: tileOutput });
      },
      run: (data) => {
        data.forgedTrackSafeTiles = [];
        data.unsafeTiles = [];
        delete data.fireWindSetup;
        delete data.lineCleaveSetup;
        delete data.fireWindEffect;
        delete data.fireWindSafeDir;
      },
      outputStrings: {
        leanLeft: {
          en: '<= Inside Left (Facing Boss)',
          cn: '<= 站在左边(面向Boss)',
        },
        leanRight: {
          en: 'Inside Right (Facing Boss) =>',
          cn: '站在右边(面向Boss) =>',
        },
        corner: {
          en: 'Corners Safe',
          cn: '角落安全',
        },
        northwest: {
          en: 'Northwest',
          cn: '左上',
        },
        northeast: {
          en: 'Northeast',
          cn: '右上',
        },
        southeast: {
          en: 'Southeast',
          cn: '右下',
        },
        southwest: {
          en: 'Southwest',
          cn: '左下',
        },
        fire: {
          en: 'Go Far',
          cn: ''
        },
        wind: Outputs.knockback,
        fireWindSafe: {
          en: '${fireWind} ${safeDir}',
          cn: '${fireWind} ${safeDir}',
        },
        combo: {
          en: '${fireWindCombo} + ${tile}',
          cn: '${fireWindCombo}的边 + ${tile}',
        },
        unknown: {
          en: 'Avoid Swords',
          cn: '躲避剑',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Bitter Whirlwind',
      type: 'StartsUsing',
      netRegex: { id: '993E', source: 'Zoraal Ja' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'Zoraal Ja Ex Drum of Vollok Collect',
      type: 'StartsUsing',
      netRegex: { id: '938F', source: 'Zoraal Ja' },
      run: (data, matches) => data.drumTargets.push(matches.target),
    },
    {
      id: 'Zoraal Ja Ex Drum of Vollok',
      type: 'StartsUsing',
      netRegex: { id: '938F', source: 'Zoraal Ja', capture: false },
      delaySeconds: 0.3,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.drumTargets.includes(data.me))
          return output.enumOnYou();
        data.drumFar = true;
        return output.enumKnockback();
      },
      run: (data) => data.drumTargets = [],
      outputStrings: {
        enumOnYou: {
          en: 'Partner stack (on you)',
          de: 'Mit Partner sammeln (auf dir)',
          cn: '与搭档分摊 (点你)',
        },
        enumKnockback: {
          en: 'Partner stack (knockback)',
          de: 'Mit Partner sammeln (Rückstoß)',
          cn: '与搭档分摊 (击退)',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Knockaround Swords Collect',
      type: 'StartsUsing',
      netRegex: { id: '9393', source: 'Fang' },
      condition: (data) => data.phase === 'knockaround',
      run: (data, matches) => {
        const mirrorAdjust = 21.21;
        let swordX = parseFloat(matches.x);
        let swordY = parseFloat(matches.y);
        // It seems like the mirror platform is always either NW or NE of the main platform?
        // But handle all 4 possibilities just in case.
        if (swordX < 91 && swordY < 91) {
          data.knockPlatform = 'northwest';
          swordX += mirrorAdjust;
          swordY += mirrorAdjust;
        } else if (swordX < 91) {
          data.knockPlatform = 'southwest';
          swordX += mirrorAdjust;
          swordY -= mirrorAdjust;
        } else if (swordY < 91) {
          data.knockPlatform = 'northeast';
          swordX -= mirrorAdjust;
          swordY += mirrorAdjust;
        } else if (swordY > 109) {
          data.knockPlatform = 'southeast';
          swordX -= mirrorAdjust;
          swordY -= mirrorAdjust;
        }
        let swordQuad;
        if (swordX < 98)
          swordQuad = 'west';
        else if (swordX > 102)
          swordQuad = 'east';
        else if (swordY < 98)
          swordQuad = 'north';
        else
          swordQuad = 'south';
        data.unsafeQuadrants.push(swordQuad);
      },
    },
    {
      id: 'Zoraal Ja Ex Knockaround Swords + Spread',
      type: 'StartsUsing',
      netRegex: { id: '9393', source: 'Fang', capture: false },
      condition: (data) => data.phase === 'knockaround',
      delaySeconds: 0.2,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const safeQuadrants = quadrantNames.filter((quad) => !data.unsafeQuadrants.includes(quad));
        if (safeQuadrants.length !== 2 || data.knockPlatform === undefined)
          return output.unknown();
        // Call these as left/right based on whether the player is on the mirror plat or not
        // Assume they are facing the boss at this point.
        // There will always be one safe quadrant closest to the boss on each platform.
        if (data.drumFar) { // player is on the mirror platform
          if (data.knockPlatform === 'northwest')
            return safeQuadrants.includes('east')
              ? output.left()
              : (safeQuadrants.includes('south')
                ? output.right()
                : output.unknown());
          else if (data.knockPlatform === 'northeast')
            return safeQuadrants.includes('west')
              ? output.right()
              : (safeQuadrants.includes('south')
                ? output.left()
                : output.unknown());
          else if (data.knockPlatform === 'southeast')
            return safeQuadrants.includes('west')
              ? output.left()
              : (safeQuadrants.includes('north')
                ? output.right()
                : output.unknown());
          else if (data.knockPlatform === 'southwest')
            return safeQuadrants.includes('east')
              ? output.right()
              : (safeQuadrants.includes('north')
                ? output.left()
                : output.unknown());
          return output.unknown();
        }
        // player is on the main platform
        if (data.knockPlatform === 'northwest')
          return safeQuadrants.includes('west')
            ? output.left()
            : (safeQuadrants.includes('north')
              ? output.right()
              : output.unknown());
        else if (data.knockPlatform === 'northeast')
          return safeQuadrants.includes('north')
            ? output.left()
            : (safeQuadrants.includes('east')
              ? output.right()
              : output.unknown());
        else if (data.knockPlatform === 'southeast')
          return safeQuadrants.includes('east')
            ? output.left()
            : (safeQuadrants.includes('south')
              ? output.right()
              : output.unknown());
        else if (data.knockPlatform === 'southwest')
          return safeQuadrants.includes('south')
            ? output.left()
            : (safeQuadrants.includes('west')
              ? output.right()
              : output.unknown());
        return output.unknown();
      },
      outputStrings: {
        unknown: {
          en: 'Safe Quadrant + Spread Out',
          de: 'Sicherer Quadrant + Verteilen',
          cn: '安全角 + 散开',
        },
        left: {
          en: '<= Front Left Quadrant + Spread Out',
          de: '<= Vorderer linker Quadrant + Verteilen',
          cn: '左前方角 + 散开',
        },
        right: {
          en: 'Front Right Quadrant + Spread Out =>',
          de: 'Vorderer rechter Quadrant + Verteilen =>',
          cn: '右前方角 + 散开 =>',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Knockaround Tornado Debuff Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '830' },
      condition: (data, matches) => {
        return data.phase === 'knockaround' &&
          data.me === matches.target &&
          parseFloat(matches.duration) > 10; // we don't care about the shorter one
      },
      run: (data) => data.cantTakeTornadoJump = true,
    },
    {
      id: 'Zoraal Ja Ex Knockaround Tornado Debuff Lose',
      type: 'LosesEffect',
      netRegex: { effectId: '830' },
      condition: (data, matches) => data.phase === 'knockaround' && data.me === matches.target,
      run: (data) => data.cantTakeTornadoJump = false,
    },
    {
      id: 'Zoraal Ja Ex Duty\'s Edge',
      type: 'StartsUsing',
      netRegex: { id: '9374', source: 'Zoraal Ja', capture: false },
      durationSeconds: 10,
      response: Responses.stackMarker(),
    },
    // Calling 'Stay'/'Go Across' is based on whether the player receives the chains debuff
    // and whether they still have the Wind Resistance debuff from jumping for Forward/Backward Half
    // This can lead to some potentially erroneous results - e.g., a player dies (debuff removed
    // early), is rezzed on the wrong platform, jumps early, etc.  We could instead call stay/go by
    // role, but that would break in non-standard comps, and could still lead to the same erroneous
    // results.  There doesn't seem to be a perfect solution here.
    {
      id: 'Zoraal Ja Ex Burning Chains',
      type: 'GainsEffect',
      netRegex: { effectId: '301' },
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        const stayGo = data.cantTakeTornadoJump ? output.stay() : output.goAcross();
        return output.combo({ breakChains: output.breakChains(), stayGo: stayGo });
      },
      outputStrings: {
        breakChains: Outputs.breakChains,
        ...stayGoOutputStrings,
        combo: {
          en: '${breakChains} (${stayGo})',
          de: '${breakChains} (${stayGo})',
          cn: '${breakChains} (${stayGo})',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Half Circuit Left/Right Collect',
      type: 'StartsUsing',
      // 936B - Right Sword (left safe)
      // 936C - Left Sword (right safe)
      netRegex: { id: ['936B', '936C'], source: 'Zoraal Ja' },
      run: (data, matches) => data.halfCircuitSafeSide = matches.id === '936B' ? 'left' : 'right',
    },
    {
      id: 'Zoraal Ja Ex Half Circuit',
      type: 'StartsUsing',
      // 93A0 - Swords Out (in safe)
      // 93A1 - Swords In (out safe)
      netRegex: { id: ['93A0', '93A1'], source: 'Zoraal Ja' },
      delaySeconds: 0.3,
      alertText: (data, matches, output) => {
        const inOut = matches.id === '93A0' ? output.in() : output.out();
        if (data.halfCircuitSafeSide === undefined)
          return inOut;
        return output.combo({ inOut: inOut, side: output[data.halfCircuitSafeSide]() });
      },
      run: (data) => data.seenHalfCircuit = true,
      outputStrings: {
        left: {
          en: 'Boss\'s Left',
          de: 'Links vom Boss',
          cn: 'Boss 左',
        },
        right: {
          en: 'Boss\'s Right',
          de: 'Rechts vom Boss',
          cn: 'Boss 右',
        },
        in: Outputs.in,
        out: Outputs.out,
        combo: {
          en: '${inOut} + ${side}',
          de: '${inOut} + ${side}',
        },
      },
    },
    // Continue to use 'Boss\'s X' output rather than Outputs.left/.right for these triggers
    // Zoraal Ja jumps and rotates as the line moves through the arena, and players may
    // change directions, so use boss-relative rather than trying to guess which way the player
    // is facing.
    {
      id: 'Zoraal Ja Ex Might of Vollok Right Sword',
      type: 'StartsUsing',
      netRegex: { id: '9368', source: 'Zoraal Ja', capture: false },
      condition: (data) => data.phase === 'lines' && data.seenHalfCircuit,
      alertText: (_data, _matches, output) => output.rightSword(),
      outputStrings: {
        rightSword: {
          en: 'Boss\'s Left',
          de: 'Links vom Boss',
          cn: 'Boss 左',
        },
      },
    },
    {
      id: 'Zoraal Ja Ex Might of Vollok Left Sword',
      type: 'StartsUsing',
      netRegex: { id: '9369', source: 'Zoraal Ja', capture: false },
      condition: (data) => data.phase === 'lines' && data.seenHalfCircuit,
      alertText: (_data, _matches, output) => output.leftSword(),
      outputStrings: {
        leftSword: {
          en: 'Boss\'s Right',
          de: 'Rechts vom Boss',
          cn: 'Boss 右',
        },
      },
    },
    {
      // This Chasm of Vollok happens in swords2 and has no Half Full cleave.
      id: 'Zoraal Ja Ex Chasm of Vollok No Cleave',
      type: 'StartsUsing',
      netRegex: { id: '9399', source: 'Fang', capture: false },
      condition: (data) => data.phase === 'swords' && data.seenHalfCircuit,
      delaySeconds: 1,
      durationSeconds: 6,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        // We should already have 8 safe tiles from Sword Collect
        // There are only six possible patterns:
        // 1. All inside tiles safe.
        // 2. No inside tiles safe (all intercard pairs safe).
        // 3-6.  Inside East&West OR North&South safe.
        const safeTiles = tileNames.filter((tile) => !data.unsafeTiles.includes(tile));
        if (safeTiles.length !== 8)
          return;
        const eastWestSafe = safeTiles.includes('insideEast') && safeTiles.includes('insideWest');
        const northSouthSafe = safeTiles.includes('insideNorth') &&
          safeTiles.includes('insideSouth');
        if (eastWestSafe && northSouthSafe)
          return output.inside();
        else if (eastWestSafe)
          return output.eastWest();
        else if (northSouthSafe)
          return output.northSouth();
        return output.intercard();
      },
      run: (data) => data.unsafeTiles = [],
      outputStrings: {
        inside: {
          en: 'Inside Safe',
          cn: '内部安全',
        },
        eastWest: {
          en: 'Inside East/West Safe',
          cn: '内部左/右安全',
        },
        northSouth: {
          en: 'Inside North/South Safe',
          cn: '内部上/下安全',
        },
        intercard: {
          en: 'Ouside Intercards Safe (Avoid Corners)',
          cn: '外围中部安全 (除了角落)',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceSync': {
        'Fang': '[^:]+',
        'Zoraal Ja': '[^:]+',
      },
      'replaceText': {
        'Fiery Edge/Stormy Edge': 'Fiery/Stormy Edge',
        'Forward Edge/Backward Edge': 'Forward/Backward Edge',
        'Siege of Vollok/Walls of Vollok': 'Siege/Walls of Vollok',
        'Actualize': '实现化',
        'Aero III': '暴风',
        'Backward Edge': '后退刃',
        'Bitter Whirlwind': '苦涩之风',
        'Blade Warp': '召唤刃',
        'Burning Chains': '火焰链',
        'Chasm of Vollok': '凶残之坑',
        'Dawn of an Age': '黎明纪元',
        'Drum of Vollok': '凶残之击',
        'Duty\'s Edge': '职责之刃',
        'Fiery Edge': '火焰刃',
        'Forged Track': '刃轨',
        'Forward Edge': '前锋刃',
        'Greater Gateway': '通道赋予',
        'Half Circuit': '自在巡回',
        'Half Full': '自在之力',
        'Multidirectional Divide': '多重通道',
        'Projection of Triumph': '投影刃',
        'Projection of Turmoil': '投影爆发',
        'Regicidal Rage': '弑君',
        'Siege of Vollok': '凶残之环',
        'Stormy Edge': '风刃',
        'Sync(?![-h])': '同步',
        '(?<! )Vollok': '刃·凶残',
        'Walls of Vollok': '凶残之圆',
      },
    },
    {
      'locale': 'de',
      'missingTranslations': true,
      'replaceSync': {
        'Fang': 'Reißzahn',
        'Zoraal Ja': 'Zoraal Ja',
      },
      'replaceText': {
        '\\(cast\\)': '(wirken)',
        '\\(damage\\)': '(Schaden)',
        '\\(enrage\\)': '(Finalangriff)',
        '\\(lines drop\\)': '',
        'Actualize': '实现化A',
        'Aero III': '暴风',
        'Backward Edge': '后退刃',
        'Bitter Whirlwind': '苦涩之风',
        'Blade Warp': '召唤刃',
        'Burning Chains': '火焰链',
        'Chasm of Vollok': '凶残之坑',
        'Dawn of an Age': '黎明纪元',
        'Drum of Vollok': '凶残之击',
        'Duty\'s Edge': '职责之刃',
        'Fiery Edge': '火焰刃',
        'Forged Track': '刃轨',
        'Forward Edge': '前锋刃',
        'Greater Gateway': '通道赋予',
        'Half Circuit': '自在巡回',
        'Half Full': '自在之力',
        'Multidirectional Divide': '多重通道',
        'Projection of Triumph': '投影刃',
        'Projection of Turmoil': '投影爆发',
        'Regicidal Rage': '弑君',
        'Siege of Vollok': '凶残之环',
        'Stormy Edge': '风刃',
        'Sync(?![-h])': '同步',
        '(?<! )Vollok': '刃·凶残',
        'Walls of Vollok': '凶残之圆',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Fang': 'crochet',
        'Zoraal Ja': 'Zoraal Ja',
      },
      'replaceText': {
        'Actualize': '实现化',
        'Aero III': '暴风',
        'Backward Edge': '后退刃',
        'Bitter Whirlwind': '苦涩之风',
        'Blade Warp': '召唤刃',
        'Burning Chains': '火焰链',
        'Chasm of Vollok': '凶残之坑',
        'Dawn of an Age': '黎明纪元',
        'Drum of Vollok': '凶残之击',
        'Duty\'s Edge': '职责之刃',
        'Fiery Edge': '火焰刃',
        'Forged Track': '刃轨',
        'Forward Edge': '前锋刃',
        'Greater Gateway': '通道赋予',
        'Half Circuit': '自在巡回',
        'Half Full': '自在之力',
        'Multidirectional Divide': '多重通道',
        'Projection of Triumph': '投影刃',
        'Projection of Turmoil': '投影爆发',
        'Regicidal Rage': '弑君',
        'Siege of Vollok': '凶残之环',
        'Stormy Edge': '风刃',
        'Sync(?![-h])': '同步',
        '(?<! )Vollok': '刃·凶残',
        'Walls of Vollok': '凶残之圆',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Fang': '[^:]+',
        'Zoraal Ja': '[^:]+',
      },
      'replaceText': {
        'Actualize': '实现化',
        'Aero III': '暴风',
        'Backward Edge': '后退刃',
        'Bitter Whirlwind': '苦涩之风',
        'Blade Warp': '召唤刃',
        'Burning Chains': '火焰链',
        'Chasm of Vollok': '凶残之坑',
        'Dawn of an Age': '黎明纪元',
        'Drum of Vollok': '凶残之击',
        'Duty\'s Edge': '职责之刃',
        'Fiery Edge': '火焰刃',
        'Forged Track': '刃轨',
        'Forward Edge': '前锋刃',
        'Greater Gateway': '通道赋予',
        'Half Circuit': '自在巡回',
        'Half Full': '自在之力',
        'Multidirectional Divide': '多重通道',
        'Projection of Triumph': '投影刃',
        'Projection of Turmoil': '投影爆发',
        'Regicidal Rage': '弑君',
        'Siege of Vollok': '凶残之环',
        'Stormy Edge': '风刃',
        'Sync(?![-h])': '同步',
        '(?<! )Vollok': '刃·凶残',
        'Walls of Vollok': '凶残之圆',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Fang': '[^:]+',
        'Zoraal Ja': '[^:]+',
      },
      'replaceText': {
        // '\\(cast\\)': '(wirken)',
        '\\(damage\\)': '(判定)',
        // '\\(enrage\\)': '(Finalangriff)',
        '\\(lines drop\\)': '',
        'Actualize': '实现化',
        'Aero III': '暴风',
        'Backward Edge': '后退刃',
        'Bitter Whirlwind': '苦涩之风',
        'Blade Warp': '召唤刃',
        'Burning Chains': '火焰链',
        'Chasm of Vollok': '凶残之坑',
        'Dawn of an Age': '黎明纪元',
        'Drum of Vollok': '凶残之击',
        'Duty\'s Edge': '职责之刃',
        'Fiery Edge': '火焰刃',
        'Forged Track': '刃轨',
        'Forward Edge': '前锋刃',
        'Greater Gateway': '通道赋予',
        'Half Circuit': '自在巡回',
        'Half Full': '自在之力',
        'Multidirectional Divide': '多重通道',
        'Projection of Triumph': '投影刃',
        'Projection of Turmoil': '投影爆发',
        'Regicidal Rage': '弑君',
        'Siege of Vollok': '凶残之环',
        'Stormy Edge': '风刃',
        'Sync(?![-h])': '同步',
        '(?<! )Vollok': '刃·凶残',
        'Walls of Vollok': '凶残之圆',
      },
    },
  ],
});
