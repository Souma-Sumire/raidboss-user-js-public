// Build Time: 2026-06-12T14:21:40.636Z
console.log('绝妖星已加载，开发成本原因，默认报的标点为1A2，其他标点需自己改。');
const phases = {
  'BAB9': 'p1-3',
  'C24C': 'p2',
  'C3F7': 'p3', // Aero III Assault (from Kefka), Chaos and Exdeath
};
// const centerX = 100;
// const centerY = 100;
const p2OutputStirngs = {
  扇形组: '左',
  钢铁组: '右',
  第1轮踩塔TN: '1轮 ${gimmick} 踩${lr}塔',
  第1轮闲人TN: '1轮 闲人 ${lr}引导',
  第1轮DPS分摊: '1轮 分摊 踩${lr}塔',
  第1轮DPS其他: '1轮 ${lr}边看搭档',
  第1轮TN自由: '1轮 ${lr}边看搭档',
  第2到8轮踩塔单: '${i}轮 (单${gimmick}) 踩塔',
  第2到8轮踩塔双: '${i}轮 (双${gimmick}) 踩塔',
  第2到8轮引导: '${i}轮 塔外引导',
  第2到8轮引导tank: '${i}轮 ←左塔外',
  第2到8轮引导healer: '${i}轮 ←左塔外',
  第2到8轮引导dps: '${i}轮 右塔外→',
  第2到8轮超级跳: '${i}轮 闲人 去超级跳',
  第2到8轮踩塔分摊: '${i}轮 分摊 踩塔 （另一个分摊是${player}）',
  分摊: '分摊',
  钢铁: '钢铁',
  扇形: '扇形',
  打法1234: '5轮 闲人 中间挂机',
  打法1238: '8轮 闲人 去超级跳',
  打法1458: '8轮 闲人 去超级跳',
};
const getP2 = (data, _matches, output) => {
  let me;
  let stack;
  for (let i = 0; i <= data.p2count; i++) {
    if (me === undefined) {
      me = data.p2hm[data.p2count - i - 1]?.find((v) => v.target === data.me);
    }
    if (stack === undefined && me) {
      stack = data.p2hm[data.p2count - i - 1]?.find((v) =>
        v.buff === '分摊' && v.target !== data.me &&
        ({ tank: 'tn', healer: 'tn', dps: 'dps' }[v.role] ===
          { tank: 'tn', healer: 'tn', dps: 'dps' }[me.role])
      );
    }
    if (me) {
      break;
    }
  }
  const towerCount = data.p2count;
  const groupA = data.p2第一轮踩塔人.includes(data.me);
  const ab = data.triggerSetConfig.p2一运打法.split('');
  const goTower = (groupA && ab.includes(towerCount.toString())) ||
    (!groupA && !ab.includes(towerCount.toString()));
  const doubleTurn = {
    '1234': [2, 4, 5, 6],
    '1238': [2, 4, 6, 8],
    '1458': [2, 4, 6, 8],
  };
  const isDoubleTurn = doubleTurn[data.triggerSetConfig.p2一运打法].includes(towerCount);
  if (me === undefined) {
    console.error(data.me, ' is undefined', data.p2hm);
    return 'Error';
  }
  if (data.p2count === 1) {
    const roleGimmick = data.p2hm[0].find((v) => v.buff !== '分摊' && v.role === data.role);
    const lr = output[`${roleGimmick.buff}组`]();
    // 第一轮
    if (data.role === 'tank' || data.role === 'healer') {
      const gimmick = output[me.buff]();
      if (data.triggerSetConfig.p2一运搭档打法 === 'free' && me.buff !== '分摊') {
        data.p2报过了 = true;
        return output.第1轮TN自由({ gimmick, lr });
      }
      const inTower = Boolean(me.buff === '分摊' || (stack && stack.role === data.role));
      data.p2报过了 = true;
      return output[inTower ? '第1轮踩塔TN' : '第1轮闲人TN']({ gimmick, lr });
    }
    if (data.role === 'dps') {
      if (me.buff === '分摊') {
        data.p2报过了 = true;
        return output.第1轮DPS分摊({ lr });
      }
      data.p2报过了 = true;
      return output['第1轮DPS其他']({ gimmick: output[me.buff](), lr: lr });
    }
  }
  if (data.p2BuffCount[data.me] === 0) {
    if (ab.join('') === '1234' && data.p2count === 5) {
      data.p2报过了 = true;
      return output.打法1234();
    }
    if (ab.join('') === '1238' && data.p2count === 8) {
      data.p2报过了 = true;
      return output.打法1238();
    }
    if (ab.join('') === '1458' && data.p2count === 8) {
      data.p2报过了 = true;
      return output.打法1458();
    }
  }
  const spjp = ['2', '4', '6', '8'];
  const goSpjp = spjp.includes(towerCount.toString());
  // 2-8轮
  if (goTower) {
    // 踩塔，每一轮
    data.p2报过了 = true;
    if (me.buff === '分摊') {
      const otherStack = data.p2hm[towerCount - 1].find((v) =>
        v.buff === '分摊' && v.target !== data.me
      );
      return output.第2到8轮踩塔分摊({ i: towerCount, player: otherStack.target });
    }
    return output[`第2到8轮踩塔${isDoubleTurn ? '双' : '单'}`]({
      i: towerCount,
      gimmick: output[me.buff](),
    });
  }
  if (!goSpjp) {
    // 不踩塔，奇数轮，引导
    data.p2报过了 = true;
    // // 没buff的人按照TN左DPS右引导
    if (
      data.p2BuffCount[data.me] === 0 &&
      data.triggerSetConfig.p2一运打法 === '1234' &&
      data.triggerSetConfig.p2一运1234打法没debuff的闲人怎么决定去哪个塔引导 === 'TN左DPS右'
    ) {
      return output[`第2到8轮引导${data.role}`]({ i: towerCount });
    }
    // }
    return output.第2到8轮引导({ i: towerCount, gimmick: output[me.buff]() });
  }
  // 不踩塔，偶数轮，超级跳
  data.p2报过了 = true;
  return output.第2到8轮超级跳({ i: towerCount });
};
const headMarkerData = {
  'tankbuster': '00DA',
  'spread': '007F',
  'stack': '0080',
  '假火': '02A1',
  '真火': '02A2',
  '假冰': '02A3',
  '真冰': '02A4',
  '假雷': '02A5',
  '真雷': '02A6',
  '分摊': '02CB',
  '钢铁': '02CC',
  '扇形': '02CD',
};
const arrowBuffs = {
  '13D7': '上',
  '13D8': '下',
  '13D9': '右',
  '13DA': '左',
  '130C': '上',
  '130D': '下',
  '130E': '右',
  '130F': '左',
};
const p3buff = {
  '640': { name: '混沌之炎' },
  '641': { name: '混沌之水' },
  '642': { name: '混沌之风' },
  '643': { name: '混沌之逆风' },
};
const p3mj = {
  '0150': 1,
  '0151': 2,
  '0152': 3,
  '0153': 4,
  '01B5': 5,
  '01B6': 6,
  '01B7': 7,
  '01B8': 8,
};
const p4buff = {
  '15A8': { name: '叉形闪电', true: '雷分散', false: '水分摊', source: '新生艾克斯迪司' },
  '15A9': { name: '水属性压缩', true: '水分摊', false: '雷分散', source: '新生艾克斯迪司' },
  '15A7': { name: '诅咒之嚎', true: '背对眼', false: '面对眼', source: '新生艾克斯迪司' },
  '15AA': { name: '加速度炸弹', true: '停手', false: '移动', source: '新生艾克斯迪司' },
  '15AB': { name: '混沌之炎', true: '钢铁', false: '月环', source: '卡奥斯' },
  '15AC': { name: '混沌之水', true: '月环', false: '钢铁', source: '卡奥斯' },
  '566': { name: '超越死亡', true: '死超', false: '亚拉戈', source: '新生艾克斯迪司' },
  '1C6': { name: '亚拉戈领域', true: '亚拉戈', false: '死超', source: '新生艾克斯迪司' },
  '1317': { name: '生者之伤', true: '吃蓝', false: '吃紫', source: '新生艾克斯迪司' },
  '1318': { name: '死者之伤', true: '吃紫', false: '吃蓝', source: '新生艾克斯迪司' },
  '15A5': { name: '生者之伤', true: '吃蓝', false: '吃紫', source: '新生艾克斯迪司' },
  '15A6': { name: '死者之伤', true: '吃紫', false: '吃蓝', source: '新生艾克斯迪司' },
};
Options.Triggers.push({
  id: 'DancingMadUltimate',
  zoneId: 1363,
  config: [
    {
      id: 'p1击退加真假火冰打法',
      name: {
        en: 'p1击退加真假火冰打法',
      },
      type: 'select',
      options: {
        en: {
          '正攻（被击退的去下半场）': '正攻',
          '职能固定（不推荐！）未测试': 'TN左DPS右',
          // '正攻（报双安全区）未测试': '双安全区',
        },
      },
      default: '正攻',
    },
    {
      id: 'p2一运打法',
      name: {
        en: 'p2一运打法',
      },
      type: 'select',
      options: {
        en: {
          '1238': '1238',
          '1234（TLB）': '1234',
          '1458 未测试': '1458',
        },
      },
      default: '1238',
    },
    {
      id: 'p2一运搭档打法',
      name: {
        en: 'p2一运决定自己是否踩塔的方法',
      },
      type: 'select',
      options: {
        en: {
          'TH同职能、DPS自己看': 'same',
          '全都自己看': 'free',
        },
      },
      default: 'same',
    },
    {
      id: 'p2一运1234打法没debuff的闲人怎么决定去哪个塔引导',
      name: {
        en: 'p2一运1234打法没debuff的闲人怎么决定去哪个塔引导',
      },
      comment: { en: '其他打法我不知道，我们团是这么打的。' },
      type: 'select',
      options: {
        en: {
          'TN左DPS右': 'TN左DPS右',
        },
      },
      default: 'TN左DPS右',
    },
    // {
    //   id: 'p2一运1238打法4567的闲人怎么决定去哪个塔引导',
    //   name: {
    //     en: 'p2一运1238打法4567的闲人怎么决定去哪个塔引导',
    //   },
    //   comment: { en: '其他打法我不知道，我们团是这么打的。' },
    //   type: 'select',
    //   options: {
    //     en: {
    //       'TN左DPS右': 'TN左DPS右',
    //     },
    //   },
    //   default: 'TN左DPS右',
    // },
  ],
  timeline: `
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
### Phase 1 - Kefka
# TODO: Add voiceline sync?
# en (auto-translate): 'This is my first time, so please take it easy!'
10.6 "--sync--" StartsUsing { id: "C403" } window 20,10
15.6 "Revolting Ruin III 1" Ability { id: "C403" }
18.7 "Revolting Ruin III 2" Ability { id: "C4E1" }
24.8 "--middle--" Ability { id: "C3FD" }
29.2 "Graven Image 1" Ability { id: "BCF2" }
35.1 "Pulse Wave" Ability { id: "BAA9" }
37.4 "Mystery Magic" Ability { id: "BA94" }
37.4 "Blizzard III Blowout" #Ability { id: ["BA9B", "BA98"] }
38.3 "Flagrant Fire III" Ability { id: ["BAA2", "BAA3"] }
42.5 "Wave Cannon" Ability { id: "BAA8" }
44.6 "Double-trouble Trap 1" Ability { id: "BAA6" }
46.0 "Explosion" Ability { id: "BAAA" }
49.6 "--knockback--" # From Double-trouble Trap 1
49.7 "Double-trouble Trap 2" Ability { id: "BAA7" }
53.7 "Mystery Magic" Ability { id: "BA94" }
53.7 "Thrumming Thunder III" #Ability { id: ["BAA1", "BA9F"] }
53.7 "Blizzard III Blowout" #Ability { id: ["BA9B", "BA98"] }
62.7 "Light of Judgment" Ability { id: "C622" }
65.8 "Hyperdrive 1" #Ability { id: "C24B" }
67.8 "Hyperdrive 2" #Ability { id: "C24B" }
69.8 "Hyperdrive 3" #Ability { id: "C24B" }
75.6 "--middle--" Ability { id: "C3FD" }
80.0 "Graven Image 2" Ability { id: "BCF2" } window 10,10
87.1 "Blizzard III Blowout" #Ability { id: ["BA9B", "BA98"] }
87.2 "Gravitas" Ability { id: "BAAC" }
91.2 "Vitrophyre" Ability { id: "BAB0" }
97.1 "Revolting Ruin III 1" Ability { id: "C403" }
100.2 "Revolting Ruin III 2" Ability { id: "C4E1" }
101.1 "Intemperate Will/Gravitational Wave" Ability { id: ["BAB2", "BAB1"] }
105.8 "Gravitas" Ability { id: "BAAC" }
109.8 "Vitrophyre" Ability { id: "BAB0" }
114.4 "Intemperate Will/Gravitational Wave" Ability { id: ["BAB2", "BAB1"] }
117.0 "Gravity III (Pop Window)" #Ability { id: "BAAF" } duration 6 # ~1s remaining on debuff and until 45s on next
118.0 "--knockback--" # From Double-trouble Trap 2
118.1 "Double-Trouble Trap 3" Ability { id: "BAA7" } # NOTE: If it was passed after first set.
132.4 "Light of Judgment" Ability { id: "C622" }
135.6 "Hyperdrive 1" #Ability { id: "C24B" }
137.7 "Hyperdrive 2" #Ability { id: "C24B" }
139.7 "Hyperdrive 3" #Ability { id: "C24B" }
151.5 "Tele-trouncing (castbar)" Ability { id: "BAB9" }
159.4 "Tele-trouncing 1" Ability { id: "BABA" }
162.4 "Tele-trouncing 2" Ability { id: "BABA" }
163.6 "Graven Image 3" Ability { id: "BCF2" } window 10,10
168.7 "--sync--" Ability { id: "C554" }
170.6 "--knockback--" # From Double-trouble Trap 3
173.4 "Indulgent Will" Ability { id: "BAB5" }
173.4 "Idyllic Will" #Ability { id: "BAB6" }
177.7 "--sync--" Ability { id: "C555" }
179.7 "--middle--" Ability { id: "C3FD" }
186.3 "Mystery Magic" Ability { id: "BA94" }
186.3 "Thrumming Thunder III" #Ability { id: ["BAA1", "BA9F"] }
186.3 "Indolent Will/Ave Maria" #Ability { id: ["BAB4", "BAB3"] }
187.1 "Flagrant Fire III" Ability { id: ["BAA2", "BAA3"] }
202.5 "Light of Judgment (Enrage)?" Ability { id: "BABB" } # Kefka >15% HP
### Phase 2 - God Kefka
# TODO: Update with network log, this uses FFLOGS
# TODO: Get fake ending route?
# TODO: Add voiceline sync / branch to complete?
# Complete Path:
# en: 'Yes... I am filled with glorious purpose!'
# Duty Complete Path:
# en: 'How boring. Guess I'll have to spice things up!'
216.5 "Ultimate Embrace" Ability { id: "C24C" } window 220,5
231.7 "Forsaken" Ability { id: "BABC" }
# Set 1
# NOTE: The BAC0 Spelldriver, BAC2 Spellwave, BAC0 Spellscatter can be resolved in different orders
244.9 "The Path of Light 1" Ability { id: "BABE" }
245.6 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
254.3 "Future's End/Past's End 1" Ability { id: ["BAD2", "BAD3"] }
255.0 "The Path of Light 2" Ability { id: "BABE" }
255.7 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
265.7 "All Things Ending" #Ability { id: ["BACD", "BADC", "BADD"] }
# Set 2
265.9 "The Path of Light 3" Ability { id: "BABE" }
266.4 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
275.4 "Future's End/Past's End 2" Ability { id: ["BAD2", "BAD3"] }
275.8 "The Path of Light 4" Ability { id: "BABE" }
276.5 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
286.7 "All Things Ending" #Ability { id: ["BACD", "BADD"] }
# Set 3
286.7 "The Path of Light 5" Ability { id: "BABE" }
287.1 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
296.1 "Future's End/Past's End 3" Ability { id: ["BAD2", "BAD3"] }
296.4 "The Path of Light 6" Ability { id: "BABE" }
297.1 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
307.5 "All Things Ending" #Ability { id: ["BACD", "BADC", "BADD"] }
# Set 4
307.5 "The Path of Light 7" Ability { id: "BABE" }
308.0 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
317.0 "Future's End/Past's End 4" Ability { id: ["BAD2", "BAD3"] }
317.4 "The Path of Light 8" Ability { id: "BABE" }
318.1 "Spelldriver/Spellscatter/Spellwave" Ability { id: ["BAC0", "BAC1", "BAC2"] }
328.3 "All Things Ending" Ability { id: ["BACD", "BADC", "BADD"] }
# Trines
337.4 "Light of Judgment" Ability { id: "BABD" }
348.6 "Trine" Ability { id: "BADF" }
355.7 "Wings of Destruction" Ability { id: "BACD" }
361.5 "Trine 1" #Ability { id: "BAE0" }
363.5 "Trine 2" #Ability { id: "BAE0" }
365.5 "Trine 3" #Ability { id: "BAE0" }
365.9 "Wings of Destruction" Ability { id: "C487" }
365.9 "Wings of Destruction" #Ability { id: "BACF" }
372.9 "Ultimate Embrace" Ability { id: "C24C" }
376.2 "--sync--" StartsUsing { id: "BAE1" } jump "p2-enrage"
379.3 "--sync--" StartsUsing { id: "C3F7" } jump "p2-success"
381.2 "Light of Judgment (Enrage)?" #Ability { id: "BAE1" } # Kefka > 0% HP
382.3 "Aero III Assault?" Ability { id: "C3F7" } forcejump "p2-success"
# TODO: Earlier sync on jump middle
497.0 label "p2-success"
500.0 "Aero III Assault" Ability { id: "C3F7" } window 500,20
### Phase 3 - Chaos and Exdeath
# TODO: Cleanup p3 as there are multiple sequences that could happen
# TODO: Update with network log
# TODO: Add voiceline sync?
# en: 'Hmph. I see what's going on here.'
537.7 "Definition of Insanity" Ability { id: "BAE2" }
543.8 "the Decisive Battle" Ability { id: "C2E3" }
543.8 "the Decisive Battle" #Ability { id: "C2E2" }
548.0 "--sync--" Ability { id: "C554" }
# Fire, Water, and Wind Elements
563.1 "Bowels of Agony" Ability { id: "BAF2" }
582.1 "Stray Spray" Ability { id: "BAF6" }
582.1 "Thunder III" #Ability { id: "BB12" }
583.1 "Tsunami" Ability { id: "BAF5" }
584.9 "Cyclone" Ability { id: "BAF8" }
591.3 "Thunder III" Ability { id: "BB09" }
591.3 "Thunder III" #Ability { id: "BB0C" }
594.3 "Thunder III" #Ability { id: "BB0C" }
597.0 "--sync--" Ability { id: "C555" }
603.0 "Trance" Ability { id: "C2D6" }
604.2 "Longitudinal Implosion/Latitudinal Implosion" Ability { id: ["BAFD", "BAFE"] }
605.0 "Shockwave" #Ability { id: "BAFF" }
607.0 "Shockwave" #Ability { id: "BAFF" }
609.0 "Stray Flames" Ability { id: "BAF3" }
610.0 "Inferno" Ability { id: "BAF4" }
611.7 "Cyclone" Ability { id: "BAF8" }
# Limit Cut Preview
620.3 "Ultima Blaster" #Ability { id: "BAE3" }
622.3 "Ultima Blaster" #Ability { id: "BAE3" }
624.3 "Ultima Blaster" #Ability { id: "BAE3" }
624.4 "Umbra Smash" Ability { id: "BB00" }
626.3 "Ultima Blaster" #Ability { id: "BAE3" }
627.3 "Vacuum Wave" Ability { id: "BB13" }
628.3 "Ultima Blaster" #Ability { id: "BAE3" }
630.3 "Ultima Blaster" #Ability { id: "BAE3" }
631.3 "Cyclone" Ability { id: "BAF8" }
632.4 "Ultima Blaster" #Ability { id: "BAE3" }
632.7 "Aetherlink" #Ability { id: "C2E5" }
632.7 "Aetherlink" #Ability { id: "C2E4" }
# Limit Cut
634.4 "Ultima Blaster" #Ability { id: "BAE3" }
642.4 "Ultima Blaster 1" #Ability { id: "BAE4" }
642.6 "Ultima Blaster 2" #Ability { id: "BAE4" }
642.8 "Ultima Blaster 3" #Ability { id: "BAE4" }
643.0 "Ultima Blaster 4" #Ability { id: "BAE4" }
643.2 "Ultima Blaster 5" #Ability { id: "BAE4" }
643.4 "Ultima Blaster 6" #Ability { id: "BAE4" }
643.6 "Ultima Blaster 7" #Ability { id: "BAE4" }
643.8 "Ultima Blaster 8" #Ability { id: "BAE4" }
649.7 "Thunder III" Ability { id: "BB09" }
649.7 "Thunder III" #Ability { id: "BB0C" }
652.7 "Thunder III" #Ability { id: "BB0C" }
657.7 "the Decisive Battle" Ability { id: "C2E3" }
657.7 "the Decisive Battle" #Ability { id: "C2E2" }
666.8 "Thunder III" Ability { id: "BB09" }
666.8 "Thunder III" #Ability { id: "BB0C" }
# Giant Kefka + Earth Element
668.6 "Max" Ability { id: "BAE5" }
669.8 "Thunder III" #Ability { id: "BB0C" }
671.8 "Earthquake" Ability { id: "C571" }
671.8 "Earthquake" #Ability { id: "C572" }
680.5 "Earthquake" Ability { id: "BAFA" }
684.1 "Earthquake" Ability { id: "BAFA" }
687.4 "Slap Happy" Ability { id: "BAE7" }
688.2 "Slap Happy" #Ability { id: "BAE8" }
688.9 "Slap Happy" #Ability { id: "BAE8" }
689.7 "Slap Happy" #Ability { id: "BAE8" }
690.9 "Slap Happy" Ability { id: "BAE9" }
690.9 "Shockwave" #Ability { id: "BAEB" }
691.2 "Black Hole" Ability { id: "BAFB" }
698.3 "Nothingness" Ability { id: "BAFC" }
698.3 "Aetherlink" #Ability { id: "C2E5" }
698.3 "Aetherlink" #Ability { id: "C2E4" }
705.3 "Nothingness" Ability { id: "BAFC" }
708.4 "Thunder III" Ability { id: "BB09" }
708.4 "Thunder III" #Ability { id: "BB0C" }
711.4 "Thunder III" #Ability { id: "BB0C" }
712.7 "Earthquake" Ability { id: "BAFA" }
716.5 "Damning Edict" Ability { id: "BB01" }
717.7 "Slap Happy" Ability { id: "BAE7" }
718.5 "Slap Happy" #Ability { id: "BAE8" }
719.2 "Slap Happy" #Ability { id: "BAE8" }
720.0 "Slap Happy" #Ability { id: "BAE8" }
721.2 "Slap Happy" Ability { id: "BAE9" }
721.2 "Shockwave" #Ability { id: "BAEB" }
724.6 "Black Spark" Ability { id: "BCCD" }
728.6 "Nothingness" Ability { id: "BAFC" }
730.2 "Earthquake" Ability { id: "BAFA" }
733.8 "Nothingness" #Ability { id: "BAFC" }
733.8 "Nothingness" #Ability { id: "BAFC" }
735.4 "Earthquake" Ability { id: "BAFA" }
739.0 "Nothingness" Ability { id: "BAFC" }
744.0 "Damning Edict" Ability { id: "BB01" }
744.4 "Look upon Me and Despair" Ability { id: "BAEC" }
745.4 "Look upon Me and Despair" Ability { id: "BAEE" }
747.5 "Blackblood" Ability { id: "C4BA" }
747.5 "Earthquake" Ability { id: "BAFA" }
749.7 "Thunder III" Ability { id: "BB09" }
749.7 "Thunder III" #Ability { id: "BB0C" }
752.7 "Thunder III" #Ability { id: "BB0C" }
762.8 "Nothingness" #Ability { id: "BAFC" }
762.8 "Nothingness" #Ability { id: "BAFC" }
764.4 "Earthquake" Ability { id: "BAFA" }
765.0 "Aetherlink" Ability { id: "C2E5" }
765.0 "Aetherlink" #Ability { id: "C2E4" }
768.0 "Nothingness" #Ability { id: "BAFC" }
768.0 "Nothingness" #Ability { id: "BAFC" }
769.6 "Earthquake" Ability { id: "BAFA" }
773.2 "Nothingness" #Ability { id: "BAFC" }
773.2 "Nothingness" #Ability { id: "BAFC" }
784.2 "White Hole" Ability { id: "BD66" }
784.2 "Longitudinal Implosion/Latitudinal Implosion" Ability { id: ["BAFD", "BAFE"] }
785.0 "Shockwave" #Ability { id: "BAFF" }
785.9 "Slap Happy" Ability { id: "BAE6" }
786.8 "Slap Happy" #Ability { id: "BAE8" }
787.2 "Shockwave" #Ability { id: "BAFF" }
787.4 "Slap Happy" #Ability { id: "BAE8" }
788.1 "Slap Happy" #Ability { id: "BAE8" }
789.3 "Slap Happy" Ability { id: "BAE9" }
789.3 "Shocking Impact" Ability { id: "BAEA" }
792.5 "Black Spark" Ability { id: "BCCD" }
796.5 "Nothingness" #Ability { id: "BAFC" }
796.5 "Nothingness" #Ability { id: "BAFC" }
802.2 "Look upon Me and Despair" Ability { id: "BAED" }
803.2 "Look upon Me and Despair" Ability { id: "BAEE" }
803.5 "Nothingness" #Ability { id: "BAFC" }
# Blizzards and Towers
# Summary:
# 1. Bait 2 Puddles
# 2. Role 1 4-Stack
# 3. Role 2 2-NW Towers
# 4. Role 2 2-NE Towers
# 5. Role 1 2-NW Towers
# 6. Role 1 2-NE Towers
# 7. Role 2 4-Stack
# 8. Deep Freeze (Blizzard)
805.3 "--sync--" Ability { id: "C533" }
812.4 "Blizzard III (castbar)" Ability { id: "BB0F" }
814.3 "Earthquake?" #Ability { id: "BAFA" }
815.4 "Blizzard III 1" Ability { id: "BB0D" }
816.3 "Stomp-a-Mole (castbar)" Ability { id: "BAEF" } # Possibly determines which foot he starts with and/or its based on facing?
817.9 "Knock Down 1" Ability { id: "BB02" }
818.0 "Stomp-a-Mole 1" Ability { id: "BAF0" }
818.4 "Blizzard III 2" Ability { id: "BB0D" }
819.3 "Stomp-a-Mole 2" Ability { id: "BAF0" }
820.6 "Stomp-a-Mole 3" Ability { id: "BAF0" }
821.9 "Stomp-a-Mole 4" Ability { id: "BAF0" }
823.3 "Knock Down 2" Ability { id: "BB03" }
826.4 "Blizzard III" Ability { id: "BB11" }
827.4 "Big Bang" Ability { id: "BB05" }
827.4 "Big Bang" #Ability { id: "BB06" }
840.8 "--sync--" StartsUsing { id: "C258" } jump "p3-enrage"
840.8 "--sync--" StartsUsing { id: "C259" } jump "p3-enrage"
845.8 "Meteor (Enrage)?" Ability { id: "C258" } # Exdeath >0% HP?
845.8 "Bowels of Agony (Enrage)?" Ability { id: "C259" } # Chaos >0% HP?
# Phase 2 Enrage Sequence
10376.2 label "p2-enrage"
10381.2 "Light of Judgment (Enrage)" Ability { id: "BAE1" } # Kefka > 0% HP
# Phase 3 Enrage Sequence
10840.8 label "p3-enrage"
10845.8 "Meteor (Enrage)" Ability { id: "C258" } # Exdeath >0% HP?
10845.8 "Bowels of Agony (Enrage)" Ability { id: "C259" } # Chaos >0% HP?
`,
  initData: () => {
    return {
      phase: 'p1-1a',
      假冰: false,
      假火: false,
      假雷: false,
      p1Tethers: [],
      p1毒: [],
      p1Cannon: [],
      combatantData: [],
      p1放石头: false,
      p1Arrow: [],
      p1石头count: 1,
      p3究极冲击波hdg: [],
      p1收集: [],
      eyeTowerIds: [],
      fakeEyeTowerIds: [],
      p2未来过去count: 0,
      purpleTowerIds: [],
      yellowTowerIds: [],
      p2hm: {},
      p2count: 1,
      p2第一轮踩塔人: [],
      p2BuffCount: {},
      p2报过了: false,
      p3buffs: {},
      p3jjcjb: undefined,
      p4真假: {
        '新生艾克斯迪司': [],
        '卡奥斯': [],
      },
      p4count: {
        '新生艾克斯迪司': 0,
        '卡奥斯': 0,
      },
      p4CastCount: 0,
      p4buffs: {},
      p4Text: {},
      p1IsTether: false,
    };
  },
  triggers: [
    {
      id: 'DMU Phase Tracker',
      type: 'StartsUsing',
      netRegex: { id: Object.keys(phases) },
      run: (data, matches) => data.phase = phases[matches.id] ?? 'unknown',
    },
    {
      id: 'DMU Phase P1 Tracker',
      type: 'StartsUsing',
      netRegex: { id: 'BCF2' },
      run: (data) => {
        if (data.phase === 'p1-1a') {
          return;
        } else if (data.phase === 'p1-1b') {
          data.phase = 'p1-2';
        } else if (data.phase === 'p1-2') {
          data.phase = 'p1-3';
        }
      },
    },
    {
      id: 'DMU P1 Graven Image Collect',
      // Tower entity actions
      // The CombatantMemory Add lines are added prior to combat
      // OverlayPlugin can retrieve the matching BNpcID
      // However, these entities seem to always spawn in the same order and the
      // first tower is the highest ID and the towers are in sequential order
      // These are the BNpcID values:
      // 1EBFBB (2015163) => Wave Cannon entity (blue)
      // 1EBFBC (2015164) => Gravitational Wave entity (purple)
      // 1EBFBD (2015165) => Intemperate Will entity (yellow)
      // 1EBFBE (2015166) => Indolent Will entity (eye)
      // 1EBFBF (2015167) => Ave Maria entity (fake eye)
      // There are two of each, they are added at start of fight
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      preRun: (data, matches) => {
        const id = parseInt(matches.id, 16);
        // const blueTowers = [id, id - 1]; // First tower is blue and highest ID
        const purpleTowers = [id - 2, id - 4]; // Next are in pair with yellow
        const yellowTowers = [id - 3, id - 5];
        const eyeTowers = [id - 7, id - 9]; // Next are in paire with fake
        const fakeEyeTowers = [id - 6, id - 8];
        const toStringId = (id) => {
          return id.toString(16).toUpperCase();
        };
        // data.blueTowerIds = blueTowers.map((id) => toStringId(id));
        data.purpleTowerIds = purpleTowers.map((id) => toStringId(id));
        data.yellowTowerIds = yellowTowers.map((id) => toStringId(id));
        data.eyeTowerIds = eyeTowers.map((id) => toStringId(id));
        data.fakeEyeTowerIds = fakeEyeTowers.map((id) => toStringId(id));
      },
      suppressSeconds: 99999,
    },
    {
      id: 'DMU P1 恶狠狠毁荡',
      type: 'StartsUsing',
      netRegex: { id: 'C403' },
      response: Responses.tankBuster(),
    },
    {
      id: 'DMU P1 tether',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-1a',
      preRun: (data, matches) => {
        data.p1Tethers.push(matches.target);
      },
      delaySeconds: 0.5,
      durationSeconds: 6,
      infoText: (data, _matches, output) => {
        if (data.p1Tethers.length !== 0) {
          if (data.p1Tethers.includes(data.me)) {
            data.p1Tethers = [];
            data.p1IsTether = true;
            return output.tetherOnYou();
          }
          data.p1Tethers = [];
          data.p1IsTether = false;
          return output.idle();
        }
      },
      outputStrings: {
        tetherOnYou: { en: '击退' },
        idle: { en: '无' },
      },
    },
    {
      id: 'DMU 真假',
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.假冰,
          headMarkerData.真冰,
          headMarkerData.假火,
          headMarkerData.真火,
          headMarkerData.假雷,
          headMarkerData.真雷,
        ],
        capture: true,
      },
      preRun: (data, matches) => {
        if (matches.id === headMarkerData.假冰) {
          data.假冰 = true;
        } else if (matches.id === headMarkerData.真冰) {
          data.假冰 = false;
        } else if (matches.id === headMarkerData.假火) {
          data.假火 = true;
        } else if (matches.id === headMarkerData.真火) {
          data.假火 = false;
        } else if (matches.id === headMarkerData.假雷) {
          data.假雷 = true;
        } else if (matches.id === headMarkerData.真雷) {
          data.假雷 = false;
        }
      },
      delaySeconds: 5,
      run: (data) => {
        data.假冰 = false;
        data.假火 = false;
      },
    },
    {
      id: 'DMU 连环环陷阱',
      type: 'GainsEffect',
      netRegex: { effectId: '13D6' },
      preRun: (data, matches) => {
        data.p1毒.push(matches.target);
      },
    },
    {
      id: 'DMU 连环环陷阱L',
      type: 'LosesEffect',
      netRegex: { effectId: '13D6' },
      preRun: (data, matches) => {
        data.p1毒 = data.p1毒.filter((name) => name !== matches.target);
      },
    },
    {
      id: 'DMU 连环环陷阱预兆',
      type: 'GainsEffect',
      netRegex: { effectId: '13D6' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3.5,
      suppressSeconds: 1,
      countdownSeconds: 3.5,
      response: (data, _matches, output) => {
        if (data.phase === 'p1-1a') {
          data.phase = 'p1-1b';
        }
        if (data.p1毒.includes(data.me))
          return { alarmText: output.text() };
        return { alertText: output.idle() };
      },
      outputStrings: {
        text: { en: '传毒（出去）' },
        idle: { en: '吃毒' },
      },
    },
    {
      id: 'DMU 头标',
      type: 'HeadMarker',
      netRegex: { id: [headMarkerData.stack, headMarkerData.spread] },
      delaySeconds: (data) => data.phase === 'p1-1a' ? (data.p1IsTether ? 1.65 : 0.5) : 0.5,
      durationSeconds: 6,
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        if (data.phase === 'p1-3') {
          if (
            (!data.假火 && matches.id === headMarkerData.stack) ||
            (data.假火 && matches.id === headMarkerData.spread)
          )
            return output[`${data.假雷 ? '假雷' : '真雷'}分摊`]();
          return output[`${data.假雷 ? '假雷' : '真雷'}分散`]();
        }
        if (
          (!data.假火 && matches.id === headMarkerData.stack) ||
          (data.假火 && matches.id === headMarkerData.spread)
        )
          return output.stack();
        return output.spread();
      },
      outputStrings: {
        stack: { en: '分摊' },
        spread: { en: '散开散开！' },
        假雷分摊: { en: '危险区+分摊' },
        真雷分摊: { en: '安全区+分摊' },
        假雷分散: { en: '危险区+散开' },
        真雷分散: { en: '安全区+散开' },
      },
    },
    {
      id: 'DMU P1 真假雷',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BA98', 'BA9E'] },
      condition: (data) => data.phase === 'p1-1a',
      durationSeconds: 6,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        const dirNum = Directions.hdgTo8DirNum(parseFloat(matches.heading));
        const rr = [1, 7, 3, 5];
        const [n1, n2] = ([(dirNum + 2) % 8, (dirNum + 4 + 2) % 8].sort((a, b) => {
          return rr.indexOf(a) - rr.indexOf(b);
        }));
        if (data.triggerSetConfig.p1击退加真假火冰打法 === 'TN左DPS右') {
          return output
            [`${'TN左DPS右'}${Directions.outputFrom8DirNum([5, 7].includes(n1) ? n1 : n2)}`]();
        }
        if (data.triggerSetConfig.p1击退加真假火冰打法 === '正攻') {
          const n = (data.p1IsTether ? [3, 5] : [1, 7]).includes(n1) ? n1 : n2;
          const nn = {
            3: 1,
            5: 7,
            1: 1,
            7: 7,
          }[n];
          return output[`${'正攻'}${Directions.outputFrom8DirNum(nn)}${nn !== n ? '击退' : ''}`]();
        }
        // if (data.triggerSetConfig.p1击退加真假火冰打法 === '双安全区') {
        //   return output.text!({
        //     dir1: output[Directions.outputFrom8DirNum(n1)]!(),
        //     dir2: output[Directions.outputFrom8DirNum(n2)]!(),
        //   });
        // }
      },
      outputStrings: {
        text: { en: '${dir1}${dir2}' },
        dirNE: { en: '二' },
        dirSE: { en: '三' },
        dirSW: { en: '四' },
        dirNW: { en: '一' },
        正攻dirNE: { en: '右上' },
        正攻dirNE击退: { en: '右上击退' },
        正攻dirSE: { en: '右下' },
        正攻dirSW: { en: '左下' },
        正攻dirNW: { en: '左上' },
        正攻dirNW击退: { en: '左上击退' },
        TN左DPS右dirNE: { en: '右上' },
        TN左DPS右dirSE: { en: '右下' },
        TN左DPS右dirSW: { en: '左下' },
        TN左DPS右dirNW: { en: '左上' },
      },
    },
    {
      id: 'DMU P1 真假雷冰',
      type: 'StartsUsing',
      netRegex: { id: 'BA94' },
      condition: (data) => data.phase === 'p1-1b',
      delaySeconds: 0.25,
      infoText: (data, _matches, output) => {
        return output[`${data.假冰 ? '假' : '真'}冰${data.假雷 ? '假' : '真'}雷`]();
      },
      outputStrings: {
        '真冰真雷': { en: '都躲开' },
        '真冰假雷': { en: '吃直条' },
        '假冰真雷': { en: '吃扇形' },
        '假冰假雷': { en: '都吃' },
      },
    },
    {
      id: 'DMU 制裁之光',
      type: 'StartsUsing',
      netRegex: { id: 'C622' },
      response: (data) => {
        if (data.role === 'tank' || data.role === 'healer') {
          return { alertText: '大AoE伤害！ => 死刑x3' };
        }
        return { infoText: '大AoE伤害！' };
      },
    },
    {
      id: 'DMU P1 Wave Cannon',
      type: 'Ability',
      netRegex: { id: 'BAA8' },
      condition: (data) => data.phase === 'p1-1a',
      preRun: (data, matches) => {
        if (matches.type === '21') {
          data.p1Cannon.push(matches.target);
        }
        if (matches.type === '22' && (+matches.targetCount === (+matches.targetIndex + 1))) {
          data.p1Cannon.push(matches.target);
        }
      },
      response: (data, _matches, output) => {
        if (data.p1Cannon.length === 4) {
          if (data.p1Cannon.includes(data.me)) {
            data.p1Cannon = [];
            return { infoText: output.avoid() };
          }
          data.p1Cannon = [];
          return { alertText: output.tower() };
        }
      },
      outputStrings: {
        avoid: { en: '躲开' },
        tower: { en: '踩塔' },
      },
    },
    {
      id: 'DMU P1 神像2 连线',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data, matches) => data.phase === 'p1-2' && matches.target === data.me,
      durationSeconds: 6,
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants;
      },
      response: (data, _matches, output) => {
        const x = data.combatantData[0].PosX;
        if (x < 110) {
          data.p1放石头 = false;
          // 放黑洞
          return {
            infoText: output.placeBlackHole(),
          };
        }
        // 放石头
        data.p1放石头 = true;
        return { alertText: output.placeRock() };
      },
      outputStrings: {
        placeBlackHole: { en: '黑洞' },
        placeRock: { en: '石头' },
      },
    },
    {
      id: 'DMU P1 神像2 连线++',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data, matches) => data.phase === 'p1-2' && matches.target === data.me,
      delaySeconds: 2,
      durationSeconds: 4,
      suppressSeconds: 60,
      infoText: (data, _matches, output) => {
        return data.假冰 ? output.假冰() : output.真冰();
      },
      outputStrings: {
        假冰: { en: '吃扇形' },
        真冰: { en: '不吃' },
      },
    },
    {
      id: 'DMU P1 神像2 连线~',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-2',
      delaySeconds: (data) => data.p1石头count === 1 ? 6 : 8.5,
      response: (data, matches, output) => {
        if (matches.target === data.me) {
          data.p1石头count++;
          return data.p1放石头 ? { alarmText: output.placeRock() } : { infoText: output.mid() };
        }
      },
      outputStrings: {
        placeRock: { en: '出去放石头' },
        mid: { en: '中间' },
      },
    },
    {
      id: 'DMU P1 神像3',
      type: 'GainsEffect',
      netRegex: { 'effectId': Object.keys(arrowBuffs) },
      condition: Conditions.targetIsYou(),
      durationSeconds: 10,
      infoText: (data, matches, output) => {
        data.p1Arrow.push({
          a: arrowBuffs[matches.effectId],
          s: parseFloat(matches.duration),
        });
        if (data.p1Arrow.length === 2) {
          // const r = ['左', '右', '上', '下'];
          const a = data.p1Arrow.sort((a, b) => a.s - b.s);
          return output.text({
            a1: output[a[0].a](),
            a2: output[a[1].a](),
          });
        }
      },
      outputStrings: {
        'text': '${a1} + ${a2}',
        '上': '上',
        '下': '下',
        '左': '左',
        '右': '右',
      },
    },
    {
      id: 'DMU P1 神像3 连线收集',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-3',
      preRun: (data, matches) => {
        data.p1收集.push({ sourceId: matches.sourceId, target: matches.target });
      },
    },
    {
      id: 'DMU P1 神像3 连线',
      type: 'Tether',
      netRegex: { id: '002D' },
      condition: (data) => data.phase === 'p1-3',
      delaySeconds: 3,
      durationSeconds: 7,
      promise: async (data) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
        })).combatants;
      },
      response: (data, matches, output) => {
        if (matches.target === data.me) {
          const id = data.p1收集.find((v) => v.target === data.me).sourceId;
          const x = data.combatantData.find((v) => v.ID === parseInt(id, 16)).PosX;
          if (x < 100) {
            return { alertText: output.a() };
          }
          return { infoText: output.b() };
        }
      },
      outputStrings: {
        a: { en: '去外面' },
        b: { en: '在里面' },
      },
    },
    {
      id: 'DMU P1 Ave Maria',
      // BAB3 Ave Maria
      // The animation is visible ~9.89s before cast goes off, however
      // When animation becomes visible, the players will be asleep or
      // confused for another ~3.4s. Once the debuff ends the players have
      // ~6.4s to turn character
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.fakeEyeTowerIds.includes(matches.id),
      durationSeconds: 10,
      countdownSeconds: 3.4,
      alarmText: (_data, _matches, output) => output.lookAt(),
      outputStrings: {
        lookAt: {
          en: 'Look At Statue',
          cn: '看神像',
        },
      },
    },
    {
      id: 'DMU P1 Indolent Will',
      // BAB4 Indolent Will
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.eyeTowerIds.includes(matches.id),
      durationSeconds: 10,
      countdownSeconds: 3.4,
      alarmText: (_data, _matches, output) => output.lookAway(),
      outputStrings: {
        lookAway: {
          en: 'Look Away From Statue',
          cn: '背对神像',
        },
      },
    },
    {
      id: 'DMU P1 Impertinent Will',
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.yellowTowerIds.includes(matches.id),
      alertText: (_data, _matches, output) => output.goWest(),
      outputStrings: {
        goWest: Outputs.getLeftAndWest,
      },
    },
    {
      id: 'DMU P1 Gravitational Wave',
      type: 'ActorControlExtra',
      netRegex: { category: '019D', param1: '40', param2: '80', capture: true },
      condition: (data, matches) => data.purpleTowerIds.includes(matches.id),
      alertText: (_data, _matches, output) => output.goEast(),
      outputStrings: {
        goEast: Outputs.getRightAndEast,
      },
    },
    {
      id: 'DMU P2 双腕',
      type: 'StartsUsing',
      netRegex: { id: 'C24C' },
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'DMU P2 遗弃末世',
      type: 'StartsUsing',
      netRegex: { id: 'BABC' },
      response: Responses.bigAoe(),
    },
    {
      id: 'DMU P2 未来终结',
      type: 'StartsUsing',
      netRegex: { id: 'BAD2' },
      preRun: (data) => {
        data.p2未来过去count++;
      },
      delaySeconds: 7,
      durationSeconds: (data) => data.p2未来过去count === 4 ? 10 : 5,
      alarmText: (data, _matches, output) => {
        if (data.p2未来过去count === 4) {
          return output.text4();
        }
        return output.text();
      },
      outputStrings: {
        text: '未来，塔对面，对面',
        text4: '未来，要穿，要穿',
      },
    },
    {
      id: 'DMU P2 过去终结',
      type: 'StartsUsing',
      netRegex: { id: 'BAD3' },
      preRun: (data) => {
        data.p2未来过去count++;
      },
      delaySeconds: 7,
      durationSeconds: (data) => data.p2未来过去count === 4 ? 10 : 5,
      alarmText: (data, _matches, output) => {
        if (data.p2未来过去count === 4) {
          return output.text4();
        }
        return output.text();
      },
      outputStrings: {
        text: '过去，塔中间，中间',
        text4: '过去，留原地，原地',
      },
    },
    {
      id: 'DMU P2 HM',
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.分摊,
          headMarkerData.钢铁,
          headMarkerData.扇形,
        ],
      },
      preRun: (data, matches) => {
        data.p2hm[data.p2count - 1] ??= [];
        data.p2hm[data.p2count - 1].push({
          target: matches.target,
          buff: {
            [headMarkerData.分摊]: '分摊',
            [headMarkerData.钢铁]: '钢铁',
            [headMarkerData.扇形]: '扇形',
          }[matches.id],
          role: data.party.nameToRole_[matches.target],
        });
      },
    },
    {
      id: 'DMU P2 第一轮踩塔',
      type: 'Ability',
      netRegex: { id: 'BABE' },
      preRun: (data, matches) => {
        if (data.p2第一轮踩塔人.length >= 4) {
          return;
        }
        data.p2第一轮踩塔人.push(matches.target);
      },
    },
    {
      id: 'DMU P2 踩塔计数',
      type: 'Ability',
      netRegex: { id: 'BABE' },
      preRun: (data) => {
        data.p2count++;
        data.p2报过了 = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'DMU P2 事',
      type: 'GainsEffect',
      netRegex: {
        effectId: '13DB',
      },
      preRun: (data, matches) => {
        data.p2BuffCount[matches.target] = Number(matches.count);
      },
    },
    {
      id: 'DMU P2 没事干了',
      type: 'LosesEffect',
      netRegex: {
        effectId: '13DB',
      },
      preRun: (data, matches) => {
        data.p2BuffCount[matches.target] = 0;
      },
      delaySeconds: (data) => data.triggerSetConfig.p2一运打法 === '1234' ? 6 : 0.25,
      infoText: (data, matches, output) => {
        if (data.p2count === 9) {
          return;
        }
        if (data.p2报过了) {
          return;
        }
        return getP2(data, matches, output);
      },
      outputStrings: {
        ...p2OutputStirngs,
      },
    },
    {
      id: 'DMU P2 HM判',
      comment: {
        en: '为了尽量适配所有打法 + 尽量不引入职能分配悬浮窗。第一轮DPS请自己判断是否进塔……',
      },
      type: 'HeadMarker',
      netRegex: {
        id: [
          headMarkerData.分摊,
          headMarkerData.钢铁,
          headMarkerData.扇形,
        ],
      },
      delaySeconds: (data) => {
        return [3, 5, 7].includes(data.p2count) ? 5 : 0.25;
      },
      durationSeconds: 10,
      suppressSeconds: 1,
      infoText: (data, matches, output) => {
        if (data.p2报过了) {
          return;
        }
        return getP2(data, matches, output);
      },
      outputStrings: {
        ...p2OutputStirngs,
      },
    },
    {
      id: 'DMU P2 Light of Judgment',
      type: 'StartsUsing',
      netRegex: { id: 'BABD', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'DMU P2 Single Wing of Destruction',
      // BACD Wings of Destruction, Left wing highlight
      // BACE Wingso of Desctruction, Right wing highlight
      // Halfroom cleaves
      type: 'StartsUsing',
      netRegex: { id: ['BACD', 'BACE'], capture: true },
      infoText: (_data, matches, output) => {
        if (matches.id === 'BACD')
          return output.right();
        return output.left();
      },
      outputStrings: {
        right: Outputs.right,
        left: Outputs.left,
      },
    },
    {
      id: 'DMU P2 Wings of Destruction',
      type: 'StartsUsing',
      netRegex: { id: 'C487', capture: false },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          maxMeleeAvoidTanks: {
            en: 'Max Melee: Avoid Tanks',
            cn: '最大近战距离，避开坦克',
          },
          wingsBeNearFar: {
            en: 'Wings: Be Near/Far',
            cn: '双翅膀：近或远',
          },
        };
        if (data.role === 'tank')
          return { alertText: output.wingsBeNearFar() };
        return { infoText: output.maxMeleeAvoidTanks() };
      },
    },
    {
      id: 'DMU P2 Aero III Assault',
      // Knockback from boss that can't be resisted
      // Applies 306 Down for the Count
      type: 'StartsUsing',
      netRegex: { id: 'C3F7', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'DMU P3 debuff',
      type: 'StartsUsing',
      netRegex: { id: ['C2E2', 'C2E3'] },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '获取防火墙',
      },
    },
    {
      id: 'DMU P3 深层痛楚',
      type: 'StartsUsing',
      netRegex: { id: 'BAF2' },
      response: Responses.aoe(),
    },
    {
      id: 'DMU P3-1 debuff',
      type: 'GainsEffect',
      netRegex: {
        effectId: Object.keys(p3buff),
      },
      preRun: (data, matches) => {
        data.p3buffs[matches.target] ??= [];
        data.p3buffs[matches.target].push({
          name: p3buff[matches.effectId].name,
          duration: parseFloat(matches.duration),
        });
      },
    },
    {
      id: 'DMU P3-1 debuff 风',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['642', '643'],
      },
      condition: (data, matches) => {
        return data.phase === 'p3' && matches.target === data.me;
      },
      delaySeconds: 68 - 10,
      countdownSeconds: 68 - 10 - 3,
      response: (_data, matches, output) => {
        return {
          [matches.id === '642' ? 'infoText' : 'alertText']: output[matches.effectId](),
        };
      },
      outputStrings: {
        '643': '面向艾克斯迪斯',
        '642': '背对BOSS',
      },
    },
    {
      id: 'DMU P3-1 debuff 水火',
      type: 'GainsEffect',
      netRegex: {
        effectId: ['640', '641'],
      },
      condition: (data, matches) => {
        // console.warn(data.phase);
        return data.phase === 'p3' && matches.target === data.me;
      },
      delaySeconds: 0.5,
      suppressSeconds: 200,
      countdownSeconds: (_data, matches) => {
        return parseFloat(matches.duration);
      },
      infoText: (_data, matches, output) => {
        return output
          [
            `${parseFloat(matches.duration) > 60 ? '长' : '短'}${
              matches.effectId === '640' ? '火' : '水'
            }`
          ]();
      },
      outputStrings: {
        长火: '长火',
        短火: '短火',
        长水: '长水',
        短水: '短水',
      },
    },
    {
      id: 'DMU P3 究极冲击波',
      type: 'AbilityExtra',
      netRegex: { id: 'BAE3' },
      preRun: (data, matches) => {
        data.p3究极冲击波hdg.push(parseFloat(matches.heading));
      },
      durationSeconds: 20,
      alertText: (data, _matches, output) => {
        if (data.p3究极冲击波hdg.length === 2) {
          const [c1, c2] = data.p3究极冲击波hdg;
          const dir1 = Directions.hdgTo8DirNum(c1);
          const dir2 = Directions.hdgTo8DirNum(c2);
          const start = Directions.outputFrom8DirNum(dir1);
          const clock = (dir2 - dir1 === 1) || (dir2 === 0 && dir1 === 7);
          const clk = clock ? '顺' : '逆';
          data.p3jjcjb = {
            c1,
            c2,
            clk,
          };
          return output.text({
            start: output[start](),
            clk: output[clk](),
          });
        }
      },
      outputStrings: {
        text: '${start} ${clk}',
        顺: '逆←',
        逆: '顺→',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'B',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'D',
        unknown: 'unknown',
      },
    },
    {
      id: 'DMU P3 MJ',
      type: 'HeadMarker',
      netRegex: { id: Object.keys(p3mj), capture: true },
      condition: (data, matches) => data.phase === 'p3' && matches.target === data.me,
      durationSeconds: 12,
      infoText: (data, matches, output) => {
        const n = p3mj[matches.id];
        // 这里的clk没取反，是boss的冲锋顺序
        const { c1, clk } = data.p3jjcjb;
        const dir1 = Directions.hdgTo8DirNum(c1);
        const g = dir1 * 2 + ((clk !== '顺' ? (+(n - 1)) : (-(n - 1))) * 2) + 1;
        const r = (g + 16) % 16;
        const [a1, a2] = [
          Directions.outputFrom8DirNum(((r - 1 + 16) % 16) / 2),
          Directions.outputFrom8DirNum(((r + 1) % 16) / 2),
        ];
        const r1 = output[a1]();
        const r2 = output[a2]();
        // console.log(`${data.me}:${n}麻,起点${dir1}${clk}，a1=${a1},a2=${a2},去${r1}/${r2}`);
        return output.text({ n, r1, r2 });
      },
      outputStrings: {
        text: '${n}麻，去 ${r1}${r2}之间',
        dirNW: '1',
        dirN: 'A',
        dirNE: '2',
        dirE: 'B',
        dirSE: '3',
        dirS: 'C',
        dirSW: '4',
        dirW: 'D',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Future\'s End/Past\'s End': 'Future/Past\'s End',
      },
    },
    {
      'locale': 'cn',
      'replaceText': {
        'Revolting Ruin III': '恶狠狠毁荡',
        'Graven Image': '众神之像',
        'Pulse Wave': '波动冲击',
        'Mystery Magic': '玄乎乎魔法',
        'Blizzard III Blowout': '扩大大冰封',
        'Flagrant Fire III': '呼啦啦爆炎',
        'Wave Cannon': '波动炮',
        'Double-trouble Trap': '连环环陷阱',
        'Explosion': '大引爆',
        'Thrumming Thunder III': '劈啪啪暴雷',
        'Light of Judgment': '制裁之光',
        'Hyperdrive': '超驱动',
        'Gravitas': '重力弹',
        'Vitrophyre': '岩石弹',
        'Intemperate Will': '扑杀的神气',
        'Gravitational Wave': '重力波',
        'Double-Trouble Trap': '连环环陷阱',
        'Gravity III': '强重力',
        'Tele-trouncing': '唰啦啦传送',
        'Indulgent Will': '圣母的神气',
        'Idyllic Will': '睡魔的神气',
        'Indolent Will': '懒惰的神气',
        'Ave Maria': '圣母颂',
        'Ultimate Embrace': '终末双腕',
        'Forsaken': '遗弃末世',
        'The Path of Light': '光之波动',
        'Spelldriver': '咏唱危机·驱动',
        'Spellwave': '咏唱危机·波动',
        'Spellscatter': '咏唱危机·散碎',
        'Future\'s End': '未来终结',
        'Past\'s End': '过去终结',
        'All Things Ending': '消灭之脚',
        'Trine': '异三角',
        'Wings of Destruction': '破坏之翼',
        'Aero III Assault': '疼飕飕暴风',
        'Definition of Insanity': '重构',
        'the Decisive Battle': '决战',
        'Bowels of Agony': '深层痛楚',
        'Thunder III': '暴雷',
        'Stray Flames': '混沌之炎',
        'Inferno': '地狱之火炎',
        'Cyclone': '气旋',
        'Stray Spray': '混沌之水',
        'Tsunami': '大海啸',
        'Trance': '幻化',
        'Longitudinal Implosion': '经度聚爆',
        'Shockwave': '震荡波',
        'Latitudinal Implosion': '纬度聚爆',
        'Ultima Blaster': '究极冲击波',
        'Umbra Smash': '本影爆碎',
        'Vacuum Wave': '真空波',
        'Aetherlink': '以太连接',
        'Max': '放大',
        'Earthquake': '地震',
        'Slap Happy': '响亮亮耳光',
        'Black Hole': '黑洞',
        'Nothingness': '无之波动',
        'Damning Edict': '诅咒敕令',
        'Black Spark': '暗黑火花',
        'Look upon Me and Despair': '本色出演的我',
        'Blackblood': 'Blackblood',
        'White Hole': '白洞',
        'Shocking Impact': '重冲击',
        'Blizzard III': '冰封',
        'Stomp-a-Mole': '轰隆隆跺脚',
        'Knock Down': '轰击',
        'Big Bang': '顶起',
        'Meteor': '陨石流星',
      },
    },
  ],
});
