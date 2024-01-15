import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'doc-chips',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  text = 'text string';
  formControl = new FormControl('');
  items = [
    'option 1',
    'option 2',
    'option 3',
    'option 4',
    'option 5',
  ]
}
