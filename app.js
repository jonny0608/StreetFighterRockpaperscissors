let roundNumber = 1;
let userWins = 0;
let computerWins = 0;

let playerHealth = 100;
let computerHealth = 100;

let playerAnimating = false;
let computerAnimating = false;

const moveNames = {
  hadouken: "Hadouken",
  shoryuken: "Shoryuken",
  hurricane: "Hurricane Kick",
};

const welcomeText = document.getElementById("welcomeText");
const roundText = document.getElementById("roundText");

const userLabel = document.getElementById("userLabel");
const userWinsEl = document.getElementById("userWins");
const computerWinsEl = document.getElementById("computerWins");

const playerNameTag = document.getElementById("playerNameTag");

const playerHealthBar = document.querySelector(".player-health");
const computerHealthBar = document.querySelector(".computer-health");

const userChoiceTitle = document.getElementById("userChoiceTitle");
const userChoiceDisplay = document.getElementById("userChoiceDisplay");
const computerChoiceDisplay = document.getElementById("computerChoiceDisplay");

const resultText = document.getElementById("resultText");
const resetBtn = document.getElementById("resetBtn");

const playerSprite = document.querySelector(".player-sprite");
const computerSprite = document.querySelector(".computer-sprite");

// direct button references (no querySelectorAll)
const hadoukenBtn = document.querySelector('[data-move="hadouken"]');
const shoryukenBtn = document.querySelector('[data-move="shoryuken"]');
const hurricaneBtn = document.querySelector('[data-move="hurricane"]');

const characterConfig = {
  ryu: {
    frameW: 60,
    frameH: 90,
    anim: {
      idle: { row: 0.4, frames: 1 },
      shoryuken: { row: 7, frames: 6 },
      hadouken: { row: 8.5, frames: 7 },
      hurricane: { row: 9.6, frames: 6 },
    },
  },
  ken: {
    frameW: 60,
    frameH: 95,
    anim: {
      idle: { row: 0, frames: 1 },
      shoryuken: { row: 10.7, frames: 6 },
      hadouken: { row: 9.4, frames: 7 },
      hurricane: { row: 10.7, frames: 6 },
    },
  },
};

function getChar(sprite) {
  if (sprite.classList.contains("player-sprite")) return characterConfig.ryu;
  return characterConfig.ken;
}

let userName = "Player";
startGame();

function startGame() {
  let input = prompt("What is your name?") || "";
  input = input.trim();
  if (input === "") userName = "Player";
  else userName = input;

  welcomeText.textContent = "Welcome, " + userName + "!";
  userLabel.textContent = userName;
  playerNameTag.textContent = userName;
  userChoiceTitle.textContent = userName + " Move";

  roundNumber = 1;
  userWins = 0;
  computerWins = 0;

  playerHealth = 100;
  computerHealth = 100;

  userChoiceDisplay.textContent = "—";
  computerChoiceDisplay.textContent = "—";
  resultText.textContent = "Choose your move!";

  resetBtn.style.display = "none";

  setButtonsDisabled(false);

  setIdle(playerSprite, true);
  setIdle(computerSprite, false);

  updateUI();
}

// button events (no loop)
hadoukenBtn.addEventListener("click", function () {
  playRound("hadouken");
});

shoryukenBtn.addEventListener("click", function () {
  playRound("shoryuken");
});

hurricaneBtn.addEventListener("click", function () {
  playRound("hurricane");
});

function getComputerMove() {
  const rand = Math.floor(Math.random() * 3);
  if (rand === 0) return "hadouken";
  else if (rand === 1) return "shoryuken";
  else return "hurricane";
}

