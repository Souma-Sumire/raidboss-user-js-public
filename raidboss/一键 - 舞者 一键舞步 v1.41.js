//编号1 编号2：将指定技能设置到编号1热键栏的编号2位置上。
const hotbar = {
  standard: [2, 1], //标准舞步
  technical: [2, 2], //技巧舞步
};
const lang = "cn"; // 中=cn 日=ja 英=en
const countdownDancingStart = true; // 倒计时15秒小舞 true=开, false=关
const countdownDancingEnd = true; // 倒计时0秒小舞 true=开, false=关

//从这里以下的所有东西一般人不需要动

if (new URLSearchParams(location.search).get("alerts") !== "0" && /raidboss\.html/.test(location.href)) {
  console.log("一键舞步已加载 2023.2.8");
  let lastStep = -1;
  let playerID = "";
  const step = {
    cn: ["瀑泻", "喷泉", "逆瀑泻", "坠喷泉"],
    en: ["Cascade", "Fountain", "Reverse Cascade", "Fountainfall"],
    ja: ["カスケード", "ファウンテン", "リバースカスケー", "ファウンテンフォール"],
  };
  const ending = {
    cn: { standard: "标准舞步", technical: "技巧舞步" },
    en: { standard: "Standard Step", technical: "Technical Step" },
    ja: { standard: "スタンダードステップ", technical: "テクニカルステップ" },
  };
  const postNamazu = (v) => callOverlayHandler({ call: "PostNamazu", c: "DoTextCommand", p: v });
  let re = null;
  let countdownTimer1 = null;
  let countdownTimer2 = null;
  let playerJob = "";
  let cancelDanceReg = new RegExp();
  const wipeReg = /^.{14} \w+ 21:.{8}:4000000F/;
  const countdownReg =
    /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:距离战斗开始还有|Battle commencing in |戦闘開始まで)(?<cd>\d+)[^（]+（/i;
  const cancelCountdownReg =
    /^.{14} ChatLog 00:(?:00B9|0[12]39)::(?:.+取消了战斗开始倒计时。|Countdown canceled by .+\.|.+により、戦闘開始カウントがキャンセルされました。)$/i;
  function handlePlayerChangedEvent(e) {
    playerJob = e.detail.job;
    if (playerJob === "DNC") {
      let curStep = e.detail.jobDetail.currentStep;
      let needsSteps = e.detail.jobDetail.steps;
      if (playerID !== e.detail.name) {
        playerID = e.detail.id;
        cancelDanceReg = new RegExp(`^.{14} StatusRemove 1E:71[AB]:[^:]+:0.00:${playerID.toString(16).toUpperCase()}:`);
      }
      if (curStep === lastStep) return;
      if (needsSteps.length && curStep < needsSteps.length) {
        let dance = needsSteps.length === 2 ? "standard" : "technical";
        postNamazu(
          `/hotbar set ${
            step[lang][["Emboite", "Entrechat", "Jete", "Pirouette"].indexOf(needsSteps[curStep])]
          } ${hotbar[dance].join(" ")}`,
        );
      } else if (curStep && curStep === needsSteps.length) {
        resetHotbat(needsSteps.length === 2, needsSteps.length === 4);
      }
      if (needsSteps.length) lastStep = curStep;
    }
  }

  function handleOnLogEvent(e) {
    if (playerJob === "DNC") {
      for (const log of e.detail.logs)
        if (cancelDanceReg.test(log)) resetHotbat();
        else if (wipeReg.test(log)) resetHotbat();
        else if ((re = log.match(countdownReg))) {
          if (re.groups.cd && re.groups.cd >= 5) {
            resetHotbat();
            clearTimeout(countdownTimer1);
            clearTimeout(countdownTimer2);
            countdownTimer1 = setTimeout(() => {
              if (countdownDancingStart) postNamazu(`/ac ${ending[lang].standard}`);
              if (countdownDancingEnd) {
                countdownTimer2 = setTimeout(() => {
                  postNamazu(`/ac ${ending[lang].standard}`);
                }, 15000 - 250);
              }
            }, re.groups.cd * 1000 - 15000 - 50);
          }
        } else if ((re = log.match(cancelCountdownReg))) {
          clearTimeout(countdownTimer1);
          clearTimeout(countdownTimer2);
          resetHotbat();
        }
    }
  }

  function resetHotbat(standard = true, technical = true) {
    if (playerJob === "DNC") {
      if (standard) postNamazu(`/hotbar set ${ending[lang].standard} ${hotbar.standard.join(" ")}`);
      if (technical) postNamazu(`/hotbar set ${ending[lang].technical} ${hotbar.technical.join(" ")}`);
      lastStep = -1;
    }
  }

  addOverlayListener("onPlayerChangedEvent", handlePlayerChangedEvent);
  addOverlayListener("onPlayerDied", () => resetHotbat(true, true));
  addOverlayListener("onLogEvent", handleOnLogEvent);
}
