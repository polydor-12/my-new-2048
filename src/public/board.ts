import { Cell } from "./cell";
import { Score } from "./score";

export interface Cells {
  [key: string]: Cell;
}

export class Board {
  cells: Cells = {};
  gameOver: boolean = false;
  score: Score;

  constructor() {
    this.cells = {};
    this.score = new Score();
    // this.makeBoardFrame();
    this.loadCells(this.cells);
  }

  // score 관련 메서드

  addScore(value: number, myCells: Cells = this.cells): void {
    this.score.set(value);
    this.saveCells(myCells);
  }

  // cell 관련 메서드

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
  addNumberCell(myCells: Cells = this.cells): boolean {
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

  moveLeft(myCells: Cells = this.cells): boolean {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let y = 0; y < 4; y++) {
      for (let loop = 1; loop < 4; loop++) {
        for (let x = 1; x < 4; x++) {
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
    }
    this.score.set(addedScore);
    return moved;
  }

  moveRight(myCells: Cells = this.cells): boolean {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let y = 0; y < 4; y++) {
      for (let loop = 1; loop < 4; loop++) {
        for (let x = 2; x >= 0; x--) {
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
    }
    this.score.set(addedScore);
    return moved;
  }

  moveUp(myCells: Cells = this.cells): boolean {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let x = 0; x < 4; x++) {
      for (let loop = 1; loop < 4; loop++) {
        for (let y = 1; y < 4; y++) {
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
    }
    this.score.set(addedScore);
    return moved;
  }
  moveDown(myCells: Cells = this.cells): boolean {
    let moved = false;
    let addedScore = 0;
    this.removeAdded();
    for (let x = 0; x < 4; x++) {
      for (let loop = 1; loop < 4; loop++) {
        for (let y = 2; y >= 0; y--) {
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
    }
    this.score.set(addedScore);
    return moved;
  }
}
