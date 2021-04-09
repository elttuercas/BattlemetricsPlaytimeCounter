function getCurrentBMUserID() {
    currentUrl = window.location.href;
    return currentUrl.match("players\/[0-9]+\/*")[0].replace("players/", "");
}


const waitUntilElementExists = (DOMSelector, MAX_TIME = 10000) => {
    let timeout = 0;

    const waitForContainerElement = (resolve, reject) => {
        const container = document.querySelector(DOMSelector);
        timeout += 30;
        if (timeout >= MAX_TIME) reject("Rust BM+: Element not found");
        if (!container || container.length === 0) {
            setTimeout(waitForContainerElement.bind(this, resolve, reject), 30);
        } else {
            resolve(container);
        }
    };

    return new Promise((resolve, reject) => {
        waitForContainerElement(resolve, reject);
    });
};


function getRustServers(playerData) {
    var rustServers = [];
    for (const server of playerData["included"]) {
        if (server["relationships"]["game"]["data"]["id"] == "rust") {
            rustServers.push(server)
        }
    }
    return rustServers;
}


function convertSecondsToHours(timeInSeconds) {
    return Math.floor(timeInSeconds / 3600) + " hours"
}


function getTotalPlaytime(servers) {
    var totalPlaytime = 0;
    for (const server of servers) {
        totalPlaytime = totalPlaytime + server["meta"]["timePlayed"];
    }
    return convertSecondsToHours(totalPlaytime);
}


function getAimTrainPlaytime(servers) {
    var aimTrainPlaytime = 0;
    for (const server of servers) {
        serverName = server["attributes"]["name"].toLowerCase();
        if (serverName.includes("ukn") || serverName.includes("aim")) {
            aimTrainPlaytime = aimTrainPlaytime + server["meta"]["timePlayed"];
        }
    }
    return convertSecondsToHours(aimTrainPlaytime);
}