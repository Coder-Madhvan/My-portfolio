// Enhanced Game State with achievements and streaks
let gameState = {
    score: 0,
    level: 1,
    timeLeft: 600, // 10 minutes in seconds
    maxTime: 600,
    isPlaying: false,
    isPaused: false,
    timerInterval: null,
    currentElements: [],
    placedElements: new Set(),
    totalElements: 0,
    hintsLeft: 3,
    maxHints: 3,
    combo: 0,
    maxCombo: 0,
    streak: 0,
    maxStreak: 0,
    levelScore: 0,
    levelStartTime: 0,
    mistakes: 0,
    soundEnabled: true,
    musicEnabled: false,
    theme: 'dark',
    achievements: {
        firstElement: false,
        comboMaster: false,
        speedDemon: false,
        perfectionist: false
    }
};

// Achievement System
const achievementManager = {
    checkAchievements() {
        // First Element Achievement
        if (!gameState.achievements.firstElement && gameState.placedElements.size >= 1) {
            this.unlockAchievement('firstElement', 'first-element');
        }
        
        // Combo Master Achievement (5x combo)
        if (!gameState.achievements.comboMaster && gameState.combo >= 5) {
            this.unlockAchievement('comboMaster', 'combo-master');
        }
        
        // Speed Demon Achievement (complete level under 2 minutes)
        if (!gameState.achievements.speedDemon && gameState.levelStartTime > 0) {
            const timeElapsed = (Date.now() - gameState.levelStartTime) / 1000;
            if (timeElapsed < 120 && gameState.placedElements.size === gameState.totalElements) {
                this.unlockAchievement('speedDemon', 'speed-demon');
            }
        }
        
        // Perfectionist Achievement (complete level without mistakes)
        if (!gameState.achievements.perfectionist && gameState.mistakes === 0 && 
            gameState.placedElements.size === gameState.totalElements) {
            this.unlockAchievement('perfectionist', 'perfectionist');
        }
    },
    
    unlockAchievement(achievementKey, elementId) {
        gameState.achievements[achievementKey] = true;
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('unlocked');
            this.showAchievementNotification(elementId);
        }
        saveGameState();
    },
    
    showAchievementNotification(achievementId) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${document.getElementById(achievementId).textContent}</div>
            <div class="achievement-text">Achievement Unlocked!</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Audio Management
const audioManager = {
    correctSound: null,
    wrongSound: null,
    levelCompleteSound: null,
    backgroundMusic: null,
    
    init() {
        this.correctSound = document.getElementById('correct-sound');
        this.wrongSound = document.getElementById('wrong-sound');
        this.levelCompleteSound = document.getElementById('level-complete-sound');
        this.backgroundMusic = document.getElementById('background-music');
        
        // Set volume levels
        if (this.backgroundMusic) this.backgroundMusic.volume = 0.3;
        if (this.correctSound) this.correctSound.volume = 0.5;
        if (this.wrongSound) this.wrongSound.volume = 0.5;
        if (this.levelCompleteSound) this.levelCompleteSound.volume = 0.7;
    },
    
    playSound(soundType) {
        if (!gameState.soundEnabled) return;
        
        try {
            switch(soundType) {
                case 'correct':
                    if (this.correctSound) {
                        this.correctSound.currentTime = 0;
                        this.correctSound.play();
                    }
                    break;
                case 'wrong':
                    if (this.wrongSound) {
                        this.wrongSound.currentTime = 0;
                        this.wrongSound.play();
                    }
                    break;
                case 'levelComplete':
                    if (this.levelCompleteSound) {
                        this.levelCompleteSound.currentTime = 0;
                        this.levelCompleteSound.play();
                    }
                    break;
            }
        } catch (error) {
            console.log('Audio playback failed:', error);
        }
    },
    
    toggleMusic() {
        if (!this.backgroundMusic) return;
        
        if (gameState.musicEnabled) {
            this.backgroundMusic.pause();
            gameState.musicEnabled = false;
        } else {
            this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
            gameState.musicEnabled = true;
        }
        updateMusicButton();
    }
};

