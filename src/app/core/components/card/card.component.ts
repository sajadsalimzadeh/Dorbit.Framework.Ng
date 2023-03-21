import {Component, ContentChildren, OnChanges, QueryList, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";

@Component({
  selector: 'dev-card',
  templateUrl: 'card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends BaseComponent implements OnChanges {

  titleTemplate?: TemplateRef<any>;
  toolbarTemplate?: TemplateRef<any>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    this.titleTemplate = value.find(x => x.name == 'title')?.template;
    this.toolbarTemplate = value.find(x => x.name == 'toolbar')?.template;
  }
}
