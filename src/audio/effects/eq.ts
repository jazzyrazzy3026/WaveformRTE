export function createEQ(audioCtx: AudioContext) {
  const low = audioCtx.createBiquadFilter()
  low.type = 'lowshelf'
  low.frequency.value = 200

  const mid = audioCtx.createBiquadFilter()
  mid.type = 'peaking'
  mid.frequency.value = 1000
  mid.Q.value = 1

  const high = audioCtx.createBiquadFilter()
  high.type = 'highshelf'
  high.frequency.value = 3000

  return { low, mid, high }
}
