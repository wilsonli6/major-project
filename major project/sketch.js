/* eslint-disable no-mixed-spaces-and-tabs */
// Wilson Li
// March 25th, 2019
//Soccer Ball Assignment

let player, bigPlayer, playerHeight, playerWidth, playerX, playerY, playerImage;
let state, ability, fastAbility, tallAbility, strongAbility, shootingAbility;
let cellPictureHeight, cellPictureWidth;
let txt;
let gridSize = 2;
let cellSize;
let xOffset, yOffset;
let playButton, buttonX, buttonY, buttonWidth, buttonHeight, buttonScalar;
let soccerBall, soccerBallX, soccerBallY, soccerBallWidth, soccerBallHeight, soccerBallScalar, soccerBallRadius;
let soccerBallSpeedX, soccerBallSpeedY;
let soccerNet, soccerGoal, soccerNetX, soccerNetY, soccerGoalX, soccerGoalY, soccerNetWidth, soccerNetHeight, soccerNetScalar, netBoundary;
let backgroundImage;
let directionOfMovement;
let gravity, acceleration, xVelocity, yVelocity, ground;
let xcoord, ycoord;
let song, march, toccata;
let rotation = 0;

function preload() {
  //load images
  soccerBall = loadImage("assets/soccerBall.png");
  playButton = loadImage("assets/playButton.png");
  soccerNet = loadImage("assets/net.png");
  soccerGoal = loadImage("assets/goal.png");

  // I organized the player into one object to make it easier to manage
  player = {
    kickingRight: loadImage("assets/kickingLeft.png"),
    kickingLeft: loadImage("assets/kickingRight.png"),
    facingLeft: loadImage("assets/standing.png"),
    facingRight: loadImage("assets/standing.png")
  };

  //big player for tall ability
  bigPlayer = {
    kickingRight: loadImage("assets/statureRight.png"),
    kickingLeft : loadImage("assets/statureLeft.png"),
    facingLeft: loadImage("assets/stature.png"),
    facingRight: loadImage("assets/stature.png")
  };

  //Images for the start screen
  fastAbility = loadImage("assets/fast.png");
  tallAbility = loadImage("assets/tall.png");
  strongAbility = loadImage("assets/strong.png");
  shootingAbility = loadImage("assets/shoot.png");

  //Song
  soundFormats("mp3");
  song = loadSound("assets/music.mp3");
  toccata = loadSound("assets/toccata.mp3");
  march = loadSound("assets/march.mp3");
}

function setup() {
  song.setVolume(1);
  toccata.setVolume(1);
  march.setVolume(1);

  createCanvas(windowWidth, windowHeight);
  backgroundImage = loadImage("assets/field.png");
  //determine start screen measurements
  state = "startScreen";
  buttonX = width/2;
  buttonY = height/2;
  buttonHeight = windowHeight/3.5;
  buttonWidth = windowWidth/5;

  //soccer ball measurements
  soccerBallRadius = windowHeight/15;
  soccerBallHeight = soccerBallRadius *2;
  soccerBallWidth = soccerBallRadius *2;
  soccerBallX = width/2;
  ground = height - soccerBallRadius;
  soccerBallY = ground;
  soccerBallSpeedX = 0;
  soccerBallSpeedY = 0;
  gravity = 0.3;
  acceleration = 0;
  yVelocity = 0;
  xVelocity = 0;

  //soccer net measurements
  soccerNetScalar = 10;
  soccerNetHeight = windowHeight/1.95;
  soccerNetWidth = windowWidth/6;
  soccerNetX = width - soccerNetWidth/2;
  soccerNetY = height - soccerNetHeight/2;
  soccerGoalX = 0 + soccerNetWidth/2;
  soccerGoalY = height - soccerNetHeight/2;

  //player measurements
  playerHeight = windowHeight/3;
  playerWidth = windowWidth/8;
  playerX = width - playerWidth*7;
  playerY = height - playerHeight/2;
  directionOfMovement = "right"; 
  playerImage = player.facingRight;

  //startscreen measurements
  backgroundImage = loadImage("assets/stadium.png");
  txt = "🔥Select Your Ability🔥";
  cellSize = 150;
  xOffset = width/2.5;
  yOffset = height/3;
  cellPictureWidth = cellSize;
  cellPictureHeight = cellSize;

}

