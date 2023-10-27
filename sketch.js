// Global variables
// 1) Image array
var player_img = [];
var target_img;
// 2) player size
var player_size = 150;
// 3) keyboard array
var keyArray = [];


// test objects
var testPlayer;
var testScreen;
var testScreen1;
var testScreen2;

// Flashbang class
class Flashbang{
  // default constructor
  constructor() {
    // location variable
    this.loc = new p5.Vector(0, 0);

    // velocity variable
    this.vel = new p5.Vector(0, 0);

    // fired flag (0: not used, 1: used)
    this.fired = 0;

    // frame count variable
    this.frame_count = 0;
  }

  // draw function
  draw() {
    // draw only when fired
    if(this.fired === 1) {
      push();
      fill(0);
      noStroke();
      ellipse(this.loc.x, this.loc.y, 10, 5);
      pop();
    }
  }

  // update function
  update() {
    // update only when fired
    if(this.fired === 1) {
      // update flashbang location and velocity
      this.loc.add(this.vel);
      this.vel.sub(new p5.Vector(0.05, 0.05));
    }
  }
}

// Shell class
class Shell{
  // default constructor
  constructor(x, y) {
    // location variable
    this.loc = new p5.Vector(0, 0);

    // velocity variable
    this.vel = new p5.Vector(1, 0);

    // acceleration variable
    this.acc = new p5.Vector(0, 0);

    // theta variable
    this.theta = 0;

    // angular velocity variable
    this.vt = 0.5;

    // fired flag (0: not fired, 1: fired)
    this.fired = 0;

    // frame count variable
    this.opacity = 240;
  }

  // draw function
  draw() {
    // draw only when fired
    if(this.fired === 1) {
      // draw the shell
      push();
      // shell color
      fill(255, 255, 80, this.opacity);
      noStroke();
      // rotate the shell
      translate(this.loc.x, this.loc.y);
      rotate(this.theta);
      ellipse(0, 0, 10, 2);
      pop();      
    }
  }

  // update function
  update() {
    // update only when fired
    if(this.fired === 1) {
      // decrement angular velocity
      this.vt = (this.vt > 0) ? this.vt-0.02 : 0;

      // update theta
      this.theta += this.vt;

      // decrement velocity (acceleration must be set outside this function when fired)
      this.vel = (this.vel.mag() > 0.2) ? this.vel.sub(this.acc) : this.vel;

      // update location (velocity must be set outside this function)
      this.loc.add(this.vel);

      // decrement opacity
      if(this.opacity > 0) {
        this.opacity--;
      }
      else{
        // reset variables
        this.fired = 0;
        this.opacity = 240;
        this.vt = 0.5;
        this.vel = new p5.Vector(1, 0);
        this.acc = new p5.Vector(0, 0);
      }
    }
  }
}

// Crosshair class
class Crosshair{
  // default constructor
  constructor() {
    // location variable
    this.loc = new p5.Vector(0, 0);

    // crosshair color
    this.color = [0, 255, 0, 200];

    // crosshair size
    this.size = 16;
    this.gap = 4;
  }

  // draw function
  draw() {
    // draw crosshair
    push();
    fill(this.color);
    stroke(this.color);
    strokeWeight(2);
    translate(this.loc.x, this.loc.y);
    for(let i=0; i<4; i++) {
      line(this.gap, 0, this.gap+this.size, 0);
      rotate(HALF_PI);
    }
    pop();
  }

  // update function
  update(x, y) {
    // update location
    this.loc = new p5.Vector(x, y);
  }
}

// Player class
class Player{
  // default constructor
  constructor(x, y) {
    // location variable
    this.loc = new p5.Vector(x, y);

    // velocity variable
    this.vel = new p5.Vector(0, 0);

    // angle variable
    this.angle = 0;

    // health point variable
    this.hp = 100;

    // frame counter
    this.frame_count = 0;

    // leg movement
    this.leg_index = 0;
    this.leg_loc = new p5.Vector(0, 0);

    // bullet index, counter and array
    this.bullet_index = 0;
    this.bullet_count = 30;
    this.bullets = [];
    for(let i=0; i<10; i++) {
      this.bullets.push(new Shell());
    }

    // flash bang array
    this.flashbangs = [new Flashbang(), new Flashbang(), new Flashbang()];
  }

