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
    ]
  },
  { name: "CONCEPT", text: "컨셉:\n'업무 상황을 게임으로 변환해 5턴 의사결정을 플레이한다'." },
  { name: "DEMO", text: "데모:\n자원/지표가 있고, 매 턴 액션을 선택하면 숫자가 변한다." },
  { name: "SYSTEM", text: "원하면 여기에 이미지/사운드도 붙일 수 있어.\n(8-bit BGM 같은 거!)" },
  { name: "SYSTEM", text: "끝!\nA를 누르면 처음으로 돌아갈게.", goto: 0 },
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
