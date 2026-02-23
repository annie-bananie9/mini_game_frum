const nameEl = document.getElementById("name");
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const cursorEl = document.getElementById("cursor");
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");

const script = [
  { name: "SYSTEM", text: "어서 와!\n이건 포켓몬식 대사창 마이크로사이트야." },
  { name: "SYSTEM", text: "A를 누르면 다음 대사로 진행해.\nB는 한 단계 뒤로 가." },
  {
    name: "SYSTEM",
    text: "선택지도 가능해.\n무엇을 해볼래?",
    choices: [
      { label: "① 컨셉 설명 보기", goto: 3 },
      { label: "② 데모(5턴 시뮬) 보기", goto: 4 },
      { label: "③ 종료", goto: 6 }

  { name: "CONCEPT", text: "컨셉:\n'업무 상황을 게임으로 변환해 5턴 의사결정을 플레이한다'." },
  { name: "DEMO", text: "데모:\n자원/지표가 있고, 매 턴 액션을 선택하면 숫자가 변한다." },
  { name: "SYSTEM", text: "원하면 여기에 이미지/사운드도 붙일 수 있어.\n(8-bit BGM 같은 거!)" },
  { name: "SYSTEM", text: "끝!\nA를 누르면 처음으로 돌아갈게.", goto: 0 },
  [
  { "name": "SYSTEM", "text": "★ OFFICEMON WORLD ★\n신입 트레이너가 나타났다!" },
  { "name": "신입 트레이너(너)", "text": "나… 출근 3일차인데…\n이미 배틀이 시작되는 건가…?" },

  { "name": "SYSTEM", "text": "프로젝트 리더가 다가온다!" },
  { "name": "프로젝트 리더", "text": "어서 와.\n너에게 첫 퀘스트를 맡기겠다." },
  { "name": "프로젝트 리더", "text": "이번 프로젝트는…\n'기아 딜러십 CX 개선'이다." },
  { "name": "프로젝트 리더", "text": "현장마다 응대가 다르고,\n고객은 길을 잃고 있다." },

  { "name": "오피스몬(조수)", "text": "삐비빅!\n(= 지금이야! 귀여운 척!)" },

  { "name": "프로젝트 리더", "text": "신입 트레이너.\n너는 CXJ를 짜야 한다." },
  { "name": "프로젝트 리더", "text": "단, 말로만 하면 안 된다.\n직접 '고객'이 되어라." },

  { "name": "SYSTEM", "text": "⚡ 배틀 준비!\n딜러십 던전이 열렸다!" },

  { "name": "SYSTEM", "text": "RULE:\nTrust=3 / Time=3 / Clarity=3\n0이 되면 탈락!" },

  { "name": "SYSTEM", "text": "STAGE 1: 탐색의 숲\n(정보 탐색/예약)\n무엇을 할까?\n\nA) 예약 방법을 한 화면에 정리한다\nB) 딜러마다 번호를 숨겨 놓는다\nC) 문의는 '그냥 방문'으로 통일한다",
    "stage": 1, "correct": "A", "wrong": "B or C", "loss": "Clarity"
  },

  { "name": "SYSTEM", "text": "STAGE 2: 첫인상 마을\n(첫 응대/대기)\n\nA) 도착 즉시 '대기 예상시간' 안내\nB) 들어오면 일단 기다리게 한다\nC) 응대자 없으면 고객이 알아서 찾게 한다",
    "stage": 2, "correct": "A", "wrong": "B or C", "loss": "Time"
  },

  { "name": "SYSTEM", "text": "STAGE 3: 시승의 초원\n(시승/설명/니즈 파악)\n\nA) 고객 사용 시나리오 질문 후 시승 동선 설계\nB) 차 스펙을 30분 내내 읊는다\nC) 시승은 생략하고 카탈로그만 준다",
    "stage": 3, "correct": "A", "wrong": "B or C", "loss": "Trust"
  },

  { "name": "SYSTEM", "text": "STAGE 4: 견적의 동굴\n(가격/조건/신뢰)\n\nA) 옵션/프로모션을 표로 투명하게 비교\nB) '일단 계약부터'를 외친다\nC) 견적서를 사진으로 찍어 보내준다",
    "stage": 4, "correct": "A", "wrong": "B or C", "loss": "Trust"
  },

  { "name": "SYSTEM", "text": "STAGE 5: 인도식의 성\n(인도/온보딩/사후)\n\nA) 기능 설명 + 첫 달 체크인 약속\nB) 키만 주고 끝\nC) 문제 생기면 고객센터로 돌린다",
    "stage": 5, "correct": "A", "wrong": "B or C", "loss": "Trust"
  },

  { "name": "SYSTEM", "text": "🎉 CLEAR!\nCXJ 던전을 통과했다!" },
  { "name": "프로젝트 리더", "text": "좋아.\n이제 너의 CXJ를 문서로 진화시켜라." },
  { "name": "오피스몬(조수)", "text": "삐비빅!\n(= 신입이… 해냈다…!)" }
]
];

let idx = 0;
let typing = false;
let typeTimer = null;
let shown = "";

function clearTyping() {
  if (typeTimer) clearInterval(typeTimer);
  typeTimer = null;
  typing = false;
}

function renderChoices(node) {
  if (!node.choices) {
    choicesEl.hidden = true;
    choicesEl.innerHTML = "";
    return;
  }
  choicesEl.hidden = false;
  choicesEl.innerHTML = node.choices
    .map((c) => `<div class="choice"><span>▶</span><span>${c.label}</span></div>`)
    .join("");
}

function typeText(fullText, speed = 18) {
  clearTyping();
  typing = true;
  cursorEl.style.opacity = 0; // 타이핑 중엔 커서 숨김
  textEl.textContent = "";
  shown = "";

  let i = 0;
  typeTimer = setInterval(() => {
    shown += fullText[i];
    textEl.textContent = shown;
    i += 1;
    if (i >= fullText.length) {
      clearTyping();
      cursorEl.style.opacity = 1;
    }
  }, speed);
}

function show(node) {
  nameEl.textContent = node.name ?? "";
  renderChoices(node);
  typeText(node.text ?? "");
}

function next() {
  const node = script[idx];

  // 타이핑 중이면 즉시 완성
  if (typing) {
    clearTyping();
    textEl.textContent = node.text ?? "";
    cursorEl.style.opacity = 1;
    return;
  }

  // 선택지가 있으면: 기본은 첫 번째로 이동(“A=선택” 느낌)
  if (node.choices?.length) {
    idx = node.choices[0].goto;
    show(script[idx]);
    return;
  }

  // goto가 있으면 점프
  if (typeof node.goto === "number") {
    idx = node.goto;
    show(script[idx]);
    return;
  }

  // 일반 진행
  idx = Math.min(idx + 1, script.length - 1);
  show(script[idx]);
}

function back() {
  if (typing) {
    clearTyping();
    textEl.textContent = script[idx].text ?? "";
    cursorEl.style.opacity = 1;
    return;
  }
  idx = Math.max(idx - 1, 0);
  show(script[idx]);
}

btnA.addEventListener("click", next);
btnB.addEventListener("click", back);

// 키보드: Enter/Space = A, Backspace = B
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
  if (e.key === "Backspace") { e.preventDefault(); back(); }
});

// start
show(script[idx]);
