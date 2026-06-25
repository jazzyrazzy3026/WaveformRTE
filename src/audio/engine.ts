export default class AudioEngine {
  audioCtx: AudioContext | null = null
  master: GainNode | null = null
  osc: OscillatorNode | null = null
  bitcrusherNode: AudioWorkletNode | null = null
  delayNode: DelayNode | null = null
  delayFeedback: GainNode | null = null
  eqLow: BiquadFilterNode | null = null
  eqMid: BiquadFilterNode | null = null
  eqHigh: BiquadFilterNode | null = null

  async init() {
    if (this.audioCtx) return
    this.audioCtx = new AudioContext()

    // master gain
    this.master = this.audioCtx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(this.audioCtx.destination)

    // simple oscillator source
    this.osc = this.audioCtx.createOscillator()
    this.osc.type = 'sawtooth'
    this.osc.frequency.value = 220

    // EQ
    this.eqLow = this.audioCtx.createBiquadFilter()
    this.eqLow.type = 'lowshelf'
    this.eqLow.frequency.value = 200

    this.eqMid = this.audioCtx.createBiquadFilter()
    this.eqMid.type = 'peaking'
    this.eqMid.frequency.value = 1000
    this.eqMid.Q.value = 1

    this.eqHigh = this.audioCtx.createBiquadFilter()
    this.eqHigh.type = 'highshelf'
    this.eqHigh.frequency.value = 3000

    // delay
    this.delayNode = this.audioCtx.createDelay(5.0)
    this.delayNode.delayTime.value = 0.25
    this.delayFeedback = this.audioCtx.createGain()
    this.delayFeedback.gain.value = 0.3
    this.delayNode.connect(this.delayFeedback)
    this.delayFeedback.connect(this.delayNode)

    // bitcrusher (AudioWorklet)
    try {
      await this.audioCtx.audioWorklet.addModule(new URL('./effects/bitcrusher-processor.js', import.meta.url).href)
      this.bitcrusherNode = new AudioWorkletNode(this.audioCtx, 'bitcrusher-processor', {
        parameterData: { bits: 8, downsample: 1 }
      })
    } catch (e) {
      console.warn('AudioWorklet not available:', e)
    }

    // connect chain: osc -> bitcrusher -> delay -> eqs -> master
    let node: AudioNode = this.osc
    if (this.bitcrusherNode) {
      node.connect(this.bitcrusherNode)
      node = this.bitcrusherNode
    }
    node.connect(this.delayNode)
    this.delayNode.connect(this.eqLow!) // continue through EQ
    this.eqLow!.connect(this.eqMid!)
    this.eqMid!.connect(this.eqHigh!)
    this.eqHigh!.connect(this.master)

    // also route delay wet to master
    this.delayNode.connect(this.master)

    this.osc.start()
  }

  setOscFreq(v: number) {
    if (!this.osc) return
    this.osc.frequency.setValueAtTime(v, this.audioCtx!.currentTime)
  }

  setBitcrusher(bits: number, downsample: number) {
    if (!this.bitcrusherNode) return
    const bitsParam = this.bitcrusherNode.parameters.get('bits')!
    const downParam = this.bitcrusherNode.parameters.get('downsample')!
    bitsParam.setValueAtTime(bits, this.audioCtx!.currentTime)
    downParam.setValueAtTime(downsample, this.audioCtx!.currentTime)
  }

  setDelay(time: number, feedback: number) {
    if (!this.delayNode || !this.delayFeedback) return
    this.delayNode.delayTime.setValueAtTime(time, this.audioCtx!.currentTime)
    this.delayFeedback.gain.setValueAtTime(feedback, this.audioCtx!.currentTime)
  }

  setEQ(low: number, mid: number, high: number) {
    if (!this.eqLow || !this.eqMid || !this.eqHigh) return
    this.eqLow.gain.setValueAtTime(low, this.audioCtx!.currentTime)
    this.eqMid.gain.setValueAtTime(mid, this.audioCtx!.currentTime)
    this.eqHigh.gain.setValueAtTime(high, this.audioCtx!.currentTime)
  }

  stopAll() {
    if (!this.audioCtx) return
    this.osc?.stop()
    this.audioCtx.close()
    this.audioCtx = null
  }

  dispose() {
    if (this.audioCtx) {
      this.stopAll()
    }
  }
}
