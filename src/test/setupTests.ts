const mockIntersectionObserver = class {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe() {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
};
globalThis.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;

import "@testing-library/jest-dom";