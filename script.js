let currentScore = 0;
let currentQuestion = {};
let questionCount = 0;
let startTime;
let questionTimes = [];
let errors = 0;
let maxErrors = 3;
let timer;
let isChallengeMode = false;
let timeLimit = 10; // 每道题10秒

function startGame(difficulty) {
    resetGame();
    document.getElementById('difficultyTitle').innerText = 'Difficulty: ' + difficulty;
    generateQuestion(difficulty);
    document.getElementById('userAnswer').focus();
}

function startChallengeMode() {
    resetGame();
    isChallengeMode = true;
    document.getElementById('difficultyTitle').innerText = 'Challenge Mode';
    generateQuestion('Challenge Mode');
    document.getElementById('userAnswer').focus();
}

function resetGame() {
    currentScore = 0;
    questionCount = 0;
    questionTimes = [];
    errors = 0;
    startTime = new Date();

    document.querySelector('.container h1').style.display = 'none';
    document.querySelector('.container p').style.display = 'none';
    document.querySelectorAll('.container button').forEach(btn => btn.style.display = 'none');
    document.getElementById('gameView').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('score').innerText = 'Score: 0';
    document.getElementById('feedback').innerText = '';
    document.getElementById('timer').innerText = '';
    clearTimeout(timer);
}

function generateQuestion(difficulty) {
    if (questionCount >= 10 || errors >= maxErrors) {
        endGame();
        return;
    }

    let num1, num2, result, operation, question;
    if (difficulty === 'Challenge Mode') {
        if (questionCount < 3) {
            difficulty = 'easy';
        } else if (questionCount < 10) {
            difficulty = 'medium';
        } else {
            difficulty = 'hard';
        }
    }

    switch (difficulty) {
        case 'easy':
            [num1, num2, result, operation] = generateEasyQuestion();
            break;
        case 'medium':
            [num1, num2, result, operation] = generateMediumQuestion();
            break;
        case 'hard':
            [num1, num2, result, operation] = generateHardQuestion();
            break;
    }

    question = `${num1} ${operation} ${num2}`;
    currentQuestion = {
        question: question,
        answer: result,
        startTime: new Date()
    };

    document.getElementById('question').innerText = question + ' = ?';
    document.getElementById('userAnswer').value = '';
    document.getElementById('userAnswer').focus();
    document.getElementById('userAnswer').addEventListener('input', checkAnswer);

    if (isChallengeMode) {
        startTimer();
    }

    questionCount++;
}

function generateEasyQuestion() {
    let num1, num2, result, operation;
    const random = Math.random();
    if (random > 0.7) {
        operation = '*';
        [num1, num2, result] = generateMultiplication(10, 10);
    } else {
        operation = '+';
        [num1, num2, result] = generateAddition(50, 50);
    }
    return [num1, num2, result, operation];
}

function generateMediumQuestion() {
    let num1, num2, result, operation;
    const random = Math.random();
    if (random > 0.95) {
        // 特定的运算技巧题目
        operation = '*';
        [num1, num2, result] = generateSpecialMultiplication('medium');
    } else if (random > 0.5) {
        operation = '*';
        [num1, num2, result] = generateMultiplication(50, 20);
    } else {
        operation = '-';
        [num1, num2, result] = generateSubtraction(100, 50);
    }
    return [num1, num2, result, operation];
}

function generateHardQuestion() {
    let num1, num2, result, operation;
    const random = Math.random();
    if (random > 0.95) {
        // 特定的运算技巧题目
        operation = '*';
        [num1, num2, result] = generateSpecialMultiplication('hard');
    } else {
        operation = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
        if (operation === '+') {
            [num1, num2, result] = generateAddition(900, 100, true);
        } else if (operation === '-') {
            [num1, num2, result] = generateSubtraction(900, 100, true);
        } else if (operation === '*') {
            [num1, num2, result] = generateMultiplication(90, 90, true);
        } else {
            [num1, num2, result] = generateHardDivision(90, 3, true);
        }
    }
    return [num1, num2, result, operation];
}

function generateSpecialMultiplication(difficulty) {
    let num1, num2, result;
    if (difficulty === 'medium' || difficulty === 'hard') {
        const options = [
            () => {
                num1 = 125;
                num2 = 8 * (Math.floor(Math.random() * 11) + 1); // 8的倍数
                result = num1 * num2;
            },
            () => {
                num1 = 25;
                num2 = 4 * (Math.floor(Math.random() * 11) + 1); // 4的倍数
                result = num1 * num2;
            },
            () => {
                num1 = 11;
                num2 = Math.floor(Math.random() * 91) + 10; // 11 到 1000 的数
                result = num1 * num2;
            }
        ];
        const selectedOption = options[Math.floor(Math.random() * options.length)];
        selectedOption();
    }
    return [num1, num2, result];
}

