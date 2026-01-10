//Aliases
let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle,
  Graphics = PIXI.Graphics,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

let keys = {
  space_d: false,
  space_u: true,
  space: false,
  up: false,
  down: false,
  left: false,
  right: false,
  bomb_button: true,
};
let app = new Application({
  //Create a Pixi Application
  antialias: true, // default: false  // default: false resolution: 1 ,// default: 1
  transparent: false,
  backgroundColor: 0x000000,
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
document.body.appendChild(app.view);
let pSize;
if (window.innerWidth + window.innerWidth / 4 < window.innerHeight) {
  pSize = window.innerWidth - 15;
} else {
  pSize = window.innerHeight - window.innerHeight / 4 - 30;
}
// document.body.style.fontSize = pSize / 20 + "px";

let s_t = new TextStyle({
  fontFamily: "Arial",
  fontSize: pSize / 25,
  fill: "white",
  stroke: "white",
  strokeThickness: pSize / 400,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: pSize / 300,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: pSize / 100,
});

const margin = pSize / 3;
const pSize_h = pSize + margin;
app.renderer.resize(pSize, pSize_h);
const standard_size = pSize / 10;
const bVector = standard_size / 50;
const background = [];
const e_ships = [];
const missiles = [];
const items = [];
const half_size = standard_size / 2;
const spaceship_v = half_size / 10;
const eShip_ac = spaceship_v / 70;
const missile_ac = eShip_ac;
const e_ship_background = [];
const image = [
  "img/galaxy_fighter/spaceship.png",
  "img/galaxy_fighter/bomb.png",
  "img/galaxy_fighter/weapon.png",
];
let score_board,
  spaceship,
  score,
  total_score,
  game_over_board,
  game_start_board,
  bomb,
  bomb_explosion,
  bomb_background,
  arrow_background,
  rock_background;
const spaceship_board = [];
const bomb_board = [];
const gameSound = {};
let life = 4;
let game_over_mode = false;
let e_pb = 40;
let b_angle = 30;
const explosion_ships = [];
let spaceship_dead = false;
const fire_sound = [];
const explosion_sound = [];
let fire_sound_index = 0;
let explosion_sound_index = 0;
let rock_br = 450;
const rocks = [];
let game_start_mode = true;
let bomb_index = 0;
let bomb_index2 = 0;
let bomb_launch = false;
let bomb_num = 2;
let missile_mode = 0;
let b_angle_limit = 90;
let missiles_direction = [];
let missile_fire = 0;
let sound = 0;
for (let i = 0; i < 76; i += 15) {
  let MP = (Math.PI * (90 - i)) / 180;
  missiles_direction.push([Math.cos(MP) * 5, Math.sin(MP) * 5, i]);
}

let s_t2 = new TextStyle({
  fontFamily: "Arial",
  fontSize: pSize / 15,
  fill: "white",
  stroke: "white",
  strokeThickness: pSize / 400,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: pSize / 300,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: pSize / 100,
});
let loading = new Text("LOADING NOW", s_t2);
loading.anchor.set(0.5, 0.5);
loading.position.set(pSize / 2, pSize_h / 2);
app.stage.addChild(loading);
const loading_show = () => {
  let vector = 0.005;
  loading.alpha = 1;
  const show = () => {
    if (loading.alpha >= 1 || loading.alpha <= 0) vector = -vector;
    loading.alpha += vector;
    if (loading.visible == false) {
      app.stage.removeChild(loading);
    } else {
      requestAnimationFrame(show);
    }
  };
  show();
};
loading_show();

const cookie_write = (data) => {
  var date = new Date();
  date.setDate(date.getDate() + 2700);
  for (var key in data) {
    var cookieData = key + "=" + data[key] + ";";
    cookieData += "expires=" + date.toUTCString();
    document.cookie = cookieData;
  }
};
const cookie_read = () => {
  var cookies = document.cookie.split(";");
  var data = {};
  cookies.forEach(function (cookie) {
    var c = cookie.replace(" ", "");
    var cs = c.split("=");
    data[cs[0]] = cs[1];
  });
  return data;
};

let filter = "win16|win32|win64|mac|macintel";
const mobile_check = () => {
  if (navigator.platform) {
    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
      return true;
    } else {
      //pc alert('pc 접속'); }
      return false;
    }
  }
};
const mobile_now = mobile_check();
const getMobileOperatingSystem = () => {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  return "unknown";
};
const ios_now = getMobileOperatingSystem() == "iOS" ? true : false;
console.log("mobile_now :", mobile_now);
console.log("ios_now :", ios_now);

let docV = document.documentElement;

const touch_vib = (size = 10) => {
  if (!ios_now && !!mobile_now) navigator.vibrate(size);
};
const joystick_prepare = () => {
  let buttons = Object.keys(
    resources["img/galaxy_fighter/buttons.json"].textures
  );
  let b_sprites = {};
  const s_width = pSize / 6;
  buttons.forEach((b) => {
    let s = sprite_prepare("img/galaxy_fighter/buttons.json", b);
    s.interactive = true;
    s.buttonMode = true;
    s.width = s_width;
    s.o_size = s_width;
    s.height = s_width;
    s.y = pSize_h - s_width;
    app.stage.addChild(s);
    b_sprites[b] = s;
  });
  b_sprites.green_button.visible = false;
  b_sprites.yellow_button.x = pSize - s_width;
  b_sprites.yellow_button.on("pointerdown", (event) => {
    if (!gameSound.bgm.isPlaying) gameSound.bgm.play();
    keys.space = true;
    button_down_effect(b_sprites.yellow_button);
  });
  b_sprites.yellow_button.on("pointerup", (event) => {
    keys.space = false;
    button_up_effect(b_sprites.yellow_button);
  });
  b_sprites.yellow_button.on("touchendoutside", (event) => {
    keys.space = false;
    button_up_effect(b_sprites.yellow_button);
  });
  b_sprites.red_button.x = pSize - s_width * 2 - half_size;
  b_sprites.red_button.on("pointerdown", (event) => {
    if (!bomb_launch) bomb_setup();
    button_down_effect(b_sprites.red_button);
  });
  b_sprites.red_button.on("pointerup", (event) => {
    button_up_effect(b_sprites.red_button);
  });
  b_sprites.red_button.on("touchendoutside", (event) => {
    button_up_effect(b_sprites.red_button);
  });
  b_sprites.blue_button_inside.x = s_width;
  b_sprites.blue_button_outside.x = s_width;
  b_sprites.blue_button_inside.width = (s_width * 150) / 100;
  b_sprites.blue_button_inside.height = (s_width * 150) / 100;
  b_sprites.blue_button_inside.ox = b_sprites.blue_button_inside.x;
  b_sprites.blue_button_inside.oy = b_sprites.blue_button_inside.y;
  b_sprites.blue_button_inside
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", onDragMove);
};
const button_down_effect = (b) => {
  b.width = (b.width * 4) / 5;
  b.height = (b.height * 4) / 5;
  b.alpha = 0.7;
};
const button_up_effect = (b) => {
  b.width = b.o_size;
  b.height = b.o_size;
  b.alpha = 1;
};
function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  this.data = event.data;
  this.alpha = 0.7;
  this.dragging = true;
}
function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.x = this.ox;
  this.y = this.oy;
  this.data = null;
  keys.left = false;
  keys.right = false;
  keys.up = false;
  keys.down = false;
}
function onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
    let xGap = Math.abs(this.x - this.ox);
    let yGap = Math.abs(this.y - this.oy);
    if (xGap > yGap * 3) {
      if (this.x > this.ox) {
        keys.left = false;
        keys.right = true;
        keys.up = false;
        keys.down = false;
      } else {
        keys.left = true;
        keys.right = false;
        keys.up = false;
        keys.down = false;
      }
    } else if (yGap > xGap * 3) {
      if (this.y > this.oy) {
        keys.up = false;
        keys.down = true;
        keys.left = false;
        keys.right = false;
      } else {
        keys.up = true;
        keys.down = false;
        keys.left = false;
        keys.right = false;
      }
    } else {
      if (this.x < this.ox) {
        keys.left = true;
        keys.right = false;
      } else {
        keys.left = false;
        keys.right = true;
      }
      if (this.y < this.oy) {
        keys.up = true;
        keys.down = false;
      } else {
        keys.up = false;
        keys.down = true;
      }
    }
    // if (this.x > this.ox) {
    //   keys.right = true;
    //   keys.left = false;
    // }
    // if (this.x < this.ox) {
    //   keys.left = true;
    //   keys.right = false;
    // }
    // if (this.y < this.oy) {
    //   keys.up = true;
    //   keys.down = false;
    // }
    // if (this.y > this.oy) {
    //   keys.down = true;
    //   keys.up = false;
    // }
  }
}

