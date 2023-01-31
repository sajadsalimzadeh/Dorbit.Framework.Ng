import {Component} from "@angular/core";
import {DomService} from "../../services/dom.service";

@Component({
  selector: 'dev-date-range-picker',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class DateRangePickerComponent {

  constructor(private domService: DomService) {
  }

  focus(e: FocusEvent) {
  }

  blur(e: FocusEvent) {

  }
}
