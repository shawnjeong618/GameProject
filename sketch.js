// Global variables
// 1) Image array
var player_img = [];
var target_img;
var enemy_img = [];
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
// class Flashbang{
//   // default constructor
//   constructor() {
//     // location variable
//     this.loc = new p5.Vector(0, 0);

//     // velocity variable
//     this.vel = new p5.Vector(0, 0);

//     // fired flag (0: not used, 1: used)
//     this.fired = 0;

//     // frame count variable
//     this.frame_count = 0;
//   }

//   // draw function
//   draw() {
//     // draw only when fired
//     if(this.fired === 1) {
//       push();
//       fill(0);
//       noStroke();
//       ellipse(this.loc.x, this.loc.y, 10, 5);
//       pop();
//     }
//   }

//   // update function
//   update() {
//     // update only when fired
//     if(this.fired === 1) {
//       // update flashbang location and velocity
//       this.loc.add(this.vel);
//       this.vel.sub(new p5.Vector(0.05, 0.05));
//     }
//   }
// }

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
      this.vel = (this.vel.mag() > 0.1) ? this.vel.sub(this.acc) : this.vel;

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

// health bar class
class HP{
  // default constructor
  constructor(full) {
    // location variable
    this.loc = new p5.Vector(0, 0);

    // health variable 
    this.full_hp = full;
    this.curr_hp = full;

    // size variable
    this.width = 50;
    this.height = 5;
  }

  // draw function
  draw() {
    // draw only if above 0 hp
    if(this.curr_hp <= 0) {
      return;
    }

    // draw red rectangle
    fill(255, 0 ,0);
    rect(this.loc.x-this.width/2, this.loc.y-3*this.width/4, this.width, this.height);

    // draw green rectangle
    fill(0, 255, 0);
    rect(this.loc.x-this.width/2, this.loc.y-3*this.width/4, (this.width*this.curr_hp/this.full_hp), this.height);
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

    // TEST: angle vector
    this.ang = new p5.Vector(1, 0);

    // health point variable
    this.hp = 5;

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
    // this.flashbangs = [new Flashbang(), new Flashbang(), new Flashbang()];
  }

  // draw function
  draw() {
    // draw bullets and flashbangs
    for(let i=0; i<this.bullets.length; i++) {
      this.bullets[i].draw();
    }
    // for(let i=0; i<this.flashbangs.length; i++) {
    //   this.flashbangs[i].draw();
    // }
    // translate and rotate
    push();
    translate(this.loc.x, this.loc.y);
    //rotate(this.angle);
    rotate(this.ang.heading());
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

    // update bullets
    for(let i=0; i<this.bullets.length; i++) {
      this.bullets[i].update();
    }
    // for(let i=0; i<this.flashbangs.length; i++) {
    //   this.flashbangs[i].update();
    // }

    // update location
    this.loc.add(this.vel);
  }
}

// Enemy class
class Enemy{
  // default constructor
  constructor(x, y) {
    // location variable
    this.loc = new p5.Vector(x, y);

    // velocity variable
    this.vel = new p5.Vector(0, 0);

    // direction variable
    this.angle = 0;

    // TEST: direction vector
    this.ang = new p5.Vector(1, 0);

    // health point variable
    this.hp = 3;

    // state variable (0: search, 1: shoot)
    this.state = 0;

    // leg movement
    this.leg_index = 0;
    this.leg_loc = new p5.Vector(0, 0);

    // bullet variable
    this.bullet_index = 0;
    this.bullet_count = 30;
    this.bullets = [];
    for(let i=0; i<5; i++) {
      this.bullets.push(new Shell());
    }

    // frame count variable
    this.frame_count = 0;
  }

  // draw function
  draw() {
    // draw live enemy
    if(this.hp > 0) {
      // draw bullets
      for(let i=0; i<this.bullets.length; i++) {
        this.bullets[i].draw();
      }
      // translate and rotate
      push();
      translate(this.loc.x, this.loc.y);
      //rotate(this.angle);
      rotate(this.ang.heading());
      // draw enemy (feet)
      image(enemy_img[2], this.leg_loc.x-player_size/2-15, -player_size/2, player_size, player_size);
      image(enemy_img[1], this.leg_loc.y-player_size/2+15, -player_size/2, player_size, player_size);
      // draw enemy (body)
      image(enemy_img[0], -player_size/2, -player_size/2, player_size, player_size);
      pop();

      // update angle range [0, TAU)
      //this.angle = ((this.angle % TAU) + TAU) % TAU;
    }
    // draw dead enemy
    //else{}
  }

