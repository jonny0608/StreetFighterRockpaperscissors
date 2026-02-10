let playerHealth = 100;
let computerHealth = 100;
const moves = ["hadouken", "shoryuken", "hurricane"];
const playerHealthBar = document.querySelector(".player-health");
const computerHealthBar = document.querySelector(".computer-health");
const resultText = document.querySelector(".result-text");
const playerSprite = document.querySelector(".player-sprite");
const computerSprite = document.querySelector(".computer-sprite");
const buttons = document.querySelectorAll(".move-btn");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (playerHealth <= 0 || computerHealth <= 0) return;
        const playerMove = button.dataset.move;
        playRound(playerMove);
    });
});
function playRound(playerMove) {
    const computerMove = moves[Math.floor(Math.random() * moves.length)];
    animateAttack(playerSprite, playerMove);
    animateAttack(computerSprite, computerMove);
    if (playerMove === computerMove) {
        resultText.textContent = "Tie!";
        return;
    }
    if (playerWins(playerMove, computerMove)) {
        computerHealth -= 20;
        resultText.textContent = `Player used ${playerMove.toUpperCase()}!`;
    } else {
        playerHealth -= 20;
        resultText.textContent = `Computer used ${computerMove.toUpperCase()}!`;
    }
    updateHealthBars();
    checkWinner();
}
function playerWins(player, cpu) {
    return (
        (player === "hadouken" && cpu === "hurricane") ||
        (player === "hurricane" && cpu === "shoryuken") ||
        (player === "shoryuken" && cpu === "hadouken")
    );
}
function updateHealthBars() {
    playerHealthBar.style.width = Math.max(playerHealth, 0) + "%";
    computerHealthBar.style.width = Math.max(computerHealth, 0) + "%";
}
function checkWinner() {
    if (playerHealth <= 0) {
        resultText.textContent = "Computer Wins!";
    } else if (computerHealth <= 0) {
        resultText.textContent = "Player Wins!";
    }
}
function animateAttack(sprite, move) {
    const originalImage = sprite.style.backgroundImage;
    sprite.style.backgroundImage = `url('${move}.png')`;
    setTimeout(() => {
        sprite.style.backgroundImage = originalImage;
    }, 400);
}
