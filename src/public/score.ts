export class Score {
  currentScore: number;
  bestScore: number;
  level: number;
  bestScoreBoard: HTMLElement = document.getElementById(
    "best-score"
  ) as HTMLElement;
  currentScoreBoard: HTMLElement = document.getElementById(
    "current-score"
  ) as HTMLElement;
  constructor() {
    this.currentScore = 0;
    this.bestScore = 0;
    this.loadBestScore();
    this.level = 0;
  }

  updateCurrentScore(): void {
    this.currentScoreBoard.innerText = this.currentScore.toString();
    this.currentScoreBoard.classList.add("score_pop");
    setTimeout(() => {
      this.currentScoreBoard.classList.remove("score_pop");
    }, 300);
    if (this.currentScore >= this.level) {
      let mainBgcolor = "#faf8ef";
      let goalNumber = "2048까지 도전하세요!";
      this.level *= 2;
      if (this.level === 0) this.level = 2048;
      switch (this.level) {
        case 4096:
          mainBgcolor = "#ffcccc";
          goalNumber = "축하! 4096에 도전하세요!";

          break;
        case 8192:
          mainBgcolor = "#ccffb3";
          goalNumber = "대단합니다! 8192도 달성!";
          break;
        case 16384:
          mainBgcolor = "#8080ff";
          goalNumber = "오호! 8192! 신의 경지!";
      }
      (document.getElementById("main") as HTMLElement).style.backgroundColor =
        mainBgcolor;
      (document.getElementById("secondRowText") as HTMLElement).innerText =
        goalNumber;
    }
  }

  updateBestScore(): void {
    this.saveBestScore();
    this.bestScoreBoard.innerText = this.bestScore.toString();
    this.bestScoreBoard.classList.add("score_pop");
    setTimeout(() => {
      this.bestScoreBoard.classList.remove("score_pop");
    }, 300);
  }

  // Methods this.bestScore와 myCells의 내용을 브라우저에 저장하는 함수와 불러오는 함수
  saveBestScore(): void {
    localStorage.setItem("bestScore", this.bestScore.toString());
  }

  loadBestScore(): number {
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore) {
      return parseInt(savedBestScore, 10);
    }
    return 0;
  }

  set(score: number): void {
    this.currentScore += score;
    this.updateCurrentScore();
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      this.updateBestScore();
    }
  }

  reset(): void {
    this.currentScore = 0;
    this.loadBestScore();
    this.updateCurrentScore();
  }
}
