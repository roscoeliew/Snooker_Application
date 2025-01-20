var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter .Body;
var Events = Matter.Events;
var engine;             // The physics engine instance
// Core game variables
var cueBall; // Object representing the cue ball
var walls;   // Array to store table walls (cushions)
var balls;   // Array to store all snooker balls
var pockets; // Array to store pocket positions
var tableWidth, tableHeight; // Dimensions of the snooker table
var playingSurfaceWidth, playingSurfaceHeight;  // Dimensions of the playing surface
var cushionThickness; // Thickness of the table's cushions
var ballDiameter;     // Diameter of the snooker balls
var pocketDiameter;   // Diameter of the table pockets
var redBallCount;     // Number of red balls in the game

// Physics Implementation
var friction;    // Friction coefficient 
var restitution; // Restitution (bounciness)

// Snooker table specific measurements
var baulkLineY, baulkLineX; // Position of the baulk line
var baulkLineLength;        // Length of the baulk line
var dRadius;                // Radius of the 'D' on the baulk line
var dCenterX, dCenterY;     // Center position of the 'D'

var placingCueBall; // Flag to check if the cue ball is being placed
var lastBallPocketed; // Keeps track of the last ball pocketed
var currentMode; // Current mode/state of the game

// Force application variables
var accumulatedForce;       // Accumulated force for the cue hit
var forceCap;               // Maximum force that can be applied
var forceIncreaseRate;      // Rate at which force increases per frame
var allowForceAccumulation; // Flag to allow force accumulation

// UI elements for force application
var forceBarWidth, forceBarHeight; // Dimensions of the force bar
var forceBarMaxWidth;              // Maximum width of the force bar (for UI)
var forceBarX, forceBarY;          // Position of the force bar

var translatedX, translatedY;  // Translated X-Axis & Y-Axis

// Game timer variables
var timer;         // Timer object
var timerDuration; // Total duration of the timer
var remainingTime; // Remaining time in the timer

function setup()
{   
    createCanvas(1425, 780);    // Create Canvas
    engine = Engine.create();   // Initialise Matter.js
    engine.world.gravity.y = 0; // Set gravity to 0
    currentMode = 1;            // Starting Game Mode
    
    // Handle Collision Detection Function
    Events.on(engine, 'collisionStart', function(event) 
    {
        handleCollisions(event);
    });
 
    tableWidth = 12 * 100; // Table Width
    tableHeight = 6 * 100; // Table Height
    playingSurfaceWidth = 11.71 * 100;   // Playing Surface Width
    playingSurfaceHeight = 5.83 * 100;   // Playing Surface Height
    cushionThickness = 0.2 * 100;        // Cushion Thickness
    ballDiameter = tableWidth / 36;      // Ball Diameter
    pocketDiameter = ballDiameter * 1.5; // Pocket Diameter
    friction = 0.05;   // Friction Value
    restitution = 0.9; //Restituition value
    
    baulkLineX = 2.42 * 100;      // X-Axis of Baukline
    baulkLineY = tableHeight / 2; // Y-Axis of Baukline
    baulkLineLength = playingSurfaceHeight;  // Length of Baukline
    dRadius = (11.5 / 72) * tableHeight; // Radius for "D"
    dCenterX = baulkLineX; // X-Axis for the center of the 'D'
    dCenterY = baulkLineY; // Y-Axis for the center of the 'D'
    
    redBallCount = 15; // Total number of red balls at start
    balls = [];  // Initialize array to store snooker balls
    walls = [];  // Initialize array to store walls
    pockets = [] // Initialize array to store table pockets
    generateCueBall(ballDiameter);      // Generate the cue ball
    setupSnookerTable(pocketDiameter);  // Set up the snooker table with pockets
    generateRedBalls(ballDiameter);     // Generate red balls
    generateColourBalls(ballDiameter);  // Generate colored balls
    placingCueBall = true;    // Flag indicating that the cue ball is being placed
    lastBallPocketed = null;  // Variable to keep track of the last ball pocketed
    
    accumulatedForce = 0;  // Starting force
    forceCap = 0.1; // Maximum force that can be applied
    forceIncreaseRate = 0.01; // Rate at which force increases per frame
    allowForceAccumulation = false; // Prevent apply force
    
    forceBarWidth = 20; // Width of the force bar
    forceBarHeight = 200; // Height of the force bar
    forceBarMaxHeight = forceBarHeight; // Maximum height of the filled part
    forceBarX = cushionThickness + 20; // X position of the force bar
    forceBarY = (tableHeight - forceBarHeight) / 2; // Y position of the force bar
    
    timerDuration = 180; // Timer duration in seconds (3 minutes)
    remainingTime = 180; // Time on display
}

