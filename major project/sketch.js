/* eslint-disable no-mixed-spaces-and-tabs */
// States Variable Assignment
// Wilson Li
// March 25th, 2019
//Soccer Ball Assignment
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
//with the help of Mr. Schellenberg, I was able to create a gravity-like feel for the ball. I also had to figure out how to make simple animations for my character when it kicks the ball.
//the dimensions for the net were also kind of hard... so there's that
let player, playerHeight, playerWidth, playerX, playerY, playerImage;
let bigPlayer;
let state, ability;
let fastAbility, tallAbility, strongAbility, shootingAbility;
let cellPictureHeight, cellPictureWidth;
let txt;
let gridSize = 2;
let cellSize;
let xOffset;
let yOffset;
let playButton;
let buttonX, buttonY, buttonWidth, buttonHeight, buttonScalar;
let soccerBall, soccerBallX, soccerBallY, soccerBallWidth, soccerBallHeight, soccerBallScalar, soccerBallRadius;
let soccerBallSpeedX, soccerBallSpeedY;
let soccerNet, soccerNetX, soccerNetY, soccerNetWidth, soccerNetHeight, soccerNetScalar;
let backgroundImage;
let directionOfMovement;
let gravity, acceleration, xVelocity, yVelocity, ground;
let xcoord, ycoord;
let song;

function preload() {
  //load images
  soccerBall = loadImage("assets/soccerBall.png");
  playButton = loadImage("assets/playButton.png");
  soccerNet = loadImage("assets/net.png");
  // I organized the player into one object to make it easier to manage
  player = {
    kickingRight: loadImage("assets/kickingLeft.png"),
    kickingLeft: loadImage("assets/kickingRight.png"),
    facingLeft: loadImage("assets/standing.png"),
    facingRight: loadImage("assets/standing.png")
  };

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
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundImage = loadImage("assets/field.png");
  //determine start screen measurements
  state = "startScreen";
  //buttonScalar = 0.3;
  buttonX = width/2;
  buttonY = height/2;
  buttonHeight = windowHeight/3.5;
  buttonWidth = windowWidth/5;

  //soccer ball measurements
  soccerBallRadius = windowHeight/15;
  soccerBallHeight = soccerBallRadius *2;
  soccerBallWidth = soccerBallRadius *2;
  soccerBallX = 0 + soccerBallRadius;
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
  soccerNetHeight = windowHeight/1.2;
  soccerNetWidth = windowWidth/6;
  soccerNetX = width - soccerNetWidth/2;
  soccerNetY = height - soccerNetHeight/2;

  //player measurements
  playerHeight = windowHeight/3;
  playerWidth = windowWidth/8;
  playerX = width - playerWidth*7;
  playerY = height - playerHeight/2;
  directionOfMovement = "right"; 
  playerImage = player.facingLeft;

  //startscreen measurements
  backgroundImage = loadImage("assets/stadium.png");
  txt = "🔥Select Your Ability🔥";
  cellSize = 150;
  xOffset = width/2.5;
  yOffset = height/3;
  cellPictureWidth = cellSize;
  cellPictureHeight = cellSize;

  song.setVolume(1);
  if (state === "startScreen") {
    song.play();
  }
}

function draw() {
  background(220);
  xcoord = floor((mouseX-xOffset)/cellSize);
  ycoord = floor((mouseY-yOffset)/cellSize);

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
    soccerBallX = 0 + soccerBallRadius;
    soccerBallY = ground;
  }
  if (state === "playSoccer"){
    noCursor();
    imageMode(CORNER);
    image(backgroundImage, 0, 0, windowWidth, windowHeight);
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
    }

    else if (xcoord === 0 && ycoord === 1) {
      state = "clickPlay";
      ability = "strong";
    }

    else if (xcoord === 1 && ycoord === 0) {
      state = "clickPlay";
      ability = "shoot";
    }

    else if (xcoord === 1 && ycoord === 1) {
      state = "clickPlay";
      ability = "tall";
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
  image(soccerBall, soccerBallX, soccerBallY, soccerBallWidth, soccerBallHeight);
}

function displayNet() {
  imageMode(CENTER);
  image(soccerNet, soccerNetX, soccerNetY, soccerNetWidth, soccerNetHeight);
}

function displayPlayer() {
  imageMode(CENTER);
  image(playerImage, playerX, playerY, playerWidth, playerHeight);
  if (ability === "tall") {
    image();
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
    playerImage = player.facingLeft;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    if (ability === "fast") {
      playerX += 15;
    }
    else {
      playerX += 10;
    }
    directionOfMovement = "right";
    playerImage = player.facingRight;
  }
}

function stopKicking() {
  if (directionOfMovement === "left") {
    playerImage = player.facingLeft;
  }
  else if (directionOfMovement === "right") {
    playerImage = player.facingRight;
  }
}

function animatePlayer() {
  //if the spacebar is pressed
  if (keyIsDown(32) && directionOfMovement === "right") {
    playerImage = player.kickingRight;
    setTimeout(stopKicking, 100);
  }
  else if (keyIsDown(32) && directionOfMovement === "left") {
    playerImage = player.kickingLeft;
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
    xVelocity = xVelocity * -1;
  }
  if (soccerBallX < 0) {
    soccerBallX = 0 + soccerBallWidth;
    xVelocity = xVelocity * -1;
  }
  if (soccerBallY < (0 + soccerBallHeight/2)) {
    yVelocity = yVelocity * -1;
  }
  
  //so the player can't leave the screen
  if (playerX > width) {
    playerX = width;
  }
  if (playerX < 0) {
    playerX = 0 - playerX/2;
  }

  //net boundaries
  if (Math.abs(soccerBallX - soccerNetX) <= 20){
    xVelocity = 0;
  }
   
  if (Math.abs(soccerBallX - soccerNetX) <= 20 && soccerBallY < height/4){
    xVelocity = -5;
    yVelocity = yVelocity *-1;

  }
}

function goalScored() {
  if (Math.abs(soccerBallX - soccerNetX) <= 40 && soccerBallY > height/4){
    state = "startScreen";
  }
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