const background_setup = () => {
  for (let i = 0; i < 4; i++) {
    background[i] = new Container();
    background[i].pivot.set(pSize / 2, pSize_h / 2);
    background[i].position.set(pSize / 2, pSize_h / 2);
    background[i].y += pSize_h * (i % 2);
    app.stage.addChild(background[i]);
    for (let j = 0; j < 100; j++) {
      let star = sprite_prepare("img/galaxy_fighter/star.png");
      star.position.set(Math.random() * pSize, Math.random() * pSize_h);
      let size = 1 + (Math.random() * pSize) / 150;
      star.rotation = Math.random() - 0.5;
      star.width = size;
      star.height = size;
      background[i].addChild(star);
    }
  } // bomb_background
  bomb_background = new Container();
  app.stage.addChild(bomb_background);
  // e_ship_background
  for (let i = 0; i < 2; i++) {
    e_ship_background[i] = new Container();
    e_ship_background[i].pivot.set(pSize / 2, pSize_h / 2);
    e_ship_background[i].position.set(pSize / 2, pSize_h / 2);
    e_ship_background[i].vector = 0.05;
    app.stage.addChild(e_ship_background[i]);
  } // rock_background, bomb_background
  rock_background = new Container();
  app.stage.addChild(rock_background);
  // score_board
  total_score = 0;
  score_board = new Container();
  score_board.pivot.set(pSize / 2, margin / 2);
  score_board.position.set(pSize / 2, margin / 2);
  score = new Text("SCORE: 000000", s_t);
  score.anchor.set(0.5, 0.5);
  score.position.set((pSize * 4) / 5, margin / 4);
  score_board.addChild(score);
  let x_space = standard_size / 1.5;
  for (let i = 0; i < 5; i++) {
    spaceship_board[i] = sprite_prepare("img/galaxy_fighter/spaceship.png");
    spaceship_board[i].width = half_size;
    spaceship_board[i].height = half_size;
    spaceship_board[i].position.set(pSize / 11 + x_space * i, margin / 4.3);
    score_board.addChild(spaceship_board[i]);
  }
  let b_space = standard_size / 1.9;
  for (let i = 0; i < 3; i++) {
    bomb_board[i] = sprite_prepare("img/galaxy_fighter/bomb.png");
    bomb_board[i].angle = 180 + 45;
    bomb_board[i].width = half_size;
    bomb_board[i].height = half_size;
    bomb_board[i].position.set(pSize / 2.3 + b_space * i, margin / 4.1);
    score_board.addChild(bomb_board[i]);
  }
  app.stage.addChild(score_board);
};

