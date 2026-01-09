const On = true,
  Off = false,
  pad_color_input = "#cce6ff",
  pad_color_research = "#ffe6ff",
  color_default = "#ccffcc";
const Input = true,
  Research = false;
const Beginner = 1,
  Intermediate = 2,
  Superior = 3;
const Mainboard = 0,
  Startboard = 1,
  Pauseboard = 2,
  Scoreboard = 3,
  Endingboard = 4,
  Savingboard = 5,
  Loadingboard = 6;
var music_list = [
  "Cavatina (From The Deer Hunter).mp3",
  "Desafinado.mp3",
  "En La Orilla del Mundo (At the Edge of the World).mp3",
  "Nocturne Op.9 No.1 in B flat minor.mp3",
];
var img_list = ["w1.jpg", "w2.jpg", "w3.jpg"];
var bg_music = document.createElement("audio");
var y_name = "";
var y_wrong_try = "";
var y_score = 0;
var y_time = "";
var delaytime_s = "";
var delaytime_e = "";
var start_time = "";
var end_time = "";
var recall = 0;
var id1 = "";
var disappear_order = [];
var disappear_index = 0;
var pad_color = pad_color_input;
var number_pad = [];
var cell = [];
var cell_address = [];
var score_ob = {};
var browser = "";
var mobile_os = "";
var basic_text_size = 12;

var c = {
  b: function (num) {
    let cell_b = [];
    for (let i = 0; i < cell.length; i++) {
      if (cell[i].b == num) {
        cell_b.push(cell[i]);
      }
    }
    return cell_b;
  },
  clear_check: function (test) {
    // 게임이 클리어 되었는지 체크
    if (test == undefined) {
      for (let i = 0; i < cell.length; i++) {
        if (cell[i].t_value() != cell[i].u_value) {
          return false;
        }
      }
    }
    // 애니
    this.color_clear();
    game_clear_ani();
    touch_vib(500);
    return true;
  },
  m: Input,
  mode: function () {
    this.m = !this.m; // 입력 모드 토글
    if (pad_color == pad_color_input) {
      // 패드 컬러 토글
      pad_color = pad_color_research;
    } else {
      pad_color = pad_color_input;
    }
    $("#foot_board div").css("backgroundColor", pad_color);
  },
  touchcell: false, // 터치된 셀
  start: false,
  pause: Off,
  //
  game_over: false,
  color_clear: function () {
    $("#main_board div").css("backgroundColor", "");
  },
  music: Off,
  grade: Beginner,
  board: Startboard,
};
// 생성자 함수
function seek_cells(num, range, cells) {
  let color = "";
  switch (range) {
    case "h":
      color = "#cce6ff";
      break;
    case "v":
      color = "#cce6ff";
      break;
    case "b":
      color = "#e6f3ff";
      break;
    case "t_value()":
      color = "lightgreen";
      break;
  }
  let arr = [];
  for (let x = 0; x < cells.length; x++) {
    switch (range) {
      case "t_value()":
        if (String(cells[x].t_value()) == String(num)) {
          arr.push(cells[x]);
          $(cells[x].adr).css("backgroundColor", color);
        }
        break;
      case "v":
      case "b":
      case "h":
        if (cells[x][range] == num) {
          arr.push(cells[x]);
          $(cells[x].adr).css("backgroundColor", color);
        }
    }
  }
  return arr;
}
// number_pad 생성자

function Number_pad(adr, value) {
  this.color_on = function (on_off) {
    $(this.adr).css("backgroundColor", pad_color);
    if (on_off) {
      $(this.adr).css("backgroundColor", "#99ceff");
    }
  };
  this.adr = adr;
  this.value = value;
  this.touch = function () {
    if (c.touchcell == false) {
      return false;
    }
    if (c.m == Input) {
      // Input의 경우
      if (c.touchcell.research) {
        // 셀이 리서치 모드인 경우
        c.touchcell.guess_off(); // 리서치 숫자들 모두 지움.
        c.touchcell.t_value(this.value);
        c.touchcell.t_value_cells();
        if (!c.touchcell.correct()) {
          $(c.touchcell.adr).css("backgroundColor", "red");
          y_wrong_try++;
        }
      } else if (c.touchcell.t_value() == "") {
        // 값이 없거나
        this.color_on(On);
        c.touchcell.t_value(this.value);
        c.touchcell.t_value_cells();
        if (!c.touchcell.correct()) {
          $(c.touchcell.adr).css("backgroundColor", "red");
          y_wrong_try++;
        }
      } else if (c.touchcell.t_value() == this.value) {
        touch_vib();
        this.color_on(Off);
        c.color_clear();
        if (!c.touchcell.correct()) {
          c.touchcell.t_value("");
        }
        c.touchcell = false;
      }
      touch_vib();
      c.clear_check(); // 게임이 클리어 되었는지 체크   // 넘버 패드를 눌렀을 경우
    } else {
      // Research의 경우
      if (c.touchcell.t_value() == "" || c.touchcell.research) {
        c.touchcell.guess_num(this.value);
        touch_vib();
      } else {
        return false;
      }
    }
  };
}

