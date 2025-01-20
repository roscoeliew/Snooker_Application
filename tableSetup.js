function setupSnookerTable() 
{
    // Create walls/cushions
    let leftCushion = Bodies.rectangle(cushionThickness / 2, tableHeight / 2, cushionThickness, tableHeight, {isStatic: true, restitution: restitution, friction: friction});
    let rightCushion = Bodies.rectangle(tableWidth - cushionThickness / 2, tableHeight / 2, cushionThickness, tableHeight, {isStatic: true, restitution: restitution, friction: friction});
    let topCushion = Bodies.rectangle(tableWidth / 2, cushionThickness / 2, tableWidth, cushionThickness, {isStatic: true, restitution: restitution, friction: friction});
    let bottomCushion = Bodies.rectangle(tableWidth / 2, tableHeight - cushionThickness / 2, tableWidth, cushionThickness, {isStatic: true, restitution: restitution, friction: friction});

    walls.push(leftCushion, rightCushion, topCushion, bottomCushion);

    // Add to the world
    World.add(engine.world, walls);

    // Positions for corner pockets
    let cornerPositions = 
    [
        { x: pocketDiameter / 2, y: pocketDiameter / 2 }, // Top left
        { x: tableWidth - pocketDiameter / 2, y: pocketDiameter / 2 }, // Top right
        { x: pocketDiameter / 2, y: tableHeight - pocketDiameter / 2 }, // Bottom left
        { x: tableWidth - pocketDiameter / 2, y: tableHeight - pocketDiameter / 2 } // Bottom right
    ];

    // Positions for middle pockets
    let middlePositions = 
    [
        { x: tableWidth / 2, y: pocketDiameter / 2 }, // Middle top
        { x: tableWidth / 2, y: tableHeight - pocketDiameter / 2 } // Middle bottom
    ];

    cornerPositions.forEach(pos => 
                            {
        let pocket = Bodies.circle(pos.x, pos.y, pocketDiameter / 2, { isStatic: true, isSensor: true });
        pockets.push(pocket);
        World.add(engine.world, pocket);
    });
    
    middlePositions.forEach(pos => 
                            {
        let pocket = Bodies.circle(pos.x, pos.y, pocketDiameter / 2, { isStatic: true, isSensor: true });
        pockets.push(pocket);
        World.add(engine.world, pocket);
    });

}

function drawPockets() 
{
    fill(0);
    noStroke(); 
    for (var i = 0; i < pockets.length; i++) 
    {
        let pocket = pockets[i];
        let shadowOffset = 3; 
        let pocketRadius = pocket.circleRadius * 2;

        // Draw shadow for the pocket
        fill(0, 0, 0, 50); 
        ellipse(pocket.position.x + shadowOffset, pocket.position.y + shadowOffset, pocketRadius, pocketRadius);

        // Draw the pocket
        fill(0); 
        ellipse(pocket.position.x, pocket.position.y, pocketRadius, pocketRadius);
    }
}

function drawVertices(vertices)
{
    beginShape();
    for(var i=0;i<vertices.length;i++)
        {
            vertex(vertices[i].x,vertices[i].y)
        }
    endShape(CLOSE);
}

function drawWalls() 
{
    fill(101, 67, 33); 
    stroke(100); 
    strokeWeight(2); 


    for (var i = 0; i < walls.length; i++) {
        // Shadow settings
        let offsetX = 5; 
        let offsetY = 5; 
        let shadowColor = color(0, 0, 0, 50); 

        // Draw shadow first
        fill(shadowColor);
        noStroke(); 
        beginShape();
        walls[i].vertices.forEach(v => {
            vertex(v.x + offsetX, v.y + offsetY);
        });
        endShape(CLOSE);

        // Draw the cushion on top of the shadow
        fill(125); 
        stroke(100); 
        drawVertices(walls[i].vertices);
    }
} 

function drawBaulkLine() 
{
    stroke(255); 
    line(baulkLineX, cushionThickness , baulkLineX, tableHeight - cushionThickness); 
}

// Draw the semi-circle (the "D")
function drawSemiCircle() 
{
    noFill(); 
    stroke(255); 
    strokeWeight(2); 
    arc(dCenterX, dCenterY, 2 * dRadius, 2 * dRadius, PI/2, 3*PI/2);
}