const missile_setup = () => {
  if (keys.space && missile_fire == 0) {
    for (let i = 0; i < missile_mode + 1; i++) {
      let md = missiles_direction[i];
      if (i == 0) {
        missile_prepare(md[0], md[1], md[2]);
      } else {
        missile_prepare(md[0], md[1], md[2]);
        missile_prepare(-md[0], md[1], -md[2]);
      }
    }
    keys.space_u = false;
    gameSound.fire.play();
  }
  missile_fire++;
  if (missile_fire > 15 + missile_mode || !keys.space) missile_fire = 0;
};

const missile_prepare = (vx, vy, angle) => {
  let missile = sprite_prepare("img/galaxy_fighter/missile.png");
  missile.position.set(spaceship.x, spaceship.y - half_size);
  missile.width = half_size * 0.5;
  missile.height = half_size * 0.5;
  missile.angle = angle;
  missile.vx = vx;
  missile.vy = vy;
  app.stage.addChild(missile);
  missiles.unshift(missile);
};

const missile_move = () => {
  missile_setup();
  missiles.forEach((m) => {
    if (m.visible) {
      m.y -= m.vy;
      m.x += m.vx;
      m.vy += missile_ac;
      if (m.y < -standard_size) m.visible = false;
    }
  });
  if (missiles.length > 100) {
    app.stage.removeChild(missiles.pop());
  }
};
const missile_collision_test = (ex, ey) => {
  for (m of missiles) {
    if (
      m.visible &&
      Math.abs(m.x - ex) < half_size &&
      Math.abs(m.y - ey) < half_size
    ) {
      m.visible = false;
      return true;
    }
  }
  return false;
};
const bomb_collision_test = (ex, ey, size) => {
  if (bomb_explosion.visible) {
    let g = size + bomb_explosion.width / 4;
    if (
      Math.abs(bomb_explosion.x - ex) < g &&
      Math.abs(bomb_explosion.y - ey) < g
    ) {
      return true;
    }
  }
  return false;
};
const e_ship_setup = () => {
  let random_num = Math.floor(Math.random() * e_pb);
  if (random_num == 1) {
    let r_num = Math.floor(Math.random() * 4) + 1;
    let e_ship = sprite_prepare(
      "img/galaxy_fighter/e.json",
      "e" + r_num + ".png"
    );
    e_ship.width = standard_size;
    e_ship.height = (standard_size * 5) / 4;
    e_ship.position.set(
      Math.random() * (pSize - standard_size) + half_size,
      -standard_size * 2
    );
    e_ship.vx = Math.random() * spaceship_v - 2.5;
    e_ship.vy = spaceship_v;
    e_ship.bg = Math.floor(Math.random() * 2) % 2;
    e_ship_background[e_ship.bg].addChild(e_ship);
    e_ships.unshift(e_ship);
  }
};
const e_ship_move = () => {
  e_ship_setup();
  e_ships.forEach((e) => {
    if (e.visible) {
      e.y += e.vy;
      e.x += e.vx;
      e.vy += eShip_ac;
      if (e.x > pSize - half_size || e.x - half_size < 0) e.vx = -e.vx;
      if (e.y > pSize_h + standard_size) e.visible = false;
      let gx = e.getGlobalPosition().x;
      let gy = e.getGlobalPosition().y;
      if (spaceship_collision_test(gx, gy)) {
        e.visible = false;
        if (life >= 0) spaceship_board[life].visible = false;
        gameSound.spaceship_dead.play();
        spaceship_dead = true;
        missile_mode = 0; // missile reset
        life--; // 생명이 줄어듬.
      } else if (
        missile_collision_test(gx, gy) ||
        (bomb_launch && bomb_collision_test(gx, gy, half_size))
      ) {
        score_up();
        if (e_pb > 10) e_pb -= 0.5;
        if (b_angle < b_angle_limit) b_angle += 1;
        e.visible = false;
        explosion_setup(gx, gy, standard_size);
      }
    }
  });
  if (e_ships.length > 100) {
    e_ship_background[e_ships[e_ships.length - 1].bg].removeChild(
      e_ships.pop()
    );
  }
  e_ship_background[0].angle += e_ship_background[0].vector;
  e_ship_background[1].angle = -e_ship_background[0].angle;
  if (
    e_ship_background[0].angle < -b_angle ||
    e_ship_background[0].angle > b_angle
  )
    e_ship_background[0].vector = -e_ship_background[0].vector;
};
const score_up = (score_up_num = 10) => {
  let zero = "";
  total_score += score_up_num;
  if (total_score < 100) {
    b_angle_limit = 60;
    zero = "0000";
  } else if (total_score < 1000) {
    b_angle_limit = 90;
    zero = "000";
  } else if (total_score < 10000) {
    if (missile_mode > 2) {
      e_pb = 35;
      b_angle_limit = 110;
    } else {
      e_pb = 40;
      b_angle_limit = 60;
    }
    zero = "00";
  } else if (total_score < 100000) {
    if (missile_mode > 2) {
      e_pb = 30;
      b_angle_limit = 125;
    } else {
      e_pb = 40;
      b_angle_limit = 60;
    }
    zero = "0";
  }
  score.text = "SCORE: " + zero + total_score;
  let c = cookie_read();
  let bs = c.g_best_score == undefined ? 0 : Number(c.g_best_score);
  if (total_score > bs) {
    cookie_write({ g_best_score: zero + String(total_score) });
  }
};
const spaceship_collision_test = (ex, ey) => {
  if (
    Math.abs(ex - spaceship.x) < half_size &&
    Math.abs(ey - spaceship.y) < half_size
  ) {
    return true;
  } else {
    return false;
  }
};
const start_loader = () => {
  let photo = [
    "img/galaxy_fighter/bomb.png",
    "img/galaxy_fighter/bomb_explosion.json",
    "img/galaxy_fighter/buttons.json",
    "img/galaxy_fighter/e.json",
    "img/galaxy_fighter/explosion.json",
    "img/galaxy_fighter/missile.png",
    "img/galaxy_fighter/rocks.json",
    "img/galaxy_fighter/spaceship.png",
    "img/galaxy_fighter/star.png",
    "img/galaxy_fighter/weapon.png",
  ];
  var music = [
    "music/galaxy_fighter/bgm.mp3",
    "music/galaxy_fighter/bomb_drop.mp3",
    "music/galaxy_fighter/bomb_explosion.mp3",
    "music/galaxy_fighter/ending.mp3",
    "music/galaxy_fighter/explosion.mp3",
    "music/galaxy_fighter/fire.mp3",
    "music/galaxy_fighter/power_up.mp3",
    "music/galaxy_fighter/spaceship_dead.mp3",
  ];
  loader
    .add(photo)
    .add(music)
    .load(() => {
      loading.visible = false;
      music.forEach(function (m) {
        var m_replace = m
          .replace(".mp3", "")
          .replace("music/galaxy_fighter/", "");
        gameSound[m_replace] = PIXI.Loader.shared.resources[m].sound;
      });

      background_setup();
      if (mobile_now) joystick_prepare();
      spaceship_setup();
      game_start_board_setup();
    });
};
const sprite_prepare = (t1, t2) => {
  if (t2 == undefined) {
    let s1 = new Sprite(resources[t1].texture);
    s1.anchor.set(0.5, 0.5);
    return s1;
  } else {
    let s2 = new Sprite(resources[t1].textures[t2]);
    s2.anchor.set(0.5, 0.5);
    return s2;
  }
};
const bomb_setup = () => {
  if (bomb_num > -1) {
    gameSound.bomb_drop.play();
    bomb = sprite_prepare("img/galaxy_fighter/bomb.png");
    bomb.width = standard_size * 0.8;
    bomb.height = bomb.width;
    bomb.x = spaceship.x;
    bomb.y = spaceship.y - half_size;
    bomb_explosion = sprite_prepare(
      "img/galaxy_fighter/bomb_explosion.json",
      "0"
    );
    bomb_explosion.x = bomb.x;
    bomb_explosion.width = standard_size * 12;
    bomb_explosion.height = bomb_explosion.width;
    bomb.visible = true;
    bomb_explosion.visible = false;
    bomb_background.addChild(bomb_explosion);
    app.stage.addChild(bomb);
    bomb_board[bomb_num].visible = false;
    bomb_num--;
    bomb_launch = true;
  }
};
const bomb_move = () => {
  if (bomb_launch) {
    if (bomb_index < 60) {
      bomb.y -= 2;
      bomb.height -= 0.3;
      bomb.width -= 0.1;
      bomb_index++;
    } else if (bomb_index < 130) {
      touch_vib(300);
      if (!gameSound.bomb_explosion.isPlaying) gameSound.bomb_explosion.play();
      bomb.visible = false;
      bomb_explosion.y = bomb.y;
      bomb_explosion.visible = true;
      bomb_index2++;
      if (bomb_index2 % 2 == 0) bomb_index++;
      bomb_explosion.texture =
        resources["img/galaxy_fighter/bomb_explosion.json"].textures[
          String(bomb_index - 61)
        ];
      e_ship_background[0].x += Math.random() * 6 - 3;
      e_ship_background[0].y += Math.random() * 6 - 3;
      e_ship_background[1].x += Math.random() * 6 - 3;
      e_ship_background[1].y += Math.random() * 6 - 3;
    } else {
      bomb_explosion.visible = false;
      bomb_index = 0;
      app.stage.removeChild(bomb);
      bomb_background.removeChild(bomb_explosion);
      bomb_launch = false;
      e_ship_background[0].position.set(pSize / 2, pSize_h / 2);
      e_ship_background[1].position.set(pSize / 2, pSize_h / 2);
    }
  }
};
const text_board_prepare = () => {
  let text_board = new Graphics();
  let b_size = pSize - pSize / 6;
  text_board.beginFill(0xffffff);
  text_board.drawRoundedRect(0, 0, b_size, b_size, b_size / 35);
  text_board.endFill();
  text_board.pivot.x = b_size / 2;
  text_board.pivot.y = b_size / 2;
  text_board.x = pSize / 2;
  text_board.y = pSize_h / 2;
  text_board.alpha = 0.3;
  text_board.interactive = true;
  text_board.buttonMode = true;
  return text_board;
};

