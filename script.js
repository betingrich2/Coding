document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const bgMusic = document.getElementById('bg-music');
    const successSound = document.getElementById('success-sound');
    const errorSound = document.getElementById('error-sound');

    let currentLevel = 0;
    let totalXP = 0;
    let playerLevel = 1;
    let levels = [];
    let tutorials = [];
    let levelImages = ["assets/images/jungle.jpg", "assets/images/city.jpg", "assets/images/space.jpg"];

    // Load levels and tutorials from JSON
    Promise.all([
        fetch('data/levels.json').then(response => response.json()).then(data => levels = data),
        fetch('data/tutorials.json').then(response => response.json()).then(data => tutorials = data)
    ]).then(() => {
        playMusic();
        showTutorial(tutorials[currentLevel]);
    });

    function playMusic() {
        bgMusic.play();
    }

    function stopMusic() {
        bgMusic.pause();
    }

    function playSound(sound) {
        sound.play();
    }

    function showTutorial(tutorial) {
        gameContainer.innerHTML = `
            <h2>${tutorial.title}</h2>
            <p>${tutorial.content}</p>
            <button id="continue-to-level">Continue to Level</button>
        `;

        document.getElementById('continue-to-level').addEventListener('click', function() {
            showLevel(levels[currentLevel]);
        });
    }

    function showLevel(level) {
        gameContainer.classList.add('level-bg');
        gameContainer.style.backgroundImage = `url(${levelImages[currentLevel]})`;

        gameContainer.innerHTML = `
            <h2>${level.title}</h2>
            <p>${level.description}</p>
            ${level.challengeType === "code" ? `<textarea id="code-input" placeholder="Write your code here..."></textarea>` : ''}
            ${level.challengeType === "debug" ? `<pre>${level.codeSnippet}</pre><textarea id="debug-input" placeholder="Fix the code here..."></textarea>` : ''}
            ${level.challengeType === "animation" ? `<textarea id="animation-input" placeholder="Write your animation CSS here..."></textarea>` : ''}
            <button id="submit-code">Submit</button>
        `;

        document.getElementById('submit-code').addEventListener('click', function() {
            const userCode = level.challengeType === "debug" ? document.getElementById('debug-input').value.trim() : document.getElementById('code-input').value.trim();
            evaluateCode(userCode, level);
        });
    }

    function evaluateCode(userCode, level) {
        const expectedCode = level.expectedCode || level.expectedOutput;
        if (userCode === expectedCode) {
            playSound(successSound);
            alert("Correct! You've earned " + level.xp + " XP.");
            totalXP += level.xp;
            updateUserInfo();

            currentLevel++;
            if (currentLevel < levels.length) {
                showTutorial(tutorials[currentLevel]);
            } else {
                gameContainer.innerHTML = "<h2>Congratulations! You've completed all levels!</h2>";
                stopMusic();
            }
        } else {
            playSound(errorSound);
            alert("Incorrect. Please try again!");
        }
    }

    function updateUserInfo() {
        document.getElementById('xp').textContent = "XP: " + totalXP;
        playerLevel = Math.floor(totalXP / 100) + 1;
        document.getElementById('level').textContent = "Level: " + playerLevel;
    }
});
