// board object 선언
var gameboard = {
  name: "gameboard",
  y: 22,
  x: 10,
  type: 4,
  version: 1,
  bgcolor: "",
};
var previewBoard1 = {
  name: "previewBoard1",
  y: 5,
  x: 5,
  type: 3,
  version: 2,
  bgcolor: "",
};
var previewBoard2 = {
  name: "previewBoard2",
  y: 5,
  x: 5,
  type: 5,
  version: 2,
  bgcolor: "",
};
var information = { name: "information", y: 61, x: 12, bgcolor: "" };
var music_list = [
  "BGM_Tetris_Bradinsky.mp3",
  "BGM_Tetris_Kalinka.mp3",
  "BGM_Tetris_Loginska.mp3",
  "BGM_Tetris_Troika.mp3",
];
var pad = ["left_pad", "rotate_pad", "bottom_pad", "down_pad", "right_pad"];
var best_player = "";
var best_score = 0;
var model = "mobile";
var mobile_os = "";
var iOS_ending = false;
const record_name = "tetris_best_scores";

// 변수선언
var score = 0;
var level = 1;

// 상수 선언
const Rectangle = 0,
  Stick = 1,
  R_curved = 2,
  L_curved = 3,
  ZigZeg1 = 4,
  ZigZeg2 = 5,
  Pinup = 6;
const Left = 0,
  Right = 1,
  Down = 2,
  Bottom = 3,
  Stop = 4;
const On = true,
  Off = false;

