import {Component} from "@angular/core";
import { FormControl } from "@angular/forms";


@Component({
  selector: 'doc-date-picker',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  gregorianFormControl = new FormControl('');
  jalaliFormControl = new FormControl('');

}
