import {Component, ContentChildren, EventEmitter, Input, OnChanges, Output, QueryList, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TemplateDirective} from "../template/template.directive";

@Component({
  selector: 'd-list',
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnChanges {
  @Input() items!: any[];

  @Output() onItemClick = new EventEmitter<any>();

  itemTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.itemTemplate = value.find(x => x.includesName('item', true))?.template;
  }
}
