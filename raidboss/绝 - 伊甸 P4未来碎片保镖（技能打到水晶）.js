const doTextCommand = /(raidemulator|config)\.html/.test(location.href) ?
  (text) => console.log(text) :
  (text) => callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: text });

const addCombatantTimeStamp = 615598;
Options.Triggers.push({
  id: 'SoumaEdenUltimateP4CrystalBodyguard',
  zoneId: ZoneId.FuturesRewrittenUltimate,
  zoneLabel: { en: '光暗未来绝境战 P4 未来碎片保镖' },
  config: [
    {
      id: '保镖开关',
      name: { en: '开启' },
      type: 'checkbox',
      default: true,
    },
    {
      id: '保镖聊天频道',
      name: { en: '聊天频道' },
      type: 'select',
      options: { en: { 小队: 'p', 默语: 'e' } },
      default: 'e',
    },
  ],
  initData: () => {
    return {
      souma战斗时间: 0,
      souma未来碎片ID: undefined,
    };
  },
  triggers: [
    {
      id: 'Souma 伊甸 P4 未来碎片出现',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '13559', npcBaseId: '17841' },
      run: (data, matches) => {
        data.souma未来碎片ID = matches.id;
        data.souma战斗时间 = new Date(matches.timestamp).getTime() - addCombatantTimeStamp;
      },
    },
    {
      id: 'Souma 伊甸 P4 未来碎片保镖',
      type: 'Ability',
      netRegex: { sourceId: '4.{7}', targetId: '4.{7}' },
      condition: (data, matches) =>
        matches.targetId === data.souma未来碎片ID && matches.flags !== '3' && matches.damage !== '0' &&
        data.triggerSetConfig.保镖开关 === true,
      infoText: '',
      run: (data, matches, output) => {
        const time = new Date(new Date(matches.timestamp).getTime() - data.souma战斗时间);
        const action = output[matches.id]();
        const txt = output.text({
          MM: time.getMinutes().toString().padStart(2, '0'),
          SS: time.getSeconds().toString().padStart(2, '0'),
          action: action === '???'
            ? output.unknown({ id: matches.id, ability: matches.ability })
            : action,
        });
        doTextCommand(`/${data.triggerSetConfig.保镖聊天频道} ${txt}`);
      },
      outputStrings: {
        'text': '[${MM}:${SS}] 未來碎片被 ${action} 打到了<se.5>',
        '9CFE': '光之波動',
        '9D18': '光之束縛',
        '9D17': '過量光',
        '9D52': '暗炎噴發',
        '9D8C': '神聖之翼',
        '9D55': '黑暗神聖',
        '9D2E': '天光輪迴',
        '9D4F': '黑暗狂水',
        '9D5C': '真夜舞蹈（遠）',
        '9D5D': '真夜舞蹈（近）',
        '9D6F': '死亡輪迴（蓋婭）',
        '9D38': '死亡輪迴（琳）',
        '9D3A': '無盡頓悟',
        '9D57': '黑暗冰封',
        '9D61': '碎靈一擊',
        '9D31': '聖龍氣息',
        '9D58': '黑暗暴風',
        'unknown': '${ability}(${id})',
      },
    },
  ],
});