// 블럭 object 선언
var block = {
  type: Rectangle,
  version: 0,
  board: gameboard,
  col: 2,
  row: 2,
  now_on: Off,
  rotating: Off,
  direction: Stop,
  new_on: function () {
    init_board();
  },

  color: function () {
    switch (this.type) {
      case Rectangle:
        return "yellow";
      case Stick:
        return "red";
      case R_curved:
        return "purple";
      case L_curved:
        return "green";
      case ZigZeg1:
        return "blue";
      case ZigZeg2:
        return "brown";
      case Pinup:
        return "orange";
    }
  },

  position: function () {
    let col = this.col;
    let row = this.row;
    switch (this.type) {
      case Rectangle:
        return [
          [col, row],
          [col + 1, row],
          [col, row + 1],
          [col + 1, row + 1],
        ];
      case Stick:
        switch (this.version % 4) {
          case 0:
            return [
              [col - 1, row],
              [col, row],
              [col + 1, row],
              [col + 2, row],
            ];
          case 1:
            return [
              [col, row - 2],
              [col, row - 1],
              [col, row],
              [col, row + 1],
            ];
          case 2:
            return [
              [col - 2, row],
              [col - 1, row],
              [col, row],
              [col + 1, row],
            ];
          case 3:
            return [
              [col, row - 1],
              [col, row],
              [col, row + 1],
              [col, row + 2],
            ];
        }
      case R_curved:
        switch (this.version % 4) {
          case 0:
            return [
              [col, row],
              [col + 1, row],
              [col - 1, row],
              [col - 1, row + 1],
            ];
          case 1:
            return [
              [col, row - 1],
              [col, row],
              [col, row + 1],
              [col + 1, row + 1],
            ];
          case 2:
            return [
              [col - 1, row],
              [col, row],
              [col + 1, row],
              [col + 1, row - 1],
            ];
          case 3:
            return [
              [col - 1, row - 1],
              [col, row - 1],
              [col, row],
              [col, row + 1],
            ];
        }
      case L_curved:
        switch (this.version % 4) {
          case 0:
            return [
              [col - 1, row - 1],
              [col - 1, row],
              [col, row],
              [col + 1, row],
            ];
          case 1:
            return [
              [col, row - 1],
              [col, row],
              [col, row + 1],
              [col - 1, row + 1],
            ];
          case 2:
            return [
              [col - 1, row],
              [col, row],
              [col + 1, row],
              [col + 1, row + 1],
            ];
          case 3:
            return [
              [col + 1, row - 1],
              [col, row - 1],
              [col, row],
              [col, row + 1],
            ];
        }
      case ZigZeg1:
        switch (this.version % 4) {
          case 0:
            return [
              [col, row - 1],
              [col, row],
              [col + 1, row],
              [col + 1, row + 1],
            ];
          case 1:
            return [
              [col, row - 1],
              [col + 1, row - 1],
              [col, row],
              [col - 1, row],
            ];
          case 2:
            return [
              [col - 1, row - 1],
              [col - 1, row],
              [col, row],
              [col, row + 1],
            ];
          case 3:
            return [
              [col, row],
              [col + 1, row],
              [col, row + 1],
              [col - 1, row + 1],
            ];
        }
      case ZigZeg2:
        switch (this.version % 4) {
          case 0:
            return [
              [col + 1, row - 1],
              [col + 1, row],
              [col, row],
              [col, row + 1],
            ];
          case 1:
            return [
              [col - 1, row - 1],
              [col, row - 1],
              [col, row],
              [col + 1, row],
            ];
          case 2:
            return [
              [col, row - 1],
              [col, row],
              [col - 1, row],
              [col - 1, row + 1],
            ];
          case 3:
            return [
              [col, row],
              [col - 1, row],
              [col, row + 1],
              [col + 1, row + 1],
            ];
        }
      case Pinup:
        switch (this.version % 4) {
          case 0:
            return [
              [col, row - 1],
              [col, row],
              [col - 1, row],
              [col, row + 1],
            ];
          case 1:
            return [
              [col, row],
              [col + 1, row],
              [col - 1, row],
              [col, row + 1],
            ];
          case 2:
            return [
              [col, row - 1],
              [col, row],
              [col + 1, row],
              [col, row + 1],
            ];
          case 3:
            return [
              [col, row - 1],
              [col, row],
              [col - 1, row],
              [col + 1, row],
            ];
        }
    }
  },

  view: function (on_off) {
    //block을 board에 그리거나 지움
    if (on_off) {
      this.now_on = On;
      for (let x = 0; x < 4; x++) {
        document.getElementById(
          this.board.name +
            "_" +
            this.position()[x][0] +
            "_" +
            this.position()[x][1]
        ).style.backgroundColor = this.color();
      }
    } else {
      this.now_on = Off;
      for (let x = 0; x < 4; x++) {
        document.getElementById(
          this.board.name +
            "_" +
            this.position()[x][0] +
            "_" +
            this.position()[x][1]
        ).style.backgroundColor = this.board.bgcolor;
      }
    }
  },

  move: function (direction) {
    music_check();
    if (this.now_on == On) {
      let old_row = this.row;
      let old_col = this.col;
      this.view(Off);
      switch (direction) {
        case Left:
          this.row--;
          this.direction = Left;
          break;
        case Right:
          this.row++;
          this.direction = Right;
          break;
        case Down:
          this.col++;
          this.direction = Down;
          break;
        case Bottom:
          this.view(On);
          while (this.move(Down)) {}
          return true;
      }
      if (position_check()) {
        this.view(On);
        return true;
      } else {
        this.row = old_row;
        this.col = old_col;
        if (this.direction == Down) {
          this.view(On);
          block.new_on(); // block이 아래로 이동하다가 밑에 걸린 경우 새블럭
          return false;
        } else {
          this.view(On);
          return false;
        }
      }
    }
  },

  rotate: function () {
    this.rotating = On;
    let old_version = this.version;
    this.view(Off);
    this.version++;
    if (position_check()) {
      this.view(On);
      this.rotating = Off;
      return true;
    } else {
      if (this.type == Stick) {
        if (this.row == 0 && (this.version - 1) % 4 == 0) {
          this.row += 2;
          if (position_check()) {
            this.view(On);
            this.rotating = Off;
            return true;
          } else {
            this.row -= 2;
            this.version = old_version;
            this.view(On);
            this.rotating = Off;
            return false;
          }
        } else if (
          this.row == this.board.x - 1 &&
          (this.version - 1) % 4 == 2
        ) {
          this.row -= 2;
          if (position_check()) {
            this.view(On);
            this.rotating = Off;
            return true;
          } else {
            this.row += 2;
            this.version = old_version;
            this.view(On);
            this.rotating = Off;
            return false;
          }
        }
      }
      if (this.row == 0) {
        this.row++; // 오른쪽 이동이 가능한가 검사.
        if (position_check()) {
          this.rotating = Off;
          this.view(On);
          return true;
        } else {
          this.row--; // 오른쪽 이동이 불가능한 경우 원래의 그대로 보여줌.
          this.version = old_version;
          this.view(On);
          this.rotating = Off;
          return false;
        }
      } else if (this.row == this.board.x - 1) {
        this.row--;
        if (position_check()) {
          this.rotating = Off;
          this.view(On);
          return true;
        } else {
          this.row++;
          this.version = old_version;
          this.view(On);
          this.rotating = Off;
          return false;
        }
      } else {
        this.version = old_version;
        this.view(On);
        this.rotating = Off;
        return false;
      }
    }
  },
};

