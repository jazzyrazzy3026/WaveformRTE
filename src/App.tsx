import React, { useEffect, useState } from 'react'
import AudioEngine from './audio/engine'
import EffectPanel from './ui/EffectPanel'

export default function App() {
  const [engine] = useState(() => new AudioEngine())
  const [running, setRunning] = useState(false)

  useEffect(() => {
    return () => engine.dispose()
  }, [engine])

  async function start() {
    await engine.init()
    setRunning(true)
  }

  function stop() {
    engine.stopAll()
    setRunning(false)
  }

  return (
    <div className="app">
      <header>
        <h1>WaveformRTE</h1>
        <p>Effects-first web synth (built from scratch)</p>
        <div className="controls">
          {!running ? (
            <button onClick={start}>Start Audio</button>
          ) : (
            <button onClick={stop}>Stop</button>
          )}
        </div>
      </header>

      <main>
        <section className="panels">
          <EffectPanel engine={engine} />
        </section>
      </main>

      <footer>
        <small>WaveformRTE — initial scaffold</small>
      </footer>
    </div>
  )
}