function generateAddition(maxNum1, maxNum2, isHard = false) {
    let num1 = isHard ? Math.floor(Math.random() * (maxNum1 - 100)) + 100 : Math.floor(Math.random() * maxNum1);
    let num2 = isHard ? Math.floor(Math.random() * (maxNum2 - 100)) + 100 : Math.floor(Math.random() * maxNum2);
    let result = num1 + num2;
    return [num1, num2, result];
}

function generateSubtraction(maxNum1, maxNum2, isHard = false) {
    let num1 = isHard ? Math.floor(Math.random() * (maxNum1 - 100)) + 100 : Math.floor(Math.random() * maxNum1);
    let num2 = isHard ? Math.floor(Math.random() * (maxNum2 - 100)) + 100 : Math.floor(Math.random() * maxNum2);
    if (num1 < num2) [num1, num2] = [num2, num1]; // 保证结果为正数
    let result = num1 - num2;
    return [num1, num2, result];
}

function generateMultiplication(maxNum1, maxNum2, isHard = false) {
    let num1 = isHard ? Math.floor(Math.random() * (maxNum1 - 5)) + 5 : Math.floor(Math.random() * maxNum1);
    let num2 = isHard ? Math.floor(Math.random() * (maxNum2 - 5)) + 5 : Math.floor(Math.random() * maxNum2);
    let result = num1 * num2;
    return [num1, num2, result];
}

function generateHardDivision(maxNum1, minNum2, isHard = false) {
    let num1, num2, result;
    do {
        num1 = isHard ? Math.floor(Math.random() * (maxNum1 - 10)) + 10 : Math.floor(Math.random() * maxNum1) + 1;
        num2 = isHard ? Math.floor(Math.random() * (maxNum1 - minNum2)) + minNum2 : Math.floor(Math.random() * maxNum2) + 1;
        result = num1 / num2;
    } while (!Number.isInteger(result) || (num2 === 10 && num1 % 10 === 0)); // 确保小数点后三位以内且不为十的倍数除以10
    return [num1, num2, result.toFixed(3)];
}

function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleWrongAnswer();
        }
    }, 1000);
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('userAnswer').value);
    const correctAnswer = parseFloat(currentQuestion.answer);

    if (userAnswer === correctAnswer) {
        currentScore++;
        document.getElementById('feedback').innerText = 'Correct!';
        const endTime = new Date();
        questionTimes.push({
            question: currentQuestion.question,
            time: (endTime - currentQuestion.startTime) / 1000
        });

        clearTimeout(timer);
        setTimeout(() => generateQuestion(isChallengeMode ? 'Challenge Mode' : document.getElementById('difficultyTitle').innerText.split(': ')[1].trim()), 500);
    } else {
        document.getElementById('feedback').innerText = '';
    }

    document.getElementById('score').innerText = 'Score: ' + currentScore;
}

function handleWrongAnswer() {
    errors++;
    document.getElementById('feedback').innerText = `Wrong! Errors: ${errors}/${maxErrors}`;

    if (errors >= maxErrors) {
        endGame();
    } else {
        generateQuestion('Challenge Mode');
    }
}

function endGame() {
    const totalTime = (new Date() - startTime) / 1000;
    questionTimes.sort((a, b) => b.time - a.time);

    let topThree = questionTimes.slice(0, 3).map(qt => `${qt.question} - Time: ${qt.time}s`).join('<br>');
    document.getElementById('gameView').innerHTML = `<h2>Game Over!</h2>
                                                    <p>Total Time: ${totalTime}s</p>
                                                    <p>Your score: ${currentScore}</p>
                                                    <p>Longest Questions:</p>
                                                    <p>${topThree}</p>
                                                    <button onclick="restartGame()" class="restart-button">Start Over</button>`;
    
    // 假设有一个API来获取和提交榜单数据
    fetchLeaderboard();
}

function restartGame() {
    document.location.reload();
}

// 假设有一个简单的API来获取和提交榜单数据
function fetchLeaderboard() {
    // 使用fetch API获取榜单数据
    fetch('https://example.com/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';

            data.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name} - Score: ${entry.score}`;
                leaderboardList.appendChild(listItem);
            });

            document.getElementById('leaderboard').style.display = 'block';
        });
}
