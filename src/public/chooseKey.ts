// chooseKey.ts
// Go 원본의 기능을 TypeScript로 변환한 파일
// 주요 기능: Board 표현, 이동/병합/회전, 휴리스틱, 이동 정렬, Expectimax, Iterative Deepening, TT 캐시

type Board2 = number[][]; // 4x4

export enum Direction {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  Unset = "Unset",
}

export interface MoveResult2 {
  board: Board2;
  moved: boolean;
  gain: number;
}

interface OrderedMove2 {
  name: Direction;
  result: MoveResult2;
  priority?: number;
}

class TTStore2 {
  private m: Map<string, number>;
  constructor() {
    this.m = new Map();
  }
  get(hash: string, depth: number): number | undefined {
    return this.m.get(`${hash}|${depth}`);
  }
  set(hash: string, depth: number, value: number) {
    this.m.set(`${hash}|${depth}`, value);
  }
}

// -------------------- Utility / Board helpers --------------------

export function cloneBoard(b: Board2): Board2 {
  return b.map((row) => row.slice());
}

export function emptyBoard(): Board2 {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

export function parseBoardString(padString: string): Board2 {
  // padString expected as "a$b$c$...$p" 16 parts, empty -> 0
  const clean = padString.trim().replace(/%$/, "");
  const parts = clean
    .split("$")
    .filter((_, i, arr) => !(arr.length === 17 && i === 16));
  if (parts.length !== 16) {
    throw new Error(
      `보드 문자열은 16개의 파트여야 합니다 (분리된 파트 수: ${parts.length})`
    );
  }
  const b = emptyBoard();
  for (let i = 0; i < 16; i++) {
    const p = parts[i];
    b[Math.floor(i / 4)][i % 4] = p === "" ? 0 : parseInt(p, 10);
  }
  return b;
}

export function boardHash(b: Board2): string {
  // 문자열 해시(Go 원본의 64-bit shift 대체)
  return b.map((r) => r.map((v) => v.toString(16)).join(",")).join("|");
}

// -------------------- Rotation / Transpose / Reverse --------------------

export function transpose(b: Board2): Board2 {
  const out = emptyBoard();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[c][r] = b[r][c];
  return out;
}

export function reverseRows(b: Board2): Board2 {
  const out = emptyBoard();
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) out[r][c] = b[r][3 - c];
  return out;
}

export function rotate90(b: Board2): Board2 {
  const out = emptyBoard();
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) out[c][3 - r] = b[r][c];
  return out;
}

export function rotate180(b: Board2): Board2 {
  const out = emptyBoard();
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) out[3 - r][3 - c] = b[r][c];
  return out;
}

export function rotate270(b: Board2): Board2 {
  const out = emptyBoard();
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) out[3 - c][r] = b[r][c];
  return out;
}

// -------------------- Moves: compress & merge row left --------------------

function compressAndMergeRowLeft2(row: number[]): {
  out: number[];
  moved: boolean;
  gain: number;
} {
  const nonZero = row.filter((v) => v !== 0);
  const merged: number[] = [];
  let gain = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const v = nonZero[i] * 2;
      merged.push(v);
      gain += v;
      i++;
    } else {
      merged.push(nonZero[i]);
    }
  }
  while (merged.length < 4) merged.push(0);
  let moved = false;
  for (let i = 0; i < 4; i++) {
    if (row[i] !== merged[i]) {
      moved = true;
      break;
    }
  }
  return { out: merged, moved, gain };
}

export function moveLeft2(b: Board2): MoveResult2 {
  const out = emptyBoard();
  let moved = false;
  let gain = 0;
  for (let r = 0; r < 4; r++) {
    const {
      out: row,
      moved: rowMoved,
      gain: rowGain,
    } = compressAndMergeRowLeft2(b[r]);
    out[r] = row;
    gain += rowGain;
    if (rowMoved) moved = true;
  }
  return { board: out, moved, gain };
}

export function moveRight2(b: Board2): MoveResult2 {
  const rev = reverseRows(b);
  const res = moveLeft2(rev);
  return { board: reverseRows(res.board), moved: res.moved, gain: res.gain };
}

export function moveUp2(b: Board2): MoveResult2 {
  const t = transpose(b);
  const res = moveLeft2(t);
  return { board: transpose(res.board), moved: res.moved, gain: res.gain };
}

export function moveDown2(b: Board2): MoveResult2 {
  const t = transpose(b);
  const res = moveRight2(t);
  return { board: transpose(res.board), moved: res.moved, gain: res.gain };
}

// -------------------- Board methods --------------------

export function emptyCells(b: Board2): [number, number][] {
  const empties: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) if (b[r][c] === 0) empties.push([r, c]);
  return empties;
}

export function mergePotential(b: Board2): number {
  let merges = 0;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (b[r][c] === 0) continue;
      if (c + 1 < 4 && b[r][c] === b[r][c + 1]) merges++;
      if (r + 1 < 4 && b[r][c] === b[r + 1][c]) merges++;
    }
  return merges;
}

