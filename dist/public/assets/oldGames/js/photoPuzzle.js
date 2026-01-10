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

let app = new Application({
  //Create a Pixi Application
  antialias: true, // default: false  // default: false resolution: 1 ,// default: 1
  transparent: false,
  backgroundColor: 0xffffff,
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
document.body.appendChild(app.view);

var pSize;
if (window.innerWidth + window.innerWidth / 4 < window.innerHeight) {
  pSize = window.innerWidth - 15;
} else {
  pSize = window.innerHeight - window.innerHeight / 4 - 30;
}
document.body.style.fontSize = pSize / 20 + "px";

var margin = pSize / 3;
app.renderer.resize(pSize, pSize + margin);
var textHeight = pSize / 5;
var level_select_board_on = false;
var tileSize,
  imageFilename,
  image_num,
  select_picture,
  head_text_filename,
  loading_text,
  index;
const UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
  V = pSize / 40;
var select_mode = true;
var click_num = 0;
var total_second;
var game_time = 0;
var random_proceed = false;
var load_resource = [];
var hide_mode = 0;
var hide_tiles = [];
var random_num = Math.floor(Math.random() * 5);
var s_t = {
  fontFamily: "Clicker Script",
  fontSize: pSize / 6,
  fill: "white",
  stroke: "black",
  strokeThickness: pSize / 400,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: pSize / 300,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: pSize / 100,
};
var s_t2 = Object.assign({}, s_t);
s_t2.fontSize = pSize / 9;
var style2 = new TextStyle(s_t2);
var style = new TextStyle(s_t);
var userLevel;
var ending_mode = false;
const bestRecords = load_best_record();

var select_stage = {
  tiles: [],
  select_tile: "/p_img/0/p3.json",
  hide: function () {
    select_mode = false;
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].tile.interactive = false;
      this.tiles[i].tile.visible = false;
    }
  },
  hide_i: function () {
    select_mode = false;
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].tile.interactive = false;
    }
  },
  show: function () {
    select_mode = true;
    center_board.hide();
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].tile.interactive = true;
      this.tiles[i].tile.visible = true;
    }
  },

  head_text: function () {
    $("#t").text("loading....");
    loading_text = new Text("Loading ...", style);
    loading_text.anchor.set(0.5, 0.5);
    loading_text.position.set(pSize / 2, pSize / 2 + margin);
    app.stage.addChild(loading_text);
    loading_text.visible = false;
    head_text_filename = "img/photoPuzzle/t_image.png";
    if (resource_check(head_text_filename)) {
      loader.add(head_text_filename).load(function () {
        let t_image = new Sprite(resources[head_text_filename].texture);
        t_image.anchor.set(0.5, 0.5);
        t_image.position.set(pSize / 2, margin / 2 + pSize / 40);
        t_image.width = (pSize * 3) / 4;
        t_image.height = margin / 2;
        t_image.interactive = true;
        t_image.buttonMode = true;
        t_image.on("pointerup", (event) => {
          console.log("t_image : up");
          title_pointerup();
        });
        app.stage.addChild(t_image);
        select_stage.start();
      });
      $("#t").text("");
    }
  },
  start: function () {
    // 선택화면을 시작함.
    select_mode = true;
    this.select_tile = "img/photoPuzzle/" + game_stage.folder_num + "/p.json";
    if (resource_check(this.select_tile)) {
      loader.add(this.select_tile).load(this.setup_select);
    } else {
      this.setup_select();
    }
  },
  setup_select: function () {
    let index = 0;
    let id = resources[select_stage.select_tile].textures;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        select_stage.tiles.push(
          new select_image(new Sprite(id["s_0" + index + ".png"]))
        );
        let s = select_stage.tiles[index];
        let tSize = pSize / 3;
        s.tile.anchor.set(0.5, 0.5);
        s.tile.width = tSize - 3;
        s.tile.height = tSize - 3;
        s.tile.x = tSize * x + tSize / 2;
        s.tile.y = tSize * y + tSize / 2 + margin;
        s.tile.interactive = true;
        s.tile.buttonMode = true;
        s.tile.on("pointerup", (event) => {
          s.pointerup();
        });
        s.o_photo = index;
        app.stage.addChild(s.tile);
        index++;
      }
    }
  },
};
function select_image(image) {
  this.tile = image; // 선택 사진들
  this.o_photo = ""; // 원본 사진
  this.pointerup = function () {
    game_stage.image_num = this.o_photo;
    center_board.set_up();
  };
}
var game_stage = {
  folder_num: random_num,
  tile_num: 3,
  image_num: 0,
  tile_size: pSize / 4,
  tile_imageFilename: "0/p_img/004.json",
  o_tile: "",
  blank: {},
  tiles: [],
  start: function () {
    this.tile_size = pSize / this.tile_num;
    select_mode = false;
    this.tile_imageFilename =
      "img/photoPuzzle/" +
      this.folder_num +
      "/0" +
      this.image_num +
      this.tile_num;
    if (resource_check(this.tile_imageFilename)) {
      loader
        .add(this.tile_imageFilename, this.tile_imageFilename + ".json")
        .load(this.setup_game);
    } else {
      this.setup_game();
    }
  },
  setup_game: function () {
    console.log(game_stage.tile_imageFilename);
    click_num = 0;
    game_time = new Date();
    let index = 0;
    let id = resources[game_stage.tile_imageFilename].textures;
    let ts = game_stage.tile_size;
    for (let y = 0; y < game_stage.tile_num; y++) {
      for (let x = 0; x < game_stage.tile_num; x++) {
        game_stage.tiles.push(
          new game_image(new Sprite(id["s" + x + (y + ".png")]))
        );
        let s = game_stage.tiles[index];
        s.tile.index = index;
        s.tile.anchor.set(0.5, 0.5);
        s.tile.width = ts - 3;
        s.tile.height = ts - 3;
        s.tile.ox = x;
        s.tile.oy = y;
        s.tile.px = x;
        s.tile.py = y;
        s.tile.x = ts * s.tile.px + ts / 2;
        s.tile.y = ts * s.tile.py + ts / 2 + margin;
        s.tile.interactive = true;
        s.tile.buttonMode = true;
        s.tile.on("pointerup", (event) => {
          s.pointerup();
        });
        s.tile.xGoal = s.tile.x;
        s.tile.yGoal = s.tile.y;
        s.tile.move_on = false;
        s.tile.direction = "";
        app.stage.addChild(s.tile);
        index++;
      }
    }
    // 마지막 타일을 blank로
    game_stage.tiles[game_stage.tiles.length - 1].tile.visible = false;
    game_stage.blank["px"] =
      game_stage.tiles[game_stage.tiles.length - 1].tile.px;
    game_stage.blank["py"] =
      game_stage.tiles[game_stage.tiles.length - 1].tile.py;
    // 비교할 원본 파일 같이 불러오기
    let o_filename =
      "img/photoPuzzle/" + game_stage.folder_num + "/0" + game_stage.image_num;
    if (resource_check(o_filename)) {
      loader.add(o_filename, o_filename + ".jpg").load(game_stage.setup_game2);
    } else {
      game_stage.setup_game2();
    }
  },
  setup_game2: function () {
    let o_filename =
      "img/photoPuzzle/" + game_stage.folder_num + "/0" + game_stage.image_num;
    game_stage.o_tile = new Sprite(resources[o_filename].texture);
    game_stage.o_tile.visible = false;
    game_stage.o_tile.width = pSize;
    game_stage.o_tile.height = pSize;
    game_stage.o_tile.anchor.set(0.5, 0.5);
    game_stage.o_tile.y = pSize / 2 + margin;
    game_stage.o_tile.x = pSize / 2;
    app.stage.addChild(game_stage.o_tile);
    random_draw(); // 파일 섞기
  },
  move: function (index) {
    game_stage.o_tile.visible = false;
    let s = this.tiles[index].tile;
    let b = this.blank;
    if (s.px == b.px) {
      // blank가 y축에 있어 y축으로 이동
      if (s.py > b.py) {
        y_move(UP, s.py - b.py);
      } else {
        y_move(DOWN, -(s.py - b.py));
      }
    } else if (s.py == b.py) {
      // blank가 x축에 있어 x축으로 이동
      if (s.px > b.px) {
        x_move(LEFT, s.px - b.px);
      } else {
        x_move(RIGHT, -(s.px - b.px));
      }
    }
  },
  delete: function () {
    for (let i = 0; i < this.tiles.length; i++) {
      app.stage.removeChild(this.tiles[i].tile);
    }
    this.tiles = [];
  },
};
function game_image(image) {
  this.tile = image; // 선택 사진들
  this.pointerup = function () {
    if (game_stage.o_tile.visible) {
      game_stage.o_tile.visible = false;
    } else {
      click_num++;
      game_stage.move(this.tile.index);
    }
  };
}