  // draw function
  draw() {
    // draw bullets and flashbangs
    for(let i=0; i<10; i++) {
      this.bullets[i].draw();
    }
    for(let i=0; i<3; i++) {
      this.flashbangs[i].draw();
    }
    // translate and rotate
    push();
    translate(this.loc.x, this.loc.y);
    rotate(this.angle);
    // draw player (feet)
    image(player_img[2], this.leg_loc.x-player_size/2-15, -player_size/2, player_size, player_size);
    image(player_img[1], this.leg_loc.y-player_size/2+15, -player_size/2, player_size, player_size);
    // draw player (body)
    image(player_img[0], -player_size/2, -player_size/2, player_size, player_size);
    pop();
  }

  // update function
  update() {
    // update leg movement if player is moving
    if(this.vel.mag() > 0) {
      // update leg index and location
      this.leg_index += 0.1;
      this.leg_loc = new p5.Vector((player_size/8)*sin(this.leg_index), (-player_size/10)*sin(this.leg_index));
    }
    // otherwise, set the leg location to default
    else{
      this.leg_index = 0;
      this.leg_loc = new p5.Vector(0, 0);
    }

    // update bullets and flashbangs
    for(let i=0; i<this.bullets.length; i++) {
      this.bullets[i].update();
    }
    for(let i=0; i<this.flashbangs.length; i++) {
      this.flashbangs[i].update();
    }

    // update location
    this.loc.add(this.vel);
  }
}

// Target class
class Target{
  // default constructor
  constructor(x, y) {
    // location variable
    this.loc = new p5.Vector(x, y);

    // angle variable
    this.angle = 0;
  }

  // draw function
  draw() {
    push();
    translate(this.loc.x, this.loc.y);
    rotate(this.angle);
    image(target_img, -player_size/2, -player_size/2, player_size, player_size);
    pop();
  }
}

// Wall class
class Wall{
  constructor(x, y) {
    // location variable
    this.loc = new p5.Vector(x, y);
  }

  // draw function
  draw() {
    push();
    fill('#2b2d2f');
    strokeWeight(3);
    square(this.loc.x-player_size/2, this.loc.y-player_size/2, player_size);
    pop();
  }
}

// MainScreen class
class MainScreen{
  // default constructor
  constructor() {
    // tilemap
    this.tilemap = [
      "wwwwwwww",
      "p      t",
      "        ",
      "        ",
      "       t",
      "wwwwwwww"];

    // player instances
    this.players;
    //this.bullet_index = 0;
    
    // shooting count
    this.shoot_count = random(2, 4);

    // target instances
    this.target_index = 0;
    this.targets = [];

    // wall instances
    this.walls = [];

    // frame counter
    this.frame_count = 0;

    // button color change
    this.color_change = 0;
    this.box_height = 54;
    this.box_width = 4*this.box_height;

    // state change flag
    this.state_change = 0;
  }

  // initializer draw
  initialize() {
    // scan the tile map
    for(let i=0; i<this.tilemap.length; i++) {
      for(let j=0; j<this.tilemap[i].length; j++) {
        switch(this.tilemap[i][j]) {
          // wall object
          case 'w':
            this.walls.push(new Wall((j*player_size)+player_size/2, (i*player_size)+player_size/2));
            break;
          // player object
          case 'p':
            this.players = new Player((j*player_size)+player_size/2, (i*player_size)+player_size/2);
            break;
          // target object
          case 't':
            this.targets.push(new Target((j*player_size)+player_size/2, (i*player_size)+player_size/2));
            break;
        }
      }
    }
  }

  // draw function
  draw() {
    // draw players
    this.players.draw();
    // draw targets
    for(let i=0; i<this.targets.length; i++) {
      this.targets[i].draw();
    }
    // draw walls
    for(let i=0; i<this.walls.length; i++) {
      this.walls[i].draw();
    }

    // draw title
    push();
    textFont('Fantasy');
    textAlign(CENTER);
    fill(255, 50, 50);
    textSize(48);
    text('2D Shooting Game Project', width/2, height/4);
    fill(0);
    textSize(24);
    text('By Seong Soo Jeong', width/2, height*0.3);
    pop();

    push();
    fill(255-this.color_change);
    strokeWeight(4);
    translate(width/2, 3*height/4);
    rect(-this.box_width/2, -this.box_height/2, this.box_width, this.box_height);
    fill(this.color_change);
    textSize(36);
    textAlign(CENTER);
    text('Instruction', 0, this.box_height/4);
    pop();
  }

