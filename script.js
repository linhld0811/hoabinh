const itinerary = [
  [
    { time: "07:00-08:00", title: "Rời Hà Nội", detail: "Xuất phát · Nhà xe Quang Anh", note: "Gọi trước khi lên xe 1h" },
    { time: "11:00-12:00", title: "Đến Mai Châu Home", detail: "Gửi hành lý · Nghỉ ngơi", note: "Xác nhận nhận phòng" },
    { time: "14:30", title: "Bản Lác & Pom Coọng", detail: "Dạo bản · Đạp xe · Ngắm ruộng lúa", note: "Mang tripod" },
    { time: "19:00", title: "Ăn tối tại Mai Châu", detail: "Đồ ăn địa phương · Về nghỉ sớm", note: "Mai Châu Home" },
  ],
  [
    { time: "07:00", title: "Ăn sáng tại nhà nghỉ", detail: "Chuẩn bị nước · Kiểm tra thiết bị", note: "Mai Châu Home" },
    { time: "08:00", title: "Xuất phát đi Ba Khan", detail: "Cung đường khoảng 30 km", note: "Đi chậm, an toàn" },
    { time: "09:30", title: "Thác Gò Lào", detail: "Đi bộ · Ngắm thác · Nghỉ bên suối", note: "Giày chống trượt" },
    { time: "12:00", title: "Ăn trưa & nghỉ tại Ba Khan", detail: "Nạp pin trước buổi chiều", note: "Ưu tiên món địa phương" },
    { time: "14:00", title: "Hồ Ba Khan", detail: "Ngắm hồ · Dạo quanh · Uống cà phê", note: "Chiều thư thả" },
    { time: "17:30", title: "Về lại Mai Châu Home", detail: "Tắm nghỉ · Chuẩn bị bữa tối", note: "Kiểm tra hành lý" },
  ],
  [
    { time: "06:30", title: "Buổi sáng ở Mai Châu", detail: "Cà phê · Ngắm thung lũng thức giấc", note: "Không khí trong lành" },
    { time: "07:30", title: "Dạo bản Pom Coọng", detail: "Nhà sàn · Thổ cẩm · Cảnh đời thường", note: "Đi bộ" },
    { time: "09:30", title: "Về nhà nghỉ xếp đồ", detail: "Sạc pin · Kiểm tra checklist", note: "Mai Châu Home" },
    { time: "11:30", title: "Trả phòng & ăn trưa", detail: "Mua quà nhỏ trước khi rời bản", note: "Check-out" },
    { time: "14:00", title: "Khởi hành về Hà Nội", detail: "Theo QL6 · Dự kiến về lúc 18:00", note: "Kết thúc 3N2Đ" },
  ],
];

const timelinePanel = document.querySelector("#timelinePanel");
const dayTabs = [...document.querySelectorAll(".day-tab")];

function renderTimeline(dayIndex) {
  timelinePanel.innerHTML = itinerary[dayIndex]
    .map(
      (item) => `
        <div class="timeline-row">
          <time class="time">${item.time}</time>
          <span class="timeline-dot"><i></i></span>
          <div class="activity"><strong>${item.title}</strong><span>${item.detail}</span></div>
          <div class="activity-note"><i></i>${item.note}</div>
        </div>`,
    )
    .join("");
  timelinePanel.animate(
    [
      { opacity: 0.2, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 320, easing: "ease-out" },
  );
}

dayTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    dayTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderTimeline(Number(tab.dataset.day));
  });
});
renderTimeline(0);

const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("open");
  mobileMenu.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
});
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const siteHeader = document.querySelector("#siteHeader");
function updateHeader() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 60 && !mobileMenu.classList.contains("open"));
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll(".reveal-on-scroll");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
revealItems.forEach((item) => revealObserver.observe(item));

const checkboxes = [...document.querySelectorAll('#checklists input[type="checkbox"]')];
const progressRing = document.querySelector("#progressRing");
const progressNumber = document.querySelector("#progressNumber");
const checkedCount = document.querySelector("#checkedCount");
const storageKey = "hoabinh-trip-checklist";