var center_board = {
  c_board: "",
  set_up: function () {
    this.c_board = new Container();
    app.stage.addChild(this.c_board);

    // Move container to the center
    this.c_board.x = pSize / 2;
    this.c_board.y = pSize / 2 + margin;
    this.c_board.width = pSize - pSize / 7;
    this.c_board.height = pSize - pSize / 7;

    // Center bunny sprite in local container coordinates
    this.c_board.pivot.x = this.c_board.width / 2;
    this.c_board.pivot.y = this.c_board.height / 2;

    let text_board = new Graphics();
    text_board.beginFill(0x000000);
    text_board.drawRoundedRect(
      0,
      0,
      pSize - pSize / 6,
      pSize - pSize / 6,
      (pSize - pSize / 6) / 35
    );
    text_board.endFill();
    text_board.pivot.x = (pSize - pSize / 6) / 2;
    text_board.pivot.y = (pSize - pSize / 6) / 2;
    text_board.x = this.c_board.width / 2;
    text_board.y = this.c_board.height / 2;
    text_board.alpha = 0.3;
    this.c_board.addChild(text_board);
    if (!select_mode) {
      let complete = new Text("Complete!!", style2);
      complete.anchor.set(0.5, 0.5);
      complete.position.set(0, -(pSize / 4.7));
      this.c_board.addChild(complete);
      let click = new Text("Click: " + click_num, style2);
      click.anchor.set(0.5, 0.5);
      click.position.set(0, 0);
      this.c_board.addChild(click);
      let now_time = new Date();
      total_second = Math.floor((now_time - game_time) / 1000);
      let time = new Text("Time: " + timeString(total_second), style2);
      time.anchor.set(0.5, 0.5);
      click.position.set(0, pSize / 4.7);
      this.c_board.addChild(time);
      // 최고 기록인지 확인 후 이름 입력

      userLevel = game_stage.tile_num + "x" + game_stage.tile_num;
      let o_score = parseInt(bestRecords[userLevel].score);
      let n_score = game_stage.tile_num * 10000 - total_second - click_num * 2;
      if (n_score > o_score) {
        document.getElementById("id01").style.display = "block";
        $("#level").text(userLevel + " New Record!!");
        document.getElementById("level").style.fontSize = pSize / 15 + "px";
        document.getElementById("name_input").style.fontSize =
          pSize / 20 + "px";
        document.getElementById("submit").style.fontSize = pSize / 20 + "px";
        bestRecords[userLevel].click = click_num;
        bestRecords[userLevel].time = timeString(total_second);
        console.log("total_second :", total_second);
        bestRecords[userLevel].score = n_score;
        $("#submit").on("click", function () {
          let username = $("#name_input").val();
          bestRecords[userLevel].name = username;
          save_best_record();
          best_record_show();
          document.getElementById("id01").style.display = "none";
        });
      }
      // });
    } else {
      level_select_board_on = true;
      select_stage.hide_i();
      let level = new Text(
        "Level " + game_stage.tile_num + " x " + game_stage.tile_num,
        style2
      );
      level.anchor.set(0.5, 0.5);
      level.x = 0;
      level.y = -(pSize / 7);
      level.interactive = true;
      level.buttonMode = true;
      level.on("pointerup", (event) => {
        game_stage.tile_num++;
        if (game_stage.tile_num > 8) {
          game_stage.tile_num = 3;
        }
        level.text =
          "Level " + game_stage.tile_num + " x " + game_stage.tile_num;
      });
      this.c_board.addChild(level);
      let start = new Text("Start", style2);
      start.anchor.set(0.5, 0.5);
      start.x = 0;
      start.y = pSize / 7;
      console.log(start);
      start.interactive = true;
      start.buttonMode = true;
      start.on("pointerup", (event) => {
        level_select_board_on = false;
        center_board.hide();
        select_stage.hide();
        game_stage.start();
      });
      this.c_board.addChild(start);
      app.stage.addChild(this.c_board);
    }
  },
  hide: function () {
    ending_mode = false;
    this.c_board.visible = false;
  },
};

