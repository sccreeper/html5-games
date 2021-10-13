const canvas = document.getElementById("screen")
const ctx = canvas.getContext("2d");

//Game classes

class PongPlayer {
    constructor(paddlePos) {
        this.score = 0;
        this.paddlePos = paddlePos;
    }
}

class PongBall {
    constructor(startPos) {
        this.direction = Math.floor(Math.random() * 4); //Random direction, 0,3 
        this.pos = startPos;
        this.aaa = 1.0; //45 degrees
    }

    bounce(side) {

        this.aaa = (Math.floor(Math.random() * 10) + 5) / 10;

        if (side == FLOOR_CEILING) {
            switch (this.direction) {
                case NORTH_EAST:
                    this.direction = SOUTH_EAST;
                    break;
                case NORTH_WEST:
                    this.direction = SOUTH_WEST;
                    break;
                case SOUTH_EAST:
                    this.direction = NORTH_EAST;
                    break;
                case SOUTH_WEST:
                    this.direction = NORTH_WEST;
                    break;
                default:
                    break;
            }
        } else {
            switch (this.direction) {
                case NORTH_EAST:
                    this.direction = NORTH_WEST;
                    break;
                case NORTH_WEST:
                    this.direction = NORTH_EAST;
                    break;
                case SOUTH_EAST:
                    this.direction = SOUTH_WEST;
                    break;
                case SOUTH_WEST:
                    this.direction = SOUTH_EAST;
                    break;
                default:
                    break;
            } 
        }
    }

    reset() {
        this.pos = new V2(canvas.clientWidth / 2, canvas.clientHeight / 2);
        this.direction = STILL;

        setTimeout(() => {
            this.direction = Math.floor(Math.random() * 4);            
        }, respawnDelay);
    }
}

const FLOOR_CEILING = 0;
const WALLS = 1;

class BoundingBox {
    constructor(pos, rect) {
        this.x = pos.x;
        this.y = pos.y;
        this.width = rect.width;
        this.height = rect.height;
    }
}

var BB = BoundingBox;

class Line {
    constructor(startPos, endPos) {
        this.startPos = startPos;
        this.endPos = endPos;

        this.startX = startPos.x; this.endX = endPos.x;
        this.startY = startPos.y; this.endY = endPos.y;
    }
}

//Returns boolean if two boxes are intersecting
function checkBoxCollision(boxA, boxB) {

    if (!(boxA.x >= (boxB.x + boxB.width) || boxA.y >= (boxB.y + boxB.height) || (boxA.x + boxB.width) <= boxB.x || (boxA.y + boxA.height) <= boxB.y)) {
        return true;
    } else {
        return false;
    }
}

//Checks collision between a line and a box
function checkLineCollision(box, line) {
    
    //                      Vertical line                                          Horizontal line
    if ((box.x <= line.startX && (box.x + box.width) >= line.startX) || (box.y <= line.startY && (box.y + box.height) >= line.startY)) {
        return true;
    } else {
        return false;
    }

}

const HTL = 0;
const VTL = 1;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//Game variables

//Graphics
const pauseSVG = "M10 10 h 80 v 80 h -80 Z";

//Config
const framerate = 60;
const paddleIdent = 16;
const scoreIdent = 32;
const paddleDim = new Rectangle(32, 128);
const ballDim = new Rectangle(16, 16);
const paddleSpeed = 8;
const ballSpeed = 4;
const respawnDelay = 1000;
const winningScore = 10;

//Logic related
var player_one = new PongPlayer(new V2(paddleIdent, canvas.clientHeight / 2)); //left
var player_two = new PongPlayer(new V2(canvas.clientWidth - paddleIdent - paddleDim.width, canvas.clientHeight / 2)); //right
var ball = new PongBall(new V2(canvas.clientWidth / 2, canvas.clientHeight / 2));

//Directions
const NORTH_EAST = 0;
const NORTH_WEST = 1;
const SOUTH_EAST = 2;
const SOUTH_WEST = 3;
const STILL = 4;

//Game states
const PLAYING = 0;
const PAUSED = 1;
const LOADED = 2;
const FINISHED = 3;

var game_state = LOADED;
var welcome_message = "Press SPACE to start"

//https://stackoverflow.com/a/35020537/7345078
var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.code] = false; }
window.onkeydown = function(e) { pressedKeys[e.code] = true; }

//Handles input for updating the game state, pause start play etc.
function handleInput(e) {

    if (e.code == "Space") {
        if (game_state == LOADED || game_state == FINISHED) {
            game_state = PLAYING;

            player_one.score = 0;
            player_two.score = 0;

        }
        
        else if (game_state == PLAYING) game_state = PAUSED;
        else if (game_state == PAUSED) game_state = PLAYING;
    }

}

document.addEventListener("keypress", handleInput)

//Game loop

