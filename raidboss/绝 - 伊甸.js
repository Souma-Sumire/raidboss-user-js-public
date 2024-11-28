const { getRpByName, mark, getRpById, getDecIdByRp } = Util.souma;
const sortRule = ['MT', 'ST', 'H1', 'H2', 'D1', 'D2', 'D3', 'D4'];
const sortRp = (rpList) => {
  return rpList.sort((a, b) => {
    return sortRule.indexOf(a) - sortRule.indexOf(b);
  });
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
  config: [
    // location.href = 'http://localhost:8080/ui/config/config.html'
    {
      id: '伊甸P1连线机制标点',
      name: { en: '伊甸P1连线机制标点' },
      type: 'select',
      options: { en: { '开': '开', '关': '关' } },
      default: '关',
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
  ],
  overrideTimelineFile: true,
  timeline: `
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
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
##### "P2"
159.2 "--可选中--"
165 "--sync--" StartsUsing { id: "9CFF" } window 300,0
170 "四重强击"
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
      soumaP1线处理Nums: [],
      soumaP2冰圈初始位置DirNum: [],
      soumaP2冰圈初始位置: undefined,
      soumaP2冰花点名: [],
      soumaP2钢月: undefined,
      soumaP2DD处理: undefined,
      // 花姐
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
      // 9CFF = P2开场死刑
      netRegex: { id: ['9CFF'], capture: true },
      suppressSeconds: 20,
      run: (data, matches) => {
        switch (matches.id) {
          case '9CFF':
            data.soumaPhase = 'P2';
            break;
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
      // durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          switch: { en: '换换换！' },
          fire: { en: '火' },
          thunder: { en: '雷' },
          line1: { en: '1${el}：上A' },
          line2: { en: '2${el}：下C' },
          line3: { en: '3${el}：上A' },
          line4: { en: '4${el}：下C' },
          nothing1: { en: '闲1：上A' },
          nothing2: { en: '闲2：上A' },
          nothing3: { en: '闲3：下C' },
          nothing4: { en: '闲4：下C' },
          handleEl: { en: '处理顺序：${el1} => ${el2}' },
          text: { en: '${switcherRes}（分摊点：${lines}）' },
          needSwitch: { en: '${rp}换' },
          dontSwitch: { en: '不换' },
          stackHigh: { en: '高优先级：近A' },
          stackDown: { en: '低优先级：近C' },
        };
        // 第一次连线机制 双分摊
        if (data.soumaP1线存储.length === 2) {
          const lines = sortRp(data.soumaP1线存储.map((v) => getRpByName(data, v.target)));
          const mtGroup = ['MT', 'H1', 'D1', 'D3'];
          const mtCount = lines.filter((v) => mtGroup.includes(v)).length;
          let switcher;
          if (mtCount === 0) {
            switcher = 'D1';
          } else if (mtCount === 2) {
            switcher = 'D2';
          }
          const povRp = getRpByName(data, data.me);
          if (lines[0] === povRp) {
            return { alarmText: output.stackHigh() };
          }
          if (lines[1] === povRp) {
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
          if (data.triggerSetConfig.伊甸P1连线机制标点 === '开')
            mark(
              parseInt(data.soumaP1线存储[5].targetId, 16),
              data.triggerSetConfig.伊甸P1标线4.toString(),
              false,
            );
          if (data.soumaP1线存储[5]?.target === data.me) {
            data.soumaP1线处理 = '线4';
            const element = data.soumaP1线存储[5].id === '00F9' ? 'fire' : 'thunder';
            res = { alertText: output.line4({ el: output[element]() }) };
          }
          const lines = data.soumaP1线存储.slice(2, 6);
          const targetsIds = lines.map((v) => v.targetId);
          const nothing = data.party.details.filter((v) => !targetsIds.includes(v.id)).sort(
            (a, b) => {
              return sortRule.indexOf(getRpByName(data, a.name)) -
                sortRule.indexOf(getRpByName(data, b.name));
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
          data.soumaP1线处理Nums = playerHandle;
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
    ...Array.from({ length: 4 }, (_, i) => {
      return {
        id: `Souma 绝伊甸 P1 第二次连线判定${i + 1}`,
        type: 'StartsUsing',
        netRegex: { 'id': ['9CCC'] },
        condition: (data) => data.soumaPhase === 'P1',
        delaySeconds: [9, 12, 15, 17][i],
        suppressSeconds: 999,
        response: (data, _matches, output) => {
          output.responseOutputStrings = {
            text: { en: '${num}${attr}${handler}' },
            fire: { en: '火' },
            thunder: { en: '雷' },
            fireHandler: { en: '集合' },
            thunderHandler: { en: '劈叉' },
          };
          const num = i + 1;
          const hand = data.soumaP1线处理Nums.includes(num);
          const type = hand ? 'alarmText' : 'infoText';
          const attrStr = data.soumaP1线存储[num + 1].id === '00F9' ? 'fire' : 'thunder';
          const handler = hand ? output[`${attrStr}Handler`]() : '';
          return {
            [type]: output.text({
              num: num,
              attr: output[attrStr](),
              handler: handler,
            }),
          };
        },
      };
    }),
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
    // #endregion P2
    // #region 花姐
    // #endregion 花姐
  ],
});
