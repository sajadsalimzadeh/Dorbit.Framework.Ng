import {Routes} from "@angular/router";

export * from './components/_public';
export * from './interceptors/_public';
export * from './directives/_public';
export * from './pipes/_public';
export * from './contracts/_public';
export * from './repositories/_public';
export * from './services/_public';
export * from './stores';
export * from './utils/_public';
export * from './types';

export * from './framework';

export function dorbitRoutes() {
    return [] as Routes;
}
