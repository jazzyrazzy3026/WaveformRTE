class BitcrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 8, minValue: 1, maxValue: 16, automationRate: 'k-rate' },
      { name: 'downsample', defaultValue: 1, minValue: 1, maxValue: 20, automationRate: 'k-rate' }
    ];
  }

  constructor() {
    super();
    this._ph = 0;
    this._last = 0;
  }

  process(inputs, outputs, params) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || input.length === 0) return true;

    const bits = params.bits.length ? params.bits[0] : 8;
    const downsample = params.downsample.length ? params.downsample[0] : 1;
    const step = Math.pow(0.5, bits);
    const hold = Math.max(1, Math.floor(downsample));

    for (let ch = 0; ch < input.length; ch++) {
      const inC = input[ch];
      const outC = output[ch];
      for (let i = 0; i < inC.length; i++) {
        if ((this._ph % hold) === 0) {
          this._last = Math.round(inC[i] / step) * step;
        }
        outC[i] = this._last;
        this._ph++;
      }
    }

    return true;
  }
}

registerProcessor('bitcrusher-processor', BitcrusherProcessor);
