// Author: Matt Nguyen
// Class: CPSC332
// Assignment: Homework 5
// Last Modified: 11/07/2022

var color1 = "#e76f51";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    // things I've added
    var paused = false;
    var ballSpeedMultiplier = 1;
    var highScore  = 0;
    var animFrameId;
    // end 

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            //TODO: draw message on the canvas
                            // alert("YOU WIN, CONGRATS!");
                            ctx.font = "24px Arial";
                            ctx.fillStyle = color1;
                            ctx.fillText("Game Paused; You Win!",  canvas.width/2, (canvas.height/2));
                            //TODO: pause game instead of reloading
                            // document.location.reload();
                            pause = true;
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    // alert("GAME OVER");
                    ctx.font = "24px Arial";
                    ctx.fillStyle = color1;
                    ctx.fillText("Game Paused; You Lose :(",  canvas.width/2, (canvas.height/2));
                    //TODO: pause game instead of reloading
                    // document.location.reload();
                    paused = true;
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        x += ballSpeedMultiplier*dx;
        y += ballSpeedMultiplier*dy;


        //TODO: pause game check
        console.log(paused);
        
        if(!paused)
            animFrameId = requestAnimationFrame(draw);
        else if(paused)
            cancelAnimationFrame(animFrameId);
        
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game variable            
    //high score tracking variables
    //other variables?            

    //event listeners added   
          
    //pause game event handler 
    const pauseBtn = document.getElementById("pause-game");
    pauseBtn.addEventListener("click", togglePauseGame);
           
    //start a new game event handler      
    const newGameBtn = document.getElementById("new-game");
    newGameBtn.addEventListener("click", startNewGame);   

    //continue playing
    const contBtn = document.getElementById("cont-playing");
    contBtn.addEventListener("click", continuePlaying);

    //reload click event listener   
    const reloadBtn = document.getElementById("reload-window");
    reloadBtn.addEventListener("click", () => {
        document.location.reload();
    });
    // end reload window    

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("High Score: " + highScore, canvas.width/2, (canvas.height/2) - 140);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //adding shadows
        ctx.shadowColor = "black";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        //draw the rectangle menu backdrop
        ctx.fillStyle = "#2a9d8f";
        ctx.fillRect(20, 20, 440, 280);

        //draw the menu header
        ctx.font = "50px Belleza";
        ctx.fillStyle = "#e9c46a";
        ctx.textAlign = "center";
        ctx.fillText("Breakout Game", canvas.width/2, (canvas.height/2) - 80);
        
        //start game button area
        ctx.fillStyle = "#e9c46a";
        ctx.fillRect((canvas.width/2) - 100, (canvas.height/2) - 40, 200, 60);

        //adding shadows
        ctx.shadowColor = "black";
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.font = "30px Belleza";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("Start Game", (canvas.width/2), (canvas.height/2));

        //event listener for clicking start
        canvas.addEventListener('click', startGameClick)
        adjustGameSpeed();

        //need to add it here because the menu should be able to come back after 
        //we remove it later                
    }

    //function used to set shadow properties
    function setShadow() {

    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {

    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game    
        // canvas.removeEventListener('click', startGameClick);           
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        // coordinates of start button
        var boxXStartCoord = (canvas.width/2) - 100;
        var boxYStartCoord = (canvas.height/2) - 40;
        var boxXEndCoord = 200;
        var boxYEndCoord = 60;

        var xVal = event.pageX - canvas.offsetLeft;
        var yVal = event.pageY - canvas.offsetTop;

        if (yVal > boxYStartCoord && xVal > boxXStartCoord && yVal < (boxYStartCoord + boxYEndCoord) 
            && xVal < (boxXStartCoord + boxXEndCoord)) {
                draw();
                console.log(xVal, yVal);
        } 
        else {
            console.log("out of button bounds");
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        var slider = document.getElementById("game-speed");
        var output = document.getElementById("slider-value");

        output.innerHTML = slider.value;
        slider.oninput = function() {
            output.innerHTML = this.value;
            ballSpeedMultiplier = this.value;
        }               
    };

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        if(!paused) {
           paused = true;
        }
        else if(paused) {
           paused = false;
        }
        
        // console.log(paused)
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {

    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        resetBoard();
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {

    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        //reset paddle position
        // drawPaddle();
        // //reset bricks    
        // drawBricks();
        // //reset ball
        // drawBall();

        //reset score/high-score and lives  
        highScore = 0;
        score = 0;
        lives = 3;    
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    };

    //draw the menu.
    //we don't want to immediately draw... only when we click start game          
    drawMenu(); 


};//end window.onload function