// Element Facts Database
const elementFacts = [
    "Hydrogen is the most abundant element in the universe, making up about 75% of all matter!",
    "Helium was first discovered in the Sun before it was found on Earth!",
    "Lithium is the lightest metal and can float on water.",
    "Carbon can form more compounds than any other element except hydrogen.",
    "Oxygen makes up about 21% of Earth's atmosphere.",
    "Fluorine is the most reactive element on the periodic table.",
    "Neon glows reddish-orange when electricity passes through it.",
    "Sodium explodes when it comes into contact with water!",
    "Aluminum is the most abundant metal in Earth's crust.",
    "Silicon is used to make computer chips and glass.",
    "Gold is so unreactive that it can last thousands of years without tarnishing.",
    "Mercury is the only metal that's liquid at room temperature.",
    "Uranium was named after the planet Uranus.",
    "Iron makes up about 35% of Earth's mass.",
    "Copper has been used by humans for over 10,000 years!",
    "Silver is the best conductor of electricity among all elements.",
    "Platinum is 30 times rarer than gold!",
    "Titanium is as strong as steel but 45% lighter.",
    "Zinc is essential for human health and wound healing.",
    "Lead was once used in paint and gasoline but is now known to be toxic."
];

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const levelCompleteModal = document.getElementById('level-complete-modal');
const periodicTable = document.getElementById('periodic-table');
const elementsHolder = document.getElementById('elements-holder');

// Header elements
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const timerBar = document.getElementById('timer-bar');
const hintsDisplay = document.getElementById('hints-left');
const comboDisplay = document.getElementById('combo-count');

// Game screen elements
const gameScoreDisplay = document.getElementById('game-score');
const gameLevelDisplay = document.getElementById('game-level');
const gameTimerDisplay = document.getElementById('game-timer');
const gameHintsDisplay = document.getElementById('game-hints');
const gameComboDisplay = document.getElementById('game-combo');

// Buttons
const startGameBtn = document.getElementById('start-game');
const continueGameBtn = document.getElementById('continue-game');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const hintBtn = document.getElementById('hint-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const musicToggleBtn = document.getElementById('music-toggle');
const nextLevelBtn = document.getElementById('next-level-btn');
const playAgainBtn = document.getElementById('play-again');
const mainMenuBtn = document.getElementById('main-menu');

// Other elements
const elementFactDisplay = document.getElementById('element-fact');

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    audioManager.init();
    loadGameState();
    setupEventListeners();
    createPeriodicTable();
    updateDisplay();
    showRandomFact();
    checkForSavedGame();
});

// Enhanced Event Listeners
function setupEventListeners() {
    // Game control buttons
    startGameBtn.addEventListener('click', () => startGame(false));
    continueGameBtn.addEventListener('click', () => startGame(true));
    startBtn.addEventListener('click', toggleGame);
    pauseBtn.addEventListener('click', pauseGame);
    shuffleBtn.addEventListener('click', shuffleElements);
    hintBtn.addEventListener('click', useHint);
    nextLevelBtn.addEventListener('click', nextLevel);
    playAgainBtn.addEventListener('click', restartGame);
    mainMenuBtn.addEventListener('click', returnToMenu);
    
    // Theme and audio controls
    themeToggleBtn.addEventListener('click', toggleTheme);
    musicToggleBtn.addEventListener('click', () => audioManager.toggleMusic());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Prevent context menu on mobile
    document.addEventListener('contextmenu', function(e) {
        if (e.target.classList.contains('draggable-element')) {
            e.preventDefault();
        }
    });
}

