import {InjectionToken} from "@angular/core";

export type Colors =
    'primary-tint'
    | 'primary'
    | 'primary-shade'
    |
    'secondary-tint'
    | 'secondary'
    | 'secondary-shade'
    |
    'warning-tint'
    | 'warning'
    | 'warning-shade'
    |
    'success-tint'
    | 'success'
    | 'success-shade'
    |
    'danger-tint'
    | 'danger'
    | 'danger-shade'
    |
    'link-tint'
    | 'link'
    | 'link-shade'
    |
    'gray-1'
    | 'gray-2'
    | 'gray-3'
    | 'gray-4'
    | 'gray-5'
    | 'gray-6'
    | 'gray-7'
    | 'gray-8'
    | 'gray-9'
    | 'gray-10'
    |
    'gray--1'
    | 'gray--2'
    | 'gray--3'
    | 'gray--4'
    | 'gray--5'
    | 'gray--6'
    | 'gray--7'
    | 'gray--8'
    | 'gray--9'
    | 'gray--10'
    |
    string;
export type Sizes = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type Positions = PositionsCross | PositionsCorner | 'middle-center';
export type PositionsCross = 'middle-start' | 'middle-end' | 'top-center' | 'bottom-center';
export type PositionsCorner = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type Orientation = 'vertical' | 'horizontal';
export type Themes = 'default-light' | 'default-dark';
export type Direction = '' | 'rtl' | 'ltr';

export const APP_VERSION = new InjectionToken<() => string>('APP_VERSION');
