
export class TimelineConfig {
  direction: TimelineDirection = 'vertical';
  align: TimelineAlign = 'alternate';
}

export type TimelineDirection = 'vertical' | 'horizontal';
export type TimelineAlign = 'start' | 'end' | 'alternate';