// Enhanced keyboard shortcuts
function handleKeyboardShortcuts(e) {
    if (e.code === 'Space' && gameState.isPlaying) {
        e.preventDefault();
        toggleGame();
    } else if (e.code === 'KeyS' && gameState.isPlaying && !gameState.isPaused) {
        e.preventDefault();
        shuffleElements();
    } else if (e.code === 'KeyH' && gameState.isPlaying && !gameState.isPaused && gameState.hintsLeft > 0) {
        e.preventDefault();
        useHint();
    } else if (e.code === 'KeyT') {
        e.preventDefault();
        toggleTheme();
    } else if (e.code === 'KeyM') {
        e.preventDefault();
        audioManager.toggleMusic();
    }
}

// Enhanced Game Control Functions
function startGame(continueGame = false) {
    welcomeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    gameScreen.classList.add('fade-in');
    
    if (!continueGame) {
        // Reset game state for new game
        gameState.score = 0;
        gameState.level = 1;
        gameState.timeLeft = gameState.maxTime;
        gameState.hintsLeft = gameState.maxHints;
        gameState.combo = 0;
        gameState.streak = 0;
        gameState.levelScore = 0;
        gameState.mistakes = 0;
        gameState.levelStartTime = Date.now();
        clearPeriodicTable();
    }
    
    gameState.isPlaying = true;
    gameState.isPaused = false;
    startTimer();
    shuffleElements();
    updateDisplay();
    saveGameState();
    showRandomFact();
    
    // Add some fun animations
    animateGameStart();
}

function checkForSavedGame() {
    const savedData = localStorage.getItem('periodicTablePuzzleEnhanced');
    if (savedData && continueGameBtn) {
        try {
            const data = JSON.parse(savedData);
            if (data.level > 1 || data.score > 0) {
                continueGameBtn.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Error checking saved game:', error);
        }
    }
}

function toggleGame() {
    if (gameState.isPlaying && !gameState.isPaused) {
        pauseGame();
    } else {
        resumeGame();
    }
}

function pauseGame() {
    gameState.isPaused = true;
    clearInterval(gameState.timerInterval);
    startBtn.textContent = 'Resume';
    updateDisplay();
    saveGameState();
}

function resumeGame() {
    gameState.isPaused = false;
    startTimer();
    startBtn.textContent = 'Pause';
    updateDisplay();
}

function restartGame() {
    gameState = {
        score: 0,
        level: 1,
        timeLeft: 600,
        isPlaying: false,
        isPaused: false,
        timerInterval: null,
        currentElements: [],
        placedElements: new Set(),
        totalElements: 0
    };
    gameOverScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    clearPeriodicTable();
    updateDisplay();
    saveGameState();
}

function returnToMenu() {
    gameOverScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    updateDisplay();
}

function gameOver() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    // Update final score display
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-level').textContent = gameState.level;
    
    // Show game over screen
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
    
    saveGameState();
}

// Timer Functions
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isPaused && gameState.isPlaying) {
            gameState.timeLeft--;
            updateDisplay();
            
            if (gameState.timeLeft <= 0) {
                gameOver();
            }
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Enhanced Periodic Table Creation with animations
function createPeriodicTable() {
    if (!periodicTable) return;
    
    periodicTable.innerHTML = '';
    
    // Create 9 rows × 18 columns grid
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 18; col++) {
            const cell = document.createElement('div');
            cell.className = 'element-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.style.gridRow = row;
            cell.style.gridColumn = col;
            
            // Find element for this position
            const element = elements.find(el => el.row === row && el.col === col);
            
            if (element) {
                cell.dataset.number = element.number;
                cell.dataset.symbol = element.symbol;
                cell.dataset.category = element.category;
                cell.dataset.name = element.name;
                
                // Add placeholder content - completely empty
                cell.innerHTML = '';
                
                // Add category class for styling
                cell.classList.add(element.category);
                cell.classList.add('empty-slot');
                cell.classList.add('visible-cell');
                
                // Add drop zone functionality
                setupDropZone(cell);
                
                // Add entrance animation
                cell.style.animationDelay = `${(row * 18 + col) * 5}ms`;
                cell.classList.add('cell-entrance');
            } else {
                // Empty cell - but keep it for grid structure
                cell.classList.add('empty-cell');
                cell.style.visibility = 'hidden';
            }
            
            periodicTable.appendChild(cell);
        }
    }
    
    console.log('Periodic table created with', periodicTable.children.length, 'cells');
}

