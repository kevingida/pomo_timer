import { useCallback, useEffect, useRef } from "react";
import { ToneOptions } from "../type";

const useSound = (soundEnabled: boolean = true, volume: number = 100) => {
  const audioRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    try {
      if (!audioRef.current) {
        const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        audioRef.current = new Ctor();
      }
      const ctx = audioRef.current;

      if (!masterGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.value = volume / 100;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
      }

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  }, [volume]);

  const playTone = useCallback(
    ({
      partials,
      attack = 0.02,
      decay = 1.0,
      type = "sine",
      stagger = 0,
    }: ToneOptions) => {
      if (!soundEnabled) return;
      const ctx = getContext();
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain) return;

      const t0 = ctx.currentTime;
      partials.forEach(({ freq, gain }, i) => {
        const t = t0 + i * stagger;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(gain, t + attack);
        g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
        o.connect(g);
        g.connect(masterGain);
        o.start(t);
        o.stop(t + attack + decay + 0.05);
      });
    },
    [soundEnabled, getContext],
  );

  const playChime = useCallback(
    (soft: boolean = false) =>
      playTone({
        partials: soft
          ? [{ freq: 659.25, gain: 0.05 }]
          : [
              { freq: 587.33, gain: 0.07 },
              { freq: 783.99, gain: 0.07 },
              { freq: 987.77, gain: 0.07 },
            ],
        attack: 0.06,
        decay: 1.4,
        stagger: 0.16,
      }),
    [playTone],
  );

  const playBell = useCallback(
    () =>
      playTone({
        partials: [
          { freq: 220, gain: 0.09 },
          { freq: 220 * 2.756, gain: 0.045 },
          { freq: 220 * 5.404, gain: 0.02 },
        ],
        attack: 0.015,
        decay: 3.2,
      }),
    [playTone],
  );

  const playTick = useCallback(
    () =>
      playTone({
        partials: [{ freq: 440, gain: 0.06 }],
        type: "triangle",
        attack: 0.001,
        decay: 0.06,
      }),
    [playTone],
  );

  const handlePlaySound = useCallback(
    (sound: "chime" | "bell" | "tick") => {
      switch (sound) {
        case "chime":
          playChime();
          break;
        case "bell":
          playBell();
          break;
        case "tick":
          playTick();
          break;
        default:
          break;
      }
    },
    [playChime, playBell, playTick],
  );

  useEffect(() => {
    return () => {
      audioRef.current?.close().catch(() => {});
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (masterGainRef.current && audioRef.current) {
      // Smooth ramp avoids an audible "click" if a sound is playing
      // while the slider is being dragged.
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume / 100,
        audioRef.current.currentTime + 0.05,
      );
    }
  }, [volume]);

  return {
    playChime,
    playBell,
    playTick,
    handlePlaySound,
  };
};

export default useSound;
