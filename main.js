const nameEl = document.getElementById("name");
const textEl = document.getElementById("text");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");

// 안전장치: HTML id가 안 맞으면 여기서 바로 알려줌
if (!nameEl || !textEl || !btnA || !btnB || !btnC) {
  throw new Error("HTML 요소(id)가 누락됨: name/text/btnA/btnB/btnC 확인 필요");
}

// ====== GAME STATE ======
let life = 2;
let stageIndex = 0;
let mode = "intro"; // intro | stage | result | gameover | clear
let introIndex = 0;

// ====== SCRIPT ======
const intro = [
  { name: "SYSTEM", text: "★ OFFICEMON WORLD ★\n신입 트레이너가 나타났다!" },
  { name: "신입 트레이너(너)", text: "출근 3일차인데…\n벌써 배틀이야…?" },
  { name: "SYSTEM", text: "프로젝트 리더가 다가온다!" },
  { name: "프로젝트 리더", text: "어서 와.\n너에게 첫 퀘스트를 맡기겠다." },
  { name: "프로젝트 리더", text: "이번 프로젝트는…\n'기아 딜러십 CX 개선'이다." },
  { name: "프로젝트 리더", text: "현장마다 응대가 다르고,\n고객은 길을 잃고 있다." },
  { name: "오피스몬(조수)", text: "삐비빅!\n(= 신입! 살아남아라!)" },
  { name: "프로젝트 리더", text: "신입 트레이너.\n너는 CXJ를 짜야 한다." },
  { name: "프로젝트 리더", text: "말로만 하면 안 된다.\n직접 '고객'이 되어라." },
  { name: "SYSTEM", text: "⚡ 배틀 준비!\n딜러십 던전이 열렸다!" },
  { name: "SYSTEM", text: "RULE: LIFE=2\n틀리면 LIFE -1\nLIFE=0이면 탈락!" },
  { name: "SYSTEM", text: "자… 시작한다!\n(A/B/C로 선택!)" }
];

const stages = [
  {
    title: "STAGE 1: 탐색의 숲 (정보 탐색/예약)",
    prompt: "무엇을 할까?",
    choices: {
      A: "예약 방법을 한 화면에 정리한다",
      B: "딜러마다 번호를 숨겨 놓는다",
      C: "문의는 '그냥 방문'으로 통일한다"
    },
    correct: "A",
    wrongText: "고객: '어… 어디로 예약하죠…?'\n(길을 잃었다!)"
  },
  {
    title: "STAGE 2: 첫인상 마을 (첫 응대/대기)",
    prompt: "입장! 첫 응대가 중요하다!",
    choices: {
      A: "도착 즉시 '대기 예상시간' 안내",
      B: "들어오면 일단 기다리게 한다",
      C: "응대자 없으면 고객이 알아서 찾게 한다"
    },
    correct: "A",
    wrongText: "고객: '저… 몇 분이요…?'\n(시간이 녹는다!)"
  },
  {
    title: "STAGE 3: 시승의 초원 (시승/니즈 파악)",
    prompt: "고객은 '나한테 맞는지'가 궁금하다!",
    choices: {
      A: "사용 시나리오 질문 후 시승 동선 설계",
      B: "스펙을 30분 내내 읊는다",
      C: "시승은 생략하고 카탈로그만 준다"
    },
    correct: "A",
    wrongText: "고객: '제 얘기는 안 듣고…'\n(신뢰가 흔들린다!)"
  },
  {
    title: "STAGE 4: 견적의 동굴 (가격/조건/신뢰)",
    prompt: "여기서 신뢰가 무너지면 끝이다!",
    choices: {
      A: "옵션/프로모션을 표로 투명하게 비교",
      B: "'일단 계약부터'를 외친다",
      C: "견적서를 사진으로 찍어 보내준다"
    },
    correct: "A",
    wrongText: "고객: '뭔가 숨기는 느낌인데…'\n(의심 발생!)"
  },
  {
    title: "STAGE 5: 인도식의 성 (인도/온보딩/사후)",
    prompt: "마지막! 인도가 곧 팬덤의 시작!",
    choices: {
      A: "기능 설명 + 첫 달 체크인 약속",
      B: "키만 주고 끝",
      C: "문제 생기면 고객센터로 돌린다"
    },
    correct: "A",
    wrongText: "고객: '그럼… 저는 어디로…?'\n(방치당했다!)"
  }
];