// cell 생성자
function Cell(adr) {
  this.adr = adr; // "#main_board_"+by+"_"+bx+"_"+y+"_"+x;
  this.by = Number(this.adr.split("_")[2]);
  this.bx = Number(this.adr.split("_")[3]);
  this.y = Number(this.adr.split("_")[4]);
  this.x = Number(this.adr.split("_")[5]);
  this.b = this.by * 3 + this.bx; // box 번호
  (this.b_cells = function () {
    seek_cells(this.b, "b", cell);
  }),
    (this.v = this.bx * 3 + this.x);
  (this.v_cells = function () {
    seek_cells(this.v, "v", cell);
  }),
    (this.h = this.by * 3 + this.y);
  (this.h_cells = function () {
    seek_cells(this.h, "h", cell);
  }),
    (this.touch = function () {
      touch_vib();
      $("#foot_board div").css("backgroundColor", pad_color); // 숫자 패드 정리
      if (this.research) {
        if (c.touchcell == this) {
          c.mode(); // 모드 변경
        } else {
          c.color_clear();
          this.b_cells();
          this.h_cells();
          this.v_cells();
          $(this.adr).css("backgroundColor", "lightgreen");
          c.touchcell = this;
        }
      } else {
        if (c.touchcell == this) {
          // 선택된 셀을 다시 선택한 경우
          if (!this.correct()) {
            // 틀린 숫자의 경우에는 지움.
            this.t_value("");
            c.color_clear();
            c.touchcell = false;
          } else if (c.touchcell.t_value() == "") {
            c.mode();
          }
        } else {
          // 선택되지 않은 셀을 선택한 경우 - 관련된 셀의 색깔을 그림
          c.color_clear();
          this.b_cells();
          this.h_cells();
          this.v_cells();
          if (this.t_value() != "") {
            this.t_value_cells();
          }
          $(this.adr).css("backgroundColor", "lightgreen");
          c.touchcell = this;
        }
      }
    });
  this.t_value = function (num) {
    if (num != undefined) {
      $(this.adr).text(num);
    }
    return $(this.adr).text();
  };
  (this.t_value_cells = function () {
    seek_cells(this.t_value(), "t_value()", cell);
  }),
    (this.u_value = "");
  this.guess = [];
  this.research = false;
  this.on = true;
  this.check = 0;
  this.guess_num = function (num) {
    if (this.guess.indexOf(num) == -1) {
      this.guess.push(num);
    } else {
      this.guess.splice(this.guess.indexOf(num), 1);
    }
    this.guess_on();
  };
  this.guess_on = function () {
    // quess 숫자 그리기
    guess_cell_draw(this);
    this.research = true;
  };
  this.guess_off = function () {
    // quess 숫자 지우기
    $(this.adr).empty();
    $(this.adr).css("flex-wrap", "initial");
    this.guess = [];
    this.research = false;
  };
  this.correct = function () {
    if (this.t_value() != "" && this.t_value() != this.u_value) {
      return false;
    } else {
      return true;
    }
  };
}

function guess_cell_draw(cell) {
  $(cell.adr).empty(); // 내부 셀 모두 지우기
  let adr = [
    "_0_0",
    "_0_1",
    "_0_2",
    "_1_0",
    "_1_1",
    "_1_2",
    "_2_0",
    "_2_1",
    "_2_2",
  ];
  fill_div(cell.adr, 3, 3, 0, "white");
  for (let i = 0; i < cell.guess.length; i++) {
    $(cell.adr + adr[cell.guess[i] - 1]).text(cell.guess[i]);
  }
  $(cell.adr + " div")
    .css("font-size", $(cell.adr + " div").height() * 0.9 + "px")
    .css("display", "flex")
    .css("align-items", "center")
    .css("justify-content", "center");
}

function cell_select(cell) {
  $(cell.adr).css("background", "lightgreen");
}

function init_window() {
  var x = $(window).width();
  var y = $(window).height();
  $("#base_outer").width(x);
  $("#base_outer").height(y);
  var ratio = 1.4;
  $("#base").css("margin", "5px");
  if (x * ratio <= y) {
    $("#base").width(x - 10);
    $("#base").height(x * ratio - 10);
  } else {
    $("#base").height(y - 10);
    $("#base").width(y / ratio - 10);
  }
  $("#head_board").height($("#base").width() * 0.2);
  $(".main").height($("#base").width());
  $(".main").hide();
  $("#foot_board").height($("#base").width() * 0.2);
}

function main_board_draw() {
  fill_div("#main_board", 3, 3, 2, "black");
  main_board_inner_draw();
}

function main_board_inner_draw() {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      fill_div("#main_board_" + y + "_" + x, 3, 3, 1, "grey", true);
    }
  }
  $("#main_board div div")
    .css("font-size", $("#main_board div div").height() * 0.8 + "px")
    .css("display", "flex")
    .css("align-items", "center")
    .css("justify-content", "center");
  let i = 0;
  cell = [];
  cell_address = [];
  for (let by = 0; by < 3; by++) {
    for (let bx = 0; bx < 3; bx++) {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          cell.push(
            new Cell("#main_board_" + by + "_" + bx + "_" + y + "_" + x)
          );
          cell_address.push("#main_board_" + by + "_" + bx + "_" + y + "_" + x);
        }
      }
    }
  }
  for (let i = 0; i < cell.length; i++) {
    let c = cell[i]; // cell에 터치이벤트 부여
    $(c.adr).on("click", function () {
      c.touch();
    });
  }
}

