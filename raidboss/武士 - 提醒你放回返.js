if (new URLSearchParams(location.search).get("alerts") !== "0" && !/raidboss_timeline_only/.test(location.href)) {
    const castingIds = [
        '1D40', // 天下五剑
        '9065', // 天道五剑
        '1D3F', // 纷乱雪月花
        '9066', // 天道雪月花
    ]
    const TSUBAME_GAESHI_ID = 'F0C' // 回返预备
    let soumaSamTsubameGaeshiReady = false
    Options.Triggers.push({
        zoneId: ZoneId.MatchAll,
        id: "souma_sam_tsubame_gaeshi_ready",
        triggers: [
            {
                id: 'souma sam tsubame gaeshi ready gains',
                type: "GainsEffect",
                netRegex: { effectId: TSUBAME_GAESHI_ID },
                condition: (data, matches) => data.me == matches.target,
                run: () => soumaSamTsubameGaeshiReady = true
            },
            {
                id: "souma sam tsubame gaeshi",
                type: "StartsUsing",
                netRegex: { id: castingIds },
                condition: (data, matches) => soumaSamTsubameGaeshiReady && data.me == matches.source,
                tts: (_data, _matches, output) => output.text(),
                outputStrings: { text: { en: '接回返!' } }
            },
            {
                id: "souma sam tsubame gaeshi ready losts",
                type: "LosesEffect",
                netRegex: { effectId: TSUBAME_GAESHI_ID },
                delaySeconds: 0.5,
                condition: (data, matches) => data.me == matches.target,
                run: () => soumaSamTsubameGaeshiReady = false
            },
        ],
    });
}
