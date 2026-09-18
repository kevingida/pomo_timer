import { renderHook, act } from "@testing-library/react";
import { useDocumentPiP } from "@/features/timer/hooks/useDocumentPiP";

type PiPApi = { requestWindow: jest.Mock };
const win = window as unknown as { documentPictureInPicture?: PiPApi };

const createFakePiPWindow = () => {
  const doc = document.implementation.createHTMLDocument("pip");
  const target = new EventTarget();
  const fake = {
    document: doc,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    close: jest.fn(() => {
      target.dispatchEvent(new Event("pagehide"));
    }),
  };
  return fake as unknown as Window & { close: jest.Mock };
};

const installApi = (pip: Window) => {
  win.documentPictureInPicture = {
    requestWindow: jest.fn().mockResolvedValue(pip),
  };
};

afterEach(() => {
  delete win.documentPictureInPicture;
  document.head.querySelectorAll("style[data-test]").forEach((el) => el.remove());
  document.documentElement.style.cssText = "";
  document.documentElement.className = "";
});

describe("useDocumentPiP", () => {
  it("reports unsupported when the API is missing", () => {
    const { result } = renderHook(() => useDocumentPiP());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isPiPActive).toBe(false);
    expect(result.current.pipContainer).toBeNull();
  });

  it("opens a window, copies styles and theme, and mounts a container", async () => {
    const pip = createFakePiPWindow();
    installApi(pip);
    const style = document.createElement("style");
    style.setAttribute("data-test", "");
    style.textContent = ".from-main { color: red; }";
    document.head.appendChild(style);
    document.documentElement.style.setProperty("--surface-primary", "#123456");
    document.documentElement.className = "theme-x";

    const { result } = renderHook(() => useDocumentPiP());
    expect(result.current.isSupported).toBe(true);

    await act(async () => {
      result.current.togglePiP();
    });

    expect(win.documentPictureInPicture!.requestWindow).toHaveBeenCalledWith({
      width: 400,
      height: 500,
    });
    expect(result.current.isPiPActive).toBe(true);

    const container = result.current.pipContainer!;
    expect(container.ownerDocument).toBe(pip.document);
    expect(pip.document.body.contains(container)).toBe(true);
    expect(pip.document.head.innerHTML).toContain(".from-main");
    expect(
      pip.document.documentElement.style.getPropertyValue("--surface-primary"),
    ).toBe("#123456");
    expect(pip.document.documentElement.className).toBe("theme-x");
  });

  it("moves the container home and clears state when the window closes", async () => {
    const pip = createFakePiPWindow();
    installApi(pip);
    const { result } = renderHook(() => useDocumentPiP());

    await act(async () => {
      result.current.togglePiP();
    });
    const container = result.current.pipContainer!;

    act(() => {
      result.current.togglePiP();
    });

    expect(pip.close).toHaveBeenCalledTimes(1);
    expect(result.current.isPiPActive).toBe(false);
    expect(result.current.pipContainer).toBeNull();
    expect(container.ownerDocument).toBe(document);
  });

  it("logs and stays inactive when requestWindow rejects", async () => {
    win.documentPictureInPicture = {
      requestWindow: jest.fn().mockRejectedValue(new Error("NotAllowedError")),
    };
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useDocumentPiP());

    await act(async () => {
      result.current.togglePiP();
    });

    expect(result.current.isPiPActive).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
