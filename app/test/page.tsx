"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Moon,
  Droplet,
  Sparkles,
  Feather,
  Music,
  Gamepad2,
  Clapperboard,
  RotateCcw,
} from "lucide-react";

// ---- softened bubble palette (the reference image, desaturated + dreamy) ----
const C = {
  skyTop: "#DCEBF9",
  skyMid: "#E4E4F7",
  skyLow: "#EFE3F4",
  ink: "#5C5570",
  inkSoft: "#918AA6",
  primary: "#B6A6DF", // soft iridescent lavender
  primaryDeep: "#9585C8",
  glass: "rgba(255,255,255,0.55)",
  line: "rgba(146,138,166,0.28)",
};
const IRIDESCENT = [
  "#F6D9E7",
  "#E1D6F4",
  "#D2EEE7",
  "#F9E6D5",
  "#D4E9F5",
  "#EBDCF3",
];

const ROUND = "ui-rounded, 'SF Pro Rounded', 'Segoe UI', system-ui, sans-serif";
const SERIF = "'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const ACTIVITIES = [
  { key: "fic", label: "Fanfiction", Icon: Feather },
  { key: "game", label: "Hogwarts Legacy", Icon: Gamepad2 },
  { key: "music", label: "Music", Icon: Music },
  { key: "watch", label: "Comfort watch", Icon: Clapperboard },
  { key: "else", label: "Something else", Icon: Sparkles },
];
const PRESETS = [30, 45, 60, 90];
const CARE_TIPS = [
  "Blink, roll your shoulders, sip some water.",
  "Unclench that jaw — you're allowed to be soft.",
  "Stretch your legs if you like. The bubble waits.",
  "Look at something far away for a moment. Then dive back in.",
];