function draw()
{
    background(1,50,32);   // Set the background color
    Engine.update(engine); // Update the physics engine
    
    // Translate canvas
    translate(100,100);
    translatedX = mouseX - 100;
    translatedY = mouseY - 100;
    
    drawWalls();     // Draw walls
    drawBaulkLine(); // Draw Baukline
    drawSemiCircle();// Draw "D"
    drawPockets();   // Draw Pockets
    
    drawModes();     //Draw different modes
    drawCueBallPlacement(); //Draw cueball
    
    // Check if force can be applied to cueball
    if (mouseIsPressed && !placingCueBall && allowForceAccumulation) 
    {
        accumulatedForce += forceIncreaseRate;
        accumulatedForce = min(accumulatedForce, forceCap); // Cap the force
    }

}

function keyPressed()
{
    handleModes(); // Set different mode  
}

function mousePressed() 
{
    // Set the position of the cue ball to where the mouse was clicked
    if (placingCueBall)
    {
        Body.setPosition(cueBall, { x: translatedX, y: translatedY});
        placingCueBall = false;
        allowForceAccumulation = false;

        // Set a timeout to allow force accumulation after a short delay
        setTimeout(function() 
        {
            allowForceAccumulation = true;
        }, 100); 
        
        // Initialize and start the game timer
        if (currentMode === 4 && !timer)
        {
            remainingTime = timerDuration;
            timer = setInterval(updateTimer, 1000); 
        }
        return; 
    } 
    
    // Check if the cue ball is not being placed and if force accumulation is allowed
    if (!placingCueBall && allowForceAccumulation) 
    {
        accumulatedForce = 0;
    }
}

function mouseReleased() 
{
    // Apply force only if not in cue ball placing mode 
    if (!placingCueBall && isCueBallStopped()) 
    {
        var finalForceMagnitude = min(accumulatedForce, forceCap);

        // Calculate the angle from the cue ball to the mouse position
        var angle = atan2(translatedY - cueBall.position.y, translatedX - cueBall.position.x);

        // Calculate the force vector
        var forceX = finalForceMagnitude * cos(angle);
        var forceY = finalForceMagnitude * sin(angle);
        var appliedForce = { x: forceX, y: forceY };

        // Apply the force to the cue ball
        Body.applyForce(cueBall, { x: cueBall.position.x, y: cueBall.position.y }, appliedForce);

        // Reset the accumulated force
        accumulatedForce = 0;
    }
}

////////////////////REPORT//////////////////
/**The Snooker Application we developed introduces an innovative, user-friendly interface complemented by four distinct game modes. These modes include traditional gameplay, two variations with randomized ball placements, and a time-constrained challenge. This report delves into the application's functionality, highlighting the intuitive mouse-based cue system and the strategic time-limited mode featuring variable active pockets.

The application greets players with an informative pop-up containing rules and instructions, accessible anytime via the "I" key.

Regular Snooker (Mode 1): Aligns with the conventional rules, where the colored balls are set in their standard positions, and the red balls form a triangle configuration.
Randomized Balls (Modes 2 and 3): Our advanced algorithm ensures a unique setup for each session, where balls are randomly distributed across the table, avoiding overlaps and pocket placements.
Time Limit Gameplay (Mode 4): This mode introduces a race against the clock, with only three active pockets at a time and a 3-minute countdown to clear the table.

To provide an intuitive control mechanism, we've implemented a mouse-based cue system. It works by tracking the mouse's position for aim direction and responding to mouse clicks to simulate force applied to the cue ball. The visual cue for force application and directionality aids users in aligning shots with precision, thus making the gameplay intuitive and reducing the learning curve. The mouse-based cue function is especially suited for new players, as it mirrors the natural point-and-click interface familiar to computer users. The force of the shot is determined by the duration the mouse button is held down, which is visually represented by a dynamic force bar, allowing players to gauge the power behind eachshot. Additionally, a directional line extends from the cue ball towards the cursor, providing immediate visual feedback for aiming.

We've integrated realistic physics by adjusting friction on the balls and cushions, simulating the actual movement of a snooker game. This attention to detail significantly enhances the player's immersion.

The application's extension introduces a unique time-constrained mode that adds a
layer of urgency and strategic depth to the game. With a three-minute timer and only
three active pockets at any given time, players are challenged to adapt their play
style swiftly. The active pockets change position at ten-second intervals, requiring
quick thinking and precise shot planning. This mode tests not only the players'
snooker skills but also their ability to manage time effectively.

The rationale behind the extension is to offer an innovative twist on traditional
snooker, infusing the game with elements of unpredictability and time management. It compels the player to stay constantly engaged, making strategic decisions under pressure. This fast-paced mode caters to the modern gamer's appetite for quick and exciting rounds of play while still respecting the skillful art of snooker.

Additionally, we've incorporated prompts to inform players of critical events, such as the cue ball being pocketed, requiring repositioning, or consecutive colored ball pocketing, which cues an alert for the player's attention.

The Snooker Application offers a versatile and engaging experience, merging classic snooker with innovative gameplay features. **/