// board 구성 함수
function draw_table(board) {
  var gameTable = document.getElementById(board.name);
  for (let y = 0; y < board.y; y++) {
    let tr_new = document.createElement("tr");
    for (let x = 0; x < board.x; x++) {
      td_new = document.createElement("td");
      td_new.id = board.name + "_" + y + "_" + x;
      td_new.style.backgroundColor = board.bgcolor;
      tr_new.appendChild(td_new);
    }
    gameTable.appendChild(tr_new);
  }
}

// board 내용 지우기 함수
function erase_board(board) {
  for (let y = 0; y < board.y; y++) {
    for (let x = 0; x < board.x; x++) {
      document
        .getElementById(board.name + "_" + y + "_" + x)
        .style.removeProperty("background-color");
    }
  }
}

function position_check() {
  for (let x = 0; x < 4; x++) {
    if (
      block.position()[x][0] < 0 ||
      block.position()[x][0] >= block.board.y ||
      block.position()[x][1] < 0 ||
      block.position()[x][1] >= block.board.x
    ) {
      return false;
    } else if (
      document.getElementById(
        block.board.name +
          "_" +
          block.position()[x][0] +
          "_" +
          block.position()[x][1]
      ).style.backgroundColor != block.board.bgcolor
    ) {
      return false;
    }
  }
  return true;
}

function init_window() {
  // 새로그리기
  var x = $(window).width();
  var y = $(window).height();
  var ratio = 1.4;
  if (x * ratio <= y) {
    $("#mainframe").width(x - 15);
    $("#mainframe").height(x * ratio - 15);
  } else {
    $("#mainframe").height(y - 15);
    $("#mainframe").width(y / ratio - 15);
  }
  $("#base").css("display", "flex");
  fill_div(gameboard.name, gameboard.x, gameboard.y, 1);
  $("#gameboard div").css("margin", "1px");
  fill_div(previewBoard1.name, previewBoard1.x, previewBoard1.y, 1);
  $("#previewBoard1 div").css("margin", "1px");
  fill_div(previewBoard2.name, previewBoard2.x, previewBoard2.y, 1);
  $("#previewBoard2 div").css("margin", "1px");
  write_information();
  write_control_pad();
  $("#scoreboard").css("font-size", $("#scoreboard").width() / 7 + "px");
  $(".best_players_div")
    .css("padding-left", $("#scoreboard").width() / 9 + "px")
    .css("padding-right", $("#scoreboard").width() / 9 + "px");
}

function init_window_size() {
  var x = $(window).width();
  var y = $(window).height();
  var ratio = 1.4;
  if (x * ratio <= y) {
    $("#mainframe").width(x - 15);
    $("#mainframe").height(x * ratio - 15);
  } else {
    $("#mainframe").height(y - 15);
    $("#mainframe").width(y / ratio - 15);
  }
  sizing_div(gameboard.name, gameboard.x, gameboard.y, 1);
  sizing_div(previewBoard1.name, previewBoard1.x, previewBoard1.y, 1);
  sizing_div(previewBoard2.name, previewBoard2.x, previewBoard2.y, 1);
  write_information();
  write_control_pad();
  $("#scoreboard").css("font-size", $("#scoreboard").width() / 7 + "px");
  $(".best_players_div")
    .css("padding-left", $("#scoreboard").width() / 9 + "px")
    .css("padding-right", $("#scoreboard").width() / 9 + "px");
}

