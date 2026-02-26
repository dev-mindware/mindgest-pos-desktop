/**
 * AudioBuffer cache to prevent repeated fetching of the sound file
 */
let beepBuffer: AudioBuffer | null = null;
const audioCtx =
  typeof window !== "undefined"
    ? new (window.AudioContext || (window as any).webkitAudioContext)()
    : null;

/**
 * Preloads the scanner beep sound to ensure zero latency during operations.
 */
const preloadScannerSound = async () => {
  if (beepBuffer || !audioCtx) return;
  try {
    const response = await fetch("/sound-effects/store-scanner-beep.mp3");
    const arrayBuffer = await response.arrayBuffer();
    beepBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.warn("Failed to preload scanner sound:", error);
  }
};

// Start preloading immediately
if (typeof window !== "undefined") {
  preloadScannerSound();
}

/**
 * Plays the store scanner beep sound using the Web Audio API.
 * Uses a cached AudioBuffer for instant, jitter-free playback.
 */
export const playScannerBeep = async () => {
  try {
    if (!audioCtx) return;

    // If context is suspended (browser policy), resume it
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    // If not loaded yet, try to load it now
    if (!beepBuffer) {
      await preloadScannerSound();
    }

    if (beepBuffer) {
      const source = audioCtx.createBufferSource();
      source.buffer = beepBuffer;
      source.connect(audioCtx.destination);
      source.start(0);
    }
  } catch (error) {
    console.warn("Audio feedback failed:", error);
  }
};