function number_pad_draw() {
  fill_div("#foot_board", 9, 1, 1, "black");
  $("#foot_board div")
    .height($("#foot_board div").width() * 1.3)
    .css("display", "flex")
    .css("align-items", "center")
    .css("justify-content", "center");
  $("#foot_board div").css(
    "font-size",
    $("#foot_board div").height() * 0.8 + "px"
  );
  for (let x = 0; x < 9; x++) {
    $("#foot_board_0_" + x).text(x + 1);
    number_pad.push(new Number_pad("#foot_board_0_" + x, x + 1));
  }
  for (let x = 0; x < 9; x++) {
    let c = number_pad[x];
    $(c.adr).click(function () {
      c.touch();
    });
  }
  $("#foot_board div").css("backgroundColor", pad_color);
  $("#foot_board div:active")
    .css("transform", "scale(0.9)")
    .css("backgroundColor", "rgba( 0, 0, 0, 0.9)");
}

function head_pad_draw() {
  $("#head_board button").width($("#head_board").width() / 5);
  $("#head_board button").height($("#head_board").height() * 0.4);
  basic_text_size = $("#head_board").height() * 0.2;
  $("#head_board button")
    .css("padding", "0px")
    .css("font-size", basic_text_size);
  $("#head_board").css("display", "flex");
  bg_music.src =
    "music\\" + music_list[Math.floor(Math.random() * music_list.length)];
  $("#bg_music").click(function () {
    music_play();
  }); // 헤드 버튼에 이벤트 부여
  $("#b01").click(function () {
    b01();
  });
  $("#b02").click(function () {
    b02();
  });
  $("#b03").click(function () {
    b03();
  });
  $("#b05").click(function () {
    b05();
  });
}

$(document).ready(function () {
  mobile_os = getMobileOperatingSystem();
  init_window(); // 화면 초기화
  pc_or_mobile();
  main_board_draw(); // 메인 보드 그리기
  number_pad_draw(); // 넘버 패드 그리기
  head_pad_draw(); // 헤드 패드 그리기
  best_record_write();
  $("#main_board").hide();
  $("#foot_board").hide();
  $("#main_startboard").css("display", "block");
  main_board_fill(1); // 기본 모드
  c.grade = Beginner;
  hide_beginner(2); // 임의의 숫자 채우기
  start_board_ready();
});

function start_board_ready() {
  if (browser == "mobile") {
    $(".table td").css("font-size", basic_text_size * 1.2);
  }
  $(".table td").css("vertical-align", "baseline");
  $("#beginner").click(function () {
    cells_all_init();
    hide_beginner(2);
    b01();
  });
  $("#intermediate").click(function () {
    cells_all_init();
    hide_intermediate(1);
    b01();
  });
  $("#superior").click(function () {
    cells_all_init();
    hide_superior(32);
    b01();
  });
  $("#loading").click(function () {
    load_file();
  });
}

function cells_all_init() {
  main_board_inner_draw();
  for (let i = 0; i < cell.length; i++) {
    cell[i].t_value("");
    cell[i].u_value = "";
    cell[i].guess = [];
    cell[i].research = false;
  }
  c.color_clear();
  c.touchcell = false;
  y_score = 0;
  c.start = true;
  c.game_over = false; // 게임이 끝나지 않음
  start_time = Date.now();
  main_board_fill(1);
}

function main_board_fill(start_num) {
  recall++;
  for (let num = start_num; num < 10; num++) {
    for (let by = 0; by < 3; by++) {
      for (let bx = 0; bx < 3; bx++) {
        numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        num_adr = "#main_board_" + by + "_" + bx + "_";
        while (true) {
          // 알맞은 임의의 숫자를 입력함.
          if (numbers.length == 0) {
            // 모든 숫자가 입력될 수 없는 경우
            delete_num(num);
            if (recall > 30) {
              $("#main_board div div").text("");
              console.log("완전히 새로 그림", recall);
              recall = 0;
              return main_board_fill(1);
            } else {
              return main_board_fill(num);
            }
          }
          let y = Math.floor(Math.random() * numbers.length);
          if (!check(num_adr, numbers[y], num)) {
            // 선택한 숫자가 적절한가 판단함. 9개 중 1개 주소.
            delete numbers[y];
            numbers = numbers.filter(function (num) {
              return num != null;
            });
          } else {
            break;
          }
        }
      }
    }
  }
  recall = 0;
}
function check(num_adr, index, num) {
  let string = ["0_0", "0_1", "0_2", "1_0", "1_1", "1_2", "2_0", "2_1", "2_2"];
  num_adr = num_adr + string[index];
  let co = co_num(num_adr);
  co.num = num;
  if ($(num_adr).text() == "" && number_check(co)) {
    cell[cell_address.indexOf(num_adr)].t_value(co.num);
    cell[cell_address.indexOf(num_adr)].u_value = co.num;
    return true;
  }
  return false;
}

function delete_num(num) {
  // 숫자가 num인 셀의 num를 지움.
  for (let i = 0; i < cell.length; i++) {
    if (cell[i].t_value() == num) {
      cell[i].t_value("");
    }
  }
}

