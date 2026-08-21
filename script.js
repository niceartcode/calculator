const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
const pad = document.getElementById('pad');

let current = "0";
let prev = null;
let pendingOp = null;
let justEvaluated = false;

const opMap = { "+":"+", "−":"-", "×":"*", "÷":"/" };

function formatNumber(n){
  if(!isFinite(n)) return "Error";
  let s = n.toString();
  if(s.length > 12){
    s = parseFloat(n.toPrecision(10)).toString();
  }
  return s;
}

function render(){
  resultEl.textContent = current;
  if(pendingOp && prev !== null){
    exprEl.textContent = `${prev} ${pendingOp}`;
  } else if(justEvaluated && prev !== null){
    exprEl.textContent = `${prev} ${pendingOp || ""}`;
  } else {
    exprEl.textContent = "\u00a0";
  }
}

function flicker(){
  resultEl.classList.remove('flicker');
  void resultEl.offsetWidth;
  resultEl.classList.add('flicker');
}

function inputDigit(d){
  if(justEvaluated){ current = "0"; prev = null; pendingOp = null; justEvaluated = false; }
  if(current === "0") current = d;
  else if(current.length < 14) current += d;
}

function inputDot(){
  if(justEvaluated){ current = "0"; prev = null; pendingOp = null; justEvaluated = false; }
  if(!current.includes(".")) current += ".";
}

function backspace(){
  if(justEvaluated) return;
  current = current.length > 1 ? current.slice(0,-1) : "0";
}

function clearAll(){
  current = "0"; prev = null; pendingOp = null; justEvaluated = false;
}

function percent(){
  current = formatNumber(parseFloat(current) / 100);
}

function chooseOp(op){
  if(pendingOp && !justEvaluated){
    evaluate();
  }
  prev = current;
  pendingOp = op;
  current = "0";
  justEvaluated = false;
}

function evaluate(){
  if(pendingOp === null || prev === null) return;
  const a = parseFloat(prev);
  const b = parseFloat(current);
  let r;
  switch(opMap[pendingOp]){
    case "+": r = a + b; break;
    case "-": r = a - b; break;
    case "*": r = a * b; break;
    case "/": r = b === 0 ? NaN : a / b; break;
    default: r = b;
  }
  current = formatNumber(r);
  prev = a + " " + pendingOp + " " + b;
  justEvaluated = true;
  flicker();
}

pad.addEventListener('click', (e) => {
  const btn = e.target.closest('.key');
  if(!btn) return;
  const action = btn.dataset.action;
  if(action === "digit") inputDigit(btn.dataset.val);
  else if(action === "dot") inputDot();
  else if(action === "back") backspace();
  else if(action === "clear") clearAll();
  else if(action === "percent") percent();
  else if(action === "op") chooseOp(btn.dataset.op);
  else if(action === "equals") evaluate();
  render();
});

window.addEventListener('keydown', (e) => {
  if(e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if(e.key === ".") inputDot();
  else if(e.key === "Backspace") backspace();
  else if(e.key === "Escape") clearAll();
  else if(e.key === "%") percent();
  else if(e.key === "+") chooseOp("+");
  else if(e.key === "-") chooseOp("−");
  else if(e.key === "*") chooseOp("×");
  else if(e.key === "/") chooseOp("÷");
  else if(e.key === "Enter" || e.key === "=") evaluate();
  else return;
  e.preventDefault();
  render();
});

render();
