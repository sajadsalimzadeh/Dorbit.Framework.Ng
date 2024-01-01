import {Component, Input} from '@angular/core';
import {AbstractComponent} from "../abstract.component";

@Component({
  selector: 'd-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends AbstractComponent {

  @Input() items: string[] = [];
}
