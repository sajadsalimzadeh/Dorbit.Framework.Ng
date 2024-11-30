import {Colors} from "../../../types";
import {DialogRef} from "../services/dialog.service";

export interface ConfirmButton {
  text: string;
  color?: Colors;
  loading?: boolean;
  action: (btn: ConfirmButton, dialog: DialogRef) => void
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
