import {TemplateRef} from "@angular/core";
import { QueryResult } from "@framework/contracts";
import { GroupOperationItem } from "@primeng/components/group-operation-result/index.component";

export interface CustomTableColumn<T = any> {
    field?: string;
    width?: string;
    isHide?: boolean;
    
    header: string;
    headerClass?: string;
    headerTemplate?: TemplateRef<any>;
    headerTemplateName?: string;
    headerRender?: (items: T[]) => any;
    
    template?: TemplateRef<any>;
    templateName?: string;
    class?: string;
    classFunc?: (item: T) => string;
    render?: (item: T) => any;

    footer?: string;
    footerClass?: string;
    footerTemplate?: TemplateRef<any>;
    footerTemplateName?: string;
    footerRender?: (items: T[]) => any;
}


export interface CustomTableGroupOperation<T = any> {
    label: string;
    icon: string;
    action?: () => void;
    command?: (item: GroupOperationItem) => Promise<QueryResult>;
}