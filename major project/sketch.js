/* eslint-disable no-mixed-spaces-and-tabs */
// Wilson Li
// March 25th, 2019
//Soccer Ball Assignment

let player, bigPlayer, playerHeight, playerWidth, playerX, playerY, playerImage;
let player2, bigPlayer2, player2X, player2Y, playerImage2;
let state, ability, ability2, fastAbility, tallAbility, strongAbility, shootingAbility;
let cellPictureHeight, cellPictureWidth;
let txt, txt2;
let gridSize = 2;
let cellSize;
let xOffset, yOffset;
let playButton, buttonX, buttonY, buttonWidth, buttonHeight, buttonScalar;
let soccerBall, soccerBallX, soccerBallY, soccerBallWidth, soccerBallHeight, soccerBallScalar, soccerBallRadius;
let soccerBallSpeedX, soccerBallSpeedY, beforeKickX, beforeKickY;
let soccerNet, soccerGoal, soccerNetX, soccerNetY, soccerGoalX, soccerGoalY, soccerNetWidth, soccerNetHeight, soccerNetScalar, netBoundary;
let backgroundImage, netLine;
let directionOfMovement, directionOfMovement2;
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

  //2nd player
  player2 = {
    kickingRight: loadImage("assets/stirkingLeft.png"),
    kickingLeft: loadImage("assets/strikingRight.png"),
    facingLeft: loadImage("assets/blue.png"),
    facingRight: loadImage("assets/blue.png")
  };

  //2nd player for tall ability
  bigPlayer2 = {
    kickingRight: loadImage("assets/blueRight.png"),
    kickingLeft : loadImage("assets/blueLeft.png"),
    facingLeft: loadImage("assets/blueTall.png"),
    facingRight: loadImage("assets/blueTall.png")
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
  player2X = width - playerWidth;
  player2Y = height - playerHeight/2;
  directionOfMovement = "right";
  directionOfMovement2 = "left"; 
  playerImage = player.facingRight;
  playerImage2 = player2.facingLeft;

  //startscreen measurements
  backgroundImage = loadImage("assets/stadium.png");
  txt = "🔥Select Your Ability🔥 PLAYER 1";
  txt2 = "❄Select Your Ability❄ PLAYER 2";
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
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
    push();
    translate(xOffset, yOffset);
    displayGrid();
    displayAbilities();
    pop();
    displayText();
  }
  if (state === "startScreen2") {
    checkCursor();
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
    push();
    translate(xOffset, yOffset);
    displayGrid();
    displayAbilities();
    pop();
    displayText2();
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
    netLine = line(0, windowHeight/2, windowWidth/6, windowHeight/2.05);
    displayPlayer();
    displayPlayer2();
    displayBall();
    displayNet();
    movePlayer();
    movePlayer2();
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
      state = "startScreen2";
      ability = "fast";
      playerImage = player.facingRight;
    }

    else if (xcoord === 0 && ycoord === 1) {
      state = "startScreen2";
      ability = "strong";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 0) {
      state = "startScreen2";
      ability = "shoot";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 1) {
      state = "startScreen2";
      ability = "tall";
      playerImage = bigPlayer.facingRight;
    }
  }
  else if (state === "startScreen2") {
    if (xcoord === 0 && ycoord === 0) {
      state = "clickPlay";
      ability2 = "fast";
      playerImage = player.facingRight;
    }

    else if (xcoord === 0 && ycoord === 1) {
      state = "clickPlay";
      ability2 = "strong";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 0) {
      state = "clickPlay";
      ability2 = "shoot";
      playerImage = player.facingRight;
    }

    else if (xcoord === 1 && ycoord === 1) {
      state = "clickPlay";
      ability2 = "tall";
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
  //beta test Henry: instructions page and abilities description
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

function displayPlayer2() {
  imageMode(CENTER);
  image(playerImage2, player2X, player2Y, playerWidth, playerHeight);
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

function movePlayer2() {
  if (keyIsDown(65)) {
    if (ability2 === "fast") {
      player2X -= 15;
    }
    else {
      player2X -= 10;
    }
    directionOfMovement2 = "left";
    if (ability2 === "tall") {
      playerImage2 = bigPlayer2.facingLeft;
    }
    else {
      playerImage2 = player2.facingLeft;
    }
  }
  if (keyIsDown(68)) {
    if (ability2 === "fast") {
      player2X += 15;
    }
    else {
      player2X += 10;
    }
    directionOfMovement2 = "right";
    if (ability2 === "tall") {
      playerImage2 = bigPlayer2.facingRight;
    }
    else {
      playerImage2 = player2.facingRight;
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
    soccerBallSpeedX = 10;
    soccerBallX += soccerBallSpeedX;
    acceleration = -5;
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    if (soccerBallY < ground) {
      if (ability === "strong") {
        xVelocity = 25;
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
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    //the left kick is not as powerful
    if (soccerBallY < ground) {
      xVelocity = -3;
    }
  }

  if (playerImage === bigPlayer.kickingRight && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX <= 50
  && Math.abs(playerY - soccerBallY) <= 90){
    soccerBallSpeedX = 25;
    soccerBallX += soccerBallSpeedX;
    acceleration = -3;
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    if (soccerBallY < ground) {
      xVelocity = 20;
    }
  }
  if (playerImage === bigPlayer.kickingLeft && Math.abs(playerX - soccerBallX) <= 126 && playerX - soccerBallX >=-50
  && Math.abs(playerY - soccerBallY) <= 90) {
    soccerBallSpeedX = -15;
    soccerBallX += soccerBallSpeedX;
    acceleration = -2;
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
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
    //I need to make the ball roll a bit when it hits the ground
  }
  if (soccerBallY >= ground) {
    xVelocity = 0;
  }
}

function boundaries() {
  //net boundaries
  if (windowWidth >= soccerBallX && soccerBallX >= windowWidth/1.2 && windowHeight/2.1 <= soccerBallY && soccerBallY <= windowHeight/2) {
    yVelocity = (yVelocity - 5)* -1;
  }
  if (windowWidth/6 >= soccerBallX && soccerBallX >= 0 && windowHeight/2.1 <= soccerBallY && soccerBallY <= windowHeight/2) {
    yVelocity = yVelocity* -1;
  }
  if (windowWidth >= beforeKickX && beforeKickX >= windowWidth/1.2 
    && windowHeight/2 >= beforeKickY && soccerBallY -soccerBallRadius >= windowHeight/2
    && windowWidth >= soccerBallX && soccerBallX >= windowWidth/1.2) {
    soccerBallY = beforeKickY;
    yVelocity = yVelocity * -1;
  }

  //so the ball can't leave the screen
  if (soccerBallX > width) {
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    soccerBallX = width - soccerBallWidth;
    xVelocity = xVelocity * -0.95;
  }

  if (soccerBallX < 0 + soccerBallWidth/2) {
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    soccerBallX = 0 + soccerBallWidth/2;
    xVelocity = xVelocity * -0.9;
  }

  if (soccerBallY < 0 + soccerBallHeight/2) {
    beforeKickX = soccerBallX;
    beforeKickY = soccerBallY;
    soccerBallY = 0 + soccerBallHeight/2;
    yVelocity = yVelocity * -1;
  }
  
  //so the players can't leave the screen
  if (playerX > width - playerWidth/2 ) {
    playerX = width - playerWidth/2;
  }
  if (playerX < 0 + playerWidth/2) {
    playerX = 0 + playerWidth/2;
  }
  if (player2X > width - playerWidth/2 ) {
    player2X = width - playerWidth/2;
  }
  if (player2X < 0 + playerWidth/2) {
    player2X = 0 + playerWidth/2;
  }

  
   
  // if (Math.abs(soccerBallX - soccerNetX) <= windowWidth/2.7 && soccerBallY < height/12) {
  //   xVelocity = -5;
  //   yVelocity = yVelocity * -1;
  // }
  //needs to make boundaries so that the ball bounces
  //check to see that the ball is above/below the crossbar
}

function goalScored() {
  if (windowWidth >= soccerBallX && soccerBallX >= windowWidth/1.12 && soccerBallY > windowHeight/1.9) {
    xVelocity = 0;
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
  if (xcoord === 0 && ycoord === 0 && state === "startScreen") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character run faster", mouseX-windowWidth/3, mouseY);
  }
  if (xcoord === 1 && ycoord === 0 && state === "startScreen") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character lob the ball higher", mouseX, mouseY);
  }
  if (xcoord === 1 && ycoord === 1 && state === "startScreen") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character taller", mouseX, mouseY);
  }
  if (xcoord === 0 && ycoord === 1 && state === "startScreen") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character kick further", mouseX-windowWidth/3, mouseY);
  }
}

function displayText2() {
  textSize(40);
  text(txt2, width/2.7, height/5);
  if (xcoord === 0 && ycoord === 0 && state === "startScreen2") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character run faster", mouseX-windowWidth/3, mouseY);
  }
  if (xcoord === 1 && ycoord === 0 && state === "startScreen2") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character lob the ball higher", mouseX, mouseY);
  }
  if (xcoord === 1 && ycoord === 1 && state === "startScreen2") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character taller", mouseX, mouseY);
  }
  if (xcoord === 0 && ycoord === 1 && state === "startScreen2") {
    textSize(25);
    textStyle(BOLD);
    text("This ability makes your character kick further", mouseX-windowWidth/3, mouseY);
  }
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

