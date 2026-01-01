export class Score {
  currentScore: number;
  bestScore: number;
  level: number;
  bestScoreText: HTMLElement = document.getElementById(
    "best-score"
  ) as HTMLElement;
  currentScoreText: HTMLElement = document.getElementById(
    "current-score"
  ) as HTMLElement;

  bestScoreBoard: HTMLDivElement = document.getElementById(
    "bestscoreBoard"
  ) as HTMLDivElement;
  currentScoreBoard: HTMLDivElement = document.getElementById(
    "scoreBoard"
  ) as HTMLDivElement;

  constructor() {
    this.currentScore = 0;
    this.bestScore = 0;
    this.loadBestScore();
    this.level = 0;
    this.set(0);
  }

  updateCurrentScore(level: number): void {
    this.currentScoreText.innerText = this.currentScore.toString();
    console.log("Current this.currentScoreBoard:", this.currentScoreBoard); // Debug log
    this.currentScoreBoard.classList.add("score_pop");
    setTimeout(() => {
      this.currentScoreBoard.classList.remove("score_pop");
    }, 300);
    let mainBgcolor = "#faf8ef";
    let goalNumber = "2048까지 도전하세요!";

    switch (level) {
      case 0:
        mainBgcolor = "#faf8ef";
        goalNumber = "2048까지 도전하세요!";
        setMainBgcolor(mainBgcolor, goalNumber);
        break;
      case 4096:
        mainBgcolor = "#ffcccc";
        goalNumber = "축하! 4096에 도전하세요!";
        setMainBgcolor(mainBgcolor, goalNumber);
        break;
      case 8192:
        mainBgcolor = "#ccffb3";
        goalNumber = "대단합니다! 8192도 달성!";
        setMainBgcolor(mainBgcolor, goalNumber);
        break;
      case 16384:
        mainBgcolor = "#8080ff";
        goalNumber = "오호! 8192! 신의 경지!";
        setMainBgcolor(mainBgcolor, goalNumber);
    }
    function setMainBgcolor(mainBgcolor: string, goalNumber: string) {
      (document.getElementById("main") as HTMLElement).style.backgroundColor =
        mainBgcolor;
      (document.getElementById("secondRowText") as HTMLElement).innerText =
        goalNumber;
    }
  }

  updateBestScore(): void {
    this.saveBestScore();
    this.bestScoreText.innerText = this.bestScore.toString();
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
    if (score >= this.level) this.level = score;
    this.updateCurrentScore(this.level);
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
      this.updateBestScore();
    }
  }

  reset(): void {
    this.currentScore = 0;
    this.loadBestScore();
    this.level = 0;
    this.updateCurrentScore(0);
  }
}
