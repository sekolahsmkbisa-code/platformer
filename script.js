// =====================================
// CANVAS
// =====================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =====================================
// WORLD
// =====================================
const worldWidth = 4000;
let cameraX = 0;

// =====================================
// LOAD ASSET
// =====================================
const playerImg = new Image();
playerImg.src = "./assets/playerSprite.png";

const groundImg = new Image();
groundImg.src = "./assets/ground.png";

const coinImg = new Image();
coinImg.src = "./assets/coin.png";

const enemyImg = new Image();
enemyImg.src = "./assets/enemy.png";

const heartImg = new Image();
heartImg.src = "./assets/heart.png";

// =====================================
// PLAYER
// =====================================
let player = {
    x: 120,
    y: 50,
    width: 64,
    height: 64,
    speed: 5,
    dy: 0,
    gravity: 0.6,
    jumpPower: -12,
    grounded: false
};

// =====================================
// CONTROL
// =====================================
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// =====================================
// GROUND SETTING
// =====================================
const groundDisplayHeight = 120;
const grassTop = 18;

function groundY(){
    return canvas.height - groundDisplayHeight + grassTop;
}

const groundWidth = 256;

// =====================================
// COIN
// =====================================
let coins = [
    { x: 300, y: 220, size: 40, taken:false },
    { x: 500, y: 180, size: 40, taken:false },
    { x: 700, y: 250, size: 40, taken:false }
];

let score = 0;

// =====================================
// LIFE SYSTEM
// =====================================
let lives = 3;
let gameOver = false;

// =====================================
// ENEMY
// =====================================
let enemy = {
    x: 550,
    y: 0,
    width: 64,
    height: 64,
    speed: 2,
    direction: 1,
    leftLimit: 450,
    rightLimit: 700
};

// =====================================
// COLLISION
// =====================================
function isColliding(a, b){
    return (
        a.x < b.x + b.size &&
        a.x + a.width > b.x &&
        a.y < b.y + b.size &&
        a.y + a.height > b.y
    );
}

function hitTest(a, b){
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// =====================================
// UPDATE
// =====================================
function update(){

    if(gameOver) return;

    // camera follow
    cameraX = player.x - canvas.width / 2;

    if(cameraX < 0) cameraX = 0;
    if(cameraX > worldWidth - canvas.width)
        cameraX = worldWidth - canvas.width;

    // movement
    if(keys["ArrowRight"]) player.x += player.speed;
    if(keys["ArrowLeft"]) player.x -= player.speed;

    // jump
    if(keys[" "] && player.grounded){
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    // gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // ground collision
    if(player.y + player.height >= groundY()){
        player.y = groundY() - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // world boundary
    if(player.x < 0) player.x = 0;

    if(player.x + player.width > worldWidth)
        player.x = worldWidth - player.width;

    if(player.y < 0){
        player.y = 0;
        player.dy = 0;
    }

    // enemy position update
    enemy.y = groundY() - enemy.height;

    enemy.x += enemy.speed * enemy.direction;

    if(enemy.x <= enemy.leftLimit) enemy.direction = 1;
    if(enemy.x + enemy.width >= enemy.rightLimit) enemy.direction = -1;

    // coin collect
    coins.forEach(coin => {

        if(!coin.taken && isColliding(player, coin)){
            coin.taken = true;
            score++;
        }

    });

    // enemy hit
    if(hitTest(player, enemy) && !gameOver){

        lives--;

        player.x = 120;
        player.y = 50;
        player.dy = 0;

        if(lives <= 0){
            gameOver = true;
        }
    }
}

// =====================================
// DRAW
// =====================================
function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // background
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // ground scrolling
    for(let x = 0; x < worldWidth; x += groundWidth){

        ctx.drawImage(
            groundImg,
            x - cameraX,
            canvas.height - groundDisplayHeight,
            groundWidth,
            groundDisplayHeight
        );

    }

    // coins
    coins.forEach(coin => {

        if(!coin.taken){
            ctx.drawImage(
                coinImg,
                coin.x - cameraX,
                coin.y,
                coin.size,
                coin.size
            );
        }

    });

    // enemy
    ctx.drawImage(
        enemyImg,
        enemy.x - cameraX,
        enemy.y,
        enemy.width,
        enemy.height
    );

    // player
    ctx.drawImage(
        playerImg,
        player.x - cameraX,
        player.y,
        player.width,
        player.height
    );

    // hearts
    for(let i = 0; i < lives; i++){

        ctx.drawImage(
            heartImg,
            20 + (i * 40),
            50,
            32,
            32
        );

    }

    // score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score : " + score, 20, 30);

    // game over
    if(gameOver){

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.fillText(
            "GAME OVER",
            canvas.width/2 - 180,
            canvas.height/2
        );

    }

}

// =====================================
// LOOP
// =====================================
function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// =====================================
// LOAD ASSET
// =====================================
let loaded = 0;

function assetReady(){
    loaded++;
    if(loaded === 5){
        gameLoop();
    }
}

playerImg.onload = assetReady;
groundImg.onload = assetReady;
coinImg.onload = assetReady;
enemyImg.onload = assetReady;
heartImg.onload = assetReady;
