(() => {
  const currentEl = document.getElementById("current");
  const historyEl = document.getElementById("history");
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  let current = "0";
  let previous = null;
  let operator = null;
  let justEvaluated = false;

  const render = () => {
    currentEl.textContent = current;
    historyEl.textContent =
      previous !== null && operator ? `${previous} ${symbols[operator]}` : "";
  };

  const compute = (a, b, op) => {
    a = parseFloat(a);
    b = parseFloat(b);
    let r;
    switch (op) {
      case "+": r = a + b; break;
      case "-": r = a - b; break;
      case "*": r = a * b; break;
      case "/":
        if (b === 0) return "Cannot divide by 0";
        r = a / b;
        break;
      default: return String(b);
    }
    return String(parseFloat(r.toPrecision(12)));
  };

  const isError = () => isNaN(Number(current));

  const inputNumber = (n) => {
    if (isError() || justEvaluated) {
      current = "0";
      justEvaluated = false;
    }
    if (n === "." && current.includes(".")) return;
    current = current === "0" && n !== "." ? n : current + n;
    render();
  };

  const chooseOperator = (op) => {
    if (isError()) return;
    if (operator && previous !== null && !justEvaluated && current !== "") {
      current = compute(previous, current, operator);
      if (isError()) { previous = null; operator = null; render(); return; }
    }
    previous = current;
    operator = op;
    current = "0";
    justEvaluated = false;
    render();
  };

  const equals = () => {
    if (isError() || operator === null || previous === null) return;
    const expr = `${previous} ${symbols[operator]} ${current} =`;
    current = compute(previous, current, operator);
    previous = null;
    operator = null;
    justEvaluated = true;
    render();
    historyEl.textContent = expr;
  };

  const clearAll = () => {
    current = "0";
    previous = null;
    operator = null;
    justEvaluated = false;
    render();
  };

  const del = () => {
    if (isError() || justEvaluated) { clearAll(); return; }
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
    render();
  };

  const percent = () => {
    if (isError()) return;
    current = String(parseFloat((parseFloat(current) / 100).toPrecision(12)));
    render();
  };

  document.querySelector(".keys").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.num !== undefined) inputNumber(b.dataset.num);
    else if (b.dataset.op) chooseOperator(b.dataset.op);
    else if (b.dataset.action === "equals") equals();
    else if (b.dataset.action === "clear") clearAll();
    else if (b.dataset.action === "delete") del();
    else if (b.dataset.action === "percent") percent();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
    else if (e.key === ".") inputNumber(".");
    else if ("+-*/".includes(e.key)) { e.preventDefault(); chooseOperator(e.key); }
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
    else if (e.key === "Backspace") del();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "%") percent();
  });

  render();
})();