const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function BubbleTimer() {
  const [screen, setScreen] = useState("setup"); // setup | active | done
  const [mode, setMode] = useState("flow"); // flow (count up) | timer (count down, flexible)
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [durationMin, setDurationMin] = useState(45);
  const [activity, setActivity] = useState("fic");
  const [sound, setSound] = useState(true);
  const [careOn, setCareOn] = useState(true);
  const [windOn, setWindOn] = useState(false);
  const [overlay, setOverlay] = useState(null); // null | timesup | winddown
  const [toast, setToast] = useState(null);
  const [reduce, setReduce] = useState(false);

  const shownWind = useRef(false);
  const lastCare = useRef(0);
  const audioRef = useRef(null);
  const CARE_EVERY = 35 * 60;
  const WIND_AFTER = 75 * 60;

  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (m) {
      setReduce(m.matches);
      const h = (e) => setReduce(e.matches);
      m.addEventListener?.("change", h);
      return () => m.removeEventListener?.("change", h);
    }
  }, []);

  const chime = useCallback(
    (soft) => {
      if (!sound) return;
      try {
        if (!audioRef.current)
          audioRef.current = new (
            window.AudioContext || window.webkitAudioContext
          )();
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
    [sound],
  );

  // tick
  useEffect(() => {
    if (!running || overlay) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running, overlay]);

  // reactions to elapsed
  useEffect(() => {
    if (!running) return;
    if (
      mode === "timer" &&
      elapsed >= durationMin * 60 &&
      overlay !== "timesup"
    ) {
      setRunning(false);
      setOverlay("timesup");
      chime(false);
      return;
    }
    if (windOn && !shownWind.current && elapsed >= WIND_AFTER) {
      shownWind.current = true;
      setRunning(false);
      setOverlay("winddown");
      chime(true);
      return;
    }
    if (careOn && elapsed - lastCare.current >= CARE_EVERY && elapsed > 0) {
      lastCare.current = elapsed;
      setToast(CARE_TIPS[Math.floor(Math.random() * CARE_TIPS.length)]);
      setTimeout(() => setToast(null), 11000);
    }
  }, [elapsed, running, mode, durationMin, windOn, careOn, overlay, chime]);

  const dive = () => {
    setElapsed(0);
    shownWind.current = false;
    lastCare.current = 0;
    setScreen("active");
    setRunning(true);
    chime(false);
  };
  const keepGoing = () => {
    setMode("flow");
    setOverlay(null);
    setRunning(true);
  };
  const wrapUp = () => {
    setOverlay(null);
    setRunning(false);
    setScreen("done");
    chime(true);
  };
  const snooze = () => {
    shownWind.current = true;
    setOverlay(null);
    setRunning(true);
  }; // won't re-nudge this session
  const restart = () => {
    setScreen("setup");
    setRunning(false);
    setElapsed(0);
    setOverlay(null);
    setToast(null);
  };

  const remaining = Math.max(durationMin * 60 - elapsed, 0);
  const display = mode === "timer" ? remaining : elapsed;
  const ActIcon = ACTIVITIES.find((a) => a.key === activity)?.Icon || Sparkles;
  const actLabel = ACTIVITIES.find((a) => a.key === activity)?.label || "";

  const bubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        size: 26 + Math.random() * 90,
        left: Math.random() * 100,
        dur: 16 + Math.random() * 20,
        delay: -Math.random() * 30,
        tint: IRIDESCENT[i % IRIDESCENT.length],
      })),
    [],
  );

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: ROUND,
        color: C.ink,
        background: `linear-gradient(170deg, ${C.skyTop} 0%, ${C.skyMid} 55%, ${C.skyLow} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 20px 44px",
      }}
    >
      <style>{`
        @keyframes rise { 0%{ transform: translateY(0) translateX(0); opacity:0 } 12%{opacity:.7} 88%{opacity:.7} 100%{ transform: translateY(-118vh) translateX(24px); opacity:0 } }
        @keyframes breathe { 0%,100%{ transform: scale(1) } 50%{ transform: scale(1.045) } }
        @keyframes twinkle { 0%,100%{ opacity:.3 } 50%{ opacity:1 } }
        @keyframes toastIn { from{ opacity:0; transform: translateY(6px) } to{ opacity:1; transform:none } }
        .bub{ position:absolute; bottom:-140px; border-radius:50%; filter: blur(.3px); }
        .breathe{ animation: breathe 6s ease-in-out infinite; }
        .twinkle{ animation: twinkle 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .bub{ animation:none !important; display:none } .breathe,.twinkle{ animation:none !important } }
        .chip:focus-visible,.big:focus-visible,.ghost:focus-visible,input:focus-visible{ outline:2px solid ${C.primaryDeep}; outline-offset:3px }
      `}</style>

      {/* floating bubbles */}
      {!reduce &&
        bubbles.map((b) => (
          <span
            key={b.id}
            className="bub"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              animation: `rise ${b.dur}s linear ${b.delay}s infinite`,
              background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.9) 0%, ${b.tint} 40%, rgba(255,255,255,.15) 72%, ${b.tint} 100%)`,
              boxShadow: `inset 0 0 12px rgba(255,255,255,.6), 0 0 10px ${b.tint}`,
              opacity: 0.6,
            }}
          />
        ))}

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 12.5,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: C.inkSoft,
            }}
          >
            Bubble
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 25,
              marginTop: 4,
            }}
          >
            {screen === "setup" && "time that's just for you"}
            {screen === "active" &&
              (mode === "timer" ? "no rush at all" : "lost in it — good")}
            {screen === "done" && "hope that was lovely"}
          </div>
        </header>

        {/* ---- the pearl orb ---- */}
        <div
          className={running && !overlay ? "breathe" : ""}
          style={{
            position: "relative",
            width: 250,
            height: 250,
            borderRadius: "50%",
            marginBottom: 26,
            background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.95), rgba(255,255,255,.2) 46%, transparent 60%), conic-gradient(from 210deg, ${IRIDESCENT[0]}, ${IRIDESCENT[1]}, ${IRIDESCENT[2]}, ${IRIDESCENT[3]}, ${IRIDESCENT[4]}, ${IRIDESCENT[5]}, ${IRIDESCENT[0]})`,
            boxShadow: `inset 0 0 40px rgba(255,255,255,.55), 0 8px 40px rgba(150,133,200,.28)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 26px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,.34)",
            }}
          />
          <span
            className="twinkle"
            style={{
              position: "absolute",
              top: 40,
              right: 58,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
          <span
            className="twinkle"
            style={{
              position: "absolute",
              bottom: 60,
              left: 50,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#fff",
              animationDelay: "1s",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: C.inkSoft,
              fontSize: 12.5,
              marginBottom: 6,
            }}
          >
            <ActIcon size={14} strokeWidth={2} />{" "}
            {screen !== "setup" ? actLabel : ""}
          </div>
          <div
            style={{
              position: "relative",
              fontSize: 56,
              fontWeight: 300,
              lineHeight: 1,
              color: C.ink,
            }}
          >
            {fmt(display)}
          </div>
        </div>

        {/* ---- setup ---- */}
        {screen === "setup" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="chip"
                onClick={() => setMode("flow")}
                style={modeBtn(mode === "flow")}
              >
                Free flow
              </button>
              <button
                className="chip"
                onClick={() => setMode("timer")}
                style={modeBtn(mode === "timer")}
              >
                Cozy timer
              </button>
            </div>
            <p
              style={{
                margin: "-8px 2px 0",
                fontSize: 12.5,
                fontStyle: "italic",
                fontFamily: SERIF,
                color: C.inkSoft,
              }}
            >
              {mode === "flow"
                ? "Just counts up. Drift as long as it's fun — end whenever you like."
                : "A soft container. When it's up, you can keep going anyway. Nothing snaps shut."}
            </p>

            <div>
              <label style={lbl}>What are you diving into?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ACTIVITIES.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className="chip"
                    onClick={() => setActivity(key)}
                    style={{
                      ...chip(activity === key),
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Icon size={14} strokeWidth={2} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "timer" && (
              <div>
                <label style={lbl}>For how long?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {PRESETS.map((m) => (
                    <button
                      key={m}
                      className="chip"
                      onClick={() => setDurationMin(m)}
                      style={chip(durationMin === m)}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Toggle
                on={careOn}
                onClick={() => setCareOn((v) => !v)}
                Icon={Droplet}
                label="Care nudges"
              />
              <Toggle
                on={windOn}
                onClick={() => setWindOn((v) => !v)}
                Icon={Moon}
                label="Drift toward rest"
              />
              <Toggle
                on={sound}
                onClick={() => setSound((v) => !v)}
                Icon={sound ? Volume2 : VolumeX}
                label="Chime"
              />
            </div>

            <button className="big" onClick={dive} style={bigBtn}>
              <Play size={18} strokeWidth={2.4} /> Dive in
            </button>
          </div>
        )}

        {/* ---- active ---- */}
        {screen === "active" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <button
              className="big"
              onClick={() => setRunning((r) => !r)}
              style={bigBtn}
            >
              {running ? (
                <>
                  <Pause size={18} strokeWidth={2.4} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} strokeWidth={2.4} /> Resume
                </>
              )}
            </button>
            <button className="ghost" onClick={wrapUp} style={ghostBtn}>
              That's enough for now
            </button>
          </div>
        )}

        {/* ---- done ---- */}
        {screen === "done" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontFamily: SERIF,
                fontSize: 16.5,
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              You gave yourself about {Math.max(1, Math.round(elapsed / 60))}{" "}
              minute{elapsed >= 90 ? "s" : ""} of pure you-time.
              <br />
              <span style={{ color: C.inkSoft, fontStyle: "italic" }}>
                That's not indulgent. That's fuel. Non-negotiable, remember?
              </span>
            </p>
            <button className="big" onClick={restart} style={bigBtn}>
              <RotateCcw size={17} strokeWidth={2.4} /> Again
            </button>
          </div>
        )}

        {/* care toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 26,
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 320,
              background: C.glass,
              backdropFilter: "blur(8px)",
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 13.5,
              color: C.ink,
              textAlign: "center",
              animation: "toastIn .4s ease",
              zIndex: 5,
            }}
          >
            {toast}
          </div>
        )}

        {/* overlays */}
        {overlay && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(233,227,244,.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              zIndex: 8,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 340,
                background: C.glass,
                border: `1px solid ${C.line}`,
                borderRadius: 22,
                padding: "26px 22px",
                textAlign: "center",
                boxShadow: "0 12px 44px rgba(150,133,200,.28)",
              }}
            >
              {overlay === "timesup" ? (
                <>
                  <Sparkles
                    size={26}
                    strokeWidth={1.6}
                    style={{ color: C.primaryDeep }}
                  />
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: 17,
                      margin: "10px 0 18px",
                    }}
                  >
                    Your cozy timer's up — but only if you want it to be. Still
                    having fun?
                  </p>
                  <button className="big" onClick={keepGoing} style={bigBtn}>
                    <Play size={17} strokeWidth={2.4} /> Keep drifting
                  </button>
                  <button
                    className="ghost"
                    onClick={wrapUp}
                    style={{ ...ghostBtn, marginTop: 10 }}
                  >
                    Wrap up here
                  </button>
                </>
              ) : (
                <>
                  <Moon
                    size={26}
                    strokeWidth={1.6}
                    style={{ color: C.primaryDeep }}
                  />
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: 17,
                      margin: "10px 0 6px",
                    }}
                  >
                    You've been happily lost a while now.
                  </p>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: C.inkSoft,
                      margin: "0 0 18px",
                    }}
                  >
                    No rule here — just a nudge. Maybe start easing toward rest
                    soon, so future-you sleeps easier?
                  </p>
                  <button className="big" onClick={wrapUp} style={bigBtn}>
                    <Moon size={16} strokeWidth={2.2} /> Ease toward rest
                  </button>
                  <button
                    className="ghost"
                    onClick={snooze}
                    style={{ ...ghostBtn, marginTop: 10 }}
                  >
                    A little more first
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onClick, Icon, label }) {
  return (
    <button
      className="chip"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 13px",
        borderRadius: 999,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: ROUND,
        border: `1px solid ${on ? C.primaryDeep : C.line}`,
        background: on ? "rgba(182,166,223,.28)" : "rgba(255,255,255,.4)",
        color: on ? C.primaryDeep : C.inkSoft,
        transition: "all .2s ease",
      }}
    >
      <Icon size={14} strokeWidth={2} /> {label}
    </button>
  );
}

