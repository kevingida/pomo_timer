import { renderHook, act } from "@testing-library/react";
import useSound from "@/features/timer/hooks/useSound";

class FakeGainParam {
  value = 0;
  setValueAtTime = jest.fn();
  linearRampToValueAtTime = jest.fn();
  exponentialRampToValueAtTime = jest.fn();
}

class FakeGain {
  gain = new FakeGainParam();
  connect = jest.fn();
}

class FakeOscillator {
  type = "sine";
  frequency = { value: 0 };
  connect = jest.fn();
  start = jest.fn();
  stop = jest.fn();
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  currentTime = 0;
  state = "running";
  destination = {};
  gains: FakeGain[] = [];
  oscillators: FakeOscillator[] = [];
  resume = jest.fn(() => Promise.resolve());
  close = jest.fn(() => Promise.resolve());

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  createGain() {
    const gain = new FakeGain();
    this.gains.push(gain);
    return gain;
  }

  createOscillator() {
    const oscillator = new FakeOscillator();
    this.oscillators.push(oscillator);
    return oscillator;
  }
}

const windowWithAudio = window as unknown as { AudioContext: unknown };
const originalAudioContext = windowWithAudio.AudioContext;
const latest = () => FakeAudioContext.instances.at(-1)!;

beforeEach(() => {
  FakeAudioContext.instances = [];
  windowWithAudio.AudioContext = FakeAudioContext;
});

afterEach(() => {
  windowWithAudio.AudioContext = originalAudioContext;
});

describe("useSound", () => {
  it.each([
    ["chime", 3],
    ["bell", 3],
    ["tick", 1],
  ] as const)("plays %s with %i oscillators", (sound, count) => {
    const { result } = renderHook(() => useSound(true, 100));

    act(() => {
      result.current.handlePlaySound(sound);
    });

    expect(latest().oscillators).toHaveLength(count);
    latest().oscillators.forEach((oscillator) => {
      expect(oscillator.start).toHaveBeenCalled();
      expect(oscillator.stop).toHaveBeenCalled();
    });
  });

  it("applies the volume to the master gain", () => {
    const { result } = renderHook(() => useSound(true, 40));

    act(() => {
      result.current.handlePlaySound("chime");
    });

    expect(latest().gains[0].gain.value).toBeCloseTo(0.4);
  });

  it("plays nothing when sound is disabled", () => {
    const { result } = renderHook(() => useSound(false, 100));

    act(() => {
      result.current.handlePlaySound("chime");
    });

    expect(FakeAudioContext.instances).toHaveLength(0);
  });

  it("ramps the master gain when the volume changes", () => {
    const { result, rerender } = renderHook(
      ({ volume }) => useSound(true, volume),
      { initialProps: { volume: 100 } },
    );

    act(() => {
      result.current.handlePlaySound("tick");
    });
    rerender({ volume: 20 });

    expect(latest().gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      0.2,
      expect.any(Number),
    );
  });

  it("closes the audio context on unmount", () => {
    const { result, unmount } = renderHook(() => useSound(true, 100));

    act(() => {
      result.current.handlePlaySound("tick");
    });
    unmount();

    expect(latest().close).toHaveBeenCalled();
  });
});
