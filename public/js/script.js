// =========================================
// 다시, 나 - 기능 파일
// 1일차: 파일 연결 확인용 (기능은 3일차)
// =========================================

// 브라우저 개발자도구(F12) 콘솔에 연결 확인 메시지 출력
console.log('다시, 나: script.js 연결 완료');


// =========================================
// 2. 휴대폰 메뉴 접기·펼치기 (3일차)
// =========================================

// 메뉴 버튼과 메뉴를 찾아서 변수에 저장
const menuBtn = document.querySelector('#menu-btn');
const mainNav = document.querySelector('#main-nav');

// 메뉴를 닫는 동작을 함수로 묶어 둠 (여러 곳에서 다시 사용)
function closeMenu() {
  mainNav.classList.remove('open');
  menuBtn.textContent = '☰';
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', '메뉴 열기');
}

// 메뉴 버튼을 누르면 메뉴를 열거나 닫음
menuBtn.addEventListener('click', function () {
  // open 표시를 붙였다 뗐다 함 (붙으면 true)
  const isOpen = mainNav.classList.toggle('open');
  menuBtn.textContent = isOpen ? '✕' : '☰';
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// 메뉴 항목을 누르면 메뉴를 자동으로 닫음
mainNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});


// =========================================
// 3. 맨 위로 가기 버튼 (3일차)
// =========================================
const topBtn = document.querySelector('#top-btn');

// 스크롤할 때마다 위치를 확인해 버튼을 보이거나 숨김
window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
});

// 버튼을 누르면 맨 위로 부드럽게 이동
topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================
// 4. 문의 폼 입력 확인 (3일차)
// =========================================
const contactForm = document.querySelector('#contact-form');
const formMsg = document.querySelector('#form-msg');

// 결과 문구를 보여주는 함수 (type: error 또는 success)
function showMessage(text, type) {
  formMsg.textContent = text;
  formMsg.className = type;
}

// 문의 보내기 버튼을 누르면 입력값을 검사
contactForm.addEventListener('submit', function (event) {
  event.preventDefault();  // 페이지가 새로고침되지 않도록 막음

  // 입력값 가져오기 (trim: 앞뒤 공백 제거)
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();

  // 이메일 형식 검사 규칙 (글자@글자.글자)
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === '') {
    showMessage('이름을 입력해 주세요.', 'error');
    return;
  }
  if (!emailRule.test(email)) {
    showMessage('올바른 이메일 주소를 입력해 주세요.', 'error');
    return;
  }
  if (message.length < 10) {
    showMessage('문의 내용을 10자 이상 입력해 주세요.', 'error');
    return;
  }

  // 모든 검사를 통과하면 성공 문구를 보여주고 입력칸을 비움
  // (4일차에 이 자리에서 서버로 전송하도록 바꿀 예정)
  showMessage('문의가 접수되었습니다. 감사합니다!', 'success');
  contactForm.reset();
});