import {Component} from "@angular/core";
import {OverlayService} from "../overlay/overlay.service";
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
