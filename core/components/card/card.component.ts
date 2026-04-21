import {Component, ContentChildren, OnChanges, QueryList, TemplateRef} from '@angular/core';
import {TemplateDirective} from "../../directives/template.directive";
import {AbstractComponent} from "../abstract.component";


@Component({
    standalone: true,
    imports: [],
    selector: 'd-card',
    templateUrl: 'card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent extends AbstractComponent implements OnChanges {

    titleTemplate?: TemplateRef<any>;
    toolbarTemplate?: TemplateRef<any>;

    @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
        this.titleTemplate = value.find(x => x.includesName('title'))?.template;
        this.toolbarTemplate = value.find(x => x.includesName('toolbar'))?.template;
    }
}
