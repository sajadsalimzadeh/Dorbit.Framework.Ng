import {Colors} from "../../../types";

export interface ConfirmButton {
  text: string;
  color?: Colors;
  loading?: boolean;
  action: (btn: ConfirmButton) => void
}

export interface ConfirmOptions {
  title?: string;
  message?: string;
  buttons: ConfirmButton[]
}

export interface PromptOptions {
  title: string;
  message?: string;
  value?: string;
}
