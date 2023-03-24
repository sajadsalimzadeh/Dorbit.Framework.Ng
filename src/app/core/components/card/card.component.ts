import {Component, ContentChildren, OnChanges, QueryList, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TemplateDirective} from "../../directives/template/template.directive";

@Component({
  selector: 'd-card',
  templateUrl: 'card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends BaseComponent implements OnChanges {

  titleTemplate?: TemplateRef<any>;
  toolbarTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.titleTemplate = value.find(x => x.name == 'title')?.template;
    this.toolbarTemplate = value.find(x => x.name == 'toolbar')?.template;
  }
}
