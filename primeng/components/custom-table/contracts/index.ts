import {TemplateRef} from "@angular/core";

export interface CustomTableColumn<T = any> {
    header: string;
    field?: string;
    class?: string;
    width?: string;
    isHide?: boolean;
    headerClass?: string;
    template?: TemplateRef<any>;
    templateName?: string;
    render?: (item: T) => any;
    classFunc?: (item: T) => string;
}
