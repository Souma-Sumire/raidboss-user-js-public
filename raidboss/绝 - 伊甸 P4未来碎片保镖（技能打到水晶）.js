let isEmulator = false;
try {
  // 对 node 措施
  isEmulator = /(raidemulator|config)\.html/.test(location.href);
} catch {
  isEmulator = false;
}
const doTextCommand = isEmulator
  ? (text) => console.log(text)
  : (text) => callOverlayHandler({ call: 'PostNamazu', c: 'command', p: text });
const gimmicks = {
  // 已通过模拟器测试
  '9CFE': '光之波動',
  // '9D18': '光之束縛', 必团灭，没有记录的必要
  // '9D17': '過量光', 必团灭，没有记录的必要
  // 已通过模拟器测试
  '9D52': '暗炎噴發',
  // '9D8C': '神聖之翼', 不可能。只有人死光的情况才会出现，并且伤害是0
  // 已通过模拟器测试
  '9D55': '黑暗神聖',
  // 未经过测试
  '9D2E': '天光輪迴',
  // 未经过测试
  '9D4F': '黑暗狂水',
  // 未经过测试
  '9D5C': '真夜舞蹈（遠）',
  // 未经过测试
  '9D5D': '真夜舞蹈（近）',
  // 未经过测试
  '9D6F': '死亡輪迴（蓋婭）',
  // 未经过测试
  '9D38': '死亡輪迴（琳）',
  // 未经过测试
  '9D3A': '無盡頓悟',
  // 未经过测试
  '9D57': '黑暗冰封',
  // 未经过测试
  '9D61': '碎靈一擊',
  // 未经过测试
  '9D31': '聖龍氣息',
  // 未经过测试
  '9D58': '黑暗暴風',
};
// BUFF的分摊，需要按BUFF找，否则如果点名的人死了，嫌疑人会误判为第一个挨揍的
const buffGimmicks = [
  // 黑暗冰封
  '9D57',
  // 黑暗暴風
  '9D58',
  // 黑暗神聖
  '9D55',
  // 暗炎噴發
  '9D52',
  // 黑暗狂水
  '9D4F',
];
const buffConvert = {
  // 黑暗冰封
  '99E': '9D57',
  // 黑暗暴風
  '99F': '9D58',
  // 黑暗神聖
  '996': '9D55',
  // 暗炎噴發
  '99C': '9D52',
  // 黑暗狂水
  '99D': '9D4F',
};
Options.Triggers.push({
  id: 'SoumaEdenUltimateP4CrystalBodyguard',
  zoneId: ZoneId.FuturesRewrittenUltimate,
  zoneLabel: { en: '光暗未来绝境战 P4 未来碎片保镖' },
  config: [
    {
      id: '保镖开关',
      name: { en: '开启保镖' },
      type: 'checkbox',
      default: true,
    },
    {
      id: '保镖聊天频道',
      name: { en: '聊天频道' },
      type: 'select',
      options: { en: { '小队': 'p', '默语': 'e' } },
      default: 'e',
    },
    {
      id: '嫌疑人显示方式',
      name: { en: '嫌疑人显示方式' },
      type: 'select',
      options: {
        en: {
          '职业缩写，例如 黑魔': 'job',
          '职业全名，例如 黑魔法师': 'jobFull',
          '玩家全名，例如 Yoshida Naoki': 'name',
          '玩家昵称，例如 Yoshida': 'nick',
        },
      },
      default: 'job',
    },
  ],
  initData: () => {
    return {
      souma现场证据: [],
      souma战斗时间: 0,
      souma未来碎片ID: undefined,
      souma嫌疑人BUFF追溯组: {},
      souma嫌疑人判定索引组: [],
    };
  },
  triggers: [
    {
      id: 'Souma 伊甸 P4保镖 开始',
      type: 'InCombat',
      netRegex: { inGameCombat: '1', inACTCombat: '1', capture: true },
      run: (data, matches) => {
        data.souma战斗时间 = new Date(matches.timestamp).getTime();
      },
    },
    {
      id: 'Souma 伊甸 P4保镖 未来碎片出现',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '13559', npcBaseId: '17841', capture: true },
      run: (data, matches) => {
        data.souma未来碎片ID = matches.id;
      },
    },
    {
      id: 'Souma 伊甸 P4保镖 BUFF收集',
      type: 'GainsEffect',
      netRegex: { effectId: Object.keys(buffConvert), capture: true },
      condition: (data) => data.triggerSetConfig.保镖开关 === true && data.souma未来碎片ID !== undefined,
      run: (data, matches) => {
        (data.souma嫌疑人BUFF追溯组[buffConvert[matches.effectId]] ??= []).push(matches.target);
      },
    },
    {
      id: 'Souma 伊甸 P4保镖 BUFF消除',
      type: 'LosesEffect',
      netRegex: { effectId: Object.keys(buffConvert), capture: true },
      condition: (data) => data.triggerSetConfig.保镖开关 === true && data.souma未来碎片ID !== undefined,
      delaySeconds: 3,
      run: (data, matches) => {
        const id = buffConvert[matches.effectId];
        data.souma嫌疑人BUFF追溯组[id].splice(data.souma嫌疑人BUFF追溯组[id].indexOf(matches.target), 1);
      },
    },
    {
      id: 'Souma 伊甸 P4保镖 嫌疑人',
      type: 'Ability',
      netRegex: { id: Object.keys(gimmicks), sourceId: '4.{7}', capture: true },
      condition: (data, matches) =>
        data.triggerSetConfig.保镖开关 === true && matches.id in gimmicks &&
        data.souma未来碎片ID !== undefined,
      preRun: (data, matches) => {
        const targetIndex = Number(matches.targetIndex);
        const type = matches.targetId.startsWith('1') ? 'player' : 'crystal';
        if (targetIndex === 0) {
          data.souma嫌疑人判定索引组.push([
            {
              name: matches.target,
              type: type,
              targetIndex: targetIndex,
            },
          ]);
        } else {
          data.souma嫌疑人判定索引组[data.souma嫌疑人判定索引组.length - 1].push({
            name: matches.target,
            type: type,
            targetIndex: targetIndex,
          });
        }
      },
      delaySeconds: 0.5,
      run: (data) => {
        data.souma嫌疑人判定索引组.length = 0;
      },
    },
    {
      id: 'Souma 伊甸 P4保镖 判定',
      comment: {
        en: `<ul><li>由于文本是发送到聊天栏的，必须加载鲶鱼精邮差。</li>
<li>为兼容部分不愿意打中文字体 MOD 的国际服玩家，文本使用繁体中文。</li>
<li>当嫌疑人有多人（比如水波引导）或线索不明（比如天光轮回）时，请自行查看录像找到真凶。</li>
<li>不保证绝对正确（尤其是死人转移buff时），仅供参考。</li></ul>`,
      },
      type: 'Ability',
      netRegex: { type: '22', sourceId: '4.{7}', targetId: '4.{7}', capture: true },
      condition: (data, matches) =>
        data.triggerSetConfig.保镖开关 === true && matches.targetId === data.souma未来碎片ID &&
        matches.flags !== '3' && matches.damage !== '0' &&
        matches.id in gimmicks,
      // delaySeconds: 0.25,
      promise: async (data) => {
        data.souma现场证据 = (await callOverlayHandler({ call: 'getCombatants' })).combatants;
      },
      infoText: (data, matches, output) => {
        const id = matches.id;
        const time = new Date(new Date(matches.timestamp).getTime() - data.souma战斗时间);
        const action = output[matches.id]();
        const group = data.souma嫌疑人判定索引组.find((v) => v.some((v2) => v2.type === 'crystal'));
        const channel = data.triggerSetConfig.保镖聊天频道;
        const playerParam = data.triggerSetConfig.嫌疑人显示方式
          .toString();
        let suspects = [];
        if (
          // 特定buff机制
          buffGimmicks.includes(id) &&
          // 带此buff的人并非全员存活
          ((!data.souma嫌疑人BUFF追溯组[id].every((s) =>
            ((data.souma现场证据.find((c) => c.Name === s)?.CurrentHP) || 0) > 0
          )) ||
            // 或吃到机制的人都没buff
            group.every((g) => data.souma嫌疑人BUFF追溯组[id]?.includes(g.name) === false))
        ) {
          // 此时才按照buff找人
          // 给玩家预防针，防止责任划分错误导致影响队友感情
          // 这部分不确定写的对不对
          doTextCommand(`/${channel} 似乎死人了？此次判斷可能不準確。`);
          suspects = data.souma嫌疑人BUFF追溯组[id];
        } else if (group.at(0)?.type === 'crystal') {
          suspects = [];
        } else {
          suspects = [group.at(0).name];
        }
        const suspect = suspects.length === 0
          ? output.noSuspect()
          : suspects.length === 1
          ? output.oneSuspect({ player: data.party.member(suspects[0])[playerParam] })
          : output.multipleSuspect({
            players: suspects.map((s) => data.party.member(s)[playerParam]).join('、'),
          });
        const txt = output.text({
          MM: time.getMinutes().toString().padStart(2, '0'),
          SS: time.getSeconds().toString().padStart(2, '0'),
          action: action,
          suspect: suspect,
        });
        doTextCommand(`/${channel} ${txt}`);
        data.souma现场证据 = [];
        return null;
      },
      outputStrings: {
        'text': '【速報】伊甸時間${MM}分${SS}秒，未來碎片遭「${action}」襲擊，${suspect}<se.5>',
        'oneSuspect': '${player}宣佈對此次事件負責。',
        'multipleSuspect': '多名嫌疑人（${players}）已被捕，調查仍在進行中。',
        'noSuspect': '綫索不明。',
        ...gimmicks,
      },
    },
  ],
});
