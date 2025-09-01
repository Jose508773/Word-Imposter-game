class WordImposterGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.imposterIndex = -1;
        this.words = [
            'Pizza', 'Soccer', 'Coffee', 'Beach', 'Music', 'Books', 'Movies', 'Travel', 'Food',
            'Sports', 'Art', 'Nature', 'Technology', 'Friends', 'Family', 'Work', 'School',
            'Holiday', 'Party', 'Shopping', 'Cooking', 'Gaming', 'Exercise', 'Sleep', 'Dreams',
            'Love', 'Happiness', 'Success', 'Freedom', 'Peace', 'Adventure', 'Discovery',
            'Learning', 'Growth', 'Change', 'Hope', 'Faith', 'Money', 'Time', 'Home',
            'Car', 'Phone', 'Computer', 'Internet', 'Television', 'Radio', 'Newspaper',
            'Magazine', 'Restaurant', 'Hotel', 'Airport', 'Train', 'Bus', 'Bicycle',
            'Walking', 'Running', 'Swimming', 'Dancing', 'Singing', 'Painting', 'Writing',
            'Reading', 'Studying', 'Teaching', 'Learning', 'Playing', 'Working', 'Sleeping',
            'Eating', 'Drinking', 'Cooking', 'Cleaning', 'Shopping', 'Traveling', 'Meeting',
            'Talking', 'Listening', 'Watching', 'Thinking', 'Planning', 'Organizing'
        ];
        this.imposterWords = [
            'Pasta', 'Football', 'Tea', 'Mountain', 'Dance', 'Magazines', 'TV Shows', 'Staycation',
            'Drinks', 'Games', 'Crafts', 'City', 'Science', 'Acquaintances', 'Pets', 'Hobby',
            'Vacation', 'Celebration', 'Browsing', 'Baking', 'Reading', 'Rest', 'Awake',
            'Nightmares', 'Hate', 'Sadness', 'Failure', 'Prison', 'War', 'Boredom', 'Stagnation',
            'Teaching', 'Shrinking', 'Despair', 'Doubt', 'Debt', 'Waste', 'Away', 'Enemy',
            'Stranger', 'Foe', 'Rival', 'Competitor', 'Opponent', 'Adversary', 'Challenger',
            'Contender', 'Contestant', 'Player', 'Participant', 'Member', 'Guest', 'Visitor',
            'Tourist', 'Traveler', 'Passenger', 'Rider', 'Driver', 'Walker', 'Runner',
            'Swimmer', 'Dancer', 'Singer', 'Painter', 'Writer', 'Reader', 'Student',
            'Teacher', 'Learner', 'Player', 'Worker', 'Sleeper', 'Eater', 'Drinker',
            'Cook', 'Cleaner', 'Shopper', 'Traveler', 'Attendee', 'Speaker', 'Listener',
            'Viewer', 'Thinker', 'Planner', 'Organizer'
        ];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Setup screen events
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('player-count').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 3) e.target.value = 3;
            if (value > 10) e.target.value = 10;
        });

        // Game screen events
        document.getElementById('back-to-setup').addEventListener('click', () => {
            this.showSetupScreen();
        });

        // Use event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('#word-card')) {
                this.flipCard();
            }
            if (e.target.closest('#next-player')) {
                this.nextPlayer();
            }
            if (e.target.closest('#new-game') || e.target.id === 'new-game') {
                this.showSetupScreen();
            }
            if (e.target.closest('#back-to-setup') || e.target.id === 'back-to-setup') {
                this.showSetupScreen();
            }
        });
    }

    startGame() {
        const playerCount = parseInt(document.getElementById('player-count').value);
        
        if (playerCount < 3 || playerCount > 10) {
            alert('Please enter a number between 3 and 10 players.');
            return;
        }

        this.setupGame(playerCount);
        this.showGameScreen();
    }

    setupGame(playerCount) {
        // Create players array
        this.players = Array.from({length: playerCount}, (_, i) => i + 1);
        
        // Randomly select imposter with better randomization
        this.imposterIndex = Math.floor(Math.random() * playerCount);
        
        // Add some additional randomization to prevent patterns
        const timeBasedRandom = Date.now() % playerCount;
        this.imposterIndex = (this.imposterIndex + timeBasedRandom) % playerCount;
        
        // Select words for this round (same for all players except imposter)
        const randomWordIndex = Math.floor(Math.random() * this.words.length);
        this.currentMainWord = this.words[randomWordIndex];
        this.currentImposterWord = this.imposterWords[randomWordIndex];
        
        // Reset current player
        this.currentPlayerIndex = 0;
        
        // Update UI
        document.getElementById('total-players').textContent = playerCount;
        this.updatePlayerDisplay();
        
        // Reset card
        this.resetCard();
        
        // Log for debugging (remove in production)
        console.log(`Game setup: ${playerCount} players, imposter is player ${this.imposterIndex + 1}`);
    }

    showGameScreen() {
        document.getElementById('setup-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    }

    showSetupScreen() {
        // Reset all game state first
        this.resetGameState();
        
        // Switch screens with error checking
        const gameScreen = document.getElementById('game-screen');
        const setupScreen = document.getElementById('setup-screen');
        const playerCountInput = document.getElementById('player-count');
        
        if (gameScreen) {
            gameScreen.classList.remove('active');
        }
        
        if (setupScreen) {
            setupScreen.classList.add('active');
        }
        
        if (playerCountInput) {
            playerCountInput.value = '4';
        }
    }

    flipCard() {
        const card = document.getElementById('word-card');
        const wordText = document.getElementById('word-text');
        const imposterNotice = document.getElementById('imposter-notice');
        const nextButton = document.getElementById('next-player');
        
        // Check if elements exist
        if (!card || !wordText || !imposterNotice || !nextButton) {
            console.log('Required elements not found for flipCard');
            return;
        }
        
        // Check if card is already flipped
        if (card.classList.contains('flipped')) {
            return;
        }

        // Determine if current player is imposter
        const isImposter = this.currentPlayerIndex === this.imposterIndex;
        
        // Set the word - everyone gets the same word except the imposter
        wordText.textContent = isImposter ? this.currentImposterWord : this.currentMainWord;
        
        // Show imposter notice if applicable
        if (isImposter) {
            imposterNotice.style.display = 'block';
        } else {
            imposterNotice.style.display = 'none';
        }
        
        // Flip the card
        card.classList.add('flipped');
        
        // Enable next player button
        nextButton.disabled = false;
    }

    nextPlayer() {
        const card = document.getElementById('word-card');
        const nextButton = document.getElementById('next-player');
        
        // Reset card
        this.resetCard();
        
        // Move to next player
        this.currentPlayerIndex++;
        
        // Check if we've gone through all players
        if (this.currentPlayerIndex >= this.players.length) {
            this.showGameComplete();
            return;
        }
        
        // Update display
        this.updatePlayerDisplay();
        
        // Disable next button until card is flipped
        if (nextButton) {
            nextButton.disabled = true;
        }
    }

    resetCard() {
        const card = document.getElementById('word-card');
        const wordText = document.getElementById('word-text');
        const imposterNotice = document.getElementById('imposter-notice');
        
        // Check if elements exist before accessing them
        if (card) {
            card.classList.remove('flipped');
        }
        
        if (wordText) {
            wordText.textContent = '';
        }
        
        if (imposterNotice) {
            imposterNotice.style.display = 'none';
        }
    }

    resetGameState() {
        // Reset all game variables
        this.players = [];
        this.currentPlayerIndex = 0;
        this.imposterIndex = -1;
        this.currentMainWord = null;
        this.currentImposterWord = null;
        
        // Reset card
        this.resetCard();
        
        // Reset UI elements
        const cardContainer = document.querySelector('.card-container');
        const gameControls = document.querySelector('.game-controls');
        
        // Restore original card HTML
        cardContainer.innerHTML = `
            <div class="card" id="word-card">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-content">
                            <span class="card-text">🕵️ Click to reveal your secret word</span>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-content">
                            <span class="word-text" id="word-text"></span>
                            <div class="imposter-notice" id="imposter-notice" style="display: none;">
                                <span class="imposter-badge">🤥 YOU ARE THE IMPOSTER!</span>
                                <p>🕵️ Deceive and blend in with your clues!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Restore original controls
        gameControls.innerHTML = `
            <button id="next-player" class="btn-primary" disabled>⏭️ Next Player</button>
            <div class="player-progress">
                <span id="progress-text">Player 1 of <span id="total-players">4</span></span>
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        // Update display
        this.updatePlayerDisplay();
    }

    updatePlayerDisplay() {
        const currentPlayerElement = document.getElementById('current-player');
        const progressTextElement = document.getElementById('progress-text');
        const progressFill = document.getElementById('progress-fill');
        
        if (currentPlayerElement) {
            currentPlayerElement.textContent = this.currentPlayerIndex + 1;
        }
        
        if (progressTextElement) {
            progressTextElement.textContent = `Player ${this.currentPlayerIndex + 1} of ${this.players.length}`;
        }
        
        // Update progress bar
        if (progressFill) {
            const progress = (this.currentPlayerIndex / this.players.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    showGameComplete() {
        const cardContainer = document.querySelector('.card-container');
        const gameControls = document.querySelector('.game-controls');
        
        // Create completion message
        const completionDiv = document.createElement('div');
        completionDiv.className = 'game-complete';
        completionDiv.innerHTML = `
            <h2>🕵️ Investigation Phase Begins!</h2>
            <p>All players have seen their cards. Now the real game begins:</p>
            <div class="game-instructions">
                <ol>
                    <li>🔍 Take turns giving clues about your word</li>
                    <li>🤥 The imposter must deceive and blend in</li>
                    <li>⚖️ Discuss and analyze everyone's behavior</li>
                    <li>🎯 Vote to identify the imposter</li>
                    <li>🏆 Imposter wins if not caught, others win if imposter is found</li>
                </ol>
            </div>
            <div class="imposter-info">
                <p><strong>🕵️ Secret Intel:</strong> Player ${this.imposterIndex + 1} is the imposter!</p>
            </div>
        `;
        
        // Replace card with completion message
        cardContainer.innerHTML = '';
        cardContainer.appendChild(completionDiv);
        
        // Update controls
        gameControls.innerHTML = `
            <button id="new-game" class="btn-primary" onclick="startNewGame()">🔄 Play Again</button>
        `;
    }
}

// Global function for player count adjustment
function adjustPlayerCount(change) {
    const input = document.getElementById('player-count');
    let value = parseInt(input.value) + change;
    if (value < 3) value = 3;
    if (value > 10) value = 10;
    input.value = value;
}

// Global function for starting new game
function startNewGame() {
    if (window.wordImposterGame) {
        window.wordImposterGame.showSetupScreen();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.wordImposterGame = new WordImposterGame();
});