setInterval(() => {
    
    //Render game
    
    //Fill background
    drawRectangle(ctx, new Rectangle(canvas.clientWidth, canvas.clientHeight), BLACK, new V2(0, 0));

    //Draw centre line

    drawLine(ctx, DARK_GREY, 2, new V2(canvas.clientWidth / 2, 0), new V2(canvas.clientWidth / 2, canvas.clientHeight));

    //Draw paddles
    drawRectangle(ctx, paddleDim, WHITE, player_one.paddlePos); //player one
    drawRectangle(ctx, paddleDim, WHITE, player_two.paddlePos); //player two

    drawText(ctx, new V2((canvas.clientWidth / 2) - scoreIdent, 32), WHITE, player_one.score.toString(), "Helvetica", 32, true, CENTRE); //Player 1
    drawText(ctx, new V2((canvas.clientWidth / 2) + scoreIdent, 32), WHITE, player_two.score.toString(), "Helvetica", 32, true, CENTRE); //Player 1
    
    //Draw ball
    drawRectangle(ctx, ballDim, WHITE, ball.pos, true);


    //Handle main logic & tick game

    if (game_state == PLAYING) {
    
        //Ball collisions

        //L+R sides

        //var topLine = new Line(new V2(0, 0), new V2(0, canvas.clientHeight))
        //drawLine(ctx, RED, 5, topLine.startPos, topLine.endPos);

        if (ball.pos.x < 0) { //Left side (check if x < 0, if so == 1)
            //console.log(new Line(new V2(0, 0), new V2(0, canvas.clientHeight)));

            player_two.score++;

            ball.reset();

            player_one.paddlePos.y = canvas.clientHeight / 2;
            player_two.paddlePos.y = canvas.clientHeight / 2;

        } else if (ball.pos.x + ballDim.width > canvas.clientWidth) { //Right
            player_one.score++;

            ball.reset();

            player_one.paddlePos.y = canvas.clientHeight / 2;
            player_two.paddlePos.y = canvas.clientHeight / 2;
        }

        //T + B

        if (ball.pos.y < 0) { //Top (Just clamp the box Y)
            //player_two.score++;
        
            ball.pos.y = 1;

            ball.bounce(FLOOR_CEILING);

        } else if ((ball.pos.y + ballDim.height > canvas.clientHeight)) { // Bottom
            //player_one.score++;
        
            ball.pos.y = canvas.clientHeight - ballDim.height - 1;

            ball.bounce(FLOOR_CEILING);
        }


        //Player 1 + Player 2

        if (checkBoxCollision(new BoundingBox(ball.pos, ballDim), new BoundingBox(player_one.paddlePos, paddleDim))) {
            //player_one.score += 1;
            ball.bounce(WALLS);
        } else if (checkBoxCollision(new BoundingBox(ball.pos, ballDim), new BoundingBox(player_two.paddlePos, paddleDim))) {
            //player_two.score += 1;
            ball.bounce(WALLS);
        }

        //Handle input

        //Keyboard input
        if (pressedKeys["ArrowUp"] === true) {
            player_one.paddlePos.y = clamp(player_one.paddlePos.y - paddleSpeed, 0, canvas.clientHeight);
        } else if (pressedKeys["ArrowDown"] === true) {
            player_one.paddlePos.y = clamp(player_one.paddlePos.y + paddleSpeed, 0, canvas.clientHeight - paddleDim.height);
        } else if (pressedKeys["KeyW"] === true) {
            player_two.paddlePos.y = clamp(player_two.paddlePos.y - paddleSpeed, 0, canvas.clientHeight);
        } else if (pressedKeys["KeyS"] === true) {
            player_two.paddlePos.y = clamp(player_two.paddlePos.y + paddleSpeed, 0, canvas.clientHeight - paddleDim.height);
        }

        //Ball movement

        switch (ball.direction) {
            case NORTH_WEST:
                ball.pos.x -= ballSpeed; ball.pos.y -= ballSpeed * ball.aaa;
                break;
            case NORTH_EAST:
                ball.pos.x += ballSpeed; ball.pos.y -= ballSpeed * ball.aaa;
                break;
            case SOUTH_WEST:
                ball.pos.x -= ballSpeed; ball.pos.y += ballSpeed * ball.aaa;
                break;
            case SOUTH_EAST:
                ball.pos.x += ballSpeed; ball.pos.y += ballSpeed * ball.aaa;
                break;
            case STILL: break;
            default:
                break;
        }

        if (player_one.score == 10 || player_two.score == 10) {
            game_state = FINISHED
        }
    } else if (game_state == LOADED) {
        //Draw loaded state

        welcome_message = "Press SPACE to play"
        drawRectangle(ctx, new Rectangle(canvas.clientWidth, canvas.clientHeight), DARK_GREY, new V2(0, 0), true, 0.5);

        drawText(ctx, new V2(canvas.clientWidth / 2, canvas.clientHeight / 2), WHITE, welcome_message, "Arial", 64, true, CENTRE)

    } else if (game_state == PAUSED) {
        //Draw paused state
        drawRectangle(ctx, new Rectangle(canvas.clientWidth, canvas.clientHeight), DARK_GREY, new V2(0, 0), true, 0.5);

        drawImage(ctx, new V2((canvas.clientWidth / 2) - 256, (canvas.clientHeight / 2) - 256), "pause_icon");


    } else if (game_state == FINISHED) {
        //Draw finished game state
        drawRectangle(ctx, new Rectangle(canvas.clientWidth, canvas.clientHeight), DARK_GREY, new V2(0, 0), true, 0.5);

        welcome_message = (player_one.score > player_two.score) ? "Player 1 wins" : "Player 2 wins"
        
        drawText(ctx, new V2(canvas.clientWidth / 2, canvas.clientHeight / 2), WHITE, welcome_message, "Arial", 64, true, CENTRE)
        drawText(ctx, new V2(canvas.clientWidth / 2, (canvas.clientHeight / 2) + 96), WHITE, "Press SPACE to play again", "Arial", 32, true, CENTRE)

    }

}, Math.round(1000 / framerate));



