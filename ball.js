///////////////////////////GENERATE BALL///////////////////////////
// Create a new physics body for the red ball
function generateRedBalls(ballDiameter) 
{
    var redBalls = [];
    var baseRowX = playingSurfaceWidth * 0.75; // X-coordinate 
    var ballSpacing = ballDiameter; // Spacing between balls
    
    // Create 5 rows of red balls in a triangle formation
    for (var row = 0; row < 5; row++) 
    {
        var offsetY = (row * ballDiameter) / 2; // Offset each row to form a triangle
        var x = baseRowX + row * ballSpacing; // Position each row to the left of the previous

        for (var col = 0; col <= row; col++) 
        {
            var y = tableHeight / 2 + offsetY - (col * ballDiameter);
            var redBall = Bodies.circle(x, y, ballDiameter / 2, { restitution: restitution, friction: friction });
            redBall.isRed = true;
            redBall.color = [255, 128, 128];
            redBalls.push(redBall);
        }
    }

    World.add(engine.world, redBalls);
    balls = balls.concat(redBalls); 
}

// Create a new physics body for the colour ball
function generateColourBalls(ballDiameter) 
{
    var colourBalls = [];

    // Yellow Ball - Positioned at the top of the vertical baulk line
    var yellowBall = Bodies.circle(baulkLineX, baulkLineY - (0.96*100), ballDiameter / 2, { restitution: restitution, friction: friction });
    yellowBall.color = [255, 255, 128];
    yellowBall.name = "Yellow";
    colourBalls.push(yellowBall);

    // Green Ball - Positioned at the bottom of the vertical baulk line
    var greenBall = Bodies.circle(baulkLineX, baulkLineY + (0.96*100), ballDiameter / 2, { restitution: restitution, friction: friction });
    greenBall.color = [128, 255, 128];
    greenBall.name = "Green";
    colourBalls.push(greenBall);

    // Brown Ball - Positioned at the midpoint of the vertical baulk line
    var brownBall = Bodies.circle(baulkLineX, baulkLineY, ballDiameter / 2, { restitution: restitution, friction: friction });
    brownBall.color = [210, 180, 140];
    brownBall.name = "Brown";
    colourBalls.push(brownBall);

    // Blue Ball - Center of the table
    var blueBall = Bodies.circle(tableWidth / 2, tableHeight / 2, ballDiameter / 2, { restitution: restitution, friction: friction });
    blueBall.color = [173, 216, 230];
    blueBall.name = "Blue";
    colourBalls.push(blueBall);

    // Pink Ball - Midway between the center of the table and the top cushion
    var pinkBall = Bodies.circle(playingSurfaceWidth * 0.75 - ballDiameter, tableHeight / 2 , ballDiameter / 2, { restitution: restitution, friction: friction });
    pinkBall.name = "Pink";
    pinkBall.color = [255, 182, 193];
    colourBalls.push(pinkBall);

    // Black Ball - Positioned near the top cushion
    var blackBall = Bodies.circle(playingSurfaceWidth - (1.067*100), tableHeight / 2, ballDiameter / 2, { restitution: restitution, friction: friction });
    blackBall.name = "Black";
    blackBall.color = [192, 192, 192];
    colourBalls.push(blackBall);
    
    colourBalls.forEach(ball => 
                        {
        ball.isColoredBall = true;
        ball.startingPosition = { x: ball.position.x, y: ball.position.y };
    });

    World.add(engine.world, colourBalls);
    balls = balls.concat(colourBalls);
}

///////////////////////////1ST MODE///////////////////////////
function setupStartingPosition() 
{
    // Remove all existing balls 
    balls.forEach(ball => World.remove(engine.world, ball));

    // Clear the balls array
    balls = [];

    // Regenerate and add all balls to the Matter.js world
    generateRedBalls(ballDiameter);
    generateColourBalls(ballDiameter);
    placeRedBallsInTriangle();
    resetColourBallsToStartingPositions();
}

// Red ball position in a triangle formation
function placeRedBallsInTriangle() 
{
    var baseRowX = playingSurfaceWidth * 0.75;
    var ballSpacing = ballDiameter;
    
    for (var row = 0, idx = 0; row < 5; row++) 
    {
        var offsetY = (row * ballDiameter) / 2;

        for (var col = 0; col <= row; col++, idx++) 
        {
            if (idx < balls.length && balls[idx].isRed) 
            {
                var x = baseRowX + row * ballSpacing;
                var y = tableHeight / 2 + offsetY - (col * ballDiameter);
                Body.setPosition(balls[idx], { x: x, y: y });
                Body.setVelocity(balls[idx], { x: 0, y: 0 });
                Body.setAngularVelocity(balls[idx], 0); 
            }
        }
    }
}

// Iterate over the balls array and reset each coloured ball to its starting position
function resetColourBallsToStartingPositions() 
{
    
    balls.forEach(ball => {
        if (ball.isColoredBall) 
        {
            Body.setPosition(ball, ball.startingPosition);
            Body.setVelocity(ball, { x: 0, y: 0 }); // Reset velocity
            Body.setAngularVelocity(ball, 0); // Reset angular velocity
        }
    });
}

///////////////////////////2ND MODE///////////////////////////
// All balls in random position
function randomizeAllBallsPosition() 
{
    balls.forEach(ball => World.remove(engine.world, ball));
    balls = [];
    generateRedBalls(ballDiameter);
    generateColourBalls(ballDiameter);
    
    for (let ball of balls) 
    {
        let position;

        do 
        {
            position = generateRandomPosition();
        } while (isOverlappingWithOtherBallsOrPockets(position, ballDiameter));

        Body.setPosition(ball, position);
    }
}

//Generate random position
function generateRandomPosition() 
{
    let minX = cushionThickness + ballDiameter / 2;
    let maxX = playingSurfaceWidth - cushionThickness - ballDiameter / 2;
    let minY = cushionThickness + ballDiameter / 2;
    let maxY = playingSurfaceHeight - cushionThickness - ballDiameter / 2;

    let x = random(minX, maxX);
    let y = random(minY, maxY);

    return { x: x, y: y };
}

// Check if ball overlaps with other matter
function isOverlappingWithOtherBallsOrPockets(position, diameter) 
{
    for (let otherBall of balls) {
        if (dist(position.x, position.y, otherBall.position.x, otherBall.position.y) < diameter) 
        {
            return true; // Overlap with another ball
        }
    }

    for (let pocket of pockets) 
    {
        if (dist(position.x, position.y, pocket.position.x, pocket.position.y) < diameter / 2 + pocket.circleRadius) 
        {
            return true; // Overlap with a pocket
        }
    }

    return false;
}

// Draw balls 
function drawBalls()
{
    for (var i = 0; i < balls.length; i++) 
    {
        var ball = balls[i];
        fill(ball.color);
        ellipse(ball.position.x, ball.position.y, 30, 30);
    }
}

///////////////////////////3RD MODE///////////////////////////
// Only red balls in random position
function randomizeRedBallsPosition() 
{
    balls.forEach(ball => World.remove(engine.world, ball));
    balls = [];
    generateRedBalls(ballDiameter);

    // Add the colored balls back without randomizing their positions
    generateColourBalls(ballDiameter);

    // Only randomize position for red balls
    for (let ball of balls) 
    {
        if (ball.isRed)
        {
            let position;
            do 
            {
                position = generateRandomPosition();
            } while (isOverlappingWithOtherBallsOrPockets(position, ballDiameter));

            Body.setPosition(ball, position);
        }
    }
}