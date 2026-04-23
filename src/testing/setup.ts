import React from "react";
import {cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {afterEach, vi} from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("lottie-react", () => ({
  default: () => React.createElement("div", {"data-testid": "lottie-graphic"})
}));

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: query.includes("dark"),
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined
  })
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: () => undefined
});

class MockIntersectionObserver {
  disconnect() {
    return undefined;
  }

  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }
}

class MockResizeObserver {
  disconnect() {
    return undefined;
  }

  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  value: MockIntersectionObserver
});

Object.defineProperty(window, "ResizeObserver", {
  configurable: true,
  value: MockResizeObserver
});
