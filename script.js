// =====================================
// CANVAS
// =====================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================================
// LOAD ASSET
// =====================================
const playerImg = new Image();
playerImg.src = "./assets/playerSprite.png";

const groundImg = new Image();
groundImg.src = "./assets/ground.png";

playerImg.onerror = () => alert("playerSprite.png tidak ditemukan!");
groundImg.onerror = () => alert("ground.png tidak ditemukan!");

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
// GROUND SETTING (MANUAL CONTROL)
// =====================================

// tinggi tanah yang tampil di layar
const groundDisplayHeight = 120;

// tinggi rumput (bagian pijakan)
const grassTop = 18;

// posisi pijakan player
const groundY =
    canvas.height - groundDisplayHeight + grassTop;

// =====================================
// UPDATE GAME
// =====================================
function update(){

    // gerak kanan
    if(keys["ArrowRight"]) player.x += player.speed;

    // gerak kiri
    if(keys["ArrowLeft"]) player.x -= player.speed;

    // lompat
    if(keys[" "] && player.grounded){
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    // gravitasi
    player.dy += player.gravity;
    player.y += player.dy;

    // collision tanah
    if(player.y + player.height >= groundY){
        player.y = groundY - player.height;
        player.dy = 0;
        player.grounded = true;
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

    // GROUND (TIDAK TERPOTONG LAGI)
    ctx.drawImage(
        groundImg,
        0,
        canvas.height - groundDisplayHeight,
        canvas.width,
        groundDisplayHeight
    );

    // PLAYER
    ctx.drawImage(
        playerImg,
        player.x,
        player.y,
        player.width,
        player.height
    );
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
// START SETELAH ASSET LOAD
// =====================================
let loaded = 0;

function assetReady(){
    loaded++;
    if(loaded === 2){
        gameLoop();
    }
}

playerImg.onload = assetReady;
groundImg.onload = assetReady;