///////////////////////////CUEBALL FUNCTION///////////////////////////
// Create a new physics body for the cue ball
function generateCueBall(ballDiameter) 
{
    cueBall = Bodies.circle(mouseX, mouseY, ballDiameter / 2, { restitution: restitution, friction: friction });
    World.add(engine.world, cueBall);
}

// Draw cueball
function drawCueBall() 
{
    fill(255); // Color for cue ball
    ellipse(cueBall.position.x, cueBall.position.y, 30, 30); // Draw the cue ball
}

// Reset cueball position
function resetCueBall() 
{
    placingCueBall = true; 
    translatedX = mouseX - 100; 
    translatedY = mouseY - 100; 
    Body.setPosition(cueBall, { x: translatedX, y: translatedY });
    Body.setVelocity(cueBall, { x: 0, y: 0 });
    Body.setAngularVelocity(cueBall, 0);
}

// Check if cueball is stopped
function isCueBallStopped() 
{
    var velocity = cueBall.velocity;
    var speedThreshold = 0.05; // A small threshold value

    // Check if both x and y components of the velocity are less than the threshold
    return (Math.abs(velocity.x) < speedThreshold && Math.abs(velocity.y) < speedThreshold);
}

// Cue indicator
function drawForceLine() 
{
    // Calculate the distance between the cue ball and the mouse cursor
    var distance = dist(cueBall.position.x, cueBall.position.y, translatedX, translatedY);

    // Use the distance as the line length
    var lineLength = distance;
    
    var angle = atan2(translatedY - cueBall.position.y, translatedX- cueBall.position.x);

    // Calculate the start point of the line based on the angle and length
    var startX = cueBall.position.x + lineLength * cos(angle);
    var startY = cueBall.position.y + lineLength * sin(angle);

    // Set the stroke color and draw the line
     stroke(255, 255, 255, 100);  
    line(cueBall.position.x, cueBall.position.y, startX, startY);
}

// Draw force bar indicator
function drawForceBar() 
{
    fill(255, 255, 255, 100);
    rect(forceBarX, forceBarY, forceBarWidth, forceBarHeight);
    
    if(isCueBallStopped())
        {
        var filledHeight = map(accumulatedForce, 0, forceCap, 0, forceBarMaxHeight);
        fill(0, 255, 0); 
        rect(forceBarX, forceBarY + forceBarHeight - filledHeight, forceBarWidth, filledHeight);
        }
}

// Check if able to place cueball else hover
function drawCueBallPlacement() 
{
    if (placingCueBall) 
    {
        fill(255); 
        ellipse(translatedX, translatedY, ballDiameter, ballDiameter);
    } 
    else
    {
        drawCueBall();
        drawForceLine();
        drawForceBar();
    } 
}
