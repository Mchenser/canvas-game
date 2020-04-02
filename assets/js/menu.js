let width = can.getAttribute('width')
let height = can.getAttribute('height')

let mouseX
let mouseY

let bgImage = new Image()
let logoImage = new Image()
let playImage = new Image()
let instructImage = new Image()
let settingsImage = new Image()
let creditsImage = new Image()
let alien = new Image()
let instr = new Image()
let back = new Image()

let backgroundY = 0
let speed = 1

let buttonX = [253, 192, 200]
let buttonY = [160, 210, 260]
let buttonWidth = [98, 220, 200]
let buttonHeight = [24, 24, 24]

let shipX = [0, 0]
let shipY = [0, 0]
let shipWidth = 24
let shipHeight = 24

let shipVisible = false
let shipSize = shipWidth
let shipRotate = 0

let frames = 30
let timerId = 0
let loopId = 0
let fadeId = 0
let time = 0.0

let bestScore = 0;

back.src = 'images/back.png'
instr.src = 'images/instr.png'
alien.src = 'images/alien.png'
shipImage.src = "images/ship1.png"
bgImage.src = "images/bg.png"
logoImage.src = "images/gameTitle.png"
playImage.src = "images/startBtn.png"
instructImage.src = "images/instrBtn.png"
settingsImage.src = "images/settingsBtn.png"

can.addEventListener("mousemove", checkPos)
can.addEventListener("mouseup", checkClick)

timerId = setInterval(update, 1000 / frames)

function update() {
    clear()
    move()
    draw()
}

function clear() {
    c.clearRect(0, 0, width, height)
}
function move() {

    if (shipSize == shipWidth) {
        shipRotate = -1
    }
    if (shipSize == 0) {
        shipRotate = 1
    }
    shipSize += shipRotate
}
function draw() {
    bgAnim()
    c.drawImage(logoImage, 105, 40)
    c.drawImage(playImage, buttonX[0], buttonY[0])
    c.drawImage(instructImage, buttonX[1], buttonY[1])
    c.drawImage(settingsImage, buttonX[2], buttonY[2])
    c.fillStyle = "white";
    c.font = "Bold 8pt Epson1";
    c.fillText("ЛУЧШИЙ РЕЗУЛЬТАТ: " + bestScore, 220, 380);
    if (shipVisible == true) {
        c.drawImage(shipImage, shipX[0] - (shipSize / 2), shipY[0] - 6, shipSize, shipHeight)
        c.drawImage(shipImage, shipX[1] - (shipSize / 2), shipY[1] - 6, shipSize, shipHeight)
    }
}
function checkPos(mouseEvent) {
    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
        mouseX = mouseEvent.pageX - this.offsetLeft
        mouseY = mouseEvent.pageY - this.offsetTop
    } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
        mouseX = mouseEvent.offsetX
        mouseY = mouseEvent.offsetY
    }
    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
            if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
                shipVisible = true
                shipX[0] = buttonX[i] - (shipWidth / 2) - 2
                shipY[0] = buttonY[i] + 2
                shipX[1] = buttonX[i] + buttonWidth[i] + (shipWidth / 2)
                shipY[1] = buttonY[i] + 2
            }
        } else {
            shipVisible = false
        }
    }
}
function checkClick(mouseEvent) {
    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
            if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
                fadeId = setInterval("fadeOut()", 1000 / frames)
                clearInterval(timerId)
                can.removeEventListener("mousemove", checkPos)
                can.removeEventListener("mouseup", checkClick)
            }
        }
    }
}
let ships = 1
function fadeOut() {
    c.fillStyle = "rgba(0,0,0, 0.2)"
    c.fillRect(0, 0, width, height)
    time += 0.1
    if (time >= 2) {
        clearInterval(fadeId)
        time = 0
        if (mouseX > 253 && mouseX < 351 && mouseY > 160 && mouseY < 185) {
            startGame()
        }

        if (mouseX > 192 && mouseX < 412 && mouseY > 210 && mouseY < 235) {
            updateInstructions()
        }

        if (mouseX > 200 && mouseX < 400 && mouseY > 260 && mouseY < 285) {
            if (player.ship == 'ship1') {
                shipImage.src = "images/ship2.png"
                player.ship = 'ship2'
            } else {
                shipImage.src = "images/ship1.svg"
                player.ship = 'ship1'
            }
            timerId = setInterval("update()", 1000/frames);
        }
        can.addEventListener("mousemove", checkPos)
        can.addEventListener("mouseup", checkClick)
    }
}

function updateInstructions() {
    instructId = setInterval(() => {
        clear()
    drawInstructions()
    }, 1000 / frames)
}

function drawInstructions() {
    bgAnim()
    c.drawImage(instructImage, 190, 40)
    c.drawImage(instr, 190, 150)
    c.drawImage(back,10, 10)

    if (mouseX > 10 && mouseX < 77 && mouseY > 10 && mouseY < 18) {
        clearInterval(loopId)
        clearInterval(timerId)
        clearInterval(instructId)
        timerId = setInterval(update, 1000 / frames)
    }
}