function clearPeriodicTable() {
    const cells = periodicTable.querySelectorAll('.element-cell.visible-cell');
    cells.forEach(cell => {
        const element = elements.find(el => 
            el.row === parseInt(cell.dataset.row) && 
            el.col === parseInt(cell.dataset.col)
        );
        
        if (element) {
            // Reset to placeholder state - completely empty
            cell.innerHTML = '';
            cell.classList.remove('filled');
            cell.classList.add('empty-slot');
        }
    });
    gameState.placedElements.clear();
}

// Element Shuffling and Display
function shuffleElements() {
    if (!gameState.isPlaying) return;
    
    // Clear elements holder
    elementsHolder.innerHTML = '';
    
    // Get elements for current level (10 + 5 per level)
    const elementsCount = Math.min(10 + (gameState.level - 1) * 5, elements.length);
    const shuffledElements = [...elements].sort(() => Math.random() - 0.5).slice(0, elementsCount);
    
    gameState.currentElements = shuffledElements;
    gameState.totalElements = elementsCount;
    
    // Create draggable elements
    shuffledElements.forEach(element => {
        const elementDiv = createDraggableElement(element);
        elementsHolder.appendChild(elementDiv);
    });
    
    updateDisplay();
}

function createDraggableElement(element) {
    const elementDiv = document.createElement('div');
    elementDiv.className = `draggable-element ${element.category}`;
    elementDiv.draggable = true;
    elementDiv.dataset.number = element.number;
    elementDiv.dataset.symbol = element.symbol;
    elementDiv.dataset.name = element.name;
    elementDiv.dataset.category = element.category;
    elementDiv.dataset.row = element.row;
    elementDiv.dataset.col = element.col;
    
    elementDiv.innerHTML = `
        <div class="element-number">${element.number}</div>
        <div class="element-symbol">${element.symbol}</div>
    `;
    
    // Add drag event listeners
    elementDiv.addEventListener('dragstart', handleDragStart);
    elementDiv.addEventListener('dragend', handleDragEnd);
    
    // Add touch event listeners for mobile
    elementDiv.addEventListener('touchstart', handleTouchStart, { passive: false });
    elementDiv.addEventListener('touchmove', handleTouchMove, { passive: false });
    elementDiv.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return elementDiv;
}

// Enhanced Drag and Drop Functions
function setupDropZone(cell) {
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
    cell.addEventListener('dragenter', handleDragEnter);
    cell.addEventListener('dragleave', handleDragLeave);
    cell.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
        number: e.target.dataset.number,
        symbol: e.target.dataset.symbol,
        name: e.target.dataset.name,
        category: e.target.dataset.category,
        row: e.target.dataset.row,
        col: e.target.dataset.col
    }));
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    // Remove all drop-zone highlights
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drop-zone');
    });
}

