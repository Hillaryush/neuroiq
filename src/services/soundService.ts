class SoundService {
  private ctx: AudioContext | null = null
  private enabled = true

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  setEnabled(val: boolean) { this.enabled = val }
  isEnabled() { return this.enabled }

  tone(freq: number, type: OscillatorType = 'sine', duration = 0.15, vol = 0.18, startDelay = 0) {
    if (!this.enabled) return
    try {
      const ctx  = this.getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay)
      gain.gain.setValueAtTime(0, ctx.currentTime + startDelay)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startDelay + 0.01)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startDelay + duration - 0.05)
      osc.start(ctx.currentTime + startDelay)
      osc.stop(ctx.currentTime + startDelay + duration)
    } catch {}
  }

  private noise(duration = 0.08, vol = 0.08) {
    if (!this.enabled) return
    try {
      const ctx    = this.getCtx()
      const buf    = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
      const data   = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      const src  = ctx.createBufferSource()
      const gain = ctx.createGain()
      const filt = ctx.createBiquadFilter()
      src.buffer = buf; filt.type = 'bandpass'; filt.frequency.value = 1200
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination)
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)
      src.start(); src.stop(ctx.currentTime + duration)
    } catch {}
  }

  // UI
  click()     { this.tone(880, 'sine', 0.07, 0.09) }
  hover()     { this.tone(1100,'sine', 0.04, 0.04) }
  tabSwitch() { this.tone(660, 'sine', 0.10, 0.08) }

  // Correct / Wrong
  correct() {
    this.tone(523,'sine',0.10,0.16,0.00)
    this.tone(659,'sine',0.10,0.16,0.09)
    this.tone(784,'sine',0.16,0.18,0.18)
  }
  wrong() {
    this.tone(280,'sawtooth',0.08,0.13,0.00)
    this.tone(200,'sawtooth',0.12,0.13,0.07)
    this.noise(0.06,0.06)
  }

  // Memory
  cardFlip()  { this.tone(1200,'sine',0.07,0.09) }
  cardMatch() { this.tone(880,'sine',0.09,0.14,0.00); this.tone(1109,'sine',0.14,0.14,0.07) }
  cardMiss()  { this.tone(330,'sine',0.11,0.09) }

  // Sequence / Color
  seqLight(i: number) { const f=[523,587,659,698,784,880]; this.tone(f[i%6],'sine',0.18,0.22) }
  seqPress(i: number) { const f=[523,587,659,698,784,880]; this.tone(f[i%6],'triangle',0.11,0.18) }
  seqSuccess() { [0,1,2,3].forEach(i=>this.tone(523*(1+i*.12),'sine',0.09,0.14,i*.08)) }
  seqFail()    { this.wrong() }

  // Math
  mathCorrect() { this.tone(880,'square',0.07,0.09); this.tone(1046,'square',0.09,0.09,0.06) }
  mathWrong()   { this.tone(200,'sawtooth',0.14,0.11) }
  comboUp()     { [440,550,660].forEach((f,i)=>this.tone(f,'sine',0.07,0.11,i*.05)) }

  // Stroop
  stroopCorrect() { this.tone(1046,'sine',0.11,0.15) }
  stroopWrong()   { this.tone(180,'square',0.14,0.11) }

  // Pattern / Logic
  patternSolve() { this.correct() }
  logicSolve()   { [440,550,660,880].forEach((f,i)=>this.tone(f,'sine',0.09,0.14,i*.07)) }

  // Word
  wordAccepted() { this.tone(880,'sine',0.09,0.13); this.tone(1109,'sine',0.09,0.13,0.08) }
  wordRejected() { this.tone(250,'sawtooth',0.11,0.11) }

  // Number recall
  numberShow()  { this.tone(660,'sine',0.09,0.13) }
  numberHide()  { this.tone(440,'sine',0.09,0.09) }
  numberRight() { this.correct() }
  numberWrong() { this.wrong() }

  // Debug / Algo
  bugFound()    { this.logicSolve() }
  stepMoved()   { this.tone(660,'sine',0.05,0.07) }
  algoCorrect() { [0,1,2,3,4].forEach(i=>this.tone(392*(1+i*.15),'sine',0.08,0.14,i*.06)) }

  // Focus
  targetHit()  { this.tone(1046,'sine',0.07,0.14) }
  targetMiss() { this.noise(0.05,0.07) }

  // Game events
  gameStart() {
    this.tone(330,'sine',0.09,0.13,0.00)
    this.tone(440,'sine',0.09,0.13,0.09)
    this.tone(550,'sine',0.13,0.16,0.18)
  }
  gameOver() {
    this.tone(440,'sine',0.18,0.16,0.00)
    this.tone(330,'sine',0.18,0.16,0.16)
    this.tone(220,'sine',0.28,0.16,0.32)
  }
  levelUp() { [523,659,784,1047].forEach((f,i)=>this.tone(f,'sine',0.12,0.18,i*.09)) }
  achievement() { [523,659,784,1047,784,1047,1319].forEach((f,i)=>this.tone(f,'sine',0.11,0.17,i*.07)) }
  streak()  { [784,988,1175].forEach((f,i)=>this.tone(f,'sine',0.10,0.15,i*.08)) }
}

export const sound = new SoundService()
