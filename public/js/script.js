"use strict";
const WORK_PDFS = {
  book1: "./img/book1.png",
  book2: "./img/book2.png",
  cardnews: "./img/card.png",
  video: "./img/video.png"
};

// 왼쪽 빈티지 카메라에서 재생할 실제 영상
const VIDEO_FILE = "./img/video2.mp4";

const CATEGORIES = {
  book1: "동화책 1",
  book2: "동화책 2",
  cardnews: "카드뉴스",
  video: "동영상"
};
const $ = (selector) => document.querySelector(selector);
let selectedFilter = "all";

function makeNode(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderWorks() {
  const grid = $("#works-grid");
  if (!grid) return;
  grid.replaceChildren();
  for (const [category, title] of Object.entries(CATEGORIES)) {
    if (selectedFilter !== "all" && category !== selectedFilter) continue;
    const card = makeNode("article", "work-card");
    const media = makeNode("div", `work-media media-${category}`);
    const icon = makeNode("span", "pdf-document-icon");
    icon.setAttribute("aria-hidden", "true");
    media.append(icon);
    const body = makeNode("div", "work-body");
    body.append(makeNode("h3", "", title));
    const controls = makeNode("div", "work-controls");
    const open = makeNode("button", "work-card-open", "자세히 보기 ↗");
    open.type = "button";
    open.setAttribute("aria-label", `${title} PDF 보기`);
    open.addEventListener("click", () => openPdf(category));
    media.addEventListener("click", () => openPdf(category));
    controls.append(open);
    body.append(controls);
    card.append(media, body);
    grid.append(card);
  }
}


/*
  WORKS 작품 상세 보기
  PNG, JPG, WEBP 이미지는 화면에 맞게 표시
  PDF 파일은 기존 PDF 뷰어로 표시
  원본 비율 유지 및 다운로드 지원
*/

/*
  WORKS 작품 상세 보기
  ① 동화책/카드뉴스: PNG 또는 PDF 표시
  ② 동영상: video.png 위에 video2.mp4 겹치기
  ③ 기존 홈페이지 레이아웃은 변경하지 않음
*/

function openPdf(category) {
  const dialog = $("#viewer-dialog");
  const body = $("#viewer-body");
  const actions = $("#viewer-actions");

  body.replaceChildren();
  actions.replaceChildren();

  $("#viewer-category").textContent =
    `WORKS / ${CATEGORIES[category]}`;

  const filePath = WORK_PDFS[category];

  // 파일이 아직 연결되지 않은 경우
  if (!filePath) {
    body.appendChild(
      makeNode("p", "pdf-pending", "작품 원본 준비 중")
    );

  } else if (category === "video") {

    // ① 기존 포트폴리오 이미지
    const showcase = makeNode("div", "video-showcase");

    const background = makeNode("img", "video-layout-image");
    background.src = filePath;
    background.alt = "AI Video Production 포트폴리오";
    showcase.appendChild(background);

    // ② 왼쪽 카메라 화면에 실제 영상 배치
    const player = makeNode("div", "camera-player");

    const video = document.createElement("video");
    video.src = VIDEO_FILE;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-label", "AI 광고 영상");

    player.appendChild(video);

    // ③ 영상 재생 버튼
    const playButton = makeNode(
      "button",
      "camera-play-button",
      "▶"
    );

    playButton.type = "button";
    playButton.setAttribute("aria-label", "동영상 재생");

    playButton.addEventListener("click", async () => {
      try {
        await video.play();
        player.classList.add("is-playing");
      } catch (error) {
        console.error("동영상 재생 실패:", error);
      }
    });

    // 영상 클릭 시 일시정지
    video.addEventListener("click", () => {
      if (!video.paused) {
        video.pause();
      }
    });

    // 일시정지 시 재생 버튼 다시 표시
    video.addEventListener("pause", () => {
      player.classList.remove("is-playing");
    });

    // 영상 종료 시 처음으로 되돌리기
    video.addEventListener("ended", () => {
      player.classList.remove("is-playing");
      video.currentTime = 0;
    });

    player.appendChild(playButton);
    showcase.appendChild(player);
    body.appendChild(showcase);

    // 동영상 다운로드
    const download = makeNode(
      "a",
      "pdf-download",
      "동영상 다운로드"
    );

    download.href = "./img/video2.mp4";
    download.download = "video2.mp4";
    actions.appendChild(download);

  } else {

    // ④ 기존 동화책과 카드뉴스 기능 유지
    const isImage =
      /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(filePath);

    if (isImage) {
      const img = makeNode("img", "work-preview-image");
      img.src = filePath;
      img.alt = `${CATEGORIES[category]} 작품 이미지`;
      body.appendChild(img);

    } else {
      const iframe = makeNode("iframe", "pdf-viewer");
      iframe.src = filePath;
      iframe.title = `${CATEGORIES[category]} PDF 원본`;
      body.appendChild(iframe);
    }

    // 이미지 또는 PDF 다운로드
    const download = makeNode(
      "a",
      "pdf-download",
      isImage ? "이미지 다운로드" : "PDF 다운로드"
    );

    download.href = filePath;
    download.download = filePath.split("/").pop();
    actions.appendChild(download);
  }

  // 상세 보기 창 열기
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}



function closePdf() {
  const dialog = $("#viewer-dialog");
  if (dialog.open && typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  $("#viewer-body").replaceChildren();
}

function init() {
  const menu = $("#menu-btn");
  const nav = $("#main-nav");
  menu.addEventListener("click", () => {
    const expanded = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(expanded));
    menu.setAttribute("aria-label", expanded ? "메뉴 닫기" : "메뉴 열기");
    menu.textContent = expanded ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "☰";
  }));
  const topButton = $("#top-btn");
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("show", window.scrollY > 350);
  }, { passive: true });
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      renderWorks();
    });
  });
  $("#viewer-close").addEventListener("click", closePdf);
  $("#viewer-dialog").addEventListener("click", (event) => {
    if (event.target === $("#viewer-dialog")) closePdf();
  });
  $("#viewer-dialog").addEventListener("close", () => {
    $("#viewer-body").replaceChildren();
  });
  renderWorks();
}
init();
