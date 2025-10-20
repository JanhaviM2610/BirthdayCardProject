let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  isTouch = false;
  touchStartTime = 0;
  lastTouchTime = 0;

  init(paper) {
    // Mouse events
    document.addEventListener("mousemove", (e) => {
      if (this.isTouch) return; // Skip mouse events if touch is active

      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Touch events
    paper.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        this.isTouch = true;

        if (this.holdingPaper) return;
        this.holdingPaper = true;

        paper.style.zIndex = highestZ;
        highestZ += 1;

        this.touchStartTime = Date.now();
        this.mouseTouchX = e.touches[0].clientX;
        this.mouseTouchY = e.touches[0].clientY;
        this.prevMouseX = this.mouseTouchX;
        this.prevMouseY = this.mouseTouchY;
      },
      { passive: false }
    );

    paper.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        if (!this.isTouch) return;

        if (!this.rotating) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;

          this.velX = this.mouseX - this.prevMouseX;
          this.velY = this.mouseY - this.prevMouseY;
        }

        const dirX = e.touches[0].clientX - this.mouseTouchX;
        const dirY = e.touches[0].clientY - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;

        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (180 * angle) / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        if (this.rotating) {
          this.rotation = degrees;
        }

        if (this.holdingPaper) {
          if (!this.rotating) {
            this.currentPaperX += this.velX;
            this.currentPaperY += this.velY;
          }
          this.prevMouseX = this.mouseX;
          this.prevMouseY = this.mouseY;

          paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        }
      },
      { passive: false }
    );

    paper.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        this.lastTouchTime = Date.now();
        this.holdingPaper = false;
        this.rotating = false;

        // Reset touch flag after a short delay to allow mouse events
        setTimeout(() => {
          this.isTouch = false;
        }, 100);
      },
      { passive: false }
    );

    // Mouse events
    paper.addEventListener("mousedown", (e) => {
      if (this.isTouch) return; // Skip if touch is active

      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.isTouch) return;
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Long press for rotation on mobile
    let longPressTimer;
    paper.addEventListener("touchstart", (e) => {
      longPressTimer = setTimeout(() => {
        this.rotating = true;
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
    });

    paper.addEventListener("touchend", () => {
      clearTimeout(longPressTimer);
    });

    paper.addEventListener("touchmove", () => {
      clearTimeout(longPressTimer);
    });

    // Prevent context menu on long press
    paper.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Prevent default touch behaviors on the document
document.addEventListener(
  "touchstart",
  (e) => {
    if (e.target.closest(".paper")) {
      e.preventDefault();
    }
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (e) => {
    if (e.target.closest(".paper")) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Add smooth transitions for better mobile experience
document.addEventListener("DOMContentLoaded", () => {
  const papers = document.querySelectorAll(".paper");
  papers.forEach((paper) => {
    paper.style.transition = "transform 0.1s ease-out";
  });
});