const game_start_board_setup = () => {
  game_start_board = new Container();
  app.stage.addChild(game_start_board);
  let c = cookie_read();
  let bs = c.g_best_score == undefined ? "000000" : c.g_best_score;
  let text_board = text_board_prepare();
  let t1 = text_prepare("GALAXY FIGHTER", pSize_h / 2 - margin / 1.8);
  let t2 = text_prepare("BEST SCORE: " + bs, pSize_h / 2);
  let t3 = text_prepare("LET'S START !!", pSize_h / 2 + margin / 1.8);
  text_board.interactive = true;
  text_board.buttonMode = true;
  text_board.on("pointerdown", (event) => {
    if (game_start_mode) {
      game_start_mode = false;
      game_start_board.visible = false;
      animate();
    }
  });
  game_start_board.addChild(text_board);
  game_start_board.addChild(t1);
  game_start_board.addChild(t2);
  game_start_board.addChild(t3);
};
const text_prepare = (text, y) => {
  let t = new Text(text, s_t);
  t.anchor.set(0.5, 0.5);
  t.x = pSize / 2;
  t.y = y;

  return t;
};
const explosion_setup = (x, y, size) => {
  let e = sprite_prepare("img/galaxy_fighter/explosion.json", "0");
  touch_vib();
  e.width = size * 1.2;
  e.height = size * 1.2;
  e.index = 0;
  e.angle = Math.random() * 360;
  e.x = x;
  e.y = y;
  app.stage.addChild(e);
  explosion_ships.unshift(e);
  gameSound.explosion.play();
};
const explosion_move = () => {
  explosion_ships.forEach((e) => {
    if (e.visible && e.index < 63) {
      e.index++;
      e.texture =
        resources["img/galaxy_fighter/explosion.json"].textures[
          String(e.index)
        ];
    } else {
      e.visible = false;
    }
  });
  if (explosion_ships.length > 20) {
    app.stage.removeChild(explosion_ships.pop());
  }
};

