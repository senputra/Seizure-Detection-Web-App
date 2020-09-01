import { Injectable, Inject } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class Logger {
  private production = false;
  constructor(@Inject(String) private header: string) {
    this.production = environment.production;
    if (this.production) {
      console.log(
        'Hello there! The app is running in production mode. There will be no console log except for errors.',
      );
    } else {
      console.log('Console log is online! Develop your way!');
    }
  }

  // tslint:disable-next-line: no-any
  get log(): (...args: any[]) => void {
    if (this.production) {
      return () => {};
    }
    return console.log.bind(console, this.header);
  }

  // tslint:disable-next-line: no-any
  get warn(): (...args: any[]) => void {
    if (this.production) {
      return () => {};
    }
    return console.warn.bind(console, this.header);
  }

  // tslint:disable-next-line: no-any
  get error(): (...args: any[]) => void {
    if (this.production) {
      return () => {};
    }
    return console.error.bind(console, this.header);
  }
}

export const loggerFactory = (header: string) => {
  return new Logger(header);
};

// Must implement useFactory dependency injector.
