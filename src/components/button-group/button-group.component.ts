import {Component} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-button-group',
    templateUrl: 'button-group.component.html',
    styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent extends AbstractComponent {

}
