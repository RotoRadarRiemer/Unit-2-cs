const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2302-ACC-PT-WEB-PT-B';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}${playerId}`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data.data;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data.data;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}${playerId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data.data;
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach(player => {
            playerContainerHTML += `
                <div class="player-card">
                    <h2>${player.name}</h2>
                    <p>Breed: ${player.breed}</p>
                    <p>Status: ${player.status}</p>
                    <img src="${player.imageUrl}" alt="${player.name}">
                    <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                    <button onclick="removePlayer(${player.id})">Remove from roster</button>
                </div>
            `;
        });
        playerContainer.innerHTML = playerContainerHTML;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <form id="addPlayerForm">
                <label for="name">Name:</label>
                <input type="text" id="name" required>
                
                <label for="breed">Breed:</label>
                <input type="text" id="breed" required>
                
                <label for="status">Status:</label>
                <select id="status">
                    <option value="field">Field</option>
                    <option value="bench">Bench</option>
                </select>
                
                <label for="imageUrl">Image URL:</label>
                <input type="url" id="imageUrl" required>
                
                <input type="submit" value="Add Player">
            </form>
        `;

        newPlayerFormContainer.innerHTML = formHTML;

        document.getElementById('addPlayerForm').addEventListener('submit', async (event) => {
            event.preventDefault();

            const newPlayer = {
                name: event.target.name.value,
                breed: event.target.breed.value,
                status: event.target.status.value,
                imageUrl: event.target.imageUrl.value,
            };

            const addedPlayer = await addNewPlayer(newPlayer);
            if (addedPlayer) {
                const players = await fetchAllPlayers();
                renderAllPlayers(players);
            }
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
}

init();