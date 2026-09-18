import { renderHook, act } from "@testing-library/react";
import { useWallpaperControl } from "@/features/theme/hooks/useWallpaperControl";
import { useAccessibilitySettings } from "@/features/theme/hooks/useAccessibilitySettings";

const root = () => document.documentElement;

afterEach(() => {
  root().className = "";
  root().style.cssText = "";
});

describe("useWallpaperControl", () => {
  it("defaults to an enabled wallpaper at full opacity", () => {
    const { result } = renderHook(() => useWallpaperControl());

    expect(result.current.wallpaperEnabled).toBe(true);
    expect(result.current.wallpaperOpacity).toBe(100);
    expect(root().style.getPropertyValue("--wallpaper-opacity")).toBe("1");
  });

  it("persists changes and zeroes the CSS variable when disabled", () => {
    const { result } = renderHook(() => useWallpaperControl());

    act(() => result.current.setWallpaperOpacity(40));
    expect(root().style.getPropertyValue("--wallpaper-opacity")).toBe("0.4");

    act(() => result.current.setWallpaperEnabled(false));
    expect(root().style.getPropertyValue("--wallpaper-opacity")).toBe("0");
    expect(JSON.parse(localStorage.getItem("wallpaperSettings")!)).toEqual({
      enabled: false,
      opacity: 40,
    });
  });

  it("clamps saved opacity and ignores bad types", () => {
    localStorage.setItem(
      "wallpaperSettings",
      JSON.stringify({ enabled: "no", opacity: 250 }),
    );

    const { result } = renderHook(() => useWallpaperControl());

    expect(result.current.wallpaperEnabled).toBe(true);
    expect(result.current.wallpaperOpacity).toBe(100);
  });
});

describe("useAccessibilitySettings", () => {
  it("applies saved settings to the root element", () => {
    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify({ highContrast: true, reduceMotion: false, textSize: "large" }),
    );

    renderHook(() => useAccessibilitySettings());

    expect(root().classList.contains("high-contrast")).toBe(true);
    expect(root().classList.contains("reduce-motion")).toBe(false);
    expect(root().style.getPropertyValue("--base-font-size")).toBe("18px");
  });

  it("lets the system reduced-motion preference win over saved values", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: jest.fn((query: string) => ({
        matches: query.includes("reduced-motion"),
      })),
    });
    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify({ reduceMotion: false }),
    );

    const { result } = renderHook(() => useAccessibilitySettings());

    expect(result.current.reduceMotion).toBe(true);
    expect(root().classList.contains("reduce-motion")).toBe(true);

    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("updates and persists the text size", () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    act(() => result.current.setTextSize("small"));

    expect(root().style.getPropertyValue("--base-font-size")).toBe("14px");
    expect(
      JSON.parse(localStorage.getItem("accessibilitySettings")!).textSize,
    ).toBe("small");
  });
});