function readChecklist() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function updateProgress() {
  const complete = checkboxes.filter((item) => item.checked).length;
  const percent = Math.round((complete / checkboxes.length) * 100);
  progressNumber.textContent = `${percent}%`;
  checkedCount.textContent = `${complete}/${checkboxes.length}`;
  progressRing.style.setProperty("--progress", `${percent * 3.6}deg`);
}

const savedChecklist = readChecklist();
checkboxes.forEach((checkbox) => {
  checkbox.checked = Boolean(savedChecklist[checkbox.dataset.key]);
  checkbox.addEventListener("change", () => {
    const state = Object.fromEntries(checkboxes.map((item) => [item.dataset.key, item.checked]));
    localStorage.setItem(storageKey, JSON.stringify(state));
    updateProgress();
  });
});
document.querySelector("#resetChecklist").addEventListener("click", () => {
  checkboxes.forEach((item) => { item.checked = false; });
  localStorage.removeItem(storageKey);
  updateProgress();
});
updateProgress();

const countdown = document.querySelector("#countdown");
const tripDate = new Date("2026-08-29T00:00:00+07:00");
const dayDifference = Math.max(0, Math.ceil((tripDate - new Date()) / 86400000));
countdown.textContent = String(dayDifference);

const toast = document.querySelector("#toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelector("#copyPlan").addEventListener("click", async () => {
  const planText = `HÒA BÌNH 3N2Đ · 29—31/08/2026\n2 người · Lưu trú: Mai Châu Home\n\nNgày 1: Hà Nội — đèo Thung Khe — Bản Lác — Pom Coọng\nNgày 2: Mai Châu — thác Gò Lào — hồ Ba Khan\nNgày 3: Dạo Mai Châu — trả phòng — về Hà Nội`;
  try {
    await navigator.clipboard.writeText(planText);
    showToast("Đã sao chép kế hoạch!");
  } catch {
    showToast("Không thể sao chép trên trình duyệt này.");
  }
});

document.querySelector("#printPlan").addEventListener("click", () => window.print());

// YouTube requires a user interaction before sound can start in most browsers.
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
let musicPlayer;
let musicPlayerPromise;
let musicIsPlaying = false;
let youtubeApiPromise;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube API failed to load"));
    document.head.append(script);
  });
  return youtubeApiPromise;
}

function updateMusicButton(isPlaying) {
  musicIsPlaying = isPlaying;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Tạm dừng nhạc" : "Phát nhạc cho chuyến đi");
  musicLabel.textContent = isPlaying ? "Tạm dừng" : "Bật nhạc";
}

function createMusicPlayer() {
  if (musicPlayerPromise) return musicPlayerPromise;

  musicPlayerPromise = loadYouTubeApi().then(() => new Promise((resolve) => {
    musicPlayer = new YT.Player("youtubePlayer", {
      videoId: "JgTZvDbaTtg",
      playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: "JgTZvDbaTtg", playsinline: 1 },
      events: {
        onReady: (event) => {
          event.target.playVideo();
          resolve();
        },
        onStateChange: (event) => updateMusicButton(event.data === YT.PlayerState.PLAYING),
        onAutoplayBlocked: () => {
          updateMusicButton(false);
          showToast("Trình duyệt đã chặn tự động phát. Nhấn Bật nhạc để nghe.");
        },
        onError: () => {
          updateMusicButton(false);
          showToast("Không thể phát video YouTube này.");
        },
      },
    });
  }));
  return musicPlayerPromise;
}

musicToggle.addEventListener("click", async () => {
  musicToggle.disabled = true;
  try {
    if (!musicPlayer) {
      musicLabel.textContent = "Đang tải…";
      await createMusicPlayer();
    } else if (musicIsPlaying) {
      musicPlayer.pauseVideo();
    } else {
      musicPlayer.playVideo();
    }
  } catch {
    showToast("Không thể tải nhạc. Hãy kiểm tra kết nối mạng.");
    updateMusicButton(false);
  } finally {
    musicToggle.disabled = false;
  }
});

// Attempt audible autoplay on page load. If the browser blocks it, the music
// button remains available so playback can begin after one user interaction.
musicLabel.textContent = "Đang tải…";
createMusicPlayer().catch(() => {
  updateMusicButton(false);
});
