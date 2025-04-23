import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";
import moment from "jalali-moment";


@Component({
    selector: 'doc-date-picker',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    gregorianFormControl = new FormControl(moment());
    jalaliFormControl = new FormControl('');

}
