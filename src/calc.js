document.addEventListener("DOMContentLoaded", () => {
  const screen = document.getElementById("screen");
  const buttons = document.querySelectorAll("button");

  function calculate(expression) {
    try {
      return Function('"use strict";return (' + expression + ')')();
    } catch {
      return "Error";
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const value = button.value;

      if (value === "clear") {
        screen.value = "";
      } 
      else if (value === "delete") {
        screen.value = screen.value.slice(0, -1);
      } 
      else if (value === "=") {
        screen.value = calculate(screen.value);
      } 
      else {
        screen.value += value;
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      screen.value = calculate(screen.value);
    }
    if (e.key === "Backspace") {
      screen.value = screen.value.slice(0, -1);
    }
    if (e.key === "Escape") {
      screen.value = "";
    }
  });
});