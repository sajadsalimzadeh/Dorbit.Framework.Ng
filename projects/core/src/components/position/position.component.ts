import {Component, HostBinding, Input, OnChanges, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Positions} from "../../types";

@Component({
  selector: 'd-position',
  templateUrl: 'position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends BaseComponent implements OnInit, OnChanges {

  @HostBinding('class')
  @Input({required: true}) position!: Positions;
}
