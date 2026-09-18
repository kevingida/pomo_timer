import { renderHook, act } from "@testing-library/react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const numberOr = (saved: unknown, defaults: number) =>
  typeof saved === "number" ? saved : defaults;
const stringOr = (saved: unknown, defaults: string) =>
  typeof saved === "string" ? saved : defaults;

describe("useLocalStorageState", () => {
  it("returns defaults when nothing is saved and writes nothing", () => {
    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    expect(result.current[0]).toBe(7);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("reads a saved JSON value through normalize", () => {
    localStorage.setItem("count", JSON.stringify(42));

    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    expect(result.current[0]).toBe(42);
  });

  it("falls back to defaults when the saved value fails normalize", () => {
    localStorage.setItem("count", JSON.stringify("not a number"));

    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    expect(result.current[0]).toBe(7);
  });

  it("hands a legacy raw (non-JSON) string to normalize", () => {
    localStorage.setItem("theme", "sereneForest");

    const { result } = renderHook(() =>
      useLocalStorageState("theme", "minimalBlack", stringOr),
    );

    expect(result.current[0]).toBe("sereneForest");
  });

  it("writes JSON and updates state on set", () => {
    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
    expect(localStorage.getItem("count")).toBe("10");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(8);
  });

  it("keeps hooks sharing a key in sync", () => {
    const a = renderHook(() => useLocalStorageState("count", 7, numberOr));
    const b = renderHook(() => useLocalStorageState("count", 7, numberOr));

    act(() => {
      a.result.current[1](3);
    });

    expect(b.result.current[0]).toBe(3);
  });

  it("re-reads when another tab changes the key", () => {
    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );

    act(() => {
      localStorage.setItem("count", JSON.stringify(99));
      window.dispatchEvent(new StorageEvent("storage", { key: "count" }));
    });

    expect(result.current[0]).toBe(99);
  });

  it("keeps the in-memory value when the storage write fails", () => {
    const { result } = renderHook(() =>
      useLocalStorageState("count", 7, numberOr),
    );
    (localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error("QuotaExceededError");
    });

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
  });
});