// Touch event handlers for mobile
let touchElement = null;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
    e.preventDefault();
    touchElement = e.target.closest('.draggable-element');
    if (!touchElement) return;
    
    const touch = e.touches[0];
    const rect = touchElement.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    touchElement.classList.add('dragging');
    touchElement.style.position = 'fixed';
    touchElement.style.zIndex = '1000';
    touchElement.style.pointerEvents = 'none';
    
    updateTouchElementPosition(touch);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!touchElement) return;
    
    const touch = e.touches[0];
    updateTouchElementPosition(touch);
    
    // Find element under touch
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.element-cell');
    
    // Remove previous highlights
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drop-zone');
    });
    
    // Add highlight to current drop zone
    if (dropZone && !dropZone.classList.contains('filled')) {
        dropZone.classList.add('drop-zone');
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!touchElement) return;
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.element-cell');
    
    // Remove highlights
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drop-zone');
    });
    
    if (dropZone && !dropZone.classList.contains('filled')) {
        // Simulate drop event
        const draggedData = {
            number: touchElement.dataset.number,
            symbol: touchElement.dataset.symbol,
            name: touchElement.dataset.name,
            category: touchElement.dataset.category,
            row: touchElement.dataset.row,
            col: touchElement.dataset.col
        };
        
        const targetRow = parseInt(dropZone.dataset.row);
        const targetCol = parseInt(dropZone.dataset.col);
        const correctRow = parseInt(draggedData.row);
        const correctCol = parseInt(draggedData.col);
        
        if (targetRow === correctRow && targetCol === correctCol) {
            // Correct placement
            placeElementCorrectly(dropZone, draggedData);
            updateScore(10);
            touchElement.remove();
            checkLevelComplete();
        } else {
            // Wrong placement
            handleWrongPlacement(dropZone);
            updateScore(-5);
            resetTouchElement();
        }
    } else {
        resetTouchElement();
    }
    
    touchElement = null;
}

function updateTouchElementPosition(touch) {
    if (!touchElement) return;
    touchElement.style.left = (touch.clientX - touchOffset.x) + 'px';
    touchElement.style.top = (touch.clientY - touchOffset.y) + 'px';
}

function resetTouchElement() {
    if (!touchElement) return;
    touchElement.classList.remove('dragging');
    touchElement.style.position = '';
    touchElement.style.zIndex = '';
    touchElement.style.pointerEvents = '';
    touchElement.style.left = '';
    touchElement.style.top = '';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('element-cell') && !e.target.classList.contains('filled')) {
        e.target.classList.add('drop-zone');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('element-cell')) {
        e.target.classList.remove('drop-zone');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drop-zone');
    
    if (!e.target.classList.contains('element-cell') || e.target.classList.contains('filled')) {
        return;
    }
    
    try {
        const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetRow = parseInt(e.target.dataset.row);
        const targetCol = parseInt(e.target.dataset.col);
        const correctRow = parseInt(draggedData.row);
        const correctCol = parseInt(draggedData.col);
        
        // Check if placement is correct
        if (targetRow === correctRow && targetCol === correctCol) {
            // Correct placement
            placeElementCorrectly(e.target, draggedData);
            updateScore(10);
            
            // Remove element from holder
            const draggedElement = elementsHolder.querySelector(`[data-number="${draggedData.number}"]`);
            if (draggedElement) {
                draggedElement.remove();
            }
            
            // Check if level is complete
            checkLevelComplete();
        } else {
            // Wrong placement
            handleWrongPlacement(e.target);
            updateScore(-5);
        }
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

function placeElementCorrectly(cell, elementData) {
    // Show full element details when placed correctly
    cell.innerHTML = `
        <div class="element-filled">
            <div class="element-number">${elementData.number}</div>
            <div class="element-symbol">${elementData.symbol}</div>
            <div class="element-name">${elementData.name}</div>
        </div>
    `;
    cell.classList.remove('empty-slot');
    cell.classList.add('filled');
    cell.classList.add('correct-placement');
    gameState.placedElements.add(parseInt(elementData.number));
    
    // Update combo and streak
    gameState.combo++;
    gameState.streak++;
    if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;
    if (gameState.streak > gameState.maxStreak) gameState.maxStreak = gameState.streak;
    
    // Show combo indicator for big combos
    if (gameState.combo >= 3) {
        showComboIndicator(gameState.combo);
    }
    
    // Random power-up chance
    if (Math.random() < 0.1) { // 10% chance
        spawnPowerUp();
    }
    
    // Check achievements
    achievementManager.checkAchievements();
    
    // Create particle effect
    createParticleEffect(cell);
    
    // Play winning sound
    playWinningSound();
    
    // Check if level is complete
    checkLevelComplete();
    
    // Remove animation class after animation completes
    setTimeout(() => {
        cell.classList.remove('correct-placement');
    }, 800);
}

function showComboIndicator(combo) {
    const indicator = document.createElement('div');
    indicator.className = 'combo-indicator';
    indicator.textContent = `${combo}x COMBO!`;
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 1000);
}

function spawnPowerUp() {
    const powerUps = ['⚡', '🌟', '💎', '🔥', '🎯'];
    const powerUp = document.createElement('div');
    powerUp.className = 'power-up';
    powerUp.textContent = powerUps[Math.floor(Math.random() * powerUps.length)];
    powerUp.style.left = Math.random() * (window.innerWidth - 60) + 'px';
    powerUp.style.top = Math.random() * (window.innerHeight - 60) + 'px';
    
    powerUp.addEventListener('click', () => {
        // Random bonus effect
        const effects = [
            () => { gameState.hintsLeft++; showNotification('Extra Hint! 💡'); },
            () => { gameState.timeLeft += 30; showNotification('Time Bonus! ⏰ +30s'); },
            () => { updateScore(100); showNotification('Score Bonus! 💰 +100'); },
            () => { gameState.combo += 2; showNotification('Combo Boost! 🔥 +2'); }
        ];
        
        effects[Math.floor(Math.random() * effects.length)]();
        updateDisplay();
        powerUp.remove();
    });
    
    document.body.appendChild(powerUp);
    
    // Remove after 5 seconds if not clicked
    setTimeout(() => powerUp.remove(), 5000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `<div class="achievement-text">${message}</div>`;
    notification.style.background = 'linear-gradient(135deg, var(--accent-warning), var(--accent-success))';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function handleWrongPlacement(cell) {
    cell.classList.add('wrong-placement');
    
    // Play losing sound
    playLosingSound();
    
    // Remove animation class after animation completes
    setTimeout(() => {
        cell.classList.remove('wrong-placement');
    }, 600);
}

// Sound effect functions
function playWinningSound() {
    // Create a winning sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Winning sound - ascending notes
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playLosingSound() {
    // Create a losing sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Losing sound - descending notes
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.3); // A3
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playCelebrationSound() {
    // Create a celebration sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play multiple notes for celebration
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.5);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.5);
    });
}