function random_draw() {
  let tile_total_number = Math.pow(game_stage.tile_num, 2) - 1;
  random_proceed = true;
  for (let i = 0; i < 2000; i++) {
    game_stage.move(Math.floor(Math.random() * tile_total_number));
  }
  console.log("random f");
  random_proceed = false;
}

function y_move(direction, num) {
  let b = game_stage.blank;
  let tile;
  for (let i = 0; i < num; i++) {
    if (direction == UP) {
      tile = tile_seeker(b.px, b.py + 1);
      tile_p_change(tile, 0, -1, UP);
      b.py += 1;
    } else {
      tile = tile_seeker(b.px, b.py - 1);
      tile_p_change(tile, 0, 1, DOWN);
      b.py -= 1;
    }
  }
  tile_draw();
}
function x_move(direction, num) {
  let b = game_stage.blank;
  let tiles = [];
  let tile;
  for (let i = 0; i < num; i++) {
    if (direction == LEFT) {
      tile = tile_seeker(b.px + 1, b.py);
      tile_p_change(tile, -1, 0, LEFT);
      b.px += 1;
    } else {
      tile = tile_seeker(b.px - 1, b.py);
      tile_p_change(tile, 1, 0, RIGHT);
      b.px -= 1;
    }
  }
  tile_draw();
}