const spaceship_setup = () => {
  spaceship = sprite_prepare("img/galaxy_fighter/spaceship.png");
  spaceship.position.set(pSize / 2, pSize);
  spaceship.width = standard_size;
  spaceship.height = standard_size;
  app.stage.addChild(spaceship);
};
const spaceship_move = () => {
  if (keys.up && spaceship.y - half_size > 0) spaceship.y -= spaceship_v;
  if (keys.down && spaceship.y + half_size < pSize_h)
    spaceship.y += spaceship_v;
  if (keys.left && spaceship.x - half_size > 0) spaceship.x -= spaceship_v;
  if (keys.right && spaceship.x + half_size < pSize) spaceship.x += spaceship_v;
  if (spaceship_dead) {
    spaceship.angle += 6;
    if (spaceship.angle > 360) {
      spaceship_dead = false;
      spaceship.angle = 0;
    }
  }
};

const background_move = () => {
  for (let i = 0; i < 4; i++) {
    let vy = i < 2 ? bVector : bVector / 2;
    background[i].y += vy;
    if (background[i].y > (pSize_h * 3) / 2) background[i].y = -pSize_h / 2;
  }
};
const rock_setup = () => {
  let r = Math.floor(Math.random() * rock_br);
  if (r == 1) {
    let rock = sprite_prepare(
      "img/galaxy_fighter/rocks.json",
      String(Math.floor(Math.random() * 3))
    );
    rock.angle = Math.random() * 360;
    rock.width = 50 + Math.random() * 120;
    rock.vector = 0.7 + Math.random();
    rock.height =
      rock.width - rock.width / 3 + (Math.random() * rock.width) / 1.5;
    rock.position.set(
      rock.width / 2 + Math.random() * (pSize - rock.width),
      -rock.height
    );
    rock_background.addChild(rock);
    rocks.unshift(rock);
  }
};
const rock_move = () => {
  rock_setup();
  rocks.forEach((r) => {
    if (r.visible) {
      r.y += r.vector;
      if (rock_collision_test(r)) {
        if (life >= 0) spaceship_board[life].visible = false;
        r.visible = false;
        gameSound.spaceship_dead.play();
        spaceship_dead = true;
        missile_mode = 0; // missile reset
        life--; // 생명이 줄어듬.
      }
      if (bomb_launch && bomb_collision_test(r.x, r.y, r.width / 2)) {
        r.visible = false;
        explosion_setup(r.x, r.y, r.width);
      }
      if (r.y > pSize_h + r.height) {
        r.visible = false;
      }
    }
  });
  if (rocks.length > 30) rock_background.removeChild(rocks.pop());
};
const rock_collision_test = (rock) => {
  if (
    Math.abs(spaceship.x - rock.x) < rock.width / 2 &&
    Math.abs(spaceship.y - rock.y) < rock.height / 2
  ) {
    return true;
  } else {
    return false;
  }
};
const item_setup = () => {
  // spaceship, bomb, weapon
  let r = Math.floor(Math.random() * 2000);
  if (r < 3) {
    let item = sprite_prepare(image[r]);
    item.r = r;
    item.vr = Math.random() * 2 - 1;
    item.vy = 5 + Math.random() * 10 - 5;
    item.angle = Math.random() * 360;
    item.width = standard_size * 0.7;
    item.height = item.width;
    item.x = item.width / 2 + Math.random() * (pSize - item.width);
    item.y = -standard_size;
    app.stage.addChild(item);
    items.unshift(item);
  }
};
const item_move = () => {
  item_setup();
  items.forEach((it) => {
    if (it.visible) {
      it.y += it.vy;
      it.angle += it.vr;
      if (spaceship_collision_test(it.x, it.y)) {
        gameSound.power_up.play();
        switch (it.r) {
          case 0:
            if (life < 4) {
              life++;
              spaceship_board[life].visible = true;
            } else {
              score_up(500);
            }
            break;
          case 1:
            if (bomb_num < 2) {
              bomb_num++;
              bomb_board[bomb_num].visible = true;
            } else {
              score_up(500);
            }
            break;
          case 2:
            if (missile_mode < 5) {
              missile_mode++;
            } else {
              score_up(500);
            }
            break;
        }
        it.visible = false;
      }
    }
  });
};
const animate = () => {
  background_move();
  e_ship_move();
  missile_move();
  spaceship_move();
  explosion_move();
  rock_move();
  bomb_move();
  item_move();
  if (life > -1) {
    requestAnimationFrame(animate);
  } else {
    game_over();
  }
};

