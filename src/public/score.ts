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
    this.loadScores();
    this.showScoreBoard();
    this.level = this.currentScore;
    this.set(0);
  }

  updateScoreBoard(score: number): void {
    if (score > 0) {
      this.currentScore += score;
      if (this.currentScore > this.level) this.level = this.currentScore;
      this.currentScoreText.innerText = this.currentScore.toString();
      this.currentScoreBoard.classList.add("score_pop");
      setTimeout(() => {
        this.currentScoreBoard.classList.remove("score_pop");
      }, 300);
      if (this.currentScore > this.bestScore) {
        this.bestScore = this.currentScore;
        this.bestScoreText.innerText = this.bestScore.toString();
        this.bestScoreBoard.classList.add("score_pop");
        setTimeout(() => {
          this.bestScoreBoard.classList.remove("score_pop");
        }, 300);
      }
    }

    this.saveScores();
    // 배경색 변경 및 레벨 텍스트 업데이트
    let mainBgcolor;
    let goalNumber;

    switch (this.level) {
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

  // Methods this.bestScore와 myCells의 내용을 브라우저에 저장하는 함수와 불러오는 함수
  saveScores(): void {
    localStorage.setItem("bestScore", this.bestScore.toString());
    localStorage.setItem("currentScore", this.currentScore.toString());
  }

  loadScores(): void {
    const savedBestScore = localStorage.getItem("bestScore");
    const savedCurrentScore = localStorage.getItem("currentScore");
    if (savedBestScore) {
      this.bestScore = parseInt(savedBestScore, 10);
    }
    if (savedCurrentScore) {
      this.currentScore = parseInt(savedCurrentScore, 10);
    }
  }

  set(score: number): void {
    this.updateScoreBoard(score);
  }

  showScoreBoard(): void {
    this.currentScoreText.innerText = this.currentScore.toString();
    this.bestScoreText.innerText = this.bestScore.toString();
  }

  resetScore(): void {
    this.loadScores();
    this.currentScore = 0;
    this.level = 0;
    this.showScoreBoard();
    this.updateScoreBoard(0);
  }
}
