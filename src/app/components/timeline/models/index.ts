import {TemplateRef} from "@angular/core";

export class TimelineConfig {
  direction: TimelineDirection = 'vertical';
}

export type TimelineDirection = 'vertical' | 'horizontal';
