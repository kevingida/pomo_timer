import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "@/features/settings";
import SettingsProvider from "@/features/settings/providers/SettingsProvider";
import { ThemeProvider } from "@/features/theme/providers/ThemeProvider";
import { ParticleProvider } from "@/features/theme/context/ParticleContext";
import { themes } from "@/features/theme/data";

jest.mock("@/features/timer/hooks/useSound", () => {
  const handlePlaySound = jest.fn();
  return { __esModule: true, default: () => ({ handlePlaySound }) };
});

const { handlePlaySound } = (
  jest.requireMock("@/features/timer/hooks/useSound") as {
    default: () => { handlePlaySound: jest.Mock };
  }
).default();

const renderSettings = () =>
  render(
    <SettingsProvider>
      <ThemeProvider>
        <ParticleProvider>
          <Settings toggleDropdown={() => {}} isSettingsOpen />
        </ParticleProvider>
      </ThemeProvider>
    </SettingsProvider>,
  );

const saved = () => JSON.parse(localStorage.getItem("settings")!);
const tab = (name: string) => screen.getByRole("tab", { name });

beforeEach(() => {
  handlePlaySound.mockClear();
});

describe("Settings panel", () => {
  it("commits a typed duration on blur and clamps it to the limits", () => {
    renderSettings();
    const focus = screen.getByRole("textbox", { name: "Focus" });

    fireEvent.change(focus, { target: { value: "45" } });
    fireEvent.blur(focus);
    expect(saved().focusDuration).toBe(45);

    fireEvent.change(focus, { target: { value: "999" } });
    fireEvent.blur(focus);
    expect(saved().focusDuration).toBe(120);
  });

  it("adjusts a duration slider with the keyboard", () => {
    renderSettings();
    const slider = screen.getByRole("slider", { name: "Short Break" });

    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(saved().shortBreakDuration).toBe(6);

    fireEvent.keyDown(slider, { key: "End" });
    expect(saved().shortBreakDuration).toBe(30);

    fireEvent.keyDown(slider, { key: "Home" });
    expect(saved().shortBreakDuration).toBe(1);
  });

  it("toggles auto-start switches and steps the long-break interval", () => {
    renderSettings();

    const autoFocus = screen.getByRole("switch", {
      name: "Start focus automatically",
    });
    fireEvent.click(autoFocus);
    expect(autoFocus).toHaveAttribute("aria-checked", "true");
    expect(saved().autoStartPomodoros).toBe(true);

    fireEvent.click(
      screen.getByRole("button", { name: "Increase sessions before long break" }),
    );
    expect(saved().longBreakInterval).toBe(5);
    fireEvent.click(
      screen.getByRole("button", { name: "Decrease sessions before long break" }),
    );
    expect(saved().longBreakInterval).toBe(4);
  });

  it("previews, changes and mutes sounds on the Sounds tab", () => {
    renderSettings();
    fireEvent.click(tab("Sounds"));

    fireEvent.click(
      screen.getByRole("button", { name: "Preview focus end sound" }),
    );
    expect(handlePlaySound).toHaveBeenCalledWith("chime");

    fireEvent.click(screen.getByRole("button", { name: "Focus End" }));
    fireEvent.click(screen.getByRole("option", { name: "Bell" }));
    expect(saved().focusEndSound).toBe("bell");

    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(saved()).toMatchObject({ volume: 0, soundEnabled: false });
    expect(screen.getByRole("button", { name: "Unmute" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches theme and particle effect from the Theme tab", () => {
    renderSettings();
    fireEvent.click(tab("Theme"));

    fireEvent.click(screen.getByRole("button", { name: /minimal black/i }));
    expect(localStorage.getItem("theme")).toBe(JSON.stringify("minimalBlack"));
    expect(
      document.documentElement.style.getPropertyValue("--surface-primary"),
    ).toBe(themes.minimalBlack.variables["--surface-primary"]);

    fireEvent.click(screen.getByRole("button", { name: "Stars" }));
    expect(JSON.parse(localStorage.getItem("particleSettings")!)).toMatchObject({
      type: "stars",
    });
    expect(screen.getByRole("slider", { name: "Opacity" })).toBeInTheDocument();
  });
});