function tile_seeker(px, py) {
  for (let i = 0; i < game_stage.tiles.length; i++) {
    if (
      game_stage.tiles[i].tile.px == px &&
      game_stage.tiles[i].tile.py == py
    ) {
      return game_stage.tiles[i].tile;
    }
  }
}

function tile_draw() {
  let length = game_stage.tiles.length;
  let index = false;
  drawing = true;
  for (let i = 0; i < length - 1; i++) {
    let tile = game_stage.tiles[i].tile;
    if (tile.move_on) {
      index = true;
      switch (tile.direction) {
        case LEFT:
          tile.x -= V;
          if (tile.x <= tile.xGoal || random_proceed) {
            tile.move_on = false;
            tile.x = tile.xGoal;
          }
          break;
        case RIGHT:
          tile.x += V;
          if (tile.x >= tile.xGoal || random_proceed) {
            tile.move_on = false;
            tile.x = tile.xGoal;
          }
          break;
        case UP:
          tile.y -= V;
          if (tile.y <= tile.yGoal || random_proceed) {
            tile.move_on = false;
            tile.y = tile.yGoal;
          }
          break;
        case DOWN:
          tile.y += V;
          if (tile.y >= tile.yGoal || random_proceed) {
            tile.move_on = false;
            tile.y = tile.yGoal;
          }
          break;
      }
    }
  }
  if (index && !random_proceed) {
    requestAnimationFrame(tile_draw);
  } else {
    // 퍼즐 완성 체크
    if (!random_proceed && ending_check()) {
      let s = game_stage.o_tile;
      console.log("퍼즐이 완성되었습니다.");
      s.width = 0;
      s.height = 0;
      s.visible = true;
      s.interactive = true;
      ending_mode = true;
      setTimeout(function () {
        ending_ani();
        s.on("pointerup", (event) => {
          s.interactive = false;
          s.visible = false;
          select_mode = true;
          select_stage.show();
        });
      }, 1000);
    }
  }
}

