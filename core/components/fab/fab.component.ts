import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Positions} from "../../types";
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";
import {PositionComponent} from "../position/position.component";

@Component({
    standalone: true,
    imports: [CommonModule, PositionComponent],
    selector: 'd-fab',
    templateUrl: 'fab.component.html',
    styleUrls: ['./fab.component.scss']
})
export class FabComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() position: Positions = 'bottom-start';
}
