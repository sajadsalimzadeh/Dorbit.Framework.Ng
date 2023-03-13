import {Component, OnChanges} from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'dev-card',
  templateUrl: 'card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent extends BaseComponent implements OnChanges {

}
