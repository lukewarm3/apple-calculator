/*
The codes below are for the color transition animation.
*/
// Select all keys that need color transition
const transitionKeys = document.querySelectorAll(".key--operator");
// Select all keys that do not need color transition
const non_transitionKeys = document.querySelectorAll(
  ".number, .grey, .decimal, .key--equal"
);

transitionKeys.forEach((key) => {
  key.addEventListener("click", function () {
    // Remove 'active' class from all transition keys
    transitionKeys.forEach((k) => k.classList.remove("swapColor"));

    // Add 'active' class to the clicked key
    this.classList.add("swapColor");
  });
});

non_transitionKeys.forEach((key) => {
  key.addEventListener("click", function () {
    // Remove 'active' class from all transition keys except clicking C
    if (this.textContent !== "C") {
      transitionKeys.forEach((k) => k.classList.remove("swapColor"));
    }

    // if "this" is key--equal, then add swapColor class to the classList of this for some time
    if (this.classList.contains("key--equal")) {
      this.classList.add("swapColor");

      setTimeout(() => {
        this.classList.remove("swapColor");
      }, 300);
    } else {
      // the clicked key will be brightened for some time
      this.classList.add("brightened");

      setTimeout(() => {
        this.classList.remove("brightened");
      }, 300);
    }
  });
});

/*
The codes below are for the calculator functionality.
*/
const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".calculator__keys");
const display = document.querySelector(".calculator__display");

keys.addEventListener("click", (e) => {
  const previousKeyType = calculator.dataset.previousKeyType;
  // if the clicked element is a button, do something
  if (e.target.matches("button")) {
    // the clicked button is either a number or an action such as +, -, *, /, =, AC, %, +/-
    const key = e.target; // all button elements are the chidren of calculator__keys
    const action = key.dataset.action;

    const keyContent = key.textContent;
    const displayedNum = display.textContent;

    // if the clicked button is a number
    if (!action) {
      // if the displayed number is 0 or the previous key is an operator, replace it with the clicked number
      if (
        displayedNum === "0" ||
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        display.textContent = keyContent;
      }
      // if the displayed number is not 0, append the clicked number to the displayed number
      else {
        display.textContent = displayedNum + keyContent;
      }
      calculator.dataset.previousKeyType = "number";
    }

    if (action === "sign") {
      display.textContent = -displayedNum;
      calculator.dataset.previousKeyType = "sign";
    }

    if (action === "percent") {
      const firstValue = calculator.dataset.firstValue;
      const secondValue = displayedNum;

      if (!firstValue || previousKeyType === "calculate" || previousKeyType === "operator" || previousKeyType === "sign") {
        //fix the floating calculation error and trailing zeros issue
        display.textContent = parseFloat(
          (parseFloat(displayedNum) / 100).toFixed(12)
        );
      } else {
        display.textContent = parseFloat(
          ((parseFloat(firstValue) * parseFloat(secondValue)) / 100).toFixed(12)
        );
      }
      calculator.dataset.previousKeyType = "percent";
    }

    if (action == "decimal") {
      if (!displayedNum.includes(".")) {
        display.textContent = displayedNum + ".";
      } else if (
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        display.textContent = "0.";
      }
      calculator.dataset.previousKeyType = "decimal";
    }

    // if the clicked button is an action
    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {
      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayedNum;

      // if the firstValue and operator are not empty, and the previous key is an operator, replace the operator with the clicked operator
      if (
        firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "calculate"
      ) {
        display.textContent = calculate(firstValue, operator, secondValue);
      }
      calculator.dataset.previousKeyType = "operator";
      calculator.dataset.firstValue = display.textContent;
      calculator.dataset.operator = action;
    }

    if (action !== "clear") {
      const clearButton = calculator.querySelector("[data-action=clear]");
      clearButton.textContent = "C";
    }

    if (action === "clear") {
      if (key.textContent === "AC") {
        calculator.dataset.firstValue = "";
        calculator.dataset.modValue = "";
        calculator.dataset.operator = "";
        calculator.dataset.previousKeyType = "";
      } else {
        key.textContent = "AC";
      }
      display.textContent = "0";
      calculator.dataset.previousKeyType = "clear";
    }

    if (action === "calculate") {
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayedNum;

      if (firstValue) {
        if (previousKeyType === "calculate") {
          firstValue = displayedNum;
          secondValue = calculator.dataset.modValue;
        }
        display.textContent = calculate(firstValue, operator, secondValue);
      }

      calculator.dataset.modValue = secondValue;
      calculator.dataset.previousKeyType = "calculate";
    }

    adjustFontSize(document.querySelector(".calculator__display"));
  }
});

//adjust font size if the content is too long
const adjustFontSize = (display) => {
  const fontSize = parseFloat(
    window.getComputedStyle(display).getPropertyValue("font-size")
  );
  const maxWidth = parseFloat(
    window.getComputedStyle(display).getPropertyValue("max-width")
  );
  const length = display.textContent.length;
  if (length * fontSize > maxWidth + 100) {
    display.style.fontSize = (maxWidth + 100) / length + "px";
  }
  else if (length < 8){
    display.style.fontSize = "60px";
  }
};

//calculate function
const calculate = (n1, operator, n2) => { 
  let result = "";
  n1 = parseFloat(n1);
  n2 = parseFloat(n2);
  if (operator === "add") {
    result = n1 + n2;
  } else if (operator === "subtract") {
    result = n1 - n2;
  } else if (operator === "multiply") {
    result = n1 * n2;
  } else if (operator === "divide") {
    result = n1 / n2;
  }

  return result;
};