function title_pointerup() {
  console.log("select_mode :", select_mode);
  if (!select_mode) {
    if (ending_mode) {
      best_record_show();
    } else {
      game_stage.o_tile.visible = !game_stage.o_tile.visible;
      if (level_select_board_on) {
        center_board.hide();
        level_select_board_on = false;
        game_stage.o_tile.visible = false;
        select_stage.show();
      }
    }
  } else {
    game_stage.folder_num++;
    if (game_stage.folder_num > 4) game_stage.folder_num = 0;
    select_stage.hide();
    select_stage.tiles = [];
    select_stage.start();
  }
}

function save_best_record() {
  localStorage.setItem("bestRecords", JSON.stringify(bestRecords));
}
function load_best_record() {
  const bestRecords_original = {
    "3x3": { name: "장민", score: 29000, click: 10, time: "00:30" },
    "4x4": { name: "장민", score: 38000, click: 200, time: "01:00" },
    "5x5": { name: "장민", score: 45000, click: 300, time: "02:00" },
    "6x6": { name: "장민", score: 52000, click: 400, time: "03:00" },
    "7x7": { name: "장민", score: 60000, click: 500, time: "04:00" },
    "8x8": { name: "장민", score: 70000, click: 600, time: "05:00" },
  };
  let loaded_data = JSON.parse(localStorage.getItem("bestRecords"));
  try {
    for (let i = 3; i < 9; i++) {
      bestRecords[i + "x" + i].name = loaded_data[i + "x" + i].name;
      bestRecords[i + "x" + i].score = loaded_data[i + "x" + i].score;
      bestRecords[i + "x" + i].click = loaded_data[i + "x" + i].click;
      bestRecords[i + "x" + i].time = loaded_data[i + "x" + i].time;
    }
  } catch (e) {
    console.log("No saved best records");
    return bestRecords_original;
  }
  return loaded_data;
}

function best_record_show() {
  for (let i = 3; i < 9; i++) {
    $("#t" + i + 0).text(bestRecords[i + "x" + i].name);
    $("#t" + i + 1).text(bestRecords[i + "x" + i].score);
    $("#t" + i + 2).text(bestRecords[i + "x" + i].click);
    $("#t" + i + 3).text(bestRecords[i + "x" + i].time);
  }
  document.getElementById("best_record").style.fontSize = pSize / 15 + "px";
  document.getElementById("id02").style.display = "block";
  $("#id02").on("click", function () {
    document.getElementById("id02").style.display = "none";
  });
}

function timeString(seconds) {
  let t_s = parseInt(seconds);
  let m = t_s / 60 < 10 ? "0" + Math.floor(t_s / 60) : Math.floor(t_s / 60);
  let s = t_s % 60 < 10 ? "0" + Math.floor(t_s % 60) : Math.floor(t_s % 60);
  return m + ":" + s;
}

function ending_check() {
  let s = game_stage.tiles;
  for (let i = 0; i < s.length; i++) {
    if (s[i].tile.px == s[i].tile.ox && s[i].tile.py == s[i].tile.oy) {
    } else {
      console.log("아직 완성안됨");
      return false;
    }
  }
  return true;
}
function ending_ani() {
  game_stage.delete();
  game_stage.o_tile.width += 15;
  game_stage.o_tile.height += 15;
  if (game_stage.o_tile.width < pSize) {
    requestAnimationFrame(ending_ani);
  } else {
    game_stage.o_tile.width = pSize;
    game_stage.o_tile.height = pSize;
    center_board.set_up();
  }
}
function tile_p_change(tile, x, y, direction) {
  let ts = game_stage.tile_size;
  tile.direction = direction;
  tile.move_on = true;
  tile.px += x;
  tile.py += y;
  tile.xGoal = ts * tile.px + ts / 2;
  tile.yGoal = ts * tile.py + ts / 2 + margin;
}
function resource_check(filename) {
  if (load_resource.indexOf(filename) == -1) {
    load_resource.push(filename);
    return true;
  } else {
    return false;
  }
}

select_stage.head_text();
