import { useCallback, useRef } from "react";

const useSound = (soundEnabled: boolean = true) => {
  const audioRef = useRef<AudioContext | null>(null);

  const playChime = useCallback(
    (soft: boolean = false) => {
      if (!soundEnabled) return;
      try {
        if (!audioRef.current) audioRef.current = new window.AudioContext();
        const ctx = audioRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const notes = soft ? [659.25] : [587.33, 783.99, 987.77]; // gentle single note / dreamy chord shimmer
        notes.forEach((f, i) => {
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = f;
          const t = ctx.currentTime + i * 0.16;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(soft ? 0.05 : 0.07, t + 0.06);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t);
          o.stop(t + 1.45);
        });
      } catch (e) {}
    },
    [soundEnabled],
  );
  return {
    playChime,
  };
};

export default useSound;
