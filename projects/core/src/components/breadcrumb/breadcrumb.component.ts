import {Component, Input} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule],
    selector: 'd-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent extends AbstractComponent {

  @Input() items: string[] = [];
}
