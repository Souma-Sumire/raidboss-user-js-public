// Build Time: 2026-03-16T22:47:21.991Z
const bossPhaseId = {
  'B31C': 'BOSS1-P3',
};
const actorControlData = {
  'AB8': '蟹',
  'ABA': '鸟',
  'AB5': '马',
  'AB9': '豚',
  'AB7': '龟',
};
const npcBaseIdToZoo = {
  '19098': '马',
  '19099': '龟',
  '19100': '蟹',
  '19101': '豚',
  '19102': '鸟',
};
const orientation = ['北', '南', '西', '东'];
const boss1Center = { x: 375, y: 530 };
// const boss2Center = { x: 170, y: -815 };
// 510=0 | 514=1  522=2  [530]=3  538=4  546=5 | 550=6
const Y_GRID = [510, 514, 522, 530, 538, 546, 550];
// 355=0 | 359=1  367=2  [375]=3  383=4  391=5 | 395=6
const X_GRID = [355, 359, 367, 375, 383, 391, 395];
const findNearest = (grid, val) => {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < grid.length; i++) {
    const dist = Math.abs(grid[i] - val);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  return bestIdx;
};
const getPos = (x, y) => {
  if (x <= 357 || x >= 393) {
    return { t: 'y', n: findNearest(Y_GRID, y) };
  }
  if (y <= 512 || y >= 548) {
    return { t: 'x', n: findNearest(X_GRID, x) };
  }
  throw new Error('未知的动物坐标');
};
const CENTER_CHAR_OFFSET = 14;
const boss1Debuffs = {
  '871': '前',
  '872': '后',
  '873': '左',
  '874': '右',
};
const boss2Debuffs = {
  '12A5': '东',
  '12A6': '西',
  '12A7': '东西',
  '12A8': '南',
  '12A9': '东南',
  '12AA': '西南',
  '12AB': '东西南',
  '12AC': '北',
  '12AD': '东北',
  '12AE': '西北',
  '12AF': '东西北',
  '12B0': '南北',
  '12B1': '东南北',
  '12B2': '西南北',
  '12B3': '东西南北',
  '1366': '东',
  '1367': '西',
};
const makeZooGrid = (positions) => {
  const grid = Array.from({ length: 5 }, () => new Array(5).fill(0));
  for (const { t, n } of positions) {
    const idx = n - 1; //
    if (t === 'y') {
      for (let col = 0; col < 5; col++)
        grid[idx][col] = 1;
    } else {
      for (let row = 0; row < 5; row++)
        grid[row][idx] = 1;
    }
  }
  let result = grid.map((row) => row.map((v) => (v ? '■' : '□')).join('')).join('\n');
  const centerChar = result[CENTER_CHAR_OFFSET] === '■' ? '★' : '☆';
  result = result.slice(0, CENTER_CHAR_OFFSET) + centerChar + result.slice(CENTER_CHAR_OFFSET + 1);
  return result;
};
const FIXED_PATTERNS = {
  '东西': '■↖■↗■\n■■■■■\n■■■■■\n■■■■■\n■↙■↘■',
  '南北': '■■■■■\n↖■■■↗\n■■■■■\n↙■■■↘\n■■■■■',
};
const getZooDir = (combatant) =>
  Math.abs(parseFloat(combatant.x) - boss1Center.x) <= 3 ? '南北' : '东西';
