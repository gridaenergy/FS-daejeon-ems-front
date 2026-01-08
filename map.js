window.addEventListener("load", updateBalloons);
window.addEventListener("resize", updateBalloons);

function updateBalloons() {
    const MAP_W = 1920;
    const MAP_H = 945;
    const map = document.querySelector(".map-container");
    const balloons = document.querySelectorAll(".balloon-wrapper");
    if (!map || !balloons.length) return;

    const cw = map.clientWidth;
    const ch = map.clientHeight;
    const scale = Math.max(cw / MAP_W, ch / MAP_H);
    const drawW = MAP_W * scale;
    const drawH = MAP_H * scale;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    balloons.forEach(balloon => {
        const relX = parseFloat(balloon.dataset.x);
        const relY = parseFloat(balloon.dataset.y);
        if (isNaN(relX) || isNaN(relY)) return;
        balloon.style.left = `${offsetX + drawW * relX}px`;
        balloon.style.top = `${offsetY + drawH * relY}px`;
    });
}

// ✅ [핵심 함수] 모든 말풍선의 우선순위를 초기화하는 함수
function resetAllZIndex() {
    document.querySelectorAll('.balloon-wrapper').forEach(wrapper => {
        wrapper.style.zIndex = "";       // 인라인 스타일 초기화
        wrapper.classList.remove('on-top'); // 클래스 초기화
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const allBalloons = document.querySelectorAll(".balloon-wrapper");

    // 1. 상세 팝업 내부 클릭 시 닫히지 않도록 전파 차단
    document.querySelectorAll('.popup-detail').forEach(popup => {
        popup.addEventListener("click", (e) => {
            e.stopPropagation(); 
        });
    });

    // 2. 말풍선 클릭 이벤트 (토글)
    allBalloons.forEach(b => {
        b.addEventListener("click", (e) => {
            
            if (e.target.closest('.popup-search-btn') || e.target.closest('.detail-close')) {
                return; 
            }

            e.stopPropagation();
            
            // 🔥 [수정] 다른 말풍선 닫으면서 z-index도 확실히 초기화
            allBalloons.forEach(other => {
                if (other !== b) {
                    other.classList.remove("is-open");
                    other.style.zIndex = ""; // 초기화 추가
                    other.classList.remove('on-top'); // 초기화 추가
                    const otherDetail = other.querySelector('.popup-detail');
                    if (otherDetail) otherDetail.style.display = 'none';
                }
            });

            const isOpen = b.classList.contains("is-open");
            const detailPopup = b.querySelector('.popup-detail');

            if (!isOpen) {
                // 열릴 때
                if (detailPopup) detailPopup.style.display = 'none';
                b.classList.add("is-open");
                // 작은 말풍선도 살짝 위로 오게 하려면 여기서 zIndex 조정 가능 (선택사항)
                b.style.zIndex = "50"; 
            } else {
                // 닫힐 때
                if (detailPopup) detailPopup.style.display = 'none';
                b.classList.remove("is-open");
                b.style.zIndex = "";
                b.classList.remove('on-top');
            }
        });
    });

    // 3. 바탕화면 클릭 시 모든 것 초기화
    document.addEventListener("click", (e) => {
        const isInsideBalloon = e.target.closest('.balloon-wrapper');
        if (!isInsideBalloon) {
            allBalloons.forEach(b => {
                b.classList.remove("is-open");
                const detailPopup = b.querySelector('.popup-detail');
                if (detailPopup) detailPopup.style.display = 'none';
                
                // 🔥 [수정] 닫을 때 z-index 깨끗하게 청소
                b.style.zIndex = "";
                b.classList.remove('on-top');
            });
        }
    });
}); 

// 4. 상세 팝업 열기 함수 (HTML onclick 연결용)
function toggleDetail(btn, event) {
    event.stopPropagation();
    
    // 🔥 [수정] 열기 전에 무조건 모든 놈들의 점수를 깎습니다 (초기화)
    resetAllZIndex();

    const wrapper = btn.closest('.balloon-wrapper');
    const detailPopup = wrapper.querySelector('.popup-detail');

    if (detailPopup) {
        detailPopup.style.display = 'block';
        // 🔥 [수정] 그리고 얘한테만 1000점을 줍니다. (이제 얘가 무조건 대장입니다)
        wrapper.style.zIndex = "1000"; 
        wrapper.classList.add('on-top');
    }
}

// 5. 상세 팝업 닫기 함수
function closeDetail(btn, event) {
    event.stopPropagation();
    const wrapper = btn.closest('.balloon-wrapper');
    const detailPopup = wrapper.querySelector('.popup-detail');

    if (detailPopup) {
        detailPopup.style.display = 'none';
        // 🔥 [수정] 닫을 때 점수 반납
        wrapper.style.zIndex = "";
        wrapper.classList.remove('on-top');
    }
}