  // update function
  update() {
    // skip updating if dead
    if(this.hp <= 0) {
      return;
    }

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

    // update bullets
    for(let i=0; i<this.bullets.length; i++) {
      this.bullets[i].update();
    }

    // update velocity by angle
    if(this.vel.mag() > 0) {
      this.vel.setHeading(this.ang.heading());
      this.loc.add(this.vel);
    }

    // update location
    // this.loc.add(this.vel);
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
    this.color_change_2 = 0;
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

    // draw button
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

    // draw button
    push();
    fill(255-this.color_change_2);
    strokeWeight(4);
    translate(width/2, 3*height/5);
    rect(-this.box_width/2, -this.box_height/2, this.box_width, this.box_height);
    fill(this.color_change_2);
    textSize(36);
    textAlign(CENTER);
    text('Start Game', 0, this.box_height/4);
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
    
    // check box clicks (to instruction)
    if((abs(mouseX-width/2) < this.box_width/2) && (abs(mouseY-3*height/4) < this.box_height/2)) {
      this.color_change = 80;
      if(mouseIsPressed === true) {
        this.state_change = 1;
      }
    }
    // check box clicks (to game)
    else if((abs(mouseX-width/2) < this.box_width/2) && (abs(mouseY-3*height/5) < this.box_height/2)) {
      this.color_change_2 = 80;
      if(mouseIsPressed === true) {
        this.state_change = 2;
      }
    }
    else{
      this.color_change = 0;
      this.color_change_2 = 0;
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

    // state change variable (go back to main screen)
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
    text('ESC - Back to main screen\nW/S - Move up/down\nA/D - Move left/right\nMouse(Left) - Shoot\nR - Reload', 50, 4*height/5);
    fill(0, 0, 255);
    text('Ammo\n'+this.players.bullet_count, width-150, 4*height/5);
  }

  // update function
  update() {
    // 0) "ESC" Button to go back to main screen
    if(keyArray[27] === 1) {
      this.state_change = 1;
    }

    // 1) update player movement
    // temporary velocity variable
    let temp_vel = new p5.Vector(0, 0);
    // 'A': move left
    if(keyArray[65] === 1) {
      if(this.players.loc.x > 5*player_size/4) {
        temp_vel.add(new p5.Vector(-1, 0));
      }
    }
    // 'D': move right
    if(keyArray[68] === 1) {
      if(this.players.loc.x < this.map_width-5*player_size/4) {
        temp_vel.add(new p5.Vector(1, 0));
      }
    }
    // 'S': move down
    if(keyArray[83] === 1) {
      if(this.players.loc.y < this.map_height-5*player_size/4) {
        temp_vel.add(new p5.Vector(0, 1));
      }
    }
    // 'W': move up
    if(keyArray[87] === 1) {
      if(this.players.loc.y > 5*player_size/4) {
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
    //this.players.angle = temp_angle.heading();
    this.players.ang.setHeading(temp_angle.heading());

    // 3) update firing
    if(mouseIsPressed === true && this.players.bullet_count > 0) {
      // fire when ready
      if(this.players.frame_count < frameCount - 30) {
        // update frame count
        this.players.frame_count = frameCount;

        // // shoot bullets
        // this.players.bullets[this.players.bullet_index].fired = 1;
        // this.players.bullets[this.players.bullet_index].loc = this.players.loc.copy().add(new p5.Vector((player_size/4)*cos(this.players.angle+QUARTER_PI/2), (player_size/4)*sin(this.players.angle+QUARTER_PI/2)));
        // this.players.bullets[this.players.bullet_index].vel.setHeading(this.players.angle+HALF_PI+random(-0.5, 0.5));
        // this.players.bullets[this.players.bullet_index].vel.add(this.players.vel.copy().mult(0.5));
        // this.players.bullets[this.players.bullet_index].acc = new p5.Vector(0.01, 0).setHeading(this.players.bullets[this.players.bullet_index].vel.heading());
        // this.players.bullet_index = (this.players.bullet_index < this.players.bullets.length-1) ? this.players.bullet_index+1 : 0;

        // // decrement bullet count
        // this.players.bullet_count--;

        this.shootBullets(this.players);
      }
    }

    // 4) check reloading
    if(keyArray[82] === 1) {
      this.players.bullet_count = 30;
    }
    
    // update player
    this.players.update();

    // update crosshair
    this.aim.update(mouseX, mouseY);
  }

  // helper function: shoot bullets
  shootBullets(obj) {
    // shoot bullets
    obj.bullets[obj.bullet_index].fired = 1;
    obj.bullets[obj.bullet_index].loc = obj.loc.copy().add(new p5.Vector((player_size/4)*cos(obj.ang.heading()+QUARTER_PI/2), (player_size/4)*sin(obj.ang.heading()+QUARTER_PI/2)));
    obj.bullets[obj.bullet_index].vel.setHeading(obj.ang.heading()+HALF_PI+random(-0.5, 0.5));
    obj.bullets[obj.bullet_index].vel.add(obj.vel.copy().mult(0.5));
    obj.bullets[obj.bullet_index].acc = new p5.Vector(0.01, 0).setHeading(obj.bullets[obj.bullet_index].vel.heading());
    obj.bullet_index = (obj.bullet_index < obj.bullets.length-1) ? obj.bullet_index+1 : 0;

    // decrement bullet count
    obj.bullet_count--;
  }
}

// Game level 1
class Game1{
  // default constructor
  constructor() {
    // tilemap variable
    this.tilemap = [
      "wwwwwwwwwwww",
      "wp   wwe   w",
      "w    ww    w",
      "w          w",
      "w    ww   ew",
      "wwwwwwwwwwww"
    ];

    // wall variable
    this.walls = [];

    // player variable
    this.player;

    // enemy variable
    this.enemies = [];
    this.enemy_count = 0;

    // crosshair interface
    this.aim;

    // health point interface
    this.player_hp;
    this.enemies_hp = [];

    // state change variable
    this.state_change = 0;
  };

  // initializer
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
            this.player = new Player((j*player_size)+player_size/2, (i*player_size)+player_size/2);
            this.player_hp = new HP(this.player.hp);
            break;
          // target object
          case 'e':
            this.enemies.push(new Enemy((j*player_size)+player_size/2, (i*player_size)+player_size/2));
            this.enemies_hp.push(new HP(3));
            break;
        }
      }
    }

