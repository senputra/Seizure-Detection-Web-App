import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Logger {
  constructor(@Inject(String) private header: string) {}

  // tslint:disable-next-line: no-any
  get log(): (...args: any[]) => void {
    return console.log.bind(console, this.header);
  }

  // tslint:disable-next-line: no-any
  get warn(): (...args: any[]) => void {
    return console.warn.bind(console, this.header);
  }

  // tslint:disable-next-line: no-any
  get error(): (...args: any[]) => void {
    return console.error.bind(console, this.header);
  }
}

export const loggerFactory = (header: string) => {
  return new Logger(header);
};

// Must implement useFactory dependency injector.