const computeZoosResult = (data) => {
  const byZoo = (name) => data.zoosCombatants.filter((v) => npcBaseIdToZoo[v.npcBaseId] === name);
  const posOf = (name) => byZoo(name).map((v) => getPos(parseFloat(v.x), parseFloat(v.y)));
  for (const zoo of data.zoos.slice(-4)) {
    if (zoo === '豚' || zoo === '鸟') {
      data.zoosResult.push(
        FIXED_PATTERNS[
          getZooDir(data.zoosCombatants.filter((v) => npcBaseIdToZoo[v.npcBaseId] === zoo)[0])
        ],
      );
    } else {
      data.zoosResult.push(makeZooGrid(posOf(zoo)));
    }
  }
};
const getSafe = (str) => {
  const flat = str.replaceAll('\n', '');
  if (flat.at(7) === '□') {
    return '内';
  }
  if (flat.at(2) === '□') {
    return '外';
  }
  if (flat.at(1) === '□' || flat.at(3) === '□') {
    return '斜';
  }
  throw new Error('unknown safe');
};
const headMarkerData = {
  // Offsets: 01:51, 03:46
  // Vfx Path: bahamut_wyvn_glider_target_02tm
  '0014': '0014',
  // Offsets: 00:43, 00:49
  // Vfx Path: lockon3_t0h
  '0016': '0016',
  // Offsets: 03:06
  // Vfx Path: m0561tag_a0t
  '00B9': '00B9',
};
const hintTriggerConfigs = [
  { id: '呼唤家臣1', netRegex: { id: 'B2CB' }, delay: 14, duration: 6.2, idx: 0 },
  { id: '呼唤家臣2', netRegex: { id: 'B2CB' }, delay: 20.3, duration: 3, idx: 1 },
  { id: '呼唤家臣3', netRegex: { id: 'B2CB' }, delay: 23.3, duration: 3, idx: 2 },
  { id: '呼唤家臣4', netRegex: { id: 'B2CB' }, delay: 26.3, duration: 3, idx: 3 },
];
const makeHintTrigger = ({ id, netRegex, delay, duration, idx }) => ({
  id: `${id}`,
  type: 'StartsUsing',
  netRegex: netRegex,
  delaySeconds: delay,
  durationSeconds: duration,
  suppressSeconds: 9999,
  soundVolume: 0.3,
  // eslint-disable-next-line rulesdir/cactbot-output-strings
  alertText: (data) => data.zoosResult[idx] ?? '??',
  tts: null,
});
// 2528.6 "热波" StartsUsing { id: "B1CD" } #火仙女佩莉（Boss）
// 2533.6 "热波" Ability { id: "B1CD" } #火仙女佩莉（Boss）
// 2541.8 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
// 2543.7 "火粉炎舞" StartsUsing { id: "B17B" } #火仙女佩莉（Boss）
// 2553.7 "火粉炎舞" Ability { id: "B17B" } #火仙女佩莉（Boss）
// 2554.4 "绒毯突击" StartsUsing { id: "B183" } #火仙女佩莉（分身）
// 2555.8 "绒毯突击" Ability { id: "B181" } #火仙女佩莉（Boss）
// 2556.4 "绒毯突击" Ability { id: "B183" } #火仙女佩莉（分身）
// 2556.4 "绒毯突击" StartsUsing { id: "B183" } #火仙女佩莉（分身）
// 2557.8 "绒毯突击" Ability { id: "B181" } #火仙女佩莉（Boss）
// 2558.4 "绒毯突击" Ability { id: "B183" } #火仙女佩莉（分身）
// 2558.5 "绒毯突击" StartsUsing { id: "B183" } #火仙女佩莉（分身）
// 2559.9 "绒毯突击" Ability { id: "B181" } #火仙女佩莉（Boss）
// 2560.5 "绒毯突击" Ability { id: "B183" } #火仙女佩莉（分身）
// 2562.2 "火环" StartsUsing { id: "B188" } #火仙女佩莉（Boss）
// 2564.2 "火环" Ability { id: "B188" } #火仙女佩莉（Boss）
// 2565.3 "火粉炎舞" Ability { id: "B184" } #火仙女佩莉（分身）
// 2565.3 "火粉炎舞" Ability { id: "B184" } #火仙女佩莉（分身）
// 2565.3 "火粉炎舞" Ability { id: "B184" } #火仙女佩莉（分身）
// 2565.3 "火粉炎舞" Ability { id: "B184" } #火仙女佩莉（分身）
// 2566.3 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
// 2578 "散火花" StartsUsing { id: "B1E0" } #火仙女佩莉（Boss）
// 2585.9 "散火花" Ability { id: "B1E0" } #火仙女佩莉（Boss）
// 2586 "散火花" Ability { id: "B1E1" } #火仙女佩莉（分身）
// 2586 "散火花" Ability { id: "B1E1" } #火仙女佩莉（分身）
// 2586 "散火花" Ability { id: "B1E1" } #火仙女佩莉（分身）
// 2586 "散火花" Ability { id: "B1E1" } #火仙女佩莉（分身）
// 2591.1 "升火" StartsUsing { id: "B1CF" } #火仙女佩莉（Boss）
// 2596.1 "升火" Ability { id: "B1CF" } #火仙女佩莉（Boss）
// 2601.3 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
// 2603 "四连炎舞·追火" StartsUsing { id: "B19C" } #火仙女佩莉（Boss）
// 2620 "四连炎舞·追火" Ability { id: "B19C" } #火仙女佩莉（Boss）
// 2622.1 "重火" Ability { id: "B1A5" } #火仙女佩莉（分身）
// 2622.1 "黑火花" Ability { id: "B1A4" } #火仙女佩莉（分身）
// 2622.1 "回转炎舞" Ability { id: "B19F" } #火仙女佩莉（Boss）
// 2625.2 "重火" Ability { id: "B1A5" } #火仙女佩莉（分身）
// 2625.2 "黑火花" Ability { id: "B1A4" } #火仙女佩莉（分身）
// 2625.2 "回转炎舞" Ability { id: "B1A0" } #火仙女佩莉（Boss）
// 2628.2 "回转炎舞" Ability { id: "B1A0" } #火仙女佩莉（Boss）
// 2628.3 "重火" Ability { id: "B1A5" } #火仙女佩莉（分身）
// 2628.3 "黑火花" Ability { id: "B1A4" } #火仙女佩莉（分身）
// 2631.3 "重火" Ability { id: "B1A5" } #火仙女佩莉（分身）
// 2631.3 "黑火花" Ability { id: "B1A4" } #火仙女佩莉（分身）
// 2631.3 "回转炎舞" Ability { id: "B1A0" } #火仙女佩莉（Boss）
// 2640.5 "火灵的诅咒" StartsUsing { id: "B1EF" } #火仙女佩莉（Boss）
// 2645.5 "火灵的诅咒" Ability { id: "B1EF" } #火仙女佩莉（Boss）
// 2650.7 "魔力辉石" StartsUsing { id: "B1BF" } #火仙女佩莉（Boss）
// 2653.7 "魔力辉石" Ability { id: "B1BF" } #火仙女佩莉（Boss）
// 2655.8 "搬运指示" StartsUsing { id: "B6A2" } #火仙女佩莉（Boss）
// 2658.8 "搬运指示" Ability { id: "B6A2" } #火仙女佩莉（Boss）
// 2668 "魔力辉石" Ability { id: "B1B9" } #火仙女佩莉（Boss）
// 2670.7 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2670.7 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2675.6 "绒毯突击" StartsUsing { id: "B182" } #火仙女佩莉（分身）
// 2675.8 "冰魔光" StartsUsing { id: "B1BD" } #冰之辉石（分身）
// 2677.5 "绒毯突击" Ability { id: "B182" } #火仙女佩莉（分身）
// 2677.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2677.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2677.8 "冰魔光" Ability { id: "B1BD" } #冰之辉石（分身）
// 2678.1 "爆炸粉" Ability { id: "B1D3" } #火仙女佩莉（分身）
// 2678.1 "重爆炸粉" Ability { id: "B1D4" } #火仙女佩莉（分身）
// 2678.1 "爆炸粉" Ability { id: "B1D3" } #火仙女佩莉（分身）
// 2683.2 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
// 2685 "怒炎" StartsUsing { id: "B1AA" } #火仙女佩莉（Boss）
// 2692 "怒炎" Ability { id: "B1AA" } #火仙女佩莉（Boss）
// 2697.2 "焰光" StartsUsing { id: "B1AB" } #火仙女佩莉（Boss）
// 2702.2 "焰光" Ability { id: "B1AB" } #火仙女佩莉（Boss）
// 2704.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2704.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2704.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2704.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2705.3 "焰光" Ability { id: "B1AC" } #火仙女佩莉（Boss）
// 2706.2 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2706.2 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2706.2 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2706.2 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2706.7 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2706.7 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2706.7 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2706.7 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2707.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2707.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2707.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2707.3 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2708.4 "焰光" Ability { id: "B1AC" } #火仙女佩莉（Boss）
// 2709.3 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2709.3 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2709.3 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2709.3 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2709.8 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2709.8 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2709.8 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2709.8 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2710.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2710.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2710.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2710.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2711.4 "焰光" Ability { id: "B1AC" } #火仙女佩莉（Boss）
// 2712.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2712.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2712.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2712.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2712.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2712.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2712.7 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2712.7 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2712.7 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2712.7 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2712.9 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2712.9 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2712.9 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2712.9 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2713.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2713.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2713.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2713.5 "焰光" StartsUsing { id: "B1AD" } #火仙女佩莉（分身）
// 2715.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2715.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2715.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2715.5 "焰光" Ability { id: "B1AD" } #火仙女佩莉（分身）
// 2715.8 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2715.8 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2715.8 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2715.8 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2716 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2716 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2716 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2716 "焰光" StartsUsing { id: "B1B0" } #火仙女佩莉（分身）
// 2716.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2716.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2717.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2717.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2718.9 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2718.9 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2718.9 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2718.9 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2721.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2721.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2722 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2722 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2722 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2722 "焰光" Ability { id: "B1B0" } #火仙女佩莉（分身）
// 2722.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2722.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2726.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2726.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2727.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2727.2 "火柱" StartsUsing { id: "B1D7" } #火仙女佩莉（分身）
// 2731.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2731.2 "火柱" Ability { id: "B1D7" } #火仙女佩莉（分身）
// 2735.2 "飞火" Ability { id: "B1E6" } #火仙女佩莉（分身）
// 2735.2 "飞火" Ability { id: "B1E6" } #火仙女佩莉（分身）
// 2735.2 "飞火" Ability { id: "B1E6" } #火仙女佩莉（分身）
// 2735.2 "飞火" Ability { id: "B1E6" } #火仙女佩莉（分身）
// 2736.6 "怒号爆炎" StartsUsing { id: "B1B3" } #火仙女佩莉（Boss）
// 2742.5 "怒号爆炎" Ability { id: "B1B3" } #火仙女佩莉（Boss）
// 2749.8 "幻影生成" StartsUsing { id: "B7C1" } #火仙女佩莉（Boss）
// 2752.8 "幻影生成" Ability { id: "B7C1" } #火仙女佩莉（Boss）
// 2759 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2759 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2759 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2759 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2765.6 "绒毯突击" StartsUsing { id: "B5EE" } #火仙女佩莉（分身）
// 2765.6 "绒毯突击" StartsUsing { id: "B5ED" } #火仙女佩莉（分身）
// 2766.1 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2766.1 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2766.1 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2766.1 "爆炸" StartsUsing { id: "B1DC" } #火仙女佩莉（分身）
// 2767 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2767 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2767 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2767 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2767.7 "绒毯突击" Ability { id: "B5EE" } #火仙女佩莉（分身）
// 2767.7 "绒毯突击" Ability { id: "B5ED" } #火仙女佩莉（分身）
// 2772.6 "绒毯突击" StartsUsing { id: "B5ED" } #火仙女佩莉（分身）
// 2772.6 "绒毯突击" StartsUsing { id: "B5EE" } #火仙女佩莉（分身）
// 2774.1 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2774.1 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2774.1 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2774.1 "爆炸" Ability { id: "B1DC" } #火仙女佩莉（分身）
// 2774.7 "绒毯突击" Ability { id: "B5ED" } #火仙女佩莉（分身）
// 2774.7 "绒毯突击" Ability { id: "B5EE" } #火仙女佩莉（分身）
// 2776.8 "魔力辉石" Ability { id: "B1B9" } #火仙女佩莉（Boss）
// 2779.5 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2779.5 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2779.5 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2780.9 "对火花" StartsUsing { id: "B1E4" } #火仙女佩莉（Boss）
// 2785.8 "对火花" Ability { id: "B1E4" } #火仙女佩莉（Boss）
// 2785.9 "对火花" Ability { id: "B1E5" } #火仙女佩莉（分身）
// 2785.9 "对火花" Ability { id: "B1E5" } #火仙女佩莉（分身）
// 2786.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2786.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2786.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2791.1 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
// 2793.9 "辉石四连炎舞" StartsUsing { id: "B7B7" } #火仙女佩莉（Boss）
// 2806.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2806.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2809.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2809.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2811.4 "辉石四连炎舞" Ability { id: "B7B7" } #火仙女佩莉（Boss）
// 2812.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2812.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2813.5 "回转炎舞" Ability { id: "B19E" } #火仙女佩莉（Boss）
// 2813.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2813.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2815.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2815.6 "火魔光" StartsUsing { id: "B1EC" } #火之辉石（分身）
// 2816.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2816.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2816.5 "回转炎舞" Ability { id: "B19E" } #火仙女佩莉（Boss）
// 2819.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2819.6 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2819.6 "回转炎舞" Ability { id: "B19D" } #火仙女佩莉（Boss）
// 2822.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2822.5 "火魔光" Ability { id: "B1EC" } #火之辉石（分身）
// 2822.7 "回转炎舞" Ability { id: "B19D" } #火仙女佩莉（Boss）
// 2829.8 "热波" StartsUsing { id: "B1CD" } #火仙女佩莉（Boss）
// 2834.8 "热波" Ability { id: "B1CD" } #火仙女佩莉（Boss）
// 2841.6 "unknown_b16d" Ability { id: "B16D" } #火仙女佩莉（Boss）
Options.Triggers.push({
  id: 'AnotherMerchantsTale',
  zoneId: ZoneId.AnotherMerchantsTale,
  timeline: `hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "80000027", data0: "4B" } window 0,100000 jump 0
1005.0 "--sync--" ActorControl { command: "80000027", data0: "0E" } window 10000,0 #BOSS
2000.0 "--sync--" ActorControl { command: "80000027", data0: "48" } window 10000,0 #BOSS
1005.2 "--sync--" StartsUsing { id: "B32E" } window 10,0
1010.2 "尖声坠刺" Ability { id: "B32E" }
1023.9 "呼唤家臣" Ability { id: "B2CB" }
1037.5 "和声小夜曲" Ability { id: "B2CD" }
1040.2 "水化弹"
1044.3 "水化弹"
1046.5 "水化弹"
1050.6 "水化弹"
1054.6 "激涌的洋流" Ability { id: "B329" }
1068.8 "迷人的指令" Ability { id: "B325" }
1078.1 "空中漫游" Ability { id: "B315" }
1091.7 "水瀑"
1092 "潮水喷涌"
1103 "无尽的洋流" Ability { id: "B326" }
1111.1 "无尽的洋流"
1113.2 "无尽的洋流"
1115.2 "无尽的洋流"
1117.3 "无尽的洋流"
1131.3 "尖声坠刺" Ability { id: "B32E" }
1142.5 "迷人的指令" Ability { id: "B325" }
1150.7 "沉没的宝藏" Ability { id: "B319" }
1167 "激涌的洋流" Ability { id: "B329" }
1167.7 "潮水喷涌"
1167.8 "碎裂"
1183.4 "水之矛" Ability { id: "B31C" }
1197.7 "呼唤家臣" Ability { id: "B2CB" }
1211.4 "和声小夜曲" Ability { id: "B2CD" }
1223 "水球"
1227.1 "水球"
1229.1 "水球"
1230.2 "交汇的洋流"
1231.1 "水球"
1241.2 "呼唤家臣" Ability { id: "B2CB" }
1251.4 "和声重奏曲" Ability { id: "B314" }
1266.2 "激涌的洋流" Ability { id: "B329" }
2014.2 "剑气解放" Ability { id: "B65E" }
2026.3 "天界交叉斩·环/圆"
2026.7 "天界交叉斩"
2033.7 "四方凶兆"
2034.7 "凶星爆击打"
2041.2 "变转光波"
2041.2 "光波剑"
2050.3 "缚链凶兆击"
2051.3 "凶星爆击打"
2051.3 "缚链凶兆击"
2052.6 "灵击波"
2062.5 "转轮残响"
2066.6 "残响剑"
2069.7 "转轮残响"
2074.1 "时差剑波"
2081.2 "天界交叉斩·圆/环"
2081.7 "天界交叉斩"
2088.8 "八叶回响"
2093.9 "回响剑"
2096.9 "八叶残响"
2098.6 "咬击古狼闪"
2108.4 "冥界重光波"
2120.7 "剑气解放"
2126.8 "四方凶兆"
2127.8 "凶星爆击打"
2135.3 "光波刚剑舞"
2135.3 "光波剑"
2144.4 "灼热回响"
2148.8 "冥界灵击波"
2148.9 "灵击波"
2149.5 "回响剑"
2156.6 "天界交叉斩·圆/环"
2157.0 "天界交叉斩·圆/环"
2157.1 "天界交叉斩"
2165.2 "四方凶兆"
2166.1 "凶星爆击打"
2172.6 "四连幻影光波"
2172.6 "光波剑"
2174.7 "光波剑"
2178.3 "咬击古狼闪"
2179.8 "咬击古狼闪"
2182.2 "冥界灵击波"
2187.7 "冥界灵击波"
2193.3 "冥界灵击波"
2195.5 "缚链凶兆击"
2196.5 "凶星爆击打"
2198.8 "冥界灵击波"
2203.9 "凶兆击"
2205.2 "凶星爆击打"
2212.1 "冥界重光波"
2224.4 "剑气解放"
2228.5 "掉落"
2232.5 "掉落"
2234.5 "掉落"
2237.1 "剑气咒缚"
2246.7 "八叶残响"
2250.8 "残响剑"
2253.9 "八叶残响"
2258.9 "四方凶兆"
2259.9 "凶星爆击打"
2268.3 "四连幻影光波"
2268.3 "光波剑"
2270.3 "光波剑"
2278.3 "冥界灵击波"
2283.8 "冥界灵击波"
2289.4 "冥界灵击波"
2294.9 "冥界灵击波"
2300.4 "剑气解放"
2308.6 "冥界重光波"
2322.4 "四方凶兆"
2323.4 "凶星爆击打"
`,
  initData: () => ({
    zoos: [],
    zoosCombatants: [],
    zoosResult: [],
    phase: 'BOSS1-P1',
  }),
  triggers: [
    {
      id: 'souma 人鱼达莉娅 阶段控制',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(bossPhaseId), capture: true },
      run: (data, matches) => {
        data.phase = bossPhaseId[matches.id];
      },
    },
    // #region BOSS1
    {
      id: 'souma 人鱼达莉娅 尖声坠刺',
      type: 'StartsUsing',
      netRegex: { id: 'B32E', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma 人鱼达莉娅 呼唤家臣 B2CB',
      type: 'StartsUsing',
      netRegex: { id: 'B2CB', capture: false },
      run: (data) => {
        // data.zoos.length = 0;
        data.zoosResult.length = 0;
        data.zoosCombatants.length = 0;
      },
    },
    {
      id: 'souma 人鱼达莉娅 Actor Control',
      type: 'ActorControlExtra',
      netRegex: {
        category: '00B8',
        param1: Object.keys(actorControlData),
      },
      preRun: (data, matches) => {
        data.zoos.push(actorControlData[matches.param1]);
        if (data.zoos.length % 4 === 0)
          computeZoosResult(data);
      },
      durationSeconds: 20,
      infoText: (data, _matches, output) => {
        if (data.zoos.length % 4 === 0) {
          if (data.phase === 'BOSS1-P1')
            return data.zoos.slice(-4).map((v) => output[v]()).join('');
          if (data.phase === 'BOSS1-P3') {
            const s1 = getSafe(data.zoosResult[0]);
            const s2 = getSafe(data.zoosResult[1]);
            const s3 = getSafe(data.zoosResult[2]);
            return output.p3({
              s1: output[s1](),
              s2: output[s2](),
              s3: output[s3](),
              s4: output[s1](),
            });
          }
        }
      },
      outputStrings: {
        '豚': { en: '豚' },
        '蟹': { en: '蟹' },
        '鸟': { en: '鸟' },
        '马': { en: '马' },
        '龟': { en: '龟' },
        '内': { en: '内' },
        '外': { en: '外' },
        '斜': { en: '斜' },
        'p3': { en: '${s1}→${s2}→${s3}→${s4}' },
      },
    },
    {
      id: 'souma 人鱼达莉娅 和声重奏曲',
      type: 'StartsUsing',
      netRegex: { id: 'B314' },
      preRun: (data) => {
        if (data.zoos.length % 4 === 0) {
          computeZoosResult(data);
        }
      },
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        if (data.zoos.length % 4 === 0) {
          const s1 = getSafe(data.zoosResult[0]);
          const s2 = getSafe(data.zoosResult[1]);
          const s3 = getSafe(data.zoosResult[2]);
          return output.p3({
            s1: output[s1](),
            s2: output[s2](),
            s3: output[s3](),
            s4: output[s1](),
          });
        }
      },
      outputStrings: {
        '豚': { en: '豚' },
        '蟹': { en: '蟹' },
        '鸟': { en: '鸟' },
        '马': { en: '马' },
        '龟': { en: '龟' },
        '内': { en: '内' },
        '外': { en: '外' },
        '斜': { en: '斜' },
        'p3': { en: '${s1}→${s2}→${s3}→${s4}' },
      },
    },
    ...hintTriggerConfigs.map(makeHintTrigger),
    {
      id: 'souma 人鱼达莉娅 Add',
      type: 'AddedCombatant',
      netRegex: {
        npcBaseId: Object.keys(npcBaseIdToZoo),
      },
      preRun: (data, matches) => {
        data.zoosCombatants.push(matches);
      },
    },
    {
      id: 'souma 人鱼达莉娅 Headmarker Spread 00B9',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['00B9'], capture: true },
      suppressSeconds: 5,
      response: Responses.spread(),
    },
    {
      id: 'souma 人鱼达莉娅 激涌的洋流',
      type: 'StartsUsingExtra',
      netRegex: { id: 'B32A', capture: true },
      delaySeconds: 3,
      // 只报1分整与4分30秒的这2次
      suppressSeconds: 180,
      infoText: (_data, matches, output) => {
        // N = 0, NE = 1, ..., NW = 7
        const hdg = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const safe = [1, 5].includes(hdg) ? '右下/左上' : '右上/左下';
        return output[safe]();
      },
      outputStrings: {
        '右下/左上': { en: '先去2、4' },
        '右上/左下': { en: '先去1、3' },
      },
    },
    {
      id: 'souma 人鱼达莉娅 迷人的指令',
      type: 'StartsUsing',
      netRegex: { id: 'B325', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma 人鱼达莉娅 移动命令',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(boss1Debuffs) },
      condition: Conditions.targetIsYou(),
      durationSeconds: (_data, matches) => parseFloat(matches.duration),
      countdownSeconds: (_data, matches) => parseFloat(matches.duration),
      alertText: (_data, matches, output) => {
        return output[boss1Debuffs[matches.effectId]]();
      },
      outputStrings: {
        '前': { en: '向前' },
        '后': { en: '向后' },
        '左': { en: '向左' },
        '右': { en: '向右' },
      },
    },
    // #endregion
    // #region BOSS2
    {
      id: 'souma 剑术大师 剑气解放',
      type: 'StartsUsing',
      netRegex: { id: 'B65E' },
      response: Responses.aoe(),
    },
    {
      id: 'souma 剑术大师 天界交叉斩·环/圆',
      type: 'StartsUsing',
      netRegex: {
        id: [
          // 环 1把刀
          'B9CF',
          // 环 2把刀
          'B9D1',
          // 圆 1把刀
          'B9CE',
          // 圆 2把刀
          'B9D0',
        ],
        capture: true,
      },
      delaySeconds: 0.5,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        const res = {
          // 环 1把刀
          'B9CF': { '点名': '单吃', '1': '先月环', '2': '后钢铁', '闲人': '闲人' },
          // 环 2把刀
          'B9D1': { '点名': '分摊', '1': '先月环', '2': '后钢铁', '闲人': '闲人' },
          // 圆 1把刀
          'B9CE': { '点名': '单吃', '1': '先钢铁', '2': '后月环', '闲人': '闲人' },
          // 圆 2把刀
          'B9D0': { '点名': '分摊', '1': '先钢铁', '2': '后月环', '闲人': '闲人' },
        }[matches.id];
        const key = data.天界交叉斩麻将 ?? '闲人';
        data.天界交叉斩麻将 = undefined;
        return output[res[key]]();
      },
      outputStrings: {
        '单吃': { en: '单吃' },
        '分摊': { en: '分摊' },
        '先月环': { en: '先月环' },
        '后月环': { en: '后月环' },
        '先钢铁': { en: '先钢铁' },
        '后钢铁': { en: '后钢铁' },
        '闲人': { en: '闲人' },
      },
    },
    {
      id: 'souma 剑术大师 天界交叉斩麻将',
      type: 'HeadMarker',
      netRegex: {
        'id': [
          // 点名
          '028C',
          // 1
          '014C',
          // 2
          '014D',
        ],
        capture: true,
      },
      condition: Conditions.targetIsYou(),
      preRun: (data, matches) => {
        data.天界交叉斩麻将 = {
          '028C': '点名',
          '014C': '1',
          '014D': '2',
        }[matches.id];
      },
    },
    {
      id: 'souma 剑术大师 轮轮残响',
      type: 'StartsUsing',
      netRegex: { id: 'B670' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '集合放圈 => 月环' } },
    },
    {
      id: 'souma 剑术大师 八叶回响',
      type: 'StartsUsing',
      netRegex: { id: 'B677' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '分散放冰花' } },
    },
    {
      id: 'souma 剑术大师 八叶残响',
      type: 'StartsUsing',
      netRegex: { id: 'B673' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '集合放冰花' } },
    },
    {
      id: 'souma 剑术大师 咬击古狼闪',
      type: 'StartsUsing',
      netRegex: { id: 'B67B' },
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '去背后' } },
      run: (data) => {
        if (data.phase === 'BOSS2-P2B') {
          data.phase = 'BOSS2-P3';
        }
      },
    },
    {
      id: 'souma 剑术大师 冥界重光波',
      type: 'StartsUsing',
      netRegex: { id: 'B67D' },
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '直线分摊 x3' } },
    },
    {
      id: 'souma 剑术大师 光波刚剑舞',
      type: 'StartsUsing',
      netRegex: { id: 'B681' },
      run: (data) => {
        if (data.phase.startsWith('BOSS1')) {
          data.phase = 'BOSS2-P2';
        }
      },
    },
    {
      id: 'souma 剑术大师 四方凶兆',
      type: 'StartsUsing',
      netRegex: { id: 'B665' },
      run: (data, _matches) => {
        if (data.phase === 'BOSS2-P2') {
          data.phase = 'BOSS2-P2B';
        }
      },
    },
    {
      id: 'souma 剑术大师 debuff',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(boss2Debuffs) },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.破绽 = boss2Debuffs[matches.effectId].split('');
      },
    },
    {
      id: 'souma 剑术大师 debuff 消失',
      type: 'LosesEffect',
      netRegex: { effectId: Object.keys(boss2Debuffs) },
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.破绽 = undefined;
      },
    },
    {
      id: 'souma 剑术大师 连线位置',
      type: 'StartsUsingExtra',
      netRegex: { id: 'BE0D', capture: true },
      preRun: (data, matches) => {
        const dir = Directions.hdgTo4DirNum(parseFloat(matches.heading));
        const pos = ['南', '西', '北', '东'][dir];
        (data.连线位置 ??= {})[matches.sourceId] = pos;
      },
    },
    {
      id: 'souma 剑术大师 连线1',
      type: 'Tether',
      netRegex: { id: '0173', capture: true },
      condition: (data, matches) => data.phase === 'BOSS2-P2' && matches.targetId.startsWith('4'),
      run: (data, matches) => {
        (data.连线溯源 ??= {})[matches.targetId] = matches.sourceId;
        data.连线时间 = new Date(matches.timestamp).getTime();
      },
    },
    {
      id: 'souma 剑术大师 连线2',
      comment: {
        en: '由于日志缺少信息，必须拉出折线才能得知你的线在哪，如果初始是直线则会沉默，直到你在3秒内拉出折线。',
      },
      type: 'Tether',
      netRegex: { id: '0173', capture: true },
      condition: (data, matches) =>
        data.phase === 'BOSS2-P2' && matches.target === data.me &&
        data.连线时间 !== undefined && new Date(matches.timestamp).getTime() - data.连线时间 < 3000,
      suppressSeconds: 20,
      delaySeconds: 0.1,
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        const source = (data.连线溯源 ??= {})[matches.sourceId];
        const sourcePos = data.连线位置?.[source];
        const safe = orientation.filter((v) => !data.破绽.includes(v)).filter((v) => v !== sourcePos)
          .sort((a, b) => orientation.indexOf(a) - orientation.indexOf(b)).map((v) => output[v]())
          .join(output['separator']());
        return safe;
      },
      outputStrings: {
        '东': { en: '东' },
        '南': { en: '南' },
        '西': { en: '西' },
        '北': { en: '北' },
        'separator': { en: ' 或 ' },
      },
    },
    {
      id: 'souma 剑术大师 四连幻影光波',
      type: 'StartsUsing',
      netRegex: { id: 'B68D' },
      condition: (data) => data.phase === 'BOSS2-P2B',
      infoText: (data, _matches, output) => {
        const safe = orientation.filter((v) => !data.破绽.includes(v));
        const s1 = output[safe[0]]();
        const s2 = output[safe[1]]();
        return output['text']({ s1, s2 });
      },
      outputStrings: {
        'text': { en: '吃${s1}、${s2}' },
        '东': { en: '东' },
        '南': { en: '南' },
        '西': { en: '西' },
        '北': { en: '北' },
      },
    },
  ],
});