// 숫자 체크
function number_check(co) {
  if (number_h_check(co) && number_v_check(co) && number_b_check(co)) {
    return true;
  } else {
    return false;
  }
}
// 가로 체크
function number_h_check(co) {
  for (let bx = 0; bx < 3; bx++) {
    for (let x = 0; x < 3; x++) {
      if (co.bx == bx && co.x == x) {
      } else {
        if (
          co.num ==
          $("#main_board_" + co.by + "_" + bx + "_" + co.y + "_" + x).text()
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
// 세로 체크
function number_v_check(co) {
  for (let by = 0; by < 3; by++) {
    for (let y = 0; y < 3; y++) {
      if (co.by == by && co.y == y) {
      } else {
        if (
          co.num ==
          $("#main_board_" + by + "_" + co.bx + "_" + y + "_" + co.x).text()
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
// 블럭 체크
function number_b_check(co) {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (co.y == y && co.x == x) {
      } else {
        if (
          co.num ==
          $("#main_board_" + co.by + "_" + co.bx + "_" + y + "_" + x).text()
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
// 좌표 알아내기
function co_num(num_adr) {
  var name = ["by", "bx", "y", "x", "num"];
  var co = {};
  var string = num_adr.split("_");
  for (let x = 0; x < 4; x++) {
    co[name[x]] = string[x + 2];
  }
  co["num"] = $(num_adr).text();
  return co;
}

function fill_div(id, width_num, height_num, border, color) {
  $(id).empty();
  $(id)
    .css("display", "flex")
    .css("flex-wrap", "wrap")
    .css("flex-direction", "row");
  for (let y = 0; y < height_num; y++) {
    for (let x = 0; x < width_num; x++) {
      let new_div = document.createElement("div");
      new_id = id.replace("#", "");
      new_div.id = new_id + "_" + y + "_" + x;
      $(id).append(new_div);
    }
  }
  let a = 0;
  if (mobile_os != "iOS") {
    a = 0.1;
  }
  $(id + " div").width(($(id).width() - 0.01 - a) / width_num);
  $(id + " div").height(($(id).height() - 0.01 - a) / height_num);
  $(id + " div")
    .css("margin", 0)
    .css("padding", 0)
    .css("border", border + "px solid " + color);
}
// 주어진 숫자의 임의의 칸을 지울 수 있는지 알아보고 지우기

function hide_superior(num) {
  c.grade = Superior;
  let f = [
    random_cell_box1,
    random_cell_box2,
    random_cell_box3,
    random_cell_box4,
  ];
  let r = Math.floor(Math.random() * f.length);
  f[r](num);
}

function random_cell_box1(num) {
  type = 0;
  hide_all_cells();
  let total_num = 0;
  for (let b = 0; b < 3; b++) {
    let n = 2 + Math.floor(Math.random() * 3);
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let c = 0; c < n; c++) {
      let p = Math.floor(Math.random() * nums.length);
      let x = Math.floor(nums[p] / 3);
      let y = nums[p] % 3;
      view_cell(cell_c(b, y, x));
      view_cell(cell_c(b + 6, 2 - y, x));
      total_num += 2;
      nums.splice(p, 1);
    }
  }
  if (total_num < num - 7) {
    for (let b = 3; b < 6; b++) {
      for (let x = 0; x < 3; x++) {
        let n = Math.floor(Math.random() * 2);
        if (n == 0) {
          view_cell(cell_c(b, 0, x));
          view_cell(cell_c(b, 2, x));
          total_num += 2;
        }
      }
    }
  }
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (total_num < num) {
    let end = num - total_num;
    if (end > 9) {
      end = 9;
    }
    for (let i = 0; i < end; i++) {
      let n = Math.floor(Math.random() * nums.length);
      let b = Math.floor(nums[n] / 3);
      let x = nums[n] % 3;
      view_cell(cell_c(b + 3, 1, x));
      nums.splice(n, 1);
      total_num++;
    }
  }
}
function random_cell_box2(num) {
  hide_all_cells();
  let total_num = 0;
  for (let b = 0; b < 9; b += 3) {
    let n = 2 + Math.floor(Math.random() * 3);
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let c = 0; c < n; c++) {
      let p = Math.floor(Math.random() * nums.length);
      let x = Math.floor(nums[p] / 3);
      let y = nums[p] % 3;
      view_cell(cell_c(b, y, x));
      view_cell(cell_c(b + 2, y, 2 - x));
      total_num += 2;
      nums.splice(p, 1);
    }
  }
  if (total_num < num - 7) {
    for (let b = 1; b < 9; b += 3) {
      for (let y = 0; y < 3; y++) {
        let n = Math.floor(Math.random() * 2);
        if (n == 0) {
          view_cell(cell_c(b, y, 0));
          view_cell(cell_c(b, y, 2));
          total_num += 2;
        }
      }
    }
  }
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (total_num < num) {
    let end = num - total_num;
    if (end > 9) {
      end = 9;
    }
    for (let i = 0; i < end; i++) {
      let n = Math.floor(Math.random() * nums.length);
      let b = Math.floor(nums[n] / 3) * 3 + 1;
      let y = nums[n] % 3;
      view_cell(cell_c(b, y, 1));
      nums.splice(n, 1);
      total_num++;
    }
  }
}
function random_cell_box3(num) {
  hide_all_cells();
  let total_num = 0;
  let b1 = [0, 1, 3];
  let b2 = [8, 5, 7];
  for (let b = 0; b < 3; b++) {
    let n = 2 + Math.floor(Math.random() * 3);
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let c = 0; c < n; c++) {
      let p = Math.floor(Math.random() * nums.length);
      let x = Math.floor(nums[p] / 3);
      let y = nums[p] % 3;
      view_cell(cell_c(b1[b], y, x));
      view_cell(cell_c(b2[b], 2 - x, 2 - y));
      total_num += 2;
      nums.splice(p, 1);
    }
  }
  if (total_num < num - 7) {
    for (let b = 2; b < 7; b += 2) {
      for (let i = 0; i < 3; i++) {
        let y = 0;
        let x = i;
        if (x == 2) {
          x = 0;
          y = 1;
        }
        let n = Math.floor(Math.random() * 2);
        if (n == 0) {
          view_cell(cell_c(b, y, x));
          view_cell(cell_c(b, 2 - x, 2 - y));
          total_num += 2;
        }
      }
    }
  }
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (total_num < num) {
    let end = num - total_num;
    if (end > 9) {
      end = 9;
    }
    for (let i = 0; i < end; i++) {
      let n = Math.floor(Math.random() * nums.length);
      let b = 2 + Math.floor(nums[n] / 3) * 2;
      let y = nums[n] % 3;
      view_cell(cell_c(b, 2 - y, y));
      nums.splice(n, 1);
      total_num++;
    }
  }
}
function random_cell_box4(num) {
  hide_all_cells();
  let total_num = 0;
  let b1 = [1, 2, 5];
  let b2 = [3, 6, 7];
  for (let b = 0; b < 3; b++) {
    let n = 2 + Math.floor(Math.random() * 3);
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let c = 0; c < n; c++) {
      let p = Math.floor(Math.random() * nums.length);
      let x = Math.floor(nums[p] / 3);
      let y = nums[p] % 3;
      view_cell(cell_c(b1[b], y, x));
      view_cell(cell_c(b2[b], x, y));
      total_num += 2;
      nums.splice(p, 1);
    }
  }
  if (total_num < num - 7) {
    for (let b = 0; b < 9; b += 4) {
      for (let i = 1; i < 4; i++) {
        let y = 0;
        let x = i;
        if (x == 3) {
          x = 2;
          y = 1;
        }
        let n = Math.floor(Math.random() * 2);
        if (n == 0) {
          view_cell(cell_c(b, y, x));
          view_cell(cell_c(b, x, y));
          total_num += 2;
        }
      }
    }
  }
  let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (total_num < num) {
    let end = num - total_num;
    if (end > 9) {
      end = 9;
    }
    for (let i = 0; i < end; i++) {
      let n = Math.floor(Math.random() * nums.length);
      let b = Math.floor(nums[n] / 3) * 4;
      let y = nums[n] % 3;
      view_cell(cell_c(b, y, y));
      nums.splice(n, 1);
      total_num++;
    }
  }
}

function hide_all_cells() {
  for (let i = 0; i < cell.length; i++) {
    cell[i].t_value("");
  }
}
function view_cell(c) {
  c.t_value(c.u_value);
}
function cell_c(b, y, x) {
  return cell[b * 9 + y * 3 + x];
}

function hide_beginner(num) {
  c.grade = Beginner;
  let nums = [];
  let index = 0;
  for (let i = 0; i < 81; i++) {
    nums.push(i);
  }
  while (true) {
    let x = Math.floor(Math.random() * nums.length);
    if (erase_possible(cell[nums[x]], num)) {
      cell[nums[x]].t_value("");
      nums.splice(nums.indexOf(nums[x]), 1);
    }
    index++;
    if (index > 100) {
      c.color_clear();
      break;
    }
  }
}

function erase_possible(cell_this, num) {
  let b = true,
    h = true,
    v = true;
  let cb = seek_cells(cell_this.b, "b", cell);
  let ch = seek_cells(cell_this.h, "h", cell);
  let cv = seek_cells(cell_this.v, "v", cell);
  let val = cell_this.t_value();
  let bn = 0,
    vn = 0,
    hn = 0;
  for (let x = 0; x < cb.length; x++) {
    if (cb[x].t_value() == "" && cell_this != cb[x]) {
      bn++;
    }
    if (bn > num) {
      b = false;
    }
  }
  for (let x = 0; x < ch.length; x++) {
    if (ch[x].t_value() == "" && cell_this != ch[x]) {
      hn++;
    }
    if (hn > num) {
      h = false;
    }
  }
  for (let x = 0; x < cv.length; x++) {
    if (cv[x].t_value() == "" && cell_this != cv[x]) {
      vn++;
    }
    if (vn > num) {
      v = false;
    }
  }
  if (b || v || h) {
    return true;
  } else {
    return false;
  }
}

function hide_intermediate(num) {
  // 중급
  c.grade = Intermediate;
  let index = 1;
  let total_index = 0;
  let addresses = [];
  for (let x = 0; x < 81; x++) {
    // 주소들을 addresses에 담는다.
    let adr = [0, 0, 0, 0];
    let n = x;
    let i = 0;
    while (n != 0) {
      adr[i] = n % 3;
      n = Math.floor(n / 3);
      i++;
    }
    let num_adr =
      "#main_board_" + adr[0] + "_" + adr[1] + "_" + adr[2] + "_" + adr[3];
    addresses.push(num_adr);
  }
  // 	숫자별 지우기
  let random_num = Math.floor(Math.random() * 2);
  for (let num = 1; num < 10; num++) {
    for (let b_num = random_num % 2; b_num < 9; b_num += 2) {
      let cells = c.b(b_num);
      for (let i = 0; i < 9; i++) {
        if (cells[i].t_value() == num) {
          cells[i].t_value("");
          addresses.splice(addresses.indexOf(cells[i].adr), 1);
          index++;
        }
      }
    }
    random_num++;
  }

  while (true) {
    total_index++;
    let num_adr = random_adr(addresses);
    if ($(num_adr).text() != "" && find_num(co_num(num_adr))) {
      cell[cell_address.indexOf(num_adr)].t_value("");
      delete addresses[addresses.indexOf(num_adr)];
      addresses = addresses.filter(function (num) {
        return num != null;
      });
      index++;
    }
    if (index == num) {
      return true;
    }

    //

    if (total_index > 20) {
      for (let i = 0; i < addresses.length; i++) {
        num_adr = addresses[i];
        if ($(num_adr).text() != "" && find_num(co_num(num_adr))) {
          cell[cell_address.indexOf(num_adr)].t_value("");
          delete addresses[addresses.indexOf(num_adr)];
          addresses = addresses.filter(function (num) {
            return num != null;
          });
          index++;
        }
        if (index == num) {
          return true;
        }
      }
      return true;
    }
  }
}
function random_adr(addresses) {
  let num = Math.floor(Math.random() * addresses.length);
  num_adr = addresses[num];
  return num_adr;
}

// 지우는 것이 가능한가 알아보기 ->
function find_num(co) {
  functions = [find_num_h, find_num_v, find_num_b];
  var check_numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let x = 0; x < functions.length; x++) {
    check_numbers = functions[x](co, check_numbers);
    if (check_numbers.length == 1) {
      return true;
    }
  }
}
function find_num_h(co, check_numbers) {
  for (let bx = 0; bx < 3; bx++) {
    for (let x = 0; x < 3; x++) {
      if (co.bx == bx && co.x == x) {
      } else {
        let num = $(
          "#main_board_" + co.by + "_" + bx + "_" + co.y + "_" + x
        ).text();
        delete check_numbers[check_numbers.indexOf(num)];
        check_numbers = check_numbers.filter(function (num) {
          return num != null;
        });
      }
    }
  }
  return check_numbers;
}
function find_num_v(co, check_numbers) {
  for (let by = 0; by < 3; by++) {
    for (let y = 0; y < 3; y++) {
      if (co.by == by && co.y == y) {
      } else {
        let num = $(
          "#main_board_" + by + "_" + co.bx + "_" + y + "_" + co.x
        ).text();
        delete check_numbers[check_numbers.indexOf(num)];
        check_numbers = check_numbers.filter(function (num) {
          return num != null;
        });
      }
    }
  }
  return check_numbers;
}
function find_num_b(co, check_numbers) {
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (co.y == y && co.x == x) {
      } else {
        let num = $(
          "#main_board_" + co.by + "_" + co.bx + "_" + y + "_" + x
        ).text();
        delete check_numbers[check_numbers.indexOf(num)];
        check_numbers = check_numbers.filter(function (num) {
          return num != null;
        });
      }
    }
  }
  return check_numbers;
}

function touch_vib(num) {
  music_check();
  if (browser != "pc" && mobile_os == "Android") {
    // ie edge는 에러가 발생됨.
    if (num == undefined) {
      navigator.vibrate(10);
    } else {
      navigator.vibrate(num);
    }
  }
  if (c.game_over) {
    // 게임이 끝난 경우 start_board로  // 셀 터치의 경우
    cells_all_init();
    b01();
  }
}

function game_clear_ani() {
  let data_arr = [];
  let right = 9,
    down = 8,
    num = 0;
  let x_a = 0,
    y_a = 0,
    forward = true;
  while (num < cell.length) {
    if (forward) {
      for (let y = 0; y < right; y++) {
        disappear_order.push(find_cell_by_y_x(y_a, x_a));
        x_a++;
        num++;
      }
      y_a++;
      x_a--;
      for (let x = 0; x < down; x++) {
        disappear_order.push(find_cell_by_y_x(y_a, x_a));
        y_a++;
        num++;
      }
      y_a--;
      x_a--;
    } else {
      for (let y = 0; y < right; y++) {
        disappear_order.push(find_cell_by_y_x(y_a, x_a));
        x_a--;
        num++;
      }
      x_a++;
      y_a--;
      for (let x = 0; x < down; x++) {
        disappear_order.push(find_cell_by_y_x(y_a, x_a));
        y_a--;
        num++;
      }
      y_a++;
      x_a++;
    }
    right--;
    down--;
    forward = !forward;
  }
  id1 = window.setInterval(disappear_cells, 20);
  return disappear_order;
}
function find_cell_by_y_x(y, x) {
  for (let i = 0; i < cell.length; i++) {
    if (cell[i].v == y && cell[i].h == x) {
      return cell[i];
    }
  }
}
function disappear_cells() {
  $("#foot_board").slideUp("slow");
  end_time = Date.now();
  if (disappear_index < cell.length) {
    disappear_order[disappear_index].t_value("");
    disappear_order[disappear_index].u_value = "";
    let r = 204 - disappear_index * 2;
    let r2 = 255 - disappear_index * 2;
    let c = "rgb(" + r + ", " + r2 + ", 255)";
    $(disappear_order[disappear_index].adr).css("backgroundColor", c);
    disappear_index++;
  } else if (c.board != Endingboard) {
    // 아직 트루가 아님.
    clearInterval(id1);
    disappear_index = 0; // 점수판을 작성함.
    let time = Math.floor((end_time - start_time) / 1000);
    let minute = Math.floor(time / 60);
    let second = time - minute * 60;
    y_score = c.grade * 30 * 60 - y_wrong_try * 20 - time;
    $("#y_score").text(y_score);
    $("#y_time").text(minute + ":" + second);
    if (y_wrong_try == 0) {
      y_wrong_try = "없음";
    } else {
      y_wrong_try = y_wrong_try + "회";
    }
    $("#y_wrongnum").text(y_wrong_try);

    y_time = minute + ":" + second;
    //	c.game_over = true;	                       // 게임오버를 트루로 하고 엔딩으로 넘어감
    $("#input_name").hide();
    setTimeout(function () {
      ending();
    }, 1500);
  }
}
function endingboard_show() {
  $("#input_name").hide();
  if (c.board != Endingboard) {
    if (c.board == Mainboard) {
      $("#main_board, #foot_board").slideUp("slow");
      $("#main_endingboard").slideDown("slow");
      $("#main_endingboard").on("click", function () {
        b01();
      });
      c.board = Endingboard;
    } else {
      view_mainboard(1);
      endingboard_show();
    }
  } else {
    b01();
  }
}
function server_record_write() {
  $("#head_board").slideUp("slow");
  $("#input_name").hide();
  $("#input_name").css("display", "flex").css("text-align", "left");
  $("#main_endingboard").off("click");
  $("#input_name_save").on("click", function () {
    let name = $("#usr_name").val();
    if (name != "") {
      $("#input_name").after("<h5>저장되었습니다!</h5>");
      for (let i = 1; i < 6; i++) {
        // record 화면에 기록
        for (x in score_ob) {
          if (score_ob[x] == "무명") {
            score_ob[x] = name;
          }
          $(x).text(score_ob[x]);
        }
      }
      $.post("/sudoku", score_ob);
    } else {
      $("#input_name").after("<h5>취소되었습니다!</h5>");
    }
    $("#input_name_save").off("click");
    $("#input_name").slideUp("slow");
    $("#head_board").slideDown("slow");
    $("#main_endingboard").on("click", function () {
      b01();
    });
    c.board = Endingboard;
  });
}

function ending() {
  endingboard_show();
  let new_record = false;
  let st = ["_n", "_s", "_t", "_w"];
  score_ob = {};
  let ranking = 0;
  let index = 1;
  let i = 1;
  while (true) {
    if ($("#No" + i + "_s").text() < y_score && !new_record) {
      var y_name = "무명";
      ranking = index;
      let y_st = [y_name, y_score, y_time, y_wrong_try];
      for (let n = 0; n < st.length; n++) {
        score_ob["#No" + index + st[n]] = y_st[n];
      }
      new_record = true;
      index++;
    }

    for (let n = 0; n < st.length; n++) {
      score_ob["#No" + index + st[n]] = $("#No" + i + st[n]).text();
    }
    index++;
    i++;
    if (index == 6) {
      break;
    }
  }
  $("#clear_txt").text("Clear! 축하합니다.");
  if (new_record) {
    $("#clear_txt").text("Clear!! " + ranking + "등 축하합니다.");
    server_record_write();
  }
  y_score = 0;
  y_wrong_try = 0;
  return true;
}

function best_record_write() {
  let st = ["_n", "_s", "_t", "_w"];
  let index = 0;
  $("#No1_n").load("/record/sudokurecord.txt", function (res, sta) {
    let string = $("#No1_n").text().split(" ");
    for (let i = 1; i < 6; i++) {
      for (let n = 0; n < 4; n++) {
        $("#No" + i + st[n]).text(string[index]);
        index++;
      }
    }
  });
}

function main_board_all_slideUp() {
  $(
    "#main_board, #foot_board, #main_pauseboard, #main_scoreboard, #main_startboard, #main_loadboard, #main_endingboard, #main_saveboard"
  ).slideUp("slow");
  $(
    "#main_board, #foot_board, #main_pauseboard, #main_scoreboard, #main_startboard, #main_loadboard, #main_endingboard, #main_saveboard"
  ).off("click");
}

function view_mainboard(num) {
  if (c.board != Mainboard) {
    main_board_all_slideUp();
  }
  if (num == undefined) {
    $("#main_board, #foot_board").slideDown("slow");
  }
  c.board = Mainboard;
  if (c.pause == On) {
    delaytime_e = Date.now();
    start_time += delaytime_e - delaytime_s;
    c.pause = Off;
  }
}
function b01() {
  if (c.board != Startboard) {
    if (c.board == Mainboard) {
      $("#main_board,#foot_board").slideUp("slow");
      $("#main_startboard").slideDown("slow");
      c.board = Startboard;
    } else {
      view_mainboard(1);
      b01();
    }
  } else {
    view_mainboard();
  }
}
function b02() {
  if (c.start) {
    // 잠시정지 버튼
    if (c.board != Pauseboard) {
      if (c.board == Mainboard) {
        let img_url =
          "url('img/" +
          img_list[Math.floor(Math.random() * img_list.length)] +
          "')";
        $("#main_pauseboard")
          .css("background-image", img_url)
          .css("background-size", "cover");
        $("#main_board, #foot_board").slideUp("slow");
        $("#main_pauseboard").slideDown("slow");
        delaytime_s = Date.now();
        $("#main_pauseboard").on("click", function () {
          b02();
        });
        c.board = Pauseboard;
        c.pause = On;
      } else {
        view_mainboard(1);
        b02();
      }
    } else {
      view_mainboard();
      $("#main_pauseboard").off("click");
    }
  }
}
function b03() {
  if (c.board != Scoreboard) {
    if (c.board == Mainboard) {
      $("#main_board, #foot_board").slideUp("slow");
      $("#main_scoreboard").slideDown("slow");
      $("#main_scoreboard").on("click", function () {
        b03();
      });
      c.board = Scoreboard;
    } else {
      view_mainboard(1);
      b03();
    }
  } else {
    $("#main_scoreboard").off("click");
    view_mainboard();
  }
}

function b05() {
  if (c.board != Savingboard) {
    main_board_all_slideUp();
    $("#main_saveboard").slideDown("slow");
  }
  $("#alert_save").html("");
  $("#main_saveboard").off("click");
  c.board = Savingboard;
  $("#main_saveboard").css("text-align", "left");
  $("#save_name").keyup(function (event) {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
      event.preventDefault();
      save_click();
    }
  });
  $("#save_filename").on("click", function () {
    save_click();
  });
}
function save_click() {
  let name = $("#save_name").val();
  let this_time = Date.now();
  let time = this_time - start_time;
  let save_file = { savename: name, time: time, grade: c.grade };
  for (let i = 0; i < cell.length; i++) {
    let t_v = cell[i].t_value();
    if (t_v == "") {
      t_v = "@";
    }
    let guess_arr = cell[i].guess;
    if (guess_arr[0] == undefined) {
      guess_arr = "@";
    }
    save_file["c" + i] = [t_v, cell[i].u_value, cell[i].research, guess_arr];
  }
  if (name != "") {
    $.post("/sudoku", save_file, function (result) {
      if (result) {
        $("#alert_save").html("<br><h5>저장되었습니다!</h5>");
      } else {
        $("#alert_save").html("<br><h5>저장에 문제가 발생하였습니다!</h5>");
      }
    });
  } else {
    $("#alert_save").html("<br><h5>취소되었습니다!</h5>");
  }
  setTimeout(function () {
    $("#main_saveboard").on("click", function () {
      view_mainboard();
    });
  }, 1500);
  $("#save_name").off("keyup");
}

function load_file() {
  $("#main_board, #foot_board, #main_startboard").slideUp("slow");
  $("#main_loadboard").slideDown("slow");
  $("#alert_load").html("");
  $("#main_loadboard").off("click");
  c.board = Loadingboard;
  $("#main_loadboard").css("display", "block").css("text-align", "left");
  $("#load_name").keyup(function (event) {
    console.log(event.keyCode);
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      load_click();
    }
  });
  $("#load_filename").on("click", function () {
    load_click();
  });
}
function load_click() {
  let name = $("#load_name").val();
  if (name != "") {
    $.post("/sudoku", { loadname: name }, function (result) {
      if (result.savename == name) {
        load_cell_write(result);
        $("#alert_load").html("<br><h5>불러왔습니다!</h5>");
      } else {
        $("#alert_load").html("<br><h5>불러오는데 문제가 발생하였습니다!</h5>");
      }
    });
  } else {
    $("#alert_load").html("<br><h5>취소되었습니다!</h5>");
  }
  $("#load_name").off("keyup");
  setTimeout(function () {
    $("#main_loadboard").on("click", function () {
      view_mainboard();
    });
  }, 1500);
}

function load_cell_write(load_data) {
  cells_all_init();
  c.grade = Number(load_data.grade);
  start_time -= load_data.time;
  for (let i = 0; i < 81; i++) {
    let t_v = load_data["c" + i][0];
    if (t_v == "@") {
      t_v = "";
    } else {
      t_v = Number(t_v);
    }
    cell[i].t_value(t_v);
    cell[i].u_value = Number(load_data["c" + i][1]);
    if (load_data["c" + i][2] == "true") {
      cell[i].research = true;
    } else {
      cell[i].research = false;
    }
    let t_g = load_data["c" + i][3];
    if (t_g != "@") {
      for (let j = 0; j < t_g.length; j++) {
        let n = Number(t_g[j]);
        cell[i].guess.push(n);
      }
      cell[i].guess_on();
    }
  }
}

function music_play() {
  c.music = !c.music;
  touch_vib();
  music_check();
  if (bg_music.paused) {
    bg_music.play();
  } else {
    bg_music.pause();
  }
}
function music_check() {
  if (c.music && bg_music.ended) {
    bg_music.src =
      "music\\" + music_list[Math.floor(Math.random() * music_list.length)];
    bg_music.play();
  }
}

function checkBroswer() {
  var agent = navigator.userAgent.toLowerCase();
  var name = navigator.appName;
  var browser = "";
  // MS 계열 브라우저를 구분
  if (
    name === "Microsoft Internet Explorer" ||
    agent.indexOf("trident") > -1 ||
    agent.indexOf("edge/") > -1
  ) {
    browser = "ie";
    if (name === "Microsoft Internet Explorer") {
      // IE old version (IE 10 or Lower)
      agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
      browser += parseInt(agent[1]);
    } else {
      // IE 11+
      if (agent.indexOf("trident") > -1) {
        // IE 11
        browser += 11;
      } else if (agent.indexOf("edge/") > -1) {
        // Edge
        browser = "edge";
      }
    }
  } else if (agent.indexOf("safari") > -1) {
    // Chrome or Safari
    if (agent.indexOf("opr") > -1) {
      // Opera
      browser = "opera";
    } else if (agent.indexOf("chrome") > -1) {
      // Chrome
      browser = "chrome";
    } else {
      // Safari
      browser = "safari";
    }
  } else if (agent.indexOf("firefox") > -1) {
    // Firefox
    browser = "firefox";
  }
  return browser;
}

var filter = "win16|win32|win64|mac|macintel";
function pc_or_mobile() {
  if (navigator.platform) {
    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
      browser = "mobile";
    } else {
      //pc alert('pc 접속'); }
      browser = "pc";
    }
  }
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
