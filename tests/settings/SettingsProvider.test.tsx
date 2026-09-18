import { renderHook, act } from "@testing-library/react";
import SettingsProvider from "@/features/settings/providers/SettingsProvider";
import useSettings from "@/features/settings/hooks/useSettings";

const seed = (value: unknown) =>
  localStorage.setItem(
    "settings",
    typeof value === "string" ? value : JSON.stringify(value),
  );

const renderSettings = () =>
  renderHook(() => useSettings(), { wrapper: SettingsProvider });

describe("SettingsProvider", () => {
  it("uses production defaults when nothing is saved", () => {
    const { result } = renderSettings();

    expect(result.current.settings).toEqual({
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      soundEnabled: true,
      volume: 100,
      focusEndSound: "chime",
      breakEndSound: "chime",
    });
  });

  it("merges partial saved settings onto defaults", () => {
    seed({ focusDuration: 50 });

    const { result } = renderSettings();

    expect(result.current.settings.focusDuration).toBe(50);
    expect(result.current.settings.shortBreakDuration).toBe(5);
    expect(result.current.settings.volume).toBe(100);
  });

  it("clamps out-of-range numbers to the UI limits", () => {
    seed({
      focusDuration: 0.1,
      shortBreakDuration: 999,
      longBreakInterval: 0,
      volume: 500,
    });

    const { result } = renderSettings();

    expect(result.current.settings).toMatchObject({
      focusDuration: 5,
      shortBreakDuration: 30,
      longBreakInterval: 1,
      volume: 100,
    });
  });

  it("ignores values of the wrong type", () => {
    seed({ soundEnabled: "yes", focusEndSound: "gong", volume: "loud" });

    const { result } = renderSettings();

    expect(result.current.settings).toMatchObject({
      soundEnabled: true,
      focusEndSound: "chime",
      volume: 100,
    });
  });

  it("survives corrupt JSON", () => {
    seed("{not json");

    expect(() => renderSettings()).not.toThrow();
    expect(renderSettings().result.current.settings.focusDuration).toBe(25);
  });

  it("persists updates and exposes them to consumers", () => {
    const { result } = renderSettings();

    act(() => {
      result.current.updateSettings({ volume: 30, breakEndSound: "tick" });
    });

    expect(result.current.settings.volume).toBe(30);
    expect(JSON.parse(localStorage.getItem("settings")!)).toMatchObject({
      volume: 30,
      breakEndSound: "tick",
      focusDuration: 25,
    });
  });

  it("throws when used outside the provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useSettings())).toThrow(
      "useSettings must be used inside SettingsProvider",
    );

    spy.mockRestore();
  });
});
