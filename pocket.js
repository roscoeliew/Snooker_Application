///////////////////////////POCKETS FUNCTION///////////////////////////
// Check if ball is within pocket
function isBallInPocket(ball, pocket) 
{
    var distance = dist(ball.position.x, ball.position.y, pocket.position.x, pocket.position.y);
    var threshold = (pocket.circleRadius + ball.circleRadius) / 2;
    return distance < threshold;
}

// Remove ball in pockets
function removeBallInPocket() 
{
    // Check if last pocketed ball and current pocketed ball is coloured
    for (var i = balls.length - 1; i >= 0; i--) 
    {
        var ball = balls[i];
        for (var j = 0; j < pockets.length; j++) 
        {
            if (isBallInPocket(ball, pockets[j])) 
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
        if (isBallInPocket(cueBall, pockets[j])) 
        {
            // Generate a new cue ball and position it outside the pocket
            Body.setPosition(cueBall, { x: mouseX, y: mouseY });
            Body.setVelocity(cueBall, { x: 0, y: 0 }); 
            Body.setAngularVelocity(cueBall, 0); 
            console.log("Cue Ball Pocketed");
            alert("Error: Cueball Pocketed! Please re-adjust cueball!");
            
            // Set flag
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
            if (isBallInPocket(ball, pockets[j])) 
            {
                if (ball.isRed) {
                    redBallCount--;
                    console.log("Red Ball Pocketed");
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