// ====== UI ======
function headerLine() {
  const hearts = "❤️".repeat(life) + "🖤".repeat(2 - life);
  return `LIFE: ${hearts}\n\n`;
}

function showIntro() {
  const node = intro[introIndex];
  nameEl.innerText = node.name;
  textEl.innerText = headerLine() + node.text + "\n\n(A/B/C 아무거나 눌러 진행)";
}

function showStage() {
  const s = stages[stageIndex];
  nameEl.innerText = "SYSTEM";
  textEl.innerText =
    headerLine() +
    `${s.title}\n${s.prompt}\n\n` +
    `A) ${s.choices.A}\n` +
    `B) ${s.choices.B}\n` +
    `C) ${s.choices.C}\n\n` +
    "(A/B/C 중 하나를 선택!)";
}

function showResult(isCorrect, picked) {
  const s = stages[stageIndex];
  nameEl.innerText = "SYSTEM";
  if (isCorrect) {
    textEl.innerText =
      headerLine() +
      `정답! (${picked})\n경험치 +1!\n\n(아무 키나 눌러 다음 스테이지로)`;
  } else {
    textEl.innerText =
      headerLine() +
      `오답… (${picked})\n${s.wrongText}\n\n(아무 키나 눌러 계속…)`;
  }
}

function showGameOver() {
  nameEl.innerText = "SYSTEM";
  textEl.innerText =
    "💥 GAME OVER 💥\n" +
    "신입 트레이너는…\n" +
    "딜러십 던전에서 탈락했다…\n\n" +
    "A/B/C 아무거나 눌러 재시작";
}

function showClear() {
  nameEl.innerText = "SYSTEM";
  textEl.innerText =
    "🎉 CLEAR! 🎉\n" +
    "CXJ 던전을 통과했다!\n\n" +
    "프로젝트 리더: \"좋아. 이제 CXJ를 문서로 진화시켜라.\"\n\n" +
    "A/B/C 아무거나 눌러 다시 시작";
}

// ====== GAME LOOP ======
function handlePress(choice) {
  if (mode === "intro") {
    introIndex++;
    if (introIndex >= intro.length) {
      mode = "stage";
      showStage();
    } else {
      showIntro();
    }
    return;
  }

  if (mode === "stage") {
    const s = stages[stageIndex];
    const picked = choice;
    const isCorrect = picked === s.correct;

    if (!isCorrect) life -= 1;

    if (life <= 0) {
      mode = "gameover";
      showGameOver();
      return;
    }

    mode = "result";
    showResult(isCorrect, picked);
    return;
  }

  if (mode === "result") {
    stageIndex++;
    if (stageIndex >= stages.length) {
      mode = "clear";
      showClear();
    } else {
      mode = "stage";
      showStage();
    }
    return;
  }

  if (mode === "gameover" || mode === "clear") {
    // reset
    life = 2;
    stageIndex = 0;
    introIndex = 0;
    mode = "intro";
    showIntro();
  }
}

// 버튼
btnA.addEventListener("click", () => handlePress("A"));
btnB.addEventListener("click", () => handlePress("B"));
btnC.addEventListener("click", () => handlePress("C"));

// 키보드
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === "a") handlePress("A");
  if (k === "b") handlePress("B");
  if (k === "c") handlePress("C");
  if ((e.key === "Enter" || e.key === " ") && mode !== "stage") {
    handlePress("A");
  }
});

// start
showIntro();
