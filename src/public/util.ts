export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 사용 예시
async function runWithDelay() {
  console.log("작업 시작...");

  // 100ms 대기
  await delay(100);
  console.log("100ms 후 작업 1 완료!");

  // 추가로 200ms 대기 (총 300ms)
  await delay(200);
  console.log("추가 200ms 후 작업 2 완료!");

  console.log("모든 작업 완료.");
}

// 함수 실행
runWithDelay();
