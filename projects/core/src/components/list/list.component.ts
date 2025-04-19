import {Component, ContentChildren, EventEmitter, Input, OnChanges, Output, QueryList, TemplateRef} from '@angular/core';
import {TemplateDirective} from "../../directives/template/template.directive";
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-list',
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent extends AbstractComponent implements OnChanges {
  @Input() items!: any[];

  @Output() onItemClick = new EventEmitter<any>();

  itemTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.itemTemplate = value.find(x => x.includesName('item', true))?.template;
  }
}
