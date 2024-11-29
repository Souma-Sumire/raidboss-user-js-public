const { getRpByName, mark, getRpById, getDecIdByRp, doQueueActions } = Util.souma;
const defaultSortRule = ['MT', 'ST', 'H1', 'H2', 'D1', 'D2', 'D3', 'D4'];
const sortRp = (rpList, rule = defaultSortRule) => {
  return rpList.sort((a, b) => {
    return rule.indexOf(a) - rule.indexOf(b);
  });
};
const clearMark = (delay = 0) => {
  console.debug('clearMark');
  doQueueActions([
    { c: 'command', p: '/mk off <1>', d: delay * 1000 },
    { c: 'command', p: '/mk off <2>' },
    { c: 'command', p: '/mk off <3>' },
    { c: 'command', p: '/mk off <4>' },
    { c: 'command', p: '/mk off <5>' },
    { c: 'command', p: '/mk off <6>' },
    { c: 'command', p: '/mk off <7>' },
    { c: 'command', p: '/mk off <8>' },
  ]);
};
const markTypeOptions = {
  空: '',
  攻击1: 'attack1',
  攻击2: 'attack2',
  攻击3: 'attack3',
  攻击4: 'attack4',
  攻击5: 'attack5',
  攻击6: 'attack6',
  攻击7: 'attack7',
  攻击8: 'attack8',
  锁链1: 'bind1',
  锁链2: 'bind2',
  锁链3: 'bind3',
  禁止1: 'stop1',
  禁止2: 'stop2',
  圆圈: 'circle',
  十字: 'cross',
  三角: 'triangle',
  方块: 'square',
};
const p3buffs = {
  '锤': '996',
  '火': '997',
  '眼': '998',
  '圈': '99C',
  '水': '99D',
  '冰': '99E',
  '返': '9A0', // 延迟咏唱：回返
};
const p3BuffsIdToName = Object.fromEntries(Object.entries(p3buffs).map(([name, id]) => [id, name]));
const p3Outputs = {
  '0': { en: '场中分摊' },
  '1': { en: '引导灯' },
  '2': { en: '远离放火' },
  '圈': { en: '灯脚下' },
  '眼': { en: '内小圆' },
  '水': { en: '内小圆' },
  '0/2': { en: '场中或远离' },
};
const headmarkers = {
  tankBuster: '00DA',
  冰花: '0159',
};
const firstHeadmarker = parseInt(headmarkers.tankBuster, 16);
const getHeadmarkerId = (data, matches) => {
  if (data.soumaDecOffset === undefined)
    data.soumaDecOffset = parseInt(matches.id, 16) - firstHeadmarker;
  return (parseInt(matches.id, 16) - data.soumaDecOffset).toString(16).toUpperCase().padStart(
    4,
    '0',
  );
};
Options.Triggers.push({
  id: 'SoumaEdenUltimate',
  // zoneId: ZoneId.FuturesRewrittenUltimate,
  zoneId: 1238,
  zoneLabel: { en: '光暗未来绝境战（莫古力攻略） by Souma' },
  config: [
    // location.href = 'http://localhost:8080/ui/config/config.html'
    {
      id: '伊甸P1连线机制标点',
      name: { en: '伊甸P1连线机制标点' },
      type: 'select',
      options: { en: { '开√': '开', '关': '关' } },
      default: '关',
      comment: {
        en: '线：锁1锁2禁1禁2。闲：攻1攻2攻3攻4。',
      },
    },
    {
      id: '伊甸P1标线1',
      name: { en: '伊甸P1标线1' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链1,
    },
    {
      id: '伊甸P1标线2',
      name: { en: '伊甸P1标线2' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.锁链2,
    },
    {
      id: '伊甸P1标线3',
      name: { en: '伊甸P1标线3' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止1,
    },
    {
      id: '伊甸P1标线4',
      name: { en: '伊甸P1标线4' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.禁止2,
    },
    {
      id: '伊甸P1标闲1',
      name: { en: '伊甸P1标闲1' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击1,
    },
    {
      id: '伊甸P1标闲2',
      name: { en: '伊甸P1标闲2' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击2,
    },
    {
      id: '伊甸P1标闲3',
      name: { en: '伊甸P1标闲3' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击3,
    },
    {
      id: '伊甸P1标闲4',
      name: { en: '伊甸P1标闲4' },
      type: 'select',
      options: { en: markTypeOptions },
      default: markTypeOptions.攻击4,
    },
    {
      id: '伊甸P2光暴机制标点',
      name: { en: '伊甸P2光暴机制标点' },
      type: 'select',
      options: { en: { '开√': '开', '关': '关' } },
      default: '关',
      comment: {
        en: '塔位置：上面锁链123从左到右，下面攻击123从左到右。默认玩家上下44分组。若未正常44分组，则会忽视攻略的优先级，暴力标出一套可以通过该机制的点。',
      },
    },
  ],
  overrideTimelineFile: true,
  timeline: `
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
# P1
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
14.9 "雷/火龙卷破击"
25.4 "连锁爆印刻"
36 "乐园绝技"
36.7 "--不可选中--"
81.9 "--可选中--
87.4 "光焰圆光"
103 "罪裁断"
103.7 "浮游拘束"
105.7 "急冲刺"
122.9 "光焰圆光"
131.4 "连锁爆印刻"
142.9 "燃烧击"
161.8 "光焰圆光"
# P2
169.4 "四重强击" StartsUsing { id: "9CFF" } window 200,20
174.1 "四重强击"
183.6 "镜像"
190.7 "钻石星尘"
194.9 "--不可选中--"
206.2 "天降一击"
231.8 "--可选中--"
238 "神圣射线"
238.7 "神圣射线"
247.8 "镜中奇遇"
262 "镰形/阔斧回旋踢"
278.1 "强放逐"
287.7 "光之失控"
290.4 "--不可选中--"
316.7 "强放逐"
324.8 "光之海啸"
344.2 "绝对零度"
# P3
440.8 "地狱审判" StartsUsing { id: "9D49" } window 500,20
455.0 "时间压缩·绝"
464.6 "限速"
502.8 "破盾一击"
503.2 "破盾一击"
511.3 "脉冲星震波"
519.6 "黑色光环"
528.8 "延迟咏唱·回响"
537.0 "黑暗狂水"
544.1 "启示"
549.3 "碎灵一击"
549.5 "碎灵一击"
559.6 "暗炎喷发"
568.3 "暗夜舞蹈"
568.6 "暗夜舞蹈"
571.4 "暗夜舞蹈"
580.7 "脉冲星震波"
594.4 "记忆终结"
611.5 "具象化"
637.1 "光暗龙诗"
637.1 "光与暗的龙诗"
648.3 "光之波动"
651.3 "碎灵一击"
`,
  initData: () => {
    return {
      soumaCombatantData: [],
      soumaPhase: 'P1',
      soumaDecOffset: 0,
      soumaP1线存储: [],
      soumaP1线处理: undefined,
      soumaP1雾龙ids: [],
      soumaP1雾龙属性: undefined,
      soumaP2冰圈初始位置DirNum: [],
      soumaP2冰圈初始位置: undefined,
      soumaP2冰花点名: [],
      soumaP2钢月: undefined,
      soumaP2DD处理: undefined,
      soumaP2镜中奇遇: false,
      soumaP2镜中奇遇分身: [],
      soumaP2光之暴走连线: [],
      soumaP2光暴过量光层数: 0,
      soumaP3阶段: undefined,
      soumaP3一运buff: {},
      soumaP3二运水: [],
      soumaSorrows: {},
      soumaP3线存储: [],
      soumaP3处理: [],
    };
  },
  triggers: [
    // 通用
    {
      id: 'Souma 绝伊甸 Headmarker',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.soumaDecOffset === undefined,
      run: (data, matches) => {
        getHeadmarkerId(data, matches);
      },
    },
    {
      id: 'Souma 绝伊甸 阶段控制',
      type: 'StartsUsing',
      // 9CFF = P2 四重强击
      // 9D49 = P3 地狱审判
      netRegex: { id: ['9CFF', '9D49'], capture: true },
      suppressSeconds: 20,
      run: (data, matches) => {
        switch (matches.id) {
          case '9CFF':
          {
            data.soumaPhase = 'P2';
            data.soumaP1线存储.length = 0;
            data.soumaP1线处理 = undefined;
            data.soumaP1雾龙ids.length = 0;
            data.soumaP1雾龙属性 = undefined;
            break;
          }
          case '9D49':
          {
            data.soumaPhase = 'P3';
            data.soumaP2DD处理 = undefined;
            data.soumaP2镜中奇遇 = false;
            data.soumaP2镜中奇遇分身.length = 0;
            data.soumaP2光之暴走连线.length = 0;
            data.soumaP2光暴过量光层数 = 0;
            data.soumaP2冰圈初始位置 = undefined;
            data.soumaP2冰圈初始位置DirNum.length = 0;
            data.soumaP2冰花点名.length = 0;
            data.soumaP2钢月 = undefined;
            break;
          }
        }
      },
    },
    // #region P1
    {
      id: 'Souma 绝伊甸 P1 老父亲AOE',
      type: 'StartsUsing',
      netRegex: { id: '9CEA' },
      response: Responses.bleedAoe(),
    },
    {
      id: 'Souma 绝伊甸 P1 火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CD0' },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '火：八方 => 与搭档分摊',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CD0' },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '与搭档分摊',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CD4' },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '雷：八方 => 分散',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CD4' },
      delaySeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '分散',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 死刑 连锁爆印刻',
      type: 'StartsUsing',
      netRegex: { id: '9CE8' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Souma 绝伊甸 连锁爆印刻',
      type: 'GainsEffect',
      netRegex: { effectId: '1046' },
      condition: (data, matches) => {
        return data.role === 'tank' || matches.target === data.me;
      },
      delaySeconds: 13,
      alarmText: (data, matches, output) => {
        if (matches.target === data.me) {
          return output.me();
        }
        return output.text({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        me: { en: '爆印死刑' },
        text: {
          en: '死刑：靠近 ${player}',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙属性记忆',
      type: 'StartsUsing',
      netRegex: { id: ['9CDB', '9CDA'] },
      infoText: (data, matches, output) => {
        data.soumaP1雾龙属性 = matches.id === '9CDB' ? 'thunder' : 'fire';
        return output[data.soumaP1雾龙属性]();
      },
      outputStrings: {
        fire: { en: '火：稍后分组分摊' },
        thunder: { en: '雷：稍后分散' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙属性记忆第二次提醒',
      type: 'StartsUsing',
      netRegex: { id: ['9CDB', '9CDA'] },
      delaySeconds: 11,
      durationSeconds: 8,
      alertText: (data, _matches, output) => {
        if (data.soumaP1雾龙属性 === undefined) {
          throw new UnreachableCode();
        }
        return output[data.soumaP1雾龙属性]();
      },
      run: (data) => {
        data.soumaP1雾龙属性 = undefined;
      },
      outputStrings: {
        fire: { en: '分组分摊' },
        thunder: { en: '分散' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙',
      type: 'StartsUsing',
      netRegex: { id: '9CDE' },
      preRun: (data, matches) => {
        data.soumaP1雾龙ids.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP1雾龙ids.length === 3) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants.filter((v) => v.WeaponId === 4);
        }
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP1雾龙ids.length === 3) {
          const shadows = data.soumaCombatantData.map((v) => {
            const dir = Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 100);
            const opposite = (dir + 4) % 8;
            return { dir, opposite };
          });
          const allDirs = [0, 1, 2, 3, 4, 5, 6, 7];
          const safeDirs = allDirs.filter((dir) => {
            return shadows.every((v) => v.dir !== dir && v.opposite !== dir);
          });
          return output[safeDirs.join('')]();
        }
      },
      outputStrings: {
        '04': { 'en': 'A、C安全' },
        '15': { 'en': '4、2安全' },
        '26': { 'en': 'D、B安全' },
        '37': { 'en': '1、3安全' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9D8A' },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '雷：八方 => 分散' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9D8A' },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '分散' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9D89' },
      delaySeconds: 2,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '火：八方 => 与搭档分摊' } },
    },
    {
      id: 'Souma 绝伊甸 P1 雾龙后火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9D89' },
      delaySeconds: 2 + 5,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: { text: { en: '与搭档分摊' } },
    },
    {
      id: 'Souma 绝伊甸 P1一运光轮颜色',
      type: 'StartsUsing',
      netRegex: { id: '9CD[67]' },
      delaySeconds: 6,
      durationSeconds: 12,
      infoText: (_data, matches, output) => {
        const color = matches.id === '9CD6' ? 'fire' : 'thunder';
        return output[color]();
      },
      outputStrings: {
        'fire': { en: '找蓝色' },
        'thunder': { en: '找红色' },
      },
    },
    {
      id: 'Souma 绝伊甸 P1一运火击退',
      type: 'StartsUsing',
      netRegex: { id: '9CE1' },
      delaySeconds: 9,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '靠近',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 连线',
      type: 'Tether',
      netRegex: {
        // 00F9 火
        // 011F 冰
        'id': ['00F9', '011F'],
      },
      condition: (data) => data.soumaPhase === 'P1',
      preRun: (data, matches) => {
        data.soumaP1线存储.push(matches);
      },
      durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          switch: { en: '换换换！' },
          fire: { en: '火' },
          thunder: { en: '雷' },
          line1: { en: '1${el}：去上面正点' },
          line2: { en: '2${el}：去下面正点' },
          line3: { en: '3${el}：去上面最外侧' },
          line4: { en: '4${el}：去下面最外侧' },
          nothing1: { en: '闲1：去上面' },
          nothing2: { en: '闲2：去上面' },
          nothing3: { en: '闲3：去下面' },
          nothing4: { en: '闲4：去下面' },
          handleEl: { en: '处理：${el1} => ${el2}' },
          text: { en: '${switcherRes}（分摊点：${lines}）' },
          needSwitch: { en: '${rp}换' },
          dontSwitch: { en: '不用换' },
          stack: { en: '分摊点名（不用换）' },
          stackHigh: { en: '高优先级：近A' },
          stackDown: { en: '低优先级：近C' },
        };
        // 第一次连线机制 双分摊
        if (data.soumaP1线存储.length === 2) {
          const sortRule = ['MT', 'ST', 'H1', 'H2', 'D1', 'D2', 'D3', 'D4'];
          const mtGroup = ['MT', 'ST', 'H1', 'H2'];
          const lines = sortRp(data.soumaP1线存储.map((v) => getRpByName(data, v.target)), sortRule);
          const tnCount = lines.filter((v) => mtGroup.includes(v)).length;
          let switcher;
          if (tnCount === 0) {
            switcher = 'MT';
          } else if (tnCount === 2) {
            switcher = 'D1';
          }
          const povRp = getRpByName(data, data.me);
          if (lines[0] === povRp) {
            // if (switcher === undefined)
            //   return { alertText: output.stack!() };
            return { alarmText: output.stackHigh() };
          }
          if (lines[1] === povRp) {
            // if (switcher === undefined) {
            //   return { alertText: output.stack!() };
            // }
            return { alarmText: output.stackDown() };
          }
          if (switcher === povRp) {
            return { alarmText: output.switch() };
          }
          const switcherRes = switcher !== undefined
            ? output.needSwitch({ rp: switcher })
            : output.dontSwitch();
          return {
            infoText: output.text({ switcherRes: switcherRes, lines: lines.join(', ') }),
            tts: switcher === povRp ? output.switch() : switcherRes,
          };
        }
        // 第二次连线机制 四根雷火线
        if (data.soumaP1线存储.length === 3) {
          // console.debug('P1线');
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[2].targetId, 16),
              data.triggerSetConfig.伊甸P1标线1.toString(),
              false,
            );
          if (data.soumaP1线存储[2]?.target === data.me) {
            data.soumaP1线处理 = '线1';
            const element = data.soumaP1线存储[2].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line1({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 4) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[3].targetId, 16),
              data.triggerSetConfig.伊甸P1标线2.toString(),
              false,
            );
          if (data.soumaP1线存储[3]?.target === data.me) {
            data.soumaP1线处理 = '线2';
            const element = data.soumaP1线存储[3].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line2({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 5) {
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[4].targetId, 16),
              data.triggerSetConfig.伊甸P1标线3.toString(),
              false,
            );
          if (data.soumaP1线存储[4]?.target === data.me) {
            data.soumaP1线处理 = '线3';
            const element = data.soumaP1线存储[4].id === '00F9' ? 'fire' : 'thunder';
            return { alertText: output.line3({ el: output[element]() }) };
          }
          return;
        }
        if (data.soumaP1线存储.length === 6) {
          let res;
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开') {
            mark(
              parseInt(data.soumaP1线存储[5].targetId, 16),
              data.triggerSetConfig.伊甸P1标线4.toString(),
              false,
            );
            clearMark(15);
          }
          if (data.soumaP1线存储[5]?.target === data.me) {
            data.soumaP1线处理 = '线4';
            const element = data.soumaP1线存储[5].id === '00F9' ? 'fire' : 'thunder';
            res = { alertText: output.line4({ el: output[element]() }) };
          }
          const lines = data.soumaP1线存储.slice(2, 6);
          const targetsIds = lines.map((v) => v.targetId);
          const nothing = data.party.details.filter((v) => !targetsIds.includes(v.id)).sort(
            (a, b) => {
              return defaultSortRule.indexOf(getRpByName(data, a.name)) -
                defaultSortRule.indexOf(getRpByName(data, b.name));
            },
          );
          const nothingRp = nothing.map((v) => getRpById(data, parseInt(v.id, 16)));
          const sortedNothingRps = sortRp(nothingRp);
          const nothingIds = sortedNothingRps.map((v) => getDecIdByRp(data, v));
          if (nothingIds.length !== 4) {
            throw new Error('nothingIds长度不等于4');
          }
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(nothingIds[0], data.triggerSetConfig.伊甸P1标闲1.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(nothingIds[1], data.triggerSetConfig.伊甸P1标闲2.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(nothingIds[2], data.triggerSetConfig.伊甸P1标闲3.toString(), false);
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(nothingIds[3], data.triggerSetConfig.伊甸P1标闲4.toString(), false);
          if (nothing[0]?.name === data.me) {
            data.soumaP1线处理 = '闲1';
          }
          if (nothing[1]?.name === data.me) {
            data.soumaP1线处理 = '闲2';
          }
          if (nothing[2]?.name === data.me) {
            data.soumaP1线处理 = '闲3';
          }
          if (nothing[3]?.name === data.me) {
            data.soumaP1线处理 = '闲4';
          }
          const handler = {
            '线1': [1, 3],
            '线2': [2, 4],
            '线3': [1, 3],
            '线4': [2, 4],
            '闲1': [1, 3],
            '闲2': [1, 3],
            '闲3': [2, 4],
            '闲4': [2, 4],
          };
          const playerHandle = handler[data.soumaP1线处理];
          const elements = data.soumaP1线存储.map((v) => v.id === '00F9' ? 'fire' : 'thunder').slice(
            2,
            6,
          ).map((v) => output[v]());
          const youIsNothing = nothing.findIndex((v) => v.name === data.me);
          if (data.soumaP1线存储[5]?.target === data.me) {
            return res;
          }
          const gimmick = `${
            youIsNothing >= 0 ? output[`nothing${(youIsNothing + 1).toString()}`]() : ''
          }`;
          const handleOrder = output.handleEl({
            el1: elements[playerHandle[0] - 1],
            el2: elements[playerHandle[1] - 1],
          });
          return {
            infoText: `${gimmick} ${handleOrder}`,
            tts: gimmick,
          };
        }
        return undefined;
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+火塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CC1' },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '火：两侧 => 中间击退',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+火塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CC1' },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '靠近',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+雷塔器Q',
      type: 'StartsUsing',
      netRegex: { id: '9CC5' },
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '雷：两侧 => 两侧远离',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 塔+雷塔器Q after',
      type: 'StartsUsing',
      netRegex: { id: '9CC5' },
      delaySeconds: 7,
      alarmText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '远离',
        },
      },
    },
    {
      id: 'Souma 绝伊甸 P1 狂暴',
      type: 'StartsUsing',
      netRegex: { id: '9CC0' },
      condition: (data) => data.soumaPhase === 'P1',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '9.7秒狂暴读条',
        },
      },
    },
    // #endregion P1
    // #region P2
    {
      id: 'Souma 伊甸 P2 死刑',
      type: 'StartsUsing',
      netRegex: { id: '9CFF' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'Souma 伊甸 P2 钻石星辰',
      type: 'StartsUsing',
      netRegex: { id: '9D05' },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'Souma 伊甸 P2 冰圈初始点',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        pair: [
          { key: 'BNpcNameID', value: '3209' },
        ],
        capture: true,
      },
      condition: (data, matches) =>
        matches.change === 'Change' && data.soumaPhase === 'P2' && matches.pairPosX !== undefined &&
        matches.pairPosY !== undefined,
      suppressSeconds: 30,
      run: (data, matches) => {
        const { pairPosX: x, pairPosY: y } = matches;
        const dirNum = Directions.xyTo8DirNum(parseFloat(x), parseFloat(y), 100, 100);
        const sortRule = [0, 7, 6, 5, 4, 3, 2, 1];
        data.soumaP2冰圈初始位置DirNum = [dirNum, (dirNum + 4) % 8].sort((a, b) =>
          sortRule.indexOf(a) - sortRule.indexOf(b)
        );
        data.soumaP2冰圈初始位置 = dirNum % 2 === 0 ? '正' : '斜';
      },
    },
    {
      id: 'Souma 伊甸 P2 钢铁还是月环',
      type: 'StartsUsing',
      netRegex: { id: ['9D0A', '9D0B'] },
      run: (data, matches, output) => {
        data.soumaP2钢月 = matches.id === '9D0A' ? output.钢铁() : output.月环();
      },
      outputStrings: {
        钢铁: { en: '钢铁外' },
        月环: { en: '月环内' },
      },
    },
    {
      id: 'Souma 伊甸 P2 冰花点名',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === 'P2' && getHeadmarkerId(data, matches) === headmarkers.冰花,
      preRun: (data, matches) => {
        data.soumaP2冰花点名.push(matches);
      },
      delaySeconds: 0.4,
      alarmText: (data, _matches, output) => {
        if (data.soumaP2冰花点名.length === 4) {
          const 冰花RP = data.soumaP2冰花点名.map((v) => getRpByName(data, v.target));
          const 冰花职能 = ['MT', 'ST', 'H1', 'H2'].find((v) => 冰花RP.includes(v))
            ? 'TH'
            : 'DPS';
          const 冰花去 = data.soumaP2冰圈初始位置 === '正' ? output.斜() : output.正();
          const 水波去 = data.soumaP2冰圈初始位置;
          const 玩家职能 = data.role === 'dps' ? 'DPS' : 'TH';
          data.soumaP2冰花点名.length = 0;
          data.soumaP2DD处理 = 玩家职能 === 冰花职能 ? '冰花' : '水波';
          return 玩家职能 === 冰花职能
            ? output.冰花({ go: data.soumaP2钢月, direction: 冰花去 })
            : output.水波({ go: data.soumaP2钢月, direction: 水波去 });
        }
      },
      outputStrings: {
        正: { en: '正' },
        斜: { en: '斜' },
        水波: { en: '${go} + ${direction} 水波(靠近)' },
        冰花: { en: '${go} + ${direction} 冰花(远一点)' },
      },
    },
    {
      id: 'Souma 伊甸 P2 冰花点名2',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data, matches) =>
        data.soumaPhase === 'P2' && getHeadmarkerId(data, matches) === headmarkers.冰花,
      delaySeconds: 5.5,
      suppressSeconds: 999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          冰花: { en: '放冰花' },
          水波: { en: '去场中' },
        };
        if (data.soumaP2DD处理 === '冰花') {
          return { alarmText: output.冰花() };
        }
        return { infoText: output.水波() };
      },
    },
    {
      id: 'Souma 伊甸 P2 击退Re',
      type: 'StartsUsing',
      netRegex: { id: '9D05' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 17,
      durationSeconds: 5,
      alarmText: (data, _matches, output) => {
        return output.text({ dir: data.soumaP2冰圈初始位置DirNum.map((v) => output[v]()).join('/') });
      },
      outputStrings: {
        text: { en: '${dir}击退' },
        0: Outputs.north,
        1: Outputs.northeast,
        2: Outputs.east,
        3: Outputs.southeast,
        4: Outputs.south,
        5: Outputs.southwest,
        6: Outputs.west,
        7: Outputs.northwest,
      },
    },
    {
      id: 'Souma 伊甸 P2 击退分身',
      type: 'StartsUsing',
      netRegex: { id: '9D10' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 3,
      durationSeconds: 9,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          0: { en: '<= 顺180' },
          180: { en: '<= 顺180' },
          135: { en: '<= 顺135' },
          90: { en: '<= 顺90' },
          45: { en: '反跑！逆135 =>' },
        };
        const { x, y } = matches;
        const num = Directions.xyTo8DirNum(parseFloat(x), parseFloat(y), 100, 100);
        const dir = data.soumaP2冰圈初始位置DirNum;
        const myRp = getRpByName(data, data.me);
        const myDir = ['MT', 'H1', 'D1', 'D3'].includes(myRp)
          ? dir[0]
          : dir[1];
        let index = 0;
        for (let i = 0; i < 8; i++) {
          const d = (myDir + i) % 8;
          if (d === num || d === (num + 4) % 8) {
            index = i;
            break;
          }
        }
        const angle = index * 45;
        if (angle === 45) {
          return { alarmText: output[angle]() };
        }
        return { infoText: output[angle]() };
      },
    },
    {
      id: 'Souma 伊甸 P2 4连分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D10' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '连续分摊（4次）' },
      },
    },
    {
      id: 'Souma 伊甸 P2 背对',
      type: 'StartsUsing',
      netRegex: { id: '9D10' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 12,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '背对场外分身' },
      },
    },
    {
      id: 'Souma 伊甸 P2 静后',
      type: 'StartsUsing',
      netRegex: { id: '9D01' },
      response: Responses.getBackThenFront(),
    },
    {
      id: 'Souma 伊甸 P2 闲前',
      type: 'StartsUsing',
      netRegex: { id: '9D02' },
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'Souma 伊甸 P2 直线分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D12' },
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: { en: '直线分摊' },
      },
    },
    {
      id: 'Souma 伊甸 P2 镜中奇遇',
      type: 'StartsUsing',
      netRegex: { id: '9CF3' },
      condition: (data) => data.soumaPhase === 'P2',
      preRun: (data, _matches) => {
        data.soumaP2镜中奇遇 = true;
        // console.log(_matches.timestamp);
      },
    },
    {
      id: 'Souma 伊甸 P2 镜中奇遇分身',
      type: 'CombatantMemory',
      netRegex: {
        id: '4[0-9A-Fa-f]{7}',
        capture: true,
      },
      condition: (data, matches) => {
        if (!data.soumaP2镜中奇遇 || data.soumaPhase !== 'P2' || matches.change !== 'Change') {
          return false;
        }
        const t = [
          'type',
          'timestamp',
          'change',
          'id',
          'pairHeading',
          'pairPosX',
          'pairPosY',
          'pairPosZ',
        ];
        const m = Object.entries(matches).filter(([_k, v]) => v !== undefined);
        if (m.length !== t.length || m.some(([k, _v]) => !t.includes(k)))
          return false;
        return true;
      },
      preRun: (data, matches) => {
        data.soumaP2镜中奇遇分身.push(matches);
      },
      durationSeconds: 20,
      promise: async (data) => {
        if (data.soumaP2镜中奇遇分身.length === 3) {
          data.soumaCombatantData = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants.filter((v) =>
            v.BNpcNameID === 9317 && v.BNpcID === 17825 &&
            data.soumaP2镜中奇遇分身.find((w) => parseInt(w.id, 16) === v.ID)
          );
        }
      },
      infoText: (data, _matches, output) => {
        if (data.soumaP2镜中奇遇分身.length === 3 && data.soumaP2镜中奇遇) {
          const kagami = data.soumaCombatantData.sort((a, b) => a.ID - b.ID);
          const dirs = kagami.map((v) => Directions.xyTo8DirNum(v.PosX, v.PosY, 100, 100));
          const blue = dirs[0];
          const reds = dirs.slice(1);
          const group = ['MT', 'ST', 'D1', 'D2'].includes(getRpByName(data, data.me)) ? '近战' : '远程';
          const start = group === '近战' ? (blue + 4) % 8 : blue;
          // 找到距离start最近的红
          let minDist = 999;
          let minI = 999;
          let end = 999;
          reds.forEach((v) => {
            const d = Math.abs(v - start);
            const dd = d < 4 ? d : 8 - d;
            if (dd < minDist) {
              minDist = dd;
              end = v;
            }
            // 距离相同时，去逆时针方向
            if (dd === minDist) {
              for (let i = 0; i < 8; i++) {
                if (((start - i) + 8) % 8 === v) {
                  if (i < minI) {
                    minI = i;
                    end = ((start - i) + 8) % 8;
                  }
                  break;
                }
              }
            }
          });
          // console.log(
          //   `timestamp: ${_matches.timestamp}, blue: ${blue}, reds: ${
          //     reds.join(',')
          //   }, start: ${start}, end: ${end}`,
          // );
          data.soumaP2镜中奇遇 = false;
          return output.text({ dir1: output[start](), dir2: output[end]() });
        }
      },
      outputStrings: {
        text: { en: '${dir1} => ${dir2}' },
        0: Outputs.north,
        1: Outputs.northeast,
        2: Outputs.east,
        3: Outputs.southeast,
        4: Outputs.south,
        5: Outputs.southwest,
        6: Outputs.west,
        7: Outputs.northwest,
      },
    },
    {
      id: 'Souma 伊甸 P2 强放逐 分摊',
      type: 'StartsUsing',
      netRegex: { id: '9D1C' },
      condition: (data) => data.soumaPhase === 'P2',
      durationSeconds: 6,
      alertText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.stackPartner,
      },
    },
    {
      id: 'Souma 伊甸 P2 强放逐 分散',
      type: 'StartsUsing',
      netRegex: { id: '9D1D' },
      condition: (data) => data.soumaPhase === 'P2',
      durationSeconds: 6,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: Outputs.spread,
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走',
      type: 'StartsUsing',
      netRegex: { id: '9D14' },
      condition: (data) => data.soumaPhase === 'P2',
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'Souma 伊甸 P2 光之暴走连线',
      type: 'Tether',
      netRegex: { id: '006E' },
      condition: (data) => data.soumaPhase === 'P2',
      preRun: (data, matches) => {
        data.soumaP2光之暴走连线.push(matches);
      },
      promise: async (data) => {
        if (data.soumaP2光之暴走连线.length === 6) {
          const combatants = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          data.soumaCombatantData = combatants.filter((v) =>
            data.party.nameToRole_[v.Name] && v.ID.toString(16).startsWith('1')
          );
        }
      },
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          圈: { en: '放圈' },
          上1: { en: '上1：去左上↖' },
          上2: { en: '上2：去下中↓' },
          上3: { en: '上3：去右上↗' },
          下1: { en: '下1：去右下↘' },
          下2: { en: '下2：去上中↑' },
          下3: { en: '下3：去左下↙' },
          备用1: { en: '上1：去左上↖' },
          备用2: { en: '上2：去下中↓' },
          备用3: { en: '上3：去右上↗' },
          备用4: { en: '下3：去左下↙' },
          备用5: { en: '下2：去上中↑' },
          备用6: { en: '下1：去右下↘' },
          unknown: { en: '未知，自己看' },
          error: { en: '出错了，自己看' },
        };
        if (data.soumaP2光之暴走连线.length === 6) {
          const upperHalfPlayerCount = data.soumaCombatantData.filter((player) =>
            player.PosY < 100
          ).length;
          const lowerHalfPlayerCount = data.soumaCombatantData.filter((player) =>
            player.PosY >= 100
          ).length;
          if (upperHalfPlayerCount === 4 && lowerHalfPlayerCount === 4) {
            // 99%的情况：上下半场站好了各4个人，以当时x轴排序，以保证站错了也能标出可以处理的标点，如果站的对就跟攻略解法的result一样。
            const sortGroup = ['TN', 'DPS'];
            const lightRampant = data.soumaP2光之暴走连线.map((v) => {
              const x = data.soumaCombatantData.find((w) => w.ID === parseInt(v.sourceId, 16)).PosX;
              const y = data.soumaCombatantData.find((w) => w.ID === parseInt(v.sourceId, 16)).PosY;
              const rp = getRpByName(data, v.source);
              const role = ['MT', 'ST', 'H1', 'H2'].includes(rp) ? 'TN' : 'DPS';
              return {
                decId: parseInt(v.sourceId, 16),
                name: v.source,
                rp: rp,
                role: role,
                x: x,
                y: y,
              };
            }).sort((a, b) => {
              if (a.role === b.role) {
                return a.x - b.x;
              }
              return sortGroup.indexOf(a.role) - sortGroup.indexOf(b.role);
            });
            const topGroup = lightRampant.filter((v) => v.y < 100);
            const bottomGroup = lightRampant.filter((v) => v.y >= 100);
            if (topGroup.length === 2) {
              topGroup.push(bottomGroup.pop());
            }
            if (bottomGroup.length === 2) {
              bottomGroup.push(topGroup.pop());
            }
            if (data.triggerSetConfig.伊甸P2光暴机制标点 === '开') {
              console.debug('P2光暴');
              mark(topGroup[0].decId, 'bind1', false);
              mark(topGroup[1].decId, 'attack2', false);
              mark(topGroup[2].decId, 'bind3', false);
              mark(bottomGroup[0].decId, 'attack3', false);
              mark(bottomGroup[1].decId, 'bind2', false);
              mark(bottomGroup[2].decId, 'attack1', false);
              clearMark(18);
            }
            data.soumaP2光之暴走连线.length = 0;
            const player = lightRampant.find((v) => v.name === data.me);
            if (player === undefined) {
              return { alarmText: output.圈() };
            }
            const playerGroup = topGroup.find((v) => v.name === data.me) ? 'top' : 'bottom';
            const index = [...topGroup, ...bottomGroup].findIndex((v) => v.name === data.me) % 3 +
              1;
            if (index === 0) {
              console.error(data.me, playerGroup, topGroup, bottomGroup);
              return { infoText: output.unknown(), tts: null };
            }
            return { infoText: output[`${playerGroup === 'bottom' ? '下' : '上'}${index}`]() };
          }
          // 有SB连上下站位都没做到，则无视攻略，暴力标出一套可以处理的标点
          // 未经过实测，可能有误
          console.error('有人没按上下分组站位，光之暴走进入备用逻辑');
          const lr = data.soumaP2光之暴走连线.map((v) => ({
            name: v.source,
            decId: parseInt(v.sourceId, 16),
          }));
          if (data.triggerSetConfig.伊甸P2光暴机制标点 === '开') {
            mark(lr[0].decId, 'bind1', false);
            mark(lr[1].decId, 'attack2', false);
            mark(lr[2].decId, 'bind3', false);
            mark(lr[3].decId, 'attack1', false);
            mark(lr[4].decId, 'bind2', false);
            mark(lr[5].decId, 'attack3', false);
            clearMark(18);
          }
          const index = lr.findIndex((v) => v.name === data.me);
          data.soumaP2光之暴走连线.length = 0;
          if (index === -1) {
            return { infoText: output.error(), tts: null };
          }
          return { infoText: output[`备用${index + 1}`]() };
        }
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走层数',
      type: 'GainsEffect',
      netRegex: { effectId: '8D1' },
      condition: (data, matches) => data.soumaPhase === 'P2' && data.me === matches.target,
      run: (data, matches) => {
        data.soumaP2光暴过量光层数 = parseInt(matches.count, 16);
      },
    },
    {
      id: 'Souma 伊甸 P2 光之暴走踩塔',
      type: 'StartsUsing',
      netRegex: { id: '9D14' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 26,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          踩塔: { en: '去踩塔！' },
          不踩: { en: '不踩' },
        };
        return data.soumaP2光暴过量光层数 === 2 ? { alarmText: output.踩塔() } : { infoText: output.不踩() };
      },
    },
    {
      id: 'Souma 伊甸 P2 光之海啸',
      type: 'StartsUsing',
      netRegex: { id: '9DFD' },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '八方分散',
        },
      },
    },
    {
      id: 'Souma 伊甸 P2 绝对零度',
      type: 'StartsUsing',
      netRegex: { id: '9D20' },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '9.7秒狂暴读条 打到20%',
        },
      },
    },
    {
      id: 'Souma 伊甸 P2 无敌消失',
      type: 'LosesEffect',
      netRegex: { effectId: '307' },
      condition: (data) => data.soumaPhase === 'P2',
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: {
          en: '打大冰（打到50%）',
        },
      },
    },
    // 39.7秒狂暴读条 打到50%
    {
      id: 'Souma 伊甸 P2 光之泛滥1',
      type: 'StartsUsing',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 6,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '5' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥2',
      type: 'StartsUsing',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '4' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥3',
      type: 'StartsUsing',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 4,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '3' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥4',
      type: 'StartsUsing',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '2' } },
    },
    {
      id: 'Souma 伊甸 P2 光之泛滥5',
      type: 'StartsUsing',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 39.7 - 2,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '1' } },
    },
    {
      id: 'Souma 伊甸 P2 连结',
      type: 'NetworkCancelAbility',
      netRegex: { id: '9D43' },
      condition: (data) => data.soumaPhase === 'P2',
      delaySeconds: 7,
      response: Responses.bigAoe('alert'),
    },
    // #endregion P2
    // #region P2.5
    {
      id: 'Souma 伊甸 P2.5 水波',
      type: 'StartsUsing',
      netRegex: { id: ['9D46', '9D42'] },
      condition: (data) =>
        data.soumaPhase === 'P2' && ['H1', 'H2', 'D3', 'D4'].includes(getRpByName(data, data.me)),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: { en: '水波' } },
    },
    // #endregion P2.5
    // #region P3

    // #endregion P3
  ],
});
