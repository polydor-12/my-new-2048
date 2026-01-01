import { Board } from "./board";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBON6fZeF7ZhBfDqbF8dyryygDZuwIKK_s",
  authDomain: "my-new-2048.firebaseapp.com",
  projectId: "my-new-2048",
  storageBucket: "my-new-2048.firebasestorage.app",
  messagingSenderId: "98325527744",
  appId: "1:98325527744:web:45e48309790813cf49c125",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("main.ts loaded");

const board = new Board();

function adjustLayout() {
  const mainElement = document.getElementById("main");
  if (!mainElement) return;

  // The game's designed dimensions in rem units.
  // Width: 9rem (main) + 0.4rem*2 (main padding) = 9.8rem
  // Height: ~3.89rem (header) + 9rem (board) + 0.4rem*2 (main padding) = ~13.69rem
  const gameWidthRem = 9.8;
  const gameHeightRem = 13.7; // Rounded

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate the font size that would make the game fit the viewport width
  const fontSizeForWidth = viewportWidth / gameWidthRem;
  // Calculate the font size that would make the game fit the viewport height
  const fontSizeForHeight = viewportHeight / gameHeightRem;

  // Choose the smaller of the two to ensure the game fits in both dimensions
  const newFontSize = Math.min(fontSizeForWidth, fontSizeForHeight);

  // Apply the new font size to the root element
  document.documentElement.style.fontSize = `${newFontSize}px`;
}

// Adjust layout on initial load
adjustLayout();

// Adjust layout on window resize
window.addEventListener("resize", adjustLayout);

// Add keyboard event listener for game controls
document.addEventListener("keydown", (event) => {
  let moved = false;
  switch (event.key) {
    case "ArrowUp":
      moved = board.moveUp();
      break;
    case "ArrowDown":
      moved = board.moveDown();
      break;
    case "ArrowLeft":
      moved = board.moveLeft();
      break;
    case "ArrowRight":
      moved = board.moveRight();
      break;
  }

  if (moved) {
    board.addNumberCell();
  }
});

// Add touch and mouse drag controls
const boardElement = document.getElementById("board");
if (boardElement) {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let isDragging = false;

  const handleGesture = () => {
    const diffX = endX - startX;
    const diffY = endY - startY;
    const threshold = 50; // Minimum distance in pixels to trigger a move
    let moved = false;

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          moved = board.moveRight();
        } else {
          moved = board.moveLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          moved = board.moveDown();
        } else {
          moved = board.moveUp();
        }
      }
    }

    if (moved) {
      board.addNumberCell();
    }
  };

  // Touch events
  boardElement.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  boardElement.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleGesture();
  });

  // Mouse events
  boardElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
  });

  boardElement.addEventListener("mouseup", (e) => {
    if (isDragging) {
      isDragging = false;
      endX = e.clientX;
      endY = e.clientY;
      handleGesture();
    }
  });

  boardElement.addEventListener("mouseleave", (e) => {
    if (isDragging) {
      isDragging = false;
      endX = e.clientX;
      endY = e.clientY;
      handleGesture();
    }
  });
}
