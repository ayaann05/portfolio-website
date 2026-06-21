const themes = {
  space: ['🪐', '🌌', '🪨', '👨‍🚀', '👽', '🛰️', '🛸', '🌕', '🚀'],
  nature: ['🌿', '🌲', '🍁', '🌻', '🌊', '⛰️', '☀️', '🌙', '🌧️'],
  animals: ['🐶', '🐱', '🐼', '🐘', '🦁', '🦊', '🐸', '🐵', '🐧']
};

const levels = {
  beginner: { name: 'Beginner', number: 1, tiles: 4, length: 4 },
  intermediate: { name: 'Intermediate', number: 2, tiles: 6, length: 5 },
  advanced: { name: 'Advanced', number: 4, tiles: 9, length: 6 }
};

let chosenTheme = 'space';
let chosenLevel = 'advanced';
let sequence = [];
let spot = 0;
let score = 0;
let canPick = false;
let litTile = -1;
let rightTile = -1;
let badTile = -1;
let statusText = '';
let soundOn = true;
let audioContext = null;

const screen = document.getElementById('screen');


function playTone(tile) {
  if (!soundOn) return;

  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.value = 260 + tile * 45;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
  } catch (error) {
    soundOn = false;
  }
}

function setSoundButton() {
  const soundBtn = document.getElementById('soundBtn');
  if (!soundBtn) return;
  soundBtn.textContent = soundOn ? '🔊' : '🔇';
  soundBtn.onclick = function () {
    soundOn = !soundOn;
    setSoundButton();
  };
}

function drawSetup() {
  const levelInfo = levels[chosenLevel];

  screen.innerHTML = `
    <section class="panel setup-panel">
      <div class="setup-title">
        <h2>Game Setup</h2>
        <p class="muted">Select your preferences to start a new game.</p>
      </div>

      <div class="setup-grid">
        <div>
          <p class="label">THEME</p>
          <div class="theme-row">
            ${themeChoice('nature', '🍃', 'Nature')}
            ${themeChoice('space', '🚀', 'Space')}
            ${themeChoice('animals', '🐾', 'Animals')}
          </div>
        </div>

        <div>
          <p class="label">DIFFICULTY</p>
          <select class="level-select" id="levelSelect">
            <option value="beginner">Beginner (4 Tiles)</option>
            <option value="intermediate">Intermediate (6 Tiles)</option>
            <option value="advanced">Advanced (9 Tiles)</option>
          </select>

          <div class="info-card">
            <strong>${levelInfo.name} Mode</strong><br>
            ${levelInfo.tiles} tiles<br>
            Sequence Length: ${levelInfo.length}
          </div>

          <button class="primary-btn start-btn" id="startBtn">Start Game</button>
        </div>
      </div>
    </section>
  `;

  setSoundButton();
  document.getElementById('levelSelect').value = chosenLevel;

  document.getElementById('levelSelect').onchange = function () {
    chosenLevel = this.value;
    drawSetup();
setSoundButton();
  };

  document.getElementById('startBtn').onclick = startGame;

  document.querySelectorAll('[data-theme]').forEach(function (button) {
    button.onclick = function () {
      chosenTheme = this.dataset.theme;
      drawSetup();
setSoundButton();
    };
  });
}

function themeChoice(value, icon, label) {
  let selected = '';
  if (value === chosenTheme) {
    selected = 'selected';
  }

  return `
    <button class="option-box ${selected}" data-theme="${value}">
      <span class="icon">${icon}</span>
      ${label}
    </button>
  `;
}

function startGame() {
  const levelInfo = levels[chosenLevel];

  sequence = [];
  spot = 0;
  score = 0;
  canPick = false;
  litTile = -1;
  rightTile = -1;
  badTile = -1;
  statusText = '';

  // Tiles are unique so the player only has to remember each position once.
  while (sequence.length < levelInfo.length) {
    const randomTile = Math.floor(Math.random() * levelInfo.tiles);
    if (!sequence.includes(randomTile)) {
      sequence.push(randomTile);
    }
  }

  drawGame('watch');
  showSequence();
}

