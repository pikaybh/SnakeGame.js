/*jslint browser: true*/
/*global $, jQuery, alert*/

var dirArray = ['u', 'l', 'd', 'r'];
var gameBoardSize = 40;
var highestPoints = 0;
var gamePoints = 0;
var initialGameSpeed = 100;
var gameSpeed = initialGameSpeed;

$(document).ready(function () {
    console.log("Ready Player One!");
    createBoard();
    $(".btn").click(function () {
        startGame();
    });
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            startGame();
        }
    });
});

var Snake = {
    position: [[20, 20], [20, 19], [20, 18]], // snake start position
    size: 3,
    direction: dirArray[Math.floor(Math.random() * dirArray.length)],
    alive: true
}

var Food = {
    position: [],
    present: false
}

async function highestScore(playerScore) {
    let _scores = [playerScore];

    score.get().then((res) => {
        res.forEach((doc)=>{
            _scores.push(doc.data().score);
        })
        var result = Math.max(..._scores)
        $("#h-score").html("Highest Score: " + result);

        return result;
    })
}

function createBoard() {
    highestPoints = highestScore(gamePoints);
    $("#gameBoard").empty();
    var size = gameBoardSize;

    for (i = 0; i < size; i++) {
        $("#gameBoard").append('<div class="row"></div>');
        for (j = 0; j < size; j++) {
            $(".row:last-child").append('<div class="pixel"></div>');
        }
    }
}

function moveSnake() {
    var head = Snake.position[0].slice();

    switch (Snake.direction) {
        case 'r':
            head[1] += 1;
            break;
        case 'l':
            head[1] -= 1;
            break;
        case 'u':
            head[0] -= 1;
            break;
        case 'd':
            head[0] += 1;
            break;
    }

    // check after head is moved
    if (alive(head)) {
        // draw head
        $(".row:nth-child(" + head[0] + ") > .pixel:nth-child(" + head[1] + ")").addClass("snakePixel");

        // draw rest of body loop
        for (var i = 0; i < Snake.size; i++) {
            $(".row:nth-child(" + Snake.position[i][0] + ") > .pixel:nth-child(" + Snake.position[i][1] + ")").addClass("snakePixel");
        }

        // if head touches food
        if (head.every(function (e, i) {
            return e === Food.position[i];
        })) {
            Snake.size++;
            Food.present = false;
            gamePoints += 5;
            highestPoints = highestScore(gamePoints);
            $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").removeClass("foodPixel");
            $("#score").html("Your Score: " + gamePoints)
            if (gamePoints % 16 == 0 && gameSpeed > 10) { 
                gameSpeed -= 5; 
                console.log("Game speed: " + 100 / gameSpeed);
            };
        } else {
            $(".row:nth-child(" + Snake.position[Snake.size - 1][0] + ") > .pixel:nth-child(" + Snake.position[Snake.size - 1][1] + ")").removeClass("snakePixel");
            Snake.position.pop();
        }
        Snake.position.unshift(head);
    } else {
        gameOver();
    }
}


function generateFood() {
    if (Food.present === false) {
        Food.position = [Math.floor((Math.random() * 40) + 1), Math.floor((Math.random() * 40) + 1)]
        Food.present = true;
        console.log("Food at: " + Food.position);
        $(".row:nth-child(" + Food.position[0] + ") > .pixel:nth-child(" + Food.position[1] + ")").addClass("foodPixel");
    }
}

function keyPress() {
    $("#u").click(() => {if (Snake.direction != "d") { Snake.direction = "u"; }})
    $("#d").click(() => {if (Snake.direction != "u") { Snake.direction = "d"; }})
    $("#l").click(() => {if (Snake.direction != "r") { Snake.direction = "l"; }})
    $("#r").click(() => {if (Snake.direction != "l") { Snake.direction = "r"; }})

    $(document).one("keydown", function (key) {
        switch (key.which) {
            case 37: // left arrow
                if (Snake.direction != "r") { Snake.direction = "l"; }
                break;
            case 38: // up arrow
                if (Snake.direction != "d") { Snake.direction = "u"; }
                break;
            case 39: // right arrow
                if (Snake.direction != "l") { Snake.direction = "r"; }
                break;
            case 40: // down arrow
                if (Snake.direction != "u") { Snake.direction = "d"; }
                break;
        }
    });
}

function gameLoop() {
    setTimeout(function () {
        keyPress();
        generateFood();
        moveSnake();
        if (Snake.alive) { gameLoop(); }
    }, gameSpeed);
}

function alive(head) {
    // head check
    if (head[0] < 1 || head[0] > 40 || head[1] < 1 || head[1] > 40) {
        return false;
    }
    // wall collision
    if (Snake.position[0][0] < 1 || Snake.position[0][0] > 40 || Snake.position[0][1] < 1 || Snake.position[0][1] > 40) {
        return false;
    }
    // self collision
    for (var i = 1; i < Snake.size; i++) {
        if ((Snake.position[0]).every(function (element, index) {
            return element === Snake.position[i][index];
        })) {
            return false;
        }
    }
    return true;
}

function gameOver() {
    Snake.alive = false;

    if (gamePoints > 0) {
        console.log("Game Over!");
        db.collection('score').add({ name : 'no_name', score: gamePoints });
    }

    console.log("Your Final Point!: " + gamePoints);

    $(".btn").html("Try again")
    $(".overlay").show();
    $("#gameOver").show();
    var blink = function () {
        $(".row:nth-child(" + Snake.position[0][0] + ") > .pixel:nth-child(" + Snake.position[0][1] + ")").toggleClass("snakePixel");
    }

    var i = 0;
    function blinkLoop() {
        blink();
        setTimeout(function () {
            i++;
            if (i < 10) { blinkLoop(); }
        }, 400);
    }
    blinkLoop();
}

function startGame() {
    // reset game settings
    Snake.size = 3;
    switch (Snake.direction) {
        case 'u' :
            Snake.position = [[20, 20], [21, 20], [22, 20]];
            break;
        case 'd' :
            Snake.position = [[20, 20], [19, 20], [18, 20]];
            break;
        case 'l' :
            Snake.position = [[20, 20], [20, 21], [20, 22]];
            break;
        case 'r' :
            Snake.position = [[20, 20], [20, 19], [20, 18]];
            break;
    }
    // Snake.direction =   // "r";
    Snake.alive = true;
    gameSpeed = 100;
    gamePoints = 0;
    Food.present = false;

    // start game
    createBoard();
    $(".overlay").hide();
    $("#score").html("Your Score: " + gamePoints)
    gameLoop();
}