window.addEventListener("load", updateBalloons);
window.addEventListener("resize", updateBalloons);

function updateBalloons() {
  // 1) 원본 지도 이미지 해상도 (map-bg.png의 실제 크기)
  const MAP_W = 1920;
  const MAP_H = 945;

  const map = document.querySelector(".map-container");
  const balloons = document.querySelectorAll(".balloon-wrapper");
  if (!map || !balloons.length) return;

  const cw = map.clientWidth;
  const ch = map.clientHeight;
  
  // background-size: cover 와 동일한 스케일 계산
  const scale = Math.max(cw / MAP_W, ch / MAP_H);

  const drawW = MAP_W * scale;
  const drawH = MAP_H * scale;

  const offsetX = (cw - drawW) / 2;
  const offsetY = (ch - drawH) / 2;

  // ⭐ 모든 풍선을 순회하면서, 각 풍선의 data-x / data-y 를 사용
  balloons.forEach(balloon => {
    const relX = parseFloat(balloon.dataset.x); // 0 ~ 1
    const relY = parseFloat(balloon.dataset.y);

    if (isNaN(relX) || isNaN(relY)) return;

    const screenX = offsetX + drawW * relX;
    const screenY = offsetY + drawH * relY;

    // 👉 여기서 '좌표 보정만' 수행: left/top만 건드림
    balloon.style.left = `${screenX}px`;
    balloon.style.top  = `${screenY}px`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const balloons = document.querySelectorAll(".balloon-wrapper");

  balloons.forEach(b => {
    b.addEventListener("click", (e) => {
      e.stopPropagation(); // 버블링 방지 (필요하면)
      
      // 1) 다른 풍선은 모두 닫고
      balloons.forEach(other => {
        if (other !== b) {
          other.classList.remove("is-open");
        }
      });

      // 2) 이 풍선만 토글
      b.classList.toggle("is-open");
    });
  });

  // 바깥 아무 곳 클릭하면 전부 닫기 (선택 사항)
  document.addEventListener("click", () => {
    balloons.forEach(b => b.classList.remove("is-open"));
  });
});