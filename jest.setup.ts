import "@testing-library/jest-dom";

// In-memory localStorage: tests can seed with setItem and read back what code persisted,
// while the jest.fn wrappers keep mockReturnValue / toHaveBeenCalledWith working.
const store = new Map<string, string>();

const readItem = (key: string) => store.get(key) ?? null;
const writeItem = (key: string, value: string) => {
  store.set(key, String(value));
};
const deleteItem = (key: string) => {
  store.delete(key);
};
const clearItems = () => {
  store.clear();
};

const storageMock = {
  getItem: jest.fn(readItem),
  setItem: jest.fn(writeItem),
  removeItem: jest.fn(deleteItem),
  clear: jest.fn(clearItems),
};

Object.defineProperty(window, "localStorage", {
  value: storageMock,
  writable: true,
});

beforeEach(() => {
  store.clear();
  storageMock.getItem.mockReset().mockImplementation(readItem);
  storageMock.setItem.mockReset().mockImplementation(writeItem);
  storageMock.removeItem.mockReset().mockImplementation(deleteItem);
  storageMock.clear.mockReset().mockImplementation(clearItems);
});

// jsdom 26 has no <dialog> methods; mirror the open attribute and the close event
if (typeof HTMLDialogElement !== "undefined") {
  const proto = HTMLDialogElement.prototype;
  if (typeof proto.showModal !== "function") {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (typeof proto.show !== "function") {
    proto.show = function show(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (typeof proto.close !== "function") {
    proto.close = function close(this: HTMLDialogElement) {
      if (!this.hasAttribute("open")) return;
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
}

// jsdom has no ResizeObserver; dnd-kit observes droppable elements on mount
if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, "ResizeObserver", {
    value: ResizeObserverStub,
    writable: true,
  });
}