function bgAnim() {
    c.drawImage(bgImage, 0, backgroundY)
    backgroundY -= speed
    if (backgroundY == -1 * height) {
        backgroundY = 0
    }
}
function startGame() {
    game.state = 'start'
    loopId = setInterval(mainLoop, 1000 / frames)
}

player.width = 46;
player.height = 46;

var ship_image;
var bomb_image;
var bullet_image;

loadResources();

function loadResources() {

    bomb_image = new Image();
    bomb_image.src = "images/bomb.png";

    bullet_image = new Image();
    bullet_image.src = "images/bullets.png";

}

function mainLoop() {
    var c = can.getContext('2d');
    updateGame();
    updateEnemies();
    updatePlayer();
    updatePlayerBullets();
    updateEnemyBullets();
    checkCollisions();
    bgAnim()
    drawEnemies(c);
    drawPlayer(c);
    drawEnemyBullets(c);
    drawPlayerBullets(c);
    drawOverlay(c);
    score()
    end()
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 27 && game.state == "pause") {
        game.state = 'playing'
        loopId = setInterval(mainLoop, 1000 / frames)
    } else if (game.state == "playing" && event.keyCode == 27) {
        game.state = 'pause'
        clearInterval(loopId)
    }
})

function end() {
    if (game.state == 'menu') {
        clearInterval(loopId)
        clearInterval(timerId)
        timerId = setInterval(update, 1000 / frames)
    }
}

// =========== player ============

function firePlayerBullet() {
    //create a new bullet
    playerBullets.push({
        x: player.x + 14,
        y: player.y - 7,
        width: 8,
        height: 12,
        counter: 0,
    });
}

function drawPlayer(c) {
    if (player.state == "dead") return;

    if (player.state == "hit") {
        drawPlayerExplosion(c)
        return;
    }
    c.drawImage(shipImage,
        0, 0, 24, 24, //src coords
        player.x, player.y, player.width, player.height //dst coords
    );
}

var particles = [];
function drawPlayerExplosion(c) {
    //start
    if(player.counter == 0) {
        particles = []; //clear any old values
        for(var i = 0; i<50; i++) {
            particles.push({
                    x: player.x + player.width/2,
                    y: player.y + player.height/2,
                    xv: (Math.random()-0.5)*2.0*5.0,  // x velocity
                    yv: (Math.random()-0.5)*2.0*5.0,  // y velocity
                    age: 0,
            });
        }
    }
    
    //update and draw
    if(player.counter > 0) {
        for(var i=0; i<particles.length; i++) {
            var p = particles[i];
            p.x += p.xv;
            p.y += p.yv;
            var v = 255-p.age*3;
            c.fillStyle = "rgb("+v+","+v+","+v+")";
            c.fillRect(p.x,p.y,3,3);
            p.age++;
        }
    }
};

function drawPlayerBullets(c) {
    c.fillStyle = "blue";
    for (i in playerBullets) {
        var bullet = playerBullets[i];

        //c.fillRect(bullet.x, bullet.y, bullet.width,bullet.height);
        c.drawImage(
            bullet_image,
            0, 0, 8, 8,//src
            bullet.x, bullet.y, bullet.width, bullet.height//dst
        );
    }
}

// =========== enemies ===============

function drawEnemies(c) {
    for (var i in enemies) {
        var enemy = enemies[i];
        if (enemy.state == "alive") {
            c.fillStyle = "green";
            drawEnemy(c, enemy, 15);
        }
        if (enemy.state == "hit") {
            
            player.score++;
        }
        //this probably won't ever be called.
        if (enemy.state == "dead") {
        }
    }
}


function drawEnemy(c, enemy, radius) {
    if (radius <= 0) radius = 1;
    var theta = enemy.counter;

    c.drawImage(alien, enemy.x, enemy.y, 40, 40);
}



function createEnemyBullet(enemy) {
    return {
        x: enemy.x,
        y: enemy.y + enemy.height,
        width: 10,
        height: 15,
        counter: 0,
    }
}

function drawEnemyBullets(c) {
    for (var i in enemyBullets) {
        var bullet = enemyBullets[i];
        c.drawImage(bomb_image,
            0, 0, 11, 11,//src
            bullet.x, bullet.y, bullet.width, bullet.height//dest
        );
    }
}

function score() {
    c.fillStyle = "white";
    c.font = "Bold 16pt Epson1";
    c.fillText("СЧЁТ: " + player.score, 0, 30);

    if (player.score > bestScore) {
        bestScore = player.score
    }
}

// =========== overlay ===============

function drawOverlay(c) {
    if (overlay.counter == -1) return;

    c.save();
    c.fillStyle = "white";
    c.font = "Bold 20pt Epson1";
    c.fillText(overlay.title, 165, 200);
    c.font = "8pt Epson1";
    c.fillText(overlay.subtitle, 200, 250);
    c.restore();
}

doSetup();