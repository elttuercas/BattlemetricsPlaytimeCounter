function addPlayerDataElement(typeOfElement, content, addElementTo) {
    var newElement = document.createElement(typeOfElement);
    newElement.className = "bm-plus";
    newElement.appendChild(document.createTextNode(content));
    addElementTo.appendChild(newElement);
    return addElementTo.lastChild;
}


function addGameBanCheck(playerData) {
    addPlayerDataElement("dt", "Rust Game Ban", playerData);
    var EACChecker = document.createElement("a");

    EACChecker.innerText = "Click to check";
    EACChecker.href = "https://www.nexusonline.co.uk/bans/profile/?id=" + steamID;
    EACChecker.target = "_blank";
    EACChecker.className = "bm-plus";

    var gameBanChecker = document.createElement("dd");
    gameBanChecker.appendChild(EACChecker);
    playerData.appendChild(gameBanChecker);
}


function setPlayerData(battlemetricsID, serversPlayedElm, playtimeElm, aimTrainPlaytimeElm) {
    fetch("https://api.battlemetrics.com/players/" + battlemetricsID + "?include=server&fields[server]=name").then(response => response.json()).then(function (response) {
        var rustServers = getRustServers(response);
        serversPlayedElm.innerText = rustServers.length;
        playtimeElm.innerText = getTotalPlaytime(rustServers);
        aimTrainPlaytimeElm.innerText = getAimTrainPlaytime(rustServers);
    }).catch(function (err) {
        console.warn("Rust BM+: API call resolved in an error", err);
        serversPlayedElm.innerText = "Error";
        playtimeElm.innerText = "Error";
        aimTrainPlaytimeElm.innerText = "Error";
    });
}


function removeBPPlusElements() {
    const elements = document.getElementsByClassName("bm-plus");
    while (elements.length > 0) elements[0].remove();
}


function main() {
    waitUntilElementExists("#RCONPlayerPage").then(function(result) {
        removeBPPlusElements();
        steamInformationTab = document.getElementById("RCONPlayerPage").childNodes[1].childNodes[0].childNodes[1];
        playerData = steamInformationTab.childNodes[1].childNodes[0];
        steamID = playerData.children[1].children[0].getAttribute("href").match("[0-9]+$")[0];

        addGameBanCheck(playerData);
        addPlayerDataElement("dt", "Rust servers played", playerData);
        var serversPlayedElm = addPlayerDataElement("dd", "Loading...", playerData);
        addPlayerDataElement("dt", "Rust BM playtime", playerData);
        var playtimeElm = addPlayerDataElement("dd", "Loading...", playerData);
        addPlayerDataElement("dt", "Aim train playtime", playerData);
        var aimTrainPlaytimeElm = addPlayerDataElement("dd", "Loading...", playerData);
    
        setPlayerData(getCurrentBMUserID(), serversPlayedElm, playtimeElm, aimTrainPlaytimeElm);
    }).catch(function (err) {
        console.warn("Rust BM+: No Steam Information loaded to inject data into", err);
    });
}


var pageUrl = window.location.href;

function runIfOnRconPage() {
    if (pageUrl != window.location.href) {
        if (window.location.href.match("players\/[0-9]+\/*$") != null) {
            main();
        }
        pageUrl = window.location.href;
    } 
}

var t=setInterval(runIfOnRconPage,100);
main();
