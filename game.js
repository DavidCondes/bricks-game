document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


const interval = setInterval(draw, 5);
const ballRadius = 10;
const paddleWidth = 70;
const paddleHeight = 10;


/*
Initial coordinates for the ball and the paddle
*/
const bx = canvas.width / 2;
const by = canvas.height - 30;
const px = (canvas.width - paddleWidth) / 2;
const py = canvas.height - paddleHeight;

const brickRowCount = 4;
const brickColumnCount = 10;
const brickWidth = 35;
const brickHeight = 35;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffSetLeft = 30;
const bricks = [];

let bricksToWon = brickRowCount * brickColumnCount;

class Brick{
    constructor(x, y, x2, y2, status){
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.status = status;
    }
}

for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = new Brick(0, 0, 0, 0, 1);
    }
}


//x, y = center
//x1, y1 = 0
//x2, y2 = 90



let ball = {
    x: bx,
    y: by,
    x1: bx - ballRadius,
    x2: bx + ballRadius,
    y1: by - ballRadius,
    y2: by + ballRadius,
    move: function() {
        this.x = this.x + dbx;
        this.y = this.y + dby;
        this.x1 = this.x - ballRadius;
        this.x2 = this.x + ballRadius;
        this.y1 = this.y + ballRadius;
        this.y2 = this.y - ballRadius;
    }
};


let paddle = {
    x: px,
    y: py,
    x2: px + paddleWidth,
    move: function(){
        if((rightPressed && this.x2 <= canvas.width) || (leftPressed && this.x >= 0)){
            this.x += dpx;
            this.x2 += dpx;
        }
    }
};


/*
Displacements
*/
let dbx = 1;
let dby = -1;
let dpx = 2;


let rightPressed = false;
let leftPressed = false;

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){

    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){

            if(bricks[c][r].status == 1){
                const brickX = c * (brickWidth + brickPadding) + brickOffSetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                bricks[c][r].x2 = brickX + brickWidth;
                bricks[c][r].y2 = brickY + brickHeight;
                
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#FFFFF";
                ctx.fill();
                ctx.closePath();
            }
            
        }
    }
}

function brickCollitionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            
            const brick = bricks[c][r];


            if(ball.x >= brick.x && ball.x <= brick.x2 && brick.status){
                if(ball.y2 == brick.y2 || ball.y1 == brick.y){
                    
                    brick.status = 0;
                    bricksToWon -= 1;
                    dby = -dby;
                }
            }
            if(ball.y <= brick.y2 && ball.y >= brick.y && brick.status){
                if(ball.x2 == brick.x || ball.x1 == brick.x2){
                    brick.status = 0;
                    bricksToWon -= 1;
                    dbx = -dbx;
                }
            }
        }
    }
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*
    if(bricksToWon === 0){
        alert("YOU HAVE WON");
        document.location.reload();
        clearInterval(interval);
    }
    */

    drawBall();
    drawPaddle();
    drawBricks();
    brickCollitionDetection();


    /*
    Horizontal walls collision detection
    */
    if(Math.round(ball.x1) == 0 || Math.round(ball.x2) == canvas.width){
        dbx = -dbx;
    }

    /*
    Upper wall collision detection1
    */
    if(ball.y2 == 0){
        dby = -dby;

    }

    /*
    Paddle collision detection
    */
    if(ball.y1 == paddle.y && ball.x >= paddle.x && ball.x <= paddle.x2){

        hitPosition = Math.trunc((ball.x - paddle.x) / 10) + 1;
        
        if(hitPosition >= 5){   
            dbx = 1 - (8 - hitPosition) * 0.25;
        }

        if(hitPosition <= 4){
            dbx = -1 - (1 - hitPosition) * 0.25;
        }


        dby = -dby;
    }


    /*
    If any key (right or left) is pressed, then move the paddle
    */
    if(rightPressed || leftPressed){
        paddle.move();
    }


    
    ball.move();

}

function keyDownHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = true;
        if (dpx < 0) dpx = -dpx;
    } else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = true;
        if (dpx > 0) dpx = -dpx;
    }
} 

function keyUpHandler(e) {
    if(e === "Right" || e.key === "ArrowRight"){
        rightPressed = false;
    } else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = false;
    }
Q}

