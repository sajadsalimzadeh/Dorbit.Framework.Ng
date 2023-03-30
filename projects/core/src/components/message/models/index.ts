import {Colors, Sizes} from "../../../types";

export interface Message {
  scope?: string;
  color?: Colors;
  size?: Sizes;
  title?: string;
  body?: string;
  icon?: string;
  delay?: number;
  duration?: number;
  removable?: boolean;
  showTimer?: boolean;
  timerInterval?: number;
  show?: boolean;
}