function draw() {
  background(220);
  xcoord = floor((mouseX-xOffset)/cellSize);
  ycoord = floor((mouseY-yOffset)/cellSize);
  playMusic();

  if (state === "startScreen") {
    checkCursor();
    image(backgroundImage, 0, 0, width, height);
    displayText();
    translate(xOffset, yOffset);
    displayGrid();
    displayAbilities();
  }
  if (state === "clickPlay") {
    displayMenu();
    checkCursor();
    playerX = width - playerWidth*7;
    playerY = height - playerHeight/2;
    soccerBallX = width/2;
    soccerBallY = ground;
    xVelocity = 0;
    acceleration = 0;
  }
  if (state === "playSoccer") {
    noCursor();
    imageMode(CORNER);
    image(backgroundImage, 0, 0, windowWidth, windowHeight);
    netBoundary = line(windowWidth, windowHeight/2, windowWidth/1.2, windowHeight/2.05);
    displayPlayer();
    displayBall();
    displayNet();
    movePlayer();
    animatePlayer();
    ballIsKicked();
    ballGravity();
    boundaries();
    goalScored();

  }
}

function mousePressed() {
  if (state === "clickPlay") {
    if (clickedOnButton(mouseX, mouseY)) {
      state = "playSoccer";
    }
  }

  else if (state === "startScreen") {
    if (xcoord === 0 && ycoord === 0) {
      state = "clickPlay";
      ability = "fast";
      playerImage = player.facingRight;
    }

    else if (xcoord === 0 && ycoord === 1) {
      state = "clickPlay";
      ability = "strong";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 0) {
      state = "clickPlay";
      ability = "shoot";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 1) {
      state = "clickPlay";
      ability = "tall";
      playerImage = bigPlayer.facingRight;
    }
  }
}

function clickedOnButton(x, y) {
  return x >= buttonX - buttonWidth/2 &&
				  x <= buttonX + buttonWidth/2 &&
				  y >= buttonY - buttonHeight/2 &&
          y <= buttonY + buttonHeight/2;
}

function checkCursor() {
  if (mouseX >= buttonX &&
    mouseX <= buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonHeight) {
    cursor("pointer");
  }

  else {
    cursor(ARROW);
  }

  if (xcoord >= 0 && xcoord <= 1 && ycoord >= 0 && ycoord <= 1) {
    cursor("pointer");
  }

  else {
    cursor(ARROW);
  }
}

function displayMenu() {
  imageMode(CENTER);
  image(playButton, buttonX, buttonY, buttonWidth, buttonHeight);
}

function displayBall() {
  imageMode(CENTER);

  if (xVelocity > 0) {
    rotation += 0.5; // value of constant rotation
  }
  else if (xVelocity < 0) {
    rotation -= 0.5;
  }
  push();
  translate(soccerBallX, soccerBallY);
  rotate(rotation * PI / 16);
  image(soccerBall, 0, 0, soccerBallWidth, soccerBallHeight);
  translate(0, 0);
  pop();

}

function displayNet() {
  imageMode(CENTER);
  image(soccerNet, soccerNetX, soccerNetY, soccerNetWidth, soccerNetHeight);
  image(soccerGoal, soccerGoalX, soccerGoalY, soccerNetWidth, soccerNetHeight);
}

function displayPlayer() {
  imageMode(CENTER);
  if (ability === "tall") {
    image(playerImage, playerX, playerY, playerWidth*1.25, playerHeight*1.8);
  }
  else {
    image(playerImage, playerX, playerY, playerWidth, playerHeight);
  }
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    if (ability === "fast") {
      playerX -= 15;
    }
    else {
      playerX -= 10;
    }
    directionOfMovement = "left";
    if (ability === "tall") {
      playerImage = bigPlayer.facingLeft;
    }
    else {
      playerImage = player.facingLeft;
    }
  }

  if (keyIsDown(RIGHT_ARROW)) {
    if (ability === "fast") {
      playerX += 15;
    }
    else {
      playerX += 10;
    }
    directionOfMovement = "right";
    if (ability === "tall") {
      playerImage = bigPlayer.facingRight;
    }
    else {
      playerImage = player.facingRight;
    }
  }
}

function stopKicking() {
  if (directionOfMovement === "left") {
    if (ability === "tall") {
      playerImage = bigPlayer.facingLeft;
    }
    else {
      playerImage = player.facingLeft;
    }
  }
  else if (directionOfMovement === "right") {
    if (ability === "tall") {
      playerImage = bigPlayer.facingRight;
    }
    else {
      playerImage = player.facingRight;
    }
  }
}

function animatePlayer() {
  //if the spacebar is pressed
  if (keyIsDown(32) && directionOfMovement === "right") {
    if (ability === "tall") {
      playerImage = bigPlayer.kickingRight;
    }
    else {
      playerImage = player.kickingRight;
    }
    // eslint-disable-next-line no-undef
    setTimeout(stopKicking, 100);
  }
  else if (keyIsDown(32) && directionOfMovement === "left") {
    if (ability === "tall") {
      playerImage = bigPlayer.kickingLeft;
    }
    else {
      playerImage = player.kickingLeft;
    }
    // eslint-disable-next-line no-undef
    setTimeout(stopKicking, 100);
  }
} 

