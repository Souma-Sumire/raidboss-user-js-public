Options.Triggers.push({
  id: 'SoumaTheCloudOfDarknessChaotic',
  zoneId: 1241,
  initData: () => {
    return {
      soumaCombatantData: [],
      souma灭暗云P1阴冷: undefined,
      souma灭暗云P1核爆: [],
      souma灭暗云P1储存: undefined,
      souma灭暗云P2小怪: [],
      souma灭暗云P2本组小怪ID: 0,
      souma灭暗云P2本组小怪三连: [],
    };
  },
  triggers: [
    {
      id: '灭暗云 P1 月环刀',
      type: 'StartsUsing',
      netRegex: { id: '9DF[BD]' },
      condition: (data) => data.souma灭暗云P1储存 === undefined,
      infoText: (_data, matches, output) => output[matches.id](),
      outputStrings: {
        '9DFB': '去右上',
        '9DFD': '去左上',
      },
    },
    {
      id: '灭暗云 P1 月环刀延迟',
      type: 'StartsUsing',
      netRegex: { id: '9DF[BD]' },
      condition: (data) => data.souma灭暗云P1储存 !== undefined,
      durationSeconds: 8,
      infoText: (data, matches, output) => {
        return output.text({
          gimmick: output[matches.id](),
          delay: output[data.souma灭暗云P1储存](),
        });
      },
      run: (data) => {
        data.souma灭暗云P1储存 = undefined;
      },
      outputStrings: {
        'text': '${gimmick} => ${delay}',
        '9DFB': '去右上',
        '9DFD': '去左上',
        'death': '吸引',
        'wind': '击退',
      },
    },
    {
      id: '灭暗云 P1 钢铁',
      type: 'StartsUsing',
      netRegex: { id: '9E00' },
      response: Responses.getOut(),
    },
    {
      id: '灭暗云 P1 暗之泛滥',
      type: 'StartsUsing',
      netRegex: { id: '9E3E' },
      response: Responses.aoe(),
    },
    {
      id: '灭暗云 P1 飙风',
      type: 'StartsUsing',
      netRegex: { id: '9E4C' },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '击退' },
    },
    {
      id: '灭暗云 P1 极死',
      type: 'StartsUsing',
      netRegex: { id: '9E43' },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '吸引' },
    },
    {
      id: '灭暗云 P1 石化',
      type: 'StartsUsing',
      netRegex: { id: '9E4F' },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: { text: '背对BOSS与眼睛' },
    },
    {
      id: '灭暗云 P1 附飙风/附极死',
      type: 'StartsUsing',
      netRegex: { id: '9E5[34]' },
      durationSeconds: 6,
      infoText: (data, matches, output) => {
        data.souma灭暗云P1储存 = matches.id === '9E54' ? 'wind' : 'death';
        return output[data.souma灭暗云P1储存]();
      },
      outputStrings: {
        wind: '储存：风',
        death: '储存：吸引',
      },
    },
    {
      id: '灭暗云 P1 暗之大泛滥',
      type: 'StartsUsing',
      netRegex: { id: ['9E3D', '9E01'] },
      response: Responses.bleedAoe(),
    },
    {
      id: '灭暗云 P1 阴冷之拥',
      type: 'Tether',
      netRegex: { id: '012[CD]' },
      condition: (data, matches) => data.me === matches.source,
      infoText: (data, matches, output) => {
        data.souma灭暗云P1阴冷 = matches.id === '012C' ? '后' : '前';
        return output[data.souma灭暗云P1阴冷]();
      },
      outputStrings: {
        前: '储存：前',
        后: '储存：后',
      },
    },
    {
      id: '灭暗云 P1 阴冷之拥 Buff',
      type: 'GainsEffect',
      netRegex: { effectId: '1055' },
      condition: (data, matches) => data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 7,
      durationSeconds: 7,
      alertText: (data, _matches, output) => {
        return output[data.souma灭暗云P1阴冷]();
      },
      outputStrings: {
        前: '出去放手（往前躲）',
        后: '出去放手（往后躲）',
      },
    },
    {
      id: '灭暗云 P1 黑暗神圣',
      type: 'StartsUsing',
      netRegex: { id: 'A12D' },
      delaySeconds: 3,
      durationSeconds: (_data, matches) => parseFloat(matches.castTime) + 3,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '分组分摊',
      },
    },
    {
      id: '灭暗云 P1 连射式波动炮',
      type: 'StartsUsing',
      netRegex: { id: '9E40' },
      // delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '挡枪',
      },
    },
    {
      id: '灭暗云 P1 核爆',
      type: 'HeadMarker',
      netRegex: { id: '015A' },
      preRun: (data, matches) => {
        data.souma灭暗云P1核爆.push(matches.target);
      },
      delaySeconds: 0.5,
      response: (data, _matches, output) => {
        if (data.souma灭暗云P1核爆.length === 0) {
          return;
        }
        // cactbot-builtin-response
        output.responseOutputStrings = {
          awayFromGroup: { en: '远离人群' },
          inGroup: { en: '集合' },
        };
        return data.souma灭暗云P1核爆.includes(data.me)
          ? { alertText: output.awayFromGroup() }
          : { infoText: output.inGroup() };
      },
      run: (data) => data.souma灭暗云P1核爆.length = 0,
    },
    {
      id: '灭暗云 P2 阿托莫斯',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '13626', capture: false },
      durationSeconds: 6,
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
    {
      id: '灭暗云 P2 深暗领域',
      type: 'StartsUsing',
      netRegex: { id: '9E08' },
      response: Responses.bigAoe(),
    },
    {
      id: '灭暗云 P2 小怪读条1',
      type: 'StartsUsing',
      netRegex: { id: ['9E20', '9E23'] },
      preRun: (data, matches) => {
        data.souma灭暗云P2小怪.push({ id: parseInt(matches.sourceId, 16), using: matches.id });
      },
    },
    {
      id: '灭暗云 P2 小怪读条2',
      type: 'StartsUsing',
      netRegex: { id: ['9E20', '9E23'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({ call: 'getCombatants' })).combatants
          .filter((c) => c.Name === data.me || data.souma灭暗云P2小怪.find((e) => e.id === c.ID));
      },
      run: (data) => {
        const you = data.soumaCombatantData.find((c) => c.Name === data.me);
        const addId = data.soumaCombatantData.find((c) =>
          ((c.PosX < 100 && you.PosX < 100) || (c.PosX > 100 && you.PosX > 100)) &&
          c.Name !== data.me
        ).ID;
        const add = data.souma灭暗云P2小怪.find((e) =>
          e.id === addId
        );
        data.souma灭暗云P2小怪.length = 0;
        data.soumaCombatantData = [];
        data.souma灭暗云P2本组小怪ID = add.id;
      },
    },
    {
      id: '灭暗云 P2 小怪读条3',
      type: 'HeadMarker',
      netRegex: {
        id: [
          '00EF',
          '00F0',
          '00F1',
          '00F2',
        ],
      },
      condition: (data, matches) => data.souma灭暗云P2本组小怪ID === parseInt(matches.targetId, 16),
      infoText: (data, matches, output) => {
        data.souma灭暗云P2本组小怪三连.push(output[matches.id]());
        return output[matches.id]();
      },
      outputStrings: {
        '00EF': '右',
        '00F0': '左',
        '00F1': '摊',
        '00F2': '散',
      },
    },
    {
      id: '灭暗云 P2 小怪读条4',
      type: 'HeadMarker',
      netRegex: {
        id: [
          '00EF',
          '00F0',
          '00F1',
          '00F2',
        ],
        capture: false,
      },
      delaySeconds: 1,
      durationSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.souma灭暗云P2本组小怪三连.length < 3) {
          return;
        }
        const res = output.text({
          t1: data.souma灭暗云P2本组小怪三连[0],
          t2: data.souma灭暗云P2本组小怪三连[1],
          t3: data.souma灭暗云P2本组小怪三连[2],
        });
        data.souma灭暗云P2本组小怪三连.length = 0;
        data.souma灭暗云P2本组小怪ID = 0;
        return res;
      },
      outputStrings: { text: '${t1}${t2}${t3}' },
    },
    {
      id: '灭暗云 P2 月环',
      type: 'StartsUsing',
      netRegex: { id: '9E0B' },
      durationSeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '月环靠近',
      },
    },
    {
      id: '灭暗云 P2 十字',
      type: 'StartsUsing',
      netRegex: { id: '9E09' },
      durationSeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '去斜点',
      },
    },
    {
      id: '灭暗云 P2 诅咒',
      type: 'GainsEffect',
      netRegex: { effectId: '953' },
      condition: (data, matches) => data.me === matches.target,
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 4,
      durationSeconds: 4,
      alarmText: (_data, _matches, output) => output.lookAway(),
      outputStrings: { lookAway: { en: '面向场外' } },
    },
    {
      id: '灭暗云 P2 种子弹',
      type: 'StartsUsing',
      netRegex: { id: '9E2A' },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '种子弹',
      },
    },
    {
      id: '灭暗云 P2 种子弹点名',
      type: 'HeadMarker',
      // 吉田的仁慈？这次并没有每次进本点名id不同的设定
      netRegex: { id: '0227' },
      condition: (data, matches) => data.me === matches.target,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '放种子',
      },
    },
    {
      id: '灭暗云 P2 荆棘之蔓',
      type: 'StartsUsing',
      netRegex: { id: '9E2C' },
      durationSeconds: (_data, matches) => parseFloat(matches.castTime),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => {
        return output.text();
      },
      outputStrings: {
        text: '荆棘引导',
      },
    },
    {
      id: '灭暗云 P2 黑暗泛滥',
      type: 'StartsUsing',
      netRegex: { id: '9E37' },
      condition: (data) => data.CanSilence(),
      suppressSeconds: 1,
      response: Responses.interrupt(),
    },
    {
      id: '灭暗云 P2 荆棘拉线',
      type: 'Tether',
      netRegex: { id: '0012' },
      condition: Conditions.targetIsYou(),
      response: Responses.breakChains(),
    },
    {
      id: '灭暗云 P2 分散式激光炮',
      type: 'StartsUsing',
      netRegex: { id: '9E10' },
      durationSeconds: (_data, matches) => parseFloat(matches.castTime),
      response: Responses.spread('alert'),
    },
    {
      id: '灭暗云 P2 凝缩式波动炮',
      type: 'StartsUsing',
      netRegex: { id: '9E0D' },
      durationSeconds: (_data, matches) => parseFloat(matches.castTime),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '挡枪',
      },
    },
    {
      id: '灭暗云 内外场',
      type: 'GainsEffect',
      netRegex: { effectId: ['1051', '1052'] },
      condition: (data, matches) => data.me === matches.target,
      run: (data, matches) => {
        data.souma灭暗云内外场 = matches.effectId === '1051' ? '内' : '外';
      },
    },
    {
      id: '灭暗云 P2 跳跃波动炮1',
      type: 'StartsUsing',
      netRegex: { id: ['9E2F', '9E30'] },
      condition: (data) => data.souma灭暗云内外场 === '外',
      suppressSeconds: 1,
      promise: async (data) => {
        data.soumaCombatantData = (await callOverlayHandler({ call: 'getCombatants' })).combatants
          .filter((c) => c.Name === data.me);
      },
    },
    {
      id: '灭暗云 P2 跳跃波动炮2',
      type: 'StartsUsing',
      netRegex: { id: ['9E2F', '9E30'] },
      condition: (data) => data.souma灭暗云内外场 === '外',
      delaySeconds: 1,
      alertText: (data, matches, output) => {
        const player = data.soumaCombatantData[0];
        const palyerSide = player.PosX < 100 ? 'left' : 'right';
        const casterSide = parseFloat(matches.x) < 100 ? 'left' : 'right';
        if (palyerSide === casterSide) {
          return output[matches.id]();
        }
      },
      outputStrings: {
        '9E2F': '两侧 => 中间',
        '9E30': '中间 => 两侧',
      },
    },
    {
      id: '灭暗云 P2 跳跃波动炮3',
      type: 'StartsUsing',
      netRegex: { id: ['9E2F', '9E30'], capture: false },
      condition: (data) => data.souma灭暗云内外场 === '外',
      delaySeconds: 3,
      suppressSeconds: 1,
      run: (data) => data.soumaCombatantData.length = 0,
    },
    {
      id: '灭暗云 P2 旋回式波动炮',
      type: 'StartsUsing',
      netRegex: { id: ['9E13', '9E15'] },
      delaySeconds: (data) => data.souma灭暗云内外场 === '内' ? 0 : 10,
      suppressSeconds: 1,
      infoText: (_data, matches, output) => {
        return output[matches.id]();
      },
      outputStrings: {
        '9E13': '<= 顺',
        '9E15': '逆 =>',
      },
    },
    {
      id: '灭暗云 P2 死刑',
      type: 'StartsUsing',
      netRegex: { id: '9E36' },
      response: Responses.tankBuster(),
    },
  ],
});