export function monotonicity(b: Board2): number {
  const totals = [0, 0, 0, 0]; // Up, Down, Left, Right (as floats)
  // Rows
  for (let i = 0; i < 4; i++) {
    let current = 0;
    let next = 1;
    while (next < 4) {
      while (next < 4 && b[i][next] === 0) next++;
      if (next >= 4) break;
      let currentVal = 0,
        nextVal = 0;
      if (b[i][current] > 0) currentVal = Math.log2(b[i][current]);
      if (b[i][next] > 0) nextVal = Math.log2(b[i][next]);
      if (currentVal > nextVal) totals[2] += nextVal - currentVal;
      else if (nextVal > currentVal) totals[3] += currentVal - nextVal;
      current = next;
      next++;
    }
  }
  // Cols
  for (let j = 0; j < 4; j++) {
    let current = 0;
    let next = 1;
    while (next < 4) {
      while (next < 4 && b[next][j] === 0) next++;
      if (next >= 4) break;
      let currentVal = 0,
        nextVal = 0;
      if (b[current][j] > 0) currentVal = Math.log2(b[current][j]);
      if (b[next][j] > 0) nextVal = Math.log2(b[next][j]);
      if (currentVal > nextVal) totals[0] += nextVal - currentVal;
      else if (nextVal > currentVal) totals[1] += currentVal - nextVal;
      current = next;
      next++;
    }
  }
  return (
    (Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3])) * 10.0
  );
}

export function smoothness(b: Board2): number {
  let smooth = 0;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (b[r][c] === 0) continue;
      const val = Math.log2(b[r][c]);
      if (c + 1 < 4 && b[r][c + 1] > 0)
        smooth -= Math.abs(val - Math.log2(b[r][c + 1]));
      if (r + 1 < 4 && b[r + 1][c] > 0)
        smooth -= Math.abs(val - Math.log2(b[r + 1][c]));
    }
  return smooth * 10.0;
}

// -------------------- Heuristic --------------------

export function heuristic2(b: Board2): number {
  const numEmpty = emptyCells(b).length;
  const mergePot = mergePotential(b);
  if (numEmpty === 0 && mergePot === 0) return Number.NEGATIVE_INFINITY;

  let positionalScore = 0.0;
  const weights = [
    [10, 8, 7, 6.5],
    [0.5, 0.7, 1, 3],
    [-0.5, -1.5, -1.8, -2],
    [-3.8, -3.7, -3.5, -3],
  ];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (b[r][c] > 0) positionalScore += b[r][c] * weights[r][c];

  const monoScore = monotonicity(b);
  const smoothScore = smoothness(b);

  let centralityPenalty = 0.0;
  for (let r = 1; r <= 2; r++)
    for (let c = 0; c < 4; c++) if (b[r][c] > 32) centralityPenalty += b[r][c];

  let emptyWeight = 270.0;
  let mergeWeight = 700.0;
  if (numEmpty <= 3) {
    emptyWeight = 1200.0;
    mergeWeight = 1500.0;
  }
  const emptyScore = numEmpty * emptyWeight;
  const mergeScore = mergePot * mergeWeight;

  return (
    positionalScore +
    monoScore +
    smoothScore +
    emptyScore +
    mergeScore -
    centralityPenalty * 15.0
  );
}

// -------------------- Move ordering & legal moves --------------------

export function legalMoves2(b: Board2): OrderedMove2[] {
  const moves: OrderedMove2[] = [];
  const up = moveUp2(b);
  if (up.moved) moves.push({ name: Direction.ArrowUp, result: up });
  const down = moveDown2(b);
  if (down.moved) moves.push({ name: Direction.ArrowDown, result: down });
  const left = moveLeft2(b);
  if (left.moved) moves.push({ name: Direction.ArrowLeft, result: left });
  const right = moveRight2(b);
  if (right.moved) moves.push({ name: Direction.ArrowRight, result: right });
  return moves;
}

export function orderMoves2(b: Board2): OrderedMove2[] {
  const legals = legalMoves2(b);
  const moves = legals.map((m) => {
    const pri = m.result.gain + heuristic2(m.result.board);
    return { name: m.name, result: m.result, priority: pri };
  });
  moves.sort((a, c) => c.priority! - a.priority!);
  return moves;
}

// -------------------- UnRotateMove --------------------