    // initialize crosshair
    this.aim = new Crosshair();

    // define map size
    this.map_width = player_size*this.tilemap[0].length;
    this.map_height = player_size*this.tilemap.length;

    // initialize total enemy count
    this.enemy_count = this.enemies.length;
  }

  // reset
  reset() {
    // reset walls
    this.walls = [];
    this.player;
    this.enemies = [];
    this.aim;
    this.player_hp;
    this.enemies_hp = [];
    this.state_change = 0;
  }

  // draw function
  draw() {
    // set origin of the coordinate
    push();
    translate(width/2-this.player.loc.x, height/2-this.player.loc.y);

    // draw players
    this.player.draw();

    // draw enemies
    for(let i=0; i<this.enemies.length; i++) {
      this.enemies[i].draw();
    }

    // draw walls
    for(let i=0; i<this.walls.length; i++) {
      this.walls[i].draw();
    }

    // draw health points
    this.player_hp.draw();
    for(let i=0; i<this.enemies_hp.length; i++) {
      this.enemies_hp[i].draw();
    }

    // reset coordinate offset
    pop();

    // draw cross hair
    this.aim.draw();

    // show ammo
    push();
    textSize(24);
    textFont('Fantasy');
    fill(0, 0, 255);
    text('Ammo\n'+this.player.bullet_count, width-150, 4*height/5);
    pop();
  }

  // update function
  update() {
    // 0) check if game is over
    if(this.enemy_count === 0 || this.player_hp.curr_hp <= 0) {
      // game end
      this.state_change = 2;
    }

    // 1) update player movement
    // temporary velocity variable
    let temp_vel = new p5.Vector(0, 0);
    // 'A': move left
    if(keyArray[65] === 1) {
      if(this.player.loc.x > 5*player_size/4) {
        temp_vel.add(new p5.Vector(-1, 0));
      }
    }
    // 'D': move right
    if(keyArray[68] === 1) {
      if(this.player.loc.x < this.map_width-5*player_size/4) {
        temp_vel.add(new p5.Vector(1, 0));
      }
    }
    // 'S': move down
    if(keyArray[83] === 1) {
      if(this.player.loc.y < this.map_height-5*player_size/4) {
        temp_vel.add(new p5.Vector(0, 1));
      }
    }
    // 'W': move up
    if(keyArray[87] === 1) {
      if(this.player.loc.y > 5*player_size/4) {
        temp_vel.add(new p5.Vector(0, -1));
      }
    }
    // normalize velocity vector
    temp_vel.normalize();
    temp_vel.mult(2);

    // wall collision
    for(let i=0; i<this.walls.length; i++) {
      let pre_loc = this.player.loc.copy().add(temp_vel);
      if(abs(pre_loc.x-this.walls[i].loc.x) < 3*player_size/4 && abs(pre_loc.y-this.walls[i].loc.y) < 3*player_size/4) {
        temp_vel = createVector(0, 0);
        break;
      }
    }

    // update players velocity
    this.player.vel = temp_vel;

    // 2) update player direction
    let temp_angle = new p5.Vector(mouseX-width/2, mouseY-height/2);
    //this.player.angle = temp_angle.heading();
    this.player.ang.setHeading(temp_angle.heading());

    // 3) update firing
    if(mouseIsPressed === true && this.player.bullet_count > 0) {
      // fire when ready
      if(this.player.frame_count < frameCount - 30) {
        // update frame count
        this.player.frame_count = frameCount;

        // check if enemy is in the line of fire
        for(let i=0; i<this.enemies.length; i++) {
          // skip if the enemy is dead
          if(this.enemies[i].hp <= 0) {
            continue;
          }
          
          // check if the enemy is in the line of fire
          let player_to_enemy = this.enemies[i].loc.copy().sub(this.player.loc);
          //let target_dist = p5.Vector.dist(this.player.loc, this.enemies[i].loc);
          let hot_angle = atan2(player_size/4, player_to_enemy.mag());
          //if(abs(this.player.angle - this.enemies[i].loc.copy().sub(this.player.loc).heading()) < hot_angle) {
          if(abs(this.player.ang.angleBetween(player_to_enemy)) < hot_angle) {
            // // check if any wall blocks the bullet
            let blocked = this.isWithinView(this.player, this.enemies[i]);
            
            // decrease enemy health points if bullet is not blocked
            if(blocked === false) {
              // increase death count if enemy is about to die
              if(this.enemies[i].hp === 1) {
                this.enemy_count--;
              }
              this.enemies[i].hp--;
              this.enemies_hp[i].curr_hp--;
            }
          }
          else{
            continue;
          }
        }

        // shoot bullet (player)
        this.shootBullets(this.player);
      }
    }

    // 4) check reloading
    if(keyArray[82] === 1) {
      this.player.bullet_count = 30;
    }
    
    // update player
    this.player.update();

    // update enemies
    for(let i=0; i<this.enemies.length; i++) {
      // skip if enemy is dead
      if(this.enemies[i].hp <= 0) {
        continue;
      }
      switch(this.enemies[i].state) {
        // searching state
        case 0: {
          // check if the player is within enemies field of view
          let target = this.player.loc.copy().sub(this.enemies[i].loc);
          let enemy_to_player = this.player.loc.copy().sub(this.enemies[i].loc);
          if(abs(this.enemies[i].ang.angleBetween(enemy_to_player)) < QUARTER_PI) {
            // flag variable to check if the view is blocked by any walls
            let blocked = this.isWithinView(this.enemies[i], this.player);            

            // change state if enemy spots player
            if(!blocked) {
              this.enemies[i].state = 1;
            }
            // wall is blocking enemies view, relocate
            else{
              // rotate clock wise
              this.enemies[i].state = 2;
            }
          }
          // enemy can't see the player
          else{
            // relocate enemy position
            this.enemies[i].state = 2;
          }
          break;
        }
        // shooting state
        case 1: {
          // shoot if the player is in the line of fire
          let target = this.player.loc.copy().sub(this.enemies[i].loc);
          let hot_angle = atan2(player_size/4, target.mag());
          let blocked = this.isWithinView(this.enemies[i], this.player);
          let ang_diff = this.enemies[i].ang.angleBetween(target);
          if(!blocked) {
            if(abs(ang_diff) < hot_angle) {
              // shoot and update if ready to fire
              if(this.enemies[i].frame_count < frameCount - 60) {
                // reload bullet if mag is empty
                if(this.enemies[i].bullet_count <= 0) {
                  this.enemies[i].bullet_count = 30;
                }
                else{
                  this.enemies[i].frame_count = frameCount;
                  this.shootBullets(this.enemies[i]);

                  // decrement player health
                  this.player.hp--;
                  this.player_hp.curr_hp--;
                }
              }
            }
            // change angle if enemy can see the player
            else if(abs(ang_diff) < QUARTER_PI) {
              // if wall is not blocking the view, update angle
              if(ang_diff > 0) {
                this.enemies[i].ang = p5.Vector.rotate(this.enemies[i].ang, QUARTER_PI/32);
              }
              else{
                this.enemies[i].ang = p5.Vector.rotate(this.enemies[i].ang, -QUARTER_PI/32);
              }
            }
          }
          // relocate if player can't be seen
          else{
            this.enemies[i].state = 0;
          }
          break;
        }
        // relocate state
        case 2: {
          // update enemy velocity
          // set random angle
          let temp_vel_enm = new p5.Vector(1, 0);
          temp_vel_enm.setHeading(random(0, TAU));

          // update angle and velocity
          this.enemies[i].ang = temp_vel_enm;
          this.enemies[i].vel = temp_vel_enm;

          // update state
          this.enemies[i].state = 3;
          break;
        }
        // walking state
        case 3: {
          // check wall collision
          let pre_loc_enm = this.enemies[i].loc.copy().add(this.enemies[i].vel);
          for(let j=0; j<this.walls.length; j++) {
            if(abs(pre_loc_enm.x-this.walls[j].loc.x) < 3*player_size/4 && abs(pre_loc_enm.y-this.walls[j].loc.y) < 3*player_size/4) {
              this.enemies[i].vel = new p5.Vector(0, 0);
              this.enemies[i].state = 0;
              break;
            }
          }
          // change state if player is seen
          let blocked = this.isWithinView(this.enemies[i], this.player);
          if(!blocked) {
            let target = this.player.loc.copy().sub(this.enemies[i].loc);
            let enemy_to_player = this.player.loc.copy().sub(this.enemies[i].loc);
            if(abs(this.enemies[i].ang.angleBetween(enemy_to_player)) < QUARTER_PI) {
              // stop and change state
              this.enemies[i].vel = new p5.Vector(0, 0);
              this.enemies[i].state = 1;
            }
          }
          break;
        }
      }
      // update enemies
      this.enemies[i].update();
    }


    // update hp bar location
    this.player_hp.loc = this.player.loc;
    for(let i=0; i<this.enemies_hp.length; i++) {
      this.enemies_hp[i].loc = this.enemies[i].loc;
    }

    // update crosshair
    this.aim.update(mouseX, mouseY);
  }

  // helper function: checks if there is any wall objects blocking the view from object p1 to p2
  isWithinView(p1, p2) {
    // calculate the distance from the object to the target
    //let target_dist = p5.Vector.dist(p1.loc, p2.loc);
    let target = p2.loc.copy().sub(p1.loc);

    // check if any wall blocks the view of the object
    for(let j=0; j<this.walls.length; j++) {
      // ignore walls that are further than the target
      let object_to_wall = this.walls[j].loc.copy().sub(p1.loc);
      if(target.mag() < object_to_wall.mag()) {
        continue;
      }

      // get the edges of the current wall object
      var wall_edges = this.getWallEdges(j);

      // calculate the angle to wall edges with respect to the center of the wall
      var off_angle = [];
      for(let k=0; k<wall_edges.length; k++) {
        wall_edges[k] = wall_edges[k].sub(p1.loc);
        off_angle.push(object_to_wall.angleBetween(wall_edges[k]));
      }

      // get the min and max angle after sorting
      off_angle.sort(function(a, b){return a-b});
      let min_angle = off_angle[0];
      let max_angle = off_angle[off_angle.length-1];

      // check if the aim is within the blocking range
      //let mid_angle = p1.ang.angleBetween(target);
      let mid_angle = object_to_wall.angleBetween(target)
      if(mid_angle > min_angle && mid_angle < max_angle) {
        return true;
      }
    }

    // return flag variable
    return false;
  }

  // helper function
  // returns 4 edges of the wall
  getWallEdges(index) {
    let p0 = this.walls[index].loc.copy().sub(createVector(player_size/2, player_size/2));
    return [p0, p0.copy().add(createVector(0, player_size)), p0.copy().add(createVector(player_size, 0)), p0.copy().add(createVector(player_size, player_size))];
  }

  // helper function
  // shoot bullets
  shootBullets(obj) {
    // shoot bullets
    obj.bullets[obj.bullet_index].fired = 1;
    obj.bullets[obj.bullet_index].loc = obj.loc.copy().add(new p5.Vector((player_size/4)*cos(obj.ang.heading()+QUARTER_PI/2), (player_size/4)*sin(obj.ang.heading()+QUARTER_PI/2)));
    obj.bullets[obj.bullet_index].vel.setHeading(obj.ang.heading()+HALF_PI+random(-0.5, 0.5));
    obj.bullets[obj.bullet_index].vel.add(obj.vel.copy().mult(0.5));
    obj.bullets[obj.bullet_index].acc = new p5.Vector(0.01, 0).setHeading(obj.bullets[obj.bullet_index].vel.heading());
    obj.bullet_index = (obj.bullet_index < obj.bullets.length-1) ? obj.bullet_index+1 : 0;

    // decrement bullet count
    obj.bullet_count--;
  }
}

