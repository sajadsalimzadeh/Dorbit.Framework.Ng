import {TemplateRef} from "@angular/core";

export interface CustomTableColumn<T = any> {
    field?: string;
    width?: string;
    isHide?: boolean;
    
    header: string;
    headerClass?: string;
    headerTemplate?: TemplateRef<any>;
    headerTemplateName?: string;
    headerRender?: () => any;
    
    template?: TemplateRef<any>;
    templateName?: string;
    class?: string;
    classFunc?: (item: T) => string;
    render?: (item: T) => any;

    footer?: string;
    footerClass?: string;
    footerTemplate?: TemplateRef<any>;
    footerTemplateName?: string;
    footerRender?: () => any;
}