  // update function
  update() {
    // perform shooting
    if(this.shoot_count <= 0) {
      // reset shoot count
      this.shoot_count = random(2, 5);
      // update target index
      this.target_index = (this.target_index < this.targets.length-1) ? this.target_index+1 : 0;
    }
    else{
      // change player angle if not aligned
      let copy_angle = this.targets[this.target_index].loc.copy();
      let target_angle = copy_angle.sub(this.players.loc);

      // check if player is aiming towards the target
      if(abs(this.players.angle-target_angle.heading()) > QUARTER_PI/16) {
        this.players.angle = (this.players.angle > target_angle.heading()) ? this.players.angle-0.05 : this.players.angle+0.05;
      }
      // target in sight, shoot
      else{
        if(this.frame_count < frameCount-30) {
          // update frame count
          this.frame_count = frameCount;
          
          // shoot bullets
          this.players.bullets[this.players.bullet_index].fired = 1;
          this.players.bullets[this.players.bullet_index].loc = this.players.loc.copy().add(new p5.Vector((player_size/4)*cos(this.players.angle), (player_size/4)*sin(this.players.angle)+player_size/8));
          this.players.bullets[this.players.bullet_index].vel.setHeading(this.players.angle+HALF_PI+random(-0.5, 0.5));
          this.players.bullets[this.players.bullet_index].acc = new p5.Vector(0.01, 0).setHeading(this.players.bullets[this.players.bullet_index].vel.heading());
          this.players.bullet_index = (this.players.bullet_index < this.players.bullets.length-1) ? this.players.bullet_index+1 : 0;

          // decrement shoot count
          this.shoot_count--;
        }
      }
    }
    
    // check box clicks
    if((abs(mouseX-width/2) < this.box_width/2) && (abs(mouseY-3*height/4) < this.box_height/2)) {
      this.color_change = 80;
      if(mouseIsPressed === true) {
        this.state_change = 1;
      }
    }
    else{
      this.color_change = 0;
    }

    // update players
    this.players.update();
  }
}

// Instruction
class Instruction{
  // default constructor
  constructor() {
    this.tilemap = [
      "wwwwwwwwwwwwwwww",
      "wp            tw",
      "w              w",
      "w              w",
      "w              w",
      "w              w",
      "w              w",
      "w              w",
      "w              w",
      "w              w",
      "wt            tw",
      "wwwwwwwwwwwwwwww"
    ];

    // game instances
    this.walls = [];
    this.player;
    this.targets = [];

    // map size
    this.map_width = 0;
    this.map_height = 0;

    // crosshair
    this.aim;
  }

  // initializer draw
  initialize() {
    // scan the tile map
    for(let i=0; i<this.tilemap.length; i++) {
      for(let j=0; j<this.tilemap[i].length; j++) {
        switch(this.tilemap[i][j]) {
          // wall object
          case 'w':
            this.walls.push(new Wall((j*player_size)+player_size/2, (i*player_size)+player_size/2));
            break;
          // player object
          case 'p':
            this.players = new Player((j*player_size)+player_size/2, (i*player_size)+player_size/2);
            break;
          // target object
          case 't':
            this.targets.push(new Target((j*player_size)+player_size/2, (i*player_size)+player_size/2));
            break;
        }
      }
    }

    // initialize crosshair
    this.aim = new Crosshair();

    // define map size
    this.map_width = player_size*this.tilemap[0].length;
    this.map_height = player_size*this.tilemap.length;
  }

  // function
  draw() {
    push();
    translate(width/2-this.players.loc.x, height/2-this.players.loc.y);
    // draw players
    this.players.draw();
    // draw targets
    for(let i=0; i<this.targets.length; i++) {
      this.targets[i].draw();
    }
    // draw walls
    for(let i=0; i<this.walls.length; i++) {
      this.walls[i].draw();
    }
    pop();

    // draw cross hair
    this.aim.draw();

    // show instructions
    push();
    textSize(24);
    textFont('Fantasy');
    fill(255, 50, 50);
    text('W/S - Move up/down\nA/D - Move left/right\nMouse(Left) - Shoot\nR - Reload', 50, 4*height/5);
    fill(0, 0, 255);
    text('Ammo\n'+this.players.bullet_count, width-150, 4*height/5);
  }

