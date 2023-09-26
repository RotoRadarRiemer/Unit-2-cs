// DOM Elements
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Configuration
const cohortName = '2302-ACC-PT-WEB-PT-B';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/`;

// Fetch all players
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

const removePlayerDOM = (playerId) => {
    const cardToRemove = document.querySelector(`[id="player-details-${playerId}"]`).parentElement;
    cardToRemove.remove();
};

const removePlayerAPI = async (playerId) => {
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

const displayPlayerDetails = async (playerId) => {
    const detailsSection = document.getElementById(`player-details-${playerId}`);
    const detailsButton = detailsSection.querySelector('.details-button');

    // Hide or show existing content
    if(detailsSection.querySelector('.details-content')) {
        const detailsContent = detailsSection.querySelector('.details-content');
        if(detailsContent.style.display === 'none') {
            detailsContent.style.display = 'block';
            detailsButton.textContent = 'Hide details';
        } else {
            detailsContent.style.display = 'none';
            detailsButton.textContent = 'See details';
        }
        return;
    }

    const response = await fetchSinglePlayer(playerId);
    
    // Access the inner player object
    const player = response.player;
    
    // Log to ensure we have the correct data now
    console.log("Fetched inner player data:", player);
    
    if (player) {
        const detailsHTML = `
            <div class="details-content">
                <strong>Details:</strong>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
            </div>
        `;
        
        detailsSection.insertAdjacentHTML('afterbegin', detailsHTML);
        detailsButton.textContent = 'Hide details';
    }
};




const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach(player => {
            playerContainerHTML += `
                <div class="player-card">
                    <img src="${player.imageUrl}" alt="${player.name}">
                    <h2>${player.name}</h2>
                    <div id="player-details-${player.id}" class="player-details">
                        <button class="details-button" onclick="displayPlayerDetails(${player.id})">See details</button>
                        <button onclick="removePlayerDOM(${player.id}); removePlayerAPI(${player.id});">Remove from roster</button>
                    </div>
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