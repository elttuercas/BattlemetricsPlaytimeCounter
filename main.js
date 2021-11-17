/**
 * After making a call to the API to get the server data for a player, this function implements all the logic to parse
 * and build the HTML representation of the received data.
 *
 * @this XMLHttpRequest
 * @param {Element} targetElement
 */
function handleApiResponse(targetElement)
{
    let json = JSON.parse(this.responseText);
    let iRustServers = 0, iTimePlayed = 0, iAimTrainTimePlayed = 0;

    // Get all the relevant server data with one iteration only.
    json.included.forEach(
        function (obj)
        {
            if (obj.relationships.game.data.id === 'rust')
            {
                ++iRustServers;
                iTimePlayed += obj.meta.timePlayed;
                if (obj.attributes.name.toLowerCase().match(/ukn|aim/) !== null)
                {
                    iAimTrainTimePlayed += obj.meta.timePlayed;
                }
            }
        }
    );

    /*
     * Create the HTML elements to insert all of this data.
     * Servers played.
     */
    let dtServersPlayed = document.createElement('dt');
    let ddServersPlayed = document.createElement('dd');
    dtServersPlayed.innerText = 'Rust Servers Played';
    ddServersPlayed.innerText = String(iRustServers);

    // Hours played.
    let dtHoursPlayed = document.createElement('dt');
    let ddHoursPlayed = document.createElement('dd');
    dtHoursPlayed.innerText = 'Rust BM Playtime';
    ddHoursPlayed.innerText = String(Math.round((iTimePlayed / 3600 + Number.EPSILON) * 100) / 100) + ' hours';

    // Aim train hours played.
    let dtAimTrainHoursPlayed = document.createElement('dt');
    let ddAimTrainHoursPlayed = document.createElement('dd');
    dtAimTrainHoursPlayed.innerText = 'Aim Train Playtime';
    ddAimTrainHoursPlayed.innerText = String(Math.round((iAimTrainTimePlayed / 3600 + Number.EPSILON) * 100) / 100) + ' hours';

    targetElement.append(dtServersPlayed, ddServersPlayed, dtHoursPlayed, ddHoursPlayed, dtAimTrainHoursPlayed, ddAimTrainHoursPlayed);
}

/**
 * Extension entrypoint.
 */
function main()
{
    let rgRegExMatches;

    // Check the extension should run.
    if ((rgRegExMatches = window.location.href.match(/https?:\/\/(www.)?battlemetrics.com\/rcon\/players\/([0-9]+)\/*/)) === null)
    {
        return;
    }
    let strPlayerId = rgRegExMatches[1];

    // Remove any elements associated with this extension.
    document.querySelectorAll('.bm-plus').forEach((el) => el.remove());

    // Find the element we want to add more data to.
    let elTarget = document.querySelector('div.col-md-6:first-child > div:nth-child(2) dl');
    if ((rgRegExMatches = elTarget.querySelector('a').href.match(/(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/([a-zA-Z0-9]+)/)) === null)
    {
        console.error('Error getting Steam ID from page');
        return;
    }

    let strSteamId = rgRegExMatches[1];

    // Add a link to check whether the player has been game banned.
    let dtGameBanLink = document.createElement('dt');
    let ddGameBanLink = document.createElement('dd');
    let aGameBanLink = document.createElement('a');
    aGameBanLink.innerText = 'Check Game Ban';
    aGameBanLink.href = `https://www.nexusonline.co.uk/bans/profile/?id=${strSteamId}`;
    aGameBanLink.target = '_blank';
    aGameBanLink.classList.add('bm-plus');
    ddGameBanLink.appendChild(aGameBanLink);
    elTarget.append(dtGameBanLink, ddGameBanLink);

    // Send the request to the BM API to get server information.
    let xhr = new XMLHttpRequest();
    xhr.open('GET', new URL(`/players/${strPlayerId}?include=server&fields[server]=name`, 'https://api.battlemetrics.com'), true);
    xhr.addEventListener('load', handleApiResponse.bind(xhr, elTarget));
    xhr.send();
}

// Only start running the extension once the document has been loaded.
document.onload = main;
