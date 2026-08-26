import confetti from "canvas-confetti";

let audioCtx = null;

export const chime = () => {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [
      [880, 0, 0.35],   // A5 "bin"
      [1318.5, 0.12, 0.5], // E6 "g"
    ].forEach(([freq, offset, dur]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + dur + 0.05);
    });
  } catch {
    // audio unavailable — silent celebration
  }
};

export const celebrateAndOpen = (url, event) => {
  const origin =
    event && event.clientX != null
      ? { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }
      : { x: 0.5, y: 0.5 };

  chime();
  confetti({
    particleCount: 110,
    spread: 75,
    startVelocity: 38,
    origin,
    colors: ["#CCFF00", "#22d3ee", "#e879f9", "#ffffff"],
    scalar: 0.95,
    ticks: 170,
    zIndex: 9999,
    disableForReducedMotion: true,
  });

  // Open a placeholder tab inside the user gesture (popup-blocker safe),
  // then navigate it after the celebration lands.
  const win = window.open("about:blank", "_blank");
  setTimeout(() => {
    if (win) {
      try {
        win.opener = null;
      } catch {}
      win.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, 650);
};