// 로컬 스토리지에서 키에 해당하는 기록 문자열을 읽어 반환
function readRecordFromStorage(key) {
  const val = localStorage.getItem(key);
  return JSON.parse(val);
}

// 초기값 세팅: 기록이 없으면 기본값을 넣음
function ensureDefaultRecord() {
  if (readRecordFromStorage(record_name) === null) {
    // 기본값 예시: 5명(이름 점수 * 5). 필요에 맞게 수정하세요.
    const defaultData = {
      no0p: "장민",
      no0s: "1500",
      no1p: "양정원",
      no1s: "1000",
      no2p: "이석희",
      no2s: "900",
      no3p: "장지혜",
      no3s: "800",
      no4p: "장민",
      no4s: "780",
    };
    localStorage.setItem(record_name, JSON.stringify(defaultData));
  }
}

// 화면에 기록을 채우는 함수 (원래 best_record_write의 역할)
function best_record_write() {
  // 로컬 스토리지에서 읽어오기 전에 기본값 보장
  ensureDefaultRecord(record_name);

  const bestScoreRecord = JSON.parse(localStorage.getItem(record_name));

  Object.keys(bestScoreRecord).forEach((key) => {
    console.log(key, bestScoreRecord[key]);
    document.getElementById(key).innerHTML = bestScoreRecord[key];
  });
  console.log("기록 불러와서 홈페이지에 게시됨");
}

// 예시: 기록을 업데이트(쓰기)하는 함수
// records는 [{name: "AAA", score: 1000}, ...] 형식의 배열
function updateBestRecords(recordKey, records) {
  // 문자열로 변환: name score name score ...
  const flat = [];
  records.forEach((r) => {
    flat.push(String(r.name));
    flat.push(String(r.score));
  });
  writeRecordToStorage(recordKey, flat.join(" "));
}

window.onload = function () {
  mobile_os = getMobileOperatingSystem();
  best_record_write();
  init_window();
  $(window).resize(init_window_size);
  var ending_music = document.getElementById("ending_music");
  var sound1 = document.getElementById("sound1");
  var sound2 = document.getElementById("sound2");
  var music_list = [
    "BGM_Tetris_Bradinsky.mp3",
    "BGM_Tetris_Kalinka.mp3",
    "BGM_Tetris_Loginska.mp3",
    "BGM_Tetris_Troika.mp3",
  ];
  var tetris_music = document.getElementById("tetris_music");
  tetris_music.src =
    "music\\" + music_list[Math.floor(Math.random() * music_list.length)];
  previewBoard1.type = Math.floor(Math.random() * 7);
  previewBoard2.version = Math.floor(Math.random() * 4);
  previewBoard2.type = Math.floor(Math.random() * 7);
  previewBoard2.version = Math.floor(Math.random() * 4);
  touch_install();
  ending_music.onended = function () {
    score_to_server();
  };
  document.onkeydown = checkKey;
  $(window).resize(init_window_size);
};

function touch_install() {
  document
    .getElementById("base")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
    });
  document
    .getElementById("gameboard")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_start();
    });
  document
    .getElementById("down_pad")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_down();
    });
  document
    .getElementById("left_pad")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_left();
    });
  document
    .getElementById("right_pad")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_right();
    });
  document
    .getElementById("bottom_pad")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_bottom();
    });
  document
    .getElementById("rotate_pad")
    .addEventListener("touchstart", function (event) {
      event.preventDefault();
      touch_rotate();
    });
}

