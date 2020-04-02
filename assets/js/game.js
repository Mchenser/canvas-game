var can = document.getElementById("canvas");
var c = can.getContext('2d');

player.width = 46;
player.height = 46;

var ship_image;
var bomb_image;
var bullet_image;

loadResources();

function loadResources() {
    ship_image = new Image();
    ship_image.src = "images/Hunter1.png";
    
    bomb_image = new Image();
    bomb_image.src = "images/bomb.png";
    
    bullet_image = new Image();
    bullet_image.src = "images/bullets.png";
    
}

function mainLoop() {
	var c = can.getContext('2d');

	updateGame();
	updateBackground();
	updateEnemies();
	updatePlayer();
	
	updatePlayerBullets();
	updateEnemyBullets();

	checkCollisions();
	
	drawBackground(c);
	drawEnemies(c);
	drawPlayer(c);
	drawEnemyBullets(c);
	drawPlayerBullets(c);
	drawOverlay(c);
}


// =========== player ============

function firePlayerBullet() {
	//create a new bullet
	playerBullets.push({
		x: player.x+14,
		y: player.y - 5,
		width:20,
		height:20,
		counter:0,
	});
}

function drawPlayer(c) {
    if(player.state == "dead") return;
    
    if(player.state == "hit") {
        c.fillStyle = "yellow";
        c.fillRect(player.x,player.y, player.width, player.height);
        	return;
	}
	c.drawImage(ship_image, 
	    25,1, 23,23, //src coords
	    player.x, player.y, player.width, player.height //dst coords
	    );
}

function drawPlayerBullets(c) {
	c.fillStyle = "blue";
	for(i in playerBullets) {
		var bullet = playerBullets[i];
		var count = Math.floor(bullet.counter/4);
		var xoff = (count%4)*24;
		
		//c.fillRect(bullet.x, bullet.y, bullet.width,bullet.height);
		c.drawImage(
		    bullet_image,
		    xoff+10,0+9,8,8,//src
		    bullet.x,bullet.y,bullet.width,bullet.height//dst
		    );
	}
}


// =========== background ============

function drawBackground(c) {
	c.fillStyle = "black";
	c.fillRect(0,0,can.width,can.height);
}



// =========== enemies ===============

function drawEnemies(c) {
    for(var i in enemies) {
        var enemy = enemies[i];
        if(enemy.state == "alive") {
            c.fillStyle = "green";
            drawEnemy(c,enemy,15);
        }
        if(enemy.state == "hit") {
            c.fillStyle = "purple";
            enemy.shrink--;
            drawEnemy(c,enemy,enemy.shrink);
        }
        //this probably won't ever be called.
        if(enemy.state == "dead") {
            c.fillStyle = "black";
            c.drawEnemy(c,enemy,15);
        }
    }
}

function drawEnemy(c,enemy,radius) {
    if(radius <=0) radius = 1;
    var theta = enemy.counter;        
    c.save();
    c.translate(0,30);
    //draw the background circle
    circlePath(c, enemy.x, enemy.y, radius*2);
    c.fill();
    //draw the wavy dots
    for(var i=0; i<10; i++) {
        var xoff = Math.sin(toRadians(theta+i*36*2))*radius;
        var yoff = Math.sin(toRadians(theta+i*36*1.5))*radius;
        circlePath(c, enemy.x + xoff, enemy.y + yoff, 3);
        c.fillStyle = "white";
        c.fill();
    }
    c.restore();
}
function toRadians(d) {
    return d * Math.PI * 2.0 / 360.0;
}
function circlePath(c, x, y, r) {
    c.beginPath();
    c.moveTo(x,y);
    c.arc(x,y, r, 0, Math.PI*2);    
}


function createEnemyBullet(enemy) {
    return {
        x:enemy.x,
        y:enemy.y+enemy.height,
        width:30,
        height:30,
        counter:0,
    }
}

function drawEnemyBullets(c) {
    for(var i in enemyBullets) {
        var bullet = enemyBullets[i];
        var xoff = (bullet.counter%9)*12 + 1;
        var yoff = 1;
        c.drawImage(bomb_image,
            xoff,yoff,11,11,//src
            bullet.x,bullet.y,bullet.width,bullet.height//dest
            );
    }
}





// =========== overlay ===============

function drawOverlay(c) {
    if(overlay.counter == -1) return;
    
    //fade in
    var alpha = overlay.counter/50.0;
    if(alpha > 1) alpha = 1;
    c.globalAlpha = alpha;
    
    c.save();
    c.fillStyle = "white";
    c.font = "Bold 40pt Arial";
    c.fillText(overlay.title,140,200);
    c.font = "14pt Arial";
    c.fillText(overlay.subtitle, 190,250);
    c.restore();
}

doSetup();
setInterval(mainLoop,1000/30);