export type Colors =
  'primary-tint' | 'primary' | 'primary-shade' |
  'secondary-tint' | 'secondary' | 'secondary-shade' |
  'warning-tint' | 'warning' | 'warning-shade' |
  'success-tint' | 'success' | 'success-shade' |
  'danger-tint' | 'danger' | 'danger-shade' |
  'link-tint' | 'link' | 'link-shade';
export type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Positions = PositionsCross | PositionsCorner | 'middle-center';
export type PositionsCross = 'middle-start' | 'middle-end' | 'top-center' | 'bottom-center';
export type PositionsCorner = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