// touch 처리
function touch_start() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  music_check();
  if (block.direction == Stop && ending_music.paused) {
    touch_vib();
    game_init();
  } else if (block.now_on == On) {
    touch_vib();
    music_toggle();
  }
}
function touch_right() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  touch_vib();
  music_check();
  if (block.direction != Stop && block.now_on == On) {
    block.move(Right);
  }
}
function touch_left() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  touch_vib();
  music_check();
  if (block.direction != Stop && block.now_on == On) {
    block.move(Left);
  }
}
function touch_down() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  touch_vib();
  music_check();
  if (block.direction != Stop && block.now_on == On) {
    block.move(Down);
  }
}
function touch_rotate() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  touch_vib();
  music_check();
  if (block.direction != Stop && block.now_on == On) {
    block.rotate();
  }
}
function touch_bottom() {
  if (iOS_ending && block.now_on == Off) {
    iOS_ending = false;
    ending_music.play();
    return true;
  }
  touch_vib();
  music_check();
  if (block.direction != Stop && block.now_on == On) {
    block.move(Bottom);
  }
}
function music_toggle() {
  touch_vib();
  music_check();
  if (tetris_music.paused) {
    tetris_music.play();
  } else {
    tetris_music.pause();
  }
}
function touch_vib() {
  if (mobile_os != "iOS") {
    navigator.vibrate(10);
  }
}

// touch 처리 끝

function start(On_off) {
  var delay_time = 1500;
  var delay_time_cut = 250;
  if (On_off) {
    var id1 = window.setInterval(down, delay_time);
    var id2 = window.setInterval(level_up, 30000);
    function down() {
      if (block.direction == Stop) {
        clearInterval(id1);
        clearInterval(id2);
        document.getElementById("level").innerHTML = "게임종료";
        best_record_write();
        block.now_on = Off;
        if (mobile_os == "iOS") {
          iOS_ending = true;
        } else {
          ending_music.play();
        }
      } else {
        document.getElementById("level").innerHTML = "LEVEL0" + level;
        block.move(Down);
      }
    }
    function level_up() {
      level++;
      delay_time -= delay_time_cut;
      console.log("delay_time", delay_time);
      if (delay_time < 250) {
        delay_time = 250;
      }
      clearInterval(id1);
      id1 = window.setInterval(down, delay_time);
      document.getElementById("level").innerHTML = "LEVEL0" + level;
      console.log("level_up", level, delay_time);
    }
  } else {
    block.direction = Stop;
  }
}

function game_init() {
  erase_board(gameboard);
  block.new_on();
  block.direction = Down;
  score = 0;
  level = 1;
  write_score();
  tetris_music.play();
  document.getElementById("level").innerHTML = "LEVEL0" + level;
  start(On);
}

function checkKey(e) {
  e = e || window.event;
  console.log(e.keyCode);
  music_check();
  if (block.direction == Stop) {
    if (e.keyCode == "83") {
      game_init();
    }
  } else if (block.now_on == On) {
    if (e.keyCode == "38") {
      block.move(Bottom);
    } else if (e.keyCode == "40") {
      block.move(Down);
    } else if (e.keyCode == "37") {
      block.move(Left);
    } else if (e.keyCode == "39") {
      block.move(Right);
    } else if (e.keyCode == "32") {
      block.rotate();
    } else if (e.keyCode == "27") {
      tetris_music.pause();
      alert("게임이 잠시 중지되었습니다");
      tetris_music.play();
    } else if (e.keyCode == "83") {
      // s 게임시작 및 다시 시작
      if (block.direction == Stop) {
        write_score();
      }
    }
  }
  if (e.keyCode == "77") {
    // m music 토글
    if (tetris_music.paused) {
      tetris_music.play();
    } else {
      tetris_music.pause();
    }
  }
}

function music_check() {
  if (tetris_music.ended) {
    tetris_music.src =
      "music\\" + music_list[Math.floor(Math.random() * music_list.length)];
    tetris_music.play();
  }
}

