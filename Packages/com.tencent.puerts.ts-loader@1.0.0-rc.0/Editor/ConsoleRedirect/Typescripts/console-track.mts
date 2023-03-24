const ENABLE_HYPERLINK = true;

function getTrack() {
    //捕获当前输出的堆栈信息(前三行为此处代码调用的堆栈, 去除后输出)
    let trackInfos = new Error().stack?.replace(/\r\n/g, "\n").split("\n").slice(3);
    if (trackInfos && trackInfos.length > 0) {
        if (ENABLE_HYPERLINK) {
            //1.匹配函数名(可选)    /**([a-zA-z0-9#$._ ]+ \()? */
            //2.匹配文件路径        /**([^\n\r\*\"\|\<\>]+(.js|.cjs|.mjs|.ts|.mts))\:([0-9]+)\:([0-9]+) */
            let regex = /at ([a-zA-z0-9#$._ ]+ \()?([^\n\r\*\"\|\<\>]+(.js|.cjs|.mjs|.ts|.mts))\:([0-9]+)\:([0-9]+)\)?/g;

            for (let i = 0; i < trackInfos.length; i++) {
                regex.lastIndex = 0;

                let match = regex.exec(trackInfos[i]);
                if (!match)
                    continue;

                let path = match[2], line = match[4] ?? "0", column = match[5] ?? "0";
                let search = `${path}:${line}:${column}`;

                trackInfos[i] = trackInfos[i].replace(search, `<a href="${path.replace(/\\/g, "/")}" line="${line}" column="${column}">${search}</a>`);
            }
        }
        return trackInfos.join("\n");
    }
    return "";
};
const log = console.log, info = console.info, warn = console.warn, error = console.error;
console.log = function (...args) {
    log(...args, "\n" + getTrack());
};
console.info = function (...args) {
    info(...args, "\n" + getTrack());
};
console.warn = function (...args) {
    warn(...args, "\n" + getTrack());
};
console.error = function (...args) {
    error(...args, "\n" + getTrack());
};

// 捕获普通异常
puer.on('uncaughtException', function (err: Error) {
    let output = "";
    output += "==== EXCEPTION START ===========================================================";
    output += "\nType: uncaughtException Caught exception";
    output += "\nERROR: " + err;
    output += "\n==== EXCEPTION END   ===========================================================";

    CS.UnityEngine.Debug.LogError(output);
});
// 捕获async异常
puer.on('unhandledRejection', (reason: Error) => {
    let output = "";
    output += "==== REJECT START ==============================================================";
    output += "\nType: Caught Unhandled Rejection";
    output += "\nMessage: " + reason?.message;
    output += "\n" + reason?.stack;
    output += "\n==== REJECT END   ==============================================================";

    CS.UnityEngine.Debug.LogError(output);
});
