///////////////////////////COLLISION DETECTION///////////////////////////
// Check for Collision
function handleCollisions(event) {
    var pairs = event.pairs;

    for (var i = 0; i < pairs.length; i++) {
        var bodyA = pairs[i].bodyA;
        var bodyB = pairs[i].bodyB;

        if (isCueBall(bodyA) || isCueBall(bodyB)) {
            var other = isCueBall(bodyA) ? bodyB : bodyA;
            var collisionType = identifyCollisionType(other);
            displayCollisionPrompt(collisionType);
        }
    }
}

// Check for other body
function identifyCollisionType(otherBody) {
    if (isRedBall(otherBody)) {
        return 'red ball';
    } else if (isColoredBall(otherBody)) {
        return 'colored ball';
    } else if (isCushion(otherBody)) {
        return 'cushion';
    } else if (isPocket(otherBody)) {
        return 'pocket';
    }
    return 'unknown';
}

//Print Collision on console
function displayCollisionPrompt(collisionType) {
    let message = 'Cue ball collided with ';

    switch (collisionType) {
        case 'red ball':
            message += 'a red ball.';
            break;
        case 'colored ball':
            message += 'a colored ball.';
            break;
        case 'cushion':
            message += 'a cushion.';
            break;
        case 'pocket':
            message += 'a pocket.';
            break;
        default:
            message += 'an unknown object.';
    }
    console.log(message);
}

// Check for body
function isCueBall(body) 
{
    return body === cueBall;
}

function isRedBall(body) 
{

    return balls.includes(body) && body.isRed;
}

function isColoredBall(body) 
{

    return balls.includes(body) && body.isColoredBall;
}

function isCushion(body)
{

    return walls.includes(body);
}

function isPocket(body)
{
    return body.isSensor;
}