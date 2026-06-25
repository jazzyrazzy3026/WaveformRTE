export default async function createBitcrusher(audioCtx: AudioContext, bits = 8, downsample = 1) {
  await audioCtx.audioWorklet.addModule(new URL('./bitcrusher-processor.js', import.meta.url).href)
  const node = new AudioWorkletNode(audioCtx, 'bitcrusher-processor', { parameterData: { bits, downsample } })
  return node
}
