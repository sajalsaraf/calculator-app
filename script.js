const currentOperandElement = document.querySelector('#current-operand');
const previousOperandElement = document.querySelector('#previous-operand');
const operationSymbols = { add: '+', subtract: '-', multiply: 'x', divide: '/' };

let currentOperand = '';
let previousOperand = '';
let operation = undefined;

function updateDisplay() {
  currentOperandElement.textContent = currentOperand || '0';
  previousOperandElement.textContent = operation
    ? `${previousOperand} ${operationSymbols[operation]}`
    : '';
}

function appendNumber(number) {
  if (number === '.' && currentOperand.includes('.')) return;
  if (number === '.' && currentOperand === '') currentOperand = '0';
  currentOperand += number;
  updateDisplay();
}

function chooseOperation(nextOperation) {
  if (currentOperand === '' && previousOperand === '') return;
  if (currentOperand === '' && previousOperand !== '') {
    operation = nextOperation;
    updateDisplay();
    return;
  }
  if (previousOperand !== '') calculate();
  operation = nextOperation;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();
}

function calculate() {
  const first = Number(previousOperand);
  const second = Number(currentOperand);
  if (!operation || Number.isNaN(first) || Number.isNaN(second)) return;

  let result;
  if (operation === 'add') result = first + second;
  if (operation === 'subtract') result = first - second;
  if (operation === 'multiply') result = first * second;
  if (operation === 'divide') result = second === 0 ? 'Error' : first / second;

  currentOperand = result === 'Error' ? result : String(Number(result.toFixed(10)));
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

function clearCalculator() {
  currentOperand = '';
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

function backspace() {
  currentOperand = currentOperand.slice(0, -1);
  updateDisplay();
}

function percentage() {
  if (currentOperand === '') return;
  currentOperand = String(Number(currentOperand) / 100);
  updateDisplay();
}

document.querySelectorAll('[data-number]').forEach((button) => {
  button.addEventListener('click', () => appendNumber(button.dataset.number));
});

document.querySelectorAll('[data-operation]').forEach((button) => {
  button.addEventListener('click', () => chooseOperation(button.dataset.operation));
});

document.querySelector('[data-action="equals"]').addEventListener('click', calculate);
document.querySelector('[data-action="clear"]').addEventListener('click', clearCalculator);
document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
document.querySelector('[data-action="percent"]').addEventListener('click', percentage);

document.addEventListener('keydown', (event) => {
  if (/^[0-9.]$/.test(event.key)) appendNumber(event.key);
  if (event.key === '+' || event.key === '-') chooseOperation(event.key === '+' ? 'add' : 'subtract');
  if (event.key === '*') chooseOperation('multiply');
  if (event.key === '/') { event.preventDefault(); chooseOperation('divide'); }
  if (event.key === 'Enter' || event.key === '=') calculate();
  if (event.key === 'Escape') clearCalculator();
  if (event.key === 'Backspace') backspace();
  if (event.key === '%') percentage();
});

updateDisplay();
