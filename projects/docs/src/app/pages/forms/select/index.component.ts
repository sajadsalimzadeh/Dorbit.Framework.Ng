import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'doc-select',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  text = 'text string';
  formControl = new FormControl('option 1');
  formControlMultiple = new FormControl<any[]>([]);
  items = ['option 1','option 2','option 3','option 4','option 5'];
  items2 = ['option 1','option 2','option 3','option 4','option 5'];
}
