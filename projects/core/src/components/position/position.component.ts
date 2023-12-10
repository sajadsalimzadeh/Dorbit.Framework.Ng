import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Positions} from "../../types";

@Component({
  selector: 'd-position',
  templateUrl: 'position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends BaseComponent implements OnInit, OnChanges {

  @Input({required: true}) position!: Positions;
  @Input() dock: boolean = false;

  override render() {
    super.render();

    this.setClass('dock', this.dock);
    this.setClass(this.position, true);
  }
}