function init_board() {
  // 새블럭으로 출발
  score += 40;
  write_score();
  erase_board(previewBoard2);
  erase_board(previewBoard1);
  block.now_on = Off;
  block.col = 2;
  block.row = 2;
  block.board = previewBoard2;
  gameboard.type = previewBoard1.type; // gameboard 블럭에 type, version 전달
  gameboard.version = previewBoard1.version;
  previewBoard1.type = previewBoard2.type; // previewBoard1 블럭에 type, version 전달
  previewBoard1.version = previewBoard2.version;
  previewBoard2.type = Math.floor(Math.random() * 7); // previewBoard2 새블럭
  previewBoard2.version = Math.floor(Math.random() * 4);
  block.type = previewBoard2.type;
  block.version = previewBoard2.version;
  block.view(On);
  block.now_on = Off;
  block.board = previewBoard1;
  block.type = previewBoard1.type;
  block.version = previewBoard1.version;
  block.view(On);
  block.now_on = Off;
  block.board = gameboard;
  block.type = gameboard.type;
  block.version = gameboard.version;
  block.row = 4;
  block.col = 0;
  erase_spaceLine();
  while (true) {
    // 시작할 때 첫줄부터 나오도록 하고 게임종료를 알림
    if (position_check()) {
      break;
    } else if (block.col < 2) {
      block.col++;
    } else {
      console.log("게임종료");
      tetris_music.pause();
      tetris_music.load();
      start(Off);
      block.direction = Stop;
      return true;
    }
  }
  block.view(On);
  sound1.play();
  write_score();
}
// 맞춰진 블럭 지우기
function erase_spaceLine() {
  let x = 100;
  for (let y = block.board.y - 1; y > 0; y--) {
    if (check_spaceLine(y)) {
      redraw_board(y);
      sound2.play();
      score += x;
      x *= 10;
      y++;
      write_score();
    }
  }
}
function check_spaceLine(col) {
  for (let x = 0; x < block.board.x; x++) {
    if (
      document.getElementById(block.board.name + "_" + col + "_" + x).style
        .backgroundColor == block.board.bgcolor
    ) {
      return false;
    }
  }
  return true;
}
function redraw_board(col) {
  for (let y = col; y > 1; y--) {
    before_y = y - 1;
    for (let x = 0; x < block.board.x; x++) {
      document.getElementById(
        block.board.name + "_" + y + "_" + x
      ).style.backgroundColor = document.getElementById(
        block.board.name + "_" + before_y + "_" + x
      ).style.backgroundColor;
    }
  }
}
// score 쓰기
function write_score() {
  document.getElementById("score").innerHTML = score;
}

// tetris 이름 쓰기
var map = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 8, 8, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2,
  2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2,
  2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 1, 9, 9, 3, 3, 3, 9, 1, 0, 0, 0, 0, 1, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  1, 3, 3, 3, 3, 3, 9, 1, 0, 0, 0, 0, 1, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 3,
  3, 3, 3, 3, 9, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 1, 10, 10, 4, 4, 4, 4, 1, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4,
  1, 0, 0, 0, 0, 0, 1, 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 11,
  11, 5, 5, 5, 5, 1, 0, 0, 0, 0, 1, 5, 1, 1, 1, 1, 5, 1, 0, 0, 0, 0, 1, 5, 1, 1,
  1, 5, 5, 1, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 1, 5, 5,
  1, 0, 0, 0, 0, 0, 1, 5, 5, 1, 1, 5, 5, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 12, 6, 6, 6, 1, 0, 0, 0, 0, 0,
  0, 0, 1, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 12, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  12, 6, 1, 0, 0, 0, 0, 0, 0, 0, 1, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 13, 13, 7, 7, 7, 7, 1,
  0, 0, 0, 0, 1, 7, 7, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 7, 7, 7, 7, 7, 7, 1, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 7, 7, 1, 0, 0, 0, 0, 1, 13, 13, 7, 7, 7, 7, 1, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
];

function write_information() {
  fill_div(information.name, information.x, information.y);
  $("#information div").css("border-style", "none").css("border-width", "0px");
  map_colors = [
    "",
    "black",
    "red",
    "blue",
    "orange",
    "purple",
    "green",
    "brown",
    "#ffb3b3",
    "#b3b3ff",
    "#ffe0b3",
    "#d9b3ff",
    "#c2f0c2",
    "#ecc6c6",
  ];
  index = 0;
  for (let y = 0; y < information.y; y++) {
    for (let x = 0; x < information.x; x++) {
      document.getElementById(
        information.name + "_" + y + "_" + x
      ).style.backgroundColor = map_colors[map[index]];
      if (map_colors[map[index]] != "") {
        $("#" + information.name + "_" + y + "_" + x)
          .css("border-style", "solid")
          .css("border-width", "1px");
      }
      index++;
    }
  }
}

// 게임패드 그리기
var pad_map = [
  // left
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
  ],
  // rotate
  [
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0,
  ],
  // bottom
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
    1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
  ],
  // down
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
  ],
  // right
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
  ],
];

