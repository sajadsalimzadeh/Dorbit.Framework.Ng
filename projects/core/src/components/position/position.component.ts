import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Positions} from "../../types";
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-position',
    templateUrl: 'position.component.html',
    styleUrls: ['./position.component.scss'],
})
export class PositionComponent extends AbstractComponent implements OnInit, OnChanges {

  @Input({required: true}) position!: Positions;
  @Input() dock: boolean = false;

  override render() {
    super.render();

    this.setClass('dock', this.dock);
    this.setClass(this.position, true);
  }
}