function updateScore(points) {
    const oldScore = gameState.score;
    gameState.score = Math.max(0, gameState.score + points);
    gameState.levelScore += points;
    
    // Animate score change
    animateScoreChange(oldScore, gameState.score);
    
    // Reset combo on wrong answer
    if (points < 0) {
        gameState.combo = 0;
        gameState.mistakes++;
    }
    
    updateDisplay();
    saveGameState();
}

// Fun helper functions
function showRandomFact() {
    if (elementFactDisplay) {
        const randomFact = elementFacts[Math.floor(Math.random() * elementFacts.length)];
        elementFactDisplay.innerHTML = `<p>${randomFact}</p>`;
        elementFactDisplay.classList.add('fade-in');
    }
}

function animateGameStart() {
    const cells = periodicTable.querySelectorAll('.element-cell');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('pop-in');
        }, index * 10);
    });
}

function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.setProperty('--angle', `${i * 72}deg`);
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function animateScoreChange(oldScore, newScore) {
    const displays = document.querySelectorAll('.score-display');
    displays.forEach(display => {
        display.classList.add('score-increase');
        setTimeout(() => display.classList.remove('score-increase'), 600);
    });
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    gameState.theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = gameState.theme === 'light' ? '☀️' : '🌙';
    }
    
    saveGameState();
}

function updateMusicButton() {
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        musicBtn.textContent = gameState.musicEnabled ? '🔊' : '🔇';
    }
}

