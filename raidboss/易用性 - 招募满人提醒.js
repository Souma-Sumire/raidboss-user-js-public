if (new URLSearchParams(location.search).get("alerts") !== "0" &&
    /(?:raidemulator|raidboss)\.html/.test(location.href)) {

        let isGameInactive = true; //
        const ALERT_TEXT = "人齐了！";
        const RECRUIT_DONE_REGEX = /^.{14} ChatLog 00:0039::(?:招募队员结束，队员已经集齐。|Party recruitment ended\. All places have been filled\.|パーティ募集の人数を満たしたため終了します。)/;

        function say(text = ALERT_TEXT) {
            callOverlayHandler({
                call: "cactbotSay",
                text: text
            });
        }

        function startAlertLoop() {
            say();
            const interval = setInterval(() => {
                if (!isGameInactive) {
                    clearInterval(interval);
                } else {
                    say();
                }
            }, 1500);
        }

        addOverlayListener("onGameActiveChangedEvent", (data) => {

            isGameInactive = !(data?.detail?.active ?? true);
        });

        addOverlayListener("onLogEvent", (data) => {
            const logs = data.detail.logs;
            for (const line of logs) {
                if (RECRUIT_DONE_REGEX.test(line)) {
                    startAlertLoop();
                }
            }
        });
}
