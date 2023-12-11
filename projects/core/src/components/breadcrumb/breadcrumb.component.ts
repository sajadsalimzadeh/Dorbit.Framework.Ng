import {Component, ContentChildren, Input, OnChanges, QueryList, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'd-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends BaseComponent {

  @Input() items: string[] = [];
}