function useHint() {
    if (gameState.hintsLeft <= 0 || !gameState.isPlaying || gameState.isPaused) return;
    
    // Find a random unplaced element
    const unplacedElements = gameState.currentElements.filter(el => 
        !gameState.placedElements.has(el.number)
    );
    
    if (unplacedElements.length === 0) return;
    
    const randomElement = unplacedElements[Math.floor(Math.random() * unplacedElements.length)];
    const targetCell = periodicTable.querySelector(
        `[data-row="${randomElement.row}"][data-col="${randomElement.col}"]`
    );
    
    if (targetCell) {
        targetCell.classList.add('hint-highlight');
        setTimeout(() => {
            targetCell.classList.remove('hint-highlight');
        }, 2000);
        
        gameState.hintsLeft--;
        updateDisplay();
        saveGameState();
    }
}

function nextLevel() {
    gameState.level++;
    gameState.timeLeft = gameState.maxTime;
    gameState.hintsLeft = gameState.maxHints;
    gameState.levelScore = 0;
    gameState.mistakes = 0;
    gameState.levelStartTime = Date.now();
    
    // Hide modal
    if (levelCompleteModal) {
        levelCompleteModal.style.display = 'none';
    }
    
    clearPeriodicTable();
    shuffleElements();
    updateDisplay();
    saveGameState();
}

function checkLevelComplete() {
    if (gameState.placedElements.size === gameState.totalElements) {
        // Level complete!
        const bonusPoints = gameState.level * 50;
        const timeBonus = Math.floor(gameState.timeLeft / 10);
        const totalBonus = bonusPoints + timeBonus;
        
        // Add bonus points for completing level
        updateScore(totalBonus);
        
        // Play celebration sound
        playCelebrationSound();
        
        // Create celebration effects
        createCelebrationEffect();
        
        // Check speed demon achievement
        achievementManager.checkAchievements();
        
        // Show level complete modal
        showLevelCompleteModal(gameState.level, gameState.levelScore, totalBonus);
        
        // Add table complete animation
        periodicTable.classList.add('table-complete');
        setTimeout(() => {
            periodicTable.classList.remove('table-complete');
        }, 2000);
    }
}

function createCelebrationEffect() {
    // Create fireworks effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            
            // Random colors
            const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe'];
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(firework);
            
            setTimeout(() => firework.remove(), 1500);
        }, i * 100);
    }
    
    // Create confetti rain
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

function showLevelCompleteModal(level, score, bonus) {
    if (levelCompleteModal) {
        document.getElementById('completed-level').textContent = level;
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-bonus').textContent = bonus;
        
        levelCompleteModal.style.display = 'flex';
        levelCompleteModal.classList.add('fade-in');
    }
}

// Enhanced Display Updates
function updateDisplay() {
    // Update header displays
    if (scoreDisplay) scoreDisplay.textContent = gameState.score;
    if (levelDisplay) levelDisplay.textContent = gameState.level;
    if (timerDisplay) timerDisplay.textContent = formatTime(gameState.timeLeft);
    if (hintsDisplay) hintsDisplay.textContent = gameState.hintsLeft;
    if (comboDisplay) comboDisplay.textContent = gameState.combo;
    
    // Update streak display
    const streakDisplay = document.getElementById('streak-count');
    if (streakDisplay) streakDisplay.textContent = gameState.streak;
    
    // Update timer bar
    if (timerBar) {
        const percentage = (gameState.timeLeft / gameState.maxTime) * 100;
        timerBar.style.width = `${percentage}%`;
    }
    
    // Update game screen displays
    if (gameScoreDisplay) gameScoreDisplay.textContent = gameState.score;
    if (gameLevelDisplay) gameLevelDisplay.textContent = gameState.level;
    if (gameTimerDisplay) gameTimerDisplay.textContent = formatTime(gameState.timeLeft);
    if (gameHintsDisplay) gameHintsDisplay.textContent = gameState.hintsLeft;
    if (gameComboDisplay) gameComboDisplay.textContent = gameState.combo;
    
    // Update button states
    if (startBtn) {
        if (gameState.isPlaying) {
            startBtn.textContent = gameState.isPaused ? '▶️ Resume' : '⏸️ Pause';
        } else {
            startBtn.textContent = '🎮 Start';
        }
    }
    
    if (shuffleBtn) shuffleBtn.disabled = !gameState.isPlaying || gameState.isPaused;
    if (hintBtn) {
        hintBtn.disabled = !gameState.isPlaying || gameState.isPaused || gameState.hintsLeft <= 0;
        if (hintBtn.textContent) {
            hintBtn.textContent = `💡 Hint (${gameState.hintsLeft})`;
        }
    }
}