const lbl = {
  display: "block",
  fontFamily: SERIF,
  fontSize: 13,
  color: C.ink,
  marginBottom: 8,
  fontWeight: 600,
};
const chip = (on) => ({
  padding: "10px 14px",
  borderRadius: 999,
  fontSize: 13.5,
  fontFamily: ROUND,
  cursor: "pointer",
  border: `1px solid ${on ? C.primaryDeep : C.line}`,
  background: on ? "rgba(182,166,223,.32)" : "rgba(255,255,255,.5)",
  color: on ? C.primaryDeep : C.ink,
  transition: "all .2s ease",
});
const modeBtn = (on) => ({
  ...chip(on),
  flex: 1,
  padding: "12px 0",
  fontSize: 14.5,
  fontWeight: 500,
});
const bigBtn = {
  width: "100%",
  padding: "15px 0",
  borderRadius: 16,
  border: "none",
  cursor: "pointer",
  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDeep})`,
  color: "#fff",
  fontSize: 16.5,
  fontFamily: ROUND,
  fontWeight: 500,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  boxShadow: "0 4px 16px rgba(150,133,200,.34)",
};
const ghostBtn = {
  width: "100%",
  padding: "11px 0",
  borderRadius: 13,
  cursor: "pointer",
  background: "rgba(255,255,255,.45)",
  border: `1px solid ${C.line}`,
  color: C.inkSoft,
  fontSize: 14,
  fontFamily: ROUND,
};