function playRound(userChoice) {
  if (roundNumber > 5) {
    resultText.textContent = "Game over. Press Reset.";
    return;
  }

  const computerChoice = getComputerMove();

  userChoiceDisplay.textContent = moveNames[userChoice];
  computerChoiceDisplay.textContent = moveNames[computerChoice];

  let finished = 0;

  function afterBoth() {
    finished++;
    if (finished < 2) return;

    const outcome = decideWinner(userChoice, computerChoice);

    if (outcome === "tie") {
      resultText.textContent = "Tie! You both used " + moveNames[userChoice] + ".";
    } else if (outcome === "user") {
      userWins = userWins + 1;
      computerHealth = computerHealth - 20;
      resultText.textContent =
        "You win this round! " +
        moveNames[userChoice] +
        " beats " +
        moveNames[computerChoice] +
        ".";
    } else {
      computerWins = computerWins + 1;
      playerHealth = playerHealth - 20;
      resultText.textContent =
        "Computer wins this round! " +
        moveNames[computerChoice] +
        " beats " +
        moveNames[userChoice] +
        ".";
    }

    updateUI();

    roundNumber = roundNumber + 1;

    if (roundNumber === 6) {
      endGame();
    } else {
      roundText.textContent = "Round " + roundNumber + " of 5";
    }
  }

  animateAttack(playerSprite, userChoice, true, afterBoth);
  animateAttack(computerSprite, computerChoice, false, afterBoth);
}

function decideWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) return "tie";

  if (userChoice === "hadouken") {
    if (computerChoice === "hurricane") return "user";
    else return "computer";
  }

  if (userChoice === "shoryuken") {
    if (computerChoice === "hadouken") return "user";
    else return "computer";
  }

  if (userChoice === "hurricane") {
    if (computerChoice === "shoryuken") return "user";
    else return "computer";
  }

  return "tie";
}

function updateUI() {
  userWinsEl.textContent = userWins;
  computerWinsEl.textContent = computerWins;

  roundText.textContent = "Round " + roundNumber + " of 5";

  playerHealthBar.style.width = Math.max(playerHealth, 0) + "%";
  computerHealthBar.style.width = Math.max(computerHealth, 0) + "%";
}

function endGame() {
  setButtonsDisabled(true);

  const finalLine =
    "Final Score: " + userName + " " + userWins + ", Computer " + computerWins + ".";

  let msg = "";
  if (userWins > computerWins) msg = "Congrats, " + userName + "! You won!";
  else if (computerWins > userWins) msg = "Computer won this time.";
  else msg = "It’s a tie.";

  resultText.textContent = finalLine + " " + msg;
  resetBtn.style.display = "block";
}

resetBtn.addEventListener("click", function () {
  roundNumber = 1;
  userWins = 0;
  computerWins = 0;

  playerHealth = 100;
  computerHealth = 100;

  userChoiceDisplay.textContent = "—";
  computerChoiceDisplay.textContent = "—";
  resultText.textContent = "Choose your move!";

  resetBtn.style.display = "none";
  setButtonsDisabled(false);

  setIdle(playerSprite, true);
  setIdle(computerSprite, false);

  updateUI();
});

function setButtonsDisabled(disabled) {
  hadoukenBtn.disabled = disabled;
  shoryukenBtn.disabled = disabled;
  hurricaneBtn.disabled = disabled;
}

function setIdle(sprite, isPlayer) {
  const cfg = getChar(sprite);
  sprite.style.width = cfg.frameW + "px";
  sprite.style.height = cfg.frameH + "px";
  if (isPlayer) sprite.style.transform = "scaleX(1)";
  else sprite.style.transform = "scaleX(-1)";
  sprite.style.backgroundPosition = "0px -" + cfg.anim.idle.row * cfg.frameH + "px";
}

function animateAttack(sprite, move, isPlayer, callback) {
  if (isPlayer && playerAnimating) return;
  if (!isPlayer && computerAnimating) return;

  if (isPlayer) playerAnimating = true;
  else computerAnimating = true;

  const cfg = getChar(sprite);
  const anim = cfg.anim[move] || cfg.anim.idle;

  sprite.style.width = cfg.frameW + "px";
  sprite.style.height = cfg.frameH + "px";
  if (isPlayer) sprite.style.transform = "scaleX(1)";
  else sprite.style.transform = "scaleX(-1)";

  let frame = 0;
  const frameTime = 1000 / 12;
  let last = performance.now();

  function tick(now) {
    if (now - last >= frameTime) {
      sprite.style.backgroundPosition =
        "-" + frame * cfg.frameW + "px -" + anim.row * cfg.frameH + "px";
      frame = frame + 1;
      last = now;
    }

    if (frame < anim.frames) {
      requestAnimationFrame(tick);
    } else {
      sprite.style.backgroundPosition =
        "0px -" + cfg.anim.idle.row * cfg.frameH + "px";

      if (isPlayer) playerAnimating = false;
      else computerAnimating = false;

      if (callback) callback();
    }
  }

  requestAnimationFrame(tick);
}
