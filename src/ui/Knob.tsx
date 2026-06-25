import React from 'react'

type KnobProps = {
  label: string
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (v: number) => void
}

export default function Knob({ label, min = 0, max = 1, step = 0.01, value, onChange }: KnobProps) {
  return (
    <div className="knob">
      <label>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="knob-value">{value}</div>
    </div>
  )
}
