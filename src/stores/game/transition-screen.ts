import { makeAutoObservable } from 'mobx'

import { delay } from 'lib/async'

export class TransitionScreen<Duration extends number | null> {
  appearanceMs: number
  disappearanceMs: number
  durationMs: Duration
  background: string

  constructor(config: {
    appearanceMs: number
    disappearanceMs: number
    durationMs: Duration
    background: string
  }) {
    this.appearanceMs = config.appearanceMs
    this.disappearanceMs = config.disappearanceMs
    this.durationMs = config.durationMs
    this.background = config.background

    makeAutoObservable(this)
  }

  isOpened = false
  open = (): Promise<void> => {
    this.isOpened = true
    return delay(this.appearanceMs)
  }
  close = async (): Promise<void> => {
    await delay(this.disappearanceMs)
    this.isOpened = false
  }
}
