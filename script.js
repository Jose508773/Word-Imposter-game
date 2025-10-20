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
            if (e.target.closest('#imposter-reveal')) {
                this.toggleImposterReveal();
            }
            if (e.target.closest('#new-game') || e.target.id === 'new-game') {
                this.showSetupScreen();
            }
            if (e.target.closest('#back-to-setup') || e.target.id === 'back-to-setup') {
                this.showSetupScreen();
            }
        });

        // Keyboard accessibility for flipping the card
        document.addEventListener('keydown', (e) => {
            const card = document.getElementById('word-card');
            if (!card) return;
            if (document.activeElement === card && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.flipCard();
            }
        });

        // Keyboard accessibility for revealing the imposter in completion screen
        document.addEventListener('keydown', (e) => {
            const reveal = document.getElementById('imposter-reveal');
            if (!reveal) return;
            if (document.activeElement === reveal && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.toggleImposterReveal();
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
        
        // Ready for play
    }

    showGameScreen() {
        document.getElementById('setup-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        // Focus the card for immediate keyboard accessibility
        setTimeout(() => {
            const card = document.getElementById('word-card');
            if (card) card.focus();
        }, 0);
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
        card.setAttribute('aria-pressed', 'true');
        
        // Enable next player button
        nextButton.disabled = false;

        // Update ARIA for imposter notice visibility
        if (imposterNotice) {
            imposterNotice.setAttribute('aria-hidden', isImposter ? 'false' : 'true');
        }
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

        // Return focus to the card for the next player
        setTimeout(() => {
            const cardNext = document.getElementById('word-card');
            if (cardNext) cardNext.focus();
        }, 0);
    }

    resetCard() {
        const card = document.getElementById('word-card');
        const wordText = document.getElementById('word-text');
        const imposterNotice = document.getElementById('imposter-notice');
        
        // Check if elements exist before accessing them
        if (card) {
            card.classList.remove('flipped');
            card.setAttribute('aria-pressed', 'false');
        }
        
        if (wordText) {
            wordText.textContent = '';
        }
        
        if (imposterNotice) {
            imposterNotice.style.display = 'none';
            imposterNotice.setAttribute('aria-hidden', 'true');
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
            <div class="card" id="word-card" role="button" tabindex="0" aria-label="Reveal your secret word" aria-pressed="false">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-content">
                            <span class="card-text">Click or press Enter to reveal your secret word</span>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-content">
                            <span class="word-text" id="word-text" aria-live="polite" aria-atomic="true"></span>
                            <div class="imposter-notice" id="imposter-notice" style="display: none;" aria-hidden="true">
                                <span class="imposter-badge">YOU ARE THE IMPOSTER!</span>
                                <p>Deceive and blend in with your clues!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Restore original controls
        gameControls.innerHTML = `
            <button id="next-player" class="btn-primary" disabled>Next Player</button>
            <div class="player-progress">
                <span id="progress-text" aria-live="polite" aria-atomic="true">Player 1 of <span id="total-players">4</span></span>
                <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Player progress">
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
        const progressBar = document.querySelector('.progress-bar');
        
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
            if (progressBar) {
                progressBar.setAttribute('aria-valuenow', String(Math.round(progress)));
            }
        }
    }

    showGameComplete() {
        const cardContainer = document.querySelector('.card-container');
        const gameControls = document.querySelector('.game-controls');
        
        // Create completion message
        const completionDiv = document.createElement('div');
        completionDiv.className = 'game-complete';
        completionDiv.innerHTML = `
            <h2>Investigation Phase Begins!</h2>
            <p>All players have seen their cards. Now the real game begins:</p>
            <div class="game-instructions">
                <ol>
                    <li>Take turns giving clues about your word</li>
                    <li>The imposter must deceive and blend in</li>
                    <li>Discuss and analyze everyone's behavior</li>
                    <li>Vote to identify the imposter</li>
                    <li>Imposter wins if not caught; others win if imposter is found</li>
                </ol>
            </div>
            <div class="imposter-reveal" id="imposter-reveal" role="button" tabindex="0" aria-expanded="false" aria-label="Reveal the imposter">
                <div class="imposter-reveal-inner">
                    <div class="imposter-reveal-front" aria-hidden="false">
                        <span class="imposter-reveal-cta">Reveal Imposter</span>
                    </div>
                    <div class="imposter-reveal-back" aria-hidden="true">
                        <span class="imposter-reveal-text">Secret Intel: Player ${this.imposterIndex + 1} is the imposter!</span>
                    </div>
                </div>
            </div>
        `;
        
        // Replace card with completion message
        cardContainer.innerHTML = '';
        cardContainer.appendChild(completionDiv);
        
        // Update controls
        gameControls.innerHTML = `
            <button id="new-game" class="btn-primary" onclick="startNewGame()">Play Again</button>
        `;
    }

    toggleImposterReveal() {
        const reveal = document.getElementById('imposter-reveal');
        if (!reveal) return;
        const inner = reveal.querySelector('.imposter-reveal-inner');
        const front = reveal.querySelector('.imposter-reveal-front');
        const back = reveal.querySelector('.imposter-reveal-back');
        const expanded = reveal.getAttribute('aria-expanded') === 'true';

        if (inner) {
            inner.classList.toggle('flipped', !expanded);
        }
        reveal.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (front) front.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        if (back) back.setAttribute('aria-hidden', expanded ? 'true' : 'false');
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
