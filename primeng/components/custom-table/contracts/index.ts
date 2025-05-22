import {TemplateRef} from "@angular/core";

export interface CustomTableColumn<T = any> {
  header: string;
  field?: string;
  width?: string;
  isHide?: boolean;
  template?: TemplateRef<any>;
  templateName?: string;
  render?: (item: T) => any;
}
