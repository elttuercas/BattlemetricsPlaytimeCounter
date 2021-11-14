/**
 * After making a call to the API to get the server data for a player, this function implements all the logic to parse
 * and build the HTML representation of the received data.
 *
 * @this XMLHttpRequest
 */
function handleApiResp()
{
    // Convert response data to JSON object.
    let json = JSON.parse(this.responseText);

    // Filter JSON data to get an array of Rust servers only.
    /** @var {Array} */
    let rgRustServers = json['included'].filter((obj) => obj.relationships.game.data.id === 'rust');
    /** @var {Number} */
    let iTimePlayed = rgRustServers.reduce((pVal, cEl) => pVal + cEl.meta.timePlayed, 0);
    /** @var {Number} */
    let iAimTrainTimePlayed = rgRustServers.reduce((pVal, cEl) => pVal + (cEl.attributes.name.toLowerCase().match(/ukn|aim/) ? cEl.meta.timePlayed : 0), 0);

    /*
     * Here's how this works. All the player data is contained within a div with ID "PlayerPage". This div contains
     * other divs, the first of which contains the details, flags and notes information for a total of three divs.
     * Since we want to append the calculated data to the details div and that is the first div, we target the first child.
     *
     * Within the details div there is a definition list to which we want to append some more details and that is the
     * targeted element.
     */
    let elPlayerDataNotes = document.querySelector('#PlayerPage .row div:nth-child(1) dl');

    // Servers played.
    let dtServersPlayed = document.createElement('dt');
    let ddServersPlayed = document.createElement('dd');
    dtServersPlayed.innerText = 'Rust Servers Played';
    ddServersPlayed.innerText = String(rgRustServers.length);

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

    elPlayerDataNotes.append(dtServersPlayed, ddServersPlayed, dtHoursPlayed, ddHoursPlayed, dtAimTrainHoursPlayed, ddAimTrainHoursPlayed);
}

/**
 * Extension entrypoint.
 */
function main()
{
    // Check the current location to be a BM' player profile.
    if (window.location.href.match(/players\/([0-9]+)\/*/) === null)
    {
        return;
    }

    // Obtain BM player ID.
    let strPlayerId = window.location.href.match(/players\/([0-9]+)\/*/)[1];

    // Get data about the Rust servers the player has been in.
    let xhr = new XMLHttpRequest();
    xhr.open('GET', new URL(`/players/${strPlayerId}?include=server&fields[server]=name`, 'https://api.battlemetrics.com'), true);
    xhr.addEventListener('load', handleApiResp);
    xhr.send();
}

main();