function ballIsKicked() {
  if (playerImage === player.kickingRight && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX <= 50
  && Math.abs(playerY - soccerBallY) <= 90){
    soccerBallSpeedX = 20;
    soccerBallX += soccerBallSpeedX;
    acceleration = -5;
    if (soccerBallY < ground) {
      if (ability === "strong") {
        xVelocity = 30;
      }
      else {
        xVelocity = 15;
      }
    }
  }

  if (playerImage === player.kickingLeft && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX >=-50
  && Math.abs(playerY - soccerBallY) <= 90) {
    soccerBallSpeedX = -20;
    soccerBallX += soccerBallSpeedX;
    acceleration = -2;
    //the left kick is not as powerful
    if (soccerBallY < ground) {
      xVelocity = -3;
    }
  }

  if (playerImage === bigPlayer.kickingRight && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX <= 50
  && Math.abs(playerY - soccerBallY) <= 90){
    soccerBallSpeedX = 30;
    soccerBallX += soccerBallSpeedX;
    acceleration = -5;
    if (soccerBallY < ground) {
      xVelocity = 20;
    }
  }
  if (playerImage === bigPlayer.kickingLeft && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX >=-50
  && Math.abs(playerY - soccerBallY) <= 90) {
    soccerBallSpeedX = -20;
    soccerBallX += soccerBallSpeedX;
    acceleration = -2;
    //the left kick is not as powerful
    if (soccerBallY < ground) {
      xVelocity = -3;
    }
  }
}


function ballGravity() {
  yVelocity += acceleration;
  soccerBallY += yVelocity;
  soccerBallX += xVelocity;

  // physics
  acceleration = 0;
  yVelocity += gravity;
  if (soccerBallY > ground) {
    soccerBallY = ground;
    //this allows for the ball to bounce
    yVelocity = yVelocity * -0.3;
  }
  if (soccerBallY >= ground) {
    xVelocity = 0;
  }
}

function boundaries() {
  //so the ball can't leave the screen
  if (soccerBallX > width) {
    soccerBallX = width - soccerBallWidth;
    xVelocity = xVelocity * -0.95;
  }

  if (soccerBallX < 0 + soccerBallWidth/2) {
    soccerBallX = 0 + soccerBallWidth/2;
    xVelocity = xVelocity * -0.9;
  }

  if (soccerBallY < 0 + soccerBallHeight/2) {
    yVelocity = yVelocity * -1;
  }
  
  //so the player can't leave the screen
  if (playerX > width - playerWidth/2 ) {
    playerX = width - playerWidth/2;
  }
  if (playerX < 0 + playerWidth/2) {
    playerX = 0 + playerWidth/2;
  }

  //net boundaries
  if (windowWidth >= soccerBallX && soccerBallX >= windowWidth/1.2 && windowHeight/2.1 <= soccerBallY && soccerBallY <= windowHeight/2) {
    yVelocity = yVelocity * -0.95;
  }
   
  // if (Math.abs(soccerBallX - soccerNetX) <= windowWidth/2.7 && soccerBallY < height/12) {
  //   xVelocity = -5;
  //   yVelocity = yVelocity * -1;
  // }
  //needs to make boundaries so that the ball bounces
}

function goalScored() {
  // if (Math.abs(soccerBallX - soccerNetX) <= 45 && soccerBallY > height/4){
  //   state = "startScreen";
  // }
}

function displayGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}

function displayText() {
  textSize(40);
  text(txt, width/2.7, height/5);
}

function displayAbilities() {
  imageMode(CORNER);
  image(fastAbility, 0, 0, cellPictureWidth, cellPictureHeight);
  image(tallAbility, 1*cellSize, 1*cellSize, cellPictureWidth, cellPictureHeight);
  image(strongAbility, 1*cellSize, 0, cellPictureWidth, cellPictureHeight);
  image(shootingAbility, 0, 1*cellSize, cellPictureWidth, cellPictureHeight);
}

function playMusic() {
  if (state === "startScreen" && !song.isPlaying()) {
    song.play();
  }
  if (state !== "startScreen") {
    song.stop();
  }

  if (state === "clickPlay" && !march.isPlaying()) {
    march.play();
  }
  if (state !== "clickPlay") {
    march.stop();
  }

  if (state === "playSoccer" && !toccata.isPlaying()) {
    toccata.play();
  }
  if (state !== "playSoccer") {
    toccata.stop();
  }
}

