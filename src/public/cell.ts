export class Cell {
  x: number;
  y: number;
  place: string;
  value: number;
  added: boolean;
  pulse: boolean;
  comeOut: boolean;
  viewString: string;
  textColor: string;
  bgColor: string;
  fontStretch: string;
  textStyle: string;

  private static readonly BG_MAP: Record<number, string> = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
    4096: "#1e1e1e",
    8192: "#333333",
  };

  constructor(value: number, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.place = "";
    this.value = value;

    this.added = false;
    this.pulse = false;
    this.comeOut = false;
    this.viewString = "";
    this.textColor = "#8f7a66";
    this.bgColor = "#cdc1b4";
    this.fontStretch = "extra-expanded";
    this.textStyle = "";
    this.set(value);
  }

  rowInsideReload(animation: string = ""): void {
    console.log("Cell reload:", this.place, this.value);
    const cellDiv = document.getElementById(this.place);
    if (cellDiv) {
      if (animation !== "") cellDiv.classList.remove(animation);
      cellDiv.style.backgroundColor = this.bgColor;
      cellDiv.style.color = this.textColor;
      if (animation !== "") cellDiv.classList.add(animation);
      cellDiv.innerHTML = `<div ${
        this.textStyle == "" ? "" : `style="transform: ${this.textStyle};"`
      }>${this.viewString}</div>`;
    }
    this.pulse = false;
    this.comeOut = false;
  }
  set(
    num: number,
    animation: string = "",
    x: number = this.x,
    y: number = this.y
  ): void {
    this.x = x;
    this.y = y;
    this.place = x + "-" + y;
    this.value = num;
    this.viewString = this.value == 0 ? "" : "" + this.value;
    this.bgColor = Cell.BG_MAP[this.value] ?? "#cdc1b4";
    this.textColor = this.value < 8 ? "#8f7a66" : "#ffffff";
    this.textStyle =
      this.value == 16
        ? "translateX(-.037rem)"
        : this.value < 128
        ? ""
        : 128 == this.value
        ? "translateX(-0.13rem) scaleX(0.72)"
        : this.value < 1024
        ? "translateX(-0.1rem) scaleX(0.72)"
        : 1024 == this.value
        ? "translateX(-0.3rem) scaleX(0.53)"
        : "translateX(-0.26rem) scaleX(0.53)";
    this.rowInsideReload(animation);
  }
}

// 2048 게임 보드의 구성인 cells에서 화살표 위, 아래, 왼쪽, 오른쪽 이동 기능을 구현합니다.
