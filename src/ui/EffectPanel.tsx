import React, { useEffect, useState } from 'react'
import Knob from './Knob'
import AudioEngine from '../audio/engine'

export default function EffectPanel({ engine }: { engine: AudioEngine }) {
  const [freq, setFreq] = useState(220)
  const [bits, setBits] = useState(8)
  const [down, setDown] = useState(1)
  const [delayTime, setDelayTime] = useState(0.25)
  const [delayFb, setDelayFb] = useState(0.3)
  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)

  useEffect(() => {
    engine.setOscFreq(freq)
  }, [freq, engine])

  useEffect(() => {
    engine.setBitcrusher(bits, down)
  }, [bits, down, engine])

  useEffect(() => {
    engine.setDelay(delayTime, delayFb)
  }, [delayTime, delayFb, engine])

  useEffect(() => {
    engine.setEQ(low, mid, high)
  }, [low, mid, high, engine])

  return (
    <div className="effect-panel">
      <h2>Effects</h2>
      <div className="row">
        <Knob label="Freq" min={20} max={2000} step={1} value={freq} onChange={setFreq} />
        <Knob label="Bits" min={1} max={16} step={1} value={bits} onChange={setBits} />
        <Knob label="Downsample" min={1} max={20} step={1} value={down} onChange={setDown} />
      </div>

      <h3>Delay</h3>
      <div className="row">
        <Knob label="Time" min={0} max={5} step={0.01} value={delayTime} onChange={setDelayTime} />
        <Knob label="Feedback" min={0} max={0.95} step={0.01} value={delayFb} onChange={setDelayFb} />
      </div>

      <h3>EQ</h3>
      <div className="row">
        <Knob label="Low" min={-12} max={12} step={0.1} value={low} onChange={setLow} />
        <Knob label="Mid" min={-12} max={12} step={0.1} value={mid} onChange={setMid} />
        <Knob label="High" min={-12} max={12} step={0.1} value={high} onChange={setHigh} />
      </div>
    </div>
  )
}