export function unRotateMove(
  move: Direction,
  rotationIndex: number
): Direction {
  // rotationIndex: 0,1,2,3 (0/90/180/270 clockwise)
  if (rotationIndex === 1) {
    switch (move) {
      case Direction.ArrowUp:
        return Direction.ArrowLeft;
      case Direction.ArrowRight:
        return Direction.ArrowUp;
      case Direction.ArrowDown:
        return Direction.ArrowRight;
      case Direction.ArrowLeft:
        return Direction.ArrowDown;
    }
  } else if (rotationIndex === 2) {
    switch (move) {
      case Direction.ArrowUp:
        return Direction.ArrowDown;
      case Direction.ArrowRight:
        return Direction.ArrowLeft;
      case Direction.ArrowDown:
        return Direction.ArrowUp;
      case Direction.ArrowLeft:
        return Direction.ArrowRight;
    }
  } else if (rotationIndex === 3) {
    switch (move) {
      case Direction.ArrowUp:
        return Direction.ArrowRight;
      case Direction.ArrowRight:
        return Direction.ArrowDown;
      case Direction.ArrowDown:
        return Direction.ArrowLeft;
      case Direction.ArrowLeft:
        return Direction.ArrowUp;
    }
  }
  return move;
}

// -------------------- Expectimax & findBestMoveAtDepth --------------------

export function expectimax2(
  b: Board2,
  depth: number,
  isPlayerTurn: boolean,
  tt: TTStore2,
  timeLimitMs: number
): number {
  if (Date.now() > timeLimitMs) return -1;
  if (depth === 0) return heuristic2(b);

  const hash = boardHash(b);
  const cached = tt.get(hash, depth);
  if (cached !== undefined) return cached;

  let score: number;
  if (isPlayerTurn) {
    score = Number.NEGATIVE_INFINITY;
    const moves = orderMoves2(b);
    if (moves.length === 0) {
      return heuristic2(b);
    }
    for (const mv of moves) {
      const childScore =
        mv.result.gain +
        expectimax2(mv.result.board, depth - 1, false, tt, timeLimitMs);
      if (childScore > score) score = childScore;
    }
  } else {
    const empties = emptyCells(b);
    if (empties.length === 0) return heuristic2(b);
    let sum = 0.0;
    for (const pos of empties) {
      const b2 = cloneBoard(b);
      b2[pos[0]][pos[1]] = 2;
      sum += 0.9 * expectimax2(b2, depth - 1, true, tt, timeLimitMs);

      const b4 = cloneBoard(b);
      b4[pos[0]][pos[1]] = 4;
      sum += 0.1 * expectimax2(b4, depth - 1, true, tt, timeLimitMs);
    }
    score = sum / empties.length;
  }

  tt.set(hash, depth, score);
  return score;
}

export function findBestMoveAtDepth(
  b: Board2,
  depth: number,
  timeLimitMs: number,
  tt: TTStore2
): { dir: Direction; ok: boolean } {
  const moves = orderMoves2(b);
  if (moves.length === 0) return { dir: Direction.ArrowUp, ok: false };

  let bestScore = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0].name;

  for (const move of moves) {
    if (Date.now() > timeLimitMs) return { dir: Direction.ArrowUp, ok: false };
    const score =
      move.result.gain +
      expectimax2(move.result.board, depth - 1, false, tt, timeLimitMs);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move.name;
    }
  }
  return { dir: bestMove, ok: true };
}

// -------------------- ChooseBestMove2 (main entry) --------------------

export function chooseBestMove2(
  padString: string,
  lastDir: Direction | null = null,
  depthOpt: number | null = null
): { dir: Direction; ok: boolean } {
  let b: Board2;
  try {
    b = parseBoardString(padString);
  } catch (e) {
    console.error("ChooseBestMove2: 보드 파싱 오류:", e);
    return { dir: Direction.ArrowUp, ok: false };
  }

  const boards = [b, rotate90(b), rotate180(b), rotate270(b)];
  const heuristics = boards.map((bd) => heuristic2(bd));

  let bestHeuristic = Number.NEGATIVE_INFINITY;
  let bestBoardIndex = 0;
  heuristics.forEach((h, i) => {
    if (h > bestHeuristic) {
      bestHeuristic = h;
      bestBoardIndex = i;
    }
  });

  const currentBoard = boards[bestBoardIndex];

  const legals = legalMoves2(currentBoard);
  if (legals.length === 0) {
    if (legalMoves2(b).length === 0)
      return { dir: Direction.ArrowUp, ok: false };
    return { dir: legalMoves2(b)[0].name, ok: true };
  }
  if (legals.length === 1)
    return { dir: unRotateMove(legals[0].name, bestBoardIndex), ok: true };

  const emptyCnt = emptyCells(currentBoard).length;
  let timeAllocationMs = 1100;
  if (emptyCnt >= 5) timeAllocationMs = 200;
  else if (emptyCnt === 4) timeAllocationMs = 750;
  else if (emptyCnt === 3) timeAllocationMs = 850;
  else timeAllocationMs = 1100;

  let bestMove = legals[0].name;
  const timeLimitMs = Date.now() + timeAllocationMs;
  const tt = new TTStore2();

  for (let depth = 2; depth < 12; depth += 2) {
    if (Date.now() > timeLimitMs) break;
    const { dir, ok } = findBestMoveAtDepth(
      currentBoard,
      depth,
      timeLimitMs,
      tt
    );
    if (ok) bestMove = dir;
    else break;
  }

  return { dir: unRotateMove(bestMove, bestBoardIndex), ok: true };
}