// Local Storage Functions
function saveGameState() {
    try {
        const saveData = {
            score: gameState.score,
            level: gameState.level,
            timeLeft: gameState.timeLeft,
            isPlaying: gameState.isPlaying,
            isPaused: gameState.isPaused,
            placedElements: Array.from(gameState.placedElements)
        };
        localStorage.setItem('periodicTablePuzzle', JSON.stringify(saveData));
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

function loadGameState() {
    try {
        const savedData = localStorage.getItem('periodicTablePuzzle');
        if (savedData) {
            const data = JSON.parse(savedData);
            gameState.score = data.score || 0;
            gameState.level = data.level || 1;
            gameState.timeLeft = data.timeLeft || 600;
            gameState.placedElements = new Set(data.placedElements || []);
            
            // Don't restore playing state - always start from menu
            gameState.isPlaying = false;
            gameState.isPaused = false;
        }
    } catch (error) {
        console.error('Error loading game state:', error);
        // Reset to default state if loading fails
        gameState = {
            score: 0,
            level: 1,
            timeLeft: 600,
            isPlaying: false,
            isPaused: false,
            timerInterval: null,
            currentElements: [],
            placedElements: new Set(),
            totalElements: 0
        };
    }
}

// Touch Support for Mobile
function addTouchSupport() {
    let draggedElement = null;
    
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('.draggable-element');
        if (target) {
            draggedElement = target;
            target.classList.add('dragging');
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (draggedElement) {
            const touch = e.touches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Remove previous drop zone highlights
            document.querySelectorAll('.drop-zone').forEach(el => {
                el.classList.remove('drop-zone');
            });
            
            // Add drop zone highlight if over valid target
            if (elementBelow && elementBelow.classList.contains('element-cell') && 
                !elementBelow.classList.contains('filled')) {
                elementBelow.classList.add('drop-zone');
            }
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (draggedElement) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (dropTarget && dropTarget.classList.contains('element-cell') && 
                !dropTarget.classList.contains('filled')) {
                
                // Simulate drop event
                const draggedData = {
                    number: draggedElement.dataset.number,
                    symbol: draggedElement.dataset.symbol,
                    category: draggedElement.dataset.category,
                    row: draggedElement.dataset.row,
                    col: draggedElement.dataset.col
                };
                
                const targetRow = parseInt(dropTarget.dataset.row);
                const targetCol = parseInt(dropTarget.dataset.col);
                const correctRow = parseInt(draggedData.row);
                const correctCol = parseInt(draggedData.col);
                
                if (targetRow === correctRow && targetCol === correctCol) {
                    placeElementCorrectly(dropTarget, draggedData);
                    updateScore(10);
                    draggedElement.remove();
                    checkLevelComplete();
                } else {
                    handleWrongPlacement(dropTarget);
                    updateScore(-5);
                }
            }
            
            // Clean up
            draggedElement.classList.remove('dragging');
            document.querySelectorAll('.drop-zone').forEach(el => {
                el.classList.remove('drop-zone');
            });
            draggedElement = null;
        }
    });
}

// Initialize touch support
addTouchSupport();

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && gameState.isPlaying) {
        e.preventDefault();
        toggleGame();
    } else if (e.code === 'KeyS' && gameState.isPlaying && !gameState.isPaused) {
        e.preventDefault();
        shuffleElements();
    }
});

// Prevent context menu on long press for mobile
document.addEventListener('contextmenu', function(e) {
    if (e.target.classList.contains('draggable-element')) {
        e.preventDefault();
    }
});
