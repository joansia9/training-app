import { Injectable, signal } from '@angular/core';
import type { FeatureFlags } from '../../../features';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private _ready: Promise<Partial<FeatureFlags>>;

  readonly flags = signal<Partial<FeatureFlags>>({});

  constructor() {
    this._ready = this.requestFlags();
  }

  ready(): Promise<Partial<FeatureFlags>> {
    return this._ready;
  }

  private async requestFlags(): Promise<Partial<FeatureFlags>> {
    try {
      const res = await fetch('/sys/features');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.flags.set(await res.json());
    } catch {
      this.flags.set({});
    }
    return this.flags();
  }
}