function write_control_pad() {
  let pad_color = ["red", "blue", "purple", "brown", "green"];
  for (let i = 0; i < pad.length; i++) {
    $("#" + pad[i])
      .css("width", "85%")
      .css("height", "85%");
    fill_div(pad[i], 8, 10);
    $("#" + pad[i] + " div").css("border-style", "none");
    $("#" + pad[i] + " div").css("border-width", "0px");
    let index = 0;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 8; x++) {
        if (pad_map[i][index] == 1) {
          $("#" + pad[i] + "_" + y + "_" + x).css(
            "backgroundColor",
            pad_color[i]
          );
          $("#" + pad[i] + "_" + y + "_" + x).css("border-style", "solid");
          $("#" + pad[i] + "_" + y + "_" + x).css("border-width", "1px");
        } else {
          $("#" + pad[i] + "_" + y + "_" + x).css("backgroundColor", "white");
        }
        index++;
      }
    }
  }
}
// 엔딩곡이 끝나면 서버에 최고점수 올리기

function score_to_server() {
  let scores = [];
  let names = [];
  let first_time = true;
  for (let x = 0; x < 5; x++) {
    // 점수가 순위에 들었는지 봄
    if (
      score > document.getElementById("no" + x + "s").innerHTML &&
      first_time
    ) {
      let player_name = prompt(
        "축하합니다. " + (x + 1) + "등 입니다. \n이름을 입력해 주세요",
        ""
      );
      names.push(player_name);
      scores.push(score);
      first_time = false;
    }
    names.push(document.getElementById("no" + x + "p").innerHTML);
    scores.push(document.getElementById("no" + x + "s").innerHTML);
  }
  if (first_time == false) {
    // 순위에 드는 경우
    let save_file = {};
    save_file["model"] = model; // model - 모바일 인지 pc 인지 입력
    for (let x = 0; x < 5; x++) {
      // 새로운 순위 쓰기
      document.getElementById("no" + x + "p").innerHTML = names[x];
      document.getElementById("no" + x + "s").innerHTML = scores[x];
      save_file["no" + x + "p"] = document.getElementById(
        "no" + x + "p"
      ).innerHTML;
      save_file["no" + x + "s"] = document.getElementById(
        "no" + x + "s"
      ).innerHTML; // 서버에 보낼 자료 만듬
    }

    localStorage.setItem(record_name, JSON.stringify(save_file));
  }
}
function fill_div(id, width_num, height_num, margin) {
  let w_margin = 0;
  let h_margin = 0;
  if (margin != undefined) {
    w_margin = 2 * width_num;
    h_margin = 2 * height_num;
  }
  $("#" + id).empty();
  $("#" + id).css("display", "flex");
  $("#" + id).css("flex-wrap", "wrap");
  $("#" + id).css("flex-direction", "row");
  for (let y = 0; y < height_num; y++) {
    for (let x = 0; x < width_num; x++) {
      let new_div = document.createElement("div");
      new_div.id = id + "_" + y + "_" + x;
      document.getElementById(id).appendChild(new_div);
    }
  }
  $("#" + id + " div").width(
    ($("#" + id).width() - w_margin - 0.5) / width_num
  );
  $("#" + id + " div").height(
    ($("#" + id).height() - h_margin - 0.5) / height_num
  );
  $("#" + id + " div").css("margin", 0);
  $("#" + id + " div").css("padding", 0);
  $("#" + id + " div").css("border", "1px solid gray");
}

function sizing_div(id, width_num, height_num, margin) {
  w_margin = 4 * width_num;
  h_margin = 4 * height_num;
  $("#" + id + " div").width(
    ($("#" + id).width() - w_margin - 0.5) / width_num
  );
  $("#" + id + " div").height(
    ($("#" + id).height() - h_margin - 0.5) / height_num
  );
}

function pc_or_mobile() {
  var filter = "win16|win32|win64|mac|macintel";
  if (navigator.platform) {
    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
      model = "MOBILE";
    } else {
      model = "PC";
    }
  }
  console.log(document.title);
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

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
}
