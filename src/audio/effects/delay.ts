export function createDelay(audioCtx: AudioContext) {
  const delay = audioCtx.createDelay(5.0)
  const fb = audioCtx.createGain()
  fb.gain.value = 0.3
  delay.connect(fb)
  fb.connect(delay)
  return { delay, feedback: fb }
}
