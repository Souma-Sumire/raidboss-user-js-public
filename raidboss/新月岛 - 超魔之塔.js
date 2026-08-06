// Build Time: 2026/8/6 08:58:54
console.log('已加载超魔之塔');
const center = {
  boss1: { x: -900, y: 700 },
  boss3: { x: 100, y: 800 },
};
const xyTo6DirNum = (x, y, centerX, centerY) => {
  // N = 0, NE = 1, SE = 2, S = 3, SW = 4, NW = 5
  x = x - centerX;
  y = y - centerY;
  return (Math.round(3 - 3 * Math.atan2(x, y) / Math.PI) % 6 + 6) % 6;
};
// x = -15  -> n= 1
// x = -5   -> n= 2
// x = +5   -> n= 3
// x = +15  -> n= 4
const getBoss1Column = (x) => {
  const n = Math.round((x + 915) / 10) + 1;
  return { n: n, m: n % 2 ? n + 1 : n - 1 };
};
Options.Triggers.push({
  id: 'Souma超模之塔',
  zoneId: 1346,
  overrideTimelineFile: true,
  timeline: `
### 蜃景幻界新月岛 北征之章
# ZoneId: 1346
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
# BOSS 1
1009.9 "--sync--" StartsUsing { id: "C23E" } window 1014.9,1
1014.9 "决战" #Ability { id: "C23E" }
1014.9 "决战" #Ability { id: "C23E" }
1027.3 "风暴吐息" #Ability { id: "BA0F" }
1027.3 "冰柱赋格" #Ability { id: "BA11" }
1035.5 "雷霜暴风雨" #Ability { id: "BA7B" }
1051.2 "双重冰焰凝环" #Ability { id: "BA38" }
1051.2 "冰焰" #Ability { id: "BA43" }
1057.0 "冰焰交错" #Ability { id: "BA45" }
1061.5 "冰焰交错" #Ability { id: "BA47" }
1073.2 "太古之怒"
1089.9 "雷电赋格" #Ability { id: "BA10" }
1089.9 "剧毒吐息" #Ability { id: "C61D" }
1097.9 "雷霜暴风雨" #Ability { id: "BA7B" }
1109.1 "魔法阵展开" #Ability { id: "BA67" }
1118.8 "魔阵光" #Ability { id: "BA69" }
1119.0 "双头恐惧" #Ability { id: "BA51" }
1128.1 "召唤" #Ability { id: "BA5E" }
1148.3 "双重吐息" #Ability { id: "BA1E" }
1148.3 "冰簇" #Ability { id: "BA22" }
1148.3 "雷簇" #Ability { id: "BA21" }
1148.7 "冰流" #Ability { id: "BA63" }
1148.7 "雷流" #Ability { id: "BA62" }
1155.3 "冰簇" #Ability { id: "BA24" }
1155.3 "雷簇" #Ability { id: "BA23" }
1155.7 "冰流" #Ability { id: "BA63" }
1155.7 "雷流" #Ability { id: "BA62" }
1164.4 "以太分享" #Ability { id: "BE02" }
1169.3 "魔法阵展开" #Ability { id: "BA67" }
1183.4 "魔阵光" #Ability { id: "BA6A" }
1183.4 "冰柱赋格" #Ability { id: "C624" }
1186.5 "雷电赋格" #Ability { id: "BA03" }
1194.5 "雷霜暴风雨" #Ability { id: "BA7B" }
1202.2 "太古之怒" #Ability { id: "BA85" }
1213.0 "共鸣诅咒展开" #Ability { id: "BA6B" }
1227.2 "双重冰焰凝环" #Ability { id: "BA38" }
1227.2 "冰焰" #Ability { id: "BA43" }
1227.6 "突风" #Ability { id: "BA70" }
1233.3 "冰焰交错" #Ability { id: "BA45" }
1235.7 "突风" #Ability { id: "BA70" }
1238.3 "冰焰交错" #Ability { id: "BA47" }
1249.4 "雷霜暴风雨" #Ability { id: "BA7B" }
1261.0 "魔法阵展开" #Ability { id: "BA67" }
1271.0 "魔阵光"
1271.2 "双头恐惧" #Ability { id: "BA51" }
1278.8 "魔法阵展开" #Ability { id: "BA67" }
1291.8 "魔阵光"
1291.8 "冰柱赋格" #Ability { id: "C624" }
1295.0 "雷电赋格" #Ability { id: "BA03" }
1304.8 "雷霜暴风雨" #Ability { id: "BA7B" }
1314.0 "召唤" #Ability { id: "BA5E" }
# BOSS2
2006.0 "剑技风暴" StartsUsing { id: "C20B" } window 2009.0,1
2011.0 "剑技风暴" Ability { id: "C20B" }
2018.3 "投剑" # Ability { id: "C1D3" }
2019.3 "突进" # Ability { id: "C55F" }
2026.9 "回旋" # Ability { id: "C1DC" }
2026.9 "突进" # Ability { id: "C1D6" }
2031.0 "回旋" # Ability { id: "C1DC" }
2031.0 "突进" # Ability { id: "C1D6" }
2035.2 "回旋" # Ability { id: "C1DC" }
2035.2 "突进" # Ability { id: "C1D6" }
2039.5 "突进" # Ability { id: "C1D6" }
2039.5 "回旋" # Ability { id: "C1D7" }
2039.8 "秘法剑" # Ability { id: "C1EC" }
2047.2 "突进"
2047.3 "回旋" # Ability { id: "C1D7" }
2047.6 "秘法剑" # Ability { id: "C1E9" }
2055.6 "回旋" # Ability { id: "C1D7" }
2055.6 "突进" # Ability { id: "C1D6" }
2055.9 "秘法剑" # Ability { id: "C1EA" }
2068.1 "铁臂拳"
2069.1 "剑技风暴" # Ability { id: "C20B" }
2083.2 "风旋剑出鞘" # Ability { id: "C1EE" }
2095.5 "风旋剑" # Ability { id: "C1EF" }
2096.5 "回转" # Ability { id: "C1F1" }
2100.5 "突进" # Ability { id: "C20A" }
2107.0 "剑舞" # Ability { id: "C203" }
2116.4 "剑舞"
2120.7 "剑舞"
2129.8 "剑技风暴" # Ability { id: "C20B" }
2143.9 "跃进步法" # Ability { id: "C1F6" }
2144.5 "戳地"
2148.6 "跃进步法"
2153.9 "跃进步法" # Ability { id: "C1FB" }
2158.6 "剑技爆发" # Ability { id: "C217" }
2160.9 "剑气冲击" # Ability { id: "C1FC" }
2168.3 "剑气冲击"
2175.8 "剑气冲击" # Ability { id: "C1FC" }
2178.2 "突进" # Ability { id: "C20A" }
2188.8 "风旋剑出鞘" # Ability { id: "C1EE" }
2205.1 "风旋剑" # Ability { id: "C1EF" }
2206.1 "回转" # Ability { id: "C1F3" }
2216.3 "剑舞" # Ability { id: "C203" }
2225.5 "剑舞"
2229.7 "剑舞"
2238.8 "剑技风暴" # Ability { id: "C20B" }
2250.1 "投剑" # Ability { id: "C1D3" }
2251.1 "突进" # Ability { id: "C560" }
2258.8 "回旋" # Ability { id: "C1DB" }
2258.8 "突进" # Ability { id: "C1D6" }
2263.0 "回旋" # Ability { id: "C1DB" }
2263.0 "突进" # Ability { id: "C1D6" }
2271.3 "突进"
2271.3 "回旋" # Ability { id: "C1DB" }
2271.7 "秘法剑" # Ability { id: "C1E9" }
2279.5 "突进" # Ability { id: "C1D6" }
2279.6 "回旋" # Ability { id: "C1DB" }
2280.0 "秘法剑" # Ability { id: "C1EC" }
2287.8 "回旋" # Ability { id: "C1DB" }
2287.8 "突进" # Ability { id: "C1D6" }
2288.1 "秘法剑" # Ability { id: "C1EA" }
2301.1 "剑技风暴" # Ability { id: "C20B" }
2313.4 "风旋剑出鞘" # Ability { id: "C1EE" }
# BOSS3
3004.6 "核爆雨" StartsUsing { id: "B97A" } window 3010,1
3009.6 "核爆雨" Ability { id: "B97A" }
3015.9 "魔具召唤" #Ability { id: "B97D" }
3025.8 "魔力注入" #Ability { id: "B97E" }
3030.5 "魔具展开" #Ability { id: "B980" }
3045.0 "古代冰封" #Ability { id: "B987" }
3045.0 "魔具联动：冰封" #Ability { id: "B983" }
3052.7 "古代爆炎" #Ability { id: "B986" }
3052.7 "魔具联动：爆炎" #Ability { id: "B982" }
3060.2 "古代暴雷" #Ability { id: "B988" }
3060.2 "魔具联动：暴雷" #Ability { id: "B984" }
3061.0 "魔具联动：暴雷" #Ability { id: "C4B6" }
3061.0 "古代暴雷" #Ability { id: "B989" }
3069.3 "核爆雨" #Ability { id: "B97A" }
3075.5 "魔具展开" #Ability { id: "B98F" }
3080.8 "黑暗奔流" #Ability { id: "B98B" }
3081.6 "黑暗奔流" #Ability { id: "B98C" }
3088.2 "真空波" #Ability { id: "B98E" }
3097.5 "碎尸" #Ability { id: "B991" }
3104.8 "魔具召唤" #Ability { id: "B97D" }
3115.5 "魔力注入" #Ability { id: "B97E" }
3120.5 "魔具展开" #Ability { id: "B980" }
3132.9 "其墓须有三" #Ability { id: "B992" }
3143.2 "魔具联动：黑暗奔流" #Ability { id: "B993" }
3143.9 "黑暗奔流" #Ability { id: "B994" }
3145.3 "黑暗奔流" #Ability { id: "B995" }
3145.3 "古代冰封" #Ability { id: "B997" }
3150.2 "黑暗奔流" #Ability { id: "B994" }
3151.0 "古代暴雷" #Ability { id: "B998" }
3151.7 "黑暗奔流" #Ability { id: "B995" }
3156.8 "黑暗奔流" #Ability { id: "B994" }
3158.3 "黑暗奔流" #Ability { id: "B995" }
3158.3 "古代爆炎" #Ability { id: "B996" }
3163.9 "真空波" #Ability { id: "B98E" }
3173.6 "核爆雨" #Ability { id: "B97A" }
3184.2 "多产的土壤" #Ability { id: "B99A" }
3185.7 "多产的土壤" #Ability { id: "BF40" }
3187.6 "魔具召唤" #Ability { id: "B97D" }
3197.8 "魔力注入" #Ability { id: "B97E" }
3202.5 "魔具展开" #Ability { id: "B980" }
3217.6 "魔力连锁" #Ability { id: "B99B" }
3218.5 "播撒惊慌" #Ability { id: "B9D6" }
3218.8 "播撒惊恐" #Ability { id: "B99F" }
3218.8 "播撒恐慌" #Ability { id: "B9A0" }
3224.0 "播撒惊慌" #Ability { id: "B9D6" }
3224.4 "播撒恐慌" #Ability { id: "B9A0" }
3229.3 "播撒惊慌" #Ability { id: "B9D6" }
3229.6 "播撒惊恐" #Ability { id: "B99F" }
3229.6 "播撒恐慌" #Ability { id: "B9A0" }
3229.8 "古代冰封" #Ability { id: "B9A2" }
3234.7 "播撒惊慌" #Ability { id: "B9D6" }
3235.1 "播撒惊恐" #Ability { id: "B99F" }
3235.1 "播撒恐慌" #Ability { id: "B9A0" }
3240.2 "播撒惊慌" #Ability { id: "B99C" }
3240.6 "播撒恐慌" #Ability { id: "B99E" }
3240.6 "播撒惊恐" #Ability { id: "B99D" }
3241.0 "古代爆炎" #Ability { id: "B9A1" }
3245.7 "播撒惊慌" #Ability { id: "B99C" }
3246.0 "播撒恐慌" #Ability { id: "B99E" }
3246.0 "播撒惊恐" #Ability { id: "B99D" }
3251.0 "播撒惊慌" #Ability { id: "B99C" }
3251.3 "古代暴雷" #Ability { id: "B9A3" }
3251.4 "播撒恐慌" #Ability { id: "B99E" }
3251.4 "播撒惊恐" #Ability { id: "B99D" }
3252.0 "古代暴雷" #Ability { id: "B985" }
3256.8 "播撒惊慌" #Ability { id: "B9D6" }
3257.2 "播撒惊恐" #Ability { id: "B99F" }
3257.2 "播撒恐慌" #Ability { id: "B9A0" }
3263.3 "核爆雨" #Ability { id: "B97A" }
3270.2 "魔具展开" #Ability { id: "B98F" }
3275.5 "黑暗奔流" #Ability { id: "B98B" }
3276.8 "黑暗奔流" #Ability { id: "B98C" }
3284.0 "真空波" #Ability { id: "B98E" }
3293.1 "碎尸" #Ability { id: "B991" }
3301.0 "魔具召唤" #Ability { id: "B97D" }
# BOSS4
4009.1 "连续咏唱" StartsUsing { id: "BD17" } window 4012,1
4012.1 "连续咏唱" Ability { id: "BD17" }
4019.2 "核爆" # Ability { id: "BD1F" }
4023.3 "核爆" # Ability { id: "BD48" }
4033.6 "飞翔指令" # Ability { id: "BD13" }
4043.9 "跳跃" # Ability { id: "BD14" }
4050.2 "四连召唤·封印武器" # Ability { id: "BF0B" }
4050.6 "冲击波" # Ability { id: "BD15" }
4052.6 "盯准" # Ability { id: "BF11" }
4054.5 "封印武器" # Ability { id: "C4BB" }
4055.6 "居合斩" # Ability { id: "BF12" }
4059.1 "爱之歌" # Ability { id: "BF10" }
4060.1 "封印武器" # Ability { id: "C4BC" }
4062.4 "镰鼬之风" # Ability { id: "BF13" }
4068.3 "连续咏唱" # Ability { id: "BD17" }
4075.4 "核爆" # Ability { id: "BD1F" }
4079.5 "核爆" # Ability { id: "BD48" }
4096.7 "全知烈火" # Ability { id: "C528" }
4108.8 "元素控制" # Ability { id: "BD0A" }
4114.9 "元素展开" # Ability { id: "BD0F" }
4122.8 "冰澈" # Ability { id: "BD30" }
4124.4 "霹雷" # Ability { id: "BD31" }
4126.0 "炽炎" # Ability { id: "BD2F" }
4126.3 "预言" # Ability { id: "BD1C" }
4129.0 "冰澈" # Ability { id: "BD30" }
4130.4 "炽炎" # Ability { id: "BD2F" }
4137.1 "陨石" # Ability { id: "BD43" }
4137.1 "天崩地裂" # Ability { id: "BD44" }
4138.1 "暴雷" # Ability { id: "BD2E" }
4138.1 "冰封" # Ability { id: "BD2D" }
4141.4 "封印武器" # Ability { id: "BD02" }
4143.1 "爆炎" # Ability { id: "BD2C" }
4143.1 "暴雷" # Ability { id: "BD2E" }
4143.5 "盯准" # Ability { id: "BD27" }
4145.5 "冰澈" # Ability { id: "BD30" }
4146.9 "炽炎" # Ability { id: "BD2F" }
4148.5 "霹雷" # Ability { id: "BD31" }
4149.9 "冰澈" # Ability { id: "BD30" }
4151.5 "炽炎" # Ability { id: "BD2F" }
4153.1 "霹雷" # Ability { id: "BD31" }
4155.8 "封印武器" # Ability { id: "BD02" }
4157.2 "冰封" # Ability { id: "BD2D" }
4157.2 "爆炎" # Ability { id: "BD2C" }
4157.9 "盯准"
4163.0 "元素吸收" # Ability { id: "BD33" }
4171.2 "冰碎" # Ability { id: "BD36" }
4171.2 "延烧" # Ability { id: "BD35" }
4171.2 "放电" # Ability { id: "BD37" }
4176.8 "冰碎" # Ability { id: "BD36" }
4176.8 "延烧" # Ability { id: "BD35" }
4176.8 "放电" # Ability { id: "BD37" }
4182.3 "元素整合" # Ability { id: "BD32" }
4200.2 "全知烈火" # Ability { id: "C528" }
4211.3 "召唤" # Ability { id: "BD18" }
4219.5 "魔法剑·石化" # Ability { id: "BD3C" }
4225.5 "魔法剑·石化"
4229.6 "攻击"
4231.5 "魔法剑·石化"
4231.5 "全斩" # Ability { id: "BD45" }
4234.9 "飞羽清风" # Ability { id: "BD42" }
4238.4 "攻击"
424.01 "全斩"
4244.3 "攻击" # Ability { id: "1962" }
4245.1 "全斩"
4257.9 "四连召唤·封印武器" # Ability { id: "BF0D" }
4260.2 "镰鼬之风" # Ability { id: "BF13" }
4261.4 "封印武器" # Ability { id: "BF0E" }
4263.5 "爱之歌" # Ability { id: "BF10" }
4265.5 "封印武器" # Ability { id: "C4BB" }
4266.6 "居合斩" # Ability { id: "BF12" }
4269.9 "盯准" # Ability { id: "BF11" }
4275.8 "连续咏唱" # Ability { id: "BD17" }
4282.9 "核爆" # Ability { id: "BD1F" }
4304.1 "全知烈火" # Ability { id: "C528" }
4316.2 "元素控制" # Ability { id: "BD0A" }
4322.3 "元素创造" # Ability { id: "BD10" }
4331.8 "霹雷"
4331.9 "炽炎" # Ability { id: "BD2F" }
4336.2 "冰澈" # Ability { id: "BD30" }
4336.3 "炽炎" # Ability { id: "BD2F" }
4337.3 "飞翔指令" # Ability { id: "BD13" }
4339.5 "跳跃" # Ability { id: "BD14" }
4340.5 "霹雷" # Ability { id: "BD31" }
4340.6 "冰澈" # Ability { id: "BD30" }
4345.4 "封印武器" # Ability { id: "BD00" }
4346.3 "冲击波" # Ability { id: "BD15" }
4347.2 "爆炎" # Ability { id: "BD2C" }
4347.2 "暴雷" # Ability { id: "BD2E" }
4347.4 "爱之歌" # Ability { id: "BD26" }
4358.1 "炽炎"
4358.3 "霹雷" # Ability { id: "BD31" }
4362.5 "炽炎" # Ability { id: "BD2F" }
4362.5 "冰澈" # Ability { id: "BD30" }
4364.4 "预言" # Ability { id: "BD1C" }
4366.8 "冰澈" # Ability { id: "BD30" }
4366.8 "霹雷" # Ability { id: "BD31" }
4375.1 "陨石" # Ability { id: "BD43" }
4375.1 "天崩地裂" # Ability { id: "BD44" }
4375.7 "暴雷" # Ability { id: "BD2E" }
4375.7 "冰封" # Ability { id: "BD2D" }
4379.5 "封印武器" # Ability { id: "BD02" }
4381.3 "冰封" # Ability { id: "BD2D" }
4381.3 "爆炎" # Ability { id: "BD2C" }
4381.6 "盯准" # Ability { id: "BD27" }
4386.7 "元素吸收" # Ability { id: "BD33" }
4394.9 "冰碎" # Ability { id: "BD36" }
4394.9 "延烧" # Ability { id: "BD35" }
4394.9 "放电" # Ability { id: "BD37" }
4400.7 "冰碎" # Ability { id: "BD36" }
4400.7 "延烧" # Ability { id: "BD35" }
4400.7 "放电" # Ability { id: "BD37" }
4406.2 "元素整合" # Ability { id: "BD32" }
4424.4 "全知烈火" # Ability { id: "C528" }
4435.5 "飞翔指令" # Ability { id: "BD13" }
4445.7 "跳跃" # Ability { id: "BD14" }
4452.3 "四连召唤·封印武器" # Ability { id: "BF0A" }
4452.5 "冲击波" # Ability { id: "BD15" }
4454.4 "爱之歌" # Ability { id: "BF10" }
4455.3 "封印武器" # Ability { id: "BF0F" }
4457.6 "盯准" # Ability { id: "BF11" }
4459.6 "封印武器" # Ability { id: "C4BB" }
4460.7 "居合斩" # Ability { id: "BF12" }
4464.0 "镰鼬之风" # Ability { id: "BF13" }
4469.9 "连续咏唱" # Ability { id: "BD17" }
`,
  initData: () => {
    return {
      phase: 'boss1',
      boss1吐息赋格: [],
      boss1冰焰交错: [],
      boss1双头恐惧: [],
      boss1魔法阵展开赋格: [],
      boss1蓝之共鸣诅咒: null,
      boss1召唤: false,
      boss1召唤连线ID: [],
      boss1召唤MJ: [],
      boss1召唤Res: [],
      boss1球: [],
      boss1Boss: {},
      boss3魔力注入: {},
      boss3B981: [],
      boss3魔力注入res: [],
      boss3真空波count: 0,
      boss3魔力注入中: false,
      boss3魔力注入count: 0,
      boss3其墓须有三: false,
      boss39F8: [],
      boss3地水count: 0,
      boss3鸳鸯锅中: false,
      boss3鸳鸯锅9F8: [],
      boss3鸳鸯锅: [],
      boss3鸳鸯锅buff: undefined,
      boss3鸳鸯锅count: 0,
      boss3魔力注入temp: {
        火: undefined,
        冰: undefined,
        雷: undefined,
      },
      boss3魔力注入正点冰: undefined,
      boss4封印武器: [],
      boss4四连召唤中: false,
    };
  },
  triggers: [
    {
      id: '超模之塔 结束战斗',
      type: 'InCombat',
      netRegex: { inACTCombat: '0', inGameCombat: '0' },
      run: (data) => {
        data.phase = 'boss1';
        data.boss1吐息赋格 = [];
        data.boss1冰焰交错 = [];
        data.boss1双头恐惧 = [];
        data.boss1魔法阵展开赋格 = [];
        data.boss1蓝之共鸣诅咒 = null;
        data.boss1召唤 = false;
        data.boss1召唤连线ID = [];
        data.boss1召唤MJ = [];
        data.boss1召唤Res = [];
        data.boss1球 = [];
        data.boss1Boss = {};
        data.boss3魔力注入 = {};
        data.boss3B981 = [];
        data.boss3魔力注入res = [];
        data.boss3真空波count = 0;
        data.boss3魔力注入中 = false;
        data.boss3魔力注入count = 0;
        data.boss3其墓须有三 = false;
        data.boss39F8 = [];
        data.boss3地水count = 0;
        data.boss3鸳鸯锅中 = false;
        data.boss3鸳鸯锅9F8 = [];
        data.boss3鸳鸯锅 = [];
        data.boss3鸳鸯锅buff = undefined;
        data.boss3鸳鸯锅count = 0;
        data.boss3魔力注入temp = { 火: undefined, 冰: undefined, 雷: undefined };
        data.boss3魔力注入正点冰 = undefined;
        data.boss4封印武器.length = 0;
        data.boss4四连召唤中 = false;
      },
    },
    // #region BOSS1
    {
      id: '超模之塔 BOSS1 决战',
      type: 'StartsUsing',
      netRegex: { id: 'C23E' },
      promise: async (data, matches) => {
        const boss = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants[0];
        data.boss1Boss[matches.sourceId] = boss.PosX < center.boss1.x ? 'blue' : 'green';
      },
    },
    {
      id: '超模之塔 BOSS1 01AD',
      type: 'Tether',
      netRegex: { id: '01AD' },
      // condition: (data, matches) => data.me === matches.source,
      infoText: (data, matches, output) => {
        if (data.me === matches.source)
          return output.text({ target: matches.target });
      },
      outputStrings: { text: { en: '打${target}' } },
    },
    {
      id: '超模之塔 BOSS1 吐息赋格',
      type: 'StartsUsing',
      netRegex: { id: ['BA0F', 'C61D', 'BA11', 'BA10'] },
      preRun: (data, matches) => {
        data.boss1吐息赋格.push(matches.id);
      },
      durationSeconds: 4.7,
      infoText: (data, _matches, output) => {
        const arr = data.boss1吐息赋格;
        if (arr.length === 2) {
          const sortArr = [
            'BA0F',
            'C61D',
            'BA11',
            'BA10', // 'BOSS月环 // '雷电赋格',
          ];
          const [a, b] = arr.sort((a, b) => {
            const indexA = sortArr.indexOf(a);
            const indexB = sortArr.indexOf(b);
            return indexA - indexB;
          });
          data.boss1吐息赋格.length = 0;
          // return output.text!({ g1: output[a]!(), g2: output[b]!() });
          return output[`${a}+${b}`]();
        }
      },
      outputStrings: {
        'BA0F+BA11': { en: '击退到后面' },
        'BA0F+BA10': { en: '击退到前面' },
        'C61D+BA11': { en: '远离+两侧' },
        'C61D+BA10': { en: '靠近+两侧' },
      },
    },
    {
      id: '超模之塔 BOSS1 雷霜暴风雨',
      type: 'StartsUsing',
      netRegex: { id: 'BA7B' },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: '超模之塔 BOSS1 冰焰交错',
      type: 'StartsUsing',
      netRegex: {
        id: ['BA37', 'BA38', 'BA39', 'BA3A', 'BA3B', 'BA3C', 'BA3D', 'BA3E'],
      },
      // # BA37 双重冰焰交错
      // # BA38 双重冰焰凝环
      // # BA39 冰焰交错凝环
      // # BA3A 冰焰凝环交错
      // # BA3B 双重冰焰交错
      // # BA3C 双重冰焰凝环
      // # BA3D 冰焰交错凝环
      // # BA3E 冰焰凝环交错
      preRun: (data, matches) => {
        data.boss1冰焰交错.push({
          id: matches.id,
          color: data.boss1Boss[matches.sourceId],
          timestamp: new Date(matches.timestamp).getTime(),
        });
      },
      durationSeconds: 26,
      alertText: (data, _matches, output) => {
        const arr = data.boss1冰焰交错.sort((a, b) => a.timestamp - b.timestamp);
        const d = {
          'BA37': ['交错', '交错'],
          'BA38': ['凝环', '凝环'],
          'BA39': ['交错', '凝环'],
          'BA3A': ['凝环', '交错'],
          'BA3B': ['交错', '交错'],
          'BA3C': ['凝环', '凝环'],
          'BA3D': ['交错', '凝环'],
          'BA3E': ['凝环', '交错'],
        };
        if (arr.length === 2) {
          const w = data.boss1蓝之共鸣诅咒 === null ? '' : data.boss1蓝之共鸣诅咒.wind;
          const color = data.boss1蓝之共鸣诅咒 === null ? '' : data.boss1蓝之共鸣诅咒.color;
          const [g1, g3] = d[arr[0].id].map((v) =>
            output[`${arr[0].color === color ? w : ''}${v}`]()
          );
          const [g2, g4] = d[arr[1].id].map((v) =>
            output[`${arr[1].color === color ? w : ''}${v}`]()
          );
          data.boss1冰焰交错.length = 0;
          return output.text({ g1, g2, g3, g4 });
        }
      },
      outputStrings: {
        交错: { en: '出' },
        凝环: { en: '进' },
        西风交错: { en: '(右击退)+出' },
        西风凝环: { en: '(右击退)+进' },
        东风交错: { en: '(左击退)+出' },
        东风凝环: { en: '(左击退)+进' },
        text: { en: '${g1} -> ${g2} -> ${g3} -> ${g4}' },
      },
    },
    {
      id: '超模之塔 BOSS1 太古之怒',
      type: 'StartsUsing',
      netRegex: { id: 'BA85' },
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: '超模之塔 BOSS1 BA67',
      type: 'StartsUsing',
      netRegex: { id: 'BA67' },
      run: (data) => {
        data.boss1双头恐惧.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 双头恐惧',
      type: 'StartsUsingExtra',
      netRegex: { id: ['BA56', 'BA57'] },
      preRun: (data, matches) => {
        data.boss1双头恐惧.push({
          id: matches.id,
          x: parseFloat(matches.x),
          sourceId: matches.sourceId,
        });
      },
      durationSeconds: 14.2,
      infoText: (data, _matches, output) => {
        const bossLight = data.boss1双头恐惧.find((v) => v.id === 'BA57');
        const other = data.boss1双头恐惧.find((v) => v.id === 'BA56');
        if (data.boss1双头恐惧.length === 2 && bossLight && other) {
          const bossColor = bossLight.x < other.x ? 'blue' : 'green';
          const m = getBoss1Column(bossLight.x).m;
          return output.text({
            column: output[m](),
            color: output[bossColor](),
          });
        }
      },
      outputStrings: {
        'blue': { en: '找蓝' },
        'green': { en: '找绿' },
        '1': { en: '左1' },
        '2': { en: '左2' },
        '3': { en: '右3' },
        '4': { en: '右4' },
        'text': { en: '${column} ${color}' },
      },
    },
    {
      id: '超模之塔 BOSS1 魔法阵展开赋格',
      type: 'StartsUsingExtra',
      netRegex: {
        id: [
          'C623',
          'C624',
          'BA03',
          'BA04', // 冰柱赋格 钢铁
        ],
      },
      preRun: (data, matches) => {
        data.boss1魔法阵展开赋格.push({ id: matches.id, x: parseFloat(matches.x) });
      },
      durationSeconds: (data) => data.boss1魔法阵展开赋格.length === 1 ? 4 : 10,
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          'C623': { en: '靠近' },
          'C624': { en: '远离' },
          'BA03': { en: '靠近' },
          'BA04': { en: '远离' },
          'blue': { en: '找绿' },
          'green': { en: '找蓝' },
          'mic': { en: '${gimmick}${color}' },
          'text': { en: '${a} => ${b}' },
        };
        const arr = data.boss1魔法阵展开赋格;
        if (arr.length === 1) {
          const a = arr[0];
          return {
            infoText: output.mic({
              gimmick: output[a.id](),
              color: output[a.x < center.boss1.x ? 'blue' : 'green'](),
            }),
          };
        }
        if (arr.length === 2) {
          const [a, b] = arr;
          data.boss1魔法阵展开赋格.length = 0;
          const amic = output.mic({
            gimmick: output[a.id](),
            color: output[a.x < center.boss1.x ? 'blue' : 'green'](),
          });
          const bmic = output.mic({
            gimmick: output[b.id](),
            color: output[b.x < center.boss1.x ? 'blue' : 'green'](),
          });
          return { alertText: output.text({ a: amic, b: bmic }) };
        }
      },
    },
    {
      id: '超模之塔 BOSS1 蓝之共鸣诅咒1',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          // 蓝击退：处理蓝头机制的时候触发
          // 绿击退：处理绿头机制的时候触发
          '13BD',
          '13BF',
          '13BC',
          '13BE', // 东风（蓝头）
        ],
      },
      condition: (data, matches) => data.me === matches.target,
      run: (data, matches) => {
        data.boss1蓝之共鸣诅咒 = {
          // color: 'blue',
          color: ['13BF', '13BE'].includes(matches.effectId) ? 'blue' : 'green',
          wind: ['13BF', '13BD'].includes(matches.effectId) ? '西风' : '东风',
        };
      },
    },
    {
      id: '超模之塔 BOSS1 蓝之共鸣诅咒2',
      type: 'LosesEffect',
      netRegex: { effectId: ['13BD', '13BF', '13BC', '13BE'] },
      condition: (data, matches) => data.me === matches.target,
      run: (data) => {
        data.boss1蓝之共鸣诅咒 = null;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤',
      type: 'StartsUsing',
      netRegex: { id: 'BA5E' },
      run: (data) => {
        data.boss1召唤 = true;
        data.boss1召唤连线ID.length = 0;
        data.boss1召唤Res.length = 0;
        data.boss1召唤MJ.length = 0;
        data.boss1球.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤end',
      type: 'StartsUsing',
      netRegex: { id: 'BA5E' },
      delaySeconds: 20,
      run: (data) => {
        data.boss1召唤 = false;
        data.boss1召唤连线ID.length = 0;
        data.boss1召唤Res.length = 0;
        data.boss1召唤MJ.length = 0;
        data.boss1球.length = 0;
      },
    },
    {
      id: '超模之塔 BOSS1 召唤连线',
      type: 'Tether',
      netRegex: { id: '019B' },
      condition: (data) => data.boss1召唤,
      promise: async (data, matches) => {
        const s = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        })).combatants[0];
        data.boss1召唤连线ID.push({
          id: matches.targetId,
          x: s.PosX,
          color: undefined,
        });
        if (data.boss1召唤连线ID.length === 2 && data.boss1召唤连线ID[0]?.color === undefined) {
          data.boss1召唤连线ID.sort((a, b) => a.x - b.x);
          data.boss1召唤连线ID[0].color = 'blue';
          data.boss1召唤连线ID[1].color = 'green';
        }
      },
    },
    {
      id: '超模之塔 BOSS1 召唤Add ID收集',
      type: 'CombatantMemory',
      netRegex: {
        'pair': [
          { 'key': 'BNpcID', 'value': ['4C20', '4C1F'] }, // 4C20 导流冰球, 4C1F 导流雷球
        ],
      },
      condition: (data) => data.boss1召唤,
      run: (data, matches) => {
        if (matches.change === 'Add') {
          data.boss1球.push({
            id: matches.id,
            bNpcId: matches.pairBNpcID,
            x: parseFloat(matches.pairPosX),
            y: parseFloat(matches.pairPosY),
          });
        }
        if (matches.change === 'Change') {
          const b = data.boss1球.find((v) => v.id === matches.id);
          if (b) {
            b.bNpcId = matches.pairBNpcID !== undefined ? matches.pairBNpcID : b.bNpcId;
            b.x = matches.pairPosX !== undefined ? parseFloat(matches.pairPosX) : b.x;
            b.y = matches.pairPosY !== undefined ? parseFloat(matches.pairPosY) : b.y;
          }
        }
      },
    },
    {
      id: '超模之塔 BOSS1 MJ',
      type: 'HeadMarker',
      netRegex: { id: ['02D2', '02D3', '02D4', '02D5'] },
      condition: (data) => data.boss1召唤,
      preRun: (data, matches) => data.boss1召唤MJ.push({ targetId: matches.targetId }),
      durationSeconds: (data) => data.boss1召唤Res.length === 0 ? 3 : 12,
      promise: async (data, _matches, output) => {
        if (data.boss1召唤MJ.length % 2 === 0) {
          const combatants = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          const targets = combatants.filter((v) =>
            data.boss1召唤MJ.slice(-2).some((a) => parseInt(a.targetId, 16) === v.ID)
          ).map((v) => ({
            x: v.PosX,
            y: v.PosY,
            id: v.ID?.toString(16).toUpperCase(),
            color: data.boss1召唤连线ID.find((x) => x.id === v.ID?.toString(16).toUpperCase())
              ?.color,
          }));
          const blue = targets.find((x) => x.color === 'blue');
          const green = targets.find((x) => x.color === 'green');
          const ball = data.boss1球.sort((a, b) => a.y - b.y)[0].bNpcId === '4C1F'
            ? 'green'
            : 'blue';
          const xType = ball === 'green' ? green : blue;
          const yType = ball === 'green' ? blue : green;
          const xSafe = xType.x < center.boss1.x ? ['NE', 'SE'] : ['NW', 'SW'];
          const ySafe = yType.y < center.boss1.y ? ['SW', 'SE'] : ['NW', 'NE'];
          const target = xSafe.find((q) => ySafe.includes(q));
          data.boss1召唤Res.push(target);
          if (data.boss1召唤Res.length === 2) {
            const a = data.boss1召唤Res[0];
            const b = data.boss1召唤Res[1];
            const map = ['NE', 'SE', 'SW', 'NW'];
            const aIndex = map.indexOf(a);
            const bIndex = map.indexOf(b);
            const clock = (bIndex - aIndex) === 1 || (bIndex - aIndex) === -3 ? true : false;
            const cIndex = (4 + bIndex + (clock ? 1 : -1)) % 4;
            const dIndex = (4 + cIndex + (clock ? 1 : -1)) % 4;
            const c = map[cIndex];
            const d = map[dIndex];
            data.boss1召唤Res2 = {
              text: output.text({
                a: output[a](),
                b: output[b](),
                c: output[c](),
                d: output[d](),
              }),
              level: 'alertText',
            };
          }
        }
      },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          'NE': { en: '右上' },
          'SE': { en: '右下' },
          'NW': { en: '左上' },
          'SW': { en: '左下' },
          'text': { en: '${a} -> ${b} -> ${c} -> ${d}' },
        };
        if (data.boss1召唤Res2) {
          const t = data.boss1召唤Res2.text;
          const l = data.boss1召唤Res2.level;
          data.boss1召唤Res2 = undefined;
          return { [l]: t };
        }
      },
    },
    // #endregion
    // #region BOSS2
    {
      id: '超模之塔 BOSS2 剑刃风暴',
      type: 'StartsUsing',
      netRegex: { id: 'C20B', capture: false },
      response: Responses.aoe(),
    },
    // #endregion
    // #region BOSS3
    {
      id: '超模之塔 BOSS3 核爆雨',
      type: 'StartsUsing',
      netRegex: { id: 'B97A', capture: false },
      durationSeconds: 10,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '5连AoE' },
    },
    {
      id: '超模之塔 BOSS3 魔力注入',
      type: 'StartsUsing',
      netRegex: { id: 'B97E', capture: false },
      run: (data) => {
        data.boss3魔力注入 = {};
        data.boss3魔力注入中 = true;
        data.boss3魔力注入count++;
        data.boss3B981.length = 0;
        data.boss3魔力注入res.length = 0;
        data.boss3魔力注入temp = { 火: undefined, 冰: undefined, 雷: undefined };
        data.boss3魔力注入正点冰 = undefined;
      },
    },
    {
      id: '超模之塔 BOSS3 Tether',
      type: 'Tether',
      netRegex: {
        id: [
          '0190',
          '0191',
          '0192',
          '0193', // 鸳鸯锅
        ],
      },
      run: (data, matches) => {
        data.boss3魔力注入[matches.sourceId] = {
          '0190': '火',
          '0191': '冰',
          '0192': '雷',
          '0193': '鸳鸯锅',
        }[matches.id];
      },
    },
    {
      id: '超模之塔 BOSS3 B981',
      type: 'AbilityExtra',
      netRegex: { id: ['B981'] },
      durationSeconds: 2,
      infoText: (data, matches, output) => {
        if (data.boss3魔力注入中 === false && data.boss3鸳鸯锅中 === false) {
          return;
        }
        data.boss3B981.push({
          id: matches.sourceId,
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          el: data.boss3魔力注入[matches.sourceId] ?? 'unknown',
        });
        if (data.boss3魔力注入[matches.sourceId] === undefined) {
          console.error(`${matches.timestamp} 魔力注入属性获取出错,sourceId:${matches.sourceId}`);
        }
        if (data.boss3魔力注入[matches.sourceId] === '鸳鸯锅') {
          data.boss3鸳鸯锅.push({
            dir: Directions.xyTo8DirNum(
              parseFloat(matches.x),
              parseFloat(matches.y),
              center.boss3.x,
              center.boss3.y,
            ),
            id: matches.sourceId,
          });
        } else if (data.boss3B981.length % 2 === 0) {
          const last2 = data.boss3B981.slice(-2);
          const [e1, e2] = last2;
          const d1 = xyTo6DirNum(e1.x, e1.y, center.boss3.x, center.boss3.y);
          const d2 = xyTo6DirNum(e2.x, e2.y, center.boss3.x, center.boss3.y);
          if (e1.el === '火') {
            // 火：如果对称刷，则报2个另外的点。如果120度刷，找斜点那个，去水平镜像的对面
            const diff = Math.abs(d1 - d2);
            if (diff === 3) {
              const s1 = (d1 - 1.5 + 6) % 6;
              const s2 = (d2 - 1.5 + 6) % 6;
              data.boss3魔力注入temp.火 = [s1, s2];
              if (data.boss3魔力注入count === 1) {
                const text = output.火或({ r1: output[`火${s1}`](), r2: output[`火${s2}`]() });
                return output.火稍后({ text });
              }
            }
            const e = (d1 === 0 || d1 === 3) ? d2 : d1;
            data.boss3魔力注入temp.火 = [(6 - e) % 6];
            if (data.boss3魔力注入count === 1) {
              const text = output[`火${data.boss3魔力注入temp.火[0]}`]();
              return output.火稍后({ text });
            }
          } else if (e1.el === '冰') {
            // 1冰：找斜点那个，去对面（与小怪重合）
            const e = (d1 === 0 || d1 === 3) ? d2 : d1;
            const z = [d1, d2].find((v) => v === 0 || v === 4);
            data.boss3魔力注入正点冰 = z;
            data.boss3魔力注入temp.冰 = (e + 3) % 6;
            if (data.boss3魔力注入count === 1) {
              const text = output[`冰${data.boss3魔力注入temp.冰}`]();
              return output.冰稍后({ text });
            }
          } else if (e1.el === '雷') {
            // 雷：如果AC有，找斜点那个，去水平镜像的对面。如果AC没有，去左右
            const ac = [d1, d2].find((d) => d === 0 || d === 3);
            const e = (d1 === 0 || d1 === 3) ? d2 : d1;
            if (ac !== undefined) {
              data.boss3魔力注入temp.雷 = [(6 - e) % 6];
            } else {
              data.boss3魔力注入temp.雷 = [2.5, 4.5];
            }
            if (data.boss3魔力注入count === 1) {
              const text = data.boss3魔力注入temp.雷.length === 2
                ? output.雷左右()
                : output[`雷${data.boss3魔力注入temp.雷[0]}`]();
              return output.雷稍后({ text });
            }
          }
        }
      },
      tts: null,
      outputStrings: {
        '火0.5': { en: '2外' },
        '火2.5': { en: '3外' },
        '火3.5': { en: '4外' },
        '火5.5': { en: '1外' },
        '火1': { en: '2外' },
        '火2': { en: '3外' },
        '火4': { en: '4外' },
        '火5': { en: '1外' },
        '火或': { en: '${r1}或${r2}' },
        '冰1': { en: '2点(头下)' },
        '冰2': { en: '3点(头下)' },
        '冰4': { en: '4点(头下)' },
        '冰5': { en: '1点(头下)' },
        '雷1': { en: 'A内' },
        '雷2': { en: 'C内' },
        '雷4': { en: 'C内' },
        '雷5': { en: 'A内' },
        '雷左右': { en: 'B/D中' },
        '冰稍后': { en: '（稍后）冰：${text}' },
        '火稍后': { en: '（稍后）火：${text}' },
        '雷稍后': { en: '（稍后）雷：${text}' },
      },
    },
    {
      // B982|魔具联动：爆炎
      // B983|魔具联动：冰封
      // B984|魔具联动：暴雷
      id: '超模之塔 BOSS3 魔具联动',
      type: 'StartsUsing',
      netRegex: { id: ['B982', 'B983', 'B984'] },
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        data.boss3魔力注入中 = false;
        if (data.boss3其墓须有三 === true) {
          return;
        }
        if (matches.id === 'B982') {
          const e = data.boss3魔力注入temp.火;
          if (e.length === 2) {
            const text = output.火或({ r1: output[`火${e[0]}`](), r2: output[`火${e[1]}`]() });
            return output.火最终({ text });
          }
          const text = output[`火${e[0]}`]();
          return output.火最终({ text });
        } else if (matches.id === 'B983') {
          const e = data.boss3魔力注入temp.冰;
          const text = output[`冰${e}`]();
          return output.冰最终({ text });
        } else if (matches.id === 'B984') {
          const e = data.boss3魔力注入temp.雷;
          const text = e.length === 2 ? output.雷左右() : output[`雷${e[0]}`]();
          return output.雷最终({ text });
        }
      },
      outputStrings: {
        '火0.5': { en: '2外' },
        '火2.5': { en: '3外' },
        '火3.5': { en: '4外' },
        '火5.5': { en: '1外' },
        '火1': { en: '2外' },
        '火2': { en: '3外' },
        '火4': { en: '4外' },
        '火5': { en: '1外' },
        '火或': { en: '${r1}或${r2}' },
        '冰1': { en: '2点(头下)' },
        '冰2': { en: '3点(头下)' },
        '冰4': { en: '4点(头下)' },
        '冰5': { en: '1点(头下)' },
        '雷1': { en: 'A内' },
        '雷2': { en: 'C内' },
        '雷4': { en: 'C内' },
        '雷5': { en: 'A内' },
        '雷左右': { en: 'B/D中' },
        '冰最终': { en: '冰：${text}' },
        '火最终': { en: '火：${text}' },
        '雷最终': { en: '雷：${text}' },
      },
    },
    {
      id: '超模之塔 BOSS3 黑暗奔流',
      type: 'StartsUsing',
      netRegex: { id: 'B98B' },
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: { en: '躲头+穿地水' },
      },
    },
    {
      id: '超模之塔 BOSS3 真空波',
      type: 'StartsUsing',
      netRegex: { id: 'B98E' },
      alarmText: (data, _matches, output) => {
        data.boss3真空波count++;
        return data.boss3真空波count === 2 ? output.text2() : output.text();
      },
      outputStrings: {
        text: { en: '去背后+躲头' },
        text2: { en: '去背后' },
      },
    },
    {
      id: '超模之塔 BOSS3 碎尸',
      type: 'StartsUsing',
      netRegex: { id: 'B991' },
      response: Responses.tankBuster(),
    },
    {
      id: '超模之塔 BOSS3 B992',
      type: 'StartsUsing',
      netRegex: { id: 'B992' },
      preRun: (data) => {
        data.boss3其墓须有三 = true;
        data.boss39F8.length = 0;
        data.boss3地水count = 0;
      },
      delaySeconds: 30,
      run: (data) => {
        data.boss3其墓须有三 = false;
        data.boss39F8.length = 0;
        data.boss3地水count = 0;
      },
    },
    {
      id: '超模之塔 BOSS3 你撒播',
      type: 'GainsEffect',
      netRegex: { effectId: ['1410', '1411'] },
      delaySeconds: 1,
      // SE屎山代码，人数过多时发现有至多2.56秒的日志延迟。
      suppressSeconds: (_data, matches) => matches.sourceId === 'E0000000' ? 30 : 3,
      run: (data) => data.boss3鸳鸯锅count++,
    },
    {
      id: '超模之塔 BOSS3 你撒播啊',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          '1410',
          '1411', // 紫buff
        ],
      },
      condition: Conditions.targetIsYou(),
      durationSeconds: 5.7,
      infoText: (data, matches, output) => {
        // TODO: 可优化为直接报场地半场，不用玩家自己看小怪，但现在懒得写。
        data.boss3鸳鸯锅buff = matches.effectId === '1410' ? '蓝' : '紫';
        if (data.boss3鸳鸯锅9F8.length > 0) {
          const yyg = data.boss3鸳鸯锅9F8[data.boss3鸳鸯锅count];
          if (yyg === undefined) {
            // 最后一次，不用再战斗了
            return;
          }
          const { el, dir } = yyg;
          const g = [el.at(1), el.at(3)];
          const safe = g.findIndex((v) => v === data.boss3鸳鸯锅buff) === 0 ? '左' : '右';
          const d = Directions.outputFrom8DirNum(dir);
          return output.text({ dir: output[d](), lr: safe });
        }
      },
      outputStrings: {
        'text': { en: '看"${dir}"去${lr}' },
        'dirN': { en: 'A' },
        'dirNE': { en: '2' },
        'dirE': { en: 'Boy' },
        'dirSE': { en: '3' },
        'dirS': { en: 'C' },
        'dirSW': { en: '4' },
        'dirW': { en: 'Dog' },
        'dirNW': { en: '1' },
      },
    },
    // B9A2|古代冰封|
    // B9A1|古代爆炎|
    // B9A3|古代暴雷|
    {
      id: '超模之塔 BOSS3 古代计数',
      type: 'StartsUsing',
      netRegex: { id: ['B9A2', 'B9A1', 'B9A3'] },
      alertText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        'B9A2': { en: '斜点' },
        'B9A1': { en: '远离' },
        'B9A3': { en: '正点' },
      },
    },
    {
      id: '超模之塔 BOSS3 9F8',
      comment: { en: '例如"1-4冰"代表“其墓须有三”第1轮是冰，安全区在4。\n0=北, 1=右上, 2=右下, 3=南, 4=左下, 5=左上' },
      type: 'GainsEffect',
      netRegex: { effectId: '9F8', count: ['45A', '45B', '45C', '45D', '45E'] },
      condition: (data) => data.boss3其墓须有三 || data.boss3鸳鸯锅中,
      durationSeconds: (data) => {
        if (data.boss3其墓须有三) {
          return (data.boss39F8.length === 0 ? 2 : 18);
        }
        if (data.boss3鸳鸯锅中) {
          return data.boss3鸳鸯锅9F8.length < 3 ? 13.695 : 45;
        }
      },
      countdownSeconds: (data) => data.boss3鸳鸯锅中 ? 13.695 : 0,
      response: (data, matches, output) => {
        output.responseOutputStrings = {
          // 打AC
          '1-1冰': { en: 'B2之间' },
          '1-2冰': { en: 'B3之间' },
          '1-4冰': { en: 'D4之间' },
          '1-5冰': { en: 'D1之间' },
          '1-1火': { en: '2外' },
          '1-2火': { en: '3外' },
          '1-4火': { en: '4外' },
          '1-5火': { en: '1外' },
          '1-0.5火': { en: 'A2外' },
          '1-2.5火': { en: 'C3外' },
          '1-3.5火': { en: 'C4外' },
          '1-5.5火': { en: 'A1外' },
          '1-1雷': { en: '2点' },
          '1-2雷': { en: '3点' },
          '1-4雷': { en: '4点' },
          '1-5雷': { en: '1点' },
          // 打13
          '2-1冰': { en: 'B点' },
          '2-2冰': { en: 'B点' },
          '2-4冰': { en: 'D点' },
          '2-5冰': { en: 'D点' },
          '2-1火': { en: 'A外' },
          '2-2火': { en: 'C外' },
          '2-4火': { en: 'C外' },
          '2-5火': { en: 'A外' },
          '2-0.5火': { en: 'A外' },
          '2-2.5火': { en: 'C外' },
          '2-3.5火': { en: 'C外' },
          '2-5.5火': { en: 'A外' },
          '2-1雷': { en: 'A中' },
          '2-2雷': { en: 'C中' },
          '2-4雷': { en: 'C中' },
          '2-5雷': { en: 'A中' },
          // 打24
          '3-1冰': { en: 'B点' },
          '3-2冰': { en: 'B点' },
          '3-4冰': { en: 'D点' },
          '3-5冰': { en: 'D点' },
          '3-1火': { en: 'A外' },
          '3-2火': { en: 'C外' },
          '3-4火': { en: 'C外' },
          '3-5火': { en: 'A外' },
          '3-0.5火': { en: 'A外' },
          '3-2.5火': { en: 'C外' },
          '3-3.5火': { en: 'C外' },
          '3-5.5火': { en: 'A外' },
          '3-1雷': { en: 'A中' },
          '3-2雷': { en: 'C中' },
          '3-4雷': { en: 'C中' },
          '3-5雷': { en: 'A中' },
          '1-左右雷': { en: 'B/D中' },
          '2-左右雷': { en: 'B/D中' },
          '3-左右雷': { en: 'B/D中' },
          '雷': { en: '雷' },
          '冰': { en: '冰' },
          '火': { en: '火' },
          'text1': { en: '${a}：${t}' },
          'text3': { en: '${a1}${a2}${a3}(带地水)：${t1} -> ${t2} -> ${t3}' },
          '鸳鸯锅1': { en: '准备看"${dir}"去${lr}' },
          '鸳鸯锅转': { en: '${o1}${c1} -> ${o2}${c2}' },
          'cw': { en: '顺' },
          'ccw': { en: '逆' },
          'dirN': { en: 'A' },
          'dirNE': { en: '2' },
          'dirE': { en: 'Boy' },
          'dirSE': { en: '3' },
          'dirS': { en: 'C' },
          'dirSW': { en: '4' },
          'dirW': { en: 'Dog' },
          'dirNW': { en: '1' },
        };
        if (data.boss3鸳鸯锅中) {
          if (['45D', '45E'].includes(matches.count)) {
            const id = matches.targetId;
            const dir = data.boss3鸳鸯锅.find((v) => v.id === id).dir;
            const el = { '45D': '左蓝右紫', '45E': '左紫右蓝' }[matches.count];
            data.boss3鸳鸯锅9F8.push({ el, dir, id });
            if (data.boss3鸳鸯锅9F8.length === 1) {
              const yyg = [el.at(1), el.at(3)];
              // 这里不用反 因为小怪的面向已经是反的了 负负得正
              const safe = yyg.findIndex((v) => v === data.boss3鸳鸯锅buff) === 0 ? '左' : '右';
              const d = Directions.outputFrom8DirNum(dir);
              return { infoText: output.鸳鸯锅1({ dir: output[d](), lr: safe }) };
            }
            if (data.boss3鸳鸯锅9F8.length === 6) {
              const [a1, a2] = data.boss3鸳鸯锅9F8.slice(0, 2);
              const [a5, a6] = data.boss3鸳鸯锅9F8.slice(-2);
              const clk1 = (a2.dir - a1.dir + 8) % 8 === 2 ? 1 : -1;
              const clk2 = (a6.dir - a5.dir + 8) % 8 === 2 ? 1 : -1;
              return {
                alertText: output.鸳鸯锅转({
                  o1: output[Directions.outputFrom8DirNum(a1.dir)](),
                  c1: output[clk1 === 1 ? 'cw' : 'ccw'](),
                  o2: output[Directions.outputFrom8DirNum(a5.dir)](),
                  c2: output[clk2 === 1 ? 'cw' : 'ccw'](),
                }),
              };
            }
          }
        }
        if (data.boss3其墓须有三) {
          if (['45A', '45B', '45C'].includes(matches.count)) {
            data.boss39F8.push({ '45A': '火', '45B': '冰', '45C': '雷' }[matches.count]);
          }
          if (data.boss39F8.length === 1) {
            const v = data.boss3魔力注入temp[data.boss39F8[0]];
            let d;
            if (Array.isArray(v) && v.length > 1) {
              if (data.boss39F8[0] === '雷') {
                return { infoText: output.text1({ a: '雷', t: output['1-左右雷']() }) };
              }
              d = v.reduce((a, b) =>
                Math.abs(a - data.boss3魔力注入正点冰) < Math.abs(b - data.boss3魔力注入正点冰) ? a : b
              );
            }
            d = Array.isArray(v) ? v[0] : v;
            return {
              infoText: output.text1({
                a: output[data.boss39F8[0]](),
                t: output[`1-${d}${data.boss39F8[0]}`](),
              }),
            };
          }
          if (data.boss39F8.length === 3) {
            const a1 = output[data.boss39F8[0]]();
            const a2 = output[data.boss39F8[1]]();
            const a3 = output[data.boss39F8[2]]();
            const g1 = data.boss3魔力注入temp[data.boss39F8[0]];
            const g2 = data.boss3魔力注入temp[data.boss39F8[1]];
            const g3 = data.boss3魔力注入temp[data.boss39F8[2]];
            const [t1, t2, t3] = [g1, g2, g3].map((v, i) => {
              let d;
              if (Array.isArray(v) && v.length > 1) {
                if (data.boss39F8[i] === '雷') {
                  return output[`${i + 1}-左右雷`]();
                }
                d = v.reduce((a, b) =>
                  Math.abs(a - data.boss3魔力注入正点冰) < Math.abs(b - data.boss3魔力注入正点冰) ? a : b
                );
              }
              d = Array.isArray(v) ? v[0] : v;
              // console.log(`${matches.timestamp}, ${i + 1}-${d}${data.boss39F8[i]!}`);
              return output[`${i + 1}-${d}${data.boss39F8[i]}`]();
            });
            data.boss3魔力注入res.push(t2);
            data.boss3魔力注入res.push(t3);
            return {
              alertText: output.text3({ a1, a2, a3, t1, t2, t3 }),
              tts: null,
            };
          }
        }
      },
    },
    {
      id: '超模之塔 BOSS3 B995',
      type: 'StartsUsing',
      netRegex: { id: 'B995' },
      delaySeconds: 1,
      infoText: (data, _matches, output) => {
        if (data.boss3地水count === 2) {
          return output.text3();
        }
        const text = data.boss3魔力注入res[data.boss3地水count];
        data.boss3地水count++;
        return output.text({ text });
      },
      outputStrings: {
        text: '穿 => ${text}',
        text3: '穿',
      },
    },
    {
      id: '超模之塔 BOSS3 多产的土壤',
      type: 'StartsUsing',
      netRegex: { id: 'B99A' },
      response: Responses.bigAoe(),
    },
    {
      id: '超模之塔 BOSS3 B99A',
      type: 'StartsUsing',
      netRegex: { id: 'B99A' },
      preRun: (data) => {
        data.boss3鸳鸯锅中 = true;
      },
      delaySeconds: 60,
      run: (data) => {
        data.boss3鸳鸯锅中 = false;
        data.boss3鸳鸯锅buff = undefined;
      },
    },
    // #endregion
    // #region BOSS4
    {
      id: '超模之塔 BOSS4 核爆',
      type: 'StartsUsing',
      netRegex: { id: 'BD1F' },
      infoText: (_, __, output) => output.text(),
      outputStrings: { text: 'AoE x2' },
    },
    {
      id: '超模之塔 BOSS4 4连召唤',
      type: 'StartsUsing',
      netRegex: {
        id: [
          // 琴起手
          'BF0A',
          // 弓起手
          'BF0B',
          // 刀起手
          'BF0C',
          // 铃铛起手
          'BF0D',
        ],
      },
      preRun: (data) => {
        data.boss4封印武器.length = 0;
        data.boss4四连召唤中 = true;
      },
      delaySeconds: 30,
      suppressSeconds: 1,
      run: (data) => {
        data.boss4四连召唤中 = false;
      },
    },
    // 26|2026-08-01T21:20:29.0690000+08:00|159E|封印武器：弓|9999.00|E0000000||4000496D|目录|401|649637410||
    // 26|2026-08-01T21:20:32.1030000+08:00|159D|封印武器：刀|9999.00|E0000000||4000496D|目录|402|649637410||
    // 26|2026-08-01T21:20:35.0920000+08:00|159F|封印武器：琴|9999.00|E0000000||4000496D|目录|404|649637410||
    // 26|2026-08-01T21:20:38.0770000+08:00|159C|封印武器：铃铛|9999.00|E0000000||4000496D|目录|403|649637410||
    {
      id: '超模之塔 BOSS4 封印武器',
      type: 'GainsEffect',
      netRegex: {
        effectId: [
          '159C',
          '159D',
          '159E',
          '159F', // 琴
        ],
      },
      durationSeconds: (data) => data.boss4四连召唤中 ? (data.boss4封印武器.length === 3 ? 25 : 3) : 9,
      response: (data, matches, output) => {
        const effectName = {
          '159E': '弓',
          '159D': '刀',
          '159F': '琴',
          '159C': '铃铛',
        }[matches.effectId];
        data.boss4封印武器.push(effectName);
        if (data.boss4封印武器.length < 4) {
          return { [data.boss4四连召唤中 ? 'infoText' : 'alertText']: output[`预兆${effectName}`]() };
        }
        if (data.boss4封印武器.length === 4) {
          const res = output.text({
            s1: output[data.boss4封印武器[0]](),
            s2: output[data.boss4封印武器[1]](),
            s3: output[data.boss4封印武器[2]](),
            s4: output[data.boss4封印武器[3]](),
          });
          data.boss4封印武器.length = 0;
          return { alertText: res };
        }
      },
      outputStrings: {
        '预兆弓': { en: '弓（月环）' },
        '预兆刀': { en: '刀（ABC）' },
        '预兆琴': { en: '琴（钢铁）' },
        '预兆铃铛': { en: '铃铛（123）' },
        '弓': { en: '内环' },
        '刀': { en: 'ABC' },
        '琴': { en: '外侧' },
        '铃铛': { en: '123' },
        'text': { en: '${s1} -> ${s2} -> ${s3} -> ${s4}' },
      },
    },
    {
      id: '超模之塔 BOSS4 CJB',
      type: 'StartsUsing',
      netRegex: { id: ['BD15', 'BD3F'] },
      suppressSeconds: 1,
      countdownSeconds: 4.7,
      response: Responses.knockback(),
    },
    // #endregion
  ],
});
