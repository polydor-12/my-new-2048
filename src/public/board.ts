import { Cell } from "./cell";
import { chooseBestMove2, Direction } from "./chooseKey";
import { Score } from "./score";
import { delay } from "./util";

export interface Cells {
  [key: string]: Cell;
}

export class Board {
  delayTime: number = 30;
  cells: Cells = {};
  gameOver: boolean = false;
  score: Score;
  lastMove: Direction | null = null;
  autoPlay: boolean = false;

  constructor() {
    this.cells = {};
    this.score = new Score();
    this.score.loadScores();
    this.loadCells(this.cells);
  }

  // score 관련 메서드

  addScore(addedScore: number, myCells: Cells = this.cells): void {
    this.score.set(addedScore);
    this.saveCells();
  }

  // cell 관련 메서드

  resetBoard(): void {
    this.cells = {};
    this.gameOver = false;
    this.score.resetScore();
    this.initCells(this.cells);
  }

  initCells(myCells: Cells = this.cells): void {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        myCells[x + "-" + y] = new Cell(0, x, y);
      }
    }
    console.log("initCells", myCells);
    this.addNumberCell();
    this.addNumberCell();
  }
  async addNumberCell(myCells: Cells = this.cells): Promise<boolean> {
    const emptyCells: Cell[] = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (myCells[x + "-" + y].value === 0) {
          emptyCells.push(myCells[x + "-" + y]);
        }
      }
    }
    if (emptyCells.length === 0) {
      return false;
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    if (randomIndex < 0 || randomIndex >= emptyCells.length) return false;
    emptyCells[randomIndex].set(Math.random() < 0.7 ? 2 : 4, "come-out");
    console.log(
      "Added number cell at",
      emptyCells[randomIndex].x,
      emptyCells[randomIndex].y,
      "with value",
      emptyCells[randomIndex].value
    );
    await delay(this.delayTime * 2);
    return true;
  }

  saveCells(myCells: Cells = this.cells): void {
    const cellsData: any = {};
    for (const key in myCells) {
      cellsData[key] = {
        x: myCells[key].x,
        y: myCells[key].y,
        value: myCells[key].value,
      };
    }
    localStorage.setItem("cells", JSON.stringify(cellsData));
  }

  loadCells(myCells: Cells = this.cells) {
    const savedCells = localStorage.getItem("cells");
    if (savedCells) {
      const cellsData = JSON.parse(savedCells);
      for (const key in cellsData) {
        myCells[key] = new Cell(
          cellsData[key].value,
          cellsData[key].x,
          cellsData[key].y
        );
      }
    } else {
      this.initCells(myCells);
    }
  }

  removeAdded(myCells: Cells = this.cells): void {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        myCells[x + "-" + y].added = false;
        const cellDiv = document.getElementById(x + "-" + y);
        if (cellDiv) {
          cellDiv.classList.remove("pulse");
          cellDiv.classList.remove("come-out");
        }
      }
    }
  }

  makeBoardFrame(): void {
    let board = "";

    const column = (rows: string) => `<div class="column">${rows}</div>`;
    const rowInside = (x: number, y: number) =>
      `<div class="row"><div id="${x + "-" + y}" class="row-inside">
      <div></div></div>
    </div>`;
    for (let y = 0; y < 4; y++) {
      let rowInsides = "";
      for (let x = 0; x < 4; x++) {
        console.log("creating cell div:", rowInside(x, y));
        rowInsides += rowInside(x, y);
      }
      board += column(rowInsides);
    }
    console.log("board frame created", board);
    const boardDiv = document.getElementById("board");
    if (boardDiv) {
      boardDiv.innerHTML = board;
    }
  }

  // cell 이동 메서드들

  async moveLeft(myCells: Cells = this.cells): Promise<boolean> {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let loop = 1; loop < 4; loop++) {
      for (let x = 1; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          if (
            myCells[x - 1 + "-" + y].added ||
            myCells[x + "-" + y].value === 0
          )
            continue;
          if (
            myCells[x - 1 + "-" + y].value === myCells[x + "-" + y].value &&
            !myCells[x + "-" + y].added
          ) {
            addedScore += myCells[x - 1 + "-" + y].doubleUp(
              myCells[x + "-" + y]
            );
            moved = true;
          } else if (myCells[x - 1 + "-" + y].value === 0) {
            myCells[x - 1 + "-" + y].moveFrom(myCells[x + "-" + y]);
            moved = true;
          }
        }
      }
      await delay(this.delayTime);
    }
    this.addScore(addedScore);
    return moved;
  }
  async moveRight(myCells: Cells = this.cells): Promise<boolean> {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let loop = 1; loop < 4; loop++) {
      for (let x = 2; x >= 0; x--) {
        for (let y = 0; y < 4; y++) {
          if (
            myCells[x + 1 + "-" + y].added ||
            myCells[x + "-" + y].value === 0
          )
            continue;
          if (
            myCells[x + 1 + "-" + y].value === myCells[x + "-" + y].value &&
            !myCells[x + "-" + y].added
          ) {
            addedScore += myCells[x + 1 + "-" + y].doubleUp(
              myCells[x + "-" + y]
            );
            moved = true;
          } else if (myCells[x + 1 + "-" + y].value === 0) {
            myCells[x + 1 + "-" + y].moveFrom(myCells[x + "-" + y]);
            moved = true;
          }
        }
      }
      await delay(this.delayTime);
    }
    this.addScore(addedScore);
    return moved;
  }
  async moveUp(myCells: Cells = this.cells): Promise<boolean> {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let loop = 1; loop < 4; loop++) {
      for (let y = 1; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (
            myCells[x + "-" + (y - 1)].added ||
            myCells[x + "-" + y].value === 0
          )
            continue;
          if (
            myCells[x + "-" + (y - 1)].value === myCells[x + "-" + y].value &&
            !myCells[x + "-" + y].added
          ) {
            addedScore += myCells[x + "-" + (y - 1)].doubleUp(
              myCells[x + "-" + y]
            );
            moved = true;
          } else if (myCells[x + "-" + (y - 1)].value === 0) {
            myCells[x + "-" + (y - 1)].moveFrom(myCells[x + "-" + y]);
            moved = true;
          }
        }
      }
      await delay(this.delayTime);
    }
    this.addScore(addedScore);
    return moved;
  }
  async moveDown(myCells: Cells = this.cells): Promise<boolean> {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let loop = 1; loop < 4; loop++) {
      for (let y = 2; y >= 0; y--) {
        for (let x = 0; x < 4; x++) {
          if (
            myCells[x + "-" + (y + 1)].added ||
            myCells[x + "-" + y].value === 0
          )
            continue;
          if (
            myCells[x + "-" + (y + 1)].value === myCells[x + "-" + y].value &&
            !myCells[x + "-" + y].added
          ) {
            addedScore += myCells[x + "-" + (y + 1)].doubleUp(
              myCells[x + "-" + y]
            );
            moved = true;
          } else if (myCells[x + "-" + (y + 1)].value === 0) {
            myCells[x + "-" + (y + 1)].moveFrom(myCells[x + "-" + y]);
            moved = true;
          }
        }
      }
      await delay(this.delayTime);
    }
    this.addScore(addedScore);
    return moved;
  }

  // cell to string으로 1$16$4096$2$...
  cellsToString(myCells: Cells = this.cells): string {
    let result = "";
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        result += myCells[x + "-" + y].value + "$";
      }
    }
    return result.slice(0, -1);
  }
  async autoPlayStart(autoPlay: boolean = true) {
    this.autoPlay = autoPlay;
    while (this.autoPlay) {
      const cellsString = this.cellsToString();
      console.log("AutoPlay cellsString:", cellsString);
      const keys = chooseBestMove2(cellsString);
      console.log("AutoPlay chosen keys:", keys.dir, keys.ok);
      this.lastMove = keys.dir;
      if (keys.ok) {
        let moved = false;
        switch (keys.dir) {
          case "ArrowLeft":
            moved = await this.moveLeft();
            break;
          case "ArrowRight":
            moved = await this.moveRight();
            break;
          case "ArrowUp":
            moved = await this.moveUp();
            break;
          case "ArrowDown":
            moved = await this.moveDown();
            break;
        }
        if (moved) {
          await this.addNumberCell();
        }
      } else {
        console.log("No valid moves available. Stopping AutoPlay.");
        this.autoPlay = false;
      }
    }
  }
  autoPlayStop(): void {
    this.autoPlay = false;
  }
}
