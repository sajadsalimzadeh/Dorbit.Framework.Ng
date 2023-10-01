import {Colors, Sizes} from "../../../types";

export interface Message {
  container?: string;
  color?: Colors;
  size?: Sizes;
  title?: string;
  body?: string;
  icon?: string;
  delay?: number;
  duration?: number;
  removable?: boolean;
  showTimer?: boolean;
  showTimeString?: boolean;
  timerInterval?: number;
  progress?: number;
}