const game_over = () => {
  gameSound.bgm.pause();
  gameSound.ending.play();
  game_over_mode = true;
  game_over_board = new Container();
  let c = cookie_read();
  let bs = c.g_best_score == undefined ? "000000" : c.g_best_score;
  let text_board = text_board_prepare();
  let t1 = text_prepare("GAME OVER", pSize_h / 2 - margin / 1.8);
  let t2 = text_prepare("BEST SCORE: " + bs, pSize_h / 2);
  let t3 = text_prepare(score.text, pSize_h / 2 + margin / 1.8);
  text_board.on("pointerdown", (event) => {
    if (game_over_mode) new_start();
  });
  game_over_board.addChild(text_board);
  game_over_board.addChild(t1);
  game_over_board.addChild(t2);
  game_over_board.addChild(t3);
  if (game_over_board.visible) {
    app.stage.addChild(game_over_board);
  } else {
    game_over_board.visible = true;
  }
};
$(document).keydown((event) => {
  // console.log("down key :", event.keyCode);
  if (!gameSound.bgm.isPlaying) gameSound.bgm.play();
  let keyCode = event.keyCode;
  if (keyCode == "32") {
    keys.space = true;
    // keys.space_d = true;
  } else if (keyCode == "38" || keyCode == "87") {
    keys.up = true;
  } else if (keyCode == "40" || keyCode == "83") {
    keys.down = true;
  } else if (keyCode == "37" || keyCode == "65") {
    keys.left = true;
  } else if (keyCode == "39" || keyCode == "68") {
    keys.right = true;
  } else if (!bomb_launch && keyCode == "66") {
    bomb_setup();
  } else if (game_over_mode && keyCode == "13") {
    new_start();
  } else if (game_start_mode && keyCode == "13") {
    game_start_mode = false;
    game_start_board.visible = false;
    animate();
  }
});
$(document).keyup((event) => {
  let keyCode = event.keyCode;
  if (keyCode == "32") {
    keys.space = false;
  } else if (keyCode == "38" || keyCode == "87") {
    keys.up = false;
  } else if (keyCode == "40" || keyCode == "83") {
    keys.down = false;
  } else if (keyCode == "37" || keyCode == "65") {
    keys.left = false;
  } else if (keyCode == "39" || keyCode == "68") {
    keys.right = false;
  }
});
const new_start = () => {
  game_over_mode = false;
  game_over_board.visible = false;
  total_score = 0;
  bomb_num = 2;
  life = 4;
  bomb_board.forEach((b) => (b.visible = true));
  spaceship_board.forEach((s) => (s.visible = true));
  e_ships.forEach((e) => (e.visible = false));
  missiles.forEach((m) => (m.visible = false));
  rocks.forEach((r) => (r.visible = false));
  score.text = "SCORE: 000000";
  e_pb = 40;
  b_angle = 30;
  e_ship_background[0].rotation = 0;
  e_ships.forEach((e) => e_ships.pop());
  missiles.forEach((m) => missiles.pop());
  animate();
};
window.onload = function () {
  start_loader();
};