  // update function
  update() {
    // 1) update player movement
    // temporary velocity variable
    let temp_vel = new p5.Vector(0, 0);
    // 'A': move left
    if(keyArray[65] === 1) {
      if(this.players.loc.x > 3*player_size/2) {
        temp_vel.add(new p5.Vector(-1, 0));
      }
    }
    // 'D': move right
    if(keyArray[68] === 1) {
      if(this.players.loc.x < this.map_width-3*player_size/2) {
        temp_vel.add(new p5.Vector(1, 0));
      }
    }
    // 'S': move down
    if(keyArray[83] === 1) {
      if(this.players.loc.y < this.map_height-3*player_size/2) {
        temp_vel.add(new p5.Vector(0, 1));
      }
    }
    // 'W': move up
    if(keyArray[87] === 1) {
      if(this.players.loc.y > 3*player_size/2) {
        temp_vel.add(new p5.Vector(0, -1));
      }
    }
    // normalize velocity vector
    temp_vel.normalize();
    temp_vel.mult(2);

    // update players velocity
    this.players.vel = temp_vel;

    // 2) update player direction
    let temp_angle = new p5.Vector(mouseX-width/2, mouseY-height/2);
    this.players.angle = temp_angle.heading();

    // 3) update firing
    if(mouseIsPressed === true && this.players.bullet_count > 0) {
      // fire when ready
      if(this.players.frame_count < frameCount - 30) {
        // update frame count
        this.players.frame_count = frameCount;

        // shoot bullets
        this.players.bullets[this.players.bullet_index].fired = 1;
        this.players.bullets[this.players.bullet_index].loc = this.players.loc.copy().add(new p5.Vector((player_size/4)*cos(this.players.angle), (player_size/4)*sin(this.players.angle)+player_size/8));
        this.players.bullets[this.players.bullet_index].vel.setHeading(this.players.angle+HALF_PI+random(-0.5, 0.5));
        this.players.bullets[this.players.bullet_index].acc = new p5.Vector(0.01, 0).setHeading(this.players.bullets[this.players.bullet_index].vel.heading());
        this.players.bullet_index = (this.players.bullet_index < this.players.bullets.length-1) ? this.players.bullet_index+1 : 0;

        // decrement bullet count
        this.players.bullet_count--;
      }
    }

    // 4) check reloading
    if(keyArray[82] === 1 && this.players.bullet_count === 0) {
      this.players.bullet_count = 30;
    }
    
    // update player
    this.players.update();

    // update crosshair
    this.aim.update(mouseX, mouseY);
  }
}

// Check Point #1
class CP1{
  constructor() {
    // game state variable
    this.game_state = 0;

    // main screen and instruction instances
    this.main_screen = new MainScreen();
    this.instruction = new Instruction();

    // initialize main screen
    this.main_screen.initialize();
  }

  // initialize() {
  //   this.main_screen.initialize();
  //   this.instruction.initialize();
  // }

  draw() {
    switch(this.game_state) {
      case 0:
        this.main_screen.draw();
        break;
      case 1:
        this.instruction.draw();
        break;
    }
  }

  update() {
    switch(this.game_state) {
      case 0:
        if(this.main_screen.state_change === 1) {
          this.game_state = 1;
          this.instruction.initialize();
        }
        else{
          this.main_screen.update();
        }
        break;
      case 1:
        this.instruction.update();
        break;
    }
  }
}

// keyboard variables
function keyPressed() {
  keyArray[keyCode] = 1;
}
function keyReleased() {
  keyArray[keyCode] = 0;
}

function setup() {
  player_img.push(loadImage('assets/Player_Head_Body.png'));
  player_img.push(loadImage('assets/Player_R_Foot.png'));
  player_img.push(loadImage('assets/Player_L_Foot.png'));
  target_img = loadImage('assets/target.png');
  createCanvas(1200, 900);

  testScreen = new MainScreen();
  //testScreen.initialize();
  //testPlayer = new Player(width/2, height/2);
  testScreen1 = new Instruction();
  testScreen1.initialize();

  testScreen2 = new CP1();
}
  
function draw() {
  background(220);
  // let towards = new p5.Vector(mouseX-testPlayer.loc.x, mouseY-testPlayer.loc.y);
  // testPlayer.angle = towards.heading();
  // let temp_vel = new p5.Vector(0, 1);
  // testPlayer.vel = temp_vel.setHeading(testPlayer.angle);
  // testPlayer.update();
  // testPlayer.draw();
  
  // testScreen1.update();
  // testScreen1.draw();
  testScreen2.update();
  testScreen2.draw();
}