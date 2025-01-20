///////////////////////////4TH MODE///////////////////////////
function randomizePocket()
{
     // Remove all existing balls 
    balls.forEach(ball => World.remove(engine.world, ball));

    // Clear the balls array
    balls = [];

    // Add red balls 
    generateRedBalls(ballDiameter);

    // Add the colored balls 
    generateColourBalls(ballDiameter);   
    activateRandomPockets();

    // Set up a timer to change pockets every 10 seconds
    setInterval(activateRandomPockets, 10000); 
}

// Random generate active pockets
function activateRandomPockets() 
{
    // Reset all pockets to inactive
    pockets.forEach(pocket => pocket.isActive = false);

    // Randomly select three pockets and activate them
    let activePockets = [];
    while (activePockets.length < 3) 
    {
        let randomIndex = Math.floor(Math.random() * pockets.length);
        if (!activePockets.includes(randomIndex)) 
        {
            activePockets.push(randomIndex);
            pockets[randomIndex].isActive = true;
        }
    }
}

// Draw active pockets
function drawActivePockets() 
{
    for (var i = 0; i < pockets.length; i++) 
    {
        var pocket = pockets[i];
        var pocketRadius = pocket.circleRadius * 2;

        // Check if the pocket is active
        if (pocket.isActive)
        {
            // Draw green outline for active pockets
            stroke(0, 255, 0); 
            strokeWeight(3); 
        } 
        else 
        {
            noStroke(); 
        }

        fill(0); 
        ellipse(pocket.position.x, pocket.position.y, pocketRadius, pocketRadius); 
    }
}

// Remove balls in active pockets
function removeBallInActivePocket() 
{
    // Check if last pocketed ball and current pocketed ball is coloured
    for (var i = balls.length - 1; i >= 0; i--) 
    {
        var ball = balls[i];
        for (var j = 0; j < pockets.length; j++) 
        {
            if (pockets[j].isActive && isBallInPocket(ball, pockets[j]))
            {
                console.log("Last ball pocketed:", lastBallPocketed);
                if (ball.isColoredBall) {
                    if (lastBallPocketed && lastBallPocketed.isColoredBall) 
                    {
                        // Trigger error prompt
                        console.log("Error: Colored balls pocketed consecutively!");
                        alert("Error: Colored balls pocketed consecutively!");
                    }
                    // Set lastBallPocketed to the current ball
                    lastBallPocketed = ball;
                } 
                else 
                {
                    lastBallPocketed = null; // Reset if the pocketed ball is not colored
                }

            }
        }
    }
    
    // Check if cueball is pocketed
    for (var j = 0; j < pockets.length; j++) 
    {
        if (pockets[j].isActive && isBallInPocket(cueBall, pockets[j]))
        {
            // Generate a new cue ball and position it outside the pocket
            Body.setPosition(cueBall, { x: mouseX, y: mouseY });
            Body.setVelocity(cueBall, { x: 0, y: 0 }); 
            Body.setAngularVelocity(cueBall, 0); 
            console.log("Cue Ball Pocketed");
            alert("Error: Cueball Pocketed! Please re-adjust cueball!");
            
            placingCueBall = true;
            break;
        }
    }
    
    // Check if redball/colourball are pocketed
    for (var i = balls.length - 1; i >= 0; i--) 
    {
        var ball = balls[i];
        for (var j = 0; j < pockets.length; j++) 
        {
            if (pockets[j].isActive && isBallInPocket(ball, pockets[j]))
            {
                if (ball.isRed) {
                    redBallCount--;
                }

                if (ball.isColoredBall && redBallCount > 0) 
                {
                    // Reset colored ball to its starting position
                    Body.setPosition(ball, ball.startingPosition);
                    Body.setVelocity(ball, { x: 0, y: 0 }); 
                    Body.setAngularVelocity(ball, 0); 
                    console.log(ball.name + "Ball Pocketed");
                } 
                else 
                {
                    // Remove the ball if it's not a colored ball or if no red balls are left
                    World.remove(engine.world, ball); 
                    balls.splice(i, 1); 
                }
                break; 
            }
        }
    }
}

// Display time in console 
function updateTimer() {
    remainingTime--;
    console.log("Time remaining: " + remainingTime + " seconds");
    
    //Trigger alert
    if (remainingTime <= 0) {
        endTimer();
    }
}

// Check array when time ends
function endTimer() {
    clearInterval(timer);
    console.log("Time's up!");

    if (balls.length === 0) {
        alert("You win!");
    } else {
        alert("Game Over");
    }
}

//Draw timer box
function drawTimerBox() {
    fill(255); 
    stroke(0); 
    strokeWeight(2); 

    // Positioning the timer box 
    var timerBoxX = tableWidth / 2; // X Position
    var timerBoxY = 30;  // Y Position
    var timerBoxWidth = 120; // Width of the box
    var timerBoxHeight = 40; // Height of the box

    rect(timerBoxX - 60, timerBoxY - 100 , timerBoxWidth, timerBoxHeight);

    // Display remaining time inside the box
    var minutes = Math.floor(remainingTime / 60);
    var seconds = remainingTime % 60;
    var timeText = nf(minutes, 2) + ":" + nf(seconds, 2); // Format: MM:SS

    fill(0); 
    textSize(20); 
    textAlign(CENTER, CENTER); 
    text(timeText, timerBoxX - 60 + timerBoxWidth / 2, timerBoxY - 100 + timerBoxHeight / 2);
}