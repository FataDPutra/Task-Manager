import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Suppress ResizeObserver loop errors
// Error ini biasanya tidak berbahaya dan hanya warning dari browser
// yang terjadi ketika ResizeObserver callback menyebabkan perubahan ukuran
const isResizeObserverError = (message) => {
  if (!message) return false;
  const msg = String(message);
  return (
    msg.includes("ResizeObserver loop limit exceeded") ||
    msg.includes(
      "ResizeObserver loop completed with undelivered notifications"
    ) ||
    msg.includes("ResizeObserver") ||
    (msg.includes("loop") && msg.includes("completed")) ||
    (msg.includes("loop") && msg.includes("undelivered"))
  );
};

// Check error stack trace juga
const isResizeObserverErrorInStack = (error) => {
  if (!error) return false;
  if (error.stack) {
    const stack = String(error.stack);
    if (
      stack.includes("ResizeObserver") ||
      (stack.includes("handleError") && stack.includes("loop")) ||
      (stack.includes("handleError") && stack.includes("undelivered"))
    ) {
      return true;
    }
  }
  // Check jika error memiliki toString yang mengandung ResizeObserver
  try {
    const errorString = String(error);
    if (isResizeObserverError(errorString)) {
      return true;
    }
  } catch (e) {
    // Ignore
  }
  return false;
};

// Suppress di console.error
const originalError = console.error;
console.error = (...args) => {
  // Check semua args untuk ResizeObserver error
  for (const arg of args) {
    // Check string message
    if (isResizeObserverError(arg)) {
      return;
    }

    // Check jika error object memiliki message
    if (arg && typeof arg === "object") {
      if (arg.message && isResizeObserverError(arg.message)) {
        return;
      }
      // Check stack trace
      if (isResizeObserverErrorInStack(arg)) {
        return;
      }
      // Check toString
      try {
        const argString = String(arg);
        if (isResizeObserverError(argString)) {
          return;
        }
      } catch (e) {
        // Ignore
      }
    }
  }

  // Check jika ada string yang mengandung "handleError" dan "loop" atau "undelivered"
  const allArgsString = args.map(String).join(" ");
  if (
    allArgsString.includes("handleError") &&
    (allArgsString.includes("loop") || allArgsString.includes("undelivered"))
  ) {
    return;
  }

  originalError.call(console, ...args);
};

// Suppress di console.warn juga (beberapa browser menggunakan warn)
const originalWarn = console.warn;
console.warn = (...args) => {
  const firstArg = args[0];

  // Check string message
  if (isResizeObserverError(firstArg)) {
    return;
  }

  // Check jika error object memiliki message
  if (firstArg && typeof firstArg === "object") {
    if (firstArg.message && isResizeObserverError(firstArg.message)) {
      return;
    }
    // Check stack trace
    if (isResizeObserverErrorInStack(firstArg)) {
      return;
    }
  }

  // Check semua args untuk ResizeObserver error
  for (const arg of args) {
    if (isResizeObserverError(arg) || isResizeObserverErrorInStack(arg)) {
      return;
    }
  }

  originalWarn.call(console, ...args);
};

// Suppress ResizeObserver errors di window error handler
const originalErrorHandler = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (isResizeObserverError(message)) {
    return true; // Suppress error
  }
  if (error) {
    if (error.message && isResizeObserverError(error.message)) {
      return true;
    }
    if (isResizeObserverErrorInStack(error)) {
      return true;
    }
  }
  if (originalErrorHandler) {
    return originalErrorHandler(message, source, lineno, colno, error);
  }
  return false;
};

// Suppress ResizeObserver errors di error event listener
window.addEventListener(
  "error",
  (event) => {
    if (isResizeObserverError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    if (event.error) {
      if (
        isResizeObserverError(event.error.message) ||
        isResizeObserverErrorInStack(event.error)
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  },
  true
);

// Suppress di unhandledrejection juga
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    (isResizeObserverError(event.reason) ||
      (event.reason.message && isResizeObserverError(event.reason.message)))
  ) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
