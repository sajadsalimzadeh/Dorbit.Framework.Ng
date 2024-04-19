import {Colors} from "../../../types";

export interface ConfirmButton {
  text: string;
  color?: Colors;
  loading?: boolean;
  action: (btn: ConfirmButton) => void
}

export interface ConfirmOptions {
  message: string;
  buttons: ConfirmButton[]
}

export interface PromptOptions {
  message: string;
  value?: string;
}
