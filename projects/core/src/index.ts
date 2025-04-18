import {Routes} from "@angular/router";

export * from './components';
export * from './interceptors';
export * from './directives';
export * from './pipes';
export * from './contracts';
export * from './repositories';
export * from './services';
export * from './stores';
export * from './utils';
export * from './types';

export * from './dorbit.module';
export * from './dorbit.config';

export function dorbitRoutes() {
  return [
  ] as Routes;
}
