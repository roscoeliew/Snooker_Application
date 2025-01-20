// Draw different visual mode
function drawModes() 
{
    if (currentMode === 1) 
    {
        drawBalls();
        removeBallInPocket();
    } 
    else if (currentMode === 2) 
    {
        // Draw for mode 2
        drawBalls();
        removeBallInPocket();
    }
    else if (currentMode === 3) 
    {
        // Draw for mode 3
        drawBalls();
        removeBallInPocket();
    }
    else if (currentMode === 4) 
    {
        drawBalls();
        drawActivePockets();
        removeBallInActivePocket();
        drawTimerBox();
    }
}

// Change the game mode based on the key pressed
function handleModes()
{
    if (key === '1') 
    {
        currentMode = 1;
        console.log("Switched to Regular Snooker Mode");
        resetCueBall();
        setupStartingPosition(); 

    }
    else if (key === '2') 
    {
        currentMode = 2;
        console.log("Switched to Randomized Balls Mode");
        resetCueBall();
        randomizeAllBallsPosition(); 
    } 
    else if (key === '3') 
    {
        currentMode = 3;
        console.log("Switched to Randomized Red Balls Mode");
        resetCueBall();
        randomizeRedBallsPosition();
    }
    else if (key === '4') 
    {
        currentMode = 4;
        console.log("Switched to Time Limit Gameplay Mode"); 
        resetCueBall();
        randomizePocket();
    }
}