function drawGame(mode) {
  const levelInfo = levels[chosenLevel];
  const icons = themes[chosenTheme].slice(0, levelInfo.tiles);
  const gridSize = levelInfo.tiles <= 4 ? 'cols-2' : 'cols-3';
  const helpTitle = mode === 'watch' ? 'Watch' : 'Your Turn';
  const helpText = mode === 'watch'
    ? 'Watch the tiles light up. Try to remember the order.'
    : 'Repeat the sequence by clicking the tiles in the same order.';

  screen.innerHTML = `
    <section class="panel game-panel">
      <div class="game-header">
        <span>Level ${levelInfo.number}</span>
        <span>Sequence Length: ${sequence.length}</span>
        <span>${mode === 'watch' ? 'Watch the sequence' : 'Your turn'}</span>
      </div>

      <div class="steps">
        <span class="step ${mode === 'watch' ? 'current' : ''}">Watch</span>
        <span class="step ${mode === 'repeat' ? 'current' : ''}">Repeat</span>
        <span class="step">Complete</span>
      </div>

      <div class="play-area">
        <div class="grid ${gridSize}">
          ${icons.map(function (icon, index) {
            let classes = 'tile';
            if (index === litTile) classes += ' highlight';
            if (index === rightTile) classes += ' good';
            if (index === badTile) classes += ' wrong';
            return `<button class="${classes}" data-tile="${index}" ${canPick ? '' : 'disabled'}>${icon}</button>`;
          }).join('')}
        </div>

        <aside class="help-panel">
          <h3>${helpTitle}</h3>
          <p>${helpText}</p>
          <div class="feedback ${badTile !== -1 ? 'error' : ''}">${statusText}</div>
        </aside>
      </div>

      <div class="game-bottom">
        <button class="secondary-btn" id="backBtn">Back</button>
        <div class="score-text">${score} / ${sequence.length} Correct</div>
        <button class="secondary-btn" id="menuBtn">Main Menu</button>
      </div>
    </section>
  `;

  setSoundButton();
  document.getElementById('backBtn').onclick = drawSetup;
  document.getElementById('menuBtn').onclick = drawSetup;

  document.querySelectorAll('[data-tile]').forEach(function (button) {
    button.onclick = function () {
      if (!canPick) return;
      checkPick(Number(this.dataset.tile));
    };
  });
}

function showSequence() {
  let wait = 550;

  sequence.forEach(function (tile) {
    setTimeout(function () {
      litTile = tile;
      playTone(tile);
      drawGame('watch');
    }, wait);

    setTimeout(function () {
      litTile = -1;
      drawGame('watch');
    }, wait + 420);

    wait += 820;
  });

  setTimeout(function () {
    canPick = true;
    statusText = 'Start from the first tile.';
    drawGame('repeat');
  }, wait + 250);
}

function checkPick(tile) {
  const expectedTile = sequence[spot];

  if (tile === expectedTile) {
    playTone(tile);
    score += 1;
    spot += 1;
    rightTile = tile;
    badTile = -1;
    statusText = 'Correct';
    drawGame('repeat');

    setTimeout(function () {
      rightTile = -1;
      statusText = '';
      drawGame('repeat');
    }, 280);

    if (spot === sequence.length) {
      canPick = false;
      setTimeout(drawResults, 700);
    }
  } else {
    playTone(tile);
    canPick = false;
    badTile = tile;
    statusText = 'Incorrect sequence';
    drawGame('repeat');
    setTimeout(drawResults, 850);
  }
}

function drawResults() {
  const levelInfo = levels[chosenLevel];
  const finished = score === sequence.length;
  litTile = -1;
  rightTile = -1;
  badTile = -1;

  screen.innerHTML = `
    <section class="panel results-panel">
      <div class="result-mark ${finished ? '' : 'fail'}">${finished ? '✓' : '!'}</div>
      <h2>${finished ? 'Well Done!' : 'Game Over'}</h2>
      <p class="muted">${finished ? 'You completed Level ' + levelInfo.number + '.' : 'You reached ' + score + ' correct choices.'}</p>

      <div class="score-row">
        <div class="score-box">SCORE<span class="big-score">${score} / ${sequence.length}</span></div>
        <div class="score-box">SEQUENCE<span class="big-score">${sequence.length}</span></div>
      </div>

      <div class="info-card result-note">
        Consistency is the key to a stronger memory.
      </div>

      <div class="result-buttons">
        <button class="primary-btn" id="againBtn">Play Again</button>
        <button class="secondary-btn" id="changeBtn">Change Level</button>
        <button class="secondary-btn" id="mainMenuBtn">Main Menu</button>
      </div>
    </section>
  `;

  setSoundButton();
  document.getElementById('againBtn').onclick = startGame;
  document.getElementById('changeBtn').onclick = drawSetup;
  document.getElementById('mainMenuBtn').onclick = drawSetup;
}

drawSetup();
setSoundButton();
