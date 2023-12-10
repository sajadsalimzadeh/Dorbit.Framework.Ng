import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Positions} from "../../types";

@Component({
  selector: 'd-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() position: Positions = 'bottom-start';
}
