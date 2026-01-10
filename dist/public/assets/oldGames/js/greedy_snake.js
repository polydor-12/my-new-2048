var T = Object.defineProperty;
var U = (s, e, t) =>
  e in s
    ? T(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (s[e] = t);
var r = (s, e, t) => U(s, typeof e != "symbol" ? e + "" : e, t);
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) o(i);
  new MutationObserver((i) => {
    for (const n of i)
      if (n.type === "childList")
        for (const a of n.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && o(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(i) {
    const n = {};
    return (
      i.integrity && (n.integrity = i.integrity),
      i.referrerPolicy && (n.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (n.credentials = "omit")
        : (n.credentials = "same-origin"),
      n
    );
  }
  function o(i) {
    if (i.ep) return;
    i.ep = !0;
    const n = t(i);
    fetch(i.href, n);
  }
})();
const [f, y, w, v] = [0, 1, 2, 3],
  k = console.log,
  l = (s) => document.getElementById(s),
  R = (s) => document.createElement(s),
  p = (s, e) => document.documentElement.style.setProperty(s, e),
  O =
    window.innerWidth + window.innerWidth / 4 < window.innerHeight
      ? window.innerWidth - 15
      : window.innerHeight - window.innerHeight / 4 - 30,
  _ = O + O / 3,
  q = (s, ...e) => (
    [...e].forEach((t) => {
      t && s.classList.add(t);
    }),
    s
  ),
  F = (s, e, t, ...o) => {
    var n;
    const i = R(e);
    return (
      (i.id = t),
      typeof s == "string"
        ? (n = l(s)) == null || n.appendChild(i)
        : s.appendChild(i),
      q(i, ...o)
    );
  },
  W = (s, e) => (
    (s = Math.ceil(s)),
    (e = Math.floor(e)),
    Math.floor(Math.random() * (e - s + 1)) + s
  ),
  M = (s) => Math.random() < s / 100,
  B = (s) => Array.from({ length: s }, (e, t) => t),
  K = (s, e) => {
    const t = [];
    return (
      B(e).forEach((o) => {
        B(s).forEach((i) => {
          t.push({ x: i, y: o });
        });
      }),
      t
    );
  },
  $ = (s, e = 5) => [
    ...Array.from({ length: e - ("" + s).length }, () => "0"),
    ...Array.from("" + s),
  ],
  Y = (s) => s[W(0, s.length - 1)],
  g = (s, e) => Math.sqrt((s.x - e.x) ** 2 + (s.y - e.y) ** 2),
  z = (s) => (s + 3) % 4,
  P = (s) => (s + 1) % 4,
  A = (s) => s,
  C = (s) => [A(s), z(s), P(s)],
  J = (s) => ({ s: A(s), a: z(s), d: P(s) });
class Q {
  constructor(e, t, o = "none") {
    r(this, "id", "");
    r(this, "form", 0);
    r(this, "oldDirection", f);
    r(this, "baseClass", "");
    r(this, "part", "none");
    r(this, "deg", "deg0");
    (this.x = e),
      (this.y = t),
      (this.owner = o),
      (this.id = "box" + e + "X" + t),
      (this.baseClass = "box" + ((e + t) % 2));
  }
  initBox() {
    (this.form = 0),
      (this.oldDirection = f),
      (this.owner = "none"),
      (this.part = "none"),
      (l(this.id).innerHTML = "");
  }
  boxSet(e = this.owner, t = this.part, o = this.deg) {
    (this.owner = e),
      (this.part = t),
      this.drawBox(l(this.id), this.owner, t, o);
  }
  drawBox(e, t, o, i = "deg0") {
    o != "none" &&
      (e.innerHTML = `
    <div class="pixel ${t}${o} ${i} team${t}"></div>`);
  }
  moveBox(e, t) {
    switch (((this.owner = e), this.form)) {
      case 0:
        (this.part = "head"), (this.deg = "deg" + t * 90);
        break;
      case 1:
        this.oldDirection == t
          ? ((this.part = "body"), (this.deg = "deg" + t * 90))
          : ((this.part = "curve"),
            (this.deg = "direction" + this.oldDirection + t));
        break;
      case 2:
        (this.part = "tail"), (this.deg = "deg" + this.oldDirection * 90);
        break;
      case 3:
        this.initBox();
        return;
    }
    this.form++, (this.oldDirection = t), this.boxSet();
  }
  moveBomb(e) {
    switch (((this.owner = "bomb"), this.form)) {
      case 0:
        (this.part = "head"), (this.deg = "deg" + e * 90);
        break;
      case 1:
        (this.part = "tail"), (this.deg = "deg" + e * 90);
        break;
      case 2:
        this.initBox();
        return;
    }
    this.form++, this.boxSet();
  }
}
const V = (s, e, t) => {
    let o = [],
      i = 0,
      n = 0,
      a = [],
      h = {
        head: !1,
        tail: !1,
        tailId: "",
        otherHead: "",
        lastBoxId: "",
        lastBoxIdIndex: 0,
      };
    const b = (d, S, I) => {
      const N = C(S),
        u = {};
      Object.keys(j(d, S, I)).forEach((c, E) => {
        !Z(d, c, h) &&
          !o.includes(c) &&
          (["gem", "portion"].includes(d.getOwner(c)) && a.push(c),
          (u[c] = E),
          i++);
      }),
        (o = [...o, ...Object.keys(u)]),
        Object.keys(u).forEach((c) => {
          b(d, N[u[c]], d.getXYFromBoxId(c));
        });
    };
    b(s, e, t);
    const m = () => {
        h.tail
          ? (i += g(s.getXYFromBoxId(h.tailId), t) / 10)
          : (i += g(s.getXYFromBoxId(h.lastBoxId), t) / 10);
      },
      x = () => {
        s.checkGemAndShoot() && s.moveBombNow(),
          (i -= g(s.getXYFromBoxId(a[0]), t) / 10);
      },
      X = (d) => {
        k("respawn "), (i -= g(s.getXYFromBoxId(d), t) / 10);
      };
    if (s.gameboard.snakes[s.otherSnakeName].end)
      if (s.increasement > 10)
        if (s.boxes.length < 11) {
          const d =
            s.name == "red"
              ? "box0X0"
              : "box" + (s.gameboard.size - 1) + "X" + (s.gameboard.size - 1);
          X(d);
        } else m();
      else s.increasement == 0 && i > 15 && s.boxes.length < 200 ? x() : m();
    else h.head && a.length != 0 && s.boxes.length < 300 ? x() : m();
    return (
      h.tail && (i - s.increasement > 0 ? (i += 200) : (i += 50)),
      { result: i - n, headAndTailAndTailId: h }
    );
  },
  Z = (s, e, t) => {
    const o = s.getOwner(e);
    if (o == "block" || o == "outer") return !0;
    if (o == s.name || o == s.otherSnakeName) {
      if (s.gameboard.boxes[e].part == "tail") (t.tail = !0), (t.tailId = e);
      else if (
        s.gameboard.boxes[e].part == "head" &&
        s.gameboard.boxes[e].owner == s.otherSnakeName
      )
        (t.head = !0), (t.otherHead = e);
      else {
        const i = s.getIndex(s.name, e);
        t.lastBoxIdIndex <= i && ((t.lastBoxId = e), (t.lastBoxIdIndex = i));
      }
      return !0;
    }
    return !1;
  },
  ee = (s, e, t) => {
    let o = 1;
    const i = e.getOwner(s);
    if (G.includes(i)) return -1e4;
    let { result: n, headAndTailAndTailId: a } = V(e, t, e.getXYFromBoxId(s));
    return n <= 0
      ? -1e4
      : (a.tail && n < 225 && (o = -2),
        i == "gem"
          ? (n += 50 * o)
          : i == "skull"
          ? (n -= 125)
          : i == "portion" && (n += 50 * o),
        n);
  },
  te = (s, e, t) => {
    let o = [],
      i = 0,
      n = 0,
      a = [],
      h = {
        head: !1,
        tail: !1,
        tailId: "",
        otherHead: "",
        lastBoxId: "",
        lastBoxIdIndex: 0,
      };
    const b = (d, S, I) => {
      const N = C(S),
        u = {};
      Object.keys(j(d, S, I)).forEach((c, E) => {
        !se(d, c, h) &&
          !o.includes(c) &&
          (["gem", "portion"].includes(d.getOwner(c)) && a.push(c),
          (u[c] = E),
          i++);
      }),
        (o = [...o, ...Object.keys(u)]),
        Object.keys(u).forEach((c) => {
          b(d, N[u[c]], d.getXYFromBoxId(c));
        });
    };
    b(s, e, t);
    const m = () => {
        h.tail
          ? (i += g(s.getXYFromBoxId(h.tailId), t) / 10)
          : (i += g(s.getXYFromBoxId(h.lastBoxId), t) / 10);
      },
      x = () => {
        s.checkGemAndShoot() && s.moveBombNow(),
          (i -= g(s.getXYFromBoxId(a[0]), t) / 10);
      },
      X = (d) => {
        k("respawn "), (i -= g(s.getXYFromBoxId(d), t) / 10);
      };
    if (s.gameboard.snakes[s.otherSnakeName].end)
      if (s.increasement > 10)
        if (s.boxes.length < 11) {
          const d =
            s.name == "red"
              ? "box0X0"
              : "box" + (s.gameboard.size - 1) + "X" + (s.gameboard.size - 1);
          X(d);
        } else m();
      else s.increasement == 0 && i > 15 && s.boxes.length < 200 ? x() : m();
    else h.head && a.length != 0 && s.boxes.length < 300 ? x() : m();
    return (
      h.tail && (i - s.increasement > 0 ? (i += 200) : (i += 50)),
      { result: i - n, headAndTailAndTailId: h }
    );
  },
  se = (s, e, t) => {
    const o = s.getOwner(e);
    if (o == "block" || o == "outer") return !0;
    if (o == s.name || o == s.otherSnakeName) {
      if (s.gameboard.boxes[e].part == "tail") (t.tail = !0), (t.tailId = e);
      else if (
        s.gameboard.boxes[e].part == "head" &&
        s.gameboard.boxes[e].owner == s.otherSnakeName
      )
        (t.head = !0), (t.otherHead = e);
      else {
        const i = s.getIndex(s.name, e);
        t.lastBoxIdIndex <= i && ((t.lastBoxId = e), (t.lastBoxIdIndex = i));
      }
      return !0;
    }
    return !1;
  },
  oe = (s, e, t) => {
    let o = 1;
    const i = e.getOwner(s);
    if (G.includes(i)) return -1e4;
    let { result: n, headAndTailAndTailId: a } = te(e, t, e.getXYFromBoxId(s));
    return n <= 0
      ? -1e4
      : (a.tail && n < 225 && (o = -2),
        i == "gem"
          ? (n += 50 * o)
          : i == "skull"
          ? (n -= 125)
          : i == "portion" && (n += 50 * o),
        n);
  },
  G = ["block", "blue", "red", "outer"],
  ie = (s) => {
    let e;
    s.name == "blue" ? (e = ee) : (e = oe);
    const t = J(s.direction);
    let o = -2e4,
      i = "";
    return (
      Object.keys(t).forEach((n) => {
        const a = e(s.getNextBox(t[n], s.headXY), s, t[n]);
        a > o && ((o = a), (i = n));
      }),
      s.increasement > 100 &&
      s.life > 1 &&
      s.gameboard.snakes[s.otherSnakeName].life <= 1
        ? "a"
        : i
    );
  },
  j = (s, e, t) => {
    const o = {};
    return (
      C(e).forEach((i) => {
        o[s.getNextBox(i, t)] = i;
      }),
      o
    );
  };
class H {
  constructor(e = "red", t) {
    r(this, "increasement", 0);
    r(this, "skull", 0);
    r(this, "keyCode", "");
    r(this, "life", 5);
    r(this, "score", 100);
    r(this, "speed", 3);
    r(this, "direction", f);
    r(this, "newBox", "");
    r(this, "bombOn", !1);
    r(this, "headXY", { x: 0, y: 0 });
    r(this, "end", !1);
    r(this, "maxSlowSpeed", (this.speed * 7) / 10);
    r(this, "boxes", []);
    r(this, "bombBoxes", []);
    r(this, "bombNumber", 0);
    r(this, "otherSnakeName", "");
    r(this, "getXYFromBoxId", (e) => {
      if (!e) return { x: -1, y: -1 };
      const [t, o] = e.replace("box", "").split("X");
      return { x: +t, y: +o };
    });
    r(this, "boxesForTest", (e, t = 3) => {
      const o = [],
        i = Math.floor(t / 2);
      return (
        B(t).forEach((n) =>
          B(t).forEach((a) => {
            o.push("box" + (e.x - i + a) + "X" + (e.y - i + n));
          })
        ),
        o
      );
    });
    r(
      this,
      "exitTest",
      (e, t) => (
        this.boxesForTest(e).forEach((o) => {
          if (this.getOwner(o) != "block")
            return t.includes(this.getOwner(o)), !1;
        }),
        !0
      )
    );
    r(this, "getStartPosition", () => {
      const e = ["red", "block", "blue"];
      let t = 0,
        o,
        i = { x: -1, y: -1 };
      const { leftXY: n, rightXY: a, allXY: h } = this.positionsForStart();
      this.name == "red" ? (o = [...h, ...a, ...n]) : (o = [...h, ...n, ...a]);
      for (let b of o) {
        let m = 1e4;
        if (this.exitTest(b, e)) {
          for (const x of this.boxesForTest(b, 5))
            e.includes(this.getOwner(x)) && (m -= 100);
          m >= t && ((t = m), (i = b));
        }
      }
      return this.setStartDirection(i), i;
    });
    r(this, "getOwner", (e) =>
      this.gameboard.boxes[e] == null ? "block" : this.gameboard.boxes[e].owner
    );
    r(this, "getPart", (e) =>
      this.gameboard.boxes[e] == null ? "" : this.gameboard.boxes[e].part
    );
    r(this, "getIndex", (e, t) => this.gameboard.snakes[e].boxes.indexOf(t));
    r(this, "getFrontBoxes", (e) => {
      const t = [];
      switch (e) {
        case f:
          for (let o = this.headXY.y - 1; o > 0; o--)
            t.push("box" + this.headXY.x + "X" + o);
          break;
        case w:
          for (let o = this.headXY.y + 1; o < this.gameboard.size; o++)
            t.push("box" + this.headXY.x + "X" + o);
          break;
        case v:
          for (let o = this.headXY.x - 1; o > 0; o--)
            t.push("box" + o + "X" + this.headXY.y);
          break;
        case y:
          for (let o = this.headXY.x + 1; o < this.gameboard.size; o++)
            t.push("box" + o + "X" + this.headXY.y);
          break;
      }
      return t;
    });
    r(this, "checkGemAndShoot", () => {
      if (this.bombOn || this.bombNumber <= 0) return !1;
      const e = this.getFrontBoxes(this.direction);
      for (let t = 0; t < e.length; t++) {
        const o = this.getOwner(e[t]);
        if (["gem", "portion"].includes(o) && t > 1) return !0;
        if (["red", "blue", "block", "skull"].includes(o)) return !1;
      }
      return !1;
    });
    (this.name = e),
      (this.gameboard = t),
      (this.otherSnakeName = e == "red" ? "blue" : "red"),
      this.initSnake(),
      this.lifeSet("reset"),
      this.scoreSet(0);
  }
  setStartDirection(e) {
    this.direction =
      e.x == 1 ? y : e.x == this.gameboard.size - 2 ? v : e.y == 1 ? w : f;
  }
  positionsForStart() {
    const e = { leftXY: [], rightXY: [], allXY: [] };
    return (
      B(this.gameboard.size - 6).forEach((t) => {
        e.leftXY.push({ x: 1, y: t + 3 }),
          e.rightXY.push({ x: this.gameboard.size - 2, y: t + 3 }),
          e.allXY.push({ x: t + 3, y: 1 }),
          e.allXY.push({ x: t + 3, y: this.gameboard.size - 2 });
      }),
      (e.allXY = [...e.allXY]),
      e
    );
  }
  initSnake() {
    (this.increasement = this.boxes.length > 4 ? this.boxes.length - 2 : 2),
      (this.newBox = "");
    const { x: e, y: t } = this.getStartPosition();
    e != -1 &&
      ((this.boxes = []),
      [
        { part: "head", number: 1 },
        { part: "snakebase", number: 3 },
      ].forEach((o, i) => {
        const n = this.direction == y ? -i : this.direction == v ? i : 0,
          a = this.direction == f ? i : this.direction == w ? -i : 0,
          h = "box" + (e + n) + "X" + (t + a);
        this.boxes.push(h),
          (this.gameboard.boxes[h].oldDirection = this.direction),
          (this.gameboard.boxes[h].form = o.number),
          this.gameboard.boxes[h].boxSet(
            this.name,
            o.part,
            "deg" + 90 * this.direction
          );
      }),
      this.setHeadXY());
  }
  setHeadXY() {
    this.headXY = this.getXYFromBoxId(this.boxes[0]);
  }
  changeDirection() {
    switch (this.keyCode) {
      case "a":
      case "4":
      case "ArrowLeft":
        this.direction = this.direction == f ? v : this.direction - 1;
        break;
      case "d":
      case "6":
      case "ArrowRight":
        this.direction = this.direction == v ? f : this.direction + 1;
        break;
    }
    this.keyCode = "";
  }
  getNextBox(e, t) {
    let o = "";
    switch (e) {
      case f:
        o = "box" + t.x + "X" + (t.y - 1);
        break;
      case w:
        o = "box" + t.x + "X" + (t.y + 1);
        break;
      case v:
        o = "box" + (t.x - 1) + "X" + t.y;
        break;
      case y:
        o = "box" + (t.x + 1) + "X" + t.y;
        break;
    }
    return o;
  }
  moveSnakeNow() {
    let e = 0;
    const t = () => {
      if (e++ > this.speed) {
        if (((e = 0), (this.keyCode = ie(this)), this.bombOn)) return;
        this.changeDirection(),
          (this.newBox = this.getNextBox(this.direction, this.headXY)),
          this.moveSnake() ||
            (this.boxes.forEach((o) => {
              var i;
              return (i = this.gameboard.boxes[o]) == null
                ? void 0
                : i.initBox();
            }),
            this.lifeSet("reduce") != 0
              ? this.initSnake()
              : (delete this.gameboard.moveFunctions[this.name],
                (this.end = !0),
                this.gameboard.gameEndCheck()));
      }
    };
    this.gameboard.moveFunctions[this.name] = t;
  }
  moveBombNow() {
    this.bombNumber--, this.gameboard.setBombNumber(), (this.bombOn = !0);
    const e = this.direction;
    this.bombBoxes = [];
    let t = 0;
    const o = this.speed / 5;
    let i = this.getNextBox(e, this.headXY);
    const n = () => {
      t++ > o &&
        ((t = 0),
        (i = this.getNextBox(e, this.getXYFromBoxId(i))),
        this.moveBomb(i, e) ||
          (this.bombBoxes.forEach((a) => {
            var h;
            return (h = this.gameboard.boxes[a]) == null ? void 0 : h.initBox();
          }),
          delete this.gameboard.moveFunctions[this.name + "bomb"],
          (this.bombOn = !1)));
    };
    this.gameboard.moveFunctions[this.name + "bomb"] = n;
  }
  lifeArray() {
    const e = [!1, !1, !1, !1, !1];
    return B(this.life).forEach((t) => (e[t] = !0)), e;
  }
  lifeSet(e) {
    switch (e) {
      case "reduce":
        this.life--;
        break;
      case "increase":
        this.life++;
        break;
      case "reset":
        this.life = 5;
        break;
      default:
        return this.life;
    }
    return (
      this.lifeArray().forEach((t, o) => {
        var i, n;
        t
          ? (i = l(this.name + "life" + o)) == null ||
            i.classList.add("lifeheart")
          : (n = l(this.name + "life" + o)) == null ||
            n.classList.remove("lifeheart");
      }),
      this.life
    );
  }
  scoreSet(e) {
    return (
      (this.score += e),
      $(this.score).forEach(
        (t, o) => (l(this.name + "char" + o).innerHTML = t)
      ),
      this.gameboard.bestScoreUpdate(this.score),
      this.score
    );
  }
  changeColorForSeconds(e, t = 1) {
    let o = 60 * t;
    const i = () => {
      o-- > 0 ||
        (p("--" + this.name, ""),
        delete this.gameboard.moveFunctions[this.name + "colorChange"]);
    };
    p("--" + this.name, e),
      (this.gameboard.moveFunctions[this.name + "colorChange"] = i);
  }
  checkGem(e, t) {
    if (e != "gem") return !1;
    switch (t) {
      case "yellow":
        this.scoreSet(50);
        break;
      case "pink":
        this.scoreSet(100);
        break;
    }
    return (
      (this.increasement += 4),
      this.gameboard.gemNumber--,
      (this.speed -= this.speed < this.maxSlowSpeed ? -5 : 3),
      this.changeColorForSeconds(t),
      !0
    );
  }
  checkPortion(e, t, o) {
    var i;
    if (e != "portion") return !1;
    switch (t) {
      case "orange":
        (this.increasement += 6), this.scoreSet(500);
        break;
      case "red":
        this.name == "red" &&
          !this.gameboard.isOneMode &&
          ((i = this.gameboard.snakes.blue) == null ? void 0 : i.life) > 2 &&
          this.gameboard.snakes.blue.lifeSet("reduce"),
          this.scoreSet(100);
        break;
      case "blue":
        this.name == "blue" &&
          this.gameboard.snakes.red.life > 2 &&
          this.gameboard.snakes.red.lifeSet("reduce"),
          this.scoreSet(100);
        break;
      case "green":
        this.scoreSet(300),
          (this.bombNumber = 5),
          this.gameboard.setBombNumber();
        break;
    }
    return (
      (this.increasement += 4),
      this.gameboard.portionNumber--,
      (this.speed -= this.speed < this.maxSlowSpeed ? -this.maxSlowSpeed : 3),
      this.gameboard.itemRelease(o),
      this.changeColorForSeconds(t),
      !0
    );
  }
  checkSkull(e, t) {
    return e != "skull"
      ? !1
      : ((this.skull += 3), this.gameboard.itemRelease(t), !0);
  }
  checkNewBox(e = this.newBox) {
    const t = this.getOwner(e),
      o = this.getPart(e);
    return !!(
      t == "none" ||
      this.checkGem(t, o) ||
      this.checkPortion(t, o, e) ||
      this.checkSkull(t, e)
    );
  }
  moveSnakeHead() {
    this.boxes.unshift(this.newBox),
      this.boxes
        .slice(0, 2)
        .forEach((e) =>
          this.gameboard.boxes[e].moveBox(this.name, this.direction)
        );
  }
  moveSnakeTail() {
    this.boxes
      .slice(-2)
      .forEach((t) =>
        this.gameboard.boxes[t].moveBox(this.name, this.direction)
      );
    const e = this.boxes.pop();
    this.skull > 0 &&
      (this.gameboard.boxes[e].boxSet("block", ""), this.skull--);
  }
  moveSnake() {
    return this.checkNewBox()
      ? (this.moveSnakeHead(),
        this.increasement <= 0 ? this.moveSnakeTail() : this.increasement--,
        this.gameboard.setSkull(),
        this.gameboard.setPortion(),
        this.setHeadXY(),
        this.scoreSet(-1),
        !0)
      : !1;
  }
  moveBombBoxes(e, t) {
    this.bombBoxes.unshift(e),
      this.bombBoxes.forEach((o) => this.gameboard.boxes[o].moveBomb(t)),
      (this.bombBoxes = this.bombBoxes.slice(0, 2));
  }
  moveBomb(e, t) {
    return this.checkNewBox(e) ? (this.moveBombBoxes(e, t), !0) : !1;
  }
}
class re {
  constructor(e = 12) {
    r(this, "gemNumber", 0);
    r(this, "skullNumber", 0);
    r(this, "gemList", ["yellow", "pink"]);
    r(this, "portionList", ["red", "blue", "green", "orange"]);
    r(this, "portionNumber", 0);
    r(this, "playOn", !1);
    r(this, "bestScore", 0);
    r(this, "isOneMode", !1);
    r(this, "snakes", {});
    r(this, "boxes", {});
    r(this, "gems", []);
    r(this, "portions", []);
    r(this, "keyCode", "");
    r(this, "redTeamScore", 0);
    r(this, "blueTeamScore", 0);
    r(this, "moveFunctions", {});
    r(this, "getAllBoxIdsByPart", (e) =>
      Object.keys(this.boxes).filter((t) => this.boxes[t].part == e)
    );
    r(this, "getAllBoxIdsByOwner", (e) =>
      Object.keys(this.boxes).filter((t) => this.boxes[t].owner == e)
    );
    r(this, "getBoxIdByOwner", (e = "none") => Y(this.getAllBoxIdsByOwner(e)));
    (this.size = e),
      p("--gameboard-size", this.size.toString()),
      (l("playGround").innerHTML = ""),
      this.prepareBoxes(),
      this.setEventListeners();
    const t = localStorage.getItem("greedySnakeBestScore");
    this.bestScoreUpdate(t == null ? 0 : parseInt(t)),
      this.setSnake(),
      this.loopOn();
  }
  prepareBoxes() {
    K(this.size, this.size).forEach((e) => {
      const t = new Q(e.x, e.y);
      (this.boxes[t.id] = t), F("playGround", "div", t.id, t.baseClass);
    });
  }
  setEventListeners() {
    var e, t;
    window.addEventListener("keyup", (o) => {
      (this.keyCode = o.key),
        k(this.keyCode),
        this.keyCode == "ArrowLeft" || this.keyCode == "ArrowRight"
          ? (this.snakes.red.keyCode = this.keyCode)
          : this.isOneMode || (this.snakes.blue.keyCode = this.keyCode),
        !this.playOn && this.keyCode == "Enter" && this.gameStart(),
        this.keyCode == "b" && this.snakes.red.moveBombNow();
    }),
      (e = l("leftButton")) == null ||
        e.addEventListener("touchstart", () => {
          this.snakes.red.keyCode = "ArrowLeft";
        }),
      (l("centerButton").onclick = () => {
        this.playOn || this.gameStart(), (this.playOn = !0);
      }),
      (t = l("rightButton")) == null ||
        t.addEventListener("touchstart", () => {
          this.snakes.red.keyCode = "ArrowRight";
        });
  }
  loopOn() {
    const e = () => {
      this.setGem(),
        Object.values(this.moveFunctions).forEach((t) => t()),
        requestAnimationFrame(e);
    };
    requestAnimationFrame(e);
  }
  gameStart() {
    Object.values(this.snakes).forEach((e) => e.moveSnakeNow()),
      this.teamScoreRecord(),
      (l("centerButton").style.display = "none"),
      (l("bombBoard").style.display = "flex"),
      this.setBombNumber();
  }
  setBombNumber() {
    l(
      "bombs"
    ).innerHTML = `${this.snakes.red.bombNumber} : ${this.snakes.blue.bombNumber}`;
  }
  teamScoreRecord() {
    l("teamscores").innerHTML = `${this.redTeamScore} : ${this.blueTeamScore}`;
  }
  gameEndCheck() {
    var e;
    !this.snakes.red.end ||
      !((e = this.snakes.blue) != null && e.end) ||
      (this.snakes.red.score > this.snakes.blue.score
        ? this.redTeamScore++
        : this.blueTeamScore++,
      this.teamScoreRecord(),
      k("red :", this.snakes.red.score, "blue :", this.snakes.blue.score),
      this.gameRestart());
  }
  gameRestart() {
    (this.playOn = !1),
      (this.gems = []),
      (this.portions = []),
      (this.skullNumber = 0),
      (this.portionNumber = 0),
      (this.moveFunctions = {}),
      (this.gemNumber = 0),
      Object.keys(this.boxes).forEach((e) => {
        this.boxes[e].initBox();
      }),
      this.setSnake(),
      this.gameStart();
  }
  setSnake() {
    (this.snakes = {}),
      (this.snakes.red = new H("red", this)),
      this.isOneMode || (this.snakes.blue = new H("blue", this));
  }
  bestScoreUpdate(e = 0) {
    this.bestScore >= e ||
      ((this.bestScore = e),
      localStorage.setItem("greedySnakeBestScore", "" + e),
      $(e).forEach((t, o) => {
        l("bestscorechar" + o).innerHTML = t;
      }));
  }
  setSkull() {
    if (M(99) && this.skullNumber > 4) return;
    const e = this.getBoxIdByOwner();
    this.skullNumber++,
      this.boxes[e].boxSet("skull", "", "deg0"),
      this.itemDisappearSet(e, 30);
  }
  setGem() {
    if (this.gemNumber >= (this.isOneMode ? 1 : 2)) return;
    const e = this.getBoxIdByOwner(),
      t = Y(this.gemList);
    this.boxes[e].boxSet("gem", t, "deg0"),
      this.gemNumber++,
      (this.gems = this.getAllBoxIdsByOwner("gem"));
  }
  setPortion() {
    if (M(97) || this.portionNumber >= (this.isOneMode ? 1 : 2)) return;
    const e = this.getBoxIdByOwner(),
      t = Y(this.portionList);
    this.boxes[e].boxSet("portion", t, "deg0"),
      this.portionNumber++,
      (this.portions = this.getAllBoxIdsByOwner("portion")),
      this.itemDisappearSet(e);
  }
  itemRelease(e) {
    delete this.moveFunctions[e],
      this.boxes[e].owner == "skull"
        ? this.skullNumber--
        : this.portionNumber--,
      this.boxes[e].initBox(),
      (this.portions = this.getAllBoxIdsByOwner("portion"));
  }
  itemDisappearSet(e, t = 20) {
    let o = 60 * t;
    const i = () => {
      o-- < 0 && this.itemRelease(e);
    };
    this.moveFunctions[e] = i;
  }
}
const L = R("div");
L.id = "main";
document.body.appendChild(L);
p("--main-width", "" + O + "px");
p("--main-height", "" + _ + "px");
p("--rem", O / 100 + "px");
const ne = `
  <div id="scoreBoard">
    <div class="scoreinfo">BEST SCORE</div>
    <div id="bestscore"></div>
    <div class="scoreinfo" id="teamscores"></div>
  </div>
`,
  ae = `  
  <div id="playGround_base">
    <div id="playGround">여기에 cell</div>
  </div>
  <div id="messageBoard">
    <div id="message">messageBoard</div>
  </div>  
 `,
  he = `
  <div id="controlBoard_base">
    <div id="controlBoard">
      <div class="buttonBase">
        <div class="controlButton" id="leftButton">LB</div>      
      </div>
      <div class="buttonBase">
        <div class="controlButton" id="centerButton">SB</div>
        <div id="bombBoard">
          <div>Bombs</div>
          <div id="bombs"></div>
        </div>              
      </div>
      <div class="buttonBase">
        <div class="controlButton" id="rightButton">RB</div>
      </div>    
    </div>
  </div>
`,
  D = (s) => `
  <div class="lifeIndicater">
    <div class="team" id="${s}lifeIndicater">${s.toUpperCase()}</div>
    <div class="hearts" id="${s}Hearts"></div>
    <div class="scores" id="${s}Scores"></div>
  </div>
`,
  de = `  
  <div id="headBoard">
    ${D("red")}
    ${ne} 
    ${D("blue")}
  </div>
  <div id="headMessageBoard">headMessageBoard</div>
`,
  ce = `
  <div id="main_base">
    ${de}      
    ${ae}
    ${he}    
  </div>
`;
L.innerHTML = ce;
l("bombBoard").style.display = "none";
B(5).forEach((s) => {
  ["red", "blue"].forEach((e) => {
    [
      ["Hearts", "lifeCellClass", "life"],
      ["Scores", "score", "char"],
    ].forEach((t) => {
      F(e + t[0], "div", e + t[2] + s, t[1]);
    });
  }),
    F("bestscore", "div", "bestscorechar" + s, "score");
});
p("--heart-url", "url('/app/images/redhead.png')");
new re(20);
