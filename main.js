const script = [
  { name:"SYSTEM", text:"어서 와!\n포켓몬식 대사창 테스트야." },
  { name:"SYSTEM", text:"A를 누르면 다음으로 진행." },
  { name:"SYSTEM", text:"끝!" }
];

let i = 0;

function render(){
  document.getElementById("name").innerText = script[i].name;
  document.getElementById("text").innerText = script[i].text;
}

function next(){
  if(i < script.length - 1) i++;
  render();
}

function back(){
  if(i > 0) i--;
  render();
}

render();
