export function triggerADSREnvelope(gainNode: GainNode, now: number, attack: number, decay: number, sustain: number) {
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.linearRampToValueAtTime(1.0, now + attack)
  gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay)
}

export function releaseEnvelope(gainNode: GainNode, now: number, release: number) {
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(gainNode.gain.value, now)
  gainNode.gain.linearRampToValueAtTime(0.0001, now + release)
}