// Check Point #2
class CP2{
  constructor() {
    // game state variable (0: Main Screen, 1: Instruction, 2: Game)
    this.game_state = 0;

    // main screen and instruction instances
    this.main_screen = new MainScreen();
    this.instruction = new Instruction();

    // game level instances
    this.game = [new Game1()];
    this.curr_level = 0;

    // initialize main screen
    this.main_screen.initialize();
  }

  draw() {
    switch(this.game_state) {
      // draw main screen
      case 0:
        this.main_screen.draw();
        break;
      // draw instruction screen
      case 1:
        this.instruction.draw();
        break;
      // draw game screen
      case 2:
        this.game[this.curr_level].draw();
        break;
    }
  }

  update() {
    switch(this.game_state) {
      case 0:
        if(this.main_screen.state_change === 1) {
          this.game_state = 1;  // update current state to "Instruction"
          this.main_screen.state_change = 0;  // reset flag variable
          this.instruction.initialize();  // initialize instruction screen
        }
        else if(this.main_screen.state_change === 2){
          this.game_state = 2;  // update current state to "in game"
          this.main_screen.state_change = 0;  // reset flag variable
          this.game[this.curr_level].initialize(); // initilalize game
        }
        else{
          this.main_screen.update();
        }
        break;
      case 1:
        if(this.instruction.state_change === 1) {
          this.game_state = 0;  // update current state to "Main screen"
          this.instruction.state_change = 0;  // reset flag variable
        }
        else{
          this.instruction.update();
        }
        break;
      case 2:
        // game in progress
        if(this.game[this.curr_level].state_change === 0) {
          this.game[this.curr_level].update();
        }
        // game won
        else if(this.game[this.curr_level].state_change === 2) {
          this.game_state = 0;
          this.game[this.curr_level].reset();
        }
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
  enemy_img.push(loadImage('assets/Enemy_Body.png'));
  enemy_img.push(loadImage('assets/Enemy_R_Foot.png'));
  enemy_img.push(loadImage('assets/Enemy_L_Foot.png'));
  createCanvas(1200, 900);

  testScreen = new MainScreen();
  testScreen1 = new Instruction();
  testScreen1.initialize();

  testScreen2 = new CP2();
}
  
function draw() {
  background(220);
  testScreen2.update();
  testScreen2.draw();
}